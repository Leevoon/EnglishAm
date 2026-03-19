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
      where += ' AND twl.name LIKE :q';
      replacements.q = `%${filter.q}%`;
    }

    if (filter.ids && filter.ids.length > 0) {
      where += ' AND tw.id IN (:ids)';
      replacements.ids = filter.ids;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM toefl_writing tw
      LEFT JOIN toefl_writing_label twl ON twl.toefl_writing_id = tw.id AND twl.language_id = 1
      WHERE 1=1 ${where}
    `;

    const dataQuery = `
      SELECT tw.id, twl.name, tw.text, tw.profesor_text, tw.status, tw.sort_order, tw.created_date
      FROM toefl_writing tw
      LEFT JOIN toefl_writing_label twl ON twl.toefl_writing_id = tw.id AND twl.language_id = 1
      WHERE 1=1 ${where}
      ORDER BY ${sortField === 'name' ? 'twl.name' : 'tw.' + sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `;

    replacements.limit = perPage;
    replacements.offset = offset;

    const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
    const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

    res.set('Content-Range', `toefl-writing ${offset}-${offset + data.length}/${countResult.total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.json(data);
  } catch (error) {
    console.error('Error fetching toefl writings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT tw.id, twl.name, tw.text, tw.profesor_text, tw.status, tw.sort_order, tw.created_date
      FROM toefl_writing tw
      LEFT JOIN toefl_writing_label twl ON twl.toefl_writing_id = tw.id AND twl.language_id = 1
      WHERE tw.id = :id
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
    console.error('Error fetching toefl writing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, text, profesor_text, status, sort_order } = req.body;

    const [result] = await sequelize.query(
      `INSERT INTO toefl_writing (text, profesor_text, status, sort_order, created_date) VALUES (:text, :profesor_text, :status, :sort_order, NOW())`,
      {
        replacements: {
          text: text || '',
          profesor_text: profesor_text || '',
          status: status || 1,
          sort_order: sort_order || 0,
        },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    const insertId = result;

    await sequelize.query(
      `INSERT INTO toefl_writing_label (toefl_writing_id, language_id, name) VALUES (:toefl_writing_id, 1, :name)`,
      {
        replacements: { toefl_writing_id: insertId, name: name || '' },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    await t.commit();

    res.json({ id: insertId, name, text, profesor_text, status: status || 1, sort_order: sort_order || 0 });
  } catch (error) {
    await t.rollback();
    console.error('Error creating toefl writing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, text, profesor_text, status, sort_order } = req.body;
    const id = req.params.id;

    await sequelize.query(
      `UPDATE toefl_writing SET text = :text, profesor_text = :profesor_text, status = :status, sort_order = :sort_order WHERE id = :id`,
      {
        replacements: { id, text, profesor_text, status, sort_order },
        type: QueryTypes.UPDATE,
        transaction: t,
      }
    );

    const [existingLabel] = await sequelize.query(
      `SELECT id FROM toefl_writing_label WHERE toefl_writing_id = :id AND language_id = 1`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    if (existingLabel) {
      await sequelize.query(
        `UPDATE toefl_writing_label SET name = :name WHERE toefl_writing_id = :id AND language_id = 1`,
        {
          replacements: { id, name },
          type: QueryTypes.UPDATE,
          transaction: t,
        }
      );
    } else {
      await sequelize.query(
        `INSERT INTO toefl_writing_label (toefl_writing_id, language_id, name) VALUES (:id, 1, :name)`,
        {
          replacements: { id, name },
          type: QueryTypes.INSERT,
          transaction: t,
        }
      );
    }

    await t.commit();

    res.json({ id: parseInt(id), name, text, profesor_text, status, sort_order });
  } catch (error) {
    await t.rollback();
    console.error('Error updating toefl writing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;

    await sequelize.query(
      `DELETE FROM toefl_writing_label WHERE toefl_writing_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
        transaction: t,
      }
    );

    await sequelize.query(
      `DELETE FROM toefl_writing WHERE id = :id`,
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
    console.error('Error deleting toefl writing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
