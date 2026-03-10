const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const mockData = require('../mockData');

// ==================== HELPER FUNCTIONS ====================

const filterByLanguage = (labels, languageId) => {
  const lid = parseInt(languageId) || 1;
  return labels.filter(l => l.language_id === lid);
};

const adminList = (data, req) => {
  const { page = 1, perPage = 10, sortField = 'id', sortOrder = 'ASC' } = req.query;
  const sorted = [...data].sort((a, b) => {
    if (sortOrder === 'DESC') return (b[sortField] || 0) > (a[sortField] || 0) ? 1 : -1;
    return (a[sortField] || 0) > (b[sortField] || 0) ? 1 : -1;
  });
  const start = (parseInt(page) - 1) * parseInt(perPage);
  return { data: sorted.slice(start, start + parseInt(perPage)), total: data.length };
};

// Build categories with labels and children for frontend
const buildCategoryTree = (languageId) => {
  const lid = parseInt(languageId) || 1;
  const cats = mockData.categories.map(cat => {
    const labels = mockData.categoryLabels.filter(l => l.category_id === cat.id && l.language_id === lid);
    return {
      ...cat,
      categoryLabels: labels.map(l => ({ value: l.value })),
      label: labels.length > 0 ? labels[0].value : `Category ${cat.id}`,
      children: []
    };
  });

  // Build tree
  const roots = [];
  const map = {};
  cats.forEach(c => { map[c.id] = c; });
  cats.forEach(c => {
    if (c.parent_id === 0) {
      roots.push(c);
    } else if (map[c.parent_id]) {
      map[c.parent_id].children.push(c);
    }
  });

  return roots;
};

// ==================== CATEGORIES ====================

router.get('/categories', (req, res) => {
  const tree = buildCategoryTree(req.query.languageId);
  res.json(tree);
});

router.get('/categories/menu/test-categories', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const testCats = mockData.testCategories
    .filter(tc => tc.status === 1)
    .map(tc => {
      const labels = mockData.testCategoryLabels.filter(l => l.test_category_id === tc.id && l.language_id === languageId);
      return {
        id: tc.id,
        category_id: tc.category_id,
        parent_id: tc.parent_id,
        level_id: tc.level_id,
        status: tc.status,
        sort_order: tc.sort_order,
        time: tc.time,
        image: tc.image,
        labels: labels.length > 0 ? labels : [{ name: `Test ${tc.id}`, description: '', seo_name: '' }]
      };
    });
  res.json(testCats);
});

router.get('/categories/:id/test-categories', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const languageId = parseInt(req.query.languageId) || 1;
  const testCats = mockData.testCategories
    .filter(tc => tc.category_id === categoryId && tc.status === 1)
    .map(tc => {
      const labels = mockData.testCategoryLabels.filter(l => l.test_category_id === tc.id && l.language_id === languageId);
      return {
        id: tc.id,
        category_id: tc.category_id,
        parent_id: tc.parent_id,
        level_id: tc.level_id,
        status: tc.status,
        sort_order: tc.sort_order,
        time: tc.time,
        image: tc.image,
        labels: labels.length > 0 ? labels : [{ name: `Test ${tc.id}`, description: '', seo_name: '' }]
      };
    });
  res.json(testCats);
});

router.get('/categories/:id/subcategories', (req, res) => {
  const id = parseInt(req.params.id);
  const languageId = parseInt(req.query.languageId) || 1;
  const children = mockData.categories
    .filter(c => c.parent_id === id)
    .map(cat => {
      const labels = mockData.categoryLabels.filter(l => l.category_id === cat.id && l.language_id === languageId);
      return {
        ...cat,
        categoryLabels: labels.map(l => ({ value: l.value })),
        label: labels.length > 0 ? labels[0].value : `Category ${cat.id}`,
        children: []
      };
    });
  res.json(children);
});

router.get('/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const languageId = parseInt(req.query.languageId) || 1;
  const cat = mockData.categories.find(c => c.id === id);
  if (!cat) return res.status(404).json({ error: 'Category not found' });

  const labels = mockData.categoryLabels.filter(l => l.category_id === cat.id && l.language_id === languageId);
  const children = mockData.categories.filter(c => c.parent_id === id).map(child => {
    const childLabels = mockData.categoryLabels.filter(l => l.category_id === child.id && l.language_id === languageId);
    return { ...child, categoryLabels: childLabels.map(l => ({ value: l.value })), label: childLabels[0]?.value || `Category ${child.id}`, children: [] };
  });

  res.json({
    ...cat,
    categoryLabels: labels.map(l => ({ value: l.value })),
    label: labels[0]?.value || `Category ${cat.id}`,
    children
  });
});

