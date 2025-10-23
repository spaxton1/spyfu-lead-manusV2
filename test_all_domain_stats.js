const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const domain = "salemplasticsurgery.com";

function makeApiCall(endpoint, params) {
  return new Promise((resolve, reject) => {
    const queryString = new URLSearchParams(params).toString();
    const path = `/apis/domain_stats_api/v2/${endpoint}?${queryString}`;
    
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
          const rows = jsonData.results ? jsonData.results.length : (Array.isArray(jsonData) ? jsonData.length : 1);
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
  console.log('TESTING ALL DOMAIN STATS API ENDPOINTS');
  console.log('═════════════════════════════════════════════════\n');

  // Test 3: Get Domain Stats For Exact Date
  console.log('📋 TEST 3: getDomainStatsForExactDate');
  const test3 = await makeApiCall('getDomainStatsForExactDate', { 
    domain, 
    searchMonth: 9, 
    searchYear: 2025 
  });
  console.log('   Status:', test3.status);
  console.log('   Rows:', test3.rows);
  console.log('   Cost: $' + test3.cost.toFixed(4));
  if (test3.success && test3.data.results) {
    const d = test3.data.results[0];
    console.log('   Data:', d.totalOrganicResults, 'KWs,', '$' + d.monthlyOrganicValue, 'value,', d.monthlyOrganicClicks, 'clicks');
  }

  // Test 4: Get Active Dates For Domain
  console.log('\n📋 TEST 4: getActiveDatesForDomain');
  const test4 = await makeApiCall('getActiveDatesForDomain', { domain });
  console.log('   Status:', test4.status);
  console.log('   Rows:', test4.rows);
  console.log('   Cost: $' + test4.cost.toFixed(4));
  if (test4.success && test4.data.results) {
    console.log('   First date:', test4.data.results[0].searchYear + '-' + test4.data.results[0].searchMonth);
    console.log('   Last date:', test4.data.results[test4.data.results.length-1].searchYear + '-' + test4.data.results[test4.data.results.length-1].searchMonth);
  }

  console.log('\n═════════════════════════════════════════════════');
  console.log('DOMAIN STATS API - COMPLETE');
  console.log('═════════════════════════════════════════════════');
}

testAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
