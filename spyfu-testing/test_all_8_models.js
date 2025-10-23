#!/usr/bin/env node

/**
 * Comprehensive Test: 8 Models × 3 Domain Sizes
 * 
 * Tests all models (A1-A4, B1-B3) against:
 * - Small: custompoolsbyjeff.com (~74 keywords)
 * - Medium: riverpoolsandspas.com (~1,436 keywords)
 * - Enterprise: skyscanner.com (~1.8M keywords)
 * 
 * Shows real costs and actual data samples for each combination
 */

const https = require('https');

// SpyFu API Configuration
const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const BASE_URL = 'api.spyfu.com';

// Test domains (using domains we know have data)
const TEST_DOMAINS = {
  small: { name: 'viridisenergy.com', expectedKWs: 74 },
  medium: { name: 'poolsbybradley.com', expectedKWs: 1436 },
  enterprise: { name: 'skyscanner.com', expectedKWs: 1800000 }
};

// Model configurations
const MODELS = {
  A1: {
    name: 'GROUP A1: 10¢ BASIC',
    targetCost: 0.10,
    calls: [
      { endpoint: 'getLiveSeoStats', limit: 1, description: 'Overview' },
      { endpoint: 'getMostValuableKeywords', limit: 150, description: 'Valuable keywords' },
      { endpoint: 'getLostRanksKeywords', limit: 20, description: 'Improvements' },
      { endpoint: 'getGainedRanksKeywords', limit: 20, description: 'Drops' },
      { endpoint: 'getJustFellOffKeywords', limit: 10, description: 'Fell off page 1' }
    ]
  },
  A2: {
    name: 'GROUP A2: 12¢ COMPETITOR ASSAULT',
    targetCost: 0.12,
    calls: [
      { endpoint: 'getLiveSeoStats', limit: 1, description: 'Your overview' },
      { endpoint: 'getLiveSeoStats', limit: 1, description: 'Top competitor overview', competitor: true },
      { endpoint: 'getMostValuableKeywords', limit: 150, description: 'Your valuable keywords' },
      { endpoint: 'getSeoKeywords', limit: 30, description: 'Competitor keywords', competitor: true },
      { endpoint: 'getLostRanksKeywords', limit: 20, description: 'Your improvements' },
      { endpoint: 'getGainedRanksKeywords', limit: 20, description: 'Your drops' },
      { endpoint: 'getNewlyRankedKeywords', limit: 10, description: 'Your new rankings' }
      // Note: Would add 9 individual competitor stats in real implementation
    ]
  },
  A3: {
    name: 'GROUP A3: 15¢ INTELLIGENCE',
    targetCost: 0.15,
    calls: [
      { endpoint: 'getLiveSeoStats', limit: 1, description: 'Your overview' },
      { endpoint: 'getMostValuableKeywords', limit: 150, description: 'Your valuable keywords' },
      { endpoint: 'getSeoKeywords', limit: 50, description: 'Competitor 1 keywords', competitor: true },
      { endpoint: 'getSeoKeywords', limit: 30, description: 'Competitor 2 keywords', competitor: true },
      { endpoint: 'getLostRanksKeywords', limit: 20, description: 'Your improvements' },
      { endpoint: 'getGainedRanksKeywords', limit: 20, description: 'Your drops' },
      { endpoint: 'getGainedRanksKeywords', limit: 10, description: 'Comp1 drops', competitor: true },
      { endpoint: 'getNewlyRankedKeywords', limit: 10, description: 'Your new rankings' }
      // Note: Would add 10 individual competitor stats in real implementation
    ]
  },
  A4: {
    name: 'GROUP A4: 20¢ DOMINATION',
    targetCost: 0.20,
    calls: [
      { endpoint: 'getLiveSeoStats', limit: 1, description: 'Your overview' },
      { endpoint: 'getMostValuableKeywords', limit: 150, description: 'Your valuable keywords' },
      { endpoint: 'getSeoKeywords', limit: 60, description: 'Competitor 1 keywords', competitor: true },
      { endpoint: 'getSeoKeywords', limit: 40, description: 'Competitor 2 keywords', competitor: true },
      { endpoint: 'getSeoKeywords', limit: 30, description: 'Competitor 3 keywords', competitor: true },
      { endpoint: 'getLostRanksKeywords', limit: 30, description: 'Your improvements' },
      { endpoint: 'getGainedRanksKeywords', limit: 30, description: 'Your drops' },
      { endpoint: 'getLostRanksKeywords', limit: 15, description: 'Comp1 improvements', competitor: true },
      { endpoint: 'getGainedRanksKeywords', limit: 15, description: 'Comp1 drops', competitor: true },
      { endpoint: 'getNewlyRankedKeywords', limit: 10, description: 'Your new rankings' },
      { endpoint: 'getJustFellOffKeywords', limit: 10, description: 'Your fell off page 1' }
      // Note: Would add 10 individual competitor stats in real implementation
    ]
  },
  B1: {
    name: 'GROUP B1: 12¢ MOMENTUM TRACKER',
    targetCost: 0.12,
    calls: [
      { endpoint: 'getLiveSeoStats', limit: 1, description: 'Current overview' },
      { endpoint: 'getMostValuableKeywords', limit: 150, description: 'Current state' },
      { endpoint: 'getLostRanksKeywords', limit: 30, description: 'Improvements last 30d' },
      { endpoint: 'getGainedRanksKeywords', limit: 30, description: 'Drops last 30d' },
      { endpoint: 'getNewlyRankedKeywords', limit: 20, description: 'New entries' },
      { endpoint: 'getJustFellOffKeywords', limit: 10, description: 'Fell off page 1' }
    ]
  },
  B2: {
    name: 'GROUP B2: 15¢ TREND ANALYZER',
    targetCost: 0.15,
    calls: [
      { endpoint: 'getLiveSeoStats', limit: 1, description: 'Current state' },
      { endpoint: 'getMostValuableKeywords', limit: 150, description: 'Current keywords' },
      { endpoint: 'getLostRanksKeywords', limit: 50, description: 'Improvements last 30d' },
      { endpoint: 'getGainedRanksKeywords', limit: 50, description: 'Drops last 30d' },
      { endpoint: 'getNewlyRankedKeywords', limit: 20, description: 'New entries' },
      { endpoint: 'getJustFellOffKeywords', limit: 20, description: 'Fell off page 1' },
      { endpoint: 'getSeoKeywords', limit: 10, description: 'Almost There zone #11-16' }
    ]
  },
  B3: {
    name: 'GROUP B3: 20¢ HISTORICAL BATTLEFIELD',
    targetCost: 0.20,
    calls: [
      { endpoint: 'getLiveSeoStats', limit: 1, description: 'Your current' },
      { endpoint: 'getMostValuableKeywords', limit: 150, description: 'Your keywords' },
      { endpoint: 'getSeoKeywords', limit: 60, description: 'Comp1 keywords', competitor: true },
      { endpoint: 'getLostRanksKeywords', limit: 50, description: 'Your improvements' },
      { endpoint: 'getGainedRanksKeywords', limit: 50, description: 'Your drops' },
      { endpoint: 'getLostRanksKeywords', limit: 30, description: 'Comp1 improvements', competitor: true },
      { endpoint: 'getGainedRanksKeywords', limit: 30, description: 'Comp1 drops', competitor: true },
      { endpoint: 'getNewlyRankedKeywords', limit: 20, description: 'Your new' }
      // Note: Would add 10 individual competitor stats in real implementation
    ]
  }
};

