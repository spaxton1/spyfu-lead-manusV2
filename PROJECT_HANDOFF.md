# SpyFu CSV Enhancement Tool - Complete Project Handoff

**Purpose:** This document contains EVERYTHING needed to rebuild this project in a new chat session with zero memory of this conversation.

---

## 🎯 Project Goal

Build a **CSV Lead Enhancement Tool** that:
1. Takes a CSV file with domain names (lead list)
2. Calls SpyFu APIs to get SEO data for each domain
3. Outputs an enhanced CSV with 15 key fields above-the-fold + additional data below
4. Pre-processes data BEFORE sales calls (not during calls)

---

## 🔑 API Credentials

**SpyFu API Key:** `MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ`

**Authorization Header Format:**
```javascript
const AUTH_HEADER = 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ';
```

**Base URLs:**
- Domain Stats: `https://api.spyfu.com/apis/domain_stats_api/v2/`
- SERP API: `https://api.spyfu.com/apis/serp_api/v2/`

---

## 📊 4 Available APIs

### API #1: Domain Trends (4-Month History)
**Endpoint:** `getLatestDomainStats?domain={domain}&pastNMonths=4`  
**Cost:** $0.0020 per domain  
**Returns:** 4 months of historical data (keywords, value, clicks, authority)

### API #2: Page 1 Keywords (Rank 1-10)
**Endpoint:** `seo/getSeoKeywords?query={domain}&searchType=MostValuable&rank.min=1&rank.max=10&costPerClickOption=Exact&pageSize=1000&sortBy=Rank`  
**Cost:** $0.00-0.27 per domain (varies by keyword count)  
**Returns:** All keywords ranking positions 1-10 with CPC and volume

### API #3: Money Keywords (Rank 11-75, High CPC)
**Endpoint:** `seo/getMostValuableKeywords?query={domain}&searchVolume.min=10&searchVolume.max=50000&rank.min=11&rank.max=75&costPerClick.min=1&costPerClick.max=1000&costPerClickOption=Exact&pageSize=500&sortBy=ExactCostPerClick`  
**Cost:** $0.0133 per domain  
**Returns:** High-value keywords on pages 2-8 sorted by CPC

### API #4: SERP Competitors (OPTIONAL)
**Endpoint:** `seo/getSerpAnalysisKeywords?Keyword={keyword}&pageSize=10`  
**Cost:** $0.0210 per domain  
**Returns:** Top 10 competitors + their domain stats

---

## 💰 Cost Structure

| Package | APIs | Cost/Lead | What's Included |
|---------|------|-----------|-----------------|
| Minimal | #1 only | $0.0020 | Just trends |
| Basic | #1, #2, #3 | $0.15 avg | Full SEO data (no competitors) |
| Full | #1, #2, #3, #4 | $0.17 avg | Everything including competitors |

**User's Budget:** $0.10-0.12 per lead  
**Reality:** Slightly over budget but comprehensive

---

## 📁 Essential Files (Already in /home/user/webapp/)

1. **API_QUICK_REFERENCE.md** - One-page API summary
2. **SPYFU_DATA_CATALOG.md** - Full data dictionary with samples
3. **Page1_API_Data.md** - Original specifications
4. **master_test_results.json** - Raw API responses from 19 domains (3.0MB)
5. **master_report_summary.json** - Processed analysis results
6. **competitor_summary.md** - Competitor analysis examples
7. **us_cities_lookup.json** - 29,880 US cities for local keyword detection
8. **competitor_analysis.js** - Working script example

---

## 🎯 User Requirements (**UPDATED - NOW DEFINED**)

### ✅ **RANKING NUGGETS SPECIFICATION - COMPLETE**

User has created a **32-row "Ranking Nuggets" format** for ReadyMode call center integration.

**Key Details:**
- **Above-the-fold:** 15 rows (visible immediately)
- **Below-the-fold:** 17 rows (scrollable)
- **Title column:** ≤20 characters
- **Data column:** ≤40 characters
- **Format:** Pipe-separated (`|`), no spaces, exact numbers for credibility

**Complete specification in:** `/home/user/webapp/RANKING_NUGGETS_SPEC.md`

