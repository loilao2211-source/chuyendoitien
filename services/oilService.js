/**
 * Oil Service - Crude oil (Brent/WTI) price data fetching and caching
 * Fallback-first strategy: không spam API khi không có key
 * Uses EIA API only if API key available
 */

import { getCache, setCache } from './cache';

const EIA_BASE = 'https://api.eia.gov/v2';
const API_KEY = process.env.NEXT_PUBLIC_EIA_API_KEY || process.env.EIA_API_KEY;
const FALLBACK_BRENT_PRICE = 82; // USD/barrel (Jan 2026 approximate)
const FALLBACK_WTI_PRICE = 78;   // USD/barrel

/**
 * Fetch current Brent crude oil price with safe fallback
 * @returns {Promise<number>} Brent price per barrel in USD
 */
export async function fetchBrentPrice() {
  const cacheKey = 'oil-brent-current';
  const cached = getCache(cacheKey);
  
  // Return cache if available
  if (cached) {
    return cached;
  }
  
  // If no API key, use fallback immediately
  if (!API_KEY) {
    console.warn('[oilService] No EIA_API_KEY - using fallback Brent price:', FALLBACK_BRENT_PRICE);
    return FALLBACK_BRENT_PRICE;
  }
  
  try {
    const url = `${EIA_BASE}/petroleum/pri/spt/data/?api_key=${API_KEY}&frequency=daily&data[0]=value&facets[series][]=RBRTE&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1`;
    const res = await fetch(url, { 
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (!res.ok) {
      console.warn(`[oilService] EIA API error ${res.status} - using fallback`);
      return FALLBACK_BRENT_PRICE;
    }
    
    const data = await res.json();
    if (data.response?.data?.[0]?.value) {
      const price = parseFloat(data.response.data[0].value);
      
      // Sanity check: oil should be between $20-$200/barrel
      if (price >= 20 && price <= 200) {
        setCache(cacheKey, price, 2 * 60 * 60 * 1000); // 2 hours
        return price;
      }
    }
    
    console.warn('[oilService] Invalid API response - using fallback');
    return FALLBACK_BRENT_PRICE;
  } catch (error) {
    console.warn('[oilService] Fetch failed:', error.message, '- using fallback');
    return FALLBACK_BRENT_PRICE;
  }
}

/**
 * Fetch current WTI crude oil price with safe fallback
 * @returns {Promise<number>} WTI price per barrel in USD
 */
export async function fetchWTIPrice() {
  const cacheKey = 'oil-wti-current';
  const cached = getCache(cacheKey);
  
  // Return cache if available
  if (cached) {
    return cached;
  }
  
  // If no API key, use fallback immediately
  if (!API_KEY) {
    console.warn('[oilService] No EIA_API_KEY - using fallback WTI price:', FALLBACK_WTI_PRICE);
    return FALLBACK_WTI_PRICE;
  }
  
  try {
    const url = `${EIA_BASE}/petroleum/pri/spt/data/?api_key=${API_KEY}&frequency=daily&data[0]=value&facets[series][]=RWTC&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1`;
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (!res.ok) {
      console.warn(`[oilService] EIA API error ${res.status} - using fallback`);
      return FALLBACK_WTI_PRICE;
    }
    
    const data = await res.json();
    if (data.response?.data?.[0]?.value) {
      const price = parseFloat(data.response.data[0].value);
      
      // Sanity check
      if (price >= 20 && price <= 200) {
        setCache(cacheKey, price, 2 * 60 * 60 * 1000); // 2 hours
        return price;
      }
    }
    
    console.warn('[oilService] Invalid API response - using fallback');
    return FALLBACK_WTI_PRICE;
  } catch (error) {
    console.warn('[oilService] Fetch failed:', error.message, '- using fallback');
    return FALLBACK_WTI_PRICE;
  }
}

/**
 * Fetch historical oil prices for charting
 * @param {string} type - 'brent' or 'wti'
 * @param {number} days - Number of days
 * @returns {Promise<Array>} Array of {date, price} objects
 */
export async function fetchHistoricalOil(type = 'brent', days = 30) {
  const cacheKey = `oil-historical-${type}-${days}d`;
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    // For demo purposes, generate approximate historical data
    // In production with EIA API key, fetch actual historical data
    const currentPrice = type === 'brent' 
      ? await fetchBrentPrice() 
      : await fetchWTIPrice();
    
    const data = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add realistic variance (±3% random fluctuation)
      const variance = 0.97 + Math.random() * 0.06;
      const price = currentPrice * variance;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100,
      });
    }
    
    setCache(cacheKey, data, 3 * 60 * 60 * 1000); // 3 hours cache for historical
    return data;
  } catch (error) {
    console.error('[oilService] fetchHistoricalOil error:', error);
    return [];
  }
}

/**
 * Note: To get real historical data:
 * 1. Register for free EIA API key at https://www.eia.gov/opendata/
 * 2. Set NEXT_PUBLIC_EIA_API_KEY in .env.local
 * 3. Update the fetch calls to use proper historical endpoints
 */