// Top competitor for each test domain
const TOP_COMPETITORS = {
  'viridisenergy.com': 'teslamotors.com',
  'poolsbybradley.com': 'premierpoolsandspas.com',
  'skyscanner.com': 'kayak.com'
};

// Helper: Make API call
function makeApiCall(endpoint, domain, limit = null) {
  return new Promise((resolve, reject) => {
    let path = `/apis/serp_api/v2/seo/${endpoint}?query=${domain}`;
    if (limit) {
      path += `&pageSize=${limit}`;
    }
    
    const options = {
      hostname: BASE_URL,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': API_KEY
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Parse error: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.end();
  });
}

// Helper: Calculate cost
function calculateCost(rows) {
  return (rows / 1000) * 0.50;
}

// Helper: Sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test a single model on a single domain
async function testModel(modelKey, modelConfig, domainInfo) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Testing ${modelConfig.name} on ${domainInfo.name}`);
  console.log(`${'='.repeat(80)}\n`);
  
  const results = {
    modelKey,
    modelName: modelConfig.name,
    domain: domainInfo.name,
    targetCost: modelConfig.targetCost,
    actualCost: 0,
    totalRows: 0,
    calls: [],
    sampleData: {},
    errors: []
  };
  
  const domain = domainInfo.name;
  const competitor = TOP_COMPETITORS[domain];
  
  for (const call of modelConfig.calls) {
    const targetDomain = call.competitor ? competitor : domain;
    const callLimit = call.limit;
    
    console.log(`  → ${call.description}: ${call.endpoint} (${targetDomain}, limit: ${callLimit || 'none'})`);
    
    try {
      const data = await makeApiCall(call.endpoint, targetDomain, callLimit);
      
      let rowCount = 0;
      if (Array.isArray(data)) {
        rowCount = data.length;
      } else if (data && typeof data === 'object') {
        // Single row response (like getLiveSeoStats)
        rowCount = 1;
      }
      
      const cost = calculateCost(rowCount);
      results.totalRows += rowCount;
      results.actualCost += cost;
      
      results.calls.push({
        endpoint: call.endpoint,
        description: call.description,
        domain: targetDomain,
        limit: callLimit,
        rowsReturned: rowCount,
        cost: cost
      });
      
      // Store sample data (first 3 items if array, or full object)
      const sampleKey = `${call.endpoint}_${call.competitor ? 'comp' : 'yours'}`;
      if (Array.isArray(data)) {
        results.sampleData[sampleKey] = data.slice(0, 3);
      } else {
        results.sampleData[sampleKey] = data;
      }
      
      console.log(`     ✓ Rows: ${rowCount}, Cost: $${cost.toFixed(4)}`);
      
      // Rate limiting
      await sleep(500);
      
    } catch (error) {
      console.log(`     ✗ Error: ${error.message}`);
      results.errors.push({
        endpoint: call.endpoint,
        description: call.description,
        error: error.message
      });
    }
  }
  
  console.log(`\n  TOTAL: ${results.totalRows} rows, $${results.actualCost.toFixed(4)} (target: $${results.targetCost})`);
  
  return results;
}

// Generate CRM fields from sample data
function generateCrmFields(results) {
  const fields = {};
  const stats = results.sampleData['getLiveSeoStats_yours'] || {};
  const keywords = results.sampleData['getMostValuableKeywords_yours'] || [];
  const improved = results.sampleData['getLostRanksKeywords_yours'] || [];
  const declined = results.sampleData['getGainedRanksKeywords_yours'] || [];
  const newRanked = results.sampleData['getNewlyRankedKeywords_yours'] || [];
  const fellOff = results.sampleData['getJustFellOffKeywords_yours'] || [];
  
  // Field 1: Domain Overview
  const totalKWs = stats.organicKeywordCount || 0;
  const clicks = stats.estimatedMonthlySeoClicks || 0;
  const value = stats.estimatedMonthlySeoClicksValue || 0;
  fields['1_Domain_Overview'] = `${totalKWs.toLocaleString()} KWs | ${clicks.toLocaleString()} clicks/mo | $${value.toLocaleString()} value`;
  
  // Field 2: Top Money Keyword
  const topMoney = keywords.find(kw => kw.rank <= 50 && kw.exactCostPerClick > 0) || keywords[0] || {};
  if (topMoney.keyword) {
    fields['2_Money_Rank'] = `${topMoney.keyword} | #${topMoney.rank} | $${(topMoney.exactCostPerClick || 0).toFixed(2)}`;
  }
  
  // Field 3: Biggest Win
  const bigWin = improved.sort((a, b) => (a.rankChange || 0) - (b.rankChange || 0))[0] || {};
  if (bigWin.keyword) {
    const oldRank = bigWin.rank - bigWin.rankChange;
    fields['3_BigWin'] = `${bigWin.keyword} | #${oldRank} → #${bigWin.rank} ↑${Math.abs(bigWin.rankChange)} spots`;
  }
  
  // Field 4: Biggest Drop
  const bigDrop = declined.sort((a, b) => (b.rankChange || 0) - (a.rankChange || 0))[0] || {};
  if (bigDrop.keyword) {
    const oldRank = bigDrop.rank - bigDrop.rankChange;
    fields['4_BigDrop'] = `${bigDrop.keyword} | #${oldRank} → #${bigDrop.rank} ↓${Math.abs(bigDrop.rankChange)} | $${(bigDrop.exactCostPerClick || 0).toFixed(2)}`;
  }
  
  // Field 5: Momentum
  const improvedCount = improved.length;
  const declinedCount = declined.length;
  const netChange = improvedCount - declinedCount;
  fields['5_Momentum'] = `${improvedCount} improving | ${declinedCount} declining | NET: ${netChange >= 0 ? '+' : ''}${netChange}`;
  
  // Field 6: New Rankings
  if (newRanked.length > 0) {
    const bestNew = newRanked.sort((a, b) => (a.rank || 100) - (b.rank || 100))[0];
    fields['6_NewRanked'] = `${newRanked.length} NEW keywords | Best: ${bestNew.keyword || 'N/A'} #${bestNew.rank || 'N/A'}`;
  }
  
  // Field 7: Fell Off Page 1
  if (fellOff.length > 0) {
    const worstFall = fellOff[0];
    fields['7_FellOff'] = `${fellOff.length} fell off P1 | Worst: ${worstFall.keyword || 'N/A'} #${worstFall.rank || 'N/A'}`;
  }
  
  return fields;
}

