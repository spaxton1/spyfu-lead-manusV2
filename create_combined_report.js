const https = require('https');
const fs = require('fs');

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

async function getCombinedReport() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('COMBINED REPORT - DOMAIN STATS + TOP 10 KEYWORDS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let totalCost = 0;
  let csvContent = 'Domain,Total Keywords,Top 10 KW Count,Monthly Organic Value,Monthly Organic Clicks,Monthly PPC Budget,Monthly PPC Clicks,Organic Competitors,Paid Competitors,Domain Stats API Cost,Keywords API Cost,Total API Cost,Keyword,Rank,Traffic,CPC\n';
  
  const domainReports = [];

  for (const domain of domains) {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`PROCESSING: ${domain}`);
    console.log('═'.repeat(70));

    try {
      // 1. Get Domain Stats
      const statsPath = `/apis/domain_stats_api/v2/getLatestDomainStats?domain=${domain}`;
      const statsResult = await makeApiCall(statsPath);
      
      let domainStats = {
        domain: domain,
        totalKeywords: 0,
        monthlyOrganicValue: 0,
        monthlyOrganicClicks: 0,
        monthlyPPCBudget: 0,
        monthlyPPCClicks: 0,
        organicCompetitors: 0,
        paidCompetitors: 0,
        domainStatsApiCost: 0
      };

      if (statsResult.success && statsResult.data.results && statsResult.data.results[0]) {
        const stats = statsResult.data.results[0];
        const rows = statsResult.data.results.length;
        const cost = (rows / 1000) * 0.50;
        totalCost += cost;

        domainStats = {
          domain: domain,
          totalKeywords: stats.totalOrganicResults || 0,
          monthlyOrganicValue: stats.monthlyOrganicValue || 0,
          monthlyOrganicClicks: Math.round(stats.monthlyOrganicClicks || 0),
          monthlyPPCBudget: stats.monthlyAdwordsBudget || 0,
          monthlyPPCClicks: Math.round(stats.monthlyAdwordsClicks || 0),
          organicCompetitors: stats.organicCompetitorsCount || 0,
          paidCompetitors: stats.adwordsCompetitorsCount || 0,
          domainStatsApiCost: cost
        };

        console.log('✅ Domain Stats Retrieved');
        console.log(`   Total Keywords: ${domainStats.totalKeywords}`);
        console.log(`   Monthly Value: $${domainStats.monthlyOrganicValue.toFixed(2)}`);
        console.log(`   API Cost: $${cost.toFixed(4)}`);
      } else {
        console.log('⚠️  No Domain Stats Available');
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // 2. Get Top 10 Keywords
      const keywordsPath = `/apis/serp_api/v2/seo/getSeoKeywords?query=${domain}&searchType=MostValuable&rank.min=1&rank.max=10&costPerClickOption=Exact&pageSize=1000&sortBy=Rank`;
      const keywordsResult = await makeApiCall(keywordsPath);

      let keywords = [];
      let keywordsApiCost = 0;

      if (keywordsResult.success && keywordsResult.data.results) {
        const rows = keywordsResult.data.results.length;
        keywordsApiCost = (rows / 1000) * 0.50;
        totalCost += keywordsApiCost;

        keywords = keywordsResult.data.results.map(kw => ({
          keyword: kw.keyword,
          rank: kw.rank || kw.ranking || 'N/A',
          traffic: kw.searchVolume || 0,
          cpc: kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0
        }));

        console.log('✅ Top 10 Keywords Retrieved');
        console.log(`   Keyword Count: ${keywords.length}`);
        console.log(`   API Cost: $${keywordsApiCost.toFixed(4)}`);
      } else {
        console.log('⚠️  No Keywords Found in Top 10');
      }

      // Store complete report
      const domainReport = {
        ...domainStats,
        top10KeywordCount: keywords.length,
        keywordsApiCost: keywordsApiCost,
        totalApiCost: domainStats.domainStatsApiCost + keywordsApiCost,
        keywords: keywords
      };

      domainReports.push(domainReport);

      // Add to CSV
      if (keywords.length > 0) {
        keywords.forEach(kw => {
          const escapedKeyword = `"${kw.keyword.replace(/"/g, '""')}"`;
          csvContent += `${domain},${domainStats.totalKeywords},${keywords.length},$${domainStats.monthlyOrganicValue.toFixed(2)},${domainStats.monthlyOrganicClicks},$${domainStats.monthlyPPCBudget.toFixed(2)},${domainStats.monthlyPPCClicks},${domainStats.organicCompetitors},${domainStats.paidCompetitors},$${domainStats.domainStatsApiCost.toFixed(4)},$${keywordsApiCost.toFixed(4)},$${domainReport.totalApiCost.toFixed(4)},${escapedKeyword},${kw.rank},${kw.traffic},$${kw.cpc.toFixed(2)}\n`;
        });
      } else {
        csvContent += `${domain},${domainStats.totalKeywords},0,$${domainStats.monthlyOrganicValue.toFixed(2)},${domainStats.monthlyOrganicClicks},$${domainStats.monthlyPPCBudget.toFixed(2)},${domainStats.monthlyPPCClicks},${domainStats.organicCompetitors},${domainStats.paidCompetitors},$${domainStats.domainStatsApiCost.toFixed(4)},$${keywordsApiCost.toFixed(4)},$${domainReport.totalApiCost.toFixed(4)},"(No keywords in top 10)",N/A,0,$0.00\n`;
      }

      console.log(`💰 Total Cost for ${domain}: $${domainReport.totalApiCost.toFixed(4)}`);

    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      csvContent += `${domain},ERROR,ERROR,ERROR,ERROR,ERROR,ERROR,ERROR,ERROR,ERROR,ERROR,ERROR,"${error.message}",N/A,0,$0.00\n`;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save CSV file
  fs.writeFileSync('combined_domain_report.csv', csvContent);
  console.log('\n✅ CSV file saved: combined_domain_report.csv');

  // Save JSON file
  fs.writeFileSync('combined_domain_report.json', JSON.stringify(domainReports, null, 2));
  console.log('✅ JSON file saved: combined_domain_report.json');

  // Create summary report
  console.log('\n\n' + '═'.repeat(70));
  console.log('SUMMARY REPORT');
  console.log('═'.repeat(70));
  
  domainReports.forEach(report => {
    console.log(`\n${report.domain}`);
    console.log(`  Total Keywords: ${report.totalKeywords}`);
    console.log(`  Top 10 KW Count: ${report.top10KeywordCount}`);
    console.log(`  Monthly Organic Value: $${report.monthlyOrganicValue.toFixed(2)}`);
    console.log(`  Monthly Organic Clicks: ${report.monthlyOrganicClicks}`);
    console.log(`  Total API Cost: $${report.totalApiCost.toFixed(4)}`);
  });

  console.log('\n' + '═'.repeat(70));
  console.log(`TOTAL API COST: $${totalCost.toFixed(4)} for ${domains.length} domains`);
  console.log(`AVERAGE COST PER DOMAIN: $${(totalCost / domains.length).toFixed(4)}`);
  console.log('═'.repeat(70));
}

getCombinedReport()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
