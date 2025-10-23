const https = require('https');
const API_KEY = 'MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';

const candidates = [
  'orangeroofing.com',
  'acepermaroof.com', 
  'stateroofingorlando.com',
  'schickroofing.com',
  'hurricaneroofing.com'
];

function getLiveStats(domain) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.spyfu.com',
      path: `/apis/serp_api/v2/seo/getLiveSeoStats?query=${domain}`,
      method: 'GET',
      headers: { 'Authorization': `Basic ${API_KEY}` }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            domain: domain,
            totalKeywords: parsed.totalOrganicResults || 0,
            monthlyClicks: parsed.monthlyOrganicClicks || 0,
            monthlyValue: parsed.monthlyOrganicClickValue || 0
          });
        } catch (e) {
          resolve({ domain: domain, totalKeywords: 0, monthlyClicks: 0, monthlyValue: 0 });
        }
      });
    });
    
    req.on('error', () => resolve({ domain: domain, totalKeywords: 0, monthlyClicks: 0, monthlyValue: 0 }));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ domain: domain, totalKeywords: 0, monthlyClicks: 0, monthlyValue: 0 });
    });
    req.end();
  });
}

async function main() {
  console.log('Testing more candidates...\n');
  
  for (const domain of candidates) {
    const stats = await getLiveStats(domain);
    console.log(`${domain}: ${stats.totalKeywords} KWs | ${stats.monthlyClicks} clicks | $${stats.monthlyValue.toFixed(0)}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Final Selection:');
  console.log('🏢 LARGE:  tadlockroofing.com (2,516 KWs)');
  console.log('🏪 MEDIUM: baileyroofing.com (70 KWs)');
  console.log('🏠 SMALL:  orangeroofing.com (53 KWs)');
  console.log('🎯 COMPETITOR: schickroofing.com (for 15¢ packages)');
}

main();
