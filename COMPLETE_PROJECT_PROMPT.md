# 🚀 COMPLETE PROJECT RECOVERY PROMPT
## SpyFu Lead Intelligence Platform - Full Context for New AI Chat

**Use this prompt to recover the entire project in a new AI chat session.**

---

## 📌 QUICK START (Copy/Paste This)

```
I'm building a SpyFu Lead Intelligence Platform. The complete project is in GitHub:
https://github.com/[YOUR-USERNAME]/spyfu-lead-intelligence

Please:
1. Clone the repository to /home/user/webapp/
2. Read these files in order:
   - README.md (project overview)
   - ARCHITECTURE.md (system design)
   - RANKING_NUGGETS_SPEC.md (32 nuggets specification)
   - API_DOCUMENTATION.md (SpyFu APIs)
   - DATABASE_SCHEMA.md (D1 database)
3. Review the current implementation in /src/
4. Continue building from where we left off

Current Phase: [UPDATE THIS - e.g., "Phase 1: Core Data Engine"]
Current Status: [UPDATE THIS - e.g., "CSV parser complete, working on SpyFu client"]
```

---

## 🎯 PROJECT OVERVIEW

### **What This Platform Does:**

A comprehensive SEO lead intelligence platform that:
1. **Imports leads** from CSV files (various formats, smart parsing)
2. **Fetches SEO data** from SpyFu APIs (4 APIs, 3 pricing tiers)
3. **Calculates 32 "Ranking Nuggets"** (formatted for ReadyMode dialer)
4. **Stores everything** in Cloudflare D1 database
5. **Exports multiple formats** (ReadyMode, Mail, Full Data, Custom)
6. **Generates Hot Sheets** (HTML pages with expanded prospect data)
7. **Chrome Extension** (auto-popup on ReadyMode calls)

---

## 📊 THE 32 RANKING NUGGETS (Exact Order - CRITICAL)

**Above-the-Fold (15 rows):**
1. Snapshot - `2,496 KWs | $8,281 | 888 Clicks |36A`
2. Page 1 - `233/9.3% | 30 #1 | 219 T3 | 14 4-10`
3. Page 2 - `32 KWs | 1234 Clicks | $3.2K | 91% Pg2+`
4. Quick Wins - `16@11-15 | 22 $KWs | $52 TopCPC | 1355 Clicks`
5. Historical Trend - `-80 KWs | -3.4K Val | -74 Clicks | +1A`
6. Local KW L1 - `plastic surgery NC|#14|$8.7`
7. Local KW L2 - `coolsculpting greensboro|#28|$7`
8. KW Traffic - `113 L1|40 L2|223 CPC|455 Traf`
9. Top CPC KW - `tummy tuck beverly hills|#22|$9.8`
10. Top Traffic KW - `jawline surgery men|#10|13 Clicks`
11. Competitor 1 - `skinsurg.net|14,929 KWs|$56K`
12. Competitor 2 - `winstonderm.com|11,660 KWs|$42K`
13. Competitor Ranks - `plastic NC|#1 C1|#2 C2`
14. Competitor 3 - `salemplastic.com|8,000 KWs|$30K`
15. Competitor 4 - `piedmontplast.com|6,000 KWs|$20K`

**Below-the-Fold (17 rows):**
16. Comp Hot Buttons - `KWs +498%|$48K|Clicks +1161%`
17. Client 1 Mo - `2,496 KWs|$8K|888 Clicks|36Au`
18. Client 2 Mo - `2,516 KWs|$9K|908 Clicks|36Au`
19. Client 3 Mo - `2,536 KWs|$9K|928 Clicks|36Au`
20. Client 4 Mo - `2,576 KWs|$11K|962 Clicks|35Au`
21. Local KW L3 - `charleston surgery|$7.3|#10|73mo`
22. Local KW L4 - `greensboro botox|$6.5|#35|100mo`
23. Local KW L5 - `raleigh lipo|$5.8|#50|80mo`
24. LowHang1 - `jawline surgery men|$7.3|#10|73mo`
25. LowHang2 - `buttock lift|$7.9|#12|150mo`
26. LowHang3 - `liposuction cost|$8.5|#15|200mo`
27. LowHang4 - `chin implant cost|$8.2|#9|210mo`
28. LowHang5 - `facelift surgery|$7|#20|180mo`
29. Money KW2 - `blepharoplasty recovery|$6.9|#8|180mo`
30. Money KW3 - `tummy tuck recovery|$6.8|#25|160mo`
31. Money KW4 - `rhinoplasty cost|$6.5|#30|140mo`
32. Money KW5 - `breast augmentation|$6.2|#40|120mo`

