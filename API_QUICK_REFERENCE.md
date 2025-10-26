# SpyFu API Quick Reference
## All Available Data Sources for CSV Enhancement

---

## 📊 4 API Endpoints Available

### API #1: Domain Trends (4-Month History)
**Endpoint:** `getLatestDomainStats?domain=example.com&pastNMonths=4`  
**Cost:** $0.0020 per domain  
**What You Get:**
- Total keywords ranking (per month × 4)
- Monthly organic value in $ (per month × 4)
- Monthly organic clicks (per month × 4)
- Domain authority score (per month × 4)
- Average ranking position (per month × 4)

**Calculated Metrics:**
- Peak value decline (e.g., "Lost $3,159 in 2 months")
- Keyword growth/loss
- Traffic trends
- Authority changes

---

### API #2: Page 1 Keywords (Rank 1-10)
**Endpoint:** `getSeoKeywords?query=example.com&rank.min=1&rank.max=10`  
**Cost:** $0.00-0.27 per domain (varies by keyword count)  
**What You Get:**
- All keywords ranking positions 1-10
- Search volume per keyword
- CPC (cost per click) per keyword
- Keyword difficulty scores
- Ranking URLs

**Calculated Metrics:**
- Total Page 1 keywords
- #1 position count
- Top 3 position count
- Page 1 percentage
- Low-hanging fruit (high CPC, not at #1)
- Average Page 1 CPC

---

### API #3: Money Keywords (Rank 11-75, High CPC)
**Endpoint:** `getMostValuableKeywords?query=example.com&rank.min=11&rank.max=75&costPerClick.min=1`  
**Cost:** $0.0133 per domain  
**What You Get:**
- High-value keywords on pages 2-8
- Exact match CPC for each keyword
- Search volume per keyword
- Ranking positions 11-75

**Calculated Metrics:**
- Top 5 Money Keywords (highest CPC)
- Top 3 Local Keywords (city/state names)
- Total money keyword count
- Average money keyword CPC
- Potential traffic value

**Local Detection:**
- 29,880 US cities database
- All 50 states (full names + abbreviations)
- ZIP codes (5-digit and ZIP+4)
- Excludes generic: "near me", "local", "city"

---

### API #4: SERP Competitors (OPTIONAL)
**Endpoint:** `getSerpAnalysisKeywords?Keyword={keyword}&pageSize=10`  
**Cost:** $0.0210 per domain ($0.0050 + $0.0020 × 8 competitors)  
**What You Get:**
- Top 10 domains ranking for your best keyword
- Full domain stats for each competitor:
  - Total keywords
  - Monthly organic value
  - Monthly organic clicks
  - Domain authority
  - Average rank

**Calculated Metrics:**
- Authority gap (you vs top competitor)
- Traffic gap in dollars
- Top competitor identity
- Average competitor strength
- Your SERP position
- Competitor count (after filtering)

**Filters Out:**
- Social media (Facebook, LinkedIn, etc.)
- Directories (Yelp, Healthgrades, etc.)
- Generic sites (WebMD, Wikipedia, etc.)

---

## 💰 Cost Summary

| Configuration | Cost | What's Included |
|--------------|------|-----------------|
| **Minimal** | $0.0020 | API #1 only (trends) |
| **Basic** | $0.15 | APIs #1, #2, #3 (no competitors) |
| **Full** | $0.17 | All 4 APIs (with competitors) |

**Your Budget:** $0.10-0.12 per lead  
**Reality Check:** Basic package ($0.15) is slightly over budget but provides comprehensive data  
**Recommendation:** Start with Basic (APIs #1, #2, #3), add API #4 only if competitive intel is crucial

---

## 📋 Available Fields for Your CSV (Choose 15 Above-the-Fold)

### Domain Overview (6)
1. Domain Name
2. Total Keywords
3. Monthly Organic Value ($)
4. Monthly Clicks
5. Domain Authority
6. Average Rank

### Trend Signals (4)
7. Peak Value Decline
8. Keyword Change (+/-)
9. Click Change (+/-)
10. Trend Direction (↑↓→)

### Page 1 Performance (5)
11. Page 1 Keywords
12. Position #1 Count
13. Top 3 Count
14. Page 1 Percentage
15. Avg Page 1 CPC

### Top Opportunities (3)
16. Top Money Keyword
17. Top Local Keyword
18. Best Low-Hanging Fruit

### PPC Data (3)
19. Monthly PPC Budget
20. PPC Clicks
21. PPC Keywords

### Competitor Intel (5) - OPTIONAL
22. Top Competitor
23. Authority Gap
24. Traffic Gap ($)
25. Competitor Count
26. Your SERP Position

---

## 🎯 File Location

**This Reference:** `/home/user/webapp/API_QUICK_REFERENCE.md`  
**Full Data Catalog:** `/home/user/webapp/SPYFU_DATA_CATALOG.md`  
**Competitor Analysis:** `/home/user/webapp/competitor_summary.md`  
**Raw Test Data:** `/home/user/webapp/master_test_results.json`

---

**Next Step:** Tell me which 15 fields you want above-the-fold, and I'll build your CSV enhancement tool.
