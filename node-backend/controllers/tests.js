// General-practice test flow:
//  - GET /api/tests/categories/:key — list tests in a category (Audio/Synonyms/...).
//  - GET /api/tests/:id — fetch the test with its questions and answers.
//  - POST /api/tests/:id/submit — score the attempt and store it in user_history.

const repo = require('../services/repo');
const { pickLabel, attachLabel, languageFromReq } = require('../services/labels');
const { parseListParams } = require('../services/list');

async function listByCategory(req, res) {
  const lang = languageFromReq(req);
  const key = req.params.key;
  const { rows: cats } = await repo.find('category', { where: { key, status: 1 } });
  if (!cats.length) return res.json({ items: [], total: 0, levels: [], category: null });
  const cat = cats[0];

  const params = parseListParams(req.query);
  const where = { category_id: cat.id, status: 1 };
  if (req.query.level_id) where.level_id = parseInt(req.query.level_id, 10);
  if (req.query.subcategory) where.subcategory = req.query.subcategory;

  const { rows, total } = await repo.find('test_category', { where, order: ['sort_order', 'ASC'], limit: params.limit, offset: params.offset });
  const items = await attachLabel(rows, {
    table: 'test_category_label', fkField: 'test_category_id', languageId: lang,
    mapTo: (l) => ({ name: l.name, description: l.description, seo: l.seo_name }),
  });

  // levels — only show ones used in this category
  const { rows: allLevels } = await repo.find('test_level', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  const levels = await attachLabel(allLevels, {
    table: 'test_level_label', fkField: 'test_level_id', languageId: lang,
    mapTo: (l) => ({ name: l.name }),
  });

  const catLabel = await pickLabel('category_label', 'category_id', cat.id, lang);
  res.json({
    items,
    total,
    levels,
    category: { ...cat, name: catLabel && catLabel.value },
  });
}

async function getTest(req, res) {
  const lang = languageFromReq(req);
  const id = parseInt(req.params.id, 10);
  const tc = await repo.findById('test_category', id);
  if (!tc || tc.status !== 1) return res.status(404).json({ error: 'Test not found' });

  const label = await pickLabel('test_category_label', 'test_category_id', tc.id, lang);
  const { rows: questions } = await repo.find('test', { where: { parent_id: id, status: 1 }, order: ['sort_order', 'ASC'] });
  const out = [];
  for (const q of questions) {
    const qLabel = await pickLabel('test_label', 'test_id', q.id, lang);
    const { rows: answers } = await repo.find('test_answer', { where: { test_id: q.id } });
    out.push({
      id: q.id,
      question_type: q.question_type,
      answer_type: q.answer_type,
      image: q.image,
      audio: q.audio,
      question: (qLabel && qLabel.value) || q.question,
      // strip the answer key from the public payload
      answers: answers.map((a) => ({ id: a.id, value: a.value })),
    });
  }
  res.json({
    id: tc.id,
    name: label ? label.name : `Test #${tc.id}`,
    description: label ? label.description : '',
    time: tc.time,
    tier: tc.tier || 'free',
    questions: out,
  });
}

async function submitTest(req, res) {
  const id = parseInt(req.params.id, 10);
  const tc = await repo.findById('test_category', id);
  if (!tc) return res.status(404).json({ error: 'Test not found' });
  const answers = (req.body && req.body.answers) || {};
  const duration = (req.body && req.body.duration) || '00:00';

  const { rows: questions } = await repo.find('test', { where: { parent_id: id } });
  let correct = 0;
  const review = [];
  for (const q of questions) {
    const { rows: ans } = await repo.find('test_answer', { where: { test_id: q.id } });
    const right = ans.find((a) => a.true_false === 1);
    const userAnsId = answers[q.id];
    const isRight = right && Number(userAnsId) === right.id;
    if (isRight) correct++;
    review.push({
      question_id: q.id,
      question: q.question,
      correct_answer_id: right ? right.id : null,
      user_answer_id: userAnsId || null,
      is_correct: !!isRight,
    });
  }
  const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;

  if (req.auth && req.auth.kind === 'user') {
    await repo.create('user_history', {
      user_id: req.auth.id,
      test_id: tc.id,
      duration,
      score: correct,
      score_from: questions.length,
      answers: JSON.stringify(answers),
      created_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
  }

  res.json({ score_pct: score, correct, total: questions.length, review });
}

module.exports = { listByCategory, getTest, submitTest };
