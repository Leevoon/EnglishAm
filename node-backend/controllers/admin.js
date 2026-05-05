// Admin CRUD generic to any whitelisted resource. react-admin's simple-rest
// provider hits these via Content-Range headers on list responses.

const repo = require('../services/repo');
const { parseListParams, setContentRange } = require('../services/list');
const { hashPassword } = require('../services/auth');

// Whitelist — keys are URL slugs, values are the underlying table.
const RESOURCES = {
  users: 'users',
  admins: 'admins',
  'admins-groups': 'admins_groups',
  news: 'news',
  'news-labels': 'news_label',
  gallery: 'gallery',
  faq: 'faq',
  'faq-labels': 'faq_label',
  slideshow: 'slideshow',
  'slideshow-labels': 'slideshow_label',
  membership: 'membership',
  'membership-labels': 'membership_label',
  'membership-has-test': 'membership_has_test',
  category: 'category',
  'category-labels': 'category_label',
  'test-category': 'test_category',
  'test-category-labels': 'test_category_label',
  'test-level': 'test_level',
  'test-level-labels': 'test_level_label',
  test: 'test',
  'test-labels': 'test_label',
  'test-answer': 'test_answer',
  'toefl-reading': 'toefl_reading',
  'toefl-reading-tests': 'toefl_reading_test',
  'toefl-reading-questions': 'toefl_reading_test_question',
  'toefl-reading-answers': 'toefl_reading_test_answer',
  'toefl-listening': 'toefl_listening',
  'toefl-listening-tests': 'toefl_listening_test',
  'toefl-speaking': 'toefl_speaking',
  'toefl-writing': 'toefl_writing',
  'ielts-reading': 'ielts_reading',
  'ielts-reading-questions': 'ielts_reading_question',
  'ielts-reading-answers': 'ielts_reading_question_answer',
  'ielts-listening': 'ielts_listening',
  'ielts-speaking': 'ielts_speaking',
  'ielts-writing': 'ielts_writing',
  lessons: 'lessons',
  'lessons-levels': 'lessons_levels',
  'lessons-filters': 'lessons_filters',
  languages: 'languages',
  translation: 'translation',
  'translation-labels': 'translation_label',
  'contact-messages': 'contact_messages',
  'contact-info': 'contact_info',
  socials: 'socials',
  cv: 'cv',
  'static-pages': 'static_pages',
  'page-images': 'page_images',
  'downloadable-content': 'downloadable_content',
  'user-history': 'user_history',
  'user-has-membership': 'user_has_membership',
  reviews: 'reviews',
  settings: 'settings',
  dictionary: 'dictionary',
  'seo-urls': 'seo_urls',
};

function tableFor(resource) {
  const t = RESOURCES[resource];
  if (!t) {
    const e = new Error(`Unknown resource: ${resource}`);
    e.status = 404;
    throw e;
  }
  return t;
}

function sanitize(table, payload) {
  if (!payload || typeof payload !== 'object') return {};
  const copy = { ...payload };
  delete copy.id;
  // Hash any new password coming through Users / Admins create+update.
  if ((table === 'users' || table === 'admins') && copy.password) {
    copy.password = hashPassword(copy.password);
  }
  return copy;
}

async function list(req, res, next) {
  try {
    const table = tableFor(req.params.resource);
    const params = parseListParams(req.query);
    const { rows, total } = await repo.find(table, params);
    setContentRange(res, req.params.resource, params.offset || 0, rows.length, total);
    res.json(rows);
  } catch (e) { next(e); }
}

async function getOne(req, res, next) {
  try {
    const table = tableFor(req.params.resource);
    const row = await repo.findById(table, req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const table = tableFor(req.params.resource);
    const row = await repo.create(table, sanitize(table, req.body));
    res.status(201).json(row);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const table = tableFor(req.params.resource);
    const row = await repo.update(table, req.params.id, sanitize(table, req.body));
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    const table = tableFor(req.params.resource);
    const ok = await repo.remove(table, req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ id: req.params.id });
  } catch (e) { next(e); }
}

async function dashboard(req, res, next) {
  try {
    const tables = [
      ['categories', 'category'],
      ['test_categories', 'test_category'],
      ['tests', 'test'],
      ['users', 'users'],
      ['toefl_reading', 'toefl_reading'],
      ['toefl_listening', 'toefl_listening'],
      ['toefl_speaking', 'toefl_speaking'],
      ['toefl_writing', 'toefl_writing'],
      ['ielts_reading', 'ielts_reading'],
      ['ielts_listening', 'ielts_listening'],
      ['ielts_speaking', 'ielts_speaking'],
      ['ielts_writing', 'ielts_writing'],
      ['unread_messages', 'contact_messages'],
    ];
    const counts = {};
    for (const [key, t] of tables) {
      const where = key === 'unread_messages' ? { status: 0 } : undefined;
      const { total } = await repo.find(t, where ? { where, limit: 1 } : { limit: 1 });
      counts[key] = total;
    }
    res.json(counts);
  } catch (e) { next(e); }
}

module.exports = { list, getOne, create, update, remove, dashboard, RESOURCES };
