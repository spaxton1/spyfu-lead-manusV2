# 🚀 Implementation Phases

## Overview

This document breaks down the SpyFu Lead Intelligence Platform development into 6 manageable phases. Each phase is designed to deliver working functionality that can be tested and validated before moving forward.

**Total Estimated Time:** 6-8 weeks (for experienced developer)

---

## Phase 1: Core Data Engine ⭐ START HERE

**Goal:** Build the foundation - CSV upload, API fetching, nugget calculation, database storage.

**Duration:** 2 weeks

**Deliverables:**
- ✅ CSV upload endpoint with smart parser
- ✅ SpyFu API client (all 4 APIs)
- ✅ Ranking Nuggets calculator (all 32 rows)
- ✅ D1 database with complete schema
- ✅ Basic UI for upload and status tracking

### Tasks

#### 1.1 Project Setup
```bash
# Already done, but for reference:
cd /home/user/webapp
npm create -y hono@latest . -- --template cloudflare-pages --install --pm npm
git init
git add .
git commit -m "Initial commit"
```

#### 1.2 Database Schema
**File:** `migrations/0001_initial_schema.sql`
```sql
-- Projects, leads, spyfu_data, ranking_nuggets, exports tables
-- See DATABASE_SCHEMA.md for complete schema
```

**Commands:**
```bash
# Create D1 database
npx wrangler d1 create spyfu-db

# Apply migrations (local)
npx wrangler d1 migrations apply spyfu-db --local

# Seed test data
npx wrangler d1 execute spyfu-db --local --file=./seed.sql
```

#### 1.3 CSV Smart Parser
**File:** `src/utils/csv-parser.ts`

**Features:**
- Detect field mappings regardless of column order
- Accept multiple column names for same field:
  - Domain: "Website", "Domain", "URL", "Site"
  - Company: "Company", "Business", "Organization"
  - Contact: "Contact", "Name", "Contact Name"
  - Phone: "Phone", "Tel", "Telephone", "Mobile"
  - Email: "Email", "E-mail", "Email Address"
- Validate domains (proper format, no localhost/IPs)
- Return standardized lead objects

**Test Cases:**
```typescript
// Input CSV variations
const testCSVs = [
  'Website,Company,Contact\nrhmd.com,Holiday Rambler,John',
  'Domain,Business Name,Name,Phone\nacme.com,Acme Corp,Jane,555-1234',
  'URL,Organization,Email\nexample.com,Example Inc,bob@example.com'
];

// All should parse to same structure:
interface Lead {
  domain: string;
  company?: string;
  contact_name?: string;
  phone?: string;
  email?: string;
}
```

#### 1.4 SpyFu API Client
**File:** `src/services/spyfu-api.ts`

**Class Structure:**
```typescript
class SpyFuAPIClient {
  private apiKey: string;
  private baseUrl: string = 'https://www.spyfu.com/apis';
  private queue: APIQueue;
  
  async fetchDomainTrends(domain: string, months: number = 4) {
    // API #1: getLatestDomainStats
  }
  
  async fetchPage1Keywords(domain: string) {
    // API #2: getSeoKeywords (rank 1-10)
  }
  
  async fetchPage2Keywords(domain: string) {
    // API #2: getSeoKeywords (rank 11-20)
  }
  
  async fetchMoneyKeywords(domain: string) {
    // API #3: getMostValuableKeywords (rank 11-75)
  }
  
  async fetchCompetitors(domain: string, keywords: string[]) {
    // API #4: getSerpAnalysisKeywords
    // Use top 3 keywords from Page 1 data
  }
  
  async fetchAllData(domain: string, tier: 'full' | 'partial' | 'minimal') {
    // Orchestrate all API calls based on tier
    // Store in spyfu_data table
  }
}
```

**Rate Limiting:**
```typescript
class APIQueue {
  private requestsPerMinute = 120;
  private delayBetweenRequests = 500; // ms
  
  async add<T>(task: () => Promise<T>): Promise<T> {
    // Queue and execute with delays
  }
}
```

**Error Handling:**
- Retry logic: 3 attempts with exponential backoff
- Partial data storage (if some APIs succeed)
- Detailed error logging

#### 1.5 Ranking Nuggets Calculator
**File:** `src/services/nugget-calculator.ts`

