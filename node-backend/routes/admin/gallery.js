const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'image', 'status', 'created_date'];

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
            whereClause += ' AND g.id = :id';
            replacements.id = filter.id;
        }
        if (filter.status !== undefined && filter.status !== '') {
            whereClause += ' AND g.status = :status';
            replacements.status = filter.status;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM gallery g
            WHERE 1=1 ${whereClause}
        `;

        const dataQuery = `
            SELECT g.id, g.image, g.status, g.created_date
            FROM gallery g
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
        console.error('Error fetching gallery list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT g.id, g.image, g.status, g.created_date
            FROM gallery g
            WHERE g.id = :id
        `;

        const [result] = await sequelize.query(query, {
            replacements: { id: req.params.id },
            type: QueryTypes.SELECT
        });

        if (!result) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        res.json({ data: result });
    } catch (error) {
        console.error('Error fetching gallery item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create
router.post('/', async (req, res) => {
    try {
        const { image, status } = req.body;

        const [result] = await sequelize.query(
            `INSERT INTO gallery (image, status, created_date) VALUES (:image, :status, NOW())`,
            {
                replacements: { image: image || null, status: status !== undefined ? status : 1 },
                type: QueryTypes.INSERT
            }
        );

        const id = result;

        res.status(201).json({ data: { id, image, status } });
    } catch (error) {
        console.error('Error creating gallery item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    try {
        const { image, status } = req.body;
        const id = req.params.id;

        await sequelize.query(
            `UPDATE gallery SET image = :image, status = :status WHERE id = :id`,
            {
                replacements: { id, image: image || null, status: status !== undefined ? status : 1 },
                type: QueryTypes.UPDATE
            }
        );

        res.json({ data: { id, image, status } });
    } catch (error) {
        console.error('Error updating gallery item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await sequelize.query(
            `DELETE FROM gallery WHERE id = :id`,
            {
                replacements: { id },
                type: QueryTypes.DELETE
            }
        );

        res.json({ data: { id } });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
