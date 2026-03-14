const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const DEFAULT_LANGUAGE_ID = 1;

// Helper to get TOEFL Reading tests
router.get('/reading', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT tr.*, trl.name
      FROM toefl_reading tr
      LEFT JOIN toefl_reading_label trl ON tr.id = trl.toefl_reading_id AND trl.language_id = ${DEFAULT_LANGUAGE_ID}
      WHERE tr.status = 1
      ORDER BY tr.sort_order ASC
    `);
    res.json(results);
  } catch (error) {
    console.error('Error fetching TOEFL reading tests:', error);
    res.status(500).json({ error: 'Failed to fetch TOEFL reading tests' });
  }
});

// Helper to get TOEFL Listening tests
router.get('/listening', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT tl.*, tll.name
      FROM toefl_listening tl
      LEFT JOIN toefl_listening_label tll ON tl.id = tll.toefl_listening_id AND tll.language_id = ${DEFAULT_LANGUAGE_ID}
      WHERE tl.status = 1
      ORDER BY tl.sort_order ASC
    `);
    res.json(results);
  } catch (error) {
    console.error('Error fetching TOEFL listening tests:', error);
    res.status(500).json({ error: 'Failed to fetch TOEFL listening tests' });
  }
});

// Helper to get TOEFL Speaking tests
router.get('/speaking', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT ts.*, tsl.name
      FROM toefl_speaking ts
      LEFT JOIN toefl_speaking_label tsl ON ts.id = tsl.toefl_speaking_id AND tsl.language_id = ${DEFAULT_LANGUAGE_ID}
      WHERE ts.status = 1
      ORDER BY ts.sort_order ASC
    `);
    res.json(results);
  } catch (error) {
    console.error('Error fetching TOEFL speaking tests:', error);
    res.status(500).json({ error: 'Failed to fetch TOEFL speaking tests' });
  }
});

// Helper to get TOEFL Writing tests
router.get('/writing', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT tw.*, twl.name
      FROM toefl_writing tw
      LEFT JOIN toefl_writing_label twl ON tw.id = twl.toefl_writing_id AND twl.language_id = ${DEFAULT_LANGUAGE_ID}
      WHERE tw.status = 1
      ORDER BY tw.sort_order ASC
    `);
    res.json(results);
  } catch (error) {
    console.error('Error fetching TOEFL writing tests:', error);
    res.status(500).json({ error: 'Failed to fetch TOEFL writing tests' });
  }
});

// Get complete TOEFL test (combines all sections)
router.get('/complete', async (req, res) => {
  try {
    const [reading] = await sequelize.query(`SELECT * FROM toefl_reading WHERE status = 1 ORDER BY sort_order ASC LIMIT 1`);
    const [listening] = await sequelize.query(`SELECT * FROM toefl_listening WHERE status = 1 ORDER BY sort_order ASC LIMIT 1`);
    const [speaking] = await sequelize.query(`SELECT * FROM toefl_speaking WHERE status = 1 ORDER BY sort_order ASC LIMIT 1`);
    const [writing] = await sequelize.query(`SELECT * FROM toefl_writing WHERE status = 1 ORDER BY sort_order ASC LIMIT 1`);

    res.json({
      reading: reading[0] || null,
      listening: listening[0] || null,
      speaking: speaking[0] || null,
      writing: writing[0] || null
    });
  } catch (error) {
    console.error('Error fetching complete TOEFL test:', error);
    res.status(500).json({ error: 'Failed to fetch complete TOEFL test' });
  }
});

