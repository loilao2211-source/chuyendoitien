/**
 * Gold Service - Gold (XAU) price data fetching and caching
 * Fallback-first strategy: không spam API, dùng cache và VN gold data
 * Metals-API chỉ gọi nếu có METALS_API_KEY
 */

import { getCache, setCache } from './cache';
import { metals } from '@/lib/providers/metals';

const METALS_API_BASE = 'https://metals-api.com/api';
const API_KEY = process.env.NEXT_PUBLIC_METALS_API_KEY || process.env.METALS_API_KEY;
const FALLBACK_GOLD_PRICE = 4865.26; // Current market price Jan 21, 2026 (Investing.com)
const REASONABLE_XAU_MIN = 500;
const REASONABLE_XAU_MAX = 20000;

/**
 * Normalize and validate XAU price
 */
function normalizeXauPrice(rawValue, source = 'unknown') {
  let xauUsd = rawValue;
  let inverted = false;

  // Detect inverted pair (value < 1 suggests USDXAU not XAUUSD)
  if (rawValue < 1) {
    xauUsd = 1 / rawValue;
    inverted = true;
  }

  const isValid = xauUsd >= REASONABLE_XAU_MIN && xauUsd <= REASONABLE_XAU_MAX;

  // Dev validator
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.log('[Gold Service - XAU Normalization]', {
      source,
      rawValue,
      normalizedXauUsd: xauUsd,
      inverted,
      isValid,
      timestamp: new Date().toISOString(),
    });

    if (!isValid) {
      console.warn(`[Gold Service] XAU price outside range: ${xauUsd} USD/oz (expected ${REASONABLE_XAU_MIN}-${REASONABLE_XAU_MAX})`);
    }
  }

  return { xauUsd, inverted, isValid };
}

/**
 * Fetch current gold price (XAU/USD) with safe fallback strategy
 * @returns {Promise<number>} Gold price per troy ounce in USD
 */
export async function fetchGoldPrice() {
  const cacheKey = 'gold-price-current';
  const cached = getCache(cacheKey);
  
  // Return cache if fresh (< 5 minutes for better real-time accuracy)
  if (cached) {
    if (typeof cached === 'number') {
      return cached;
    }
    if (cached.xauUsd && cached.updatedAt) {
      const ageMs = Date.now() - new Date(cached.updatedAt).getTime();
      if (ageMs < 5 * 60 * 1000) { // 5 minutes
        return cached.xauUsd; // Return number, not object
      }
    }
  }
  
  try {
    // Prefer shared metals provider (same as /api/gold) for consistency
    const result = await metals.getGoldPrice('USD');
    const pricePerOz = result?.xauUsd;

    if (pricePerOz && pricePerOz >= REASONABLE_XAU_MIN && pricePerOz <= REASONABLE_XAU_MAX) {
      const payload = {
        xauUsd: pricePerOz,
        source: result.source || 'unknown',
        updatedAt: result.updatedAt || new Date().toISOString(),
        inverted: result.inverted || false,
      };
      setCache(cacheKey, payload, 10 * 60 * 1000); // Cache for 10 minutes
      return payload.xauUsd;
    }

    // Fallback to direct API if provider returned unexpected shape
    if (API_KEY && API_KEY !== 'demo') {
      const url = `${METALS_API_BASE}/latest?access_key=${API_KEY}&base=USD&symbols=XAU`;
      const res = await fetch(url, { 
        cache: 'no-store',
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(5000)
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.rates?.XAU) {
          const normalized = normalizeXauPrice(data.rates.XAU, 'metals-api-direct');
          if (normalized.isValid) {
            const payload = {
              xauUsd: normalized.xauUsd,
              source: 'metals-api-direct',
              updatedAt: new Date().toISOString(),
              inverted: normalized.inverted,
            };
            setCache(cacheKey, payload, 10 * 60 * 1000);
            return payload.xauUsd;
          }
        }
      }
    }

    console.warn('[goldService] Invalid gold data, using fallback');
    return FALLBACK_GOLD_PRICE;
  } catch (error) {
    console.warn('[goldService] Fetch failed:', error.message, '- using fallback');
    return FALLBACK_GOLD_PRICE;
  }
}

/**
 * Fetch historical gold prices for charting
 * Note: Free tier doesn't support historical data
 * This returns mock data or placeholder
 * @param {number} days - Number of days
 * @returns {Promise<Array>} Array of {date, price} objects
 */
export async function fetchHistoricalGold(days = 30) {
  const cacheKey = `gold-historical-${days}d`;
  const cached = getCache(cacheKey);
  
  // Check cache freshness - refresh if older than 30 minutes
  if (cached && cached.length > 0) {
    const cacheAge = Date.now() - new Date(cached[0].timestamp || 0).getTime();
    if (cacheAge < 30 * 60 * 1000) {
      return cached;
    }
  }
  
  try {
    // Get current price (will use updated 4865.26 or live API)
    const currentPrice = await fetchGoldPrice();
    const data = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some realistic variance (±3% random fluctuation for gold)
      const variance = 0.97 + Math.random() * 0.06;
      const price = currentPrice * variance;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100,
        timestamp: new Date().toISOString(),
      });
    }
    
    setCache(cacheKey, data, 30 * 60 * 1000); // 30 minutes cache for historical
    return data;
  } catch (error) {
    console.error('[goldService] fetchHistoricalGold error:', error);
    // Return fallback data with current market price
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variance = 0.97 + Math.random() * 0.06;
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(FALLBACK_GOLD_PRICE * variance * 100) / 100,
      });
    }
    return data;
  }
}

/**
 * Note: For production use, consider these alternatives:
 * 1. Alpha Vantage (free tier with limits)
 * 2. Twelve Data API
 * 3. Quandl/NASDAQ Data Link
 * 4. Store daily snapshots in your own database
 */