**Constraints:**
- Title: ≤20 characters
- Data: ≤40 characters
- Format: Pipe-separated, no spaces
- Numbers: Exact integers for credibility

---

## 🔑 SPYFU API CREDENTIALS

**API Key:** `MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ`

**Authorization Header:**
```javascript
const AUTH_HEADER = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';
```

---

## 📊 THE 4 SPYFU APIS

### **API #1: Domain Trends (4-Month History)**
- Endpoint: `getLatestDomainStats?domain={domain}&pastNMonths=4`
- Cost: $0.0020 per domain
- Returns: 4 months of totalOrganicResults, monthlyOrganicValue, monthlyOrganicClicks, strength

### **API #2: Page 1 Keywords (Rank 1-10)**
- Endpoint: `seo/getSeoKeywords?query={domain}&rank.min=1&rank.max=10&pageSize=1000`
- Cost: $0.13 avg (variable by keyword count)
- Returns: All keywords ranking positions 1-10 with CPC, volume, difficulty

### **API #3: Money Keywords (Rank 11-75, High CPC)**
- Endpoint: `seo/getMostValuableKeywords?query={domain}&rank.min=11&rank.max=75&costPerClick.min=1&pageSize=500`
- Cost: $0.0133 per domain
- Returns: High-value keywords on pages 2-8 sorted by CPC

### **API #4: SERP Competitors (Optional)**
- Endpoint: `seo/getSerpAnalysisKeywords?Keyword={keyword}&pageSize=10`
- Cost: $0.0210 per domain
- Returns: Top 10 competitors + their domain stats

**Total Cost:** $0.17/lead (all 4 APIs)

---

## 💾 DATABASE SCHEMA (D1 SQLite)

```sql
-- Projects
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_leads INTEGER DEFAULT 0,
  total_api_cost REAL DEFAULT 0,
  api_tier TEXT DEFAULT 'full'
);

-- Leads
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  domain TEXT NOT NULL,
  company_name TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  hotsheet_active BOOLEAN DEFAULT 0,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- SpyFu Raw Data (ALL API responses as JSON)
CREATE TABLE spyfu_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  api_tier TEXT NOT NULL,
  api_cost REAL NOT NULL,
  fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  trends_data TEXT,        -- JSON array
  page1_keywords TEXT,     -- JSON array
  money_keywords TEXT,     -- JSON array
  competitors_data TEXT,   -- JSON array
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);

-- Ranking Nuggets (32 pre-calculated rows)
CREATE TABLE ranking_nuggets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL UNIQUE,
  nugget_01_snapshot TEXT,
  nugget_02_page1 TEXT,
  nugget_03_page2 TEXT,
  -- ... (all 32 nuggets in exact order)
  nugget_32_moneykw5 TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);

-- Exports History
CREATE TABLE exports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  export_type TEXT NOT NULL,
  filename TEXT NOT NULL,
  lead_count INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

---

## 🏗️ TECH STACK

- **Backend:** Hono (lightweight web framework)
- **Runtime:** Cloudflare Workers + Pages
- **Database:** Cloudflare D1 (SQLite)
- **Language:** TypeScript
- **Frontend:** HTML + Tailwind CSS (CDN)
- **Extension:** Chrome Extension Manifest V3

---

## 📋 IMPLEMENTATION PHASES

### **Phase 1: Core Data Engine (Current Focus)**
1. ✅ CSV upload endpoint
2. ✅ Smart CSV parser (detect fields regardless of order)
3. ✅ SpyFu API client (all 4 APIs with rate limiting)
4. ✅ Ranking Nuggets calculator (all 32 rows)
5. ✅ D1 database storage
6. ✅ Basic UI for upload

### **Phase 2: Export Engine**
7. ReadyMode CSV export (32 nuggets)
8. Mail CSV export
9. Full Data CSV export
10. Custom CSV builder

### **Phase 3: Project Management**
11. Project creation/listing
12. Lead management
13. Stats dashboard
14. Export history

### **Phase 4: Hot Sheet System**
15. Hot Sheet HTML generator
16. Hot Sheet public URLs
17. Hot Sheet lookup API
18. Hot Sheet analytics

### **Phase 5: Chrome Extension**
19. ReadyMode page monitor
20. Call detection + phone extraction
21. Auto-popup Hot Sheet
22. Manual lookup form

### **Phase 6: Polish**
23. User authentication
24. Bulk import (1000+ leads)
25. Background job queue
26. Error handling + retry

---

## 🔍 LOCAL KEYWORD DETECTION

**Database:** `/data/us_cities_lookup.json` (29,880 US cities)

**Detection Logic:**
1. Check for state full names: "north carolina", "texas"
2. Check for state abbreviations: "nc", "tx"
3. Check for ZIP codes: "27407", "90210-1234"
4. Check city database (1-word, 2-word, 3-word combinations)
5. **Exclude:** "near me", "local", "city", "nearby"

---

## 🧮 CTR (Click-Through Rate) LOOKUP

| Rank | CTR | Use Case |
|------|-----|----------|
| 1 | 39.8% | Position #1 |
| 2 | 18.7% | Position #2 |
| 3 | 10.2% | Position #3 |
| 4-10 | 7.9% avg | Page 1 bottom |
| 11-20 | 2% | Page 2 |
| 21-75 | 1% | Pages 3-8 |

**Usage:** When `seoClicks` is null, calculate as `searchVolume × CTR`

---

## 📁 CRITICAL FILES IN REPO

1. **RANKING_NUGGETS_SPEC.md** - Complete 32-row specification with formulas
2. **API_DOCUMENTATION.md** - All 4 APIs with examples
3. **DATABASE_SCHEMA.md** - Full D1 schema with indexes
4. **ARCHITECTURE.md** - System architecture diagram
5. **IMPLEMENTATION_PHASES.md** - Detailed build phases
6. **/data/us_cities_lookup.json** - 29,880 cities database
7. **/src/** - All source code files

---

## 🚀 HOW TO RESUME WORK

### **Step 1: Clone Repository**
```bash
cd /home/user/webapp
git clone https://github.com/[YOUR-USERNAME]/spyfu-lead-intelligence .
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Set Up Database**
```bash
# Create D1 database
npx wrangler d1 create spyfu-lead-intelligence

# Apply schema
npx wrangler d1 execute spyfu-lead-intelligence --file=src/db/schema.sql --local
```

