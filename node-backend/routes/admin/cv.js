const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'cv_name', 'status', 'sort_order', 'created_date'];

const buildQuery = (req) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
    const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'sort_order';
    const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    return { page, perPage, sortField, sortOrder, filter };
};

// GET list
router.get('/', async (req, res) => {
    try {
        const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
        const offset = (page - 1) * perPage;

        let whereClause = '';
        const replacements = {};

        if (filter.id) {
            whereClause += ' AND id = :id';
            replacements.id = filter.id;
        }
        if (filter.status !== undefined && filter.status !== '') {
            whereClause += ' AND status = :status';
            replacements.status = filter.status;
        }
        if (filter.q) {
            whereClause += ' AND cv_name LIKE :q';
            replacements.q = `%${filter.q}%`;
        }

        const countQuery = `SELECT COUNT(*) AS total FROM cv_templates WHERE 1=1 ${whereClause}`;
        const dataQuery = `
            SELECT id, cv_name, status, sort_order, created_date
            FROM cv_templates
            WHERE 1=1 ${whereClause}
            ORDER BY ${sortField} ${sortOrder}, id ASC
            LIMIT :limit OFFSET :offset
        `;
        replacements.limit = perPage;
        replacements.offset = offset;

        const [countResult] = await sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT });
        const data = await sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT });

        res.json({ data, total: countResult.total, page, perPage });
    } catch (error) {
        console.error('Error fetching cv list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET one
router.get('/:id', async (req, res) => {
    try {
        const [result] = await sequelize.query(
            `SELECT id, cv_name, status, sort_order, created_date FROM cv_templates WHERE id = :id`,
            { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
        );
        if (!result) return res.status(404).json({ error: 'CV template not found' });
        res.json({ data: result });
    } catch (error) {
        console.error('Error fetching cv template:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create
router.post('/', async (req, res) => {
    try {
        const { cv_name, status, sort_order } = req.body;
        const [insertId] = await sequelize.query(
            `INSERT INTO cv_templates (cv_name, status, sort_order, created_date)
             VALUES (:cv_name, :status, :sort_order, NOW())`,
            {
                replacements: {
                    cv_name: cv_name || '',
                    status: status !== undefined ? status : 1,
                    sort_order: sort_order !== undefined ? sort_order : 0,
                },
                type: QueryTypes.INSERT,
            }
        );
        res.status(201).json({ data: { id: insertId, cv_name, status, sort_order } });
    } catch (error) {
        console.error('Error creating cv template:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    try {
        const { cv_name, status, sort_order } = req.body;
        const id = req.params.id;
        await sequelize.query(
            `UPDATE cv_templates
             SET cv_name = :cv_name, status = :status, sort_order = :sort_order
             WHERE id = :id`,
            {
                replacements: {
                    id,
                    cv_name: cv_name || '',
                    status: status !== undefined ? status : 1,
                    sort_order: sort_order !== undefined ? sort_order : 0,
                },
                type: QueryTypes.UPDATE,
            }
        );
        res.json({ data: { id, cv_name, status, sort_order } });
    } catch (error) {
        console.error('Error updating cv template:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await sequelize.query(`DELETE FROM cv_templates WHERE id = :id`, {
            replacements: { id },
            type: QueryTypes.DELETE,
        });
        res.json({ data: { id } });
    } catch (error) {
        console.error('Error deleting cv template:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
