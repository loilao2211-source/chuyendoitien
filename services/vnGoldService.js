/**
 * Vietnam Gold Service - Fetch real-time gold prices from Vietnamese sources
 * Primary: SJC XML API (free, ~15 min delay)
 * Fallback: vn-prices.json (manual update)
 */

import { getCache, setCache } from './cache';
import vnPricesStatic from '@/data/vn-prices.json';

const SJC_XML_URL = 'https://sjc.com.vn/xml/tygiavang.xml';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Parse SJC XML response to structured JSON
 * XML format:
 * <root>
 *   <ratelist>
 *     <city name="Hà Nội - Hồ Chí Minh">
 *       <item type="Vàng SJC 1L, 5c, 10c" buy="168000000" sell="170000000"/>
 *     </city>
 *   </ratelist>
 * </root>
 */
function parseSjcXml(xmlText) {
  try {
    // Simple XML parsing without external library
    const items = [];
    
    // Extract city section (usually "Hà Nội - Hồ Chí Minh")
    const cityMatch = xmlText.match(/<city[^>]*>(.*?)<\/city>/s);
    if (!cityMatch) throw new Error('No city data found');
    
    const cityContent = cityMatch[1];
    
    // Extract all items
    const itemRegex = /<item[^>]*type="([^"]*)"[^>]*buy="([^"]*)"[^>]*sell="([^"]*)"/g;
    let match;
    
    while ((match = itemRegex.exec(cityContent)) !== null) {
      const [, type, buyStr, sellStr] = match;
      const buy = parseInt(buyStr, 10);
      const sell = parseInt(sellStr, 10);
      
      if (!isNaN(buy) && !isNaN(sell)) {
        items.push({
          brand: 'SJC',
          type: type.trim(),
          buy,
          sell,
          logo: '/logos/gold/SJC.png'
        });
      }
    }
    
    if (items.length === 0) throw new Error('No valid items parsed');
    
    return {
      updatedAt: new Date().toISOString(),
      unit: 'VND/lượng (1 lượng = 10 chỉ = 37.5g)',
      items,
      note: 'Giá từ SJC, cập nhật tự động mỗi ~15 phút',
      source: 'sjc-api'
    };
  } catch (error) {
    console.error('[vnGoldService] XML parsing failed:', error.message);
    throw error;
  }
}

/**
 * Fetch gold prices from SJC API
 * Returns null if failed (caller should use fallback)
 */
async function fetchFromSjcApi() {
  try {
    const response = await fetch(SJC_XML_URL, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000), // 8s timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.warn('[vnGoldService] SJC API returned', response.status);
      return null;
    }
    
    const xmlText = await response.text();
    const goldData = parseSjcXml(xmlText);
    
    console.log('[vnGoldService] Fetched from SJC API:', goldData.items.length, 'items');
    return goldData;
    
  } catch (error) {
    console.warn('[vnGoldService] SJC API fetch failed (SSL/network issue common):', error.message);
    return null;
  }
}

/**
 * Get fallback data from static JSON
 */
function getFallbackData() {
  return {
    ...vnPricesStatic.gold,
    source: 'manual-fallback',
    note: vnPricesStatic.gold.note + ' (API không khả dụng, dùng dữ liệu thủ công)'
  };
}

/**
 * Fetch Vietnam gold prices with caching
 * @returns {Promise<Object>} Gold price data { updatedAt, unit, items, note, source }
 */
export async function fetchVnGoldPrices() {
  const cacheKey = 'vn-gold-prices';
  const cached = getCache(cacheKey);
  
  if (cached) {
    console.log('[vnGoldService] Using cached data');
    return cached;
  }
  
  // Try SJC API first
  const sjcData = await fetchFromSjcApi();
  
  if (sjcData) {
    setCache(cacheKey, sjcData, CACHE_TTL);
    return sjcData;
  }
  
  // Fallback to static data
  console.warn('[vnGoldService] Using fallback static data');
  const fallbackData = getFallbackData();
  setCache(cacheKey, fallbackData, CACHE_TTL); // Cache fallback for 10 min too
  return fallbackData;
}

/**
 * Get additional brands from static JSON (PNJ, DOJI, etc.)
 * These are not available in SJC API, so we merge them
 */
export function getAdditionalBrands() {
  return vnPricesStatic.gold.items.filter(item => 
    !item.brand.toLowerCase().includes('sjc')
  );
}

/**
 * Fetch complete gold prices (SJC API + other brands from static)
 * Only merge additional brands if SJC API succeeded (to avoid duplicates)
 */
export async function fetchCompleteVnGold() {
  const sjcData = await fetchVnGoldPrices();
  
  // Only add additional brands if we got data from SJC API
  // If using fallback, all brands are already included
  if (sjcData.source === 'sjc-api') {
    const additionalBrands = getAdditionalBrands();
    return {
      ...sjcData,
      items: [...sjcData.items, ...additionalBrands],
      note: 'Giá SJC từ API tự động (~15 phút), các thương hiệu khác cập nhật thủ công'
    };
  }
  
  // Fallback data already has all brands, return as-is
  return sjcData;
}
