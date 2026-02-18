/**
 * API Test Suite for English.am Backend
 * Run with: node test-api.js
 */

const BASE_URL = 'http://localhost:3001/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results tracking
let passed = 0;
let failed = 0;
const results = [];

// Helper function to make HTTP requests
async function request(method, endpoint, body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, data: null, ok: false, error: error.message };
  }
}

// Test helper for expected errors (e.g., 401, 400)
async function testExpectedError(name, endpoint, method, body, expectedStatus) {
  process.stdout.write(`  Testing: ${name}... `);
  
  const startTime = Date.now();
  const result = await request(method, endpoint, body);
  const duration = Date.now() - startTime;
  
  const success = result.status === expectedStatus;
  
  if (success) {
    passed++;
    console.log(`${colors.green}✓ PASS${colors.reset} (${duration}ms)`);
  } else {
    failed++;
    console.log(`${colors.red}✗ FAIL${colors.reset} - Expected ${expectedStatus}, got ${result.status}`);
  }
  
  results.push({ name, endpoint, method, success, duration, status: result.status });
  return result;
}

// Test helper
async function test(name, endpoint, method = 'GET', body = null, validator = null) {
  process.stdout.write(`  Testing: ${name}... `);
  
  const startTime = Date.now();
  const result = await request(method, endpoint, body);
  const duration = Date.now() - startTime;
  
  let success = result.ok;
  let message = '';
  
  if (validator && result.ok) {
    try {
      const validationResult = validator(result.data);
      if (validationResult !== true) {
        success = false;
        message = validationResult || 'Validation failed';
      }
    } catch (e) {
      success = false;
      message = e.message;
    }
  }
  
  if (success) {
    passed++;
    console.log(`${colors.green}✓ PASS${colors.reset} (${duration}ms)`);
  } else {
    failed++;
    const errorMsg = message || result.error || `Status: ${result.status}`;
    console.log(`${colors.red}✗ FAIL${colors.reset} - ${errorMsg}`);
  }
  
  results.push({ name, endpoint, method, success, duration, status: result.status });
  return result;
}

// ==================== TEST SUITES ====================

async function testHealthCheck() {
  console.log(`\n${colors.cyan}=== Health Check ===${colors.reset}`);
  await test('Health endpoint', '/health', 'GET', null, 
    (data) => data.status === 'ok' || 'Expected status: ok');
}

async function testHomeRoutes() {
  console.log(`\n${colors.cyan}=== Home Routes ===${colors.reset}`);
  
  await test('Get slideshow', '/home/slideshow', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get about section', '/home/about', 'GET', null,
    (data) => data !== undefined || 'Expected data');
  
  await test('Get why choose section', '/home/why-choose', 'GET', null,
    (data) => data !== undefined || 'Expected data');
  
  await test('Get memberships', '/home/memberships', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get testimonials', '/home/testimonials', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get latest news', '/home/news', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get gallery', '/home/gallery', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get page images', '/home/page-images', 'GET', null,
    (data) => typeof data === 'object' || 'Expected object');
}

