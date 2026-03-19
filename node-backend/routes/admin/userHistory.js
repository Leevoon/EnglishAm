const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'user_id', 'user_name', 'test_id', 'test_type', 'section', 'duration', 'score', 'score_from', 'created_date'];

const buildQuery = (req) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
    const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'created_date';
    const sortOrder = req.query.sortOrder === 'ASC' ? 'ASC' : 'DESC';
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
            whereClause += ' AND uh.id = :id';
            replacements.id = filter.id;
        }
        if (filter.user_id) {
            whereClause += ' AND uh.user_id = :user_id';
            replacements.user_id = filter.user_id;
        }
        if (filter.test_type) {
            whereClause += ' AND uh.test_type = :test_type';
            replacements.test_type = filter.test_type;
        }
        if (filter.test_id) {
            whereClause += ' AND uh.test_id = :test_id';
            replacements.test_id = filter.test_id;
        }
        if (filter.section) {
            whereClause += ' AND uh.section = :section';
            replacements.section = filter.section;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM user_history uh
            LEFT JOIN user u ON u.id = uh.user_id
            WHERE 1=1 ${whereClause}
        `;

        const dataQuery = `
            SELECT uh.id, uh.user_id, u.name as user_name, uh.test_id, uh.test_type,
                   uh.section, uh.duration, uh.score, uh.score_from, uh.created_date
            FROM user_history uh
            LEFT JOIN user u ON u.id = uh.user_id
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
        console.error('Error fetching user history list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT uh.id, uh.user_id, u.name as user_name, uh.test_id, uh.test_type,
                   uh.section, uh.duration, uh.score, uh.score_from, uh.created_date
            FROM user_history uh
            LEFT JOIN user u ON u.id = uh.user_id
            WHERE uh.id = :id
        `;

        const [result] = await sequelize.query(query, {
            replacements: { id: req.params.id },
            type: QueryTypes.SELECT
        });

        if (!result) {
            return res.status(404).json({ error: 'User history record not found' });
        }

        res.json({ data: result });
    } catch (error) {
        console.error('Error fetching user history record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
