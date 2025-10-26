# 💾 Database Schema

## Overview

The SpyFu Lead Intelligence Platform uses **Cloudflare D1** (SQLite-based) for data storage. The schema is designed around a data warehouse pattern where ALL raw API responses are stored permanently for reuse.

## Schema Diagram

```
┌─────────────────┐
│   projects      │
├─────────────────┤
│ id              │──┐
│ name            │  │
│ api_tier        │  │
│ created_at      │  │
│ status          │  │
└─────────────────┘  │
                     │
                     │ 1:N
                     │
                     │
┌─────────────────┐  │      ┌──────────────────┐
│   leads         │◄─┘      │   spyfu_data     │
├─────────────────┤         ├──────────────────┤
│ id              │──────1:1│ id               │
│ project_id      │────────▶│ domain           │ (unique)
│ domain          │         │ api_1_trends     │ (JSON)
│ company         │         │ api_2_page1      │ (JSON)
│ contact_name    │         │ api_3_money      │ (JSON)
│ phone           │         │ api_4_competitors│ (JSON)
│ email           │         │ fetched_at       │
│ created_at      │         │ tier_used        │
└─────────────────┘         └──────────────────┘
         │                           │
         │ 1:1                       │
         │                           │
         ↓                           │
┌──────────────────────────────────┐ │
│     ranking_nuggets              │ │
├──────────────────────────────────┤ │
│ id                               │ │
│ lead_id                          │◄┘ (derived from domain)
│ nugget_1_snapshot                │
│ nugget_2_page1                   │
│ nugget_3_page2                   │
│ nugget_4_quickwins               │
│ nugget_5_historical              │
│ nugget_6_local_l1                │
│ nugget_7_local_l2                │
│ nugget_8_kw_traffic              │
│ nugget_9_top_cpc_kw              │
│ nugget_10_top_traffic_kw         │
│ nugget_11_competitor_1           │
│ nugget_12_competitor_2           │
│ nugget_13_competitor_3           │
│ nugget_14_competitor_4           │
│ nugget_15_competitor_ranks       │
│ nugget_16_comp_hot_buttons       │
│ nugget_17_client_1mo             │
│ nugget_18_client_2mo             │
│ nugget_19_client_3mo             │
│ nugget_20_client_4mo             │
│ nugget_21_local_l3               │
│ nugget_22_local_l4               │
│ nugget_23_local_l5               │
│ nugget_24_lowhang_1              │
│ nugget_25_lowhang_2              │
│ nugget_26_lowhang_3              │
│ nugget_27_lowhang_4              │
│ nugget_28_lowhang_5              │
│ nugget_29_money_kw_2             │
│ nugget_30_money_kw_3             │
│ nugget_31_money_kw_4             │
│ nugget_32_money_kw_5             │
│ calculated_at                    │
└──────────────────────────────────┘
         │
         │ 1:N
         │
         ↓
┌─────────────────┐
│    exports      │
├─────────────────┤
│ id              │
│ project_id      │
│ export_type     │ (readymode, mail, full, custom, hotsheet)
│ filename        │
│ download_url    │
│ created_at      │
│ config          │ (JSON - for custom exports)
└─────────────────┘
```

## Table Definitions

### 1. `projects`

