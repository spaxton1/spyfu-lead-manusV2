# 🤖 AI HANDOFF PROMPT
## Complete Context for Another AI to Build This Project

**Copy and paste this entire prompt to another AI assistant to continue building the SpyFu Lead Intelligence Platform.**

---

## 📌 INITIAL INSTRUCTIONS (Copy This First)

```
I need you to build a SpyFu Lead Intelligence Platform. This is a COMPLETE project with all specifications already documented. Your job is to implement the code.

GitHub Repository (BACKUP): https://github.com/spaxton1/spyfu-lead-manusV2
Primary Repository: https://github.com/spaxton1/spyfu-lead-intelligence

Please:
1. Clone the backup repository to your workspace
2. Read COMPLETE_PROJECT_PROMPT.md first (master recovery document)
3. Read README.md for project overview
4. Read IMPLEMENTATION_PHASES.md for what to build
5. Start implementing Phase 1: Core Data Engine

I will guide you through the implementation. Let's start with Phase 1.
```

---

## 🎯 PROJECT SUMMARY

### **What This Is:**
A **batch CSV enhancement tool** for sales teams that:
1. Uploads CSV files with lead lists (domains, companies, contacts)
2. Fetches SEO data from 4 SpyFu APIs for each domain
3. Calculates 32 "Ranking Nuggets" (pre-formatted SEO metrics)
4. Stores everything in Cloudflare D1 database
5. Exports multiple CSV formats (ReadyMode, Mail, Full Data, Custom)
6. Generates HTML "Hot Sheets" with expanded prospect data
7. Chrome extension auto-popups Hot Sheets during ReadyMode calls

### **CRITICAL: This is NOT Real-Time**
The user explicitly stated: "We don't pull from the API when a call comes in! That would be slow and ineffective."

This is a **batch processing system**:
- Upload CSV → Fetch all APIs → Calculate nuggets → Store in database
- Export/Hot Sheets display pre-calculated data instantly
- Chrome extension just looks up existing data by phone number

---

## 📊 THE 32 RANKING NUGGETS (EXACT ORDER)

**CRITICAL:** These MUST be in this exact order. The order was just corrected.

### **Above-Fold (15 rows):**
1. **Snapshot** - `2,496 KWs | $8,281 | 888 Clicks |36A`
2. **Page 1** - `233/9.3% | 30 #1 | 219 T3 | 14 4-10`
3. **Page 2** - `32 KWs | 1234 Clicks | $3.2K | 91% Pg2+`
4. **Quick Wins** - `16@11-15 | 22 $KWs | $52 TopCPC | 1355 Clicks`
5. **Historical Trend** - `-80 KWs | -3.4K Val | -74 Clicks | +1A`
6. **Local KW L1** - `plastic surgery NC|#14|$8.7`
7. **Local KW L2** - `coolsculpting greensboro|#28|$7`
8. **KW Traffic** - `113 L1|40 L2|223 CPC|455 Traf`
9. **Top CPC KW** - `tummy tuck beverly hills|#22|$9.8`
10. **Top Traffic KW** - `jawline surgery men|#10|13 Clicks`
11. **Competitor 1** - `skinsurg.net|14,929 KWs|$56K`
12. **Competitor 2** - `winstonderm.com|11,660 KWs|$42K`
13. **Competitor Ranks** - `plastic NC|#1 C1|#2 C2` ← **Important: This is position 13!**
14. **Competitor 3** - `salemplastic.com|8,000 KWs|$30K`
15. **Competitor 4** - `piedmontplast.com|6,000 KWs|$20K`

