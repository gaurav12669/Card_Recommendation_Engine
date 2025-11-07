/**
 * Simple API Test Script
 * Run with: node test-api.js
 */

const BASE_URL = 'http://localhost:8080';

async function testAPI() {
  console.log('🧪 Testing Card Genius API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await fetch(`${BASE_URL}/health`);
    const healthData = await health.json();
    console.log('✅ Health Check:', healthData);
    console.log('');

    // Test 2: Get Categories
    console.log('2️⃣ Testing GET /categories...');
    const categories = await fetch(`${BASE_URL}/categories`);
    const categoriesData = await categories.json();
    console.log('✅ Categories:', JSON.stringify(categoriesData, null, 2));
    console.log('');

    // Test 3: Calculate Savings
    console.log('3️⃣ Testing POST /calculate-list...');
    const calculate = await fetch(`${BASE_URL}/calculate-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        travel: 12000,
        shopping: 8000,
        fuel: 6000,
        food: 5000,
      }),
    });
    const calculateData = await calculate.json();
    console.log('✅ Recommendations:', JSON.stringify(calculateData, null, 2));
    console.log('');

    // Test 4: Get Card Details (if cards exist)
    if (calculateData.length > 0) {
      console.log(`4️⃣ Testing GET /cards/${calculateData[0].id}...`);
      const cardDetails = await fetch(`${BASE_URL}/cards/${calculateData[0].id}`);
      const cardData = await cardDetails.json();
      console.log('✅ Card Details:', JSON.stringify(cardData, null, 2));
      console.log('');
    }

    console.log('🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Make sure the backend server is running on', BASE_URL);
  }
}

testAPI();

