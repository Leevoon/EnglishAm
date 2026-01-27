const express = require('express');
const router = express.Router();
const { Category, CategoryLabel, Language } = require('../models');

const DEFAULT_LANGUAGE_ID = 1; // Assuming 1 is English

// Helper function to build nested category tree
async function buildCategoryTree(parentId = 0, languageId = DEFAULT_LANGUAGE_ID) {
  const categories = await Category.findAll({
    where: { parent_id: parentId, status: 1 },
    include: [{
      model: CategoryLabel,
      as: 'labels',
      where: { language_id: languageId },
      required: false
    }],
    order: [['sort_order', 'ASC']]
  });

  const tree = await Promise.all(categories.map(async (category) => {
    const children = await buildCategoryTree(category.id, languageId);
    const label = category.labels && category.labels.length > 0 ? category.labels[0] : null;
    
    return {
      id: category.id,
      parent_id: category.parent_id,
      sort_order: category.sort_order,
      key: category.key,
      label: label ? label.value : null,
      children: children
    };
  }));

  return tree;
}

// Get all categories with nested structure
router.get('/', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const tree = await buildCategoryTree(0, languageId);
    res.json(tree);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all test categories for menu (all top-level test categories)
// MUST be before /:id route to avoid route matching conflicts
router.get('/menu/test-categories', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const { TestCategory, TestCategoryLabel, Category, CategoryLabel } = require('../models');
    const sequelize = require('../config/database');

    // Get all test categories with parent_id = 0 (top level test categories)
    const testCategories = await TestCategory.findAll({
      where: {
        parent_id: 0,
        status: 1
      },
      include: [{
        model: TestCategoryLabel,
        as: 'labels',
        where: { language_id: languageId },
        required: false
      }],
      order: [['sort_order', 'ASC']]
    });

    // Get category names using raw query to avoid association issues
    const categoryIds = [...new Set(testCategories.map(tc => tc.category_id))];
    if (categoryIds.length === 0) {
      return res.json([]);
    }

    const [categories] = await sequelize.query(`
      SELECT c.id, cl.value as name
      FROM category c
      LEFT JOIN category_label cl ON c.id = cl.category_id AND cl.language_id = :languageId
      WHERE c.id IN (${categoryIds.join(',')})
    `, {
      replacements: { languageId }
    });

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.name || `Category ${cat.id}`;
    });

    // Format response - return all test categories with their category info
    const result = testCategories.map(tc => ({
      id: tc.id,
      name: tc.labels && tc.labels.length > 0 ? tc.labels[0].name : `Test ${tc.id}`,
      categoryId: tc.category_id,
      categoryName: categoryMap[tc.category_id] || `Category ${tc.category_id}`,
      sortOrder: tc.sort_order
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching test categories for menu:', error);
    res.status(500).json({ error: 'Failed to fetch test categories' });
  }
});

// Get subcategories recursively - MUST be before /:id route
router.get('/:id/subcategories', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const tree = await buildCategoryTree(req.params.id, languageId);
    res.json(tree);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

// Get test categories for a specific category - MUST be before /:id route
router.get('/:id/test-categories', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const { TestCategory, TestCategoryLabel } = require('../models');
    
    const testCategories = await TestCategory.findAll({
      where: {
        category_id: req.params.id,
        parent_id: 0,
        status: 1
      },
      include: [{
        model: TestCategoryLabel,
        as: 'labels',
        where: { language_id: languageId },
        required: false
      }],
      order: [['sort_order', 'ASC']]
    });

    const result = testCategories.map(tc => ({
      id: tc.id,
      name: tc.labels && tc.labels.length > 0 ? tc.labels[0].name : `Test ${tc.id}`,
      description: tc.labels && tc.labels.length > 0 ? tc.labels[0].description : null,
      categoryId: tc.category_id,
      sortOrder: tc.sort_order
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching test categories for category:', error);
    res.status(500).json({ error: 'Failed to fetch test categories' });
  }
});

// Get category by ID - MUST be last to avoid route matching conflicts
router.get('/:id', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: CategoryLabel,
        as: 'labels',
        where: { language_id: languageId },
        required: false
      }]
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const label = category.labels && category.labels.length > 0 ? category.labels[0] : null;
    res.json({
      id: category.id,
      parent_id: category.parent_id,
      sort_order: category.sort_order,
      key: category.key,
      label: label ? label.value : null
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

module.exports = router;

