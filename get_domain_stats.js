const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";

// Same 10 domains as before
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
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function getDomainStats() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('DOMAIN STATS - 10 DOMAINS');
  console.log('API: getLatestDomainStats');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let totalCost = 0;

  for (const domain of domains) {
    try {
      const path = `/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domain}`;
      
      const result = await makeApiCall(path);

      if (result.success && result.status === 200) {
        const rows = result.data.results ? result.data.results.length : 0;
        const cost = (rows / 1000) * 0.50;
        totalCost += cost;

        if (rows > 0 && result.data.results[0]) {
          const stats = result.data.results[0];
          
          console.log(`${domain} | ${rows} API Rows | $${cost.toFixed(4)} API Cost`);
          console.log(`  Total Organic Keywords: ${stats.totalOrganicResults || 0}`);
          console.log(`  Monthly Organic Value: $${(stats.monthlyOrganicValue || 0).toFixed(2)}`);
          console.log(`  Monthly Organic Clicks: ${Math.round(stats.monthlyOrganicClicks || 0)}`);
          console.log(`  Total Paid Keywords: ${stats.totalAdwordsResults || 0}`);
          console.log(`  Monthly PPC Budget: $${(stats.monthlyAdwordsBudget || 0).toFixed(2)}`);
          console.log(`  Monthly PPC Clicks: ${Math.round(stats.monthlyAdwordsClicks || 0)}`);
          console.log(`  Organic Rank: ${stats.organicRank || 'N/A'}`);
          console.log(`  Paid Rank: ${stats.adwordsRank || 'N/A'}`);
          console.log(`  Organic Competitors: ${stats.organicCompetitorsCount || 0}`);
          console.log(`  Paid Competitors: ${stats.adwordsCompetitorsCount || 0}`);
        } else {
          console.log(`${domain} | ${rows} API Rows | $${cost.toFixed(4)} API Cost`);
          console.log('  (No data returned)');
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

getDomainStats()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
