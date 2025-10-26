# 🎯 Ranking Nuggets Specification
## Complete 32-Row Dashboard Format for ReadyMode Integration

**Source:** User's seo_dashboard.csv + instructions.md  
**Purpose:** Format all SpyFu API data into 32 pre-calculated rows for cold calling  
**Constraints:** Title ≤20 chars, Data ≤40 chars, pipe-separated for density

---

## 📁 CSV Input Requirements

### **Sample Data Available**
- **File:** `SampleLeads-35.csv` (36 real leads)
- **Location:** Project repository root
- **Purpose:** Use for testing with actual SpyFu API (use credits sparingly)

### **Website Field Detection**
**CRITICAL:** CSVs come in different formats. The website column can be named:
- `Website`, `Company Website`, `website`, `Web Site`
- `URL`, `Domain`, `Company URL`, `Web Address`

**Smart Detection Required:**
- Search headers case-insensitively for: `website`, `domain`, `url`, `web`
- Exclude: `Person Linkedin Url` (not a company website)
- Validate URLs and extract clean domains (remove `www.`, protocol, etc.)
- Skip rows with invalid/missing websites

### **Sample CSV Structure**
```
First Name,Last Name,Title,Company Name,Email,Website,City,State,...
Dave,Witbeck,Owner,Affinity Stone,dave@affinitystone.com,https://affinitystone.com,Arthur,Illinois,...
```

**Parsing Notes:**
- 36 leads with varying data completeness
- Many optional fields may be empty
- Phone numbers have multiple column variations
- Company addresses contain commas (need proper CSV parsing)
- **Implementation:** Use PapaParse library for robust CSV handling

---

## 📊 The 32 Ranking Nuggets

### **Above-the-Fold (15 rows)** - Immediately visible in ReadyMode

| # | Title | Example Data | Character Count |
|---|-------|--------------|-----------------|
| 1 | Snapshot | `2,496 KWs \| $8,281 \| 888 Clicks \|36A` | 39 chars |
| 2 | Page 1 | `233/9.3% \| 30 #1 \| 219 T3 \| 14 4-10` | 38 chars |
| 3 | Page 2 | `32 KWs \| 1234 Clicks \| $3.2K \| 91% Pg2+` | 42 chars |
| 4 | Quick Wins | `16@11-15 \| 22 $KWs \| $52 TopCPC \| 1355 Clicks` | 48 chars |
| 5 | Historical Trend | `-80 KWs \| -3.4K Val \| -74 Clicks \| +1A` | 40 chars |
| 6 | Local KW L1 | `plastic surgery NC\|#14\|$8.7` | 29 chars |
| 7 | Local KW L2 | `coolsculpting greensboro\|#28\|$7` | 34 chars |
| 8 | KW Traffic | `113 L1\|40 L2\|223 CPC\|455 Traf` | 32 chars |
| 9 | Top CPC KW | `tummy tuck beverly hills\|#22\|$9.8` | 35 chars |
| 10 | Top Traffic KW | `jawline surgery men\|#10\|13 Clicks` | 35 chars |
| 11 | Competitor 1 | `skinsurg.net\|14,929 KWs\|$56K` | 31 chars |
| 12 | Competitor 2 | `winstonderm.com\|11,660 KWs\|$42K` | 34 chars |
| 13 | Competitor Ranks | `plastic NC\|#1 C1\|#2 C2` | 24 chars |
| 14 | Competitor 3 | `salemplastic.com\|8,000 KWs\|$30K` | 33 chars |
| 15 | Competitor 4 | `piedmontplast.com\|6,000 KWs\|$20K` | 35 chars |

### **Below-the-Fold (17 rows)** - Additional detail

