import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/services/cache';
import { fetchRates } from '@/services/fxService';
import { fetchCryptoPrices } from '@/services/cryptoService';
import cryptoCoins from '@/data/cryptoCoins.json';
import { fetchGoldPrice } from '@/services/goldService';
import { fetchBrentPrice, fetchWTIPrice } from '@/services/oilService';

// TTLs per data group (milliseconds)
const TTL = {
  fx: 120_000, // 120s
  crypto: 30_000, // 30s
  oil: 300_000, // 300s
  gold: 600_000, // 600s
};

// Dedupe short bursts to avoid stampedes
const DEDUPE_KEY = 'price-gateway-last-response';
const DEDUPE_TTL = 2_000; // 2 seconds

async function fetchWithCache(key, ttl, fetcher) {
  const cached = getCache(key);
  const now = new Date().toISOString();

  try {
    const data = await fetcher();
    const payload = { data, updatedAt: now };
    setCache(key, payload, ttl);
    return { ...payload, stale: false };
  } catch (error) {
    console.warn(`[price-gateway] ${key} fetch failed:`, error.message || error);
    if (cached) {
      return { ...cached, stale: true };
    }
    throw error;
  }
}

export async function GET() {
  // Return deduped response for rapid repeat hits
  const deduped = getCache(DEDUPE_KEY);
  if (deduped) {
    return NextResponse.json(deduped.body, { status: 200, headers: deduped.headers });
  }

  try {
    const [fx, crypto, gold, oil] = await Promise.all([
      fetchWithCache(
        'gateway-fx',
        TTL.fx,
        () => fetchRates('USD', ['VND', 'EUR', 'GBP', 'JPY', 'CNY'])
      ),
      fetchWithCache(
        'gateway-crypto',
        TTL.crypto,
        () => fetchCryptoPrices(cryptoCoins.map((c) => c.id))
      ),
      fetchWithCache('gateway-gold', TTL.gold, () => fetchGoldPrice()),
      fetchWithCache('gateway-oil', TTL.oil, async () => {
        const [brent, wti] = await Promise.all([fetchBrentPrice(), fetchWTIPrice()]);
        return { brent, wti };
      }),
    ]);

    const stale = fx.stale || crypto.stale || gold.stale || oil.stale;
    const updatedAt = new Date(
      Math.max(
        Date.parse(fx.updatedAt || 0),
        Date.parse(crypto.updatedAt || 0),
        Date.parse(gold.updatedAt || 0),
        Date.parse(oil.updatedAt || 0)
      ) || Date.now()
    ).toISOString();

    const body = {
      updatedAt,
      status: stale ? 'stale' : 'fresh',
      sources: {
        fx: fx.stale ? 'stale' : 'fresh',
        crypto: crypto.stale ? 'stale' : 'fresh',
        gold: gold.stale ? 'stale' : 'fresh',
        oil: oil.stale ? 'stale' : 'fresh',
      },
      data: {
        fx: fx.data,
        crypto: crypto.data,
        gold: gold.data,
        oil: oil.data,
      },
    };

    const headers = {
      'Cache-Control': 'public, max-age=5, s-maxage=20, stale-while-revalidate=40',
    };

    // Cache short-lived deduped response
    setCache(DEDUPE_KEY, { body, headers }, DEDUPE_TTL);

    return NextResponse.json(body, { status: 200, headers });
  } catch (error) {
    console.error('[price-gateway] fatal error:', error.message || error);
    return NextResponse.json(
      {
        updatedAt: Date.now(),
        status: 'stale',
        error: 'Price Gateway unavailable',
      },
      { status: 502 }
    );
  }
}
