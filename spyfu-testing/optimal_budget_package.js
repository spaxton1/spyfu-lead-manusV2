#!/usr/bin/env node

/**
 * OPTIMAL BUDGET PACKAGE DESIGNER
 * Tests exact data nuggets and finds optimal package within $0.10-0.12 budget
 * Based on comprehensive exploration findings
 */

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const BASE_URL = "https://api.spyfu.com/apis/serp_api/v2/seo";

const TEST_DOMAINS = {
  small: "viridisenergy.com",
  medium: "poolsbybradley.com",
  large: "newerasolarenergy.com"
};

// Working endpoints from exploration
const WORKING_ENDPOINTS = {
  overview: { name: "getLiveSeoStats", url: `${BASE_URL}/getLiveSeoStats`, rows: 1, cost: 0.0005 },
  keywords: { name: "getSeoKeywords", url: `${BASE_URL}/getSeoKeywords`, rows: "variable", cost: "variable" },
  valuable: { name: "getMostValuableKeywords", url: `${BASE_URL}/getMostValuableKeywords`, rows: "variable", cost: "variable" },
  newly: { name: "getNewlyRankedKeywords", url: `${BASE_URL}/getNewlyRankedKeywords`, rows: "variable", cost: "variable" },
  gained: { name: "getGainedRanksKeywords", url: `${BASE_URL}/getGainedRanksKeywords`, rows: "variable", cost: "variable" },
  lost: { name: "getLostRanksKeywords", url: `${BASE_URL}/getLostRanksKeywords`, rows: "variable", cost: "variable" },
  gainedClicks: { name: "getGainedClicksKeywords", url: `${BASE_URL}/getGainedClicksKeywords`, rows: "variable", cost: "variable" },
  lostClicks: { name: "getLostClicksKeywords", url: `${BASE_URL}/getLostClicksKeywords`, rows: "variable", cost: "variable" },
  fellOff: { name: "getJustFellOffKeywords", url: `${BASE_URL}/getJustFellOffKeywords`, rows: "variable", cost: "variable" }
};

async function fetchData(endpoint, domain, pageSize) {
  const url = `${endpoint}?query=${domain}&pageSize=${pageSize}`;
  
  const response = await fetch(url, {
    headers: { "Authorization": API_KEY }
  });
  
  if (!response.ok) {
    throw new Error(`Failed: ${response.status}`);
  }
  
  const data = await response.json();
  return data.results || data;
}

// Test different package configurations
const PACKAGE_CONFIGS = [
  {
    name: "MINIMAL - Core Keywords Only",
    description: "Single call to getMostValuableKeywords",
    calls: [
      { endpoint: "overview", pageSize: 1 },
      { endpoint: "valuable", pageSize: 200 }
    ]
  },
  {
    name: "BALANCED - Keywords + Changes",
    description: "Keywords plus key ranking changes",
    calls: [
      { endpoint: "overview", pageSize: 1 },
      { endpoint: "valuable", pageSize: 100 },
      { endpoint: "gained", pageSize: 25 },
      { endpoint: "lost", pageSize: 25 }
    ]
  },
  {
    name: "COMPREHENSIVE - All Key Data",
    description: "Full cold calling intelligence",
    calls: [
      { endpoint: "overview", pageSize: 1 },
      { endpoint: "valuable", pageSize: 150 },
      { endpoint: "gained", pageSize: 20 },
      { endpoint: "lost", pageSize: 20 },
      { endpoint: "fellOff", pageSize: 10 }
    ]
  },
  {
    name: "OPTIMIZED - Best Value",
    description: "Optimal mix for cold calling",
    calls: [
      { endpoint: "overview", pageSize: 1 },
      { endpoint: "keywords", pageSize: 100 },  // Get more variety
      { endpoint: "gained", pageSize: 30 },
      { endpoint: "lost", pageSize: 20 },
      { endpoint: "fellOff", pageSize: 15 }
    ]
  }
];

async function testPackageConfig(config, domain, domainSize) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`Testing: ${config.name}`);
  console.log(`Domain: ${domain} (${domainSize})`);
  console.log(`Strategy: ${config.description}`);
  console.log("=".repeat(80));
  
  let totalRows = 0;
  const results = {};
  
  for (const call of config.calls) {
    const endpoint = WORKING_ENDPOINTS[call.endpoint];
    const pageSize = call.pageSize;
    
    try {
      console.log(`\n   Calling ${endpoint.name} (pageSize=${pageSize})...`);
      
      const data = await fetchData(endpoint.url, domain, pageSize);
      const rowCount = Array.isArray(data) ? data.length : 1;
      
      totalRows += rowCount;
      results[call.endpoint] = {
        success: true,
        rowCount,
        sampleData: Array.isArray(data) ? data.slice(0, 3) : data
      };
      
      console.log(`   ✅ Retrieved ${rowCount} rows`);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      results[call.endpoint] = {
        success: false,
        error: error.message
      };
    }
  }
  
  const cost = (totalRows / 1000 * 0.50).toFixed(4);
  const withinBudget = parseFloat(cost) <= 0.12;
  
  console.log(`\n   📊 SUMMARY:`);
  console.log(`      Total Rows: ${totalRows}`);
  console.log(`      Total Cost: $${cost}`);
  console.log(`      Within Budget ($0.12): ${withinBudget ? "✅ YES" : "❌ NO"}`);
  
  return {
    config: config.name,
    domain,
    domainSize,
    totalRows,
    cost: parseFloat(cost),
    withinBudget,
    results
  };
}