| # | Title | Example Data |
|---|-------|--------------|
| 16 | Comp Hot Buttons | `KWs +498%\|$48K\|Clicks +1161%` |
| 17 | Client 1 Mo | `2,496 KWs\|$8K\|888 Clicks\|36Au` |
| 18 | Client 2 Mo | `2,516 KWs\|$9K\|908 Clicks\|36Au` |
| 19 | Client 3 Mo | `2,536 KWs\|$9K\|928 Clicks\|36Au` |
| 20 | Client 4 Mo | `2,576 KWs\|$11K\|962 Clicks\|35Au` |
| 21 | Local KW L3 | `charleston surgery\|$7.3\|#10\|73mo` |
| 22 | Local KW L4 | `greensboro botox\|$6.5\|#35\|100mo` |
| 23 | Local KW L5 | `raleigh lipo\|$5.8\|#50\|80mo` |
| 24 | LowHang1 | `jawline surgery men\|$7.3\|#10\|73mo` |
| 25 | LowHang2 | `buttock lift\|$7.9\|#12\|150mo` |
| 26 | LowHang3 | `liposuction cost\|$8.5\|#15\|200mo` |
| 27 | LowHang4 | `chin implant cost\|$8.2\|#9\|210mo` |
| 28 | LowHang5 | `facelift surgery\|$7\|#20\|180mo` |
| 29 | Money KW2 | `blepharoplasty recovery\|$6.9\|#8\|180mo` |
| 30 | Money KW3 | `tummy tuck recovery\|$6.8\|#25\|160mo` |
| 31 | Money KW4 | `rhinoplasty cost\|$6.5\|#30\|140mo` |
| 32 | Money KW5 | `breast augmentation\|$6.2\|#40\|120mo` |

---

## 🔧 Calculation Rules

### **Formatting Standards:**
- **Numbers:** Exact integers for credibility (2,496 not "~2,500")
- **Currency:** 2 significant digits, K for thousands ($8,281 → $8.3K, but keep exact if fits)
- **Percentages:** 1 decimal place (9.3%), whole numbers for large gaps (498%)
- **Separators:** Pipes without spaces (`|`) for density
- **Scaling:** Trim keywords/domains if >40 chars total
- **Authority:** Append "A" or "Au" (36A, 36Au)
- **Volume:** Append "mo" for monthly (73mo)

### **Priority Rules:**
1. **Historical Trend:** Prioritize negatives (losses) over positives (gains)
2. **Local Keywords:** Filter using 29,880 cities + 50 states + ZIP codes
3. **Money Keywords:** Exclude rank #1 (already winning)
4. **Competitors:** Order by `monthlyOrganicValue` DESC

---

## 📋 Detailed Row Specifications

### Row 1: Snapshot
**Formula:** `<KWs> | <Value> | <Clicks> | <Auth>`  
**API:** #1 (`getLatestDomainStats`, month 4)  
**Fields:**
- KWs: `totalOrganicResults` (exact)
- Value: `monthlyOrganicValue` (2 digits, K for 1000s)
- Clicks: `monthlyOrganicClicks` (exact)
- Auth: `strength` (exact + "A")

**Example:** `2,496 KWs | $8,281 | 888 Clicks |36A`

---

### Row 2: Page 1
**Formula:** `<Pg1 KWs>/<% > | <#1> | <T3> | <4-10>`  
**API:** #2 (`getSeoKeywords`, rank 1-10) + #1 (total KWs)  
**Calculations:**
- Pg1 KWs: Count of rank 1-10
- %: (Pg1/Total) × 100, 1 decimal
- #1: Count where rank = 1
- T3: Count where rank 1-3
- 4-10: Count where rank 4-10

**Example:** `233/9.3% | 30 #1 | 219 T3 | 14 4-10`

---

### Row 3: Page 2
**Formula:** `<Page 2 KWs> | <Clicks> | <Value> | <% Pg2+>`  
**API:** #3 (`getMostValuableKeywords`, rank 11-20)  
**Calculations:**
- Page 2 KWs: Count of rank 11-20
- Clicks: Sum of `seoClicks` or `searchVolume × 2% CTR`
- Value: Sum of `searchVolume × exactCostPerClick`
- % Pg2+: ((Total - Pg1) / Total) × 100

**Example:** `32 KWs | 1234 Clicks | $3.2K | 91% Pg2+`

---

