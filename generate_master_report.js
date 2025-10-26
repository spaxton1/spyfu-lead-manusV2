#!/usr/bin/env node

/**
 * MASTER REPORT GENERATOR
 * 
 * Creates visual mockups showing all ranking nuggets for each domain:
 * - 4-Month Trend Data & Peak Decline Analysis
 * - Page 1 Performance Metrics
 * - Top Money Keywords
 * - Top Local Keywords
 * - Low-Hanging Fruit Opportunities
 * 
 * Output: Beautiful call center popup mockups for all 18 domains
 */

const fs = require('fs');

// Load test results
const testResults = require('./master_test_results.json');

// Load US cities database for local keyword detection
const usCitiesLookup = require('./us_cities_lookup.json');
const cityNames = new Set(Object.keys(usCitiesLookup).map(city => city.toLowerCase()));
const stateNames = new Set(['alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming']);
const stateAbbreviations = new Set(['al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy']);

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Format numbers
function formatNum(num) {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${Math.round(num / 1000)}K`;
  return Math.round(num).toString();
}

// Check if keyword contains local identifiers
function isLocalKeyword(keyword) {
  const kw = keyword.toLowerCase();
  const words = kw.split(/\s+/);
  
  // Check for cities
  for (const word of words) {
    if (cityNames.has(word)) return true;
  }
  
  // Check for states
  for (const word of words) {
    if (stateNames.has(word) || stateAbbreviations.has(word)) return true;
  }
  
  // Check for ZIP codes
  if (/\d{5}/.test(kw)) return true;
  
  // Check for geographic descriptors (but exclude generic terms)
  const geoDescriptors = ['north', 'south', 'east', 'west', 'central', 'downtown'];
  const excludeGeneric = ['near me', 'local', 'city', 'nearby'];
  
  for (const exclude of excludeGeneric) {
    if (kw.includes(exclude)) return false;
  }
  
  for (const geo of geoDescriptors) {
    if (words.includes(geo) && words.length > 2) return true;
  }
  
  return false;
}

// Analyze 4-month trends and generate peak decline analysis
function analyzeTrends(trends) {
  if (trends.length < 4) return null;
  
  const thisMonth = trends[3];
  const previousMonths = [trends[2], trends[1], trends[0]];
  
  // Find PEAK values
  const peakKWs = Math.max(...previousMonths.map(m => m.totalOrganicResults));
  const peakValue = Math.max(...previousMonths.map(m => m.monthlyOrganicValue));
  const peakClicks = Math.max(...previousMonths.map(m => m.monthlyOrganicClicks));
  const peakAuthority = Math.max(...previousMonths.map(m => m.strength));
  
  // Calculate declines
  const kwDecline = peakKWs - thisMonth.totalOrganicResults;
  const valueDecline = peakValue - thisMonth.monthlyOrganicValue;
  const clicksDecline = peakClicks - thisMonth.monthlyOrganicClicks;
  const authorityChange = thisMonth.strength - peakAuthority;
  
  // Find which month was the peak
  let peakMonthsAgo = 1;
  if (previousMonths[2].totalOrganicResults === peakKWs || previousMonths[2].monthlyOrganicValue === peakValue) {
    peakMonthsAgo = 1;
  } else if (previousMonths[1].totalOrganicResults === peakKWs || previousMonths[1].monthlyOrganicValue === peakValue) {
    peakMonthsAgo = 2;
  } else {
    peakMonthsAgo = 3;
  }
  
  return {
    thisMonth: {
      keywords: thisMonth.totalOrganicResults,
      value: thisMonth.monthlyOrganicValue,
      clicks: thisMonth.monthlyOrganicClicks,
      authority: thisMonth.strength
    },
    peak: {
      keywords: peakKWs,
      value: peakValue,
      clicks: peakClicks,
      authority: peakAuthority,
      monthsAgo: peakMonthsAgo
    },
    decline: {
      keywords: kwDecline,
      value: valueDecline,
      clicks: clicksDecline,
      authority: authorityChange,
      keywordPct: thisMonth.totalOrganicResults > 0 ? Math.round((kwDecline / thisMonth.totalOrganicResults) * 100) : 0
    }
  };
}

// Analyze Page 1 keywords
function analyzePage1(keywords) {
  if (keywords.length === 0) return null;
  
  let top1 = 0, top3 = 0, pos4to10 = 0;
  let totalValue = 0, totalVolume = 0;
  
  keywords.forEach(kw => {
    if (kw.rank === 1) {
      top1++;
      top3++;
    } else if (kw.rank <= 3) {
      top3++;
    } else {
      pos4to10++;
    }
    
    totalValue += kw.exactCostPerClick || kw.broadCostPerClick || 0;
    totalVolume += kw.searchVolume || 0;
  });
  
  // Find top CPC keywords not at position #1
  const nonPosition1 = keywords.filter(kw => kw.rank !== 1 && (kw.exactCostPerClick || kw.broadCostPerClick));
  const topCPCKeywords = nonPosition1
    .sort((a, b) => (b.exactCostPerClick || b.broadCostPerClick || 0) - (a.exactCostPerClick || a.broadCostPerClick || 0))
    .slice(0, 3);
  
  return {
    total: keywords.length,
    top1,
    top3,
    pos4to10,
    avgValue: totalValue / keywords.length,
    totalVolume,
    lowHangingFruit: topCPCKeywords
  };
}

// Analyze money keywords
function analyzeMoneyKeywords(keywords) {
  if (keywords.length === 0) return { moneyKeywords: [], localKeywords: [] };
  
  // Sort by CPC
  const sortedByCPC = keywords
    .filter(kw => kw.exactCostPerClick || kw.broadCostPerClick)
    .sort((a, b) => (b.exactCostPerClick || b.broadCostPerClick || 0) - (a.exactCostPerClick || a.broadCostPerClick || 0));
  
  // Top 5 money keywords (pure highest CPC)
  const moneyKeywords = sortedByCPC.slice(0, 5);
  
  // Top 3 local keywords (highest CPC with local identifiers)
  const localKeywords = sortedByCPC
    .filter(kw => isLocalKeyword(kw.keyword))
    .slice(0, 3);
  
  return { moneyKeywords, localKeywords };
}

// Generate call center mockup
function generateMockup(domain, analysis) {
  let output = '';
  
  output += `\n${'═'.repeat(100)}\n`;
  output += `${colors.bright}${colors.cyan}📞 CALL CENTER POPUP - ${domain.toUpperCase()}${colors.reset}\n`;
  output += `${'═'.repeat(100)}\n\n`;
  
  // Trends & Peak Decline
  if (analysis.trends) {
    output += `${colors.bright}📉 PEAK DECLINE ANALYSIS (Hot Button)${colors.reset}\n`;
    output += `${colors.green}┌────────────────────────────────────────────────────────────────────────────┐${colors.reset}\n`;
    output += `${colors.green}│${colors.reset} ${colors.yellow}This Month:${colors.reset}     ${analysis.trends.thisMonth.keywords} KWs | $${formatNum(analysis.trends.thisMonth.value)} | ${analysis.trends.thisMonth.clicks} Clicks | DA${analysis.trends.thisMonth.authority}${' '.repeat(20)}\n`;
    output += `${colors.green}│${colors.reset} ${colors.yellow}Peak (${analysis.trends.peak.monthsAgo}mo ago):${colors.reset}  ${analysis.trends.peak.keywords} KWs | $${formatNum(analysis.trends.peak.value)} | ${analysis.trends.peak.clicks} Clicks | DA${analysis.trends.peak.authority}${' '.repeat(20)}\n`;
    
    if (analysis.trends.decline.value > 100) {
      output += `${colors.green}│${colors.reset} ${colors.red}${colors.bright}📞 SCRIPT:${colors.reset}     ${colors.red}"Lost $${formatNum(analysis.trends.decline.value)} in ${analysis.trends.peak.monthsAgo} months..."${colors.reset}${' '.repeat(20)}\n`;
    } else if (analysis.trends.decline.keywords > 0) {
      output += `${colors.green}│${colors.reset} ${colors.red}${colors.bright}📞 SCRIPT:${colors.reset}     ${colors.red}"Lost ${analysis.trends.decline.keywords} rankings (${analysis.trends.decline.keywordPct}%) in ${analysis.trends.peak.monthsAgo} months..."${colors.reset}${' '.repeat(10)}\n`;
    }
    
    output += `${colors.green}└────────────────────────────────────────────────────────────────────────────┘${colors.reset}\n\n`;
  }
  
  // Page 1 Performance
  if (analysis.page1) {
    output += `${colors.bright}🎯 PAGE 1 PERFORMANCE${colors.reset}\n`;
    output += `${colors.green}┌────────────────────────────────────────────────────────────────────────────┐${colors.reset}\n`;
    output += `${colors.green}│${colors.reset} Total Page 1 KWs:  ${analysis.page1.total}${' '.repeat(60)}\n`;
    output += `${colors.green}│${colors.reset} Position #1:       ${analysis.page1.top1} keywords (${((analysis.page1.top1/analysis.page1.total)*100).toFixed(1)}%)${' '.repeat(40)}\n`;
    output += `${colors.green}│${colors.reset} Top 3:             ${analysis.page1.top3} keywords (${((analysis.page1.top3/analysis.page1.total)*100).toFixed(1)}%)${' '.repeat(40)}\n`;
    output += `${colors.green}│${colors.reset} Positions 4-10:    ${analysis.page1.pos4to10} keywords (${((analysis.page1.pos4to10/analysis.page1.total)*100).toFixed(1)}%)${' '.repeat(40)}\n`;
    output += `${colors.green}└────────────────────────────────────────────────────────────────────────────┘${colors.reset}\n\n`;
  }
  
  // Low-Hanging Fruit
  if (analysis.page1 && analysis.page1.lowHangingFruit.length > 0) {
    output += `${colors.bright}🍎 LOW-HANGING FRUIT (NOT at Position #1)${colors.reset}\n`;
    output += `${colors.green}┌────────────────────────────────────────────────────────────────────────────┐${colors.reset}\n`;
    
    analysis.page1.lowHangingFruit.forEach((kw, idx) => {
      const cpc = kw.exactCostPerClick || kw.broadCostPerClick || 0;
      const kwText = kw.keyword.substring(0, 45);
      output += `${colors.green}│${colors.reset} ${idx + 1}. ${colors.cyan}${kwText.padEnd(45)}${colors.reset} | Rank #${kw.rank} | $${cpc.toFixed(2)} CPC${' '.repeat(10)}\n`;
    });
    
    output += `${colors.green}└────────────────────────────────────────────────────────────────────────────┘${colors.reset}\n\n`;
  }
  
  // Money Keywords
  if (analysis.money.moneyKeywords.length > 0) {
    output += `${colors.bright}💰 TOP 5 MONEY KEYWORDS (Rank 11-75)${colors.reset}\n`;
    output += `${colors.green}┌────────────────────────────────────────────────────────────────────────────┐${colors.reset}\n`;
    
    analysis.money.moneyKeywords.forEach((kw, idx) => {
      const cpc = kw.exactCostPerClick || kw.broadCostPerClick || 0;
      const vol = kw.searchVolume || 0;
      const kwText = kw.keyword.substring(0, 40);
      output += `${colors.green}│${colors.reset} ${idx + 1}. ${colors.yellow}${kwText.padEnd(40)}${colors.reset} | $${cpc.toFixed(2)} | ${vol} vol | #${kw.rank}${' '.repeat(10)}\n`;
    });
    
    output += `${colors.green}└────────────────────────────────────────────────────────────────────────────┘${colors.reset}\n\n`;
  }
  
  // Local Keywords
  if (analysis.money.localKeywords.length > 0) {
    output += `${colors.bright}📍 TOP 3 LOCAL KEYWORDS (Rank 11-75)${colors.reset}\n`;
    output += `${colors.green}┌────────────────────────────────────────────────────────────────────────────┐${colors.reset}\n`;
    
    analysis.money.localKeywords.forEach((kw, idx) => {
      const cpc = kw.exactCostPerClick || kw.broadCostPerClick || 0;
      const vol = kw.searchVolume || 0;
      const kwText = kw.keyword.substring(0, 40);
      output += `${colors.green}│${colors.reset} ${idx + 1}. ${colors.cyan}${kwText.padEnd(40)}${colors.reset} | $${cpc.toFixed(2)} | ${vol} vol | #${kw.rank}${' '.repeat(10)}\n`;
    });
    
    output += `${colors.green}└────────────────────────────────────────────────────────────────────────────┘${colors.reset}\n\n`;
  }
  
  return output;
}

