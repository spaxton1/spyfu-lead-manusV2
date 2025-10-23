# Page 1 API Data - Documentation

## Overview
This document contains the API requests and scripts used to generate the comprehensive Page 1 keyword analysis for SpyFu lead enrichment.

---

## API Requests Used

### 1. Domain Trend Analysis API - getLatestDomainStats with 4-Month History

**Purpose:** Get 4 months of historical domain statistics to identify PEAK DECLINE for cold calling talking points. This replaces the single-month getLatestDomainStats call and provides richer trend data.

**API Cost:** $0.0020 per domain (4 rows × $0.50 / 1000)

**API Request:**
```bash
curl --request GET \
     --url 'https://api.spyfu.com/apis/domain_stats_api/v2/getLatestDomainStats?domain=example.com&pastNMonths=4' \
     --header 'accept: application/json' \
     --header 'Authorization: Basic {API_KEY}'
```

**Returns (per month for 4 months):**
- searchMonth / searchYear (time period)
- totalOrganicResults (ranking keywords)
- monthlyOrganicValue (traffic value in $)
- monthlyOrganicClicks (monthly traffic)
- averageOrganicRank (average position)
- strength (domain authority)
- monthlyPaidClicks (PPC data)
- monthlyBudget (PPC spend)
- totalAdsPurchased (PPC keywords)

**Script:** `get_domain_trends_4months.js`

**Peak Decline HotButtons Script:** `generate_peak_decline_hotbuttons.js`

**Logic:**
1. Compare This Month to previous 3 months
2. Find PEAK (highest) value from months 1-3
3. Calculate maximum decline from peak to current
4. Prioritize negative signals (losses) over positive (gains)
5. Auto-generate cold calling scripts with specific time frames

**Example Output:**
```
This Month: 392 KWs | $2,639 | 166 Clicks | 31 Authority
1Mo History: 397 KWs | $2,805 | 172 Clicks | 30 Authority
2Mo History: 432 KWs | $2,970 | 203 Clicks | 30 Authority
3Mo History: 387 KWs | $2,720 | 118 Clicks | 30 Authority
HotButtons: Lost 40 KWs (9.3%) | –$331 Value | –37 Clicks | Authority +1

📞 SCRIPT: "Hi [Name], I was looking at painreliefkc.com and noticed over 
   the last 2 months you lost $331 in monthly traffic value..."
```

**HotButtons Priority:**
1. **Value Loss** (if $100+) - Lead with dollar pain
2. **Keyword Loss** - Show ranking decline percentage
3. **Click Loss** - Traffic impact
4. **Authority Change** - Supporting context

**Why This Works:**
- Finds MAXIMUM loss (peak to current) - strongest pain point
- Auto-detects time frame ("1 month", "2 months", "3 months")
- Prioritizes negative news (losses sell better than gains)
- Scalable to any domain list

---

### 2. SEO Keywords API - getSeoKeywords (Top 10 Rankings)

**Purpose:** Get ALL keywords ranking in positions 1-10 (Page 1) with detailed metadata.

**API Cost:** Variable - (keyword_count / 1000) × $0.50
- Example: 233 keywords = $0.1165
- Example: 535 keywords = $0.2675

**API Request:**
```bash
curl --request GET \
     --url 'https://api.spyfu.com/apis/serp_api/v2/seo/getSeoKeywords?query=example.com&searchType=MostValuable&rank.min=1&rank.max=10&costPerClickOption=Exact&pageSize=1000&sortBy=Rank' \
     --header 'accept: application/json' \
     --header 'Authorization: Basic {API_KEY}'
```

**Key Parameters:**
- `query` = domain name
- `searchType=MostValuable` = sorts by most valuable keywords
- `rank.min=1&rank.max=10` = only get Page 1 results (positions 1-10)
- `costPerClickOption=Exact` = get exact match CPC data
- `pageSize=1000` = return up to 1000 keywords
- `sortBy=Rank` = sort by ranking position

**Returns for each keyword:**
- keyword (text)
- rank (1-10)
- searchVolume (monthly traffic)
- exactCostPerClick ($)
- phraseCostPerClick ($)
- broadCostPerClick ($)
- topRankedUrl
- seoClicks
- monthlyValue

---

## Calculated Metrics & Scripts

### 5. Page 1 Percentage & Page 2+ Percentage

**Script:** `add_page_percentage_columns.js`

