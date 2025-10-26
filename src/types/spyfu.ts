/**
 * SpyFu API Response Types
 * Based on actual API responses from testing
 */

// API #1: Domain Stats Response (Live SEO Stats)
export interface DomainStatsResponse {
  resultCount: number;
  domain: string;
  url: string;
  totalOrganicResults: number;
  monthlyOrganicClicks: number;
  monthlyOrganicClickValue: number;
  totalSearchVolume: number;
}

// API #2 & #3 & #4: Keyword Response
export interface KeywordResult {
  keyword: string;
  topRankedUrl: string;
  rank: number;
  rankChange: number | null;
  searchVolume: number;
  keywordDifficulty: number;
  broadCostPerClick: number | null;
  phraseCostPerClick: number | null;
  exactCostPerClick: number | null;
  seoClicks: number;
  seoClicksChange: number | null;
  totalMonthlyClicks: number;
  percentMobileSearches: number | null;
  percentDesktopSearches: number | null;
  percentNotClicked: number | null;
  percentPaidClicks: number | null;
  percentOrganicClicks: number | null;
  broadMonthlyCost: number;
  phraseMonthlyCost: number | null;
  exactMonthlyCost: number | null;
  paidCompetitors: number;
  rankingHomepages: number;
  yourRank: number | null;
  yourRankChange: number | null;
  yourUrl: string;
}

export interface KeywordsResponse {
  resultCount: number;
  results: KeywordResult[];
}

// Unified API Response Type
export interface SpyFuApiResponse {
  domainStats?: DomainStatsResponse;
  page1Keywords?: KeywordsResponse;
  moneyKeywords?: KeywordsResponse;
  gainedRanks?: KeywordsResponse;
}

// API Client Configuration
export interface SpyFuConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

// Error Types
export class SpyFuApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string,
    public domain?: string
  ) {
    super(message);
    this.name = 'SpyFuApiError';
  }
}
