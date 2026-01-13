// API route for oil prices
// GET /api/oil?type=brent
import { cache } from '@/lib/cache';
import { eia } from '@/lib/providers/eia';
import { normalize } from '@/lib/normalize';
import { TTL } from '@/lib/constants';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = (searchParams.get('type') || 'brent').toLowerCase();

    if (!['brent', 'wti'].includes(type)) {
      return Response.json(
        normalize.error(
          'INVALID_PARAM',
          'Invalid oil type. Use: brent or wti',
          `Received: ${type}`
        ),
        { status: 400 }
      );
    }

    const cacheKey = `oil:${type}`;

    // Try cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return Response.json(
        normalize.success(cached, { source: 'EIA', cached: true, ttl: TTL })
      );
    }

    // Cache miss - fetch from provider
    const result = await eia.getOilPrice(type);

    // Store in cache
    await cache.set(cacheKey, result, TTL);

    return Response.json(
      normalize.success(result, { source: 'EIA', cached: false, ttl: TTL })
    );
  } catch (error) {
    console.error('[API/Oil] Error:', error);
    return Response.json(
      normalize.error(
        'PROVIDER_ERROR',
        'Failed to fetch oil prices',
        error.message
      ),
      { status: 500 }
    );
  }
}
