#!/usr/bin/env node

/**
 * Test Local Keyword Detection - Verify comprehensive city database works
 */

const cityDatabase = require('./us_cities_lookup.json');

// Detection patterns
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
  
  // Exclude known false positives
  if (/\bnear\s+me\b/i.test(lowerKeyword)) {
    return { match: false, reason: 'Excluded: "near me" is nationwide search' };
  }
  
  if (STATE_FULL_NAMES.test(lowerKeyword)) return { match: true, reason: 'State name (full)' };
  if (STATE_ABBREV.test(lowerKeyword)) return { match: true, reason: 'State abbreviation' };
  if (ZIP_CODE_PATTERN.test(lowerKeyword)) return { match: true, reason: 'ZIP code' };
  if (GEOGRAPHIC_DESCRIPTOR_PATTERN.test(lowerKeyword)) return { match: true, reason: 'Geographic descriptor' };
  
  const words = extractWords(keyword);
  for (const word of words) {
    if (cityDatabase.cities[word]) {
      return { match: true, reason: `City: ${word} (${cityDatabase.cities[word].state})` };
    }
  }
  
  for (let i = 0; i < words.length - 1; i++) {
    const twoWords = `${words[i]} ${words[i + 1]}`;
    if (cityDatabase.cities[twoWords]) {
      return { match: true, reason: `Multi-word city: ${twoWords} (${cityDatabase.cities[twoWords].state})` };
    }
  }
  
  for (let i = 0; i < words.length - 2; i++) {
    const threeWords = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    if (cityDatabase.cities[threeWords]) {
      return { match: true, reason: `Multi-word city: ${threeWords} (${cityDatabase.cities[threeWords].state})` };
    }
  }
  
  return { match: false, reason: 'No location identifier found' };
}

console.log('🧪 Testing Local Keyword Detection\n');
console.log('=' .repeat(80));

const testCases = [
  // SHOULD MATCH (specific locations)
  { keyword: 'coolsculpting greensboro', expected: true },
  { keyword: 'chiropractor spokane', expected: true },
  { keyword: 'chiropractor boise', expected: true },
  { keyword: 'chiropractor tulsa', expected: true },
  { keyword: 'chiropractors carrollton tx', expected: true },
  { keyword: 'plastic surgery north carolina', expected: true },
  { keyword: 'plastic surgeon nc', expected: true },
  { keyword: 'North Shore Chiropractic', expected: true },
  { keyword: 'northfield chiropractic', expected: true },
  { keyword: 'infinity of scottsdale', expected: true },
  { keyword: 'chiropractor overland park', expected: true },
  { keyword: 'kingston chiropractor', expected: true },
  { keyword: 'chiropractor 90210', expected: true }, // ZIP code
  
  // SHOULD NOT MATCH (removed generic indicators)
  { keyword: 'chiropractor near me', expected: false },
  { keyword: 'local chiropractor', expected: false },
  { keyword: 'city chiropractor', expected: false },
  { keyword: 'chiropractor nearby', expected: false },
  
  // SHOULD NOT MATCH (no location)
  { keyword: 'smart lipo for men', expected: false },
  { keyword: 'co2 laser for face', expected: false },
  { keyword: 'breast lift procedure', expected: false },
  { keyword: 'migraine and vertigo', expected: false },
];

let passed = 0;
let failed = 0;

testCases.forEach(({ keyword, expected }) => {
  const result = hasLocalIdentifier(keyword);
  const success = result.match === expected;
  
  if (success) {
    console.log(`✅ PASS: "${keyword}"`);
    console.log(`   ${result.reason}`);
    passed++;
  } else {
    console.log(`❌ FAIL: "${keyword}"`);
    console.log(`   Expected: ${expected}, Got: ${result.match}`);
    console.log(`   ${result.reason}`);
    failed++;
  }
  console.log('');
});

console.log('=' .repeat(80));
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
  console.log('🎉 All tests passed!\n');
} else {
  console.log('⚠️  Some tests failed. Review logic.\n');
  process.exit(1);
}
