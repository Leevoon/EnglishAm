const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortField = req.query.sortField || 'id';
  const sortOrder = req.query.sortOrder || 'ASC';
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
      whereClause = 'WHERE email LIKE :search OR name LIKE :search OR surname LIKE :search';
      replacements.search = `%${filter.q}%`;
    }

    if (filter.status !== undefined) {
      whereClause = whereClause 
        ? `${whereClause} AND status = :status`
        : 'WHERE status = :status';
      replacements.status = filter.status;
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
      SELECT id, email, name, surname, phone, status, created_date, avatar, membership_id
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
      SELECT id, email, name, surname, phone, status, created_date, avatar, membership_id
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
    const { email, password, name, surname, phone, status = 1, membership_id } = req.body;

    // Check if email exists
    const [existing] = await sequelize.query(`
      SELECT id FROM users WHERE email = :email
    `, { replacements: { email }, type: QueryTypes.SELECT });

    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = md5(password);

    const [result] = await sequelize.query(`
      INSERT INTO users (email, password, name, surname, phone, status, membership_id, created_date)
      VALUES (:email, :password, :name, :surname, :phone, :status, :membership_id, NOW())
    `, {
      replacements: { 
        email, password: hashedPassword, name: name || '', surname: surname || '',
        phone: phone || '', status, membership_id: membership_id || null
      },
      type: QueryTypes.INSERT
    });

    res.json({ id: result, email, name, surname, status });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update user
router.put('/:id', async (req, res) => {
  try {
    const { email, password, name, surname, phone, status, membership_id } = req.body;
    const id = req.params.id;

    let passwordUpdate = '';
    const replacements = { id, email, name, surname, phone, status, membership_id };

    if (password) {
      passwordUpdate = ', password = :password';
      replacements.password = md5(password);
    }

    await sequelize.query(`
      UPDATE users 
      SET email = COALESCE(:email, email),
          name = COALESCE(:name, name),
          surname = COALESCE(:surname, surname),
          phone = COALESCE(:phone, phone),
          status = COALESCE(:status, status),
          membership_id = COALESCE(:membership_id, membership_id)
          ${passwordUpdate}
      WHERE id = :id
    `, {
      replacements,
      type: QueryTypes.UPDATE
    });

    res.json({ id, email, name, surname, status });
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

