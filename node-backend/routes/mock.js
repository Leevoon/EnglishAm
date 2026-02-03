const express = require('express');
const router = express.Router();
const mockData = require('../mockData');

// Categories - IMPORTANT: specific routes must come before parameterized routes
router.get('/categories', (req, res) => {
  res.json(mockData.categories);
});

// This must come BEFORE /categories/:id to avoid matching "menu" as an id
router.get('/categories/menu/test-categories', (req, res) => {
  // Transform to match Sequelize format with labels
  const testCats = mockData.testCategories.map(tc => ({
    id: tc.id,
    category_id: tc.category_id,
    parent_id: tc.parent_id,
    status: 1,
    sort_order: tc.sortOrder,
    labels: [{ name: tc.name, description: tc.description }]
  }));
  res.json(testCats);
});

router.get('/categories/:id/test-categories', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const testCats = mockData.testCategories
    .filter(tc => tc.category_id === categoryId)
    .map(tc => ({
      id: tc.id,
      category_id: tc.category_id,
      parent_id: tc.parent_id,
      status: 1,
      sort_order: tc.sortOrder,
      labels: [{ name: tc.name, description: tc.description }]
    }));
  res.json(testCats);
});

router.get('/categories/:id/subcategories', (req, res) => {
  const id = parseInt(req.params.id);
  const findCategory = (cats) => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findCategory(cat.children);
        if (found) return found;
      }
    }
    return null;
  };
  const category = findCategory(mockData.categories);
  res.json(category?.children || []);
});

// This must come AFTER all /categories/:id/* routes
router.get('/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const findCategory = (cats) => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findCategory(cat.children);
        if (found) return found;
      }
    }
    return null;
  };
  const category = findCategory(mockData.categories);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// Tests
router.get('/tests/levels', (req, res) => {
  // Transform to match Sequelize format with labels
  const levels = mockData.testLevels.map(level => ({
    id: level.id,
    status: 1,
    sort_order: level.sortOrder,
    labels: [{ value: level.name }]
  }));
  res.json(levels);
});

router.get('/tests/categories/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const testCats = mockData.testCategories
    .filter(tc => tc.category_id === categoryId)
    .map(tc => ({
      id: tc.id,
      category_id: tc.category_id,
      parent_id: tc.parent_id,
      status: 1,
      sort_order: tc.sortOrder,
      labels: [{ name: tc.name, description: tc.description }]
    }));
  res.json(testCats);
});

router.get('/tests', (req, res) => {
  const { categoryId, page = 1, limit = 10 } = req.query;
  let tests = mockData.tests;

  if (categoryId) {
    tests = tests.filter(t => t.testCategoryId === parseInt(categoryId));
  }

  const total = tests.length;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const paginatedTests = tests.slice(offset, offset + parseInt(limit));

  res.json({
    tests: paginatedTests,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    }
  });
});

router.get('/tests/:testId', (req, res) => {
  const testId = parseInt(req.params.testId);
  const test = mockData.tests.find(t => t.id === testId);

  if (test) {
    res.json({
      testCategory: {
        id: test.id,
        labels: [{ name: test.title, description: test.description }]
      },
      tests: test.questions.map(q => ({
        id: q.id,
        labels: [{ name: q.question }],
        answers: q.answers.map(a => ({
          id: a.id,
          name: a.text,
          true_false: a.isCorrect ? 1 : 0
        }))
      }))
    });
  } else {
    res.status(404).json({ error: 'Test not found' });
  }
});

router.post('/tests/:testId/submit', (req, res) => {
  const { answers } = req.body;
  let correctCount = 0;
  const results = [];

  for (const answer of answers || []) {
    // Find the correct answer in mock data
    let isCorrect = false;
    for (const test of mockData.tests) {
      for (const q of test.questions) {
        const ans = q.answers.find(a => a.id === answer.answer_id);
        if (ans) {
          isCorrect = ans.isCorrect;
          break;
        }
      }
    }
    if (isCorrect) correctCount++;
    results.push({ test_id: answer.test_id, answer_id: answer.answer_id, correct: isCorrect });
  }

  const total = (answers || []).length || 1;
  res.json({
    score: ((correctCount / total) * 100).toFixed(2),
    correct: correctCount,
    total,
    results
  });
});

// Home endpoints
router.get('/home/slideshow', (req, res) => {
  // Transform to match Sequelize format with slideshowLabels
  const slideshows = mockData.slideshows.map(s => ({
    id: s.id,
    image: s.image,
    status: s.status,
    sort_order: s.sort_order,
    slideshowLabels: [{ title: s.title, value: s.value }]
  }));
  res.json(slideshows);
});

router.get('/home/about', (req, res) => {
  res.json(mockData.aboutContent);
});

router.get('/home/why-choose', (req, res) => {
  res.json(mockData.whyChooseContent);
});

router.get('/home/memberships', (req, res) => {
  res.json(mockData.memberships.map(m => ({
    ...m,
    membershipLabels: [{ title: m.title, value: m.value }]
  })));
});

router.get('/home/testimonials', (req, res) => {
  res.json(mockData.testimonials);
});

router.get('/home/news', (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  res.json(mockData.news.slice(0, limit).map(n => ({
    ...n,
    newsLabels: [{ title: n.title, value: n.value }]
  })));
});

router.get('/home/gallery', (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  res.json(mockData.gallery.slice(0, limit));
});

router.get('/home/page-images', (req, res) => {
  res.json(mockData.pageImages);
});

// Auth
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@example.com' && password === 'password') {
    res.json({
      success: true,
      token: 'mock-jwt-token-12345',
      user: { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User' }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.post('/auth/register', (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  res.json({
    success: true,
    message: 'Registration successful',
    user: { id: 2, email, first_name, last_name }
  });
});

// Content
router.get('/content/page/:key', (req, res) => {
  const { key } = req.params;
  if (key === 'about_us') {
    res.json(mockData.aboutContent);
  } else if (key === 'why') {
    res.json(mockData.whyChooseContent);
  } else {
    res.json({ id: 0, page_key: key, title: key, value: 'Content for ' + key });
  }
});

// TOEFL
router.get('/toefl/sections', (req, res) => {
  res.json([
    { id: 1, name: 'Reading', description: 'TOEFL Reading Section' },
    { id: 2, name: 'Listening', description: 'TOEFL Listening Section' },
    { id: 3, name: 'Speaking', description: 'TOEFL Speaking Section' },
    { id: 4, name: 'Writing', description: 'TOEFL Writing Section' }
  ]);
});

// IELTS
router.get('/ielts/sections', (req, res) => {
  res.json([
    { id: 1, name: 'Reading', description: 'IELTS Reading Section' },
    { id: 2, name: 'Listening', description: 'IELTS Listening Section' },
    { id: 3, name: 'Speaking', description: 'IELTS Speaking Section' },
    { id: 4, name: 'Writing', description: 'IELTS Writing Section' }
  ]);
});

// Ads
router.get('/ads', (req, res) => {
  res.json([
    { id: 1, image: '/images/ad1.jpg', link: '#', position: 'sidebar' },
    { id: 2, image: '/images/ad2.jpg', link: '#', position: 'banner' }
  ]);
});

module.exports = router;