// Main test function
async function runAllTests() {
  console.log('\n' + '='.repeat(80));
  console.log('COMPREHENSIVE TEST: 8 MODELS × 3 DOMAIN SIZES');
  console.log('='.repeat(80));
  
  const allResults = {};
  
  // Test each domain size
  for (const [sizeKey, domainInfo] of Object.entries(TEST_DOMAINS)) {
    allResults[sizeKey] = {};
    
    console.log(`\n\n${'#'.repeat(80)}`);
    console.log(`# DOMAIN SIZE: ${sizeKey.toUpperCase()} (${domainInfo.name})`);
    console.log(`${'#'.repeat(80)}`);
    
    // Test each model
    for (const [modelKey, modelConfig] of Object.entries(MODELS)) {
      try {
        const result = await testModel(modelKey, modelConfig, domainInfo);
        result.crmFields = generateCrmFields(result);
        allResults[sizeKey][modelKey] = result;
        
        // Longer pause between models
        await sleep(2000);
      } catch (error) {
        console.error(`\n  ERROR testing ${modelKey} on ${domainInfo.name}: ${error.message}`);
        allResults[sizeKey][modelKey] = {
          error: error.message
        };
      }
    }
  }
  
  return allResults;
}

// Generate summary report
function generateSummaryReport(allResults) {
  console.log('\n\n' + '='.repeat(80));
  console.log('SUMMARY REPORT: COSTS & DATA SAMPLES');
  console.log('='.repeat(80));
  
  // Cost comparison table
  console.log('\n## COST COMPARISON TABLE\n');
  console.log('Model              | Target  | Small Domain | Medium Domain | Enterprise Domain');
  console.log('-------------------|---------|--------------|---------------|------------------');
  
  for (const modelKey of Object.keys(MODELS)) {
    const model = MODELS[modelKey];
    const small = allResults.small[modelKey];
    const medium = allResults.medium[modelKey];
    const enterprise = allResults.enterprise[modelKey];
    
    const smallCost = small?.actualCost ? `$${small.actualCost.toFixed(4)}` : 'ERROR';
    const mediumCost = medium?.actualCost ? `$${medium.actualCost.toFixed(4)}` : 'ERROR';
    const enterpriseCost = enterprise?.actualCost ? `$${enterprise.actualCost.toFixed(4)}` : 'ERROR';
    
    console.log(`${model.name.padEnd(18)} | $${model.targetCost.toFixed(2).padEnd(7)} | ${smallCost.padEnd(12)} | ${mediumCost.padEnd(13)} | ${enterpriseCost}`);
  }
  
  // Sample CRM fields for each model (medium domain)
  console.log('\n\n## SAMPLE CRM FIELDS (Medium Domain: riverpoolsandspas.com)\n');
  
  for (const modelKey of Object.keys(MODELS)) {
    const result = allResults.medium[modelKey];
    if (!result || result.error) continue;
    
    console.log(`\n### ${result.modelName}`);
    console.log(`Cost: $${result.actualCost.toFixed(4)} | Rows: ${result.totalRows}\n`);
    
    if (result.crmFields) {
      for (const [fieldKey, fieldValue] of Object.entries(result.crmFields)) {
        console.log(`${fieldKey}: ${fieldValue}`);
      }
    }
  }
}

// Run the tests
runAllTests()
  .then(allResults => {
    // Save results to file
    const fs = require('fs');
    fs.writeFileSync(
      'all_8_models_test_results.json',
      JSON.stringify(allResults, null, 2)
    );
    console.log('\n\n✓ Full results saved to: all_8_models_test_results.json');
    
    // Generate summary
    generateSummaryReport(allResults);
    
    console.log('\n\n✓ All tests completed!\n');
  })
  .catch(error => {
    console.error('\n\nFATAL ERROR:', error);
    process.exit(1);
  });
