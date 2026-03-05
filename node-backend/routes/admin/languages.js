const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'name', 'code', 'status', 'sort_order', 'created_date'];
const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
  const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'id';
  const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  return { page, perPage, sortField, sortOrder, filter };
};

// GET - List all languages
router.get('/', async (req, res) => {
  try {
    const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
    const offset = (page - 1) * perPage;

    let whereClause = '';
    const replacements = {};

    if (filter.q) {
      whereClause = 'WHERE name LIKE :search OR iso LIKE :search';
      replacements.search = `%${filter.q}%`;
    }

    if (filter.ids) {
      const ids = JSON.parse(filter.ids);
      whereClause = whereClause ? `${whereClause} AND id IN (:ids)` : 'WHERE id IN (:ids)';
      replacements.ids = ids;
    }

    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as total FROM languages ${whereClause}
    `, { replacements, type: QueryTypes.SELECT });

    const data = await sequelize.query(`
      SELECT id, name, iso as code, status, sort_order, image, created_date FROM languages
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { ...replacements, limit: perPage, offset },
      type: QueryTypes.SELECT
    });

    res.json({ data, total: countResult.total });
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Get single language
router.get('/:id', async (req, res) => {
  try {
    const [language] = await sequelize.query(`
      SELECT id, name, iso as code, status, sort_order, image, created_date FROM languages WHERE id = :id
    `, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT
    });

    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    res.json(language);
  } catch (error) {
    console.error('Error fetching language:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Create language
router.post('/', async (req, res) => {
  try {
    const { name, code, status = 1, sort_order = 0, image } = req.body;

    const [result] = await sequelize.query(`
      INSERT INTO languages (name, iso, status, sort_order, image, created_date)
      VALUES (:name, :iso, :status, :sort_order, :image, NOW())
    `, {
      replacements: { name, iso: code, status, sort_order, image: image || null },
      type: QueryTypes.INSERT
    });

    res.json({ id: result, name, code, status, sort_order });
  } catch (error) {
    console.error('Error creating language:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update language
router.put('/:id', async (req, res) => {
  try {
    const { name, code, status, sort_order, image } = req.body;
    const id = req.params.id;

    await sequelize.query(`
      UPDATE languages
      SET name = COALESCE(:name, name),
          iso = COALESCE(:iso, iso),
          status = COALESCE(:status, status),
          sort_order = COALESCE(:sort_order, sort_order),
          image = COALESCE(:image, image)
      WHERE id = :id
    `, {
      replacements: { id, name, iso: code, status, sort_order, image },
      type: QueryTypes.UPDATE
    });

    res.json({ id, name, code, status, sort_order });
  } catch (error) {
    console.error('Error updating language:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Delete language
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    await sequelize.query(`DELETE FROM languages WHERE id = :id`, {
      replacements: { id },
      type: QueryTypes.DELETE
    });

    res.json({ id });
  } catch (error) {
    console.error('Error deleting language:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

