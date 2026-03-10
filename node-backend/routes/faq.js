const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const DEFAULT_LANGUAGE_ID = 1;

// Get all FAQs with labels
router.get('/', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const [results] = await sequelize.query(`
      SELECT f.id, f.status, f.sort_order, fl.question, fl.answer
      FROM faq f
      LEFT JOIN faq_label fl ON f.id = fl.faq_id AND fl.language_id = :languageId
      WHERE f.status = 1
      ORDER BY f.sort_order ASC, f.id ASC
    `, { replacements: { languageId } });

    // Group by FAQ id to match mock format
    const faqMap = {};
    results.forEach(row => {
      if (!faqMap[row.id]) {
        faqMap[row.id] = { id: row.id, status: row.status, sort_order: row.sort_order, faqLabels: [] };
      }
      if (row.question || row.answer) {
        faqMap[row.id].faqLabels.push({ question: row.question, answer: row.answer });
      }
    });

    res.json(Object.values(faqMap));
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
});

module.exports = router;