**Calculation:**
```javascript
// Page 1 % = (Top 10 Keywords / Total Keywords) × 100
const page1Percentage = (top10KeywordCount / totalKeywords) * 100;

// Page 2+ % = (Remaining Keywords / Total Keywords) × 100
const page2PlusPercentage = ((totalKeywords - top10KeywordCount) / totalKeywords) * 100;
```

**Purpose:** Show what percentage of keywords are on Page 1 vs Page 2+. Useful for identifying overall SEO health and opportunity.

**Example:**
- salemplasticsurgery.com: 233 of 1,878 keywords = 12.41% on Page 1 (87.59% opportunity)

---

### 6. Ranking Position Counts (Top 1, Top 3, Positions 4-10)

**Script:** `add_ranking_position_columns.js`

**Calculation:**
```javascript
let top1Count = 0;
let top3Count = 0;
let positions4to10Count = 0;

domain.keywords.forEach(kw => {
  const rank = parseInt(kw.rank);
  
  if (rank === 1) {
    top1Count++;
    top3Count++; // Rank 1 is also in top 3
  } else if (rank === 2 || rank === 3) {
    top3Count++;
  } else if (rank >= 4 && rank <= 10) {
    positions4to10Count++;
  }
});
```

**Purpose:** Break down Page 1 keywords by position tier to identify optimization priorities.

**Traffic Distribution Context:**
- Position #1 = ~40% of clicks
- Position #2 = ~20% of clicks
- Position #3 = ~10% of clicks
- Positions 4-10 = Single digit percentages

**Example:**
- alignwc.com: 535 Page 1 keywords broken down as:
  - 30 in position #1 (5.6%)
  - 219 in top 3 (40.9%)
  - 316 in positions 4-10 (59.1%)

---

### 3. Peak Decline HotButtons (NEW)

**Script:** `generate_peak_decline_hotbuttons.js`

**Purpose:** Generate compelling cold calling talking points by finding the MAXIMUM decline from any previous month.

**Calculation Logic:**
```javascript
const months = domainData.monthlyStats;
const thisMonth = months[3];  // Current month
const previousMonths = [months[2], months[1], months[0]]; // 1-3 months ago

// Find PEAK values from previous 3 months
const peakKWs = Math.max(...previousMonths.map(m => m.totalOrganicResults));
const peakValue = Math.max(...previousMonths.map(m => m.monthlyOrganicValue));
const peakClicks = Math.max(...previousMonths.map(m => m.monthlyOrganicClicks));

// Calculate maximum decline
const kwDecline = peakKWs - thisMonth.totalOrganicResults;
const valueDecline = peakValue - thisMonth.monthlyOrganicValue;
const clicksDecline = peakClicks - thisMonth.monthlyOrganicClicks;
```

**HotButtons Format:**
```
Lost 40 KWs (9.3%) | –$331 Value | –37 Clicks | Authority +1
```

**Auto-Generated Script:**
```
"Hi [Name], I was looking at painreliefkc.com and noticed over the last 
2 months you lost $331 in monthly traffic value..."
```

**Why Peak Decline Works:**
- **Maximum Impact**: Shows the worst decline, not average
- **Time-Specific**: Auto-detects if decline happened 1, 2, or 3 months ago
- **Negative First**: Prioritizes losses (better sales psychology)
- **Dollar-Focused**: Leads with $ loss when significant ($100+)

**Example - painreliefkc.com:**
- This Month: 392 KWs | $2,639
- Peak (2 months ago): 432 KWs | $2,970
- Decline: 40 KWs (9.3%) | $331 loss
- Script: "You lost 40 rankings over the last 2 months"

---

### 3. Money Keywords & Local Keywords API - getMostValuableKeywords (Rank 11-75)

**Purpose:** Identify high-value keywords in positions 11-75 (Page 2-8) and categorize them into:
- **Top 5 Money Keywords** - Pure highest CPC keywords (no location filter)
- **Top 3 Local Keywords** - Highest CPC keywords with specific location identifiers

**API Cost:** Variable - (keyword_count / 1000) × $0.50
- **Average:** $0.0133 per domain (V2 extended range)
- **Example:** 266 keywords = $0.1330 for 10 domains = $0.0133/domain

**API Request (V2 - Extended Range):**
```bash
curl --request GET \
     --url 'https://api.spyfu.com/apis/serp_api/v2/seo/getMostValuableKeywords?query=example.com&searchVolume.min=10&searchVolume.max=50000&rank.min=11&rank.max=75&costPerClick.min=1&costPerClick.max=1000&costPerClickOption=Exact&pageSize=500&sortBy=ExactCostPerClick' \
     --header 'accept: application/json' \
     --header 'Authorization: Basic {API_KEY}'
```

