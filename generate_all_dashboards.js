const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('roofing_complete_data.json', 'utf8'));

// Constants
const HIGH_CPC_THRESHOLD = 2.00;
const TRAFFIC_DIST = { 1: 0.40, 2: 0.20, 3: 0.10, 4: 0.05, 5: 0.03, 6: 0.02, 7: 0.015, 8: 0.01, 9: 0.008, 10: 0.005 };

// Helper functions
function filterHighCPC(keywords) {
  return keywords.filter(kw => (kw.exactCostPerClick || kw.cpc || 0) >= HIGH_CPC_THRESHOLD);
}

function filterAlmostPage1(keywords) {
  return keywords.filter(kw => {
    const rank = kw.rank || kw.organicRank || 0;
    return rank >= 11 && rank <= 20;
  });
}

function calculatePage1Potential(keyword) {
  const searchVolume = keyword.searchVolume || keyword.monthlySearches || 0;
  const cpc = keyword.exactCostPerClick || kw.cpc || 0;
  const page1Traffic = searchVolume * (TRAFFIC_DIST[10] || 0.005);
  return page1Traffic * cpc;
}

// 10¢ OPPORTUNITY HUNTER Dashboard
function generate10centDashboard(domain, size, packageData) {
  const stats = packageData.stats;
  const keywords = packageData.keywords?.results || [];
  
  const totalKW = stats.totalOrganicResults || 0;
  const monthlyClicks = stats.monthlyOrganicClicks || 0;
  const monthlyValue = stats.monthlyOrganicClickValue || 0;
  
  const highCPC = filterHighCPC(keywords);
  const almostPage1 = filterAlmostPage1(highCPC);
  
  // Calculate Page 1 Gap
  const page1Keywords = keywords.filter(kw => (kw.rank || kw.organicRank || 0) <= 10);
  const buriedKeywords = totalKW - page1Keywords.length;
  const buriedPct = totalKW > 0 ? ((buriedKeywords / totalKW) * 100).toFixed(1) : 0;
  
  // Calculate almost page1 value
  const almostValue = almostPage1.reduce((sum, kw) => sum + calculatePage1Potential(kw), 0);
  
  // Top quick wins
  const quickWins = almostPage1
    .sort((a, b) => calculatePage1Potential(b) - calculatePage1Potential(a))
    .slice(0, 3);
  
  let html = `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>${domain}</h2>
        <span class="size-badge size-${size.toLowerCase()}">${size}</span>
      </div>
      <div class="package-header">
        <h3>10¢ OPPORTUNITY HUNTER</h3>
        <div class="package-meta">201 rows | Focus: Almost Page 1, Quick Wins, Page1 Gap</div>
      </div>
      <table class="crm-table">
        <tr><td class="field-label">1. Overview</td><td class="field-value">${totalKW.toLocaleString()} KWs | $${Math.round(monthlyValue).toLocaleString()}/mo value | ${monthlyClicks.toLocaleString()} clicks/mo</td></tr>
        <tr><td class="field-label">2. Page1 Gap 🚨</td><td class="field-value">🚨 ${buriedPct}% BURIED on Pg2+ | Only ${page1Keywords.length} on Page 1!</td></tr>
        <tr><td class="field-label">3. Almost Page1</td><td class="field-value">${almostPage1.length} KWs at #11-20 | Worth $${Math.round(almostValue).toLocaleString()}/mo if pushed to P1</td></tr>`;
  
  quickWins.forEach((kw, i) => {
    const rank = kw.rank || kw.organicRank || 0;
    const cpc = kw.exactCostPerClick || kw.cpc || 0;
    const spotsToP1 = rank - 10;
    const potential = calculatePage1Potential(kw);
    const keyword = kw.keyword || kw.term || 'N/A';
    html += `\n        <tr><td class="field-label">${4 + i}. Quick Win #${i + 1}</td><td class="field-value">"${keyword}" #${rank} | $${cpc.toFixed(2)} CPC | ${spotsToP1} spots to P1 = $${Math.round(potential).toLocaleString()}/mo</td></tr>`;
  });
  
  html += `\n      </table>
      <div class="cost-badge">Cost: $0.1005</div>
    </div>`;
  
  return html;
}

