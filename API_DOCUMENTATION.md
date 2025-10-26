# 🔌 SpyFu API Documentation

## Overview

This document provides detailed information about all 4 SpyFu API endpoints used by the Lead Intelligence Platform, including request formats, response structures, error handling, and cost calculations.

## Authentication

All SpyFu API requests require authentication via API key.

**API Key:** `MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ`

**Authentication Method:**
- API key passed as query parameter: `?api_key={YOUR_KEY}`
- Base URL: `https://www.spyfu.com/api/`

**Example Request:**
```bash
curl "https://www.spyfu.com/apis/core_reports_api/getLatestDomainStats?domain=rhmd.com&api_key=MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ"
```

## API Tier Pricing

| Tier | Cost/Lead | APIs Included | Use Case |
|------|-----------|---------------|----------|
| **Minimal** | $0.002 | API #1 only | Basic trending data |
| **Partial** | $0.15 | APIs #1-3 | Full data except competitors |
| **Full** | $0.17 | All 4 APIs | Complete intelligence |

## Rate Limiting

**SpyFu Limits:**
- 120 requests per minute
- No daily limit on paid plans

**Our Implementation:**
- Batch requests with 500ms delay between calls
- Retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
- Queue system for large imports

**Estimate:**
- 500 leads × 4 APIs = 2000 requests
- At 120 req/min = ~17 minutes processing time

---

## API #1: Domain Trends (4-Month History)

### Endpoint
```
GET /apis/core_reports_api/getLatestDomainStats
```

### Purpose
Get historical SEO performance data for a domain over the past 4 months.

### Cost
**$0.0020 per domain**

### Parameters
| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `domain` | Yes | String | Domain to analyze (e.g., "rhmd.com") |
| `pastNMonths` | No | Integer | Number of months (default: 4) |
| `api_key` | Yes | String | Authentication key |

### Request Example
```bash
curl "https://www.spyfu.com/apis/core_reports_api/getLatestDomainStats?domain=rhmd.com&pastNMonths=4&api_key=YOUR_KEY"
```

### Response Structure
```json
{
  "data": [
    {
      "DomainId": 12345,
      "Domain": "rhmd.com",
      "MonthId": 202312,
      "TotalOrganicKeywords": 47225,
      "OrganicValue": 15842,
      "OrganicClicks": 16731,
      "TotalPaidKeywords": 892,
      "PaidValue": 2341,
      "PaidClicks": 1245,
      "DomainAuthorityScore": 65
    },
    {
      "MonthId": 202311,
      "TotalOrganicKeywords": 51284,
      "OrganicValue": 18923,
      "OrganicClicks": 19842,
      "DomainAuthorityScore": 64
    },
    {
      "MonthId": 202310,
      "TotalOrganicKeywords": 49182,
      "OrganicValue": 17456,
      "OrganicClicks": 18234,
      "DomainAuthorityScore": 63
    },
    {
      "MonthId": 202309,
      "TotalOrganicKeywords": 48291,
      "OrganicValue": 16892,
      "OrganicClicks": 17654,
      "DomainAuthorityScore": 63
    }
  ]
}
```

### Response Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `DomainId` | Integer | SpyFu internal domain ID | 12345 |
| `Domain` | String | Domain name | "rhmd.com" |
| `MonthId` | Integer | Month in YYYYMM format | 202312 |
| `TotalOrganicKeywords` | Integer | Count of keywords ranking organically | 47225 |
| `OrganicValue` | Integer | Estimated monthly organic traffic value (USD) | 15842 |
| `OrganicClicks` | Integer | Estimated monthly organic clicks | 16731 |
| `TotalPaidKeywords` | Integer | Count of keywords in paid ads | 892 |
| `PaidValue` | Integer | Estimated monthly paid ad spend (USD) | 2341 |
| `PaidClicks` | Integer | Estimated monthly paid clicks | 1245 |
| `DomainAuthorityScore` | Integer | Domain authority (0-100 scale) | 65 |

### Used For
- **Nugget #1 (Snapshot)**: Current month metrics
- **Nugget #5 (Historical Trend)**: Peak decline analysis
- **Nuggets #17-20 (Client 1-4 Mo)**: Monthly performance

### Error Responses
```json
// Domain not found
{
  "error": "Domain not found in database",
  "code": 404
}

// Invalid API key
{
  "error": "Invalid authentication credentials",
  "code": 401
}

// Rate limit exceeded
{
  "error": "Rate limit exceeded. Try again in 60 seconds.",
  "code": 429
}
```

---

## API #2: Page 1 Keywords (Ranks 1-10)

### Endpoint
```
GET /apis/keyword_api_v2/getSeoKeywords
```

