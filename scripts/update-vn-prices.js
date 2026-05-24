const fs = require('node:fs/promises');
const path = require('node:path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'vn-prices.json');
const WEBGIA_BASE = 'https://webgia.com';

const GOLD_SOURCES = [
  {
    brand: 'SJC',
    type: 'Vàng SJC 1L, 5c, 10c',
    logo: '/logos/gold/SJC.png',
    url: `${WEBGIA_BASE}/gia-vang/sjc/`,
    include: ['Vang SJC 1L'],
  },
  {
    brand: 'PNJ',
    type: 'Vàng 9999 (24K)',
    logo: '/logos/gold/PNJ.webp',
    url: `${WEBGIA_BASE}/gia-vang/pnj/`,
    include: ['TPHCM PNJ'],
  },
  {
    brand: 'Bảo Tín Minh Châu',
    type: 'Vàng 9999',
    logo: '/logos/gold/BTMC.png',
    url: `${WEBGIA_BASE}/gia-vang/bao-tin-minh-chau/`,
    include: ['VRTL', 'Vang mieng'],
  },
  {
    brand: 'Doji',
    type: 'Vàng SJC',
    logo: '/logos/gold/DOJI.jpg',
    url: `${WEBGIA_BASE}/gia-vang/doji/`,
    include: ['SJC Le'],
  },
  {
    brand: 'Phú Quý',
    type: 'Vàng 999.9',
    logo: '/logos/gold/PhuQuy.png',
    url: `${WEBGIA_BASE}/gia-vang/phu-quy/`,
    include: ['Ha Noi SJC', 'Vang mieng SJC'],
  },
];

const FUEL_SOURCES = [
  { code: 'E5 RON92', name: 'Xăng E5 RON 92', include: ['Xang E5 RON 92', 'E5 RON 92'] },
  { code: 'RON95-III', name: 'Xăng RON 95-III', include: ['Xang RON 95-III', 'RON 95-III'] },
  { code: 'DO 0.05S', name: 'Dầu diesel 0.05S-II', include: ['DO 0,05S'] },
  { code: 'Kerosene', name: 'Dầu hỏa', include: ['Dau hoa 2-K', 'Dau hoa'] },
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

function parseGoldVndPerLuong(value) {
  const parsed = parseVnd(value);
  if (!parsed) return null;

  const normalized = parsed < 1_000_000 ? parsed * 1000 : parsed;
  return normalized * 10;
}

function parseUpdatedAt(lines) {
  const text = Array.isArray(lines) ? lines.join('\n') : String(lines);
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
  const [timestamp] = timestamps[0];
  return timestamp;
}

function findLine(lines, include) {
  const normalizedNeedles = include.map(removeVietnameseMarks);
  return lines.find((line) => {
    const normalizedLine = removeVietnameseMarks(line);
    return normalizedNeedles.every((needle) => normalizedLine.includes(needle));
  });
}

function extractPricePair(line) {
  const matches = line.match(/\d{1,3}(?:\.\d{3})+/g);
  if (!matches || matches.length < 2) return null;

  return {
    buy: matches[matches.length - 2],
    sell: matches[matches.length - 1],
  };
}

function findPricedLine(lines, include) {
  return lines.find((line) => {
    const normalizedLine = removeVietnameseMarks(line);
    const hasNeedles = include.every((needle) =>
      normalizedLine.includes(removeVietnameseMarks(needle))
    );
    return hasNeedles && extractPricePair(line);
  });
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ChuyenDoiTienBot/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }

  return response.text();
}

async function fetchGoldItem(source) {
  const html = await fetchText(source.url);
  const lines = [...htmlToRows(html), ...htmlToLines(html)];
  const line = findPricedLine(lines, source.include);
  if (!line) {
    throw new Error(`Cannot find gold row for ${source.brand}`);
  }

  const pair = extractPricePair(line);
  if (!pair) {
    throw new Error(`Cannot parse gold prices for ${source.brand}`);
  }

  const buy = parseGoldVndPerLuong(pair.buy);
  const sell = parseGoldVndPerLuong(pair.sell);
  if (!buy || !sell) {
    throw new Error(`Invalid gold prices for ${source.brand}`);
  }

  return {
    updatedAt: parseUpdatedAt(lines),
    item: {
      brand: source.brand,
      type: source.type,
      buy,
      sell,
      logo: source.logo,
    },
  };
}

async function fetchFuelItems(previousFuelItems) {
  const html = await fetchText(`${WEBGIA_BASE}/gia-xang-dau/petrolimex/`);
  const lines = [...htmlToRows(html), ...htmlToLines(html)];
  const items = FUEL_SOURCES.map((source) => {
    const line = findPricedLine(lines, source.include);
    if (!line) return null;

    const pair = extractPricePair(line);
    if (!pair) return null;

    const region1 = parseVnd(pair.buy);
    const region2 = parseVnd(pair.sell);
    if (!region1 || !region2) return null;

    return {
      code: source.code,
      name: source.name,
      region1,
      region2,
    };
  }).filter(Boolean);

  const mazut = previousFuelItems.find((item) => item.code === 'Mazut');
  if (mazut) items.push(mazut);

  if (items.length < 4) {
    throw new Error('Cannot parse enough fuel rows');
  }

  return {
    updatedAt: parseUpdatedAt(lines),
    items,
  };
}

function updateConversionPrices(data) {
  const goldConversions = data.units.gold.conversions;
  const goldByBrand = Object.fromEntries(
    data.gold.items.map((item) => [removeVietnameseMarks(item.brand).toLowerCase(), item])
  );

  const setGold = (key, brandIncludes) => {
    const item = Object.entries(goldByBrand).find(([brand]) =>
      brandIncludes.some((text) => brand.includes(text))
    )?.[1];
    if (item && goldConversions[key]) goldConversions[key].priceVnd = item.sell;
  };

  setGold('vn_sjc', ['sjc']);
  setGold('vn_pnj', ['pnj']);
  setGold('vn_btmc', ['bao tin', 'btmc']);
  setGold('vn_doji', ['doji']);
  setGold('vn_baotin', ['phu quy']);

  const oilConversions = data.units.oil.conversions;
  const fuelByCode = Object.fromEntries(data.fuel.items.map((item) => [item.code, item]));
  if (fuelByCode['E5 RON92'] && oilConversions.vn_e5) oilConversions.vn_e5.priceVnd = fuelByCode['E5 RON92'].region1;
  if (fuelByCode['RON95-III'] && oilConversions.vn_ron95) oilConversions.vn_ron95.priceVnd = fuelByCode['RON95-III'].region1;
  if (fuelByCode['DO 0.05S'] && oilConversions.vn_do) oilConversions.vn_do.priceVnd = fuelByCode['DO 0.05S'].region1;
}

async function main() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  const data = JSON.parse(raw);
  let changed = false;

  const goldResults = await Promise.allSettled(GOLD_SOURCES.map(fetchGoldItem));
  const goldItems = goldResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value.item);

  if (goldItems.length >= 3) {
    data.gold.items = goldItems;
    data.gold.note = 'Giá vàng từ WebGia và các nguồn doanh nghiệp được WebGia tổng hợp; tự động cập nhật bằng npm run update:vn-prices.';
    changed = true;
  } else {
    console.warn(`[update-vn-prices] Only ${goldItems.length} gold rows parsed; keeping previous gold data.`);
  }

  const goldUpdatedAt = goldResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => Date.parse(result.value.updatedAt))
    .filter(Number.isFinite);

  try {
    const fuel = await fetchFuelItems(data.fuel.items);
    data.fuel.items = fuel.items;
    data.fuel.note = 'Giá bán lẻ Petrolimex từ WebGia/Petrolimex; tự động cập nhật bằng npm run update:vn-prices. Mazut giữ fallback nếu nguồn live không có.';
    data.updatedAt = new Date(Math.max(Date.parse(fuel.updatedAt), ...goldUpdatedAt)).toISOString();
    changed = true;
  } catch (error) {
    console.warn(`[update-vn-prices] Fuel update failed: ${error.message}`);
    if (goldUpdatedAt.length > 0 && goldItems.length >= 3) {
      data.updatedAt = new Date(Math.max(...goldUpdatedAt)).toISOString();
    }
  }

  if (!changed) {
    console.log('[update-vn-prices] No live rows parsed; data/vn-prices.json unchanged.');
    return;
  }

  data.source = 'Tự động cập nhật từ WebGia/SJC-compatible public pages';
  data.description = 'Fallback snapshot cho giá vàng và xăng dầu Việt Nam. Runtime APIs thử nguồn live trước, rồi mới dùng file này.';
  updateConversionPrices(data);

  await fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`[update-vn-prices] Updated ${DATA_FILE}`);
  console.log(`[update-vn-prices] Gold rows: ${data.gold.items.length}; fuel rows: ${data.fuel.items.length}; updatedAt: ${data.updatedAt}`);
}

main().catch((error) => {
  console.error(`[update-vn-prices] ${error.stack || error.message}`);
  process.exitCode = 1;
});
