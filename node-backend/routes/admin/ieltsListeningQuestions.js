const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'ielts_listening_id', 'question', 'sort_order'];

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

        if (filter.ielts_listening_id) {
            where += ' AND ilq.ielts_listening_id = :ielts_listening_id';
            replacements.ielts_listening_id = filter.ielts_listening_id;
        }

        if (filter.q) {
            where += ' AND ilq.question LIKE :q';
            replacements.q = `%${filter.q}%`;
        }

        if (filter.ids && filter.ids.length > 0) {
            where += ' AND ilq.id IN (:ids)';
            replacements.ids = filter.ids;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM ielts_listening_question ilq
            WHERE 1=1 ${where}
        `;

        const dataQuery = `
            SELECT ilq.id, ilq.ielts_listening_id, ilq.question, ilq.sentences, ilq.listening_audio, ilq.sort_order,
                   (SELECT COUNT(*) FROM ielts_listening_question_answer WHERE ielts_reading_question_id = ilq.id) as answer_count
            FROM ielts_listening_question ilq
            WHERE 1=1 ${where}
            ORDER BY ilq.${sortField} ${sortOrder}
            LIMIT :limit OFFSET :offset
        `;

        replacements.limit = perPage;
        replacements.offset = offset;

        const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
        const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

        res.set('Content-Range', `ielts-listening-questions ${offset}-${offset + data.length}/${countResult.total}`);
        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.json(data);
    } catch (error) {
        console.error('Error fetching ielts listening questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT ilq.id, ilq.ielts_listening_id, ilq.question, ilq.sentences, ilq.listening_audio, ilq.sort_order
            FROM ielts_listening_question ilq
            WHERE ilq.id = :id
        `;

        const [result] = await sequelize.query(query, {
            replacements: { id: req.params.id },
            type: QueryTypes.SELECT
        });

        if (!result) {
            return res.status(404).json({ error: 'Not found' });
        }

        const answers = await sequelize.query(
            `SELECT id, ielts_reading_question_id as ielts_listening_question_id, answer, true_false
             FROM ielts_listening_question_answer
             WHERE ielts_reading_question_id = :id
             ORDER BY id ASC`,
            {
                replacements: { id: req.params.id },
                type: QueryTypes.SELECT
            }
        );

        result.answers = answers;

        res.json(result);
    } catch (error) {
        console.error('Error fetching ielts listening question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create
router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { ielts_listening_id, question, sentences, listening_audio, sort_order, answers } = req.body;

        const [result] = await sequelize.query(
            `INSERT INTO ielts_listening_question (ielts_listening_id, question, sentences, listening_audio, sort_order)
             VALUES (:ielts_listening_id, :question, :sentences, :listening_audio, :sort_order)`,
            {
                replacements: {
                    ielts_listening_id,
                    question: question || '',
                    sentences: sentences || null,
                    listening_audio: listening_audio || null,
                    sort_order: sort_order || 0
                },
                type: QueryTypes.INSERT,
                transaction: t
            }
        );

        const insertId = result;

        if (answers && answers.length > 0) {
            for (const answer of answers) {
                await sequelize.query(
                    `INSERT INTO ielts_listening_question_answer (ielts_reading_question_id, answer, true_false)
                     VALUES (:ielts_reading_question_id, :answer, :true_false)`,
                    {
                        replacements: {
                            ielts_reading_question_id: insertId,
                            answer: answer.answer || '',
                            true_false: answer.true_false || 0
                        },
                        type: QueryTypes.INSERT,
                        transaction: t
                    }
                );
            }
        }

        await t.commit();

        res.json({ id: insertId, ielts_listening_id, question, sentences, listening_audio, sort_order });
    } catch (error) {
        await t.rollback();
        console.error('Error creating ielts listening question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { ielts_listening_id, question, sentences, listening_audio, sort_order, answers } = req.body;
        const id = req.params.id;

        await sequelize.query(
            `UPDATE ielts_listening_question
             SET ielts_listening_id = :ielts_listening_id, question = :question,
                 sentences = :sentences, listening_audio = :listening_audio, sort_order = :sort_order
             WHERE id = :id`,
            {
                replacements: {
                    id,
                    ielts_listening_id,
                    question: question || '',
                    sentences: sentences || null,
                    listening_audio: listening_audio || null,
                    sort_order: sort_order || 0
                },
                type: QueryTypes.UPDATE,
                transaction: t
            }
        );

        // Delete old answers and insert new ones
        await sequelize.query(
            'DELETE FROM ielts_listening_question_answer WHERE ielts_reading_question_id = :id',
            { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
        );

        if (answers && answers.length > 0) {
            for (const answer of answers) {
                await sequelize.query(
                    `INSERT INTO ielts_listening_question_answer (ielts_reading_question_id, answer, true_false)
                     VALUES (:ielts_reading_question_id, :answer, :true_false)`,
                    {
                        replacements: {
                            ielts_reading_question_id: id,
                            answer: answer.answer || '',
                            true_false: answer.true_false || 0
                        },
                        type: QueryTypes.INSERT,
                        transaction: t
                    }
                );
            }
        }

        await t.commit();

        res.json({ id: parseInt(id), ielts_listening_id, question, sentences, listening_audio, sort_order });
    } catch (error) {
        await t.rollback();
        console.error('Error updating ielts listening question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;

        await sequelize.query(
            'DELETE FROM ielts_listening_question_answer WHERE ielts_reading_question_id = :id',
            { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
        );

        await sequelize.query(
            'DELETE FROM ielts_listening_question WHERE id = :id',
            { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
        );

        await t.commit();

        res.json({ id: parseInt(id) });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting ielts listening question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
