#!/usr/bin/env node

/**
 * MASTER TEST SCRIPT - 18 DOMAINS
 * 
 * Runs ALL APIs from Page1_API_Data.md:
 * 1. 4-Month Domain Trends (Peak Decline Analysis)
 * 2. Page 1 Keywords (Rank 1-10)
 * 3. Money + Local Keywords (Rank 11-75)
 * 4. Top 5 Competitors (Domain Competitors API)
 * 5. Generate all comparison nuggets
 * 
 * Final Output: Complete report with mockups for all 18 domains
 */

const fs = require('fs');
const https = require('https');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// SpyFu API Key (Basic Auth already encoded)
const API_KEY = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';

// Test domains
const domains = [
  'rhmd.com',
  'diazplasticsurgery.com',
  'clinicatim.com',
  'drmotykie.com',
  'burbankplasticsurgery.com',
  'riveroakschiropractic.com',
  'northvalleychiro.com',
  'backpain-la.com',
  'anthonychiropractic.com',
  'drjamespadilla.com',
  'activateperformance.com',
  'spinetimechiropractic.com',
  'garagedoorsmore.com',
  'abbottdoorwny.com',
  'frenchporte.com',
  'overheaddoorwilmington.com',
  'aaaoverheaddoor.com',
  'simpsonfence.com',
  'preferred-fence.com'
];

