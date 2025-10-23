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
    console.log('   Path:', path);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('   Status:', res.statusCode);
        try {
          const jsonData = JSON.parse(data);
          const rows = jsonData.results ? jsonData.results.length : (Array.isArray(jsonData) ? jsonData.length : (jsonData.totalResults || 1));
          const cost = (rows / 1000) * 0.50;
          console.log('   Rows:', rows);
          console.log('   Cost: $' + cost.toFixed(4));
          
          // Show sample data
          if (jsonData.results && jsonData.results[0]) {
            const sample = jsonData.results[0];
            const keys = Object.keys(sample).slice(0, 5);
            console.log('   Sample keys:', keys.join(', '));
          }
          
          resolve({ success: true, status: res.statusCode, rows, cost, data: jsonData });
        } catch (e) {
          console.log('   Parse Error:', data.substring(0, 100));
          resolve({ success: false, status: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      console.log('   Request Error:', error.message);
      resolve({ success: false });
    });

    req.end();
  });
}

async function testAll() {
  const results = [];
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('TESTING MULTIPLE API CATEGORIES');
  console.log('═══════════════════════════════════════════════════════');

  // AD HISTORY API
  console.log('\n\n🔷 AD HISTORY API');
  results.push(await makeApiCall(
    `/apis/cloud_ad_history_api/v2/domain/getDomainAdHistory?domain=${domain}`,
    'Get Domain Ad History'
  ));

  // SEO RESEARCH API  
  console.log('\n\n🔷 SEO RESEARCH API');
  results.push(await makeApiCall(
    `/apis/serp_api/v2/seo/getTopRankedKeywords?query=${domain}&pageSize=10`,
    'Get Top Ranked Keywords'
  ));

  results.push(await makeApiCall(
    `/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}&pageSize=10`,
    'Get Most Valuable Keywords'
  ));

  results.push(await makeApiCall(
    `/apis/serp_api/v2/seo/getNewlyRankedKeywords?query=${domain}&pageSize=10`,
    'Get Newly Ranked Keywords'
  ));

  // PPC RESEARCH API
  console.log('\n\n🔷 PPC RESEARCH API');
  results.push(await makeApiCall(
    `/apis/serp_api/v2/seo/getPaidSerps?query=${domain}&pageSize=10`,
    'Get Paid SERPs (Ads for Domain)'
  ));

  // COMPETITORS API
  console.log('\n\n🔷 COMPETITORS API');
  results.push(await makeApiCall(
    `/apis/competitors_api/v2/getTopSeoCompetitors?domain=${domain}`,
    'Get Top SEO Competitors'
  ));

  results.push(await makeApiCall(
    `/apis/competitors_api/v2/getTopPpcCompetitors?domain=${domain}`,
    'Get Top PPC Competitors'
  ));

  // RANKING HISTORY API
  console.log('\n\n🔷 RANKING HISTORY API');
  results.push(await makeApiCall(
    `/apis/cloud_ranking_history_api/v2/getRankingHistory?domain=${domain}&keyword=plastic%20surgery`,
    'Get Ranking History (sample keyword)'
  ));

  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('BATCH TEST COMPLETE');
  console.log('═══════════════════════════════════════════════════════');
  
  const successful = results.filter(r => r.success && r.status === 200).length;
  const totalCost = results.filter(r => r.success).reduce((sum, r) => sum + (r.cost || 0), 0);
  
  console.log('\n✅ Successful:', successful, '/', results.length);
  console.log('💰 Total Cost: $' + totalCost.toFixed(4));
}

testAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