### **Below-Fold (17 rows):**
16. **Comp Hot Buttons** - `KWs +498%|$48K|Clicks +1161%`
17. **Client 1 Mo** - `2,496 KWs|$8K|888 Clicks|36Au`
18. **Client 2 Mo** - `2,516 KWs|$9K|908 Clicks|36Au`
19. **Client 3 Mo** - `2,536 KWs|$9K|928 Clicks|36Au`
20. **Client 4 Mo** - `2,576 KWs|$11K|962 Clicks|35Au`
21. **Local KW L3** - `charleston surgery|$7.3|#10|73mo`
22. **Local KW L4** - `greensboro botox|$6.5|#35|100mo`
23. **Local KW L5** - `raleigh lipo|$5.8|#50|80mo`
24. **LowHang1** - `jawline surgery men|$7.3|#10|73mo`
25. **LowHang2** - `buttock lift|$7.9|#12|150mo`
26. **LowHang3** - `liposuction cost|$8.5|#15|200mo`
27. **LowHang4** - `chin implant cost|$8.2|#9|210mo`
28. **LowHang5** - `facelift surgery|$7|#20|180mo`
29. **Money KW2** - `blepharoplasty recovery|$6.9|#8|180mo`
30. **Money KW3** - `tummy tuck recovery|$6.8|#25|160mo`
31. **Money KW4** - `rhinoplasty cost|$6.5|#30|140mo`
32. **Money KW5** - `breast augmentation|$6.2|#40|120mo`

**Format Constraints:**
- Title: ≤20 characters
- Data: ≤40 characters
- Pipe-separated, no spaces around pipes
- Numbers: Exact integers (2,496 not ~2,500)
- Use K suffix for thousands ($8.3K)

---

## 🔌 SPYFU API DETAILS

### **API Key:**
```
MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ
```

### **The 4 APIs:**

**API #1: Domain Trends (4-Month History)**
- Endpoint: `getLatestDomainStats?domain=X&pastNMonths=4`
- Cost: $0.002 per domain
- Used for: Nuggets 1, 5, 17-20

**API #2: Page 1 Keywords (Ranks 1-10)**
- Endpoint: `getSeoKeywords?query=X&rank.min=1&rank.max=10`
- Cost: $0.00-0.27 (varies)
- Used for: Nuggets 2-4, 6-10, 21-28
- Note: Also call with rank.min=11&rank.max=20 for Page 2 data

**API #3: Money Keywords (Ranks 11-75, High CPC)**
- Endpoint: `getMostValuableKeywords?query=X&rank.min=11&rank.max=75`
- Cost: $0.013 per domain
- Used for: Nuggets 3, 16, 29-32

**API #4: SERP Competitors**
- Endpoint: `getSerpAnalysisKeywords?Keyword={keyword}&pageSize=10`
- Cost: $0.021 per domain
- Used for: Nuggets 11-15
- Strategy: Use top 3 keywords from API #2

