#!/usr/bin/env node

/**
 * Comprehensive API Data Point Breakdown
 * Get REAL data from Small, Medium, and Enterprise sites for ALL endpoints
 */

const https = require('https');
const fs = require('fs');

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";
const BASE_URL = 'api.spyfu.com';

// Test domains
const DOMAINS = {
  small: 'viridisenergy.com',      // ~15,132 keywords
  medium: 'poolsbybradley.com',    // ~1,200 keywords
  enterprise: 'skyscanner.com'     // ~1.8M keywords
};

// All endpoints we want to test
const ENDPOINTS = [
  { name: 'getLiveSeoStats', description: 'Domain overview statistics', limit: null },
  { name: 'getMostValuableKeywords', description: 'Highest value keywords', limit: 5 },
  { name: 'getLostRanksKeywords', description: 'Keywords that IMPROVED (negative rankChange)', limit: 5 },
  { name: 'getGainedRanksKeywords', description: 'Keywords that DROPPED (positive rankChange)', limit: 5 },
  { name: 'getNewlyRankedKeywords', description: 'New keywords added in last 30 days', limit: 5 },
  { name: 'getJustFellOffKeywords', description: 'Keywords that fell off page 1', limit: 5 },
  { name: 'getGainedClicksKeywords', description: 'Keywords gaining clicks', limit: 5 },
  { name: 'getLostClicksKeywords', description: 'Keywords losing clicks', limit: 5 },
  { name: 'getSeoKeywords', description: 'All ranking keywords', limit: 5 }
];

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
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        }
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAllData() {
  console.log('Starting comprehensive data collection...\n');
  
  const allResults = {};
  
  for (const endpoint of ENDPOINTS) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`ENDPOINT: ${endpoint.name}`);
    console.log(`${endpoint.description}`);
    console.log('='.repeat(80));
    
    allResults[endpoint.name] = {
      description: endpoint.description,
      limit: endpoint.limit,
      data: {}
    };
    
    for (const [sizeKey, domain] of Object.entries(DOMAINS)) {
      console.log(`\n  Testing ${sizeKey.toUpperCase()}: ${domain}...`);
      
      try {
        const data = await makeApiCall(endpoint.name, domain, endpoint.limit);
        
        // Calculate rows and cost
        let rowCount = 0;
        if (Array.isArray(data)) {
          rowCount = data.length;
        } else if (data && data.results && Array.isArray(data.results)) {
          rowCount = data.results.length;
        } else if (data && typeof data === 'object') {
          rowCount = 1;
        }
        
        const cost = (rowCount / 1000) * 0.50;
        
        allResults[endpoint.name].data[sizeKey] = {
          domain: domain,
          response: data,
          rowCount: rowCount,
          cost: cost
        };
        
        console.log(`    ✓ Success: ${rowCount} rows, $${cost.toFixed(4)}`);
        
        // Rate limiting
        await sleep(500);
        
      } catch (error) {
        console.log(`    ✗ Error: ${error.message}`);
        allResults[endpoint.name].data[sizeKey] = {
          domain: domain,
          error: error.message
        };
      }
    }
  }
  
  return allResults;
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║          SPYFU API: COMPREHENSIVE DATA POINT COLLECTION                      ║');
  console.log('║          Collecting REAL data from Small, Medium, Enterprise sites           ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');
  
  const results = await getAllData();
  
  // Save to file
  const jsonFile = 'comprehensive_data_points.json';
  fs.writeFileSync(jsonFile, JSON.stringify(results, null, 2));
  console.log(`\n\n✓ Results saved to: ${jsonFile}`);
  
  // Generate markdown report
  generateMarkdownReport(results);
  
  console.log('\n✓ All data collection complete!\n');
}

