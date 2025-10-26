-- Migration 0002: Add user management fields to existing tables
-- Purpose: Extend existing schema with created_by and assigned_to fields

-- Add created_by field to projects table
ALTER TABLE projects ADD COLUMN created_by TEXT REFERENCES users(id);

-- Add assignment fields to leads table
ALTER TABLE leads ADD COLUMN assigned_to TEXT REFERENCES users(id);
ALTER TABLE leads ADD COLUMN assigned_at DATETIME;
ALTER TABLE leads ADD COLUMN original_csv_data TEXT;

-- Create index for assignments
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads(assigned_to);

-- Add domain field to ranking_nuggets table for easier queries
ALTER TABLE ranking_nuggets ADD COLUMN domain TEXT;
CREATE INDEX IF NOT EXISTS idx_nuggets_domain ON ranking_nuggets(domain);