async function analyzeNuggetsFromData(packageResults) {
  console.log(`\n\n${"#".repeat(80)}`);
  console.log("DATA NUGGET ANALYSIS FROM RETRIEVED DATA");
  console.log("#".repeat(80));
  
  const nuggets = {};
  
  // NUGGET 1: High-CPC Keywords in Top 50
  if (packageResults.results.valuable?.success || packageResults.results.keywords?.success) {
    const keywords = packageResults.results.valuable?.sampleData || packageResults.results.keywords?.sampleData || [];
    
    const highCpc = keywords
      .filter(kw => kw.rank && kw.rank <= 50 && kw.exactCostPerClick > 0)
      .sort((a, b) => b.exactCostPerClick - a.exactCostPerClick)
      .slice(0, 3);
    
    nuggets.highCpc = highCpc.map(kw => ({
      keyword: kw.keyword,
      rank: kw.rank,
      cpc: kw.exactCostPerClick,
      volume: kw.searchVolume,
      clicks: kw.seoClicks,
      script: `"${kw.keyword}" is ranked #${kw.rank}. That keyword has a $${kw.exactCostPerClick.toFixed(2)} cost-per-click and ${kw.searchVolume.toLocaleString()} monthly searches. You're getting ${kw.seoClicks} clicks right now.`
    }));
    
    console.log(`\n✅ NUGGET 1: High-CPC Keywords (${nuggets.highCpc.length} found)`);
    nuggets.highCpc.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.keyword} - Rank #${item.rank}, $${item.cpc.toFixed(2)} CPC`);
    });
  }
  
  // NUGGET 2: Low-Hanging Fruit (Positions 4-20)
  if (packageResults.results.valuable?.success || packageResults.results.keywords?.success) {
    const keywords = packageResults.results.valuable?.sampleData || packageResults.results.keywords?.sampleData || [];
    
    const lowHanging = keywords
      .filter(kw => kw.rank >= 4 && kw.rank <= 20 && (kw.exactCostPerClick || 0) > 3)
      .map(kw => ({
        ...kw,
        value: (21 - kw.rank) * (kw.exactCostPerClick || 0) * (kw.searchVolume || 0)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    
    nuggets.lowHanging = lowHanging.map(kw => ({
      keyword: kw.keyword,
      rank: kw.rank,
      spotsFromPage1: 11 - kw.rank,
      cpc: kw.exactCostPerClick,
      volume: kw.searchVolume,
      script: `You're #${kw.rank} for "${kw.keyword}" - just ${11 - kw.rank} spots from page 1. That's a $${(kw.exactCostPerClick||0).toFixed(2)} keyword with ${kw.searchVolume.toLocaleString()} searches.`
    }));
    
    console.log(`\n✅ NUGGET 2: Low-Hanging Fruit (${nuggets.lowHanging.length} found)`);
    nuggets.lowHanging.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.keyword} - Rank #${item.rank} (${item.spotsFromPage1} from page 1)`);
    });
  }
  
  // NUGGET 3: Positive Momentum
  if (packageResults.results.gained?.success) {
    const gained = packageResults.results.gained.sampleData || [];
    
    const momentum = gained
      .filter(kw => kw.rankChange > 5 && kw.searchVolume > 500)
      .sort((a, b) => b.rankChange - a.rankChange)
      .slice(0, 3);
    
    nuggets.momentum = momentum.map(kw => ({
      keyword: kw.keyword,
      rank: kw.rank,
      improved: kw.rankChange,
      volume: kw.searchVolume,
      script: `Congrats! You jumped ${kw.rankChange} positions for "${kw.keyword}" - now at #${kw.rank}. That gets ${kw.searchVolume.toLocaleString()} searches monthly. Want to do the same for other keywords?`
    }));
    
    console.log(`\n✅ NUGGET 3: Positive Momentum (${nuggets.momentum.length} found)`);
    nuggets.momentum.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.keyword} - Improved ${item.improved} positions → #${item.rank}`);
    });
  }
  
  // NUGGET 4: Dramatic Drops
  if (packageResults.results.lost?.success) {
    const lost = packageResults.results.lost.sampleData || [];
    
    const drops = lost
      .filter(kw => kw.rankChange < -5 && kw.searchVolume > 100)
      .sort((a, b) => a.rankChange - b.rankChange)
      .slice(0, 3);
    
    nuggets.drops = drops.map(kw => ({
      keyword: kw.keyword,
      oldRank: kw.rank - kw.rankChange,
      newRank: kw.rank,
      dropped: Math.abs(kw.rankChange),
      volume: kw.searchVolume,
      clicksLost: Math.abs(kw.seoClicksChange || 0),
      script: `You dropped ${Math.abs(kw.rankChange)} positions for "${kw.keyword}" - from #${kw.rank - kw.rankChange} to #${kw.rank}. That's ${kw.searchVolume.toLocaleString()} monthly searches and ${Math.abs(kw.seoClicksChange||0)} clicks lost.`
    }));
    
    console.log(`\n✅ NUGGET 4: Dramatic Drops (${nuggets.drops.length} found)`);
    nuggets.drops.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.keyword} - Dropped ${item.dropped} positions (#${item.oldRank} → #${item.newRank})`);
    });
  }
  
  // NUGGET 5: Fell Off Page 1
  if (packageResults.results.fellOff?.success) {
    const fellOff = packageResults.results.fellOff.sampleData || [];
    
    const page1Lost = fellOff
      .filter(kw => (kw.exactCostPerClick || 0) > 3 && kw.seoClicksChange < 0)
      .sort((a, b) => a.seoClicksChange - b.seoClicksChange)
      .slice(0, 3);
    
    nuggets.fellOff = page1Lost.map(kw => ({
      keyword: kw.keyword,
      oldRank: kw.rank - (kw.rankChange || 0),
      newRank: kw.rank,
      cpc: kw.exactCostPerClick,
      clicksLost: Math.abs(kw.seoClicksChange || 0),
      script: `You USED TO rank #${kw.rank - (kw.rankChange||0)} for "${kw.keyword}" but dropped to #${kw.rank}. That's a $${(kw.exactCostPerClick||0).toFixed(2)} keyword. You lost ${Math.abs(kw.seoClicksChange||0)} clicks/month.`
    }));
    
    console.log(`\n✅ NUGGET 5: Fell Off Page 1 (${nuggets.fellOff.length} found)`);
    nuggets.fellOff.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.keyword} - Was #${item.oldRank}, Now #${item.newRank}, Lost ${item.clicksLost} clicks`);
    });
  }
  
  return nuggets;
}

