const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const DEFAULT_LANGUAGE_ID = 1;

// Get About Us content
router.get('/about', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    
    const [results] = await sequelize.query(`
      SELECT sp.*, spl.title, spl.value 
      FROM static_pages sp
      LEFT JOIN static_pages_label spl ON sp.id = spl.static_pages_id AND spl.language_id = ${languageId}
      WHERE sp.page_key = 'about_us' AND sp.status = 1
      ORDER BY sp.sort_order ASC
    `);

    res.json(results);
  } catch (error) {
    console.error('Error fetching About Us content:', error);
    res.status(500).json({ error: 'Failed to fetch About Us content' });
  }
});

// Get Contact info
router.get('/contact', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    
    const [contactInfo] = await sequelize.query(`
      SELECT ci.*, cil.address
      FROM contact_info ci
      LEFT JOIN contact_info_label cil ON ci.id = cil.contact_info_id AND cil.language_id = ${languageId}
      LIMIT 1
    `);

    res.json(contactInfo[0] || null);
  } catch (error) {
    console.error('Error fetching Contact info:', error);
    res.status(500).json({ error: 'Failed to fetch Contact info' });
  }
});

module.exports = router;



