#!/usr/bin/env node

/**
 * PEAK DECLINE HOTBUTTONS
 * 
 * Strategy: Find the BIGGEST loss from any previous month vs This Month
 * Priority: Negative signals first (losses sell better than gains)
 * 
 * Logic:
 * 1. Compare This Month to each of the last 3 months
 * 2. Find the PEAK (highest previous value) for KWs, Value, Clicks
 * 3. Calculate decline from peak to current
 * 4. If no decline exists, show best gain instead
 */

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('domain_trends_4months.json', 'utf8'));

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('PEAK DECLINE HOTBUTTONS - Find Maximum Loss for Cold Calling');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

data.forEach((domainData) => {
  console.log('');
  console.log('─'.repeat(79));
  console.log(`DOMAIN: ${domainData.domain}`);
  console.log('─'.repeat(79));
  
  if (domainData.monthlyStats.length === 0) {
    console.log('⚠️  NO DATA AVAILABLE\n');
    return;
  }
  
  const months = domainData.monthlyStats;
  const thisMonth = months[3];  // Current month (Sept)
  const oneMonth = months[2];   // 1 month ago (Aug)
  const twoMonth = months[1];   // 2 months ago (July)
  const threeMonth = months[0]; // 3 months ago (June)
  
  const previousMonths = [oneMonth, twoMonth, threeMonth];
  
  // Find PEAK values from previous 3 months
  const peakKWs = Math.max(oneMonth.totalOrganicResults, twoMonth.totalOrganicResults, threeMonth.totalOrganicResults);
  const peakValue = Math.max(oneMonth.monthlyOrganicValue, twoMonth.monthlyOrganicValue, threeMonth.monthlyOrganicValue);
  const peakClicks = Math.max(oneMonth.monthlyOrganicClicks, twoMonth.monthlyOrganicClicks, threeMonth.monthlyOrganicClicks);
  
  // Calculate declines from PEAK
  const kwDecline = peakKWs - thisMonth.totalOrganicResults;
  const valueDecline = peakValue - thisMonth.monthlyOrganicValue;
  const clicksDecline = peakClicks - thisMonth.monthlyOrganicClicks;
  
  // Calculate percentages
  const kwPercent = peakKWs > 0 ? ((kwDecline / peakKWs) * 100) : 0;
  const valuePercent = peakValue > 0 ? ((valueDecline / peakValue) * 100) : 0;
  const clicksPercent = peakClicks > 0 ? ((clicksDecline / peakClicks) * 100) : 0;
  
  // Authority change (compare to 3 months ago)
  const authChange = thisMonth.strength - threeMonth.strength;
  
  // Build HotButtons - NEGATIVE FIRST
  let hotButtons = [];
  
  // 1. KEYWORDS (Priority #1)
  if (kwDecline > 0) {
    hotButtons.push(`Lost ${kwDecline} KWs (${kwPercent.toFixed(1)}%)`);
  } else if (kwDecline < 0) {
    hotButtons.push(`Gained ${Math.abs(kwDecline)} KWs (+${Math.abs(kwPercent).toFixed(1)}%)`);
  } else {
    hotButtons.push('0 KW Change');
  }
  
  // 2. VALUE (Priority #2 - HUGE selling point)
  if (valueDecline > 0) {
    const valueK = valueDecline >= 1000 
      ? `–$${(valueDecline / 1000).toFixed(1)}K`
      : `–$${Math.round(valueDecline)}`;
    hotButtons.push(`${valueK} Value`);
  } else if (valueDecline < 0) {
    const valueK = Math.abs(valueDecline) >= 1000 
      ? `+$${(Math.abs(valueDecline) / 1000).toFixed(1)}K`
      : `+$${Math.abs(Math.round(valueDecline))}`;
    hotButtons.push(`${valueK} Value`);
  } else {
    hotButtons.push('$0 Value');
  }
  
  // 3. CLICKS (Priority #3)
  if (clicksDecline > 0) {
    hotButtons.push(`–${clicksDecline} Clicks`);
  } else if (clicksDecline < 0) {
    hotButtons.push(`+${Math.abs(clicksDecline)} Clicks`);
  } else {
    hotButtons.push('0 Clicks');
  }
  
  // 4. AUTHORITY (helpful context)
  if (authChange !== 0) {
    const sign = authChange > 0 ? '+' : '';
    hotButtons.push(`Authority ${sign}${authChange}`);
  }
  
  const hotButtonString = hotButtons.join(' | ');
  
  // Display data
  console.log(`This Month: ${thisMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(thisMonth.monthlyOrganicValue).toLocaleString()} | ${thisMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${thisMonth.strength} Authority`);
  console.log(`1Mo History: ${oneMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(oneMonth.monthlyOrganicValue).toLocaleString()} | ${oneMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${oneMonth.strength} Authority`);
  console.log(`2Mo History: ${twoMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(twoMonth.monthlyOrganicValue).toLocaleString()} | ${twoMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${twoMonth.strength} Authority`);
  console.log(`3Mo History: ${threeMonth.totalOrganicResults.toLocaleString()} KWs | $${Math.round(threeMonth.monthlyOrganicValue).toLocaleString()} | ${threeMonth.monthlyOrganicClicks.toLocaleString()} Clicks | ${threeMonth.strength} Authority`);
  console.log(`HotButtons: ${hotButtonString}`);
  
  // Show cold calling script
  if (kwDecline > 0 || valueDecline > 0 || clicksDecline > 0) {
    console.log('');
    console.log('📞 COLD CALLING SCRIPT:');
    
    // Prioritize the biggest pain point
    if (valueDecline > 0 && valueDecline >= 100) {
      const monthsAgo = peakValue === oneMonth.monthlyOrganicValue ? '1 month' : 
                        peakValue === twoMonth.monthlyOrganicValue ? '2 months' : '3 months';
      console.log(`   "Hi [Name], I was looking at ${domainData.domain} and noticed over the last ${monthsAgo}`);
      console.log(`    you lost $${Math.round(valueDecline).toLocaleString()} in monthly traffic value..."`);
    } else if (kwDecline > 0) {
      const monthsAgo = peakKWs === oneMonth.totalOrganicResults ? '1 month' : 
                        peakKWs === twoMonth.totalOrganicResults ? '2 months' : '3 months';
      console.log(`   "Hi [Name], I was looking at ${domainData.domain} and saw over the last ${monthsAgo}`);
      console.log(`    you lost ${kwDecline} ranking keywords..."`);
    } else if (clicksDecline > 0) {
      const monthsAgo = peakClicks === oneMonth.monthlyOrganicClicks ? '1 month' : 
                        peakClicks === twoMonth.monthlyOrganicClicks ? '2 months' : '3 months';
      console.log(`   "Hi [Name], I noticed ${domainData.domain} lost ${clicksDecline} monthly visitors`);
      console.log(`    over the last ${monthsAgo}..."`);
    }
  }
});

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('PEAK DECLINE METHODOLOGY');
console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('1. Find HIGHEST value from previous 3 months (peak performance)');
console.log('2. Compare This Month to peak - calculate maximum decline');
console.log('3. Prioritize losses (negative sells better than positive)');
console.log('4. Order: Keywords > Value > Clicks > Authority');
console.log('');
console.log('Example: painreliefkc.com');
console.log('  Peak KWs: 432 (2 months ago)');
console.log('  This Month: 392 KWs');
console.log('  Decline: 40 KWs (9.3%)');
console.log('  Script: "You lost 40 rankings over the last 2 months"');
console.log('');
