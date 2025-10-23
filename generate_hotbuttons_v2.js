#!/usr/bin/env node

/**
 * Generate HotButton data points - CONCISE FORMAT
 * Format: Lost/Gained X% KWs | ±$XK Traffic Value | ±X Clicks | Authority ±X
 */

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('domain_trends_4months.json', 'utf8'));

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('4-MONTH DOMAIN HISTORY WITH HOTBUTTONS (CONCISE FORMAT)');
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
  
  // Calculate changes (3Mo ago vs This Month)
  const kwChange = thisMonth.totalOrganicResults - threeMonth.totalOrganicResults;
  const kwPercent = threeMonth.totalOrganicResults > 0 
    ? ((kwChange / threeMonth.totalOrganicResults) * 100) 
    : 0;
  
  const clicksChange = thisMonth.monthlyOrganicClicks - threeMonth.monthlyOrganicClicks;
  
  const valueChange = thisMonth.monthlyOrganicValue - threeMonth.monthlyOrganicValue;
  
  const authChange = thisMonth.strength - threeMonth.strength;
  
  // Format HotButtons
  let hotButtons = [];
  
  // Keywords change
  if (kwPercent !== 0) {
    const sign = kwPercent > 0 ? 'Gained' : 'Lost';
    hotButtons.push(`${sign} ${Math.abs(kwPercent).toFixed(0)}% KWs`);
  } else {
    hotButtons.push('0% KWs');
  }
  
  // Traffic value change
  if (valueChange !== 0) {
    const sign = valueChange > 0 ? '+' : '–';
    const valueK = Math.abs(valueChange) >= 1000 
      ? `${sign}$${(Math.abs(valueChange) / 1000).toFixed(1)}K`
      : `${sign}$${Math.abs(Math.round(valueChange))}`;
    hotButtons.push(`${valueK} Traffic Value`);
  } else {
    hotButtons.push('$0 Traffic Value');
  }
  
  // Clicks change
  if (clicksChange !== 0) {
    const sign = clicksChange > 0 ? '+' : '–';
    hotButtons.push(`${sign}${Math.abs(clicksChange)} Clicks`);
  } else {
    hotButtons.push('0 Clicks');
  }
  
  // Authority change
  if (authChange !== 0) {
    const sign = authChange > 0 ? '+' : '';
    hotButtons.push(`Authority ${sign}${authChange}`);
  } else {
    hotButtons.push('Authority 0');
  }
  
  const hotButtonString = hotButtons.join(' | ');
  
  // Display data
  console.log(`This Month: ${thisMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(thisMonth.monthlyOrganicValue).toLocaleString()} | ${thisMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${thisMonth.strength} Authority`);
  console.log(`1Mo History: ${oneMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(oneMonth.monthlyOrganicValue).toLocaleString()} | ${oneMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${oneMonth.strength} Authority`);
  console.log(`2Mo History: ${twoMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(twoMonth.monthlyOrganicValue).toLocaleString()} | ${twoMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${twoMonth.strength} Authority`);
  console.log(`3Mo History: ${threeMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(threeMonth.monthlyOrganicValue).toLocaleString()} | ${threeMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${threeMonth.strength} Authority`);
  console.log(`HotButtons: ${hotButtonString}`);
});

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('HOTBUTTON FORMAT');
console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('Format: Lost/Gained X% KWs | ±$XK Traffic Value | ±X Clicks | Authority ±X');
console.log('');
console.log('Examples:');
console.log('  Lost 12% KWs = 12% decrease in ranking keywords');
console.log('  –$1.3K Traffic Value = Lost $1,300/month in traffic value');
console.log('  –129 Clicks = Lost 129 monthly clicks');
console.log('  Authority +1 = Domain authority increased by 1');
console.log('');
console.log('💡 COLD CALLING TIP:');
console.log('   Lead with the dollar loss for maximum impact');
console.log('   Example: "You\'re losing $1,000 per month in free traffic..."');
console.log('');
