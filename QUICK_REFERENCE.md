# Quick Reference Guide - SpyFu Lead Enrichment

## 🚨 Current Status

**API STATUS:** DOWN (all endpoints returning 500 errors)  
**LAST CHECKED:** Oct 23, 2025 04:06 GMT

Check current status: `node check_api_status.js`

---

## 📊 Key Findings Summary

### ❌ What Doesn't Work: `getJustFellOffKeywords`
- Returns keywords moving around on Page 2+ 
- NOT keywords that fell FROM Page 1 TO Page 2+
- **0 out of 141 keywords** were TRUE fell-off keywords

### ✅ What Should Work: `getLostRanksKeywords`
- Returns keywords that lost rank vs previous month
- Remains in top 100 positions
- Need to test with filters for Page 1 → Page 2+ drops

---

## 💰 Cost Analysis (10 Domains)

| Metric | Value |
|--------|-------|
| Total Cost | $0.4820 |
| Per Domain | $0.0482 |
| Budget Target | $0.10-0.12 |
| Status | ✅ 52% UNDER budget |
| Projected (30 domains) | $1.08-$1.48 |

---

## 🎯 What We Need

### TRUE Fell-Off Keyword Criteria:
1. ✅ **Previous Rank:** 1-10 (was on Page 1)
2. ✅ **Current Rank:** 11+ (now on Page 2+)
3. ✅ **Has Search Volume:** Minimum 50+ searches/month
4. ✅ **Has Commercial Value:** CPC > $1.00 preferred

### Data Fields Required:
- `keyword` - The search term
- `previousRank` - Where it was (1-10)
- `currentRank` - Where it is now (11+)
- `rankChange` - Positions lost
- `searchVolume` - Monthly searches
- `cpc` - Cost per click value
- `seoClicks` - Estimated clicks received
- `seoClicksChange` - Clicks lost

---

## 🔬 Testing Commands

### Check API Status:
```bash
# Single check
node check_api_status.js

# Monitor mode (checks every 5 mins)
node check_api_status.js monitor 5
```

### Test getLostRanksKeywords (when API is up):
```bash
# Basic test
curl -u AF56E8D4-2E20-4F47-A68A-2D9D7F8D9B39: \
  'https://api.spyfu.com/apis/serp_api/v2/seo/getLostRanksKeywords?query=alignwc.com&pageSize=10'

# With filters (test different parameter formats)
curl -u AF56E8D4-2E20-4F47-A68A-2D9D7F8D9B39: \
  'https://api.spyfu.com/apis/serp_api/v2/seo/getLostRanksKeywords?query=alignwc.com&pageSize=100&rank.min=11'
```

---

## 📝 Rank Change Math

### Formula:
```
previousRank = currentRank - rankChange
```

### Examples:

| Current | Change | Previous | Meaning |
|---------|--------|----------|---------|
| 13 | -6 | 19 | #19→#13 (IMPROVED ✅) |
| 13 | +8 | 5 | #5→#13 (FELL OFF ❌) |
| 25 | +15 | 10 | #10→#25 (FELL OFF ❌) |
| 8 | -3 | 11 | #11→#8 (IMPROVED ✅) |