function generateMarkdownReport(results) {
  let markdown = `# 📊 SPYFU API: COMPLETE DATA POINT BREAKDOWN WITH REAL DATA

## Master List of ALL Available Data Points by API Call

**Test Domains:**
- **Small:** ${DOMAINS.small} (~15,132 keywords)
- **Medium:** ${DOMAINS.medium} (~1,200 keywords est.)
- **Enterprise:** ${DOMAINS.enterprise} (~1.8M keywords)

---

`;

  let apiCallNumber = 1;
  
  for (const [endpointName, endpointData] of Object.entries(results)) {
    markdown += `## 🔍 API CALL ${apiCallNumber}: ${endpointName}\n\n`;
    markdown += `**Purpose:** ${endpointData.description}\n\n`;
    
    // API String
    markdown += `### API String\n\`\`\`javascript\n`;
    markdown += `const url = \`https://api.spyfu.com/apis/serp_api/v2/seo/${endpointName}?query=\${domain}\`;
`;
    if (endpointData.limit) {
      markdown += `// With limit: url += \`&pageSize=${endpointData.limit}\`;\n`;
    }
    markdown += `const response = await fetch(url, {
  headers: { 'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ' }
});
const data = await response.json();
\`\`\`\n\n`;
    
    // Cost table
    markdown += `### Cost Per Domain Size\n`;
    markdown += `| Domain Size | Domain | Rows Returned | Cost |\n`;
    markdown += `|-------------|--------|---------------|------|\n`;
    
    for (const [sizeKey, sizeData] of Object.entries(endpointData.data)) {
      if (sizeData.error) {
        markdown += `| ${sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1)} | ${sizeData.domain} | ERROR | - |\n`;
      } else {
        markdown += `| ${sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1)} | ${sizeData.domain} | ${sizeData.rowCount} | $${sizeData.cost.toFixed(4)} |\n`;
      }
    }
    markdown += `\n`;
    
    // Real data samples for each domain
    for (const [sizeKey, sizeData] of Object.entries(endpointData.data)) {
      if (sizeData.error) continue;
      
      markdown += `### Real Data Sample: ${sizeKey.toUpperCase()} (${sizeData.domain})\n\n`;
      
      // Show first item or full response if single object
      let sampleData = sizeData.response;
      if (sampleData.results && Array.isArray(sampleData.results) && sampleData.results.length > 0) {
        markdown += `\`\`\`json\n${JSON.stringify(sampleData.results[0], null, 2)}\n\`\`\`\n\n`;
      } else if (!sampleData.results) {
        markdown += `\`\`\`json\n${JSON.stringify(sampleData, null, 2)}\n\`\`\`\n\n`;
      }
    }
    
    // Data points available (extract from first successful response)
    const firstSuccess = Object.values(endpointData.data).find(d => !d.error);
    if (firstSuccess) {
      markdown += `### Data Points Available\n\n`;
      
      let sampleItem;
      if (firstSuccess.response.results && firstSuccess.response.results[0]) {
        sampleItem = firstSuccess.response.results[0];
      } else if (firstSuccess.response && !Array.isArray(firstSuccess.response)) {
        sampleItem = firstSuccess.response;
      }
      
      if (sampleItem) {
        let pointNumber = 1;
        for (const [key, value] of Object.entries(sampleItem)) {
          const type = typeof value;
          markdown += `${pointNumber}. **${key}** (${type === 'object' && value === null ? 'null' : type})`;
          
          // Add real data examples from all three domains
          markdown += `\n`;
          for (const [sizeKey, sizeData] of Object.entries(endpointData.data)) {
            if (sizeData.error) continue;
            
            let dataValue;
            if (sizeData.response.results && sizeData.response.results[0]) {
              dataValue = sizeData.response.results[0][key];
            } else if (sizeData.response && !Array.isArray(sizeData.response)) {
              dataValue = sizeData.response[key];
            }
            
            if (dataValue !== undefined) {
              let displayValue = dataValue;
              if (typeof displayValue === 'number') {
                if (displayValue > 1000) {
                  displayValue = displayValue.toLocaleString();
                } else if (displayValue % 1 !== 0) {
                  displayValue = displayValue.toFixed(2);
                }
              } else if (typeof displayValue === 'string' && displayValue.length > 50) {
                displayValue = displayValue.slice(0, 50) + '...';
              }
              
              markdown += `   - **${sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1)}** (${sizeData.domain}): ${displayValue}\n`;
            }
          }
          markdown += `\n`;
          pointNumber++;
        }
      }
    }
    
    markdown += `---\n\n`;
    apiCallNumber++;
  }
  
  // Save markdown
  fs.writeFileSync('COMPLETE_API_DATA_POINTS.md', markdown);
  console.log('✓ Markdown report saved to: COMPLETE_API_DATA_POINTS.md');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
