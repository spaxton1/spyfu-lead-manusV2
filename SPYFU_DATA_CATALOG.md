# SpyFu API Data Catalog
## CSV Lead Enhancement Tool - Data Reference

**Purpose:** This document shows what data is available from SpyFu APIs to help you decide which 15 fields to show above the fold in your enhanced CSV file.

---

## API #1: Domain Trends (4-Month History)
**Endpoint:** `getLatestDomainStats?domain=example.com&pastNMonths=4`  
**Cost:** $0.0020 per domain (4 rows)  
**Purpose:** Historical performance tracking - shows if domain is improving or declining

### Data Fields Returned (per month × 4 months):

| Field Name | Data Type | Example Value | Description |
|-----------|-----------|---------------|-------------|
| `searchMonth` | Integer | 9 | Month number (1-12) |
| `searchYear` | Integer | 2025 | Year |
| `totalOrganicResults` | Integer | 2,496 | Number of keywords ranking |
| `monthlyOrganicValue` | Integer | 8,281 | Estimated traffic value ($) |
| `monthlyOrganicClicks` | Integer | 888 | Estimated monthly clicks |
| `averageOrganicRank` | Float | 46.1 | Average ranking position |
| `strength` | Integer | 36 | Domain authority score |
| `monthlyPaidClicks` | Integer | 0 | PPC clicks |
| `monthlyBudget` | Integer | 0 | PPC monthly spend ($) |
| `totalAdsPurchased` | Integer | 0 | Number of PPC keywords |

### Actual Data Sample (rhmd.com - Most Recent Month):
```json
{
  "searchMonth": 9,
  "searchYear": 2025,
  "averageOrganicRank": 46.1,
  "monthlyPaidClicks": 0,
  "averageAdRank": 0,
  "totalOrganicResults": 2496,
  "monthlyBudget": 0,
  "monthlyOrganicValue": 8281,
  "totalAdsPurchased": 0,
  "monthlyOrganicClicks": 888,
  "strength": 36,
  "totalInverseRank": 34900
}
```

### Calculated Metrics From This API:
| Metric | Calculation | Example | Use Case |
|--------|-------------|---------|----------|
| **Peak Value Decline** | Peak(months 1-3) - Current | Lost $3,159 in 2 months | Cold calling hook |
| **Keyword Growth/Loss** | Peak KWs - Current KWs | Lost 40 keywords | Show decline |
| **Click Change** | Peak Clicks - Current Clicks | Lost 37 clicks/mo | Traffic loss |
| **Authority Change** | Current - Previous | +1 authority | Positive signal |
| **Trend Direction** | Compare all 4 months | Declining | Overall health |

---

## API #2: Page 1 Keywords (Rank 1-10)
**Endpoint:** `getSeoKeywords?query=example.com&rank.min=1&rank.max=10`  
**Cost:** Variable - $0.00 to $0.27 per domain  
**Purpose:** Get ALL keywords currently ranking on Page 1 of Google

### Data Fields Returned (per keyword):

| Field Name | Data Type | Example Value | Description |
|-----------|-----------|---------------|-------------|
| `keyword` | String | "is brazilian buttock lift safe" | Keyword phrase |
| `topRankedUrl` | URL | "https://www.rhmd.com/blog/..." | Landing page |
| `rank` | Integer | 10 | Position (1-10) |
| `rankChange` | Integer | 1 | Position change (+ or -) |
| `searchVolume` | Integer | 24 | Monthly searches |
| `keywordDifficulty` | Integer | 20 | SEO difficulty (0-100) |
| `broadCostPerClick` | Float | 7.93 | Broad match CPC ($) |
| `phraseCostPerClick` | Float | null | Phrase match CPC ($) |
| `exactCostPerClick` | Float | null | Exact match CPC ($) |
| `seoClicks` | Integer | 0 | Estimated clicks |
| `paidCompetitors` | Integer | 1 | # of advertisers |

### Actual Data Sample (rhmd.com - Top Keywords):
```json
[
  {
    "keyword": "is brazilian buttock lift safe",
    "topRankedUrl": "https://www.rhmd.com/blog/is-a-brazilian-butt-lift-safe-for-all-body-types/",
    "rank": 10,
    "rankChange": 1,
    "searchVolume": 24,
    "keywordDifficulty": 20,
    "broadCostPerClick": 7.93,
    "seoClicks": 0,
    "paidCompetitors": 1
  },
  {
    "keyword": "jawline surgery men",
    "rank": 10,
    "rankChange": 0,
    "searchVolume": 73,
    "keywordDifficulty": 28,
    "broadCostPerClick": 7.34,
    "seoClicks": 0
  },
  {
    "keyword": "can you get lipo on your back",
    "rank": 7,
    "searchVolume": 44,
    "broadCostPerClick": 6.33,
    "seoClicks": 0
  }
]
```

