const repo = require('../services/repo');
const { verifyPassword, hashPassword, signToken } = require('../services/auth');

async function login(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const { rows } = await repo.find('users', { where: {} });
  const user = rows.find((u) =>
    (u.user_name && u.user_name.toLowerCase() === String(username).toLowerCase()) ||
    (u.email && u.email.toLowerCase() === String(username).toLowerCase()),
  );
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.block) return res.status(403).json({ error: 'Account is blocked' });
  if (!verifyPassword(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  await repo.update('users', user.id, { last_login_date: new Date().toISOString().slice(0, 19).replace('T', ' ') });
  const token = signToken({ kind: 'user', id: user.id, username: user.user_name });
  res.json({ token, user: publicUser(user) });
}

async function register(req, res) {
  const { username, email, password, first_name, last_name, gender } = req.body || {};
  if (!username || !email || !password) return res.status(400).json({ error: 'username, email, password required' });
  const { rows } = await repo.find('users', { where: {} });
  if (rows.some((u) => u.user_name && u.user_name.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: 'Username is taken' });
  }
  if (rows.some((u) => u.email && u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'Email is already registered' });
  }
  const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const created = await repo.create('users', {
    block: 0,
    user_name: username,
    password: hashPassword(password),
    email,
    first_name: first_name || '',
    last_name: last_name || '',
    gender: gender === 2 ? 2 : 1,
    avatar: '',
    created_date: ts,
    last_login_date: ts,
  });
  const token = signToken({ kind: 'user', id: created.id, username: created.user_name });
  res.json({ token, user: publicUser(created) });
}

async function guest(req, res) {
  // Guest tokens carry kind='guest' and a synthetic id; they unlock free content but not personal areas.
  const id = -1 * Math.floor(Math.random() * 1e6);
  const token = signToken({ kind: 'guest', id, username: 'guest' });
  res.json({
    token,
    user: { id, user_name: 'guest', email: '', first_name: 'Guest', last_name: '', isGuest: true },
  });
}

async function me(req, res) {
  if (!req.auth) return res.status(401).json({ error: 'Not signed in' });
  if (req.auth.kind === 'guest') {
    return res.json({ id: req.auth.id, user_name: 'guest', isGuest: true });
  }
  if (req.auth.kind !== 'user') {
    // Admin tokens shouldn't surface user records via /auth/me.
    return res.status(401).json({ error: 'Not a user session' });
  }
  const u = await repo.findById('users', req.auth.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json(publicUser(u));
}

async function changePassword(req, res) {
  if (!req.auth || req.auth.kind !== 'user') return res.status(401).json({ error: 'Not signed in' });
  const { current_password, new_password } = req.body || {};
  if (!current_password || !new_password) return res.status(400).json({ error: 'Both passwords required' });
  if (new_password.length < 6) return res.status(400).json({ error: 'New password too short' });
  const u = await repo.findById('users', req.auth.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  if (!verifyPassword(current_password, u.password)) return res.status(401).json({ error: 'Current password is incorrect' });
  await repo.update('users', u.id, { password: hashPassword(new_password) });
  res.json({ ok: true });
}

async function adminLogin(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const { rows } = await repo.find('admins', { where: {} });
  const a = rows.find((x) => x.email && x.email.toLowerCase() === String(email).toLowerCase());
  if (!a) return res.status(401).json({ error: 'Invalid credentials' });
  if (a.status !== 1) return res.status(403).json({ error: 'Admin account is disabled' });
  if (!verifyPassword(password, a.password)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ kind: 'admin', id: a.id, email: a.email, group_id: a.group_id });
  res.json({ token, admin: { id: a.id, email: a.email, name: a.name, group_id: a.group_id, avatar: a.avatar } });
}

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

module.exports = { login, register, guest, me, changePassword, adminLogin };
