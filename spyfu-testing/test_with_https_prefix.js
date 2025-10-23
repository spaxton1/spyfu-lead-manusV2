#!/usr/bin/env node

/**
 * TEST MISSING ENDPOINTS WITH HTTPS:// PREFIX
 * Your example showed: query=https://viridisenergy.com
 * My tests used: query=viridisenergy.com
 * 
 * This script tests if adding https:// makes competitor/paid endpoints work
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

// Endpoints to test (focus on ones that failed before)
const TEST_ENDPOINTS = [
  // COMPETITOR ANALYSIS
  { name: 'getDomainCompetitors', description: 'Top competing domains', limit: 5 },
  { name: 'getSeoCompetitors', description: 'SEO competitor list', limit: 5 },
  
  // PAID SEARCH DATA  
  { name: 'getPaidKeywords', description: 'Current paid keywords', limit: 10 },
  { name: 'getAdHistory', description: 'Historical ad spend', limit: null },
  { name: 'getBuyingKeywords', description: 'Keywords they advertise on', limit: 10 },
  { name: 'getPaidCompetitors', description: 'Paid search competitors', limit: 5 }
];

/**
 * Make API call
 */
function makeApiCall(endpoint, domain, limit = null, useHttpsPrefix = false) {
  return new Promise((resolve, reject) => {
    const queryDomain = useHttpsPrefix ? `https://${domain}` : domain;
    let path = `/apis/serp_api/v2/seo/${endpoint}?query=${encodeURIComponent(queryDomain)}`;
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
            rowCount: parsed.results ? parsed.results.length : (parsed.resultCount || 1),
            useHttpsPrefix: useHttpsPrefix
          });
        } catch (err) {
          resolve({
            success: false,
            statusCode: res.statusCode,
            error: 'JSON parse error',
            rawData: data.substring(0, 500),
            useHttpsPrefix: useHttpsPrefix
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
 * Test endpoint with both formats
 */
async function testEndpointBothFormats(endpoint, domain, domainSize) {
  console.log(`\n  Testing ${endpoint.name}...`);
  
  // Test WITHOUT https://
  console.log(`    Format 1: query=${domain}`);
  const result1 = await makeApiCall(endpoint.name, domain, endpoint.limit, false);
  
  if (result1.statusCode === 200 && result1.success) {
    const cost = (result1.rowCount / 1000) * 0.50;
    console.log(`    ✅ SUCCESS - ${result1.rowCount} rows | $${cost.toFixed(4)}`);
    return result1;
  } else {
    console.log(`    ❌ FAILED - Status ${result1.statusCode}`);
  }
  
  // Test WITH https://
  console.log(`    Format 2: query=https://${domain}`);
  const result2 = await makeApiCall(endpoint.name, domain, endpoint.limit, true);
  
  if (result2.statusCode === 200 && result2.success) {
    const cost = (result2.rowCount / 1000) * 0.50;
    console.log(`    ✅ SUCCESS - ${result2.rowCount} rows | $${cost.toFixed(4)}`);
    return result2;
  } else {
    console.log(`    ❌ FAILED - Status ${result2.statusCode}`);
  }
  
  return result2; // Return last result
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🔍 TESTING COMPETITOR/PAID ENDPOINTS WITH HTTPS:// PREFIX\n');
  console.log('Testing two query formats:');
  console.log('1. query=domain.com (what I used before)');
  console.log('2. query=https://domain.com (from your example)\n');
  console.log('=' .repeat(70));
  
  const results = {};
  
  // Test Small domain only first (faster)
  const testDomain = DOMAINS.small;
  const domainSize = 'small';
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📍 TESTING: ${testDomain.toUpperCase()} (${domainSize})`);
  console.log('='.repeat(70));
  
  results[testDomain] = {};
  
  for (const endpoint of TEST_ENDPOINTS) {
    const result = await testEndpointBothFormats(endpoint, testDomain, domainSize);
    results[testDomain][endpoint.name] = result;
    
    // Small delay between calls
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 QUICK SUMMARY FOR SMALL DOMAIN');
  console.log('='.repeat(70));
  
  let working = 0;
  let failed = 0;
  
  for (const endpoint of TEST_ENDPOINTS) {
    const result = results[testDomain][endpoint.name];
    
    if (result.success && result.statusCode === 200) {
      const format = result.useHttpsPrefix ? 'with https://' : 'without https://';
      console.log(`\n✅ ${endpoint.name} - WORKS (${format})`);
      console.log(`   Rows: ${result.rowCount} | Cost: $${((result.rowCount / 1000) * 0.50).toFixed(4)}`);
      if (result.data.results && result.data.results.length > 0) {
        console.log(`   Sample: ${JSON.stringify(result.data.results[0]).substring(0, 150)}...`);
      }
      working++;
    } else {
      console.log(`\n❌ ${endpoint.name} - FAILED`);
      console.log(`   Status: ${result.statusCode}`);
      if (result.rawData) {
        console.log(`   Response: ${result.rawData.substring(0, 200)}`);
      }
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log(`\n📈 RESULT:`);
  console.log(`   ✅ Working Endpoints: ${working}/${TEST_ENDPOINTS.length}`);
  console.log(`   ❌ Failed Endpoints: ${failed}/${TEST_ENDPOINTS.length}`);
  
  if (working > 0) {
    console.log(`\n✨ GOOD NEWS: Found ${working} working competitor/paid endpoint(s)!`);
    console.log(`   Now testing on Medium and Enterprise domains...\n`);
    
    // Test other domains
    for (const [sizeLabel, domain] of Object.entries(DOMAINS)) {
      if (sizeLabel === 'small') continue; // Already tested
      
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📍 TESTING: ${domain.toUpperCase()} (${sizeLabel})`);
      console.log('='.repeat(70));
      
      results[domain] = {};
      
      for (const endpoint of TEST_ENDPOINTS) {
        const result = await testEndpointBothFormats(endpoint, domain, sizeLabel);
        results[domain][endpoint.name] = result;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  } else {
    console.log(`\n❌ BAD NEWS: No competitor/paid endpoints working with either format.`);
    console.log(`   These features are not available in your API tier.`);
  }
  
  // Save results
  const fs = require('fs');
  const outputFile = 'https_prefix_test_results.json';
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Full results saved to: ${outputFile}`);
  
  // Generate summary report
  generateSummaryReport(results);
}

/**
 * Generate summary report
 */
function generateSummaryReport(results) {
  const fs = require('fs');
  
  let report = '# 🔍 HTTPS Prefix Test Results\n\n';
  report += '## Test Purpose\n';
  report += 'Tested if adding `https://` prefix to domain query makes competitor/paid endpoints work.\n\n';
  
  report += '## Endpoints Tested\n\n';
  TEST_ENDPOINTS.forEach(e => {
    report += `- **${e.name}**: ${e.description}\n`;
  });
  
  report += '\n## Results Summary\n\n';
  
  // Count successes
  let successCount = 0;
  let totalTests = 0;
  
  for (const [domain, endpointResults] of Object.entries(results)) {
    report += `### ${domain}\n\n`;
    report += '| Endpoint | Status | Format | Rows | Cost |\n';
    report += '|----------|--------|--------|------|------|\n';
    
    for (const [endpointName, result] of Object.entries(endpointResults)) {
      totalTests++;
      const format = result.useHttpsPrefix ? 'https://' : 'plain';
      
      if (result.success && result.statusCode === 200) {
        const cost = (result.rowCount / 1000) * 0.50;
        report += `| ${endpointName} | ✅ Works | ${format} | ${result.rowCount} | $${cost.toFixed(4)} |\n`;
        successCount++;
      } else {
        report += `| ${endpointName} | ❌ Failed | ${format} | - | - |\n`;
      }
    }
    
    report += '\n';
  }
  
  report += `## Conclusion\n\n`;
  report += `**${successCount}/${totalTests} tests successful** (${((successCount/totalTests)*100).toFixed(1)}%)\n\n`;
  
  if (successCount > 0) {
    report += '✅ **Good news!** Some competitor/paid endpoints are working.\n\n';
    report += 'Next steps:\n';
    report += '1. Review sample data from working endpoints\n';
    report += '2. Calculate cost per lead with new data\n';
    report += '3. Determine if new data justifies additional cost\n';
    report += '4. Update main report with findings\n';
  } else {
    report += '❌ **No competitor/paid endpoints working** with either query format.\n\n';
    report += 'This means:\n';
    report += '- Competitor data requires different API (SEMrush, Ahrefs)\n';
    report += '- Paid search data requires different API or tier\n';
    report += '- Your existing tool uses multiple data sources\n';
    report += '- SpyFu API limited to organic SEO data only\n';
  }
  
  fs.writeFileSync('HTTPS_PREFIX_TEST_REPORT.md', report);
  console.log(`📝 Summary report saved to: HTTPS_PREFIX_TEST_REPORT.md`);
}

// Run tests
runTests().catch(console.error);
