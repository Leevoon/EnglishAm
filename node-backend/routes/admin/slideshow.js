const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'value', 'status', 'created_date'];

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
            whereClause += ' AND s.id = :id';
            replacements.id = filter.id;
        }
        if (filter.status !== undefined && filter.status !== '') {
            whereClause += ' AND s.status = :status';
            replacements.status = filter.status;
        }
        if (filter.value) {
            whereClause += ' AND sl.value LIKE :value';
            replacements.value = `%${filter.value}%`;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM slideshow s
            LEFT JOIN slideshow_label sl ON sl.slideshow_id = s.id AND sl.language_id = 1
            WHERE 1=1 ${whereClause}
        `;

        const dataQuery = `
            SELECT s.id, sl.value, s.status, s.created_date
            FROM slideshow s
            LEFT JOIN slideshow_label sl ON sl.slideshow_id = s.id AND sl.language_id = 1
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
        console.error('Error fetching slideshow list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT s.id, sl.value, s.status, s.created_date
            FROM slideshow s
            LEFT JOIN slideshow_label sl ON sl.slideshow_id = s.id AND sl.language_id = 1
            WHERE s.id = :id
        `;

        const [result] = await sequelize.query(query, {
            replacements: { id: req.params.id },
            type: QueryTypes.SELECT
        });

        if (!result) {
            return res.status(404).json({ error: 'Slideshow not found' });
        }

        res.json({ data: result });
    } catch (error) {
        console.error('Error fetching slideshow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create
router.post('/', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { value, status } = req.body;

        const [slideshowResult] = await sequelize.query(
            `INSERT INTO slideshow (status, created_date) VALUES (:status, NOW())`,
            {
                replacements: { status: status !== undefined ? status : 1 },
                type: QueryTypes.INSERT,
                transaction
            }
        );

        const slideshowId = slideshowResult;

        await sequelize.query(
            `INSERT INTO slideshow_label (slideshow_id, language_id, value) VALUES (:slideshow_id, 1, :value)`,
            {
                replacements: { slideshow_id: slideshowId, value: value || '' },
                type: QueryTypes.INSERT,
                transaction
            }
        );

        await transaction.commit();

        res.status(201).json({ data: { id: slideshowId, value, status } });
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating slideshow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { value, status } = req.body;
        const id = req.params.id;

        await sequelize.query(
            `UPDATE slideshow SET status = :status WHERE id = :id`,
            {
                replacements: { id, status: status !== undefined ? status : 1 },
                type: QueryTypes.UPDATE,
                transaction
            }
        );

        const [existingLabel] = await sequelize.query(
            `SELECT id FROM slideshow_label WHERE slideshow_id = :slideshow_id AND language_id = 1`,
            {
                replacements: { slideshow_id: id },
                type: QueryTypes.SELECT,
                transaction
            }
        );

        if (existingLabel) {
            await sequelize.query(
                `UPDATE slideshow_label SET value = :value WHERE slideshow_id = :slideshow_id AND language_id = 1`,
                {
                    replacements: { slideshow_id: id, value: value || '' },
                    type: QueryTypes.UPDATE,
                    transaction
                }
            );
        } else {
            await sequelize.query(
                `INSERT INTO slideshow_label (slideshow_id, language_id, value) VALUES (:slideshow_id, 1, :value)`,
                {
                    replacements: { slideshow_id: id, value: value || '' },
                    type: QueryTypes.INSERT,
                    transaction
                }
            );
        }

        await transaction.commit();

        res.json({ data: { id, value, status } });
    } catch (error) {
        await transaction.rollback();
        console.error('Error updating slideshow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const id = req.params.id;

        await sequelize.query(
            `DELETE FROM slideshow_label WHERE slideshow_id = :id`,
            {
                replacements: { id },
                type: QueryTypes.DELETE,
                transaction
            }
        );

        await sequelize.query(
            `DELETE FROM slideshow WHERE id = :id`,
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
        console.error('Error deleting slideshow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
