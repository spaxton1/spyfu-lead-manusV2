#!/usr/bin/env node

/**
 * SpyFu API Status Checker
 * Monitors API health and alerts when service is restored
 */

const https = require('https');

const API_KEY = 'AF56E8D4-2E20-4F47-A68A-2D9D7F8D9B39';
const AUTH = Buffer.from(API_KEY + ':').toString('base64');

// Test endpoints in order of importance
const ENDPOINTS = [
  {
    name: 'Domain Stats (Basic)',
    path: '/apis/domain_stats_api/v2/domain/alignwc.com?useCache=1',
    critical: true
  },
  {
    name: 'Just Fell Off Keywords',
    path: '/apis/serp_api/v2/seo/getJustFellOffKeywords/alignwc.com?pageSize=1',
    critical: false
  },
  {
    name: 'Lost Ranks Keywords (query param)',
    path: '/apis/serp_api/v2/seo/getLostRanksKeywords?query=alignwc.com',
    critical: true
  },
  {
    name: 'Lost Ranks Keywords (path)',
    path: '/apis/serp_api/v2/seo/getLostRanksKeywords/alignwc.com',
    critical: false
  }
];

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.spyfu.com',
      path: path,
      method: 'GET',
      headers: { 'Authorization': `Basic ${AUTH}` },
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });

    req.on('error', (e) => {
      resolve({
        status: 0,
        error: e.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 0,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function checkEndpoint(endpoint) {
  const result = await makeRequest(endpoint.path);
  
  const status = {
    name: endpoint.name,
    working: result.status === 200,
    statusCode: result.status,
    critical: endpoint.critical,
    error: result.error || null
  };

  if (result.status === 200) {
    try {
      const data = JSON.parse(result.data);
      status.resultsCount = data.data?.results?.length || data.rankingKeywords || 'OK';
    } catch (e) {
      status.resultsCount = 'Parse error';
    }
  }

  return status;
}

async function checkAllEndpoints() {
  console.log('🔍 Checking SpyFu API Status...\n');
  console.log(`Time: ${new Date().toISOString()}\n`);
  console.log('─'.repeat(70));

  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    const status = await checkEndpoint(endpoint);
    results.push(status);

    const icon = status.working ? '✅' : '❌';
    const critical = status.critical ? '[CRITICAL]' : '';
    
    console.log(`${icon} ${status.name} ${critical}`);
    console.log(`   Status: ${status.statusCode} ${status.error ? `(${status.error})` : ''}`);
    
    if (status.working && status.resultsCount) {
      console.log(`   Results: ${status.resultsCount}`);
    }
    
    console.log('');
  }

  console.log('─'.repeat(70));

  // Summary
  const workingCount = results.filter(r => r.working).length;
  const criticalDown = results.filter(r => r.critical && !r.working).length;

  console.log(`\n📊 Summary: ${workingCount}/${results.length} endpoints working`);

  if (criticalDown > 0) {
    console.log(`⚠️  ${criticalDown} CRITICAL endpoints are down`);
    console.log('\n🔄 API Status: DOWN - Core functionality unavailable');
    return false;
  } else if (workingCount === results.length) {
    console.log('✅ API Status: FULLY OPERATIONAL');
    return true;
  } else {
    console.log('⚠️  API Status: PARTIAL - Some endpoints unavailable');
    return false;
  }
}

async function monitorMode(intervalMinutes = 5) {
  console.log(`\n🔄 Monitoring mode: Checking every ${intervalMinutes} minutes`);
  console.log('Press Ctrl+C to stop\n');

  while (true) {
    const isHealthy = await checkAllEndpoints();
    
    if (isHealthy) {
      console.log('\n🎉 API IS BACK ONLINE! You can now proceed with testing.');
      console.log('\nNext steps:');
      console.log('1. Test getLostRanksKeywords with filters');
      console.log('2. Create get_lost_ranks_keywords.js script');
      console.log('3. Run analysis on all domains');
      break;
    }

    await new Promise(resolve => setTimeout(resolve, intervalMinutes * 60 * 1000));
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args[0] || 'once';

  if (mode === 'monitor') {
    const interval = parseInt(args[1]) || 5;
    monitorMode(interval).catch(console.error);
  } else {
    checkAllEndpoints().then(isHealthy => {
      process.exit(isHealthy ? 0 : 1);
    });
  }
}

module.exports = { checkAllEndpoints };
