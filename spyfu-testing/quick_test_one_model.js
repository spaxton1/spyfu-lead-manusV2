#!/usr/bin/env node

const https = require('https');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const BASE_URL = 'api.spyfu.com';
const DOMAIN = 'viridisenergy.com';

function makeApiCall(endpoint, domain, limit = null) {
  return new Promise((resolve, reject) => {
    let path = `/apis/serp_api/v2/seo/${endpoint}?query=${domain}`;
    if (limit) {
      path += `&pageSize=${limit}`;
    }
    
    const options = {
      hostname: BASE_URL,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': API_KEY
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Parse error: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.end();
  });
}

async function quickTest() {
  console.log(`Testing API with ${DOMAIN}...`);
  
  try {
    console.log('\n1. getLiveSeoStats...');
    const stats = await makeApiCall('getLiveSeoStats', DOMAIN);
    console.log('   SUCCESS:', JSON.stringify(stats, null, 2).slice(0, 500));
    
    console.log('\n2. getMostValuableKeywords (limit 5)...');
    const keywords = await makeApiCall('getMostValuableKeywords', DOMAIN, 5);
    console.log('   SUCCESS: Got', Array.isArray(keywords.results) ? keywords.results.length : 'unknown', 'keywords');
    console.log('   Sample:', JSON.stringify(keywords.results ? keywords.results[0] : keywords, null, 2).slice(0, 500));
    
    console.log('\n3. getLostRanksKeywords (limit 5)...');
    const improved = await makeApiCall('getLostRanksKeywords', DOMAIN, 5);
    console.log('   SUCCESS: Got', Array.isArray(improved.results) ? improved.results.length : 'unknown', 'improved');
    console.log('   Sample:', JSON.stringify(improved.results ? improved.results[0] : improved, null, 2).slice(0, 500));
    
    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
  }
}

quickTest();
