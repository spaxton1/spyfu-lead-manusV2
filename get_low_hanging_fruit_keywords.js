#!/usr/bin/env node

/**
 * LOW HANGING FRUIT MONEY KEYWORDS
 * 
 * Find high-value keywords ranking in positions 11-50 (top 5 pages)
 * These are close to Page 1 and have high CPC = easy optimization targets
 * 
 * Filters:
 * - Rank: 11-50 (Pages 2-5, close to Page 1)
 * - Search Volume: 10-50,000 (has actual traffic)
 * - CPC: $1-$1000 (high value keywords)
 * - Sort by: Exact CPC (highest value first)
 */

const https = require('https');
const fs = require('fs');

const API_KEY = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';

const domains = [
  'salemplasticsurgery.com',
  'aestheticinstitute.ie',
  'coppellwellness.com',
  'healthwestchiro.com',
  '100percentdoc.com',
  'axiominjury.com',
  'houstonbackandneck.com',
  'alignwc.com',
  'infinityspine.com',
  'painreliefkc.com'
];

function makeApiCall(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.spyfu.com',
      path: url,
      method: 'GET',
      headers: {
        'Authorization': API_KEY,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve({ success: true, data: JSON.parse(data) });
          } catch (e) {
            resolve({ success: false, error: 'Parse error: ' + e.message });
          }
        } else {
          resolve({ success: false, status: res.statusCode, error: data });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

async function getLowHangingFruitKeywords() {
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('LOW HANGING FRUIT MONEY KEYWORDS - Positions 11-50 with High CPC');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  const results = [];
  let totalCost = 0;

  for (const domain of domains) {
    console.log(`\n${'─'.repeat(79)}`);
    console.log(`Domain: ${domain}`);
    console.log('─'.repeat(79));

    try {
      // API call with filters: Rank 11-50, Volume 10-50K, CPC $1-1000, Sort by CPC
      const url = `/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}&searchVolume.min=10&searchVolume.max=50000&rank.min=11&rank.max=50&costPerClick.min=1&costPerClick.max=1000&costPerClickOption=Exact&pageSize=250&sortBy=ExactCostPerClick`;
      
      const result = await makeApiCall(url);

      if (result.success && result.data && result.data.results && Array.isArray(result.data.results)) {
        const keywords = result.data.results;
        const apiCost = (keywords.length / 1000) * 0.50;
        totalCost += apiCost;
        
        console.log(`✅ Found ${keywords.length} keywords`);
        console.log(`   API Cost: $${apiCost.toFixed(4)}`);
        
        if (keywords.length > 0) {
          // Show top 10 by CPC
          const top10 = keywords.slice(0, 10);
          
          console.log(`\n   📊 TOP 10 HIGHEST CPC KEYWORDS:\n`);
          top10.forEach((kw, idx) => {
            const cpc = kw.exactCostPerClick || kw.costPerClick || 0;
            const volume = kw.searchVolume || 0;
            const rank = kw.rank || 0;
            console.log(`   ${idx + 1}. "${kw.keyword}"`);
            console.log(`      Rank: #${rank} | CPC: $${cpc.toFixed(2)} | Volume: ${volume}/mo`);
          });
          
          // Calculate potential value if moved to Page 1
          const totalPotentialValue = top10.reduce((sum, kw) => {
            const cpc = kw.exactCostPerClick || kw.costPerClick || 0;
            const volume = kw.searchVolume || 0;
            // Assume 5% CTR on Page 1 (conservative)
            const potentialClicks = volume * 0.05;
            return sum + (potentialClicks * cpc);
          }, 0);
          
          console.log(`\n   💰 POTENTIAL VALUE (if top 10 moved to Page 1):`);
          console.log(`      $${Math.round(totalPotentialValue).toLocaleString()}/month in additional traffic`);
        }
        
        results.push({
          domain,
          totalKeywords: keywords.length,
          keywords: keywords,
          apiCost: apiCost
        });
        
      } else {
        console.log('❌ No keywords found');
        if (result.status) {
          console.log(`   Status: ${result.status}`);
        }
        if (result.error) {
          console.log(`   Error: ${result.error.substring(0, 100)}`);
        }
        
        results.push({
          domain,
          totalKeywords: 0,
          keywords: [],
          apiCost: 0
        });
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      results.push({
        domain,
        totalKeywords: 0,
        keywords: [],
        apiCost: 0
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save results
  fs.writeFileSync('low_hanging_fruit_keywords.json', JSON.stringify(results, null, 2));
  console.log('\n\n✅ Full report saved: low_hanging_fruit_keywords.json');

  // Summary
  console.log('\n\n' + '═'.repeat(79));
  console.log('API COST SUMMARY');
  console.log('═'.repeat(79));
  console.log(`Total keywords found: ${results.reduce((sum, r) => sum + r.totalKeywords, 0)}`);
  console.log(`Total API cost: $${totalCost.toFixed(4)}`);
  console.log(`Average per domain: $${(totalCost / domains.length).toFixed(4)}`);
  
  // Top opportunities
  const domainsWithKeywords = results.filter(r => r.totalKeywords > 0);
  if (domainsWithKeywords.length > 0) {
    console.log(`\nDomains with opportunities: ${domainsWithKeywords.length} of ${domains.length}`);
    domainsWithKeywords.forEach(r => {
      console.log(`  ${r.domain}: ${r.totalKeywords} keywords ($${r.apiCost.toFixed(4)})`);
    });
  }

  console.log('\n' + '═'.repeat(79));
}

getLowHangingFruitKeywords()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