**Class Structure:**
```typescript
class NuggetCalculator {
  private citiesData: CityData[];
  private ctrLookup: { [rank: number]: number };
  
  constructor() {
    this.citiesData = loadCitiesLookup(); // 29,880 US cities
    this.ctrLookup = {
      1: 39.8, 2: 18.7, 3: 10.2, 4: 7.2, 5: 5.1,
      6: 4.4, 7: 3.0, 8: 2.1, 9: 1.9, 10: 1.6
    };
  }
  
  calculate(apiData: SpyFuData): RankingNuggets {
    return {
      nugget_1_snapshot: this.calculateSnapshot(apiData.api_1_trends),
      nugget_2_page1: this.calculatePage1(apiData.api_2_page1),
      nugget_3_page2: this.calculatePage2(apiData.api_2_page1),
      nugget_4_quickwins: this.calculateQuickWins(apiData.api_2_page1),
      nugget_5_historical: this.calculateHistorical(apiData.api_1_trends),
      nugget_6_local_l1: this.calculateLocalKW(apiData.api_2_page1, 1),
      // ... all 32 nuggets ...
    };
  }
  
  private formatNugget(title: string, data: string): string {
    // Enforce character limits
    const truncTitle = title.substring(0, 20);
    const truncData = data.substring(0, 40);
    return `${truncTitle} | ${truncData}`;
  }
  
  private detectLocalKeywords(keywords: Keyword[]): Keyword[] {
    // Match against 29,880 US cities
    return keywords.filter(kw => 
      this.citiesData.some(city => 
        kw.Keyword.toLowerCase().includes(city.name.toLowerCase())
      )
    );
  }
  
  private calculatePeakDecline(months: MonthData[]): string {
    // Compare current month to peak of previous 3 months
    const current = months[0];
    const previous = months.slice(1, 4);
    const peak = Math.max(...previous.map(m => m.TotalOrganicKeywords));
    const decline = ((peak - current.TotalOrganicKeywords) / peak) * 100;
    return decline > 0 ? `↓${decline.toFixed(1)}%` : `↑${Math.abs(decline).toFixed(1)}%`;
  }
}
```

**Test with Actual Data:**
```typescript
// Load test data from master_test_results.json
const testData = JSON.parse(fs.readFileSync('master_test_results.json'));
const calculator = new NuggetCalculator();

testData.domains.forEach(domain => {
  const nuggets = calculator.calculate(domain.apiResponses);
  console.log(`${domain.name}:`);
  console.log(`  Nugget 1: ${nuggets.nugget_1_snapshot}`);
  console.log(`  Nugget 2: ${nuggets.nugget_2_page1}`);
  // ... validate all 32 ...
});
```

#### 1.6 Basic Web UI
**File:** `src/index.tsx`

**Features:**
- Upload CSV form
- Project name input
- Tier selection (Full/Partial/Minimal)
- Processing status display
- Progress bar (X of Y leads processed)

**HTML Template:**
```html
<div class="max-w-4xl mx-auto p-8">
  <h1 class="text-3xl font-bold mb-6">SpyFu Lead Intelligence</h1>
  
  <form action="/api/upload" method="POST" enctype="multipart/form-data">
    <input type="text" name="project_name" placeholder="Project Name" required>
    
    <select name="api_tier" required>
      <option value="full">Full ($0.17/lead) - All 4 APIs</option>
      <option value="partial">Partial ($0.15/lead) - APIs 1-3</option>
      <option value="minimal">Minimal ($0.002/lead) - API 1 only</option>
    </select>
    
    <input type="file" name="csv_file" accept=".csv" required>
    
    <button type="submit">Upload & Process</button>
  </form>
  
  <div id="status">
    <!-- Progress updates via SSE or polling -->
  </div>
</div>
```

#### 1.7 API Endpoints
**File:** `src/routes/api.ts`

