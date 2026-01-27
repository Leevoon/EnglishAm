const sequelize = require('../config/database');
const http = require('http');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001/api';
const DEFAULT_LANGUAGE_ID = 1;

// Simple HTTP GET helper
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Invalid JSON: ${data.substring(0, 100)}`));
        }
      });
    }).on('error', reject);
  });
}

async function verifyDataAccess() {
  console.log('=== VERIFYING DATA ACCESSIBILITY ===\n');

  try {
    // 1. Verify Categories
    console.log('1. VERIFYING CATEGORIES');
    const [dbCategories] = await sequelize.query(`
      SELECT COUNT(*) as total FROM category WHERE status = 1
    `);
    const dbCategoryCount = dbCategories[0].total;
    console.log(`   Database: ${dbCategoryCount} categories`);

    try {
      const apiCategories = await httpGet(`${API_BASE_URL}/categories?languageId=${DEFAULT_LANGUAGE_ID}`);
      
      // Count all categories including nested
      function countCategories(cats) {
        let count = 0;
        cats.forEach(cat => {
          count++;
          if (cat.children && cat.children.length > 0) {
            count += countCategories(cat.children);
          }
        });
        return count;
      }
      
      const apiCategoryCount = countCategories(apiCategories);
      console.log(`   API: ${apiCategoryCount} categories`);
      
      if (dbCategoryCount === apiCategoryCount) {
        console.log('   ✓ Categories match!\n');
      } else {
        console.log(`   ✗ Mismatch: Database has ${dbCategoryCount}, API returns ${apiCategoryCount}\n`);
      }
    } catch (error) {
      console.log(`   ✗ API Error: ${error.message}\n`);
    }

    // 2. Verify Test Categories
    console.log('2. VERIFYING TEST CATEGORIES');
    const [dbTestCategories] = await sequelize.query(`
      SELECT COUNT(*) as total FROM test_category WHERE status = 1 AND parent_id = 0
    `);
    const dbTestCategoryCount = dbTestCategories[0].total;
    console.log(`   Database: ${dbTestCategoryCount} top-level test categories`);

    try {
      const apiTestCategories = await httpGet(`${API_BASE_URL}/categories/menu/test-categories?languageId=${DEFAULT_LANGUAGE_ID}`);
      const apiTestCategoryCount = apiTestCategories.length;
      console.log(`   API: ${apiTestCategoryCount} test categories`);
      
      if (dbTestCategoryCount === apiTestCategoryCount) {
        console.log('   ✓ Test categories match!\n');
      } else {
        console.log(`   ✗ Mismatch: Database has ${dbTestCategoryCount}, API returns ${apiTestCategoryCount}\n`);
      }
    } catch (error) {
      console.log(`   ✗ API Error: ${error.message}\n`);
    }

    // 3. Verify Tests
    console.log('3. VERIFYING TESTS');
    const [dbTests] = await sequelize.query(`
      SELECT COUNT(*) as total FROM test WHERE status = 1
    `);
    const dbTestCount = dbTests[0].total;
    console.log(`   Database: ${dbTestCount} tests`);

    // Test fetching tests for a specific category
    const [testCategorySample] = await sequelize.query(`
      SELECT id, category_id FROM test_category WHERE status = 1 AND parent_id = 0 LIMIT 1
    `);
    
    if (testCategorySample.length > 0) {
      const sampleTestCategoryId = testCategorySample[0].id;
      const sampleCategoryId = testCategorySample[0].category_id;
      
      try {
        const apiResponse = await httpGet(`${API_BASE_URL}/tests?categoryId=${sampleCategoryId}&limit=10`);
        const apiTests = apiResponse.tests || apiResponse;
        const apiTestCount = Array.isArray(apiTests) ? apiTests.length : 0;
        console.log(`   API: Sample query returned ${apiTestCount} tests`);
        
        // Get actual count for this category
        const [categoryTests] = await sequelize.query(`
          SELECT COUNT(*) as total FROM test_category 
          WHERE status = 1 AND category_id = ${sampleCategoryId} AND parent_id != 0
        `);
        console.log(`   Database: ${categoryTests[0].total} tests for category ${sampleCategoryId}`);
        console.log('   ✓ Test endpoint accessible\n');
      } catch (error) {
        console.log(`   ✗ API Error: ${error.message}\n`);
      }
    }

    // 4. Verify Category Labels
    console.log('4. VERIFYING CATEGORY LABELS');
    const [categoriesWithoutLabels] = await sequelize.query(`
      SELECT c.id FROM category c
      LEFT JOIN category_label cl ON c.id = cl.category_id AND cl.language_id = ${DEFAULT_LANGUAGE_ID}
      WHERE c.status = 1 AND cl.id IS NULL
    `);
    if (categoriesWithoutLabels.length === 0) {
      console.log('   ✓ All categories have labels\n');
    } else {
      console.log(`   ✗ ${categoriesWithoutLabels.length} categories missing labels: ${categoriesWithoutLabels.map(c => c.id).join(', ')}\n`);
    }

    // 5. Verify Test Category Labels
    console.log('5. VERIFYING TEST CATEGORY LABELS');
    const [testCategoriesWithoutLabels] = await sequelize.query(`
      SELECT tc.id FROM test_category tc
      LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = ${DEFAULT_LANGUAGE_ID}
      WHERE tc.status = 1 AND tc.parent_id = 0 AND tcl.id IS NULL
    `);
    if (testCategoriesWithoutLabels.length === 0) {
      console.log('   ✓ All test categories have labels\n');
    } else {
      console.log(`   ✗ ${testCategoriesWithoutLabels.length} test categories missing labels: ${testCategoriesWithoutLabels.map(tc => tc.id).join(', ')}\n`);
    }

    // 6. Verify Relationships
    console.log('6. VERIFYING RELATIONSHIPS');
    
    // Category -> Test Category
    const [orphanedTestCategories] = await sequelize.query(`
      SELECT tc.id FROM test_category tc
      LEFT JOIN category c ON tc.category_id = c.id
      WHERE tc.status = 1 AND c.id IS NULL
    `);
    if (orphanedTestCategories.length === 0) {
      console.log('   ✓ All test categories have valid parent categories\n');
    } else {
      console.log(`   ✗ ${orphanedTestCategories.length} orphaned test categories\n`);
    }

    // Test Category -> Tests
    const [testCategoriesWithTests] = await sequelize.query(`
      SELECT tc.id, COUNT(t.id) as test_count
      FROM test_category tc
      LEFT JOIN test t ON t.parent_id = tc.id AND t.status = 1
      WHERE tc.status = 1 AND tc.parent_id = 0
      GROUP BY tc.id
      HAVING test_count = 0
      LIMIT 5
    `);
    if (testCategoriesWithTests.length === 0) {
      console.log('   ✓ All test categories have tests\n');
    } else {
      console.log(`   ⚠ ${testCategoriesWithTests.length} test categories have no tests (showing first 5)\n`);
    }

    // Tests -> Answers
    const [testsWithoutAnswers] = await sequelize.query(`
      SELECT t.id FROM test t
      LEFT JOIN test_answer ta ON t.id = ta.test_id
      WHERE t.status = 1 AND ta.id IS NULL
      LIMIT 5
    `);
    if (testsWithoutAnswers.length === 0) {
      console.log('   ✓ All tests have answers\n');
    } else {
      console.log(`   ⚠ ${testsWithoutAnswers.length} tests have no answers (showing first 5)\n`);
    }

    console.log('=== VERIFICATION COMPLETE ===');
    process.exit(0);
  } catch (error) {
    console.error('Verification error:', error);
    process.exit(1);
  }
}

verifyDataAccess();