**In Google rankings:** Lower number = Better (#1 is best)

---

## 📋 Next Action Items

### When API is Online:
1. Run `node check_api_status.js` - Verify it's back
2. Test `getLostRanksKeywords` without filters
3. Find correct filter parameter names
4. Test with rank filters
5. Create `get_lost_ranks_keywords.js` script
6. Run on all 10 test domains
7. Verify TRUE fell-off keywords found
8. Expand to 30 domains
9. Generate final reports

### While Waiting:
1. Design 5 dashboard layouts
2. Create cold calling scripts
3. Define pricing tier specifications
4. Review alternative APIs (backup plan)

---

## 🎨 Dashboard Requirements

### Layouts Needed: 5 different designs
### Price Tiers: 3 levels

#### Budget: $0.10-0.12 per lead
- 10-12 data rows max
- Essential metrics only
- Highest-impact keywords

#### Mid: $0.12-0.15 per lead
- 15 data rows
- Full SEO metrics
- Search volume + CPC data

#### Premium: $0.15-0.20 per lead
- Complete profile
- All fell-off keywords
- Historical trends
- Competitor data

### Output Format:
```
domain.com | keyword | Old Rank #X | New Rank #Y | vol | CPC | clicks | cost
```

---

## 🎤 Cold Calling Template

```
Hi [NAME],

I'm calling because I noticed your website dropped from 
position #[OLD] to #[NEW] for "[KEYWORD]" - a search 
term that gets [VOLUME] searches per month.

You're losing approximately [LOST_CLICKS] clicks per 
month, which at $[CPC] per click means you're missing 
out on $[LOST_VALUE] worth of traffic monthly.

We specialize in recovering these lost Page 1 rankings 
for [INDUSTRY] practices like yours. Can I show you 
exactly which keywords you've lost and our recovery 
strategy?
```

### Calculate Lost Value:
```javascript
lostValue = seoClicksChange × cpc
monthlyImpact = Math.abs(lostValue)
```

---

## 📁 File Structure

```
webapp/
├── check_api_status.js              ✅ API monitoring
├── get_fell_off_keywords.js         ❌ OLD (wrong endpoint)
├── get_true_fell_off_keywords.js    ⚠️  Filter script (0 results)
├── get_lost_ranks_keywords.js       ⏳ TO CREATE
│
├── api_cost_breakdown.json          ✅ Cost data
├── api_cost_breakdown.csv           ✅ Excel export
├── fell_off_keywords_report.json    ⚠️  Wrong data
├── fell_off_keywords_report.csv     ⚠️  Wrong data
│
├── SPYFU_API_STATUS_REPORT.md       ✅ Detailed status
├── NEXT_STEPS_SUMMARY.md            ✅ Action plan
├── QUICK_REFERENCE.md               ✅ This file
├── FELL_OFF_KEYWORDS_UPDATE.md      ✅ Enhancement docs
└── API_COST_ANALYSIS_SUMMARY.md     ✅ Cost analysis
```

---

## 🔍 Filter Parameters to Test

When API is back, test these parameter formats:

### Current Rank Filters:
```
?rank.min=11&rank.max=100
?rankMin=11&rankMax=100
?rank_min=11&rank_max=100
?currentRank.min=11&currentRank.max=100
```

### Previous Rank Filters:
```
?previousRank.min=1&previousRank.max=10
?previous_rank_min=1&previous_rank_max=10
?prevRank.min=1&prevRank.max=10
```

### Combined:
```
?previousRank.min=1&previousRank.max=10&currentRank.min=11&currentRank.max=100
```

---

## 🎯 Success Metrics

### Per Domain:
- ✅ 20+ TRUE fell-off keywords found
- ✅ API cost < $0.12
- ✅ Avg search volume > 100/month
- ✅ Avg CPC > $3.00

### Full Project (30 domains):
- ✅ 600+ total fell-off keywords
- ✅ Total API cost < $3.60 ($0.12 × 30)
- ✅ All data exportable to CSV
- ✅ Cold calling scripts ready
- ✅ 5 dashboard layouts complete
- ✅ 3 pricing tiers defined

---

## 🆘 Troubleshooting

### If API stays down:
1. Check SpyFu status page
2. Contact api@spyfu.com
3. Wait 24 hours
4. Consider alternative APIs:
   - Google Search Console API
   - SEMrush API
   - Ahrefs API

### If getLostRanksKeywords doesn't work:
1. Verify endpoint URL format
2. Test different parameter names
3. Check API plan includes this endpoint
4. Contact SpyFu support

### If no TRUE fell-off keywords found:
1. Verify filter logic is correct
2. Check previousRank calculation
3. Try different domains (bigger sites)
4. Lower filter threshold (try Page 1 → Page 3)

---

## 📞 Support Resources

**SpyFu API Documentation:**  
https://developer.spyfu.com

**API Key:** (in environment variable)  
`AF56E8D4-2E20-4F47-A68A-2D9D7F8D9B39`

**Test Domain:**  
`alignwc.com` (4,715 keywords, 535 in top 10)

---

## ⚡ Quick Commands

```bash
# Check API
node check_api_status.js

# Monitor API (every 5 min)
node check_api_status.js monitor 5

# View cost data
cat api_cost_breakdown.csv

# View status report
cat SPYFU_API_STATUS_REPORT.md

# View next steps
cat NEXT_STEPS_SUMMARY.md
```

---

**Last Updated:** Oct 23, 2025 04:07 GMT  
**Status:** Waiting for API recovery  
**Ready to proceed:** Yes - all research complete!
