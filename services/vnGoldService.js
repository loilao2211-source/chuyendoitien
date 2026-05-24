/**
 * Vietnam Gold Service
 * Primary: giavang.now public API, updated frequently and includes multiple brands.
 * Secondary: SJC XML API.
 * Fallback: data/vn-prices.json manual snapshot.
 */

import { getCache, setCache } from './cache';
import vnPricesStatic from '@/data/vn-prices.json';

const SJC_XML_URL = 'https://sjc.com.vn/xml/tygiavang.xml';
const GIAVANG_NOW_URL = 'https://giavang.now/api/prices';
const CACHE_TTL = 10 * 60 * 1000;
const UNIT_LABEL = 'VND/lượng (1 lượng = 10 chỉ = 37.5g)';

const GIAVANG_NOW_TYPES = [
  {
    code: 'SJL1L10',
    brand: 'SJC',
    type: 'Vàng miếng SJC 1L, 5c, 10c',
    logo: '/logos/gold/SJC.png',
  },
  {
    code: 'SJ9999',
    brand: 'SJC',
    type: 'Vàng nhẫn SJC 9999',
    logo: '/logos/gold/SJC.png',
  },
  {
    code: 'PQHNVM',
    brand: 'PNJ',
    type: 'Vàng miếng PNJ',
    logo: '/logos/gold/PNJ.webp',
  },
  {
    code: 'PQHN24NTT',
    brand: 'PNJ',
    type: 'Vàng nhẫn PNJ 24K',
    logo: '/logos/gold/PNJ.webp',
  },
  {
    code: 'DOHNL',
    brand: 'DOJI',
    type: 'Vàng miếng DOJI Hà Nội',
    logo: '/logos/gold/DOJI.jpg',
  },
  {
    code: 'DOHCML',
    brand: 'DOJI',
    type: 'Vàng miếng DOJI TP.HCM',
    logo: '/logos/gold/DOJI.jpg',
  },
  {
    code: 'BT9999NTT',
    brand: 'Bảo Tín Minh Châu',
    type: 'Vàng nhẫn 9999',
    logo: '/logos/gold/BTMC.png',
  },
  {
    code: 'BTSJC',
    brand: 'Bảo Tín Minh Châu',
    type: 'Vàng miếng SJC',
    logo: '/logos/gold/BTMC.png',
  },
  {
    code: 'VNGSJC',
    brand: 'Phú Quý',
    type: 'Vàng miếng SJC',
    logo: '/logos/gold/PhuQuy.png',
  },
  {
    code: 'VIETTINMSJC',
    brand: 'VietinBank Gold',
    type: 'Vàng miếng SJC',
    logo: '/logos/gold/SJC.png',
  },
];

const toPositiveNumber = (value) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

const toNumber = (value) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
};

const getUpdatedAtFromGiaVangNow = (payload) => {
  if (payload?.timestamp) {
    const date = new Date(Number(payload.timestamp) * 1000);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  if (payload?.date && payload?.time) {
    const date = new Date(`${payload.date}T${payload.time}:00+07:00`);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  return new Date().toISOString();
};

async function fetchFromGiaVangNow() {
  try {
    const response = await fetch(GIAVANG_NOW_URL, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; ChuyenDoiTien/1.0)',
      },
    });

    if (!response.ok) {
      console.warn('[vnGoldService] giavang.now returned', response.status);
      return null;
    }

    const payload = await response.json();
    const prices = payload?.prices || {};
    const items = GIAVANG_NOW_TYPES.map((config) => {
      const record = prices[config.code];
      const buy = toPositiveNumber(record?.buy);
      const sell = toPositiveNumber(record?.sell);

      if (!buy || !sell) return null;

      return {
        brand: config.brand,
        type: config.type,
        buy,
        sell,
        logo: config.logo,
        sourceCode: config.code,
        changeBuy: toNumber(record?.change_buy),
        changeSell: toNumber(record?.change_sell),
      };
    }).filter(Boolean);

    if (items.length === 0) {
      console.warn('[vnGoldService] giavang.now returned no usable prices');
      return null;
    }

    return {
      updatedAt: getUpdatedAtFromGiaVangNow(payload),
      unit: UNIT_LABEL,
      items,
      note: 'Giá vàng trong nước từ giavang.now public API, tự động cập nhật theo nguồn tổng hợp thị trường.',
      source: 'giavang-now',
    };
  } catch (error) {
    console.warn('[vnGoldService] giavang.now fetch failed:', error.message);
    return null;
  }
}

