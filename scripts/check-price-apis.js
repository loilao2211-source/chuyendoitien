const DEFAULT_BASE_URL = 'https://chuyendoitien.vercel.app';

const baseUrl = (process.env.PRICE_HEALTHCHECK_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchJson(path) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'ChuyenDoiTienHealthcheck/1.0',
    },
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${path} did not return JSON: ${text.slice(0, 120)}`);
  }

  if (!response.ok) {
    throw new Error(`${path} HTTP ${response.status}: ${JSON.stringify(json).slice(0, 200)}`);
  }

  return json;
}

function isReasonableUsdVnd(rate) {
  return Number.isFinite(rate) && rate >= 15_000 && rate <= 40_000;
}

function isReasonableGold(price) {
  return Number.isFinite(price) && price >= 500 && price <= 20_000;
}

function isReasonableOil(price) {
  return Number.isFinite(price) && price >= 20 && price <= 200;
}

async function main() {
  const fx = await fetchJson('/api/fx?base=USD&symbols=VND,EUR,JPY');
  assert(fx.ok === true, '/api/fx ok=false');
  assert(isReasonableUsdVnd(fx.data?.rates?.VND), `/api/fx unreasonable USD/VND: ${fx.data?.rates?.VND}`);

  const crypto = await fetchJson('/api/crypto?vs=usd&ids=bitcoin,ethereum,tether');
  assert(crypto.ok === true, '/api/crypto ok=false');
  assert(crypto.sourceType === 'live', `/api/crypto sourceType=${crypto.sourceType}`);
  assert(Number.isFinite(crypto.data?.prices?.bitcoin) && crypto.data.prices.bitcoin > 0, '/api/crypto missing BTC price');

  const gold = await fetchJson('/api/gold?quote=USD');
  assert(gold.ok === true, '/api/gold ok=false');
  assert(gold.sourceType === 'live', `/api/gold sourceType=${gold.sourceType}`);
  assert(isReasonableGold(gold.data?.xauUsd), `/api/gold unreasonable XAU/USD: ${gold.data?.xauUsd}`);

  const oil = await fetchJson('/api/oil?type=brent');
  assert(oil.ok === true, '/api/oil ok=false');
  assert(oil.sourceType === 'live', `/api/oil sourceType=${oil.sourceType}`);
  assert(isReasonableOil(oil.data?.price), `/api/oil unreasonable Brent: ${oil.data?.price}`);

  const vnGold = await fetchJson('/api/vn/gold');
  assert(vnGold.ok === true, '/api/vn/gold ok=false');
  assert(Array.isArray(vnGold.data?.items) && vnGold.data.items.length >= 3, '/api/vn/gold too few items');
  assert(vnGold.data.items.every((item) => item.buy > 0 && item.sell > 0 && item.sell >= item.buy), '/api/vn/gold invalid buy/sell');

  const vnFuel = await fetchJson('/api/vn/fuel');
  assert(vnFuel.ok === true, '/api/vn/fuel ok=false');
  assert(Array.isArray(vnFuel.data?.items) && vnFuel.data.items.length >= 3, '/api/vn/fuel too few items');
  assert(vnFuel.data.items.every((item) => item.region1 > 0 && item.region2 > 0), '/api/vn/fuel invalid prices');

  const gateway = await fetchJson('/api/prices/latest');
  assert(gateway.status === 'fresh', `/api/prices/latest status=${gateway.status}`);
  for (const [group, status] of Object.entries(gateway.sources || {})) {
    assert(status === 'live', `/api/prices/latest ${group} source=${status}`);
  }

  console.log(`[check-price-apis] All checks passed for ${baseUrl}`);
}

main().catch((error) => {
  console.error(`[check-price-apis] ${error.stack || error.message}`);
  process.exitCode = 1;
});
