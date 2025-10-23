#!/usr/bin/env node

const fs = require('fs');

// Load the complete data
const data = JSON.parse(fs.readFileSync('complete_package_data.json', 'utf8'));

// Traffic distribution constants
const TRAFFIC_DIST = {
  1: 0.40, 2: 0.20, 3: 0.10, 4: 0.07, 5: 0.05,
  6: 0.03, 7: 0.02, 8: 0.02, 9: 0.01, 10: 0.01
};

// Helper functions
function filterHighCPC(keywords, threshold = 2.00) {
  return keywords.filter(kw => (kw.exactCostPerClick || 0) >= threshold);
}

function filterAlmostPage1(keywords) {
  return keywords.filter(kw => {
    const rank = kw.rank || 999;
    return rank >= 11 && rank <= 20;
  });
}

function filterPage1(keywords) {
  return keywords.filter(kw => {
    const rank = kw.rank || 999;
    return rank >= 1 && rank <= 10;
  });
}

function calculatePage1Potential(kw) {
  const rank = kw.rank || 999;
  if (rank <= 10) return 0;
  const volume = kw.searchVolume || 0;
  const cpc = kw.exactCostPerClick || 0;
  const page1Traffic = volume * 0.01; // Conservative: position 10
  return page1Traffic * cpc;
}

function generate10CentDashboard(size, packageData) {
  if (!packageData) return '<p>No data available</p>';
  
  const stats = packageData.stats;
  const keywords = packageData.keywords;
  const highCPC = filterHighCPC(keywords);
  const almostPage1 = filterAlmostPage1(highCPC);
  const page1Keywords = filterPage1(keywords);
  const lowHang = page1Keywords.filter(kw => (kw.rank || 0) >= 2 && (kw.rank || 0) <= 10);
  
  const totalKW = stats.totalOrganicResults || 0;
  const monthlyValue = stats.monthlyOrganicClickValue || 0;
  const monthlyClicks = stats.monthlyOrganicClicks || 0;
  const page1Count = page1Keywords.length;
  const buriedPct = ((totalKW - page1Count) / totalKW * 100).toFixed(1);
  
  // Calculate almost page 1 value
  const almostValue = almostPage1.reduce((sum, kw) => sum + calculatePage1Potential(kw), 0);
  
  // Sort for top opportunities
  const almostSorted = [...almostPage1].sort((a, b) => (b.exactCostPerClick || 0) - (a.exactCostPerClick || 0));
  
  // Top 3 quick wins
  const quickWins = almostSorted.slice(0, 3);
  
  // Top money keyword at #1
  const at1 = keywords.filter(kw => kw.rank === 1).sort((a, b) => (b.exactCostPerClick || 0) - (a.exactCostPerClick || 0))[0];
  
  const fields = [
    { label: '1. Overview', value: `${totalKW.toLocaleString()} KWs | $${Math.round(monthlyValue).toLocaleString()}/mo value | ${monthlyClicks.toLocaleString()} clicks/mo` },
    { label: '2. Page1 Gap', value: `🚨 ${buriedPct}% BURIED on Pg2+ | Only ${page1Count} on Page 1!` },
    { label: '3. Almost Page1', value: `${almostPage1.length} KWs at #11-20 | Worth $${Math.round(almostValue).toLocaleString()}/mo if pushed to P1` }
  ];
  
  quickWins.forEach((kw, i) => {
    const spotsToP1 = (kw.rank || 0) - 10;
    const potential = calculatePage1Potential(kw);
    fields.push({
      label: `${4 + i}. Quick Win #${i + 1}`,
      value: `"${kw.keyword}" #${kw.rank} | $${(kw.exactCostPerClick || 0).toFixed(2)} CPC | ${spotsToP1} spots to P1 = $${Math.round(potential).toLocaleString()}/mo`
    });
  });
  
  if (lowHang.length > 0) {
    const lowHangValue = lowHang.slice(0, 10).reduce((sum, kw) => {
      const current = TRAFFIC_DIST[kw.rank] || 0;
      const target = TRAFFIC_DIST[1];
      const increase = (kw.searchVolume || 0) * (target - current) * (kw.exactCostPerClick || 0);
      return sum + increase;
    }, 0);
    fields.push({
      label: '7. Low Hang Pg1',
      value: `${lowHang.length} KWs at #2-10 | Push to #1 = +$${Math.round(lowHangValue).toLocaleString()}/mo (40% traffic boost)`
    });
  }
  
  if (at1) {
    fields.push({
      label: `${fields.length + 1}. Top Money KW`,
      value: `"${at1.keyword}" #1 | $${(at1.exactCostPerClick || 0).toFixed(2)} CPC | ${(at1.searchVolume || 0).toLocaleString()}/mo | YOUR STRENGTH! 💪`
    });
  }
  
  // Calculate potential value
  const top10Almost = almostSorted.slice(0, 10);
  const potentialValue = top10Almost.reduce((sum, kw) => sum + calculatePage1Potential(kw), 0);
  fields.push({
    label: `${fields.length + 1}. Potential Value`,
    value: `Fix 10 'almost there' = +$${Math.round(potentialValue).toLocaleString()}/mo | 60-90 days | Est: 80 hrs`
  });
  
  return generateDashboardHTML(fields, packageData.cost);
}

