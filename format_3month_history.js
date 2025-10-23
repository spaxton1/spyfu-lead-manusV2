const fs = require('fs');

// Read the JSON data
const rawData = fs.readFileSync('domain_trends_3months.json', 'utf8');
const domains = JSON.parse(rawData);

// Function to format currency
function formatCurrency(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

// Function to format rank (one decimal place)
function formatRank(value) {
  return value.toFixed(1);
}

// Generate the formatted report
let output = '';

domains.forEach((domain, index) => {
  output += `\n${'='.repeat(80)}\n`;
  output += `DOMAIN #${index + 1}: ${domain.domain}\n`;
  output += `${'='.repeat(80)}\n\n`;
  
  // Check if domain has data
  if (domain.monthlyStats.length === 0 || domain.monthlyStats[0].totalOrganicResults === 0) {
    output += '⚠️  NO DATA AVAILABLE - Domain not tracked in SpyFu\n';
    return;
  }
  
  // We have 3 months: [0] = oldest (3 months ago), [1] = 2 months ago, [2] = newest (1 month ago)
  const threeMonthsAgo = domain.monthlyStats[0];
  const twoMonthsAgo = domain.monthlyStats[1];
  const oneMonthAgo = domain.monthlyStats[2];
  
  // Format each month
  output += `3Mo History: ${threeMonthsAgo.totalOrganicResults.toLocaleString()} KWs | ${formatCurrency(threeMonthsAgo.monthlyOrganicValue)} | ${threeMonthsAgo.monthlyOrganicClicks.toLocaleString()} Clicks | ${formatRank(threeMonthsAgo.averageOrganicRank)} Av Rank | ${threeMonthsAgo.strength} Authority\n`;
  
  output += `2Mo History: ${twoMonthsAgo.totalOrganicResults.toLocaleString()} KWs | ${formatCurrency(twoMonthsAgo.monthlyOrganicValue)} | ${twoMonthsAgo.monthlyOrganicClicks.toLocaleString()} Clicks | ${formatRank(twoMonthsAgo.averageOrganicRank)} Av Rank | ${twoMonthsAgo.strength} Authority\n`;
  
  output += `1Mo History: ${oneMonthAgo.totalOrganicResults.toLocaleString()} KWs | ${formatCurrency(oneMonthAgo.monthlyOrganicValue)} | ${oneMonthAgo.monthlyOrganicClicks.toLocaleString()} Clicks | ${formatRank(oneMonthAgo.averageOrganicRank)} Av Rank | ${oneMonthAgo.strength} Authority\n`;
  
  // Add trend summary
  output += `\n📊 TREND SUMMARY:\n`;
  output += `   Keywords Change: ${domain.rankingChange > 0 ? '+' : ''}${domain.rankingChange.toLocaleString()}\n`;
  output += `   Traffic Change: ${domain.trafficChange > 0 ? '+' : ''}${domain.trafficChange.toLocaleString()} clicks\n`;
  output += `   Value Change: ${domain.valueChange > 0 ? '+' : ''}${formatCurrency(domain.valueChange)}\n`;
  output += `   Rank Change: ${domain.rankChange > 0 ? '+' : ''}${formatRank(domain.rankChange)} positions\n`;
  output += `   Status: ${domain.isDeclining ? '⚠️  DECLINING' : '✅ GROWING/STABLE'}\n`;
});

// Write to file
fs.writeFileSync('domain_3month_history_formatted.txt', output);

console.log('✅ Formatted report created: domain_3month_history_formatted.txt');
console.log(`   Total domains processed: ${domains.length}`);
console.log(`   Domains with data: ${domains.filter(d => d.monthlyStats[0].totalOrganicResults > 0).length}`);
console.log(`   Declining domains: ${domains.filter(d => d.isDeclining).length}`);
