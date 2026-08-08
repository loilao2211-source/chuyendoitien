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
const WEBGIA_OIL_URL = 'https://webgia.com/gia-xang-dau/petrolimex/';

function decodeHtml(value) {
  return String(value)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToText(html) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function parseUsdPrice(value) {
  const number = Number.parseFloat(String(value).replace(/,/g, ''));
  return Number.isFinite(number) && number >= 20 && number <= 200 ? number : null;
}

function fallbackOilQuote(type, source = 'fallback-current') {
  return {
    type,
    price: type === 'brent' ? FALLBACK_BRENT_PRICE : FALLBACK_WTI_PRICE,
    unit: 'USD_per_barrel',
    source,
    sourceType: 'fallback',
    isEstimated: true,
    updatedAt: new Date().toISOString(),
    note: 'Fallback oil price. Verify against a live market source before trading.',
  };
}

function parseWebgiaOil(html, type) {
  const text = htmlToText(html);
  const label = type === 'brent' ? 'Brent' : 'WTI';
  const match = text.match(new RegExp(`${label}\\s*(?:\\|\\s*)?\\$?\\s*([0-9]+(?:\\.[0-9]+)?)`, 'i'));
  const price = match ? parseUsdPrice(match[1]) : null;

  if (!price) {
    throw new Error(`Cannot parse ${label} oil price from WebGia`);
  }

  return {
    type,
    price,
    unit: 'USD_per_barrel',
    source: 'webgia-oil',
    sourceType: 'live',
    isEstimated: false,
    updatedAt: new Date().toISOString(),
  };
}

async function fetchFromWebgia(type) {
  const response = await fetch(WEBGIA_OIL_URL, {
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ChuyenDoiTienBot/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`WebGia oil HTTP ${response.status}`);
  }

  return parseWebgiaOil(await response.text(), type);
}

async function fetchFromEia(type) {
  const series = type === 'brent' ? 'RBRTE' : 'RWTC';
  const url = `${EIA_BASE}/petroleum/pri/spt/data/?api_key=${API_KEY}&frequency=daily&data[0]=value&facets[series][]=${series}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1`;
  const res = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`EIA oil HTTP ${res.status}`);
  }

  const data = await res.json();
  const price = parseUsdPrice(data.response?.data?.[0]?.value);
  if (!price) {
    throw new Error('Invalid EIA oil price response');
  }

  return {
    type,
    price,
    unit: 'USD_per_barrel',
    source: 'eia',
    sourceType: 'live',
    isEstimated: false,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchOilQuote(type = 'brent') {
  const normalizedType = type === 'wti' ? 'wti' : 'brent';
  const cacheKey = `oil-${normalizedType}-quote`;
  const cached = getCache(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const quote = API_KEY ? await fetchFromEia(normalizedType) : await fetchFromWebgia(normalizedType);
    setCache(cacheKey, quote, 2 * 60 * 60 * 1000);
    return quote;
  } catch {
    try {
      const quote = await fetchFromWebgia(normalizedType);
      setCache(cacheKey, quote, 30 * 60 * 1000);
      return quote;
    } catch {
      const fallback = fallbackOilQuote(normalizedType, 'fallback-error');
      setCache(cacheKey, fallback, 10 * 60 * 1000);
      return fallback;
    }
  }
}

/**
 * Fetch current Brent crude oil price with safe fallback
 * @returns {Promise<number>} Brent price per barrel in USD
 */
export async function fetchBrentPrice() {
  const quote = await fetchOilQuote('brent');
  return quote.price;
}

/**
 * Fetch current WTI crude oil price with safe fallback
 * @returns {Promise<number>} WTI price per barrel in USD
 */
export async function fetchWTIPrice() {
  const quote = await fetchOilQuote('wti');
  return quote.price;
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
  } catch {
    return [];
  }
}

/**
 * Note: To get real historical data:
 * 1. Register for free EIA API key at https://www.eia.gov/opendata/
 * 2. Set NEXT_PUBLIC_EIA_API_KEY in .env.local
 * 3. Update the fetch calls to use proper historical endpoints
 */
