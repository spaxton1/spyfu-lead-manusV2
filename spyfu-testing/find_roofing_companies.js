#!/usr/bin/env node

/**
 * Find Real Orlando Roofing Companies for Testing
 * We'll test with companies of different sizes
 */

const https = require('https');

const API_KEY = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';

// Test domains (real Orlando roofing companies)
const testDomains = [
  'roofsimple.com',           // Small local company
  'beyondexteriors.com',      // Medium company
  'tadlocktamparoof.com'      // Larger regional company
];

function getLiveStats(domain) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.spyfu.com',
      path: `/apis/serp_api/v2/seo/getLiveSeoStats?query=${domain}`,
      method: 'GET',
      headers: { 'Authorization': API_KEY }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

async function findBestCompanies() {
  console.log('🔍 Testing Orlando Roofing Companies...\n');
  
  const results = [];
  
  for (const domain of testDomains) {
    try {
      console.log(`Testing ${domain}...`);
      const stats = await getLiveStats(domain);
      
      const totalKw = stats.totalOrganicResults || 0;
      const clicks = stats.monthlyOrganicClicks || 0;
      const value = stats.monthlyOrganicClickValue || 0;
      
      results.push({
        domain,
        totalKw,
        clicks,
        value,
        size: totalKw < 500 ? 'SMALL' : totalKw < 2000 ? 'MEDIUM' : 'LARGE'
      });
      
      console.log(`  ✓ ${totalKw.toLocaleString()} keywords | ${clicks} clicks | $${value.toFixed(0)} value\n`);
      
      // Wait 1 second between calls
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}\n`);
    }
  }
  
  // Sort by keyword count
  results.sort((a, b) => a.totalKw - b.totalKw);
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTS:\n');
  
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.size} - ${r.domain}`);
    console.log(`   Keywords: ${r.totalKw.toLocaleString()} | Clicks: ${r.clicks} | Value: $${r.value.toFixed(0)}\n`);
  });
  
  // Save results
  const fs = require('fs');
  fs.writeFileSync('orlando_roofing_companies.json', JSON.stringify(results, null, 2));
  console.log('✅ Saved to orlando_roofing_companies.json');
}

findBestCompanies().catch(console.error);
