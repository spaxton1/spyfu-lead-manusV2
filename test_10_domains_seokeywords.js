const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";

// First 10 domains from the list
const domains = [
  'salemplasticsurgery.com',
  'aestheticinstitute.ie',
  'coppellwellness.com',
  'healthwestchiro.com',
  '100percentdoc.com',
  'axiominjury.com',
  'houstonbackandneck.com',
  'alignwc.com',
  'infinityspine.com',
  'painreliefkc.com'
];

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
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function testSeoKeywords() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('TOP 10 SEO KEYWORDS - 10 DOMAINS (NEW API ENDPOINT)');
  console.log('API: getSeoKeywords with rank.min=1&rank.max=10&pageSize=1000');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let totalCost = 0;

  for (const domain of domains) {
    try {
      const path = `/apis/serp_api/v2/seo/getSeoKeywords?query=${domain}&searchType=MostValuable&rank.min=1&rank.max=10&costPerClickOption=Exact&pageSize=1000&sortBy=Rank`;
      
      const result = await makeApiCall(path);

      if (result.success && result.status === 200) {
        const rows = result.data.results ? result.data.results.length : 0;
        const cost = (rows / 1000) * 0.50;
        totalCost += cost;

        // Header line
        console.log(`${domain} | ${rows} KWs | ${rows} API Rows | $${cost.toFixed(4)} API Cost`);

        if (rows > 0) {
          // Print each keyword
          result.data.results.forEach(kw => {
            const cpc = kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0;
            const searchVol = kw.searchVolume || 0;
            const rank = kw.rank || kw.ranking || 'N/A';
            console.log(`  ${kw.keyword} | Rank ${rank} | ${searchVol} traffic | $${cpc.toFixed(2)} CPC`);
          });
        } else {
          console.log('  (No keywords ranking in top 10)');
        }
        
        console.log(''); // Blank line between domains

      } else {
        console.log(`${domain} | ERROR | Status: ${result.status}`);
        console.log('');
      }

    } catch (error) {
      console.log(`${domain} | ERROR | ${error.message}`);
      console.log('');
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`TOTAL API COST: $${totalCost.toFixed(4)} for ${domains.length} domains`);
  console.log('═══════════════════════════════════════════════════════════════');
}

testSeoKeywords()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
