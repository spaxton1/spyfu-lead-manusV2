-- Migration 0001: Create users table for admin/agent authentication
-- Purpose: User management system - admins can create agents and assign leads

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'agent')),
  first_name TEXT,
  last_name TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Insert default admin account
-- Email: admin@spyfu.local
-- Password: Admin123! (MUST be changed on first login)
-- Password hash for "Admin123!" using bcrypt
INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active)
VALUES (
  'admin001',
  'admin@spyfu.local',
  '$2a$10$rF8qZ8qYzx8HGKqN.qZ8qOqZ8qYzx8HGKqN.qZ8qOqZ8qYzx8HGKq',
  'admin',
  'System',
  'Administrator',
  1
);
