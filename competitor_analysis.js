#!/usr/bin/env node

/**
 * COMPETITOR ANALYSIS - SpyFu API Integration
 * 
 * Steps:
 * 1. Select best local keyword for each domain (highest CPC local, fallback to highest CPC)
 * 2. Fetch top 10 SERP competitors for each domain's best keyword
 * 3. Filter out social media and unwanted sites
 * 4. Run GetLatestDomainStats API for each competitor
 * 5. Generate competitor report with keywords, value, clicks, traffic
 */

const fs = require('fs');

// Load complete keyword analysis
const analysisData = require('./complete_keyword_analysis.json');

// Load city database for local detection
const cityDatabase = require('./us_cities_lookup.json');

// SpyFu API credentials
const API_KEY = 'MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';
const AUTH_HEADER = `Basic ${API_KEY}`;

// Social media and unwanted domains to filter out
const EXCLUDED_DOMAINS = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'linkedin.com',
  'youtube.com',
  'pinterest.com',
  'tiktok.com',
  'reddit.com',
  'quora.com',
  'wikipedia.org',
  'yelp.com',
  'yellowpages.com',
  'healthgrades.com',
  'vitals.com',
  'zocdoc.com',
  'realself.com',
  'webmd.com',
  'healthline.com',
  'medicalnewstoday.com',
  'mayoclinic.org'
];

// Location detection patterns (from complete_keyword_analysis.js)
const STATE_FULL_NAMES = /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/i;
const STATE_ABBREV = /\b(al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy)\b/i;
const GEOGRAPHIC_DESCRIPTOR_PATTERN = /\b(north|south|east|west|central|downtown|uptown)\s+(shore|side|end|coast)\b/i;
const ZIP_CODE_PATTERN = /\b\d{5}(?:-\d{4})?\b/;

