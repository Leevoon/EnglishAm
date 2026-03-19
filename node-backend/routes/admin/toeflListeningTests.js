const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'toefl_listening_id', 'status'];

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

    if (filter.toefl_listening_id) {
      where += ' AND tlt.toefl_listening_id = :toefl_listening_id';
      replacements.toefl_listening_id = filter.toefl_listening_id;
    }

    if (filter.ids && filter.ids.length > 0) {
      where += ' AND tlt.id IN (:ids)';
      replacements.ids = filter.ids;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM toefl_listening_test tlt
      WHERE 1=1 ${where}
    `;

    const dataQuery = `
      SELECT tlt.id, tlt.toefl_listening_id, tlt.audio, tlt.image, tlt.status
      FROM toefl_listening_test tlt
      WHERE 1=1 ${where}
      ORDER BY tlt.${sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `;

    replacements.limit = perPage;
    replacements.offset = offset;

    const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
    const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

    res.set('Content-Range', `toefl-listening-tests ${offset}-${offset + data.length}/${countResult.total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.json(data);
  } catch (error) {
    console.error('Error fetching toefl listening tests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT tlt.id, tlt.toefl_listening_id, tlt.audio, tlt.image, tlt.status
      FROM toefl_listening_test tlt
      WHERE tlt.id = :id
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
    console.error('Error fetching toefl listening test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { toefl_listening_id, audio, image, status } = req.body;

    const [result] = await sequelize.query(
      `INSERT INTO toefl_listening_test (toefl_listening_id, audio, image, status) VALUES (:toefl_listening_id, :audio, :image, :status)`,
      {
        replacements: {
          toefl_listening_id,
          audio: audio || '',
          image: image || '',
          status: status || 1,
        },
        type: QueryTypes.INSERT,
      }
    );

    res.json({ id: result, toefl_listening_id, audio, image, status: status || 1 });
  } catch (error) {
    console.error('Error creating toefl listening test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { toefl_listening_id, audio, image, status } = req.body;
    const id = req.params.id;

    await sequelize.query(
      `UPDATE toefl_listening_test SET toefl_listening_id = :toefl_listening_id, audio = :audio, image = :image, status = :status WHERE id = :id`,
      {
        replacements: { id, toefl_listening_id, audio, image, status },
        type: QueryTypes.UPDATE,
      }
    );

    res.json({ id: parseInt(id), toefl_listening_id, audio, image, status });
  } catch (error) {
    console.error('Error updating toefl listening test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    await sequelize.query(
      `DELETE FROM toefl_listening_test WHERE id = :id`,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );

    res.json({ id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting toefl listening test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
