const fs = require('fs');

// CONFIGURATION: Switch between V1 and V2
const USE_V2 = process.argv.includes('--v2'); // Use --v2 flag to run with V2 data

// Load the low hanging fruit data
const dataFile = USE_V2 ? './low_hanging_fruit_keywords_v2.json' : './low_hanging_fruit_keywords.json';
const data = require(dataFile);
const version = USE_V2 ? 'V2 (Rank 11-75)' : 'V1 (Rank 11-50)';

// Load comprehensive US cities database (29,880 cities)
const cityDatabase = require('./us_cities_lookup.json');
console.log(`📚 Loaded ${cityDatabase.metadata.totalCities.toLocaleString()} US cities from database\n`);

// Location detection patterns (UPDATED - removed generic "near me", "local", "city" indicators)
// Note: State abbreviations must be standalone words (not part of phrases like "near me")
const STATE_FULL_NAMES = /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/i;

// State abbreviations - only match when NOT part of "near me" or common phrases
const STATE_ABBREV = /\b(al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy)\b/i;

const GEOGRAPHIC_DESCRIPTOR_PATTERN = /\b(north|south|east|west|central|downtown|uptown)\s+(shore|side|end|coast)\b/i;

const ZIP_CODE_PATTERN = /\b\d{5}(?:-\d{4})?\b/; // Matches 12345 or 12345-6789

/**
 * Extract individual words from keyword (handles multi-word phrases)
 */
function extractWords(keyword) {
  return keyword.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Remove special chars
    .split(/\s+/)
    .filter(word => word.length > 2); // Ignore 1-2 char words
}

/**
 * Check if a keyword contains a local identifier
 * Now uses comprehensive 29,880 city database instead of hardcoded list
 */
function hasLocalIdentifier(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  
  // Exclude known false positives (nationwide searches)
  if (/\bnear\s+me\b/i.test(lowerKeyword)) {
    return false;
  }
  
  // 1. Check for US State names (full names always valid)
  if (STATE_FULL_NAMES.test(lowerKeyword)) {
    return true;
  }
  
  // 2. Check for state abbreviations (but exclude "ME" in "near me")
  if (STATE_ABBREV.test(lowerKeyword)) {
    return true;
  }
  
  // 3. Check for ZIP codes
  if (ZIP_CODE_PATTERN.test(lowerKeyword)) {
    return true;
  }
  
  // 4. Check for geographic descriptors (e.g., "north shore", "east side")
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
  
  // 6. Check for multi-word city names (e.g., "new york", "san diego")
  // Try consecutive word pairs
  for (let i = 0; i < words.length - 1; i++) {
    const twoWords = `${words[i]} ${words[i + 1]}`;
    if (cityDatabase.cities[twoWords]) {
      return true;
    }
  }
  
  // Try three-word combinations (e.g., "salt lake city")
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
 */
function identifyMoneyKeywords(domainData, topN = 5) {
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
  const moneyKeywords = sortedByValue.slice(0, topN).map(kw => ({
    keyword: kw.keyword,
    cpc: kw.exactCostPerClick || 0,
    volume: kw.searchVolume || 0,
    rank: kw.rank,
    url: kw.topRankedUrl
  }));
  
  // Filter for keywords with local identifiers, sort by CPC, get top N
  const localSorted = sortedByValue
    .filter(kw => hasLocalIdentifier(kw.keyword))
    .slice(0, topN);
  
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
  output += `                            Data Source: ${version}\n`;
  output += '═══════════════════════════════════════════════════════════════════════════════\n';
  output += 'Algorithm: 1) Highest CPC First | 2) Apply Local Identifier Check\n';
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
    output += '💰 TOP MONEY KEYWORDS (Highest CPC):\n';
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
    output += '📍 TOP LOCAL KEYWORDS (Highest CPC + Location Identifier):\n';
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

// Main execution
console.log(`Processing domains using ${version}...\n`);

const results = data.map(domainData => identifyMoneyKeywords(domainData, 5));

// Display results
console.log(formatOutput(results));

// Save to JSON file
const outputFile = USE_V2 ? './money_keywords_report_v2.json' : './money_keywords_report.json';
const outputData = {
  generatedAt: new Date().toISOString(),
  dataSource: version,
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
console.log(`   Total Money Keywords: ${totalMoneyKW}`);
console.log(`   Total Local Keywords: ${totalLocalKW}`);
console.log(`   Domains with Local Keywords: ${results.filter(r => r.localKeywords.length > 0).length}`);
