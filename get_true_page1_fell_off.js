#!/usr/bin/env node

/**
 * TRUE Page 1 Fell-Off Keywords Extractor
 * 
 * Uses the correct SpyFu API endpoint with query parameters
 * Returns keywords that were Page 1 (1-10) and now Page 2+ (11+) or not ranking
 */

const https = require('https');
const fs = require('fs');

const API_KEY = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';

// Same 10 domains as before
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
        try {
          const json = JSON.parse(data);
          resolve({ success: true, data: json, status: res.statusCode });
        } catch (e) {
          resolve({ success: false, error: data, status: res.statusCode });
        }
      });
    });
    
    req.on('error', (error) => reject(error));
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function getTrueFellOffKeywords() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('TRUE PAGE 1 FELL-OFF KEYWORDS ANALYSIS');
  console.log('API: getJustFellOffKeywords (query parameter format)');
  console.log('Filter: Keywords that WERE Page 1 (1-10), NOW Page 2+ (11+)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let totalCost = 0;
  const fellOffReport = [];

  for (const domain of domains) {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`DOMAIN: ${domain}`);
    console.log('═'.repeat(70));

    try {
      // Use new query parameter format
      const params = new URLSearchParams({
        query: domain,
        country: 'US',
        pageSize: '500',  // CRITICAL: Must specify pageSize (default is only 5!)
        page: '1'
      });
      
      const url = `/apis/serp_api/v2/seo/getJustFellOffKeywords?${params.toString()}`;
      const result = await makeApiCall(url);

      if (result.success && result.status === 200) {
        const allKeywords = result.data.results || [];
        const rows = allKeywords.length;
        const cost = (rows / 1000) * 0.50;
        totalCost += cost;

        // Calculate previousRank and filter for TRUE fell-off
        const keywordsWithPreviousRank = allKeywords.map(kw => {
          const currentRank = kw.rank || null;
          const rankChange = kw.rankChange || 0;
          
          // Calculate previous rank: currentRank - rankChange
          // If rankChange is negative, keyword dropped (got worse)
          // Example: rank=11, rankChange=-3 means previousRank = 11-(-3) = 14 (improved from 14 to 11)
          // Example: rank=15, rankChange=5 means previousRank = 15-5 = 10 (fell from 10 to 15)
          const previousRank = currentRank ? currentRank - rankChange : null;

          return {
            ...kw,
            previousRank: previousRank,
            currentRank: currentRank
          };
        });

        // Filter for TRUE Page 1 fell-off: previousRank 1-10, currentRank 11+
        const trueFellOff = keywordsWithPreviousRank.filter(kw => {
          const wasPage1 = kw.previousRank && kw.previousRank >= 1 && kw.previousRank <= 10;
          const isPage2Plus = kw.currentRank && kw.currentRank >= 11;
          return wasPage1 && isPage2Plus;
        });

        console.log(`✅ API returned ${rows} keywords | Cost: $${cost.toFixed(4)}`);
        console.log(`🎯 TRUE Page 1 fell-off: ${trueFellOff.length} keywords`);

        if (trueFellOff.length > 0) {
          console.log('\n📊 Keywords That TRULY Fell Off Page 1:\n');
          console.log('Keyword                                 | Prev | Curr | Change | Volume |   CPC   | Clicks Lost');
          console.log('----------------------------------------|------|------|--------|--------|---------|-------------');

          const displayLimit = Math.min(trueFellOff.length, 15);
          trueFellOff.slice(0, displayLimit).forEach(kw => {
            const keyword = kw.keyword.substring(0, 39).padEnd(39);
            const prevRank = `#${kw.previousRank}`.padStart(4);
            const currRank = `#${kw.currentRank}`.padStart(4);
            const change = String(kw.rankChange).padStart(6);
            const volume = String(kw.searchVolume || 0).padStart(6);
            const cpc = `$${(kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0).toFixed(2)}`.padStart(7);
            const clicksLost = String(kw.seoClicksChange || 0).padStart(11);
            
            console.log(`${keyword} | ${prevRank} | ${currRank} | ${change} | ${volume} | ${cpc} | ${clicksLost}`);
          });

          if (trueFellOff.length > 15) {
            console.log(`\n... and ${trueFellOff.length - 15} more TRUE fell-off keywords`);
          }
        } else {
          console.log('\n✅ GOOD NEWS! No keywords truly fell from Page 1 to Page 2+');
        }

        // Store results
        fellOffReport.push({
          domain: domain,
          totalKeywordsAnalyzed: rows,
          trueFellOffCount: trueFellOff.length,
          apiCost: cost,
          keywords: trueFellOff.map(kw => ({
            keyword: kw.keyword,
            previousRank: kw.previousRank,
            currentRank: kw.currentRank,
            rankChange: kw.rankChange,
            searchVolume: kw.searchVolume || 0,
            cpc: kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0,
            seoClicks: kw.seoClicks || 0,
            seoClicksChange: kw.seoClicksChange || 0,
            topRankedUrl: kw.topRankedUrl || '',
            keywordDifficulty: kw.keywordDifficulty || 0
          }))
        });

      } else {
        console.log(`❌ FAILED | Status: ${result.status}`);
        fellOffReport.push({
          domain: domain,
          totalKeywordsAnalyzed: 0,
          trueFellOffCount: 0,
          apiCost: 0,
          error: `API returned status ${result.status}`,
          keywords: []
        });
      }

    } catch (error) {
      console.log(`❌ ERROR | ${error.message}`);
      fellOffReport.push({
        domain: domain,
        totalKeywordsAnalyzed: 0,
        trueFellOffCount: 0,
        apiCost: 0,
        error: error.message,
        keywords: []
      });
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save JSON report
  fs.writeFileSync('true_page1_fell_off_report.json', JSON.stringify(fellOffReport, null, 2));
  console.log('\n\n✅ JSON report saved: true_page1_fell_off_report.json');

  // Create CSV
  let csvContent = 'Domain,Total Analyzed,TRUE Fell Off,API Cost,Keyword,Previous Rank,Current Rank,Rank Change,Search Volume,CPC,SEO Clicks,SEO Clicks Change,Keyword Difficulty,Top Ranked URL\n';
  
  fellOffReport.forEach(domain => {
    if (domain.keywords && domain.keywords.length > 0) {
      domain.keywords.forEach(kw => {
        const escapedKeyword = `"${kw.keyword.replace(/"/g, '""')}"`;
        const escapedUrl = `"${(kw.topRankedUrl || '').replace(/"/g, '""')}"`;
        csvContent += `${domain.domain},${domain.totalKeywordsAnalyzed},${domain.trueFellOffCount},$${domain.apiCost.toFixed(4)},${escapedKeyword},${kw.previousRank},${kw.currentRank},${kw.rankChange},${kw.searchVolume},$${kw.cpc.toFixed(2)},${kw.seoClicks},${kw.seoClicksChange},${kw.keywordDifficulty},${escapedUrl}\n`;
      });
    } else {
      csvContent += `${domain.domain},${domain.totalKeywordsAnalyzed},0,$${domain.apiCost.toFixed(4)},"(No TRUE fell-off keywords)",N/A,N/A,0,0,$0.00,0,0,0,""\n`;
    }
  });

  fs.writeFileSync('true_page1_fell_off_report.csv', csvContent);
  console.log('✅ CSV report saved: true_page1_fell_off_report.csv\n');

  // Summary statistics
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('SUMMARY STATISTICS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Domain                          | Analyzed | TRUE Fell Off | API Cost');
  console.log('--------------------------------|----------|---------------|----------');
  
  let totalAnalyzed = 0;
  let totalFellOff = 0;
  
  fellOffReport.forEach(domain => {
    const domainName = domain.domain.padEnd(31);
    const analyzed = String(domain.totalKeywordsAnalyzed).padStart(8);
    const fellOff = String(domain.trueFellOffCount).padStart(13);
    const cost = `$${domain.apiCost.toFixed(4)}`.padStart(9);
    console.log(`${domainName} | ${analyzed} | ${fellOff} | ${cost}`);
    totalAnalyzed += domain.totalKeywordsAnalyzed;
    totalFellOff += domain.trueFellOffCount;
  });

  console.log('--------------------------------|----------|---------------|----------');
  console.log(`${'TOTALS'.padEnd(31)} | ${String(totalAnalyzed).padStart(8)} | ${String(totalFellOff).padStart(13)} | $${totalCost.toFixed(4).padStart(8)}`);

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('KEY INSIGHTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Find domains with TRUE losses
  const domainsWithLosses = fellOffReport
    .filter(d => d.trueFellOffCount > 0)
    .sort((a, b) => b.trueFellOffCount - a.trueFellOffCount);

  if (domainsWithLosses.length > 0) {
    console.log('🚨 Domains That TRULY Lost Page 1 Rankings:');
    domainsWithLosses.forEach((domain, index) => {
      console.log(`${index + 1}. ${domain.domain} - ${domain.trueFellOffCount} keywords fell from Page 1 (1-10) to Page 2+ (11+)`);
    });
  } else {
    console.log('✅ EXCELLENT! No domains had TRUE Page 1 to Page 2+ drops!');
  }

  console.log('\n💡 Cold Calling Script:');
  console.log('   "Hi [NAME], I noticed your website dropped from position #[PREV] to');
  console.log('   #[CURR] for \'[KEYWORD]\' - that\'s [VOLUME] searches per month.');
  console.log('   You\'ve lost approximately [CLICKS_LOST] clicks monthly, which at');
  console.log('   $[CPC] per click means you\'re missing $[VALUE] in traffic."');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`TOTAL API COST: $${totalCost.toFixed(4)} for ${domains.length} domains`);
  console.log(`AVERAGE COST PER DOMAIN: $${(totalCost / domains.length).toFixed(4)}`);
  console.log('═══════════════════════════════════════════════════════════════');
}

getTrueFellOffKeywords()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
