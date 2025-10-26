import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

// Type definition for Cloudflare bindings
type Bindings = {
  DB: D1Database;
  SPYFU_API_KEY: string;
  SLACK_WEBHOOK_URL?: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Home page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SpyFu Lead Intelligence Platform</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
        <div class="max-w-6xl mx-auto p-8">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-chart-line text-blue-600 mr-3"></i>
                    SpyFu Lead Intelligence Platform
                </h1>
                
                <p class="text-xl text-gray-600 mb-8">
                    Enhance your sales leads with SEO competitive intelligence
                </p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-blue-50 p-6 rounded-lg">
                        <div class="text-3xl mb-2">📊</div>
                        <h3 class="font-bold text-lg mb-2">32 Ranking Nuggets</h3>
                        <p class="text-gray-600 text-sm">
                            Pre-formatted SEO metrics ready for ReadyMode import
                        </p>
                    </div>
                    
                    <div class="bg-green-50 p-6 rounded-lg">
                        <div class="text-3xl mb-2">🚀</div>
                        <h3 class="font-bold text-lg mb-2">Batch Processing</h3>
                        <p class="text-gray-600 text-sm">
                            Process thousands of leads before your calls start
                        </p>
                    </div>
                    
                    <div class="bg-purple-50 p-6 rounded-lg">
                        <div class="text-3xl mb-2">📄</div>
                        <h3 class="font-bold text-lg mb-2">Multiple Exports</h3>
                        <p class="text-gray-600 text-sm">
                            ReadyMode CSV, Mail lists, Full data, Custom formats
                        </p>
                    </div>
                </div>
                
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                    <h3 class="font-bold text-yellow-800 mb-2">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        Under Construction
                    </h3>
                    <p class="text-yellow-700">
                        This platform is currently in Phase 1 development. 
                        CSV upload and API integration coming soon!
                    </p>
                </div>
                
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-check-circle text-green-600 mr-2"></i>
                        What's Completed
                    </h2>
                    <ul class="list-disc list-inside text-gray-700 space-y-2">
                        <li>✅ Complete project documentation and architecture</li>
                        <li>✅ Database schema design (5 tables, D1 SQLite)</li>
                        <li>✅ API research and testing (4 SpyFu APIs verified)</li>
                        <li>✅ Ranking Nuggets specification (all 32 formulas)</li>
                        <li>✅ GitHub repository with recovery documentation</li>
                    </ul>
                </div>
                
                <div class="space-y-4 mt-8">
                    <h2 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-tasks text-blue-600 mr-2"></i>
                        Next Steps
                    </h2>
                    <ul class="list-disc list-inside text-gray-700 space-y-2">
                        <li>🔄 Phase 1: CSV parser + SpyFu API client + Nugget calculator</li>
                        <li>⏳ Phase 2: Export engine (4 CSV formats)</li>
                        <li>⏳ Phase 3: Project management UI</li>
                        <li>⏳ Phase 4: Hot Sheet generator</li>
                        <li>⏳ Phase 5: Chrome extension for ReadyMode</li>
                    </ul>
                </div>
                
                <div class="mt-8 pt-8 border-t border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-gray-800">Documentation</h3>
                            <p class="text-gray-600 text-sm">View complete project specs on GitHub</p>
                        </div>
                        <a href="https://github.com/spaxton1/spyfu-lead-intelligence" 
                           target="_blank"
                           class="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg inline-flex items-center">
                            <i class="fab fa-github mr-2"></i>
                            View on GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `)
})

// API routes (placeholders for Phase 1)
app.get('/api/status', (c) => {
  return c.json({ 
    status: 'Under Construction',
    phase: 1,
    message: 'API endpoints will be implemented in Phase 1'
  })
})

export default app