// Main execution
function main() {
  console.log(`\n${colors.bright}${colors.cyan}${'═'.repeat(100)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}                    📊 MASTER REPORT - CALL CENTER MOCKUPS${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}                         ${testResults.totalDomains} Domains Analyzed${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'═'.repeat(100)}${colors.reset}\n`);
  
  let fullReport = '';
  const summaryData = [];
  
  for (const result of testResults.results) {
    if (result.error) {
      console.log(`${colors.red}⊘ ${result.domain} - Skipped (error)${colors.reset}`);
      continue;
    }
    
    console.log(`${colors.cyan}→ Processing ${result.domain}...${colors.reset}`);
    
    // Analyze all data
    const analysis = {
      trends: analyzeTrends(result.trends),
      page1: analyzePage1(result.page1Keywords),
      money: analyzeMoneyKeywords(result.moneyKeywords)
    };
    
    // Generate mockup
    const mockup = generateMockup(result.domain, analysis);
    fullReport += mockup;
    
    // Store summary
    summaryData.push({
      domain: result.domain,
      analysis,
      cost: result.costs.total
    });
  }
  
  // Save full report
  fs.writeFileSync('./MASTER_REPORT.txt', fullReport);
  
  // Save summary JSON
  fs.writeFileSync('./master_report_summary.json', JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalDomains: testResults.totalDomains,
    totalCost: testResults.totalCost,
    avgCostPerDomain: testResults.totalCost / testResults.totalDomains,
    domains: summaryData
  }, null, 2));
  
  // Display report
  console.log(fullReport);
  
  // Summary
  console.log(`\n${colors.bright}${colors.green}${'═'.repeat(100)}${colors.reset}`);
  console.log(`${colors.bright}${colors.green}✅ MASTER REPORT COMPLETE${colors.reset}`);
  console.log(`${colors.bright}${colors.green}${'═'.repeat(100)}${colors.reset}\n`);
  console.log(`${colors.cyan}Total Domains:${colors.reset}       ${testResults.totalDomains}`);
  console.log(`${colors.cyan}Total API Cost:${colors.reset}      $${testResults.totalCost.toFixed(4)}`);
  console.log(`${colors.cyan}Avg Cost/Domain:${colors.reset}    $${(testResults.totalCost / testResults.totalDomains).toFixed(4)}`);
  console.log(`${colors.cyan}Report File:${colors.reset}         ./MASTER_REPORT.txt`);
  console.log(`${colors.cyan}Summary JSON:${colors.reset}        ./master_report_summary.json\n`);
}

main();