function parseSjcXml(xmlText) {
  try {
    const items = [];
    const cityMatch = xmlText.match(/<city[^>]*>(.*?)<\/city>/s);
    if (!cityMatch) throw new Error('No city data found');

    const cityContent = cityMatch[1];
    const itemRegex = /<item[^>]*type="([^"]*)"[^>]*buy="([^"]*)"[^>]*sell="([^"]*)"/g;
    let match;

    while ((match = itemRegex.exec(cityContent)) !== null) {
      const [, type, buyStr, sellStr] = match;
      const buy = Number.parseInt(buyStr, 10);
      const sell = Number.parseInt(sellStr, 10);

      if (Number.isFinite(buy) && Number.isFinite(sell) && buy > 0 && sell > 0) {
        items.push({
          brand: 'SJC',
          type: type.trim(),
          buy,
          sell,
          logo: '/logos/gold/SJC.png',
        });
      }
    }

    if (items.length === 0) throw new Error('No valid items parsed');

    return {
      updatedAt: new Date().toISOString(),
      unit: UNIT_LABEL,
      items,
      note: 'Giá từ SJC XML API, cập nhật tự động khi nguồn truy cập được.',
      source: 'sjc-api',
    };
  } catch (error) {
    console.error('[vnGoldService] XML parsing failed:', error.message);
    throw error;
  }
}

async function fetchFromSjcApi() {
  try {
    const response = await fetch(SJC_XML_URL, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.warn('[vnGoldService] SJC API returned', response.status);
      return null;
    }

    return parseSjcXml(await response.text());
  } catch (error) {
    console.warn('[vnGoldService] SJC API fetch failed:', error.message);
    return null;
  }
}

function getFallbackData() {
  return {
    ...vnPricesStatic.gold,
    source: 'manual-fallback',
    note: `${vnPricesStatic.gold.note} (API live không khả dụng, dùng dữ liệu fallback trong data/vn-prices.json)`,
  };
}

export async function fetchVnGoldPrices() {
  const cacheKey = 'vn-gold-prices-v2';
  const cached = getCache(cacheKey);

  if (cached) {
    console.log('[vnGoldService] Using cached data');
    return cached;
  }

  const giaVangNowData = await fetchFromGiaVangNow();
  if (giaVangNowData) {
    setCache(cacheKey, giaVangNowData, CACHE_TTL);
    return giaVangNowData;
  }

  const sjcData = await fetchFromSjcApi();
  if (sjcData) {
    setCache(cacheKey, sjcData, CACHE_TTL);
    return sjcData;
  }

  console.warn('[vnGoldService] Using fallback static data');
  const fallbackData = getFallbackData();
  setCache(cacheKey, fallbackData, CACHE_TTL);
  return fallbackData;
}

export function getAdditionalBrands() {
  return vnPricesStatic.gold.items.filter((item) => !item.brand.toLowerCase().includes('sjc'));
}

export async function fetchCompleteVnGold() {
  const goldData = await fetchVnGoldPrices();

  if (goldData.source === 'giavang-now') {
    return goldData;
  }

  if (goldData.source === 'sjc-api') {
    return {
      ...goldData,
      items: [...goldData.items, ...getAdditionalBrands()],
      note: 'Giá SJC từ API tự động; các thương hiệu khác dùng snapshot fallback.',
    };
  }

  return goldData;
}
