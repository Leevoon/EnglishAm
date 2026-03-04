const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

// Simple MD5 hash function (matching legacy PHP app)
const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

// Generate a simple token
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Hash password with MD5 (matching legacy system)
    const hashedPassword = md5(password);

    let admin;
    try {
      // Try with admins_groups join (ag.title)
      [admin] = await sequelize.query(`
        SELECT a.*, ag.title as group_name 
        FROM admins a
        LEFT JOIN admins_groups ag ON a.group_id = ag.id
        WHERE a.email = :email AND a.password = :password AND a.status = 1
      `, {
        replacements: { email, password: hashedPassword },
        type: QueryTypes.SELECT
      });
    } catch (joinErr) {
      // Fallback: query admins only (if admins_groups missing or schema differs)
      if (joinErr.name === 'SequelizeDatabaseError' || joinErr.parent?.code === 'ER_BAD_FIELD_ERROR' || joinErr.parent?.code === 'ER_NO_SUCH_TABLE') {
        [admin] = await sequelize.query(`
          SELECT * FROM admins
          WHERE email = :email AND password = :password AND status = 1
        `, {
          replacements: { email, password: hashedPassword },
          type: QueryTypes.SELECT
        });
      } else {
        throw joinErr;
      }
    }

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken();

    // Return admin info
    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        avatar: admin.avatar,
        group: admin.group_name || null,
        permissions: [] // Could load from admins_action table
      }
    });
  } catch (error) {
    console.error('Admin login error:', error.message);
    console.error('Full error:', error);
    const isDbError = error.name === 'SequelizeConnectionError' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT';
    res.status(500).json({
      message: isDbError ? 'Database connection failed. Check backend DB config.' : 'Server error',
      ...(process.env.NODE_ENV === 'development' && { detail: error.message })
    });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // For simplicity, we just check if token exists
  // In production, you'd want to verify against stored tokens or use JWT
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  next();
};

module.exports = { router, verifyToken };

