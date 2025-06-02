/**
 * Test script for US-1.1: User Registration
 * 
 * This script tests the user registration functionality of the ReadSphere backend
 * using BDD-style testing with axios for HTTP requests.
 */

const axios = require('axios');
const assert = require('assert');

// Configuration
const API_URL = 'http://localhost:5002/api/v1';
const TEST_USER = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`, // Use timestamp to ensure unique email
  password: 'Test1234', // Meets password requirements (uppercase, number, 8+ chars)
};

// Test suite
console.log('🧪 TESTING US-1.1: USER REGISTRATION');
console.log('====================================');

// Helper function to run tests sequentially
async function runTests() {
  try {
    // Test 1: Register a new user
    console.log('\n📝 TEST 1: Register a new user with valid credentials');
    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, TEST_USER);
      
      // Assertions
      assert.strictEqual(registerResponse.status, 201, 'Should return 201 Created status');
      assert.strictEqual(registerResponse.data.success, true, 'Should return success: true');
      assert(registerResponse.data.token, 'Should return a JWT token');
      
      // Check if token is in cookies
      const cookies = registerResponse.headers['set-cookie'];
      assert(cookies && cookies.length > 0, 'Should set a cookie');
      assert(cookies[0].includes('token='), 'Cookie should contain token');
      
      console.log('✅ User registration successful');
      console.log(`   - Name: ${TEST_USER.name}`);
      console.log(`   - Email: ${TEST_USER.email}`);
      console.log(`   - Token received: ${registerResponse.data.token ? 'Yes' : 'No'}`);
    } catch (error) {
      console.error('❌ User registration failed:');
      if (error.response) {
        console.error(`   - Status: ${error.response.status}`);
        console.error(`   - Message: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error(error.message);
      }
      throw error;
    }

    // Test 2: Try to register with the same email (should fail)
    console.log('\n📝 TEST 2: Register with an existing email (should fail)');
    try {
      const duplicateResponse = await axios.post(`${API_URL}/auth/register`, TEST_USER);
      console.error('❌ Test failed: Should not allow duplicate registration');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Duplicate registration correctly rejected');
        console.log(`   - Status: ${error.response.status}`);
        console.log(`   - Message: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('❌ Unexpected error:');
        if (error.response) {
          console.error(`   - Status: ${error.response.status}`);
          console.error(`   - Message: ${JSON.stringify(error.response.data)}`);
        } else {
          console.error(error.message);
        }
        throw error;
      }
    }

    // Test 3: Try to register with invalid password (missing uppercase)
    console.log('\n📝 TEST 3: Register with invalid password (missing uppercase)');
    try {
      const invalidPasswordUser = {
        ...TEST_USER,
        email: `test${Date.now()}@example.com`, // New unique email
        password: 'test1234', // Missing uppercase letter
      };
      
      const invalidResponse = await axios.post(`${API_URL}/auth/register`, invalidPasswordUser);
      console.error('❌ Test failed: Should not allow password without uppercase letter');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Invalid password correctly rejected');
        console.log(`   - Status: ${error.response.status}`);
        console.log(`   - Message: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('❌ Unexpected error:');
        if (error.response) {
          console.error(`   - Status: ${error.response.status}`);
          console.error(`   - Message: ${JSON.stringify(error.response.data)}`);
        } else {
          console.error(error.message);
        }
        throw error;
      }
    }

    // Test 4: Try to register with invalid password (missing number)
    console.log('\n📝 TEST 4: Register with invalid password (missing number)');
    try {
      const invalidPasswordUser = {
        ...TEST_USER,
        email: `test${Date.now()}@example.com`, // New unique email
        password: 'TestPassword', // Missing number
      };
      
      const invalidResponse = await axios.post(`${API_URL}/auth/register`, invalidPasswordUser);
      console.error('❌ Test failed: Should not allow password without a number');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Invalid password correctly rejected');
        console.log(`   - Status: ${error.response.status}`);
        console.log(`   - Message: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('❌ Unexpected error:');
        if (error.response) {
          console.error(`   - Status: ${error.response.status}`);
          console.error(`   - Message: ${JSON.stringify(error.response.data)}`);
        } else {
          console.error(error.message);
        }
        throw error;
      }
    }

    // Test 5: Try to register with missing required fields
    console.log('\n📝 TEST 5: Register with missing required fields');
    try {
      const incompleteUser = {
        email: `test${Date.now()}@example.com`,
        // Missing name and password
      };
      
      const incompleteResponse = await axios.post(`${API_URL}/auth/register`, incompleteUser);
      console.error('❌ Test failed: Should not allow registration with missing fields');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Incomplete registration correctly rejected');
        console.log(`   - Status: ${error.response.status}`);
        console.log(`   - Message: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('❌ Unexpected error:');
        if (error.response) {
          console.error(`   - Status: ${error.response.status}`);
          console.error(`   - Message: ${JSON.stringify(error.response.data)}`);
        } else {
          console.error(error.message);
        }
        throw error;
      }
    }

    // Test 6: Test Google OAuth endpoint (mock test)
    console.log('\n📝 TEST 6: Test Google OAuth endpoint');
    try {
      const googleUser = {
        email: `google${Date.now()}@example.com`,
        idToken: 'mock-google-id-token',
        name: 'Google User',
        avatar: 'https://example.com/avatar.jpg'
      };
      
      const googleResponse = await axios.post(`${API_URL}/auth/google`, googleUser);
      
      // Assertions
      assert.strictEqual(googleResponse.status, 200, 'Should return 200 OK status');
      assert.strictEqual(googleResponse.data.success, true, 'Should return success: true');
      assert(googleResponse.data.token, 'Should return a JWT token');
      
      console.log('✅ Google OAuth registration successful');
      console.log(`   - Email: ${googleUser.email}`);
      console.log(`   - Token received: ${googleResponse.data.token ? 'Yes' : 'No'}`);
    } catch (error) {
      console.error('❌ Google OAuth registration failed:');
      if (error.response) {
        console.error(`   - Status: ${error.response.status}`);
        console.error(`   - Message: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error(error.message);
      }
      throw error;
    }

    console.log('\n====================================');
    console.log('✅ ALL TESTS PASSED SUCCESSFULLY');
    console.log('====================================');
  } catch (error) {
    console.log('\n====================================');
    console.log('❌ TESTS FAILED');
    console.log('====================================');
    process.exit(1);
  }
}

runTests();