Represents a lead processing campaign.

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  api_tier TEXT NOT NULL CHECK (api_tier IN ('full', 'partial', 'minimal')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  total_leads INTEGER DEFAULT 0,
  processed_leads INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created ON projects(created_at);
```

**Fields:**
- `id`: UUID-style unique identifier
- `name`: User-provided project name (e.g., "Q1 2024 Enterprise Leads")
- `api_tier`: Pricing tier selected
  - `full`: $0.17/lead (all 4 APIs)
  - `partial`: $0.15/lead (APIs 1-3, no competitors)
  - `minimal`: $0.002/lead (API 1 only)
- `status`: Processing state
  - `pending`: CSV uploaded, waiting to process
  - `processing`: API fetches in progress
  - `completed`: All data fetched and calculated
  - `error`: Failed during processing
- `total_leads`: Count from CSV upload
- `processed_leads`: Progress counter for UI
- `created_at`: Project creation timestamp
- `updated_at`: Last modification timestamp

**Example Data:**
```sql
INSERT INTO projects (id, name, api_tier, status, total_leads) 
VALUES ('a1b2c3d4', 'Q1 2024 Enterprise', 'full', 'processing', 150);
```

### 2. `leads`

Stores lead information from uploaded CSV files.

```sql
CREATE TABLE leads (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  company TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, domain)
);

CREATE INDEX idx_leads_project ON leads(project_id);
CREATE INDEX idx_leads_domain ON leads(domain);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_email ON leads(email);
```

**Fields:**
- `id`: Unique lead identifier
- `project_id`: Foreign key to projects table
- `domain`: Website domain (e.g., "rhmd.com")
- `company`: Company/business name
- `contact_name`: Contact person
- `phone`: Phone number (for Chrome extension lookup)
- `email`: Email address
- `created_at`: When lead was added

**UNIQUE Constraint:** Same domain can't exist twice in same project.

**Example Data:**
```sql
INSERT INTO leads (id, project_id, domain, company, contact_name, phone, email)
VALUES 
  ('lead001', 'a1b2c3d4', 'rhmd.com', 'Holiday Rambler', 'John Smith', '555-1234', 'john@rhmd.com'),
  ('lead002', 'a1b2c3d4', 'acme.com', 'Acme Corp', 'Jane Doe', '555-5678', 'jane@acme.com');
```

### 3. `spyfu_data`

Data warehouse for ALL raw SpyFu API responses.

```sql
CREATE TABLE spyfu_data (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  domain TEXT UNIQUE NOT NULL,
  api_1_trends TEXT, -- JSON
  api_2_page1 TEXT, -- JSON
  api_3_money TEXT, -- JSON
  api_4_competitors TEXT, -- JSON
  tier_used TEXT CHECK (tier_used IN ('full', 'partial', 'minimal')),
  fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  error_message TEXT
);

CREATE INDEX idx_spyfu_domain ON spyfu_data(domain);
CREATE INDEX idx_spyfu_fetched ON spyfu_data(fetched_at);
CREATE INDEX idx_spyfu_tier ON spyfu_data(tier_used);
```

**Fields:**
- `id`: Unique record identifier
- `domain`: Website domain (indexed for fast lookup)
- `api_1_trends`: JSON - Domain trends from API #1 (4-month history)
- `api_2_page1`: JSON - Page 1 keywords from API #2 (ranks 1-10)
- `api_3_money`: JSON - Money keywords from API #3 (ranks 11-75, high CPC)
- `api_4_competitors`: JSON - SERP competitors from API #4 (optional)
- `tier_used`: Which tier was used for this fetch
- `fetched_at`: Timestamp of API fetch
- `error_message`: If API fetch failed, store error details

**UNIQUE Constraint:** Each domain stored once (reused across projects).

**JSON Storage Rationale:**
- SQLite JSON functions enable querying specific fields
- Preserves all API data without schema changes
- Enables reprocessing/recalculation without re-fetching
- Flexible for future feature additions

**Example Data:**
```sql
INSERT INTO spyfu_data (domain, api_1_trends, api_2_page1, tier_used)
VALUES (
  'rhmd.com',
  '{
    "data": [
      {
        "MonthId": 202312,
        "TotalOrganicKeywords": 47225,
        "OrganicValue": 15842,
        "OrganicClicks": 16731,
        "DomainAuthorityScore": 65
      }
    ]
  }',
  '{
    "results": [
      {
        "Keyword": "holiday rambler",
        "Rank": 1,
        "MonthlySearches": 12100,
        "CostPerClick": 1.79,
        "EstimatedClicks": 4816
      }
    ]
  }',
  'full'
);
```

**Querying JSON Example:**
```sql
-- Get current month keywords count
SELECT 
  domain,
  json_extract(api_1_trends, '$.data[0].TotalOrganicKeywords') as keywords