**Key Parameters:**
- `query` = domain name
- `searchVolume.min=10` = exclude keywords with <10 monthly searches
- `searchVolume.max=50000` = cap at 50K searches (broad keywords)
- `rank.min=11&rank.max=75` = **V2 Extended Range** (Pages 2-8 instead of 2-5)
- `costPerClick.min=1` = only keywords worth $1+ CPC
- `costPerClick.max=1000` = cap at $1,000 CPC
- `costPerClickOption=Exact` = get exact match CPC data
- `pageSize=500` = return up to 500 keywords
- `sortBy=ExactCostPerClick` = sort by highest CPC first

**Returns for each keyword:**
- keyword (text)
- rank (11-75)
- searchVolume (monthly traffic)
- exactCostPerClick ($)
- phraseCostPerClick ($)
- broadCostPerClick ($)
- topRankedUrl

**Local Keyword Detection System:**
- **29,880 US Cities Database** - All cities including small towns (Spokane, Boise, Tulsa)
- **All 50 US States** - Full names ("north carolina") and abbreviations ("nc")
- **ZIP Codes** - 5-digit (90210) and ZIP+4 (90210-1234)
- **Geographic Descriptors** - "north shore", "east side", "west coast"
- **Excluded Terms** - "near me", "local", "city", "nearby" (nationwide searches)

**Script:** `identify_money_keywords.js --v2`

**Output Format:**
```
MoneyKW1   | smart lipo for men                       | $  9.91 CPC |     28 Vol | Rank #17
MoneyKW2   | co2 laser for face                       | $  9.75 CPC |    200 Vol | Rank #45
MoneyKW3   | breast lift procedure                    | $  9.38 CPC |    270 Vol | Rank #30
MoneyKW4   | plastic surgery north carolina           | $  8.65 CPC |     44 Vol | Rank #14
MoneyKW5   | liposuction flanks                       | $  8.45 CPC |    220 Vol | Rank #11

LocalKW1   | plastic surgery north carolina           | $  8.65 CPC |     44 Vol | Rank #14
LocalKW2   | plastic surgeon nc                       | $  8.00 CPC |    190 Vol | Rank #27
LocalKW3   | coolsculpting greensboro                 | $  7.00 CPC |     55 Vol | Rank #48
```

**Selection Algorithm:**
1. **Money Keywords** - Sort by highest CPC, take top 5
2. **Local Keywords** - Filter for location identifiers, sort by CPC, take top 3

**Why V2 (Rank 11-75) vs V1 (Rank 11-50):**
- **More Local Keywords** - Small businesses rank for smaller cities on pages 2-8
- **Better Coverage** - 266 keywords vs 147 keywords (81% more data)
- **Still Low Cost** - $0.0133/domain (well within $0.10-0.12 budget)
- **More Talking Points** - More opportunities to show in cold calls

**Cold Calling Usage:**
```
"Hi [Name], I was analyzing your SEO and found something interesting. 
You're ranking #17 for 'smart lipo for men' - that's a $9.91 per click 
keyword. But what really caught my attention is you're #14 for 'plastic 
surgery north carolina' at $8.65 per click - those 44 monthly searches 
are people specifically looking in North Carolina, not generic nationwide 
searches. If we could move just 5 of these high-value keywords from page 
2 to page 1..."
```

**JSON Output Structure:**
```json
{
  "generatedAt": "2025-10-23T08:04:11.559Z",
  "dataSource": "V2 (Rank 11-75)",
  "algorithm": {
    "step1": "Sort by highest CPC",
    "step2": "Apply local identifier check (29,880 cities + states + ZIP codes)",
    "excluded": "Removed generic nationwide searches: 'near me', 'local', 'city'"
  },
  "cityDatabase": {
    "totalCities": 29880,
    "source": "https://github.com/kelvins/US-Cities-Database"
  },
  "results": [
    {
      "domain": "salemplasticsurgery.com",
      "totalKeywords": 89,
      "moneyKeywords": [...],
      "localKeywords": [...]
    }
  ]
}
```

**V2 Results (10 domains tested):**
- **Total Keywords Analyzed:** 266
- **Total Money Keywords:** 26 (top 5 per domain)
- **Total Local Keywords:** 21 (top 3 per domain)
- **Domains with Local Keywords:** 6/6 (100%)
- **Average API Cost:** $0.0133/domain ✅ WITHIN BUDGET

