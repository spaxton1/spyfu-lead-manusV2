#!/usr/bin/env node

/**
 * Get Current Month Domain Stats (no pastNMonths parameter)
 * This returns the most recent month's data only
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

async function getCurrentMonthStats() {
  console.log('Fetching CURRENT MONTH stats for all domains...\n');

  const results = [];

  for (const domain of domains) {
    console.log(`Fetching: ${domain}`);

    try {
      // Call WITHOUT pastNMonths parameter to get only current month
      const url = `/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domain}`;
      const result = await makeApiCall(url);

      if (result.success && result.data && result.data.results && Array.isArray(result.data.results) && result.data.results.length > 0) {
        const currentMonth = result.data.results[0]; // First result is current month
        
        results.push({
          domain,
          currentMonth
        });
        
        console.log(`  ✅ ${currentMonth.searchYear}-${String(currentMonth.searchMonth).padStart(2, '0')}: ${currentMonth.totalOrganicResults} KWs, ${currentMonth.monthlyOrganicClicks} clicks`);
      } else {
        results.push({
          domain,
          currentMonth: null
        });
        console.log(`  ❌ No data`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      results.push({
        domain,
        currentMonth: null
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  fs.writeFileSync('current_month_stats.json', JSON.stringify(results, null, 2));
  console.log('\n✅ Saved: current_month_stats.json');

  return results;
}

getCurrentMonthStats()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
