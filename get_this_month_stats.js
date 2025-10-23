#!/usr/bin/env node

/**
 * Get THIS MONTH domain stats using the exact API from Page1_API_Data.md
 * API: /apis/domain_stats_api/v2/getLatestDomainStats?domain=example.com
 * Returns: 1 row with current month data
 */

const https = require('https');
const fs = require('fs');

const API_KEY = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';

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

function makeApiCall(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.spyfu.com',
      path: url,
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
            resolve({ success: true, data: JSON.parse(data) });
          } catch (e) {
            resolve({ success: false, error: 'Parse error: ' + e.message });
          }
        } else {
          resolve({ success: false, status: res.statusCode, error: data });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

async function getThisMonthStats() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FETCHING THIS MONTH DATA - getLatestDomainStats (no params)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = [];

  for (const domain of domains) {
    console.log(`Domain: ${domain}`);

    try {
      // Use EXACT API from Page1_API_Data.md documentation
      const url = `/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domain}`;
      const result = await makeApiCall(url);

      if (result.success && result.data && result.data.results && Array.isArray(result.data.results) && result.data.results.length > 0) {
        const thisMonth = result.data.results[0];
        
        results.push({
          domain,
          thisMonth
        });
        
        console.log(`  ✅ ${thisMonth.searchYear}-${String(thisMonth.searchMonth).padStart(2, '0')}: ${thisMonth.totalOrganicResults} KWs | $${Math.round(thisMonth.monthlyOrganicValue)} | ${thisMonth.monthlyOrganicClicks} Clicks | ${thisMonth.averageOrganicRank.toFixed(1)} Av Rank | ${thisMonth.strength} Authority`);
      } else {
        results.push({
          domain,
          thisMonth: null
        });
        console.log(`  ❌ No data`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      results.push({
        domain,
        thisMonth: null
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('API COST CALCULATION');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Cost per domain: $0.0005 (1 row × $0.50 / 1000)');
  console.log(`Total domains: ${domains.length}`);
  console.log(`Total cost: $${(domains.length * 0.0005).toFixed(4)}`);

  fs.writeFileSync('this_month_stats.json', JSON.stringify(results, null, 2));
  console.log('\n✅ Saved: this_month_stats.json');

  return results;
}

getThisMonthStats()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
