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

async function formatResults() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('TOP 10 KEYWORD RESULTS - ALL 30 DOMAINS');
  console.log('Format: Domain | Top 10 KW Count | API Rows | API Cost | Keywords');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let totalCost = 0;

  for (const domain of domains) {
    try {
      const path = `/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}&rank.min=1&rank.max=10&monthlyCostOption=Exact&sortBy=Rank`;
      
      const result = await makeApiCall(path);

      if (result.success && result.status === 200) {
        const rows = result.data.results ? result.data.results.length : 0;
        const cost = (rows / 1000) * 0.50;
        totalCost += cost;

        // Header line
        console.log(`${domain} | ${rows} KWs | ${rows} API Rows | $${cost.toFixed(4)} API Cost`);

        if (rows > 0) {
          // Print each keyword
          result.data.results.forEach(kw => {
            const cpc = kw.exactCostPerClick || kw.phraseCostPerClick || kw.broadCostPerClick || 0;
            const searchVol = kw.searchVolume || 0;
            console.log(`  ${kw.keyword} | Rank ${kw.rank} | ${searchVol} traffic | $${cpc.toFixed(2)} CPC`);
          });
        } else {
          console.log('  (No keywords ranking in top 10)');
        }
        
        console.log(''); // Blank line between domains

      } else {
        console.log(`${domain} | ERROR | Status: ${result.status}`);
        console.log('');
      }

    } catch (error) {
      console.log(`${domain} | ERROR | ${error.message}`);
      console.log('');
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`TOTAL API COST: $${totalCost.toFixed(4)} for ${domains.length} domains`);
  console.log('═══════════════════════════════════════════════════════════════');
}

formatResults()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
  });
