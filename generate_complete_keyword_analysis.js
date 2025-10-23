#!/usr/bin/env node

/**
 * COMPLETE KEYWORD ANALYSIS - Combining Page 1 + Money Keywords
 * 
 * Output per domain:
 * - Page 1 Analysis: Top 10 CPC + Top 10 Local (from rank 1-10)
 * - Money Keywords: Top 5 Money + Top 3 Local (from rank 11-75)
 * - Traffic Keywords: Top 3 Traffic (from both datasets combined)
 * 
 * Format: MoneyKW1, LocalKW1, TrafficKW1 style
 */

const fs = require('fs');

// Load Page 1 keywords data (rank 1-10)
const page1Data = require('./combined_domain_report_with_rankings.json');

// Load Money Keywords data (rank 11-75)
const moneyKeywordsData = require('./low_hanging_fruit_keywords_v2.json');

// Load comprehensive US cities database (29,880 cities)
const cityDatabase = require('./us_cities_lookup.json');

// Location detection patterns
const STATE_FULL_NAMES = /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/i;
const STATE_ABBREV = /\b(al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy)\b/i;
const GEOGRAPHIC_DESCRIPTOR_PATTERN = /\b(north|south|east|west|central|downtown|uptown)\s+(shore|side|end|coast)\b/i;
const ZIP_CODE_PATTERN = /\b\d{5}(?:-\d{4})?\b/;

