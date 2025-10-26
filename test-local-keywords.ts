/**
 * Test Local Keyword Detection
 * Run with: npx tsx test-local-keywords.ts
 */

import { hasLocalIdentifier, getLocalIdentifierInfo, separateLocalKeywords } from './src/utils/local-keyword-detector';

function testLocalKeywords() {
  console.log('🧪 Testing Local Keyword Detection\n');
  
  // Test cases from documentation
  const testKeywords = [
    // ✓ Should be LOCAL
    'plastic surgery north carolina',
    'coolsculpting greensboro',
    'tummy tuck beverly hills',
    'boston plastic surgery',
    'plastic surgery 90210',
    'north shore dental',
    'chiropractor los angeles',
    'dentist new york',
    'lawyer miami fl',
    'plumber san francisco',
    'downtown chicago restaurant',
    
    // ✗ Should be NON-LOCAL
    'chiropractor near me',
    'plastic surgery near you',
    'rhinoplasty',
    'local dentist',
    'best lawyer nearby',
    'tummy tuck',
    'coolsculpting cost',
    
    // Edge cases
    'beverly hills ca',
    'new york city dentist',
    'pools near me', // False positive
    'custom pools', // NOT local
  ];
  
  console.log('Test Results:');
  console.log('─'.repeat(80));
  
  let passed = 0;
  let failed = 0;
  
  testKeywords.forEach((keyword, i) => {
    const info = getLocalIdentifierInfo(keyword);
    const icon = info.isLocal ? '✓' : '✗';
    
    console.log(`${i + 1}. [${icon}] "${keyword}"`);
    
    if (info.isLocal) {
      console.log(`   Reasons: ${info.reasons.join(', ')}`);
      if (info.cityFound) {
        console.log(`   City: ${info.cityFound}${info.stateFound ? ` (${info.stateFound})` : ''}`);
      }
    }
    
    console.log();
  });
  
  // Test with real keywords from SpyFu
  console.log('\n─'.repeat(80));
  console.log('Real Keywords from poolsbybradley.com:');
  console.log('─'.repeat(80));
  
  const realKeywords = [
    'what causes evaporation',
    'custom pools near me',
    'pool design',
    'minto builders florida',
    'pool shapes',
    'Pool builders Central Florida',
    'grotto pool',
    'pool construction orlando',
    'swimming pool contractors tampa',
  ];
  
  const { local, nonLocal } = separateLocalKeywords(realKeywords);
  
  console.log(`\nTotal keywords: ${realKeywords.length}`);
  console.log(`Local keywords: ${local.length}`);
  console.log(`Non-local keywords: ${nonLocal.length}\n`);
  
  console.log('Local Keywords:');
  local.forEach((kw, i) => {
    const info = getLocalIdentifierInfo(kw);
    console.log(`  ${i + 1}. "${kw}"`);
    console.log(`     ${info.reasons.join(', ')}`);
  });
  
  console.log('\nNon-Local Keywords:');
  nonLocal.forEach((kw, i) => {
    console.log(`  ${i + 1}. "${kw}"`);
  });
  
  // Performance test
  console.log('\n─'.repeat(80));
  console.log('Performance Test:');
  console.log('─'.repeat(80));
  
  const iterations = 1000;
  const testKw = 'plastic surgery beverly hills california';
  
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    hasLocalIdentifier(testKw);
  }
  const end = performance.now();
  
  const avgTime = (end - start) / iterations;
  console.log(`\nChecked "${testKw}" ${iterations} times`);
  console.log(`Average time per check: ${avgTime.toFixed(4)}ms`);
  console.log(`Estimated time for 1000 keywords: ${(avgTime * 1000 / 1000).toFixed(2)}s`);
  
  console.log('\n✅ Local Keyword Detection Test Complete!');
}

testLocalKeywords();
