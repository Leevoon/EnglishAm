const express = require('express');
const auth = require('../controllers/auth');
const pub = require('../controllers/public');
const tests = require('../controllers/tests');
const toefl = require('../controllers/toefl');
const ielts = require('../controllers/ielts');
const account = require('../controllers/account');
const admin = require('../controllers/admin');
const { requireUser, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true }));

// Auth
router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);
router.post('/auth/guest', auth.guest);
router.get('/auth/me', auth.me);
router.post('/auth/change-password', requireUser, auth.changePassword);
router.post('/auth/admin/login', auth.adminLogin);

// Public — site config / content
router.get('/languages', pub.languages);
router.get('/translations', pub.translations);
router.get('/home', pub.home);
router.get('/news', pub.newsList);
router.get('/news/:id', pub.newsDetail);
router.get('/gallery', pub.gallery);
router.get('/faq', pub.faq);
router.get('/lessons', pub.lessonsList);
router.get('/lessons/levels', pub.lessonsLevels);
router.get('/lessons/filters', pub.lessonsFilters);
router.get('/lessons/:id', pub.lessonDetail);
router.get('/contact-info', pub.contactInfo);
router.post('/contact', pub.submitContact);
router.get('/socials', pub.socialsList);
router.get('/static-pages/:key', pub.staticPage);
router.get('/page-images/:key', pub.pageImage);
router.get('/membership-plans', pub.membershipPlans);
router.get('/categories', pub.categoriesList);
router.get('/cv', pub.cvList);
router.get('/downloadable-content', pub.downloadablesList);

// Tests (general practice)
router.get('/tests/categories/:key', tests.listByCategory);
router.get('/tests/:id', tests.getTest);
router.post('/tests/:id/submit', requireUser, tests.submitTest);

// TOEFL
router.get('/toefl/reading', toefl.readingList);
router.get('/toefl/reading/:id', toefl.readingDetail);
router.post('/toefl/reading/:id/submit', requireUser, toefl.readingSubmit);
router.get('/toefl/listening', toefl.listeningList);
router.get('/toefl/listening/:id', toefl.listeningDetail);
router.post('/toefl/listening/:id/submit', requireUser, toefl.listeningSubmit);
router.get('/toefl/speaking', toefl.speakingList);
router.get('/toefl/writing', toefl.writingList);

// IELTS — :track is "general" or "academic"
router.get('/ielts/:track/reading', ielts.readingList);
router.get('/ielts/:track/reading/:id', ielts.readingDetail);
router.post('/ielts/:track/reading/:id/submit', requireUser, ielts.readingSubmit);
router.get('/ielts/:track/listening', ielts.listeningList);
router.get('/ielts/:track/speaking', ielts.speakingList);
router.get('/ielts/:track/writing', ielts.writingList);

// Account (authenticated user)
router.get('/account/dashboard', requireUser, account.dashboard);
router.get('/account/profile', requireUser, account.profile);
router.put('/account/profile', requireUser, account.updateProfile);
router.get('/account/results', requireUser, account.results);
router.get('/account/statistics', requireUser, account.statistics);
router.get('/account/subscription', requireUser, account.subscription);

// Admin generic CRUD
router.get('/admin/dashboard', requireAdmin, admin.dashboard);
router.get('/admin/:resource', requireAdmin, admin.list);
router.get('/admin/:resource/:id', requireAdmin, admin.getOne);
router.post('/admin/:resource', requireAdmin, admin.create);
router.put('/admin/:resource/:id', requireAdmin, admin.update);
router.delete('/admin/:resource/:id', requireAdmin, admin.remove);

module.exports = router;
