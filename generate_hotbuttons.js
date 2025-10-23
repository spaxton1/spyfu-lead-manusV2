#!/usr/bin/env node

/**
 * Generate HotButton data points for B2B cold calling
 * Focus: Create urgency and pain points that resonate with business owners
 * 
 * HotButton Formula:
 * - Show LOSSES (keywords, traffic, $$$)
 * - Use percentages for impact
 * - Keep it punchy and urgent
 * - Focus on what they're LOSING, not technical metrics
 */

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('domain_trends_4months.json', 'utf8'));

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('4-MONTH DOMAIN HISTORY WITH HOTBUTTONS');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

data.forEach((domainData) => {
  console.log('');
  console.log('─'.repeat(79));
  console.log(`DOMAIN: ${domainData.domain}`);
  console.log('─'.repeat(79));
  
  if (domainData.monthlyStats.length === 0) {
    console.log('⚠️  NO DATA AVAILABLE - Domain not tracked in SpyFu\n');
    return;
  }
  
  const months = domainData.monthlyStats;
  const thisMonth = months[3];
  const oneMonth = months[2];
  const twoMonth = months[1];
  const threeMonth = months[0];
  
  // Calculate HotButtons (3Mo ago vs This Month)
  const kwChange = thisMonth.totalOrganicResults - threeMonth.totalOrganicResults;
  const kwPercent = threeMonth.totalOrganicResults > 0 
    ? ((kwChange / threeMonth.totalOrganicResults) * 100).toFixed(1) 
    : 0;
  
  const clicksChange = thisMonth.monthlyOrganicClicks - threeMonth.monthlyOrganicClicks;
  const clicksPercent = threeMonth.monthlyOrganicClicks > 0 
    ? ((clicksChange / threeMonth.monthlyOrganicClicks) * 100).toFixed(1) 
    : 0;
  
  const valueChange = thisMonth.monthlyOrganicValue - threeMonth.monthlyOrganicValue;
  const valuePercent = threeMonth.monthlyOrganicValue > 0 
    ? ((valueChange / threeMonth.monthlyOrganicValue) * 100).toFixed(1) 
    : 0;
  
  // Build HotButtons string
  let hotButtons = [];
  
  // Keywords lost/gained
  if (kwChange < 0) {
    hotButtons.push(`Lost ${Math.abs(kwChange)} KWs (${Math.abs(kwPercent)}%)`);
  } else if (kwChange > 0) {
    hotButtons.push(`Gained ${kwChange} KWs (+${kwPercent}%)`);
  }
  
  // Traffic lost/gained
  if (clicksChange < 0) {
    hotButtons.push(`Traffic DOWN ${Math.abs(clicksPercent)}%`);
  } else if (clicksChange > 0) {
    hotButtons.push(`Traffic UP ${clicksPercent}%`);
  }
  
  // Value lost/gained
  if (valueChange < 0) {
    hotButtons.push(`Lost $${Math.abs(Math.round(valueChange)).toLocaleString()}/mo`);
  } else if (valueChange > 0) {
    hotButtons.push(`Gained $${Math.round(valueChange).toLocaleString()}/mo`);
  }
  
  // Authority change
  const authChange = thisMonth.strength - threeMonth.strength;
  if (authChange < 0) {
    hotButtons.push(`Authority -${Math.abs(authChange)}`);
  } else if (authChange > 0) {
    hotButtons.push(`Authority +${authChange}`);
  }
  
  // Monthly trend (last month vs this month)
  const recentClicksChange = thisMonth.monthlyOrganicClicks - oneMonth.monthlyOrganicClicks;
  if (recentClicksChange < 0) {
    hotButtons.push(`📉 Declining`);
  } else if (recentClicksChange > 0) {
    hotButtons.push(`📈 Growing`);
  }
  
  const hotButtonString = hotButtons.length > 0 ? hotButtons.join(' | ') : 'Stable';
  
  // Display data
  console.log(`This Month: ${thisMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(thisMonth.monthlyOrganicValue).toLocaleString()} | ${thisMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${thisMonth.strength} Authority`);
  console.log(`1Mo History: ${oneMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(oneMonth.monthlyOrganicValue).toLocaleString()} | ${oneMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${oneMonth.strength} Authority`);
  console.log(`2Mo History: ${twoMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(twoMonth.monthlyOrganicValue).toLocaleString()} | ${twoMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${twoMonth.strength} Authority`);
  console.log(`3Mo History: ${threeMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(threeMonth.monthlyOrganicValue).toLocaleString()} | ${threeMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${threeMonth.strength} Authority`);
  console.log(`HotButtons: ${hotButtonString}`);
});

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('HOTBUTTON LEGEND');
console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('Lost X KWs (Y%) = Keywords dropped over 4 months (PAIN POINT)');
console.log('Traffic DOWN X% = Monthly visitor loss (REVENUE IMPACT)');
console.log('Lost $X/mo = Monthly traffic value lost (DOLLAR PAIN)');
console.log('Authority -X = Domain strength declining (COMPETITIVE WEAKNESS)');
console.log('📉 Declining = Recent downward trend (URGENCY)');
console.log('');
console.log('💡 COLD CALLING TIP:');
console.log('   Lead with the BIGGEST pain point from HotButtons');
console.log('   Example: "You lost 742 keywords in 4 months - that\'s a 13.6% drop..."');
console.log('');
