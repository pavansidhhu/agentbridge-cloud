const API_BASE = 'http://localhost:3000/api';
const ADMIN_SECRET = 'your_super_secret_admin_key_here';

async function runTests() {
  console.log('=== Starting API Endpoint Verification Tests ===\n');

  let passedTests = 0;
  let failedTests = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
      failedTests++;
    }
  };

  try {
    // ----------------------------------------------------
    // Test 1: GET /api/config (Auto-initialization)
    // ----------------------------------------------------
    console.log('--- Testing GET /api/config ---');
    const configRes = await fetch(`${API_BASE}/config`);
    assert(configRes.status === 200, 'GET /api/config returned status 200');
    const configData = await configRes.json();
    assert(configData.latestVersion === '1.0.1', `Config version is ${configData.latestVersion}`);
    assert(configData.forceUpdate === false, 'Config forceUpdate is false');
    // announcement field may be empty string
    assert('announcement' in configData, 'Config includes announcement field');
    console.log();

    // ----------------------------------------------------
    // Test 2: POST /api/register (Valid request)
    // ----------------------------------------------------
    console.log('--- Testing POST /api/register (Valid Case) ---');
    const regRes = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        email: 'test.user@gmail.com',
        version: '1.0.0',
        machineId: 'DESKTOP-TEST123'
      })
    });
    assert(regRes.status === 200, 'POST /api/register returned status 200');
    const regData = await regRes.json();
    assert(regData.success === true, 'Registration reports success: true');
    console.log();

    // ----------------------------------------------------
    // Test 3: POST /api/register (Invalid Input Cases)
    // ----------------------------------------------------
    console.log('--- Testing POST /api/register (Invalid Validation Cases) ---');
    
    // Case 3a: Bad email format
    const regBadEmail = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bad-email-format',
        version: '1.0.0',
        machineId: 'DESKTOP-TEST123'
      })
    });
    assert(regBadEmail.status === 400, 'Rejected invalid email format with 400');
    
    // Case 3b: Too long email (> 200 chars)
    const longEmail = 'a'.repeat(200) + '@test.com';
    const regLongEmail = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: longEmail,
        version: '1.0.0',
        machineId: 'DESKTOP-TEST123'
      })
    });
    assert(regLongEmail.status === 400, 'Rejected email exceeding length limit (> 200 chars) with 400');

    // Case 3c: Too long version (> 20 chars)
    const longVersion = '1.0.0-beta-release-build-long';
    const regLongVer = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.user@gmail.com',
        version: longVersion,
        machineId: 'DESKTOP-TEST123'
      })
    });
    assert(regLongVer.status === 400, 'Rejected version exceeding length limit (> 20 chars) with 400');
    console.log();

    // ----------------------------------------------------
    // Test 4: POST /api/heartbeat
    // ----------------------------------------------------
    console.log('--- Testing POST /api/heartbeat ---');
    const hbRes = await fetch(`${API_BASE}/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.user@gmail.com'
      })
    });
    assert(hbRes.status === 200, 'POST /api/heartbeat returned status 200');
    const hbData = await hbRes.json();
    assert(hbData.success === true, 'Heartbeat reports success: true');

    const hbBad = await fetch(`${API_BASE}/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'not-an-email'
      })
    });
    assert(hbBad.status === 400, 'Heartbeat rejected invalid email with 400');
    console.log();

    // ----------------------------------------------------
    // Test 5: GET /api/stats
    // ----------------------------------------------------
    console.log('--- Testing GET /api/stats (Authorization Security) ---');
    
    // Case 5a: Missing key
    const statsNoKey = await fetch(`${API_BASE}/stats`);
    assert(statsNoKey.status === 401, 'GET /api/stats rejected missing key with 401');

    // Case 5b: Wrong key
    const statsWrongKey = await fetch(`${API_BASE}/stats`, {
      headers: { 'x-admin-key': 'incorrect_key' }
    });
    assert(statsWrongKey.status === 401, 'GET /api/stats rejected incorrect key with 401');

    // Case 5c: Correct key
    const statsRes = await fetch(`${API_BASE}/stats`, {
      headers: { 'x-admin-key': ADMIN_SECRET }
    });
    assert(statsRes.status === 200, 'GET /api/stats accepted correct key with 200');
    const statsData = await statsRes.json();
    assert(statsData.users === 1, `Stats total users count is 1 (matches registered user)`);
    assert(statsData.activeToday === 1, `Stats active today count is 1`);
    assert(statsData.latestVersion === '1.0.1', 'Stats returned correct latest version');
    console.log();

  } catch (error) {
    console.error('An error occurred during testing:', error);
    failedTests++;
  }

  console.log('=== Test Run Summary ===');
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('\nAll tests completed successfully!');
    process.exit(0);
  }
}

runTests();
