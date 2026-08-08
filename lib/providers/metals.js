// Metals API provider for gold prices (XAU/USD)
// Free tier: https://metals-api.com/ (limited calls)
// For production: set METALS_API_KEY env var

import { http } from '../http.js';

// Constants
const OZ_TO_GRAM = 31.1034768;
const REASONABLE_XAU_MIN = 500;  // USD per oz
const REASONABLE_XAU_MAX = 20000; // USD per oz

/**
 * Normalize XAU price to ensure it's always USD per troy ounce
 * Detects and inverts USDXAU (XAU per USD) if needed
 */
function normalizeXauPrice(rawValue, source = 'unknown') {
  let xauUsd = rawValue;
  let inverted = false;

  // Detect inverted pair (USDXAU instead of XAUUSD)
  // If value < 1, it's likely XAU per USD, need to invert
  if (rawValue < 1) {
    xauUsd = 1 / rawValue;
    inverted = true;
  }

  // Validate reasonable range
  const isValid = xauUsd >= REASONABLE_XAU_MIN && xauUsd <= REASONABLE_XAU_MAX;

  // Optional validator
  if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.log('[XAU Normalization]', {
      source,
      rawValue,
      normalizedXauUsd: xauUsd,
      inverted,
      isValid,
      unit: 'USD_per_troy_oz',
    });

    if (!isValid) {
      console.warn(`[XAU Warning] Price outside reasonable range: ${xauUsd} (expected ${REASONABLE_XAU_MIN}-${REASONABLE_XAU_MAX})`);
    }
  }

  return {
    xauUsd,
    inverted,
    isValid,
  };
}

export const metals = {
  async getGoldPrice(quote = 'USD') {
    const timestamp = new Date().toISOString();
    
    try {
      // Try Yahoo Finance first (free, real-time, no API key needed)
      try {
        const yahooUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1m&range=1d';
        const yahooResponse = await fetch(yahooUrl, {
          signal: AbortSignal.timeout(5000),
          cache: 'no-store',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (yahooResponse.ok) {
          const yahooData = await yahooResponse.json();
          const result = yahooData?.chart?.result?.[0];
          const currentPrice = result?.meta?.regularMarketPrice;
          
          if (currentPrice && currentPrice > 0) {
            const normalized = normalizeXauPrice(currentPrice, 'yahoo-finance');
            if (normalized.isValid) {
              return {
                quote,
                xauUsd: normalized.xauUsd,
                unit: 'USD_per_troy_oz',
                source: 'yahoo-finance',
                sourceType: 'live',
                isEstimated: false,
                inverted: normalized.inverted,
                updatedAt: timestamp,
              };
            }
          }
        }
      } catch {
      }
      
      const apiKey = process.env.METALS_API_KEY;

      // If no API key, return mock price
      if (!apiKey) {
        // Fallback to current market price (updated Jan 21, 2026)
        // Source: Investing.com XAU/USD spot price
        const normalized = normalizeXauPrice(4865.26, 'mock-current');
        return {
          quote,
          xauUsd: normalized.xauUsd,
          unit: 'USD_per_troy_oz',
          source: 'mock-current',
          sourceType: 'fallback',
          isEstimated: true,
          inverted: normalized.inverted,
          updatedAt: timestamp,
          note: 'Fallback price used because no live gold provider/API key was available.',
        };
      }

      const url = `https://metals-api.com/api/spot?base=XAU&target=${quote}&api_key=${apiKey}`;
      // Use cache: 'no-store' to avoid stale data, or revalidate every 5 minutes
      const data = await http.fetch(url, { 
        timeout: 8000, 
        retries: 2,
        cache: 'no-store',
        next: { revalidate: 300 } // 5 minutes
      });

      if (!data.rates || !data.rates[quote]) {
        throw new Error('Invalid gold price response');
      }

      const rawValue = data.rates[quote];
      const normalized = normalizeXauPrice(rawValue, 'metals-api');

      return {
        quote,
        xauUsd: normalized.xauUsd,
        unit: 'USD_per_troy_oz',
        source: 'metals-api',
        sourceType: 'live',
        isEstimated: false,
        inverted: normalized.inverted,
        updatedAt: timestamp,
      };
    } catch {
      
      // Return fallback instead of throwing
      const normalized = normalizeXauPrice(4865.26, 'fallback-error');
      return {
        quote,
        xauUsd: normalized.xauUsd,
        unit: 'USD_per_troy_oz',
        source: 'fallback-error',
        sourceType: 'fallback',
        isEstimated: true,
        inverted: normalized.inverted,
        updatedAt: timestamp,
        note: 'Fallback price used after live gold providers failed.',
      };
    }
  },
};

export default metals;