```typescript
// POST /api/upload - Upload CSV and start processing
app.post('/api/upload', async (c) => {
  const formData = await c.req.formData();
  const csvFile = formData.get('csv_file');
  const projectName = formData.get('project_name');
  const tier = formData.get('api_tier');
  
  // Parse CSV
  const leads = parseCSV(csvFile);
  
  // Create project
  const projectId = await db.insert('projects', {
    name: projectName,
    api_tier: tier,
    total_leads: leads.length
  });
  
  // Insert leads
  await db.insertMany('leads', leads.map(l => ({
    ...l,
    project_id: projectId
  })));
  
  // Start background processing
  await processProject(projectId);
  
  return c.json({ projectId, totalLeads: leads.length });
});

// GET /api/projects/:id/status - Check processing status
app.get('/api/projects/:id/status', async (c) => {
  const project = await db.query(`
    SELECT 
      p.*,
      COUNT(l.id) as total,
      COUNT(s.id) as processed
    FROM projects p
    LEFT JOIN leads l ON p.id = l.project_id
    LEFT JOIN spyfu_data s ON l.domain = s.domain
    WHERE p.id = ?
    GROUP BY p.id
  `, [c.req.param('id')]);
  
  return c.json(project);
});
```

### Phase 1 Testing

**Unit Tests:**
```typescript
// test/csv-parser.test.ts
describe('CSV Parser', () => {
  it('should detect domain field variations', () => {
    const csv = 'Website,Company\nrhmd.com,Holiday Rambler';
    const leads = parseCSV(csv);
    expect(leads[0].domain).toBe('rhmd.com');
  });
});

// test/nugget-calculator.test.ts
describe('Nugget Calculator', () => {
  it('should format snapshot correctly', () => {
    const result = calculator.calculateSnapshot(apiData);
    expect(result).toMatch(/Snapshot \| \d+K \| \$[\d.]+K \| \d+K \| \d+/);
  });
});
```

**Integration Test:**
```typescript
// End-to-end test with real API (use test account)
const testProject = {
  name: 'Test Project',
  tier: 'minimal',
  csv: 'domain\nrhmd.com\nacme.com'
};

// Upload CSV
const { projectId } = await uploadCSV(testProject);

// Wait for processing
await waitForCompletion(projectId);

// Verify data
const leads = await getLeads(projectId);
expect(leads).toHaveLength(2);
expect(leads[0].nuggets).toBeDefined();
```

### Phase 1 Completion Criteria

- ✅ Can upload CSV with any column order/naming
- ✅ All 4 SpyFu APIs fetch successfully
- ✅ All 32 nuggets calculate correctly (match seo_dashboard.csv examples)
- ✅ Data stored in D1 database
- ✅ Processing status visible in UI
- ✅ Error handling works (invalid domains, API failures)

---

## Phase 2: Export Engine

**Goal:** Generate multiple CSV export formats and enable downloads.

**Duration:** 1 week

**Deliverables:**
- ✅ ReadyMode CSV (32 nugget columns)
- ✅ Mail CSV (contact info only)
- ✅ Full Data CSV (all raw API + nuggets)
- ✅ Custom CSV (user-selected columns)
- ✅ Download endpoint with file generation

### Tasks

#### 2.1 Export Service
**File:** `src/services/export-service.ts`

```typescript
class ExportService {
  async generateReadyModeCSV(projectId: string): Promise<string> {
    const data = await db.query(`
      SELECT 
        l.domain,
        l.company,
        l.contact_name,
        rn.nugget_1_snapshot,
        rn.nugget_2_page1,
        -- ... all 32 nuggets ...
      FROM leads l
      JOIN ranking_nuggets rn ON l.id = rn.lead_id
      WHERE l.project_id = ?
    `, [projectId]);
    
    return this.toCSV(data, [
      'domain', 'company', 'contact_name',
      'nugget_1', 'nugget_2', /* ... */ 'nugget_32'
    ]);
  }
  
  async generateMailCSV(projectId: string): Promise<string> {
    // Just contact info
  }
  
  async generateFullCSV(projectId: string): Promise<string> {
    // All raw API data + nuggets
  }
  
  async generateCustomCSV(projectId: string, columns: string[]): Promise<string> {
    // User-selected columns
  }
  
  private toCSV(data: any[], columns: string[]): string {
    // Convert to CSV format
  }
}
```

#### 2.2 Export API Endpoints
**File:** `src/routes/exports.ts`

