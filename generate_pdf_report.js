const puppeteer = require('puppeteer');
const fs = require('fs');

// Load the summary data
const reportData = JSON.parse(fs.readFileSync('./master_report_summary.json', 'utf8'));

// Generate HTML content
function generateHTML() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SpyFu API Master Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .cover-page {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            page-break-after: always;
        }
        
        .cover-title {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .cover-subtitle {
            font-size: 24px;
            margin-bottom: 40px;
            opacity: 0.9;
        }
        
        .cover-stats {
            display: flex;
            gap: 40px;
            margin-top: 40px;
        }
        
        .cover-stat {
            text-align: center;
        }
        
        .cover-stat-value {
            font-size: 36px;
            font-weight: bold;
        }
        
        .cover-stat-label {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 5px;
        }
        
        .page {
            padding: 40px;
            page-break-after: always;
        }
        
        .domain-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        
        .domain-title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .domain-cost {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .section {
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .cold-call-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            font-style: italic;
            color: #856404;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 15px 0;
        }
        
        .stat-box {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border-left: 3px solid #667eea;
        }
        
        .stat-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-top: 5px;
        }
        
        .keyword-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            background: white;
        }
        
        .keyword-table th {
            background: #667eea;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
        }
        
        .keyword-table td {
            padding: 10px;
            border-bottom: 1px solid #e9ecef;
            font-size: 13px;
        }
        
        .keyword-table tr:hover {
            background: #f8f9fa;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
        }
        
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        
        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }
        
        .badge-danger {
            background: #f8d7da;
            color: #721c24;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-style: italic;
        }
        
        .decline-highlight {
            color: #dc3545;
            font-weight: bold;
        }
        
        .growth-highlight {
            color: #28a745;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="cover-page">
        <div class="cover-title">SpyFu API Master Report</div>
        <div class="cover-subtitle">Complete SEO Analysis Across ${reportData.totalDomains} Domains</div>
        <div class="cover-stats">
            <div class="cover-stat">
                <div class="cover-stat-value">${reportData.totalDomains}</div>
                <div class="cover-stat-label">Domains Analyzed</div>
            </div>
            <div class="cover-stat">
                <div class="cover-stat-value">$${reportData.totalCost.toFixed(2)}</div>
                <div class="cover-stat-label">Total API Cost</div>
            </div>
            <div class="cover-stat">
                <div class="cover-stat-value">$${reportData.avgCostPerDomain.toFixed(4)}</div>
                <div class="cover-stat-label">Avg Cost/Domain</div>
            </div>
        </div>
        <div style="margin-top: 60px; opacity: 0.7; font-size: 14px;">
            Generated: ${new Date(reportData.generatedAt).toLocaleString()}
        </div>
    </div>

    ${reportData.domains.map(domain => generateDomainPage(domain)).join('\n')}
</body>
</html>
  `;
  
  return html;
}

function generateDomainPage(domain) {
  const analysis = domain.analysis;
  
  // Handle domains with no data
  if (!analysis.page1 && analysis.money.moneyKeywords.length === 0) {
    return `
    <div class="page">
        <div class="domain-header">
            <div class="domain-title">${domain.domain}</div>
            <div class="domain-cost">API Cost: $${domain.cost.toFixed(4)}</div>
        </div>
        <div class="no-data">
            ⚠️ No keyword data available for this domain
        </div>
    </div>
    `;
  }
  
  const trends = analysis.trends;
  const page1 = analysis.page1;
  const money = analysis.money;
  
  // Generate cold calling script
  let coldCallScript = '';
  if (trends.decline.value > 0) {
    const monthText = trends.peak.monthsAgo === 1 ? 'month' : 'months';
    coldCallScript = `"Did you know your SEO value dropped $${formatNumber(trends.decline.value)} over the past ${trends.peak.monthsAgo} ${monthText}? You lost ${trends.decline.keywords} ranking keywords since ${getMonthName(trends.peak.monthsAgo)}..."`;
  } else {
    coldCallScript = `"Your SEO metrics are holding steady, but we've identified ${money.moneyKeywords.length} high-value opportunities to expand your rankings..."`;
  }
  
  return `
    <div class="page">
        <div class="domain-header">
            <div class="domain-title">${domain.domain}</div>
            <div class="domain-cost">API Cost: $${domain.cost.toFixed(4)}</div>
        </div>
        
        <!-- 4-Month Peak Decline Analysis -->
        <div class="section">
            <div class="section-title">📊 4-Month Peak Decline Analysis</div>
            <div class="cold-call-box">
                <strong>🔥 COLD CALLING HOOK:</strong><br>
                ${coldCallScript}
            </div>
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-label">Page 1 Keywords</div>
                    <div class="stat-value">${page1 ? page1.total : 0}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Organic Value</div>
                    <div class="stat-value">$${formatNumber(trends.thisMonth.value)}/mo</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Decline</div>
                    <div class="stat-value ${trends.decline.value > 0 ? 'decline-highlight' : 'growth-highlight'}">
                        ${trends.decline.value > 0 ? '-' : '+'}$${formatNumber(Math.abs(trends.decline.value))}
                    </div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Peak Was</div>
                    <div class="stat-value">${trends.peak.monthsAgo} ${trends.peak.monthsAgo === 1 ? 'month' : 'months'} ago</div>
                </div>
            </div>
        </div>
        
        ${page1 ? `
        <!-- Page 1 Performance -->
        <div class="section">
            <div class="section-title">📈 Page 1 Performance</div>
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-label">Position #1</div>
                    <div class="stat-value">${page1.top1} <span style="font-size: 14px; color: #6c757d;">(${((page1.top1/page1.total)*100).toFixed(1)}%)</span></div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Top 3 (1-3)</div>
                    <div class="stat-value">${page1.top3} <span style="font-size: 14px; color: #6c757d;">(${((page1.top3/page1.total)*100).toFixed(1)}%)</span></div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Positions 4-10</div>
                    <div class="stat-value">${page1.pos4to10} <span style="font-size: 14px; color: #6c757d;">(${((page1.pos4to10/page1.total)*100).toFixed(1)}%)</span></div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Total Volume</div>
                    <div class="stat-value">${formatNumber(page1.totalVolume)}</div>
                </div>
            </div>
        </div>
        
        <!-- Low-Hanging Fruit -->
        ${page1.lowHangingFruit && page1.lowHangingFruit.length > 0 ? `
        <div class="section">
            <div class="section-title">🍒 Low-Hanging Fruit (Top 3)</div>
            <table class="keyword-table">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>CPC</th>
                        <th>Position</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    ${page1.lowHangingFruit.slice(0, 3).map(kw => `
                    <tr>
                        <td>${kw.keyword}</td>
                        <td><strong>$${kw.broadCostPerClick ? kw.broadCostPerClick.toFixed(2) : 'N/A'}</strong></td>
                        <td><span class="badge badge-warning">Pos: ${kw.rank}</span></td>
                        <td>${formatNumber(kw.searchVolume)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}
        ` : ''}
        
        ${money.moneyKeywords.length > 0 ? `
        <!-- Top 5 Money Keywords -->
        <div class="section">
            <div class="section-title">💰 Top 5 Money Keywords (Rank 11-75)</div>
            <table class="keyword-table">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>CPC</th>
                        <th>Position</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    ${money.moneyKeywords.slice(0, 5).map((kw, idx) => `
                    <tr>
                        <td><strong>${idx + 1}.</strong> ${kw.keyword}</td>
                        <td><strong>$${kw.exactCostPerClick ? kw.exactCostPerClick.toFixed(2) : kw.phraseCostPerClick ? kw.phraseCostPerClick.toFixed(2) : kw.broadCostPerClick.toFixed(2)}</strong></td>
                        <td><span class="badge badge-danger">Pos: ${kw.rank}</span></td>
                        <td>${formatNumber(kw.searchVolume)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}
        
        ${money.localKeywords.length > 0 ? `
        <!-- Top 3 Local Keywords -->
        <div class="section">
            <div class="section-title">📍 Top 3 Local Keywords (Geographic)</div>
            <table class="keyword-table">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>CPC</th>
                        <th>Position</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    ${money.localKeywords.slice(0, 3).map((kw, idx) => `
                    <tr>
                        <td><strong>${idx + 1}.</strong> ${kw.keyword}</td>
                        <td><strong>$${kw.exactCostPerClick ? kw.exactCostPerClick.toFixed(2) : kw.phraseCostPerClick ? kw.phraseCostPerClick.toFixed(2) : kw.broadCostPerClick ? kw.broadCostPerClick.toFixed(2) : 'N/A'}</strong></td>
                        <td><span class="badge badge-danger">Pos: ${kw.rank}</span></td>
                        <td>${formatNumber(kw.searchVolume)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}
    </div>
  `;
}

function formatNumber(num) {
  if (num === null || num === undefined) return 'N/A';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function getMonthName(monthsAgo) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const today = new Date();
  const targetMonth = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1);
  return months[targetMonth.getMonth()];
}

// Generate PDF
async function generatePDF() {
  console.log('🎨 Generating HTML content...');
  const html = generateHTML();
  
  console.log('🚀 Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  console.log('📄 Loading HTML content...');
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  console.log('💾 Generating PDF...');
  await page.pdf({
    path: './MASTER_REPORT.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
  });
  
  await browser.close();
  
  console.log('\n✅ PDF GENERATED SUCCESSFULLY!');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`📁 File: ./MASTER_REPORT.pdf`);
  console.log(`📊 Total Domains: ${reportData.totalDomains}`);
  console.log(`💰 Total Cost: $${reportData.totalCost.toFixed(4)}`);
  console.log('════════════════════════════════════════════════════════════════\n');
}

// Run
generatePDF().catch(err => {
  console.error('❌ Error generating PDF:', err);
  process.exit(1);
});
