const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'question', 'status', 'sort_order', 'parent_id', 'created_date'];
const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
  const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'id';
  const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  return { page, perPage, sortField, sortOrder, filter };
};

// GET - List all tests
router.get('/', async (req, res) => {
  try {
    const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
    const offset = (page - 1) * perPage;

    let whereClause = '';
    const replacements = {};

    if (filter.q) {
      whereClause = 'WHERE (tl.value LIKE :search OR t.question LIKE :search)';
      replacements.search = `%${filter.q}%`;
    }

    if (filter.test_category_id) {
      whereClause = whereClause
        ? `${whereClause} AND t.parent_id = :test_category_id`
        : 'WHERE t.parent_id = :test_category_id';
      replacements.test_category_id = filter.test_category_id;
    }

    if (filter.ids) {
      const ids = JSON.parse(filter.ids);
      whereClause = whereClause ? `${whereClause} AND t.id IN (:ids)` : 'WHERE t.id IN (:ids)';
      replacements.ids = ids;
    }

    const [countResult] = await sequelize.query(`
      SELECT COUNT(DISTINCT t.id) as total
      FROM test t
      LEFT JOIN test_label tl ON t.id = tl.test_id AND tl.language_id = 1
      ${whereClause}
    `, { replacements, type: QueryTypes.SELECT });

    const data = await sequelize.query(`
      SELECT t.id, t.parent_id as test_category_id, t.status, t.sort_order, t.image, t.audio,
             COALESCE(tl.value, t.question) as question,
             tcl.name as category_name
      FROM test t
      LEFT JOIN test_label tl ON t.id = tl.test_id AND tl.language_id = 1
      LEFT JOIN test_category tc ON t.parent_id = tc.id
      LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = 1
      ${whereClause}
      ORDER BY t.${sortField === 'question' ? 'id' : sortField} ${sortOrder}
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { ...replacements, limit: perPage, offset },
      type: QueryTypes.SELECT
    });

    res.json({ data, total: countResult.total });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Get single test with answers
router.get('/:id', async (req, res) => {
  try {
    const [test] = await sequelize.query(`
      SELECT t.id, t.parent_id as test_category_id, t.status, t.sort_order, t.image, t.audio,
             COALESCE(tl.value, t.question) as question
      FROM test t
      LEFT JOIN test_label tl ON t.id = tl.test_id AND tl.language_id = 1
      WHERE t.id = :id
    `, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Get answers directly from test_answer (no separate label table)
    const answers = await sequelize.query(`
      SELECT ta.id, ta.value as text, ta.true_false as is_correct
      FROM test_answer ta
      WHERE ta.test_id = :test_id
      ORDER BY ta.id ASC
    `, {
      replacements: { test_id: req.params.id },
      type: QueryTypes.SELECT
    });

    test.answers = answers;
    res.json(test);
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Create test
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      question, test_category_id,
      status = 1, sort_order = 0, image, audio, answers = []
    } = req.body;

    const [result] = await sequelize.query(`
      INSERT INTO test (parent_id, status, sort_order, image, audio, question, created_date)
      VALUES (:parent_id, :status, :sort_order, :image, :audio, :question, NOW())
    `, {
      replacements: {
        parent_id: test_category_id || 0, status, sort_order,
        image: image || null, audio: audio || null, question: question || ''
      },
      type: QueryTypes.INSERT,
      transaction: t
    });

    const testId = result;

    // Insert test label
    await sequelize.query(`
      INSERT INTO test_label (test_id, language_id, value)
      VALUES (:test_id, 1, :value)
    `, {
      replacements: { test_id: testId, value: question || '' },
      type: QueryTypes.INSERT,
      transaction: t
    });

    // Insert answers
    for (const answer of answers) {
      await sequelize.query(`
        INSERT INTO test_answer (test_id, true_false, value)
        VALUES (:test_id, :true_false, :value)
      `, {
        replacements: {
          test_id: testId,
          true_false: answer.is_correct ? 1 : 0,
          value: answer.text || ''
        },
        type: QueryTypes.INSERT,
        transaction: t
      });
    }

    await t.commit();
    res.json({ id: testId, question, test_category_id, status, sort_order });
  } catch (error) {
    await t.rollback();
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update test
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      question, test_category_id,
      status, sort_order, image, audio, answers
    } = req.body;
    const id = req.params.id;

    // Update test
    await sequelize.query(`
      UPDATE test
      SET parent_id = COALESCE(:parent_id, parent_id),
          status = COALESCE(:status, status),
          sort_order = COALESCE(:sort_order, sort_order),
          image = COALESCE(:image, image),
          audio = COALESCE(:audio, audio),
          question = COALESCE(:question, question)
      WHERE id = :id
    `, {
      replacements: { id, parent_id: test_category_id, status, sort_order, image, audio, question },
      type: QueryTypes.UPDATE,
      transaction: t
    });

    // Update or insert label
    const [existingLabel] = await sequelize.query(`
      SELECT id FROM test_label WHERE test_id = :id AND language_id = 1
    `, { replacements: { id }, type: QueryTypes.SELECT, transaction: t });

    if (existingLabel) {
      await sequelize.query(`
        UPDATE test_label
        SET value = COALESCE(:value, value)
        WHERE test_id = :id AND language_id = 1
      `, { replacements: { id, value: question }, type: QueryTypes.UPDATE, transaction: t });
    } else {
      await sequelize.query(`
        INSERT INTO test_label (test_id, language_id, value)
        VALUES (:id, 1, :value)
      `, { replacements: { id, value: question || '' }, type: QueryTypes.INSERT, transaction: t });
    }

    // Update answers if provided
    if (answers && Array.isArray(answers)) {
      // Delete existing answers
      await sequelize.query(`DELETE FROM test_answer WHERE test_id = :id`, {
        replacements: { id }, type: QueryTypes.DELETE, transaction: t
      });

      // Insert new answers
      for (const answer of answers) {
        await sequelize.query(`
          INSERT INTO test_answer (test_id, true_false, value)
          VALUES (:test_id, :true_false, :value)
        `, {
          replacements: { test_id: id, true_false: answer.is_correct ? 1 : 0, value: answer.text || '' },
          type: QueryTypes.INSERT,
          transaction: t
        });
      }
    }

    await t.commit();
    res.json({ id, question, test_category_id, status, sort_order });
  } catch (error) {
    await t.rollback();
    console.error('Error updating test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Delete test
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const id = req.params.id;

    // Delete answers
    await sequelize.query(`DELETE FROM test_answer WHERE test_id = :id`, {
      replacements: { id }, type: QueryTypes.DELETE, transaction: t
    });

    // Delete label
    await sequelize.query(`DELETE FROM test_label WHERE test_id = :id`, {
      replacements: { id }, type: QueryTypes.DELETE, transaction: t
    });

    // Delete test
    await sequelize.query(`DELETE FROM test WHERE id = :id`, {
      replacements: { id }, type: QueryTypes.DELETE, transaction: t
    });

    await t.commit();
    res.json({ id });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
