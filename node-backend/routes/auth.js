const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Op } = require('sequelize');

// Simple session storage (in production, use Redis or database)
const sessions = {};

// Generate session token
const generateSessionToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { user_name, email, password, confirm_password, first_name, last_name, gender, dob } = req.body;
    
    // Validation
    if (!user_name || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if username already exists
    const existingUserByUsername = await User.findOne({
      where: { user_name: user_name.trim().replace(/\s+/g, '') }
    });
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'This username is already in use' });
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({
      where: { email: email.trim() }
    });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'This email is already in use' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Hash password (MD5 for compatibility with existing PHP system)
    const hashedPassword = User.hashPassword(password);

    // Create user
    const newUser = await User.create({
      user_name: user_name.trim().replace(/\s+/g, ''), // Remove spaces from username
      email: email.trim(),
      password: hashedPassword,
      first_name: first_name || null,
      last_name: last_name || null,
      gender: gender || 1, // Default to 1 (male)
      dob: dob || null,
      block: 0,
      created_date: new Date()
    });

    // Generate session token
    const token = generateSessionToken();
    sessions[token] = {
      userId: newUser.id,
      user: {
        id: newUser.id,
        user_name: newUser.user_name,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        avatar: newUser.avatar
      },
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: sessions[token].user
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Sequelize unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(400).json({ 
        error: `This ${field === 'user_name' ? 'username' : 'email'} is already in use` 
      });
    }
    
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Authenticate user (supports both email and username)
    const user = await User.authenticate(email, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    // Generate session token
    const token = generateSessionToken();
    sessions[token] = {
      userId: user.id,
      user: {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar
      },
      createdAt: new Date()
    };

    // Update last login date
    await User.update(
      { last_login_date: new Date() },
      { where: { id: user.id } }
    );

    res.json({
      success: true,
      token,
      user: sessions[token].user
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Login error stack:', error.stack);
    res.status(500).json({ error: 'Failed to login', message: error.message });
  }
});

// Guest login endpoint
router.post('/guest', async (req, res) => {
  try {
    const user = await User.authenticate('guest', 'guest');
    
    if (!user) {
      return res.status(401).json({ error: 'Guest login not available' });
    }

    const token = generateSessionToken();
    sessions[token] = {
      userId: user.id,
      user: {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar
      },
      createdAt: new Date()
    };

    res.json({
      success: true,
      token,
      user: sessions[token].user
    });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ error: 'Failed to login as guest' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  const token = req.headers.authorization || req.body.token;
  if (token && sessions[token]) {
    delete sessions[token];
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization || req.query.token;
  
  if (!token || !sessions[token]) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    success: true,
    user: sessions[token].user
  });
});

// Change password
router.post('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization || req.body.token;
    const { currentPassword, newPassword } = req.body;

    if (!token || !sessions[token]) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = sessions[token].userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const currentPasswordHash = User.hashPassword(currentPassword);
    if (user.password !== currentPasswordHash) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    const newPasswordHash = User.hashPassword(newPassword);
    await User.update(
      { password: newPasswordHash },
      { where: { id: userId } }
    );

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Export sessions for middleware
router.sessions = sessions;

module.exports = router;