### **Pricing Tiers:**
- **Minimal:** $0.002/lead (API #1 only)
- **Partial:** $0.15/lead (APIs #1-3)
- **Full:** $0.17/lead (All 4 APIs)

### **Rate Limiting:**
- 120 requests per minute
- Use 500ms delay between requests
- Retry logic: 3 attempts with exponential backoff

---

## 💾 DATABASE SCHEMA (Cloudflare D1)

### **5 Tables:**

**1. projects**
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  api_tier TEXT CHECK (api_tier IN ('full', 'partial', 'minimal')),
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  total_leads INTEGER DEFAULT 0,
  processed_leads INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**2. leads**
```sql
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  domain TEXT NOT NULL,
  company TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  UNIQUE(project_id, domain)
);
```

**3. spyfu_data** (Data Warehouse)
```sql
CREATE TABLE spyfu_data (
  id TEXT PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  api_1_trends TEXT, -- JSON
  api_2_page1 TEXT,  -- JSON
  api_3_money TEXT,  -- JSON
  api_4_competitors TEXT, -- JSON
  tier_used TEXT,
  fetched_at DATETIME,
  error_message TEXT
);
```

**4. ranking_nuggets**
```sql
CREATE TABLE ranking_nuggets (
  id TEXT PRIMARY KEY,
  lead_id TEXT REFERENCES leads(id),
  nugget_1_snapshot TEXT,
  nugget_2_page1 TEXT,
  -- ... all 32 nuggets ...
  nugget_32_money_kw_5 TEXT,
  calculated_at DATETIME,
  UNIQUE(lead_id)
);
```

**5. exports**
```sql
CREATE TABLE exports (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  export_type TEXT CHECK (export_type IN ('readymode', 'mail', 'full', 'custom', 'hotsheet')),
  filename TEXT,
  download_url TEXT,
  config TEXT, -- JSON for custom exports
  created_at DATETIME
);
```

---

## 🏗️ IMPLEMENTATION PHASES

### **Phase 1: Core Data Engine (START HERE)**

**What to Build:**
1. **CSV Smart Parser** (`src/utils/csv-parser.ts`)
   - Detect fields regardless of column order
   - Accept variations: "Website"/"Domain"/"URL" for domain field
   - Accept variations: "Company"/"Business" for company field
   - Validate domains (no localhost/IPs)

2. **SpyFu API Client** (`src/services/spyfu-api.ts`)
   - Implement all 4 API endpoints
   - Rate limiting: 120 req/min with 500ms delays
   - Retry logic: 3 attempts with exponential backoff
   - Store raw responses in `spyfu_data` table as JSON

3. **Ranking Nuggets Calculator** (`src/services/nugget-calculator.ts`)
   - Implement all 32 formulas in exact order
   - Use `us_cities_lookup.json` for local keyword detection (29,880 cities)
   - CTR lookup table for click estimates
   - Peak decline algorithm for historical trend
   - Character limit enforcement (title ≤20, data ≤40)

4. **Database Integration**
   - Run migrations: `npm run db:migrate:local`
   - Seed test data: `npm run db:seed`
   - Implement CRUD operations

5. **Basic Upload UI**
   - CSV file upload form
   - Project name + tier selection
   - Processing status display
   - Progress tracking

**Test Data Available:**
- `master_test_results.json` (3MB) - 19 domains with real API responses
- `us_cities_lookup.json` (500KB) - 29,880 US cities
- `seed.sql` - Test database fixtures

### **Phase 2: Export Engine**
- ReadyMode CSV (32 nugget columns)
- Mail CSV (contact info only)
- Full Data CSV (all raw + calculated)
- Custom CSV (user-selected columns)

### **Phase 3: Project Management UI**
- Project list view
- Lead list with filtering
- Re-fetch failed leads

### **Phase 4: Hot Sheet System**
- HTML generator (expand nuggets into tables)
- Public URLs: `/hotsheet/{lead_id}`
- Phone lookup API for Chrome extension

### **Phase 5: Chrome Extension**
- Monitor ReadyMode DOM for phone numbers
- Call lookup API when call detected
- Auto-open Hot Sheet in new window

### **Phase 6: Polish & Deployment**
- Production deployment to Cloudflare Pages
- Error monitoring
- Background job queue

---

## 📁 PROJECT STRUCTURE

```
webapp/
├── src/
│   ├── index.tsx              # Hono app entry point
│   ├── routes/                # API route handlers
│   │   ├── api.ts            # Upload, projects
│   │   ├── exports.ts        # CSV generation
│   │   └── hotsheets.ts      # Hot Sheet HTML
│   ├── services/
│   │   ├── spyfu-api.ts      # SpyFu API client
│   │   ├── nugget-calculator.ts # 32 nuggets logic
│   │   └── export-service.ts # CSV generators
│   ├── utils/
│   │   ├── csv-parser.ts     # Smart CSV parsing
│   │   ├── db.ts             # Database helpers
│   │   └── formatting.ts     # Number/text formatting
│   └── views/                # JSX templates
├── migrations/
│   └── 0001_initial_schema.sql
├── public/static/            # Static assets
├── test/                     # Unit tests
├── chrome-extension/         # Browser extension
├── package.json
├── tsconfig.json
├── vite.config.ts
├── wrangler.jsonc            # Cloudflare config
└── [11 documentation files]
```

---

## 🔑 KEY ALGORITHMS

### **Local Keyword Detection:**
```javascript
function isLocalKeyword(keyword) {
  const cities = loadCitiesData(); // 29,880 US cities
  const lower = keyword.toLowerCase();
  
  // Check if contains any city name
  const hasCity = cities.some(city => 
    lower.includes(city.name.toLowerCase())
  );
  
  // Check if contains state
  const hasState = US_STATES.some(state => 
    lower.includes(state.name.toLowerCase()) || 
    lower.includes(state.abbr.toLowerCase())
  );
  
  return hasCity || hasState;
}
```

### **Peak Decline Calculation:**
```javascript
function calculatePeakDecline(months) {
  // months[0] = current, months[1-3] = previous 3
  const current = months[0].TotalOrganicKeywords;
  const peak = Math.max(...months.slice(1, 4).map(m => m.TotalOrganicKeywords));
  const decline = ((peak - current) / peak) * 100;
  
  return decline > 0 
    ? `↓${decline.toFixed(1)}%` 
    : `↑${Math.abs(decline).toFixed(1)}%`;
}
```

### **CTR Lookup Table:**
```javascript
const CTR_BY_POSITION = {
  1: 0.398,  // 39.8%
  2: 0.187,  // 18.7%
  3: 0.102,  // 10.2%
  4: 0.072,
  5: 0.051,
  6: 0.044,
  7: 0.030,
  8: 0.021,
  9: 0.019,
  10: 0.016
};
```

---

## 🚨 CRITICAL REQUIREMENTS

### **1. Character Limits (STRICT)**
- Nugget titles: ≤20 characters
- Nugget data: ≤40 characters
- Truncate with ellipsis if needed
- ReadyMode CSV has cell size limits

### **2. Order Matters**
- The 32 nuggets MUST be in exact order
- Position 13 is Competitor Ranks (not Competitor 3)
- Order: Comp 1, 2, Ranks, 3, 4

### **3. Data Warehouse Pattern**
- Store ALL raw API responses in `spyfu_data` as JSON
- Separate calculated nuggets in `ranking_nuggets` table
- Never re-fetch if domain already exists
- Reuse data across multiple projects

### **4. Batch Processing**
- NOT real-time - process entire CSV before calls
- Show progress: "Processing 45 of 500 leads..."
- Handle API failures gracefully (retry 3x)
- Store partial data if some APIs fail

### **5. Number Formatting**
- Exact integers for credibility (2,496 not ~2,500)
- Use K suffix: $8,281 → $8.3K
- Round intelligently: 47.2K not 47,200
- Keep exact if fits in 40 chars

---

## 📚 DOCUMENTATION FILES (Read These)

1. **COMPLETE_PROJECT_PROMPT.md** - Master recovery document (11.5 KB)
2. **README.md** - Project overview (8.5 KB)
3. **ARCHITECTURE.md** - System design and data flow (23 KB)
4. **DATABASE_SCHEMA.md** - Complete D1 schema (21.6 KB)
5. **API_DOCUMENTATION.md** - All 4 SpyFu APIs (18 KB)
6. **IMPLEMENTATION_PHASES.md** - 6-phase build plan (27.9 KB)
7. **RANKING_NUGGETS_SPEC.md** - All 32 formulas (updated with correct order)
8. **STATUS.md** - Current project status
9. **SPYFU_DATA_CATALOG.md** - API response field dictionary
10. **IMPLEMENTATION_ROADMAP.md** - Timeline and priorities
11. **API_QUICK_REFERENCE.md** - One-page API summary

---

## 🎯 FIRST STEPS FOR AI

1. **Clone Repository:**
   ```bash
   git clone https://github.com/spaxton1/spyfu-lead-manusV2.git
   cd spyfu-lead-manusV2
   ```

2. **Read Documentation (in order):**
   - COMPLETE_PROJECT_PROMPT.md
   - IMPLEMENTATION_PHASES.md
   - RANKING_NUGGETS_SPEC.md

3. **Setup Development:**
   ```bash
   npm install
   npm run db:migrate:local
   npm run db:seed
   ```

4. **Start with Phase 1, Task 1:**
   Build `src/utils/csv-parser.ts` first
   
   Test cases:
   - CSV with "Website" column → maps to domain
   - CSV with "Domain" column → maps to domain
   - CSV with "Company" column → maps to company
   - Validate domains (reject localhost/IPs)

5. **Ask Questions:**
   - "Should I proceed with building the CSV parser?"
   - "Do you want me to implement all field variations?"
   - "Should I validate email addresses?"

---

## ⚠️ COMMON PITFALLS TO AVOID

1. **DON'T make it real-time** - It's batch processing!
2. **DON'T skip character limits** - ReadyMode has hard limits
3. **DON'T change nugget order** - It must match exactly
4. **DON'T re-fetch existing domains** - Check spyfu_data first
5. **DON'T use Node.js file system** - Cloudflare Workers don't support it
6. **DON'T forget rate limiting** - SpyFu has 120 req/min limit
7. **DON'T hardcode values** - Use environment variables

---

## ✅ SUCCESS CRITERIA (Phase 1)

**You'll know Phase 1 is complete when:**
- ✅ Can upload CSV with any column order
- ✅ All 4 SpyFu APIs fetch successfully
- ✅ All 32 nuggets calculate correctly
- ✅ Data stored in D1 database
- ✅ Processing status shows progress
- ✅ Test with `master_test_results.json` produces correct output

**Test Command:**
```bash
# Upload test CSV
curl -X POST http://localhost:3000/api/upload \
  -F "csv_file=@test_leads.csv" \
  -F "project_name=Test Project" \
  -F "api_tier=full"

# Check status
curl http://localhost:3000/api/projects/{project_id}/status
```

---

## 💡 TIPS FOR AI IMPLEMENTATION

1. **Start Small:** Build CSV parser first, test it thoroughly before moving on
2. **Use Test Data:** `master_test_results.json` has real API responses - use them!
3. **Test Incrementally:** Test each nugget calculation individually
4. **Check Order:** Always verify nugget order matches specification
5. **Handle Errors:** API failures are common - implement robust error handling
6. **Log Everything:** Detailed logging helps debug issues
7. **Ask for Clarification:** If anything is unclear, ask the user

---

## 🔗 IMPORTANT LINKS

- **Primary Repository:** https://github.com/spaxton1/spyfu-lead-intelligence
- **Backup Repository:** https://github.com/spaxton1/spyfu-lead-manusV2
- **Project Backup (tar.gz):** Available in project (5.4 MB)

---

## 📞 COMMUNICATION GUIDE

**When starting work, say:**
> "I've cloned the repository and read the documentation. I understand this is a batch CSV enhancement tool that calculates 32 Ranking Nuggets from SpyFu API data. I'll start with Phase 1: building the CSV parser. Should I proceed?"

**When you complete a task, say:**
> "I've completed the CSV parser. It handles column order variations and validates domains. I've tested it with sample data. Should I proceed to building the SpyFu API client?"

**When you hit a blocker, say:**
> "I need clarification on the Peak Decline algorithm. Should I compare to the max of the previous 3 months or the average? The documentation shows max but I want to confirm."

---

## 🎓 LEARNING RESOURCES

- **Hono Docs:** https://hono.dev/
- **Cloudflare D1:** https://developers.cloudflare.com/d1/
- **SpyFu API:** https://www.spyfu.com/apis/
- **Vite:** https://vitejs.dev/

---

## 🎉 FINAL CHECKLIST

Before you start coding, verify:
- ✅ Cloned backup repository
- ✅ Read COMPLETE_PROJECT_PROMPT.md
- ✅ Understand it's batch processing (NOT real-time)
- ✅ Know the 32 nuggets in exact order
- ✅ Have SpyFu API key
- ✅ Understand data warehouse pattern
- ✅ Ready to start Phase 1

---

**Generated:** January 2025  
**For:** Backup AI Implementation  
**Project:** SpyFu Lead Intelligence Platform  
**Status:** Ready for Phase 1 Implementation
