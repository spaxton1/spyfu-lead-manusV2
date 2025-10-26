# 🏗️ System Architecture

## Overview

The SpyFu Lead Intelligence Platform is a **batch CSV enhancement system** that processes lead lists BEFORE sales calls happen. This is NOT a real-time system - all data is fetched and stored ahead of time.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER WORKFLOW                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. Upload CSV     2. Select Tier    3. Process      4. Export       │
│     ↓                   ↓                ↓               ↓           │
│  [leads.csv]      [Full/Partial]   [Fetch APIs]   [Multiple CSVs]   │
│                    [$0.17/lead]    [Calculate]    [Hot Sheets]      │
│                                     [Store All]    [Chrome Ext]      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     SYSTEM COMPONENTS                                │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Frontend (Web)  │  ← Hono SSR + Tailwind CSS
│                  │  ← File upload UI
│  - CSV Upload    │  ← Project management
│  - Project Mgmt  │  ← Export controls
│  - Export UI     │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    Backend (Hono + Cloudflare)                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐    ┌──────────────────┐   ┌─────────────────┐ │
│  │  CSV Parser     │    │  SpyFu API       │   │  Nugget         │ │
│  │                 │    │  Client          │   │  Calculator     │ │
│  │ - Smart detect  │    │                  │   │                 │ │
│  │ - Field mapping │    │ - Rate limiting  │   │ - 32 formulas   │ │
│  │ - Validation    │───▶│ - 4 APIs         │──▶│ - CTR lookup    │ │
│  │                 │    │ - Error handling │   │ - Peak decline  │ │
│  │                 │    │                  │   │ - Char limits   │ │
│  └─────────────────┘    └──────────────────┘   └─────────────────┘ │
│           │                      │                       │           │
│           └──────────────────────┼───────────────────────┘           │
│                                  ↓                                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    D1 Database (SQLite)                       │   │
│  │                                                                │   │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────────────────┐  │   │
│  │  │ projects   │  │ leads        │  │ spyfu_data           │  │   │
│  │  │            │  │              │  │                      │  │   │
│  │  │ - name     │  │ - domain     │  │ - domain             │  │   │
│  │  │ - tier     │  │ - company    │  │ - api_1_trends       │  │   │
│  │  │ - status   │  │ - contact    │  │ - api_2_page1        │  │   │
│  │  └────────────┘  └──────────────┘  │ - api_3_money        │  │   │
│  │                                     │ - api_4_competitors  │  │   │
│  │  ┌────────────────────────┐        │ - fetched_at         │  │   │
│  │  │ ranking_nuggets        │        └──────────────────────┘  │   │
│  │  │                        │                                   │   │
│  │  │ - lead_id              │        ┌──────────────────────┐  │   │
│  │  │ - nugget_1_snapshot    │        │ exports              │  │   │
│  │  │ - nugget_2_page1       │        │                      │  │   │
│  │  │ - ... (all 32)         │        │ - type (readymode)   │  │   │
│  │  │ - calculated_at        │        │ - filename           │  │   │
│  │  └────────────────────────┘        │ - download_url       │  │   │
│  │                                     └──────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                  │                                   │
│                                  ↓                                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      Export Engine                            │   │
│  │                                                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │  │ ReadyMode   │  │ Mail CSV    │  │ Full Data   │           │   │
│  │  │ CSV         │  │             │  │ CSV         │           │   │
│  │  │             │  │ - Name      │  │             │           │   │
│  │  │ - 32 cols   │  │ - Email     │  │ - All APIs  │           │   │
│  │  │ - Title|Data│  │ - Phone     │  │ - All calcs │           │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                │   │
│  │  ┌─────────────┐  ┌─────────────────────────────────────┐    │   │
│  │  │ Custom CSV  │  │ Hot Sheet Generator                 │    │   │
│  │  │             │  │                                     │    │   │
│  │  │ - User cols │  │ - HTML template                     │    │   │
│  │  │ - Mixed     │  │ - Expanded nuggets                  │    │   │
│  │  └─────────────┘  │ - Public URL: /hotsheet/{lead_id}   │    │   │
│  │                   └─────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                 Chrome Extension (Manifest V3)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────┐      ┌──────────────────┐                    │
│  │ Content Script    │      │ Background       │                    │
│  │                   │      │ Service Worker   │                    │
│  │ - Monitor         │─────▶│                  │                    │
│  │   ReadyMode       │      │ - Phone# detect  │                    │
│  │   DOM             │      │ - Lookup API     │                    │
│  │                   │      │ - Auto-popup     │                    │
│  │ - Detect calls    │◀─────│   Hot Sheet      │                    │
│  └───────────────────┘      └──────────────────┘                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. CSV Upload → Lead Storage

