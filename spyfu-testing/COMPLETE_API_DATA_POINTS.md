# 📊 SPYFU API: COMPLETE DATA POINT BREAKDOWN WITH REAL DATA

## Master List of ALL Available Data Points by API Call

**Test Domains:**
- **Small:** viridisenergy.com (~15,132 keywords)
- **Medium:** poolsbybradley.com (~1,200 keywords est.)
- **Enterprise:** skyscanner.com (~1.8M keywords)

---

## 🔍 API CALL 1: getLiveSeoStats

**Purpose:** Domain overview statistics

### API String
```javascript
const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getLiveSeoStats?query=${domain}`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ' }
});
const data = await response.json();
```

### Cost Per Domain Size
| Domain Size | Domain | Rows Returned | Cost |
|-------------|--------|---------------|------|
| Small | viridisenergy.com | 1 | $0.0005 |
| Medium | poolsbybradley.com | 1 | $0.0005 |
| Enterprise | skyscanner.com | 1 | $0.0005 |

### Real Data Sample: SMALL (viridisenergy.com)

```json
{
  "resultCount": 1,
  "domain": "viridisenergy.com",
  "url": "http://viridisenergy.com/",
  "totalOrganicResults": 15135,
  "monthlyOrganicClicks": 428,
  "monthlyOrganicClickValue": 13047.899981021881,
  "totalSearchVolume": 127290
}
```

### Real Data Sample: MEDIUM (poolsbybradley.com)

```json
{
  "resultCount": 1,
  "domain": "poolsbybradley.com",
  "url": "http://poolsbybradley.com/",
  "totalOrganicResults": 1451,
  "monthlyOrganicClicks": 498,
  "monthlyOrganicClickValue": 3263.5799703598022,
  "totalSearchVolume": 79546
}
```

### Real Data Sample: ENTERPRISE (skyscanner.com)

```json
{
  "resultCount": 1,
  "domain": "skyscanner.com",
  "url": "http://skyscanner.com/",
  "totalOrganicResults": 1789035,
  "monthlyOrganicClicks": 1926017,
  "monthlyOrganicClickValue": 4562242.851425156,
  "totalSearchVolume": 134308039
}
```

### Data Points Available

1. **resultCount** (number)
   - **Small** (viridisenergy.com): 1
   - **Medium** (poolsbybradley.com): 1
   - **Enterprise** (skyscanner.com): 1

2. **domain** (string)
   - **Small** (viridisenergy.com): viridisenergy.com
   - **Medium** (poolsbybradley.com): poolsbybradley.com
   - **Enterprise** (skyscanner.com): skyscanner.com

3. **url** (string)
   - **Small** (viridisenergy.com): http://viridisenergy.com/
   - **Medium** (poolsbybradley.com): http://poolsbybradley.com/
   - **Enterprise** (skyscanner.com): http://skyscanner.com/

4. **totalOrganicResults** (number)
   - **Small** (viridisenergy.com): 15,135
   - **Medium** (poolsbybradley.com): 1,451
   - **Enterprise** (skyscanner.com): 1,789,035

5. **monthlyOrganicClicks** (number)
   - **Small** (viridisenergy.com): 428
   - **Medium** (poolsbybradley.com): 498
   - **Enterprise** (skyscanner.com): 1,926,017

6. **monthlyOrganicClickValue** (number)
   - **Small** (viridisenergy.com): 13,047.9
   - **Medium** (poolsbybradley.com): 3,263.58
   - **Enterprise** (skyscanner.com): 4,562,242.851

7. **totalSearchVolume** (number)
   - **Small** (viridisenergy.com): 127,290
   - **Medium** (poolsbybradley.com): 79,546
   - **Enterprise** (skyscanner.com): 134,308,039

---

## 🔍 API CALL 2: getMostValuableKeywords

**Purpose:** Highest value keywords

### API String
```javascript
const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getMostValuableKeywords?query=${domain}`;
// With limit: url += `&pageSize=5`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ' }
});
const data = await response.json();
```

### Cost Per Domain Size
| Domain Size | Domain | Rows Returned | Cost |
|-------------|--------|---------------|------|
| Small | viridisenergy.com | 5 | $0.0025 |
| Medium | poolsbybradley.com | 5 | $0.0025 |
| Enterprise | skyscanner.com | 5 | $0.0025 |

### Real Data Sample: SMALL (viridisenergy.com)

