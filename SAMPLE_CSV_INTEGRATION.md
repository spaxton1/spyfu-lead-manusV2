# 📁 Sample CSV Integration Summary

## What Was Added

### **1. SampleLeads-35.csv** (36 Real Leads)
- **Location:** Repository root
- **Size:** 11.6 KB
- **Purpose:** Real-world sample data for testing
- **Industries:** Building materials, retail, construction, medical, environmental services

**Key Observations:**
- 36 leads with actual company websites
- 22 CSV columns (many optional)
- Website field is at column 15 (in this sample)
- Multiple phone number variations
- Some leads have missing data (realistic scenario)

---

## CSV Structure Details

### **Column Layout (22 fields)**
```
1.  First Name
2.  Last Name
3.  Title
4.  Company Name
5.  Email
6.  Email Status
7.  Work Direct Phone
8.  Home Phone
9.  Mobile Phone
10. Corporate Phone
11. Other Phone
12. # Employees
13. Industry
14. Person Linkedin Url  ← NOT a company website!
15. Website             ← THIS is the field we need
16. City
17. State
18. Company Address
19. Company City
20. Company Phone
21. Annual Revenue
22. Secondary Email
```

### **Sample Data (First 3 Leads)**

**Lead 1: Building Materials**
- Domain: `affinitystone.com`
- Company: Affinity Stone
- Contact: Dave Witbeck (Owner)
- Location: Arthur, Illinois
- Employees: 4
- Revenue: $41.9M

**Lead 2: Retail (Flooring)**
- Domain: `totalflooringinc.com`
- Company: Total Flooring Inc.
- Contact: Dave Lee (Owner)
- Location: Centreville, Virginia
- Employees: 17
- Revenue: $1.5M

**Lead 3: Building Materials**
- Domain: `atlantic-tile.com`
- Company: Atlantic Tile Distribution
- Contact: Anthony Bogo (Company Owner)
- Location: Melbourne, Florida
- Employees: 4

---

## Smart Website Detection

### **Problem to Solve**
Users upload CSVs in different formats:
- Different column names: `Website`, `Company Website`, `Domain`, `URL`
- Different column orders (position varies)
- Extra fields like `Person Linkedin Url` (should NOT be used)

### **Solution: Flexible Detection Algorithm**

```javascript
function detectWebsiteColumn(headers) {
  // 1. Try exact matches (case-insensitive)
  const exactMatches = [
    'website', 'domain', 'url', 'web site',
    'company website', 'company url', 'web address'
  ];
  
  // 2. Try partial matches (contains "website", "domain", "url")
  // 3. Exclude LinkedIn URLs (not company websites)
  // 4. Return first valid match
}
```

**Handles:**
- ✅ `Website` → Detected
- ✅ `Company Website` → Detected
- ✅ `website` (lowercase) → Detected
- ✅ `Domain` → Detected
- ✅ `URL` → Detected
- ❌ `Person Linkedin Url` → Skipped (not a company site)

---

## URL Cleaning and Validation

### **Problem to Solve**
URLs in CSVs vary:
- `https://affinitystone.com` (full URL)
- `www.totalflooringinc.com` (no protocol)
- `http://atlantic-tile.com` (HTTP instead of HTTPS)
- `http://www.linkedin.com/in/dave-witbeck` (LinkedIn profile - INVALID)

### **Solution: Normalize to Clean Domain**

```javascript
function cleanWebsiteUrl(url) {
  // 1. Skip LinkedIn URLs
  if (url.includes('linkedin.com')) return null;
  
  // 2. Add https:// if missing
  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }
  
  // 3. Parse URL and extract hostname
  const hostname = new URL(url).hostname;
  
  // 4. Remove www. prefix
  return hostname.replace(/^www\./, '');
}
```

**Output:**
- `https://affinitystone.com` → `affinitystone.com` ✓
- `www.totalflooringinc.com` → `totalflooringinc.com` ✓
- `http://atlantic-tile.com` → `atlantic-tile.com` ✓
- `linkedin.com/in/dave` → `null` (skipped) ✓

---

## Testing Strategy

### **API Credit Conservation** 🚨
- **36 domains × 4 APIs = 144 API calls = 144 credits**
- **DO NOT test with full CSV during development**
- **Use 2-3 domains maximum for testing**

