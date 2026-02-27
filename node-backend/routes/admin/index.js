const express = require('express');
const router = express.Router();

// Import auth
const { router: authRouter, verifyToken } = require('./auth');

// Import resource routes
const categoriesRouter = require('./categories');
const testCategoriesRouter = require('./testCategories');
const testsRouter = require('./tests');
const testLevelsRouter = require('./testLevels');
const languagesRouter = require('./languages');
const usersRouter = require('./users');
const adminsRouter = require('./admins');

// Auth routes (no token required)
router.use('/auth', authRouter);

// Protected routes (require token)
router.use('/categories', verifyToken, categoriesRouter);
router.use('/test-categories', verifyToken, testCategoriesRouter);
router.use('/tests', verifyToken, testsRouter);
router.use('/test-levels', verifyToken, testLevelsRouter);
router.use('/languages', verifyToken, languagesRouter);
router.use('/users', verifyToken, usersRouter);
router.use('/admins', verifyToken, adminsRouter);

module.exports = router;

