#!/usr/bin/env node

/**
 * SpyFu API Comprehensive Testing
 * Tests all endpoints with small, medium, and large domains
 */

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const BASE_URL = "https://api.spyfu.com/apis/serp_api/v2/seo";

const TEST_DOMAINS = {
  small: "viridisenergy.com",
  medium: "poolsbybradley.com",
  large: "newerasolarenergy.com"
};

// All endpoints to test
const ENDPOINTS = [
  { name: "getLiveSeoStats", path: "/live_seo_stats", params: {} },
  { name: "getSeoKeywords", path: "/seo_keywords", params: { pageSize: 200 } },
  { name: "getGainedRanksKeywords", path: "/gained_ranks_keywords", params: { pageSize: 50 } },
  { name: "getLostRanksKeywords", path: "/lost_ranks_keywords", params: { pageSize: 50 } },
  { name: "getGainedClicksKeywords", path: "/gained_clicks_keywords", params: { pageSize: 50 } },
  { name: "getLostClicksKeywords", path: "/lost_clicks_keywords", params: { pageSize: 50 } },
  { name: "getNewlyRankedKeywords", path: "/newly_ranked_keywords", params: { pageSize: 50 } },
  { name: "getJustFellOffKeywords", path: "/just_fell_off_keywords", params: { pageSize: 50 } },
  { name: "getTopSeoCompetitors", path: "/top_seo_competitors", params: { pageSize: 10 } },
  { name: "getCompetingSeoKeywords", path: "/competing_seo_keywords", params: { pageSize: 50 } },
  { name: "getRelatedKeywords", path: "/related_keywords", params: { pageSize: 50 } },
  { name: "getTransactionalKeywords", path: "/transactional_keywords", params: { pageSize: 50 } },
  // Try alternative paths
  { name: "getOrganic", path: "/organic", params: { pageSize: 200 } },
  { name: "getDomainStats", path: "/domain_stats", params: {} },
  { name: "getSeoClicks", path: "/seo_clicks", params: {} },
  { name: "getKeywordRankHistory", path: "/keyword_rank_history", params: {} },
];

async function testEndpoint(domain, endpoint) {
  const params = new URLSearchParams({
    query: domain,
    ...endpoint.params
  });
  
  const url = `${BASE_URL}${endpoint.path}?${params}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": API_KEY,
        "Accept": "application/json"
      }
    });
    
    if (!response.ok) {
      return {
        status: "FAILED",
        statusCode: response.status,
        error: await response.text()
      };
    }
    
    const data = await response.json();
    
    // Count rows (results)
    let rowCount = 0;
    if (Array.isArray(data)) {
      rowCount = data.length;
    } else if (data.results && Array.isArray(data.results)) {
      rowCount = data.results.length;
    } else if (data.data && Array.isArray(data.data)) {
      rowCount = data.data.length;
    } else if (typeof data === 'object') {
      rowCount = 1; // Single object response
    }
    
    return {
      status: "SUCCESS",
      rowCount,
      sampleData: JSON.stringify(data, null, 2).slice(0, 2000), // First 2000 chars
      fullDataPreview: Array.isArray(data) ? data.slice(0, 3) : 
                       (data.results ? data.results.slice(0, 3) : 
                       (data.data ? data.data.slice(0, 3) : data))
    };
    
  } catch (error) {
    return {
      status: "ERROR",
      error: error.message
    };
  }
}

async function testAllEndpoints() {
  console.log("=".repeat(80));
  console.log("SPYFU API ENDPOINT TESTING");
  console.log("=".repeat(80));
  
  for (const [size, domain] of Object.entries(TEST_DOMAINS)) {
    console.log(`\n\n${"=".repeat(80)}`);
    console.log(`TESTING DOMAIN: ${domain.toUpperCase()} (${size.toUpperCase()})`);
    console.log("=".repeat(80));
    
    for (const endpoint of ENDPOINTS) {
      console.log(`\n--- Testing: ${endpoint.name} ---`);
      console.log(`Path: ${endpoint.path}`);
      console.log(`Params: ${JSON.stringify(endpoint.params)}`);
      
      const result = await testEndpoint(domain, endpoint);
      
      console.log(`Status: ${result.status}`);
      
      if (result.status === "SUCCESS") {
        console.log(`Row Count: ${result.rowCount}`);
        console.log(`Cost: $${(result.rowCount / 1000 * 0.50).toFixed(4)}`);
        console.log(`\nSample Data (first 3 items):`);
        console.log(JSON.stringify(result.fullDataPreview, null, 2));
      } else {
        console.log(`Error: ${result.error || result.statusCode}`);
      }
      
      // Rate limiting - wait 500ms between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

// Run the tests
testAllEndpoints().catch(console.error);
