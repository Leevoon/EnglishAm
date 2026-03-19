const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'toefl_listening_test_id', 'question', 'status'];

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

    if (filter.toefl_listening_test_id) {
      where += ' AND q.toefl_listening_test_id = :toefl_listening_test_id';
      replacements.toefl_listening_test_id = filter.toefl_listening_test_id;
    }

    if (filter.ids && filter.ids.length > 0) {
      where += ' AND q.id IN (:ids)';
      replacements.ids = filter.ids;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM toefl_listening_test_question q
      WHERE 1=1 ${where}
    `;

    const dataQuery = `
      SELECT q.id, q.toefl_listening_test_id, q.question, q.audio, q.status,
        (SELECT COUNT(*) FROM toefl_listening_test_question_answers a WHERE a.toefl_listening_test_question_id = q.id) as answer_count
      FROM toefl_listening_test_question q
      WHERE 1=1 ${where}
      ORDER BY q.${sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `;

    replacements.limit = perPage;
    replacements.offset = offset;

    const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
    const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

    res.set('Content-Range', `toefl-listening-questions ${offset}-${offset + data.length}/${countResult.total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.json(data);
  } catch (error) {
    console.error('Error fetching toefl listening questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single (with answers)
router.get('/:id', async (req, res) => {
  try {
    const questionQuery = `
      SELECT q.id, q.toefl_listening_test_id, q.question, q.audio, q.status
      FROM toefl_listening_test_question q
      WHERE q.id = :id
    `;
    const [question] = await sequelize.query(questionQuery, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT,
    });

    if (!question) {
      return res.status(404).json({ error: 'Not found' });
    }

    const answersQuery = `
      SELECT a.id, a.toefl_listening_test_question_id, a.sort_order, a.true_false, a.value
      FROM toefl_listening_test_question_answers a
      WHERE a.toefl_listening_test_question_id = :id
      ORDER BY a.sort_order ASC, a.id ASC
    `;
    const answers = await sequelize.query(answersQuery, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT,
    });

    question.answers = answers;

    res.json(question);
  } catch (error) {
    console.error('Error fetching toefl listening question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { toefl_listening_test_id, question, audio, status, answers } = req.body;

    const [result] = await sequelize.query(
      `INSERT INTO toefl_listening_test_question (toefl_listening_test_id, question, audio, status) VALUES (:toefl_listening_test_id, :question, :audio, :status)`,
      {
        replacements: {
          toefl_listening_test_id,
          question: question || '',
          audio: audio || '',
          status: status || 1,
        },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    const questionId = result;

    if (answers && answers.length > 0) {
      for (const answer of answers) {
        await sequelize.query(
          `INSERT INTO toefl_listening_test_question_answers (toefl_listening_test_question_id, sort_order, true_false, value) VALUES (:toefl_listening_test_question_id, :sort_order, :true_false, :value)`,
          {
            replacements: {
              toefl_listening_test_question_id: questionId,
              sort_order: answer.sort_order || 0,
              true_false: answer.true_false || 0,
              value: answer.value || '',
            },
            type: QueryTypes.INSERT,
            transaction: t,
          }
        );
      }
    }

    await t.commit();

    res.json({ id: questionId, toefl_listening_test_id, question, audio, status: status || 1 });
  } catch (error) {
    await t.rollback();
    console.error('Error creating toefl listening question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { toefl_listening_test_id, question, audio, status, answers } = req.body;
    const id = req.params.id;

    await sequelize.query(
      `UPDATE toefl_listening_test_question SET toefl_listening_test_id = :toefl_listening_test_id, question = :question, audio = :audio, status = :status WHERE id = :id`,
      {
        replacements: { id, toefl_listening_test_id, question, audio, status },
        type: QueryTypes.UPDATE,
        transaction: t,
      }
    );

    // Delete old answers and insert new ones
    await sequelize.query(
      `DELETE FROM toefl_listening_test_question_answers WHERE toefl_listening_test_question_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
        transaction: t,
      }
    );

    if (answers && answers.length > 0) {
      for (const answer of answers) {
        await sequelize.query(
          `INSERT INTO toefl_listening_test_question_answers (toefl_listening_test_question_id, sort_order, true_false, value) VALUES (:toefl_listening_test_question_id, :sort_order, :true_false, :value)`,
          {
            replacements: {
              toefl_listening_test_question_id: id,
              sort_order: answer.sort_order || 0,
              true_false: answer.true_false || 0,
              value: answer.value || '',
            },
            type: QueryTypes.INSERT,
            transaction: t,
          }
        );
      }
    }

    await t.commit();

    res.json({ id: parseInt(id), toefl_listening_test_id, question, audio, status });
  } catch (error) {
    await t.rollback();
    console.error('Error updating toefl listening question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;

    // Delete answers first
    await sequelize.query(
      `DELETE FROM toefl_listening_test_question_answers WHERE toefl_listening_test_question_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
        transaction: t,
      }
    );

    // Delete question
    await sequelize.query(
      `DELETE FROM toefl_listening_test_question WHERE id = :id`,
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
    console.error('Error deleting toefl listening question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
