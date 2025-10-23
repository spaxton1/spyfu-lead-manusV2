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
          resolve({ success: true, data: json });
        } catch (e) {
          resolve({ success: false, error: data });
        }
      });
    });
    req.on('error', (error) => reject(error));
    req.end();
  });
}

async function calculateTrueValue() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('CALCULATING TRUE KEYWORD VALUE');
  console.log('Formula: CPC × SEO Clicks = Monthly Value Saved from Organic Rankings');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const result = await makeApiCall(`/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}&pageSize=50`);
  
  if (result.success && result.data.results) {
    // Calculate true value for each keyword
    const keywordsWithValue = result.data.results.map(kw => {
      const cpc = kw.phraseCostPerClick || kw.broadCostPerClick || kw.exactCostPerClick || 0;
      const seoClicks = kw.seoClicks || 0;
      const monthlyValue = cpc * seoClicks;
      
      return {
        keyword: kw.keyword,
        rank: kw.rank,
        searchVolume: kw.searchVolume,
        cpc: cpc,
        seoClicks: seoClicks,
        monthlyValue: monthlyValue,
        phraseMonthlyCost: kw.phraseMonthlyCost || 0
      };
    });
    
    // Sort by calculated monthly value (descending)
    keywordsWithValue.sort((a, b) => b.monthlyValue - a.monthlyValue);
    
    console.log('TOP 20 KEYWORDS BY TRUE MONTHLY VALUE:');
    console.log('(CPC × SEO Clicks = Value They Get FREE from Organic Ranking)\n');
    console.log('Keyword | Rank | Search Vol | CPC | SEO Clicks | Monthly Value | Phrase Cost');
    console.log('--------|------|------------|-----|------------|---------------|-------------');
    
    keywordsWithValue.slice(0, 20).forEach(kw => {
      console.log(`${kw.keyword.padEnd(35)} | ${String(kw.rank).padStart(4)} | ${String(kw.searchVolume).padStart(10)} | $${kw.cpc.toFixed(2).padStart(5)} | ${String(kw.seoClicks).padStart(10)} | $${kw.monthlyValue.toFixed(2).padStart(7)} | $${kw.phraseMonthlyCost.toFixed(2)}`);
    });
    
    // Calculate total value
    const totalValue = keywordsWithValue.reduce((sum, kw) => sum + kw.monthlyValue, 0);
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`TOTAL MONTHLY VALUE FROM ALL ${keywordsWithValue.length} KEYWORDS: $${totalValue.toFixed(2)}`);
    console.log('═══════════════════════════════════════════════════════════════');
    
    // Show high CPC keywords they're NOT ranking for (opportunity analysis)
    console.log('\n\n═══════════════════════════════════════════════════════════════');
    console.log('HIGH-VALUE KEYWORDS WITH LOW RANKINGS (OPPORTUNITY!):');
    console.log('(High CPC but poor ranking = Money left on table)');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    const opportunities = keywordsWithValue
      .filter(kw => kw.cpc >= 2.0 && kw.rank > 20)
      .sort((a, b) => b.cpc - a.cpc);
    
    console.log('Keyword | Current Rank | Search Vol | CPC | SEO Clicks | Potential Value (if rank #1)');
    console.log('--------|--------------|------------|-----|------------|------------------------------');
    
    opportunities.slice(0, 15).forEach(kw => {
      // If they ranked #1, they'd get ~40% of clicks
      const potentialClicks = Math.round(kw.searchVolume * 0.4);
      const potentialValue = kw.cpc * potentialClicks;
      console.log(`${kw.keyword.padEnd(35)} | ${String(kw.rank).padStart(12)} | ${String(kw.searchVolume).padStart(10)} | $${kw.cpc.toFixed(2).padStart(5)} | ${String(kw.seoClicks).padStart(10)} | $${potentialValue.toFixed(2)}`);
    });
  }
}

calculateTrueValue()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
