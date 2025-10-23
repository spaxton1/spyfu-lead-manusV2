#!/usr/bin/env node

/**
 * Find 3 Orlando Roofing Companies: Small, Medium, Large
 * Test their SEO footprint to categorize size
 */

const https = require('https');

const API_KEY = 'MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';

// Candidate Orlando roofing companies
const candidates = [
  'orlandoroofing.com',
  'tadlockroofing.com',
  'hartroofing.com',
  'baileyroofing.com',
  'ericroofing.com',
  'orangeroofing.com',
  'advancedroofingincfl.com',
  'roofingcontractororlando.com',
  'bestroofingcompanyorlando.com'
];

function getLiveStats(domain) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.spyfu.com',
      path: `/apis/serp_api/v2/seo/getLiveSeoStats?query=${domain}`,
      method: 'GET',
      headers: { 'Authorization': `Basic ${API_KEY}` }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            domain: domain,
            totalKeywords: parsed.totalOrganicResults || 0,
            monthlyClicks: parsed.monthlyOrganicClicks || 0,
            monthlyValue: parsed.monthlyOrganicClickValue || 0
          });
        } catch (e) {
          resolve({ domain: domain, totalKeywords: 0, monthlyClicks: 0, monthlyValue: 0 });
        }
      });
    });
    
    req.on('error', (e) => resolve({ domain: domain, totalKeywords: 0, monthlyClicks: 0, monthlyValue: 0 }));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ domain: domain, totalKeywords: 0, monthlyClicks: 0, monthlyValue: 0 });
    });
    req.end();
  });
}

async function main() {
  console.log('🔍 Testing Orlando Roofing Companies...\n');
  
  const results = [];
  for (const domain of candidates) {
    const stats = await getLiveStats(domain);
    results.push(stats);
    console.log(`${domain}: ${stats.totalKeywords} keywords | ${stats.monthlyClicks} clicks | $${stats.monthlyValue.toFixed(0)}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
  }
  
  // Sort by keyword count
  results.sort((a, b) => b.totalKeywords - a.totalKeywords);
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 CATEGORIZED RESULTS\n');
  
  // Find small (50-200), medium (200-1000), large (1000+)
  const large = results.find(r => r.totalKeywords >= 800) || results[0];
  const medium = results.find(r => r.totalKeywords >= 200 && r.totalKeywords < 800) || results[1];
  const small = results.find(r => r.totalKeywords > 0 && r.totalKeywords < 200) || results[results.length - 1];
  
  console.log(`🏢 LARGE:  ${large.domain}`);
  console.log(`   Keywords: ${large.totalKeywords} | Clicks: ${large.monthlyClicks}/mo | Value: $${large.monthlyValue.toFixed(2)}\n`);
  
  console.log(`🏪 MEDIUM: ${medium.domain}`);
  console.log(`   Keywords: ${medium.totalKeywords} | Clicks: ${medium.monthlyClicks}/mo | Value: $${medium.monthlyValue.toFixed(2)}\n`);
  
  console.log(`🏠 SMALL:  ${small.domain}`);
  console.log(`   Keywords: ${small.totalKeywords} | Clicks: ${small.monthlyClicks}/mo | Value: $${small.monthlyValue.toFixed(2)}\n`);
  
  console.log('✅ These will be our test subjects!\n');
}

main();