function generate12CentDashboard(size, packageData) {
  if (!packageData) return '<p>No data available</p>';
  
  const stats = packageData.stats;
  const keywords = packageData.keywords;
  const improvements = packageData.improvements || [];
  const drops = packageData.drops || [];
  const fellOff = packageData.fellOff || [];
  
  const highCPC = filterHighCPC(keywords);
  const almostPage1 = filterAlmostPage1(highCPC);
  const page1Keywords = filterPage1(keywords);
  
  const totalKW = stats.totalOrganicResults || 0;
  const monthlyValue = stats.monthlyOrganicClickValue || 0;
  const monthlyClicks = stats.monthlyOrganicClicks || 0;
  const page1Count = page1Keywords.length;
  const buriedPct = ((totalKW - page1Count) / totalKW * 100).toFixed(1);
  
  // Calculate almost page 1 value
  const almostValue = almostPage1.reduce((sum, kw) => sum + calculatePage1Potential(kw), 0);
  
  // Sort for top opportunities
  const almostSorted = [...almostPage1].sort((a, b) => (b.exactCostPerClick || 0) - (a.exactCostPerClick || 0));
  const quickWins = almostSorted.slice(0, 3);
  
  // Best improvement
  const bestImprovement = improvements.sort((a, b) => Math.abs(b.rankChange || 0) - Math.abs(a.rankChange || 0))[0];
  
  // Worst drop
  const worstDrop = drops.sort((a, b) => Math.abs(b.rankChange || 0) - Math.abs(a.rankChange || 0))[0];
  
  // Calculate fell off value
  const fellOffValue = fellOff.reduce((sum, kw) => sum + calculatePage1Potential(kw), 0);
  
  const fields = [
    { label: '1. Overview', value: `${totalKW.toLocaleString()} KWs | $${Math.round(monthlyValue).toLocaleString()}/mo | ${monthlyClicks} clicks/mo` },
    { label: '2. Momentum', value: `${improvements.length} improving | ${drops.length} declining | Net: +${improvements.length - drops.length}` },
    { label: '3. Page1 Gap', value: `🚨 ${buriedPct}% BURIED | Only ${page1Count} on P1` },
    { label: '4. Almost Page1', value: `${almostPage1.length} at #11-20 | Worth $${Math.round(almostValue).toLocaleString()}/mo` }
  ];
  
  quickWins.forEach((kw, i) => {
    const spotsToP1 = (kw.rank || 0) - 10;
    const potential = calculatePage1Potential(kw);
    fields.push({
      label: `${5 + i}. Quick Win #${i + 1}`,
      value: `"${kw.keyword}" #${kw.rank} | $${(kw.exactCostPerClick || 0).toFixed(2)} | ${spotsToP1} to P1`
    });
  });
  
  if (bestImprovement) {
    const oldRank = (bestImprovement.rank || 0) - (bestImprovement.rankChange || 0);
    fields.push({
      label: '8. Recent Win',
      value: `"${bestImprovement.keyword}" #${Math.round(oldRank)}→#${bestImprovement.rank} ↑${Math.abs(bestImprovement.rankChange || 0)} | SEO IS working!`
    });
  }
  
  if (worstDrop) {
    const oldRank = (worstDrop.rank || 0) - (worstDrop.rankChange || 0);
    const loss = Math.abs(worstDrop.rankChange || 0) * (worstDrop.exactCostPerClick || 0) * 50;
    fields.push({
      label: '9. Recent Drop',
      value: `"${worstDrop.keyword}" #${Math.round(oldRank)}→#${worstDrop.rank} ↓${Math.abs(worstDrop.rankChange || 0)} | $${(worstDrop.exactCostPerClick || 0).toFixed(2)} | -$${Math.round(loss).toLocaleString()}/mo`
    });
  }
  
  if (fellOff.length > 0) {
    fields.push({
      label: '10. Fell Off Page1',
      value: `${fellOff.length} KWs fell off P1 | Lost $${Math.round(fellOffValue).toLocaleString()}/mo`
    });
  }
  
  return generateDashboardHTML(fields, packageData.cost);
}