async function main() {
  console.log("=".repeat(80));
  console.log("OPTIMAL BUDGET PACKAGE ANALYSIS");
  console.log("Testing different package configurations");
  console.log("=".repeat(80));
  
  const allResults = [];
  
  // Test all configurations with all domains
  for (const config of PACKAGE_CONFIGS) {
    for (const [size, domain] of Object.entries(TEST_DOMAINS)) {
      const result = await testPackageConfig(config, domain, size);
      allResults.push(result);
      
      // If within budget, analyze the nuggets
      if (result.withinBudget) {
        await analyzeNuggetsFromData(result);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Final recommendations
  console.log(`\n\n${"=".repeat(80)}`);
  console.log("FINAL RECOMMENDATIONS");
  console.log("=".repeat(80));
  
  console.log("\n| Package | Domain | Size | Rows | Cost | Budget OK |");
  console.log("|---------|--------|------|------|------|-----------|");
  
  for (const result of allResults) {
    const budgetIcon = result.withinBudget ? "✅" : "❌";
    console.log(`| ${result.config.substring(0, 20).padEnd(20)} | ${result.domain.padEnd(23)} | ${result.domainSize.padEnd(6)} | ${String(result.totalRows).padEnd(4)} | $${result.cost.toFixed(4)} | ${budgetIcon} |`);
  }
  
  // Best package recommendation
  const withinBudget = allResults.filter(r => r.withinBudget);
  if (withinBudget.length > 0) {
    const best = withinBudget.sort((a, b) => b.totalRows - a.totalRows)[0];
    
    console.log(`\n\n🏆 RECOMMENDED PACKAGE: ${best.config}`);
    console.log(`   Max Rows: ${best.totalRows}`);
    console.log(`   Max Cost: $${best.cost.toFixed(4)}`);
    console.log(`   Works for: ${withinBudget.map(r => r.domainSize).filter((v, i, a) => a.indexOf(v) === i).join(', ')} domains`);
  }
  
  // Save results
  const fs = require('fs');
  fs.writeFileSync(
    'optimal_package_results.json',
    JSON.stringify(allResults, null, 2)
  );
  
  console.log(`\n✅ Results saved to optimal_package_results.json`);
}

main().catch(console.error);