### Row 4: Quick Wins
**Formula:** `<11-15 KWs> | <Money KWs not #1> | <Top CPC> | <Clicks #2-75>`  
**API:** #2 (rank 2-10) + #3 (rank 11-75)  
**Calculations:**
- 11-15 KWs: Count of rank 11-15
- Money KWs not #1: Count where CPC > 0 and rank 2-75
- Top CPC: Max `exactCostPerClick`, whole number
- Clicks #2-75: Sum with CTR (18.1% for 2-10, 2% for 11-20, 1% for 21-75)

**Example:** `16@11-15 | 22 $KWs | $52 TopCPC | 1355 Clicks`

---

### Row 5: Historical Trend (PeakLoss)
**Formula:** `<KWs Change> | <Value Change> | <Clicks Change> | <Auth Change>`  
**API:** #1 (4 months)  
**Calculations:**
- KWs: Current - Max(Mo1-Mo3); use + from Min if no loss
- Value: Current - Max(Mo1-Mo3), K for 1000s
- Clicks: Current - Max(Mo1-Mo3)
- Auth: Current - Mo3

**Example:** `-80 KWs | -3.4K Val | -74 Clicks | +1A`

---

### Rows 6-8: Local KW L1-L3
**Formula:** `<Full Local KW>|<Rank>|<CPC>` (L1-L2) or `<KW>|<CPC>|<Rank>|<Volume>` (L3)  
**API:** #2 (rank 2-10) + #3 (rank 11-75)  

**Local Identifier Detection (hasLocalIdentifier function):**
- ✅ **29,880 US cities** - Including multi-word cities like "Beverly Hills", "Los Angeles"
- ✅ **50 US states** - Full names: "California", "North Carolina"
- ✅ **State abbreviations** - 2-letter: "CA", "NC" (with word boundary checks)
- ✅ **ZIP codes** - 5-digit: "90210" or ZIP+4: "90210-1234"
- ✅ **Geographic descriptors** - "north shore", "downtown", "east side"
- ❌ **Excludes** - "near me", "local", "city", "nearby" (false positives)

**Implementation Notes:**
- Check 1-word, 2-word, and 3-word city combinations
- Use word boundaries to avoid false matches (e.g., "in" vs Indiana)
- Reference: `identify_money_keywords_v2_api.js` (working implementation)
- Database: `us_cities_lookup.json` (18,720 unique city names)

**Sorting:** By `exactCostPerClick` DESC  
**Examples:**
- L1: `plastic surgery NC|#14|$8.7`
- L2: `coolsculpting greensboro|#28|$7`
- L3: `charleston surgery|$7.3|#10|73mo`

---

### Row 9: KW Traffic
**Formula:** `<Local1 Clicks>|<Local2 Clicks>|<Top CPC Clicks>|<Top Traffic Clicks>`  
**API:** #2 + #3  
**Calculations:**
- L1, L2: Clicks for keywords from rows 6-7
- CPC: Clicks for top CPC keyword (row 9 from original spec)
- Traf: Clicks for top traffic keyword (row 10 from original spec)
- CTR: 18.1% for rank 2-10, 2% for 11-20, 1% for 21-75

**Example:** `113 L1|40 L2|223 CPC|455 Traf`

---

### Row 10: Top CPC KW
**Formula:** `<Full Top CPC KW>|<Rank>|<CPC>`  
**API:** #2 (rank 2-10) + #3 (rank 11-75)  
**Selection:** Highest `exactCostPerClick` in ranks 2-75

**Example:** `tummy tuck beverly hills|#22|$9.8`

---

### Row 11: Top Traffic KW
**Formula:** `<Full Top Traffic KW>|<Rank>|<Clicks>`  
**API:** #2 + #3  
**Selection:** Highest `seoClicks` or `searchVolume × CTR` in ranks 2-75

**Example:** `jawline surgery men|#10|13 Clicks`

---

### Rows 11-14: Competitors 1-4
**Formula:** `<Domain>|<KWs>|<Value>`  
**API:** #4 (`getSerpAnalysisKeywords` for best keyword) + #1 (stats per competitor)  
**Selection:**
- C1: Highest `monthlyOrganicValue`
- C2: Highest `monthlyOrganicClicks` (not C1)
- C3: 3rd-highest `monthlyOrganicClicks`
- C4: 4th-highest `monthlyOrganicClicks`

