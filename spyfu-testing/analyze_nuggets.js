#!/usr/bin/env node

/**
 * SpyFu Data Nugget Analysis
 * Tests all 7 data nuggets with real domains
 */

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const BASE_URL = "https://api.spyfu.com/apis/serp_api/v2/seo";

const TEST_DOMAINS = {
  small: "viridisenergy.com",
  medium: "poolsbybradley.com",
  large: "newerasolarenergy.com"
};

async function fetchKeywords(domain, pageSize = 200) {
  const url = `${BASE_URL}/getSeoKeywords?query=${domain}&pageSize=${pageSize}`;
  
  const response = await fetch(url, {
    headers: { "Authorization": API_KEY, "Accept": "application/json" }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch keywords: ${response.status}`);
  }
  
  const data = await response.json();
  return data.results || [];
}

async function fetchGainedRanks(domain, pageSize = 50) {
  const url = `${BASE_URL}/getGainedRanksKeywords?query=${domain}&pageSize=${pageSize}`;
  
  const response = await fetch(url, {
    headers: { "Authorization": API_KEY, "Accept": "application/json" }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch gained ranks: ${response.status}`);
  }
  
  const data = await response.json();
  return data.results || [];
}

async function fetchLostRanks(domain, pageSize = 50) {
  const url = `${BASE_URL}/getLostRanksKeywords?query=${domain}&pageSize=${pageSize}`;
  
  const response = await fetch(url, {
    headers: { "Authorization": API_KEY, "Accept": "application/json" }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch lost ranks: ${response.status}`);
  }
  
  const data = await response.json();
  return data.results || [];
}

async function fetchNewlyRanked(domain, pageSize = 50) {
  const url = `${BASE_URL}/getNewlyRankedKeywords?query=${domain}&pageSize=${pageSize}`;
  
  const response = await fetch(url, {
    headers: { "Authorization": API_KEY, "Accept": "application/json" }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch newly ranked: ${response.status}`);
  }
  
  const data = await response.json();
  return data.results || [];
}

async function fetchJustFellOff(domain, pageSize = 50) {
  const url = `${BASE_URL}/getJustFellOffKeywords?query=${domain}&pageSize=${pageSize}`;
  
  const response = await fetch(url, {
    headers: { "Authorization": API_KEY, "Accept": "application/json" }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch just fell off: ${response.status}`);
  }
  
  const data = await response.json();
  return data.results || [];
}

// NUGGET 1: High-CPC Keywords in Top 50
function extractNugget1(keywords) {
  // Filter: rank <= 50, sort by CPC, take top 3
  const filtered = keywords
    .filter(kw => kw.rank && kw.rank <= 50 && kw.exactCostPerClick > 0)
    .sort((a, b) => b.exactCostPerClick - a.exactCostPerClick)
    .slice(0, 3);
  
  return filtered.map(kw => ({
    keyword: kw.keyword,
    rank: kw.rank,
    cpc: kw.exactCostPerClick,
    searchVolume: kw.searchVolume,
    seoClicks: kw.seoClicks,
    script: `"${kw.keyword}" is ranked #${kw.rank} for you. That keyword has a $${kw.exactCostPerClick.toFixed(2)} cost-per-click and gets ${kw.searchVolume.toLocaleString()} searches per month. You're getting ${kw.seoClicks} clicks from it right now.`
  }));
}

