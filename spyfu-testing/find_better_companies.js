#!/usr/bin/env node

const https = require('https');
const API_KEY = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';

// Different size roofing companies
const testDomains = [
  // Small local companies
  'orlandoroofingcompany.com',
  'stormguardroofing.com',
  'floridaproroofing.com',
  
  // Medium regional
  'beyondexteriors.com',
  'roofsimple.com',
  
  // Large national
  'roofingcontractorsorlando.com'
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

async function findCompanies() {
  console.log('🔍 Testing Roofing Companies...\n');
  
  const results = [];
  
  for (const domain of testDomains) {
    try {
      console.log(`Testing ${domain}...`);
      const stats = await getLiveStats(domain);
      
      const totalKw = stats.totalOrganicResults || 0;
      const clicks = stats.monthlyOrganicClicks || 0;
      const value = stats.monthlyOrganicClickValue || 0;
      
      if (totalKw > 0) {
        results.push({
          domain,
          totalKw,
          clicks,
          value,
          size: totalKw < 1000 ? 'SMALL' : totalKw < 4000 ? 'MEDIUM' : 'LARGE'
        });
        
        console.log(`  ✓ ${totalKw.toLocaleString()} keywords | ${clicks} clicks | $${value.toFixed(0)} value\n`);
      } else {
        console.log(`  ✗ No data\n`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}\n`);
    }
  }
  
  results.sort((a, b) => a.totalKw - b.totalKw);
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 BEST OPTIONS:\n');
  
  // Pick small, medium, large
  const small = results.find(r => r.size === 'SMALL') || results[0];
  const medium = results.find(r => r.size === 'MEDIUM') || results[Math.floor(results.length / 2)];
  const large = results.find(r => r.size === 'LARGE') || results[results.length - 1];
  
  console.log(`SMALL:  ${small.domain}`);
  console.log(`        ${small.totalKw.toLocaleString()} KWs | ${small.clicks} clicks | $${small.value.toFixed(0)}\n`);
  
  console.log(`MEDIUM: ${medium.domain}`);
  console.log(`        ${medium.totalKw.toLocaleString()} KWs | ${medium.clicks} clicks | $${medium.value.toFixed(0)}\n`);
  
  console.log(`LARGE:  ${large.domain}`);
  console.log(`        ${large.totalKw.toLocaleString()} KWs | ${large.clicks} clicks | $${large.value.toFixed(0)}\n`);
  
  const fs = require('fs');
  fs.writeFileSync('final_test_companies.json', JSON.stringify({
    small, medium, large
  }, null, 2));
  
  console.log('✅ Saved to final_test_companies.json');
}

findCompanies().catch(console.error);
