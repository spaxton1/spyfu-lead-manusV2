# Test Directory

This directory will contain unit tests and integration tests for the platform.

**Planned Test Files:**

## Phase 1 Tests:
- `csv-parser.test.ts` - CSV parsing edge cases
- `spyfu-api.test.ts` - API client mocking and error handling
- `nugget-calculator.test.ts` - Nugget calculation validation

## Phase 2 Tests:
- `export-service.test.ts` - Export format validation

## Integration Tests:
- `e2e.test.ts` - Full workflow: upload → process → export

**Test Data:**
- Use `master_test_results.json` for real API response examples
- Use `seed.sql` for database test fixtures

**Status:** Not yet implemented (Phase 1 in progress)
