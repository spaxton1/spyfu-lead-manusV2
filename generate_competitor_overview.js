#!/usr/bin/env node

/**
 * COMPETITOR OVERVIEW REPORT
 * Displays all competitor data for each of the 6 domains
 */

const fs = require('fs');

// Load competitor analysis results
const results = require('./competitor_analysis_results.json');

console.log('═'.repeat(100));
console.log('🎯 COMPETITOR ANALYSIS - COMPLETE OVERVIEW');
console.log('═'.repeat(100));
console.log();

// Process each domain
for (const domainData of results.results) {
  console.log('\n' + '═'.repeat(100));
  console.log(`🏢 DOMAIN: ${domainData.domain}`);
  console.log('═'.repeat(100));
  
  // Best Keyword Section
  const kw = domainData.bestKeyword;
  console.log();
  console.log('📍 BEST KEYWORD SELECTED:');
  console.log(`   Keyword:        "${kw.keyword}"`);
  console.log(`   CPC:            $${kw.cpc.toFixed(2)}`);
  console.log(`   Search Volume:  ${kw.volume.toLocaleString()}`);
  console.log(`   Current Rank:   #${kw.rank}`);
  console.log(`   Type:           ${kw.isLocal ? '📍 LOCAL (City/State/ZIP detected)' : '💰 MONEY (National keyword)'}`);
  
  // Competitor Stats Summary
  console.log();
  console.log('📊 COMPETITOR DISCOVERY:');
  console.log(`   Total SERP Results Found:  ${domainData.totalCompetitorsFound}`);
  console.log(`   After Filtering:           ${domainData.competitorsAfterFilter} (removed social/directories)`);
  console.log(`   With SEO Data:             ${domainData.competitorsWithData} competitors`);
  
  if (domainData.competitors.length === 0) {
    console.log();
    console.log('   ⚠️  No competitor data available');
    continue;
  }
  
  // All Competitors Table
  console.log();
  console.log('━'.repeat(100));
  console.log('🔍 ALL COMPETITORS - FULL DATA');
  console.log('━'.repeat(100));
  console.log();
  
  // Table header
  const headerRank = '#'.padStart(3);
  const headerDomain = 'Domain'.padEnd(42);
  const headerKWs = 'Keywords'.padStart(10);
  const headerValue = 'Value'.padStart(12);
  const headerClicks = 'Clicks'.padStart(10);
  const headerAuth = 'Auth'.padStart(5);
  const headerRankAvg = 'AvgRank'.padStart(8);
  
  console.log(`${headerRank} | ${headerDomain} | ${headerKWs} | ${headerValue} | ${headerClicks} | ${headerAuth} | ${headerRankAvg}`);
  console.log('─'.repeat(100));
  
  // Sort competitors by value (already sorted in results)
  domainData.competitors.forEach((comp, idx) => {
    const rank = (idx + 1).toString().padStart(3);
    const domain = comp.domain.length > 42 ? comp.domain.substring(0, 39) + '...' : comp.domain.padEnd(42);
    const keywords = comp.keywords.toLocaleString().padStart(10);
    const value = `$${comp.value.toLocaleString(undefined, {maximumFractionDigits: 0})}`.padStart(12);
    const clicks = comp.clicks.toLocaleString(undefined, {maximumFractionDigits: 0}).padStart(10);
    const auth = comp.authority.toString().padStart(5);
    const avgRank = comp.avgRank.toFixed(1).padStart(8);
    
    console.log(`${rank} | ${domain} | ${keywords} | ${value} | ${clicks} | ${auth} | ${avgRank}`);
  });
  
  // Statistics Summary
  console.log();
  console.log('━'.repeat(100));
  console.log('📈 COMPETITOR STATISTICS:');
  console.log('━'.repeat(100));
  
  const totalKeywords = domainData.competitors.reduce((sum, c) => sum + c.keywords, 0);
  const totalValue = domainData.competitors.reduce((sum, c) => sum + c.value, 0);
  const totalClicks = domainData.competitors.reduce((sum, c) => sum + c.clicks, 0);
  const avgAuthority = domainData.competitors.reduce((sum, c) => sum + c.authority, 0) / domainData.competitors.length;
  const avgKeywords = totalKeywords / domainData.competitors.length;
  const avgValue = totalValue / domainData.competitors.length;
  const avgClicks = totalClicks / domainData.competitors.length;
  
  // Find min/max
  const maxKWs = Math.max(...domainData.competitors.map(c => c.keywords));
  const minKWs = Math.min(...domainData.competitors.map(c => c.keywords));
  const maxValue = Math.max(...domainData.competitors.map(c => c.value));
  const minValue = Math.min(...domainData.competitors.map(c => c.value));
  const maxAuth = Math.max(...domainData.competitors.map(c => c.authority));
  const minAuth = Math.min(...domainData.competitors.map(c => c.authority));
  
  console.log();
  console.log('   AGGREGATE TOTALS:');
  console.log(`   Total Keywords (all competitors):     ${totalKeywords.toLocaleString()}`);
  console.log(`   Total Traffic Value (all competitors): $${totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`);
  console.log(`   Total Monthly Clicks (all competitors): ${totalClicks.toLocaleString(undefined, {maximumFractionDigits: 0})}`);
  
  console.log();
  console.log('   AVERAGES:');
  console.log(`   Average Keywords per Competitor:       ${avgKeywords.toLocaleString(undefined, {maximumFractionDigits: 0})}`);
  console.log(`   Average Traffic Value per Competitor:  $${avgValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`);
  console.log(`   Average Monthly Clicks per Competitor: ${avgClicks.toLocaleString(undefined, {maximumFractionDigits: 0})}`);
  console.log(`   Average Domain Authority:              ${avgAuthority.toFixed(1)}`);
  
  console.log();
  console.log('   RANGE (MIN - MAX):');
  console.log(`   Keywords:        ${minKWs.toLocaleString()} → ${maxKWs.toLocaleString()}`);
  console.log(`   Traffic Value:   $${minValue.toLocaleString(undefined, {maximumFractionDigits: 0})} → $${maxValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`);
  console.log(`   Authority:       ${minAuth} → ${maxAuth}`);
  
  // Top 3 Analysis
  console.log();
  console.log('━'.repeat(100));
  console.log('🏆 TOP 3 COMPETITORS ANALYSIS:');
  console.log('━'.repeat(100));
  
  const top3 = domainData.competitors.slice(0, 3);
  top3.forEach((comp, idx) => {
    console.log();
    console.log(`   ${idx + 1}. ${comp.domain}`);
    console.log(`      ├─ Keywords:      ${comp.keywords.toLocaleString()}`);
    console.log(`      ├─ Traffic Value: $${comp.value.toLocaleString(undefined, {maximumFractionDigits: 0})} / month`);
    console.log(`      ├─ Monthly Clicks: ${comp.clicks.toLocaleString(undefined, {maximumFractionDigits: 0})}`);
    console.log(`      ├─ Authority:     ${comp.authority} / 100`);
    console.log(`      ├─ Avg Rank:      #${comp.avgRank.toFixed(1)}`);
    console.log(`      └─ Data Month:    ${comp.searchMonth}/${comp.searchYear}`);
  });
  
  // Competitive Landscape
  console.log();
  console.log('━'.repeat(100));
  console.log('💡 COMPETITIVE LANDSCAPE:');
  console.log('━'.repeat(100));
  
  // Categorize competitors by size
  const small = domainData.competitors.filter(c => c.keywords < 500);
  const medium = domainData.competitors.filter(c => c.keywords >= 500 && c.keywords < 5000);
  const large = domainData.competitors.filter(c => c.keywords >= 5000 && c.keywords < 50000);
  const enterprise = domainData.competitors.filter(c => c.keywords >= 50000);
  
  console.log();
  console.log('   COMPETITOR SIZE DISTRIBUTION:');
  console.log(`   Small (<500 KWs):        ${small.length} competitors`);
  console.log(`   Medium (500-5K KWs):     ${medium.length} competitors`);
  console.log(`   Large (5K-50K KWs):      ${large.length} competitors`);
  console.log(`   Enterprise (50K+ KWs):   ${enterprise.length} competitors`);
  
  console.log();
  console.log('   AUTHORITY DISTRIBUTION:');
  const lowAuth = domainData.competitors.filter(c => c.authority < 25);
  const midAuth = domainData.competitors.filter(c => c.authority >= 25 && c.authority < 40);
  const highAuth = domainData.competitors.filter(c => c.authority >= 40);
  
  console.log(`   Low Authority (<25):     ${lowAuth.length} competitors`);
  console.log(`   Mid Authority (25-40):   ${midAuth.length} competitors`);
  console.log(`   High Authority (40+):    ${highAuth.length} competitors`);
  
  // Strategic Insights
  console.log();
  console.log('━'.repeat(100));
  console.log('🎯 STRATEGIC INSIGHTS:');
  console.log('━'.repeat(100));
  console.log();
  
  // Identify weakest competitor
  const weakest = domainData.competitors[domainData.competitors.length - 1];
  const strongest = domainData.competitors[0];
  
  console.log(`   🎯 OPPORTUNITY: Weakest competitor is ${weakest.domain}`);
  console.log(`      └─ Only ${weakest.keywords} keywords, $${weakest.value.toFixed(0)} value, Authority ${weakest.authority}`);
  
  console.log();
  console.log(`   ⚠️  THREAT: Strongest competitor is ${strongest.domain}`);
  console.log(`      └─ ${strongest.keywords.toLocaleString()} keywords, $${strongest.value.toLocaleString(undefined, {maximumFractionDigits: 0})} value, Authority ${strongest.authority}`);
  
  // Value gap analysis
  const valueGap = strongest.value - weakest.value;
  const kwGap = strongest.keywords - weakest.keywords;
  
  console.log();
  console.log(`   📊 COMPETITIVE GAP:`);
  console.log(`      ├─ Traffic Value Gap: $${valueGap.toLocaleString(undefined, {maximumFractionDigits: 0})} between strongest and weakest`);
  console.log(`      ├─ Keyword Count Gap: ${kwGap.toLocaleString()} keywords difference`);
  console.log(`      └─ Your Opportunity: Target medium-strength competitors (${medium.length} available)`);
}

// Overall Summary
console.log();
console.log();
console.log('═'.repeat(100));
console.log('📊 OVERALL ANALYSIS SUMMARY');
console.log('═'.repeat(100));
console.log();

const allCompetitors = results.results.reduce((sum, d) => sum + d.competitorsWithData, 0);
const totalDomains = results.results.length;

console.log(`   Domains Analyzed:           ${totalDomains}`);
console.log(`   Total Competitors Found:    ${allCompetitors}`);
console.log(`   Average Competitors/Domain: ${(allCompetitors / totalDomains).toFixed(1)}`);

console.log();
console.log('   KEYWORD STRATEGY:');
results.results.forEach(d => {
  const localBadge = d.bestKeyword.isLocal ? '📍' : '💰';
  console.log(`   ${localBadge} ${d.domain.padEnd(35)} → "${d.bestKeyword.keyword}" ($${d.bestKeyword.cpc.toFixed(2)})`);
});

console.log();
console.log('═'.repeat(100));
console.log('✅ COMPETITOR OVERVIEW COMPLETE');
console.log('═'.repeat(100));
console.log();
