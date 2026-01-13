/**
 * Crypto Service - Cryptocurrency data fetching and caching
 * Uses CoinGecko API for current prices and historical data
 */

import { getCache, setCache } from './cache';
import cryptoCoins from '@/data/cryptoCoins.json';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const DEFAULT_CRYPTO_IDS = cryptoCoins.map((c) => c.id);

/**
 * Fetch current crypto prices
 * @param {string[]} ids - Crypto IDs (e.g., ['bitcoin', 'ethereum'])
 * @returns {Promise<object>} Prices object keyed by ID
 */
export async function fetchCryptoPrices(ids = DEFAULT_CRYPTO_IDS) {
  const cacheKey = `crypto-prices-${ids.join(',')}`;
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const idsStr = ids.join(',');
    const url = `${COINGECKO_BASE}/simple/price?ids=${idsStr}&vs_currencies=usd`;
    const res = await fetch(url);
    
    if (!res.ok) throw new Error('CoinGecko API error');
    
    const data = await res.json();
    
    // Transform to our format: { bitcoin: 45000, ethereum: 3000, ... }
    const prices = {};
    Object.entries(data).forEach(([id, priceObj]) => {
      prices[id] = priceObj.usd;
    });
    
    setCache(cacheKey, prices, 2 * 60 * 60 * 1000); // 2 hours
    return prices;
  } catch (error) {
    console.error('[cryptoService] fetchCryptoPrices error:', error);
    throw error;
  }
}

/**
 * Fetch historical crypto price data for charting
 * @param {string} id - Crypto ID (e.g., 'bitcoin')
 * @param {number} days - Number of days (7, 30, 90, 365)
 * @returns {Promise<Array>} Array of {date, price} objects
 */
export async function fetchHistoricalCrypto(id = 'bitcoin', days = 30) {
  const cacheKey = `crypto-historical-${id}-${days}d`;
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const url = `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    const res = await fetch(url);
    
    if (!res.ok) throw new Error('CoinGecko historical API error');
    
    const data = await res.json();
    
    // Transform [timestamp, price] array to {date, price} objects
    const chartData = (data.prices || []).map(([timestamp, price]) => ({
      date: new Date(timestamp).toISOString().split('T')[0],
      price,
    }));
    
    setCache(cacheKey, chartData, 3 * 60 * 60 * 1000); // 3 hours cache for historical
    return chartData;
  } catch (error) {
    console.error('[cryptoService] fetchHistoricalCrypto error:', error);
    throw error;
  }
}

/**
 * Get crypto metadata (name, symbol, etc.)
 * @param {string} id - Crypto ID
 * @returns {Promise<object>} Metadata object
 */
export async function fetchCryptoMetadata(id) {
  const cacheKey = `crypto-metadata-${id}`;
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const url = `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`;
    const res = await fetch(url);
    
    if (!res.ok) throw new Error('CoinGecko metadata API error');
    
    const data = await res.json();
    
    const metadata = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image?.small,
    };
    
    setCache(cacheKey, metadata, 24 * 60 * 60 * 1000); // 24 hours
    return metadata;
  } catch (error) {
    console.error('[cryptoService] fetchCryptoMetadata error:', error);
    throw error;
  }
}
