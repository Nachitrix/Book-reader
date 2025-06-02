// BDD-style Node.js test for US-1.3: Get Current User (Profile)
const axios = require('axios').default;
const assert = require('assert');

const API_URL = 'http://localhost:5002/api/v1';
const TEST_USER = {
  name: 'Profile Test User',
  email: `profile${Date.now()}@example.com`,
  password: 'TestProfile123',
};

async function run() {
  console.log('\x1b[34m🧪 TESTING US-1.3: GET CURRENT USER (PROFILE)\x1b[0m');
  console.log('====================================');

  // Register and login
  const regRes = await axios.post(`${API_URL}/auth/register`, TEST_USER, { validateStatus: () => true });
  assert.strictEqual(regRes.status, 201, 'Registration should succeed');
  const cookie = regRes.headers['set-cookie'] && regRes.headers['set-cookie'][0];
  assert(cookie, 'Should receive cookie with token');

  // 1. Get profile with valid cookie
  const meRes = await axios.get(`${API_URL}/auth/me`, {
    headers: { Cookie: cookie },
    validateStatus: () => true,
  });
  assert.strictEqual(meRes.status, 200, 'Should succeed with valid token');
  assert(meRes.data.user.email === TEST_USER.email, 'Returned email should match');
  assert(!meRes.data.user.password, 'Password should not be returned');
  console.log('\x1b[32m✅ Get profile with valid token succeeded\x1b[0m');

  // 2. Get profile without cookie (unauthenticated)
  const noAuthRes = await axios.get(`${API_URL}/auth/me`, { validateStatus: () => true });
  assert.strictEqual(noAuthRes.status, 401, 'Should fail without token');
  console.log('\x1b[32m✅ Get profile without token rejected\x1b[0m');

  // 3. Get profile with invalid token
  const badAuthRes = await axios.get(`${API_URL}/auth/me`, {
    headers: { Cookie: 'token=invalidtoken' },
    validateStatus: () => true,
  });
  assert.strictEqual(badAuthRes.status, 401, 'Should fail with invalid token');
  console.log('\x1b[32m✅ Get profile with invalid token rejected\x1b[0m');

  console.log('====================================');
  console.log('\x1b[32m✅ ALL PROFILE TESTS PASSED\x1b[0m');
  console.log('====================================');
}

run().catch(err => {
  console.error('\x1b[31m❌ TEST FAILED\x1b[0m', err.message);
  process.exit(1);
});