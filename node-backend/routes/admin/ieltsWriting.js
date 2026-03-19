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
            where += ' AND iwl.name LIKE :q';
            replacements.q = `%${filter.q}%`;
        }

        if (filter.ids && filter.ids.length > 0) {
            where += ' AND iw.id IN (:ids)';
            replacements.ids = filter.ids;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM ielts_writing iw
            LEFT JOIN ielts_writing_label iwl ON iw.id = iwl.ielts_writing_id AND iwl.language_id = 1
            WHERE 1=1 ${where}
        `;

        const dataQuery = `
            SELECT iw.id, iwl.name, iw.status, iw.sort_order, iw.created_date
            FROM ielts_writing iw
            LEFT JOIN ielts_writing_label iwl ON iw.id = iwl.ielts_writing_id AND iwl.language_id = 1
            WHERE 1=1 ${where}
            ORDER BY ${sortField === 'name' ? 'iwl.name' : 'iw.' + sortField} ${sortOrder}
            LIMIT :limit OFFSET :offset
        `;

        replacements.limit = perPage;
        replacements.offset = offset;

        const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
        const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

        res.set('Content-Range', `ielts-writing ${offset}-${offset + data.length}/${countResult.total}`);
        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.json(data);
    } catch (error) {
        console.error('Error fetching ielts writing list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT iw.id, iwl.name, iw.status, iw.sort_order, iw.created_date, iw.text
            FROM ielts_writing iw
            LEFT JOIN ielts_writing_label iwl ON iw.id = iwl.ielts_writing_id AND iwl.language_id = 1
            WHERE iw.id = :id
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
        console.error('Error fetching ielts writing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create
router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, status, sort_order, text } = req.body;

        const [result] = await sequelize.query(
            `INSERT INTO ielts_writing (status, sort_order, created_date, text)
             VALUES (:status, :sort_order, NOW(), :text)`,
            {
                replacements: {
                    status: status || 0,
                    sort_order: sort_order || 0,
                    text: text || null
                },
                type: QueryTypes.INSERT,
                transaction: t
            }
        );

        const insertId = result;

        await sequelize.query(
            `INSERT INTO ielts_writing_label (ielts_writing_id, language_id, name)
             VALUES (:ielts_writing_id, 1, :name)`,
            {
                replacements: { ielts_writing_id: insertId, name: name || '' },
                type: QueryTypes.INSERT,
                transaction: t
            }
        );

        await t.commit();

        res.json({ id: insertId, name, status, sort_order, text });
    } catch (error) {
        await t.rollback();
        console.error('Error creating ielts writing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, status, sort_order, text } = req.body;
        const id = req.params.id;

        await sequelize.query(
            `UPDATE ielts_writing SET status = :status, sort_order = :sort_order, text = :text
             WHERE id = :id`,
            {
                replacements: {
                    id,
                    status: status || 0,
                    sort_order: sort_order || 0,
                    text: text || null
                },
                type: QueryTypes.UPDATE,
                transaction: t
            }
        );

        await sequelize.query(
            `UPDATE ielts_writing_label SET name = :name
             WHERE ielts_writing_id = :id AND language_id = 1`,
            {
                replacements: { id, name: name || '' },
                type: QueryTypes.UPDATE,
                transaction: t
            }
        );

        await t.commit();

        res.json({ id: parseInt(id), name, status, sort_order, text });
    } catch (error) {
        await t.rollback();
        console.error('Error updating ielts writing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;

        await sequelize.query(
            'DELETE FROM ielts_writing_label WHERE ielts_writing_id = :id',
            { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
        );

        await sequelize.query(
            'DELETE FROM ielts_writing WHERE id = :id',
            { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
        );

        await t.commit();

        res.json({ id: parseInt(id) });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting ielts writing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
