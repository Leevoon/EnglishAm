const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const DEFAULT_LANGUAGE_ID = 1;

// Get training groups with labels and trainings
router.get('/', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;

    const [groups] = await sequelize.query(`
      SELECT tg.id, tg.status, tg.sort_order, tgl.name
      FROM trainings_group tg
      LEFT JOIN trainings_group_label tgl ON tg.id = tgl.trainings_group_id AND tgl.language_id = :languageId
      WHERE tg.status = 1
      ORDER BY tg.sort_order ASC
    `, { replacements: { languageId } });

    const [trainings] = await sequelize.query(`
      SELECT t.id, t.trainings_group_id, t.test_id, t.status, t.type_seccond, t.sort_order, t.type
      FROM trainings t
      WHERE t.status = 1
      ORDER BY t.sort_order ASC
    `);

    const result = groups.map(g => ({
      id: g.id,
      status: g.status,
      sort_order: g.sort_order,
      labels: [{ name: g.name || `Training Group ${g.id}` }],
      trainings: trainings.filter(t => t.trainings_group_id === g.id)
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching trainings:', error);
    res.status(500).json({ error: 'Failed to fetch trainings' });
  }
});

module.exports = router;
