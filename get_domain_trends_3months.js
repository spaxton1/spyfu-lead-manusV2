#!/usr/bin/env node

/**
 * 3-Month Domain Trend Analysis
 * Identifies which domains are GROWING vs DECLINING
 * DECLINING domains are best candidates for "fell off Page 1" cold calling
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
  console.log('3-MONTH DOMAIN TREND ANALYSIS');
  console.log('Identify DECLINING domains = Best cold calling targets');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = [];

  for (const domain of domains) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`Domain: ${domain}`);
    console.log('─'.repeat(70));

    try {
      const url = `/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domain}&pastNMonths=3`;
      const result = await makeApiCall(url);

      if (result.success && result.data && result.data.results && Array.isArray(result.data.results) && result.data.results.length > 0) {
        const stats = result.data.results;
        
        console.log('\n📊 Monthly Stats:\n');
        stats.forEach((month, idx) => {
          const monthName = `${month.searchYear}-${String(month.searchMonth).padStart(2, '0')}`;
          console.log(`Month ${idx + 1} (${monthName}):`);
          console.log(`  Ranking Keywords: ${month.totalOrganicResults || 0}`);
          console.log(`  Organic Traffic: ${month.monthlyOrganicClicks || 0}`);
          console.log(`  Organic Value: $${(month.monthlyOrganicValue || 0).toLocaleString()}`);
          console.log(`  Avg Rank: ${(month.averageOrganicRank || 0).toFixed(1)}`);
        });

        if (stats.length >= 2) {
          const oldest = stats[0];
          const newest = stats[stats.length - 1];
          
          const rankingChange = newest.totalOrganicResults - oldest.totalOrganicResults;
          const trafficChange = newest.monthlyOrganicClicks - oldest.monthlyOrganicClicks;
          const valueChange = newest.monthlyOrganicValue - oldest.monthlyOrganicValue;
          const rankChange = newest.averageOrganicRank - oldest.averageOrganicRank;

          console.log('\n📈 3-Month Trend:');
          console.log(`  Total Rankings: ${rankingChange >= 0 ? '+' : ''}${rankingChange} (${rankingChange >= 0 ? '✅ GROWING' : '⚠️  DECLINING'})`);
          console.log(`  Organic Traffic: ${trafficChange >= 0 ? '+' : ''}${trafficChange} (${trafficChange >= 0 ? '✅ GROWING' : '⚠️  DECLINING'})`);
          console.log(`  Organic Value: ${valueChange >= 0 ? '+' : ''}$${Math.abs(valueChange).toLocaleString()} (${valueChange >= 0 ? '✅ GROWING' : '⚠️  DECLINING'})`);
          console.log(`  Avg Rank: ${rankChange > 0 ? '+' : ''}${rankChange.toFixed(1)} (${rankChange < 0 ? '✅ IMPROVING' : '⚠️  DECLINING'})`);

          const isDecining = trafficChange < 0 || valueChange < 0 || rankChange > 0;

          if (isDecining) {
            console.log('\n🎯 COLD CALLING CANDIDATE!');
            console.log(`   Lost ${Math.abs(trafficChange)} monthly clicks`);
            console.log(`   Lost $${Math.abs(valueChange).toLocaleString()} in traffic value`);
            console.log(`   Rankings got worse by ${rankChange.toFixed(1)} positions`);
          }

          results.push({
            domain,
            monthlyStats: stats,
            oldest,
            newest,
            rankingChange,
            trafficChange,
            valueChange,
            rankChange,
            isGrowing: !isDecining,
            isDeclining: isDecining
          });
        }
      } else {
        console.log('❌ No data available');
        console.log(`   Status: ${result.status || 'Unknown'}`);
        if (result.error) {
          console.log(`   Error: ${result.error.substring(0, 100)}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n\n' + '═'.repeat(70));
  console.log('SUMMARY - Cold Calling Target Analysis');
  console.log('═'.repeat(70));

  const declining = results.filter(r => r.isDeclining);
  const growing = results.filter(r => r.isGrowing);

  console.log(`\n🎯 DECLINING Domains (PRIORITY for cold calling): ${declining.length}`);
  if (declining.length > 0) {
    declining.forEach(r => {
      console.log(`\n  📉 ${r.domain}`);
      console.log(`     Total Keywords: ${r.rankingChange}`);
      console.log(`     Traffic Lost: ${Math.abs(r.trafficChange)}`);
      console.log(`     Value Lost: $${Math.abs(r.valueChange).toLocaleString()}`);
      console.log(`     Rank Decline: +${r.rankChange.toFixed(1)} (worse)`);
      console.log(`     💡 Opening: "You lost ${Math.abs(r.trafficChange)} clicks worth $${Math.abs(r.valueChange).toLocaleString()}}"`);
    });
  } else {
    console.log('  None found - All test domains are growing!');
  }

  console.log(`\n\n✅ GROWING Domains (Skip these for now): ${growing.length}`);
  if (growing.length > 0) {
    growing.forEach(r => {
      console.log(`  📈 ${r.domain} (+${r.rankingChange} keywords, +${r.trafficChange} traffic)`);
    });
  }

  console.log('\n\n💡 INSIGHTS:');
  console.log('─'.repeat(70));
  console.log('• DECLINING domains have real pain points = Easy cold calling');
  console.log('• GROWING domains are happy = Hard to sell SEO services');
  console.log('• Focus your "fell off Page 1" analysis on DECLINING domains');
  console.log('• Use Top 10 keyword losses as your main talking point');

  // Save results
  fs.writeFileSync('domain_trends_3months.json', JSON.stringify(results, null, 2));
  console.log('\n✅ Full report saved: domain_trends_3months.json');

  // Create CSV for easy analysis
  let csv = 'Domain,Oldest Month,Newest Month,Ranking Change,Traffic Change,Value Change,Rank Change,Status\n';
  results.forEach(r => {
    const oldMonth = `${r.oldest.searchYear}-${String(r.oldest.searchMonth).padStart(2, '0')}`;
    const newMonth = `${r.newest.searchYear}-${String(r.newest.searchMonth).padStart(2, '0')}`;
    csv += `${r.domain},${oldMonth},${newMonth},${r.rankingChange},${r.trafficChange},${r.valueChange.toFixed(2)},${r.rankChange.toFixed(1)},${r.isDeclining ? 'DECLINING' : 'GROWING'}\n`;
  });
  fs.writeFileSync('domain_trends_3months.csv', csv);
  console.log('✅ CSV report saved: domain_trends_3months.csv');

  console.log('\n' + '═'.repeat(70));
}

analyzeTrends()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