**The 32 Nuggets:**
1. Snapshot - Current performance summary
2. Page 1 - Page 1 keyword breakdown
3. Page 2 - Page 2 performance
4. Quick Wins - Optimization targets
5. Historical Trend - Peak decline analysis
6-8. Local KW L1-L3 - Top local keywords
9. KW Traffic - Traffic for top keywords
10-11. Top CPC/Traffic KW - Best individual keywords
12-15. Competitors 1-4 - Top competitors
16. Comp Hot Buttons - Competitive gaps
17. Competitor Ranks - SERP positions
18-21. Client 1-4 Mo - 4-month historical
22-26. LowHang1-5 - Low-hanging fruit
27-29. Local KW L4-L5, Money KW2-3 - Additional opportunities
30-32. LowHang4-5, Money KW4-5 - More targets

### ✅ Questions Already Answered:

1. **Which fields above-the-fold?** ✅ 15 specific rows defined (see RANKING_NUGGETS_SPEC.md)
2. **Input CSV format?** ✅ Standard: `domain,company_name,contact_name,phone`
3. **Output CSV format?** ✅ Exact format specified with examples
4. **Include competitors?** ✅ YES - Required for rows 12-17
5. **Error handling?** ✅ Show "No SEO data" or "No local KWs found"

### 🎯 Additional Use Cases Identified:

Beyond Ranking Nuggets, user needs data for:
1. **ReadyMode Dynamic Script** - Data insertion into call scripts
2. **Prospect Hot Sheet** - Expanded HTML view (all data organized)
3. **Mailers** - Custom data fields for mail merge

**Priority:** Build Ranking Nuggets first (primary use case)

---

## 🔧 Technical Architecture

### Input:
```csv
domain
rhmd.com
salemplasticsurgery.com
alignwc.com
```

### Process:
1. Read CSV file
2. For each domain:
   - Call API #1 (trends)
   - Call API #2 (page 1 keywords)
   - Call API #3 (money keywords)
   - Optionally call API #4 (competitors)
   - Calculate derived metrics
   - Add 1-second delay between domains
3. Build enhanced CSV with selected fields

### Output:
```csv
Domain,TotalKWs,MonthlyValue,MonthlyClicks,Authority,PeakDecline,Page1KWs,Pos1Count,TopMoneyKW,...
rhmd.com,2496,8281,888,36,"Lost $3159 in 2mo",233,30,"tummy tuck | $9.75 | #22",...
```

---

## 📋 26 Available Fields for CSV

### Domain Overview (6):
1. Domain Name
2. Total Keywords Ranking
3. Monthly Organic Value ($)
4. Monthly Organic Clicks
5. Domain Authority
6. Average Rank

### Trend Signals (4):
7. Peak Value Decline
8. Keyword Change (+/-)
9. Click Change (+/-)
10. Trend Direction (↑↓→)

### Page 1 Performance (5):
11. Page 1 Keywords (count)
12. Position #1 Count
13. Top 3 Count
14. Page 1 Percentage
15. Avg Page 1 CPC

### Top Opportunities (3):
16. Top Money Keyword (formatted)
17. Top Local Keyword (formatted)
18. Best Low-Hanging Fruit (formatted)

### PPC Data (3):
19. Monthly PPC Budget
20. PPC Clicks
21. PPC Keywords

### Competitor Intel (5) - OPTIONAL:
22. Top Competitor
23. Authority Gap
24. Traffic Gap ($)
25. Competitor Count
26. Your SERP Position

---

## 🧮 Key Calculated Metrics

### Peak Decline Algorithm:
```javascript
const months = domainData.trends; // [oldest, 2mo, 1mo, current]
const thisMonth = months[3];
const previousMonths = months.slice(0, 3);

const peakValue = Math.max(...previousMonths.map(m => m.monthlyOrganicValue));
const valueDecline = peakValue - thisMonth.monthlyOrganicValue;
const monthsAgo = findMonthsAgo(peakValue, previousMonths);

// Output: "Lost $3,159 in 2 months"
```

### Local Keyword Detection:
- 29,880 US cities database
- 50 US states (full names + abbreviations)
- ZIP codes (5-digit and ZIP+4)
- Geographic descriptors ("north shore", "east side")
- **Excludes:** "near me", "local", "city", "nearby"

