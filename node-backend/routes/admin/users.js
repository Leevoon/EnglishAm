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

    let whereClause = '';
    const replacements = {};

    if (filter.q) {
      whereClause = 'WHERE email LIKE :search OR first_name LIKE :search OR last_name LIKE :search OR user_name LIKE :search';
      replacements.search = `%${filter.q}%`;
    }

    if (filter.status !== undefined) {
      const block = filter.status === 1 ? 0 : 1;
      whereClause = whereClause
        ? `${whereClause} AND block = :block`
        : 'WHERE block = :block';
      replacements.block = block;
    }

    if (filter.ids) {
      const ids = JSON.parse(filter.ids);
      whereClause = whereClause ? `${whereClause} AND id IN (:ids)` : 'WHERE id IN (:ids)';
      replacements.ids = ids;
    }

    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as total FROM users ${whereClause}
    `, { replacements, type: QueryTypes.SELECT });

    const data = await sequelize.query(`
      SELECT id, email, user_name, first_name, last_name, block, created_date, avatar,
             CASE WHEN block = 0 THEN 1 ELSE 0 END as status
      FROM users
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
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
      SELECT id, email, user_name, first_name, last_name, block, created_date, avatar, gender, dob,
             CASE WHEN block = 0 THEN 1 ELSE 0 END as status
      FROM users WHERE id = :id
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
    const { email, password, user_name, first_name, last_name, status } = req.body;
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

    res.json({ id, email, user_name, first_name, last_name, status });
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