function extractWords(keyword) {
  return keyword.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function hasLocalIdentifier(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  
  if (/\bnear\s+me\b/i.test(lowerKeyword)) return false;
  if (STATE_FULL_NAMES.test(lowerKeyword)) return true;
  if (STATE_ABBREV.test(lowerKeyword)) return true;
  if (ZIP_CODE_PATTERN.test(lowerKeyword)) return true;
  if (GEOGRAPHIC_DESCRIPTOR_PATTERN.test(lowerKeyword)) return true;
  
  const words = extractWords(keyword);
  for (const word of words) {
    if (cityDatabase.cities[word]) return true;
  }
  
  for (let i = 0; i < words.length - 1; i++) {
    const twoWords = `${words[i]} ${words[i + 1]}`;
    if (cityDatabase.cities[twoWords]) return true;
  }
  
  for (let i = 0; i < words.length - 2; i++) {
    const threeWords = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    if (cityDatabase.cities[threeWords]) return true;
  }
  
  return false;
}

function analyzeKeywords(domain) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🏢 DOMAIN: ${domain}`);
  console.log('═'.repeat(80));
  
  // Get Page 1 keywords (rank 1-10)
  const page1Domain = page1Data.find(d => d.domain === domain);
  const page1Keywords = page1Domain ? page1Domain.keywords.map(kw => ({
    keyword: kw.keyword,
    rank: kw.rank,
    cpc: kw.cpc || 0,
    volume: kw.traffic || 0,
    source: 'Page 1'
  })) : [];
  
  // Get Money Keywords (rank 11-75)
  const moneyDomain = moneyKeywordsData.find(d => d.domain === domain);
  const moneyKeywords = moneyDomain ? moneyDomain.keywords.map(kw => ({
    keyword: kw.keyword,
    rank: kw.rank,
    cpc: kw.exactCostPerClick || 0,
    volume: kw.searchVolume || 0,
    source: 'Rank 11-75'
  })) : [];
  
  console.log(`\n📊 Dataset Summary:`);
  console.log(`   Page 1 Keywords (Rank 1-10): ${page1Keywords.length}`);
  console.log(`   Money Keywords (Rank 11-75): ${moneyKeywords.length}`);
  console.log(`   Total Combined: ${page1Keywords.length + moneyKeywords.length}`);
  
  // Combine all keywords
  const allKeywords = [...page1Keywords, ...moneyKeywords];
  
  if (allKeywords.length === 0) {
    console.log(`\n❌ No keywords found for ${domain}`);
    return null;
  }
  
  // === PAGE 1 ANALYSIS ===
  console.log(`\n\n${'━'.repeat(80)}`);
  console.log(`📈 PAGE 1 ANALYSIS (Rank 1-10)`);
  console.log('━'.repeat(80));
  
  // Top 10 CPC from Page 1
  const page1ByCPC = [...page1Keywords]
    .filter(kw => kw.cpc > 0)
    .sort((a, b) => b.cpc - a.cpc)
    .slice(0, 10);
  
  console.log(`\n💰 TOP 10 HIGHEST CPC (Page 1):\n`);
  if (page1ByCPC.length === 0) {
    console.log(`   (No keywords with CPC data)\n`);
  } else {
    page1ByCPC.forEach((kw, idx) => {
      const kwName = `Page1CPC${idx + 1}`.padEnd(12);
      const kwText = kw.keyword.length > 38 ? kw.keyword.substring(0, 35) + '...' : kw.keyword.padEnd(38);
      console.log(`${kwName} | ${kwText} | $${kw.cpc.toFixed(2).padStart(7)} CPC | ${kw.volume.toString().padStart(6)} Vol | Rank #${kw.rank}`);
    });
  }
  
  // Top 10 Local from Page 1
  const page1Local = [...page1Keywords]
    .filter(kw => hasLocalIdentifier(kw.keyword))
    .sort((a, b) => b.cpc - a.cpc)
    .slice(0, 10);
  
  console.log(`\n📍 TOP 10 LOCAL KEYWORDS (Page 1):\n`);
  if (page1Local.length === 0) {
    console.log(`   (No local keywords found)\n`);
  } else {
    page1Local.forEach((kw, idx) => {
      const kwName = `Page1Loc${idx + 1}`.padEnd(12);
      const kwText = kw.keyword.length > 38 ? kw.keyword.substring(0, 35) + '...' : kw.keyword.padEnd(38);
      console.log(`${kwName} | ${kwText} | $${kw.cpc.toFixed(2).padStart(7)} CPC | ${kw.volume.toString().padStart(6)} Vol | Rank #${kw.rank}`);
    });
  }
  
  // === MONEY KEYWORDS ANALYSIS (Rank 11-75) ===
  console.log(`\n\n${'━'.repeat(80)}`);
  console.log(`💎 MONEY KEYWORDS ANALYSIS (Rank 11-75)`);
  console.log('━'.repeat(80));
  
  // Top 5 Money Keywords
  const top5Money = [...moneyKeywords]
    .sort((a, b) => b.cpc - a.cpc)
    .slice(0, 5);
  
  console.log(`\n💰 TOP 5 MONEY KEYWORDS:\n`);
  if (top5Money.length === 0) {
    console.log(`   (No keywords found)\n`);
  } else {
    top5Money.forEach((kw, idx) => {
      const kwName = `MoneyKW${idx + 1}`.padEnd(12);
      const kwText = kw.keyword.length > 38 ? kw.keyword.substring(0, 35) + '...' : kw.keyword.padEnd(38);
      console.log(`${kwName} | ${kwText} | $${kw.cpc.toFixed(2).padStart(7)} CPC | ${kw.volume.toString().padStart(6)} Vol | Rank #${kw.rank}`);
    });
  }
  
  // Top 3 Local Keywords from rank 11-75
  const top3Local = [...moneyKeywords]
    .filter(kw => hasLocalIdentifier(kw.keyword))
    .sort((a, b) => b.cpc - a.cpc)
    .slice(0, 3);
  
  console.log(`\n📍 TOP 3 LOCAL KEYWORDS:\n`);
  if (top3Local.length === 0) {
    console.log(`   (No local keywords found)\n`);
  } else {
    top3Local.forEach((kw, idx) => {
      const kwName = `LocalKW${idx + 1}`.padEnd(12);
      const kwText = kw.keyword.length > 38 ? kw.keyword.substring(0, 35) + '...' : kw.keyword.padEnd(38);
      console.log(`${kwName} | ${kwText} | $${kw.cpc.toFixed(2).padStart(7)} CPC | ${kw.volume.toString().padStart(6)} Vol | Rank #${kw.rank}`);
    });
  }
  
  // === TRAFFIC KEYWORDS (From Both Datasets) ===
  console.log(`\n\n${'━'.repeat(80)}`);
  console.log(`🚦 TOP 3 TRAFFIC KEYWORDS (All Sources)`);
  console.log('━'.repeat(80));
  
  const top3Traffic = [...allKeywords]
    .filter(kw => kw.volume > 0)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 3);
  
  console.log(`\n🔥 HIGHEST TRAFFIC:\n`);
  if (top3Traffic.length === 0) {
    console.log(`   (No keywords with volume data)\n`);
  } else {
    top3Traffic.forEach((kw, idx) => {
      const kwName = `TrafficKW${idx + 1}`.padEnd(12);
      const kwText = kw.keyword.length > 38 ? kw.keyword.substring(0, 35) + '...' : kw.keyword.padEnd(38);
      console.log(`${kwName} | ${kwText} | $${kw.cpc.toFixed(2).padStart(7)} CPC | ${kw.volume.toString().padStart(6)} Vol | Rank #${kw.rank} | ${kw.source}`);
    });
  }
  
  return {
    domain,
    page1Analysis: {
      top10CPC: page1ByCPC,
      top10Local: page1Local
    },
    moneyKeywordsAnalysis: {
      top5Money: top5Money,
      top3Local: top3Local
    },
    trafficKeywords: top3Traffic,
    summary: {
      totalPage1Keywords: page1Keywords.length,
      totalMoneyKeywords: moneyKeywords.length,
      totalKeywords: allKeywords.length
    }
  };
}

// Main execution
console.log('🎯 COMPLETE KEYWORD ANALYSIS');
console.log('Combining Page 1 (Rank 1-10) + Money Keywords (Rank 11-75)');
console.log('═'.repeat(80));

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

const results = [];

for (const domain of domains) {
  const analysis = analyzeKeywords(domain);
  if (analysis) {
    results.push(analysis);
  }
}

// Save to JSON
const outputFile = './complete_keyword_analysis.json';
fs.writeFileSync(
  outputFile,
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    description: 'Complete keyword analysis combining Page 1 (rank 1-10) and Money Keywords (rank 11-75)',
    dataSources: {
      page1: 'combined_domain_report_with_rankings.json (rank 1-10)',
      moneyKeywords: 'low_hanging_fruit_keywords_v2.json (rank 11-75)',
      cityDatabase: 'us_cities_lookup.json (29,880 cities)'
    },
    results: results
  }, null, 2)
);

console.log(`\n\n${'═'.repeat(80)}`);
console.log(`✅ Analysis complete!`);
console.log(`📁 Saved to: ${outputFile}`);
console.log(`📊 Domains analyzed: ${results.length}`);
console.log('═'.repeat(80));
