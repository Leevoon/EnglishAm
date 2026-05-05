// Controllers for the public, unauthenticated API: home blocks, news, gallery,
// faq, lessons, languages, translations, contact info, page images, statics.

const repo = require('../services/repo');
const { pickLabel, attachLabel, languageFromReq } = require('../services/labels');
const { parseListParams } = require('../services/list');

async function languages(req, res) {
  const { rows } = await repo.find('languages', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function translations(req, res) {
  const lang = languageFromReq(req);
  const { rows: keys } = await repo.find('translation', {});
  const { rows: labels } = await repo.find('translation_label', { where: { language_id: lang } });
  const map = {};
  for (const k of keys) {
    const lbl = labels.find((l) => l.translation_id === k.id);
    map[k.key] = lbl ? lbl.value : k.key;
  }
  res.json(map);
}

async function home(req, res) {
  const lang = languageFromReq(req);
  const [slidesRes, newsRes, galleryRes, popularRes, plansRes, reviewsRes] = await Promise.all([
    repo.find('slideshow', { where: { status: 1 }, order: ['sort_order', 'ASC'] }),
    repo.find('news', { where: { status: 1 }, order: ['created_date', 'DESC'], limit: 4 }),
    repo.find('gallery', { where: { status: 1 }, order: ['sort_order', 'ASC'], limit: 6 }),
    repo.find('test_category', { where: { status: 1 }, order: ['view_count', 'DESC'], limit: 4 }),
    repo.find('membership', { where: { status: 1 }, order: ['sort_ortder', 'ASC'] }),
    repo.find('reviews', { where: { status: 1 }, order: ['sort_order', 'ASC'], limit: 6 }).catch(() => ({ rows: [] })),
  ]);

  const slides = await attachLabel(slidesRes.rows, {
    table: 'slideshow_label', fkField: 'slideshow_id', languageId: lang,
    mapTo: (l) => ({ caption: l.value }),
  });
  const news = await attachLabel(newsRes.rows, {
    table: 'news_label', fkField: 'news_id', languageId: lang,
    mapTo: (l) => ({ title: l.title, excerpt: stripHtml(l.value).slice(0, 180), body: l.value }),
  });
  const popular = await attachLabel(popularRes.rows, {
    table: 'test_category_label', fkField: 'test_category_id', languageId: lang,
    mapTo: (l) => ({ name: l.name, description: l.description, seo: l.seo_name }),
  });
  const plans = await attachLabel(plansRes.rows, {
    table: 'membership_label', fkField: 'membership_id', languageId: lang,
    mapTo: (l) => ({ title: l.title, short_description: l.short_description, description: l.description }),
  });

  res.json({
    slides,
    news,
    gallery: galleryRes.rows,
    popular,
    plans,
    reviews: reviewsRes.rows,
  });
}

async function newsList(req, res) {
  const lang = languageFromReq(req);
  const params = parseListParams(req.query);
  const { rows, total } = await repo.find('news', { where: { status: 1, ...params.where }, order: ['created_date', 'DESC'], limit: params.limit, offset: params.offset });
  const items = await attachLabel(rows, {
    table: 'news_label', fkField: 'news_id', languageId: lang,
    mapTo: (l) => ({ title: l.title, excerpt: stripHtml(l.value).slice(0, 220), body: l.value }),
  });
  res.json({ items, total });
}

async function newsDetail(req, res) {
  const lang = languageFromReq(req);
  const item = await repo.findById('news', req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const label = await pickLabel('news_label', 'news_id', item.id, lang);
  res.json({ ...item, title: label && label.title, body: label && label.value });
}

async function gallery(req, res) {
  const { rows } = await repo.find('gallery', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function faq(req, res) {
  const lang = languageFromReq(req);
  const { rows } = await repo.find('faq', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  const items = await attachLabel(rows, {
    table: 'faq_label', fkField: 'faq_id', languageId: lang,
    mapTo: (l) => ({ question: l.question, answer: l.answer }),
  });
  res.json(items);
}

async function lessonsLevels(req, res) {
  const { rows } = await repo.find('lessons_levels', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function lessonsFilters(req, res) {
  const { rows } = await repo.find('lessons_filters', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function lessonsList(req, res) {
  const where = { status: 1 };
  if (req.query.level_id) where.level_id = parseInt(req.query.level_id, 10);
  if (req.query.filter_id) where.filter_id = parseInt(req.query.filter_id, 10);
  const { rows, total } = await repo.find('lessons', { where, order: ['sort_order', 'ASC'] });
  res.json({ items: rows, total });
}

async function lessonDetail(req, res) {
  const item = await repo.findById('lessons', req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
}

async function contactInfo(req, res) {
  const { rows } = await repo.find('contact_info', { limit: 1 });
  res.json(rows[0] || { email: '', phone: '', address: '' });
}

async function socialsList(req, res) {
  const { rows } = await repo.find('socials', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function staticPage(req, res) {
  const lang = languageFromReq(req);
  const all = await repo.find('static_pages', {});
  const page = all.rows.find((p) => p.page_key === req.params.key);
  if (!page) return res.status(404).json({ error: 'Not found' });
  // In mock mode the static_pages rows already carry title+body; in DB mode look up label.
  if (page.title && page.body) return res.json(page);
  const label = await pickLabel('static_pages_label', 'static_pages_id', page.id, lang);
  res.json({ ...page, title: label && label.title, body: label && label.body });
}

async function pageImage(req, res) {
  const all = await repo.find('page_images', {});
  const found = all.rows.find((p) => p.key === req.params.key);
  res.json(found || null);
}

async function membershipPlans(req, res) {
  const lang = languageFromReq(req);
  const { rows } = await repo.find('membership', { where: { status: 1 }, order: ['sort_ortder', 'ASC'] });
  const items = await attachLabel(rows, {
    table: 'membership_label', fkField: 'membership_id', languageId: lang,
    mapTo: (l) => ({ title: l.title, short_description: l.short_description, description: l.description }),
  });
  res.json(items);
}

async function categoriesList(req, res) {
  const lang = languageFromReq(req);
  const { rows } = await repo.find('category', { where: { status: 1, parent_id: 0 }, order: ['sort_order', 'ASC'] });
  const items = await attachLabel(rows, {
    table: 'category_label', fkField: 'category_id', languageId: lang,
    mapTo: (l) => ({ name: l.value }),
  });
  res.json(items);
}

async function cvList(req, res) {
  const { rows } = await repo.find('cv', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function downloadablesList(req, res) {
  const { rows } = await repo.find('downloadable_content', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function submitContact(req, res) {
  const { name, email, subject, body } = req.body || {};
  if (!name || !email || !body) return res.status(400).json({ error: 'name, email, message required' });
  await repo.create('contact_messages', {
    name, email, subject: subject || '', body, status: 0, created_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });
  res.json({ ok: true });
}

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

module.exports = {
  languages,
  translations,
  home,
  newsList,
  newsDetail,
  gallery,
  faq,
  lessonsLevels,
  lessonsFilters,
  lessonsList,
  lessonDetail,
  contactInfo,
  socialsList,
  staticPage,
  pageImage,
  membershipPlans,
  categoriesList,
  cvList,
  downloadablesList,
  submitContact,
};