```typescript
// POST /api/projects/:id/export - Create export
app.post('/api/projects/:id/export', async (c) => {
  const { type, columns } = await c.req.json();
  const projectId = c.req.param('id');
  
  const exportService = new ExportService();
  let csvData: string;
  
  switch (type) {
    case 'readymode':
      csvData = await exportService.generateReadyModeCSV(projectId);
      break;
    case 'mail':
      csvData = await exportService.generateMailCSV(projectId);
      break;
    case 'full':
      csvData = await exportService.generateFullCSV(projectId);
      break;
    case 'custom':
      csvData = await exportService.generateCustomCSV(projectId, columns);
      break;
  }
  
  // Store export record
  const exportId = await db.insert('exports', {
    project_id: projectId,
    export_type: type,
    filename: `${projectName}_${type}.csv`
  });
  
  // Return download URL
  return c.json({ exportId, downloadUrl: `/api/exports/${exportId}/download` });
});

// GET /api/exports/:id/download - Download export
app.get('/api/exports/:id/download', async (c) => {
  const exportRecord = await db.get('exports', c.req.param('id'));
  const csvData = await generateExportData(exportRecord);
  
  return c.body(csvData, 200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': `attachment; filename="${exportRecord.filename}"`
  });
});
```

#### 2.3 Export UI
**File:** `src/views/project.tsx`

```html
<div class="export-section">
  <h2>Export Options</h2>
  
  <button onclick="exportCSV('readymode')">
    ReadyMode CSV (32 Nuggets)
  </button>
  
  <button onclick="exportCSV('mail')">
    Mail CSV (Contact Info)
  </button>
  
  <button onclick="exportCSV('full')">
    Full Data CSV (All APIs + Nuggets)
  </button>
  
  <button onclick="showCustomExportModal()">
    Custom CSV (Select Columns)
  </button>
  
  <div id="export-history">
    <!-- List previous exports -->
  </div>
</div>
```

### Phase 2 Testing

**Test Cases:**
```typescript
describe('Export Service', () => {
  it('should generate ReadyMode CSV with 32 columns', async () => {
    const csv = await exportService.generateReadyModeCSV('test-project');
    const rows = csv.split('\n');
    const headers = rows[0].split(',');
    expect(headers).toHaveLength(35); // domain + company + contact + 32 nuggets
  });
  
  it('should format nuggets correctly in CSV', () => {
    const csv = generateReadyModeCSV('test-project');
    expect(csv).toContain('Snapshot | 47.2K | $15.8K | 16.7K | 65');
  });
});
```

### Phase 2 Completion Criteria

- ✅ All 4 export formats generate correctly
- ✅ CSV files download with proper headers
- ✅ Export history tracked in database
- ✅ Custom export allows column selection
- ✅ Large exports (1000+ leads) work without timeout

---

## Phase 3: Project Management

**Goal:** Build UI for managing multiple projects and campaigns.

**Duration:** 1 week

**Deliverables:**
- ✅ Project list view
- ✅ Project detail view
- ✅ Lead list with filtering/sorting
- ✅ Re-fetch failed leads
- ✅ Delete projects

### Tasks

#### 3.1 Project List UI
**File:** `src/views/projects.tsx`

```html
<div class="projects-list">
  <h1>Projects</h1>
  <button onclick="location.href='/upload'">+ New Project</button>
  
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Tier</th>
        <th>Leads</th>
        <th>Status</th>
        <th>Created</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <!-- Project rows -->
    </tbody>
  </table>
</div>
```

#### 3.2 Project Detail View
**File:** `src/views/project-detail.tsx`

```html
<div class="project-detail">
  <h1>{project.name}</h1>
  
  <div class="stats">
    <div>Total Leads: {project.total_leads}</div>
    <div>Processed: {project.processed_leads}</div>
    <div>Status: {project.status}</div>
    <div>Cost: ${calculateCost(project.tier, project.total_leads)}</div>
  </div>
  
  <div class="leads-table">
    <input type="search" placeholder="Filter by domain/company...">
    
    <table>
      <thead>
        <tr>
          <th>Domain</th>
          <th>Company</th>
          <th>Contact</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Lead rows with inline actions -->
      </tbody>
    </table>
  </div>
  
  <div class="actions">
    <button>Export</button>
    <button>Re-fetch Failed</button>
    <button>Delete Project</button>
  </div>
</div>
```

### Phase 3 Completion Criteria

- ✅ Projects list loads quickly (< 1s)
- ✅ Filtering/sorting works
- ✅ Can view individual lead details
- ✅ Can re-fetch failed leads
- ✅ Delete cascade works (deletes leads, nuggets, exports)

