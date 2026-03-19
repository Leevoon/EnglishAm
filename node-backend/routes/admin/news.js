const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'title', 'image', 'status', 'created_date'];

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
            whereClause += ' AND n.id = :id';
            replacements.id = filter.id;
        }
        if (filter.status !== undefined && filter.status !== '') {
            whereClause += ' AND n.status = :status';
            replacements.status = filter.status;
        }
        if (filter.title) {
            whereClause += ' AND nl.name LIKE :title';
            replacements.title = `%${filter.title}%`;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM news n
            LEFT JOIN news_label nl ON nl.news_id = n.id AND nl.language_id = 1
            WHERE 1=1 ${whereClause}
        `;

        const dataQuery = `
            SELECT n.id, nl.name as title, n.image, n.status, n.created_date
            FROM news n
            LEFT JOIN news_label nl ON nl.news_id = n.id AND nl.language_id = 1
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
        console.error('Error fetching news list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT n.id, nl.name as title, n.image, n.status, n.created_date, nl.value as content
            FROM news n
            LEFT JOIN news_label nl ON nl.news_id = n.id AND nl.language_id = 1
            WHERE n.id = :id
        `;

        const [result] = await sequelize.query(query, {
            replacements: { id: req.params.id },
            type: QueryTypes.SELECT
        });

        if (!result) {
            return res.status(404).json({ error: 'News not found' });
        }

        res.json({ data: result });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create
router.post('/', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { title, content, image, status } = req.body;

        const [newsResult] = await sequelize.query(
            `INSERT INTO news (image, status, created_date) VALUES (:image, :status, NOW())`,
            {
                replacements: { image: image || null, status: status !== undefined ? status : 1 },
                type: QueryTypes.INSERT,
                transaction
            }
        );

        const newsId = newsResult;

        await sequelize.query(
            `INSERT INTO news_label (news_id, language_id, name, value) VALUES (:news_id, 1, :name, :value)`,
            {
                replacements: { news_id: newsId, name: title || '', value: content || '' },
                type: QueryTypes.INSERT,
                transaction
            }
        );

        await transaction.commit();

        res.status(201).json({ data: { id: newsId, title, content, image, status } });
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating news:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { title, content, image, status } = req.body;
        const id = req.params.id;

        await sequelize.query(
            `UPDATE news SET image = :image, status = :status WHERE id = :id`,
            {
                replacements: { id, image: image || null, status: status !== undefined ? status : 1 },
                type: QueryTypes.UPDATE,
                transaction
            }
        );

        const [existingLabel] = await sequelize.query(
            `SELECT id FROM news_label WHERE news_id = :news_id AND language_id = 1`,
            {
                replacements: { news_id: id },
                type: QueryTypes.SELECT,
                transaction
            }
        );

        if (existingLabel) {
            await sequelize.query(
                `UPDATE news_label SET name = :name, value = :value WHERE news_id = :news_id AND language_id = 1`,
                {
                    replacements: { news_id: id, name: title || '', value: content || '' },
                    type: QueryTypes.UPDATE,
                    transaction
                }
            );
        } else {
            await sequelize.query(
                `INSERT INTO news_label (news_id, language_id, name, value) VALUES (:news_id, 1, :name, :value)`,
                {
                    replacements: { news_id: id, name: title || '', value: content || '' },
                    type: QueryTypes.INSERT,
                    transaction
                }
            );
        }

        await transaction.commit();

        res.json({ data: { id, title, content, image, status } });
    } catch (error) {
        await transaction.rollback();
        console.error('Error updating news:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const id = req.params.id;

        await sequelize.query(
            `DELETE FROM news_label WHERE news_id = :id`,
            {
                replacements: { id },
                type: QueryTypes.DELETE,
                transaction
            }
        );

        await sequelize.query(
            `DELETE FROM news WHERE id = :id`,
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
        console.error('Error deleting news:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
