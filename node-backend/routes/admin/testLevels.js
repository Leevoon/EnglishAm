const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'name', 'status', 'sort_order', 'created_date'];
const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
  const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'id';
  const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  return { page, perPage, sortField, sortOrder, filter };
};

// GET - List all test levels
router.get('/', async (req, res) => {
  try {
    const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
    const offset = (page - 1) * perPage;

    let whereClause = '';
    const replacements = {};

    if (filter.q) {
      whereClause = 'WHERE tll.name LIKE :search';
      replacements.search = `%${filter.q}%`;
    }

    if (filter.ids) {
      const ids = JSON.parse(filter.ids);
      whereClause = whereClause ? `${whereClause} AND tl.id IN (:ids)` : 'WHERE tl.id IN (:ids)';
      replacements.ids = ids;
    }

    const [countResult] = await sequelize.query(`
      SELECT COUNT(DISTINCT tl.id) as total 
      FROM test_level tl
      LEFT JOIN test_level_label tll ON tl.id = tll.test_level_id AND tll.language_id = 1
      ${whereClause}
    `, { replacements, type: QueryTypes.SELECT });

    const data = await sequelize.query(`
      SELECT tl.*, tll.name
      FROM test_level tl
      LEFT JOIN test_level_label tll ON tl.id = tll.test_level_id AND tll.language_id = 1
      ${whereClause}
      ORDER BY tl.${sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { ...replacements, limit: perPage, offset },
      type: QueryTypes.SELECT
    });

    res.json({ data, total: countResult.total });
  } catch (error) {
    console.error('Error fetching test levels:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Get single test level
router.get('/:id', async (req, res) => {
  try {
    const [level] = await sequelize.query(`
      SELECT tl.*, tll.name
      FROM test_level tl
      LEFT JOIN test_level_label tll ON tl.id = tll.test_level_id AND tll.language_id = 1
      WHERE tl.id = :id
    `, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT
    });

    if (!level) {
      return res.status(404).json({ message: 'Test level not found' });
    }

    res.json(level);
  } catch (error) {
    console.error('Error fetching test level:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Create test level
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { name, status = 1, sort_order = 0 } = req.body;

    const [result] = await sequelize.query(`
      INSERT INTO test_level (status, sort_order, created_date)
      VALUES (:status, :sort_order, NOW())
    `, {
      replacements: { status, sort_order },
      type: QueryTypes.INSERT,
      transaction: t
    });

    const levelId = result;

    await sequelize.query(`
      INSERT INTO test_level_label (test_level_id, language_id, name)
      VALUES (:test_level_id, 1, :name)
    `, {
      replacements: { test_level_id: levelId, name },
      type: QueryTypes.INSERT,
      transaction: t
    });

    await t.commit();
    res.json({ id: levelId, name, status, sort_order });
  } catch (error) {
    await t.rollback();
    console.error('Error creating test level:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update test level
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { name, status, sort_order } = req.body;
    const id = req.params.id;

    await sequelize.query(`
      UPDATE test_level 
      SET status = COALESCE(:status, status),
          sort_order = COALESCE(:sort_order, sort_order)
      WHERE id = :id
    `, {
      replacements: { id, status, sort_order },
      type: QueryTypes.UPDATE,
      transaction: t
    });

    const [existingLabel] = await sequelize.query(`
      SELECT id FROM test_level_label WHERE test_level_id = :id AND language_id = 1
    `, { replacements: { id }, type: QueryTypes.SELECT, transaction: t });

    if (existingLabel) {
      await sequelize.query(`
        UPDATE test_level_label SET name = COALESCE(:name, name)
        WHERE test_level_id = :id AND language_id = 1
      `, { replacements: { id, name }, type: QueryTypes.UPDATE, transaction: t });
    } else {
      await sequelize.query(`
        INSERT INTO test_level_label (test_level_id, language_id, name)
        VALUES (:id, 1, :name)
      `, { replacements: { id, name: name || '' }, type: QueryTypes.INSERT, transaction: t });
    }

    await t.commit();
    res.json({ id, name, status, sort_order });
  } catch (error) {
    await t.rollback();
    console.error('Error updating test level:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Delete test level
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const id = req.params.id;

    await sequelize.query(`DELETE FROM test_level_label WHERE test_level_id = :id`, {
      replacements: { id }, type: QueryTypes.DELETE, transaction: t
    });

    await sequelize.query(`DELETE FROM test_level WHERE id = :id`, {
      replacements: { id }, type: QueryTypes.DELETE, transaction: t
    });

    await t.commit();
    res.json({ id });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting test level:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

