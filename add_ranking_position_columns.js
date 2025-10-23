const fs = require('fs');

// Read the existing JSON report with percentages
const reportData = JSON.parse(fs.readFileSync('combined_domain_report_with_percentages.json', 'utf8'));

console.log('═══════════════════════════════════════════════════════════════');
console.log('ANALYZING KEYWORD RANKING POSITIONS');
console.log('═══════════════════════════════════════════════════════════════\n');

// Update each domain with ranking position counts
const updatedReport = reportData.map(domain => {
  let top1Count = 0;
  let top3Count = 0;
  let positions4to10Count = 0;
  
  // Count keywords by ranking position
  if (domain.keywords && domain.keywords.length > 0) {
    domain.keywords.forEach(kw => {
      const rank = parseInt(kw.rank);
      
      if (rank === 1) {
        top1Count++;
        top3Count++; // Rank 1 is also in top 3
      } else if (rank === 2 || rank === 3) {
        top3Count++;
      } else if (rank >= 4 && rank <= 10) {
        positions4to10Count++;
      }
    });
  }
  
  console.log(`${domain.domain}`);
  console.log(`  Total Page 1 Keywords: ${domain.top10KeywordCount}`);
  console.log(`  Rank #1 (Top 1): ${top1Count}`);
  console.log(`  Rank 1-3 (Top 3): ${top3Count}`);
  console.log(`  Rank 4-10 (Positions 4-10): ${positions4to10Count}`);
  console.log(`  Verification: ${top1Count} + ${top3Count - top1Count} + ${positions4to10Count} = ${top1Count + (top3Count - top1Count) + positions4to10Count} (should equal ${domain.top10KeywordCount})`);
  console.log('');
  
  return {
    ...domain,
    top1Count: top1Count,
    top3Count: top3Count,
    positions4to10Count: positions4to10Count
  };
});

// Save updated JSON
fs.writeFileSync('combined_domain_report_with_rankings.json', JSON.stringify(updatedReport, null, 2));
console.log('✅ Updated JSON saved: combined_domain_report_with_rankings.json\n');

// Create updated CSV with new columns
let csvContent = 'Domain,Total Keywords,Top 10 KW Count,Top 1,Top 3,Positions 4-10,Page 1 %,Page 2+ %,Monthly Organic Value,Monthly Organic Clicks,Monthly PPC Budget,Monthly PPC Clicks,Organic Competitors,Paid Competitors,Domain Stats API Cost,Keywords API Cost,Total API Cost,Keyword,Rank,Traffic,CPC\n';

updatedReport.forEach(domain => {
  const baseData = `${domain.domain},${domain.totalKeywords},${domain.top10KeywordCount},${domain.top1Count},${domain.top3Count},${domain.positions4to10Count},${domain.page1Percentage}%,${domain.page2PlusPercentage}%,$${domain.monthlyOrganicValue.toFixed(2)},${domain.monthlyOrganicClicks},$${domain.monthlyPPCBudget.toFixed(2)},${domain.monthlyPPCClicks},${domain.organicCompetitors},${domain.paidCompetitors},$${domain.domainStatsApiCost.toFixed(4)},$${domain.keywordsApiCost.toFixed(4)},$${domain.totalApiCost.toFixed(4)}`;
  
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
fs.writeFileSync('combined_domain_report_with_rankings.csv', csvContent);
console.log('✅ Updated CSV saved: combined_domain_report_with_rankings.csv\n');

// Create summary table
console.log('═══════════════════════════════════════════════════════════════');
console.log('SUMMARY TABLE WITH RANKING POSITIONS');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Domain                          | Total KWs | Page 1 | Top 1 | Top 3 | 4-10');
console.log('--------------------------------|-----------|--------|-------|-------|------');

updatedReport.forEach(domain => {
  const domainName = domain.domain.padEnd(31);
  const totalKWs = String(domain.totalKeywords).padStart(9);
  const page1KWs = String(domain.top10KeywordCount).padStart(6);
  const top1 = String(domain.top1Count).padStart(5);
  const top3 = String(domain.top3Count).padStart(5);
  const pos4to10 = String(domain.positions4to10Count).padStart(4);
  
  console.log(`${domainName} | ${totalKWs} | ${page1KWs} | ${top1} | ${top3} | ${pos4to10}`);
});

// Calculate totals
const totals = updatedReport.reduce((acc, domain) => {
  acc.totalKeywords += domain.totalKeywords;
  acc.page1Keywords += domain.top10KeywordCount;
  acc.top1 += domain.top1Count;
  acc.top3 += domain.top3Count;
  acc.pos4to10 += domain.positions4to10Count;
  return acc;
}, { totalKeywords: 0, page1Keywords: 0, top1: 0, top3: 0, pos4to10: 0 });

console.log('--------------------------------|-----------|--------|-------|-------|------');
console.log(`${'TOTALS'.padEnd(31)} | ${String(totals.totalKeywords).padStart(9)} | ${String(totals.page1Keywords).padStart(6)} | ${String(totals.top1).padStart(5)} | ${String(totals.top3).padStart(5)} | ${String(totals.pos4to10).padStart(4)}`);

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('RANKING POSITION INSIGHTS');
console.log('═══════════════════════════════════════════════════════════════\n');

// Calculate percentages of page 1 keywords
if (totals.page1Keywords > 0) {
  const top1Pct = (totals.top1 / totals.page1Keywords * 100).toFixed(2);
  const top3Pct = (totals.top3 / totals.page1Keywords * 100).toFixed(2);
  const pos4to10Pct = (totals.pos4to10 / totals.page1Keywords * 100).toFixed(2);
  
  console.log(`Of all Page 1 keywords (${totals.page1Keywords} total):`);
  console.log(`  - ${totals.top1} (${top1Pct}%) are ranked #1`);
  console.log(`  - ${totals.top3} (${top3Pct}%) are ranked in top 3 (positions 1-3)`);
  console.log(`  - ${totals.pos4to10} (${pos4to10Pct}%) are ranked in positions 4-10`);
  console.log('');
  console.log('💡 Keywords in positions 2-3 and 4-10 are prime targets for optimization!');
  console.log(`   - Moving position 2-3 to #1 = HUGE traffic increase`);
  console.log(`   - Moving position 4-10 to top 3 = Significant traffic boost`);
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('COMPLETE');
console.log('═══════════════════════════════════════════════════════════════');
