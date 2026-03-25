const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['membership_id', 'test_id', 'type', 'membership_name'];

const buildQuery = (req) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
    const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'mht.membership_id';
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
            SELECT CONCAT(mht.membership_id, '-', mht.test_id, '-', mht.type) as id,
                   mht.membership_id, mht.test_id, mht.type,
                   ml.title as membership_name, m.vip as membership_vip
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

// GET single - id is "membership_id-test_id-type"
router.get('/:id', async (req, res) => {
    try {
        const parts = req.params.id.split('-');
        if (parts.length < 3) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const [membership_id, test_id, type] = parts;

        const query = `
            SELECT CONCAT(mht.membership_id, '-', mht.test_id, '-', mht.type) as id,
                   mht.membership_id, mht.test_id, mht.type,
                   ml.title as membership_name, m.vip as membership_vip
            FROM membership_has_test mht
            LEFT JOIN membership m ON m.id = mht.membership_id
            LEFT JOIN membership_label ml ON ml.membership_id = m.id AND ml.language_id = 1
            WHERE mht.membership_id = :membership_id AND mht.test_id = :test_id AND mht.type = :type
        `;

        const [result] = await sequelize.query(query, {
            replacements: { membership_id, test_id, type },
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

        await sequelize.query(
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

        const id = `${membership_id}-${test_id}-${type}`;

        res.status(201).json({ data: { id, membership_id, test_id, type } });
    } catch (error) {
        console.error('Error creating membership assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update - id is "membership_id-test_id-type"
router.put('/:id', async (req, res) => {
    try {
        const parts = req.params.id.split('-');
        if (parts.length < 3) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const [old_membership_id, old_test_id, old_type] = parts;
        const { membership_id, test_id, type } = req.body;

        // Delete old and insert new (no PK to update by)
        await sequelize.query(
            `DELETE FROM membership_has_test WHERE membership_id = :old_mid AND test_id = :old_tid AND type = :old_type`,
            {
                replacements: { old_mid: old_membership_id, old_tid: old_test_id, old_type },
                type: QueryTypes.DELETE
            }
        );

        await sequelize.query(
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

        const id = `${membership_id}-${test_id}-${type}`;
        res.json({ data: { id, membership_id, test_id, type } });
    } catch (error) {
        console.error('Error updating membership assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE - id is "membership_id-test_id-type"
router.delete('/:id', async (req, res) => {
    try {
        const parts = req.params.id.split('-');
        if (parts.length < 3) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const [membership_id, test_id, type] = parts;

        await sequelize.query(
            `DELETE FROM membership_has_test WHERE membership_id = :membership_id AND test_id = :test_id AND type = :type`,
            {
                replacements: { membership_id, test_id, type },
                type: QueryTypes.DELETE
            }
        );

        res.json({ data: { id: req.params.id } });
    } catch (error) {
        console.error('Error deleting membership assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
