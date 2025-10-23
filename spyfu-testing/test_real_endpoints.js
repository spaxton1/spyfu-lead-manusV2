#!/usr/bin/env node

/**
 * SpyFu API Real Endpoint Testing
 * Using correct API path: https://api.spyfu.com/apis/serp_api/v2/seo/
 */

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";

const TEST_DOMAINS = {
  small: "viridisenergy.com",
  medium: "poolsbybradley.com",
  large: "newerasolarenergy.com"
};

// Endpoints discovered from SpyFu documentation
const ENDPOINTS = [
  // Domain Stats
  { 
    name: "getAllDomainStats", 
    url: "https://api.spyfu.com/apis/domain_stats_api/v2/getAllDomainStats",
    params: {}
  },
  
  // SEO Research API - Organic SERP
  { 
    name: "getSeoKeywords", 
    url: "https://api.spyfu.com/apis/serp_api/v2/seo/getSeoKeywords",
    params: { pageSize: 200 }
  },
  { 
    name: "getMostValuableKeywords", 
    url: "https://api.spyfu.com/apis/serp_api/v2/seo/getMostValuableKeywords",
    params: { pageSize: 50 }
  },
  { 
    name: "getNewlyRankedKeywords", 
    url: "https://api.spyfu.com/apis/serp_api/v2/seo/getNewlyRankedKeywords",
    params: { pageSize: 50 }
  },
  { 
    name: "getGainedRanksKeywords", 
    url: "https://api.spyfu.com/apis/serp_api/v2/seo/getGainedRanksKeywords",
    params: { pageSize: 50 }
  },
  { 
    name: "getLostRanksKeywords", 
    url: "https://api.spyfu.com/apis/serp_api/v2/seo/getLostRanksKeywords",
    params: { pageSize: 50 }
  },
  { 
    name: "getGainedClicksKeywords", 
    url: "https://api.spyfu.com/apis/serp_api/v2/seo/getGainedClicksKeywords",
    params: { pageSize: 50 }
  },
  { 
    name: "getLostClicksKeywords", 
    url: "https://api.spyfu.com/apis/serp_api/v2/seo/getLostClicksKeywords",
    params: { pageSize: 50 }
  },
  { 
    name: "getJustFellOffKeywords", 
    url: "https://api.spyfu.com/apis/serp_api/v2/seo/getJustFellOffKeywords",
    params: { pageSize: 50 }
  },
  
  // Competitors API
  { 
    name: "getTopSeoCompetitors", 
    url: "https://api.spyfu.com/apis/competitors_api/v2/getTopSeoCompetitors",
    params: { pageSize: 10 }
  },
  
  // Kombat API (competing keywords)
  { 
    name: "getCompetingSeoKeywords", 
    url: "https://api.spyfu.com/apis/kombat_api/v2/getCompetingSeoKeywords",
    params: { pageSize: 50 }
  },
  
  // Related Keywords API
  { 
    name: "getRelatedKeywords", 
    url: "https://api.spyfu.com/apis/related_keywords_api/v2/getRelatedKeywords",
    params: { pageSize: 50 }
  },
  { 
    name: "getQuestionKeywords", 
    url: "https://api.spyfu.com/apis/related_keywords_api/v2/getQuestionKeywords",
    params: { pageSize: 50 }
  },
];

