#!/usr/bin/env node

/**
 * EXPORT COMPETITORS TO CSV
 * Creates clean CSV files for each domain
 */

const fs = require('fs');

// Load competitor analysis results
const results = require('./competitor_analysis_results.json');

// CSV header
const csvHeader = 'Domain,Competitor Domain,Keywords,Traffic Value ($),Monthly Clicks,Authority,Avg Rank,Search Month/Year\n';

// Create master CSV with all competitors
let masterCsv = 'Domain,Best Keyword,Keyword CPC,Keyword Volume,Keyword Rank,Competitor Domain,Keywords,Traffic Value ($),Monthly Clicks,Authority,Avg Rank\n';

// Process each domain
for (const domainData of results.results) {
  const domain = domainData.domain;
  const kw = domainData.bestKeyword;
  
  // Create individual CSV for this domain
  let domainCsv = csvHeader;
  
  for (const comp of domainData.competitors) {
    const row = `${domain},${comp.domain},${comp.keywords},${comp.value.toFixed(2)},${comp.clicks.toFixed(0)},${comp.authority},${comp.avgRank.toFixed(1)},${comp.searchMonth}/${comp.searchYear}\n`;
    domainCsv += row;
    
    // Add to master CSV
    const masterRow = `${domain},"${kw.keyword}",${kw.cpc},${kw.volume},${kw.rank},${comp.domain},${comp.keywords},${comp.value.toFixed(2)},${comp.clicks.toFixed(0)},${comp.authority},${comp.avgRank.toFixed(1)}\n`;
    masterCsv += masterRow;
  }
  
  // Save individual domain CSV
  const filename = `./competitor_data_${domain.replace(/\./g, '_')}.csv`;
  fs.writeFileSync(filename, domainCsv);
  console.log(`✅ Created: ${filename}`);
}

// Save master CSV
fs.writeFileSync('./competitor_data_all_domains.csv', masterCsv);
console.log(`✅ Created: competitor_data_all_domains.csv (master file with all competitors)`);

console.log();
console.log('📊 CSV Export Complete!');
console.log(`   Individual files: 6 domains`);
console.log(`   Master file: All 51 competitors`);