### Calculated Metrics From This API:
| Metric | Calculation | Example | Use Case |
|--------|-------------|---------|----------|
| **Total Page 1 Keywords** | Count all rank 1-10 | 233 keywords | Total Page 1 presence |
| **#1 Position Count** | Count where rank=1 | 30 keywords | Dominating keywords |
| **Top 3 Count** | Count where rank≤3 | 219 keywords | High visibility |
| **Positions 4-10 Count** | Count where rank 4-10 | 316 keywords | Optimization targets |
| **Page 1 Percentage** | (Page1 / Total) × 100 | 12.41% | SEO health score |
| **Low-Hanging Fruit** | CPC>$5 AND rank≠1 | "buttock lift" #10, $7.93 | Quick win targets |
| **Average Page 1 CPC** | Sum(CPC) / Count | $6.20 avg | Keyword quality |

---

## API #3: Money Keywords (Rank 11-75, High CPC)
**Endpoint:** `getMostValuableKeywords?query=example.com&rank.min=11&rank.max=75&costPerClick.min=1&sortBy=ExactCostPerClick`  
**Cost:** $0.0133 per domain average  
**Purpose:** Find high-value keywords on Pages 2-8 that are optimization opportunities

### Data Fields Returned (per keyword):

| Field Name | Data Type | Example Value | Description |
|-----------|-----------|---------------|-------------|
| `keyword` | String | "tummy tuck beverly hills" | Keyword phrase |
| `rank` | Integer | 22 | Position (11-75) |
| `searchVolume` | Integer | 140 | Monthly searches |
| `exactCostPerClick` | Float | 9.75 | Exact match CPC ($) |
| `phraseCostPerClick` | Float | 8.50 | Phrase match CPC ($) |
| `broadCostPerClick` | Float | 7.20 | Broad match CPC ($) |
| `topRankedUrl` | URL | "https://..." | Landing page |

### Actual Data Sample (rhmd.com - Top Money Keywords):
```json
[
  {
    "keyword": "tummy tuck beverly hills",
    "rank": 22,
    "searchVolume": 140,
    "exactCostPerClick": 9.75,
    "phraseCostPerClick": 8.50,
    "broadCostPerClick": 7.20
  },
  {
    "keyword": "mesotherapy fat reduction",
    "rank": 37,
    "searchVolume": 170,
    "exactCostPerClick": 9.59,
    "broadCostPerClick": 7.10
  },
  {
    "keyword": "surgical butt lift",
    "rank": 72,
    "searchVolume": 250,
    "exactCostPerClick": 8.63,
    "broadCostPerClick": 6.80
  }
]
```

### Calculated Metrics From This API:
| Metric | Calculation | Example | Use Case |
|--------|-------------|---------|----------|
| **Top 5 Money Keywords** | Sort by CPC DESC, take 5 | "tummy tuck" $9.75, rank #22 | High-value opportunities |
| **Top 3 Local Keywords** | Filter for city/state names, sort by CPC | "plastic surgery NC" $8.65 | Geographic targeting |
| **Total Money Keywords** | Count where CPC≥$1 | 89 keywords | Opportunity size |
| **Avg Money Keyword CPC** | Sum(CPC) / Count | $7.42 avg | Value quality |
| **Potential Traffic Value** | Sum(Volume × CPC) | $12,500/mo | Revenue opportunity |

### Local Keyword Detection Algorithm:
- **29,880 US Cities** (Spokane, Boise, Greensboro, etc.)
- **50 US States** (full names + abbreviations)
- **ZIP Codes** (5-digit and ZIP+4 format)
- **Excludes:** "near me", "local", "city", "nearby" (too generic)

**Example Local Keywords:**
```
"plastic surgery north carolina" - Contains state
"coolsculpting greensboro" - Contains city
"plastic surgeon nc" - Contains state abbreviation
"dermatology 27407" - Contains ZIP code
```

---

## API #4: SERP Competitors Analysis
**Endpoint:** `getSerpAnalysisKeywords?Keyword={keyword}&pageSize=10`  
**Cost:** $0.0050 per keyword + $0.0020 per competitor domain  
**Purpose:** Find who else ranks for your best keywords and get their full SEO stats