// 11¢ HISTORY TRACKER Dashboard
function generate11centDashboard(domain, size, packageData) {
  const stats = packageData.stats;
  const keywords = packageData.keywords?.results || [];
  const gained = packageData.gained?.results || []; // BUG: Actually losses
  const lost = packageData.lost?.results || []; // BUG: Actually improvements
  
  const totalKW = stats.totalOrganicResults || 0;
  const monthlyClicks = stats.monthlyOrganicClicks || 0;
  const monthlyValue = stats.monthlyOrganicClickValue || 0;
  
  // Due to API bug, swap these
  const actualLosses = gained.length;
  const actualGains = lost.length;
  
  let html = `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>${domain}</h2>
        <span class="size-badge size-${size.toLowerCase()}">${size}</span>
      </div>
      <div class="package-header">
        <h3>11¢ HISTORY TRACKER</h3>
        <div class="package-meta">221 rows | Focus: Lost/Gained Keywords Over Time</div>
      </div>
      <table class="crm-table">
        <tr><td class="field-label">1. Overview</td><td class="field-value">${totalKW.toLocaleString()} KWs | $${Math.round(monthlyValue).toLocaleString()}/mo value | ${monthlyClicks.toLocaleString()} clicks/mo</td></tr>
        <tr><td class="field-label">2. Lost Keywords ⚠️</td><td class="field-value">LOST ${actualLosses} keywords in last 2 years | Hemorrhaging rankings!</td></tr>
        <tr><td class="field-label">3. Gained Keywords ✓</td><td class="field-value">GAINED ${actualGains} keywords in last 2 years</td></tr>
        <tr><td class="field-label">4. Net Change</td><td class="field-value">${actualGains - actualLosses > 0 ? '↗️ +' : '↘️ '}${(actualGains - actualLosses).toLocaleString()} net keywords</td></tr>
      </table>
      <div class="cost-badge">Cost: $0.1105</div>
    </div>`;
  
  return html;
}

// 12¢ COMBO Dashboard
function generate12centDashboard(domain, size, packageData) {
  const stats = packageData.stats;
  const keywords = packageData.keywords?.results || [];
  const valuable = packageData.valuable?.results || [];
  
  const totalKW = stats.totalOrganicResults || 0;
  const monthlyClicks = stats.monthlyOrganicClicks || 0;
  const monthlyValue = stats.monthlyOrganicClickValue || 0;
  
  const highCPC = filterHighCPC(keywords);
  const almostPage1 = filterAlmostPage1(highCPC);
  const almostValue = almostPage1.reduce((sum, kw) => sum + calculatePage1Potential(kw), 0);
  
  // Page 1 Gap
  const page1Keywords = keywords.filter(kw => (kw.rank || kw.organicRank || 0) <= 10);
  const buriedPct = totalKW > 0 ? (((totalKW - page1Keywords.length) / totalKW) * 100).toFixed(1) : 0;
  
  // Top valuable keyword
  const topValuable = valuable[0] || {};
  const topKW = topValuable.keyword || topValuable.term || 'N/A';
  const topRank = topValuable.rank || topValuable.organicRank || 0;
  const topCPC = topValuable.exactCostPerClick || topValuable.cpc || 0;
  
  let html = `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>${domain}</h2>
        <span class="size-badge size-${size.toLowerCase()}">${size}</span>
      </div>
      <div class="package-header">
        <h3>12¢ OPPORTUNITY + HISTORY COMBO</h3>
        <div class="package-meta">241 rows | Focus: Complete Picture with History & Opportunity</div>
      </div>
      <table class="crm-table">
        <tr><td class="field-label">1. Overview</td><td class="field-value">${totalKW.toLocaleString()} KWs | $${Math.round(monthlyValue).toLocaleString()}/mo value | ${monthlyClicks.toLocaleString()} clicks/mo</td></tr>
        <tr><td class="field-label">2. Page1 Gap 🚨</td><td class="field-value">${buriedPct}% buried on Pg2+ | Only ${page1Keywords.length} on Page 1</td></tr>
        <tr><td class="field-label">3. Almost Page1</td><td class="field-value">${almostPage1.length} KWs at #11-20 | Worth $${Math.round(almostValue).toLocaleString()}/mo</td></tr>
        <tr><td class="field-label">4. Top Valuable KW</td><td class="field-value">"${topKW}" #${topRank} | $${topCPC.toFixed(2)} CPC</td></tr>
        <tr><td class="field-label">5. High-Value Count</td><td class="field-value">${valuable.length} high-value keywords tracked</td></tr>
      </table>
      <div class="cost-badge">Cost: $0.1205</div>
    </div>`;
  
  return html;
}

