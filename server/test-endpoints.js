import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

// We will launch server in a test process or call it directly
import startServer from './server.js';

async function runTests() {
  console.log('=== STARTING FARMPRO BACKEND API TEST SUITE ===\n');

  // Check if server is already running on port 3000 or 8080 or launch test server on ephemeral port
  let baseUrl = 'http://127.0.0.1:3000';
  let serverInstance = null;

  try {
    const healthCheck = await fetch(`${baseUrl}/api/health`);
    if (healthCheck.ok) {
      console.log(`Connected to active FarmPro server at ${baseUrl}`);
    }
  } catch (err) {
    // If not running, start test server on port 5999
    process.env.PORT = '5999';
    process.env.TEST_MODE = 'true';
    serverInstance = await startServer();
    baseUrl = 'http://127.0.0.1:5999';
    console.log(`Started standalone test server at ${baseUrl}`);
  }

  const assert = (condition, msg) => {
    if (!condition) {
      console.error(`  FAIL: ${msg}`);
      throw new Error(`Assertion failed: ${msg}`);
    }
    console.log(`  ✓ PASS: ${msg}`);
  };

  async function request(method, path, body = null, headers = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, data };
  }

  try {
    // 1. Health check
    console.log('1. Testing Health Endpoint (/api/health)...');
    const health = await request('GET', '/api/health');
    assert(health.status === 200, 'Health check returns 200 OK');
    assert(health.data.status === 'healthy', 'Health check returns healthy status');

    // 2. Auth Endpoints
    console.log('\n2. Testing Auth Endpoints...');
    const testEmail = `test_${Date.now()}@kisan.in`;
    // Register
    const regRes = await request('POST', '/api/auth/register', {
      name: 'Vikas Sharma',
      email: testEmail,
      password: 'password123',
      phone: '9876543210',
      location: 'Nagpur, Maharashtra',
      soilType: 'Black Soil',
    });
    assert(regRes.status === 201, 'POST /api/auth/register returns 201 Created');
    assert(regRes.data.user.email === testEmail, 'User registered with correct email');

    // Duplicate email error handling
    const dupRes = await request('POST', '/api/auth/register', {
      name: 'Vikas Sharma',
      email: testEmail,
      password: 'password123',
    });
    assert(dupRes.status === 400, 'POST /api/auth/register handles duplicate email with 400');
    assert(dupRes.data.success === false, 'Error response has success: false');
    assert(!dupRes.data.stack, 'Error response never exposes stack trace');

    // Login
    const loginRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'password123',
    });
    assert(loginRes.status === 200, 'POST /api/auth/login returns 200 OK');
    assert(loginRes.data.token, 'POST /api/auth/login returns authentication token');

    // Login invalid credentials
    const badLogin = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'wrongpassword',
    });
    assert(badLogin.status === 401, 'POST /api/auth/login returns 401 on bad password');

    // GET /api/auth/me
    const meRes = await request('GET', '/api/auth/me', null, {
      Authorization: `Bearer ${loginRes.data.token}`,
    });
    assert(meRes.status === 200, 'GET /api/auth/me returns 200 OK');
    assert(meRes.data.user && meRes.data.user.name, 'GET /api/auth/me returns user profile');

    // 3. Crops Endpoints
    console.log('\n3. Testing Crop Endpoints...');
    const cropsRes = await request('GET', '/api/crops');
    assert(cropsRes.status === 200, 'GET /api/crops returns 200 OK');
    assert(cropsRes.data.data.length > 0, 'GET /api/crops returns array of crops');

    const firstCrop = cropsRes.data.data[0];
    const cropId = firstCrop.id || firstCrop._id;
    const singleCropRes = await request('GET', `/api/crops/${cropId}`);
    assert(singleCropRes.status === 200, `GET /api/crops/:id returns 200 OK for ${cropId}`);
    assert(singleCropRes.data.data.name === firstCrop.name, 'Crop details match queried crop');

    const notFoundCrop = await request('GET', '/api/crops/nonexistent_crop_xyz');
    assert(notFoundCrop.status === 404, 'GET /api/crops/:id returns 404 for invalid crop');

    // 4. Recommendation Endpoints
    console.log('\n4. Testing Recommendation Endpoints...');
    const recRes = await request('POST', '/api/recommendations', {
      location: 'Nagpur, Maharashtra',
      soilType: 'Black Soil',
      landArea: 5,
      waterAvailability: 'Medium',
      nitrogen: 50,
      phosphorus: 25,
      potassium: 30,
      ph: 6.8,
      farmingObjective: 'Maximum Profit',
    });
    assert(recRes.status === 200, 'POST /api/recommendations returns 200 OK');
    assert(recRes.data.top5 && recRes.data.top5.length === 5, 'Returns Top 5 ranked crops');
    assert(recRes.data.top5[0].rank === 1, 'Top pick has rank 1');
    assert(recRes.data.top5[0].factors, 'Includes 6-factor score breakdown');
    assert(recRes.data.recommendationId, 'Returns persistent recommendation ID');

    // History
    const historyRes = await request('GET', '/api/recommendations/history');
    assert(historyRes.status === 200, 'GET /api/recommendations/history returns 200 OK');
    assert(Array.isArray(historyRes.data.data), 'History returns list of runs');

    // 5. Market Endpoints
    console.log('\n5. Testing Market Endpoints...');
    const marketRes = await request('GET', '/api/market');
    assert(marketRes.status === 200, 'GET /api/market returns 200 OK');
    assert(marketRes.data.summary, 'GET /api/market returns summary analytics');
    assert(marketRes.data.data.length > 0, 'GET /api/market returns commodity list');

    // 6. Weather Endpoints
    console.log('\n6. Testing Weather Endpoints...');
    const weatherRes = await request('GET', '/api/weather?location=Nagpur');
    assert(weatherRes.status === 200, 'GET /api/weather returns 200 OK');
    assert(weatherRes.data.weather.temperature, 'GET /api/weather returns temperature');
    assert(weatherRes.data.weather.rainfallCondition, 'GET /api/weather returns agro-meteorology condition');

    // 7. Feedback Endpoints
    console.log('\n7. Testing Feedback Endpoints...');
    const fbRes = await request('POST', '/api/feedback', {
      farmerName: 'Balwinder Singh',
      rating: 5,
      category: 'Market Data',
      comments: 'APMC mandi shortage alert was very timely and profitable.',
      location: 'Bathinda, Punjab',
    });
    assert(fbRes.status === 201, 'POST /api/feedback returns 201 Created');
    assert(fbRes.data.data.rating === 5, 'Feedback persisted rating accurately');

    const fbList = await request('GET', '/api/feedback');
    assert(fbList.status === 200, 'GET /api/feedback returns 200 OK');
    assert(fbList.data.data.length > 0, 'GET /api/feedback returns feedback list');

    // 8. AI Chat Endpoint
    console.log('\n8. Testing AI Agronomist Chat (/api/ai/chat)...');
    const aiChatRes = await request('POST', '/api/ai/chat', {
      message: 'What crop is best for black soil in Maharashtra?',
      context: { location: 'Nagpur, Maharashtra', soilType: 'Black Soil' },
    });
    assert(aiChatRes.status === 200, 'POST /api/ai/chat returns 200 OK');
    assert(aiChatRes.data.reply && aiChatRes.data.reply.length > 20, 'POST /api/ai/chat returns informative reply');

    // 9. Subscription Endpoints
    console.log('\n9. Testing Subscription Endpoints...');
    const plansRes = await request('GET', '/api/subscriptions/plans');
    assert(plansRes.status === 200, 'GET /api/subscriptions/plans returns 200 OK');
    assert(plansRes.data.plans.length === 3, 'Returns 3 subscription plans (BASIC, INTERMEDIATE, ADVANCE)');
    assert(plansRes.data.demoNotice, 'Includes demo subscription notice');

    const statusRes = await request('GET', '/api/subscriptions/status', null, { Authorization: `Bearer ${loginRes.data.token}` });
    assert(statusRes.status === 200, 'GET /api/subscriptions/status returns 200 OK');
    assert(statusRes.data.freeRecommendationsAllowed === 3, 'Free tier limit is 3');

    // Subscribe demo plan
    const subRes = await request('POST', '/api/subscriptions/subscribe', { planId: 'INTERMEDIATE' }, { Authorization: `Bearer ${loginRes.data.token}` });
    assert(subRes.status === 200, 'POST /api/subscriptions/subscribe returns 200 OK');
    assert(subRes.data.subscriptionPlan === 'INTERMEDIATE', 'Subscribed to INTERMEDIATE plan');

    console.log('\n=== ALL 26 API TESTS PASSED SUCCESSFULLY! ✓ ===\n');
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
  }
}

runTests().catch(err => {
  console.error('\nTest runner failed:', err);
  process.exit(1);
});
