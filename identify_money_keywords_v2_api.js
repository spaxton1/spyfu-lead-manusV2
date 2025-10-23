#!/usr/bin/env node

/**
 * Money Keywords Identification - V2 API Version
 * 
 * PURPOSE: Identify high-value keywords for B2B cold calling
 * DATA SOURCE: SpyFu Low Hanging Fruit API (Rank 11-75)
 * OUTPUT: Top 5 Money Keywords + Top 3 Local Keywords per domain
 * 
 * ALGORITHM:
 * 1. Sort all keywords by CPC (highest first)
 * 2. Money Keywords = Top 5 by pure CPC
 * 3. Local Keywords = Top 3 with location identifiers (city, state, ZIP)
 * 
 * LOCATION DETECTION:
 * ✅ Detects: 29,880 US cities, all 50 states, ZIP codes, geographic descriptors
 * ❌ Excludes: Generic "near me", "local", "city" (nationwide searches)
 */

const fs = require('fs');

// Load comprehensive US cities database (29,880 cities)
const cityDatabase = require('./us_cities_lookup.json');

// Location detection patterns
const STATE_FULL_NAMES = /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/i;

const STATE_ABBREV = /\b(al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy)\b/i;

const GEOGRAPHIC_DESCRIPTOR_PATTERN = /\b(north|south|east|west|central|downtown|uptown)\s+(shore|side|end|coast)\b/i;

const ZIP_CODE_PATTERN = /\b\d{5}(?:-\d{4})?\b/;

/**
 * Extract individual words from keyword (handles multi-word phrases)
 */
