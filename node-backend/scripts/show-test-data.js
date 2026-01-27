const sequelize = require('../config/database');

async function showTestData() {
  try {
    console.log('=== TEST DATA SUMMARY ===\n');

    // Users
    const [users] = await sequelize.query(`
      SELECT id, user_name, email, first_name, last_name, block 
      FROM users 
      ORDER BY id DESC 
      LIMIT 10
    `);
    console.log(`📊 USERS (Total: ${users.length} shown)`);
    users.forEach(u => {
      console.log(`  ID: ${u.id} | Username: ${u.user_name} | Email: ${u.email} | Name: ${u.first_name || ''} ${u.last_name || ''} | Blocked: ${u.block}`);
    });
    console.log('');

    // Categories
    const [categories] = await sequelize.query(`
      SELECT c.id, c.parent_id, c.status, cl.value as name 
      FROM category c 
      LEFT JOIN category_label cl ON c.id = cl.category_id AND cl.language_id = 1
      WHERE c.status = 1 
      ORDER BY c.id 
      LIMIT 10
    `);
    console.log(`📁 CATEGORIES (Total: ${categories.length} shown)`);
    categories.forEach(c => {
      console.log(`  ID: ${c.id} | Parent: ${c.parent_id} | Name: ${c.name || 'No label'} | Status: ${c.status}`);
    });
    console.log('');

    // Test Categories
    const [testCategories] = await sequelize.query(`
      SELECT tc.id, tc.category_id, tc.parent_id, tc.status, tcl.name 
      FROM test_category tc 
      LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = 1
      WHERE tc.status = 1 
      ORDER BY tc.id 
      LIMIT 10
    `);
    console.log(`📝 TEST CATEGORIES (Total: ${testCategories.length} shown)`);
    testCategories.forEach(tc => {
      console.log(`  ID: ${tc.id} | Category: ${tc.category_id} | Parent: ${tc.parent_id} | Name: ${tc.name || 'No label'} | Status: ${tc.status}`);
    });
    console.log('');

    // Tests
    const [tests] = await sequelize.query(`
      SELECT id, parent_id, status, question_type, answer_type, view_count 
      FROM test 
      WHERE status = 1 
      ORDER BY id DESC 
      LIMIT 10
    `);
    console.log(`✅ TESTS (Total: ${tests.length} shown)`);
    tests.forEach(t => {
      console.log(`  ID: ${t.id} | Parent: ${t.parent_id} | QType: ${t.question_type} | AType: ${t.answer_type} | Views: ${t.view_count}`);
    });
    console.log('');

    // News
    const [news] = await sequelize.query(`
      SELECT n.id, n.status, nl.title 
      FROM news n 
      LEFT JOIN news_label nl ON n.id = nl.news_id AND nl.language_id = 1
      WHERE n.status = 1 
      ORDER BY n.id DESC 
      LIMIT 5
    `);
    console.log(`📰 NEWS (Total: ${news.length} shown)`);
    news.forEach(n => {
      console.log(`  ID: ${n.id} | Title: ${n.title || 'No title'} | Status: ${n.status}`);
    });
    console.log('');

    // Reviews/Testimonials
    const [reviews] = await sequelize.query(`
      SELECT r.id, r.status, r.profession, u.first_name, u.last_name 
      FROM review r 
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.status = 1 
      ORDER BY r.id DESC 
      LIMIT 5
    `);
    console.log(`⭐ REVIEWS/TESTIMONIALS (Total: ${reviews.length} shown)`);
    reviews.forEach(r => {
      console.log(`  ID: ${r.id} | User: ${r.first_name || ''} ${r.last_name || ''} | Profession: ${r.profession || 'N/A'} | Status: ${r.status}`);
    });
    console.log('');

    console.log('=== TEST ACCOUNT CREDENTIALS ===');
    console.log('Username: testuser');
    console.log('Email: test@example.com');
    console.log('Password: test123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Error fetching test data:', error.message);
    process.exit(1);
  }
}

showTestData();

