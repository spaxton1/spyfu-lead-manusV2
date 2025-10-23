const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const domain = "salemplasticsurgery.com";

function makeApiCall(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.spyfu.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': API_KEY,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          const rows = jsonData.results ? jsonData.results.length : (Array.isArray(jsonData) ? jsonData.length : (jsonData.totalResults || 1));
          const cost = (rows / 1000) * 0.50;
          resolve({ success: true, status: res.statusCode, data: jsonData, rows, cost });
        } catch (e) {
          resolve({ success: false, status: res.statusCode, error: data.substring(0, 300) });
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
}

async function testAll() {
  console.log('═════════════════════════════════════════════════');
  console.log('TESTING AD HISTORY API');
  console.log('═════════════════════════════════════════════════\n');

  // Test 1: Get Domain Ad History
  console.log('📋 TEST 1: getDomainAdHistory');
  const test1 = await makeApiCall(`/apis/ad_history_api/v2/getDomainAdHistory?domain=${domain}`);
  console.log('   Status:', test1.status);
  console.log('   Rows:', test1.rows);
  console.log('   Cost: $' + test1.cost.toFixed(4));
  if (test1.success && test1.data.results && test1.data.results.length > 0) {
    console.log('   Sample Ad:', test1.data.results[0].adCopy ? test1.data.results[0].adCopy.substring(0, 50) + '...' : 'N/A');
  }
  console.log('   Response keys:', test1.success ? Object.keys(test1.data).join(', ') : 'Error');

  console.log('\n═════════════════════════════════════════════════');
  console.log('AD HISTORY API - COMPLETE');
  console.log('═════════════════════════════════════════════════');
}

testAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
