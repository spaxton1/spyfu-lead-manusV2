#!/usr/bin/env node

/**
 * TEST: Find TRUE High-CPC Buying Keywords
 * 
 * Problem: getMostValuableKeywords returns informational keywords
 * Solution: Get all keywords and sort by CPC to find true buyer intent
 */

const https = require('https');

const API_KEY = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';
const BASE_URL = 'api.spyfu.com';

// Test with medium domain (good mix of keywords)
const TEST_DOMAIN = 'poolsbybradley.com';

/**
 * Make API call
 */
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
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('JSON parse error: ' + data.substring(0, 200)));
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

/**
 * Analyze keyword for buyer intent
 */
function analyzeBuyerIntent(keyword) {
  const kw = keyword.toLowerCase();
  
  // High buyer intent signals
  const buyerSignals = {
    commercial: ['buy', 'purchase', 'price', 'cost', 'quote', 'hire', 'contractor', 'company', 'service', 'near me', 'best', 'top', 'affordable', 'cheap'],
    local: ['near me', 'in [city]', 'local', 'nearby'],
    urgency: ['emergency', 'same day', 'urgent', 'fast', 'quick', 'now'],
    comparison: ['vs', 'versus', 'compare', 'best', 'top', 'review']
  };
  
  // Low buyer intent signals (informational)
  const informationalSignals = ['how', 'what', 'why', 'when', 'who', 'guide', 'tutorial', 'learn', 'diy', 'meaning', 'definition'];
  
  let score = 0;
  let signals = [];
  
  // Check for buyer signals
  Object.entries(buyerSignals).forEach(([category, words]) => {
    words.forEach(word => {
      if (kw.includes(word)) {
        score += 3;
        signals.push(`+${category}(${word})`);
      }
    });
  });
  
  // Check for informational signals (negative)
  informationalSignals.forEach(word => {
    if (kw.includes(word)) {
      score -= 5;
      signals.push(`-informational(${word})`);
    }
  });
  
  return {
    score: score,
    signals: signals,
    intent: score > 0 ? 'BUYER' : (score < 0 ? 'INFORMATIONAL' : 'NEUTRAL')
  };
}

/**
 * Main test
 */
