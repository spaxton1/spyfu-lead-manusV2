const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const domain = "salemplasticsurgery.com";

// Calculate date range (last 3 months)
const endDate = new Date();
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 3);

const formatDate = (date) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

function testDateParams(params) {
  return new Promise((resolve, reject) => {
    const queryString = new URLSearchParams(params).toString();
    const path = `/apis/domain_stats_api/v2/getAllDomainStats?${queryString}`;
    
    console.log('\n🔍 Testing with parameters:');
    console.log('   ', JSON.stringify(params, null, 2));
    console.log('   Full path:', path);
    
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
        console.log('\n📡 Status:', res.statusCode);
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ JSON parsed successfully');
          console.log('   Rows returned:', jsonData.results ? jsonData.results.length : 'N/A');
          if (jsonData.results && jsonData.results.length > 0) {
            console.log('   First record:', jsonData.results[0].searchYear + '-' + jsonData.results[0].searchMonth);
            console.log('   Last record:', jsonData.results[jsonData.results.length-1].searchYear + '-' + jsonData.results[jsonData.results.length-1].searchMonth);
          }
          if (jsonData.errors || jsonData.title) {
            console.log('⚠️ Error response:', JSON.stringify(jsonData, null, 2));
          }
          resolve(jsonData);
        } catch (e) {
          console.log('❌ Parse error');
          console.log('Raw (first 300 chars):', data.substring(0, 300));
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.end();
  });
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('Testing date range parameters for last 3 months');
  console.log('═══════════════════════════════════════════════════════');
  
  // Test 1: startDate/endDate (YYYY-MM-DD format)
  console.log('\n\n📋 TEST 1: Using startDate/endDate');
  await testDateParams({
    domain: domain,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  }).catch(() => {});
  
  // Test 2: startMonth/startYear, endMonth/endYear
  console.log('\n\n📋 TEST 2: Using startMonth/startYear, endMonth/endYear');
  await testDateParams({
    domain: domain,
    startMonth: startDate.getMonth() + 1,
    startYear: startDate.getFullYear(),
    endMonth: endDate.getMonth() + 1,
    endYear: endDate.getFullYear()
  }).catch(() => {});
  
  // Test 3: limit parameter
  console.log('\n\n📋 TEST 3: Using limit parameter');
  await testDateParams({
    domain: domain,
    limit: 3
  }).catch(() => {});
  
  // Test 4: maxResults parameter
  console.log('\n\n📋 TEST 4: Using maxResults parameter');
  await testDateParams({
    domain: domain,
    maxResults: 3
  }).catch(() => {});
  
  // Test 5: pageSize parameter
  console.log('\n\n📋 TEST 5: Using pageSize parameter');
  await testDateParams({
    domain: domain,
    pageSize: 3
  }).catch(() => {});
}

runTests()
  .then(() => {
    console.log('\n\n✅ All tests completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n\n❌ Tests failed:', err.message);
    process.exit(1);
  });
