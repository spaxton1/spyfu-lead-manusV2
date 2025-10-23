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

async function getFellOffKeywords() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('KEYWORDS THAT FELL OFF PAGE 1 - LAST MONTH');
  console.log('API: getJustFellOffKeywords (positions that dropped from 1-10 to 11+)');
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
        const rows = result.data.results ? result.data.results.length : 0;
        const cost = (rows / 1000) * 0.50;
        totalCost += cost;

        console.log(`✅ SUCCESS | ${rows} keywords fell off Page 1 | $${cost.toFixed(4)} API Cost`);

        if (rows > 0) {
          console.log('\nKeywords That Fell Off Page 1:');
          console.log('Keyword | Previous Rank | Current Rank | Search Volume | CPC');
          console.log('--------|---------------|--------------|---------------|-----');

          // Show first 15 keywords
          const displayLimit = Math.min(rows, 15);
          result.data.results.slice(0, displayLimit).forEach(kw => {
            const keyword = kw.keyword.substring(0, 45).padEnd(45);
            
            // Calculate previous rank: currentRank - rankChange
            // rankChange is negative when rank dropped (e.g., -6 means dropped 6 positions)
            const currentRank = kw.rank || 0;
            const rankChange = kw.rankChange || 0;
            const previousRank = currentRank - rankChange; // e.g., 13 - (-6) = 7
            
            const prevRankStr = String(previousRank || 'N/A').padStart(13);
            const currentRankStr = String(currentRank || 'N/A').padStart(12);
            const searchVol = String(kw.searchVolume || 0).padStart(13);
            const cpc = kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0;
            
            console.log(`${keyword} | ${prevRankStr} | ${currentRankStr} | ${searchVol} | $${cpc.toFixed(2)}`);
          });

          if (rows > 15) {
            console.log(`\n... and ${rows - 15} more keywords fell off Page 1`);
          }

          // Store all keywords for this domain
          fellOffReport.push({
            domain: domain,
            fellOffCount: rows,
            apiCost: cost,
            keywords: result.data.results.map(kw => {
              // Calculate previous rank: currentRank - rankChange
              const currentRank = kw.rank || null;
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
          console.log('✅ GOOD NEWS! No keywords fell off Page 1 last month');
          
          fellOffReport.push({
            domain: domain,
            fellOffCount: 0,
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
          fellOffCount: 0,
          apiCost: 0,
          error: `API returned status ${result.status}`,
          keywords: []
        });
      }

    } catch (error) {
      console.log(`❌ ERROR | ${error.message}`);
      
      fellOffReport.push({
        domain: domain,
        fellOffCount: 0,
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
  fs.writeFileSync('fell_off_keywords_report.json', JSON.stringify(fellOffReport, null, 2));
  console.log('\n\n✅ JSON report saved: fell_off_keywords_report.json');

  // Create CSV
  let csvContent = 'Domain,Fell Off Count,API Cost,Keyword,Previous Rank,Current Rank,Rank Change,Search Volume,CPC,SEO Clicks,SEO Clicks Change\n';
  
  fellOffReport.forEach(domain => {
    if (domain.keywords && domain.keywords.length > 0) {
      domain.keywords.forEach(kw => {
        const escapedKeyword = `"${kw.keyword.replace(/"/g, '""')}"`;
        csvContent += `${domain.domain},${domain.fellOffCount},$${domain.apiCost.toFixed(4)},${escapedKeyword},${kw.previousRank || 'N/A'},${kw.currentRank || 'N/A'},${kw.rankChange},${kw.searchVolume},$${kw.cpc.toFixed(2)},${kw.seoClicks},${kw.seoClicksChange}\n`;
      });
    } else {
      csvContent += `${domain.domain},0,$${domain.apiCost.toFixed(4)},"(No keywords fell off)",N/A,N/A,0,0,$0.00,0,0\n`;
    }
  });

  fs.writeFileSync('fell_off_keywords_report.csv', csvContent);
  console.log('✅ CSV report saved: fell_off_keywords_report.csv\n');

  // Summary statistics
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('SUMMARY STATISTICS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Domain                          | Fell Off | API Cost');
  console.log('--------------------------------|----------|----------');
  
  let totalFellOff = 0;
  fellOffReport.forEach(domain => {
    const domainName = domain.domain.padEnd(31);
    const fellOff = String(domain.fellOffCount).padStart(8);
    const cost = `$${domain.apiCost.toFixed(4)}`.padStart(9);
    console.log(`${domainName} | ${fellOff} | ${cost}`);
    totalFellOff += domain.fellOffCount;
  });

  console.log('--------------------------------|----------|----------');
  console.log(`${'TOTALS'.padEnd(31)} | ${String(totalFellOff).padStart(8)} | $${totalCost.toFixed(4).padStart(8)}`);

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('KEY INSIGHTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Find domains with most losses
  const domainsWithLosses = fellOffReport
    .filter(d => d.fellOffCount > 0)
    .sort((a, b) => b.fellOffCount - a.fellOffCount);

  if (domainsWithLosses.length > 0) {
    console.log('🚨 Domains That Lost Rankings (Highest to Lowest):');
    domainsWithLosses.forEach((domain, index) => {
      console.log(`${index + 1}. ${domain.domain} - Lost ${domain.fellOffCount} keywords from Page 1`);
    });
  } else {
    console.log('✅ EXCELLENT! No domains lost rankings last month!');
  }

  console.log('\n💡 Cold Calling Angle:');
  console.log('   "I noticed you lost X keywords from Page 1 last month."');
  console.log('   "These were ranking in the top 10 and dropped to 11+."');
  console.log('   "Want to know which ones so we can recover them?"');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`TOTAL API COST: $${totalCost.toFixed(4)} for ${domains.length} domains`);
  console.log('═══════════════════════════════════════════════════════════════');
}

getFellOffKeywords()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