```
CSV File (any format)
    ↓
Smart CSV Parser
    ↓ (detect fields)
Field Mapping: {
  domain: "Website" or "Domain" or "URL"
  company: "Company" or "Business"
  contact: "Contact" or "Name"
  phone: "Phone" or "Tel"
  email: "Email"
}
    ↓
Validate Domains
    ↓
INSERT INTO leads (domain, company, contact, phone, email)
```

### 2. API Data Fetching

```
For each lead.domain:
    ↓
Check if spyfu_data exists
    ↓ (no)
Fetch API #1 (Trends)      Cost: $0.002
Fetch API #2 (Page 1)      Cost: $0.00-0.27
Fetch API #3 (Money KWs)   Cost: $0.013
Fetch API #4 (Competitors) Cost: $0.021
    ↓
INSERT INTO spyfu_data (
  domain,
  api_1_trends JSON,
  api_2_page1 JSON,
  api_3_money JSON,
  api_4_competitors JSON,
  fetched_at
)
```

### 3. Ranking Nuggets Calculation

```
For each lead with spyfu_data:
    ↓
Load all 4 API responses
    ↓
Calculate 32 nuggets in exact order:
    1. Snapshot    ← API #1 latest month
    2. Page 1      ← API #2 ranks 1-10
    3. Page 2      ← API #2 ranks 11-20
    4. Quick Wins  ← API #2 positions 2-10
    5. Historical  ← API #1 4-month trend
    6-7. Local L1-L2 ← API #2 + cities_lookup
    8. KW Traffic  ← API #2 sum clicks
    9-10. Top CPC/Traffic ← API #2 sorted
    11-14. Comp 1-4 ← API #4 top competitors
    15. Comp Ranks ← API #4 avg positions
    16. Hot Buttons ← API #3 top 3 keywords
    17-20. Client 1-4 Mo ← API #1 months
    21-23. Local L3-L5 ← API #2 + cities
    24-28. LowHang 1-5 ← API #2 positions 2-10
    29-32. Money KW 2-5 ← API #3 sorted by CPC
    ↓
Format with character limits:
  - Title ≤ 20 chars
  - Data ≤ 40 chars
  - Pipe-separated
    ↓
INSERT INTO ranking_nuggets (
  lead_id,
  nugget_1_snapshot,
  nugget_2_page1,
  ... all 32 ...
  calculated_at
)
```

### 4. Export Generation

```
User selects export type:
    ↓
┌─────────────────────────────────────────┐
│ ReadyMode CSV                           │
│ ─────────────────────────────────────   │
│ SELECT domain, company, contact,        │
│        nugget_1, nugget_2, ... nugget_32│
│ FROM leads                              │
│ JOIN ranking_nuggets                    │
│ FORMAT: "Title | Data" in each cell     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Mail CSV                                │
│ ─────────────────────────────────────   │
│ SELECT company, contact, email, phone   │
│ FROM leads                              │
│ FORMAT: Simple contact info only        │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Full Data CSV                           │
│ ─────────────────────────────────────   │
│ SELECT *, api_1_trends, api_2_page1,    │
│        api_3_money, api_4_competitors   │
│ FROM leads                              │
│ JOIN spyfu_data                         │
│ JOIN ranking_nuggets                    │
│ FORMAT: All raw + calculated data       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Custom CSV                              │
│ ─────────────────────────────────────   │
│ User selects columns from UI            │
│ Mix of: contact info + nuggets + raw    │
│ FORMAT: User-defined schema             │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Hot Sheet HTML                          │
│ ─────────────────────────────────────   │
│ Generate HTML page for each lead:       │
│ - Company header                        │
│ - Contact info                          │
│ - 15 Above-fold nuggets (expanded)      │
│ - 17 Below-fold nuggets (collapsible)   │
│ - Competitor details                    │
│ - Keyword tables                        │
│ Save to: /hotsheet/{lead_id}.html       │
│ Public URL for Chrome extension         │
└─────────────────────────────────────────┘
```

### 5. Chrome Extension Integration

