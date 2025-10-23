#!/usr/bin/env node

/**
 * TEST MISSING SPYFU ENDPOINTS
 * Based on comparison with existing tool, test endpoints we didn't cover:
 * - Competitor analysis
 * - Paid search data
 * - Ad history
 */

const https = require('https');

const API_KEY = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';
const BASE_URL = 'api.spyfu.com';

// Test domains
const DOMAINS = {
  small: 'viridisenergy.com',
  medium: 'poolsbybradley.com',
  enterprise: 'skyscanner.com'
};

// Endpoints to test
const NEW_ENDPOINTS = [
  // COMPETITOR ANALYSIS
  { name: 'getDomainCompetitors', description: 'Top competing domains', limit: 5 },
  { name: 'getSharedRankingKeywords', description: 'Keywords shared with competitor', limit: 5, requiresCompetitor: true },
  { name: 'getSeoCompetitors', description: 'SEO competitor list', limit: 5 },
  { name: 'getRelatedDomains', description: 'Related/similar domains', limit: 5 },
  
  // PAID SEARCH DATA
  { name: 'getPaidKeywords', description: 'Current paid keywords', limit: 10 },
  { name: 'getAdHistory', description: 'Historical ad spend', limit: null },
  { name: 'getBuyingKeywords', description: 'Keywords they advertise on', limit: 10 },
  { name: 'getPaidCompetitors', description: 'Paid search competitors', limit: 5 },
  { name: 'getAdVariations', description: 'Ad copy variations', limit: 5 },
  
  // ADDITIONAL ORGANIC
  { name: 'getRankedKeywords', description: 'All ranked keywords', limit: 10 },
  { name: 'getKeywordRankHistory', description: 'Rank history for keyword', limit: null, requiresKeyword: true }
];

