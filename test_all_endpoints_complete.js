const https = require('https');
const fs = require('fs');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const domain = "salemplasticsurgery.com";

const results = [];
let testCount = 0;

function test(path, label, category) {
  return new Promise((resolve) => {
    testCount++;
    const options = {
      hostname: 'api.spyfu.com',
      path: path,
      method: 'GET',
      headers: { 'Authorization': API_KEY, 'Accept': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            const rows = json.results ? json.results.length : (Array.isArray(json) ? json.length : (json.totalResults || 1));
            const cost = (rows / 1000) * 0.50;
            console.log(`✅ ${testCount}. ${label} | ${rows} rows | $${cost.toFixed(4)}`);
            results.push({ success: true, category, label, path, rows, cost, status: res.statusCode });
          } catch (e) {
            console.log(`❌ ${testCount}. ${label} | Parse Error`);
            results.push({ success: false, category, label, path, status: res.statusCode });
          }
        } else {
          console.log(`❌ ${testCount}. ${label} | HTTP ${res.statusCode}`);
          results.push({ success: false, category, label, path, status: res.statusCode });
        }
        resolve();
      });
    });
    req.on('error', () => {
      console.log(`❌ ${testCount}. ${label} | Network Error`);
      results.push({ success: false, category, label, path });
      resolve();
    });
    req.end();
  });
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('COMPLETE SPYFU API TEST - ALL ENDPOINTS');
  console.log('Domain: ' + domain);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // DOMAIN STATS API
  console.log('\n🔷 1. DOMAIN STATS API');
  await test(`/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domain}`, 'Latest Domain Stats', 'Domain Stats');
  await test(`/apis/domain_stats_api/v2/getAllDomainStats?domain=${domain}`, 'All Domain Stats', 'Domain Stats');
  
  // SEO RESEARCH API (Organic SERP)
  console.log('\n🔷 2. SEO RESEARCH API');
  await test(`/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}&pageSize=10`, 'Most Valuable Keywords', 'SEO Research');
  await test(`/apis/serp_api/v2/seo/getNewlyRankedKeywords?query=${domain}&pageSize=10`, 'Newly Ranked Keywords', 'SEO Research');
  await test(`/apis/serp_api/v2/seo/getLiveSeoStats?query=${domain}`, 'Live SEO Stats', 'SEO Research');
  await test(`/apis/serp_api/v2/seo/getSeoKeywords?query=${domain}&pageSize=10`, 'SEO Keywords', 'SEO Research');
  await test(`/apis/serp_api/v2/seo/getJustMadeItKeywords?query=${domain}&pageSize=10`, 'Just Made It Keywords (Ranks 11-20)', 'SEO Research');
  await test(`/apis/serp_api/v2/seo/getJustFellOffKeywords?query=${domain}&pageSize=10`, 'Just Fell Off Keywords', 'SEO Research');
  await test(`/apis/serp_api/v2/seo/getGainedRanksKeywords?query=${domain}&pageSize=10`, 'Gained Ranks Keywords', 'SEO Research');
  await test(`/apis/serp_api/v2/seo/getLostRanksKeywords?query=${domain}&pageSize=10`, 'Lost Ranks Keywords', 'SEO Research');
  
  // TOP PAGES API
  console.log('\n🔷 3. TOP PAGES API');
  await test(`/apis/serp_api/v2/seo/getTopPages?query=${domain}&pageSize=10`, 'Top Pages', 'Top Pages');
  await test(`/apis/serp_api/v2/seo/getMostTrafficTopPages?query=${domain}&pageSize=10`, 'Most Traffic Pages', 'Top Pages');
  await test(`/apis/serp_api/v2/seo/getNewTopPages?query=${domain}&pageSize=10`, 'New Top Pages', 'Top Pages');
  
  // PPC RESEARCH API
  console.log('\n🔷 4. PPC RESEARCH API');
  await test(`/apis/serp_api/v2/ppc/getPaidSerps?query=${domain}&pageSize=10`, 'Paid SERPs (Ads)', 'PPC Research');
  await test(`/apis/serp_api/v2/ppc/getMostSuccessful?query=${domain}&pageSize=10`, 'Most Successful PPC', 'PPC Research');
  await test(`/apis/serp_api/v2/ppc/getNewKeywords?query=${domain}&pageSize=10`, 'New PPC Keywords', 'PPC Research');
  
  // COMPETITORS API
  console.log('\n🔷 5. COMPETITORS API');
  await test(`/apis/competitors_api/v2/seo/getTopSeoCompetitors?query=${domain}&pageSize=10`, 'Top SEO Competitors', 'Competitors');
  await test(`/apis/competitors_api/v2/ppc/getTopPpcCompetitors?query=${domain}&pageSize=10`, 'Top PPC Competitors', 'Competitors');
  await test(`/apis/competitors_api/v2/getCombinedTopCompetitors?query=${domain}&pageSize=10`, 'Combined Competitors', 'Competitors');
  
  // KOMBAT API (Skip per instructions, but test 1 for completeness)
  console.log('\n🔷 6. KOMBAT API (Testing 1 endpoint only)');
  await test(`/apis/keyword_api/v2/kombat/getCompetingSeoKeywords?query=${domain}&competitor=plasticsurgery.org&pageSize=10`, 'Competing SEO Keywords', 'Kombat');
  
  // RELATED KEYWORDS API (Skip per instructions, but test key ones)
  console.log('\n🔷 7. RELATED KEYWORDS API (Testing key endpoints only)');
  await test(`/apis/keyword_research_api/v2/getRelatedKeywords?keyword=plastic%20surgery&pageSize=10`, 'Related Keywords', 'Related Keywords');
  await test(`/apis/keyword_research_api/v2/getQuestionKeywords?keyword=plastic%20surgery&pageSize=10`, 'Question Keywords', 'Related Keywords');
  
  // RANKING HISTORY API
  console.log('\n🔷 8. RANKING HISTORY API');
  await test(`/apis/cloud_ranking_history_api/v2/domain/getHistoricRankingsForDomain?domain=${domain}&keyword=plastic%20surgery`, 'Historic Rankings', 'Ranking History');
  
  // AD HISTORY API
  console.log('\n🔷 9. AD HISTORY API');
  await test(`/apis/cloud_ad_history_api/v2/domain/getDomainAdHistory?domain=${domain}&pageSize=10`, 'Domain Ad History', 'Ad History');

  // SUMMARY
  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('FINAL RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const working = results.filter(r => r.success && r.status === 200);
  const totalCost = working.reduce((sum, r) => sum + (r.cost || 0), 0);
  
  console.log(`✅ Working: ${working.length} / ${results.length}`);
  console.log(`💰 Total Cost for all tests: $${totalCost.toFixed(4)}\n`);
  
  // Group by category
  const cats = {};
  working.forEach(r => {
    if (!cats[r.category]) cats[r.category] = [];
    cats[r.category].push(r);
  });
  
  console.log('📊 WORKING ENDPOINTS BY CATEGORY:\n');
  Object.keys(cats).sort().forEach(cat => {
    const catCost = cats[cat].reduce((sum, r) => sum + r.cost, 0);
    console.log(`   ${cat} (${cats[cat].length} endpoints, $${catCost.toFixed(4)} total):`);
    cats[cat].forEach(r => {
      console.log(`   • ${r.label}: ${r.rows} rows, $${r.cost.toFixed(4)}`);
    });
    console.log('');
  });

  // Save detailed results
  fs.writeFileSync('final_comprehensive_results.json', JSON.stringify({
    testDomain: domain,
    testDate: new Date().toISOString(),
    totalEndpointsTested: results.length,
    totalWorking: working.length,
    totalCostAllTests: totalCost,
    workingEndpoints: working,
    failedEndpoints: results.filter(r => !r.success || r.status !== 200)
  }, null, 2));
  
  console.log('💾 Detailed results saved to: final_comprehensive_results.json\n');
}

runAllTests()
  .then(() => process.exit(0))
  .catch(err => { console.error('ERROR:', err); process.exit(1); });