### **Step 4: Review Current Status**
Check the latest commit message to see where we left off:
```bash
git log --oneline -5
```

### **Step 5: Continue Building**
Ask the AI:
> "What's the current implementation status? What should I work on next?"

---

## 🧪 TEST DATA AVAILABLE

**Location:** `/data/master_test_results.json` (3.0MB)

Contains complete API responses for 19 domains including:
- rhmd.com (plastic surgery)
- salemplasticsurgery.com
- alignwc.com (4,715 keywords)
- painreliefkc.com
- And 15 more...

**Use this data** for testing without making real API calls during development.

---

## ⚠️ CRITICAL REMINDERS

1. **Nugget Order:** MUST follow exact order from row 1-32 (see above)
2. **Character Limits:** Title ≤20, Data ≤40 (STRICT)
3. **Rate Limiting:** 1-second delay between API calls
4. **Cost Tracking:** Log API costs per domain and total
5. **Local Detection:** Use cities database, exclude generic terms
6. **D1 Storage:** Store ALL raw API data as JSON for reuse

---

## 📞 CONTACT & NOTES

**Project Owner:** [YOUR NAME/EMAIL]  
**Started:** 2025-10-26  
**Current Phase:** Phase 1 (Core Data Engine)  
**GitHub:** https://github.com/[YOUR-USERNAME]/spyfu-lead-intelligence

---

## 🎯 SUCCESS CRITERIA

**Phase 1 Complete When:**
- ✅ Can upload CSV with various formats
- ✅ Fetches all 4 SpyFu APIs for each domain
- ✅ Calculates all 32 nuggets correctly
- ✅ Stores everything in D1 database
- ✅ Can export ReadyMode CSV with nuggets

**Test Case:**
- Upload CSV with rhmd.com
- Verify nugget_01_snapshot = `2,496 KWs | $8,281 | 888 Clicks |36A`
- Verify nugget_09_topcpckw = `tummy tuck beverly hills|#22|$9.8`
- Verify all 32 nuggets present and ≤40 chars

---

**Last Updated:** [CURRENT DATE]  
**Version:** 1.0  
**Status:** Ready for implementation

---

## 📝 RECOVERY CHECKLIST

When starting a new chat, the AI should:
- [ ] Read this entire file
- [ ] Clone the GitHub repository
- [ ] Review RANKING_NUGGETS_SPEC.md
- [ ] Review API_DOCUMENTATION.md
- [ ] Review DATABASE_SCHEMA.md
- [ ] Check current git branch and status
- [ ] Ask user: "What phase are we on? What's the current status?"
- [ ] Continue from last commit

**This document contains EVERYTHING needed to recover the project. Keep it updated!**