---

### 4. Low-Hanging Fruit Analysis

**Script:** `identify_low_hanging_fruit.js`

**Logic:**
```javascript
// Filter out keywords already in position #1 (already winning)
const nonPosition1Keywords = domain.keywords.filter(kw => kw.rank !== 1);

// Top CPC Opportunities (high value keywords not at #1)
const topCPCKeywords = [...nonPosition1Keywords]
  .filter(kw => kw.cpc > 0)
  .sort((a, b) => b.cpc - a.cpc)
  .slice(0, 10);

// High Traffic Opportunities (high volume keywords not at #1)
const highTrafficKeywords = [...nonPosition1Keywords]
  .filter(kw => kw.traffic > 0)
  .sort((a, b) => b.traffic - a.traffic)
  .slice(0, 10);
```

**Purpose:** Identify the best optimization targets - keywords that are:
1. NOT already ranked #1 (so there's room for improvement)
2. Either have high CPC ($$$ value) or high traffic (volume)

**Why This Matters:**
- A keyword ranked #4 with $20 CPC is a goldmine
- Moving from #4 to #1 can increase traffic by 5-8x
- High CPC = high-intent, valuable traffic

**Example:**
- salemplasticsurgery.com has "dermaplaning winston salem" at rank #4 with $20.41 CPC
- Moving to #1 would capture 40% of 40 monthly searches = 16 clicks/mo × $20.41 = $326/mo in free traffic value

---

## Combined Report Structure

**Main Files Created:**
1. `combined_domain_report_with_rankings.csv` - Excel-ready full report
2. `combined_domain_report_with_rankings.json` - Structured data
3. `low_hanging_fruit_report.csv` - Opportunity-focused report
4. `low_hanging_fruit_report.json` - Opportunity data

