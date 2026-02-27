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

// GET - List all admins
router.get('/', async (req, res) => {
  try {
    const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
    const offset = (page - 1) * perPage;

    let whereClause = '';
    const replacements = {};

    if (filter.q) {
      whereClause = 'WHERE a.email LIKE :search OR a.name LIKE :search';
      replacements.search = `%${filter.q}%`;
    }

    if (filter.ids) {
      const ids = JSON.parse(filter.ids);
      whereClause = whereClause ? `${whereClause} AND a.id IN (:ids)` : 'WHERE a.id IN (:ids)';
      replacements.ids = ids;
    }

    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as total FROM admins a ${whereClause}
    `, { replacements, type: QueryTypes.SELECT });

    const data = await sequelize.query(`
      SELECT a.id, a.email, a.name, a.status, a.created_date, a.avatar, a.group_id,
             ag.name as group_name
      FROM admins a
      LEFT JOIN admins_groups ag ON a.group_id = ag.id
      ${whereClause}
      ORDER BY a.${sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { ...replacements, limit: perPage, offset },
      type: QueryTypes.SELECT
    });

    res.json({ data, total: countResult.total });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Get admin groups for dropdown
router.get('/groups/list', async (req, res) => {
  try {
    const groups = await sequelize.query(`
      SELECT id, name FROM admins_groups ORDER BY name ASC
    `, { type: QueryTypes.SELECT });

    res.json(groups);
  } catch (error) {
    console.error('Error fetching admin groups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Get single admin
router.get('/:id', async (req, res) => {
  try {
    const [admin] = await sequelize.query(`
      SELECT a.id, a.email, a.name, a.status, a.created_date, a.avatar, a.group_id,
             ag.name as group_name
      FROM admins a
      LEFT JOIN admins_groups ag ON a.group_id = ag.id
      WHERE a.id = :id
    `, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Create admin
router.post('/', async (req, res) => {
  try {
    const { email, password, name, group_id, status = 1 } = req.body;

    // Check if email exists
    const [existing] = await sequelize.query(`
      SELECT id FROM admins WHERE email = :email
    `, { replacements: { email }, type: QueryTypes.SELECT });

    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = md5(password);

    const [result] = await sequelize.query(`
      INSERT INTO admins (email, password, name, group_id, status, created_date)
      VALUES (:email, :password, :name, :group_id, :status, NOW())
    `, {
      replacements: { 
        email, password: hashedPassword, name: name || '', 
        group_id: group_id || 1, status
      },
      type: QueryTypes.INSERT
    });

    res.json({ id: result, email, name, group_id, status });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update admin
router.put('/:id', async (req, res) => {
  try {
    const { email, password, name, group_id, status } = req.body;
    const id = req.params.id;

    let passwordUpdate = '';
    const replacements = { id, email, name, group_id, status };

    if (password) {
      passwordUpdate = ', password = :password';
      replacements.password = md5(password);
    }

    await sequelize.query(`
      UPDATE admins 
      SET email = COALESCE(:email, email),
          name = COALESCE(:name, name),
          group_id = COALESCE(:group_id, group_id),
          status = COALESCE(:status, status)
          ${passwordUpdate}
      WHERE id = :id
    `, {
      replacements,
      type: QueryTypes.UPDATE
    });

    res.json({ id, email, name, group_id, status });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Delete admin
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    await sequelize.query(`DELETE FROM admins WHERE id = :id`, {
      replacements: { id },
      type: QueryTypes.DELETE
    });

    res.json({ id });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

