#!/usr/bin/env node

/**
 * 4-Month Domain Trend Analysis
 * Gets the most recent month PLUS 3 months of history = 4 total months
 * Change: pastNMonths=3 → pastNMonths=4
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

async function analyzeTrends() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('4-MONTH DOMAIN TREND ANALYSIS (pastNMonths=4)');
  console.log('Get most recent month + 3 months history = 4 total months');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = [];

  for (const domain of domains) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`Domain: ${domain}`);
    console.log('─'.repeat(70));

    try {
      // CHANGED: pastNMonths=3 → pastNMonths=4
      const url = `/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domain}&pastNMonths=4`;
      const result = await makeApiCall(url);

      if (result.success && result.data && result.data.results && Array.isArray(result.data.results) && result.data.results.length > 0) {
        const stats = result.data.results;
        
        console.log(`\n📊 Monthly Stats (${stats.length} months):\n`);
        stats.forEach((month, idx) => {
          const monthName = `${month.searchYear}-${String(month.searchMonth).padStart(2, '0')}`;
          console.log(`Month ${idx + 1} (${monthName}):`);
          console.log(`  Ranking Keywords: ${month.totalOrganicResults || 0}`);
          console.log(`  Organic Traffic: ${month.monthlyOrganicClicks || 0}`);
          console.log(`  Organic Value: $${(month.monthlyOrganicValue || 0).toLocaleString()}`);
          console.log(`  Avg Rank: ${(month.averageOrganicRank || 0).toFixed(1)}`);
          console.log(`  Authority: ${month.strength || 0}`);
        });

        if (stats.length >= 2) {
          const oldest = stats[0];
          const newest = stats[stats.length - 1];
          
          const rankingChange = newest.totalOrganicResults - oldest.totalOrganicResults;
          const trafficChange = newest.monthlyOrganicClicks - oldest.monthlyOrganicClicks;
          const valueChange = newest.monthlyOrganicValue - oldest.monthlyOrganicValue;
          const rankChange = newest.averageOrganicRank - oldest.averageOrganicRank;

          console.log(`\n📈 ${stats.length}-Month Trend:`);
          console.log(`  Total Rankings: ${rankingChange >= 0 ? '+' : ''}${rankingChange}`);
          console.log(`  Organic Traffic: ${trafficChange >= 0 ? '+' : ''}${trafficChange}`);
          console.log(`  Organic Value: ${valueChange >= 0 ? '+' : ''}$${Math.abs(valueChange).toLocaleString()}`);
          console.log(`  Avg Rank: ${rankChange > 0 ? '+' : ''}${rankChange.toFixed(1)} (${rankChange < 0 ? '✅ IMPROVING' : '⚠️  DECLINING'})`);

          const isDeclining = trafficChange < 0 || valueChange < 0 || rankChange > 0;

          results.push({
            domain,
            monthlyStats: stats,
            oldest,
            newest,
            rankingChange,
            trafficChange,
            valueChange,
            rankChange,
            isGrowing: !isDeclining,
            isDeclining: isDeclining
          });
        }
      } else {
        console.log('❌ No data available');
        if (result.status) {
          console.log(`   Status: ${result.status}`);
        }
        if (result.error) {
          console.log(`   Error: ${result.error.substring(0, 100)}`);
        }
        
        // Still add to results with empty data
        results.push({
          domain,
          monthlyStats: [],
          oldest: null,
          newest: null,
          rankingChange: 0,
          trafficChange: 0,
          valueChange: 0,
          rankChange: 0,
          isGrowing: true,
          isDeclining: false
        });
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      results.push({
        domain,
        monthlyStats: [],
        oldest: null,
        newest: null,
        rankingChange: 0,
        trafficChange: 0,
        valueChange: 0,
        rankChange: 0,
        isGrowing: true,
        isDeclining: false
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save results
  fs.writeFileSync('domain_trends_4months.json', JSON.stringify(results, null, 2));
  console.log('\n\n✅ Full report saved: domain_trends_4months.json');

  // Calculate API cost
  const totalRows = results.reduce((sum, r) => sum + r.monthlyStats.length, 0);
  const totalCost = (totalRows / 1000) * 0.50;
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('API COST CALCULATION');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Total rows returned: ${totalRows}`);
  console.log(`Total cost: $${totalCost.toFixed(6)}`);
  console.log(`Average cost per domain: $${(totalCost / domains.length).toFixed(6)}`);
  console.log(`Cost per row: $0.0005`);

  console.log('\n' + '═'.repeat(70));
}

analyzeTrends()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
