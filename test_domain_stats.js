const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const domain = "salemplasticsurgery.com";

function makeApiCall(domain) {
  return new Promise((resolve, reject) => {
    // Using domain= parameter as required by the API
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

    console.log('\n🔍 Testing API call:');
    console.log('   Domain:', domain);
    console.log('   Endpoint:', path);
    console.log('   Full URL: api.spyfu.com' + path);

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log('\n📡 Response status:', res.statusCode);

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('\n✅ SUCCESS! Received JSON data');
          
          // Extract the key metrics
          if (jsonData.stats && jsonData.stats.length > 0) {
            const latest = jsonData.stats[jsonData.stats.length - 1];
            console.log('\n📊 DOMAIN OVERVIEW METRICS:');
            console.log('   Domain:', domain);
            console.log('   Total Organic Keywords:', latest.organicKeywordCount || 0);
            console.log('   Monthly Traffic Value: $' + (latest.organicValue || 0).toFixed(2));
            console.log('   Monthly Organic Clicks:', latest.organicClicks || 0);
            console.log('   Data Date:', latest.date);
            console.log('\n   API Rows Returned:', jsonData.stats.length);
            console.log('   API Cost: $' + ((jsonData.stats.length / 1000) * 0.50).toFixed(4));
            
            console.log('\n📋 Full Response (first record):');
            console.log(JSON.stringify(latest, null, 2));
          } else {
            console.log('\n📊 Raw Response:');
            console.log(JSON.stringify(jsonData, null, 2));
          }
          
          resolve(jsonData);
        } catch (e) {
          console.log('\n❌ ERROR: JSON parse error');
          console.log('Raw response (first 500 chars):', data.substring(0, 500));
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

// Run the test
makeApiCall(domain)
  .then(data => {
    console.log('\n🎯 Test completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Test failed:', err.message);
    process.exit(1);
  });