**Domain Trimming:** Trim to ~12 chars if needed  
**Examples:**
- C1: `skinsurg.net|14,929 KWs|$56K`
- C2: `winstonderm.com|11,660 KWs|$42K`
- C3: `salemplastic.com|8,000 KWs|$30K`
- C4: `piedmontplast.com|6,000 KWs|$20K`

---

### Row 15: Competitor Ranks
**Formula:** `<Best KW>|<C1 Rank>|<C2 Rank>`  
**API:** #3 (best local KW) + #4 (competitor ranks)  
**Selection:** Top local keyword by CPC, trim to ~15 chars

**Example:** `plastic NC|#1 C1|#2 C2`

---

### Row 16: Comp Hot Buttons
**Formula:** `<KW Gap %>|<Value Gap>|<Clicks Gap %>`  
**API:** #4 + #1  
**Calculations:**
- KW Gap: ((C1 KWs - Prospect KWs) / Prospect KWs) × 100
- Value Gap: C1 Value - Prospect Value
- Clicks Gap: ((C1 Clicks - Prospect Clicks) / Prospect Clicks) × 100

**Example:** `KWs +498%|$48K|Clicks +1161%`

---

### Rows 17-20: Client 1-4 Mo
**Formula:** `<KWs>|<Value>|<Clicks>|<Auth>`  
**API:** #1 (4 months historical)  
**Fields:**
- Mo1: 4 months ago (oldest)
- Mo2: 3 months ago
- Mo3: 2 months ago
- Mo4: Current (latest)

**Example Mo4:** `2,496 KWs|$8K|888 Clicks|36Au`

---

### Rows 21-23: Local KW L3-L5
**Formula:** `<Full KW>|<CPC>|<Rank>|<Volume>`  
**API:** #2 (rank 2-10) + #3 (rank 11-75)  
**Filters:**
- Contains city from 29,880 cities database
- Contains state (full name or abbreviation)
- Contains ZIP code (5-digit or ZIP+4)

**Sorting:** By `exactCostPerClick` DESC  
**Examples:**
- L3: `charleston surgery|$7.3|#10|73mo`
- L4: `greensboro botox|$6.5|#35|100mo`
- L5: `raleigh lipo|$5.8|#50|80mo`

---

### Rows 24-28: LowHang1-5
**Formula:** `<Full KW>|<CPC>|<Rank>|<Volume>`  
**API:** #2 (rank 2-10) + #3 (rank 11-75)  
**Selection:** Top 5 non-#1 keywords by `exactCostPerClick`

**Examples:**
- LowHang1: `jawline surgery men|$7.3|#10|73mo`
- LowHang2: `buttock lift|$7.9|#12|150mo`
- LowHang3: `liposuction cost|$8.5|#15|200mo`
- LowHang4: `chin implant cost|$8.2|#9|210mo`
- LowHang5: `facelift surgery|$7|#20|180mo`

---

### Rows 29-32: Money KW2-5
**Formula:** `<Full KW>|<CPC>|<Rank>|<Volume>`  
**API:** #2 + #3  
**Selection:** 2nd-5th highest CPC in ranks 2-75

**Examples:**
- Money KW2: `blepharoplasty recovery|$6.9|#8|180mo`
- Money KW3: `tummy tuck recovery|$6.8|#25|160mo`
- Money KW4: `rhinoplasty cost|$6.5|#30|140mo`
- Money KW5: `breast augmentation|$6.2|#40|120mo`

---

## 💾 Output Format

### **CSV Structure:**
```csv
domain,company_name,contact_name,phone,snapshot,page1,page2,quickwins,historicaltrend,localkw_l1,localkw_l2,kwtraffic,topcpckw,toptraffickw,competitor1,competitor2,competitorranks,competitor3,competitor4,comphotbuttons,client1mo,client2mo,client3mo,client4mo,localkw_l3,localkw_l4,localkw_l5,lowhang1,lowhang2,lowhang3,lowhang4,lowhang5,moneykw2,moneykw3,moneykw4,moneykw5
rhmd.com,RHMD,John,555-1234,"2,496 KWs | $8,281 | 888 Clicks |36A","233/9.3% | 30 #1 | 219 T3 | 14 4-10",...
```

