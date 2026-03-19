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
            where += ' AND irl.name LIKE :q';
            replacements.q = `%${filter.q}%`;
        }

        if (filter.ids && filter.ids.length > 0) {
            where += ' AND ir.id IN (:ids)';
            replacements.ids = filter.ids;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM ielts_reading ir
            LEFT JOIN ielts_reading_label irl ON ir.id = irl.ielts_reading_id AND irl.language_id = 1
            WHERE 1=1 ${where}
        `;

        const dataQuery = `
            SELECT ir.id, irl.name, ir.status, ir.sort_order, ir.created_date
            FROM ielts_reading ir
            LEFT JOIN ielts_reading_label irl ON ir.id = irl.ielts_reading_id AND irl.language_id = 1
            WHERE 1=1 ${where}
            ORDER BY ${sortField === 'name' ? 'irl.name' : 'ir.' + sortField} ${sortOrder}
            LIMIT :limit OFFSET :offset
        `;

        replacements.limit = perPage;
        replacements.offset = offset;

        const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
        const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

        res.set('Content-Range', `ielts-reading ${offset}-${offset + data.length}/${countResult.total}`);
        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.json(data);
    } catch (error) {
        console.error('Error fetching ielts reading list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT ir.id, irl.name, ir.status, ir.sort_order, ir.created_date,
                   ir.reading_text, ir.explain_text
            FROM ielts_reading ir
            LEFT JOIN ielts_reading_label irl ON ir.id = irl.ielts_reading_id AND irl.language_id = 1
            WHERE ir.id = :id
        `;

        const [result] = await sequelize.query(query, {
            replacements: { id: req.params.id },
            type: QueryTypes.SELECT
        });

        if (!result) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.json(result);
    } catch (error) {
        console.error('Error fetching ielts reading:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create
router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, status, sort_order, reading_text, explain_text } = req.body;

        const [result] = await sequelize.query(
            `INSERT INTO ielts_reading (status, sort_order, created_date, reading_text, explain_text)
             VALUES (:status, :sort_order, NOW(), :reading_text, :explain_text)`,
            {
                replacements: { status: status || 0, sort_order: sort_order || 0, reading_text: reading_text || null, explain_text: explain_text || null },
                type: QueryTypes.INSERT,
                transaction: t
            }
        );

        const insertId = result;

        await sequelize.query(
            `INSERT INTO ielts_reading_label (ielts_reading_id, language_id, name)
             VALUES (:ielts_reading_id, 1, :name)`,
            {
                replacements: { ielts_reading_id: insertId, name: name || '' },
                type: QueryTypes.INSERT,
                transaction: t
            }
        );

        await t.commit();

        res.json({ id: insertId, name, status, sort_order, reading_text, explain_text });
    } catch (error) {
        await t.rollback();
        console.error('Error creating ielts reading:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, status, sort_order, reading_text, explain_text } = req.body;
        const id = req.params.id;

        await sequelize.query(
            `UPDATE ielts_reading SET status = :status, sort_order = :sort_order,
             reading_text = :reading_text, explain_text = :explain_text
             WHERE id = :id`,
            {
                replacements: { id, status: status || 0, sort_order: sort_order || 0, reading_text: reading_text || null, explain_text: explain_text || null },
                type: QueryTypes.UPDATE,
                transaction: t
            }
        );

        await sequelize.query(
            `UPDATE ielts_reading_label SET name = :name
             WHERE ielts_reading_id = :id AND language_id = 1`,
            {
                replacements: { id, name: name || '' },
                type: QueryTypes.UPDATE,
                transaction: t
            }
        );

        await t.commit();

        res.json({ id: parseInt(id), name, status, sort_order, reading_text, explain_text });
    } catch (error) {
        await t.rollback();
        console.error('Error updating ielts reading:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;

        await sequelize.query(
            'DELETE FROM ielts_reading_label WHERE ielts_reading_id = :id',
            { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
        );

        await sequelize.query(
            'DELETE FROM ielts_reading WHERE id = :id',
            { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
        );

        await t.commit();

        res.json({ id: parseInt(id) });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting ielts reading:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
