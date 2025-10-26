-- SpyFu Lead Intelligence Platform - Initial Database Schema
-- This migration creates all tables required for the platform

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
