// User account: profile, results, statistics, subscription.

const repo = require('../services/repo');

async function dashboard(req, res) {
  const uid = req.auth.id;
  const { rows: history } = await repo.find('user_history', { where: { user_id: uid }, order: ['created_date', 'DESC'] });
  const totalTests = history.length;
  const totalCorrect = history.reduce((s, r) => s + (r.score || 0), 0);
  const totalQuestions = history.reduce((s, r) => s + (r.score_from || 0), 0);
  const avgScore = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const recent = history.slice(0, 5);
  const enriched = [];
  for (const h of recent) {
    const tc = await repo.findById('test_category', h.test_id);
    enriched.push({ ...h, test_name: tc ? (tc.name || `Test #${tc.id}`) : `Test #${h.test_id}` });
  }

  let level = 'Beginner';
  if (avgScore >= 85) level = 'Advanced';
  else if (avgScore >= 65) level = 'Intermediate';
  else if (avgScore >= 40) level = 'Elementary';

  res.json({
    stats: { tests_completed: totalTests, average_score: avgScore, correct_answers: totalCorrect, total_questions: totalQuestions, level },
    recent: enriched,
  });
}

async function profile(req, res) {
  const u = await repo.findById('users', req.auth.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  const { password, ...rest } = u;
  res.json(rest);
}

async function updateProfile(req, res) {
  const allowed = ['first_name', 'last_name', 'phone', 'address', 'fb', 'instagram', 'linkedin', 'avatar', 'gender', 'dob'];
  const payload = {};
  for (const k of allowed) if (k in req.body) payload[k] = req.body[k];
  const updated = await repo.update('users', req.auth.id, payload);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { password, ...rest } = updated;
  res.json(rest);
}

async function results(req, res) {
  const { rows } = await repo.find('user_history', { where: { user_id: req.auth.id }, order: ['created_date', 'DESC'] });
  const out = [];
  for (const h of rows) {
    const tc = await repo.findById('test_category', h.test_id);
    out.push({
      id: h.id,
      test_id: h.test_id,
      test_name: tc ? (tc.name || `Test #${tc.id}`) : `Test #${h.test_id}`,
      category: tc ? tc.category_id : null,
      score: h.score,
      score_from: h.score_from,
      score_pct: h.score_from ? Math.round((h.score / h.score_from) * 100) : 0,
      duration: h.duration,
      created_date: h.created_date,
    });
  }
  res.json(out);
}

async function statistics(req, res) {
  const { rows: history } = await repo.find('user_history', { where: { user_id: req.auth.id } });
  const totalTests = history.length;
  const totalCorrect = history.reduce((s, r) => s + (r.score || 0), 0);
  const totalQuestions = history.reduce((s, r) => s + (r.score_from || 0), 0);
  const avg = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  let level = 'Beginner';
  if (avg >= 85) level = 'Advanced';
  else if (avg >= 65) level = 'Intermediate';
  else if (avg >= 40) level = 'Elementary';
  res.json({
    tests_completed: totalTests, correct_answers: totalCorrect,
    total_questions: totalQuestions, average_score: avg, level,
  });
}

async function subscription(req, res) {
  const { rows } = await repo.find('user_has_membership', { where: { user_id: req.auth.id }, order: ['created_date', 'DESC'] });
  let plan = null;
  if (rows.length) {
    const m = await repo.findById('membership', rows[0].membership_id);
    plan = m;
  }
  res.json({ plan, history: rows });
}

module.exports = { dashboard, profile, updateProfile, results, statistics, subscription };