### Purpose
Get all keywords ranking on Page 1 (positions 1-10) with search volume, CPC, and click estimates.

### Cost
**$0.00-0.27 per domain** (varies by result count)

### Parameters
| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `query` | Yes | String | Domain to analyze |
| `rank.min` | No | Integer | Minimum rank (default: 1) |
| `rank.max` | No | Integer | Maximum rank (default: 10) |
| `pageSize` | No | Integer | Results per page (max: 5000) |
| `page` | No | Integer | Page number (default: 1) |
| `sortBy` | No | String | Sort field ("rank", "searches", "cpc") |
| `api_key` | Yes | String | Authentication key |

### Request Example
```bash
curl "https://www.spyfu.com/apis/keyword_api_v2/getSeoKeywords?query=rhmd.com&rank.min=1&rank.max=10&pageSize=5000&api_key=YOUR_KEY"
```

### Response Structure
```json
{
  "results": [
    {
      "Keyword": "holiday rambler",
      "Rank": 1,
      "MonthlySearches": 12100,
      "CostPerClick": 1.79,
      "EstimatedClicks": 4816,
      "Url": "https://rhmd.com/",
      "DaysRanked": 1825
    },
    {
      "Keyword": "holiday rambler rv",
      "Rank": 2,
      "MonthlySearches": 3600,
      "CostPerClick": 2.14,
      "EstimatedClicks": 673,
      "Url": "https://rhmd.com/holiday-rambler",
      "DaysRanked": 1642
    }
    // ... more keywords ...
  ],
  "totalResults": 51,
  "pageSize": 5000,
  "page": 1
}
```

### Response Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `Keyword` | String | The search keyword/phrase | "holiday rambler" |
| `Rank` | Integer | Current Google ranking position | 1 |
| `MonthlySearches` | Integer | Average monthly search volume | 12100 |
| `CostPerClick` | Float | Estimated CPC in USD | 1.79 |
| `EstimatedClicks` | Integer | Estimated monthly clicks | 4816 |
| `Url` | String | Landing page URL | "https://rhmd.com/" |
| `DaysRanked` | Integer | Days in this position | 1825 |

### Used For
- **Nugget #2 (Page 1)**: All ranks 1-10
- **Nugget #3 (Page 2)**: Ranks 11-20 (separate call)
- **Nugget #4 (Quick Wins)**: Ranks 2-10 (optimization targets)
- **Nuggets #6-7, 21-23 (Local L1-L5)**: Keywords with city names
- **Nugget #8 (KW Traffic)**: Sum of EstimatedClicks
- **Nugget #9 (Top CPC KW)**: Sorted by CostPerClick
- **Nugget #10 (Top Traffic KW)**: Sorted by EstimatedClicks
- **Nuggets #24-28 (LowHang 1-5)**: Quick win opportunities

### Additional Request - Page 2 Keywords
```bash
curl "https://www.spyfu.com/apis/keyword_api_v2/getSeoKeywords?query=rhmd.com&rank.min=11&rank.max=20&pageSize=5000&api_key=YOUR_KEY"
```

### Error Responses
```json
// No keywords found
{
  "results": [],
  "totalResults": 0
}

// Invalid rank range
{
  "error": "rank.min must be less than rank.max",
  "code": 400
}
```

---

## API #3: Money Keywords (Ranks 11-75, High CPC)

### Endpoint
```
GET /apis/keyword_api_v2/getMostValuableKeywords
```

### Purpose
Get high-value keywords (high CPC) ranking on pages 2-8 (positions 11-75).

### Cost
**$0.0133 per domain**

### Parameters
| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `query` | Yes | String | Domain to analyze |
| `rank.min` | No | Integer | Minimum rank (default: 11) |
| `rank.max` | No | Integer | Maximum rank (default: 75) |
| `pageSize` | No | Integer | Results per page (max: 100) |
| `api_key` | Yes | String | Authentication key |

### Request Example
```bash
curl "https://www.spyfu.com/apis/keyword_api_v2/getMostValuableKeywords?query=rhmd.com&rank.min=11&rank.max=75&pageSize=100&api_key=YOUR_KEY"
```

### Response Structure
```json
{
  "results": [
    {
      "Keyword": "holiday rambler parts",
      "Rank": 15,
      "MonthlySearches": 1900,
      "CostPerClick": 2.87,
      "MonthlyValue": 487.90,
      "EstimatedClicks": 170,
      "Url": "https://rhmd.com/parts",
      "Difficulty": 42
    },
    {
      "Keyword": "holiday rambler dealer near me",
      "Rank": 18,
      "MonthlySearches": 2400,
      "CostPerClick": 3.45,
      "MonthlyValue": 621.60,
      "EstimatedClicks": 180,
      "Url": "https://rhmd.com/dealers",
      "Difficulty": 38
    }
    // ... more keywords ...
  ],
  "totalResults": 20
}
```