```json
{
  "keyword": "photovoltaic cell",
  "topRankedUrl": "https://www.viridisenergy.com/learning-center/lesson/10/how-do-solar-photovoltaic-pv-cells-actually-work",
  "rank": 51,
  "rankChange": null,
  "searchVolume": 8100,
  "keywordDifficulty": 46,
  "broadCostPerClick": 2.39,
  "phraseCostPerClick": 3.79,
  "exactCostPerClick": 2.49,
  "seoClicks": 28,
  "seoClicksChange": null,
  "totalMonthlyClicks": 2900,
  "percentMobileSearches": 0.298789239234868,
  "percentDesktopSearches": 0.701210760765132,
  "percentNotClicked": 0.646728971962617,
  "percentPaidClicks": 0.0264550263150528,
  "percentOrganicClicks": 0.973544968393942,
  "broadMonthlyCost": 166.5,
  "phraseMonthlyCost": 39.58,
  "exactMonthlyCost": 70.8,
  "paidCompetitors": 0,
  "rankingHomepages": 3,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: MEDIUM (poolsbybradley.com)

```json
{
  "keyword": "pool builders near me",
  "topRankedUrl": "https://poolsbybradley.com/",
  "rank": 56,
  "rankChange": 36,
  "searchVolume": 20900,
  "keywordDifficulty": 60,
  "broadCostPerClick": 3.96,
  "phraseCostPerClick": 4.15,
  "exactCostPerClick": 4.23,
  "seoClicks": 70,
  "seoClicksChange": 26,
  "totalMonthlyClicks": 14200,
  "percentMobileSearches": 0.604586522493726,
  "percentDesktopSearches": 0.395413477506274,
  "percentNotClicked": 0.321554770318021,
  "percentPaidClicks": 0.114583333034939,
  "percentOrganicClicks": 0.885416664360894,
  "broadMonthlyCost": 1717.8,
  "phraseMonthlyCost": 1350.3,
  "exactMonthlyCost": 1312.5,
  "paidCompetitors": 1,
  "rankingHomepages": 52,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: ENTERPRISE (skyscanner.com)

```json
{
  "keyword": "southwest airlines",
  "topRankedUrl": "https://www.skyscanner.com/airline/airline-southwest-airlines-wn.html",
  "rank": 21,
  "rankChange": -1,
  "searchVolume": 2230000,
  "keywordDifficulty": 32,
  "broadCostPerClick": 0.37,
  "phraseCostPerClick": 0.35,
  "exactCostPerClick": 0.36,
  "seoClicks": 19100,
  "seoClicksChange": -900,
  "totalMonthlyClicks": 2010000,
  "percentMobileSearches": 0.408358172964951,
  "percentDesktopSearches": 0.591641827035049,
  "percentNotClicked": 0.0989223878780141,
  "percentPaidClicks": 0.0822971977797034,
  "percentOrganicClicks": 0.917702802218649,
  "broadMonthlyCost": 94339.8,
  "phraseMonthlyCost": 87103.8,
  "exactMonthlyCost": 87582.6,
  "paidCompetitors": 1,
  "rankingHomepages": 5,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Data Points Available

1. **keyword** (string)
   - **Small** (viridisenergy.com): photovoltaic cell
   - **Medium** (poolsbybradley.com): pool builders near me
   - **Enterprise** (skyscanner.com): southwest airlines

2. **topRankedUrl** (string)
   - **Small** (viridisenergy.com): https://www.viridisenergy.com/learning-center/less...
   - **Medium** (poolsbybradley.com): https://poolsbybradley.com/
   - **Enterprise** (skyscanner.com): https://www.skyscanner.com/airline/airline-southwe...

3. **rank** (number)
   - **Small** (viridisenergy.com): 51
   - **Medium** (poolsbybradley.com): 56
   - **Enterprise** (skyscanner.com): 21

4. **rankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 36
   - **Enterprise** (skyscanner.com): -1

5. **searchVolume** (number)
   - **Small** (viridisenergy.com): 8,100
   - **Medium** (poolsbybradley.com): 20,900
   - **Enterprise** (skyscanner.com): 2,230,000

6. **keywordDifficulty** (number)
   - **Small** (viridisenergy.com): 46
   - **Medium** (poolsbybradley.com): 60
   - **Enterprise** (skyscanner.com): 32

7. **broadCostPerClick** (number)
   - **Small** (viridisenergy.com): 2.39
   - **Medium** (poolsbybradley.com): 3.96
   - **Enterprise** (skyscanner.com): 0.37

8. **phraseCostPerClick** (number)
   - **Small** (viridisenergy.com): 3.79
   - **Medium** (poolsbybradley.com): 4.15
   - **Enterprise** (skyscanner.com): 0.35

9. **exactCostPerClick** (number)
   - **Small** (viridisenergy.com): 2.49
   - **Medium** (poolsbybradley.com): 4.23
   - **Enterprise** (skyscanner.com): 0.36

10. **seoClicks** (number)
   - **Small** (viridisenergy.com): 28
   - **Medium** (poolsbybradley.com): 70
   - **Enterprise** (skyscanner.com): 19,100

11. **seoClicksChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 26
   - **Enterprise** (skyscanner.com): -900

12. **totalMonthlyClicks** (number)
   - **Small** (viridisenergy.com): 2,900
   - **Medium** (poolsbybradley.com): 14,200
   - **Enterprise** (skyscanner.com): 2,010,000

13. **percentMobileSearches** (number)
   - **Small** (viridisenergy.com): 0.30
   - **Medium** (poolsbybradley.com): 0.60
   - **Enterprise** (skyscanner.com): 0.41

14. **percentDesktopSearches** (number)
   - **Small** (viridisenergy.com): 0.70
   - **Medium** (poolsbybradley.com): 0.40
   - **Enterprise** (skyscanner.com): 0.59

15. **percentNotClicked** (number)
   - **Small** (viridisenergy.com): 0.65
   - **Medium** (poolsbybradley.com): 0.32
   - **Enterprise** (skyscanner.com): 0.10

16. **percentPaidClicks** (number)
   - **Small** (viridisenergy.com): 0.03
   - **Medium** (poolsbybradley.com): 0.11
   - **Enterprise** (skyscanner.com): 0.08

17. **percentOrganicClicks** (number)
   - **Small** (viridisenergy.com): 0.97
   - **Medium** (poolsbybradley.com): 0.89
   - **Enterprise** (skyscanner.com): 0.92

18. **broadMonthlyCost** (number)
   - **Small** (viridisenergy.com): 166.50
   - **Medium** (poolsbybradley.com): 1,717.8
   - **Enterprise** (skyscanner.com): 94,339.8

19. **phraseMonthlyCost** (number)
   - **Small** (viridisenergy.com): 39.58
   - **Medium** (poolsbybradley.com): 1,350.3
   - **Enterprise** (skyscanner.com): 87,103.8

20. **exactMonthlyCost** (number)
   - **Small** (viridisenergy.com): 70.80
   - **Medium** (poolsbybradley.com): 1,312.5
   - **Enterprise** (skyscanner.com): 87,582.6

21. **paidCompetitors** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1
   - **Enterprise** (skyscanner.com): 1

22. **rankingHomepages** (number)
   - **Small** (viridisenergy.com): 3
   - **Medium** (poolsbybradley.com): 52
   - **Enterprise** (skyscanner.com): 5

23. **yourRank** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

24. **yourRankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

25. **yourUrl** (string)
   - **Small** (viridisenergy.com): 
   - **Medium** (poolsbybradley.com): 
   - **Enterprise** (skyscanner.com): 

---

## 🔍 API CALL 3: getLostRanksKeywords

**Purpose:** Keywords that IMPROVED (negative rankChange)

### API String
```javascript
const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getLostRanksKeywords?query=${domain}`;
// With limit: url += `&pageSize=5`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ' }
});
const data = await response.json();
```

### Cost Per Domain Size
| Domain Size | Domain | Rows Returned | Cost |
|-------------|--------|---------------|------|
| Small | viridisenergy.com | 5 | $0.0025 |
| Medium | poolsbybradley.com | 5 | $0.0025 |
| Enterprise | skyscanner.com | 5 | $0.0025 |

### Real Data Sample: SMALL (viridisenergy.com)

```json
{
  "keyword": "solar panel output",
  "topRankedUrl": "https://www.viridisenergy.com/learning-center/lesson/38/understanding-solar-panel-output-how-much-energy-does-one-solar-panel-produce",
  "rank": 42,
  "rankChange": -2,
  "searchVolume": 720,
  "keywordDifficulty": 22,
  "broadCostPerClick": 2.07,
  "phraseCostPerClick": 1.87,
  "exactCostPerClick": 1.81,
  "seoClicks": 3,
  "seoClicksChange": 0,
  "totalMonthlyClicks": 380,
  "percentMobileSearches": 0.558015625,
  "percentDesktopSearches": 0.441984375,
  "percentNotClicked": 0.45625,
  "percentPaidClicks": 0.252873560311798,
  "percentOrganicClicks": 0.747126428193949,
  "broadMonthlyCost": 56.1,
  "phraseMonthlyCost": 17.4,
  "exactMonthlyCost": 9,
  "paidCompetitors": 0,
  "rankingHomepages": 1,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: MEDIUM (poolsbybradley.com)

```json
{
  "keyword": "minto builders florida",
  "topRankedUrl": "https://poolsbybradley.com/our-story/builders/minto-homes-logo/",
  "rank": 34,
  "rankChange": -9,
  "searchVolume": 750,
  "keywordDifficulty": 21,
  "broadCostPerClick": null,
  "phraseCostPerClick": null,
  "exactCostPerClick": null,
  "seoClicks": 4,
  "seoClicksChange": -1,
  "totalMonthlyClicks": 570,
  "percentMobileSearches": null,
  "percentDesktopSearches": null,
  "percentNotClicked": null,
  "percentPaidClicks": null,
  "percentOrganicClicks": null,
  "broadMonthlyCost": 0,
  "phraseMonthlyCost": null,
  "exactMonthlyCost": 0,
  "paidCompetitors": 1,
  "rankingHomepages": 1,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: ENTERPRISE (skyscanner.com)

```json
{
  "keyword": "southwest airlines",
  "topRankedUrl": "https://www.skyscanner.com/airline/airline-southwest-airlines-wn.html",
  "rank": 21,
  "rankChange": -1,
  "searchVolume": 2230000,
  "keywordDifficulty": 32,
  "broadCostPerClick": 0.37,
  "phraseCostPerClick": 0.35,
  "exactCostPerClick": 0.36,
  "seoClicks": 19100,
  "seoClicksChange": -900,
  "totalMonthlyClicks": 2010000,
  "percentMobileSearches": 0.408358172964951,
  "percentDesktopSearches": 0.591641827035049,
  "percentNotClicked": 0.0989223878780141,
  "percentPaidClicks": 0.0822971977797034,
  "percentOrganicClicks": 0.917702802218649,
  "broadMonthlyCost": 94339.8,
  "phraseMonthlyCost": 87103.8,
  "exactMonthlyCost": 87582.6,
  "paidCompetitors": 1,
  "rankingHomepages": 5,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Data Points Available

1. **keyword** (string)
   - **Small** (viridisenergy.com): solar panel output
   - **Medium** (poolsbybradley.com): minto builders florida
   - **Enterprise** (skyscanner.com): southwest airlines

2. **topRankedUrl** (string)
   - **Small** (viridisenergy.com): https://www.viridisenergy.com/learning-center/less...
   - **Medium** (poolsbybradley.com): https://poolsbybradley.com/our-story/builders/mint...
   - **Enterprise** (skyscanner.com): https://www.skyscanner.com/airline/airline-southwe...

3. **rank** (number)
   - **Small** (viridisenergy.com): 42
   - **Medium** (poolsbybradley.com): 34
   - **Enterprise** (skyscanner.com): 21

4. **rankChange** (number)
   - **Small** (viridisenergy.com): -2
   - **Medium** (poolsbybradley.com): -9
   - **Enterprise** (skyscanner.com): -1

5. **searchVolume** (number)
   - **Small** (viridisenergy.com): 720
   - **Medium** (poolsbybradley.com): 750
   - **Enterprise** (skyscanner.com): 2,230,000

6. **keywordDifficulty** (number)
   - **Small** (viridisenergy.com): 22
   - **Medium** (poolsbybradley.com): 21
   - **Enterprise** (skyscanner.com): 32

7. **broadCostPerClick** (number)
   - **Small** (viridisenergy.com): 2.07
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.37

8. **phraseCostPerClick** (number)
   - **Small** (viridisenergy.com): 1.87
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.35

9. **exactCostPerClick** (number)
   - **Small** (viridisenergy.com): 1.81
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.36

10. **seoClicks** (number)
   - **Small** (viridisenergy.com): 3
   - **Medium** (poolsbybradley.com): 4
   - **Enterprise** (skyscanner.com): 19,100

11. **seoClicksChange** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): -1
   - **Enterprise** (skyscanner.com): -900

12. **totalMonthlyClicks** (number)
   - **Small** (viridisenergy.com): 380
   - **Medium** (poolsbybradley.com): 570
   - **Enterprise** (skyscanner.com): 2,010,000

13. **percentMobileSearches** (number)
   - **Small** (viridisenergy.com): 0.56
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.41

14. **percentDesktopSearches** (number)
   - **Small** (viridisenergy.com): 0.44
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.59

15. **percentNotClicked** (number)
   - **Small** (viridisenergy.com): 0.46
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.10

16. **percentPaidClicks** (number)
   - **Small** (viridisenergy.com): 0.25
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.08

17. **percentOrganicClicks** (number)
   - **Small** (viridisenergy.com): 0.75
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.92

18. **broadMonthlyCost** (number)
   - **Small** (viridisenergy.com): 56.10
   - **Medium** (poolsbybradley.com): 0
   - **Enterprise** (skyscanner.com): 94,339.8

19. **phraseMonthlyCost** (number)
   - **Small** (viridisenergy.com): 17.40
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 87,103.8

20. **exactMonthlyCost** (number)
   - **Small** (viridisenergy.com): 9
   - **Medium** (poolsbybradley.com): 0
   - **Enterprise** (skyscanner.com): 87,582.6

21. **paidCompetitors** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1
   - **Enterprise** (skyscanner.com): 1

22. **rankingHomepages** (number)
   - **Small** (viridisenergy.com): 1
   - **Medium** (poolsbybradley.com): 1
   - **Enterprise** (skyscanner.com): 5

23. **yourRank** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

24. **yourRankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

25. **yourUrl** (string)
   - **Small** (viridisenergy.com): 
   - **Medium** (poolsbybradley.com): 
   - **Enterprise** (skyscanner.com): 

---

## 🔍 API CALL 4: getGainedRanksKeywords

**Purpose:** Keywords that DROPPED (positive rankChange)

### API String
```javascript
const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getGainedRanksKeywords?query=${domain}`;
// With limit: url += `&pageSize=5`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ' }
});
const data = await response.json();
```

### Cost Per Domain Size
| Domain Size | Domain | Rows Returned | Cost |
|-------------|--------|---------------|------|
| Small | viridisenergy.com | 5 | $0.0025 |
| Medium | poolsbybradley.com | 5 | $0.0025 |
| Enterprise | skyscanner.com | 5 | $0.0025 |

### Real Data Sample: SMALL (viridisenergy.com)

```json
{
  "keyword": "how do photovoltaic cells work",
  "topRankedUrl": "https://www.viridisenergy.com/learning-center/lesson/10/how-do-solar-photovoltaic-pv-cells-actually-work",
  "rank": 37,
  "rankChange": 31,
  "searchVolume": 1200,
  "keywordDifficulty": 23,
  "broadCostPerClick": null,
  "phraseCostPerClick": null,
  "exactCostPerClick": null,
  "seoClicks": 6,
  "seoClicksChange": 3,
  "totalMonthlyClicks": 720,
  "percentMobileSearches": 0.3090625,
  "percentDesktopSearches": 0.6909375,
  "percentNotClicked": 0.375,
  "percentPaidClicks": null,
  "percentOrganicClicks": null,
  "broadMonthlyCost": 0,
  "phraseMonthlyCost": null,
  "exactMonthlyCost": 0,
  "paidCompetitors": 0,
  "rankingHomepages": 0,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: MEDIUM (poolsbybradley.com)

```json
{
  "keyword": "pool builders near me",
  "topRankedUrl": "https://poolsbybradley.com/",
  "rank": 56,
  "rankChange": 36,
  "searchVolume": 20900,
  "keywordDifficulty": 60,
  "broadCostPerClick": 3.96,
  "phraseCostPerClick": 4.15,
  "exactCostPerClick": 4.23,
  "seoClicks": 70,
  "seoClicksChange": 26,
  "totalMonthlyClicks": 14200,
  "percentMobileSearches": 0.604586522493726,
  "percentDesktopSearches": 0.395413477506274,
  "percentNotClicked": 0.321554770318021,
  "percentPaidClicks": 0.114583333034939,
  "percentOrganicClicks": 0.885416664360894,
  "broadMonthlyCost": 1717.8,
  "phraseMonthlyCost": 1350.3,
  "exactMonthlyCost": 1312.5,
  "paidCompetitors": 1,
  "rankingHomepages": 52,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: ENTERPRISE (skyscanner.com)

```json
{
  "keyword": "delta airlines",
  "topRankedUrl": "https://www.skyscanner.com/airline/airline-delta-dl.html",
  "rank": 26,
  "rankChange": 36,
  "searchVolume": 1090000,
  "keywordDifficulty": 24,
  "broadCostPerClick": 0.32,
  "phraseCostPerClick": 0.33,
  "exactCostPerClick": 0.31,
  "seoClicks": 7600,
  "seoClicksChange": 4300,
  "totalMonthlyClicks": 928000,
  "percentMobileSearches": 0.415878770410157,
  "percentDesktopSearches": 0.584121229589843,
  "percentNotClicked": 0.149145356731935,
  "percentPaidClicks": 0.445272859064606,
  "percentOrganicClicks": 0.554727140932348,
  "broadMonthlyCost": 134340.6,
  "phraseMonthlyCost": 127038.6,
  "exactMonthlyCost": 119481.6,
  "paidCompetitors": 1,
  "rankingHomepages": 1,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Data Points Available

1. **keyword** (string)
   - **Small** (viridisenergy.com): how do photovoltaic cells work
   - **Medium** (poolsbybradley.com): pool builders near me
   - **Enterprise** (skyscanner.com): delta airlines

2. **topRankedUrl** (string)
   - **Small** (viridisenergy.com): https://www.viridisenergy.com/learning-center/less...
   - **Medium** (poolsbybradley.com): https://poolsbybradley.com/
   - **Enterprise** (skyscanner.com): https://www.skyscanner.com/airline/airline-delta-d...

3. **rank** (number)
   - **Small** (viridisenergy.com): 37
   - **Medium** (poolsbybradley.com): 56
   - **Enterprise** (skyscanner.com): 26

4. **rankChange** (number)
   - **Small** (viridisenergy.com): 31
   - **Medium** (poolsbybradley.com): 36
   - **Enterprise** (skyscanner.com): 36

5. **searchVolume** (number)
   - **Small** (viridisenergy.com): 1,200
   - **Medium** (poolsbybradley.com): 20,900
   - **Enterprise** (skyscanner.com): 1,090,000

6. **keywordDifficulty** (number)
   - **Small** (viridisenergy.com): 23
   - **Medium** (poolsbybradley.com): 60
   - **Enterprise** (skyscanner.com): 24

7. **broadCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 3.96
   - **Enterprise** (skyscanner.com): 0.32

8. **phraseCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 4.15
   - **Enterprise** (skyscanner.com): 0.33

9. **exactCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 4.23
   - **Enterprise** (skyscanner.com): 0.31

10. **seoClicks** (number)
   - **Small** (viridisenergy.com): 6
   - **Medium** (poolsbybradley.com): 70
   - **Enterprise** (skyscanner.com): 7,600

11. **seoClicksChange** (number)
   - **Small** (viridisenergy.com): 3
   - **Medium** (poolsbybradley.com): 26
   - **Enterprise** (skyscanner.com): 4,300

12. **totalMonthlyClicks** (number)
   - **Small** (viridisenergy.com): 720
   - **Medium** (poolsbybradley.com): 14,200
   - **Enterprise** (skyscanner.com): 928,000

13. **percentMobileSearches** (number)
   - **Small** (viridisenergy.com): 0.31
   - **Medium** (poolsbybradley.com): 0.60
   - **Enterprise** (skyscanner.com): 0.42

14. **percentDesktopSearches** (number)
   - **Small** (viridisenergy.com): 0.69
   - **Medium** (poolsbybradley.com): 0.40
   - **Enterprise** (skyscanner.com): 0.58

15. **percentNotClicked** (number)
   - **Small** (viridisenergy.com): 0.38
   - **Medium** (poolsbybradley.com): 0.32
   - **Enterprise** (skyscanner.com): 0.15

16. **percentPaidClicks** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 0.11
   - **Enterprise** (skyscanner.com): 0.45

17. **percentOrganicClicks** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 0.89
   - **Enterprise** (skyscanner.com): 0.55

18. **broadMonthlyCost** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1,717.8
   - **Enterprise** (skyscanner.com): 134,340.6

19. **phraseMonthlyCost** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 1,350.3
   - **Enterprise** (skyscanner.com): 127,038.6

20. **exactMonthlyCost** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1,312.5
   - **Enterprise** (skyscanner.com): 119,481.6

21. **paidCompetitors** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1
   - **Enterprise** (skyscanner.com): 1

22. **rankingHomepages** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 52
   - **Enterprise** (skyscanner.com): 1

23. **yourRank** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

24. **yourRankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

25. **yourUrl** (string)
   - **Small** (viridisenergy.com): 
   - **Medium** (poolsbybradley.com): 
   - **Enterprise** (skyscanner.com): 

---

## 🔍 API CALL 5: getNewlyRankedKeywords

**Purpose:** New keywords added in last 30 days

### API String
```javascript
const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getNewlyRankedKeywords?query=${domain}`;
// With limit: url += `&pageSize=5`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ' }
});
const data = await response.json();
```

### Cost Per Domain Size
| Domain Size | Domain | Rows Returned | Cost |
|-------------|--------|---------------|------|
| Small | viridisenergy.com | 5 | $0.0025 |
| Medium | poolsbybradley.com | 5 | $0.0025 |
| Enterprise | skyscanner.com | 5 | $0.0025 |

### Real Data Sample: SMALL (viridisenergy.com)

```json
{
  "keyword": "photovoltaic cell",
  "topRankedUrl": "https://www.viridisenergy.com/learning-center/lesson/10/how-do-solar-photovoltaic-pv-cells-actually-work",
  "rank": 51,
  "rankChange": null,
  "searchVolume": 8100,
  "keywordDifficulty": 46,
  "broadCostPerClick": 2.39,
  "phraseCostPerClick": 3.79,
  "exactCostPerClick": 2.49,
  "seoClicks": 28,
  "seoClicksChange": null,
  "totalMonthlyClicks": 2900,
  "percentMobileSearches": 0.298789239234868,
  "percentDesktopSearches": 0.701210760765132,
  "percentNotClicked": 0.646728971962617,
  "percentPaidClicks": 0.0264550263150528,
  "percentOrganicClicks": 0.973544968393942,
  "broadMonthlyCost": 166.5,
  "phraseMonthlyCost": 39.58,
  "exactMonthlyCost": 70.8,
  "paidCompetitors": 0,
  "rankingHomepages": 3,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: MEDIUM (poolsbybradley.com)

```json
{
  "keyword": "pool designers near me",
  "topRankedUrl": "https://poolsbybradley.com/",
  "rank": 43,
  "rankChange": null,
  "searchVolume": 1800,
  "keywordDifficulty": 47,
  "broadCostPerClick": 3.35,
  "phraseCostPerClick": 3.94,
  "exactCostPerClick": 3.94,
  "seoClicks": 8,
  "seoClicksChange": null,
  "totalMonthlyClicks": 1400,
  "percentMobileSearches": 0.245295857988166,
  "percentDesktopSearches": 0.754704142011834,
  "percentNotClicked": 0.230769230769231,
  "percentPaidClicks": null,
  "percentOrganicClicks": null,
  "broadMonthlyCost": 215.1,
  "phraseMonthlyCost": 10.2,
  "exactMonthlyCost": 8.7,
  "paidCompetitors": 0,
  "rankingHomepages": 62,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: ENTERPRISE (skyscanner.com)

```json
{
  "keyword": "united airlines",
  "topRankedUrl": "https://www.skyscanner.com/airline/airline-united-ua.html",
  "rank": 17,
  "rankChange": null,
  "searchVolume": 2060000,
  "keywordDifficulty": 56,
  "broadCostPerClick": 1.57,
  "phraseCostPerClick": 1.59,
  "exactCostPerClick": 1.52,
  "seoClicks": 21600,
  "seoClicksChange": null,
  "totalMonthlyClicks": 1790000,
  "percentMobileSearches": 0.332040196049581,
  "percentDesktopSearches": 0.667959803950419,
  "percentNotClicked": 0.130683832730213,
  "percentPaidClicks": 0.0908324816381574,
  "percentOrganicClicks": 0.909167518360256,
  "broadMonthlyCost": 395504.4,
  "phraseMonthlyCost": 396346.8,
  "exactMonthlyCost": 333957.9,
  "paidCompetitors": 0,
  "rankingHomepages": 2,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Data Points Available

1. **keyword** (string)
   - **Small** (viridisenergy.com): photovoltaic cell
   - **Medium** (poolsbybradley.com): pool designers near me
   - **Enterprise** (skyscanner.com): united airlines

2. **topRankedUrl** (string)
   - **Small** (viridisenergy.com): https://www.viridisenergy.com/learning-center/less...
   - **Medium** (poolsbybradley.com): https://poolsbybradley.com/
   - **Enterprise** (skyscanner.com): https://www.skyscanner.com/airline/airline-united-...

3. **rank** (number)
   - **Small** (viridisenergy.com): 51
   - **Medium** (poolsbybradley.com): 43
   - **Enterprise** (skyscanner.com): 17

4. **rankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

5. **searchVolume** (number)
   - **Small** (viridisenergy.com): 8,100
   - **Medium** (poolsbybradley.com): 1,800
   - **Enterprise** (skyscanner.com): 2,060,000

6. **keywordDifficulty** (number)
   - **Small** (viridisenergy.com): 46
   - **Medium** (poolsbybradley.com): 47
   - **Enterprise** (skyscanner.com): 56

7. **broadCostPerClick** (number)
   - **Small** (viridisenergy.com): 2.39
   - **Medium** (poolsbybradley.com): 3.35
   - **Enterprise** (skyscanner.com): 1.57

8. **phraseCostPerClick** (number)
   - **Small** (viridisenergy.com): 3.79
   - **Medium** (poolsbybradley.com): 3.94
   - **Enterprise** (skyscanner.com): 1.59

9. **exactCostPerClick** (number)
   - **Small** (viridisenergy.com): 2.49
   - **Medium** (poolsbybradley.com): 3.94
   - **Enterprise** (skyscanner.com): 1.52

10. **seoClicks** (number)
   - **Small** (viridisenergy.com): 28
   - **Medium** (poolsbybradley.com): 8
   - **Enterprise** (skyscanner.com): 21,600

11. **seoClicksChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

12. **totalMonthlyClicks** (number)
   - **Small** (viridisenergy.com): 2,900
   - **Medium** (poolsbybradley.com): 1,400
   - **Enterprise** (skyscanner.com): 1,790,000

13. **percentMobileSearches** (number)
   - **Small** (viridisenergy.com): 0.30
   - **Medium** (poolsbybradley.com): 0.25
   - **Enterprise** (skyscanner.com): 0.33

14. **percentDesktopSearches** (number)
   - **Small** (viridisenergy.com): 0.70
   - **Medium** (poolsbybradley.com): 0.75
   - **Enterprise** (skyscanner.com): 0.67

15. **percentNotClicked** (number)
   - **Small** (viridisenergy.com): 0.65
   - **Medium** (poolsbybradley.com): 0.23
   - **Enterprise** (skyscanner.com): 0.13

16. **percentPaidClicks** (number)
   - **Small** (viridisenergy.com): 0.03
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.09

17. **percentOrganicClicks** (number)
   - **Small** (viridisenergy.com): 0.97
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.91

18. **broadMonthlyCost** (number)
   - **Small** (viridisenergy.com): 166.50
   - **Medium** (poolsbybradley.com): 215.10
   - **Enterprise** (skyscanner.com): 395,504.4

19. **phraseMonthlyCost** (number)
   - **Small** (viridisenergy.com): 39.58
   - **Medium** (poolsbybradley.com): 10.20
   - **Enterprise** (skyscanner.com): 396,346.8

20. **exactMonthlyCost** (number)
   - **Small** (viridisenergy.com): 70.80
   - **Medium** (poolsbybradley.com): 8.70
   - **Enterprise** (skyscanner.com): 333,957.9

21. **paidCompetitors** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 0
   - **Enterprise** (skyscanner.com): 0

22. **rankingHomepages** (number)
   - **Small** (viridisenergy.com): 3
   - **Medium** (poolsbybradley.com): 62
   - **Enterprise** (skyscanner.com): 2

23. **yourRank** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

24. **yourRankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

25. **yourUrl** (string)
   - **Small** (viridisenergy.com): 
   - **Medium** (poolsbybradley.com): 
   - **Enterprise** (skyscanner.com): 

---

## 🔍 API CALL 6: getJustFellOffKeywords

**Purpose:** Keywords that fell off page 1

### API String
```javascript
const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getJustFellOffKeywords?query=${domain}`;
// With limit: url += `&pageSize=5`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ' }
});
const data = await response.json();
```

### Cost Per Domain Size
| Domain Size | Domain | Rows Returned | Cost |
|-------------|--------|---------------|------|
| Small | viridisenergy.com | 5 | $0.0025 |
| Medium | poolsbybradley.com | 5 | $0.0025 |
| Enterprise | skyscanner.com | 5 | $0.0025 |

### Real Data Sample: SMALL (viridisenergy.com)

```json
{
  "keyword": "one solar panel output",
  "topRankedUrl": "https://www.viridisenergy.com/learning-center/lesson/38/understanding-solar-panel-output-how-much-energy-does-one-solar-panel-produce",
  "rank": 17,
  "rankChange": -9,
  "searchVolume": 44,
  "keywordDifficulty": 22,
  "broadCostPerClick": null,
  "phraseCostPerClick": null,
  "exactCostPerClick": null,
  "seoClicks": 0,
  "seoClicksChange": -1,
  "totalMonthlyClicks": 0,
  "percentMobileSearches": null,
  "percentDesktopSearches": null,
  "percentNotClicked": null,
  "percentPaidClicks": null,
  "percentOrganicClicks": null,
  "broadMonthlyCost": null,
  "phraseMonthlyCost": null,
  "exactMonthlyCost": null,
  "paidCompetitors": 0,
  "rankingHomepages": 1,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: MEDIUM (poolsbybradley.com)

```json
{
  "keyword": "how much water does a pool lose to evaporation",
  "topRankedUrl": "https://poolsbybradley.com/normal-pool-evaporation-central-florida/",
  "rank": 13,
  "rankChange": -3,
  "searchVolume": 90,
  "keywordDifficulty": 13,
  "broadCostPerClick": null,
  "phraseCostPerClick": null,
  "exactCostPerClick": null,
  "seoClicks": 1,
  "seoClicksChange": -1,
  "totalMonthlyClicks": 90,
  "percentMobileSearches": null,
  "percentDesktopSearches": null,
  "percentNotClicked": null,
  "percentPaidClicks": null,
  "percentOrganicClicks": null,
  "broadMonthlyCost": 0,
  "phraseMonthlyCost": null,
  "exactMonthlyCost": 0,
  "paidCompetitors": 0,
  "rankingHomepages": 0,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: ENTERPRISE (skyscanner.com)

```json
{
  "keyword": "cheap hotels",
  "topRankedUrl": "https://www.skyscanner.com/hotels",
  "rank": 30,
  "rankChange": -24,
  "searchVolume": 117000,
  "keywordDifficulty": 81,
  "broadCostPerClick": 2.49,
  "phraseCostPerClick": 2.58,
  "exactCostPerClick": 2.7,
  "seoClicks": 720,
  "seoClicksChange": -2680,
  "totalMonthlyClicks": 22400,
  "percentMobileSearches": 0.615044212656246,
  "percentDesktopSearches": 0.384955787343754,
  "percentNotClicked": 0.25280471997497,
  "percentPaidClicks": 0.552012920945623,
  "percentOrganicClicks": 0.447987078994557,
  "broadMonthlyCost": 324585.6,
  "phraseMonthlyCost": 269244.6,
  "exactMonthlyCost": 199305.6,
  "paidCompetitors": 0,
  "rankingHomepages": 21,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Data Points Available

1. **keyword** (string)
   - **Small** (viridisenergy.com): one solar panel output
   - **Medium** (poolsbybradley.com): how much water does a pool lose to evaporation
   - **Enterprise** (skyscanner.com): cheap hotels

2. **topRankedUrl** (string)
   - **Small** (viridisenergy.com): https://www.viridisenergy.com/learning-center/less...
   - **Medium** (poolsbybradley.com): https://poolsbybradley.com/normal-pool-evaporation...
   - **Enterprise** (skyscanner.com): https://www.skyscanner.com/hotels

3. **rank** (number)
   - **Small** (viridisenergy.com): 17
   - **Medium** (poolsbybradley.com): 13
   - **Enterprise** (skyscanner.com): 30

4. **rankChange** (number)
   - **Small** (viridisenergy.com): -9
   - **Medium** (poolsbybradley.com): -3
   - **Enterprise** (skyscanner.com): -24

5. **searchVolume** (number)
   - **Small** (viridisenergy.com): 44
   - **Medium** (poolsbybradley.com): 90
   - **Enterprise** (skyscanner.com): 117,000

6. **keywordDifficulty** (number)
   - **Small** (viridisenergy.com): 22
   - **Medium** (poolsbybradley.com): 13
   - **Enterprise** (skyscanner.com): 81

7. **broadCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 2.49

8. **phraseCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 2.58

9. **exactCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 2.70

10. **seoClicks** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1
   - **Enterprise** (skyscanner.com): 720

11. **seoClicksChange** (number)
   - **Small** (viridisenergy.com): -1
   - **Medium** (poolsbybradley.com): -1
   - **Enterprise** (skyscanner.com): -2680

12. **totalMonthlyClicks** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 90
   - **Enterprise** (skyscanner.com): 22,400

13. **percentMobileSearches** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.62

14. **percentDesktopSearches** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.38

15. **percentNotClicked** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.25

16. **percentPaidClicks** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.55

17. **percentOrganicClicks** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.45

18. **broadMonthlyCost** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 0
   - **Enterprise** (skyscanner.com): 324,585.6

19. **phraseMonthlyCost** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 269,244.6

20. **exactMonthlyCost** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 0
   - **Enterprise** (skyscanner.com): 199,305.6

21. **paidCompetitors** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 0
   - **Enterprise** (skyscanner.com): 0

22. **rankingHomepages** (number)
   - **Small** (viridisenergy.com): 1
   - **Medium** (poolsbybradley.com): 0
   - **Enterprise** (skyscanner.com): 21

23. **yourRank** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

24. **yourRankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

25. **yourUrl** (string)
   - **Small** (viridisenergy.com): 
   - **Medium** (poolsbybradley.com): 
   - **Enterprise** (skyscanner.com): 

---

## 🔍 API CALL 7: getGainedClicksKeywords

**Purpose:** Keywords gaining clicks

### API String
```javascript
const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getGainedClicksKeywords?query=${domain}`;
// With limit: url += `&pageSize=5`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ' }
});
const data = await response.json();
```

### Cost Per Domain Size
| Domain Size | Domain | Rows Returned | Cost |
|-------------|--------|---------------|------|
| Small | viridisenergy.com | 5 | $0.0025 |
| Medium | poolsbybradley.com | 5 | $0.0025 |
| Enterprise | skyscanner.com | 5 | $0.0025 |

### Real Data Sample: SMALL (viridisenergy.com)

```json
{
  "keyword": "how do photovoltaic cells work",
  "topRankedUrl": "https://www.viridisenergy.com/learning-center/lesson/10/how-do-solar-photovoltaic-pv-cells-actually-work",
  "rank": 37,
  "rankChange": 31,
  "searchVolume": 1200,
  "keywordDifficulty": 23,
  "broadCostPerClick": null,
  "phraseCostPerClick": null,
  "exactCostPerClick": null,
  "seoClicks": 6,
  "seoClicksChange": 3,
  "totalMonthlyClicks": 720,
  "percentMobileSearches": 0.3090625,
  "percentDesktopSearches": 0.6909375,
  "percentNotClicked": 0.375,
  "percentPaidClicks": null,
  "percentOrganicClicks": null,
  "broadMonthlyCost": 0,
  "phraseMonthlyCost": null,
  "exactMonthlyCost": 0,
  "paidCompetitors": 0,
  "rankingHomepages": 0,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: MEDIUM (poolsbybradley.com)

```json
{
  "keyword": "pool builders near me",
  "topRankedUrl": "https://poolsbybradley.com/",
  "rank": 56,
  "rankChange": 36,
  "searchVolume": 20900,
  "keywordDifficulty": 60,
  "broadCostPerClick": 3.96,
  "phraseCostPerClick": 4.15,
  "exactCostPerClick": 4.23,
  "seoClicks": 70,
  "seoClicksChange": 26,
  "totalMonthlyClicks": 14200,
  "percentMobileSearches": 0.604586522493726,
  "percentDesktopSearches": 0.395413477506274,
  "percentNotClicked": 0.321554770318021,
  "percentPaidClicks": 0.114583333034939,
  "percentOrganicClicks": 0.885416664360894,
  "broadMonthlyCost": 1717.8,
  "phraseMonthlyCost": 1350.3,
  "exactMonthlyCost": 1312.5,
  "paidCompetitors": 1,
  "rankingHomepages": 52,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: ENTERPRISE (skyscanner.com)

```json
{
  "keyword": "delta airlines",
  "topRankedUrl": "https://www.skyscanner.com/airline/airline-delta-dl.html",
  "rank": 26,
  "rankChange": 36,
  "searchVolume": 1090000,
  "keywordDifficulty": 24,
  "broadCostPerClick": 0.32,
  "phraseCostPerClick": 0.33,
  "exactCostPerClick": 0.31,
  "seoClicks": 7600,
  "seoClicksChange": 4300,
  "totalMonthlyClicks": 928000,
  "percentMobileSearches": 0.415878770410157,
  "percentDesktopSearches": 0.584121229589843,
  "percentNotClicked": 0.149145356731935,
  "percentPaidClicks": 0.445272859064606,
  "percentOrganicClicks": 0.554727140932348,
  "broadMonthlyCost": 134340.6,
  "phraseMonthlyCost": 127038.6,
  "exactMonthlyCost": 119481.6,
  "paidCompetitors": 1,
  "rankingHomepages": 1,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Data Points Available

1. **keyword** (string)
   - **Small** (viridisenergy.com): how do photovoltaic cells work
   - **Medium** (poolsbybradley.com): pool builders near me
   - **Enterprise** (skyscanner.com): delta airlines

2. **topRankedUrl** (string)
   - **Small** (viridisenergy.com): https://www.viridisenergy.com/learning-center/less...
   - **Medium** (poolsbybradley.com): https://poolsbybradley.com/
   - **Enterprise** (skyscanner.com): https://www.skyscanner.com/airline/airline-delta-d...

3. **rank** (number)
   - **Small** (viridisenergy.com): 37
   - **Medium** (poolsbybradley.com): 56
   - **Enterprise** (skyscanner.com): 26

4. **rankChange** (number)
   - **Small** (viridisenergy.com): 31
   - **Medium** (poolsbybradley.com): 36
   - **Enterprise** (skyscanner.com): 36

5. **searchVolume** (number)
   - **Small** (viridisenergy.com): 1,200
   - **Medium** (poolsbybradley.com): 20,900
   - **Enterprise** (skyscanner.com): 1,090,000

6. **keywordDifficulty** (number)
   - **Small** (viridisenergy.com): 23
   - **Medium** (poolsbybradley.com): 60
   - **Enterprise** (skyscanner.com): 24

7. **broadCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 3.96
   - **Enterprise** (skyscanner.com): 0.32

8. **phraseCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 4.15
   - **Enterprise** (skyscanner.com): 0.33

9. **exactCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 4.23
   - **Enterprise** (skyscanner.com): 0.31

10. **seoClicks** (number)
   - **Small** (viridisenergy.com): 6
   - **Medium** (poolsbybradley.com): 70
   - **Enterprise** (skyscanner.com): 7,600

11. **seoClicksChange** (number)
   - **Small** (viridisenergy.com): 3
   - **Medium** (poolsbybradley.com): 26
   - **Enterprise** (skyscanner.com): 4,300

12. **totalMonthlyClicks** (number)
   - **Small** (viridisenergy.com): 720
   - **Medium** (poolsbybradley.com): 14,200
   - **Enterprise** (skyscanner.com): 928,000

13. **percentMobileSearches** (number)
   - **Small** (viridisenergy.com): 0.31
   - **Medium** (poolsbybradley.com): 0.60
   - **Enterprise** (skyscanner.com): 0.42

14. **percentDesktopSearches** (number)
   - **Small** (viridisenergy.com): 0.69
   - **Medium** (poolsbybradley.com): 0.40
   - **Enterprise** (skyscanner.com): 0.58

15. **percentNotClicked** (number)
   - **Small** (viridisenergy.com): 0.38
   - **Medium** (poolsbybradley.com): 0.32
   - **Enterprise** (skyscanner.com): 0.15

16. **percentPaidClicks** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 0.11
   - **Enterprise** (skyscanner.com): 0.45

17. **percentOrganicClicks** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 0.89
   - **Enterprise** (skyscanner.com): 0.55

18. **broadMonthlyCost** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1,717.8
   - **Enterprise** (skyscanner.com): 134,340.6

19. **phraseMonthlyCost** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 1,350.3
   - **Enterprise** (skyscanner.com): 127,038.6

20. **exactMonthlyCost** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1,312.5
   - **Enterprise** (skyscanner.com): 119,481.6

21. **paidCompetitors** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1
   - **Enterprise** (skyscanner.com): 1

22. **rankingHomepages** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 52
   - **Enterprise** (skyscanner.com): 1

23. **yourRank** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

24. **yourRankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

25. **yourUrl** (string)
   - **Small** (viridisenergy.com): 
   - **Medium** (poolsbybradley.com): 
   - **Enterprise** (skyscanner.com): 

---

## 🔍 API CALL 8: getLostClicksKeywords

**Purpose:** Keywords losing clicks

### API String
```javascript
const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getLostClicksKeywords?query=${domain}`;
// With limit: url += `&pageSize=5`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ' }
});
const data = await response.json();
```

### Cost Per Domain Size
| Domain Size | Domain | Rows Returned | Cost |
|-------------|--------|---------------|------|
| Small | viridisenergy.com | 5 | $0.0025 |
| Medium | poolsbybradley.com | 5 | $0.0025 |
| Enterprise | skyscanner.com | 5 | $0.0025 |

### Real Data Sample: SMALL (viridisenergy.com)

```json
{
  "keyword": "how much energy does solar energy produce",
  "topRankedUrl": "https://www.viridisenergy.com/learning-center/lesson/38/understanding-solar-panel-output-how-much-energy-does-one-solar-panel-produce",
  "rank": 25,
  "rankChange": -7,
  "searchVolume": 480,
  "keywordDifficulty": 37,
  "broadCostPerClick": null,
  "phraseCostPerClick": null,
  "exactCostPerClick": null,
  "seoClicks": 3,
  "seoClicksChange": -2,
  "totalMonthlyClicks": 240,
  "percentMobileSearches": null,
  "percentDesktopSearches": null,
  "percentNotClicked": null,
  "percentPaidClicks": null,
  "percentOrganicClicks": null,
  "broadMonthlyCost": null,
  "phraseMonthlyCost": null,
  "exactMonthlyCost": null,
  "paidCompetitors": 0,
  "rankingHomepages": 1,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: MEDIUM (poolsbybradley.com)

```json
{
  "keyword": "minto builders florida",
  "topRankedUrl": "https://poolsbybradley.com/our-story/builders/minto-homes-logo/",
  "rank": 34,
  "rankChange": -9,
  "searchVolume": 750,
  "keywordDifficulty": 21,
  "broadCostPerClick": null,
  "phraseCostPerClick": null,
  "exactCostPerClick": null,
  "seoClicks": 4,
  "seoClicksChange": -1,
  "totalMonthlyClicks": 570,
  "percentMobileSearches": null,
  "percentDesktopSearches": null,
  "percentNotClicked": null,
  "percentPaidClicks": null,
  "percentOrganicClicks": null,
  "broadMonthlyCost": 0,
  "phraseMonthlyCost": null,
  "exactMonthlyCost": 0,
  "paidCompetitors": 1,
  "rankingHomepages": 1,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: ENTERPRISE (skyscanner.com)

```json
{
  "keyword": "southwest airlines",
  "topRankedUrl": "https://www.skyscanner.com/airline/airline-southwest-airlines-wn.html",
  "rank": 21,
  "rankChange": -1,
  "searchVolume": 2230000,
  "keywordDifficulty": 32,
  "broadCostPerClick": 0.37,
  "phraseCostPerClick": 0.35,
  "exactCostPerClick": 0.36,
  "seoClicks": 19100,
  "seoClicksChange": -900,
  "totalMonthlyClicks": 2010000,
  "percentMobileSearches": 0.408358172964951,
  "percentDesktopSearches": 0.591641827035049,
  "percentNotClicked": 0.0989223878780141,
  "percentPaidClicks": 0.0822971977797034,
  "percentOrganicClicks": 0.917702802218649,
  "broadMonthlyCost": 94339.8,
  "phraseMonthlyCost": 87103.8,
  "exactMonthlyCost": 87582.6,
  "paidCompetitors": 1,
  "rankingHomepages": 5,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Data Points Available

1. **keyword** (string)
   - **Small** (viridisenergy.com): how much energy does solar energy produce
   - **Medium** (poolsbybradley.com): minto builders florida
   - **Enterprise** (skyscanner.com): southwest airlines

2. **topRankedUrl** (string)
   - **Small** (viridisenergy.com): https://www.viridisenergy.com/learning-center/less...
   - **Medium** (poolsbybradley.com): https://poolsbybradley.com/our-story/builders/mint...
   - **Enterprise** (skyscanner.com): https://www.skyscanner.com/airline/airline-southwe...

3. **rank** (number)
   - **Small** (viridisenergy.com): 25
   - **Medium** (poolsbybradley.com): 34
   - **Enterprise** (skyscanner.com): 21

4. **rankChange** (number)
   - **Small** (viridisenergy.com): -7
   - **Medium** (poolsbybradley.com): -9
   - **Enterprise** (skyscanner.com): -1

5. **searchVolume** (number)
   - **Small** (viridisenergy.com): 480
   - **Medium** (poolsbybradley.com): 750
   - **Enterprise** (skyscanner.com): 2,230,000

6. **keywordDifficulty** (number)
   - **Small** (viridisenergy.com): 37
   - **Medium** (poolsbybradley.com): 21
   - **Enterprise** (skyscanner.com): 32

7. **broadCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.37

8. **phraseCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.35

9. **exactCostPerClick** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.36

10. **seoClicks** (number)
   - **Small** (viridisenergy.com): 3
   - **Medium** (poolsbybradley.com): 4
   - **Enterprise** (skyscanner.com): 19,100

11. **seoClicksChange** (number)
   - **Small** (viridisenergy.com): -2
   - **Medium** (poolsbybradley.com): -1
   - **Enterprise** (skyscanner.com): -900

12. **totalMonthlyClicks** (number)
   - **Small** (viridisenergy.com): 240
   - **Medium** (poolsbybradley.com): 570
   - **Enterprise** (skyscanner.com): 2,010,000

13. **percentMobileSearches** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.41

14. **percentDesktopSearches** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.59

15. **percentNotClicked** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.10

16. **percentPaidClicks** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.08

17. **percentOrganicClicks** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 0.92

18. **broadMonthlyCost** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 0
   - **Enterprise** (skyscanner.com): 94,339.8

19. **phraseMonthlyCost** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): 87,103.8

20. **exactMonthlyCost** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 0
   - **Enterprise** (skyscanner.com): 87,582.6

21. **paidCompetitors** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1
   - **Enterprise** (skyscanner.com): 1

22. **rankingHomepages** (number)
   - **Small** (viridisenergy.com): 1
   - **Medium** (poolsbybradley.com): 1
   - **Enterprise** (skyscanner.com): 5

23. **yourRank** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

24. **yourRankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

25. **yourUrl** (string)
   - **Small** (viridisenergy.com): 
   - **Medium** (poolsbybradley.com): 
   - **Enterprise** (skyscanner.com): 

---

## 🔍 API CALL 9: getSeoKeywords

**Purpose:** All ranking keywords

### API String
```javascript
const url = `https://api.spyfu.com/apis/serp_api/v2/seo/getSeoKeywords?query=${domain}`;
// With limit: url += `&pageSize=5`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ' }
});
const data = await response.json();
```

### Cost Per Domain Size
| Domain Size | Domain | Rows Returned | Cost |
|-------------|--------|---------------|------|
| Small | viridisenergy.com | 5 | $0.0025 |
| Medium | poolsbybradley.com | 5 | $0.0025 |
| Enterprise | skyscanner.com | 5 | $0.0025 |

### Real Data Sample: SMALL (viridisenergy.com)

```json
{
  "keyword": "photovoltaic cell",
  "topRankedUrl": "https://www.viridisenergy.com/learning-center/lesson/10/how-do-solar-photovoltaic-pv-cells-actually-work",
  "rank": 51,
  "rankChange": null,
  "searchVolume": 8100,
  "keywordDifficulty": 46,
  "broadCostPerClick": 2.39,
  "phraseCostPerClick": 3.79,
  "exactCostPerClick": 2.49,
  "seoClicks": 28,
  "seoClicksChange": null,
  "totalMonthlyClicks": 2900,
  "percentMobileSearches": 0.298789239234868,
  "percentDesktopSearches": 0.701210760765132,
  "percentNotClicked": 0.646728971962617,
  "percentPaidClicks": 0.0264550263150528,
  "percentOrganicClicks": 0.973544968393942,
  "broadMonthlyCost": 166.5,
  "phraseMonthlyCost": 39.58,
  "exactMonthlyCost": 70.8,
  "paidCompetitors": 0,
  "rankingHomepages": 3,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: MEDIUM (poolsbybradley.com)

```json
{
  "keyword": "pool builders near me",
  "topRankedUrl": "https://poolsbybradley.com/",
  "rank": 56,
  "rankChange": 36,
  "searchVolume": 20900,
  "keywordDifficulty": 60,
  "broadCostPerClick": 3.96,
  "phraseCostPerClick": 4.15,
  "exactCostPerClick": 4.23,
  "seoClicks": 70,
  "seoClicksChange": 26,
  "totalMonthlyClicks": 14200,
  "percentMobileSearches": 0.604586522493726,
  "percentDesktopSearches": 0.395413477506274,
  "percentNotClicked": 0.321554770318021,
  "percentPaidClicks": 0.114583333034939,
  "percentOrganicClicks": 0.885416664360894,
  "broadMonthlyCost": 1717.8,
  "phraseMonthlyCost": 1350.3,
  "exactMonthlyCost": 1312.5,
  "paidCompetitors": 1,
  "rankingHomepages": 52,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Real Data Sample: ENTERPRISE (skyscanner.com)

```json
{
  "keyword": "southwest airlines",
  "topRankedUrl": "https://www.skyscanner.com/airline/airline-southwest-airlines-wn.html",
  "rank": 21,
  "rankChange": -1,
  "searchVolume": 2230000,
  "keywordDifficulty": 32,
  "broadCostPerClick": 0.37,
  "phraseCostPerClick": 0.35,
  "exactCostPerClick": 0.36,
  "seoClicks": 19100,
  "seoClicksChange": -900,
  "totalMonthlyClicks": 2010000,
  "percentMobileSearches": 0.408358172964951,
  "percentDesktopSearches": 0.591641827035049,
  "percentNotClicked": 0.0989223878780141,
  "percentPaidClicks": 0.0822971977797034,
  "percentOrganicClicks": 0.917702802218649,
  "broadMonthlyCost": 94339.8,
  "phraseMonthlyCost": 87103.8,
  "exactMonthlyCost": 87582.6,
  "paidCompetitors": 1,
  "rankingHomepages": 5,
  "yourRank": null,
  "yourRankChange": null,
  "yourUrl": ""
}
```

### Data Points Available

1. **keyword** (string)
   - **Small** (viridisenergy.com): photovoltaic cell
   - **Medium** (poolsbybradley.com): pool builders near me
   - **Enterprise** (skyscanner.com): southwest airlines

2. **topRankedUrl** (string)
   - **Small** (viridisenergy.com): https://www.viridisenergy.com/learning-center/less...
   - **Medium** (poolsbybradley.com): https://poolsbybradley.com/
   - **Enterprise** (skyscanner.com): https://www.skyscanner.com/airline/airline-southwe...

3. **rank** (number)
   - **Small** (viridisenergy.com): 51
   - **Medium** (poolsbybradley.com): 56
   - **Enterprise** (skyscanner.com): 21

4. **rankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 36
   - **Enterprise** (skyscanner.com): -1

5. **searchVolume** (number)
   - **Small** (viridisenergy.com): 8,100
   - **Medium** (poolsbybradley.com): 20,900
   - **Enterprise** (skyscanner.com): 2,230,000

6. **keywordDifficulty** (number)
   - **Small** (viridisenergy.com): 46
   - **Medium** (poolsbybradley.com): 60
   - **Enterprise** (skyscanner.com): 32

7. **broadCostPerClick** (number)
   - **Small** (viridisenergy.com): 2.39
   - **Medium** (poolsbybradley.com): 3.96
   - **Enterprise** (skyscanner.com): 0.37

8. **phraseCostPerClick** (number)
   - **Small** (viridisenergy.com): 3.79
   - **Medium** (poolsbybradley.com): 4.15
   - **Enterprise** (skyscanner.com): 0.35

9. **exactCostPerClick** (number)
   - **Small** (viridisenergy.com): 2.49
   - **Medium** (poolsbybradley.com): 4.23
   - **Enterprise** (skyscanner.com): 0.36

10. **seoClicks** (number)
   - **Small** (viridisenergy.com): 28
   - **Medium** (poolsbybradley.com): 70
   - **Enterprise** (skyscanner.com): 19,100

11. **seoClicksChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): 26
   - **Enterprise** (skyscanner.com): -900

12. **totalMonthlyClicks** (number)
   - **Small** (viridisenergy.com): 2,900
   - **Medium** (poolsbybradley.com): 14,200
   - **Enterprise** (skyscanner.com): 2,010,000

13. **percentMobileSearches** (number)
   - **Small** (viridisenergy.com): 0.30
   - **Medium** (poolsbybradley.com): 0.60
   - **Enterprise** (skyscanner.com): 0.41

14. **percentDesktopSearches** (number)
   - **Small** (viridisenergy.com): 0.70
   - **Medium** (poolsbybradley.com): 0.40
   - **Enterprise** (skyscanner.com): 0.59

15. **percentNotClicked** (number)
   - **Small** (viridisenergy.com): 0.65
   - **Medium** (poolsbybradley.com): 0.32
   - **Enterprise** (skyscanner.com): 0.10

16. **percentPaidClicks** (number)
   - **Small** (viridisenergy.com): 0.03
   - **Medium** (poolsbybradley.com): 0.11
   - **Enterprise** (skyscanner.com): 0.08

17. **percentOrganicClicks** (number)
   - **Small** (viridisenergy.com): 0.97
   - **Medium** (poolsbybradley.com): 0.89
   - **Enterprise** (skyscanner.com): 0.92

18. **broadMonthlyCost** (number)
   - **Small** (viridisenergy.com): 166.50
   - **Medium** (poolsbybradley.com): 1,717.8
   - **Enterprise** (skyscanner.com): 94,339.8

19. **phraseMonthlyCost** (number)
   - **Small** (viridisenergy.com): 39.58
   - **Medium** (poolsbybradley.com): 1,350.3
   - **Enterprise** (skyscanner.com): 87,103.8

20. **exactMonthlyCost** (number)
   - **Small** (viridisenergy.com): 70.80
   - **Medium** (poolsbybradley.com): 1,312.5
   - **Enterprise** (skyscanner.com): 87,582.6

21. **paidCompetitors** (number)
   - **Small** (viridisenergy.com): 0
   - **Medium** (poolsbybradley.com): 1
   - **Enterprise** (skyscanner.com): 1

22. **rankingHomepages** (number)
   - **Small** (viridisenergy.com): 3
   - **Medium** (poolsbybradley.com): 52
   - **Enterprise** (skyscanner.com): 5

23. **yourRank** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

24. **yourRankChange** (null)
   - **Small** (viridisenergy.com): null
   - **Medium** (poolsbybradley.com): null
   - **Enterprise** (skyscanner.com): null

25. **yourUrl** (string)
   - **Small** (viridisenergy.com): 
   - **Medium** (poolsbybradley.com): 
   - **Enterprise** (skyscanner.com): 

---