// ==================== TESTS ====================

router.get('/tests/levels', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const levels = mockData.testLevels.map(level => {
    const labels = mockData.testLevelLabels.filter(l => l.test_level_id === level.id && l.language_id === languageId);
    return {
      id: level.id,
      status: level.status,
      sort_order: level.sort_order,
      labels: labels.length > 0 ? labels.map(l => ({ name: l.name, seo_name: l.seo_name })) : [{ name: `Level ${level.id}`, seo_name: '' }]
    };
  });
  res.json(levels);
});

router.get('/tests/categories/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const languageId = parseInt(req.query.languageId) || 1;
  const testCats = mockData.testCategories
    .filter(tc => tc.category_id === categoryId && tc.status === 1)
    .map(tc => {
      const labels = mockData.testCategoryLabels.filter(l => l.test_category_id === tc.id && l.language_id === languageId);
      return {
        id: tc.id,
        category_id: tc.category_id,
        parent_id: tc.parent_id,
        level_id: tc.level_id,
        status: tc.status,
        sort_order: tc.sort_order,
        time: tc.time,
        view_count: tc.view_count,
        image: tc.image,
        labels: labels.length > 0 ? labels : [{ name: `Test ${tc.id}`, description: '', seo_name: '' }]
      };
    });
  res.json(testCats);
});

router.get('/tests/categories/:categoryId/filters', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const languageId = parseInt(req.query.languageId) || 1;
  // Return subcategories as filters
  const filters = mockData.testCategories
    .filter(tc => tc.category_id === categoryId && tc.parent_id !== 0 && tc.status === 1)
    .map(tc => {
      const labels = mockData.testCategoryLabels.filter(l => l.test_category_id === tc.id && l.language_id === languageId);
      return {
        id: tc.id,
        category_id: tc.category_id,
        parent_id: tc.parent_id,
        labels: labels.length > 0 ? labels : [{ name: `Filter ${tc.id}`, description: '' }]
      };
    });
  res.json(filters);
});

router.get('/tests', (req, res) => {
  const { categoryId, levelId, page = 1, limit = 10, languageId = 1 } = req.query;
  let tests = [...mockData.tests].filter(t => t.status === 1);
  const lid = parseInt(languageId) || 1;

  if (categoryId) {
    tests = tests.filter(t => t.parent_id === parseInt(categoryId));
  }
  if (levelId) {
    // Filter by test_category level
    const catIds = mockData.testCategories.filter(tc => tc.level_id === parseInt(levelId)).map(tc => tc.id);
    tests = tests.filter(t => catIds.includes(t.parent_id));
  }

  const total = tests.length;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const paginatedTests = tests.slice(offset, offset + parseInt(limit));

  const formatted = paginatedTests.map(t => {
    const labels = mockData.testLabels.filter(l => l.test_id === t.id && l.language_id === lid);
    const answers = mockData.testAnswers.filter(a => a.test_id === t.id);
    return {
      id: t.id,
      parent_id: t.parent_id,
      status: t.status,
      question_type: t.question_type,
      answer_type: t.answer_type,
      image: t.image,
      question: t.question,
      sort_order: t.sort_order,
      view_count: t.view_count,
      audio: t.audio,
      labels: labels.length > 0 ? labels : [{ value: t.question }],
      answers: answers
    };
  });

  res.json({
    tests: formatted,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
  });
});

router.get('/tests/:testId', (req, res) => {
  const testId = parseInt(req.params.testId);
  const languageId = parseInt(req.query.languageId) || 1;

  // testId here is actually testCategoryId
  const testCategory = mockData.testCategories.find(tc => tc.id === testId);
  if (!testCategory) return res.status(404).json({ error: 'Test not found' });

  const tcLabels = mockData.testCategoryLabels.filter(l => l.test_category_id === testId && l.language_id === languageId);
  const tests = mockData.tests
    .filter(t => t.parent_id === testId && t.status === 1)
    .map(t => {
      const labels = mockData.testLabels.filter(l => l.test_id === t.id && l.language_id === languageId);
      const answers = mockData.testAnswers.filter(a => a.test_id === t.id);
      return {
        id: t.id,
        parent_id: t.parent_id,
        question_type: t.question_type,
        answer_type: t.answer_type,
        image: t.image,
        question: t.question,
        audio: t.audio,
        labels: labels.length > 0 ? labels : [{ value: t.question }],
        answers: answers.map(a => ({ id: a.id, test_id: a.test_id, true_false: a.true_false, value: a.value }))
      };
    });

  res.json({
    testCategory: {
      id: testCategory.id,
      category_id: testCategory.category_id,
      time: testCategory.time,
      labels: tcLabels.length > 0 ? tcLabels : [{ name: `Test ${testId}`, description: '' }]
    },
    tests
  });
});

