-- Seed data for testing SpyFu Lead Intelligence Platform
-- Run with: npm run db:seed

-- Insert test project
INSERT OR IGNORE INTO projects (id, name, api_tier, status, total_leads, processed_leads)
VALUES ('test-project-1', 'Test Project - Full Tier', 'full', 'completed', 3, 3);

-- Insert test leads
INSERT OR IGNORE INTO leads (id, project_id, domain, company, contact_name, phone, email)
VALUES 
  ('lead-001', 'test-project-1', 'rhmd.com', 'Holiday Rambler', 'John Smith', '555-1234', 'john@rhmd.com'),
  ('lead-002', 'test-project-1', 'acme.com', 'Acme Corp', 'Jane Doe', '555-5678', 'jane@acme.com'),
  ('lead-003', 'test-project-1', 'example.com', 'Example Inc', 'Bob Johnson', '555-9999', 'bob@example.com');

-- Insert test SpyFu data (minimal example)
INSERT OR IGNORE INTO spyfu_data (domain, api_1_trends, tier_used)
VALUES 
  ('rhmd.com', '{"data":[{"MonthId":202312,"TotalOrganicKeywords":47225,"OrganicValue":15842,"OrganicClicks":16731,"DomainAuthorityScore":65}]}', 'full'),
  ('acme.com', '{"data":[{"MonthId":202312,"TotalOrganicKeywords":12500,"OrganicValue":4200,"OrganicClicks":5100,"DomainAuthorityScore":58}]}', 'full'),
  ('example.com', '{"data":[{"MonthId":202312,"TotalOrganicKeywords":8900,"OrganicValue":2100,"OrganicClicks":2800,"DomainAuthorityScore":52}]}', 'full');

-- Insert test ranking nuggets
INSERT OR IGNORE INTO ranking_nuggets (lead_id, nugget_1_snapshot, nugget_2_page1, nugget_3_page2)
VALUES 
  ('lead-001', 'Snapshot | 47.2K | $15.8K | 16.7K | 65', 'Page 1 | 51 KWs | $8.1K | 9.7K | 68', 'Page 2 | 42 KWs | $4.2K | 5.1K | 61'),
  ('lead-002', 'Snapshot | 12.5K | $4.2K | 5.1K | 58', 'Page 1 | 32 KWs | $2.1K | 3.4K | 55', 'Page 2 | 28 KWs | $1.8K | 2.2K | 52'),
  ('lead-003', 'Snapshot | 8.9K | $2.1K | 2.8K | 52', 'Page 1 | 18 KWs | $1.2K | 1.9K | 48', 'Page 2 | 15 KWs | $0.8K | 1.1K | 45');

-- Insert test export record
INSERT OR IGNORE INTO exports (id, project_id, export_type, filename, download_url)
VALUES ('export-001', 'test-project-1', 'readymode', 'Test_Project_ReadyMode.csv', '/api/exports/export-001/download');
