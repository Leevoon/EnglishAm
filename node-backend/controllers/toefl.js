// TOEFL Reading + Listening: section list / start / submit.
// Speaking + Writing are placeholders — list of prompts only.

const repo = require('../services/repo');
const { pickLabel, attachLabel, languageFromReq } = require('../services/labels');

async function readingList(req, res) {
  const lang = languageFromReq(req);
  const { rows } = await repo.find('toefl_reading', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  const items = await attachLabel(rows, {
    table: 'toefl_reading_label', fkField: 'toefl_reading_id', languageId: lang,
    mapTo: (l) => ({ title: l.title, description: l.description }),
  });
  res.json(items);
}

async function readingDetail(req, res) {
  const lang = languageFromReq(req);
  const id = parseInt(req.params.id, 10);
  const section = await repo.findById('toefl_reading', id);
  if (!section) return res.status(404).json({ error: 'Section not found' });
  const label = await pickLabel('toefl_reading_label', 'toefl_reading_id', id, lang);
  const { rows: passages } = await repo.find('toefl_reading_test', { where: { toefl_reding_id: id, status: 1 }, order: ['sort_order', 'ASC'] });
  const out = [];
  for (const p of passages) {
    const { rows: qs } = await repo.find('toefl_reading_test_question', { where: { toefl_reading_test_id: p.id, status: 1 }, order: ['sort_order', 'ASC'] });
    const questions = [];
    for (const q of qs) {
      const { rows: ans } = await repo.find('toefl_reading_test_answer', { where: { toefl_reading_test_question_id: q.id } });
      questions.push({
        id: q.id,
        type: q.type,
        text: q.text,
        audio: q.audio,
        answers: ans.map((a) => ({ id: a.id, text: a.text, question: a.question })),
      });
    }
    out.push({ id: p.id, text: p.text, questions });
  }
  res.json({
    id: section.id,
    title: label ? label.title : `Section ${section.id}`,
    description: label ? label.description : '',
    time: section.time,
    tier: section.tier || 'free',
    passages: out,
  });
}

async function readingSubmit(req, res) {
  const id = parseInt(req.params.id, 10);
  const section = await repo.findById('toefl_reading', id);
  if (!section) return res.status(404).json({ error: 'Section not found' });
  const userAnswers = (req.body && req.body.answers) || {};

  const { rows: passages } = await repo.find('toefl_reading_test', { where: { toefl_reding_id: id } });
  let total = 0, correct = 0;
  const review = [];
  for (const p of passages) {
    const { rows: qs } = await repo.find('toefl_reading_test_question', { where: { toefl_reading_test_id: p.id } });
    for (const q of qs) {
      total++;
      const { rows: ans } = await repo.find('toefl_reading_test_answer', { where: { toefl_reading_test_question_id: q.id } });
      const right = ans.find((a) => a.true_false === 1);
      const ua = userAnswers[q.id];
      const isRight = right && Number(ua) === right.id;
      if (isRight) correct++;
      review.push({
        passage_id: p.id, question_id: q.id, question_text: q.text,
        correct_answer_id: right ? right.id : null,
        user_answer_id: ua || null, is_correct: !!isRight,
      });
    }
  }
  const score_pct = total ? Math.round((correct / total) * 100) : 0;
  res.json({ correct, total, score_pct, review });
}

async function listeningList(req, res) {
  const lang = languageFromReq(req);
  const { rows } = await repo.find('toefl_listening', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  const items = await attachLabel(rows, {
    table: 'toefl_listening_label', fkField: 'toefl_listening_id', languageId: lang,
    mapTo: (l) => ({ title: l.title, description: l.description }),
  });
  res.json(items);
}

async function listeningDetail(req, res) {
  const lang = languageFromReq(req);
  const id = parseInt(req.params.id, 10);
  const section = await repo.findById('toefl_listening', id);
  if (!section) return res.status(404).json({ error: 'Section not found' });
  const label = await pickLabel('toefl_listening_label', 'toefl_listening_id', id, lang);
  const { rows: parts } = await repo.find('toefl_listening_test', { where: { toefl_listening_id: id, status: 1 } });
  const out = [];
  for (const p of parts) {
    const { rows: qs } = await repo.find('toefl_listening_test_question', { where: { toefl_listening_test_id: p.id, status: 1 } });
    const questions = [];
    for (const q of qs) {
      const { rows: ans } = await repo.find('toefl_listening_test_question_answers', { where: { toefl_listening_test_question_id: q.id } });
      questions.push({
        id: q.id, type: q.type, question: q.question, audio: q.audio,
        answers: ans.map((a) => ({ id: a.id, value: a.value })),
      });
    }
    out.push({ id: p.id, audio: p.audio, image: p.image, questions });
  }
  res.json({
    id: section.id,
    title: label ? label.title : `Listening ${section.id}`,
    description: label ? label.description : '',
    time: section.time,
    tier: section.tier || 'free',
    parts: out,
  });
}

async function listeningSubmit(req, res) {
  const id = parseInt(req.params.id, 10);
  const section = await repo.findById('toefl_listening', id);
  if (!section) return res.status(404).json({ error: 'Section not found' });
  const userAnswers = (req.body && req.body.answers) || {};

  const { rows: parts } = await repo.find('toefl_listening_test', { where: { toefl_listening_id: id } });
  let total = 0, correct = 0;
  const review = [];
  for (const p of parts) {
    const { rows: qs } = await repo.find('toefl_listening_test_question', { where: { toefl_listening_test_id: p.id } });
    for (const q of qs) {
      total++;
      const { rows: ans } = await repo.find('toefl_listening_test_question_answers', { where: { toefl_listening_test_question_id: q.id } });
      const right = ans.find((a) => a.true_false === 1);
      const ua = userAnswers[q.id];
      const isRight = right && Number(ua) === right.id;
      if (isRight) correct++;
      review.push({
        part_id: p.id, question_id: q.id, question: q.question,
        correct_answer_id: right ? right.id : null,
        user_answer_id: ua || null, is_correct: !!isRight,
      });
    }
  }
  const score_pct = total ? Math.round((correct / total) * 100) : 0;
  res.json({ correct, total, score_pct, review });
}

async function speakingList(req, res) {
  const { rows } = await repo.find('toefl_speaking', { where: { status: 1 }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function writingList(req, res) {
  const kind = req.query.kind || null;
  const where = { status: 1 };
  if (kind) where.kind = kind;
  const { rows } = await repo.find('toefl_writing', { where, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

module.exports = {
  readingList, readingDetail, readingSubmit,
  listeningList, listeningDetail, listeningSubmit,
  speakingList, writingList,
};
