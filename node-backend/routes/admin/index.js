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

// CMS content routes
const newsRouter = require('./news');
const slideshowRouter = require('./slideshow');
const galleryRouter = require('./gallery');
const membershipPlansRouter = require('./membershipPlans');
const membershipsRouter = require('./memberships');
const userHistoryRouter = require('./userHistory');

// TOEFL routes
const toeflReadingRouter = require('./toeflReading');
const toeflReadingTestsRouter = require('./toeflReadingTests');
const toeflReadingQuestionsRouter = require('./toeflReadingQuestions');
const toeflListeningRouter = require('./toeflListening');
const toeflListeningTestsRouter = require('./toeflListeningTests');
const toeflListeningQuestionsRouter = require('./toeflListeningQuestions');
const toeflSpeakingRouter = require('./toeflSpeaking');
const toeflWritingRouter = require('./toeflWriting');

// IELTS routes
const ieltsReadingRouter = require('./ieltsReading');
const ieltsReadingQuestionsRouter = require('./ieltsReadingQuestions');
const ieltsListeningRouter = require('./ieltsListening');
const ieltsListeningQuestionsRouter = require('./ieltsListeningQuestions');
const ieltsSpeakingRouter = require('./ieltsSpeaking');
const ieltsWritingRouter = require('./ieltsWriting');

// Section test routes
const {
  audioTestsRouter,
  synonymTestsRouter,
  antonymTestsRouter,
  generalEnglishTestsRouter,
  professionalEnglishTestsRouter,
  photoTestsRouter,
} = require('./sectionTests');

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

// CMS content
router.use('/news', verifyToken, newsRouter);
router.use('/slideshow', verifyToken, slideshowRouter);
router.use('/gallery', verifyToken, galleryRouter);
router.use('/membership-plans', verifyToken, membershipPlansRouter);
router.use('/membership-access', verifyToken, membershipsRouter);
router.use('/user-history', verifyToken, userHistoryRouter);

// TOEFL
router.use('/toefl-reading', verifyToken, toeflReadingRouter);
router.use('/toefl-reading-tests', verifyToken, toeflReadingTestsRouter);
router.use('/toefl-reading-questions', verifyToken, toeflReadingQuestionsRouter);
router.use('/toefl-listening', verifyToken, toeflListeningRouter);
router.use('/toefl-listening-tests', verifyToken, toeflListeningTestsRouter);
router.use('/toefl-listening-questions', verifyToken, toeflListeningQuestionsRouter);
router.use('/toefl-speaking', verifyToken, toeflSpeakingRouter);
router.use('/toefl-writing', verifyToken, toeflWritingRouter);

// IELTS
router.use('/ielts-reading', verifyToken, ieltsReadingRouter);
router.use('/ielts-reading-questions', verifyToken, ieltsReadingQuestionsRouter);
router.use('/ielts-listening', verifyToken, ieltsListeningRouter);
router.use('/ielts-listening-questions', verifyToken, ieltsListeningQuestionsRouter);
router.use('/ielts-speaking', verifyToken, ieltsSpeakingRouter);
router.use('/ielts-writing', verifyToken, ieltsWritingRouter);

// Section Tests
router.use('/audio-tests', verifyToken, audioTestsRouter);
router.use('/synonym-tests', verifyToken, synonymTestsRouter);
router.use('/antonym-tests', verifyToken, antonymTestsRouter);
router.use('/general-english-tests', verifyToken, generalEnglishTestsRouter);
router.use('/professional-english-tests', verifyToken, professionalEnglishTestsRouter);
router.use('/photo-tests', verifyToken, photoTestsRouter);

module.exports = router;