---

## Phase 4: Hot Sheet System

**Goal:** Generate HTML Hot Sheets with expanded prospect data for Chrome extension.

**Duration:** 1 week

**Deliverables:**
- ✅ Hot Sheet HTML generator
- ✅ Public Hot Sheet URLs
- ✅ Phone number lookup API
- ✅ Hot Sheet templates

### Tasks

#### 4.1 Hot Sheet Generator
**File:** `src/services/hotsheet-generator.ts`

```typescript
class HotSheetGenerator {
  generate(leadId: string): string {
    const lead = getLead(leadId);
    const nuggets = getNuggets(leadId);
    const apiData = getSpyFuData(lead.domain);
    
    return this.renderHTML({
      lead,
      nuggets,
      expandedData: this.expandNuggets(nuggets, apiData)
    });
  }
  
  private expandNuggets(nuggets: RankingNuggets, apiData: SpyFuData) {
    // Convert condensed nuggets to full HTML tables
    return {
      page1Keywords: this.renderKeywordTable(apiData.api_2_page1),
      moneyKeywords: this.renderKeywordTable(apiData.api_3_money),
      competitors: this.renderCompetitorTable(apiData.api_4_competitors),
      historicalChart: this.renderTrendChart(apiData.api_1_trends)
    };
  }
  
  private renderHTML(data: HotSheetData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data.lead.company} - Hot Sheet</title>
        <style>${this.getCSS()}</style>
      </head>
      <body>
        <div class="header">
          <h1>${data.lead.company}</h1>
          <div class="contact">
            <div>${data.lead.contact_name}</div>
            <div>${data.lead.phone}</div>
            <div>${data.lead.email}</div>
          </div>
        </div>
        
        <div class="above-fold">
          ${this.renderNuggetRow(data.nuggets.nugget_1_snapshot)}
          ${this.renderNuggetRow(data.nuggets.nugget_2_page1)}
          <!-- ... 15 above-fold nuggets ... -->
        </div>
        
        <details class="below-fold">
          <summary>More Data (17 nuggets)</summary>
          ${this.renderNuggetRow(data.nuggets.nugget_16_comp_hot_buttons)}
          <!-- ... 17 below-fold nuggets ... -->
        </details>
        
        <div class="expanded">
          <h2>Page 1 Keywords</h2>
          ${data.expandedData.page1Keywords}
          
          <h2>Money Keywords</h2>
          ${data.expandedData.moneyKeywords}
          
          <h2>Competitors</h2>
          ${data.expandedData.competitors}
          
          <h2>Historical Trend</h2>
          ${data.expandedData.historicalChart}
        </div>
      </body>
      </html>
    `;
  }
}
```

#### 4.2 Hot Sheet API
**File:** `src/routes/hotsheets.ts`

```typescript
// GET /hotsheet/:leadId - Serve Hot Sheet HTML
app.get('/hotsheet/:leadId', async (c) => {
  const generator = new HotSheetGenerator();
  const html = await generator.generate(c.req.param('leadId'));
  return c.html(html);
});

// GET /api/hotsheet/lookup - Find lead by phone
app.get('/api/hotsheet/lookup', async (c) => {
  const phone = c.req.query('phone');
  const lead = await db.query(`
    SELECT id, domain, company
    FROM leads
    WHERE phone = ?
  `, [phone]);
  
  if (!lead) {
    return c.json({ error: 'Lead not found' }, 404);
  }
  
  return c.json({
    leadId: lead.id,
    hotsheetUrl: `/hotsheet/${lead.id}`
  });
});
```

### Phase 4 Completion Criteria

- ✅ Hot Sheet HTML renders correctly
- ✅ Public URLs work without auth
- ✅ Phone lookup API finds leads
- ✅ Above-fold/below-fold sections work
- ✅ Expanded data tables display correctly

---

## Phase 5: Chrome Extension

**Goal:** Build Chrome extension that monitors ReadyMode and auto-opens Hot Sheets.

**Duration:** 1 week

**Deliverables:**
- ✅ Chrome extension (Manifest V3)
- ✅ ReadyMode DOM monitoring
- ✅ Phone number detection
- ✅ Auto-popup Hot Sheet
- ✅ Extension settings

### Tasks

#### 5.1 Extension Structure
```
chrome-extension/
├── manifest.json
├── background.js        # Service worker
├── content.js           # ReadyMode DOM monitor
├── popup.html           # Extension settings
├── popup.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