// Get specific section test details
router.get('/:section/:id', async (req, res) => {
  try {
    const { section, id } = req.params;
    const sectionMap = {
      reading: 'toefl_reading',
      listening: 'toefl_listening',
      speaking: 'toefl_speaking',
      writing: 'toefl_writing'
    };

    const tableName = sectionMap[section];
    if (!tableName) {
      return res.status(400).json({ error: 'Invalid section' });
    }

    const [results] = await sequelize.query(`
      SELECT * FROM ${tableName} WHERE id = :id AND status = 1
    `, { replacements: { id } });

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    if (section === 'reading') {
      // Get reading passages
      const [passages] = await sequelize.query(`
        SELECT * FROM toefl_reading_test
        WHERE toefl_reding_id = :id AND status = 1
        ORDER BY sort_order ASC
      `, { replacements: { id } });

      // For each passage, get questions and their answers
      for (const passage of passages) {
        const [questions] = await sequelize.query(`
          SELECT * FROM toefl_reading_test_question
          WHERE toefl_reading_test_id = :passageId AND status = 1
          ORDER BY sort_order ASC
        `, { replacements: { passageId: passage.id } });

        for (const question of questions) {
          const [answers] = await sequelize.query(`
            SELECT id, toefl_reading_test_question_id, true_false, text, question as answer_question
            FROM toefl_reading_test_answer
            WHERE toefl_reading_test_question_id = :questionId
          `, { replacements: { questionId: question.id } });
          question.answers = answers;
        }

        passage.questions = questions;
      }

      return res.json({
        test: results[0],
        passages
      });
    } else if (section === 'listening') {
      // Get listening test parts (each has audio + image)
      const [parts] = await sequelize.query(`
        SELECT * FROM toefl_listening_test
        WHERE toefl_listening_id = :id AND status = 1
        ORDER BY id ASC
      `, { replacements: { id } });

      // For each part, get questions and their answers
      for (const part of parts) {
        const [questions] = await sequelize.query(`
          SELECT * FROM toefl_listening_test_question
          WHERE toefl_listening_test_id = :partId AND status = 1
        `, { replacements: { partId: part.id } });

        for (const question of questions) {
          const [answers] = await sequelize.query(`
            SELECT id, toefl_listening_test_question_id, sort_order, true_false, value
            FROM toefl_listening_test_question_answers
            WHERE toefl_listening_test_question_id = :questionId
            ORDER BY sort_order ASC
          `, { replacements: { questionId: question.id } });
          question.answers = answers;
        }

        part.questions = questions;
      }

      return res.json({
        test: results[0],
        parts
      });
    }

    // Fallback for speaking/writing
    res.json({
      test: results[0],
      questions: []
    });
  } catch (error) {
    console.error(`Error fetching TOEFL ${req.params.section} test:`, error);
    res.status(500).json({ error: `Failed to fetch TOEFL ${req.params.section} test` });
  }
});

// Submit test answers
router.post('/:section/:id/submit', async (req, res) => {
  try {
    const { section, id } = req.params;
    const { answers } = req.body;
    // answers format: { questionId: selectedAnswerId, ... }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers are required' });
    }

    let correctCount = 0;
    let incorrectCount = 0;
    const results = {};

    if (section === 'reading') {
      for (const [questionId, selectedAnswerId] of Object.entries(answers)) {
        const [correctAnswers] = await sequelize.query(`
          SELECT id, true_false FROM toefl_reading_test_answer
          WHERE toefl_reading_test_question_id = :questionId
        `, { replacements: { questionId } });

        const correctAnswer = correctAnswers.find(a => a.true_false === 1);
        const isCorrect = correctAnswer && String(correctAnswer.id) === String(selectedAnswerId);

        if (isCorrect) correctCount++;
        else incorrectCount++;

        results[questionId] = {
          selected: selectedAnswerId,
          correct: correctAnswer ? correctAnswer.id : null,
          isCorrect
        };
      }
    } else if (section === 'listening') {
      for (const [questionId, selectedAnswerId] of Object.entries(answers)) {
        const [correctAnswers] = await sequelize.query(`
          SELECT id, true_false FROM toefl_listening_test_question_answers
          WHERE toefl_listening_test_question_id = :questionId
        `, { replacements: { questionId } });

        const correctAnswer = correctAnswers.find(a => a.true_false === 1);
        const isCorrect = correctAnswer && String(correctAnswer.id) === String(selectedAnswerId);

        if (isCorrect) correctCount++;
        else incorrectCount++;

        results[questionId] = {
          selected: selectedAnswerId,
          correct: correctAnswer ? correctAnswer.id : null,
          isCorrect
        };
      }
    }

    res.json({
      correct: correctCount,
      incorrect: incorrectCount,
      total: correctCount + incorrectCount,
      results
    });
  } catch (error) {
    console.error('Error submitting TOEFL test:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

module.exports = router;
