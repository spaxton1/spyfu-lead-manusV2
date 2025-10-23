# SpyFu API Testing Log

## Purpose
Testing SpyFu API endpoints to determine the most cost-effective way to gather domain overview statistics for lead enrichment. Target budget: $0.10-0.12 per lead maximum.

---

## Test #1: Domain Stats - Historical Monthly Time Series

**What This Data Gets:**  
Monthly historical statistics including keyword count, traffic value, and clicks for each month from domain's first appearance in SpyFu database to present.

**API Endpoint:**  
`GET https://api.spyfu.com/apis/domain_stats_api/v2/getAllDomainStats`

**Exact Request:**
```
GET /apis/domain_stats_api/v2/getAllDomainStats?domain=salemplasticsurgery.com
Headers:
  Authorization: Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ
  Accept: application/json
```

**Test Domain:** salemplasticsurgery.com

**Results:**
- **Total Keywords Ranking (Latest Month):** 1,878
- **Monthly Traffic Value:** $15,950.00
- **Monthly Organic Clicks:** 1,442
- **Data Date:** September 2025

**API Metrics:**
- **Rows Returned:** 209
- **API Cost:** $0.1045
- **Cost Formula:** (209 rows / 1000) × $0.50 = $0.1045

**Notes:**
- ✅ Returns complete historical data from May 2008 to September 2025
- ❌ Cannot limit to last 3 months - tested parameters: startDate, endDate, startMonth, startYear, endMonth, endYear, limit, maxResults, pageSize (none work)
- ⚠️ Always returns full history regardless of parameters
- 💡 Can extract last 3 months client-side, but still charged for 209 rows
- 📊 Each monthly record contains: searchMonth, searchYear, totalOrganicResults, monthlyOrganicValue, monthlyOrganicClicks, averageOrganicRank, monthlyPaidClicks, averageAdRank, monthlyBudget, totalAdsPurchased, strength, totalInverseRank

**Cost Analysis:**
- Per domain: $0.1045
- For 30 domains: ~$3.14 total
- Within budget: ✅ Yes (barely, at $0.10/lead target)

**Decision:** ⏸️ PENDING - Need to test other endpoints to compare cost vs. data quality

---

## Next Tests to Run:

- [ ] Test #2: getLiveSeoStats endpoint (current snapshot only?)
- [ ] Test #3: Domain overview/summary endpoint (if exists)
- [ ] Test #4: Keyword list with current ranks only

---

*Last Updated: 2025-10-22*