#### 5.2 Manifest V3
**File:** `chrome-extension/manifest.json`

```json
{
  "manifest_version": 3,
  "name": "SpyFu Lead Intelligence",
  "version": "1.0.0",
  "description": "Auto-popup Hot Sheets during ReadyMode calls",
  "permissions": ["tabs", "activeTab", "storage"],
  "host_permissions": ["https://readymode.com/*"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["https://readymode.com/*"],
      "js": ["content.js"]
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icons/icon48.png"
  }
}
```

#### 5.3 Content Script
**File:** `chrome-extension/content.js`

```javascript
// Monitor ReadyMode DOM for phone numbers
let currentCallPhone = null;

const observer = new MutationObserver(() => {
  const phoneElement = document.querySelector('.call-phone-number');
  
  if (phoneElement && phoneElement.textContent !== currentCallPhone) {
    currentCallPhone = phoneElement.textContent;
    
    // Send to background script
    chrome.runtime.sendMessage({
      type: 'NEW_CALL',
      phone: currentCallPhone
    });
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

#### 5.4 Background Service Worker
**File:** `chrome-extension/background.js`

```javascript
let hotsheetAPIUrl = 'https://spyfu.pages.dev';

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === 'NEW_CALL') {
    const phone = message.phone;
    
    try {
      // Lookup lead by phone
      const response = await fetch(`${hotsheetAPIUrl}/api/hotsheet/lookup?phone=${phone}`);
      const data = await response.json();
      
      if (data.leadId) {
        // Open Hot Sheet in new window
        chrome.windows.create({
          url: `${hotsheetAPIUrl}${data.hotsheetUrl}`,
          type: 'popup',
          width: 800,
          height: 1000,
          left: 100,
          top: 0
        });
      }
    } catch (error) {
      console.error('Hot Sheet lookup failed:', error);
    }
  }
});
```

#### 5.5 Extension Popup (Settings)
**File:** `chrome-extension/popup.html`

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 300px; padding: 20px; }
    input { width: 100%; margin: 10px 0; }
  </style>
</head>
<body>
  <h2>SpyFu Lead Intelligence</h2>
  
  <label>API URL:</label>
  <input type="text" id="apiUrl" placeholder="https://spyfu.pages.dev">
  
  <button id="save">Save Settings</button>
  
  <div id="status"></div>
  
  <script src="popup.js"></script>
</body>
</html>
```

### Phase 5 Completion Criteria

- ✅ Extension installs without errors
- ✅ Content script detects phone numbers in ReadyMode
- ✅ Background script successfully calls lookup API
- ✅ Hot Sheet opens automatically in new window
- ✅ Settings persist across browser restarts

---

## Phase 6: Polish & Deployment

**Goal:** Production-ready deployment, authentication, error handling, optimization.

**Duration:** Ongoing

**Deliverables:**
- ✅ Authentication (optional)
- ✅ Bulk import optimization
- ✅ Background job queue
- ✅ Error notifications
- ✅ Production deployment
- ✅ Monitoring & analytics

### Tasks

#### 6.1 Authentication (Optional)
**If needed for multi-user:**

```typescript
// Using Cloudflare Access or simple API keys
app.use('/api/*', async (c, next) => {
  const apiKey = c.req.header('X-API-Key');
  const user = await validateAPIKey(apiKey);
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  c.set('user', user);
  await next();
});
```

#### 6.2 Background Job Queue
**For large imports (1000+ leads):**

```typescript
// Use Cloudflare Queues or simple polling
class JobQueue {
  async addJob(projectId: string) {
    await db.insert('jobs', {
      project_id: projectId,
      status: 'pending'
    });
  }
  
  async processJobs() {
    const jobs = await db.query('SELECT * FROM jobs WHERE status = "pending" LIMIT 10');
    
    for (const job of jobs) {
      await processProject(job.project_id);
      await db.update('jobs', job.id, { status: 'completed' });
    }
  }
}

// Run every minute via Cloudflare Cron Trigger
export default {
  async scheduled(event, env, ctx) {
    const queue = new JobQueue();
    await queue.processJobs();
  }
};
```