router.post('/tests/:testId/submit', (req, res) => {
  const { answers, userId, duration } = req.body;
  let correctCount = 0;
  const results = [];

  for (const answer of answers || []) {
    const testAnswer = mockData.testAnswers.find(a => a.id === answer.answer_id);
    const isCorrect = testAnswer ? testAnswer.true_false === 1 : false;
    if (isCorrect) correctCount++;
    results.push({ test_id: answer.test_id, answer_id: answer.answer_id, correct: isCorrect });
  }

  const total = (answers || []).length || 1;
  const score = ((correctCount / total) * 100).toFixed(2);

  // Store in history
  if (userId) {
    mockData.testHistory.push({
      id: mockData.testHistory.length + 1,
      user_id: parseInt(userId),
      test_category_id: parseInt(req.params.testId),
      score: parseFloat(score),
      correct: correctCount,
      total,
      duration: duration || 0,
      created_date: new Date().toISOString()
    });
  }

  res.json({ score, correct: correctCount, total, results });
});

router.get('/tests/history/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const history = mockData.testHistory.filter(h => h.user_id === userId);
  res.json(history);
});

router.get('/tests/statistics/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const history = mockData.testHistory.filter(h => h.user_id === userId);
  const totalTests = history.length;
  const avgScore = totalTests > 0 ? (history.reduce((sum, h) => sum + h.score, 0) / totalTests).toFixed(2) : 0;
  const totalCorrect = history.reduce((sum, h) => sum + h.correct, 0);
  const totalQuestions = history.reduce((sum, h) => sum + h.total, 0);

  res.json({
    totalTests,
    averageScore: parseFloat(avgScore),
    totalCorrect,
    totalQuestions,
    history: history.slice(-10)
  });
});

// ==================== HOME ENDPOINTS ====================

router.get('/home/slideshow', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const slideshows = mockData.slideshows
    .filter(s => s.status === 1)
    .map(s => {
      const labels = mockData.slideshowLabels.filter(l => l.slideshow_id === s.id && l.language_id === languageId);
      return {
        id: s.id,
        image: s.image,
        status: s.status,
        sort_order: s.sort_order,
        href: s.href,
        slideshowLabels: labels.map(l => ({ value: l.value }))
      };
    });
  res.json(slideshows);
});

router.get('/home/about', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const page = mockData.staticPages.find(p => p.page_key === 'about_us');
  if (!page) return res.json(null);
  const label = mockData.staticPagesLabels.find(l => l.static_pages_id === page.id && l.language_id === languageId);
  res.json({
    id: page.id,
    page_key: page.page_key,
    title: label?.title || 'About Us',
    value: label?.value || ''
  });
});

router.get('/home/why-choose', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const page = mockData.staticPages.find(p => p.page_key === 'why');
  if (!page) return res.json(null);
  const label = mockData.staticPagesLabels.find(l => l.static_pages_id === page.id && l.language_id === languageId);
  res.json({
    id: page.id,
    page_key: page.page_key,
    title: label?.title || 'Why Choose Us',
    value: label?.value || ''
  });
});

router.get('/home/memberships', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const memberships = mockData.memberships
    .filter(m => m.status === 1)
    .map(m => {
      const labels = mockData.membershipLabels.filter(l => l.membership_id === m.id && l.language_id === languageId);
      return {
        id: m.id,
        status: m.status,
        sort_ortder: m.sort_ortder,
        price: m.price,
        vip: m.vip,
        membershipLabels: labels.map(l => ({ title: l.title, short_description: l.short_description, description: l.description }))
      };
    })
    .sort((a, b) => a.sort_ortder - b.sort_ortder);
  res.json(memberships);
});

