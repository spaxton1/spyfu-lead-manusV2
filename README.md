# 🎯 SpyFu Lead Intelligence Platform

A comprehensive SEO lead intelligence platform that fetches SpyFu data, calculates 32 "Ranking Nuggets" for cold calling, and integrates with ReadyMode dialer.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Phase](https://img.shields.io/badge/phase-1%20core%20engine-blue)
![License](https://img.shields.io/badge/license-private-red)

---

## 🚀 Quick Start

### **New AI Chat Recovery:**
```bash
cd /home/user/webapp
git clone https://github.com/spaxton1/spyfu-lead-intelligence.git .
cat COMPLETE_PROJECT_PROMPT.md  # Read this first!
```

---

## 📊 What This Platform Does

### **The 7 Major Features:**

1. **📤 CSV Upload** - Import leads from any provider (smart field detection)
2. **💰 API Tier Selection** - Choose Full/Partial/Minimal ($0.17, $0.15, $0.002 per lead)
3. **🔍 Data Fetching** - Call 4 SpyFu APIs, store ALL raw data
4. **🎯 32 Ranking Nuggets** - Calculate pre-formatted rows for ReadyMode
5. **📁 Multi-Format Export** - ReadyMode, Mail, Full Data, Custom CSVs
6. **📄 Hot Sheets** - HTML pages with expanded prospect data
7. **🔌 Chrome Extension** - Auto-popup Hot Sheets during calls

---

## 🎯 The 32 Ranking Nuggets

### **Above-the-Fold (15 rows shown in ReadyMode):**

| # | Title | Example Data | Character Limit |
|---|-------|--------------|-----------------|
| 1 | Snapshot | `2,496 KWs \| $8,281 \| 888 Clicks \|36A` | ≤40 chars |
| 2 | Page 1 | `233/9.3% \| 30 #1 \| 219 T3 \| 14 4-10` | ≤40 chars |
| 3 | Page 2 | `32 KWs \| 1234 Clicks \| $3.2K \| 91% Pg2+` | ≤40 chars |
| 4 | Quick Wins | `16@11-15 \| 22 $KWs \| $52 TopCPC \| 1355 Clicks` | ≤40 chars |
| 5 | Historical Trend | `-80 KWs \| -3.4K Val \| -74 Clicks \| +1A` | ≤40 chars |
| 6-10 | Local/Top KWs | `plastic surgery NC\|#14\|$8.7` | ≤40 chars |
| 11-15 | Competitors | `skinsurg.net\|14,929 KWs\|$56K` | ≤40 chars |

### **Below-the-Fold (17 additional rows):**
- Comp Hot Buttons, Client 1-4 Mo, Local KW L3-L5
- LowHang1-5, Money KW2-5

**Full Specification:** See [RANKING_NUGGETS_SPEC.md](RANKING_NUGGETS_SPEC.md)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   WEB APPLICATION                        │
│  (Hono + Cloudflare Workers + D1 Database)              │
├─────────────────────────────────────────────────────────┤
│  1. CSV Upload & Smart Parser                           │
│  2. Project Management                                   │
│  3. SpyFu Data Fetcher (4 APIs)                         │
│  4. Ranking Nuggets Calculator (32 rows)                │
│  5. Data Warehouse (D1 SQLite)                          │
│  6. Export Engine (multiple CSV formats)                │
│  7. Hot Sheet Generator (HTML)                          │
│  8. Chrome Extension API                                │
└─────────────────────────────────────────────────────────┘
```

**Full Architecture:** See [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 💾 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Backend** | Hono | Lightweight, edge-optimized |
| **Runtime** | Cloudflare Workers | Serverless, global |
| **Database** | D1 (SQLite) | Perfect for structured data |
| **Language** | TypeScript | Type safety |
| **Frontend** | HTML + Tailwind | Simple, fast |
| **Extension** | Chrome Manifest V3 | Latest standard |

---

## 📊 SpyFu API Integration

### **The 4 APIs:**

| API | Cost | What It Provides |
|-----|------|------------------|
| **#1: Domain Trends** | $0.0020 | 4-month history (keywords, value, clicks, authority) |
| **#2: Page 1 Keywords** | $0.13 avg | All rank 1-10 keywords with CPC and volume |
| **#3: Money Keywords** | $0.0133 | High-CPC keywords rank 11-75 |
| **#4: Competitors** | $0.0210 | Top 10 competitors + their stats |

**Total Cost:** $0.17/lead (all 4 APIs)

**API Credentials:** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 💾 Database Schema

### **Core Tables:**
- `projects` - Organize leads into campaigns
- `leads` - Core lead data from CSV
- `spyfu_data` - ALL raw API responses (JSON)
- `ranking_nuggets` - Pre-calculated 32 rows
- `exports` - Export history

**Full Schema:** See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

---

## 📋 Implementation Phases

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | 🚧 In Progress | Core Data Engine (CSV, APIs, Nuggets) |
| **Phase 2** | ⏳ Pending | Export Engine (4 CSV formats) |
| **Phase 3** | ⏳ Pending | Project Management UI |
| **Phase 4** | ⏳ Pending | Hot Sheet System |
| **Phase 5** | ⏳ Pending | Chrome Extension |
| **Phase 6** | ⏳ Pending | Polish & Production |

**Timeline:** 6-7 weeks total

**Detailed Plan:** See [IMPLEMENTATION_PHASES.md](IMPLEMENTATION_PHASES.md)

---

## 🚀 Development

### **Install Dependencies:**
```bash
npm install
```

### **Setup D1 Database:**
```bash
# Create database
npx wrangler d1 create spyfu-lead-intelligence

# Apply schema
npx wrangler d1 execute spyfu-lead-intelligence --file=src/db/schema.sql --local
```

### **Run Locally:**
```bash
# Build
npm run build

# Start dev server (PM2)
pm2 start ecosystem.config.cjs

# Test
curl http://localhost:3000
```

### **Deploy to Cloudflare:**
```bash
npm run deploy
```

---

## 📁 Project Structure

```
spyfu-lead-intelligence/
├── COMPLETE_PROJECT_PROMPT.md    # Full recovery prompt
├── RANKING_NUGGETS_SPEC.md       # 32 nuggets specification
├── API_DOCUMENTATION.md          # SpyFu API details
├── DATABASE_SCHEMA.md            # D1 database design
├── ARCHITECTURE.md               # System architecture
├── IMPLEMENTATION_PHASES.md      # Build roadmap
├── README.md                     # This file
│
├── src/
│   ├── index.tsx                 # Main Hono app
│   ├── routes/                   # API endpoints
│   ├── services/                 # Business logic
│   ├── db/                       # Database files
│   └── types/                    # TypeScript types
│
├── data/
│   ├── us_cities_lookup.json     # 29,880 US cities
│   └── master_test_results.json  # Test data (19 domains)
│
├── chrome-extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   └── popup.html
│
├── package.json
├── tsconfig.json
├── wrangler.jsonc
└── .gitignore
```

---

## 🧪 Testing

### **Test with Existing Data:**
```bash
# Use master_test_results.json (no API calls needed)
npm run test:existing
```

### **Test with Real API:**
```bash
# Process single domain
npm run test:domain -- rhmd.com

# Process test CSV
npm run test:csv -- data/test_domains.csv
```

---

## 🔍 Local Keyword Detection

**Database:** 29,880 US cities + 50 states + ZIP codes

**Detects:**
- City names: "greensboro", "winston salem"
- State names: "north carolina", "texas"
- State abbreviations: "nc", "tx"
- ZIP codes: "27407", "90210-1234"

**Excludes:**
- Generic terms: "near me", "local", "city", "nearby"

---

## 📊 Current Status

**Phase:** Phase 1 - Core Data Engine  
**Progress:** Foundation complete, building data fetcher  
**Last Updated:** 2025-10-26  

**Recent Changes:**
- ✅ Project structure created
- ✅ Documentation complete
- ✅ Database schema designed
- 🚧 Building SpyFu API client
- ⏳ Nugget calculator next

---

## 🚨 Recovery Instructions

### **If Chat Crashes:**

1. Start new AI chat
2. Paste this:
   ```
   Clone https://github.com/spaxton1/spyfu-lead-intelligence to /home/user/webapp/
   Read COMPLETE_PROJECT_PROMPT.md for full context
   Continue building from current status
   ```
3. AI will have complete context and can resume

---

## 📝 Key Documents

| File | Purpose |
|------|---------|
| **COMPLETE_PROJECT_PROMPT.md** | Full recovery prompt for new AI chat |
| **RANKING_NUGGETS_SPEC.md** | Complete 32-row specification |
| **API_DOCUMENTATION.md** | All 4 SpyFu APIs documented |
| **DATABASE_SCHEMA.md** | D1 database schema with examples |
| **ARCHITECTURE.md** | System architecture and data flow |
| **IMPLEMENTATION_PHASES.md** | Detailed build phases 1-6 |

---

## 🔒 Security

- ✅ API keys stored in Cloudflare secrets (production)
- ✅ `.dev.vars` for local development (not committed)
- ✅ PAT token in `.git-credentials` (local only)
- ✅ All sensitive data in `.gitignore`

---

## 📞 Support

**Repository:** https://github.com/spaxton1/spyfu-lead-intelligence  
**Issues:** https://github.com/spaxton1/spyfu-lead-intelligence/issues  

---

## 📜 License

Private - All Rights Reserved

---

**Last Updated:** 2025-10-26  
**Version:** 0.1.0-alpha  
**Status:** Active Development
