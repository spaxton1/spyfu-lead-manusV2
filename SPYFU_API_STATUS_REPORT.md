# SpyFu API Status Report - October 23, 2025

## 🚨 CRITICAL ISSUE: Complete API Outage

### Current Status: **ALL ENDPOINTS DOWN**

All SpyFu API endpoints are returning **500 Internal Server Errors** with empty response bodies.

### Endpoints Tested (All Failed):
1. ✗ `domain_stats_api/v2/domain/{domain}` - Basic domain stats
2. ✗ `serp_api/v2/seo/getJustFellOffKeywords/{domain}` - Fell off keywords
3. ✗ `serp_api/v2/seo/getLostRanksKeywords?query={domain}` - Lost ranks
4. ✗ `serp_api/v2/seo/getLostRanksKeywords/{domain}` - Lost ranks (path format)

### API Response Details:
- **Status Code:** 500 (all requests)
- **Response Body:** Empty
- **Server:** Microsoft-IIS/10.0
- **Headers:** No error details provided

### Timeline:
- **Previous Success:** API was working successfully during initial testing
- **Current Status:** Complete outage as of 04:04 GMT, Oct 23, 2025
- **Domains Tested:** salemplasticsurgery.com, alignwc.com

---

## 📊 Previous Analysis Summary (Before Outage)

### ✅ What We Successfully Discovered:

#### 1. **getJustFellOffKeywords API Problem**
- **Issue:** Returns keywords moving around on Page 2+, NOT keywords that fell FROM Page 1 TO Page 2+
- **Analysis Results:**
  - 141 keywords analyzed across 10 domains
  - **0 TRUE fell-off keywords found** (keywords that dropped from positions 1-10 to 11+)
  - All keywords were already on Page 2+ (positions 11+) and just moved around
- **Conclusion:** Wrong endpoint for our use case

