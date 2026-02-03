const express = require('express');
const router = express.Router();
const { 
  TestCategory, 
  TestCategoryLabel, 
  TestLevel, 
  TestLevelLabel,
  Test,
  TestAnswer,
  Language
} = require('../models');

const DEFAULT_LANGUAGE_ID = 1;

// Get test categories for a category
router.get('/categories/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;

    const testCategories = await TestCategory.findAll({
      where: { 
        category_id: categoryId,
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

    res.json(testCategories);
  } catch (error) {
    console.error('Error fetching test categories:', error);
    res.status(500).json({ error: 'Failed to fetch test categories' });
  }
});

// Get filters for test category (subcategories)
router.get('/categories/:categoryId/filters', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;

    const filters = await TestCategory.findAll({
      where: { 
        category_id: categoryId,
        parent_id: { [require('sequelize').Op.ne]: 0 },
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

    res.json(filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

// Get all test levels
router.get('/levels', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;

    const levels = await TestLevel.findAll({
      include: [{
        model: TestLevelLabel,
        as: 'labels',
        where: { language_id: languageId },
        required: false
      }],
      where: { status: 1 },
      order: [['sort_order', 'ASC']]
    });

    res.json(levels);
  } catch (error) {
    console.error('Error fetching test levels:', error);
    res.status(500).json({ error: 'Failed to fetch test levels' });
  }
});

// Get filtered tests
router.get('/', async (req, res) => {
  try {
    const { categoryId, levelId, variant, filter, page = 1, limit = 10 } = req.query;
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const { Op } = require('sequelize');

    // Return empty results if no categoryId provided
    if (!categoryId) {
      return res.json({
        tests: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0
        }
      });
    }

    const whereClause = {
      status: 1,
      category_id: categoryId
    };

    if (filter && filter !== 'all') {
      whereClause.parent_id = filter;
    } else {
      whereClause.parent_id = { [Op.ne]: 0 };
    }

    if (levelId && levelId !== '0') {
      whereClause.level_id = levelId;
    }

    if (variant && variant !== 'both') {
      whereClause[Op.or] = [
        { english_variant: variant },
        { english_variant: 'both' }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await TestCategory.findAndCountAll({
      where: whereClause,
      include: [{
        model: TestCategoryLabel,
        as: 'labels',
        where: { language_id: languageId },
        required: false
      }],
      order: [['sort_order', 'ASC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      tests: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// Get test details with questions and answers
router.get('/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;

    const testCategory = await TestCategory.findByPk(testId, {
      include: [{
        model: TestCategoryLabel,
        as: 'labels',
        where: { language_id: languageId },
        required: false
      }]
    });

    if (!testCategory) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Get test questions for this test category
    const tests = await Test.findAll({
      where: { parent_id: testCategory.id, status: 1 },
      include: [{
        model: TestAnswer,
        as: 'answers'
      }, {
        model: require('../models/TestLabel'),
        as: 'labels',
        where: { language_id: languageId },
        required: false
      }],
      order: [['sort_order', 'ASC']]
    });

    res.json({
      testCategory,
      tests
    });
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ error: 'Failed to fetch test' });
  }
});

// Submit test answers
router.post('/:testId/submit', async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers } = req.body; // Array of { test_id, answer_id }

    // Calculate score
    let correctCount = 0;
    const results = [];

    for (const answer of answers) {
      const testAnswer = await TestAnswer.findByPk(answer.answer_id);
      const isCorrect = testAnswer && testAnswer.true_false === 1;
      
      if (isCorrect) correctCount++;
      
      results.push({
        test_id: answer.test_id,
        answer_id: answer.answer_id,
        correct: isCorrect
      });
    }

    const totalQuestions = answers.length;
    const score = (correctCount / totalQuestions) * 100;

    res.json({
      score: score.toFixed(2),
      correct: correctCount,
      total: totalQuestions,
      results
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

module.exports = router;



