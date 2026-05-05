const { verifyToken } = require('../services/auth');

function readToken(req) {
  const h = req.headers.authorization;
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

function attachUser(req, _res, next) {
  const token = readToken(req);
  const data = token ? verifyToken(token) : null;
  if (data) req.auth = data;
  next();
}

function requireUser(req, res, next) {
  if (!req.auth || req.auth.kind !== 'user') {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.auth || req.auth.kind !== 'admin') {
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  next();
}

module.exports = { attachUser, requireUser, requireAdmin };