// NUGGET 2: Low-Hanging Fruit (Positions 4-20, High CPC)
function extractNugget2(keywords) {
  // Filter: rank 4-20, CPC > $3, sort by value (proximity * CPC * volume)
  const filtered = keywords
    .filter(kw => kw.rank >= 4 && kw.rank <= 20 && (kw.exactCostPerClick || 0) > 3)
    .map(kw => ({
      ...kw,
      value: (21 - kw.rank) * (kw.exactCostPerClick || 0) * (kw.searchVolume || 0)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  
  return filtered.map(kw => ({
    keyword: kw.keyword,
    rank: kw.rank,
    cpc: kw.exactCostPerClick,
    searchVolume: kw.searchVolume,
    spotsFromPage1: 11 - kw.rank,
    script: `You're ranked #${kw.rank} for "${kw.keyword}" - just ${11 - kw.rank} spot${11 - kw.rank === 1 ? '' : 's'} from page 1. That's a $${(kw.exactCostPerClick || 0).toFixed(2)} keyword with ${kw.searchVolume.toLocaleString()} monthly searches. Moving up just a few spots could bring you ${Math.floor(kw.searchVolume * 0.05)} more visitors per month.`
  }));
}

// NUGGET 3: Traffic Monsters (High Volume, Unique from CPC, in Top 50)
function extractNugget3(keywords) {
  // Get top 5 CPC keywords
  const topCPC = keywords
    .filter(kw => kw.rank && kw.rank <= 50)
    .sort((a, b) => (b.exactCostPerClick || 0) - (a.exactCostPerClick || 0))
    .slice(0, 5)
    .map(kw => kw.keyword);
  
  // Get high volume keywords, exclude top CPC, filter rank <= 50
  const filtered = keywords
    .filter(kw => 
      kw.rank && 
      kw.rank <= 50 && 
      !topCPC.includes(kw.keyword) && 
      kw.searchVolume > 1000
    )
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 3);
  
  return filtered.map(kw => ({
    keyword: kw.keyword,
    rank: kw.rank,
    cpc: kw.exactCostPerClick || 0,
    searchVolume: kw.searchVolume,
    seoClicks: kw.seoClicks,
    script: `You're ranking #${kw.rank} for "${kw.keyword}" - that gets ${kw.searchVolume.toLocaleString()} searches every single month. You're currently getting ${kw.seoClicks} clicks from it. Moving up to page 1 could mean ${Math.floor(kw.searchVolume * 0.15)} potential visitors monthly.`
  }));
}

// NUGGET 4: Money Keywords That Fell Off Page 1 (from JustFellOff endpoint)
function extractNugget4(fellOffKeywords) {
  // Filter: CPC > $3, sort by clicks lost
  const filtered = fellOffKeywords
    .filter(kw => (kw.exactCostPerClick || 0) > 3 && kw.seoClicksChange < 0)
    .sort((a, b) => a.seoClicksChange - b.seoClicksChange) // Most negative first
    .slice(0, 3);
  
  return filtered.map(kw => ({
    keyword: kw.keyword,
    oldRank: kw.rank - (kw.rankChange || 0),
    newRank: kw.rank,
    rankDrop: Math.abs(kw.rankChange || 0),
    clicksLost: Math.abs(kw.seoClicksChange || 0),
    cpc: kw.exactCostPerClick,
    searchVolume: kw.searchVolume,
    script: `You USED TO rank #${kw.rank - (kw.rankChange || 0)} for "${kw.keyword}" but dropped to #${kw.rank}. That's a $${(kw.exactCostPerClick || 0).toFixed(2)} keyword. You lost ${Math.abs(kw.seoClicksChange || 0)} clicks per month - that's potential revenue walking away. We need to fix this.`
  }));
}

// NUGGET 5: Dramatic Ranking Drops (from LostRanks endpoint)
function extractNugget5(lostRanksKeywords) {
  // Filter: biggest position drops with decent search volume
  const filtered = lostRanksKeywords
    .filter(kw => kw.rankChange && kw.rankChange < -5 && kw.searchVolume > 100)
    .sort((a, b) => a.rankChange - b.rankChange) // Most negative first
    .slice(0, 3);
  
  return filtered.map(kw => ({
    keyword: kw.keyword,
    oldRank: kw.rank - kw.rankChange,
    newRank: kw.rank,
    rankDrop: Math.abs(kw.rankChange),
    searchVolume: kw.searchVolume,
    clicksLost: Math.abs(kw.seoClicksChange || 0),
    script: `Heads up - you dropped ${Math.abs(kw.rankChange)} positions for "${kw.keyword}" - from #${kw.rank - kw.rankChange} down to #${kw.rank}. That's ${kw.searchVolume.toLocaleString()} monthly searches, and you lost ${Math.abs(kw.seoClicksChange || 0)} clicks per month. This is costing you traffic.`
  }));
}

// NUGGET 6: Positive Momentum (from GainedRanks and NewlyRanked endpoints)
function extractNugget6(gainedRanksKeywords, newlyRankedKeywords) {
  // Combine both sources, prioritize big gains and new high-volume keywords
  const gains = gainedRanksKeywords
    .filter(kw => kw.rankChange && kw.rankChange > 5 && kw.searchVolume > 500)
    .map(kw => ({
      ...kw,
      type: 'gained',
      score: kw.rankChange * Math.log(kw.searchVolume)
    }));
  
  const newRanks = newlyRankedKeywords
    .filter(kw => kw.rank && kw.rank <= 30 && kw.searchVolume > 1000)
    .map(kw => ({
      ...kw,
      type: 'new',
      score: (31 - kw.rank) * Math.log(kw.searchVolume)
    }));
  
  const combined = [...gains, ...newRanks]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  return combined.map(kw => {
    if (kw.type === 'gained') {
      return {
        keyword: kw.keyword,
        type: 'Improved',
        rank: kw.rank,
        improvement: kw.rankChange,
        searchVolume: kw.searchVolume,
        script: `First off, congrats! You jumped ${kw.rankChange} positions for "${kw.keyword}" - now at #${kw.rank}. That gets ${kw.searchVolume.toLocaleString()} searches monthly. You're doing something right. Want to do the same for your other keywords?`
      };
    } else {
      return {
        keyword: kw.keyword,
        type: 'New Ranking',
        rank: kw.rank,
        searchVolume: kw.searchVolume,
        script: `I see you just started ranking for "${kw.keyword}" at #${kw.rank}. That's ${kw.searchVolume.toLocaleString()} monthly searches. Great start! Let me show you how to push this to page 1 and really capitalize on it.`
      };
    }
  });
}

// NUGGET 7: Real Competitor Analysis (from top keywords)
function extractNugget7(keywords) {
  // For this we need competitor data, but since those endpoints don't work,
  // let's analyze who ranks ABOVE them for their best keywords
  // We can't get this from current data - would need SERP data or competitor endpoints
  
  // Instead, let's identify competitive keywords where they're close but not winning
  const competitive = keywords
    .filter(kw => kw.rank >= 4 && kw.rank <= 20 && kw.rankingHomepages > 20) // High competition
    .sort((a, b) => (b.exactCostPerClick || 0) * b.searchVolume - (a.exactCostPerClick || 0) * a.searchVolume)
    .slice(0, 3);
  
  return competitive.map(kw => ({
    keyword: kw.keyword,
    yourRank: kw.rank,
    searchVolume: kw.searchVolume,
    cpc: kw.exactCostPerClick || 0,
    competitors: kw.rankingHomepages,
    script: `"${kw.keyword}" has ${kw.rankingHomepages} competitors fighting for it. You're #${kw.rank}. That keyword gets ${kw.searchVolume.toLocaleString()} searches and has a $${(kw.exactCostPerClick || 0).toFixed(2)} CPC. ${kw.rankingHomepages - kw.rank} businesses are beating you for this money keyword.`
  }));
}

async function analyzeAllNuggets(domain, domainSize) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`ANALYZING: ${domain.toUpperCase()} (${domainSize.toUpperCase()})`);
  console.log("=".repeat(80));
  
  try {
    // Fetch all necessary data
    console.log("\n📊 Fetching data...");
    const [keywords, gainedRanks, lostRanks, newlyRanked, fellOff] = await Promise.all([
      fetchKeywords(domain, 200),
      fetchGainedRanks(domain, 50),
      fetchLostRanks(domain, 50),
      fetchNewlyRanked(domain, 50),
      fetchJustFellOff(domain, 50)
    ]);
    
    console.log(`✅ Fetched ${keywords.length} keywords, ${gainedRanks.length} gained, ${lostRanks.length} lost, ${newlyRanked.length} new, ${fellOff.length} fell off`);
    
    const rowsUsed = keywords.length + gainedRanks.length + lostRanks.length + newlyRanked.length + fellOff.length;
    const cost = (rowsUsed / 1000 * 0.50).toFixed(4);
    console.log(`💰 Total Rows: ${rowsUsed} | Cost: $${cost}`);
    
    // Extract all nuggets
    const nuggets = {
      nugget1: extractNugget1(keywords),
      nugget2: extractNugget2(keywords),
      nugget3: extractNugget3(keywords),
      nugget4: extractNugget4(fellOff),
      nugget5: extractNugget5(lostRanks),
      nugget6: extractNugget6(gainedRanks, newlyRanked),
      nugget7: extractNugget7(keywords)
    };
    
    // Display results
    console.log("\n" + "=".repeat(80));
    console.log("NUGGET 1: High-CPC Keywords in Top 50");
    console.log("=".repeat(80));
    nuggets.nugget1.forEach((item, i) => {
      console.log(`\n${i + 1}. "${item.keyword}"`);
      console.log(`   Rank: #${item.rank} | CPC: $${item.cpc.toFixed(2)} | Volume: ${item.searchVolume.toLocaleString()} | Clicks: ${item.seoClicks}`);
      console.log(`   📞 SCRIPT: ${item.script}`);
    });
    
    console.log("\n" + "=".repeat(80));
    console.log("NUGGET 2: Low-Hanging Fruit (Page 2, High Value)");
    console.log("=".repeat(80));
    nuggets.nugget2.forEach((item, i) => {
      console.log(`\n${i + 1}. "${item.keyword}"`);
      console.log(`   Rank: #${item.rank} (${item.spotsFromPage1} from page 1) | CPC: $${item.cpc.toFixed(2)} | Volume: ${item.searchVolume.toLocaleString()}`);
      console.log(`   📞 SCRIPT: ${item.script}`);
    });
    
    console.log("\n" + "=".repeat(80));
    console.log("NUGGET 3: Traffic Monsters (High Volume Rankings)");
    console.log("=".repeat(80));
    nuggets.nugget3.forEach((item, i) => {
      console.log(`\n${i + 1}. "${item.keyword}"`);
      console.log(`   Rank: #${item.rank} | Volume: ${item.searchVolume.toLocaleString()} | Current Clicks: ${item.seoClicks}`);
      console.log(`   📞 SCRIPT: ${item.script}`);
    });
    
    console.log("\n" + "=".repeat(80));
    console.log("NUGGET 4: Money Keywords That Fell Off Page 1");
    console.log("=".repeat(80));
    if (nuggets.nugget4.length === 0) {
      console.log("   ✨ No keywords fell off page 1 (good news!)");
    } else {
      nuggets.nugget4.forEach((item, i) => {
        console.log(`\n${i + 1}. "${item.keyword}"`);
        console.log(`   Was #${item.oldRank} → Now #${item.newRank} | Dropped ${item.rankDrop} spots | Lost ${item.clicksLost} clicks/mo`);
        console.log(`   CPC: $${item.cpc.toFixed(2)} | Volume: ${item.searchVolume.toLocaleString()}`);
        console.log(`   📞 SCRIPT: ${item.script}`);
      });
    }
    
    console.log("\n" + "=".repeat(80));
    console.log("NUGGET 5: Dramatic Ranking Drops");
    console.log("=".repeat(80));
    if (nuggets.nugget5.length === 0) {
      console.log("   ✨ No dramatic drops detected");
    } else {
      nuggets.nugget5.forEach((item, i) => {
        console.log(`\n${i + 1}. "${item.keyword}"`);
        console.log(`   Dropped ${item.rankDrop} positions: #${item.oldRank} → #${item.newRank}`);
        console.log(`   Volume: ${item.searchVolume.toLocaleString()} | Lost ${item.clicksLost} clicks/mo`);
        console.log(`   📞 SCRIPT: ${item.script}`);
      });
    }
    
    console.log("\n" + "=".repeat(80));
    console.log("NUGGET 6: Positive Momentum (Start with Compliment)");
    console.log("=".repeat(80));
    nuggets.nugget6.forEach((item, i) => {
      console.log(`\n${i + 1}. "${item.keyword}" (${item.type})`);
      if (item.improvement) {
        console.log(`   Improved ${item.improvement} positions → Now #${item.rank} | Volume: ${item.searchVolume.toLocaleString()}`);
      } else {
        console.log(`   New ranking at #${item.rank} | Volume: ${item.searchVolume.toLocaleString()}`);
      }
      console.log(`   📞 SCRIPT: ${item.script}`);
    });
    
    console.log("\n" + "=".repeat(80));
    console.log("NUGGET 7: Competitive Keywords (Opportunity Analysis)");
    console.log("=".repeat(80));
    nuggets.nugget7.forEach((item, i) => {
      console.log(`\n${i + 1}. "${item.keyword}"`);
      console.log(`   Your Rank: #${item.yourRank} | Competitors: ${item.competitors} | Volume: ${item.searchVolume.toLocaleString()} | CPC: $${item.cpc.toFixed(2)}`);
      console.log(`   📞 SCRIPT: ${item.script}`);
    });
    
    return { nuggets, rowsUsed, cost, keywords, gainedRanks, lostRanks, newlyRanked, fellOff };
    
  } catch (error) {
    console.error(`❌ Error analyzing ${domain}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("=".repeat(80));
  console.log("SPYFU DATA NUGGET COMPREHENSIVE ANALYSIS");
  console.log("=".repeat(80));
  
  const results = {};
  
  for (const [size, domain] of Object.entries(TEST_DOMAINS)) {
    const result = await analyzeAllNuggets(domain, size);
    if (result) {
      results[domain] = result;
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Final Summary
  console.log("\n\n" + "=".repeat(80));
  console.log("COST ANALYSIS SUMMARY");
  console.log("=".repeat(80));
  
  for (const [domain, data] of Object.entries(results)) {
    if (data) {
      console.log(`\n${domain}:`);
      console.log(`  Total Rows Used: ${data.rowsUsed}`);
      console.log(`  Total Cost: $${data.cost}`);
      console.log(`  Cost per Lead: $${data.cost} (assuming 1 API call = 1 lead)`);
    }
  }
}

main().catch(console.error);
