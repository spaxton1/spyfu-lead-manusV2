const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";

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
  'painreliefkc.com',
  'drdilanchian.com',
  'redlandsspineandsport.com',
  'farrarchiro.com',
  'armadillosportchiropractic.com',
  'fredsfloors.com',
  'gsamarillo.com',
  'dreyersdki.com',
  'associatedsvs.com',
  'advantageoverheaddoor.com',
  'uniquepoolspcb.com',
  'makaipools.net',
  'windowdoorpro.com',
  'myneighborhoodwindows.com',
  'accentkitchenandfloor.com',
  'jvgaragedoor.com',
  'aaronoverheaddoor.com',
  'mb-landdesign.com',
  'ccroofingcompany.com',
  'ashleefence.com',
  'bocanresidentialimprovements.com'
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
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function testAllDomains() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('TESTING 30 DOMAINS - Top 10 Ranked Keywords Only');
  console.log('API: getMostValuableKeywords with rank.min=1&rank.max=10');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let totalCost = 0;
  let successCount = 0;
  let failCount = 0;

  for (const domain of domains) {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`DOMAIN: ${domain}`);
    console.log('═'.repeat(70));

    try {
      // Test the API call with the specified parameters
      const path = `/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}&rank.min=1&rank.max=10&monthlyCostOption=Exact&sortBy=Rank`;
      
      const result = await makeApiCall(path);

      if (result.success && result.status === 200) {
        const resultCount = result.data.resultCount || 0;
        const rows = result.data.results ? result.data.results.length : 0;
        const cost = (rows / 1000) * 0.50;
        totalCost += cost;
        successCount++;

        console.log(`✅ SUCCESS | ${rows} keywords in top 10 positions | $${cost.toFixed(4)} cost`);

        if (rows > 0) {
          console.log('\nTop Keywords (Ranked 1-10):');
          console.log('Rank | Keyword | Search Vol | CPC (Exact) | SEO Clicks | Monthly Value');
          console.log('-----|---------|------------|-------------|------------|---------------');

          result.data.results.forEach(kw => {
            const cpc = kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0;
            const seoClicks = kw.seoClicks || 0;
            const monthlyValue = cpc * seoClicks;
            const searchVol = kw.searchVolume || 0;

            console.log(`${String(kw.rank).padStart(4)} | ${kw.keyword.substring(0, 40).padEnd(40)} | ${String(searchVol).padStart(10)} | $${cpc.toFixed(2).padStart(6)} | ${String(seoClicks).padStart(10)} | $${monthlyValue.toFixed(2)}`);
          });

          // Calculate total value
          const totalMonthlyValue = result.data.results.reduce((sum, kw) => {
            const cpc = kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0;
            const seoClicks = kw.seoClicks || 0;
            return sum + (cpc * seoClicks);
          }, 0);

          console.log(`\n💰 TOTAL VALUE FROM TOP 10 RANKINGS: $${totalMonthlyValue.toFixed(2)}/month`);
        } else {
          console.log('⚠️  No keywords ranking in positions 1-10');
        }

      } else {
        failCount++;
        console.log(`❌ FAILED | Status: ${result.status} | Error: ${result.error || 'Unknown error'}`);
      }

    } catch (error) {
      failCount++;
      console.log(`❌ ERROR | ${error.message}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n\n' + '═'.repeat(70));
  console.log('FINAL SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total Domains Tested: ${domains.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total API Cost: $${totalCost.toFixed(4)}`);
  console.log(`Average Cost Per Domain: $${(totalCost / domains.length).toFixed(4)}`);
  console.log('═'.repeat(70));
}

testAllDomains()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
