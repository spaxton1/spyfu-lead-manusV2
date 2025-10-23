#!/usr/bin/env node

/**
 * Pull REAL DATA for ALL 7 packages across 3 domain sizes
 * This will generate complete CRM dashboards with actual SpyFu data
 */

const https = require('https');
const fs = require('fs');

const API_KEY = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';
const BASE_URL = 'api.spyfu.com';

// Test domains
const domains = {
  small: 'poolsbybradley.com',
  medium: 'beyondexteriors.com',
  large: 'roofsimple.com'
};

// Competitor domains
const competitors = {
  small: 'riverpoolsandspas.com',
  medium: 'tadlocktamparoof.com',
  large: 'roofclaim.com'
};

let apiCallCount = 0;
let totalCost = 0;

function makeApiCall(endpoint, domain, pageSize = null) {
  return new Promise((resolve, reject) => {
    let path = `/apis/serp_api/v2/seo/${endpoint}?query=${domain}`;
    if (pageSize) {
      path += `&pageSize=${pageSize}`;
    }
    
    const options = {
      hostname: BASE_URL,
      path: path,
      method: 'GET',
      headers: { 'Authorization': API_KEY }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const rows = parsed.resultCount || (parsed.results ? parsed.results.length : 0);
          const cost = (rows / 1000) * 0.50;
          
          apiCallCount++;
          totalCost += cost;
          
          console.log(`  ✓ ${endpoint} (${rows} rows, $${cost.toFixed(4)})`);
          resolve(parsed);
        } catch (err) {
          reject(new Error('JSON parse error'));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(45000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

async function pull10centOpportunity(domain) {
  console.log(`\n📦 10¢ OPPORTUNITY HUNTER: ${domain}`);
  const startCost = totalCost;
  
  try {
    const stats = await makeApiCall('getLiveSeoStats', domain);
    await new Promise(r => setTimeout(r, 500));
    
    const keywords = await makeApiCall('getSeoKeywords', domain, 200);
    await new Promise(r => setTimeout(r, 500));
    
    const packageCost = totalCost - startCost;
    console.log(`  💰 Package cost: $${packageCost.toFixed(4)}`);
    
    return { stats, keywords: keywords.results || [], cost: packageCost };
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
    return null;
  }
}

async function pull11centHistory(domain) {
  console.log(`\n📦 11¢ HISTORY TRACKER: ${domain}`);
  const startCost = totalCost;
  
  try {
    const stats = await makeApiCall('getLiveSeoStats', domain);
    await new Promise(r => setTimeout(r, 500));
    
    const keywords = await makeApiCall('getSeoKeywords', domain, 200);
    await new Promise(r => setTimeout(r, 500));
    
    const drops = await makeApiCall('getGainedRanksKeywords', domain, 10);
    await new Promise(r => setTimeout(r, 500));
    
    const fellOff = await makeApiCall('getJustFellOffKeywords', domain, 10);
    await new Promise(r => setTimeout(r, 500));
    
    const packageCost = totalCost - startCost;
    console.log(`  💰 Package cost: $${packageCost.toFixed(4)}`);
    
    return {
      stats,
      keywords: keywords.results || [],
      drops: drops.results || [],
      fellOff: fellOff.results || [],
      cost: packageCost
    };
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
    return null;
  }
}

async function pull12centCombo(domain) {
  console.log(`\n📦 12¢ OPPORTUNITY + HISTORY: ${domain}`);
  const startCost = totalCost;
  
  try {
    const stats = await makeApiCall('getLiveSeoStats', domain);
    await new Promise(r => setTimeout(r, 500));
    
    const keywords = await makeApiCall('getSeoKeywords', domain, 200);
    await new Promise(r => setTimeout(r, 500));
    
    const improvements = await makeApiCall('getLostRanksKeywords', domain, 20);
    await new Promise(r => setTimeout(r, 500));
    
    const drops = await makeApiCall('getGainedRanksKeywords', domain, 10);
    await new Promise(r => setTimeout(r, 500));
    
    const fellOff = await makeApiCall('getJustFellOffKeywords', domain, 10);
    await new Promise(r => setTimeout(r, 500));
    
    const packageCost = totalCost - startCost;
    console.log(`  💰 Package cost: $${packageCost.toFixed(4)}`);
    
    return {
      stats,
      keywords: keywords.results || [],
      improvements: improvements.results || [],
      drops: drops.results || [],
      fellOff: fellOff.results || [],
      cost: packageCost
    };
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
    return null;
  }
}

async function pull15centCompetitor(domain, competitor) {
  console.log(`\n📦 15¢ COMPETITOR ASSAULT: ${domain} vs ${competitor}`);
  const startCost = totalCost;
  
  try {
    const yourStats = await makeApiCall('getLiveSeoStats', domain);
    await new Promise(r => setTimeout(r, 500));
    
    const compStats = await makeApiCall('getLiveSeoStats', competitor);
    await new Promise(r => setTimeout(r, 500));
    
    const yourKeywords = await makeApiCall('getSeoKeywords', domain, 200);
    await new Promise(r => setTimeout(r, 500));
    
    const compKeywords = await makeApiCall('getSeoKeywords', competitor, 50);
    await new Promise(r => setTimeout(r, 500));
    
    const yourImprovements = await makeApiCall('getLostRanksKeywords', domain, 30);
    await new Promise(r => setTimeout(r, 500));
    
    const compDrops = await makeApiCall('getGainedRanksKeywords', competitor, 10);
    await new Promise(r => setTimeout(r, 500));
    
    const packageCost = totalCost - startCost;
    console.log(`  💰 Package cost: $${packageCost.toFixed(4)}`);
    
    return {
      yourStats,
      compStats,
      yourKeywords: yourKeywords.results || [],
      compKeywords: compKeywords.results || [],
      yourImprovements: yourImprovements.results || [],
      compDrops: compDrops.results || [],
      cost: packageCost
    };
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
    return null;
  }
}

async function pullAllData() {
  console.log('=' .repeat(80));
  console.log('🎯 PULLING REAL DATA FOR ALL PACKAGES');
  console.log('=' .repeat(80));
  
  const results = {
    small: {},
    medium: {},
    large: {}
  };
  
  for (const [size, domain] of Object.entries(domains)) {
    console.log(`\n\n${'='.repeat(80)}`);
    console.log(`📊 ${size.toUpperCase()}: ${domain}`);
    console.log('='.repeat(80));
    
    // Pull data for each package
    results[size]['10cent_opportunity'] = await pull10centOpportunity(domain);
    await new Promise(r => setTimeout(r, 1000));
    
    results[size]['11cent_history'] = await pull11centHistory(domain);
    await new Promise(r => setTimeout(r, 1000));
    
    results[size]['12cent_combo'] = await pull12centCombo(domain);
    await new Promise(r => setTimeout(r, 1000));
    
    results[size]['15cent_competitor'] = await pull15centCompetitor(domain, competitors[size]);
    await new Promise(r => setTimeout(r, 1000));
    
    console.log(`\n✅ ${size.toUpperCase()} complete: ${Object.keys(results[size]).length} packages`);
  }
  
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total API calls: ${apiCallCount}`);
  console.log(`Total cost: $${totalCost.toFixed(4)}`);
  console.log(`Cost per domain: $${(totalCost / 3).toFixed(4)}`);
  
  // Save results
  fs.writeFileSync('complete_package_data.json', JSON.stringify(results, null, 2));
  console.log(`\n✅ Saved to complete_package_data.json`);
  
  return results;
}

pullAllData().catch(console.error);
