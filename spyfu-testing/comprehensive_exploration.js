#!/usr/bin/env node

/**
 * COMPREHENSIVE SPYFU API EXPLORATION
 * Testing EVERY possible endpoint and parameter combination
 * Goal: Find ALL available data nuggets for cold calling within budget
 */

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";

const TEST_DOMAINS = {
  small: "viridisenergy.com",
  medium: "poolsbybradley.com",
  large: "newerasolarenergy.com"
};

// Comprehensive list of endpoints to test based on SpyFu documentation
const ENDPOINTS_TO_TEST = [
  // Domain Stats API
  { category: "Domain Stats", name: "getLiveSeoStats", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getLiveSeoStats" },
  { category: "Domain Stats", name: "getAllDomainStats", url: "https://api.spyfu.com/apis/domain_stats_api/v2/getAllDomainStats" },
  
  // SEO Research API - Organic SERP
  { category: "SEO Keywords", name: "getSeoKeywords", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getSeoKeywords" },
  { category: "SEO Keywords", name: "getMostValuableKeywords", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getMostValuableKeywords" },
  { category: "SEO Keywords", name: "getMostRecentKeywords", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getMostRecentKeywords" },
  
  // Ranking Changes
  { category: "Ranking Changes", name: "getNewlyRankedKeywords", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getNewlyRankedKeywords" },
  { category: "Ranking Changes", name: "getGainedRanksKeywords", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getGainedRanksKeywords" },
  { category: "Ranking Changes", name: "getLostRanksKeywords", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getLostRanksKeywords" },
  { category: "Ranking Changes", name: "getGainedClicksKeywords", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getGainedClicksKeywords" },
  { category: "Ranking Changes", name: "getLostClicksKeywords", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getLostClicksKeywords" },
  { category: "Ranking Changes", name: "getJustFellOffKeywords", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getJustFellOffKeywords" },
  { category: "Ranking Changes", name: "getRemovedKeywords", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getRemovedKeywords" },
  
  // Competitors
  { category: "Competitors", name: "getTopSeoCompetitors", url: "https://api.spyfu.com/apis/competitors_api/v2/getTopSeoCompetitors" },
  { category: "Competitors", name: "getSeoCompetitors", url: "https://api.spyfu.com/apis/competitors_api/v2/getSeoCompetitors" },
  
  // Kombat (Competing Keywords)
  { category: "Kombat", name: "getCompetingSeoKeywords", url: "https://api.spyfu.com/apis/kombat_api/v2/getCompetingSeoKeywords" },
  
  // Related Keywords
  { category: "Related Keywords", name: "getRelatedKeywords", url: "https://api.spyfu.com/apis/related_keywords_api/v2/getRelatedKeywords" },
  { category: "Related Keywords", name: "getQuestionKeywords", url: "https://api.spyfu.com/apis/related_keywords_api/v2/getQuestionKeywords" },
  { category: "Related Keywords", name: "getBuyingKeywords", url: "https://api.spyfu.com/apis/related_keywords_api/v2/getBuyingKeywords" },
  
  // Backlinks
  { category: "Backlinks", name: "getBacklinks", url: "https://api.spyfu.com/apis/backlinks_api/v2/getBacklinks" },
  { category: "Backlinks", name: "getBacklinksDomains", url: "https://api.spyfu.com/apis/backlinks_api/v2/getBacklinksDomains" },
  
  // Ranking History
  { category: "History", name: "getRankingHistory", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getRankingHistory" },
  { category: "History", name: "getKeywordRankHistory", url: "https://api.spyfu.com/apis/serp_api/v2/seo/getKeywordRankHistory" },
];

// Test variations with different parameters
const PARAMETER_VARIATIONS = [
  { pageSize: 10 },
  { pageSize: 50 },
  { pageSize: 100 },
  { pageSize: 200 },
  { sortBy: "rank" },
  { sortBy: "searchVolume" },
  { sortBy: "costPerClick" },
  { sortBy: "clicks" },
  { searchType: "MostValuable" },
  { searchType: "MostSearches" },
  { includeAllResults: true },
];

async function testEndpoint(domain, endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    query: domain,
    ...params
  });
  
  const url = `${endpoint.url}?${queryParams}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": API_KEY
      }
    });
    
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: await response.text().then(t => t.slice(0, 200))
      };
    }
    
    const data = await response.json();
    
    // Extract useful metadata
    let rowCount = 0;
    let results = null;
    let totalAvailable = null;
    
    if (Array.isArray(data)) {
      rowCount = data.length;
      results = data;
    } else if (data.results && Array.isArray(data.results)) {
      rowCount = data.results.length;
      results = data.results;
      totalAvailable = data.totalMatchingResults || data.totalResults || data.resultCount;
    } else if (typeof data === 'object' && data !== null) {
      rowCount = 1;
      results = data;
    }
    
    return {
      success: true,
      rowCount,
      totalAvailable,
      cost: (rowCount / 1000 * 0.50).toFixed(4),
      sampleData: results ? (Array.isArray(results) ? results.slice(0, 2) : results) : null,
      allKeys: data ? Object.keys(data) : [],
      dataStructure: analyzeDataStructure(results)
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function analyzeDataStructure(data) {
  if (!data) return null;
  
  const sample = Array.isArray(data) ? data[0] : data;
  if (!sample) return null;
  
  const structure = {};
  for (const [key, value] of Object.entries(sample)) {
    structure[key] = typeof value;
  }
  
  return structure;
}

async function deepExploreEndpoint(domain, endpoint) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`TESTING: ${endpoint.name} (${endpoint.category})`);
  console.log(`Domain: ${domain}`);
  console.log("=".repeat(80));
  
  const results = {};
  
  // Test basic call with default page size
  console.log("\n--- Test 1: Default parameters ---");
  const defaultResult = await testEndpoint(domain, endpoint, { pageSize: 50 });
  results.default = defaultResult;
  
  if (defaultResult.success) {
    console.log(`✅ SUCCESS`);
    console.log(`   Rows returned: ${defaultResult.rowCount}`);
    console.log(`   Total available: ${defaultResult.totalAvailable || 'unknown'}`);
    console.log(`   Cost: $${defaultResult.cost}`);
    console.log(`   Keys: ${defaultResult.allKeys.join(', ')}`);
    
    if (defaultResult.dataStructure) {
      console.log(`\n   Data Structure:`);
      for (const [key, type] of Object.entries(defaultResult.dataStructure)) {
        console.log(`      ${key}: ${type}`);
      }
    }
    
    if (defaultResult.sampleData) {
      console.log(`\n   Sample Data (first item):`);
      console.log(JSON.stringify(defaultResult.sampleData, null, 2).slice(0, 800));
    }
    
    // If successful, test larger page sizes
    if (defaultResult.rowCount > 0) {
      console.log("\n--- Test 2: Larger page size (200) ---");
      const largeResult = await testEndpoint(domain, endpoint, { pageSize: 200 });
      results.large = largeResult;
      
      if (largeResult.success) {
        console.log(`✅ Rows: ${largeResult.rowCount} | Cost: $${largeResult.cost}`);
      } else {
        console.log(`❌ Failed: ${largeResult.error || largeResult.status}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
  } else {
    console.log(`❌ FAILED`);
    console.log(`   Status: ${defaultResult.status || 'unknown'}`);
    console.log(`   Error: ${defaultResult.error || 'unknown'}`);
  }
  
  return results;
}

async function exploreAllEndpoints() {
  console.log("=".repeat(80));
  console.log("COMPREHENSIVE SPYFU API EXPLORATION");
  console.log("Testing ALL endpoints with REAL domains");
  console.log("=".repeat(80));
  
  const allResults = {};
  
  // Test with small domain first (comprehensive)
  console.log(`\n\n${"#".repeat(80)}`);
  console.log(`PHASE 1: COMPREHENSIVE TEST WITH SMALL DOMAIN`);
  console.log(`Domain: ${TEST_DOMAINS.small}`);
  console.log("#".repeat(80));
  
  allResults[TEST_DOMAINS.small] = {};
  
  for (const endpoint of ENDPOINTS_TO_TEST) {
    const results = await deepExploreEndpoint(TEST_DOMAINS.small, endpoint);
    allResults[TEST_DOMAINS.small][endpoint.name] = results;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test working endpoints with medium domain
  console.log(`\n\n${"#".repeat(80)}`);
  console.log(`PHASE 2: VERIFY WITH MEDIUM DOMAIN`);
  console.log(`Domain: ${TEST_DOMAINS.medium}`);
  console.log("#".repeat(80));
  
  const workingEndpoints = ENDPOINTS_TO_TEST.filter(ep => 
    allResults[TEST_DOMAINS.small][ep.name]?.default?.success
  );
  
  console.log(`\nTesting ${workingEndpoints.length} working endpoints...`);
  
  allResults[TEST_DOMAINS.medium] = {};
  
  for (const endpoint of workingEndpoints) {
    const results = await deepExploreEndpoint(TEST_DOMAINS.medium, endpoint);
    allResults[TEST_DOMAINS.medium][endpoint.name] = results;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate comprehensive summary
  console.log(`\n\n${"=".repeat(80)}`);
  console.log("COMPREHENSIVE ENDPOINT INVENTORY");
  console.log("=".repeat(80));
  
  console.log("\n| Endpoint | Category | Status | Small Rows | Medium Rows | Avg Cost | Cold Call Value |");
  console.log("|----------|----------|--------|------------|-------------|----------|-----------------|");
  
  const inventory = [];
  
  for (const endpoint of ENDPOINTS_TO_TEST) {
    const smallResult = allResults[TEST_DOMAINS.small][endpoint.name]?.default;
    const mediumResult = allResults[TEST_DOMAINS.medium]?.[endpoint.name]?.default;
    
    const status = smallResult?.success ? "✅" : "❌";
    const smallRows = smallResult?.rowCount || 0;
    const mediumRows = mediumResult?.rowCount || 0;
    const avgCost = smallResult?.success && mediumResult?.success ? 
      ((parseFloat(smallResult.cost) + parseFloat(mediumResult.cost)) / 2).toFixed(4) : 
      "N/A";
    
    // Assess cold call value based on data content
    let coldCallValue = "?/10";
    if (smallResult?.success && smallResult.sampleData) {
      coldCallValue = assessColdCallValue(endpoint.name, smallResult.sampleData);
    }
    
    console.log(`| ${endpoint.name.padEnd(30)} | ${endpoint.category.padEnd(15)} | ${status} | ${String(smallRows).padEnd(10)} | ${String(mediumRows).padEnd(11)} | $${String(avgCost).padEnd(7)} | ${coldCallValue.padEnd(15)} |`);
    
    inventory.push({
      endpoint: endpoint.name,
      category: endpoint.category,
      url: endpoint.url,
      works: smallResult?.success || false,
      smallRows,
      mediumRows,
      avgCost,
      coldCallValue,
      dataStructure: smallResult?.dataStructure,
      sampleData: smallResult?.sampleData
    });
  }
  
  return { allResults, inventory };
}

function assessColdCallValue(endpointName, sampleData) {
  const sample = Array.isArray(sampleData) ? sampleData[0] : sampleData;
  if (!sample) return "1/10";
  
  // Check for key cold calling indicators
  let score = 0;
  
  // Has ranking data
  if (sample.rank !== undefined) score += 2;
  
  // Has CPC data (money value)
  if (sample.exactCostPerClick > 0 || sample.broadCostPerClick > 0) score += 3;
  
  // Has search volume (traffic potential)
  if (sample.searchVolume > 0) score += 2;
  
  // Has ranking change data (urgency)
  if (sample.rankChange !== undefined || sample.seoClicksChange !== undefined) score += 2;
  
  // Has click data (current performance)
  if (sample.seoClicks !== undefined) score += 1;
  
  return `${score}/10`;
}

// Main execution
exploreAllEndpoints()
  .then(({ allResults, inventory }) => {
    // Save results to file
    const fs = require('fs');
    fs.writeFileSync(
      'comprehensive_exploration_results.json',
      JSON.stringify({ allResults, inventory }, null, 2)
    );
    
    console.log("\n\n✅ Exploration complete! Results saved to comprehensive_exploration_results.json");
    
    // Show working endpoints summary
    const working = inventory.filter(e => e.works);
    console.log(`\n📊 SUMMARY: ${working.length} working endpoints found`);
    console.log("\nTop endpoints by cold call value:");
    working
      .sort((a, b) => {
        const aScore = parseInt(a.coldCallValue.split('/')[0]);
        const bScore = parseInt(b.coldCallValue.split('/')[0]);
        return bScore - aScore;
      })
      .slice(0, 10)
      .forEach(e => {
        console.log(`   ${e.endpoint}: ${e.coldCallValue} (${e.category})`);
      });
  })
  .catch(console.error);
