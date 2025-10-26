/**
 * Test CSV Parser with SampleLeads-35.csv
 * Run with: npx tsx test-csv-parser.ts
 */

import { readFileSync } from 'fs';
import { parseLeadsCsv, detectWebsiteColumn, cleanWebsiteUrl } from './src/utils/csv-parser';

async function testCsvParser() {
  console.log('🧪 Testing CSV Parser with SampleLeads-35.csv\n');

  // Test 1: detectWebsiteColumn
  console.log('Test 1: detectWebsiteColumn()');
  const testHeaders = [
    ['First Name', 'Website', 'Company'],
    ['name', 'company website', 'email'],
    ['Contact', 'URL', 'Phone'],
    ['Person', 'Domain', 'Title'],
    ['Name', 'Person Linkedin Url', 'Company URL'],
  ];

  testHeaders.forEach((headers, i) => {
    const result = detectWebsiteColumn(headers);
    console.log(`  ${i + 1}. [${headers.join(', ')}] → "${result}"`);
  });

  // Test 2: cleanWebsiteUrl
  console.log('\nTest 2: cleanWebsiteUrl()');
  const testUrls = [
    'https://affinitystone.com',
    'www.totalflooringinc.com',
    'http://atlantic-tile.com',
    'http://www.linkedin.com/in/dave-witbeck',
    '',
    'not-a-valid-url',
  ];

  testUrls.forEach((url) => {
    const cleaned = cleanWebsiteUrl(url);
    console.log(`  "${url}" → ${cleaned || 'null'}`);
  });

  // Test 3: Parse SampleLeads-35.csv
  console.log('\nTest 3: Parse SampleLeads-35.csv');
  try {
    const csvContent = readFileSync('./SampleLeads-35.csv', 'utf-8');
    const result = await parseLeadsCsv(csvContent);

    console.log(`  Total rows: ${result.totalRows}`);
    console.log(`  Valid leads: ${result.validLeads}`);
    console.log(`  Website column: "${result.websiteColumn}"`);
    console.log(`  Errors: ${result.errors.length}`);

    console.log('\n  First 5 leads:');
    result.leads.slice(0, 5).forEach((lead, i) => {
      console.log(`  ${i + 1}. ${lead.domain}`);
      console.log(`     Company: ${lead.company || 'N/A'}`);
      console.log(`     Contact: ${lead.firstName} ${lead.lastName}`.trim() || 'N/A');
      console.log(`     Email: ${lead.email || 'N/A'}`);
    });

    if (result.errors.length > 0) {
      console.log('\n  Errors:');
      result.errors.slice(0, 3).forEach((err) => console.log(`    - ${err}`));
    }

    console.log('\n✅ CSV Parser Test Complete!');
    console.log(`   Successfully parsed ${result.validLeads} leads from ${result.totalRows} rows`);
  } catch (error) {
    console.error('\n❌ CSV Parser Test Failed:', error);
  }
}

testCsvParser();