async function runTest() {
  console.log('🔍 TESTING: High-CPC Buying Keywords\n');
  console.log(`Domain: ${TEST_DOMAIN}\n`);
  console.log('='.repeat(80));
  
  // Test 1: Get "Most Valuable" keywords (SpyFu's algorithm)
  console.log('\n📊 TEST 1: getMostValuableKeywords (SpyFu\'s Algorithm)');
  console.log('Hypothesis: Returns high total value, not necessarily high CPC\n');
  
  const valuable = await makeApiCall('getMostValuableKeywords', TEST_DOMAIN, 20);
  const valuableKeywords = valuable.results || [];
  
  console.log(`Returned ${valuableKeywords.length} keywords\n`);
  console.log('Top 10 "Most Valuable" Keywords:\n');
  
  valuableKeywords.slice(0, 10).forEach((kw, i) => {
    const intent = analyzeBuyerIntent(kw.keyword);
    const estimatedValue = (kw.seoClicks || 0) * (kw.exactCostPerClick || 0);
    
    console.log(`${i+1}. "${kw.keyword}"`);
    console.log(`   Rank: #${kw.rank} | CPC: $${(kw.exactCostPerClick || 0).toFixed(2)} | Volume: ${kw.searchVolume?.toLocaleString() || 'N/A'}`);
    console.log(`   Clicks: ${kw.seoClicks || 0}/mo | Est Value: $${estimatedValue.toFixed(2)}/mo`);
    console.log(`   Intent: ${intent.intent} (score: ${intent.score}) ${intent.signals.join(', ')}`);
    console.log('');
  });
  
  // Calculate stats
  const avgCPC = valuableKeywords.reduce((sum, kw) => sum + (kw.exactCostPerClick || 0), 0) / valuableKeywords.length;
  const buyerIntentCount = valuableKeywords.filter(kw => analyzeBuyerIntent(kw.keyword).intent === 'BUYER').length;
  const infoIntentCount = valuableKeywords.filter(kw => analyzeBuyerIntent(kw.keyword).intent === 'INFORMATIONAL').length;
  
  console.log('='.repeat(80));
  console.log('📈 getMostValuableKeywords Stats:');
  console.log(`   Average CPC: $${avgCPC.toFixed(2)}`);
  console.log(`   Buyer Intent: ${buyerIntentCount}/${valuableKeywords.length} (${((buyerIntentCount/valuableKeywords.length)*100).toFixed(1)}%)`);
  console.log(`   Informational: ${infoIntentCount}/${valuableKeywords.length} (${((infoIntentCount/valuableKeywords.length)*100).toFixed(1)}%)`);
  
  // Test 2: Get ALL keywords and sort by CPC ourselves
  console.log('\n\n📊 TEST 2: getSeoKeywords + Sort by CPC (Our Algorithm)');
  console.log('Hypothesis: Sorting by CPC gives us better buyer intent keywords\n');
  
  const allKeywords = await makeApiCall('getSeoKeywords', TEST_DOMAIN, 200); // Get more keywords
  const allKW = allKeywords.results || [];
  
  console.log(`Retrieved ${allKW.length} keywords\n`);
  
  // Sort by CPC descending, filter out null CPC
  const highCPC = allKW
    .filter(kw => kw.exactCostPerClick > 0)
    .sort((a, b) => b.exactCostPerClick - a.exactCostPerClick);
  
  console.log('Top 10 HIGHEST CPC Keywords:\n');
  
  highCPC.slice(0, 10).forEach((kw, i) => {
    const intent = analyzeBuyerIntent(kw.keyword);
    const estimatedValue = (kw.seoClicks || 0) * (kw.exactCostPerClick || 0);
    
    console.log(`${i+1}. "${kw.keyword}"`);
    console.log(`   Rank: #${kw.rank} | CPC: $${(kw.exactCostPerClick || 0).toFixed(2)} | Volume: ${kw.searchVolume?.toLocaleString() || 'N/A'}`);
    console.log(`   Clicks: ${kw.seoClicks || 0}/mo | Est Value: $${estimatedValue.toFixed(2)}/mo`);
    console.log(`   Intent: ${intent.intent} (score: ${intent.score}) ${intent.signals.join(', ')}`);
    console.log('');
  });
  
  // Calculate stats
  const avgCPC2 = highCPC.slice(0, 20).reduce((sum, kw) => sum + (kw.exactCostPerClick || 0), 0) / 20;
  const buyerIntentCount2 = highCPC.slice(0, 20).filter(kw => analyzeBuyerIntent(kw.keyword).intent === 'BUYER').length;
  const infoIntentCount2 = highCPC.slice(0, 20).filter(kw => analyzeBuyerIntent(kw.keyword).intent === 'INFORMATIONAL').length;
  
  console.log('='.repeat(80));
  console.log('📈 Highest CPC Keywords Stats (top 20):');
  console.log(`   Average CPC: $${avgCPC2.toFixed(2)}`);
  console.log(`   Buyer Intent: ${buyerIntentCount2}/20 (${((buyerIntentCount2/20)*100).toFixed(1)}%)`);
  console.log(`   Informational: ${infoIntentCount2}/20 (${((infoIntentCount2/20)*100).toFixed(1)}%)`);
  
  // Test 3: Filter by BOTH high CPC AND buyer intent
  console.log('\n\n📊 TEST 3: High CPC + Buyer Intent Filter (OPTIMAL)');
  console.log('Hypothesis: Best results come from high CPC + buyer intent signals\n');
  
  const optimalKeywords = highCPC
    .map(kw => ({
      ...kw,
      intent: analyzeBuyerIntent(kw.keyword)
    }))
    .filter(kw => kw.exactCostPerClick >= 2.00) // Min $2 CPC
    .filter(kw => kw.intent.intent === 'BUYER' || kw.intent.intent === 'NEUTRAL') // Exclude informational
    .slice(0, 20);
  
  console.log(`Found ${optimalKeywords.length} optimal keywords (CPC ≥ $2.00 + buyer intent)\n`);
  console.log('Top 10 OPTIMAL Buying Keywords:\n');
  
  optimalKeywords.slice(0, 10).forEach((kw, i) => {
    const estimatedValue = (kw.seoClicks || 0) * (kw.exactCostPerClick || 0);
    
    console.log(`${i+1}. "${kw.keyword}"`);
    console.log(`   Rank: #${kw.rank} | CPC: $${(kw.exactCostPerClick || 0).toFixed(2)} | Volume: ${kw.searchVolume?.toLocaleString() || 'N/A'}`);
    console.log(`   Clicks: ${kw.seoClicks || 0}/mo | Est Value: $${estimatedValue.toFixed(2)}/mo`);
    console.log(`   Intent: ${kw.intent.intent} (score: ${kw.intent.score}) ${kw.intent.signals.join(', ')}`);
    console.log('');
  });
  
  // Calculate stats
  const avgCPC3 = optimalKeywords.reduce((sum, kw) => sum + (kw.exactCostPerClick || 0), 0) / optimalKeywords.length;
  const buyerIntentCount3 = optimalKeywords.filter(kw => kw.intent.intent === 'BUYER').length;
  
  console.log('='.repeat(80));
  console.log('📈 Optimal Keywords Stats:');
  console.log(`   Average CPC: $${avgCPC3.toFixed(2)}`);
  console.log(`   Buyer Intent: ${buyerIntentCount3}/${optimalKeywords.length} (${((buyerIntentCount3/optimalKeywords.length)*100).toFixed(1)}%)`);
  console.log(`   Min CPC: $2.00`);
  
  // COMPARISON
  console.log('\n\n' + '='.repeat(80));
  console.log('🎯 FINAL COMPARISON\n');
  
  console.log('| Method | Avg CPC | Buyer Intent % | Best For |');
  console.log('|--------|---------|----------------|----------|');
  console.log(`| getMostValuableKeywords | $${avgCPC.toFixed(2)} | ${((buyerIntentCount/valuableKeywords.length)*100).toFixed(1)}% | Total traffic value |`);
  console.log(`| Sort by CPC | $${avgCPC2.toFixed(2)} | ${((buyerIntentCount2/20)*100).toFixed(1)}% | High buyer intent |`);
  console.log(`| CPC + Intent Filter | $${avgCPC3.toFixed(2)} | ${((buyerIntentCount3/optimalKeywords.length)*100).toFixed(1)}% | **COLD CALLING** |`);
  
  console.log('\n✅ RECOMMENDATION: Use getSeoKeywords + filter by CPC ≥ $2.00 + buyer intent');
  console.log('   This gives you true BUYING keywords, not informational content.\n');
  
  // Cost analysis
  console.log('='.repeat(80));
  console.log('💰 COST ANALYSIS\n');
  
  const cost1 = (20 / 1000) * 0.50;
  const cost2 = (200 / 1000) * 0.50;
  
  console.log(`getMostValuableKeywords (20 rows): $${cost1.toFixed(4)}`);
  console.log(`getSeoKeywords (200 rows) + filter: $${cost2.toFixed(4)}`);
  console.log(`\nExtra cost for better data: $${(cost2 - cost1).toFixed(4)} per lead`);
  console.log(`\n✅ Worth it? YES - Better keywords = higher close rates`);
  
  // Save results
  const fs = require('fs');
  fs.writeFileSync('high_cpc_keywords_test.json', JSON.stringify({
    mostValuable: valuableKeywords.slice(0, 10),
    highestCPC: highCPC.slice(0, 10),
    optimal: optimalKeywords.slice(0, 10),
    stats: {
      mostValuable: { avgCPC, buyerIntentPct: (buyerIntentCount/valuableKeywords.length)*100 },
      highestCPC: { avgCPC: avgCPC2, buyerIntentPct: (buyerIntentCount2/20)*100 },
      optimal: { avgCPC: avgCPC3, buyerIntentPct: (buyerIntentCount3/optimalKeywords.length)*100 }
    }
  }, null, 2));
  
  console.log('\n💾 Results saved to: high_cpc_keywords_test.json');
}

// Run test
runTest().catch(console.error);