function extractWords(keyword) {
  return keyword.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

/**
 * Check if a keyword contains a local identifier
 * Uses comprehensive 29,880 city database + states + ZIP codes
 */
function hasLocalIdentifier(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  
  // Exclude known false positives (nationwide searches)
  if (/\bnear\s+me\b/i.test(lowerKeyword)) {
    return false;
  }
  
  // 1. Check for US State names (full names)
  if (STATE_FULL_NAMES.test(lowerKeyword)) {
    return true;
  }
  
  // 2. Check for state abbreviations
  if (STATE_ABBREV.test(lowerKeyword)) {
    return true;
  }
  
  // 3. Check for ZIP codes
  if (ZIP_CODE_PATTERN.test(lowerKeyword)) {
    return true;
  }
  
  // 4. Check for geographic descriptors
  if (GEOGRAPHIC_DESCRIPTOR_PATTERN.test(lowerKeyword)) {
    return true;
  }
  
  // 5. Check against comprehensive city database (29,880 cities)
  const words = extractWords(keyword);
  for (const word of words) {
    if (cityDatabase.cities[word]) {
      return true;
    }
  }
  
  // 6. Check for multi-word city names
  for (let i = 0; i < words.length - 1; i++) {
    const twoWords = `${words[i]} ${words[i + 1]}`;
    if (cityDatabase.cities[twoWords]) {
      return true;
    }
  }
  
  // Try three-word combinations
  for (let i = 0; i < words.length - 2; i++) {
    const threeWords = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    if (cityDatabase.cities[threeWords]) {
      return true;
    }
  }
  
  return false;
}

/**
 * Identify top Money Keywords and Local Keywords for a domain
 * @param {Object} domainData - Domain data with keywords from SpyFu API
 * @param {number} topMoneyN - Number of top Money Keywords to return (default: 5)
 * @param {number} topLocalN - Number of top Local Keywords to return (default: 3)
 * @returns {Object} Analysis results with top keywords
 */
function identifyMoneyKeywords(domainData, topMoneyN = 5, topLocalN = 3) {
  const domain = domainData.domain;
  const keywords = domainData.keywords;
  
  if (!keywords || keywords.length === 0) {
    return {
      domain,
      totalKeywords: 0,
      moneyKeywords: [],
      localKeywords: []
    };
  }
  
  // Sort by exact CPC (highest first)
  const sortedByValue = [...keywords].sort((a, b) => 
    (b.exactCostPerClick || 0) - (a.exactCostPerClick || 0)
  );
  
  // Get top N Money Keywords (pure highest CPC)
  const moneyKeywords = sortedByValue.slice(0, topMoneyN).map(kw => ({
    keyword: kw.keyword,
    cpc: kw.exactCostPerClick || 0,
    volume: kw.searchVolume || 0,
    rank: kw.rank,
    url: kw.topRankedUrl
  }));
  
  // Filter for keywords with local identifiers, sort by CPC, get top N
  const localSorted = sortedByValue
    .filter(kw => hasLocalIdentifier(kw.keyword))
    .slice(0, topLocalN);
  
  const localKeywords = localSorted.map(kw => ({
    keyword: kw.keyword,
    cpc: kw.exactCostPerClick || 0,
    volume: kw.searchVolume || 0,
    rank: kw.rank,
    url: kw.topRankedUrl,
    localMatch: true
  }));
  
  return {
    domain,
    totalKeywords: keywords.length,
    moneyKeywords,
    localKeywords
  };
}

/**
 * Format output for display
 */
function formatOutput(results) {
  let output = '';
  
  output += '═══════════════════════════════════════════════════════════════════════════════\n';
  output += '                    MONEY KEYWORDS IDENTIFICATION REPORT\n';
  output += '                       Data Source: V2 (Rank 11-75)\n';
  output += '═══════════════════════════════════════════════════════════════════════════════\n';
  output += 'Algorithm: 1) Highest CPC First | 2) Apply Local Identifier Check\n';
  output += 'Output: Top 5 Money Keywords + Top 3 Local Keywords per domain\n';
  output += '═══════════════════════════════════════════════════════════════════════════════\n\n';
  
  results.forEach(result => {
    if (result.totalKeywords === 0) {
      return; // Skip domains with no keywords
    }
    
    output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    output += `🏢 DOMAIN: ${result.domain}\n`;
    output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    output += `Total Keywords: ${result.totalKeywords}\n\n`;
    
    // Money Keywords
    output += '💰 TOP 5 MONEY KEYWORDS (Highest CPC):\n';
    output += '─────────────────────────────────────────────────────────────────────────────\n';
    
    if (result.moneyKeywords.length === 0) {
      output += '   (No keywords found)\n';
    } else {
      result.moneyKeywords.forEach((kw, idx) => {
        const kwName = `MoneyKW${idx + 1}`.padEnd(10);
        const kwText = kw.keyword.length > 40 ? kw.keyword.substring(0, 37) + '...' : kw.keyword.padEnd(40);
        output += `${kwName} | ${kwText} | $${kw.cpc.toFixed(2).padStart(6)} CPC | ${kw.volume.toString().padStart(6)} Vol | Rank #${kw.rank}\n`;
      });
    }
    
    output += '\n';
    
    // Local Keywords
    output += '📍 TOP 3 LOCAL KEYWORDS (Highest CPC + Location Identifier):\n';
    output += '─────────────────────────────────────────────────────────────────────────────\n';
    
    if (result.localKeywords.length === 0) {
      output += '   (No local keywords found)\n';
    } else {
      result.localKeywords.forEach((kw, idx) => {
        const kwName = `LocalKW${idx + 1}`.padEnd(10);
        const kwText = kw.keyword.length > 40 ? kw.keyword.substring(0, 37) + '...' : kw.keyword.padEnd(40);
        output += `${kwName} | ${kwText} | $${kw.cpc.toFixed(2).padStart(6)} CPC | ${kw.volume.toString().padStart(6)} Vol | Rank #${kw.rank}\n`;
      });
    }
    
    output += '\n';
  });
  
  output += '═══════════════════════════════════════════════════════════════════════════════\n';
  output += 'LEGEND:\n';
  output += '  💰 Money Keywords = Pure highest CPC (no location filter)\n';
  output += '  📍 Local Keywords = Highest CPC with specific location identifier\n';
  output += '     ✓ Detects: 29,880 US cities, all 50 states, ZIP codes, geographic descriptors\n';
  output += '     ✗ Removed: Generic "near me", "local", "city" (nationwide searches)\n';
  output += '═══════════════════════════════════════════════════════════════════════════════\n';
  
  return output;
}

// Main execution (when run directly)
if (require.main === module) {
  console.log(`📚 Loaded ${cityDatabase.metadata.totalCities.toLocaleString()} US cities from database\n`);
  console.log(`Processing domains using V2 (Rank 11-75)...\n`);
  
  // Load V2 data
  const data = require('./low_hanging_fruit_keywords_v2.json');
  
  // Process all domains (Top 5 Money, Top 3 Local)
  const results = data.map(domainData => identifyMoneyKeywords(domainData, 5, 3));
  
  // Display results
  console.log(formatOutput(results));
  
  // Save to JSON file
  const outputFile = './money_keywords_report_v2_api.json';
  const outputData = {
    generatedAt: new Date().toISOString(),
    dataSource: 'V2 (Rank 11-75)',
    configuration: {
      topMoneyKeywords: 5,
      topLocalKeywords: 3
    },
    algorithm: {
      step1: "Sort by highest CPC",
      step2: "Apply local identifier check (29,880 cities + states + ZIP codes)",
      excluded: "Removed generic nationwide searches: 'near me', 'local', 'city'"
    },
    cityDatabase: {
      totalCities: cityDatabase.metadata.totalCities,
      source: cityDatabase.metadata.source
    },
    results: results
  };
  
  fs.writeFileSync(
    outputFile,
    JSON.stringify(outputData, null, 2)
  );
  
  console.log(`\n✅ Report saved to: ${outputFile}\n`);
  
  // Summary statistics
  const totalDomains = results.filter(r => r.totalKeywords > 0).length;
  const totalMoneyKW = results.reduce((sum, r) => sum + r.moneyKeywords.length, 0);
  const totalLocalKW = results.reduce((sum, r) => sum + r.localKeywords.length, 0);
  
  console.log('📊 SUMMARY:');
  console.log(`   Domains analyzed: ${totalDomains}`);
  console.log(`   Total Money Keywords: ${totalMoneyKW} (Top 5 per domain)`);
  console.log(`   Total Local Keywords: ${totalLocalKW} (Top 3 per domain)`);
  console.log(`   Domains with Local Keywords: ${results.filter(r => r.localKeywords.length > 0).length}`);
}

// Export for use as module
module.exports = {
  identifyMoneyKeywords,
  hasLocalIdentifier,
  formatOutput
};
