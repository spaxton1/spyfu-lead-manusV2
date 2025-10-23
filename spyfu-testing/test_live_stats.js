#!/usr/bin/env node

/**
 * Test getLiveSeoStats endpoint with correct format
 */

const API_KEY = "Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ";

const TEST_DOMAINS = [
  "viridisenergy.com",
  "poolsbybradley.com",
  "newerasolarenergy.com"
];

async function testLiveSeoStats(domain) {
  // Try with https:// prefix as shown in example
  const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getLiveSeoStats?query=https://${domain}`;
  
  console.log(`\nTesting: ${domain}`);
  console.log(`URL: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": API_KEY
      }
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Error: ${errorText.slice(0, 500)}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`✅ SUCCESS!`);
    console.log(JSON.stringify(data, null, 2));
    
    return data;
    
  } catch (error) {
    console.error(`❌ Exception: ${error.message}`);
    return null;
  }
}

async function testBothFormats(domain) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`TESTING: ${domain}`);
  console.log("=".repeat(80));
  
  // Test with https:// prefix
  console.log("\n--- Format 1: With https:// prefix ---");
  await testLiveSeoStats(domain);
  
  // Test without prefix
  console.log("\n--- Format 2: Without https:// prefix ---");
  const url2 = `https://api.spyfu.com/apis/serp_api/v2/seo/getLiveSeoStats?query=${domain}`;
  console.log(`URL: ${url2}`);
  
  try {
    const response = await fetch(url2, {
      headers: {
        "Authorization": API_KEY
      }
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Error: ${errorText.slice(0, 500)}`);
    } else {
      const data = await response.json();
      console.log(`✅ SUCCESS!`);
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error(`❌ Exception: ${error.message}`);
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function main() {
  console.log("=".repeat(80));
  console.log("TESTING getLiveSeoStats WITH CORRECT FORMAT");
  console.log("=".repeat(80));
  
  for (const domain of TEST_DOMAINS) {
    await testBothFormats(domain);
  }
}

main().catch(console.error);
