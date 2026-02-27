const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortField = req.query.sortField || 'id';
  const sortOrder = req.query.sortOrder || 'ASC';
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
      whereClause = 'WHERE tl.question LIKE :search';
      replacements.search = `%${filter.q}%`;
    }

    if (filter.test_category_id) {
      whereClause = whereClause 
        ? `${whereClause} AND t.test_category_id = :test_category_id`
        : 'WHERE t.test_category_id = :test_category_id';
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
      SELECT t.*, tl.question, tl.explanation,
             tcl.name as category_name,
             tll.name as level_name
      FROM test t
      LEFT JOIN test_label tl ON t.id = tl.test_id AND tl.language_id = 1
      LEFT JOIN test_category tc ON t.test_category_id = tc.id
      LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = 1
      LEFT JOIN test_level tlv ON t.test_level_id = tlv.id
      LEFT JOIN test_level_label tll ON tlv.id = tll.test_level_id AND tll.language_id = 1
      ${whereClause}
      ORDER BY t.${sortField} ${sortOrder}
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
      SELECT t.*, tl.question, tl.explanation
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

    // Get answers
    const answers = await sequelize.query(`
      SELECT ta.*, tal.name as answer_text
      FROM test_answer ta
      LEFT JOIN test_answer_label tal ON ta.id = tal.test_answer_id AND tal.language_id = 1
      WHERE ta.test_id = :test_id
      ORDER BY ta.sort_order ASC
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
      question, explanation, test_category_id, test_level_id, 
      status = 1, sort_order = 0, image, audio, answers = []
    } = req.body;

    const [result] = await sequelize.query(`
      INSERT INTO test (test_category_id, test_level_id, status, sort_order, image, audio, created_date)
      VALUES (:test_category_id, :test_level_id, :status, :sort_order, :image, :audio, NOW())
    `, {
      replacements: { 
        test_category_id, test_level_id, status, sort_order, 
        image: image || null, audio: audio || null 
      },
      type: QueryTypes.INSERT,
      transaction: t
    });

    const testId = result;

    // Insert test label
    await sequelize.query(`
      INSERT INTO test_label (test_id, language_id, question, explanation)
      VALUES (:test_id, 1, :question, :explanation)
    `, {
      replacements: { test_id: testId, question, explanation: explanation || '' },
      type: QueryTypes.INSERT,
      transaction: t
    });

    // Insert answers
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const [answerResult] = await sequelize.query(`
        INSERT INTO test_answer (test_id, is_correct, sort_order)
        VALUES (:test_id, :is_correct, :sort_order)
      `, {
        replacements: { 
          test_id: testId, 
          is_correct: answer.is_correct ? 1 : 0, 
          sort_order: i 
        },
        type: QueryTypes.INSERT,
        transaction: t
      });

      await sequelize.query(`
        INSERT INTO test_answer_label (test_answer_id, language_id, name)
        VALUES (:test_answer_id, 1, :name)
      `, {
        replacements: { test_answer_id: answerResult, name: answer.text },
        type: QueryTypes.INSERT,
        transaction: t
      });
    }

    await t.commit();
    res.json({ id: testId, question, test_category_id, test_level_id });
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
      question, explanation, test_category_id, test_level_id, 
      status, sort_order, image, audio, answers
    } = req.body;
    const id = req.params.id;

    // Update test
    await sequelize.query(`
      UPDATE test 
      SET test_category_id = COALESCE(:test_category_id, test_category_id),
          test_level_id = COALESCE(:test_level_id, test_level_id),
          status = COALESCE(:status, status),
          sort_order = COALESCE(:sort_order, sort_order),
          image = COALESCE(:image, image),
          audio = COALESCE(:audio, audio)
      WHERE id = :id
    `, {
      replacements: { id, test_category_id, test_level_id, status, sort_order, image, audio },
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
        SET question = COALESCE(:question, question),
            explanation = COALESCE(:explanation, explanation)
        WHERE test_id = :id AND language_id = 1
      `, { replacements: { id, question, explanation }, type: QueryTypes.UPDATE, transaction: t });
    } else {
      await sequelize.query(`
        INSERT INTO test_label (test_id, language_id, question, explanation)
        VALUES (:id, 1, :question, :explanation)
      `, { replacements: { id, question: question || '', explanation: explanation || '' }, type: QueryTypes.INSERT, transaction: t });
    }

    // Update answers if provided
    if (answers && Array.isArray(answers)) {
      // Delete existing answers
      const existingAnswers = await sequelize.query(`
        SELECT id FROM test_answer WHERE test_id = :id
      `, { replacements: { id }, type: QueryTypes.SELECT, transaction: t });

      for (const answer of existingAnswers) {
        await sequelize.query(`DELETE FROM test_answer_label WHERE test_answer_id = :id`, {
          replacements: { id: answer.id }, type: QueryTypes.DELETE, transaction: t
        });
      }
      await sequelize.query(`DELETE FROM test_answer WHERE test_id = :id`, {
        replacements: { id }, type: QueryTypes.DELETE, transaction: t
      });

      // Insert new answers
      for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        const [answerResult] = await sequelize.query(`
          INSERT INTO test_answer (test_id, is_correct, sort_order)
          VALUES (:test_id, :is_correct, :sort_order)
        `, {
          replacements: { test_id: id, is_correct: answer.is_correct ? 1 : 0, sort_order: i },
          type: QueryTypes.INSERT,
          transaction: t
        });

        await sequelize.query(`
          INSERT INTO test_answer_label (test_answer_id, language_id, name)
          VALUES (:test_answer_id, 1, :name)
        `, {
          replacements: { test_answer_id: answerResult, name: answer.text },
          type: QueryTypes.INSERT,
          transaction: t
        });
      }
    }

    await t.commit();
    res.json({ id, question, test_category_id, test_level_id });
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

    // Delete answer labels and answers
    const answers = await sequelize.query(`SELECT id FROM test_answer WHERE test_id = :id`, {
      replacements: { id }, type: QueryTypes.SELECT, transaction: t
    });

    for (const answer of answers) {
      await sequelize.query(`DELETE FROM test_answer_label WHERE test_answer_id = :id`, {
        replacements: { id: answer.id }, type: QueryTypes.DELETE, transaction: t
      });
    }

    await sequelize.query(`DELETE FROM test_answer WHERE test_id = :id`, {
      replacements: { id }, type: QueryTypes.DELETE, transaction: t
    });

    await sequelize.query(`DELETE FROM test_label WHERE test_id = :id`, {
      replacements: { id }, type: QueryTypes.DELETE, transaction: t
    });

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