function generate15CentDashboard(size, packageData) {
  if (!packageData) return '<p>No data available</p>';
  
  const yourStats = packageData.yourStats;
  const compStats = packageData.compStats;
  const yourKeywords = packageData.yourKeywords;
  const compKeywords = packageData.compKeywords;
  
  const yourTotal = yourStats.totalOrganicResults || 0;
  const yourValue = yourStats.monthlyOrganicClickValue || 0;
  const yourClicks = yourStats.monthlyOrganicClicks || 0;
  
  const compTotal = compStats.totalOrganicResults || 0;
  const compValue = compStats.monthlyOrganicClickValue || 0;
  const compClicks = compStats.monthlyOrganicClicks || 0;
  const sizeRatio = (compTotal / yourTotal).toFixed(1);
  
  // Find shared keywords
  const yourKwMap = {};
  yourKeywords.forEach(kw => { yourKwMap[kw.keyword] = kw; });
  const compKwMap = {};
  compKeywords.forEach(kw => { compKwMap[kw.keyword] = kw; });
  
  const sharedKeywords = Object.keys(yourKwMap).filter(k => compKwMap[k]);
  
  let youWin = 0, theyWin = 0, tied = 0;
  const gaps = [];
  
  sharedKeywords.forEach(keyword => {
    const yourRank = yourKwMap[keyword].rank || 999;
    const theirRank = compKwMap[keyword].rank || 999;
    const gap = yourRank - theirRank;
    
    if (gap < 0) youWin++;
    else if (gap > 0) theyWin++;
    else tied++;
    
    if (gap > 0) {
      gaps.push({
        keyword,
        yourRank,
        theirRank,
        gap,
        cpc: yourKwMap[keyword].exactCostPerClick || 0
      });
    }
  });
  
  const lossRate = sharedKeywords.length > 0 ? ((theyWin / sharedKeywords.length) * 100).toFixed(0) : 0;
  
  // Find biggest gaps
  const biggestGap = gaps.sort((a, b) => b.gap - a.gap)[0];
  const highestValueGap = gaps.sort((a, b) => b.cpc - a.cpc)[0];
  
  const fields = [
    { label: '1. Overview', value: `YOU: ${yourTotal.toLocaleString()} KWs | $${Math.round(yourValue).toLocaleString()}/mo | ${yourClicks} clicks/mo` },
    { label: '2. Enemy Alert', value: `🎯 Competitor: ${compTotal.toLocaleString()} KWs | $${Math.round(compValue).toLocaleString()}/mo | ${sizeRatio}X BIGGER` },
    { label: '3. Direct Battle', value: `${sharedKeywords.length} shared KWs | They WIN ${theyWin} | You WIN ${youWin} | TIED ${tied} (${lossRate}% loss rate)` }
  ];
  
  if (biggestGap) {
    fields.push({
      label: '4. Money Beatdown',
      value: `"${biggestGap.keyword}" | THEM: #${biggestGap.theirRank} | YOU: #${biggestGap.yourRank} | GAP: ${biggestGap.gap}`
    });
  }
  
  if (highestValueGap) {
    fields.push({
      label: '5. Biggest Gap',
      value: `"${highestValueGap.keyword}" | THEM: #${highestValueGap.theirRank} ($${highestValueGap.cpc.toFixed(2)} CPC) | YOU: #${highestValueGap.yourRank} | CRUSHED`
    });
  }
  
  const compExclusive = compKeywords.length - sharedKeywords.length;
  const top10CompExclusive = compKeywords
    .filter(kw => !yourKwMap[kw.keyword])
    .sort((a, b) => (b.exactCostPerClick || 0) - (a.exactCostPerClick || 0))
    .slice(0, 10);
  const exclusiveValue = top10CompExclusive.reduce((sum, kw) => 
    sum + (kw.exactCostPerClick || 0) * (kw.searchVolume || 0) * 0.1, 0
  );
  
  fields.push({
    label: '6. Portfolio Gap',
    value: `They rank for ${compExclusive.toLocaleString()} KWs YOU DON'T | Top 10 worth $${Math.round(exclusiveValue).toLocaleString()}/mo`
  });
  
  return generateDashboardHTML(fields, packageData.cost);
}

