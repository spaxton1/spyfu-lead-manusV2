const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);
  
  if (req.url === '/' || req.url === '/download') {
    // Serve the PDF file
    const pdfPath = path.join(__dirname, 'MASTER_REPORT.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('PDF file not found');
      return;
    }
    
    const stat = fs.statSync(pdfPath);
    
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="SPYFU_MASTER_REPORT.pdf"'
    });
    
    const readStream = fs.createReadStream(pdfPath);
    readStream.pipe(res);
  } else {
    // Info page
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SpyFu Master Report Download</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 10px;
            color: #333;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          }
          h1 {
            color: #667eea;
            margin-bottom: 20px;
          }
          .download-btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
            transition: transform 0.2s;
          }
          .download-btn:hover {
            transform: scale(1.05);
          }
          .stats {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .stat-item {
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📊 SpyFu Master Report</h1>
          <p>Your comprehensive SEO analysis report is ready for download!</p>
          
          <div class="stats">
            <div class="stat-item"><strong>📁 File Size:</strong> 776KB</div>
            <div class="stat-item"><strong>📄 Total Domains:</strong> 19</div>
            <div class="stat-item"><strong>💰 Total API Cost:</strong> $1.66</div>
            <div class="stat-item"><strong>📈 Report Type:</strong> Professional PDF with full analysis</div>
          </div>
          
          <a href="/download" class="download-btn">⬇️ Download PDF Report</a>
          
          <h2 style="color: #667eea; margin-top: 30px;">📋 Report Contents:</h2>
          <ul>
            <li>4-Month Peak Decline Analysis with cold calling hooks</li>
            <li>Page 1 Performance breakdown (Top 1, Top 3, Positions 4-10)</li>
            <li>Low-Hanging Fruit opportunities (high-CPC keywords not at #1)</li>
            <li>Top 5 Money Keywords (rank 11-75, highest CPC)</li>
            <li>Top 3 Local Keywords (geographic identifiers)</li>
          </ul>
        </div>
      </body>
      </html>
    `);
  }
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ PDF Download Server Running!`);
  console.log(`════════════════════════════════════════`);
  console.log(`🌐 Server listening on port ${PORT}`);
  console.log(`📁 Serving: MASTER_REPORT.pdf`);
  console.log(`════════════════════════════════════════\n`);
});
