// BDD-style Node.js test for US-1.2: User Login
const axios = require('axios').default;
const assert = require('assert');

const API_URL = 'http://localhost:5002/api/v1';
const TEST_USER = {
  name: 'Login Test User',
  email: `login${Date.now()}@example.com`,
  password: 'TestLogin123',
};

async function run() {
  console.log('\x1b[34m🧪 TESTING US-1.2: USER LOGIN\x1b[0m');
  console.log('====================================');

  // Register first
  const regRes = await axios.post(`${API_URL}/auth/register`, TEST_USER, { validateStatus: () => true });
  assert.strictEqual(regRes.status, 201, 'Registration should succeed');

  // 1. Login with correct credentials
  const loginRes = await axios.post(`${API_URL}/auth/login`, {
    email: TEST_USER.email,
    password: TEST_USER.password,
  }, { validateStatus: () => true });
  assert.strictEqual(loginRes.status, 200, 'Login should succeed');
  assert(loginRes.data.token, 'Should receive token');
  console.log('\x1b[32m✅ Login with correct credentials succeeded\x1b[0m');

  // 2. Login with wrong password
  const wrongPassRes = await axios.post(`${API_URL}/auth/login`, {
    email: TEST_USER.email,
    password: 'WrongPassword',
  }, { validateStatus: () => true });
  assert.strictEqual(wrongPassRes.status, 401, 'Should reject wrong password');
  console.log('\x1b[32m✅ Login with wrong password rejected\x1b[0m');

  // 3. Login with non-existent email
  const noUserRes = await axios.post(`${API_URL}/auth/login`, {
    email: 'nouser@example.com',
    password: 'Test1234',
  }, { validateStatus: () => true });
  assert.strictEqual(noUserRes.status, 401, 'Should reject non-existent user');
  console.log('\x1b[32m✅ Login with non-existent email rejected\x1b[0m');

  // 4. Login with missing password
  const missingPassRes = await axios.post(`${API_URL}/auth/login`, {
    email: TEST_USER.email,
  }, { validateStatus: () => true });
  assert.strictEqual(missingPassRes.status, 400, 'Should reject missing password');
  console.log('\x1b[32m✅ Login with missing password rejected\x1b[0m');

  // 5. Login with invalid email format
  const invalidEmailRes = await axios.post(`${API_URL}/auth/login`, {
    email: 'notanemail',
    password: 'TestLogin123',
  }, { validateStatus: () => true });
  assert.strictEqual(invalidEmailRes.status, 400, 'Should reject invalid email');
  console.log('\x1b[32m✅ Login with invalid email rejected\x1b[0m');

  console.log('====================================');
  console.log('\x1b[32m✅ ALL LOGIN TESTS PASSED\x1b[0m');
  console.log('====================================');
}

run().catch(err => {
  console.error('\x1b[31m❌ TEST FAILED\x1b[0m', err.message);
  process.exit(1);
});