#### 2. **Rank Change Semantics Clarified**
- **Formula:** `previousRank = currentRank - rankChange`
- **Example:** If rankChange = -6 and currentRank = 13, then previousRank = 19
- **Meaning:** Keyword moved from #19 → #13 (IMPROVED, not fell off)
- **In Google rankings:** Lower number = better (#1 is best)

#### 3. **Data Enhancement Completed**
- ✅ Added `previousRank` to all fell-off reports
- ✅ Added `rankChange` field
- ✅ Added `seoClicks` and `seoClicksChange` fields
- ✅ Updated CSV and JSON exports with full historical data

---

## 🎯 Next Steps (When API Recovers)

### Immediate Priority: Test `getLostRanksKeywords` API

This endpoint is specifically designed for keywords that **lost rank** vs previous month and remain in top 100.

#### Research Findings:
- **Purpose:** Returns keywords where domain's organic positions declined
- **URL Format:** `https://api.spyfu.com/apis/serp_api/v2/seo/getLostRanksKeywords?query=domain.com`
- **Key Difference:** Tracks rank loss (getting worse), not just falling outside top 100
- **Available Fields:** keyword, rank, rankChange, searchVolume, topRankedUrl, keywordDifficulty, CPC data, seoClicks, seoClicksChange

#### Expected Filter Parameters (To Test):
Based on SpyFu API patterns, likely supports:
- `rank.min` / `rank.max` - Current rank range
- `previousRank.min` / `previousRank.max` - Historical rank range  
- `pageSize` - Number of results per page
- `page` - Pagination

#### Target Filter Configuration:
```
previousRank: 1-10 (was on Page 1)
currentRank: 11-100 (now on Page 2+)
```

This should give us **TRUE fell-off keywords** for cold calling.

---

## 🔬 Testing Plan (When API is Back Online)

### Phase 1: Basic Connectivity Test
```bash
# Test domain stats API (simplest endpoint)
GET /apis/domain_stats_api/v2/domain/alignwc.com?useCache=1
Expected: 200 OK with domain data
```

### Phase 2: Verify getLostRanksKeywords Works
```bash
# Test without filters
GET /apis/serp_api/v2/seo/getLostRanksKeywords?query=alignwc.com&pageSize=10
Expected: 200 OK with keyword array
```

### Phase 3: Test Filter Parameters
```bash
# Test with rank filters (if supported)
GET /apis/serp_api/v2/seo/getLostRanksKeywords?query=alignwc.com&pageSize=100&rank.min=11&rank.max=100

# Or with previous rank filters
GET /apis/serp_api/v2/seo/getLostRanksKeywords?query=alignwc.com&pageSize=100&previousRank.min=1&previousRank.max=10&currentRank.min=11&currentRank.max=100
```

### Phase 4: Analyze Results
- Calculate previousRank for each keyword
- Filter for TRUE fell-off: previousRank 1-10, currentRank 11+
- Compare with getJustFellOffKeywords results
- Verify we get actionable cold calling data

### Phase 5: Full Production Script
If `getLostRanksKeywords` provides TRUE fell-off data:
1. Create `get_lost_ranks_keywords.js` script
2. Run on all 10 test domains
3. Generate updated reports with verified data
4. Expand to full 30-domain list
5. Proceed with dashboard creation

---

## 💰 Budget Impact

### Current API Costs (From Previous Analysis):
- **Total Cost:** $0.4820 for 10 domains
- **Average per Domain:** $0.0482
- **Budget Status:** 52% under minimum threshold ($0.10/lead)
- **Projected for 30 domains:** $1.08-$1.48

### Estimated Cost for getLostRanksKeywords:
- **Cost Formula:** (rows returned / 1000) × $0.50
- **Expected rows per domain:** 50-100 keywords (based on domain size)
- **Estimated cost per domain:** $0.025-$0.050
- **Still well under budget threshold**

---

## 📞 Cold Calling Strategy (When Data is Ready)

### What We Need:
✅ Keywords that TRULY fell from Page 1 (1-10) to Page 2+ (11+)  
✅ Previous rank and current rank for each keyword  
✅ Search volume and CPC for value calculation  
✅ SEO clicks lost for impact demonstration

### Cold Calling Script Template:
```
"Hi [NAME], I'm calling because I noticed your website dropped from 
position #[OLD_RANK] to #[NEW_RANK] for '[KEYWORD]' - a search term 
that gets [VOLUME] searches per month worth $[CPC] per click.

You're losing approximately [SEO_CLICKS_LOST] clicks per month on 
this keyword alone. We specialize in recovering these lost rankings 
for medical practices like yours..."
```

---

## 🔍 Alternative Data Sources (If API Issues Persist)

If SpyFu API continues to have issues:

1. **Google Search Console API** - Direct ranking data from Google
2. **SEMrush API** - Similar competitive intelligence
3. **Ahrefs API** - Comprehensive backlink and keyword data
4. **Moz API** - Domain authority and keyword rankings
5. **Manual SpyFu Export** - If API unavailable but UI works

---

## 📝 Action Items

### Immediate (When API Recovers):
- [ ] Test basic API connectivity
- [ ] Verify `getLostRanksKeywords` endpoint works
- [ ] Identify correct filter parameter names
- [ ] Test filtering for Page 1 to Page 2+ drops
- [ ] Create production script if successful

### If getLostRanksKeywords Works:
- [ ] Update all scripts to use correct endpoint
- [ ] Re-run analysis on 10 test domains
- [ ] Verify we get TRUE fell-off keywords
- [ ] Generate updated reports
- [ ] Expand to full 30-domain list

### If API Issues Persist:
- [ ] Contact SpyFu support for API status
- [ ] Check SpyFu status page
- [ ] Evaluate alternative data sources
- [ ] Consider manual data export workflow

---

## 📞 Support Contacts

**SpyFu API Support:**
- Documentation: https://developer.spyfu.com
- Email: api@spyfu.com
- Status Page: https://status.spyfu.com (check if exists)

---

## 🎯 Expected Outcome

Once API is back and `getLostRanksKeywords` is properly configured:

### Sample Output Format:
```
salemplasticsurgery.com | plastic surgeon salem or | Old Rank #5 | New Rank #14 | 390 vol | $12.50 CPC | -8 clicks | $0.0050
salemplasticsurgery.com | liposuction cost salem | Old Rank #3 | New Rank #11 | 220 vol | $8.45 CPC | -6 clicks | $0.0050
```

### Dashboard Creation:
- **5 layouts** showing different data visualization approaches
- **3 price tiers** ($0.10-0.12, $0.12-0.15, $0.15-0.20 per lead)
- **15 rows max** per dashboard (above the fold)
- **Pipe-separated format** for easy parsing
- **Compelling cold calling angles** for each keyword

---

**Report Generated:** October 23, 2025 04:04 GMT  
**Status:** Waiting for SpyFu API to come back online  
**Next Check:** Retry API calls in 15-30 minutes