### **Recommended Test Domains**

**Start with these 3 diverse domains:**
1. `affinitystone.com` - Small business (4 employees)
2. `westlakeplasticsurgery.com` - Medical practice (likely has local keywords)
3. `efclean.com` - Facilities services (may have location SEO)

### **Testing Phases**

**Phase 1: CSV Parsing (No API calls)**
```bash
npm run test:csv
# Tests: Website detection, URL cleaning, CSV parsing
# API Credits Used: 0
```

**Phase 2: Single Domain Test (4 API calls)**
```bash
npm run test:single -- affinitystone.com
# Tests: All 4 SpyFu APIs, data storage, nugget calculation
# API Credits Used: 4
```

**Phase 3: Small Batch Test (12 API calls)**
```bash
npm run test:batch
# Tests: 3 domains, batch processing, error handling
# API Credits Used: 12
```

**Phase 4: Full Test (144 API calls) - PRODUCTION ONLY**
```bash
npm run test:full
# Tests: All 36 domains from sample CSV
# API Credits Used: 144
# ⚠️ ONLY run when ready for production testing
```

---

## Implementation Checklist

### **CSV Parser (Phase 1)**
- [ ] Install PapaParse library (`npm install papaparse`)
- [ ] Implement `detectWebsiteColumn()` function
- [ ] Implement `cleanWebsiteUrl()` function
- [ ] Implement `parseLeadsCsv()` function
- [ ] Test with SampleLeads-35.csv (should parse 36 leads)

### **SpyFu API Client (Phase 1)**
- [ ] Create SpyFu API client with 4 API methods
- [ ] Test with `affinitystone.com` (1 domain = 4 credits)
- [ ] Implement error handling (invalid domains, timeouts)
- [ ] Store raw API responses in D1 database

### **Nugget Calculator (Phase 1)**
- [ ] Implement all 32 nugget calculation functions
- [ ] Test with real API data from affinitystone.com
- [ ] Validate character limits (title ≤20, data ≤40)
- [ ] Test local keyword detection with sample keywords

### **Database Integration (Phase 1)**
- [ ] Create D1 database tables
- [ ] Store API responses (api_responses table)
- [ ] Store calculated nuggets (ranking_nuggets table)
- [ ] Test retrieval and export

### **Batch Processing (Phase 1)**
- [ ] Process multiple domains sequentially
- [ ] Test with 3 domains (12 credits)
- [ ] Implement progress tracking
- [ ] Handle errors gracefully

---

## Quick Reference

### **File Locations**
- Sample CSV: `/home/user/webapp/SampleLeads-35.csv`
- Testing Plan: `/home/user/webapp/TESTING_PLAN.md`
- CSV Parsing Docs: `/home/user/webapp/AI_HANDOFF_PROMPT.md` (lines 99-208)
- Nugget Specs: `/home/user/webapp/RANKING_NUGGETS_SPEC.md`

### **GitHub Repositories**
- Primary: https://github.com/spaxton1/spyfu-lead-intelligence
- Backup: https://github.com/spaxton1/spyfu-lead-manusV2

### **Documentation Updated**
- ✅ AI_HANDOFF_PROMPT.md (added CSV parsing section)
- ✅ RANKING_NUGGETS_SPEC.md (added CSV input requirements)
- ✅ TESTING_PLAN.md (created comprehensive test strategy)
- ✅ SampleLeads-35.csv (added real sample data)
- ✅ SAMPLE_CSV_INTEGRATION.md (this file)

---

## Next Steps

1. **Review the sample CSV structure**
   - Open `SampleLeads-35.csv` and familiarize yourself with the data
   - Note the column names and data variations

2. **Study the testing plan**
   - Read `TESTING_PLAN.md` for detailed test scenarios
   - Understand the 3-domain testing strategy

3. **Begin Phase 1 implementation**
   - Start with CSV parsing (no API calls yet)
   - Test website detection with various header names
   - Validate URL cleaning logic

4. **Test with single domain first**
   - Use `affinitystone.com` for initial API testing
   - Only uses 4 API credits
   - Validates API integration before batch processing

5. **Scale to batch processing**
   - Test with 3 domains (12 credits)
   - Implement progress tracking
   - Handle errors gracefully

**Remember: Test smart, not hard. API credits are real!** 🎯
