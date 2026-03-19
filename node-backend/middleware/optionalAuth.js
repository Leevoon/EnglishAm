const authRoutes = require('../routes/auth');

// Optional auth middleware - extracts user from token if present, but doesn't require it
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization || req.query.token;

  if (token && authRoutes.sessions[token]) {
    req.user = authRoutes.sessions[token].user;
    req.userId = authRoutes.sessions[token].userId;
    req.token = token;
  }

  next();
};

module.exports = optionalAuth;
