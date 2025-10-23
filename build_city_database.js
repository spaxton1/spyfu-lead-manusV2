#!/usr/bin/env node

/**
 * Build City Database - Converts CSV to optimized JSON lookup structure
 * 
 * Input: us_cities.csv (29,880 cities)
 * Output: us_cities_lookup.json (optimized for fast keyword matching)
 * 
 * Structure:
 * {
 *   "cities": {
 *     "adak": { "state": "AK", "stateName": "Alaska", "county": "Aleutians West" },
 *     "akiachak": { "state": "AK", "stateName": "Alaska", "county": "Bethel" },
 *     ...
 *   },
 *   "metadata": {
 *     "totalCities": 29880,
 *     "buildDate": "2025-10-23T08:00:00.000Z",
 *     "source": "https://github.com/kelvins/US-Cities-Database"
 *   }
 * }
 */

const fs = require('fs');

console.log('🏗️  Building US Cities Lookup Database...\n');

// Read CSV file
const csvContent = fs.readFileSync('us_cities.csv', 'utf-8');
const lines = csvContent.split('\n');

// Skip header row
const header = lines[0];
console.log(`📄 Header: ${header.trim()}`);

// Build lookup object
const cityLookup = {
  cities: {},
  metadata: {
    totalCities: 0,
    buildDate: new Date().toISOString(),
    source: 'https://github.com/kelvins/US-Cities-Database',
    note: 'City names normalized to lowercase for case-insensitive matching'
  }
};

let processedCount = 0;
let skippedCount = 0;

// Process each city
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) {
    skippedCount++;
    continue;
  }

  // Parse CSV line (handle quoted fields with commas)
  const matches = line.match(/(?:^|,)(?:"([^"]*)"|([^",]*))/g);
  if (!matches || matches.length < 7) {
    skippedCount++;
    continue;
  }

  // Clean up matched values
  const fields = matches.map(m => m.replace(/^,?"?|"?$/g, ''));
  
  const [id, stateCode, stateName, city, county, lat, lng] = fields;

  if (!city || !stateCode) {
    skippedCount++;
    continue;
  }

  // Normalize city name (lowercase for matching)
  const cityKey = city.toLowerCase();

  // Store city data
  cityLookup.cities[cityKey] = {
    state: stateCode,
    stateName: stateName,
    county: county
  };

  processedCount++;
}

cityLookup.metadata.totalCities = processedCount;

// Write JSON file
fs.writeFileSync('us_cities_lookup.json', JSON.stringify(cityLookup, null, 2));

console.log(`\n✅ City Database Built Successfully!`);
console.log(`   📊 Total Cities: ${processedCount.toLocaleString()}`);
console.log(`   ⏭️  Skipped Lines: ${skippedCount}`);
console.log(`   💾 Output: us_cities_lookup.json`);

// Calculate file size
const stats = fs.statSync('us_cities_lookup.json');
const sizeKB = (stats.size / 1024).toFixed(2);
console.log(`   📦 File Size: ${sizeKB} KB\n`);

// Show sample entries
console.log('📋 Sample Entries:');
const sampleCities = ['greensboro', 'spokane', 'boise', 'tulsa', 'carrollton'];
sampleCities.forEach(city => {
  if (cityLookup.cities[city]) {
    const data = cityLookup.cities[city];
    console.log(`   ${city.padEnd(15)} → ${data.state} | ${data.stateName} | ${data.county}`);
  }
});
