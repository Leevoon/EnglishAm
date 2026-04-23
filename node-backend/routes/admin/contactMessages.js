const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'created_date', 'status', 'name', 'email', 'subject'];

const buildQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = Math.min(parseInt(req.query.perPage) || 25, 100);
  const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'created_date';
  const sortOrder = req.query.sortOrder === 'ASC' ? 'ASC' : 'DESC';
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  return { page, perPage, sortField, sortOrder, filter };
};

// GET - List
router.get('/', async (req, res) => {
  try {
    const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
    const offset = (page - 1) * perPage;

    const whereParts = [];
    const replacements = {};

    if (filter.q) {
      whereParts.push('(name LIKE :search OR email LIKE :search OR subject LIKE :search OR body LIKE :search)');
      replacements.search = `%${filter.q}%`;
    }
    if (filter.status != null && filter.status !== '') {
      whereParts.push('status = :status');
      replacements.status = filter.status;
    }
    if (filter.ids) {
      const ids = typeof filter.ids === 'string' ? JSON.parse(filter.ids) : filter.ids;
      whereParts.push('id IN (:ids)');
      replacements.ids = ids;
    }
    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    const [{ total }] = await sequelize.query(
      `SELECT COUNT(*) AS total FROM contact_messages ${whereClause}`,
      { replacements, type: QueryTypes.SELECT }
    );

    const data = await sequelize.query(
      `SELECT id, created_date, status, name, email, subject, body
       FROM contact_messages
       ${whereClause}
       ORDER BY ${sortField} ${sortOrder}
       LIMIT :limit OFFSET :offset`,
      { replacements: { ...replacements, limit: perPage, offset }, type: QueryTypes.SELECT }
    );

    res.json({ data, total });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Single
router.get('/:id', async (req, res) => {
  try {
    const [row] = await sequelize.query(
      `SELECT id, created_date, status, name, email, subject, body
       FROM contact_messages WHERE id = :id`,
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
    );
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update (read/unread toggle; name/email/subject/body are user-submitted, not edited)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await sequelize.query(
      `UPDATE contact_messages SET status = COALESCE(:status, status) WHERE id = :id`,
      { replacements: { id: req.params.id, status: status ?? null }, type: QueryTypes.UPDATE }
    );
    res.json({ id: req.params.id });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await sequelize.query(
      `DELETE FROM contact_messages WHERE id = :id`,
      { replacements: { id: req.params.id }, type: QueryTypes.DELETE }
    );
    res.json({ id: req.params.id });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