#### 6.3 Error Notifications
**Email or Slack alerts:**

```typescript
async function notifyError(error: Error, context: any) {
  await fetch('https://hooks.slack.com/services/YOUR/WEBHOOK/URL', {
    method: 'POST',
    body: JSON.stringify({
      text: `Error in SpyFu Platform: ${error.message}`,
      context: JSON.stringify(context)
    })
  });
}
```

#### 6.4 Production Deployment
```bash
# Update wrangler.jsonc
{
  "name": "spyfu-lead-intelligence",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "spyfu-production",
      "database_id": "your-production-id"
    }
  ]
}

# Apply migrations to production
npx wrangler d1 migrations apply spyfu-production

# Set environment variables
npx wrangler secret put SPYFU_API_KEY
npx wrangler secret put SLACK_WEBHOOK_URL

# Build and deploy
npm run build
npx wrangler pages deploy dist --project-name spyfu-lead-intelligence
```

### Phase 6 Completion Criteria

- ✅ Production deployment successful
- ✅ Error monitoring configured
- ✅ Background jobs process reliably
- ✅ Performance meets targets (< 2s page loads)
- ✅ Chrome extension published (Chrome Web Store)

---

## Implementation Order Summary

```
Phase 1: Core Data Engine (2 weeks)
  ├─ Database schema
  ├─ CSV parser
  ├─ SpyFu API client
  ├─ Nugget calculator
  └─ Basic UI

Phase 2: Export Engine (1 week)
  ├─ ReadyMode CSV
  ├─ Mail CSV
  ├─ Full Data CSV
  └─ Custom CSV

Phase 3: Project Management (1 week)
  ├─ Project list
  ├─ Lead list
  └─ Admin functions

Phase 4: Hot Sheet System (1 week)
  ├─ HTML generator
  ├─ Public URLs
  └─ Lookup API

Phase 5: Chrome Extension (1 week)
  ├─ DOM monitoring
  ├─ Phone detection
  └─ Auto-popup

Phase 6: Polish & Deployment (ongoing)
  ├─ Authentication
  ├─ Background jobs
  ├─ Error handling
  └─ Production deploy
```

---

## Current Status

**Completed:**
- ✅ Project structure and documentation
- ✅ Database schema designed
- ✅ API research and testing (see master_test_results.json)
- ✅ Nugget specifications finalized
- ✅ GitHub repository created

**In Progress:**
- 🔄 Setting up GitHub with all documentation

**Next Steps:**
1. Complete GitHub push
2. Start Phase 1: Core Data Engine
3. Build CSV parser
4. Implement SpyFu API client
5. Create nugget calculator

---

## Resources

- **Database Schema:** See `DATABASE_SCHEMA.md`
- **API Details:** See `API_DOCUMENTATION.md`
- **Nugget Specs:** See `RANKING_NUGGETS_SPEC.md`
- **Architecture:** See `ARCHITECTURE.md`
- **Test Data:** See `master_test_results.json`
- **Cities Lookup:** See `us_cities_lookup.json`

---

## Success Metrics

**Phase 1:**
- Parse 1000 lead CSV in < 5 seconds
- Fetch all APIs for 500 leads in < 30 minutes
- Calculate all 32 nuggets correctly (validated against examples)

**Phase 2:**
- Generate ReadyMode CSV for 1000 leads in < 10 seconds
- All export formats download without timeout

**Phase 3:**
- Project list loads in < 1 second
- Lead filtering/sorting works smoothly (< 500ms)

**Phase 4:**
- Hot Sheet generates in < 2 seconds
- Phone lookup API responds in < 200ms

**Phase 5:**
- Chrome extension detects calls in < 1 second
- Hot Sheet opens automatically within 2 seconds of call

**Phase 6:**
- 99.9% uptime
- < 1% error rate
- All errors logged and monitored

---

## Conclusion

This phased approach ensures:
- ✅ **Incremental progress** - Each phase delivers working functionality
- ✅ **Testable milestones** - Clear success criteria for each phase
- ✅ **Manageable scope** - Breaking complex system into digestible parts
- ✅ **Early validation** - Can test core features before building UI polish

**Start with Phase 1** - get the data engine working perfectly before building exports and extensions.