### Low-Hanging Fruit:
```javascript
// Filter: High CPC keywords NOT at position #1
const lowHanging = page1Keywords
  .filter(kw => kw.rank !== 1 && kw.cpc > 5)
  .sort((a, b) => b.cpc - a.cpc)
  .slice(0, 10);
```

---

## 🔍 Local Keyword Detection Details

**29,880 Cities Database:** `/home/user/webapp/us_cities_lookup.json`

**Format:**
```json
{
  "cities": {
    "winston salem": true,
    "greensboro": true,
    "charlotte": true,
    "spokane": true
  }
}
```

**Detection Logic:**
1. Check for state full names: "north carolina", "texas"
2. Check for state abbreviations: "nc", "tx"
3. Check for ZIP codes: "27407", "90210-1234"
4. Check for geographic descriptors: "north shore", "east side"
5. Check city database (1-word, 2-word, 3-word combinations)
6. Exclude generic terms: "near me", "local"

---

## 🚨 Important Constraints

1. **Rate Limiting:** Add 1-second delay between domain API calls
2. **Character Limits:** Display fields should be ≤40 characters
3. **Cost Tracking:** Log API costs per domain and total
4. **Error Handling:** Some domains may have zero keywords
5. **Filtering:** Remove social media and directories from competitor analysis

**Excluded Domains for Competitors:**
- Social: Facebook, Instagram, LinkedIn, Twitter, YouTube
- Directories: Yelp, YellowPages, Healthgrades, Zocdoc
- Generic: WebMD, Healthline, Mayo Clinic, Wikipedia

---

## 🧪 Test Data Available

**19 Domains Already Tested:**
- rhmd.com (plastic surgery)
- salemplasticsurgery.com (plastic surgery)
- alignwc.com (chiropractic, 4,715 keywords)
- painreliefkc.com (pain relief)
- aestheticinstitute.ie (aesthetics)
- infinityspine.com (spine care)
- axiominjury.com (injury law/chiro)
- ...and 12 more

**Test Results:** `/home/user/webapp/master_test_results.json` (3.0MB)

**Test Cost:** $1.66 for 19 domains = $0.0873 average per domain

---

## 🛠️ Tech Stack

- **Language:** Node.js (JavaScript)
- **APIs:** SpyFu API v2 (RESTful)
- **Input:** CSV file
- **Output:** Enhanced CSV file
- **Dependencies:** 
  - `fs` (file system)
  - `fetch` (API calls - built into Node 18+)
  - CSV parsing library (to be determined)

---

## 📝 Example Working Script Reference

See `/home/user/webapp/competitor_analysis.js` for:
- API authentication
- Rate limiting (1-second delays)
- Error handling
- Data filtering
- JSON output formatting

---

## 🎬 Next Steps for New Chat

1. **Ask user:** Which 15 fields above-the-fold?
2. **Ask user:** Include competitors (API #4)?
3. **Ask user:** Input CSV format?
4. **Ask user:** Output formatting preferences?
5. **Build:** CSV enhancement script
6. **Test:** Run on sample domains
7. **Deliver:** Enhanced CSV + cost report

---

## 📞 User's Use Case

**Context:** SEO lead generation for cold calling  
**Problem:** Need to enrich lead list with SpyFu data BEFORE calls  
**Solution:** Batch process CSV with domain names, add SEO intelligence  
**Goal:** Sales team sees top 15 metrics above-the-fold when calling  

**NOT a real-time system** - This is a batch processing tool that runs once per lead list upload.

---

## 📊 Sample Enhanced CSV Row

```csv
Domain,TotalKWs,MonthlyValue,MonthlyClicks,Authority,PeakDecline,KWChange,ClickChange,Page1KWs,Pos1,Top3,Page1Pct,TopMoneyKW,TopLocalKW,LowHang
rhmd.com,2496,8281,888,36,"Lost $3159 in 2mo",-40,-37,233,30,219,9.3%,"tummy tuck | $9.75 | #22","surgery NC | $8.65 | #14","buttock lift | $7.93 | #10"
```

---

**Files Location:** `/home/user/webapp/`  
**Project Status:** Requirements gathering complete, ready to build  
**Last Updated:** 2025-10-26  
**Session Context:** User is ready to start new chat and build the tool
