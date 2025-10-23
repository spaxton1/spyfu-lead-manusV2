#!/usr/bin/env node

/**
 * Verify ranking drop/gain logic is correct
 */

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const BASE_URL = "https://api.spyfu.com/apis/serp_api/v2/seo";

async function testRankingLogic() {
  console.log("=".repeat(80));
  console.log("VERIFYING RANKING DROP/GAIN LOGIC");
  console.log("=".repeat(80));
  
  // Test with small domain
  const domain = "viridisenergy.com";
  
  console.log(`\nTesting domain: ${domain}`);
  
  // Get lost ranks
  const lostUrl = `${BASE_URL}/getLostRanksKeywords?query=${domain}&pageSize=10`;
  const lostResponse = await fetch(lostUrl, {
    headers: { "Authorization": API_KEY }
  });
  const lostData = await lostResponse.json();
  const lostKeywords = lostData.results || [];
  
  console.log(`\n${"=".repeat(80)}`);
  console.log("LOST RANKS (Should show WORSE rankings - higher numbers)");
  console.log("=".repeat(80));
  
  lostKeywords.slice(0, 5).forEach((kw, i) => {
    const currentRank = kw.rank;
    const rankChange = kw.rankChange;
    const oldRank = currentRank - rankChange;
    
    console.log(`\n${i + 1}. "${kw.keyword}"`);
    console.log(`   Current Rank: #${currentRank}`);
    console.log(`   Rank Change: ${rankChange}`);
    console.log(`   Old Rank: #${oldRank}`);
    console.log(`   Direction: ${oldRank} → ${currentRank}`);
    console.log(`   Analysis: ${currentRank > oldRank ? '✅ CORRECT - This is a DROP (got worse)' : '❌ WRONG - This is a GAIN (got better)'}`);
    console.log(`   Search Volume: ${kw.searchVolume}`);
    console.log(`   Clicks Change: ${kw.seoClicksChange}`);
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get gained ranks
  const gainedUrl = `${BASE_URL}/getGainedRanksKeywords?query=${domain}&pageSize=10`;
  const gainedResponse = await fetch(gainedUrl, {
    headers: { "Authorization": API_KEY }
  });
  const gainedData = await gainedResponse.json();
  const gainedKeywords = gainedData.results || [];
  
  console.log(`\n\n${"=".repeat(80)}`);
  console.log("GAINED RANKS (Should show BETTER rankings - lower numbers)");
  console.log("=".repeat(80));
  
  gainedKeywords.slice(0, 5).forEach((kw, i) => {
    const currentRank = kw.rank;
    const rankChange = kw.rankChange;
    const oldRank = currentRank - rankChange;
    
    console.log(`\n${i + 1}. "${kw.keyword}"`);
    console.log(`   Current Rank: #${currentRank}`);
    console.log(`   Rank Change: ${rankChange}`);
    console.log(`   Old Rank: #${oldRank}`);
    console.log(`   Direction: ${oldRank} → ${currentRank}`);
    console.log(`   Analysis: ${currentRank < oldRank ? '✅ CORRECT - This is a GAIN (got better)' : '❌ WRONG - This is a DROP (got worse)'}`);
    console.log(`   Search Volume: ${kw.searchVolume}`);
    console.log(`   Clicks Change: ${kw.seoClicksChange}`);
  });
  
  console.log(`\n\n${"=".repeat(80)}`);
  console.log("RANKING LOGIC EXPLANATION");
  console.log("=".repeat(80));
  console.log(`
In SEO:
  - Lower rank number = BETTER (e.g., #1 is best position)
  - Higher rank number = WORSE (e.g., #100 is bad position)

API Fields:
  - rank: Current position
  - rankChange: The change value
  
Calculation:
  - oldRank = currentRank - rankChange
  
Examples:
  If rankChange = +20 (positive):
    currentRank = 30, oldRank = 30 - 20 = 50
    Result: 50 → 30 = IMPROVED (moved up 20 spots) ✅
  
  If rankChange = -20 (negative):
    currentRank = 50, oldRank = 50 - (-20) = 30
    Result: 30 → 50 = DROPPED (moved down 20 spots) ✅

For getLostRanksKeywords:
  - rankChange should be NEGATIVE
  - currentRank should be HIGHER than oldRank
  - This means they got WORSE (dropped down the page)

For getGainedRanksKeywords:
  - rankChange should be POSITIVE
  - currentRank should be LOWER than oldRank
  - This means they got BETTER (moved up the page)
  `);
}

testRankingLogic().catch(console.error);
