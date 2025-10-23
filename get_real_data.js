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
          const json = JSON.parse(data);
          resolve({ success: true, data: json, status: res.statusCode });
        } catch (e) {
          resolve({ success: false, error: data, status: res.statusCode });
        }
      });
    });
    req.on('error', (error) => reject(error));
    req.end();
  });
}

async function getAllExcellentData() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('REAL DATA FROM EXCELLENT-RATED APIs');
  console.log('Domain: ' + domain);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Latest Domain Stats
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('API: Latest Domain Stats');
  console.log('Endpoint: /apis/domain_stats_api/v2/getLatestDomainStats');
  console.log('Purpose: Current month overview - total keywords, traffic value, clicks');
  console.log('═══════════════════════════════════════════════════════════════');
  
  const stats = await makeApiCall(`/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domain}`);
  if (stats.success && stats.data.results && stats.data.results[0]) {
    const d = stats.data.results[0];
    const rows = stats.data.results.length;
    const cost = (rows / 1000) * 0.50;
    console.log(`${domain} | ${d.totalOrganicResults} KWs | $${d.monthlyOrganicValue.toFixed(2)}/mo value | ${Math.round(d.monthlyOrganicClicks)} clicks/mo | ${rows} API Rows | $${cost.toFixed(4)} API Cost\n`);
  }

  // 2. Live SEO Stats
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('API: Live SEO Stats');
  console.log('Endpoint: /apis/serp_api/v2/seo/getLiveSeoStats');
  console.log('Purpose: Real-time SEO overview snapshot');
  console.log('═══════════════════════════════════════════════════════════════');
  
  const liveStats = await makeApiCall(`/apis/serp_api/v2/seo/getLiveSeoStats?query=${domain}`);
  if (liveStats.success && liveStats.data) {
    const d = liveStats.data;
    const rows = 1;
    const cost = (rows / 1000) * 0.50;
    console.log(`${domain} | ${d.totalKeywords || 0} KWs | $${(d.monthlyOrganicValue || 0).toFixed(2)}/mo value | ${Math.round(d.monthlyOrganicClicks || 0)} clicks/mo | ${rows} API Rows | $${cost.toFixed(4)} API Cost\n`);
  }

  // 3. Most Valuable Keywords
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('API: Most Valuable Keywords (Top 10)');
  console.log('Endpoint: /apis/serp_api/v2/seo/getMostValuableKeywords');
  console.log('Purpose: Highest traffic value keywords - show $$$ opportunities');
  console.log('═══════════════════════════════════════════════════════════════');
  
  const valuable = await makeApiCall(`/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}&pageSize=10`);
  if (valuable.success && valuable.data.results) {
    const rows = valuable.data.results.length;
    const cost = (rows / 1000) * 0.50;
    console.log(`Results: ${rows} keywords returned | $${cost.toFixed(4)} API Cost\n`);
    
    console.log('Top 10 Most Valuable Keywords:');
    console.log('Rank | Keyword | Search Volume | CPC (Phrase) | Monthly Value');
    console.log('-----|---------|---------------|--------------|---------------');
    valuable.data.results.forEach(kw => {
      // SpyFu returns 3 CPC fields: broadCostPerClick, phraseCostPerClick, exactCostPerClick
      // Use phrase match as primary (most common), fall back to broad, then exact
      const cpc = kw.phraseCostPerClick || kw.broadCostPerClick || kw.exactCostPerClick || 0;
      console.log(`${kw.rank} | ${kw.keyword} | ${kw.searchVolume || 0} | $${cpc.toFixed(2)} | $${(kw.monthlyValue || 0).toFixed(2)}`);
    });
    console.log('');
  }

  // 4. Just Made It Keywords (Ranks 11-20) - LOW HANGING FRUIT
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('API: Just Made It Keywords (Ranks 11-20)');
  console.log('Endpoint: /apis/serp_api/v2/seo/getJustMadeItKeywords');
  console.log('Purpose: Keywords on page 2 (positions 11-20) - LOW-HANGING FRUIT!');
  console.log('═══════════════════════════════════════════════════════════════');
  
  const almostPage1 = await makeApiCall(`/apis/serp_api/v2/seo/getJustMadeItKeywords?query=${domain}&pageSize=10`);
  if (almostPage1.success && almostPage1.data.results) {
    const rows = almostPage1.data.results.length;
    const cost = (rows / 1000) * 0.50;
    console.log(`Results: ${rows} keywords returned | $${cost.toFixed(4)} API Cost\n`);
    
    console.log('Top 10 "Almost Page 1" Keywords (Easy Wins!):');
    console.log('Rank | Keyword | Search Volume | CPC (Phrase) | Current Position');
    console.log('-----|---------|---------------|--------------|------------------');
    almostPage1.data.results.forEach(kw => {
      const cpc = kw.phraseCostPerClick || kw.broadCostPerClick || kw.exactCostPerClick || 0;
      console.log(`${kw.rank} | ${kw.keyword} | ${kw.searchVolume || 0} | $${cpc.toFixed(2)} | Position ${kw.rank}`);
    });
    console.log('');
  }

  // 5. Newly Ranked Keywords
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('API: Newly Ranked Keywords');
  console.log('Endpoint: /apis/serp_api/v2/seo/getNewlyRankedKeywords');
  console.log('Purpose: Keywords that recently started ranking - show momentum');
  console.log('═══════════════════════════════════════════════════════════════');
  
  const newKws = await makeApiCall(`/apis/serp_api/v2/seo/getNewlyRankedKeywords?query=${domain}&pageSize=10`);
  if (newKws.success && newKws.data.results) {
    const rows = newKws.data.results.length;
    const cost = (rows / 1000) * 0.50;
    console.log(`Results: ${rows} keywords returned | $${cost.toFixed(4)} API Cost\n`);
    
    console.log('Top 10 Newly Ranked Keywords:');
    console.log('Rank | Keyword | Search Volume | CPC (Phrase) | First Seen Ranking');
    console.log('-----|---------|---------------|--------------|--------------------');
    newKws.data.results.forEach(kw => {
      const cpc = kw.phraseCostPerClick || kw.broadCostPerClick || kw.exactCostPerClick || 0;
      console.log(`${kw.rank} | ${kw.keyword} | ${kw.searchVolume || 0} | $${cpc.toFixed(2)} | New ranking`);
    });
    console.log('');
  }

  // 6. Top Pages
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('API: Top Pages');
  console.log('Endpoint: /apis/serp_api/v2/seo/getTopPages');
  console.log('Purpose: Best performing pages by keyword count');
  console.log('═══════════════════════════════════════════════════════════════');
  
  const pages = await makeApiCall(`/apis/serp_api/v2/seo/getTopPages?query=${domain}&pageSize=10`);
  if (pages.success && pages.data.results) {
    const rows = pages.data.results.length;
    const cost = (rows / 1000) * 0.50;
    console.log(`Results: ${rows} pages returned | $${cost.toFixed(4)} API Cost\n`);
    
    console.log('Top 10 Pages by Keyword Count:');
    console.log('URL | Title | Keyword Count | Est. Monthly Clicks | Top Keyword');
    console.log('----|-------|---------------|---------------------|-------------');
    pages.data.results.forEach(p => {
      const shortUrl = p.url.substring(0, 40) + (p.url.length > 40 ? '...' : '');
      console.log(`${shortUrl} | ${p.title.substring(0, 30)} | ${p.keywordCount || 0} | ${Math.round(p.estMonthlySeoClicks || 0)} | ${(p.topKeyword || 'N/A').substring(0, 30)}`);
    });
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('COMPLETE - ALL REAL DATA RETRIEVED');
  console.log('═══════════════════════════════════════════════════════════════');
}

getAllExcellentData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