/**
 * Make API call
 */
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
        try {
          const parsed = JSON.parse(data);
          resolve({
            success: true,
            statusCode: res.statusCode,
            data: parsed,
            rowCount: parsed.results ? parsed.results.length : (parsed.resultCount || 1)
          });
        } catch (err) {
          resolve({
            success: false,
            statusCode: res.statusCode,
            error: 'JSON parse error',
            rawData: data.substring(0, 200)
          });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

/**
 * Test single endpoint
 */
async function testEndpoint(endpoint, domain, domainSize) {
  console.log(`\n  Testing ${endpoint.name}...`);
  
  try {
    // Skip endpoints that require additional parameters
    if (endpoint.requiresCompetitor) {
      console.log(`  ⏭️  SKIPPED - Requires competitor parameter`);
      return { skipped: true, reason: 'Requires competitor' };
    }
    
    if (endpoint.requiresKeyword) {
      console.log(`  ⏭️  SKIPPED - Requires keyword parameter`);
      return { skipped: true, reason: 'Requires keyword' };
    }
    
    const result = await makeApiCall(endpoint.name, domain, endpoint.limit);
    
    if (result.statusCode === 200 && result.success) {
      const cost = (result.rowCount / 1000) * 0.50;
      console.log(`  ✅ SUCCESS - ${result.rowCount} rows | $${cost.toFixed(4)}`);
      
      // Show sample data
      if (result.data.results && result.data.results.length > 0) {
        const sample = result.data.results[0];
        console.log(`  📊 Sample:`, JSON.stringify(sample).substring(0, 100) + '...');
      }
      
      return {
        success: true,
        statusCode: result.statusCode,
        rows: result.rowCount,
        cost: cost,
        sampleData: result.data.results ? result.data.results[0] : result.data
      };
    } else {
      console.log(`  ❌ FAILED - Status ${result.statusCode}`);
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      }
      if (result.rawData) {
        console.log(`  Response: ${result.rawData}`);
      }
      return {
        success: false,
        statusCode: result.statusCode,
        error: result.error || 'Unknown error'
      };
    }
  } catch (err) {
    console.log(`  ❌ ERROR - ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🔍 TESTING MISSING SPYFU ENDPOINTS\n');
  console.log('Testing endpoints not covered in initial analysis:');
  console.log('- Competitor intelligence');
  console.log('- Paid search data');
  console.log('- Ad history\n');
  console.log('=' .repeat(70));
  
  const results = {};
  
  // Test each domain size
  for (const [sizeLabel, domain] of Object.entries(DOMAINS)) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📍 TESTING: ${domain.toUpperCase()} (${sizeLabel})`);
    console.log('='.repeat(70));
    
    results[domain] = {};
    
    for (const endpoint of NEW_ENDPOINTS) {
      const result = await testEndpoint(endpoint, domain, sizeLabel);
      results[domain][endpoint.name] = result;
      
      // Small delay between calls
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  
  let totalWorking = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  
  for (const endpoint of NEW_ENDPOINTS) {
    const smallResult = results[DOMAINS.small][endpoint.name];
    const mediumResult = results[DOMAINS.medium][endpoint.name];
    const enterpriseResult = results[DOMAINS.enterprise][endpoint.name];
    
    const working = [smallResult, mediumResult, enterpriseResult].filter(r => r.success).length;
    const failed = [smallResult, mediumResult, enterpriseResult].filter(r => !r.success && !r.skipped).length;
    const skipped = [smallResult, mediumResult, enterpriseResult].filter(r => r.skipped).length;
    
    if (skipped === 3) {
      console.log(`\n⏭️  ${endpoint.name}`);
      console.log(`   Description: ${endpoint.description}`);
      console.log(`   Status: SKIPPED (${smallResult.reason})`);
      totalSkipped++;
    } else if (working === 3) {
      console.log(`\n✅ ${endpoint.name}`);
      console.log(`   Description: ${endpoint.description}`);
      console.log(`   Status: WORKING on all 3 domains`);
      console.log(`   Avg Cost: $${((smallResult.cost + mediumResult.cost + enterpriseResult.cost) / 3).toFixed(4)}`);
      totalWorking++;
    } else if (working > 0) {
      console.log(`\n⚠️  ${endpoint.name}`);
      console.log(`   Description: ${endpoint.description}`);
      console.log(`   Status: PARTIALLY WORKING (${working}/3 domains)`);
      totalWorking++;
    } else {
      console.log(`\n❌ ${endpoint.name}`);
      console.log(`   Description: ${endpoint.description}`);
      console.log(`   Status: FAILED on all domains`);
      console.log(`   Error: ${smallResult.error}`);
      totalFailed++;
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log(`\n📈 TOTALS:`);
  console.log(`   ✅ Working Endpoints: ${totalWorking}`);
  console.log(`   ❌ Failed Endpoints: ${totalFailed}`);
  console.log(`   ⏭️  Skipped Endpoints: ${totalSkipped}`);
  console.log(`   📊 Total Tested: ${NEW_ENDPOINTS.length}`);
  
  // Save results
  const fs = require('fs');
  const outputFile = 'missing_endpoints_results.json';
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Full results saved to: ${outputFile}`);
  
  // Generate markdown report
  const mdReport = generateMarkdownReport(results);
  fs.writeFileSync('MISSING_ENDPOINTS_REPORT.md', mdReport);
  console.log(`📝 Markdown report saved to: MISSING_ENDPOINTS_REPORT.md`);
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(results) {
  let md = '# 🔍 Missing SpyFu Endpoints Test Report\n\n';
  md += '## Endpoints Tested\n\n';
  md += 'Based on comparison with existing tool, these are endpoints we didn\'t cover in initial analysis:\n\n';
  
  md += '### Competitor Analysis Endpoints\n';
  NEW_ENDPOINTS.filter(e => e.description.includes('compet') || e.description.includes('related')).forEach(e => {
    md += `- **${e.name}**: ${e.description}\n`;
  });
  
  md += '\n### Paid Search Endpoints\n';
  NEW_ENDPOINTS.filter(e => e.description.includes('paid') || e.description.includes('Ad') || e.description.includes('advertise')).forEach(e => {
    md += `- **${e.name}**: ${e.description}\n`;
  });
  
  md += '\n### Additional Organic Endpoints\n';
  NEW_ENDPOINTS.filter(e => !e.description.includes('compet') && !e.description.includes('paid') && !e.description.includes('Ad') && !e.description.includes('advertise') && !e.description.includes('related')).forEach(e => {
    md += `- **${e.name}**: ${e.description}\n`;
  });
  
  md += '\n## Test Results by Domain\n\n';
  
  for (const [domain, endpointResults] of Object.entries(results)) {
    md += `### ${domain}\n\n`;
    md += '| Endpoint | Status | Rows | Cost |\n';
    md += '|----------|--------|------|------|\n';
    
    for (const [endpointName, result] of Object.entries(endpointResults)) {
      if (result.skipped) {
        md += `| ${endpointName} | ⏭️ Skipped | - | - |\n`;
      } else if (result.success) {
        md += `| ${endpointName} | ✅ Working | ${result.rows} | $${result.cost.toFixed(4)} |\n`;
      } else {
        md += `| ${endpointName} | ❌ Failed | - | - |\n`;
      }
    }
    
    md += '\n';
  }
  
  md += '## Sample Data\n\n';
  md += 'Sample data from working endpoints (first result only):\n\n';
  
  for (const [domain, endpointResults] of Object.entries(results)) {
    for (const [endpointName, result] of Object.entries(endpointResults)) {
      if (result.success && result.sampleData) {
        md += `### ${endpointName} (${domain})\n\n`;
        md += '```json\n';
        md += JSON.stringify(result.sampleData, null, 2);
        md += '\n```\n\n';
        break; // Only show one sample per endpoint
      }
    }
  }
  
  return md;
}

// Run tests
runTests().catch(console.error);
