const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const DEFAULT_LANGUAGE_ID = 1;

// Helper to get IELTS Reading tests
router.get('/reading', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT ir.*, irl.name 
      FROM ielts_reading ir
      LEFT JOIN ielts_reading_label irl ON ir.id = irl.ielts_reading_id AND irl.language_id = ${DEFAULT_LANGUAGE_ID}
      WHERE ir.status = 1
      ORDER BY ir.sort_order ASC
    `);
    res.json(results);
  } catch (error) {
    console.error('Error fetching IELTS reading tests:', error);
    res.status(500).json({ error: 'Failed to fetch IELTS reading tests' });
  }
});

// Helper to get IELTS Listening tests
router.get('/listening', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT il.*, ill.name 
      FROM ielts_listening il
      LEFT JOIN ielts_listening_label ill ON il.id = ill.ielts_listening_id AND ill.language_id = ${DEFAULT_LANGUAGE_ID}
      WHERE il.status = 1
      ORDER BY il.sort_order ASC
    `);
    res.json(results);
  } catch (error) {
    console.error('Error fetching IELTS listening tests:', error);
    res.status(500).json({ error: 'Failed to fetch IELTS listening tests' });
  }
});

// Helper to get IELTS Speaking tests
router.get('/speaking', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT isp.*, isl.name 
      FROM ielts_speaking isp
      LEFT JOIN ielts_speaking_label isl ON isp.id = isl.ielts_speaking_id AND isl.language_id = ${DEFAULT_LANGUAGE_ID}
      WHERE isp.status = 1
      ORDER BY isp.sort_order ASC
    `);
    res.json(results);
  } catch (error) {
    console.error('Error fetching IELTS speaking tests:', error);
    res.status(500).json({ error: 'Failed to fetch IELTS speaking tests' });
  }
});

// Helper to get IELTS Writing tests
router.get('/writing', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT iw.*, iwl.name 
      FROM ielts_writing iw
      LEFT JOIN ielts_writing_label iwl ON iw.id = iwl.ielts_writing_id AND iwl.language_id = ${DEFAULT_LANGUAGE_ID}
      WHERE iw.status = 1
      ORDER BY iw.sort_order ASC
    `);
    res.json(results);
  } catch (error) {
    console.error('Error fetching IELTS writing tests:', error);
    res.status(500).json({ error: 'Failed to fetch IELTS writing tests' });
  }
});

// Get complete IELTS test (combines all sections)
router.get('/complete', async (req, res) => {
  try {
    const [reading] = await sequelize.query(`SELECT * FROM ielts_reading WHERE status = 1 ORDER BY sort_order ASC LIMIT 1`);
    const [listening] = await sequelize.query(`SELECT * FROM ielts_listening WHERE status = 1 ORDER BY sort_order ASC LIMIT 1`);
    const [speaking] = await sequelize.query(`SELECT * FROM ielts_speaking WHERE status = 1 ORDER BY sort_order ASC LIMIT 1`);
    const [writing] = await sequelize.query(`SELECT * FROM ielts_writing WHERE status = 1 ORDER BY sort_order ASC LIMIT 1`);

    res.json({
      reading: reading[0] || null,
      listening: listening[0] || null,
      speaking: speaking[0] || null,
      writing: writing[0] || null
    });
  } catch (error) {
    console.error('Error fetching complete IELTS test:', error);
    res.status(500).json({ error: 'Failed to fetch complete IELTS test' });
  }
});

// Get specific section test details
router.get('/:section/:id', async (req, res) => {
  try {
    const { section, id } = req.params;
    const sectionMap = {
      reading: 'ielts_reading',
      listening: 'ielts_listening',
      speaking: 'ielts_speaking',
      writing: 'ielts_writing'
    };

    const tableName = sectionMap[section];
    if (!tableName) {
      return res.status(400).json({ error: 'Invalid section' });
    }

    const [results] = await sequelize.query(`
      SELECT * FROM ${tableName} WHERE id = ${id} AND status = 1
    `);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Get related questions based on section
    let questions = [];
    if (section === 'reading') {
      const [readingTests] = await sequelize.query(`
        SELECT * FROM ielts_reading_test WHERE ielts_reading_id = ${id} AND status = 1 ORDER BY sort_order ASC
      `);
      questions = readingTests;
    } else if (section === 'listening') {
      const [listeningTests] = await sequelize.query(`
        SELECT * FROM ielts_listening_question WHERE ielts_listening_id = ${id} AND status = 1 ORDER BY sort_order ASC
      `);
      questions = listeningTests;
    }

    res.json({
      test: results[0],
      questions
    });
  } catch (error) {
    console.error(`Error fetching IELTS ${req.params.section} test:`, error);
    res.status(500).json({ error: `Failed to fetch IELTS ${req.params.section} test` });
  }
});

// Submit test answers
router.post('/:section/:id/submit', async (req, res) => {
  try {
    const { section, id } = req.params;
    const { answers } = req.body;

    // Process answers and calculate score
    // This would need to be implemented based on specific test structure
    
    res.json({
      message: 'Test submitted successfully',
      section,
      testId: id
    });
  } catch (error) {
    console.error('Error submitting IELTS test:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

module.exports = router;



