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
const optionalAuth = require('../middleware/optionalAuth');
const { annotateListWithAccess } = require('../middleware/membershipAccess');

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
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { categoryId, levelId, filter, page = 1, limit = 10 } = req.query;
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const sequelize = require('../config/database');
    const { QueryTypes } = require('sequelize');

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

    const conditions = ['tc.status = 1', 'tc.category_id = :categoryId'];
    const replacements = { categoryId, languageId };

    if (filter && filter !== 'all') {
      conditions.push('tc.parent_id = :filter');
      replacements.filter = filter;
    } else {
      conditions.push('tc.parent_id != 0');
    }

    if (levelId && levelId !== '0') {
      conditions.push('tc.level_id = :levelId');
      replacements.levelId = levelId;
    }

    const whereSql = 'WHERE ' + conditions.join(' AND ');
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) AS total FROM test_category tc ${whereSql}
    `, { replacements, type: QueryTypes.SELECT });

    const rows = await sequelize.query(`
      SELECT tc.id, tc.category_id, tc.parent_id, tc.status, tc.sort_order,
             tc.time, tc.image, tc.level_id, tc.created_date,
             tcl.name, tcl.description, tcl.seo_name
      FROM test_category tc
      LEFT JOIN test_category_label tcl
        ON tcl.test_category_id = tc.id AND tcl.language_id = :languageId
      ${whereSql}
      ORDER BY tc.sort_order ASC, tc.id ASC
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { ...replacements, limit: parseInt(limit), offset },
      type: QueryTypes.SELECT
    });

    const plainRows = rows.map(r => ({
      ...r,
      labels: r.name != null
        ? [{ name: r.name, description: r.description, seo_name: r.seo_name, language_id: parseInt(languageId) }]
        : []
    }));

    const annotated = await annotateListWithAccess(plainRows, 'test', req.userId);

    res.json({
      tests: annotated,
      pagination: {
        total: countResult.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult.total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// Get test details with questions and answers
router.get('/:testId', optionalAuth, async (req, res) => {
  try {
    const { testId } = req.params;
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const sequelize = require('../config/database');
    const { QueryTypes } = require('sequelize');

    const { getRequiredLevel, getUserMembershipLevel } = require('../middleware/membershipAccess');
    const requiredLevel = await getRequiredLevel(testId, 'test');
    if (requiredLevel > 0) {
      const userLevel = await getUserMembershipLevel(req.userId);
      if (userLevel < requiredLevel) {
        return res.status(403).json({
          error: 'Membership required',
          required_level: requiredLevel,
          user_level: userLevel,
          message: 'Your membership level is not sufficient to access this content'
        });
      }
    }

    const testCategoryRows = await sequelize.query(`
      SELECT tc.*, tcl.name, tcl.description, tcl.seo_name
      FROM test_category tc
      LEFT JOIN test_category_label tcl
        ON tcl.test_category_id = tc.id AND tcl.language_id = :languageId
      WHERE tc.id = :testId
    `, {
      replacements: { testId, languageId },
      type: QueryTypes.SELECT
    });

    const testCategoryRow = testCategoryRows[0];
    if (!testCategoryRow) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const testCategory = {
      ...testCategoryRow,
      labels: testCategoryRow.name != null
        ? [{ name: testCategoryRow.name, description: testCategoryRow.description, seo_name: testCategoryRow.seo_name, language_id: parseInt(languageId) }]
        : []
    };

    const tests = await sequelize.query(`
      SELECT t.id, t.parent_id, t.status, t.sort_order, t.image, t.audio,
             t.question_type, t.answer_type,
             COALESCE(tl.value, t.question) AS question
      FROM test t
      LEFT JOIN test_label tl
        ON tl.test_id = t.id AND tl.language_id = :languageId
      WHERE t.parent_id = :testCategoryId
      ORDER BY t.sort_order ASC, t.id ASC
    `, {
      replacements: { testCategoryId: testCategoryRow.id, languageId },
      type: QueryTypes.SELECT
    });

    if (tests.length > 0) {
      const testIds = tests.map(t => t.id);
      const answers = await sequelize.query(`
        SELECT id, test_id, value, true_false
        FROM test_answer
        WHERE test_id IN (:testIds)
        ORDER BY id ASC
      `, {
        replacements: { testIds },
        type: QueryTypes.SELECT
      });

      const answersByTest = {};
      for (const a of answers) {
        if (!answersByTest[a.test_id]) answersByTest[a.test_id] = [];
        answersByTest[a.test_id].push(a);
      }
      for (const t of tests) {
        t.answers = answersByTest[t.id] || [];
      }
    }

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
router.post('/:testId/submit', optionalAuth, async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers, userId, duration } = req.body; // Array of { test_id, answer_id }
    const sequelize = require('../config/database');

    const { getRequiredLevel, getUserMembershipLevel } = require('../middleware/membershipAccess');
    const requiredLevel = await getRequiredLevel(testId, 'test');
    if (requiredLevel > 0) {
      const effectiveUserId = req.userId || userId;
      const userLevel = await getUserMembershipLevel(effectiveUserId);
      if (userLevel < requiredLevel) {
        return res.status(403).json({
          error: 'Membership required',
          required_level: requiredLevel,
          user_level: userLevel,
          message: 'Your membership level is not sufficient to access this content'
        });
      }
    }

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
        uh.test_type,
        uh.section,
        uh.created_date,
        uh.duration,
        uh.score,
        uh.score_from,
        CASE
          WHEN uh.test_type = 'regular' THEN tcl.name
          WHEN uh.test_type = 'toefl' THEN CONCAT('TOEFL ', UPPER(LEFT(uh.section, 1)), SUBSTRING(uh.section, 2))
          WHEN uh.test_type = 'ielts' THEN CONCAT('IELTS ', UPPER(LEFT(uh.section, 1)), SUBSTRING(uh.section, 2))
          ELSE 'Unknown'
        END as test_name,
        CASE
          WHEN uh.test_type = 'regular' THEN cl.value
          WHEN uh.test_type = 'toefl' THEN 'TOEFL'
          WHEN uh.test_type = 'ielts' THEN 'IELTS'
          ELSE uh.test_type
        END as category_name,
        CASE WHEN uh.test_type = 'regular' THEN tc.category_id ELSE NULL END as category_id
      FROM user_history uh
      LEFT JOIN test_category tc ON uh.test_id = tc.id AND uh.test_type = 'regular'
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