```
ReadyMode Call Screen Loads
    ↓
Chrome Extension Content Script Detects:
  - Phone number in DOM
  - Domain/Company name
    ↓
Send to Background Service Worker
    ↓
Call Backend API:
  GET /api/hotsheet/lookup?phone={phone}
    ↓
Backend Returns:
  { lead_id: "123", hotsheet_url: "/hotsheet/123" }
    ↓
Extension Auto-Opens Popup:
  - New browser window
  - Loads hotsheet_url
  - Positioned beside ReadyMode
    ↓
Sales Rep Sees Hot Sheet While Calling
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Hono SSR + Tailwind CSS | Web UI for uploads/exports |
| **Backend** | Hono (TypeScript) | API routes, business logic |
| **Runtime** | Cloudflare Workers/Pages | Serverless edge platform |
| **Database** | Cloudflare D1 (SQLite) | Lead data, API responses |
| **External API** | SpyFu API v2 (4 endpoints) | SEO competitive data |
| **Browser Extension** | Chrome Manifest V3 | ReadyMode integration |
| **Build Tools** | Vite + TypeScript | Development & bundling |
| **Deployment** | Wrangler CLI | Cloudflare deployment |

## Key Design Decisions

### 1. Data Warehouse Pattern (NOT Real-Time)
**Decision:** Store ALL raw API responses permanently in D1 database.

**Rationale:**
- SpyFu API is expensive ($0.17/lead for full data)
- Data doesn't change frequently (SEO metrics are monthly)
- Enables multiple exports without re-fetching
- Supports reprocessing/recalculation of nuggets
- Allows custom exports with different column combinations

**Implementation:**
- `spyfu_data` table stores all 4 API responses as JSON
- `ranking_nuggets` table stores calculated 32-row output
- Separation allows recalculation without re-fetching
- `fetched_at` timestamp prevents duplicate API calls

### 2. Smart CSV Parser
**Decision:** Detect fields regardless of column order/naming.

**Rationale:**
- Users have leads from multiple sources
- Column names vary: "Website" vs "Domain" vs "URL"
- Column order varies: some have email first, others last
- Need flexible input → standardized storage

**Implementation:**
- Pattern matching on column headers
- Multiple acceptable names per field
- Validation before storage
- Error reporting for missing required fields

### 3. Character Limits on Nuggets
**Decision:** Strict 20-char title, 40-char data limits.

**Rationale:**
- ReadyMode CSV import has cell size limits
- Sales reps scan quickly - need concise data
- Consistent formatting improves readability
- Forces prioritization of key metrics

**Implementation:**
- Truncate with ellipsis (…) if needed
- Use K suffix for thousands (47.2K not 47,200)
- Round decimals intelligently
- Abbreviate keywords if necessary

### 4. Cloudflare D1 Database
**Decision:** Use D1 instead of external database (Supabase/PlanetScale).

**Rationale:**
- Co-located with Cloudflare Workers (low latency)
- No external API calls for database queries
- Generous free tier (5GB storage, 5M reads/day)
- SQLite is perfect for read-heavy workloads
- Simpler architecture (one platform)

**Limitations:**
- 1MB per query result (fine for our use case)
- Limited write throughput (batch API fetching handles this)
- No full-text search (we can add if needed)

### 5. Batch Processing Over Real-Time
**Decision:** Process all leads BEFORE calls, not during.

**Rationale:**
- API calls take 5-10 seconds each
- Sales reps can't wait during calls
- Pre-processing enables instant Hot Sheet display
- Reduces API costs (no duplicate requests)
- Better error handling (can retry failed fetches)

**Workflow:**
1. User uploads CSV → immediate storage
2. Background job fetches all APIs → stores raw data
3. Calculate 32 nuggets → stores formatted output
4. Export/Hot Sheet generation is instant (query only)

## Security Considerations

### API Key Storage
- SpyFu API key stored in `.dev.vars` (local)
- Production: Cloudflare environment variable
- Never committed to git (.gitignore)

### GitHub PAT Token
- Stored in `.git-credentials` (local only)
- Added to .gitignore
- Only used for git push operations

### Public Hot Sheets
- URLs are public but unguessable: `/hotsheet/{uuid}`
- No authentication required (sales team access)
- No sensitive financial/personal data exposed
- Only SEO metrics + company/contact info

### Chrome Extension Permissions
- Only requires: `tabs`, `activeTab`, `storage`
- No broad `<all_urls>` permission
- Only monitors ReadyMode domain
- No data collection/tracking

## Performance Considerations

### API Rate Limiting
- SpyFu allows 120 requests/minute
- We batch requests with delays
- Estimate: 500 leads = 2000 API calls = ~20 minutes
- Status tracking shows progress

### Database Indexing
```sql
CREATE INDEX idx_leads_domain ON leads(domain);
CREATE INDEX idx_spyfu_data_domain ON spyfu_data(domain);
CREATE INDEX idx_spyfu_data_fetched ON spyfu_data(fetched_at);
CREATE INDEX idx_nuggets_lead_id ON ranking_nuggets(lead_id);
CREATE INDEX idx_leads_phone ON leads(phone);
```

### Caching Strategy
- D1 query results cached by Cloudflare Workers
- Hot Sheet HTML generated once, served many times
- Static assets served from Cloudflare CDN

## Error Handling

### API Failures
- Retry logic: 3 attempts with exponential backoff
- Store partial data if some APIs succeed
- Flag leads with incomplete data
- User can re-fetch failed leads

### CSV Parse Errors
- Validate before processing
- Report specific line numbers with errors
- Skip invalid rows, continue processing
- Summary report shows successes/failures

### Database Errors
- Transaction-based operations
- Rollback on failure
- Detailed error logging
- User-friendly error messages

## Scalability

### Current Architecture Handles:
- 10,000 leads/project
- 100 concurrent users
- 1M API responses stored
- 100GB database storage

### Future Scaling (if needed):
- Move to Cloudflare Durable Objects for real-time
- Add R2 object storage for large exports
- Implement job queue for background processing
- Add Redis cache layer

## Deployment Architecture

### Development:
```
Local Machine
    ↓
