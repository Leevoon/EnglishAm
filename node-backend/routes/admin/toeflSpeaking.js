const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'name', 'status', 'sort_order', 'created_date'];

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

    if (filter.q) {
      where += ' AND tsl.name LIKE :q';
      replacements.q = `%${filter.q}%`;
    }

    if (filter.ids && filter.ids.length > 0) {
      where += ' AND ts.id IN (:ids)';
      replacements.ids = filter.ids;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM toefl_speaking ts
      LEFT JOIN toefl_speaking_label tsl ON tsl.toefl_speaking_id = ts.id AND tsl.language_id = 1
      WHERE 1=1 ${where}
    `;

    const dataQuery = `
      SELECT ts.id, tsl.name, ts.status, ts.sort_order, ts.created_date
      FROM toefl_speaking ts
      LEFT JOIN toefl_speaking_label tsl ON tsl.toefl_speaking_id = ts.id AND tsl.language_id = 1
      WHERE 1=1 ${where}
      ORDER BY ${sortField === 'name' ? 'tsl.name' : 'ts.' + sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `;

    replacements.limit = perPage;
    replacements.offset = offset;

    const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
    const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

    res.set('Content-Range', `toefl-speaking ${offset}-${offset + data.length}/${countResult.total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.json(data);
  } catch (error) {
    console.error('Error fetching toefl speakings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT ts.id, tsl.name, ts.status, ts.sort_order, ts.created_date
      FROM toefl_speaking ts
      LEFT JOIN toefl_speaking_label tsl ON tsl.toefl_speaking_id = ts.id AND tsl.language_id = 1
      WHERE ts.id = :id
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
    console.error('Error fetching toefl speaking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, status, sort_order } = req.body;

    const [result] = await sequelize.query(
      `INSERT INTO toefl_speaking (status, sort_order, created_date) VALUES (:status, :sort_order, NOW())`,
      {
        replacements: { status: status || 1, sort_order: sort_order || 0 },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    const insertId = result;

    await sequelize.query(
      `INSERT INTO toefl_speaking_label (toefl_speaking_id, language_id, name) VALUES (:toefl_speaking_id, 1, :name)`,
      {
        replacements: { toefl_speaking_id: insertId, name: name || '' },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    await t.commit();

    res.json({ id: insertId, name, status: status || 1, sort_order: sort_order || 0 });
  } catch (error) {
    await t.rollback();
    console.error('Error creating toefl speaking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, status, sort_order } = req.body;
    const id = req.params.id;

    await sequelize.query(
      `UPDATE toefl_speaking SET status = :status, sort_order = :sort_order WHERE id = :id`,
      {
        replacements: { id, status, sort_order },
        type: QueryTypes.UPDATE,
        transaction: t,
      }
    );

    const [existingLabel] = await sequelize.query(
      `SELECT id FROM toefl_speaking_label WHERE toefl_speaking_id = :id AND language_id = 1`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    if (existingLabel) {
      await sequelize.query(
        `UPDATE toefl_speaking_label SET name = :name WHERE toefl_speaking_id = :id AND language_id = 1`,
        {
          replacements: { id, name },
          type: QueryTypes.UPDATE,
          transaction: t,
        }
      );
    } else {
      await sequelize.query(
        `INSERT INTO toefl_speaking_label (toefl_speaking_id, language_id, name) VALUES (:id, 1, :name)`,
        {
          replacements: { id, name },
          type: QueryTypes.INSERT,
          transaction: t,
        }
      );
    }

    await t.commit();

    res.json({ id: parseInt(id), name, status, sort_order });
  } catch (error) {
    await t.rollback();
    console.error('Error updating toefl speaking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;

    await sequelize.query(
      `DELETE FROM toefl_speaking_label WHERE toefl_speaking_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
        transaction: t,
      }
    );

    await sequelize.query(
      `DELETE FROM toefl_speaking WHERE id = :id`,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
        transaction: t,
      }
    );

    await t.commit();

    res.json({ id: parseInt(id) });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting toefl speaking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