### Response Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `Keyword` | String | The search keyword/phrase | "holiday rambler parts" |
| `Rank` | Integer | Current Google ranking position | 15 |
| `MonthlySearches` | Integer | Average monthly search volume | 1900 |
| `CostPerClick` | Float | Estimated CPC in USD | 2.87 |
| `MonthlyValue` | Float | Estimated monthly traffic value | 487.90 |
| `EstimatedClicks` | Integer | Estimated monthly clicks | 170 |
| `Url` | String | Landing page URL | "https://rhmd.com/parts" |
| `Difficulty` | Integer | SEO difficulty score (0-100) | 42 |

### Used For
- **Nugget #16 (Comp Hot Buttons)**: Top 3 money keywords
- **Nuggets #29-32 (Money KW 2-5)**: Keywords ranked #2-5 by CPC

### Error Responses
```json
// No valuable keywords found
{
  "results": [],
  "totalResults": 0
}
```

---

## API #4: SERP Competitors (OPTIONAL)

### Endpoint
```
GET /apis/serp_api_v2/getSerpAnalysisKeywords
```

### Purpose
Get top competing domains for specific keywords to identify SERP competitors.

### Cost
**$0.0210 per domain**

### Parameters
| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `Keyword` | Yes | String | Target keyword to analyze |
| `pageSize` | No | Integer | Number of competitors (max: 10) |
| `api_key` | Yes | String | Authentication key |

### Request Example
```bash
curl "https://www.spyfu.com/apis/serp_api_v2/getSerpAnalysisKeywords?Keyword=holiday%20rambler&pageSize=10&api_key=YOUR_KEY"
```

### Response Structure
```json
{
  "results": [
    {
      "Domain": "rhmd.com",
      "Rank": 1,
      "Url": "https://rhmd.com/",
      "TotalOrganicKeywords": 47225,
      "OverlapScore": 1.0
    },
    {
      "Domain": "rvusa.com",
      "Rank": 2,
      "Url": "https://rvusa.com/holiday-rambler",
      "TotalOrganicKeywords": 128492,
      "OverlapScore": 0.85
    },
    {
      "Domain": "campingworld.com",
      "Rank": 3,
      "Url": "https://campingworld.com/rv-types/holiday-rambler",
      "TotalOrganicKeywords": 245871,
      "OverlapScore": 0.72
    }
    // ... more competitors ...
  ]
}
```

### Response Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `Domain` | String | Competitor domain | "rvusa.com" |
| `Rank` | Integer | Position in SERP | 2 |
| `Url` | String | Ranking URL | "https://rvusa.com/..." |
| `TotalOrganicKeywords` | Integer | Competitor's total keyword count | 128492 |
| `OverlapScore` | Float | Keyword overlap with target (0-1) | 0.85 |

### Used For
- **Nuggets #11-14 (Competitor 1-4)**: Top 4 competitor domains
- **Nugget #15 (Competitor Ranks)**: Average competitor positions

### Multiple Keyword Strategy
Since this API requires a keyword input, we use top keywords from API #2:
```javascript
// Get top 3 keywords from Page 1 data
const topKeywords = page1Keywords
  .sort((a, b) => b.MonthlySearches - a.MonthlySearches)
  .slice(0, 3)
  .map(kw => kw.Keyword);

// Fetch competitors for each keyword
const competitorData = await Promise.all(
  topKeywords.map(keyword => 
    fetchAPI4(keyword, domain)
  )
);

// Aggregate competitor domains across all keywords
const competitors = aggregateCompetitors(competitorData);
```

### Error Responses
```json
// No competitors found
{
  "results": [],
  "message": "No SERP data available for this keyword"
}

// Keyword too long
{
  "error": "Keyword exceeds maximum length of 200 characters",
  "code": 400
}
```

---

## Error Handling Strategy

### HTTP Status Codes
| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad request | Log error, skip lead |
| 401 | Auth failed | Check API key, halt processing |
| 404 | Not found | Mark lead as "no data", continue |
| 429 | Rate limited | Wait 60s, retry |
| 500 | Server error | Retry with backoff (3x) |
| 503 | Service unavailable | Retry after 5 minutes |

### Retry Logic
```typescript
async function fetchWithRetry(url: string, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (response.status === 429) {
        // Rate limited - wait 60 seconds
        await sleep(60000);
        continue;
      }
      
      if (response.status >= 500) {
        // Server error - exponential backoff
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await sleep(delay);
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await sleep(1000 * attempt); // Linear backoff
      }
    }
  }
  
  throw lastError;
}
```

