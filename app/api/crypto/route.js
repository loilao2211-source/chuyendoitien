// API route for cryptocurrency prices
// GET /api/crypto?vs=usd&ids=bitcoin,ethereum,tether
import { cache } from '@/lib/cache';
import { coingecko } from '@/lib/providers/coingecko';
import { normalize } from '@/lib/normalize';
import { TTL } from '@/lib/constants';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vs = (searchParams.get('vs') || 'usd').toLowerCase();
    const idsParam = searchParams.get('ids') || 'bitcoin,ethereum,tether';

    // Normalize and sort IDs for consistent cache key
    const ids = idsParam
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .sort();

    const cacheKey = `crypto:${vs}:${ids.join(',')}`;

    // Try cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return Response.json(
        normalize.success(cached, {
          source: 'CoinGecko',
          sourceType: cached.sourceType,
          isEstimated: cached.isEstimated,
          cached: true,
          ttl: TTL,
          lastUpdated: cached.updatedAt,
        })
      );
    }

    // Cache miss - fetch from provider
    const result = await coingecko.getPrices(ids, vs);

    // Store in cache
    await cache.set(cacheKey, result, TTL);

    return Response.json(
      normalize.success(result, {
        source: 'CoinGecko',
        sourceType: result.sourceType,
        isEstimated: result.isEstimated,
        cached: false,
        ttl: TTL,
        lastUpdated: result.updatedAt,
      })
    );
  } catch (error) {
    console.error('[API/Crypto] Error:', error);
    return Response.json(
      normalize.error(
        'PROVIDER_ERROR',
        'Failed to fetch cryptocurrency prices',
        error.message
      ),
      { status: 500 }
    );
  }
}
