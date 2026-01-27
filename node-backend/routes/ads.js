const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

// Get ad for test page
router.get('/test/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    
    // Try to find specific ad for this test
    const [specificAds] = await sequelize.query(`
      SELECT * FROM advertisements 
      WHERE test_id = ${testId} AND status = 1 
      ORDER BY created_date DESC 
      LIMIT 1
    `);

    if (specificAds && specificAds.length > 0) {
      return res.json(specificAds[0]);
    }

    // Fallback to random ad
    const [randomAds] = await sequelize.query(`
      SELECT * FROM advertisements 
      WHERE (test_id IS NULL OR test_id = 0) AND status = 1 
      ORDER BY RAND() 
      LIMIT 1
    `);

    if (randomAds && randomAds.length > 0) {
      return res.json(randomAds[0]);
    }

    // No ads found
    res.json(null);
  } catch (error) {
    // If advertisements table doesn't exist yet, return null
    if (error.message.includes("doesn't exist") || error.message.includes("Unknown table")) {
      return res.json(null);
    }
    console.error('Error fetching ad:', error);
    res.status(500).json({ error: 'Failed to fetch ad' });
  }
});

module.exports = router;