FROM spyfu_data
WHERE domain = 'rhmd.com';

-- Get all Page 1 keywords
SELECT 
  domain,
  json_extract(api_2_page1, '$.results') as page1_keywords
FROM spyfu_data
WHERE domain = 'rhmd.com';
```

### 4. `ranking_nuggets`

Calculated 32-row data ready for export.

```sql
CREATE TABLE ranking_nuggets (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Above-fold nuggets (1-15)
  nugget_1_snapshot TEXT,
  nugget_2_page1 TEXT,
  nugget_3_page2 TEXT,
  nugget_4_quickwins TEXT,
  nugget_5_historical TEXT,
  nugget_6_local_l1 TEXT,
  nugget_7_local_l2 TEXT,
  nugget_8_kw_traffic TEXT,
  nugget_9_top_cpc_kw TEXT,
  nugget_10_top_traffic_kw TEXT,
  nugget_11_competitor_1 TEXT,
  nugget_12_competitor_2 TEXT,
  nugget_13_competitor_3 TEXT,
  nugget_14_competitor_4 TEXT,
  nugget_15_competitor_ranks TEXT,
  
  -- Below-fold nuggets (16-32)
  nugget_16_comp_hot_buttons TEXT,
  nugget_17_client_1mo TEXT,
  nugget_18_client_2mo TEXT,
  nugget_19_client_3mo TEXT,
  nugget_20_client_4mo TEXT,
  nugget_21_local_l3 TEXT,
  nugget_22_local_l4 TEXT,
  nugget_23_local_l5 TEXT,
  nugget_24_lowhang_1 TEXT,
  nugget_25_lowhang_2 TEXT,
  nugget_26_lowhang_3 TEXT,
  nugget_27_lowhang_4 TEXT,
  nugget_28_lowhang_5 TEXT,
  nugget_29_money_kw_2 TEXT,
  nugget_30_money_kw_3 TEXT,
  nugget_31_money_kw_4 TEXT,
  nugget_32_money_kw_5 TEXT,
  
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lead_id)
);

CREATE INDEX idx_nuggets_lead ON ranking_nuggets(lead_id);
CREATE INDEX idx_nuggets_calculated ON ranking_nuggets(calculated_at);
```

**Fields:**
- `id`: Unique record identifier
- `lead_id`: Foreign key to leads table
- `nugget_1` through `nugget_32`: Pre-formatted text (Title | Data)
- `calculated_at`: When nuggets were calculated

**Format:** Each nugget stored as `"Title | Data"` string:
- Title ≤ 20 characters
- Data ≤ 40 characters
- Pipe separator

**Example Data:**
```sql
INSERT INTO ranking_nuggets (lead_id, nugget_1_snapshot, nugget_2_page1, nugget_3_page2)
VALUES (
  'lead001',
  'Snapshot | 47.2K | $15.8K | 16.7K | 65',
  'Page 1 | 51 KWs | $8.1K | 9.7K | 68',
  'Page 2 | 42 KWs | $4.2K | 5.1K | 61'
);
```

**Why Separate Table:**
- Nuggets can be recalculated without re-fetching APIs
- Keeps `spyfu_data` as pure data warehouse
- Enables versioning (future: store multiple calculations)
- Faster export queries (no JSON parsing)

### 5. `exports`

Tracks generated export files.

```sql
CREATE TABLE exports (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('readymode', 'mail', 'full', 'custom', 'hotsheet')),
  filename TEXT NOT NULL,
  download_url TEXT,
  config TEXT, -- JSON - for custom exports
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exports_project ON exports(project_id);
CREATE INDEX idx_exports_type ON exports(export_type);
CREATE INDEX idx_exports_created ON exports(created_at);
```

**Fields:**
- `id`: Unique export identifier
- `project_id`: Which project this export belongs to
- `export_type`: Type of export
  - `readymode`: CSV with 32 nugget columns
  - `mail`: CSV with contact info only
  - `full`: CSV with all raw API data + nuggets
  - `custom`: User-selected columns
  - `hotsheet`: HTML Hot Sheet bundle
- `filename`: Generated filename (e.g., "Q1_2024_Enterprise_ReadyMode.csv")
- `download_url`: Public URL for download (Cloudflare R2 if large)
- `config`: JSON - For custom exports, stores selected columns
- `created_at`: When export was generated

**Example Data:**
```sql
INSERT INTO exports (id, project_id, export_type, filename, download_url)
VALUES 
  ('exp001', 'a1b2c3d4', 'readymode', 'Q1_2024_ReadyMode.csv', '/downloads/exp001.csv'),
  ('exp002', 'a1b2c3d4', 'mail', 'Q1_2024_Mail.csv', '/downloads/exp002.csv'),
  ('exp003', 'a1b2c3d4', 'custom', 'Q1_2024_Custom.csv', '/downloads/exp003.csv');
