const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'membership_id', 'test_id', 'type', 'membership_name', 'membership_level'];

const buildQuery = (req) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
    const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'id';
    const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    return { page, perPage, sortField, sortOrder, filter };
};

// GET list with pagination, sorting, and filtering
router.get('/', async (req, res) => {
    try {
        const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
        const offset = (page - 1) * perPage;

        let whereClause = '';
        const replacements = {};

        if (filter.id) {
            whereClause += ' AND mht.id = :id';
            replacements.id = filter.id;
        }
        if (filter.membership_id) {
            whereClause += ' AND mht.membership_id = :membership_id';
            replacements.membership_id = filter.membership_id;
        }
        if (filter.test_id) {
            whereClause += ' AND mht.test_id = :test_id';
            replacements.test_id = filter.test_id;
        }
        if (filter.type) {
            whereClause += ' AND mht.type = :type';
            replacements.type = filter.type;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM membership_has_test mht
            LEFT JOIN membership m ON m.id = mht.membership_id
            LEFT JOIN membership_label ml ON ml.membership_id = m.id AND ml.language_id = 1
            WHERE 1=1 ${whereClause}
        `;

        const dataQuery = `
            SELECT mht.id, mht.membership_id, mht.test_id, mht.type,
                   ml.name as membership_name, m.level as membership_level
            FROM membership_has_test mht
            LEFT JOIN membership m ON m.id = mht.membership_id
            LEFT JOIN membership_label ml ON ml.membership_id = m.id AND ml.language_id = 1
            WHERE 1=1 ${whereClause}
            ORDER BY ${sortField} ${sortOrder}
            LIMIT :limit OFFSET :offset
        `;

        replacements.limit = perPage;
        replacements.offset = offset;

        const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
        const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

        res.json({
            data,
            total: countResult.total,
            page,
            perPage
        });
    } catch (error) {
        console.error('Error fetching memberships list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT mht.id, mht.membership_id, mht.test_id, mht.type,
                   ml.name as membership_name, m.level as membership_level
            FROM membership_has_test mht
            LEFT JOIN membership m ON m.id = mht.membership_id
            LEFT JOIN membership_label ml ON ml.membership_id = m.id AND ml.language_id = 1
            WHERE mht.id = :id
        `;

        const [result] = await sequelize.query(query, {
            replacements: { id: req.params.id },
            type: QueryTypes.SELECT
        });

        if (!result) {
            return res.status(404).json({ error: 'Membership assignment not found' });
        }

        res.json({ data: result });
    } catch (error) {
        console.error('Error fetching membership assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create
router.post('/', async (req, res) => {
    try {
        const { membership_id, test_id, type } = req.body;

        const [result] = await sequelize.query(
            `INSERT INTO membership_has_test (membership_id, test_id, type) VALUES (:membership_id, :test_id, :type)`,
            {
                replacements: {
                    membership_id: membership_id || null,
                    test_id: test_id || null,
                    type: type || null
                },
                type: QueryTypes.INSERT
            }
        );

        const id = result;

        res.status(201).json({ data: { id, membership_id, test_id, type } });
    } catch (error) {
        console.error('Error creating membership assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    try {
        const { membership_id, test_id, type } = req.body;
        const id = req.params.id;

        await sequelize.query(
            `UPDATE membership_has_test SET membership_id = :membership_id, test_id = :test_id, type = :type WHERE id = :id`,
            {
                replacements: {
                    id,
                    membership_id: membership_id || null,
                    test_id: test_id || null,
                    type: type || null
                },
                type: QueryTypes.UPDATE
            }
        );

        res.json({ data: { id, membership_id, test_id, type } });
    } catch (error) {
        console.error('Error updating membership assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await sequelize.query(
            `DELETE FROM membership_has_test WHERE id = :id`,
            {
                replacements: { id },
                type: QueryTypes.DELETE
            }
        );

        res.json({ data: { id } });
    } catch (error) {
        console.error('Error deleting membership assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
