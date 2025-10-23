const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const domain = "salemplasticsurgery.com";

function makeApiCall(endpoint, params) {
  return new Promise((resolve, reject) => {
    const queryString = new URLSearchParams(params).toString();
    const path = `/apis/domain_stats_api/v2/${endpoint}?${queryString}`;
    
    console.log('\n🔍 Testing:', endpoint);
    console.log('   Full path:', path);
    
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
        console.log('📡 Status:', res.statusCode);
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ Success!');
          console.log('   Rows:', jsonData.results ? jsonData.results.length : (Array.isArray(jsonData) ? jsonData.length : 1));
          console.log('\n📋 Response:');
          console.log(JSON.stringify(jsonData, null, 2));
          resolve(jsonData);
        } catch (e) {
          console.log('❌ Parse error');
          console.log('Raw (first 500):', data.substring(0, 500));
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

makeApiCall('getLatestDomainStats', { domain })
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