```

**Custom Export Config Example:**
```json
{
  "columns": [
    "domain",
    "company",
    "contact_name",
    "nugget_1_snapshot",
    "nugget_2_page1",
    "nugget_8_kw_traffic",
    "nugget_11_competitor_1"
  ]
}
```

## Migration Script

```sql
-- migrations/0001_initial_schema.sql

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  api_tier TEXT NOT NULL CHECK (api_tier IN ('full', 'partial', 'minimal')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  total_leads INTEGER DEFAULT 0,
  processed_leads INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  company TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, domain)
);

CREATE INDEX IF NOT EXISTS idx_leads_project ON leads(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_domain ON leads(domain);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- SpyFu data warehouse table
CREATE TABLE IF NOT EXISTS spyfu_data (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  domain TEXT UNIQUE NOT NULL,
  api_1_trends TEXT,
  api_2_page1 TEXT,
  api_3_money TEXT,
  api_4_competitors TEXT,
  tier_used TEXT CHECK (tier_used IN ('full', 'partial', 'minimal')),
  fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_spyfu_domain ON spyfu_data(domain);
CREATE INDEX IF NOT EXISTS idx_spyfu_fetched ON spyfu_data(fetched_at);
CREATE INDEX IF NOT EXISTS idx_spyfu_tier ON spyfu_data(tier_used);

-- Ranking nuggets table
CREATE TABLE IF NOT EXISTS ranking_nuggets (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  nugget_1_snapshot TEXT,
  nugget_2_page1 TEXT,
  nugget_3_page2 TEXT,
  nugget_4_quickwins TEXT,
  nugget_5_historical TEXT,
  nugget_6_local_l1 TEXT,
  nugget_7_local_l2 TEXT,
  nugget_8_kw_traffic TEXT,
  nugget_9_top_cpc_kw TEXT,
  nugget_10_top_traffic_kw TEXT,
  nugget_11_competitor_1 TEXT,
  nugget_12_competitor_2 TEXT,
  nugget_13_competitor_3 TEXT,
  nugget_14_competitor_4 TEXT,
  nugget_15_competitor_ranks TEXT,
  nugget_16_comp_hot_buttons TEXT,
  nugget_17_client_1mo TEXT,
  nugget_18_client_2mo TEXT,
  nugget_19_client_3mo TEXT,
  nugget_20_client_4mo TEXT,
  nugget_21_local_l3 TEXT,
  nugget_22_local_l4 TEXT,
  nugget_23_local_l5 TEXT,
  nugget_24_lowhang_1 TEXT,
  nugget_25_lowhang_2 TEXT,
  nugget_26_lowhang_3 TEXT,
  nugget_27_lowhang_4 TEXT,
  nugget_28_lowhang_5 TEXT,
  nugget_29_money_kw_2 TEXT,
  nugget_30_money_kw_3 TEXT,
  nugget_31_money_kw_4 TEXT,
  nugget_32_money_kw_5 TEXT,
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lead_id)
);

CREATE INDEX IF NOT EXISTS idx_nuggets_lead ON ranking_nuggets(lead_id);
CREATE INDEX IF NOT EXISTS idx_nuggets_calculated ON ranking_nuggets(calculated_at);

-- Exports table
CREATE TABLE IF NOT EXISTS exports (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('readymode', 'mail', 'full', 'custom', 'hotsheet')),
  filename TEXT NOT NULL,
  download_url TEXT,
  config TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_exports_project ON exports(project_id);
CREATE INDEX IF NOT EXISTS idx_exports_type ON exports(export_type);
CREATE INDEX IF NOT EXISTS idx_exports_created ON exports(created_at);
```

## Seed Data (for Testing)

```sql
-- seed.sql

-- Insert test project
INSERT INTO projects (id, name, api_tier, status, total_leads, processed_leads)
VALUES ('test-project-1', 'Test Project - Full Tier', 'full', 'completed', 3, 3);

-- Insert test leads
INSERT INTO leads (id, project_id, domain, company, contact_name, phone, email)
VALUES 
  ('lead-001', 'test-project-1', 'rhmd.com', 'Holiday Rambler', 'John Smith', '555-1234', 'john@rhmd.com'),
  ('lead-002', 'test-project-1', 'acme.com', 'Acme Corp', 'Jane Doe', '555-5678', 'jane@acme.com'),
  ('lead-003', 'test-project-1', 'example.com', 'Example Inc', 'Bob Johnson', '555-9999', 'bob@example.com');

-- Insert test SpyFu data (minimal example)
INSERT INTO spyfu_data (domain, api_1_trends, tier_used)
VALUES 
  ('rhmd.com', '{"data":[{"MonthId":202312,"TotalOrganicKeywords":47225}]}', 'full'),
  ('acme.com', '{"data":[{"MonthId":202312,"TotalOrganicKeywords":12500}]}', 'full'),
  ('example.com', '{"data":[{"MonthId":202312,"TotalOrganicKeywords":8900}]}', 'full');

-- Insert test ranking nuggets
INSERT INTO ranking_nuggets (lead_id, nugget_1_snapshot, nugget_2_page1)
VALUES 
  ('lead-001', 'Snapshot | 47.2K | $15.8K | 16.7K | 65', 'Page 1 | 51 KWs | $8.1K | 9.7K | 68'),
  ('lead-002', 'Snapshot | 12.5K | $4.2K | 5.1K | 58', 'Page 1 | 32 KWs | $2.1K | 3.4K | 55'),
  ('lead-003', 'Snapshot | 8.9K | $2.1K | 2.8K | 52', 'Page 1 | 18 KWs | $1.2K | 1.9K | 48');
```

## Query Examples

### Get All Leads for a Project with Nuggets
```sql
SELECT 
  l.domain,
  l.company,
  l.contact_name,
  l.phone,
  l.email,
  rn.nugget_1_snapshot,
  rn.nugget_2_page1,
  rn.nugget_3_page2
FROM leads l
LEFT JOIN ranking_nuggets rn ON l.id = rn.lead_id
WHERE l.project_id = 'test-project-1'
ORDER BY l.company;
```

### Get Lead with Full SpyFu Data
```sql
SELECT 
  l.domain,
  l.company,
  s.api_1_trends,
  s.api_2_page1,
  s.api_3_money,
  s.api_4_competitors,
  s.fetched_at
FROM leads l
JOIN spyfu_data s ON l.domain = s.domain
WHERE l.id = 'lead-001';
```

### Get Project Processing Progress
```sql
SELECT 
  p.name,
  p.api_tier,
  p.status,
  p.processed_leads,
  p.total_leads,
  ROUND(p.processed_leads * 100.0 / p.total_leads, 1) as progress_pct
FROM projects p
WHERE p.id = 'test-project-1';
```

### Check Which Leads Missing SpyFu Data
```sql
SELECT 
  l.id,
  l.domain,
  l.company,
  s.domain as has_data
FROM leads l
LEFT JOIN spyfu_data s ON l.domain = s.domain
WHERE l.project_id = 'test-project-1'
  AND s.domain IS NULL;
```

### Get All Exports for a Project
```sql
SELECT 
  e.export_type,
  e.filename,
  e.download_url,
  e.created_at
FROM exports e
WHERE e.project_id = 'test-project-1'
ORDER BY e.created_at DESC;
```

## Performance Considerations

### Indexing Strategy
- **Primary Keys**: All tables use TEXT UUIDs (fast lookups)
- **Foreign Keys**: Indexed automatically by SQLite
- **Domain Lookups**: `idx_spyfu_domain` enables fast SpyFu data retrieval
- **Phone Lookups**: `idx_leads_phone` for Chrome extension lookups
- **Project Queries**: `idx_leads_project` for efficient project views

### JSON Column Performance
- SQLite JSON1 extension is fast for most queries
- Extract frequently queried fields if performance issues arise
- Consider materialized views for complex aggregations

### Data Size Estimates
| Table | Rows (1000 leads) | Size | Notes |
|-------|------------------|------|-------|
| `projects` | 10 | <1KB | Very small |
| `leads` | 1,000 | ~100KB | Minimal data |
| `spyfu_data` | 1,000 | ~50MB | JSON responses |
| `ranking_nuggets` | 1,000 | ~500KB | Pre-formatted text |
| `exports` | 50 | ~5KB | Metadata only |
| **Total** | | **~50MB** | Per 1000 leads |

**Cloudflare D1 Limits:**
- Free tier: 5GB storage (supports ~100,000 leads)
- 5M row reads/day (plenty for this use case)
- 100K row writes/day (handles batch processing)

## Backup Strategy

### Export Full Database
```sql
-- Get all data as JSON (for backup)
.mode json
.output backup.json
SELECT * FROM projects;
SELECT * FROM leads;
SELECT * FROM spyfu_data;
SELECT * FROM ranking_nuggets;
SELECT * FROM exports;
.output stdout
```

### Restore from Backup
```sql
-- Create tables from migration script first
-- Then import JSON data
-- (Wrangler handles this automatically)
```

### Wrangler Backup Commands
```bash
# Export local database
wrangler d1 export spyfu-db --local --output backup.sql

# Import to production
wrangler d1 execute spyfu-db --file=backup.sql

# Copy local to production
wrangler d1 backup create spyfu-db
```

## Database Initialization

### Local Development
```bash
# Create D1 database (if not exists)
npx wrangler d1 create spyfu-db

# Apply migrations
npx wrangler d1 migrations apply spyfu-db --local

# Seed test data
npx wrangler d1 execute spyfu-db --local --file=./seed.sql
```

### Production
```bash
# Apply migrations to production
npx wrangler d1 migrations apply spyfu-db

# No seed data in production
# Users will upload their own CSVs
```

## Conclusion

This schema is designed for:
- ✅ **Data persistence** - Store ALL API responses permanently
- ✅ **Performance** - Fast lookups with proper indexing
- ✅ **Flexibility** - JSON columns for easy schema evolution
- ✅ **Efficiency** - Minimal redundancy, clear relationships
- ✅ **Scalability** - Handles thousands of leads efficiently

The key design principle: **Separate raw data (spyfu_data) from calculated data (ranking_nuggets)** to enable reprocessing without expensive API re-fetches.