router.get('/home/testimonials', (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const reviews = mockData.reviews
    .filter(r => r.status === 1)
    .map(r => {
      const user = mockData.users.find(u => u.id === r.user_id) || { id: r.user_id, first_name: 'User', last_name: '', avatar: null };
      return {
        id: r.id,
        user_id: r.user_id,
        status: r.status,
        profession: r.profession,
        review: r.review,
        created_date: r.created_date,
        user: { id: user.id, first_name: user.first_name, last_name: user.last_name, avatar: user.avatar }
      };
    })
    .slice(0, limit);
  res.json(reviews);
});

router.get('/home/news', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const news = mockData.news
    .filter(n => n.status === 1)
    .map(n => {
      const labels = mockData.newsLabels.filter(l => l.news_id === n.id && l.language_id === languageId);
      return {
        id: n.id,
        status: n.status,
        created_date: n.created_date,
        sort_order: n.sort_order,
        view_count: n.view_count,
        image: n.image,
        video: n.video,
        type: n.type,
        newsLabels: labels.map(l => ({ title: l.title, value: l.value }))
      };
    })
    .slice(0, limit);
  res.json(news);
});

router.get('/home/gallery', (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  const gallery = mockData.gallery
    .filter(g => g.status === 1)
    .slice(0, limit);
  res.json(gallery);
});

router.get('/home/page-images', (req, res) => {
  const keys = req.query.keys ? req.query.keys.split(',') : null;
  const result = {};
  const images = keys
    ? mockData.pageImages.filter(pi => keys.includes(pi.key))
    : mockData.pageImages;
  images.forEach(pi => { result[pi.key] = pi.image; });
  res.json(result);
});

router.get('/home/faq', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const faqs = mockData.faq
    .filter(f => f.status === 1)
    .map(f => {
      const labels = mockData.faqLabels.filter(l => l.faq_id === f.id && l.language_id === languageId);
      return {
        id: f.id,
        status: f.status,
        sort_order: f.sort_order,
        faqLabels: labels.map(l => ({ question: l.question, answer: l.answer }))
      };
    });
  res.json(faqs);
});

// ==================== AUTH ====================

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Hash password with MD5 to match DB format
  const md5Hash = crypto.createHash('md5').update(password || '').digest('hex');
  const user = mockData.users.find(u => (u.email === email || u.user_name === email) && u.password === md5Hash);

  if (user) {
    res.json({
      success: true,
      token: user.auth_key || 'mock-jwt-token-' + user.id,
      user: { id: user.id, email: user.email, user_name: user.user_name, first_name: user.first_name, last_name: user.last_name, avatar: user.avatar, gender: user.gender }
    });
  } else {
    // Also allow plain-text password match for dev convenience
    const userPlain = mockData.users.find(u => (u.email === email || u.user_name === email));
    if (userPlain && password === 'password') {
      res.json({
        success: true,
        token: userPlain.auth_key || 'mock-jwt-token-' + userPlain.id,
        user: { id: userPlain.id, email: userPlain.email, user_name: userPlain.user_name, first_name: userPlain.first_name, last_name: userPlain.last_name, avatar: userPlain.avatar, gender: userPlain.gender }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }
});

router.post('/auth/register', (req, res) => {
  const { email, password, first_name, last_name, user_name } = req.body;
  const newId = Math.max(...mockData.users.map(u => u.id)) + 1;
  const md5Hash = crypto.createHash('md5').update(password || '').digest('hex');
  const authKey = crypto.randomBytes(16).toString('hex');
  const newUser = {
    id: newId, block: 0, user_name: user_name || email, password: md5Hash, email,
    first_name: first_name || '', last_name: last_name || '', gender: 1, dob: null, avatar: null, auth_key: authKey
  };
  mockData.users.push(newUser);
  res.json({
    success: true,
    message: 'Registration successful',
    token: authKey,
    user: { id: newUser.id, email: newUser.email, user_name: newUser.user_name, first_name: newUser.first_name, last_name: newUser.last_name }
  });
});

router.get('/auth/me', (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const user = mockData.users.find(u => u.auth_key === token);
  if (user) {
    res.json({ id: user.id, email: user.email, user_name: user.user_name, first_name: user.first_name, last_name: user.last_name, avatar: user.avatar, gender: user.gender });
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/auth/guest', (req, res) => {
  const guest = mockData.users.find(u => u.user_name === 'guest');
  if (guest) {
    res.json({
      success: true,
      token: guest.auth_key,
      user: { id: guest.id, email: guest.email, user_name: guest.user_name, first_name: guest.first_name, last_name: guest.last_name, avatar: guest.avatar }
    });
  } else {
    res.json({
      success: true,
      token: 'guest-token',
      user: { id: 0, email: 'guest@guest.am', user_name: 'guest', first_name: 'Guest', last_name: '', avatar: null }
    });
  }
});

router.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

router.post('/auth/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const token = req.headers.authorization;
  const user = mockData.users.find(u => u.auth_key === token);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const currentMd5 = crypto.createHash('md5').update(currentPassword || '').digest('hex');
  if (user.password !== currentMd5 && currentPassword !== 'password') {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  user.password = crypto.createHash('md5').update(newPassword || '').digest('hex');
  res.json({ success: true, message: 'Password changed successfully' });
});

// ==================== CONTENT ====================

router.get('/content/page/:key', (req, res) => {
  const { key } = req.params;
  const languageId = parseInt(req.query.languageId) || 1;
  const page = mockData.staticPages.find(p => p.page_key === key);
  if (!page) return res.json({ id: 0, page_key: key, title: key, value: '' });
  const label = mockData.staticPagesLabels.find(l => l.static_pages_id === page.id && l.language_id === languageId);
  res.json({ id: page.id, page_key: page.page_key, title: label?.title || key, value: label?.value || '' });
});

router.get('/content/about', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const page = mockData.staticPages.find(p => p.page_key === 'about_us');
  if (!page) return res.json(null);
  const label = mockData.staticPagesLabels.find(l => l.static_pages_id === page.id && l.language_id === languageId);
  res.json({ id: page.id, page_key: page.page_key, title: label?.title || 'About Us', value: label?.value || '' });
});

router.get('/content/contact', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const info = mockData.contactInfo[0];
  if (!info) return res.json(null);
  const label = mockData.contactInfoLabels.find(l => l.contact_info_id === info.id && l.language_id === languageId);
  res.json({
    id: info.id,
    email: info.email,
    phone: info.phone,
    address: label?.address || ''
  });
});

