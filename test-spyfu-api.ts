/**
 * Test SpyFu API Client with real API call
 * Run with: npx tsx test-spyfu-api.ts
 * 
 * IMPORTANT: This uses real API credits!
 * - 1 domain × 4 APIs = 4 API credits
 * - Cost: ~$0.17 for full tier test
 */

import { createSpyFuClient } from './src/services/spyfu-api';

// API Key from documentation
const API_KEY = 'MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';

async function testSpyFuApi() {
  console.log('🧪 Testing SpyFu API Client\n');
  console.log('⚠️  WARNING: This test uses REAL API credits!');
  console.log('   Testing with 1 domain = 4 API calls = ~$0.17\n');

  const client = createSpyFuClient(API_KEY);
  const testDomain = 'poolsbybradley.com'; // Known working domain from tests (~1,200 keywords)

  try {
    console.log(`Testing domain: ${testDomain}`);
    console.log('─'.repeat(60));

    // Fetch all data (full tier)
    const result = await client.fetchAllData(testDomain, 'full');

    // Test 1: API #1 - Domain Stats
    console.log('\n✅ API #1 - Domain Stats:');
    if (result.domainStats) {
      const stats = result.domainStats;
      console.log(`   Domain: ${stats.domain}`);
      console.log(`   URL: ${stats.url}`);
      console.log(`   Total Organic Keywords: ${stats.totalOrganicResults.toLocaleString()}`);
      console.log(`   Monthly Organic Clicks: ${stats.monthlyOrganicClicks.toLocaleString()}`);
      console.log(`   Monthly Click Value: $${stats.monthlyOrganicClickValue.toLocaleString()}`);
      console.log(`   Total Search Volume: ${stats.totalSearchVolume.toLocaleString()}`);
    }

    // Test 2: API #2 - Page 1 Keywords
    console.log('\n✅ API #2 - All SEO Keywords:');
    if (result.page1Keywords?.results) {
      const keywords = result.page1Keywords.results;
      console.log(`   Total keywords: ${result.page1Keywords.resultCount.toLocaleString()}`);
      console.log(`   First 5 keywords:`);
      keywords.slice(0, 5).forEach((kw, i) => {
        const cpc = kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0;
        console.log(`     ${i + 1}. "${kw.keyword}" - Rank #${kw.rank} | CPC: $${cpc.toFixed(2)} | Vol: ${kw.searchVolume}`);
      });
    }

    // Test 3: API #3 - Money Keywords
    console.log('\n✅ API #3 - Most Valuable Keywords (High CPC):');
    if (result.moneyKeywords?.results) {
      const keywords = result.moneyKeywords.results;
      console.log(`   Total keywords: ${result.moneyKeywords.resultCount.toLocaleString()}`);
      console.log(`   Top 5 by value:`);
      keywords.slice(0, 5).forEach((kw, i) => {
        const cpc = kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0;
        console.log(`     ${i + 1}. "${kw.keyword}" - Rank #${kw.rank} | CPC: $${cpc.toFixed(2)} | Vol: ${kw.searchVolume}`);
      });
    }

    // Test 4: API #4 - Gained Ranks
    console.log('\n✅ API #4 - Gained Ranks (Improving Keywords):');
    if (result.gainedRanks?.results) {
      const keywords = result.gainedRanks.results;
      console.log(`   Total keywords: ${result.gainedRanks.resultCount.toLocaleString()}`);
      console.log(`   Top 5 improving keywords:`);
      keywords.slice(0, 5).forEach((kw, i) => {
        const change = kw.rankChange ? `+${Math.abs(kw.rankChange)}` : 'NEW';
        console.log(`     ${i + 1}. "${kw.keyword}" - Rank #${kw.rank} (${change}) | Vol: ${kw.searchVolume}`);
      });
    }

    console.log('\n─'.repeat(60));
    console.log('✅ All 4 APIs fetched successfully!');
    console.log(`   Domain: ${testDomain}`);
    console.log(`   API Credits Used: 4`);
    console.log(`   Cost: ~$0.17`);

    // Summary
    console.log('\n📊 Data Summary:');
    console.log(`   - Domain Stats: ${result.domainStats ? '✓' : '✗'}`);
    console.log(`   - All SEO Keywords: ${result.page1Keywords?.resultCount.toLocaleString() || 0} keywords`);
    console.log(`   - Money Keywords: ${result.moneyKeywords?.resultCount.toLocaleString() || 0} keywords`);
    console.log(`   - Gained Ranks: ${result.gainedRanks?.resultCount.toLocaleString() || 0} keywords`);

  } catch (error) {
    console.error('\n❌ SpyFu API Test Failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run test
testSpyFuApi();
