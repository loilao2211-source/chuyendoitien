/**
 * Gold Service - Gold (XAU) price data fetching and caching
 * Fallback-first strategy: không spam API, dùng cache và VN gold data
 * Metals-API chỉ gọi nếu có METALS_API_KEY
 */

import { getCache, setCache } from './cache';
import { metals } from '@/lib/providers/metals';

const METALS_API_BASE = 'https://metals-api.com/api';
const API_KEY = process.env.NEXT_PUBLIC_METALS_API_KEY || process.env.METALS_API_KEY;
const FALLBACK_GOLD_PRICE = 4509.21; // Align with metals provider mock (Jan 2026 realistic)

/**
 * Fetch current gold price (XAU/USD) with safe fallback strategy
 * @returns {Promise<number>} Gold price per troy ounce in USD
 */
export async function fetchGoldPrice() {
  const cacheKey = 'gold-price-current';
  const cached = getCache(cacheKey);
  
  // Return cache immediately if available and fresh (< 2 hours)
  if (cached) {
    return cached;
  }
  
  try {
    // Prefer shared metals provider (same as /api/gold) for consistency
    const result = await metals.getGoldPrice('USD');
    const pricePerOz = result?.xauUsd;

    if (pricePerOz && pricePerOz >= 500 && pricePerOz <= 10000) {
      setCache(cacheKey, pricePerOz, 2 * 60 * 60 * 1000); // 2 hours
      return pricePerOz;
    }

    // Fallback to direct API if provider returned unexpected shape
    if (API_KEY && API_KEY !== 'demo') {
      const url = `${METALS_API_BASE}/latest?access_key=${API_KEY}&base=USD&symbols=XAU`;
      const res = await fetch(url, { 
        cache: 'no-store',
        signal: AbortSignal.timeout(5000)
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.rates?.XAU) {
          const apiPrice = 1 / data.rates.XAU;
          if (apiPrice >= 500 && apiPrice <= 10000) {
            setCache(cacheKey, apiPrice, 2 * 60 * 60 * 1000);
            return apiPrice;
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
  
  if (cached) {
    return cached;
  }
  
  try {
    // For demo purposes, generate approximate historical data
    // In production, use a paid API or alternative source
    const currentPrice = await fetchGoldPrice();
    const data = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some realistic variance (±2% random fluctuation)
      const variance = 0.98 + Math.random() * 0.04;
      const price = currentPrice * variance;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100,
      });
    }
    
    setCache(cacheKey, data, 3 * 60 * 60 * 1000); // 3 hours cache for historical
    return data;
  } catch (error) {
    console.error('[goldService] fetchHistoricalGold error:', error);
    return [];
  }
}

/**
 * Note: For production use, consider these alternatives:
 * 1. Alpha Vantage (free tier with limits)
 * 2. Twelve Data API
 * 3. Quandl/NASDAQ Data Link
 * 4. Store daily snapshots in your own database
 */