router.post('/content/contact/send', (req, res) => {
  const { name, email, subject, message } = req.body;
  mockData.contactMessages.push({ id: mockData.contactMessages.length + 1, name, email, subject, message, created_date: new Date().toISOString() });
  res.json({ success: true, message: 'Message sent successfully' });
});

// ==================== TOEFL ====================

const buildSectionList = (items, labels, idField, languageId) => {
  const lid = parseInt(languageId) || 1;
  return items
    .filter(item => item.status === 1)
    .map(item => {
      const itemLabels = labels.filter(l => l[idField] === item.id && l.language_id === lid);
      return {
        ...item,
        labels: itemLabels.length > 0 ? itemLabels : [{ name: `Item ${item.id}` }]
      };
    })
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
};

router.get('/toefl/reading', (req, res) => {
  res.json(buildSectionList(mockData.toeflReading, mockData.toeflReadingLabels, 'toefl_reading_id', req.query.languageId));
});

router.get('/toefl/listening', (req, res) => {
  res.json(buildSectionList(mockData.toeflListening, mockData.toeflListeningLabels, 'toefl_listening_id', req.query.languageId));
});

router.get('/toefl/speaking', (req, res) => {
  res.json(buildSectionList(mockData.toeflSpeaking, mockData.toeflSpeakingLabels, 'toefl_speaking_id', req.query.languageId));
});

router.get('/toefl/writing', (req, res) => {
  res.json(buildSectionList(mockData.toeflWriting, mockData.toeflWritingLabels, 'toefl_writing_id', req.query.languageId));
});

router.get('/toefl/complete', (req, res) => {
  res.json(buildSectionList(mockData.toeflComplete, mockData.toeflCompleteLabels, 'toefl_complete_id', req.query.languageId));
});

router.get('/toefl/sections', (req, res) => {
  res.json([
    { id: 1, name: 'Reading', description: 'TOEFL Reading Section', count: mockData.toeflReading.filter(r => r.status === 1).length },
    { id: 2, name: 'Listening', description: 'TOEFL Listening Section', count: mockData.toeflListening.filter(r => r.status === 1).length },
    { id: 3, name: 'Speaking', description: 'TOEFL Speaking Section', count: mockData.toeflSpeaking.filter(r => r.status === 1).length },
    { id: 4, name: 'Writing', description: 'TOEFL Writing Section', count: mockData.toeflWriting.filter(r => r.status === 1).length }
  ]);
});

