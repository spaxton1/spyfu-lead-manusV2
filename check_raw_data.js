const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const domain = "salemplasticsurgery.com";

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
          resolve({ success: true, data: json });
        } catch (e) {
          resolve({ success: false, error: data });
        }
      });
    });
    req.on('error', (error) => reject(error));
    req.end();
  });
}

async function checkData() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('RAW JSON RESPONSE - Most Valuable Keywords');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const result = await makeApiCall(`/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}&pageSize=10`);
  
  if (result.success) {
    console.log('Full JSON Response:');
    console.log(JSON.stringify(result.data, null, 2));
    
    console.log('\n\n═══════════════════════════════════════════════════════════════');
    console.log('FIELD NAMES IN FIRST RESULT:');
    console.log('═══════════════════════════════════════════════════════════════');
    if (result.data.results && result.data.results[0]) {
      const fields = Object.keys(result.data.results[0]);
      console.log('Available fields:', fields.join(', '));
      
      console.log('\n\nFirst keyword complete data:');
      console.log(JSON.stringify(result.data.results[0], null, 2));
    }
  }
}

checkData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