async function testCategoryRoutes() {
  console.log(`\n${colors.cyan}=== Category Routes ===${colors.reset}`);
  
  const categoriesResult = await test('Get all categories', '/categories', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get test categories for menu', '/categories/menu/test-categories', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  // Test with specific category ID if categories exist
  if (categoriesResult.data && categoriesResult.data.length > 0) {
    const categoryId = categoriesResult.data[0].id;
    
    await test(`Get category by ID (${categoryId})`, `/categories/${categoryId}`, 'GET', null,
      (data) => data.id === categoryId || 'Expected matching ID');
    
    await test(`Get subcategories (${categoryId})`, `/categories/${categoryId}/subcategories`, 'GET', null,
      (data) => Array.isArray(data) || 'Expected array');
    
    await test(`Get test categories for category (${categoryId})`, `/categories/${categoryId}/test-categories`, 'GET', null,
      (data) => Array.isArray(data) || 'Expected array');
  }
}

async function testTestRoutes() {
  console.log(`\n${colors.cyan}=== Test Routes ===${colors.reset}`);
  
  await test('Get test levels', '/tests/levels', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get tests (no filter)', '/tests', 'GET', null,
    (data) => data.tests !== undefined && data.pagination !== undefined || 'Expected tests and pagination');
  
  await test('Get tests with categoryId', '/tests?categoryId=1', 'GET', null,
    (data) => data.tests !== undefined || 'Expected tests array');
  
  // Test categories by category ID
  await test('Get test categories for category 1', '/tests/categories/1', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get filters for category 1', '/tests/categories/1/filters', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
}

async function testContentRoutes() {
  console.log(`\n${colors.cyan}=== Content Routes ===${colors.reset}`);
  
  await test('Get about content', '/content/about', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get contact info', '/content/contact', 'GET', null,
    (data) => data !== undefined || 'Expected data');
}

async function testToeflRoutes() {
  console.log(`\n${colors.cyan}=== TOEFL Routes ===${colors.reset}`);
  
  await test('Get TOEFL reading tests', '/toefl/reading', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get TOEFL listening tests', '/toefl/listening', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get TOEFL speaking tests', '/toefl/speaking', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get TOEFL writing tests', '/toefl/writing', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get complete TOEFL test', '/toefl/complete', 'GET', null,
    (data) => typeof data === 'object' || 'Expected object');
}

async function testIeltsRoutes() {
  console.log(`\n${colors.cyan}=== IELTS Routes ===${colors.reset}`);
  
  await test('Get IELTS reading tests', '/ielts/reading', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get IELTS listening tests', '/ielts/listening', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get IELTS speaking tests', '/ielts/speaking', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get IELTS writing tests', '/ielts/writing', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Get complete IELTS test', '/ielts/complete', 'GET', null,
    (data) => typeof data === 'object' || 'Expected object');
}

async function testAuthRoutes() {
  console.log(`\n${colors.cyan}=== Auth Routes ===${colors.reset}`);
  
  // Test login with invalid credentials - expect 401
  await testExpectedError('Login with invalid credentials (expect 401)', '/auth/login', 'POST', 
    { email: 'invalid@test.com', password: 'wrongpassword' }, 401);
  
  // Test registration validation - expect 400
  await testExpectedError('Register with missing fields (expect 400)', '/auth/register', 'POST',
    { email: 'test@test.com' }, 400);
  
  // Test guest login - expect 401 if guest user doesn't exist
  await testExpectedError('Guest login (expect 401 - no guest user)', '/auth/guest', 'POST', null, 401);
  
  // Test get current user without auth - expect 401
  await testExpectedError('Get current user without auth (expect 401)', '/auth/me', 'GET', null, 401);
  
  // Full registration and login flow
  const testUser = {
    user_name: 'testuser_' + Date.now(),
    email: `test_${Date.now()}@test.com`,
    password: 'testpass123',
    confirm_password: 'testpass123',
    first_name: 'Test',
    last_name: 'User'
  };
  
  const registerResult = await test('Register new user', '/auth/register', 'POST', testUser,
    (data) => data.success === true || 'Expected success: true');
  
  if (registerResult.ok && registerResult.data?.token) {
    console.log(`  ${colors.yellow}(Created test user: ${testUser.user_name})${colors.reset}`);
    
    // Login with new user
    await test('Login with new user', '/auth/login', 'POST',
      { email: testUser.email, password: testUser.password },
      (data) => data.success === true && data.token !== undefined || 'Expected success with token');
  }
}

async function testAdsRoutes() {
  console.log(`\n${colors.cyan}=== Ads Routes ===${colors.reset}`);
  
  await test('Get ad for test', '/ads/test/1', 'GET', null,
    (data) => data === null || typeof data === 'object' || 'Expected null or object');
}

async function testLanguageParameter() {
  console.log(`\n${colors.cyan}=== Language Parameter Tests ===${colors.reset}`);
  
  await test('Categories with language=1 (English)', '/categories?languageId=1', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Categories with language=2 (Armenian)', '/categories?languageId=2', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
  
  await test('Home slideshow with language=1', '/home/slideshow?languageId=1', 'GET', null,
    (data) => Array.isArray(data) || 'Expected array');
}

async function testPagination() {
  console.log(`\n${colors.cyan}=== Pagination Tests ===${colors.reset}`);
  
  await test('Tests page 1, limit 5', '/tests?categoryId=1&page=1&limit=5', 'GET', null,
    (data) => data.pagination !== undefined || 'Expected pagination');
  
  await test('Tests page 2, limit 5', '/tests?categoryId=1&page=2&limit=5', 'GET', null,
    (data) => data.pagination && data.pagination.page === 2 || 'Expected page 2');
}

// ==================== MAIN ====================

async function runAllTests() {
  console.log(`${colors.blue}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║     English.am API Test Suite              ║${colors.reset}`);
  console.log(`${colors.blue}║     Testing: ${BASE_URL}        ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════╝${colors.reset}`);
  
  const startTime = Date.now();
  
  await testHealthCheck();
  await testHomeRoutes();
  await testCategoryRoutes();
  await testTestRoutes();
  await testContentRoutes();
  await testToeflRoutes();
  await testIeltsRoutes();
  await testAuthRoutes();
  await testAdsRoutes();
  await testLanguageParameter();
  await testPagination();
  
  const totalTime = Date.now() - startTime;
  const total = passed + failed;
  
  console.log(`\n${colors.blue}════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}                 TEST SUMMARY                ${colors.reset}`);
  console.log(`${colors.blue}════════════════════════════════════════════${colors.reset}`);
  console.log(`  Total:  ${total} tests`);
  console.log(`  ${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`  Time:   ${totalTime}ms`);
  console.log(`${colors.blue}════════════════════════════════════════════${colors.reset}`);
  
  if (failed > 0) {
    console.log(`\n${colors.yellow}Failed Tests:${colors.reset}`);
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name} (${r.method} ${r.endpoint}) - Status: ${r.status}`);
    });
  }
  
  console.log(`\n${failed === 0 ? colors.green + '✓ All tests passed!' : colors.red + '✗ Some tests failed'}${colors.reset}\n`);
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}Test suite failed:${colors.reset}`, error);
  process.exit(1);
});