router.get('/toefl/:section/:id', (req, res) => {
  const { section, id } = req.params;
  const sectionId = parseInt(id);
  const languageId = parseInt(req.query.languageId) || 1;

  const sectionMap = {
    reading: { data: mockData.toeflReading, labels: mockData.toeflReadingLabels, idField: 'toefl_reading_id' },
    listening: { data: mockData.toeflListening, labels: mockData.toeflListeningLabels, idField: 'toefl_listening_id' },
    speaking: { data: mockData.toeflSpeaking, labels: mockData.toeflSpeakingLabels, idField: 'toefl_speaking_id' },
    writing: { data: mockData.toeflWriting, labels: mockData.toeflWritingLabels, idField: 'toefl_writing_id' }
  };

  const sectionData = sectionMap[section];
  if (!sectionData) return res.status(404).json({ error: 'Section not found' });

  const item = sectionData.data.find(i => i.id === sectionId);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const labels = sectionData.labels.filter(l => l[sectionData.idField] === sectionId && l.language_id === languageId);

  res.json({
    ...item,
    labels: labels.length > 0 ? labels : [{ name: `${section} ${sectionId}` }],
    questions: [] // Questions would come from sub-tables in real DB
  });
});

router.post('/toefl/:section/:id/submit', (req, res) => {
  res.json({ success: true, message: 'Answers submitted', score: 0 });
});

// ==================== IELTS ====================

router.get('/ielts/reading', (req, res) => {
  res.json(buildSectionList(mockData.ieltsReading, mockData.ieltsReadingLabels, 'ielts_reading_id', req.query.languageId));
});

router.get('/ielts/listening', (req, res) => {
  res.json(buildSectionList(mockData.ieltsListening, mockData.ieltsListeningLabels, 'ielts_listening_id', req.query.languageId));
});

router.get('/ielts/speaking', (req, res) => {
  res.json(buildSectionList(mockData.ieltsSpeaking, mockData.ieltsSpeakingLabels, 'ielts_speaking_id', req.query.languageId));
});

router.get('/ielts/writing', (req, res) => {
  res.json(buildSectionList(mockData.ieltsWriting, mockData.ieltsWritingLabels, 'ielts_writing_id', req.query.languageId));
});

router.get('/ielts/complete', (req, res) => {
  res.json(buildSectionList(mockData.ieltsComplete, mockData.ieltsCompleteLabels, 'ielts_complete_id', req.query.languageId));
});

router.get('/ielts/sections', (req, res) => {
  res.json([
    { id: 1, name: 'Reading', description: 'IELTS Reading Section', count: mockData.ieltsReading.filter(r => r.status === 1).length },
    { id: 2, name: 'Listening', description: 'IELTS Listening Section', count: mockData.ieltsListening.filter(r => r.status === 1).length },
    { id: 3, name: 'Speaking', description: 'IELTS Speaking Section', count: mockData.ieltsSpeaking.filter(r => r.status === 1).length },
    { id: 4, name: 'Writing', description: 'IELTS Writing Section', count: mockData.ieltsWriting.filter(r => r.status === 1).length }
  ]);
});

router.get('/ielts/:section/:id', (req, res) => {
  const { section, id } = req.params;
  const sectionId = parseInt(id);
  const languageId = parseInt(req.query.languageId) || 1;

  const sectionMap = {
    reading: { data: mockData.ieltsReading, labels: mockData.ieltsReadingLabels, idField: 'ielts_reading_id' },
    listening: { data: mockData.ieltsListening, labels: mockData.ieltsListeningLabels, idField: 'ielts_listening_id' },
    speaking: { data: mockData.ieltsSpeaking, labels: mockData.ieltsSpeakingLabels, idField: 'ielts_speaking_id' },
    writing: { data: mockData.ieltsWriting, labels: mockData.ieltsWritingLabels, idField: 'ielts_writing_id' }
  };

  const sectionData = sectionMap[section];
  if (!sectionData) return res.status(404).json({ error: 'Section not found' });

  const item = sectionData.data.find(i => i.id === sectionId);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const labels = sectionData.labels.filter(l => l[sectionData.idField] === sectionId && l.language_id === languageId);

  res.json({
    ...item,
    labels: labels.length > 0 ? labels : [{ name: `${section} ${sectionId}` }],
    questions: []
  });
});

