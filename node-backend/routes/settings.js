const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const DEFAULT_LANGUAGE_ID = 1;

// Get site settings
router.get('/', async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT `key`, `value` FROM settings');
    const settings = {};
    results.forEach(row => {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get social links
router.get('/socials', async (req, res) => {
  try {
    const [results] = await sequelize.query(
      'SELECT id, favicon, href, sort_order FROM socials WHERE status = 1 ORDER BY sort_order ASC'
    );
    res.json(results);
  } catch (error) {
    console.error('Error fetching socials:', error);
    res.status(500).json({ error: 'Failed to fetch socials' });
  }
});

// Get UI translations
router.get('/translations', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const [results] = await sequelize.query(`
      SELECT t.\`key\`, tl.value
      FROM translation t
      LEFT JOIN translation_label tl ON t.id = tl.translation_id AND tl.language_id = :languageId
    `, { replacements: { languageId } });

    const translations = {};
    results.forEach(row => {
      translations[row.key] = row.value || row.key;
    });
    res.json(translations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

module.exports = router;
