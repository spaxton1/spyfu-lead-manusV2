# 🧪 Testing Plan for SpyFu Lead Intelligence Platform

## 📁 Sample Data Available

### **SampleLeads-35.csv**
- **Total Leads:** 36
- **Purpose:** Real-world CSV with actual company websites
- **Location:** `/home/user/webapp/SampleLeads-35.csv`
- **Download:** Available in repository root

### **CSV Structure**
```csv
First Name,Last Name,Title,Company Name,Email,Email Status,Work Direct Phone,Home Phone,Mobile Phone,Corporate Phone,Other Phone,# Employees,Industry,Person Linkedin Url,Website,City,State,Company Address,Company City,Company Phone,Annual Revenue,Secondary Email
```

**Key Fields:**
- **Website** (Column 15): Primary field for domain extraction
- **Person Linkedin Url** (Column 14): Should NOT be used (it's personal profile)
- **Company Name**: For display and reference
- **Multiple Phone Columns**: Mobile, Corporate, Company Phone, Work Direct
- **Email**: Primary and Secondary email fields

---

## 🎯 Testing Strategy

### **Phase 1: CSV Parsing Tests**

#### Test 1.1: Website Column Detection
```javascript
// Test with various header names
const testHeaders = [
  ['First Name', 'Website', 'Company'],           // Expected: 'Website'
  ['name', 'company website', 'email'],           // Expected: 'company website'
  ['Contact', 'URL', 'Phone'],                    // Expected: 'URL'
  ['Person', 'Domain', 'Title'],                  // Expected: 'Domain'
  ['Name', 'Person Linkedin Url', 'Company URL'], // Expected: 'Company URL' (not LinkedIn)
];

testHeaders.forEach(headers => {
  const result = detectWebsiteColumn(headers);
  console.log(`Headers: ${headers.join(', ')} → Detected: ${result}`);
});
```

#### Test 1.2: URL Cleaning and Validation
```javascript
const testUrls = [
  'https://affinitystone.com',                    // Expected: affinitystone.com
  'www.totalflooringinc.com',                     // Expected: totalflooringinc.com
  'http://atlantic-tile.com',                     // Expected: atlantic-tile.com
  'http://www.linkedin.com/in/dave-witbeck',      // Expected: null (LinkedIn profile)
  '',                                             // Expected: null (empty)
  'not-a-valid-url',                              // Expected: null (invalid)
];

testUrls.forEach(url => {
  const cleaned = cleanWebsiteUrl(url);
  console.log(`Input: "${url}" → Cleaned: ${cleaned}`);
});
```

#### Test 1.3: Full CSV Parsing
```javascript
// Parse SampleLeads-35.csv
const result = await parseLeadsCsv(file);

console.log(`Total rows: ${result.totalRows}`);
console.log(`Valid leads: ${result.validLeads}`);
console.log(`Website column: ${result.websiteColumn}`);
console.log(`First 5 domains:`, result.leads.slice(0, 5).map(l => l.domain));

// Expected output:
// Total rows: 36
// Valid leads: ~36 (all have websites)
// Website column: Website
// Domains: affinitystone.com, totalflooringinc.com, atlantic-tile.com, ssrenovations.com, ...
```

---

### **Phase 2: SpyFu API Integration Tests**

**IMPORTANT: Use API credits sparingly. Test with 2-3 domains only.**

#### Test 2.1: Single Domain Test
```javascript
// Pick one domain from sample data
const testDomain = 'affinitystone.com';

// Test all 4 APIs
const results = await Promise.all([
  fetchSpyFuTrends(testDomain),           // API #1
  fetchSpyFuPage1Keywords(testDomain),    // API #2
  fetchSpyFuMoneyKeywords(testDomain),    // API #3
  fetchSpyFuCompetitors(testDomain),      // API #4
]);

console.log('API #1 (Trends):', results[0]);
console.log('API #2 (Page 1 KWs):', results[1]);
console.log('API #3 (Money KWs):', results[2]);
console.log('API #4 (Competitors):', results[3]);
```

#### Test 2.2: Error Handling
```javascript
// Test with invalid domain
const invalidDomain = 'this-domain-definitely-does-not-exist-12345.com';

try {
  const result = await fetchSpyFuTrends(invalidDomain);
  console.log('Result:', result);
} catch (error) {
  console.log('Expected error:', error.message);
  // Should handle gracefully without crashing
}
```

---

### **Phase 3: Nugget Calculation Tests**

#### Test 3.1: Snapshot Nugget (Row 1)
```javascript
// Using real API data from affinitystone.com
const trendsData = { /* actual API response */ };

const snapshot = calculateSnapshotNugget(trendsData);
console.log('Snapshot:', snapshot);

// Expected format: "2,496 KWs | $8,281 | 888 Clicks |36A"
// Validate:
// - Title ≤ 20 chars ✓
// - Data ≤ 40 chars ✓
// - Pipe-separated ✓
// - Exact numbers (not rounded) ✓
```

#### Test 3.2: Local Keyword Detection
```javascript
const testKeywords = [
  'plastic surgery north carolina',      // ✓ Local (state name)
  'coolsculpting greensboro',            // ✓ Local (city: Greensboro, NC)
  'chiropractor near me',                // ✗ NOT local (nationwide search)
  'tummy tuck beverly hills',            // ✓ Local (city: Beverly Hills, CA)
  'rhinoplasty',                         // ✗ NOT local (generic)
  'boston plastic surgery',              // ✓ Local (city: Boston, MA)
  'plastic surgery 90210',               // ✓ Local (ZIP code)
  'north shore dental',                  // ✓ Local (geographic descriptor)
];

testKeywords.forEach(kw => {
  const isLocal = hasLocalIdentifier(kw);
  console.log(`"${kw}" → Local: ${isLocal ? '✓' : '✗'}`);
});
```

#### Test 3.3: All 32 Nuggets Generation
```javascript
// Using complete API data from one domain
const allApiData = {
  trends: { /* API #1 response */ },
  page1Keywords: { /* API #2 response */ },
  moneyKeywords: { /* API #3 response */ },
  competitors: { /* API #4 response */ }
};

const nuggets = calculateAll32Nuggets(allApiData, 'affinitystone.com');

// Validate
console.log('Total nuggets:', nuggets.length); // Should be 32
nuggets.forEach((nugget, i) => {
  const titleLen = nugget.title.length;
  const dataLen = nugget.data.length;
  
  if (titleLen > 20 || dataLen > 40) {
    console.error(`Row ${i+1} FAILED: Title=${titleLen}, Data=${dataLen}`);
  } else {
    console.log(`Row ${i+1} ✓: ${nugget.title} | ${nugget.data}`);
  }
});
```

---

### **Phase 4: Database Storage Tests**

#### Test 4.1: Store API Responses
```javascript
// Store raw API data in D1 database
await storeApiResponse({
  domain: 'affinitystone.com',
  apiName: 'trends',
  response: trendsData,
  fetchedAt: new Date()
});

// Verify storage
const stored = await getApiResponse('affinitystone.com', 'trends');
console.log('Stored data matches:', JSON.stringify(stored) === JSON.stringify(trendsData));
```

#### Test 4.2: Store Calculated Nuggets
```javascript
// Store all 32 nuggets for a domain
await storeNuggets('affinitystone.com', nuggets);

// Retrieve and verify
const retrieved = await getNuggets('affinitystone.com');
console.log('Retrieved nuggets:', retrieved.length); // Should be 32

// Verify order is preserved
retrieved.forEach((nugget, i) => {
  console.log(`Row ${i+1}: ${nugget.title}`);
});
```

---

### **Phase 5: Batch Processing Tests**

#### Test 5.1: Small Batch (3 domains)
```javascript
// Test with first 3 domains from SampleLeads-35.csv
const testBatch = [
  'affinitystone.com',
  'totalflooringinc.com',
  'atlantic-tile.com'
];

const results = await processBatch(testBatch);

console.log('Success:', results.successful);
console.log('Failed:', results.failed);
console.log('Total time:', results.duration);

// Expected: All 3 should succeed (if they have SEO data)
```

#### Test 5.2: Error Recovery
```javascript
// Include invalid domain in batch
const testBatchWithError = [
  'affinitystone.com',               // Valid
  'invalid-domain-xyz.com',          // Invalid
  'totalflooringinc.com'             // Valid
];

const results = await processBatch(testBatchWithError);

// Should continue processing despite error
console.log('Successful:', results.successful); // Expected: 2
console.log('Failed:', results.failed);         // Expected: 1
console.log('Failed domains:', results.failedDomains); // ['invalid-domain-xyz.com']
```

---

## 🚨 Testing Guidelines

### **API Credit Conservation**
1. **Never test with all 36 domains** in development
2. **Use 2-3 domains maximum** for API integration tests
3. **Cache API responses** during development to avoid repeated calls
4. **Use mock data** for UI and calculation tests

### **Suggested Test Domains**
Start with these 3 domains (diverse industries):
1. `affinitystone.com` - Building materials (small business)
2. `westlakeplasticsurgery.com` - Medical practice (likely has local keywords)
3. `efclean.com` - Facilities services (may have location-based SEO)

### **Development Workflow**
```bash
# 1. Test CSV parsing (no API calls)
npm run test:csv

# 2. Test with single domain (uses 4 API credits)
npm run test:single -- affinitystone.com

# 3. Test nugget calculations (uses cached API data)
npm run test:nuggets

# 4. Test batch processing with 3 domains (uses 12 API credits)
npm run test:batch

# 5. Full integration test with sample CSV (uses 36 × 4 = 144 credits)
# ONLY run when ready for production testing
npm run test:full
```

---

## ✅ Success Criteria

### **CSV Parsing**
- ✓ Detects website column from various header names
- ✓ Cleans URLs and extracts clean domains
- ✓ Skips LinkedIn profiles and invalid URLs
- ✓ Parses all 36 leads from SampleLeads-35.csv

### **API Integration**
- ✓ Successfully fetches data from all 4 SpyFu APIs
- ✓ Handles API errors gracefully (timeouts, invalid domains)
- ✓ Stores raw API responses in D1 database

### **Nugget Calculations**
- ✓ Generates all 32 nuggets in correct order
- ✓ All titles ≤ 20 characters
- ✓ All data ≤ 40 characters
- ✓ Local keyword detection works with city names, states, ZIP codes
- ✓ Historical trend calculations (peak decline algorithm)

### **Database Storage**
- ✓ Raw API data stored as JSON in api_responses table
- ✓ Calculated nuggets stored in ranking_nuggets table
- ✓ Data can be retrieved and exported to CSV

### **Batch Processing**
- ✓ Processes multiple domains sequentially
- ✓ Continues processing if individual domains fail
- ✓ Reports success/failure statistics
- ✓ Reasonable performance (not blocking UI)

---

## 📊 Test Results Template

```markdown
## Test Run: [Date]

### CSV Parsing
- ✓ Website detection: PASS
- ✓ URL cleaning: PASS
- ✓ Sample CSV parsed: 36/36 leads

### API Integration (3 domains tested)
- ✓ affinitystone.com: SUCCESS
- ✓ westlakeplasticsurgery.com: SUCCESS
- ✗ invalid-domain.com: FAILED (expected)

### Nugget Calculations
- ✓ Snapshot: "2,496 KWs | $8,281 | 888 Clicks |36A" (39 chars)
- ✓ Local KW L1: "plastic surgery NC|#14|$8.7" (29 chars)
- ✓ All 32 nuggets generated
- ✓ All within character limits

### Database Storage
- ✓ API responses stored: 12 records
- ✓ Nuggets stored: 96 records (3 domains × 32 nuggets)
- ✓ Data retrieval: PASS

### Performance
- CSV parsing: 45ms
- API fetch (1 domain, 4 APIs): 3.2s
- Nugget calculation (1 domain): 120ms
- Database storage (1 domain): 85ms
- Total per domain: ~3.5s

### Issues Found
- None

### Next Steps
- Proceed to Phase 2 implementation
```

---

## 🔄 Continuous Testing

As development progresses:
1. **Run CSV tests** after any parsing changes
2. **Run single-domain test** after API client changes
3. **Run nugget tests** after calculation logic changes
4. **Run batch test** before committing major features
5. **Run full test** only before production deployment

**Remember:** API credits are real. Test smartly! 🎯