router.post('/ielts/:section/:id/submit', (req, res) => {
  res.json({ success: true, message: 'Answers submitted', score: 0 });
});

// ==================== ADS ====================

router.get('/ads/test/:testId', (req, res) => {
  res.json(null);
});

router.get('/ads', (req, res) => {
  res.json([]);
});

// ==================== SETTINGS, SOCIALS, TRANSLATIONS ====================

router.get('/settings', (req, res) => {
  res.json(mockData.settings);
});

router.get('/socials', (req, res) => {
  res.json(mockData.socials.filter(s => s.status === 1));
});

router.get('/translations', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const result = {};
  mockData.translations.forEach(t => {
    const label = mockData.translationLabels.find(l => l.translation_id === t.id && l.language_id === languageId);
    result[t.key] = label?.value || t.key;
  });
  res.json(result);
});

// ==================== FAQ ====================

router.get('/faq', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const faqs = mockData.faq
    .filter(f => f.status === 1)
    .map(f => {
      const labels = mockData.faqLabels.filter(l => l.faq_id === f.id && l.language_id === languageId);
      return {
        id: f.id,
        status: f.status,
        sort_order: f.sort_order,
        faqLabels: labels.map(l => ({ question: l.question, answer: l.answer }))
      };
    });
  res.json(faqs);
});

// ==================== LESSONS ====================

router.get('/lessons', (req, res) => {
  const { levelId, filterId, languageId, page = 1, limit = 20 } = req.query;
  let lessons = [...mockData.lessons].filter(l => l.status === 1);

  if (levelId) lessons = lessons.filter(l => l.level_id === parseInt(levelId));
  if (filterId) lessons = lessons.filter(l => l.filter_id === parseInt(filterId));

  const total = lessons.length;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const paginated = lessons.slice(offset, offset + parseInt(limit));

  res.json({
    lessons: paginated,
    levels: mockData.lessonsLevels.filter(l => l.status === 1).sort((a, b) => a.sort_order - b.sort_order),
    filters: mockData.lessonsFilters.filter(f => f.status === 1).sort((a, b) => a.sort_order - b.sort_order),
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
  });
});

// ==================== TRAININGS ====================

router.get('/trainings', (req, res) => {
  const languageId = parseInt(req.query.languageId) || 1;
  const groups = mockData.trainingsGroups
    .filter(g => g.status === 1)
    .map(g => {
      const labels = mockData.trainingsGroupLabels.filter(l => l.trainings_group_id === g.id && l.language_id === languageId);
      const trainings = mockData.trainings.filter(t => t.trainings_group_id === g.id && t.status === 1);
      return {
        id: g.id,
        status: g.status,
        sort_order: g.sort_order,
        labels: labels.length > 0 ? labels : [{ name: `Training Group ${g.id}` }],
        trainings
      };
    });
  res.json(groups);
});

// ==================== ADMIN MOCK ROUTES ====================