---

## 🧮 CTR (Click-Through Rate) Lookup Table

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

## 🎯 API to Nugget Mapping

| API | Nuggets Using It |
|-----|------------------|
| **API #1** | Snapshot, Historical Trend, Client 1-4 Mo, Comp Hot Buttons, All Competitors |
| **API #2** | Page 1, Quick Wins, Local L1-L5, LowHang1-5, Top CPC/Traffic, Money KW2-5 |
| **API #3** | Page 2, Quick Wins, Local L1-L5, LowHang1-5, Top CPC/Traffic, Money KW2-5 |
| **API #4** | Competitors 1-4, Comp Hot Buttons, Competitor Ranks |

---

## 📝 Implementation Pseudocode

```javascript
async function generateRankingNuggets(domain) {
  // Fetch all API data
  const trends = await fetchAPI1(domain); // 4 months
  const page1 = await fetchAPI2(domain); // Rank 1-10
  const money = await fetchAPI3(domain); // Rank 11-75
  const competitors = await fetchAPI4(domain); // Optional
  
  // Calculate nuggets
  const nuggets = {
    snapshot: formatSnapshot(trends[3]),
    page1: formatPage1(page1, trends[3].totalOrganicResults),
    page2: formatPage2(money),
    quickwins: formatQuickWins(page1, money),
    historicaltrend: formatPeakLoss(trends),
    localkw_l1: formatLocalKW(page1, money, 1),
    localkw_l2: formatLocalKW(page1, money, 2),
    localkw_l3: formatLocalKW(page1, money, 3),
    // ... continue for all 32
  };
  
  return nuggets;
}

function formatSnapshot(currentMonth) {
  const kws = currentMonth.totalOrganicResults.toLocaleString();
  const value = formatCurrency(currentMonth.monthlyOrganicValue);
  const clicks = currentMonth.monthlyOrganicClicks;
  const auth = currentMonth.strength;
  return `${kws} KWs | ${value} | ${clicks} Clicks |${auth}A`;
}

function formatLocalKW(page1Data, moneyData, position) {
  const allKWs = [...page1Data, ...moneyData];
  const localKWs = allKWs
    .filter(kw => kw.rank >= 2 && kw.rank <= 75)
    .filter(kw => hasLocalIdentifier(kw.keyword))
    .sort((a, b) => (b.exactCostPerClick || 0) - (a.exactCostPerClick || 0));
  
  const kw = localKWs[position - 1];
  if (!kw) return "No local keywords";
  
  const cpc = (kw.exactCostPerClick || kw.broadCostPerClick).toFixed(1);
  let data = `${kw.keyword}|#${kw.rank}|$${cpc}`;
  
  // Add volume for L3+
  if (position >= 3) {
    data += `|${kw.searchVolume}mo`;
  }
  
  // Trim if >40 chars
  if (data.length > 40) {
    const trimmed = kw.keyword.substring(0, 20) + "...";
    data = `${trimmed}|#${kw.rank}|$${Math.floor(cpc)}`;
  }
  
  return data.substring(0, 40);
}
```

---

## 🚨 Edge Cases & Handling

| Scenario | Handling |
|----------|----------|
| No local keywords found | Show "No local KWs found" or next best keyword |
| Domain has 0 keywords | Show "No SEO data" for all nuggets |
| API returns null CPC | Fall back to `broadCostPerClick` or 0 |
| Keyword name too long | Trim keyword, prioritize rank/CPC display |
| All keywords at #1 | Show "All top ranked" for LowHang |
| No competitors found | Show "No competitors" or skip API #4 |
| Historical trend all positive | Show gains instead of losses |

---

**File Location:** `/home/user/webapp/RANKING_NUGGETS_SPEC.md`  
**Related Files:**
- `seo_dashboard.csv` (uploaded by user)
- `instructions.md` (uploaded by user)
- `PROJECT_HANDOFF.md` (existing project context)

**Status:** Complete specification ready for implementation  
**Next Step:** Build CSV enhancement tool that generates these 32 nuggets
