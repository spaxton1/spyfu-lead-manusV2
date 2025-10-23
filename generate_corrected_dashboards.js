const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('roofing_complete_data.json', 'utf8'));

// The CORRECT approach from our original strategy:
// 1. Use overall stats (accurate)
// 2. Show what we CAN see in the sample
// 3. Don't claim full distribution - focus on insights
// 4. Highlight HIGH-VALUE keywords we found

function generate10centDashboard(domain, size, packageData) {
  const stats = packageData.stats;
  const keywords = packageData.keywords?.results || [];
  
  const totalKW = stats.totalOrganicResults || 0;
  const monthlyClicks = stats.monthlyOrganicClicks || 0;
  const monthlyValue = stats.monthlyOrganicClickValue || 0;
  
  // Filter for high-CPC keywords (≥$2.00)
  const highCPC = keywords.filter(kw => (kw.exactCostPerClick || kw.cpc || 0) >= 2.00);
  
  // Find "almost page 1" keywords (ranks 11-20)
  const almostPage1 = keywords.filter(kw => {
    const rank = kw.rank || kw.organicRank || 0;
    return rank >= 11 && rank <= 20;
  });
  
  // Find page 1 keywords (ranks 1-10)
  const page1KW = keywords.filter(kw => (kw.rank || kw.organicRank || 0) <= 10);
  
  // Top 3 high-CPC keywords with ranks
  const topHighCPC = keywords
    .filter(kw => {
      const cpc = kw.exactCostPerClick || kw.cpc || 0;
      const rank = kw.rank || kw.organicRank || 0;
      return cpc >= 2.00 && rank > 0;
    })
    .sort((a, b) => (b.exactCostPerClick || b.cpc || 0) - (a.exactCostPerClick || a.cpc || 0))
    .slice(0, 3);
  
  let html = `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>${domain}</h2>
        <span class="size-badge size-${size.toLowerCase()}">${size}</span>
      </div>
      <div class="package-header">
        <h3>10¢ OPPORTUNITY HUNTER</h3>
        <div class="package-meta">FOCUS: High-value keywords & quick wins from sample analysis</div>
      </div>
      <table class="crm-table">
        <tr><td class="field-label">1. Overview</td><td class="field-value">${totalKW.toLocaleString()} total keywords | $${Math.round(monthlyValue).toLocaleString()}/mo traffic value | ${monthlyClicks.toLocaleString()} clicks/mo</td></tr>
        <tr><td class="field-label">2. Sample Data</td><td class="field-value">Analyzed ${keywords.length} keyword sample | Found ${highCPC.length} high-CPC keywords (≥$2.00)</td></tr>
        <tr><td class="field-label">3. Almost Page 1</td><td class="field-value">${almostPage1.length > 0 ? `Found ${almostPage1.length} keywords at ranks #11-20 (just off page 1)` : 'Sample shows page 1 and page 2+ rankings'}</td></tr>`;
  
  // Show top high-CPC keywords we found
  topHighCPC.forEach((kw, i) => {
    const rank = kw.rank || kw.organicRank || 0;
    const cpc = kw.exactCostPerClick || kw.cpc || 0;
    const keyword = kw.keyword || kw.term || 'N/A';
    const spotsTo1 = rank - 1;
    const spotsToP1 = Math.max(0, rank - 10);
    
    let insight = '';
    if (rank <= 10) {
      insight = `On page 1! ${spotsTo1} spots to #1 position`;
    } else if (rank <= 20) {
      insight = `${spotsToP1} spots to page 1 - QUICK WIN!`;
    } else {
      insight = `Rank #${rank} - optimization opportunity`;
    }
    
    html += `\n        <tr><td class="field-label">${4 + i}. High-Value KW #${i + 1}</td><td class="field-value">"${keyword}" at #${rank} | $${cpc.toFixed(2)} CPC | ${insight}</td></tr>`;
  });
  
  // If we have page 1 keywords
  if (page1KW.length > 0) {
    html += `\n        <tr><td class="field-label">${4 + topHighCPC.length}. Page 1 Presence</td><td class="field-value">Found ${page1KW.length} keywords on page 1 in sample - shows SEO capability!</td></tr>`;
  }
  
  html += `\n        <tr><td class="field-label">Next Step</td><td class="field-value">Full keyword audit recommended - sample shows ${highCPC.length} high-value opportunities worth targeting</td></tr>`;
  
  html += `\n      </table>
      <div class="cost-badge">Cost: $0.10</div>
      <div class="sample-note">* Based on keyword sample analysis. Full audit available.</div>
    </div>`;
  
  return html;
}

// Generate HTML file
let dashboardHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SpyFu Roofing Dashboards - CORRECTED</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 {
      color: white;
      text-align: center;
      font-size: 2.5em;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .alert {
      background: #ffd700;
      color: #000;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
      text-align: center;
      font-weight: bold;
    }
    .dashboard {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      position: relative;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 3px solid #667eea;
    }
    .dashboard-header h2 {
      color: #2d3748;
      font-size: 1.8em;
    }
    .size-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 0.9em;
      text-transform: uppercase;
    }
    .size-small { background: #48bb78; color: white; }
    .size-medium { background: #ed8936; color: white; }
    .size-large { background: #e53e3e; color: white; }
    .package-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .package-header h3 {
      font-size: 1.3em;
      margin-bottom: 5px;
    }
    .package-meta {
      font-size: 0.9em;
      opacity: 0.9;
    }
    .crm-table {
      width: 100%;
      border-collapse: collapse;
    }
    .crm-table tr {
      border-bottom: 1px solid #e2e8f0;
    }
    .crm-table tr:last-child {
      border-bottom: none;
    }
    .field-label {
      background: #f7fafc;
      font-weight: bold;
      color: #2d3748;
      padding: 15px 20px;
      width: 30%;
      vertical-align: top;
    }
    .field-value {
      padding: 15px 20px;
      color: #4a5568;
    }
    .cost-badge {
      position: absolute;
      top: 30px;
      right: 30px;
      background: #48bb78;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 0.9em;
    }
    .sample-note {
      margin-top: 15px;
      padding: 12px;
      background: #edf2f7;
      border-left: 4px solid #667eea;
      font-size: 0.9em;
      color: #4a5568;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏗️ SpyFu Roofing Dashboards - CORRECTED APPROACH</h1>
    
    <div class="alert">
      ⚠️ CORRECTED VERSION: Shows actual API data without false calculations
    </div>
`;

// Generate dashboards for each domain
for (const [domain, data] of Object.entries(rawData)) {
  const pkgs = data.packages;
  
  if (pkgs.opportunity_10cent) {
    dashboardHTML += generate10centDashboard(domain, data.size, pkgs.opportunity_10cent);
  }
}

dashboardHTML += `
  </div>
</body>
</html>`;

fs.writeFileSync('ROOFING_DASHBOARDS_CORRECTED.html', dashboardHTML);
console.log('✅ Generated ROOFING_DASHBOARDS_CORRECTED.html');
console.log('   Uses ACTUAL data without false calculations');
console.log('   Shows what we CAN see, not what we guess');
