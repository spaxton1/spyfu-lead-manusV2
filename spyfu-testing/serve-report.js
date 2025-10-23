const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HTML_FILE = path.join(__dirname, 'SPYFU_API_VISUAL_REPORT.html');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/report') {
    fs.readFile(HTML_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading report');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Report server running!`);
  console.log(`📊 View report at: http://localhost:${PORT}`);
  console.log(`\n🖨️  To create PDF: Open in browser and press Ctrl+P (Cmd+P on Mac)`);
  console.log(`\nPress Ctrl+C to stop server`);
});
