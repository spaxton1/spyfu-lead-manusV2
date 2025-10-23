#!/usr/bin/env node

/**
 * Generate Detailed Domain Report with API Costs
 * Shows 3-month trends + fell-off keywords for each domain
 */

const fs = require('fs');

// Load the 3-month trends data
const trendsData = JSON.parse(fs.readFileSync('domain_trends_3months.json', 'utf8'));

console.log('═══════════════════════════════════════════════════════════════');
console.log('DETAILED DOMAIN REPORT - 3 MONTH TRENDS');
console.log('Includes API costs and complete monthly breakdown');
console.log('═══════════════════════════════════════════════════════════════\n');

let totalApiCost = 0;

trendsData.forEach((domain, index) => {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`DOMAIN ${index + 1}: ${domain.domain}`);
  console.log('═'.repeat(70));

  // API Cost calculation (3 months of data = 1 API call with pastNMonths=3)
  const apiCost = 0.0005; // Rough estimate based on SpyFu pricing
  totalApiCost += apiCost;

  console.log(`\n💰 API Cost: $${apiCost.toFixed(4)}`);
  console.log(`📊 Status: ${domain.isDeclining ? '⚠️  DECLINING' : '✅ GROWING'}`);

  // Monthly breakdown
  if (domain.monthlyStats && domain.monthlyStats.length > 0) {
    console.log('\n📅 Monthly Breakdown:\n');
    
    domain.monthlyStats.forEach((month, idx) => {
      const monthDate = `${month.searchYear}-${String(month.searchMonth).padStart(2, '0')}`;
      console.log(`Month ${idx + 1} (${monthDate}):`);
      console.log(`  Total Ranking Keywords: ${month.totalOrganicResults || 0}`);
      console.log(`  Monthly Organic Clicks: ${month.monthlyOrganicClicks || 0}`);
      console.log(`  Monthly Organic Value: $${(month.monthlyOrganicValue || 0).toLocaleString()}`);
      console.log(`  Average Organic Rank: ${(month.averageOrganicRank || 0).toFixed(1)}`);
      console.log(`  Domain Strength: ${month.strength || 0}`);
      console.log('');
    });

    // 3-month change summary
    console.log('📈 3-Month Change (Oldest → Newest):');
    console.log('─'.repeat(70));
    
    const oldMonth = `${domain.oldest.searchYear}-${String(domain.oldest.searchMonth).padStart(2, '0')}`;
    const newMonth = `${domain.newest.searchYear}-${String(domain.newest.searchMonth).padStart(2, '0')}`;
    
    console.log(`Time Period: ${oldMonth} → ${newMonth}`);
    console.log('');
    
    console.log(`Total Rankings:`);
    console.log(`  ${domain.oldest.totalOrganicResults} → ${domain.newest.totalOrganicResults}`);
    console.log(`  Change: ${domain.rankingChange >= 0 ? '+' : ''}${domain.rankingChange} keywords`);
    console.log('');
    
    console.log(`Organic Traffic (Clicks/Month):`);
    console.log(`  ${domain.oldest.monthlyOrganicClicks} → ${domain.newest.monthlyOrganicClicks}`);
    console.log(`  Change: ${domain.trafficChange >= 0 ? '+' : ''}${domain.trafficChange} clicks`);
    console.log('');
    
    console.log(`Organic Value (Monthly):`);
    console.log(`  $${domain.oldest.monthlyOrganicValue.toLocaleString()} → $${domain.newest.monthlyOrganicValue.toLocaleString()}`);
    console.log(`  Change: ${domain.valueChange >= 0 ? '+' : ''}$${Math.abs(domain.valueChange).toLocaleString()}`);
    console.log('');
    
    console.log(`Average Rank Position:`);
    console.log(`  #${domain.oldest.averageOrganicRank.toFixed(1)} → #${domain.newest.averageOrganicRank.toFixed(1)}`);
    console.log(`  Change: ${domain.rankChange >= 0 ? '+' : ''}${domain.rankChange.toFixed(1)} (${domain.rankChange < 0 ? 'BETTER' : 'WORSE'})`);

    // Cold calling angle
    if (domain.isDeclining) {
      console.log('\n🎯 COLD CALLING ANGLE:');
      console.log('─'.repeat(70));
      console.log(`"Over the last 3 months, your website has:`);
      if (domain.trafficChange < 0) {
        console.log(`  • Lost ${Math.abs(domain.trafficChange)} monthly visitors`);
      }
      if (domain.valueChange < 0) {
        console.log(`  • Lost $${Math.abs(domain.valueChange).toLocaleString()} in monthly traffic value`);
      }
      if (domain.rankingChange < 0) {
        console.log(`  • Lost ${Math.abs(domain.rankingChange)} ranking keywords`);
      }
      if (domain.rankChange > 0) {
        console.log(`  • Average ranking dropped by ${domain.rankChange.toFixed(1)} positions`);
      }
      console.log(`"`);
    }

  } else {
    console.log('\n❌ No ranking data available for this domain');
  }
});

// Summary
console.log('\n\n' + '═'.repeat(70));
console.log('SUMMARY - API COSTS & RECOMMENDATIONS');
console.log('═'.repeat(70));

const declining = trendsData.filter(d => d.isDeclining);
const growing = trendsData.filter(d => !d.isDeclining);

console.log(`\n💰 Total API Cost: $${totalApiCost.toFixed(4)} for ${trendsData.length} domains`);
console.log(`   Average per domain: $${(totalApiCost / trendsData.length).toFixed(4)}`);

console.log(`\n📊 Status Breakdown:`);
console.log(`   ⚠️  DECLINING: ${declining.length} domains (PRIORITY for cold calling)`);
console.log(`   ✅ GROWING: ${growing.length} domains (Skip for now)`);

console.log(`\n🎯 Top 3 DECLINING Domains by Traffic Loss:`);
const topByTraffic = declining
  .filter(d => d.trafficChange < 0)
  .sort((a, b) => a.trafficChange - b.trafficChange)
  .slice(0, 3);

topByTraffic.forEach((d, idx) => {
  console.log(`   ${idx + 1}. ${d.domain}`);
  console.log(`      Lost ${Math.abs(d.trafficChange)} clicks/month ($${Math.abs(d.valueChange).toLocaleString()} value)`);
});

console.log(`\n🎯 Top 3 DECLINING Domains by Value Loss:`);
const topByValue = declining
  .filter(d => d.valueChange < 0)
  .sort((a, b) => a.valueChange - b.valueChange)
  .slice(0, 3);

topByValue.forEach((d, idx) => {
  console.log(`   ${idx + 1}. ${d.domain}`);
  console.log(`      Lost $${Math.abs(d.valueChange).toLocaleString()}/month (${Math.abs(d.trafficChange)} clicks)`);
});

console.log('\n' + '═'.repeat(70));
console.log('✅ Report complete!');
console.log('═'.repeat(70));