**Final CSV Columns:**
1. Domain
2. Total Keywords
3. Top 10 KW Count (Page 1)
4. Top 1 (Position #1 count)
5. Top 3 (Positions 1-3 count)
6. Positions 4-10 (Positions 4-10 count)
7. Page 1 % (percentage on Page 1)
8. Page 2+ % (percentage on Page 2+)
9. Monthly Organic Value ($)
10. Monthly Organic Clicks
11. Monthly PPC Budget ($)
12. Monthly PPC Clicks
13. Organic Competitors
14. Paid Competitors
15. Domain Stats API Cost ($)
16. Keywords API Cost ($)
17. Total API Cost ($)
18. Keyword (individual keyword)
19. Rank (1-10)
20. Traffic (monthly searches)
21. CPC (cost per click)

---

## Cost Summary

**Average API Cost Per Domain:** $0.0565

**Breakdown:**
- 4-Month Domain Trend API: $0.0020 (4 rows)
- SEO Keywords API (Page 1): $0.00 to $0.2675 (variable based on keyword count)
- Money + Local Keywords API (V2): $0.0133 average (positions 11-75)

**Total Cost for 10 Domains:** $0.5645

**Cost Range by Domain:**
- Minimum: $0.0020 (no keywords tracked)
- Maximum: $0.2833 (alignwc.com with 535 Page 1 KWs + 4 months trend + V2 Money KWs)
- Median: $0.0153

**Budget Fit:**
- Target: $0.10-0.12 per lead
- Actual: $0.0565 average per lead
- 4-Month Trend Data: $0.0020 per domain
- Page 1 Keywords: $0.00-0.2675 per domain
- Money + Local Keywords (V2): $0.0133 per domain
- **Well within budget!** ✅

---

## Key Insights from Analysis

### Overall Stats (10 Domains):
- **Total Keywords Tracked:** 7,561
- **Page 1 Keywords:** 815 (10.78%)
- **Position #1 Keywords:** 70 (8.59% of Page 1)
- **Top 3 Keywords:** 326 (40.00% of Page 1)
- **Positions 4-10 Keywords:** 489 (60.00% of Page 1)

### Top Performing Domains:
1. **salemplasticsurgery.com** - 1,878 total KWs, 233 on Page 1 (12.41%)
2. **alignwc.com** - 4,715 total KWs, 535 on Page 1 (11.35%)
3. **painreliefkc.com** - 392 total KWs, 15 on Page 1 (3.83%)

### Best Low-Hanging Fruit Opportunities:
1. **salemplasticsurgery.com** - "dermaplaning winston salem" at rank #4 with $20.41 CPC
2. **alignwc.com** - "corrective chiropractic near me" at rank #8 with 750 traffic + $4.12 CPC
3. **painreliefkc.com** - "kinesiology chiropractor" at rank #4 with 300 traffic + $3.53 CPC

---

## Usage Notes

### For Cold Calling:
- **Lead with HotButtons** - Use peak decline data for opening line
- Example: "You lost $331 in monthly traffic over the last 2 months..."
- Use **Page 1 %** to show SEO health vs opportunity
- Use **Top 1, Top 3, Positions 4-10** to show specific optimization targets
- Use **Low-Hanging Fruit** report to show exact dollar value opportunities
- **HotButtons Priority**: Value Loss > Keyword Loss > Click Loss > Authority

### For Dashboard Design:
- Display at 3 price tiers: Budget ($0.01-0.02), Mid ($0.04-0.06), Premium ($0.10-0.12)
- Show top 5-10 opportunities per tier
- Highlight keywords with both high CPC AND high traffic

### For Scaling to 30 Domains:
- Estimated total cost: ~$1.20 for all 30 domains
- Expected average: $0.04 per domain
- Some domains may exceed budget (high keyword counts) but provide better data

---

## Script Execution Order

1. **Get 4-month domain trends:** `node get_domain_trends_4months.js`
   - Fetches 4 months of historical data
   - Calculates trend metrics
   - Saves to `domain_trends_4months.json`
   
2. **Generate Peak Decline HotButtons:** `node generate_peak_decline_hotbuttons.js`
   - Compares This Month to previous 3 months
   - Finds maximum decline (peak to current)
   - Auto-generates cold calling scripts
   - Prioritizes losses over gains
   
3. **Create combined report:** `node create_combined_report.js`
   - Fetches SEO Keywords API
   - Combines with trend data
   
4. **Add percentages:** `node add_page_percentage_columns.js`
   - Calculates Page 1 % and Page 2+ %
   
5. **Add ranking positions:** `node add_ranking_position_columns.js`
   - Calculates Top 1, Top 3, Positions 4-10 counts
   
6. **Identify opportunities:** `node identify_low_hanging_fruit.js`
   - Finds top CPC and high traffic keywords not at #1

7. **Identify Money + Local Keywords (V2):** `node identify_money_keywords.js --v2`
   - Fetches keywords ranking positions 11-75 (extended range)
   - Sorts by highest CPC to identify top 5 Money Keywords
   - Filters for local identifiers (29,880 cities + states + ZIP codes)
   - Identifies top 3 Local Keywords with highest CPC
   - Excludes generic nationwide searches ("near me", "local", "city")
   - Saves to `money_keywords_report_v2.json`
   - Average cost: $0.0133 per domain

---

## Next Steps

- [ ] Run analysis on all 30 domains
- [ ] Create 5 dashboard layout designs at 3 price tiers
- [ ] Generate cold calling scripts using real data
- [ ] Test additional API endpoints for more data points
- [ ] Consider adding competitor comparison data

---

## Summary of All API Requests

| API Request | Purpose | Rank Range | Cost/Domain | Data Points |
|-------------|---------|------------|-------------|-------------|
| **4-Month Domain Trends** | Historical performance | N/A | $0.0020 | Peak decline analysis |
| **Page 1 Keywords** | Top 10 rankings | 1-10 | $0.00-0.2675 | Page 1 performance |
| **Money + Local Keywords (V2)** | High-value opportunities | 11-75 | $0.0133 | Top 5 Money + Top 3 Local |

**Total Average Cost:** $0.0565 per domain  
**Budget Target:** $0.10-0.12 per lead  
**Status:** ✅ Well within budget (47-56% of budget)

---

**Last Updated:** 2025-10-23  
**Total Domains Analyzed:** 10  
**Total API Cost (Basic):** $0.5645  
**Total API Cost (With Competitors):** $2.52-5.28 per domain
**New Features:** 
- 4-Month Peak Decline Analysis with Auto-Generated Cold Calling Scripts
- Money Keywords + Local Keywords Identification (V2 Extended Range)
- Comprehensive 29,880 City Database for Local Detection
- **Top 5 Competitors Analysis with 3-Row Comparison System**
  - CompHotButton: Authority gap hook (≤40 chars)
  - CompGaps: 4-metric gap analysis (≤40 chars)
  - BestComp: Top competitor comparison (≤40 chars)
  - Auto-generated sales talking points
  - Complete competitive intelligence for call center popups
