const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'name', 'price', 'vip', 'status', 'sort_ortder'];

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
            whereClause += ' AND m.id = :id';
            replacements.id = filter.id;
        }
        if (filter.status !== undefined && filter.status !== '') {
            whereClause += ' AND m.status = :status';
            replacements.status = filter.status;
        }
        if (filter.name) {
            whereClause += ' AND ml.title LIKE :name';
            replacements.name = `%${filter.name}%`;
        }
        if (filter.vip !== undefined && filter.vip !== '') {
            whereClause += ' AND m.vip = :vip';
            replacements.vip = filter.vip;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM membership m
            LEFT JOIN membership_label ml ON ml.membership_id = m.id AND ml.language_id = 1
            WHERE 1=1 ${whereClause}
        `;

        const dataQuery = `
            SELECT m.id, ml.title as name, m.price, m.vip, m.status, m.sort_ortder
            FROM membership m
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
        console.error('Error fetching membership plans list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT m.id, ml.title as name, m.price, m.vip, m.status, m.sort_ortder, ml.description
            FROM membership m
            LEFT JOIN membership_label ml ON ml.membership_id = m.id AND ml.language_id = 1
            WHERE m.id = :id
        `;

        const [result] = await sequelize.query(query, {
            replacements: { id: req.params.id },
            type: QueryTypes.SELECT
        });

        if (!result) {
            return res.status(404).json({ error: 'Membership plan not found' });
        }

        res.json({ data: result });
    } catch (error) {
        console.error('Error fetching membership plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create
router.post('/', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, description, price, vip, status, sort_ortder } = req.body;

        const [membershipResult] = await sequelize.query(
            `INSERT INTO membership (price, vip, status, sort_ortder) VALUES (:price, :vip, :status, :sort_ortder)`,
            {
                replacements: {
                    price: price || 0,
                    vip: vip || 0,
                    status: status !== undefined ? status : 1,
                    sort_ortder: sort_ortder || 0
                },
                type: QueryTypes.INSERT,
                transaction
            }
        );

        const membershipId = membershipResult;

        await sequelize.query(
            `INSERT INTO membership_label (membership_id, language_id, title, description) VALUES (:membership_id, 1, :name, :description)`,
            {
                replacements: { membership_id: membershipId, name: name || '', description: description || '' },
                type: QueryTypes.INSERT,
                transaction
            }
        );

        await transaction.commit();

        res.status(201).json({ data: { id: membershipId, name, description, price, vip, status, sort_ortder } });
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating membership plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, description, price, vip, status, sort_ortder } = req.body;
        const id = req.params.id;

        await sequelize.query(
            `UPDATE membership SET price = :price, vip = :vip, status = :status, sort_ortder = :sort_ortder WHERE id = :id`,
            {
                replacements: {
                    id,
                    price: price || 0,
                    vip: vip || 0,
                    status: status !== undefined ? status : 1,
                    sort_ortder: sort_ortder || 0
                },
                type: QueryTypes.UPDATE,
                transaction
            }
        );

        const [existingLabel] = await sequelize.query(
            `SELECT id FROM membership_label WHERE membership_id = :membership_id AND language_id = 1`,
            {
                replacements: { membership_id: id },
                type: QueryTypes.SELECT,
                transaction
            }
        );

        if (existingLabel) {
            await sequelize.query(
                `UPDATE membership_label SET title = :name, description = :description WHERE membership_id = :membership_id AND language_id = 1`,
                {
                    replacements: { membership_id: id, name: name || '', description: description || '' },
                    type: QueryTypes.UPDATE,
                    transaction
                }
            );
        } else {
            await sequelize.query(
                `INSERT INTO membership_label (membership_id, language_id, title, description) VALUES (:membership_id, 1, :name, :description)`,
                {
                    replacements: { membership_id: id, name: name || '', description: description || '' },
                    type: QueryTypes.INSERT,
                    transaction
                }
            );
        }

        await transaction.commit();

        res.json({ data: { id, name, description, price, vip, status, sort_ortder } });
    } catch (error) {
        await transaction.rollback();
        console.error('Error updating membership plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const id = req.params.id;

        await sequelize.query(
            `DELETE FROM membership_label WHERE membership_id = :id`,
            {
                replacements: { id },
                type: QueryTypes.DELETE,
                transaction
            }
        );

        await sequelize.query(
            `DELETE FROM membership WHERE id = :id`,
            {
                replacements: { id },
                type: QueryTypes.DELETE,
                transaction
            }
        );

        await transaction.commit();

        res.json({ data: { id } });
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting membership plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
