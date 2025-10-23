const fs = require('fs');

// Read the existing JSON report with rankings
const reportData = JSON.parse(fs.readFileSync('combined_domain_report_with_rankings.json', 'utf8'));

console.log('═══════════════════════════════════════════════════════════════');
console.log('LOW-HANGING FRUIT ANALYSIS');
console.log('Finding: Top CPC Keywords + High Traffic Keywords NOT in Position #1');
console.log('═══════════════════════════════════════════════════════════════\n');

const lowHangingFruitReport = [];

reportData.forEach(domain => {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`DOMAIN: ${domain.domain}`);
  console.log('═'.repeat(70));
  
  if (!domain.keywords || domain.keywords.length === 0) {
    console.log('⚠️  No Page 1 keywords to analyze\n');
    lowHangingFruitReport.push({
      domain: domain.domain,
      totalKeywords: domain.totalKeywords,
      page1Keywords: domain.top10KeywordCount,
      topCPCKeywords: [],
      highTrafficKeywords: []
    });
    return;
  }
  
  // Filter keywords NOT in position 1 (low-hanging fruit only)
  const nonPosition1Keywords = domain.keywords.filter(kw => kw.rank !== 1);
  
  // Sort by CPC (descending) - Top 10 high CPC opportunities
  const topCPCKeywords = [...nonPosition1Keywords]
    .filter(kw => kw.cpc > 0) // Only keywords with CPC value
    .sort((a, b) => b.cpc - a.cpc)
    .slice(0, 10);
  
  // Sort by Traffic (descending) - Top 10 high traffic opportunities
  const highTrafficKeywords = [...nonPosition1Keywords]
    .filter(kw => kw.traffic > 0) // Only keywords with traffic
    .sort((a, b) => b.traffic - a.traffic)
    .slice(0, 10);
  
  console.log(`\n🎯 TOP CPC OPPORTUNITIES (Not Ranked #1):`);
  console.log('These are high-value keywords where improving rank = more $$$ per click\n');
  
  if (topCPCKeywords.length > 0) {
    console.log('Rank | Keyword | CPC | Traffic');
    console.log('-----|---------|-----|--------');
    topCPCKeywords.forEach(kw => {
      console.log(`${String(kw.rank).padStart(4)} | ${kw.keyword.substring(0, 50).padEnd(50)} | $${kw.cpc.toFixed(2).padStart(6)} | ${String(kw.traffic).padStart(6)}`);
    });
  } else {
    console.log('❌ No keywords with CPC data in positions 2-10');
  }
  
  console.log(`\n\n🚀 TOP TRAFFIC OPPORTUNITIES (Not Ranked #1):`);
  console.log('These have high search volume - moving to #1 = massive traffic increase\n');
  
  if (highTrafficKeywords.length > 0) {
    console.log('Rank | Keyword | Traffic | CPC');
    console.log('-----|---------|---------|-----');
    highTrafficKeywords.forEach(kw => {
      console.log(`${String(kw.rank).padStart(4)} | ${kw.keyword.substring(0, 50).padEnd(50)} | ${String(kw.traffic).padStart(7)} | $${kw.cpc.toFixed(2)}`);
    });
  } else {
    console.log('❌ No keywords with traffic data in positions 2-10');
  }
  
  // Store for JSON report
  lowHangingFruitReport.push({
    domain: domain.domain,
    totalKeywords: domain.totalKeywords,
    page1Keywords: domain.top10KeywordCount,
    topCPCKeywords: topCPCKeywords.map(kw => ({
      keyword: kw.keyword,
      rank: kw.rank,
      cpc: kw.cpc,
      traffic: kw.traffic,
      opportunityType: 'High CPC'
    })),
    highTrafficKeywords: highTrafficKeywords.map(kw => ({
      keyword: kw.keyword,
      rank: kw.rank,
      traffic: kw.traffic,
      cpc: kw.cpc,
      opportunityType: 'High Traffic'
    }))
  });
  
  console.log('');
});

// Save low-hanging fruit report
fs.writeFileSync('low_hanging_fruit_report.json', JSON.stringify(lowHangingFruitReport, null, 2));
console.log('\n✅ Low-hanging fruit report saved: low_hanging_fruit_report.json\n');

// Create CSV for low-hanging fruit
let csvContent = 'Domain,Total Keywords,Page 1 Keywords,Opportunity Type,Keyword,Current Rank,Traffic,CPC,Potential Impact\n';

lowHangingFruitReport.forEach(domain => {
  // Add top CPC keywords
  domain.topCPCKeywords.forEach((kw, index) => {
    const impact = index === 0 ? 'HIGHEST CPC' : 'High CPC';
    const escapedKeyword = `"${kw.keyword.replace(/"/g, '""')}"`;
    csvContent += `${domain.domain},${domain.totalKeywords},${domain.page1Keywords},Top CPC,${escapedKeyword},${kw.rank},${kw.traffic},$${kw.cpc.toFixed(2)},${impact}\n`;
  });
  
  // Add high traffic keywords
  domain.highTrafficKeywords.forEach((kw, index) => {
    const impact = index === 0 ? 'HIGHEST TRAFFIC' : 'High Traffic';
    const escapedKeyword = `"${kw.keyword.replace(/"/g, '""')}"`;
    csvContent += `${domain.domain},${domain.totalKeywords},${domain.page1Keywords},High Traffic,${escapedKeyword},${kw.rank},${kw.traffic},$${kw.cpc.toFixed(2)},${impact}\n`;
  });
});

fs.writeFileSync('low_hanging_fruit_report.csv', csvContent);
console.log('✅ Low-hanging fruit CSV saved: low_hanging_fruit_report.csv\n');

// Create summary statistics
console.log('═══════════════════════════════════════════════════════════════');
console.log('SUMMARY STATISTICS');
console.log('═══════════════════════════════════════════════════════════════\n');

lowHangingFruitReport.forEach(domain => {
  if (domain.topCPCKeywords.length > 0 || domain.highTrafficKeywords.length > 0) {
    console.log(`${domain.domain}:`);
    console.log(`  Top CPC Opportunities: ${domain.topCPCKeywords.length} keywords`);
    if (domain.topCPCKeywords.length > 0) {
      console.log(`    Highest CPC: $${domain.topCPCKeywords[0].cpc.toFixed(2)} (${domain.topCPCKeywords[0].keyword.substring(0, 40)})`);
    }
    console.log(`  High Traffic Opportunities: ${domain.highTrafficKeywords.length} keywords`);
    if (domain.highTrafficKeywords.length > 0) {
      console.log(`    Highest Traffic: ${domain.highTrafficKeywords[0].traffic} searches/mo (${domain.highTrafficKeywords[0].keyword.substring(0, 40)})`);
    }
    console.log('');
  }
});

console.log('═══════════════════════════════════════════════════════════════');
console.log('COMPLETE');
console.log('═══════════════════════════════════════════════════════════════');
