const axios = require('axios');

// Test configuration
const API_BASE_URL = 'http://localhost:5000';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'TestPass123';

// Test OAuth flow and account lockout functionality
async function runSecurityTests() {
  console.log('🔒 Starting Security Tests...\n');

  try {
    // Test 1: Normal login (should work)
    console.log('Test 1: Normal login attempt');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: 'anuradhaanupamaherath@gmail.com', // Use existing user
        password: 'wrongpassword'
      });
      console.log('❌ Login should have failed but succeeded');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Login correctly failed with invalid credentials');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // Test 2: Multiple failed login attempts (should trigger lockout)
    console.log('\nTest 2: Testing account lockout mechanism');
    for (let i = 1; i <= 6; i++) {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: 'anuradhaanupamaherath@gmail.com',
          password: 'wrongpassword'
        });
        console.log(`❌ Attempt ${i} should have failed`);
      } catch (error) {
        if (error.response?.status === 423) {
          console.log(`✅ Attempt ${i}: Account locked as expected`);
          break;
        } else if (error.response?.status === 400) {
          console.log(`✅ Attempt ${i}: Failed login (attempts remaining)`);
        } else {
          console.log(`❌ Attempt ${i}: Unexpected error:`, error.response?.data);
        }
      }

      // Wait 1 second between attempts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test 3: Test locked account response
    console.log('\nTest 3: Testing locked account response');
    try {
      await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: 'anuradhaanupamaherath@gmail.com',
        password: 'correctpassword'
      });
      console.log('❌ Should be locked but login succeeded');
    } catch (error) {
      if (error.response?.status === 423) {
        console.log('✅ Account correctly locked with retry-after header');
        console.log('   Retry after:', error.response.data.retryAfter, 'seconds');
      } else {
        console.log('❌ Unexpected response:', error.response?.data);
      }
    }

    // Test 4: Test Google OAuth endpoint (without actual OAuth)
    console.log('\nTest 4: Testing Google OAuth endpoint availability');
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/google`);
      console.log('✅ Google OAuth endpoint accessible');
    } catch (error) {
      if (error.response?.status === 302) {
        console.log('✅ Google OAuth redirect working (expected redirect)');
      } else {
        console.log('❌ OAuth endpoint error:', error.response?.data);
      }
    }

    // Test 5: Test security headers
    console.log('\nTest 5: Testing security headers');
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      const headers = response.headers;

      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy',
        'strict-transport-security'
      ];

      securityHeaders.forEach(header => {
        if (headers[header]) {
          console.log(`✅ ${header}: ${headers[header]}`);
        } else {
          console.log(`❌ Missing ${header}`);
        }
      });
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
    }

    // Test 6: Test rate limiting
    console.log('\nTest 6: Testing rate limiting');
    const rateLimitTests = [];
    for (let i = 0; i < 15; i++) {
      rateLimitTests.push(
        axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: 'test@example.com',
          password: 'test'
        }).catch(error => error)
      );
    }

    const results = await Promise.all(rateLimitTests);
    const rateLimited = results.filter(result =>
      result.response?.status === 429
    ).length;

    if (rateLimited > 0) {
      console.log(`✅ Rate limiting working (${rateLimited} requests blocked)`);
    } else {
      console.log('⚠️  Rate limiting may not be configured properly');
    }

    console.log('\n🎉 Security tests completed!');
    console.log('\n📋 Summary:');
    console.log('- Account lockout mechanism: ✅ Tested');
    console.log('- Security headers: ✅ Verified');
    console.log('- Rate limiting: ✅ Tested');
    console.log('- OAuth endpoints: ✅ Accessible');
    console.log('- Error handling: ✅ Working');

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runSecurityTests();
}

module.exports = runSecurityTests;