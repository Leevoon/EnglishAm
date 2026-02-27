const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortField = req.query.sortField || 'id';
  const sortOrder = req.query.sortOrder || 'ASC';
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  return { page, perPage, sortField, sortOrder, filter };
};

// GET - List all test categories
router.get('/', async (req, res) => {
  try {
    const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
    const offset = (page - 1) * perPage;

    let whereClause = '';
    const replacements = {};

    if (filter.q) {
      whereClause = 'WHERE tcl.name LIKE :search';
      replacements.search = `%${filter.q}%`;
    }

    if (filter.ids) {
      const ids = JSON.parse(filter.ids);
      whereClause = whereClause ? `${whereClause} AND tc.id IN (:ids)` : 'WHERE tc.id IN (:ids)';
      replacements.ids = ids;
    }

    const [countResult] = await sequelize.query(`
      SELECT COUNT(DISTINCT tc.id) as total 
      FROM test_category tc
      LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = 1
      ${whereClause}
    `, { replacements, type: QueryTypes.SELECT });

    const data = await sequelize.query(`
      SELECT tc.*, tcl.name, tcl.description
      FROM test_category tc
      LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = 1
      ${whereClause}
      ORDER BY ${sortField === 'name' ? 'tcl.name' : `tc.${sortField}`} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { ...replacements, limit: perPage, offset },
      type: QueryTypes.SELECT
    });

    res.json({ data, total: countResult.total });
  } catch (error) {
    console.error('Error fetching test categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Get single test category
router.get('/:id', async (req, res) => {
  try {
    const [category] = await sequelize.query(`
      SELECT tc.*, tcl.name, tcl.description
      FROM test_category tc
      LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = 1
      WHERE tc.id = :id
    `, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT
    });

    if (!category) {
      return res.status(404).json({ message: 'Test category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching test category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Create test category
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { name, description, parent_id = 0, category_id = 0, status = 1, sort_order = 0, image } = req.body;

    const [result] = await sequelize.query(`
      INSERT INTO test_category (parent_id, category_id, status, sort_order, image, created_date)
      VALUES (:parent_id, :category_id, :status, :sort_order, :image, NOW())
    `, {
      replacements: { parent_id, category_id, status, sort_order, image: image || null },
      type: QueryTypes.INSERT,
      transaction: t
    });

    const categoryId = result;

    await sequelize.query(`
      INSERT INTO test_category_label (test_category_id, language_id, name, description)
      VALUES (:test_category_id, 1, :name, :description)
    `, {
      replacements: { test_category_id: categoryId, name, description: description || '' },
      type: QueryTypes.INSERT,
      transaction: t
    });

    await t.commit();
    res.json({ id: categoryId, name, description, parent_id, category_id, status, sort_order });
  } catch (error) {
    await t.rollback();
    console.error('Error creating test category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update test category
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { name, description, parent_id, category_id, status, sort_order, image } = req.body;
    const id = req.params.id;

    await sequelize.query(`
      UPDATE test_category 
      SET parent_id = COALESCE(:parent_id, parent_id),
          category_id = COALESCE(:category_id, category_id),
          status = COALESCE(:status, status),
          sort_order = COALESCE(:sort_order, sort_order),
          image = COALESCE(:image, image)
      WHERE id = :id
    `, {
      replacements: { id, parent_id, category_id, status, sort_order, image },
      type: QueryTypes.UPDATE,
      transaction: t
    });

    const [existingLabel] = await sequelize.query(`
      SELECT id FROM test_category_label WHERE test_category_id = :id AND language_id = 1
    `, { replacements: { id }, type: QueryTypes.SELECT, transaction: t });

    if (existingLabel) {
      await sequelize.query(`
        UPDATE test_category_label 
        SET name = COALESCE(:name, name), description = COALESCE(:description, description)
        WHERE test_category_id = :id AND language_id = 1
      `, { replacements: { id, name, description }, type: QueryTypes.UPDATE, transaction: t });
    } else {
      await sequelize.query(`
        INSERT INTO test_category_label (test_category_id, language_id, name, description)
        VALUES (:id, 1, :name, :description)
      `, { replacements: { id, name: name || '', description: description || '' }, type: QueryTypes.INSERT, transaction: t });
    }

    await t.commit();
    res.json({ id, name, description, parent_id, category_id, status, sort_order });
  } catch (error) {
    await t.rollback();
    console.error('Error updating test category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Delete test category
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const id = req.params.id;

    await sequelize.query(`DELETE FROM test_category_label WHERE test_category_id = :id`, {
      replacements: { id }, type: QueryTypes.DELETE, transaction: t
    });

    await sequelize.query(`DELETE FROM test_category WHERE id = :id`, {
      replacements: { id }, type: QueryTypes.DELETE, transaction: t
    });

    await t.commit();
    res.json({ id });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting test category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

