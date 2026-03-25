const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

const ALLOWED_SORT_FIELDS = ['id', 'email', 'first_name', 'last_name', 'block', 'created_date'];
const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
  const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'id';
  const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  return { page, perPage, sortField, sortOrder, filter };
};

// GET - List all users
router.get('/', async (req, res) => {
  try {
    const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
    const offset = (page - 1) * perPage;

    const replacements = {};
    const conditions = [];

    if (filter.q) {
      conditions.push('(u.email LIKE :search OR u.first_name LIKE :search OR u.last_name LIKE :search OR u.user_name LIKE :search)');
      replacements.search = `%${filter.q}%`;
    }

    if (filter.status !== undefined) {
      conditions.push('u.block = :block');
      replacements.block = filter.status === 1 ? 0 : 1;
    }

    if (filter.ids) {
      const ids = JSON.parse(filter.ids);
      conditions.push('u.id IN (:ids)');
      replacements.ids = ids;
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as total FROM users u ${whereClause}
    `, { replacements, type: QueryTypes.SELECT });

    const data = await sequelize.query(`
      SELECT u.id, u.email, u.user_name, u.first_name, u.last_name, u.block, u.created_date, u.avatar,
             CASE WHEN u.block = 0 THEN 1 ELSE 0 END as status,
             COALESCE(MAX(m.level), 0) as membership_level
      FROM users u
      LEFT JOIN user_has_membership uhm ON uhm.user_id = u.id
      LEFT JOIN membership m ON m.id = uhm.membership_id AND m.status = 1
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.${sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { ...replacements, limit: perPage, offset },
      type: QueryTypes.SELECT
    });

    res.json({ data, total: countResult.total });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Get single user
router.get('/:id', async (req, res) => {
  try {
    const [user] = await sequelize.query(`
      SELECT u.id, u.email, u.user_name, u.first_name, u.last_name, u.block, u.created_date, u.avatar, u.gender, u.dob,
             CASE WHEN u.block = 0 THEN 1 ELSE 0 END as status,
             COALESCE(MAX(m.level), 0) as membership_level,
             uhm.membership_id
      FROM users u
      LEFT JOIN user_has_membership uhm ON uhm.user_id = u.id
      LEFT JOIN membership m ON m.id = uhm.membership_id AND m.status = 1
      WHERE u.id = :id
      GROUP BY u.id, uhm.membership_id
    `, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Create user
router.post('/', async (req, res) => {
  try {
    const { email, password, user_name, first_name, last_name, status = 1 } = req.body;

    // Check if email exists
    const [existing] = await sequelize.query(`
      SELECT id FROM users WHERE email = :email
    `, { replacements: { email }, type: QueryTypes.SELECT });

    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = md5(password);
    const block = status === 1 ? 0 : 1;

    const [result] = await sequelize.query(`
      INSERT INTO users (email, password, user_name, first_name, last_name, block, created_date)
      VALUES (:email, :password, :user_name, :first_name, :last_name, :block, NOW())
    `, {
      replacements: {
        email, password: hashedPassword,
        user_name: user_name || email.split('@')[0],
        first_name: first_name || '', last_name: last_name || '',
        block
      },
      type: QueryTypes.INSERT
    });

    res.json({ id: result, email, user_name, first_name, last_name, status });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update user
router.put('/:id', async (req, res) => {
  try {
    const { email, password, user_name, first_name, last_name, status, membership_id } = req.body;
    const id = req.params.id;

    let passwordUpdate = '';
    const replacements = { id, email, user_name, first_name, last_name };

    if (status !== undefined) {
      replacements.block = status === 1 ? 0 : 1;
    } else {
      replacements.block = undefined;
    }

    if (password) {
      passwordUpdate = ', password = :password';
      replacements.password = md5(password);
    }

    await sequelize.query(`
      UPDATE users
      SET email = COALESCE(:email, email),
          user_name = COALESCE(:user_name, user_name),
          first_name = COALESCE(:first_name, first_name),
          last_name = COALESCE(:last_name, last_name),
          block = COALESCE(:block, block)
          ${passwordUpdate}
      WHERE id = :id
    `, {
      replacements,
      type: QueryTypes.UPDATE
    });

    // Update membership assignment
    if (membership_id !== undefined) {
      await sequelize.query(
        `DELETE FROM user_has_membership WHERE user_id = :id`,
        { replacements: { id }, type: QueryTypes.DELETE }
      );
      if (membership_id && parseInt(membership_id) > 0) {
        await sequelize.query(
          `INSERT INTO user_has_membership (user_id, membership_id) VALUES (:user_id, :membership_id)`,
          { replacements: { user_id: id, membership_id: parseInt(membership_id) }, type: QueryTypes.INSERT }
        );
      }
    }

    res.json({ id, email, user_name, first_name, last_name, status, membership_id });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    await sequelize.query(`DELETE FROM users WHERE id = :id`, {
      replacements: { id },
      type: QueryTypes.DELETE
    });

    res.json({ id });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