// 15¢ COMPETITOR (Limited - without overlap data)
function generate15centDashboard(domain, size, packageData) {
  const yourStats = packageData.yourStats || {};
  const compStats = packageData.compStats || {};
  const competitor = packageData.competitor || 'competitor.com';
  
  const yourKWs = yourStats.totalOrganicResults || 0;
  const yourClicks = yourStats.monthlyOrganicClicks || 0;
  const yourValue = yourStats.monthlyOrganicClickValue || 0;
  
  const compKWs = compStats.totalOrganicResults || 0;
  const compClicks = compStats.monthlyOrganicClicks || 0;
  const compValue = compStats.monthlyOrganicClickValue || 0;
  
  const sizeRatio = yourKWs > 0 ? (compKWs / yourKWs).toFixed(1) : 0;
  const valueRatio = yourValue > 0 ? (compValue / yourValue).toFixed(1) : 0;
  
  let html = `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>${domain}</h2>
        <span class="size-badge size-${size.toLowerCase()}">${size}</span>
      </div>
      <div class="package-header">
        <h3>15¢ COMPETITOR ASSAULT</h3>
        <div class="package-meta">291 rows | Focus: Competitive Intelligence vs ${competitor}</div>
      </div>
      <table class="crm-table">
        <tr><td class="field-label">1. Your Overview</td><td class="field-value">YOU: ${yourKWs.toLocaleString()} KWs | $${Math.round(yourValue).toLocaleString()}/mo | ${yourClicks.toLocaleString()} clicks/mo</td></tr>
        <tr><td class="field-label">2. Enemy Alert 🎯</td><td class="field-value">🎯 ${competitor}: ${compKWs.toLocaleString()} KWs | $${Math.round(compValue).toLocaleString()}/mo | ${sizeRatio}X ${sizeRatio > 1 ? 'BIGGER' : 'SMALLER'}</td></tr>
        <tr><td class="field-label">3. Size Comparison</td><td class="field-value">They have ${sizeRatio}X more keywords than you</td></tr>
        <tr><td class="field-label">4. Value Comparison</td><td class="field-value">They generate ${valueRatio}X more monthly value</td></tr>
        <tr><td class="field-label">5. Battle Status</td><td class="field-value">${sizeRatio > 1.5 ? '🔴 LOSING BADLY' : sizeRatio > 1 ? '🟡 LOSING' : '🟢 WINNING'} - ${sizeRatio > 1 ? 'They dominate' : 'You dominate'}</td></tr>
      </table>
      <div class="cost-badge">Cost: $0.1455</div>
    </div>`;
  
  return html;
}

// Generate complete HTML
let dashboardHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SpyFu Roofing Company Dashboards - REAL DATA</title>
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
    .subtitle {
      color: rgba(255,255,255,0.9);
      text-align: center;
      font-size: 1.2em;
      margin-bottom: 40px;
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
    @media print {
      body { background: white; padding: 0; }
      .dashboard { page-break-after: always; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏗️ SpyFu Roofing Company Dashboards</h1>
    <p class="subtitle">Real Data from 3 Roofing Companies | All 4 Package Tiers | Generated ${new Date().toLocaleDateString()}</p>
`;

// Generate dashboards for each domain
for (const [domain, data] of Object.entries(rawData)) {
  const pkgs = data.packages;
  
  // Generate all 4 packages
  if (pkgs.opportunity_10cent) {
    dashboardHTML += generate10centDashboard(domain, data.size, pkgs.opportunity_10cent);
  }
  
  if (pkgs.history_11cent) {
    dashboardHTML += generate11centDashboard(domain, data.size, pkgs.history_11cent);
  }
  
  if (pkgs.combo_12cent) {
    dashboardHTML += generate12centDashboard(domain, data.size, pkgs.combo_12cent);
  }
  
  if (pkgs.competitor_15cent) {
    dashboardHTML += generate15centDashboard(domain, data.size, pkgs.competitor_15cent);
  }
}

dashboardHTML += `
  </div>
</body>
</html>`;

fs.writeFileSync('ROOFING_DASHBOARDS_COMPLETE.html', dashboardHTML);
console.log('✅ Generated ROOFING_DASHBOARDS_COMPLETE.html');
console.log(`📊 Total Dashboards: ${Object.keys(rawData).length * 4} (3 domains × 4 packages)`);
