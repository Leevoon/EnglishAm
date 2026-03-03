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

// ========== ADMIN MOCK ROUTES ==========

// Admin Auth
router.post('/admin/auth/login', (req, res) => {
  const { email, password } = req.body;
  const admin = mockData.admins.find(a => a.email === email && a.password === password);
  if (admin) {
    res.json({
      token: 'mock-admin-jwt-token-12345',
      admin: { id: admin.id, name: admin.name, email: admin.email, group_name: admin.group_name, permissions: ['admin'] }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Generic admin list/detail helper
const adminList = (data, req) => {
  const { page = 1, perPage = 10, sortField = 'id', sortOrder = 'ASC' } = req.query;
  const sorted = [...data].sort((a, b) => {
    if (sortOrder === 'DESC') return (b[sortField] || 0) > (a[sortField] || 0) ? 1 : -1;
    return (a[sortField] || 0) > (b[sortField] || 0) ? 1 : -1;
  });
  const start = (parseInt(page) - 1) * parseInt(perPage);
  return { data: sorted.slice(start, start + parseInt(perPage)), total: data.length };
};

// Admin CRUD for categories
router.get('/admin/categories', (req, res) => {
  // Flatten categories for admin list
  const flat = [];
  const flatten = (cats) => cats.forEach(c => { flat.push({ id: c.id, name: c.label || c.name, description: c.description || '', parent_id: c.parent_id, status: 1, sort_order: c.sort_order }); if (c.children) flatten(c.children); });
  flatten(mockData.categories);
  res.json(adminList(flat, req));
});
router.get('/admin/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const find = (cats) => { for (const c of cats) { if (c.id === id) return c; if (c.children) { const f = find(c.children); if (f) return f; } } return null; };
  const cat = find(mockData.categories);
  res.json(cat ? { id: cat.id, name: cat.label || cat.name, description: cat.description || '', parent_id: cat.parent_id, status: 1, sort_order: cat.sort_order } : {});
});
router.post('/admin/categories', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/categories/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/categories/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for test-categories
router.get('/admin/test-categories', (req, res) => {
  const data = mockData.testCategories.map(tc => ({ id: tc.id, name: tc.name, description: tc.description, category_id: tc.category_id, parent_id: tc.parent_id, status: 1, sort_order: tc.sortOrder }));
  res.json(adminList(data, req));
});
router.get('/admin/test-categories/:id', (req, res) => {
  const tc = mockData.testCategories.find(t => t.id === parseInt(req.params.id));
  res.json(tc ? { id: tc.id, name: tc.name, description: tc.description, category_id: tc.category_id, parent_id: tc.parent_id, status: 1, sort_order: tc.sortOrder } : {});
});
router.post('/admin/test-categories', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/test-categories/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/test-categories/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for tests
router.get('/admin/tests', (req, res) => {
  const data = mockData.tests.map(t => ({ id: t.id, title: t.title, description: t.description, testCategoryId: t.testCategoryId, status: 1 }));
  res.json(adminList(data, req));
});
router.get('/admin/tests/:id', (req, res) => {
  const t = mockData.tests.find(t => t.id === parseInt(req.params.id));
  res.json(t ? { id: t.id, title: t.title, description: t.description, testCategoryId: t.testCategoryId, status: 1 } : {});
});
router.post('/admin/tests', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/tests/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/tests/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for test-levels
router.get('/admin/test-levels', (req, res) => {
  const data = mockData.testLevels.map(l => ({ id: l.id, name: l.name, status: 1, sort_order: l.sortOrder }));
  res.json(adminList(data, req));
});
router.get('/admin/test-levels/:id', (req, res) => {
  const l = mockData.testLevels.find(l => l.id === parseInt(req.params.id));
  res.json(l ? { id: l.id, name: l.name, status: 1, sort_order: l.sortOrder } : {});
});
router.post('/admin/test-levels', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/test-levels/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/test-levels/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for languages
router.get('/admin/languages', (req, res) => {
  const data = mockData.languages.map(l => ({ id: l.id, code: l.code, name: l.name, status: 1 }));
  res.json(adminList(data, req));
});
router.get('/admin/languages/:id', (req, res) => {
  const l = mockData.languages.find(l => l.id === parseInt(req.params.id));
  res.json(l || {});
});
router.post('/admin/languages', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/languages/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/languages/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for users
router.get('/admin/users', (req, res) => {
  const data = mockData.users.map(u => ({ id: u.id, email: u.email, first_name: u.first_name, last_name: u.last_name, block: u.block }));
  res.json(adminList(data, req));
});
router.get('/admin/users/:id', (req, res) => {
  const u = mockData.users.find(u => u.id === parseInt(req.params.id));
  res.json(u ? { id: u.id, email: u.email, first_name: u.first_name, last_name: u.last_name, block: u.block } : {});
});
router.post('/admin/users', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/users/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/users/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for admins
router.get('/admin/admins', (req, res) => {
  const data = mockData.admins.map(a => ({ id: a.id, email: a.email, name: a.name, group_id: a.group_id, group_name: a.group_name, status: a.status }));
  res.json(adminList(data, req));
});
router.get('/admin/admins/:id', (req, res) => {
  const a = mockData.admins.find(a => a.id === parseInt(req.params.id));
  res.json(a ? { id: a.id, email: a.email, name: a.name, group_id: a.group_id, group_name: a.group_name, status: a.status } : {});
});
router.post('/admin/admins', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/admins/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/admins/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

module.exports = router;