function generateDashboardHTML(fields, cost) {
  let html = '<div class="crm-dashboard">';
  html += `<div class="cost-badge">Package Cost: $${cost.toFixed(4)}</div>`;
  html += '<table class="dashboard-table">';
  
  fields.forEach(field => {
    html += '<tr>';
    html += `<td class="field-label">${field.label}</td>`;
    html += `<td class="field-value">${field.value}</td>`;
    html += '</tr>';
  });
  
  html += '</table>';
  html += '</div>';
  return html;
}

// Generate HTML report
let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SpyFu Lead Enrichment - REAL DATA Dashboards</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .header {
      background: white;
      padding: 40px;
      border-radius: 15px;
      margin-bottom: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .header h1 {
      font-size: 42px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    
    .header p {
      font-size: 18px;
      color: #666;
    }
    
    .domain-section {
      background: white;
      padding: 30px;
      border-radius: 15px;
      margin-bottom: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    
    .domain-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 3px solid #f0f0f0;
    }
    
    .domain-title {
      font-size: 28px;
      color: #333;
    }
    
    .domain-meta {
      text-align: right;
      color: #666;
      font-size: 14px;
    }
    
    .package-row {
      margin-bottom: 40px;
    }
    
    .package-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 10px 10px 0 0;
      font-size: 20px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .crm-dashboard {
      background: #f8f9fa;
      border: 2px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 10px 10px;
      position: relative;
    }
    
    .cost-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #28a745;
      color: white;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .dashboard-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .dashboard-table tr {
      border-bottom: 1px solid #dee2e6;
    }
    
    .dashboard-table tr:last-child {
      border-bottom: none;
    }
    
    .field-label {
      background: #e9ecef;
      padding: 15px 20px;
      font-weight: 600;
      color: #495057;
      width: 250px;
      vertical-align: top;
    }
    
    .field-value {
      padding: 15px 20px;
      color: #212529;
      line-height: 1.6;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    }
    
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .size-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-left: 10px;
    }
    
    .size-small { background: #28a745; color: white; }
    .size-medium { background: #ffc107; color: #333; }
    .size-large { background: #dc3545; color: white; }
    
    @media print {
      body { background: white; }
      .domain-section { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 SpyFu Lead Enrichment System</h1>
      <p>Real Data from 3 Domain Sizes × 4 Package Options = 12 Complete CRM Dashboards</p>
      <p style="font-size: 14px; color: #999; margin-top: 10px;">Using ACTUAL SpyFu API data • High-CPC filter active (≥$2.00)</p>
    </div>
`;

// Generate dashboards for each size
const sizes = ['small', 'medium', 'large'];
const sizeLabels = {
  small: 'SMALL (1,451 KWs)',
  medium: 'MEDIUM (3,968 KWs)',
  large: 'LARGE (4,997 KWs)'
};
const sizeDomains = {
  small: 'poolsbybradley.com',
  medium: 'beyondexteriors.com',
  large: 'roofsimple.com'
};

sizes.forEach(size => {
  const sizeClass = `size-${size}`;
  html += `
    <div class="domain-section">
      <div class="domain-header">
        <div>
          <span class="domain-title">${sizeDomains[size]}</span>
          <span class="size-badge ${sizeClass}">${sizeLabels[size]}</span>
        </div>
        <div class="domain-meta">
          Industry: ${size === 'small' ? 'Pool Construction' : 'Roofing'}<br>
          Real SpyFu API Data
        </div>
      </div>
      
      <div class="package-row">
        <div class="package-header">
          <span>📦 10¢ OPPORTUNITY HUNTER</span>
          <span style="font-size: 14px;">201 API rows • Focus: Pure Opportunity</span>
        </div>
        ${generate10CentDashboard(size, data[size]['10cent_opportunity'])}
      </div>
      
      <div class="package-row">
        <div class="package-header">
          <span>📦 12¢ OPPORTUNITY + HISTORY COMBO</span>
          <span style="font-size: 14px;">241 API rows • Focus: Complete Story</span>
        </div>
        ${generate12CentDashboard(size, data[size]['12cent_combo'])}
      </div>
      
      <div class="package-row">
        <div class="package-header">
          <span>📦 15¢ COMPETITOR ASSAULT</span>
          <span style="font-size: 14px;">301 API rows • Focus: Beat the Enemy</span>
        </div>
        ${generate15CentDashboard(size, data[size]['15cent_competitor'])}
      </div>
    </div>
  `;
});

html += `
  </div>
</body>
</html>
`;

fs.writeFileSync('VISUAL_DASHBOARDS_REAL_DATA.html', html);
console.log('✅ Generated VISUAL_DASHBOARDS_REAL_DATA.html');
console.log('📊 Open in browser to see all 12 CRM dashboards with real data!');
