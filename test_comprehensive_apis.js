const https = require('https');
const fs = require('fs');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const domain = "salemplasticsurgery.com";

function makeApiCall(path, label, category) {
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

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            const rows = jsonData.results ? jsonData.results.length : (Array.isArray(jsonData) ? jsonData.length : (jsonData.totalResults || 1));
            const cost = (rows / 1000) * 0.50;
            
            // Get sample data for value assessment
            let sampleData = '';
            if (jsonData.results && jsonData.results[0]) {
              const sample = jsonData.results[0];
              const keys = Object.keys(sample);
              sampleData = keys.slice(0, 5).join(', ');
            }
            
            console.log(`✅ ${label} | ${rows} rows | $${cost.toFixed(4)}`);
            resolve({ 
              success: true, 
              category, 
              label, 
              path, 
              status: res.statusCode, 
              rows, 
              cost,
              sampleFields: sampleData
            });
          } catch (e) {
            console.log(`❌ ${label} | Parse Error`);
            resolve({ success: false, category, label, path, status: res.statusCode });
          }
        } else {
          console.log(`❌ ${label} | HTTP ${res.statusCode}`);
          resolve({ success: false, category, label, path, status: res.statusCode });
        }
      });
    });

    req.on('error', () => {
      console.log(`❌ ${label} | Network Error`);
      resolve({ success: false, category, label, path });
    });

    req.end();
  });
}

async function testAll() {
  const results = [];
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('COMPREHENSIVE SPYFU API TEST FOR: ' + domain);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // DOMAIN STATS API (already tested)
  console.log('🔷 DOMAIN STATS API');
  results.push(await makeApiCall(`/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domain}`, 'Latest Domain Stats', 'Domain Stats'));

  // SEO RESEARCH API
  console.log('\n🔷 SEO RESEARCH API');
  results.push(await makeApiCall(`/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}&pageSize=10`, 'Most Valuable Keywords', 'SEO Research'));
  results.push(await makeApiCall(`/apis/serp_api/v2/seo/getNewlyRankedKeywords?query=${domain}&pageSize=10`, 'Newly Ranked Keywords', 'SEO Research'));
  results.push(await makeApiCall(`/apis/serp_api/v2/seo/getTopPages?query=${domain}&pageSize=10`, 'Top Pages', 'SEO Research'));
  results.push(await makeApiCall(`/apis/serp_api/v2/seo/getKeywordCompetitors?query=plastic%20surgery&pageSize=10`, 'Keyword Competitors', 'SEO Research'));
  results.push(await makeApiCall(`/apis/serp_api/v2/seo/getSerpAnalysisKeywords?keyword=plastic%20surgery%20salem&pageSize=10`, 'SERP Analysis', 'SEO Research'));

  // PPC RESEARCH API
  console.log('\n🔷 PPC RESEARCH API');
  results.push(await makeApiCall(`/apis/serp_api/v2/ppc/getMostSuccessfulKeywords?query=${domain}&pageSize=10`, 'Most Successful PPC Keywords', 'PPC Research'));
  results.push(await makeApiCall(`/apis/serp_api/v2/ppc/getNewKeywords?query=${domain}&pageSize=10`, 'New PPC Keywords', 'PPC Research'));
  
  // AD HISTORY API
  console.log('\n🔷 AD HISTORY API');
  results.push(await makeApiCall(`/apis/cloud_ad_history_api/v2/domain/getDomainAdHistory?domain=${domain}&pageSize=10`, 'Domain Ad History', 'Ad History'));
  results.push(await makeApiCall(`/apis/cloud_ad_history_api/v2/keyword/getTermAdHistory?keyword=plastic%20surgery&pageSize=10`, 'Keyword Ad History', 'Ad History'));

  // COMPETITORS API
  console.log('\n🔷 COMPETITORS API');
  results.push(await makeApiCall(`/apis/competitors_api/v2/seo/getTopSeoCompetitors?query=${domain}&pageSize=10`, 'Top SEO Competitors', 'Competitors'));
  results.push(await makeApiCall(`/apis/competitors_api/v2/ppc/getTopPpcCompetitors?query=${domain}&pageSize=10`, 'Top PPC Competitors', 'Competitors'));

  // RANKING HISTORY API
  console.log('\n🔷 RANKING HISTORY API');
  results.push(await makeApiCall(`/apis/cloud_ranking_history_api/v2/domain/getRankingHistory?domain=${domain}&keyword=plastic%20surgery`, 'Ranking History', 'Ranking History'));

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('TEST RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const working = results.filter(r => r.success && r.status === 200);
  const totalCost = working.reduce((sum, r) => sum + (r.cost || 0), 0);
  
  console.log(`✅ Working: ${working.length} / ${results.length}`);
  console.log(`💰 Total Cost: $${totalCost.toFixed(4)}\n`);
  
  // Group by category
  const categories = {};
  working.forEach(r => {
    if (!categories[r.category]) categories[r.category] = [];
    categories[r.category].push(r);
  });
  
  console.log('📊 WORKING ENDPOINTS BY CATEGORY:\n');
  Object.keys(categories).forEach(cat => {
    console.log(`   ${cat}:`);
    categories[cat].forEach(r => {
      console.log(`   • ${r.label}: ${r.rows} rows, $${r.cost.toFixed(4)}`);
    });
    console.log('');
  });

  // Save results to JSON
  fs.writeFileSync('comprehensive_api_results.json', JSON.stringify({
    testDomain: domain,
    testDate: new Date().toISOString(),
    totalWorking: working.length,
    totalTested: results.length,
    totalCost: totalCost,
    results: working
  }, null, 2));
  
  console.log('💾 Results saved to comprehensive_api_results.json');
}

testAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
