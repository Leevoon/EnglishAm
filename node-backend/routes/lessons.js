const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

// Get lessons with levels and filters
router.get('/', async (req, res) => {
  try {
    const { levelId, filterId, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = 'WHERE l.status = 1';
    const replacements = { limit: parseInt(limit), offset };

    if (levelId) {
      where += ' AND l.level_id = :levelId';
      replacements.levelId = parseInt(levelId);
    }
    if (filterId) {
      where += ' AND l.filter_id = :filterId';
      replacements.filterId = parseInt(filterId);
    }

    const [[{ total }]] = await sequelize.query(
      `SELECT COUNT(*) as total FROM lessons l ${where}`,
      { replacements }
    );

    const [lessons] = await sequelize.query(
      `SELECT l.* FROM lessons l ${where} ORDER BY l.sort_order DESC LIMIT :limit OFFSET :offset`,
      { replacements }
    );

    const [levels] = await sequelize.query(
      `SELECT * FROM lessons_levels WHERE status = 1 ORDER BY sort_order ASC`
    );

    const [filters] = await sequelize.query(
      `SELECT * FROM lessons_filters WHERE status = 1 ORDER BY sort_order ASC`
    );

    res.json({
      lessons,
      levels,
      filters,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

module.exports = router;
