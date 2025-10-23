# 🔍 HTTPS Prefix Test Results

## Test Purpose
Tested if adding `https://` prefix to domain query makes competitor/paid endpoints work.

## Endpoints Tested

- **getDomainCompetitors**: Top competing domains
- **getSeoCompetitors**: SEO competitor list
- **getPaidKeywords**: Current paid keywords
- **getAdHistory**: Historical ad spend
- **getBuyingKeywords**: Keywords they advertise on
- **getPaidCompetitors**: Paid search competitors

## Results Summary

### viridisenergy.com

| Endpoint | Status | Format | Rows | Cost |
|----------|--------|--------|------|------|
| getDomainCompetitors | ❌ Failed | https:// | - | - |
| getSeoCompetitors | ❌ Failed | https:// | - | - |
| getPaidKeywords | ❌ Failed | https:// | - | - |
| getAdHistory | ❌ Failed | https:// | - | - |
| getBuyingKeywords | ❌ Failed | https:// | - | - |
| getPaidCompetitors | ❌ Failed | https:// | - | - |

## Conclusion

**0/6 tests successful** (0.0%)

❌ **No competitor/paid endpoints working** with either query format.

This means:
- Competitor data requires different API (SEMrush, Ahrefs)
- Paid search data requires different API or tier
- Your existing tool uses multiple data sources
- SpyFu API limited to organic SEO data only