### How It Works:
1. Select your best keyword (highest CPC local keyword)
2. API returns top 10 ranking domains for that keyword
3. For each competitor, fetch their domain stats (same as API #1)
4. Filter out social media, directories (Yelp, WebMD, etc.)

### Data Fields Returned (per ranking position):

| Field Name | Data Type | Example Value | Description |
|-----------|-----------|---------------|-------------|
| `keyword` | String | "dermaplaning winston salem" | The search term |
| `domain` | String | "skinsurgerycenter.net" | Competing domain |
| `rankingUrl` | URL | "https://..." | Their landing page |
| `rank` | Integer | 1 | Their position (1-10) |
| `organicScore` | Integer | 85 | SERP strength score |

### Then For Each Competitor Domain - Get Full Stats:

Uses **API #1 (Domain Stats)** to fetch:
- Total Keywords
- Monthly Organic Value ($)
- Monthly Organic Clicks
- Domain Authority
- Average Rank

### Actual Data Sample (salemplasticsurgery.com competitors):
```json
{
  "domain": "salemplasticsurgery.com",
  "bestKeyword": "dermaplaning winston salem",
  "keywordCPC": 20.41,
  "keywordVolume": 40,
  "yourRank": 4,
  "competitors": [
    {
      "domain": "skinsurgerycenter.net",
      "rank": 1,
      "totalKeywords": 14929,
      "monthlyOrganicValue": 56440,
      "monthlyOrganicClicks": 11200,
      "authority": 43,
      "averageRank": 35.2
    },
    {
      "domain": "winstonsalemdermatology.com",
      "rank": 2,
      "totalKeywords": 11660,
      "monthlyOrganicValue": 41770,
      "monthlyOrganicClicks": 5495,
      "authority": 42,
      "averageRank": 42.1
    },
    {
      "domain": "qimassageandnaturalhealingspa.com",
      "rank": 3,
      "totalKeywords": 5639,
      "monthlyOrganicValue": 6545,
      "monthlyOrganicClicks": 4223,
      "authority": 35,
      "averageRank": 48.7
    }
  ]
}
```

### Calculated Metrics From This API:
| Metric | Calculation | Example | Use Case |
|--------|-------------|---------|----------|
| **Authority Gap** | Top Comp Authority - Your Authority | 43 - 36 = 7 points behind | Show competitive weakness |
| **Traffic Gap** | Top Comp Value - Your Value | $56,440 - $8,281 = $48K gap | Revenue opportunity |
| **Top Competitor** | Highest authority domain | skinsurgerycenter.net (43 auth) | Main target to beat |
| **Avg Competitor Strength** | Avg(all competitor authority) | 38.6 average | Market difficulty |
| **Your Position** | Your rank for this keyword | #4 out of 10 | Competitive standing |
| **Keyword Competitiveness** | Count of competitors | 8 competitors (after filtering) | Market saturation |

### Excluded Domains (Filtered Out):
- **Social Media:** Facebook, Instagram, LinkedIn, Twitter, YouTube
- **Directories:** Yelp, YellowPages, Healthgrades, Zocdoc, RealSelf
- **Generic Health Sites:** WebMD, Healthline, Mayo Clinic, Wikipedia

### Cost Example:
**For 1 domain:**
- SERP Analysis API: $0.0050 (returns 10 competitors)
- Domain Stats API: $0.0020 × 8 competitors (after filtering) = $0.0160
- **Total:** $0.0210 per domain

**For batch of leads:**
- If you have 100 leads and get competitor data for all
- Cost: 100 × $0.021 = **$2.10 total**

### When To Use This API:
✅ **Use if:** You want to show competitive intelligence to prospects  
✅ **Use if:** You need to prove there's an authority gap  
✅ **Use if:** Cold calling script needs "you're 7 points behind your top competitor"  
❌ **Skip if:** Budget is tight (adds $0.021 per lead)  
❌ **Skip if:** Only need basic SEO metrics  

---

## Combined Data Summary: What's Available for CSV

### Above-the-Fold Candidates (Choose Your 15):

#### Domain Overview Metrics:
1. **Domain Name** - From your input CSV
2. **Total Keywords Ranking** - API #1 (totalOrganicResults)
3. **Monthly Organic Value** - API #1 (monthlyOrganicValue) - Shows $ value
4. **Monthly Organic Clicks** - API #1 (monthlyOrganicClicks)
5. **Domain Authority** - API #1 (strength)
6. **Average Rank** - API #1 (averageOrganicRank)

#### Trend/Change Metrics:
7. **Peak Value Decline** - Calculated from API #1 (e.g., "Lost $3,159 in 2 months")
8. **Keyword Change** - Calculated from API #1 (e.g., "-40 keywords")
9. **Click Change** - Calculated from API #1 (e.g., "-37 clicks")
10. **Trend Direction** - Calculated (↑ Growing / ↓ Declining / → Stable)

#### Page 1 Performance:
11. **Page 1 Keywords** - Count from API #2 (rank 1-10)
12. **Position #1 Count** - Calculated from API #2
13. **Top 3 Count** - Calculated from API #2
14. **Page 1 Percentage** - (Page1 / Total) × 100
15. **Avg Page 1 CPC** - Average CPC of Page 1 keywords

#### Top Opportunities (Formatted Strings):
16. **Top Money Keyword** - From API #3: "tummy tuck beverly hills | $9.75 | Rank #22"
17. **Top Local Keyword** - From API #3: "plastic surgery NC | $8.65 | Rank #14"
18. **Best Low-Hanging Fruit** - From API #2: "buttock lift | $7.93 | Rank #10"

#### PPC Data:
19. **Monthly PPC Budget** - API #1 (monthlyBudget)
20. **Monthly PPC Clicks** - API #1 (monthlyPaidClicks)
21. **Total PPC Keywords** - API #1 (totalAdsPurchased)

#### Competitor Data (Optional):
22. **Top Competitor** - From API #4: "skinsurgerycenter.net | 43 Auth | $56K Value"
23. **Authority Gap** - Calculated: "7 points behind" or "+5 points ahead"
24. **Traffic Gap** - Calculated: "$48K behind top competitor"
25. **Competitor Count** - Count from API #4: "8 competitors"
26. **Your SERP Position** - From API #4: "#4 of 10"

---

## Field Character Limits (Per Your Requirements)

All display fields must be ≤40 characters:

### Good Examples (≤40 chars):
```
MoneyKW1 | smart lipo men | $9.91 | Rank 17
LocalKW1 | surgery NC | $8.65 | Rank #14
LowHang1 | buttock lift | $7.93 | Rank #10
```

### Bad Examples (>40 chars):
```
MoneyKW1 | smart lipo for men procedure with consultation | $9.91 CPC | 28 Volume | Rank #17
```

---

## Sample Enhanced CSV Row

Here's what ONE lead row might look like with all available data:

```csv
Domain,TotalKWs,Page1KWs,MonthlyValue,MonthlyClicks,Authority,PeakDecline,KWChange,ClickChange,Pos1Count,Top3Count,Page1Pct,AvgCPC,TopMoneyKW,TopLocalKW,BestLowHang
rhmd.com,2496,233,8281,888,36,"Lost $3159 in 2mo",-40,-37,30,219,9.3%,6.20,"tummy tuck | $9.75 | #22","surgery NC | $8.65 | #14","buttock lift | $7.93 | #10"
```

---

## Cost Summary Per Domain

| API | Cost Range | Average | What You Get |
|-----|-----------|---------|--------------|
| API #1: 4-Month Trends | $0.0020 | $0.0020 | Historical performance data |
| API #2: Page 1 Keywords | $0.00-0.27 | $0.13 | All rank 1-10 keywords |
| API #3: Money Keywords | $0.01-0.02 | $0.0133 | High-CPC opportunities |
| API #4: Competitors (OPTIONAL) | $0.0210 | $0.0210 | Top 5 competitor analysis |
| **TOTAL (Basic)** | **$0.01-0.29** | **$0.15** | **SEO profile without competitors** |
| **TOTAL (With Competitors)** | **$0.03-0.31** | **$0.17** | **Full competitive intelligence** |

**Your Budget Target:** $0.10-0.12 per lead  
**Actual Average (Basic):** $0.15 per lead  
**Actual Average (With Competitors):** $0.17 per lead  
**Recommendation:** 
- API #2 is most expensive but provides the most valuable data (Page 1 keywords)
- API #4 (Competitors) adds $0.021 - only use if competitive intelligence is important to your sales pitch

---

## Below-the-Fold Data Ideas

Everything else not in your top 15 can go below the fold:

- Full list of Page 1 keywords (all 233)
- Full list of Money Keywords (top 20-50)
- Full list of Local Keywords (all found)
- 4-month trend chart data
- Individual keyword details (difficulty, competitors, etc.)
- PPC campaign details
- Competitor analysis data
- Ranking change history
- URL-level performance

---

## Next Steps

**For You:**
1. Review this data catalog
2. Select your 15 above-the-fold fields
3. Decide on field names and format
4. I'll build the CSV enhancement tool that:
   - Takes your lead list (domains)
   - Calls SpyFu APIs for each domain
   - Calculates all metrics
   - Outputs enhanced CSV with your chosen fields

**Questions to Answer:**
- Which 15 fields are most important for your sales team?
- Do you want raw numbers or formatted strings?
- Do you need any custom calculations?
- What should happen if a domain has no data?

---

**Last Updated:** 2025-10-24  
**Data Source:** SpyFu API v2  
**Test Dataset:** 19 domains analyzed
