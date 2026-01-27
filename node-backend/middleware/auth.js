const authRoutes = require('../routes/auth');

// Authentication middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization || req.query.token || req.body.token;
  
  if (!token || !authRoutes.sessions[token]) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  req.user = authRoutes.sessions[token].user;
  req.userId = authRoutes.sessions[token].userId;
  req.token = token;
  next();
};

module.exports = requireAuth;



