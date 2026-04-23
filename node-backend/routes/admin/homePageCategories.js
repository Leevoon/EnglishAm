const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'source_type', 'source_id', 'sort_order', 'status', 'created_date'];
const ENGLISH_LANGUAGE_ID = 1;

const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
  const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'sort_order';
  const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  return { page, perPage, sortField, sortOrder, filter };
};

// Resolves source_name by joining the right label table for each row
const SELECT_WITH_NAME = `
  SELECT
    h.*,
    CASE h.source_type
      WHEN 'category'       THEN cl.value
      WHEN 'lessons_filter' THEN lfl.name
    END AS source_name
  FROM home_page_categories h
  LEFT JOIN category_label cl
    ON h.source_type = 'category'
   AND cl.category_id = h.source_id
   AND cl.language_id = :lang
  LEFT JOIN lessons_filters_label lfl
    ON h.source_type = 'lessons_filter'
   AND lfl.lessons_filters_id = h.source_id
   AND lfl.language_id = :lang
`;

// Source-options helper — lists rows from category + lessons_filters tables
// so the admin form can render a dropdown per source_type. Mounted BEFORE
// the '/:id' route so 'source-options' doesn't match as an id.
router.get('/source-options', async (req, res) => {
  try {
    const categories = await sequelize.query(`
      SELECT c.id, cl.value AS name
      FROM category c
      LEFT JOIN category_label cl ON cl.category_id = c.id AND cl.language_id = :lang
      WHERE c.status = 1
      ORDER BY c.sort_order ASC, c.id ASC
    `, { replacements: { lang: ENGLISH_LANGUAGE_ID }, type: QueryTypes.SELECT });

    const lessonsFilters = await sequelize.query(`
      SELECT lf.id, lfl.name
      FROM lessons_filters lf
      LEFT JOIN lessons_filters_label lfl
        ON lfl.lessons_filters_id = lf.id AND lfl.language_id = :lang
      WHERE lf.status = 1
      ORDER BY lf.sort_order ASC, lf.id ASC
    `, { replacements: { lang: ENGLISH_LANGUAGE_ID }, type: QueryTypes.SELECT });

    res.json({ category: categories, lessons_filter: lessonsFilters });
  } catch (error) {
    console.error('Error fetching source options:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - List
router.get('/', async (req, res) => {
  try {
    const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
    const offset = (page - 1) * perPage;

    const whereParts = [];
    const replacements = { lang: ENGLISH_LANGUAGE_ID };

    if (filter.source_type) {
      whereParts.push('h.source_type = :source_type');
      replacements.source_type = filter.source_type;
    }
    if (filter.status != null && filter.status !== '') {
      whereParts.push('h.status = :status');
      replacements.status = filter.status;
    }
    if (filter.ids) {
      const ids = typeof filter.ids === 'string' ? JSON.parse(filter.ids) : filter.ids;
      whereParts.push('h.id IN (:ids)');
      replacements.ids = ids;
    }
    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    const [{ total }] = await sequelize.query(
      `SELECT COUNT(*) AS total FROM home_page_categories h ${whereClause}`,
      { replacements, type: QueryTypes.SELECT }
    );

    const data = await sequelize.query(
      `${SELECT_WITH_NAME} ${whereClause} ORDER BY h.${sortField} ${sortOrder} LIMIT :limit OFFSET :offset`,
      { replacements: { ...replacements, limit: perPage, offset }, type: QueryTypes.SELECT }
    );

    res.json({ data, total });
  } catch (error) {
    console.error('Error fetching home page categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Single
router.get('/:id', async (req, res) => {
  try {
    const [row] = await sequelize.query(
      `${SELECT_WITH_NAME} WHERE h.id = :id`,
      { replacements: { id: req.params.id, lang: ENGLISH_LANGUAGE_ID }, type: QueryTypes.SELECT }
    );
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  } catch (error) {
    console.error('Error fetching home page category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const validateSourceType = (v) => ['category', 'lessons_filter'].includes(v);

// POST - Create
router.post('/', async (req, res) => {
  try {
    const { source_type, source_id, icon, color, description, sort_order = 0, status = 1 } = req.body;
    if (!validateSourceType(source_type)) {
      return res.status(400).json({ message: 'source_type must be "category" or "lessons_filter"' });
    }
    if (!source_id) {
      return res.status(400).json({ message: 'source_id required' });
    }

    const id = await sequelize.query(`
      INSERT INTO home_page_categories
        (source_type, source_id, icon, color, description, sort_order, status, created_date)
      VALUES (:source_type, :source_id, :icon, :color, :description, :sort_order, :status, NOW())
    `, {
      replacements: { source_type, source_id, icon: icon || null, color: color || null,
        description: description || null, sort_order, status },
      type: QueryTypes.INSERT,
    });

    res.json({ id: id[0] });
  } catch (error) {
    console.error('Error creating home page category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update
router.put('/:id', async (req, res) => {
  try {
    const { source_type, source_id, icon, color, description, sort_order, status } = req.body;
    if (source_type != null && !validateSourceType(source_type)) {
      return res.status(400).json({ message: 'source_type must be "category" or "lessons_filter"' });
    }

    await sequelize.query(`
      UPDATE home_page_categories
      SET source_type = COALESCE(:source_type, source_type),
          source_id   = COALESCE(:source_id, source_id),
          icon        = COALESCE(:icon, icon),
          color       = COALESCE(:color, color),
          description = COALESCE(:description, description),
          sort_order  = COALESCE(:sort_order, sort_order),
          status      = COALESCE(:status, status)
      WHERE id = :id
    `, {
      replacements: {
        id: req.params.id,
        source_type: source_type ?? null,
        source_id: source_id ?? null,
        icon: icon ?? null,
        color: color ?? null,
        description: description ?? null,
        sort_order: sort_order ?? null,
        status: status ?? null,
      },
      type: QueryTypes.UPDATE,
    });

    res.json({ id: req.params.id });
  } catch (error) {
    console.error('Error updating home page category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await sequelize.query(
      `DELETE FROM home_page_categories WHERE id = :id`,
      { replacements: { id: req.params.id }, type: QueryTypes.DELETE }
    );
    res.json({ id: req.params.id });
  } catch (error) {
    console.error('Error deleting home page category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