### Partial Data Handling
If some APIs succeed but others fail:
```typescript
// Store what we got, mark incomplete
await db.insert({
  domain: 'rhmd.com',
  api_1_trends: successData,
  api_2_page1: successData,
  api_3_money: null, // Failed
  api_4_competitors: null, // Failed
  error_message: 'APIs 3-4 failed: Rate limit exceeded'
});

// Calculate nuggets from available data
// Show user which leads have incomplete data
```

---

## Cost Calculator

```typescript
function calculateAPICost(tier: string, leadCount: number): number {
  const costs = {
    minimal: 0.002,  // API #1 only
    partial: 0.150,  // APIs #1-3
    full: 0.170      // All 4 APIs
  };
  
  return costs[tier] * leadCount;
}

// Examples
calculateAPICost('full', 500);    // $85.00
calculateAPICost('partial', 500); // $75.00
calculateAPICost('minimal', 500); // $1.00
```

### Cost Breakdown Table
| Leads | Minimal | Partial | Full |
|-------|---------|---------|------|
| 100 | $0.20 | $15.00 | $17.00 |
| 500 | $1.00 | $75.00 | $85.00 |
| 1000 | $2.00 | $150.00 | $170.00 |
| 5000 | $10.00 | $750.00 | $850.00 |

---

## Testing & Development

### Test Domains
```javascript
const testDomains = [
  'rhmd.com',      // RV industry - good data
  'acme.com',      // Generic - sparse data
  'example.com',   // Placeholder - minimal data
  'google.com',    // High authority - rich data
  'invalid.test'   // Error case
];
```

### Mock API Responses
For local development without API costs:
```typescript
// mock-api.ts
export const mockAPI1Response = {
  data: [
    {
      MonthId: 202312,
      TotalOrganicKeywords: 47225,
      OrganicValue: 15842,
      OrganicClicks: 16731,
      DomainAuthorityScore: 65
    }
  ]
};

// Use in development
const apiData = process.env.NODE_ENV === 'development'
  ? mockAPI1Response
  : await fetchAPI1(domain);
```

### API Response Validation
```typescript
function validateAPI1Response(data: any): boolean {
  return (
    data?.data &&
    Array.isArray(data.data) &&
    data.data.length > 0 &&
    data.data[0].MonthId &&
    data.data[0].TotalOrganicKeywords !== undefined
  );
}
```

---

## Rate Limit Management

### Queue System
```typescript
class APIQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerMinute = 120;
  private delayBetweenRequests = 60000 / this.requestsPerMinute; // 500ms
  
  async add(task: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.process();
      }
    });
  }
  
  private async process() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
        await sleep(this.delayBetweenRequests);
      }
    }
    
    this.processing = false;
  }
}
```

---

## Environment Variables

```bash
# .dev.vars (local development)
SPYFU_API_KEY=MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ
SPYFU_API_BASE_URL=https://www.spyfu.com/apis
SPYFU_RATE_LIMIT=120

# Production (Cloudflare environment)
# Set via: wrangler secret put SPYFU_API_KEY
```

```typescript
// Access in code
const apiKey = env.SPYFU_API_KEY;
const baseUrl = env.SPYFU_API_BASE_URL || 'https://www.spyfu.com/apis';
```

---

## Summary

### API Comparison
| Feature | API #1 | API #2 | API #3 | API #4 |
|---------|--------|--------|--------|--------|
| **Cost** | $0.002 | $0.00-0.27 | $0.013 | $0.021 |
| **Speed** | Fast | Slow | Medium | Medium |
| **Data** | Trends | Keywords | Money KWs | Competitors |
| **Required** | Always | Always | Partial+ | Full only |
| **Nuggets** | 1,5,17-20 | 2-4,6-10,21-28 | 16,29-32 | 11-15 |

### Implementation Priority
1. **API #1** - Start here, fast and cheap
2. **API #2** - Most complex, requires pagination
3. **API #3** - Straightforward, fixed result size
4. **API #4** - Last, requires keyword input from API #2

### Key Takeaways
- ✅ **Always fetch in order**: 1 → 2 → 3 → 4
- ✅ **Respect rate limits**: 120 req/min with 500ms delays
- ✅ **Retry on failures**: 3 attempts with exponential backoff
- ✅ **Store ALL responses**: Data warehouse pattern
- ✅ **Validate before storing**: Check required fields exist
- ✅ **Handle partial data**: Don't fail entire batch for one error

This API integration is the heart of the platform - get it right and everything else flows smoothly.
