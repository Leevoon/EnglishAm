// IELTS — same shape as TOEFL but with a track filter (general / academic).

const repo = require('../services/repo');

const TYPE = { general: 0, academic: 1 };

async function readingList(req, res) {
  const track = req.params.track in TYPE ? req.params.track : 'general';
  const { rows } = await repo.find('ielts_reading', { where: { status: 1, ielts_type: TYPE[track] }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function readingDetail(req, res) {
  const id = parseInt(req.params.id, 10);
  const section = await repo.findById('ielts_reading', id);
  if (!section) return res.status(404).json({ error: 'Section not found' });
  const { rows: questions } = await repo.find('ielts_reading_question', { where: { ielts_reading_id: id }, order: ['sort_order', 'ASC'] });
  const out = [];
  for (const q of questions) {
    const { rows: ans } = await repo.find('ielts_reading_question_answer', { where: { ielts_reading_question_id: q.id } });
    out.push({
      id: q.id,
      question: q.question,
      sentences: q.sentences,
      answers: ans.map((a) => ({ id: a.id, value: a.answer })),
    });
  }
  res.json({
    id: section.id,
    title: section.title || `IELTS Reading ${section.id}`,
    reading_text: section.reading_text,
    type: section.type,
    tier: section.tier || 'free',
    questions: out,
  });
}

async function readingSubmit(req, res) {
  const id = parseInt(req.params.id, 10);
  const section = await repo.findById('ielts_reading', id);
  if (!section) return res.status(404).json({ error: 'Section not found' });
  const userAnswers = (req.body && req.body.answers) || {};
  const { rows: questions } = await repo.find('ielts_reading_question', { where: { ielts_reading_id: id } });
  let total = 0, correct = 0;
  const review = [];
  for (const q of questions) {
    total++;
    const { rows: ans } = await repo.find('ielts_reading_question_answer', { where: { ielts_reading_question_id: q.id } });
    const right = ans.find((a) => a.true_false === 1);
    const ua = userAnswers[q.id];
    const isRight = right && Number(ua) === right.id;
    if (isRight) correct++;
    review.push({
      question_id: q.id, question: q.question,
      correct_answer_id: right ? right.id : null,
      user_answer_id: ua || null, is_correct: !!isRight,
    });
  }
  const score_pct = total ? Math.round((correct / total) * 100) : 0;
  res.json({ correct, total, score_pct, review });
}

async function listeningList(req, res) {
  const track = req.params.track in TYPE ? req.params.track : 'general';
  const { rows } = await repo.find('ielts_listening', { where: { status: 1, ielts_type: TYPE[track] }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function speakingList(req, res) {
  const track = req.params.track in TYPE ? req.params.track : 'general';
  const { rows } = await repo.find('ielts_speaking', { where: { status: 1, ielts_type: TYPE[track] }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

async function writingList(req, res) {
  const track = req.params.track in TYPE ? req.params.track : 'general';
  const { rows } = await repo.find('ielts_writing', { where: { status: 1, ielts_type: TYPE[track] }, order: ['sort_order', 'ASC'] });
  res.json(rows);
}

module.exports = {
  readingList, readingDetail, readingSubmit,
  listeningList, speakingList, writingList,
};
