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
    const { answers, userId, duration } = req.body; // Array of { test_id, answer_id }
    const sequelize = require('../config/database');

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
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Save to user_history if userId provided
    if (userId) {
      try {
        await sequelize.query(`
          INSERT INTO user_history (user_id, test_id, duration, score, score_from, answers, created_date)
          VALUES (:userId, :testId, :duration, :score, :scoreFrom, :answers, NOW())
        `, {
          replacements: {
            userId: userId,
            testId: testId,
            duration: duration || '00:00',
            score: correctCount,
            scoreFrom: totalQuestions,
            answers: JSON.stringify(results)
          }
        });
      } catch (saveError) {
        console.error('Error saving to user_history:', saveError);
        // Don't fail the whole request if saving fails
      }
    }

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

// Get user's test history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const sequelize = require('../config/database');

    const [results] = await sequelize.query(`
      SELECT 
        uh.id,
        uh.test_id,
        uh.created_date,
        uh.duration,
        uh.score,
        uh.score_from,
        tc.category_id,
        tcl.name as test_name,
        cl.value as category_name
      FROM user_history uh
      LEFT JOIN test_category tc ON uh.test_id = tc.id
      LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = :languageId
      LEFT JOIN category c ON tc.category_id = c.id
      LEFT JOIN category_label cl ON c.id = cl.category_id AND cl.language_id = :languageId
      WHERE uh.user_id = :userId
      ORDER BY uh.created_date DESC
      LIMIT 50
    `, {
      replacements: { userId, languageId }
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ error: 'Failed to fetch test history' });
  }
});

// Get user's statistics
router.get('/statistics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sequelize = require('../config/database');

    const [stats] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_tests,
        COALESCE(SUM(score), 0) as total_correct,
        COALESCE(SUM(score_from), 0) as total_questions,
        COALESCE(ROUND(AVG(score * 100.0 / NULLIF(score_from, 0)), 1), 0) as average_score
      FROM user_history
      WHERE user_id = :userId
    `, {
      replacements: { userId }
    });

    res.json(stats[0] || { total_tests: 0, total_correct: 0, total_questions: 0, average_score: 0 });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;