async function testEndpoint(domain, endpoint) {
  const params = new URLSearchParams({
    query: domain,
    ...endpoint.params
  });
  
  const url = `${endpoint.url}?${params}`;
  
  console.log(`  Testing URL: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": API_KEY,
        "Accept": "application/json"
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        status: "FAILED",
        statusCode: response.status,
        error: errorText.slice(0, 500)
      };
    }
    
    const data = await response.json();
    
    // Count rows
    let rowCount = 0;
    let results = null;
    
    if (Array.isArray(data)) {
      rowCount = data.length;
      results = data.slice(0, 3);
    } else if (data.results && Array.isArray(data.results)) {
      rowCount = data.results.length;
      results = data.results.slice(0, 3);
    } else if (data.data && Array.isArray(data.data)) {
      rowCount = data.data.length;
      results = data.data.slice(0, 3);
    } else if (typeof data === 'object') {
      rowCount = 1;
      results = data;
    }
    
    return {
      status: "SUCCESS",
      rowCount,
      totalAvailable: data.totalResults || data.total || data.count || null,
      cost: (rowCount / 1000 * 0.50).toFixed(4),
      sampleData: results,
      metadata: {
        hasResults: !!results,
        dataType: Array.isArray(results) ? 'array' : 'object',
        topLevelKeys: Object.keys(data).join(', ')
      }
    };
    
  } catch (error) {
    return {
      status: "ERROR",
      error: error.message
    };
  }
}

async function runTests() {
  console.log("=".repeat(80));
  console.log("SPYFU API COMPREHENSIVE ENDPOINT TESTING");
  console.log("=".repeat(80));
  console.log();
  
  const results = {};
  
  for (const [size, domain] of Object.entries(TEST_DOMAINS)) {
    console.log("\n" + "=".repeat(80));
    console.log(`TESTING: ${domain.toUpperCase()} (${size.toUpperCase()} DOMAIN)`);
    console.log("=".repeat(80));
    
    results[domain] = {};
    
    for (const endpoint of ENDPOINTS) {
      console.log(`\n--- ${endpoint.name} ---`);
      
      const result = await testEndpoint(domain, endpoint);
      results[domain][endpoint.name] = result;
      
      console.log(`Status: ${result.status}`);
      
      if (result.status === "SUCCESS") {
        console.log(`✅ Row Count: ${result.rowCount}`);
        console.log(`   Cost: $${result.cost}`);
        if (result.totalAvailable) {
          console.log(`   Total Available: ${result.totalAvailable}`);
        }
        console.log(`   Top Keys: ${result.metadata.topLevelKeys}`);
        console.log(`\n   Sample Data (first 3 items):`);
        console.log(JSON.stringify(result.sampleData, null, 2).slice(0, 1000));
      } else {
        console.log(`❌ ${result.status}: ${result.error || result.statusCode}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Summary
  console.log("\n\n" + "=".repeat(80));
  console.log("ENDPOINT SUMMARY");
  console.log("=".repeat(80));
  
  const summary = {};
  
  for (const endpoint of ENDPOINTS) {
    const smallResult = results[TEST_DOMAINS.small][endpoint.name];
    const mediumResult = results[TEST_DOMAINS.medium][endpoint.name];
    const largeResult = results[TEST_DOMAINS.large][endpoint.name];
    
    const allSuccess = [smallResult, mediumResult, largeResult].every(r => r.status === "SUCCESS");
    
    summary[endpoint.name] = {
      works: allSuccess,
      smallRows: smallResult.status === "SUCCESS" ? smallResult.rowCount : 0,
      mediumRows: mediumResult.status === "SUCCESS" ? mediumResult.rowCount : 0,
      largeRows: largeResult.status === "SUCCESS" ? largeResult.rowCount : 0,
      avgCost: allSuccess ? 
        ((parseFloat(smallResult.cost) + parseFloat(mediumResult.cost) + parseFloat(largeResult.cost)) / 3).toFixed(4) : 
        "N/A"
    };
  }
  
  console.log("\n| Endpoint | Status | Small | Medium | Large | Avg Cost |");
  console.log("|----------|--------|-------|--------|-------|----------|");
  
  for (const [name, data] of Object.entries(summary)) {
    const status = data.works ? "✅" : "❌";
    console.log(`| ${name} | ${status} | ${data.smallRows} | ${data.mediumRows} | ${data.largeRows} | $${data.avgCost} |`);
  }
  
  return results;
}

runTests().catch(console.error);
