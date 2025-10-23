const fs = require('fs');

// Read the existing JSON report
const reportData = JSON.parse(fs.readFileSync('combined_domain_report.json', 'utf8'));

console.log('═══════════════════════════════════════════════════════════════');
console.log('ADDING PAGE 1 % AND PAGE 2+ % COLUMNS');
console.log('═══════════════════════════════════════════════════════════════\n');

// Update each domain with percentage calculations
const updatedReport = reportData.map(domain => {
  const totalKeywords = domain.totalKeywords;
  const top10KeywordCount = domain.top10KeywordCount;
  
  // Calculate percentages
  let page1Percentage = 0;
  let page2PlusPercentage = 0;
  
  if (totalKeywords > 0) {
    page1Percentage = (top10KeywordCount / totalKeywords) * 100;
    page2PlusPercentage = ((totalKeywords - top10KeywordCount) / totalKeywords) * 100;
  }
  
  console.log(`${domain.domain}`);
  console.log(`  Total Keywords: ${totalKeywords}`);
  console.log(`  Page 1 Keywords (Top 10): ${top10KeywordCount}`);
  console.log(`  Page 1 %: ${page1Percentage.toFixed(2)}%`);
  console.log(`  Page 2+ %: ${page2PlusPercentage.toFixed(2)}%`);
  console.log('');
  
  return {
    ...domain,
    page1Percentage: parseFloat(page1Percentage.toFixed(2)),
    page2PlusPercentage: parseFloat(page2PlusPercentage.toFixed(2))
  };
});

// Save updated JSON
fs.writeFileSync('combined_domain_report_with_percentages.json', JSON.stringify(updatedReport, null, 2));
console.log('✅ Updated JSON saved: combined_domain_report_with_percentages.json\n');

// Create updated CSV with new columns
let csvContent = 'Domain,Total Keywords,Top 10 KW Count,Page 1 %,Page 2+ %,Monthly Organic Value,Monthly Organic Clicks,Monthly PPC Budget,Monthly PPC Clicks,Organic Competitors,Paid Competitors,Domain Stats API Cost,Keywords API Cost,Total API Cost,Keyword,Rank,Traffic,CPC\n';

updatedReport.forEach(domain => {
  const baseData = `${domain.domain},${domain.totalKeywords},${domain.top10KeywordCount},${domain.page1Percentage}%,${domain.page2PlusPercentage}%,$${domain.monthlyOrganicValue.toFixed(2)},${domain.monthlyOrganicClicks},$${domain.monthlyPPCBudget.toFixed(2)},${domain.monthlyPPCClicks},${domain.organicCompetitors},${domain.paidCompetitors},$${domain.domainStatsApiCost.toFixed(4)},$${domain.keywordsApiCost.toFixed(4)},$${domain.totalApiCost.toFixed(4)}`;
  
  if (domain.keywords && domain.keywords.length > 0) {
    domain.keywords.forEach(kw => {
      const escapedKeyword = `"${kw.keyword.replace(/"/g, '""')}"`;
      csvContent += `${baseData},${escapedKeyword},${kw.rank},${kw.traffic},$${kw.cpc.toFixed(2)}\n`;
    });
  } else {
    csvContent += `${baseData},"(No keywords in top 10)",N/A,0,$0.00\n`;
  }
});

// Save updated CSV
fs.writeFileSync('combined_domain_report_with_percentages.csv', csvContent);
console.log('✅ Updated CSV saved: combined_domain_report_with_percentages.csv\n');

// Create summary table
console.log('═══════════════════════════════════════════════════════════════');
console.log('SUMMARY TABLE WITH PERCENTAGES');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Domain                          | Total KWs | Page 1 KWs | Page 1 % | Page 2+ %');
console.log('--------------------------------|-----------|------------|----------|----------');

updatedReport.forEach(domain => {
  const domainName = domain.domain.padEnd(31);
  const totalKWs = String(domain.totalKeywords).padStart(9);
  const page1KWs = String(domain.top10KeywordCount).padStart(10);
  const page1Pct = String(domain.page1Percentage + '%').padStart(8);
  const page2Pct = String(domain.page2PlusPercentage + '%').padStart(9);
  
  console.log(`${domainName} | ${totalKWs} | ${page1KWs} | ${page1Pct} | ${page2Pct}`);
});

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('COMPLETE');
console.log('═══════════════════════════════════════════════════════════════');
