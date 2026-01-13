// FX endpoint using open.er-api.com (no API key required)
// GET /api/fx?base=USD&symbols=VND,EUR

const PROVIDER_URL = 'https://open.er-api.com/v6/latest/USD';
const CACHE_CONTROL = 'public, s-maxage=43200, stale-while-revalidate=86400';

const sanitizeRate = (value) => {
  if (typeof value === 'number') return value;
  if (value === null || value === undefined) return null;
  let str = String(value).trim().replace(/\s+/g, '');
  if (/[,]\d{1,3}$/.test(str) && str.includes('.')) {
    str = str.replace(/\./g, '').replace(/,/g, '.');
  } else if (str.includes(',') && !str.includes('.')) {
    str = str.replace(/,/g, '.');
  } else {
    str = str.replace(/,/g, '');
  }
  const num = Number.parseFloat(str);
  return Number.isFinite(num) ? num : null;
};

const pickSymbols = (rates, symbolsParam) => {
  if (!symbolsParam) return rates;
  const pick = symbolsParam
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  return Object.fromEntries(
    pick
      .map((code) => [code, rates[code]])
      .filter(([, val]) => Number.isFinite(val) && val > 0)
  );
};

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const baseParam = (searchParams.get('base') || 'USD').toUpperCase();
  const symbolsParam = (searchParams.get('symbols') || 'VND').trim();

  try {
    const res = await fetch(PROVIDER_URL, { next: { revalidate: 43200 } });
    const json = await res.json();

    if (!json || json.result !== 'success' || !json.rates) {
      const message = json?.error || json?.['error-type'] || 'FX provider unavailable';
      return Response.json(
        { ok: false, error: message, lastUpdated: null, source: 'open.er-api.com' },
        { status: 200, headers: { 'Cache-Control': CACHE_CONTROL } }
      );
    }

    const baseCode = (json.base_code || 'USD').toUpperCase();
    const sanitizedRates = Object.fromEntries(
      Object.entries(json.rates || {})
        .map(([code, val]) => [code.toUpperCase(), sanitizeRate(val)])
        .filter(([, val]) => Number.isFinite(val) && val > 0)
    );

    if (!sanitizedRates.VND) {
      return Response.json(
        { ok: false, error: 'Missing VND rate from provider', lastUpdated: null, source: 'open.er-api.com' },
        { status: 200, headers: { 'Cache-Control': CACHE_CONTROL } }
      );
    }

    const buildRates = () => {
      if (baseParam === baseCode) return pickSymbols(sanitizedRates, symbolsParam);

      const baseToUsd = sanitizedRates[baseParam];
      if (!Number.isFinite(baseToUsd) || baseToUsd <= 0) return null;

      const targetCodes = symbolsParam
        ? symbolsParam.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
        : Object.keys(sanitizedRates);

      return Object.fromEntries(
        targetCodes
          .map((code) => {
            const usdToTarget = sanitizedRates[code];
            if (!Number.isFinite(usdToTarget) || usdToTarget <= 0) return null;
            const baseToTarget = usdToTarget / baseToUsd;
            return [code, baseToTarget];
          })
          .filter(Boolean)
      );
    };

    const rates = buildRates();

    if (!rates || Object.keys(rates).length === 0) {
      return Response.json(
        { ok: false, error: 'Failed to derive rates for requested symbols', lastUpdated: null, source: 'open.er-api.com' },
        { status: 200, headers: { 'Cache-Control': CACHE_CONTROL } }
      );
    }

    const lastUpdated = json.time_last_update_utc
      ? new Date(json.time_last_update_utc).toISOString()
      : new Date().toISOString();

    return Response.json(
      {
        ok: true,
        data: { base: baseParam, rates },
        lastUpdated,
        source: 'open.er-api.com',
      },
      { status: 200, headers: { 'Cache-Control': CACHE_CONTROL } }
    );
  } catch (error) {
    return Response.json(
      { ok: false, error: 'FX provider unavailable', lastUpdated: null, source: 'open.er-api.com' },
      { status: 200, headers: { 'Cache-Control': CACHE_CONTROL } }
    );
  }
}
