const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'toefl_reding_id', 'status', 'sort_order'];

const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
  const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'id';
  const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  return { page, perPage, sortField, sortOrder, filter };
};

// GET list
router.get('/', async (req, res) => {
  try {
    const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
    const offset = (page - 1) * perPage;

    let where = '';
    const replacements = {};

    if (filter.toefl_reding_id) {
      where += ' AND trt.toefl_reding_id = :toefl_reding_id';
      replacements.toefl_reding_id = filter.toefl_reding_id;
    }

    if (filter.ids && filter.ids.length > 0) {
      where += ' AND trt.id IN (:ids)';
      replacements.ids = filter.ids;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM toefl_reading_test trt
      WHERE 1=1 ${where}
    `;

    const dataQuery = `
      SELECT trt.id, trt.toefl_reding_id, trt.text, trt.status, trt.sort_order
      FROM toefl_reading_test trt
      WHERE 1=1 ${where}
      ORDER BY trt.${sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `;

    replacements.limit = perPage;
    replacements.offset = offset;

    const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
    const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

    res.set('Content-Range', `toefl-reading-tests ${offset}-${offset + data.length}/${countResult.total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.json(data);
  } catch (error) {
    console.error('Error fetching toefl reading tests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT trt.id, trt.toefl_reding_id, trt.text, trt.status, trt.sort_order
      FROM toefl_reading_test trt
      WHERE trt.id = :id
    `;
    const [result] = await sequelize.query(query, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT,
    });

    if (!result) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching toefl reading test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { toefl_reding_id, text, status, sort_order } = req.body;

    const [result] = await sequelize.query(
      `INSERT INTO toefl_reading_test (toefl_reding_id, text, status, sort_order) VALUES (:toefl_reding_id, :text, :status, :sort_order)`,
      {
        replacements: {
          toefl_reding_id,
          text: text || '',
          status: status || 1,
          sort_order: sort_order || 0,
        },
        type: QueryTypes.INSERT,
      }
    );

    res.json({ id: result, toefl_reding_id, text, status: status || 1, sort_order: sort_order || 0 });
  } catch (error) {
    console.error('Error creating toefl reading test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { toefl_reding_id, text, status, sort_order } = req.body;
    const id = req.params.id;

    await sequelize.query(
      `UPDATE toefl_reading_test SET toefl_reding_id = :toefl_reding_id, text = :text, status = :status, sort_order = :sort_order WHERE id = :id`,
      {
        replacements: { id, toefl_reding_id, text, status, sort_order },
        type: QueryTypes.UPDATE,
      }
    );

    res.json({ id: parseInt(id), toefl_reding_id, text, status, sort_order });
  } catch (error) {
    console.error('Error updating toefl reading test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    await sequelize.query(
      `DELETE FROM toefl_reading_test WHERE id = :id`,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );

    res.json({ id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting toefl reading test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
