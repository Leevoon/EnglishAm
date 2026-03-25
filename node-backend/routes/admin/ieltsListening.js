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
            where += ' AND ill.name LIKE :q';
            replacements.q = `%${filter.q}%`;
        }

        if (filter.ids && filter.ids.length > 0) {
            where += ' AND il.id IN (:ids)';
            replacements.ids = filter.ids;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM ielts_listening il
            LEFT JOIN ielts_listening_label ill ON il.id = ill.ielts_listening_id AND ill.language_id = 1
            WHERE 1=1 ${where}
        `;

        const dataQuery = `
            SELECT il.id, ill.name, il.status, il.sort_order, il.created_date,
                   COALESCE(rl.required_level, 0) as required_level
            FROM ielts_listening il
            LEFT JOIN ielts_listening_label ill ON il.id = ill.ielts_listening_id AND ill.language_id = 1
            LEFT JOIN (
              SELECT mht.test_id,
                CASE WHEN MAX(m.vip) = 1 THEN 2 ELSE 1 END as required_level
              FROM membership_has_test mht
              JOIN membership m ON mht.membership_id = m.id
              WHERE mht.type = 6 AND m.status = 1
              GROUP BY mht.test_id
            ) rl ON rl.test_id = il.id
            WHERE 1=1 ${where}
            ORDER BY ${sortField === 'name' ? 'ill.name' : 'il.' + sortField} ${sortOrder}
            LIMIT :limit OFFSET :offset
        `;

        replacements.limit = perPage;
        replacements.offset = offset;

        const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
        const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

        res.set('Content-Range', `ielts-listening ${offset}-${offset + data.length}/${countResult.total}`);
        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.json(data);
    } catch (error) {
        console.error('Error fetching ielts listening list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT il.id, ill.name, il.status, il.sort_order, il.created_date,
                   il.listening_audio, il.image,
                   COALESCE(rl.required_level, 0) as required_level
            FROM ielts_listening il
            LEFT JOIN ielts_listening_label ill ON il.id = ill.ielts_listening_id AND ill.language_id = 1
            LEFT JOIN (
              SELECT mht.test_id,
                CASE WHEN MAX(m.vip) = 1 THEN 2 ELSE 1 END as required_level
              FROM membership_has_test mht
              JOIN membership m ON mht.membership_id = m.id
              WHERE mht.type = 6 AND m.status = 1
              GROUP BY mht.test_id
            ) rl ON rl.test_id = il.id
            WHERE il.id = :id
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
        console.error('Error fetching ielts listening:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create
router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, status, sort_order, listening_audio, image } = req.body;

        const [result] = await sequelize.query(
            `INSERT INTO ielts_listening (status, sort_order, created_date, listening_audio, image)
             VALUES (:status, :sort_order, NOW(), :listening_audio, :image)`,
            {
                replacements: {
                    status: status || 0,
                    sort_order: sort_order || 0,
                    listening_audio: listening_audio || null,
                    image: image || null
                },
                type: QueryTypes.INSERT,
                transaction: t
            }
        );

        const insertId = result;

        await sequelize.query(
            `INSERT INTO ielts_listening_label (ielts_listening_id, language_id, name)
             VALUES (:ielts_listening_id, 1, :name)`,
            {
                replacements: { ielts_listening_id: insertId, name: name || '' },
                type: QueryTypes.INSERT,
                transaction: t
            }
        );

        await t.commit();

        res.json({ id: insertId, name, status, sort_order, listening_audio, image });
    } catch (error) {
        await t.rollback();
        console.error('Error creating ielts listening:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, status, sort_order, listening_audio, image, required_level } = req.body;
        const id = req.params.id;

        await sequelize.query(
            `UPDATE ielts_listening SET status = :status, sort_order = :sort_order,
             listening_audio = :listening_audio, image = :image
             WHERE id = :id`,
            {
                replacements: {
                    id,
                    status: status || 0,
                    sort_order: sort_order || 0,
                    listening_audio: listening_audio || null,
                    image: image || null
                },
                type: QueryTypes.UPDATE,
                transaction: t
            }
        );

        await sequelize.query(
            `UPDATE ielts_listening_label SET name = :name
             WHERE ielts_listening_id = :id AND language_id = 1`,
            {
                replacements: { id, name: name || '' },
                type: QueryTypes.UPDATE,
                transaction: t
            }
        );

        // Update required access level
        if (required_level !== undefined) {
            await sequelize.query(
                `DELETE FROM membership_has_test WHERE test_id = :id AND type = 6`,
                { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
            );
            if (parseInt(required_level) > 0) {
                const [membership] = await sequelize.query(
                    `SELECT id FROM membership WHERE vip = :vip AND status = 1 ORDER BY id ASC LIMIT 1`,
                    { replacements: { vip: parseInt(required_level) >= 2 ? 1 : 0 }, type: QueryTypes.SELECT, transaction: t }
                );
                if (membership) {
                    await sequelize.query(
                        `INSERT INTO membership_has_test (membership_id, test_id, type) VALUES (:membership_id, :test_id, 6)`,
                        { replacements: { membership_id: membership.id, test_id: id }, type: QueryTypes.INSERT, transaction: t }
                    );
                }
            }
        }

        await t.commit();

        res.json({ id: parseInt(id), name, status, sort_order, listening_audio, image, required_level: parseInt(required_level) || 0 });
    } catch (error) {
        await t.rollback();
        console.error('Error updating ielts listening:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;

        await sequelize.query(
            'DELETE FROM ielts_listening_label WHERE ielts_listening_id = :id',
            { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
        );

        await sequelize.query(
            'DELETE FROM ielts_listening WHERE id = :id',
            { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
        );

        await t.commit();

        res.json({ id: parseInt(id) });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting ielts listening:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
