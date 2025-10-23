# SpyFu API Analysis - Final Findings

## 🎯 CRITICAL DISCOVERY

**The `getJustFellOffKeywords` API endpoint does NOT return keywords that fell FROM Page 1 (1-10) TO Page 2+ (11+) as expected.**

## 📊 Complete Test Results

### Test Configuration:
- **Endpoint**: `GET /apis/serp_api/v2/seo/getJustFellOffKeywords`
- **Parameters**: `query={domain}&country=US&pageSize=500&page=1`
- **Domains Tested**: 10 domains (medical, chiropractic, home improvement)
- **Total Keywords Analyzed**: 141

### Results:
```
Domain                     | Keywords Returned | TRUE Page 1→2+ Drops | API Cost
---------------------------|-------------------|---------------------|----------
salemplasticsurgery.com    |        45         |          0          | $0.0225
aestheticinstitute.ie      |         2         |          0          | $0.0010
coppellwellness.com        |         0         |          0          | $0.0000
healthwestchiro.com        |         0         |          0          | $0.0000
100percentdoc.com          |         0         |          0          | $0.0000
axiominjury.com            |         1         |          0          | $0.0005
houstonbackandneck.com     |         0         |          0          | $0.0000
alignwc.com                |        89         |          0          | $0.0445
infinityspine.com          |         0         |          0          | $0.0000
painreliefkc.com           |         4         |          0          | $0.0020
---------------------------|-------------------|---------------------|----------
TOTALS                     |       141         |          0          | $0.0705
```

## 🔍 What the API Actually Returns

### API Behavior:
The `getJustFellOffKeywords` endpoint returns keywords with ranking changes, but when we analyze them:

- **ALL 141 keywords** had **negative `rankChange`** values
- Negative rankChange = keyword IMPROVED (got closer to #1)
- **0 keywords** dropped from Page 1 (1-10) to Page 2+ (11+)

### Example from salemplasticsurgery.com:
```
Keyword: "liposuction flanks"
  Current Rank: 11
  Rank Change: -3
  Previous Rank: 14
  Status: IMPROVED from #14 to #11 (NOT a fell-off keyword)

Keyword: "smart lipo triplex"
  Current Rank: 16
  Rank Change: -12
  Previous Rank: 28
  Status: IMPROVED from #28 to #16 (NOT a fell-off keyword)
```

## 🚫 Why This API Doesn't Work for Your Use Case

### Your Requirement:
Find keywords that:
1. **WERE** ranking Page 1 (positions 1-10) last month
2. **NOW** ranking Page 2+ (positions 11+) this month
3. For use in cold calling: "You dropped from #5 to #13"

### What API Returns:
Keywords with recent ranking changes that:
- Mostly IMPROVED (moved toward #1)
- Were already on Page 2+ and moved around
- Do NOT meet the "fell off Page 1" criteria

## 💡 Key Learnings

### 1. PageSize Parameter is CRITICAL
```javascript
// ❌ WRONG - Returns only 5 results (default)
?query=domain.com&country=US

// ✅ CORRECT - Returns up to 500 results
?query=domain.com&country=US&pageSize=500
```

### 2. Rank Change Semantics
```javascript
previousRank = currentRank - rankChange

Examples:
  rankChange = -3: Keyword IMPROVED (moved toward #1)
  rankChange = +3: Keyword DECLINED (moved away from #1)
```

### 3. API Name is Misleading
Despite the name "getJustFellOffKeywords", this endpoint:
- Does NOT specifically return Page 1 → Page 2+ drops
- Returns keywords with any recent ranking changes
- Primarily returns IMPROVEMENTS in our testing

## 📋 What You Need to Do Next

### Option 1: Test Different Domains
The 10 test domains might just happen to have no fell-off keywords in this time period. Try:
- Larger domains with more keywords
- Domains in more competitive niches
- Domains you KNOW have lost rankings recently

### Option 2: Check Different Time Periods
The API might be looking at a specific date range. Contact SpyFu support to ask:
- What time period does `getJustFellOffKeywords` analyze?
- Is there a way to specify custom date ranges?
- Are there recent data updates that might affect results?

### Option 3: Use Alternative SpyFu Endpoints
Based on the documentation, these endpoints might work better:

#### A. `getSeoKeywords` with filtering
```bash
GET /apis/serp_api/v2/seo/getSeoKeywords?query=domain.com&pageSize=5000
```
Then filter client-side for:
- Previous rank 1-10 AND current rank 11+

#### B. `getKeywordHistory` 
If available, this might show month-over-month rank changes:
```bash
GET /apis/keyword_api/v2/keyword_history?keyword={keyword}&domain={domain}
```

#### C. Direct SpyFu Support
Contact api@spyfu.com and ask:
> "We need keywords that were Page 1 (ranks 1-10) last month and are now Page 2+ (ranks 11+) this month. Which endpoint should we use? We tried `getJustFellOffKeywords` but it only returns keywords that improved in rankings."

## 💰 Budget Impact

### Current Costs (This Test):
- **Total**: $0.0705 for 10 domains
- **Per Domain**: $0.0071 average
- **Well under budget**: Target is $0.10-0.12 per lead

### If We Use getSeoKeywords Instead:
Estimated cost to fetch ALL keywords and filter client-side:
- **salemplasticsurgery.com**: 1,878 keywords × $0.50/1000 = $0.94
- **alignwc.com**: 4,715 keywords × $0.50/1000 = $2.36
- **Projected for 30 domains**: $15-30 total

⚠️ **This would exceed budget** - need more targeted endpoint

## 🎯 Recommended Next Steps

1. **Test with different domains** - Try domains you KNOW lost rankings
2. **Contact SpyFu Support** - Get official guidance on correct endpoint
3. **Consider manual verification** - Spot-check a few keywords in SpyFu UI
4. **Explore `getSeoKeywords`** - Might be more reliable with client-side filtering
5. **Check for date range parameters** - Ensure we're looking at the right time period

## 📁 Files Generated

- `true_page1_fell_off_report.json` - Complete JSON data (141 keywords, 0 fell-off)
- `true_page1_fell_off_report.csv` - Excel-ready format
- `get_true_page1_fell_off.js` - Production script with pageSize=500

## 🔧 Script Configuration

The correct API call format:
```javascript
const params = new URLSearchParams({
  query: domain,
  country: 'US',
  pageSize: '500',  // CRITICAL: Must specify (default is 5)
  page: '1'
});

const url = '/apis/serp_api/v2/seo/getJustFellOffKeywords?' + params.toString();

const options = {
  hostname: 'api.spyfu.com',
  path: url,
  method: 'GET',
  headers: {
    'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ',
    'Accept': 'application/json'
  }
};
```

## ❓ Questions for SpyFu Support

1. What does `getJustFellOffKeywords` actually return?
2. What time period does it analyze (last week? last month? last quarter)?
3. Why are all results showing improvement (negative rankChange)?
4. Is there a way to filter for "was Page 1, now Page 2+"?
5. Would `getSeoKeywords` be better for our use case?
6. Are there any undocumented parameters that filter by previous rank?

---

**Report Generated**: October 23, 2025  
**Test Status**: ✅ Complete - API working correctly, just not returning expected data  
**Next Action**: Contact SpyFu support OR test with different domains
