/**
 * Vietnam fuel service.
 * Live source: WebGia Petrolimex page, fallback: data/vn-prices.json.
 */

import { getCache, setCache } from './cache';
import vnPricesStatic from '@/data/vn-prices.json';

const WEBGIA_FUEL_URL = 'https://webgia.com/gia-xang-dau/petrolimex/';
const CACHE_TTL = 30 * 60 * 1000;

const FUEL_ROWS = [
  { match: ['Xang E5 RON 92', 'E5 RON 92'], code: 'E5 RON92', name: 'Xăng E5 RON 92' },
  { match: ['Xang RON 95-III', 'RON 95-III'], code: 'RON95-III', name: 'Xăng RON 95-III' },
  { match: ['DO 0,05S-II', 'DO 0.05S', 'DO 0,05S'], code: 'DO 0.05S', name: 'Dầu diesel 0.05S-II' },
  { match: ['Dau hoa 2-K', 'Dau hoa'], code: 'Kerosene', name: 'Dầu hỏa' },
];

function removeVietnameseMarks(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToLines(html) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|tr|li|h1|h2|h3|td|th)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function htmlToText(html) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function htmlToRows(html) {
  const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  return rows.map(htmlToText).filter(Boolean);
}

function parseVnd(value) {
  const digits = String(value).replace(/[^\d]/g, '');
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseUpdatedAt(text) {
  const matches = [...text.matchAll(/Cập nhật lúc\s+(\d{1,2}:\d{2}:\d{2})\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/gi)];
  if (matches.length === 0) return new Date().toISOString();

  const timestamps = matches
    .map((match) => {
      const [, time, day, month, year] = match;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}+07:00`;
    })
    .map((timestamp) => [timestamp, Date.parse(timestamp)])
    .filter(([, parsed]) => Number.isFinite(parsed));

  if (timestamps.length === 0) return new Date().toISOString();

  timestamps.sort((a, b) => b[1] - a[1]);
  return timestamps[0][0];
}

function extractPricePair(line) {
  const matches = line.match(/\d{1,3}(?:\.\d{3})+/g);
  if (!matches || matches.length < 2) return null;

  const region1 = parseVnd(matches[matches.length - 2]);
  const region2 = parseVnd(matches[matches.length - 1]);
  if (!region1 || !region2) return null;

  return { region1, region2 };
}

function findPricedLine(lines, include) {
  return lines.find((line) => {
    const normalized = removeVietnameseMarks(line);
    return include.some((text) => normalized.includes(text)) && extractPricePair(line);
  });
}

function parseWebgiaFuel(html) {
  const lines = [...htmlToRows(html), ...htmlToLines(html)];
  const items = FUEL_ROWS.map((row) => {
    const raw = findPricedLine(lines, row.match);
    if (!raw) return null;

    const prices = extractPricePair(raw);
    if (!prices) return null;

    return { code: row.code, name: row.name, ...prices };
  }).filter(Boolean);

  const mazutFallback = vnPricesStatic.fuel.items.find((item) => item.code === 'Mazut');
  if (mazutFallback) items.push(mazutFallback);

  if (items.length < 3) {
    throw new Error('Not enough Petrolimex rows parsed');
  }

  return {
    updatedAt: parseUpdatedAt(lines.join('\n')),
    unit: vnPricesStatic.fuel.unit,
    regions: vnPricesStatic.fuel.regions,
    items,
    note: 'Giá từ WebGia/Petrolimex, tự động cập nhật; Mazut dùng fallback nếu nguồn live không có.',
    source: 'webgia-petrolimex',
  };
}

async function fetchFromWebgia() {
  const response = await fetch(WEBGIA_FUEL_URL, {
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ChuyenDoiTienBot/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`WebGia fuel HTTP ${response.status}`);
  }

  return parseWebgiaFuel(await response.text());
}

function getFallbackData() {
  return {
    updatedAt: vnPricesStatic.updatedAt,
    unit: vnPricesStatic.fuel.unit,
    regions: vnPricesStatic.fuel.regions,
    items: vnPricesStatic.fuel.items,
    note: `${vnPricesStatic.fuel.note} (live source unavailable, using JSON fallback)`,
    source: 'manual-fallback',
  };
}

export async function fetchVnFuelPrices() {
  const cacheKey = 'vn-fuel-prices';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const liveData = await fetchFromWebgia();
    setCache(cacheKey, liveData, CACHE_TTL);
    return liveData;
  } catch (error) {
    console.warn('[vnFuelService] live fetch failed:', error.message);
    const fallbackData = getFallbackData();
    setCache(cacheKey, fallbackData, CACHE_TTL);
    return fallbackData;
  }
}