function extractWords(keyword) {
  return keyword.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function hasLocalIdentifier(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  
  if (/\bnear\s+me\b/i.test(lowerKeyword)) return false;
  if (STATE_FULL_NAMES.test(lowerKeyword)) return true;
  if (STATE_ABBREV.test(lowerKeyword)) return true;
  if (ZIP_CODE_PATTERN.test(lowerKeyword)) return true;
  if (GEOGRAPHIC_DESCRIPTOR_PATTERN.test(lowerKeyword)) return true;
  
  const words = extractWords(keyword);
  for (const word of words) {
    if (cityDatabase.cities[word]) return true;
  }
  
  for (let i = 0; i < words.length - 1; i++) {
    const twoWords = `${words[i]} ${words[i + 1]}`;
    if (cityDatabase.cities[twoWords]) return true;
  }
  
  for (let i = 0; i < words.length - 2; i++) {
    const threeWords = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    if (cityDatabase.cities[threeWords]) return true;
  }
  
  return false;
}

/**
 * Step 1: Select best keyword for each domain
 * Priority: Highest CPC local keyword, fallback to highest CPC keyword
 */
function selectBestKeyword(domainData) {
  const allKeywords = [];
  
  // Collect all keywords from all sources
  if (domainData.page1Analysis) {
    if (domainData.page1Analysis.top10CPC) {
      allKeywords.push(...domainData.page1Analysis.top10CPC);
    }
    if (domainData.page1Analysis.top10Local) {
      allKeywords.push(...domainData.page1Analysis.top10Local);
    }
  }
  
  if (domainData.moneyKeywordsAnalysis) {
    if (domainData.moneyKeywordsAnalysis.top5Money) {
      allKeywords.push(...domainData.moneyKeywordsAnalysis.top5Money);
    }
    if (domainData.moneyKeywordsAnalysis.top3Local) {
      allKeywords.push(...domainData.moneyKeywordsAnalysis.top3Local);
    }
  }
  
  if (allKeywords.length === 0) return null;
  
  // First try: Find highest CPC local keyword
  const localKeywords = allKeywords.filter(kw => hasLocalIdentifier(kw.keyword) && kw.cpc > 0);
  if (localKeywords.length > 0) {
    localKeywords.sort((a, b) => b.cpc - a.cpc);
    return {
      keyword: localKeywords[0].keyword,
      cpc: localKeywords[0].cpc,
      volume: localKeywords[0].volume,
      rank: localKeywords[0].rank,
      isLocal: true
    };
  }
  
  // Fallback: Find highest CPC keyword (any)
  const keywordsWithCPC = allKeywords.filter(kw => kw.cpc > 0);
  if (keywordsWithCPC.length > 0) {
    keywordsWithCPC.sort((a, b) => b.cpc - a.cpc);
    return {
      keyword: keywordsWithCPC[0].keyword,
      cpc: keywordsWithCPC[0].cpc,
      volume: keywordsWithCPC[0].volume,
      rank: keywordsWithCPC[0].rank,
      isLocal: false
    };
  }
  
  return null;
}

/**
 * Step 2: Fetch SERP competitors for a keyword
 */
async function fetchSerpCompetitors(keyword) {
  const encodedKeyword = encodeURIComponent(keyword);
  const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getSerpAnalysisKeywords?Keyword=${encodedKeyword}&pageSize=10`;
  
  console.log(`   Fetching SERP data for: "${keyword}"`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': AUTH_HEADER,
        'accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`   ❌ API Error: ${response.status} ${response.statusText}`);
      console.error(`   Error details: ${errorText}`);
      return [];
    }
    
    const data = await response.json();
    
    // Extract competitor domains from SERP results
    const competitors = [];
    if (data.results && Array.isArray(data.results)) {
      for (const result of data.results) {
        if (result.domain) {
          competitors.push(result.domain);
        }
      }
    }
    
    console.log(`   Found ${competitors.length} SERP competitors`);
    return competitors;
  } catch (error) {
    console.error(`   ❌ Fetch Error: ${error.message}`);
    return [];
  }
}

/**
 * Step 3: Filter out social media and unwanted sites
 */
function filterCompetitors(competitors, originalDomain) {
  const filtered = competitors.filter(domain => {
    const lowerDomain = domain.toLowerCase();
    
    // Remove original domain
    if (lowerDomain === originalDomain.toLowerCase()) return false;
    
    // Remove excluded domains
    for (const excluded of EXCLUDED_DOMAINS) {
      if (lowerDomain.includes(excluded.toLowerCase())) return false;
    }
    
    return true;
  });
  
  console.log(`   Filtered: ${competitors.length} → ${filtered.length} (removed ${competitors.length - filtered.length})`);
  return filtered;
}

/**
 * Step 4: Get domain stats for a competitor
 */
async function getDomainStats(domain) {
  const url = `https://api.spyfu.com/apis/domain_stats_api/v2/getLatestDomainStats?domain=${encodeURIComponent(domain)}`;
  
  console.log(`      Fetching stats for: ${domain}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': AUTH_HEADER,
        'accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`      ❌ API Error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (!data || !data.results || data.results.length === 0) {
      console.log(`      ⚠️  No data returned`);
      return null;
    }
    
    // Get the most recent month (first result)
    const stats = data.results[0];
    
    return {
      domain: domain,
      keywords: stats.totalOrganicResults || 0,
      value: stats.monthlyOrganicValue || 0,
      clicks: stats.monthlyOrganicClicks || 0,
      traffic: stats.monthlyOrganicClicks || 0,
      authority: stats.strength || 0,
      avgRank: stats.averageOrganicRank || 0,
      searchMonth: stats.searchMonth,
      searchYear: stats.searchYear
    };
  } catch (error) {
    console.error(`      ❌ Fetch Error: ${error.message}`);
    return null;
  }
}

/**
 * Main execution
 */
async function analyzeCompetitors() {
  console.log('🎯 COMPETITOR ANALYSIS - SpyFu API Integration');
  console.log('═'.repeat(80));
  console.log();
  
  const results = [];
  
  for (const domainData of analysisData.results) {
    const domain = domainData.domain;
    
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`🏢 ANALYZING: ${domain}`);
    console.log('═'.repeat(80));
    
    // Step 1: Select best keyword
    const bestKeyword = selectBestKeyword(domainData);
    
    if (!bestKeyword) {
      console.log(`❌ No keywords available - skipping domain\n`);
      continue;
    }
    
    console.log(`\n✅ Best Keyword Selected:`);
    console.log(`   Keyword: "${bestKeyword.keyword}"`);
    console.log(`   CPC: $${bestKeyword.cpc.toFixed(2)}`);
    console.log(`   Volume: ${bestKeyword.volume}`);
    console.log(`   Rank: #${bestKeyword.rank}`);
    console.log(`   Type: ${bestKeyword.isLocal ? '📍 LOCAL' : '💰 MONEY'}`);
    console.log();
    
    // Step 2: Fetch SERP competitors
    const serpCompetitors = await fetchSerpCompetitors(bestKeyword.keyword);
    
    if (serpCompetitors.length === 0) {
      console.log(`   ⚠️  No competitors found - skipping`);
      continue;
    }
    
    // Step 3: Filter competitors
    const filteredCompetitors = filterCompetitors(serpCompetitors, domain);
    
    if (filteredCompetitors.length === 0) {
      console.log(`   ⚠️  All competitors filtered out - skipping`);
      continue;
    }
    
    console.log();
    console.log(`📊 Fetching Stats for ${filteredCompetitors.length} Competitors...`);
    console.log();
    
    // Step 4: Get stats for each competitor
    const competitorStats = [];
    for (const competitorDomain of filteredCompetitors) {
      const stats = await getDomainStats(competitorDomain);
      if (stats && stats.keywords > 0) {
        competitorStats.push(stats);
        console.log(`      ✅ ${stats.domain}: ${stats.keywords} KWs | $${stats.value.toFixed(0)} | ${stats.clicks} Clicks`);
      }
      
      // Rate limiting - wait 200ms between API calls
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log();
    console.log(`✅ Found ${competitorStats.length} competitors with data`);
    
    // Sort by traffic value (descending)
    competitorStats.sort((a, b) => b.value - a.value);
    
    results.push({
      domain: domain,
      bestKeyword: bestKeyword,
      totalCompetitorsFound: serpCompetitors.length,
      competitorsAfterFilter: filteredCompetitors.length,
      competitorsWithData: competitorStats.length,
      competitors: competitorStats
    });
  }
  
  // Save results
  const outputFile = './competitor_analysis_results.json';
  fs.writeFileSync(
    outputFile,
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      description: 'Competitor analysis using SERP data and domain stats',
      apiEndpoints: {
        serp: 'https://api.spyfu.com/apis/serp_api/v2/seo/getSerpAnalysisKeywords',
        domainStats: 'https://api.spyfu.com/apis/domain_stats_api/v2/getLatestDomainStats'
      },
      excludedDomains: EXCLUDED_DOMAINS,
      results: results
    }, null, 2)
  );
  
  // Display summary
  console.log(`\n\n${'═'.repeat(80)}`);
  console.log('📊 COMPETITOR ANALYSIS SUMMARY');
  console.log('═'.repeat(80));
  console.log();
  
  for (const result of results) {
    console.log(`\n🏢 ${result.domain}`);
    console.log(`   Best Keyword: "${result.bestKeyword.keyword}" ($${result.bestKeyword.cpc.toFixed(2)} CPC)`);
    console.log(`   Competitors Found: ${result.competitorsWithData}`);
    console.log();
    
    if (result.competitors.length > 0) {
      console.log(`   TOP 5 COMPETITORS:\n`);
      result.competitors.slice(0, 5).forEach((comp, idx) => {
        const domainStr = comp.domain.padEnd(40);
        const kwStr = comp.keywords.toString().padStart(5);
        const valueStr = `$${comp.value.toFixed(0)}`.padStart(8);
        const clicksStr = comp.clicks.toString().padStart(5);
        console.log(`   ${idx + 1}. ${domainStr} | ${kwStr} KWs | ${valueStr} Value | ${clicksStr} Clicks`);
      });
    }
  }
  
  console.log(`\n\n${'═'.repeat(80)}`);
  console.log(`✅ Analysis complete!`);
  console.log(`📁 Saved to: ${outputFile}`);
  console.log(`📊 Domains analyzed: ${results.length}`);
  console.log('═'.repeat(80));
  console.log();
}

// Run the analysis
analyzeCompetitors().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
