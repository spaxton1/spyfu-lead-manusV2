/**
 * SpyFu API Client
 * Fetches SEO data from SpyFu's 4 core APIs with retry logic and error handling
 */

import type {
  DomainStatsResponse,
  KeywordsResponse,
  SpyFuConfig,
  SpyFuApiResponse,
  SpyFuApiError,
} from '../types/spyfu';

export class SpyFuClient {
  private config: Required<SpyFuConfig>;

  constructor(config: SpyFuConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://api.spyfu.com',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
    };
  }

  /**
   * Generic fetch with retry logic and error handling
   */
  private async fetchWithRetry(
    url: string,
    retries = this.config.retries
  ): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Authorization': `Basic ${this.config.apiKey}`,
            'Accept': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        // Handle HTTP errors
        if (!response.ok) {
          if (response.status === 429) {
            // Rate limit - wait longer before retry
            const waitTime = Math.pow(2, attempt) * 2000;
            console.warn(`Rate limited, waiting ${waitTime}ms before retry ${attempt}/${retries}`);
            await this.sleep(waitTime);
            continue;
          }

          if (response.status === 404) {
            throw new Error(`Domain not found in SpyFu database`);
          }

          if (response.status === 401) {
            throw new Error(`Invalid API key`);
          }

          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on auth errors
        if (error instanceof Error && error.message.includes('Invalid API key')) {
          throw error;
        }

        // Wait before retry with exponential backoff
        if (attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.warn(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
          await this.sleep(waitTime);
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * API #1: Get Domain Stats (Live SEO Stats)
   * Cost: $0.002 per domain
   */
  async getDomainStats(domain: string): Promise<DomainStatsResponse> {
    const url = `${this.config.baseUrl}/apis/serp_api/v2/seo/getLiveSeoStats?query=${encodeURIComponent(domain)}`;

    try {
      const data = await this.fetchWithRetry(url);
      return data as DomainStatsResponse;
    } catch (error) {
      throw new Error(`API #1 (Domain Stats) failed for ${domain}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * API #2: Get Page 1 Keywords (ranks 1-10)
   * Cost: Included in partial/full tier
   */
  async getPage1Keywords(domain: string): Promise<KeywordsResponse> {
    const url = `${this.config.baseUrl}/apis/serp_api/v2/seo/getSeoKeywords?query=${encodeURIComponent(domain)}&pageSize=500`;

    try {
      const data = await this.fetchWithRetry(url);
      return data as KeywordsResponse;
    } catch (error) {
      throw new Error(`API #2 (Page 1 Keywords) failed for ${domain}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * API #3: Get Money Keywords (high value keywords)
   * Cost: Included in partial/full tier
   */
  async getMoneyKeywords(domain: string): Promise<KeywordsResponse> {
    const url = `${this.config.baseUrl}/apis/serp_api/v2/seo/getMostValuableKeywords?query=${encodeURIComponent(domain)}&pageSize=500`;

    try {
      const data = await this.fetchWithRetry(url);
      return data as KeywordsResponse;
    } catch (error) {
      throw new Error(`API #3 (Money Keywords) failed for ${domain}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * API #4: Get Gained Ranks Keywords (competitive intel - improving keywords)
   * Cost: Only included in full tier ($0.17)
   */
  async getGainedRanksKeywords(domain: string): Promise<KeywordsResponse> {
    const url = `${this.config.baseUrl}/apis/serp_api/v2/seo/getGainedRanksKeywords?query=${encodeURIComponent(domain)}&pageSize=50`;

    try {
      const data = await this.fetchWithRetry(url);
      return data as KeywordsResponse;
    } catch (error) {
      throw new Error(`API #4 (Gained Ranks) failed for ${domain}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch all APIs for a domain based on tier
   * @param domain - Domain to analyze
   * @param tier - API tier (minimal, partial, full)
   */
  async fetchAllData(
    domain: string,
    tier: 'minimal' | 'partial' | 'full' = 'full'
  ): Promise<SpyFuApiResponse> {
    const result: SpyFuApiResponse = {};

    try {
      // API #1: Always fetch (included in all tiers)
      console.log(`[${domain}] Fetching API #1 (Domain Stats)...`);
      result.domainStats = await this.getDomainStats(domain);
      await this.sleep(500); // Rate limiting delay

      if (tier === 'minimal') {
        return result;
      }

      // API #2: Page 1 Keywords
      console.log(`[${domain}] Fetching API #2 (Page 1 Keywords)...`);
      result.page1Keywords = await this.getPage1Keywords(domain);
      await this.sleep(500);

      // API #3: Money Keywords
      console.log(`[${domain}] Fetching API #3 (Money Keywords)...`);
      result.moneyKeywords = await this.getMoneyKeywords(domain);
      await this.sleep(500);

      if (tier === 'partial') {
        return result;
      }

      // API #4: Gained Ranks (only for full tier)
      console.log(`[${domain}] Fetching API #4 (Gained Ranks)...`);
      result.gainedRanks = await this.getGainedRanksKeywords(domain);

      return result;
    } catch (error) {
      console.error(`[${domain}] Error fetching SpyFu data:`, error);
      throw error;
    }
  }
}

/**
 * Create SpyFu client instance
 */
export function createSpyFuClient(apiKey: string): SpyFuClient {
  return new SpyFuClient({ apiKey });
}
