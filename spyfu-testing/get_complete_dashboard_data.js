#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const API_KEY = 'MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';
const HIGH_CPC_THRESHOLD = 2.00;

const companies = [
  { size: 'SMALL', domain: 'orangeroofing.com', competitor: 'tadlockroofing.com' },
  { size: 'MEDIUM', domain: 'baileyroofing.com', competitor: 'schickroofing.com' },
  { size: 'LARGE', domain: 'tadlockroofing.com', competitor: 'schickroofing.com' }
];

function apiCall(endpoint, domain, pageSize = null) {
  return new Promise((resolve) => {
    let path = `/apis/serp_api/v2/seo/${endpoint}?query=${domain}`;
    if (pageSize) path += `&pageSize=${pageSize}`;
    
    const options = {
      hostname: 'api.spyfu.com',
      path: path,
      method: 'GET',
      headers: { 'Authorization': `Basic ${API_KEY}` }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({});
        }
      });
    });
    
    req.on('error', () => resolve({}));
    req.setTimeout(30000, () => {
      req.destroy();
      resolve({});
    });
    req.end();
  });
}

async function enrichCompany(company) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📊 ENRICHING: ${company.domain.toUpperCase()} (${company.size})`);
  console.log('='.repeat(80));
  
  const data = {};
  
  // Core calls for all packages
  console.log('  → getLiveSeoStats...');
  data.stats = await apiCall('getLiveSeoStats', company.domain);
  await new Promise(r => setTimeout(r, 500));
  
  console.log('  → getSeoKeywords (200 rows)...');
  data.allKeywords = await apiCall('getSeoKeywords', company.domain, 200);
  await new Promise(r => setTimeout(r, 500));
  
  console.log('  → getLostRanksKeywords (50 rows)...');
  data.improvements = await apiCall('getLostRanksKeywords', company.domain, 50);
  await new Promise(r => setTimeout(r, 500));
  
  console.log('  → getGainedRanksKeywords (50 rows)...');
  data.declines = await apiCall('getGainedRanksKeywords', company.domain, 50);
  await new Promise(r => setTimeout(r, 500));
  
  console.log('  → getJustFellOffKeywords (10 rows)...');
  data.fellOff = await apiCall('getJustFellOffKeywords', company.domain, 10);
  await new Promise(r => setTimeout(r, 500));
  
  console.log('  → getNewlyRankedKeywords (10 rows)...');
  data.newlyRanked = await apiCall('getNewlyRankedKeywords', company.domain, 10);
  await new Promise(r => setTimeout(r, 500));
  
  // Competitor data
  console.log(`  → Competitor: ${company.competitor}...`);
  data.compStats = await apiCall('getLiveSeoStats', company.competitor);
  await new Promise(r => setTimeout(r, 500));
  
  console.log('  → Competitor keywords (50 rows)...');
  data.compKeywords = await apiCall('getSeoKeywords', company.competitor, 50);
  await new Promise(r => setTimeout(r, 500));
  
  console.log('  → Competitor drops (10 rows)...');
  data.compDrops = await apiCall('getGainedRanksKeywords', company.competitor, 10);
  await new Promise(r => setTimeout(r, 500));
  
  console.log('✅ Data collection complete!\n');
  
  return data;
}

async function main() {
  console.log('🎯 COLLECTING REAL DASHBOARD DATA FOR 3 ORLANDO ROOFERS');
  console.log('   This will take ~2 minutes...\n');
  
  const results = {};
  
  for (const company of companies) {
    results[company.size] = {
      domain: company.domain,
      competitor: company.competitor,
      data: await enrichCompany(company)
    };
  }
  
  // Save to file
  fs.writeFileSync('real_dashboard_data.json', JSON.stringify(results, null, 2));
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ ALL DATA COLLECTED!');
  console.log('='.repeat(80));
  console.log('\nSummary:');
  console.log(`  🏠 SMALL:  ${companies[0].domain} - ${results.SMALL.data.stats.totalOrganicResults || 0} KWs`);
  console.log(`  🏪 MEDIUM: ${companies[1].domain} - ${results.MEDIUM.data.stats.totalOrganicResults || 0} KWs`);
  console.log(`  🏢 LARGE:  ${companies[2].domain} - ${results.LARGE.data.stats.totalOrganicResults || 0} KWs`);
  console.log('\n📁 Saved to: real_dashboard_data.json');
  console.log('🎨 Now generating visual dashboards...\n');
}

main();
