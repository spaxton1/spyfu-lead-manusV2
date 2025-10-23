const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const domain = "salemplasticsurgery.com";

function makeApiCall(path, label) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.spyfu.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': API_KEY,
        'Accept': 'application/json'
      }
    };

    console.log('\n📋', label);
    console.log('   Path:', path.substring(0, 80) + (path.length > 80 ? '...' : ''));

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('   Status:', res.statusCode);
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            const rows = jsonData.results ? jsonData.results.length : (Array.isArray(jsonData) ? jsonData.length : (jsonData.totalResults || 1));
            const cost = (rows / 1000) * 0.50;
            console.log('   ✅ Rows:', rows, '| Cost: $' + cost.toFixed(4));
            
            // Show sample data structure
            if (jsonData.results && jsonData.results[0]) {
              const sample = jsonData.results[0];
              console.log('   📊 Sample:', JSON.stringify(sample).substring(0, 100) + '...');
            }
            resolve({ success: true, status: res.statusCode, rows, cost, path, label });
          } catch (e) {
            console.log('   ❌ Parse Error');
            resolve({ success: false, status: res.statusCode, path, label });
          }
        } else {
          console.log('   ❌ Error');
          resolve({ success: false, status: res.statusCode, path, label });
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Request Error:', error.message);
      resolve({ success: false, path, label });
    });

    req.end();
  });
}

async function testAll() {
  const results = [];
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('TESTING MORE SEO RESEARCH ENDPOINTS');
  console.log('═══════════════════════════════════════════════════════');

  // Test various SEO endpoints
  results.push(await makeApiCall(
    `/apis/serp_api/v2/seo/getRankedKeywords?query=${domain}&pageSize=200`,
    'Get All Ranked Keywords (200)'
  ));

  results.push(await makeApiCall(
    `/apis/serp_api/v2/seo/getRankedKeywords?query=${domain}&pageSize=50`,
    'Get All Ranked Keywords (50)'
  ));

  results.push(await makeApiCall(
    `/apis/serp_api/v2/seo/getKeywordRanksOverTime?query=${domain}&keyword=plastic%20surgery`,
    'Get Keyword Ranks Over Time'
  ));

  results.push(await makeApiCall(
    `/apis/serp_api/v2/seo/getLostKeywords?query=${domain}&pageSize=10`,
    'Get Lost Keywords'
  ));

  results.push(await makeApiCall(
    `/apis/serp_api/v2/seo/getTopPages?query=${domain}&pageSize=10`,
    'Get Top Pages'
  ));

  results.push(await makeApiCall(
    `/apis/serp_api/v2/seo/getKeywordGaps?query=${domain}&competitors=plasticsurgery.org&pageSize=10`,
    'Get Keyword Gaps'
  ));

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('BATCH RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  
  const successful = results.filter(r => r.success && r.status === 200);
  const totalCost = successful.reduce((sum, r) => sum + (r.cost || 0), 0);
  
  console.log('\n✅ Working APIs:', successful.length, '/', results.length);
  console.log('💰 Total Cost: $' + totalCost.toFixed(4));
  
  console.log('\n📊 Working Endpoints:');
  successful.forEach(r => {
    console.log(`   • ${r.label}: ${r.rows} rows, $${r.cost.toFixed(4)}`);
  });
}

testAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