Wrangler dev server (port 3000)
    ↓
D1 local database (SQLite file)
    ↓
Test with sample data
```

### Production:
```
GitHub Repository
    ↓
Wrangler deploy
    ↓
Cloudflare Workers (Edge Functions)
    ↓
Cloudflare D1 (Production Database)
    ↓
Cloudflare Pages (Static Assets)
    ↓
Global CDN Distribution
```

### Monitoring:
- Cloudflare Analytics (requests, errors)
- D1 query performance metrics
- Custom logging for API failures
- User action tracking (uploads, exports)

## API Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     SpyFu API Client                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Input: domain = "rhmd.com"                                  │
│  Tier: "full" (fetch all 4 APIs)                            │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ API #1: getLatestDomainStats                        │    │
│  │ Cost: $0.002                                        │    │
│  │ Response: {                                         │    │
│  │   MonthId: 202312,                                  │    │
│  │   TotalOrganicKeywords: 47225,                      │    │
│  │   OrganicValue: 15842,                              │    │
│  │   OrganicClicks: 16731,                             │    │
│  │   DomainAuthorityScore: 65                          │    │
│  │ }                                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ API #2: getSeoKeywords (rank 1-10)                 │    │
│  │ Cost: $0.00-0.27 (varies)                          │    │
│  │ Response: [                                         │    │
│  │   {                                                 │    │
│  │     Keyword: "holiday rambler",                     │    │
│  │     Rank: 1,                                        │    │
│  │     MonthlySearches: 12100,                         │    │
│  │     CostPerClick: 1.79,                             │    │
│  │     EstimatedClicks: 4816                           │    │
│  │   },                                                │    │
│  │   { ... 50 more keywords ... }                      │    │
│  │ ]                                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ API #3: getMostValuableKeywords (rank 11-75)       │    │
│  │ Cost: $0.013                                        │    │
│  │ Response: [                                         │    │
│  │   {                                                 │    │
│  │     Keyword: "holiday rambler parts",               │    │
│  │     Rank: 15,                                       │    │
│  │     CostPerClick: 2.87,                             │    │
│  │     MonthlyValue: 487.90                            │    │
│  │   },                                                │    │
│  │   { ... 20 money keywords ... }                     │    │
│  │ ]                                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ API #4: getSerpAnalysisKeywords (optional)          │    │
│  │ Cost: $0.021                                        │    │
│  │ Response: [                                         │    │
│  │   {                                                 │    │
│  │     Domain: "competitor1.com",                      │    │
│  │     Rank: 2,                                        │    │
│  │     OverlapScore: 0.85                              │    │
│  │   },                                                │    │
│  │   { ... 10 competitors ... }                        │    │
│  │ ]                                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓                                   │
│  Total Cost: $0.17 (full tier)                              │
│  Total Time: ~8 seconds                                      │
│                                                               │
│  Store in D1:                                                │
│  INSERT INTO spyfu_data (                                    │
│    domain,                                                   │
│    api_1_trends,                                             │
│    api_2_page1,                                              │
│    api_3_money,                                              │
│    api_4_competitors,                                        │
│    fetched_at                                                │
│  ) VALUES (...)                                              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Conclusion

This architecture prioritizes:
- ✅ **Cost efficiency** - Store data once, use many times
- ✅ **Speed** - Pre-process everything, instant exports
- ✅ **Reliability** - Batch processing with error handling
- ✅ **Simplicity** - Single platform (Cloudflare), minimal dependencies
- ✅ **Scalability** - Handles thousands of leads efficiently
- ✅ **User experience** - Fast uploads, multiple export formats, Chrome integration

The key insight: This is a **data transformation pipeline**, not a real-time lookup system. All the heavy lifting (API calls, calculations) happens once during batch processing. Everything after that (exports, Hot Sheets, Chrome popup) is instant.