// API request helper
function makeApiRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'accept': 'application/json',
        'Authorization': API_KEY
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse JSON: ' + e.message));
          }
        } else {
          reject(new Error(`API request failed with status ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 1. Get 4-Month Domain Trends
async function getDomainTrends(domain) {
  console.log(`  ${colors.cyan}→${colors.reset} Fetching 4-month domain trends...`);
  const url = `https://api.spyfu.com/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domain}&pastNMonths=4`;
  
  try {
    const data = await makeApiRequest(url);
    return data.results || [];
  } catch (err) {
    console.log(`    ${colors.red}✗${colors.reset} Error: ${err.message}`);
    return [];
  }
}

// 2. Get Page 1 Keywords (Rank 1-10)
async function getPage1Keywords(domain) {
  console.log(`  ${colors.cyan}→${colors.reset} Fetching Page 1 keywords (rank 1-10)...`);
  const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getSeoKeywords?query=${domain}&searchType=MostValuable&rank.min=1&rank.max=10&costPerClickOption=Exact&pageSize=1000&sortBy=Rank`;
  
  try {
    const data = await makeApiRequest(url);
    return data.results || [];
  } catch (err) {
    console.log(`    ${colors.red}✗${colors.reset} Error: ${err.message}`);
    return [];
  }
}

// 3. Get Money + Local Keywords (Rank 11-75)
async function getMoneyKeywords(domain) {
  console.log(`  ${colors.cyan}→${colors.reset} Fetching money keywords (rank 11-75)...`);
  const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}&searchVolume.min=10&searchVolume.max=50000&rank.min=11&rank.max=75&costPerClick.min=1&costPerClick.max=1000&costPerClickOption=Exact&pageSize=500&sortBy=ExactCostPerClick`;
  
  try {
    const data = await makeApiRequest(url);
    return data.results || [];
  } catch (err) {
    console.log(`    ${colors.red}✗${colors.reset} Error: ${err.message}`);
    return [];
  }
}

// 4. Get Top 5 Competitors
async function getCompetitors(domain) {
  console.log(`  ${colors.cyan}→${colors.reset} Fetching domain competitors...`);
  const url = `https://api.spyfu.com/apis/domain_api/v2/get_domain_competitors?domain=${domain}&costPerClickOption=Exact`;
  
  try {
    const data = await makeApiRequest(url);
    return data.results || [];
  } catch (err) {
    console.log(`    ${colors.red}✗${colors.reset} Error: ${err.message}`);
    return [];
  }
}

// Calculate costs
function calculateCosts(trendMonths, page1Keywords, moneyKeywords, competitorCount) {
  const trendCost = (trendMonths * 0.50) / 1000;
  const page1Cost = (page1Keywords * 0.50) / 1000;
  const moneyCost = (moneyKeywords * 0.50) / 1000;
  const compCost = (competitorCount * 0.50) / 1000;
  
  return {
    trend: trendCost,
    page1: page1Cost,
    money: moneyCost,
    competitors: compCost,
    total: trendCost + page1Cost + moneyCost + compCost
  };
}

// Format numbers
function formatNum(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${Math.round(num / 1000)}K`;
  return Math.round(num).toString();
}

// Main test execution
async function runTest() {
  console.log(`\n${colors.bright}${colors.cyan}${'═'.repeat(100)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}                    🚀 MASTER TEST - 18 DOMAINS - ALL APIS${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'═'.repeat(100)}${colors.reset}\n`);

  const results = [];
  let totalCost = 0;

  for (let i = 0; i < domains.length; i++) {
    const domain = domains[i];
    console.log(`\n${colors.bright}${colors.yellow}[${i + 1}/${domains.length}] ${domain.toUpperCase()}${colors.reset}`);
    console.log(`${'─'.repeat(100)}`);

    try {
      // 1. Get 4-Month Trends
      const trends = await getDomainTrends(domain);
      console.log(`    ${colors.green}✓${colors.reset} Trends: ${trends.length} months`);

      // 2. Get Page 1 Keywords
      const page1Keywords = await getPage1Keywords(domain);
      console.log(`    ${colors.green}✓${colors.reset} Page 1: ${page1Keywords.length} keywords`);

      // 3. Get Money Keywords
      const moneyKeywords = await getMoneyKeywords(domain);
      console.log(`    ${colors.green}✓${colors.reset} Money: ${moneyKeywords.length} keywords`);

      // 4. Get Competitors (skip - endpoint not available)
      const competitors = [];
      console.log(`    ${colors.yellow}⊘${colors.reset} Competitors: Skipped (endpoint not available)`);

      // Calculate costs
      const costs = calculateCosts(trends.length, page1Keywords.length, moneyKeywords.length, 0);
      totalCost += costs.total;

      console.log(`    ${colors.yellow}$${colors.reset} Cost: $${costs.total.toFixed(4)}`);

      // Store results
      results.push({
        domain,
        trends,
        page1Keywords,
        moneyKeywords,
        competitors: competitors.slice(0, 5), // Top 5 only
        costs
      });

      // Rate limiting - wait 1 second between domains
      if (i < domains.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (err) {
      console.log(`    ${colors.red}✗ Error processing ${domain}: ${err.message}${colors.reset}`);
      results.push({
        domain,
        error: err.message,
        costs: { total: 0 }
      });
    }
  }

  // Save results
  const outputData = {
    generatedAt: new Date().toISOString(),
    totalDomains: domains.length,
    totalCost: totalCost,
    results
  };

  fs.writeFileSync('./master_test_results.json', JSON.stringify(outputData, null, 2));

  // Summary
  console.log(`\n${colors.bright}${colors.green}${'═'.repeat(100)}${colors.reset}`);
  console.log(`${colors.bright}${colors.green}✅ TEST COMPLETE${colors.reset}`);
  console.log(`${colors.bright}${colors.green}${'═'.repeat(100)}${colors.reset}\n`);
  console.log(`${colors.cyan}Total Domains:${colors.reset}    ${domains.length}`);
  console.log(`${colors.cyan}Total API Cost:${colors.reset}   $${totalCost.toFixed(4)}`);
  console.log(`${colors.cyan}Avg Cost/Domain:${colors.reset} $${(totalCost / domains.length).toFixed(4)}`);
  console.log(`${colors.cyan}Output File:${colors.reset}      ./master_test_results.json\n`);
  console.log(`${colors.yellow}Next step: Run generate_master_report.js to create visual mockups${colors.reset}\n`);
}

// Run the test
runTest().catch(err => {
  console.error(`${colors.red}Fatal error: ${err.message}${colors.reset}`);
  process.exit(1);
});
