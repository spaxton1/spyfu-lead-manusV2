const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";

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

function makeApiCall(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.spyfu.com',
      path: path,
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
  console.log('TRUE FELL-OFF KEYWORDS - WAS PAGE 1 (1-10), NOW PAGE 2+ (11+)');
  console.log('Using getJustFellOffKeywords API with filtering');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let totalCost = 0;
  const fellOffReport = [];

  for (const domain of domains) {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`DOMAIN: ${domain}`);
    console.log('═'.repeat(70));

    try {
      const path = `/apis/serp_api/v2/seo/getJustFellOffKeywords?query=${domain}&pageSize=500`;
      
      const result = await makeApiCall(path);

      if (result.success && result.status === 200) {
        const allResults = result.data.results || [];
        const rows = allResults.length;
        const cost = (rows / 1000) * 0.50;
        totalCost += cost;

        // Filter for TRUE fell-off: was Page 1 (1-10), now Page 2+ (11+)
        const trueFellOff = allResults.filter(kw => {
          const currRank = kw.rank || kw.currentRank || null;
          let prevRank = kw.previousRank || null;
          
          // Calculate previous rank if not provided
          if (!prevRank && kw.rankChange && currRank) {
            prevRank = currRank - kw.rankChange;
          }
          
          const wasPage1 = prevRank && prevRank >= 1 && prevRank <= 10;
          const isPage2Plus = currRank && currRank >= 11;
          
          return wasPage1 && isPage2Plus;
        });

        console.log(`✅ SUCCESS | ${rows} keywords analyzed | ${trueFellOff.length} TRUE fell-off | $${cost.toFixed(4)} API Cost`);

        if (trueFellOff.length > 0) {
          console.log('\nKeywords That TRULY Fell Off Page 1:');
          console.log('Keyword | Previous Rank | Current Rank | Volume | CPC');
          console.log('--------|---------------|--------------|--------|-----');

          // Show first 15 keywords
          const displayLimit = Math.min(trueFellOff.length, 15);
          trueFellOff.slice(0, displayLimit).forEach(kw => {
            const keyword = kw.keyword.substring(0, 45).padEnd(45);
            
            const currentRank = kw.rank || kw.currentRank || 0;
            const rankChange = kw.rankChange || 0;
            const previousRank = currentRank - rankChange;
            
            const prevRankStr = String(previousRank).padStart(13);
            const currentRankStr = String(currentRank).padStart(12);
            const searchVol = String(kw.searchVolume || 0).padStart(6);
            const cpc = kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0;
            
            console.log(`${keyword} | ${prevRankStr} | ${currentRankStr} | ${searchVol} | $${cpc.toFixed(2)}`);
          });

          if (trueFellOff.length > 15) {
            console.log(`\n... and ${trueFellOff.length - 15} more keywords truly fell off Page 1`);
          }

          // Store all TRUE fell-off keywords for this domain
          fellOffReport.push({
            domain: domain,
            totalAnalyzed: rows,
            trueFellOffCount: trueFellOff.length,
            apiCost: cost,
            keywords: trueFellOff.map(kw => {
              const currentRank = kw.rank || kw.currentRank || null;
              const rankChange = kw.rankChange || 0;
              const previousRank = currentRank ? currentRank - rankChange : null;
              
              return {
                keyword: kw.keyword,
                previousRank: previousRank,
                currentRank: currentRank,
                rankChange: rankChange,
                searchVolume: kw.searchVolume || 0,
                cpc: kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0,
                seoClicks: kw.seoClicks || 0,
                seoClicksChange: kw.seoClicksChange || 0
              };
            })
          });
        } else {
          console.log('❌ NO keywords truly fell off Page 1 (was 1-10, now 11+)');
          console.log(`   ${rows} keywords analyzed but none dropped FROM Page 1 TO Page 2+`);
          
          fellOffReport.push({
            domain: domain,
            totalAnalyzed: rows,
            trueFellOffCount: 0,
            apiCost: cost,
            keywords: []
          });
        }

      } else {
        console.log(`❌ FAILED | Status: ${result.status}`);
        if (result.error) {
          console.log(`Error: ${result.error.substring(0, 200)}`);
        }
        
        fellOffReport.push({
          domain: domain,
          totalAnalyzed: 0,
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
        totalAnalyzed: 0,
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
  const fs = require('fs');
  fs.writeFileSync('true_fell_off_keywords_report.json', JSON.stringify(fellOffReport, null, 2));
  console.log('\n\n✅ JSON report saved: true_fell_off_keywords_report.json');

  // Create CSV
  let csvContent = 'Domain,Total Analyzed,True Fell Off Count,API Cost,Keyword,Previous Rank,Current Rank,Rank Change,Search Volume,CPC,SEO Clicks,SEO Clicks Change\n';
  
  fellOffReport.forEach(domain => {
    if (domain.keywords && domain.keywords.length > 0) {
      domain.keywords.forEach(kw => {
        const escapedKeyword = `"${kw.keyword.replace(/"/g, '""')}"`;
        csvContent += `${domain.domain},${domain.totalAnalyzed},${domain.trueFellOffCount},$${domain.apiCost.toFixed(4)},${escapedKeyword},${kw.previousRank || 'N/A'},${kw.currentRank || 'N/A'},${kw.rankChange},${kw.searchVolume},$${kw.cpc.toFixed(2)},${kw.seoClicks},${kw.seoClicksChange}\n`;
      });
    } else {
      csvContent += `${domain.domain},${domain.totalAnalyzed},0,$${domain.apiCost.toFixed(4)},"(No keywords truly fell off)",N/A,N/A,0,0,$0.00,0,0\n`;
    }
  });

  fs.writeFileSync('true_fell_off_keywords_report.csv', csvContent);
  console.log('✅ CSV report saved: true_fell_off_keywords_report.csv\n');

  // Summary statistics
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('SUMMARY STATISTICS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Domain                          | Analyzed | True Fell Off | API Cost');
  console.log('--------------------------------|----------|---------------|----------');
  
  let totalAnalyzed = 0;
  let totalFellOff = 0;
  fellOffReport.forEach(domain => {
    const domainName = domain.domain.padEnd(31);
    const analyzed = String(domain.totalAnalyzed).padStart(8);
    const fellOff = String(domain.trueFellOffCount).padStart(13);
    const cost = `$${domain.apiCost.toFixed(4)}`.padStart(9);
    console.log(`${domainName} | ${analyzed} | ${fellOff} | ${cost}`);
    totalAnalyzed += domain.totalAnalyzed;
    totalFellOff += domain.trueFellOffCount;
  });

  console.log('--------------------------------|----------|---------------|----------');
  console.log(`${'TOTALS'.padEnd(31)} | ${String(totalAnalyzed).padStart(8)} | ${String(totalFellOff).padStart(13)} | $${totalCost.toFixed(4).padStart(8)}`);

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('KEY INSIGHTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Find domains with most TRUE losses
  const domainsWithLosses = fellOffReport
    .filter(d => d.trueFellOffCount > 0)
    .sort((a, b) => b.trueFellOffCount - a.trueFellOffCount);

  if (domainsWithLosses.length > 0) {
    console.log('🚨 Domains That TRULY Lost Page 1 Rankings (Highest to Lowest):');
    domainsWithLosses.forEach((domain, index) => {
      console.log(`${index + 1}. ${domain.domain} - Lost ${domain.trueFellOffCount} keywords from Page 1`);
      console.log(`   (${domain.totalAnalyzed} total keywords analyzed)`);
    });
  } else {
    console.log('❌ NO DOMAINS LOST RANKINGS FROM PAGE 1 TO PAGE 2+');
    console.log(`   ${totalAnalyzed} total keywords analyzed across all domains`);
    console.log('   All keyword changes were within Page 2+ rankings');
  }

  console.log('\n💡 Cold Calling Angle (if TRUE fell-off keywords exist):');
  console.log('   "I noticed you lost X keywords from Page 1 last month."');
  console.log('   "These were ranking in positions 1-10 and dropped to 11+."');
  console.log('   "Want to know which ones so we can recover them?"');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`TOTAL API COST: $${totalCost.toFixed(4)} for ${domains.length} domains`);
  console.log('═══════════════════════════════════════════════════════════════');
}

getTrueFellOffKeywords()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