router.post('/admin/auth/login', (req, res) => {
  const { email, password } = req.body;
  const md5Hash = crypto.createHash('md5').update(password || '').digest('hex');
  const admin = mockData.admins.find(a => a.email === email && (a.password === md5Hash || a.password === password));
  if (admin) {
    const group = mockData.adminsGroups.find(g => g.id === admin.group_id);
    res.json({
      token: 'mock-admin-jwt-token-' + admin.id,
      admin: { id: admin.id, name: admin.name, email: admin.email, group_name: group?.title || 'admin', permissions: ['admin'] }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Admin CRUD for categories
router.get('/admin/categories', (req, res) => {
  const flat = mockData.categories.map(c => {
    const label = mockData.categoryLabels.find(l => l.category_id === c.id && l.language_id === 1);
    return { id: c.id, name: label?.value || `Category ${c.id}`, parent_id: c.parent_id, status: c.status, sort_order: c.sort_order, key: c.key };
  });
  res.json(adminList(flat, req));
});
router.get('/admin/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const cat = mockData.categories.find(c => c.id === id);
  if (!cat) return res.json({});
  const label = mockData.categoryLabels.find(l => l.category_id === id && l.language_id === 1);
  res.json({ id: cat.id, name: label?.value || '', parent_id: cat.parent_id, status: cat.status, sort_order: cat.sort_order, key: cat.key });
});
router.post('/admin/categories', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/categories/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/categories/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for test-categories
router.get('/admin/test-categories', (req, res) => {
  const data = mockData.testCategories.map(tc => {
    const label = mockData.testCategoryLabels.find(l => l.test_category_id === tc.id && l.language_id === 1);
    return { id: tc.id, name: label?.name || `Test Cat ${tc.id}`, category_id: tc.category_id, parent_id: tc.parent_id, level_id: tc.level_id, status: tc.status, sort_order: tc.sort_order };
  });
  res.json(adminList(data, req));
});
router.get('/admin/test-categories/:id', (req, res) => {
  const tc = mockData.testCategories.find(t => t.id === parseInt(req.params.id));
  if (!tc) return res.json({});
  const label = mockData.testCategoryLabels.find(l => l.test_category_id === tc.id && l.language_id === 1);
  res.json({ id: tc.id, name: label?.name || '', category_id: tc.category_id, parent_id: tc.parent_id, level_id: tc.level_id, status: tc.status, sort_order: tc.sort_order });
});
router.post('/admin/test-categories', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/test-categories/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/test-categories/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for tests
router.get('/admin/tests', (req, res) => {
  const data = mockData.tests.map(t => ({ id: t.id, question: t.question, parent_id: t.parent_id, question_type: t.question_type, status: t.status }));
  res.json(adminList(data, req));
});
router.get('/admin/tests/:id', (req, res) => {
  const t = mockData.tests.find(t => t.id === parseInt(req.params.id));
  res.json(t || {});
});
router.post('/admin/tests', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/tests/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/tests/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for test-levels
router.get('/admin/test-levels', (req, res) => {
  const data = mockData.testLevels.map(l => {
    const label = mockData.testLevelLabels.find(ll => ll.test_level_id === l.id && ll.language_id === 1);
    return { id: l.id, name: label?.name || `Level ${l.id}`, status: l.status, sort_order: l.sort_order };
  });
  res.json(adminList(data, req));
});
router.get('/admin/test-levels/:id', (req, res) => {
  const l = mockData.testLevels.find(l => l.id === parseInt(req.params.id));
  if (!l) return res.json({});
  const label = mockData.testLevelLabels.find(ll => ll.test_level_id === l.id && ll.language_id === 1);
  res.json({ id: l.id, name: label?.name || '', status: l.status, sort_order: l.sort_order });
});
router.post('/admin/test-levels', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/test-levels/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/test-levels/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for languages
router.get('/admin/languages', (req, res) => {
  const data = mockData.languages.map(l => ({ id: l.id, name: l.name, iso: l.iso, status: l.status, sort_order: l.sort_order }));
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
  const data = mockData.users.map(u => ({ id: u.id, email: u.email, user_name: u.user_name, first_name: u.first_name, last_name: u.last_name, block: u.block }));
  res.json(adminList(data, req));
});
router.get('/admin/users/:id', (req, res) => {
  const u = mockData.users.find(u => u.id === parseInt(req.params.id));
  if (!u) return res.json({});
  res.json({ id: u.id, email: u.email, user_name: u.user_name, first_name: u.first_name, last_name: u.last_name, block: u.block });
});
router.post('/admin/users', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/users/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/users/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

// Admin CRUD for admins
router.get('/admin/admins', (req, res) => {
  const data = mockData.admins.map(a => {
    const group = mockData.adminsGroups.find(g => g.id === a.group_id);
    return { id: a.id, email: a.email, name: a.name, group_id: a.group_id, group_name: group?.title || '', status: a.status };
  });
  res.json(adminList(data, req));
});
router.get('/admin/admins/:id', (req, res) => {
  const a = mockData.admins.find(a => a.id === parseInt(req.params.id));
  if (!a) return res.json({});
  const group = mockData.adminsGroups.find(g => g.id === a.group_id);
  res.json({ id: a.id, email: a.email, name: a.name, group_id: a.group_id, group_name: group?.title || '', status: a.status });
});
router.post('/admin/admins', (req, res) => res.json({ id: Date.now(), ...req.body }));
router.put('/admin/admins/:id', (req, res) => res.json({ id: parseInt(req.params.id), ...req.body }));
router.delete('/admin/admins/:id', (req, res) => res.json({ id: parseInt(req.params.id) }));

module.exports = router;
