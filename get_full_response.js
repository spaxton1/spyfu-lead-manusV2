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
          console.log(JSON.stringify(jsonData, null, 2));
          resolve(jsonData);
        } catch (e) {
          console.log('ERROR:', e.message);
          console.log('Raw response:', data);
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.end();
  });
}

makeApiCall(domain)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
