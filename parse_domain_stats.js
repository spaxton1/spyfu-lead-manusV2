const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const domain = "salemplasticsurgery.com";

function makeApiCall(domain) {
  return new Promise((resolve, reject) => {
    const path = `/apis/domain_stats_api/v2/getAllDomainStats?domain=${domain}`;
    
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
          const jsonData = JSON.parse(data);
          
          // Get the most recent month with actual data (non-zero values)
          let latest = null;
          if (jsonData.results && jsonData.results.length > 0) {
            // Start from the end and find the first month with meaningful data
            for (let i = jsonData.results.length - 1; i >= 0; i--) {
              const month = jsonData.results[i];
              if (month.totalOrganicResults > 0 || month.monthlyOrganicValue > 0) {
                latest = month;
                break;
              }
            }
          }
          
          if (latest) {
            console.log('\n✅ DOMAIN OVERVIEW - LATEST DATA:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`   Domain: ${domain}`);
            console.log(`   Data Date: ${latest.searchYear}-${String(latest.searchMonth).padStart(2, '0')}`);
            console.log(`   Total Organic Keywords Ranking: ${latest.totalOrganicResults}`);
            console.log(`   Monthly Traffic Value: $${latest.monthlyOrganicValue.toFixed(2)}`);
            console.log(`   Monthly Organic Clicks: ${Math.round(latest.monthlyOrganicClicks)}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`\n   API Rows Returned: ${jsonData.results.length}`);
            console.log(`   API Cost: $${((jsonData.results.length / 1000) * 0.50).toFixed(4)}`);
            
            // Output in requested format
            console.log('\n📋 REQUESTED FORMAT:');
            console.log(`${domain} | ${latest.totalOrganicResults} KWs | $${latest.monthlyOrganicValue.toFixed(2)}/mo value | ${Math.round(latest.monthlyOrganicClicks)} clicks/mo | ${jsonData.results.length} API Rows | $${((jsonData.results.length / 1000) * 0.50).toFixed(4)} API Cost`);
          } else {
            console.log('\n⚠️ No data found for domain');
          }
          
          resolve(jsonData);
        } catch (e) {
          console.log('\n❌ ERROR:', e.message);
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.end();
  });
}

makeApiCall(domain)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
