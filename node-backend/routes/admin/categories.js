const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

// Helper to build pagination, sort, and filter
const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortField = req.query.sortField || 'id';
  const sortOrder = req.query.sortOrder || 'ASC';
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  
  return { page, perPage, sortField, sortOrder, filter };
};

// GET - List all categories with pagination
router.get('/', async (req, res) => {
  try {
    const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
    const offset = (page - 1) * perPage;

    let whereClause = '';
    const replacements = {};

    if (filter.q) {
      whereClause = 'WHERE cl.name LIKE :search OR c.id LIKE :search';
      replacements.search = `%${filter.q}%`;
    }

    if (filter.ids) {
      const ids = JSON.parse(filter.ids);
      whereClause = whereClause ? `${whereClause} AND c.id IN (:ids)` : 'WHERE c.id IN (:ids)';
      replacements.ids = ids;
    }

    // Get total count
    const [countResult] = await sequelize.query(`
      SELECT COUNT(DISTINCT c.id) as total 
      FROM category c
      LEFT JOIN category_label cl ON c.id = cl.category_id AND cl.language_id = 1
      ${whereClause}
    `, { replacements, type: QueryTypes.SELECT });

    // Get data
    const data = await sequelize.query(`
      SELECT c.*, cl.name, cl.description
      FROM category c
      LEFT JOIN category_label cl ON c.id = cl.category_id AND cl.language_id = 1
      ${whereClause}
      ORDER BY ${sortField === 'name' ? 'cl.name' : `c.${sortField}`} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { ...replacements, limit: perPage, offset },
      type: QueryTypes.SELECT
    });

    res.json({
      data,
      total: countResult.total
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Get single category
router.get('/:id', async (req, res) => {
  try {
    const [category] = await sequelize.query(`
      SELECT c.*, cl.name, cl.description
      FROM category c
      LEFT JOIN category_label cl ON c.id = cl.category_id AND cl.language_id = 1
      WHERE c.id = :id
    `, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Create category
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { name, description, parent_id = 0, status = 1, sort_order = 0 } = req.body;

    // Insert category
    const [result] = await sequelize.query(`
      INSERT INTO category (parent_id, status, sort_order, created_date)
      VALUES (:parent_id, :status, :sort_order, NOW())
    `, {
      replacements: { parent_id, status, sort_order },
      type: QueryTypes.INSERT,
      transaction: t
    });

    const categoryId = result;

    // Insert label
    await sequelize.query(`
      INSERT INTO category_label (category_id, language_id, name, description)
      VALUES (:category_id, 1, :name, :description)
    `, {
      replacements: { category_id: categoryId, name, description: description || '' },
      type: QueryTypes.INSERT,
      transaction: t
    });

    await t.commit();

    res.json({ id: categoryId, name, description, parent_id, status, sort_order });
  } catch (error) {
    await t.rollback();
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update category
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { name, description, parent_id, status, sort_order } = req.body;
    const id = req.params.id;

    // Update category
    await sequelize.query(`
      UPDATE category 
      SET parent_id = COALESCE(:parent_id, parent_id),
          status = COALESCE(:status, status),
          sort_order = COALESCE(:sort_order, sort_order)
      WHERE id = :id
    `, {
      replacements: { id, parent_id, status, sort_order },
      type: QueryTypes.UPDATE,
      transaction: t
    });

    // Update or insert label
    const [existingLabel] = await sequelize.query(`
      SELECT id FROM category_label WHERE category_id = :id AND language_id = 1
    `, {
      replacements: { id },
      type: QueryTypes.SELECT,
      transaction: t
    });

    if (existingLabel) {
      await sequelize.query(`
        UPDATE category_label 
        SET name = COALESCE(:name, name),
            description = COALESCE(:description, description)
        WHERE category_id = :id AND language_id = 1
      `, {
        replacements: { id, name, description },
        type: QueryTypes.UPDATE,
        transaction: t
      });
    } else {
      await sequelize.query(`
        INSERT INTO category_label (category_id, language_id, name, description)
        VALUES (:id, 1, :name, :description)
      `, {
        replacements: { id, name: name || '', description: description || '' },
        type: QueryTypes.INSERT,
        transaction: t
      });
    }

    await t.commit();

    res.json({ id, name, description, parent_id, status, sort_order });
  } catch (error) {
    await t.rollback();
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Delete category
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const id = req.params.id;

    // Delete label first (foreign key constraint)
    await sequelize.query(`
      DELETE FROM category_label WHERE category_id = :id
    `, {
      replacements: { id },
      type: QueryTypes.DELETE,
      transaction: t
    });

    // Delete category
    await sequelize.query(`
      DELETE FROM category WHERE id = :id
    `, {
      replacements: { id },
      type: QueryTypes.DELETE,
      transaction: t
    });

    await t.commit();

    res.json({ id });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

