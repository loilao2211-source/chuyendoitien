// API route for gold prices
// GET /api/gold?quote=USD
import { cache } from '@/lib/cache';
import { metals } from '@/lib/providers/metals';
import { normalize } from '@/lib/normalize';
import { TTL } from '@/lib/constants';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const quote = (searchParams.get('quote') || 'USD').toUpperCase();

    const cacheKey = `gold:${quote.toLowerCase()}`;

    // Try cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return Response.json(
        normalize.success(cached, { source: 'Metals API', cached: true, ttl: TTL })
      );
    }

    // Cache miss - fetch from provider
    const result = await metals.getGoldPrice(quote);

    // Store in cache
    await cache.set(cacheKey, result, TTL);

    return Response.json(
      normalize.success(result, { source: 'Metals API', cached: false, ttl: TTL })
    );
  } catch (error) {
    console.error('[API/Gold] Error:', error);
    return Response.json(
      normalize.error(
        'PROVIDER_ERROR',
        'Failed to fetch gold prices',
        error.message
      ),
      { status: 500 }
    );
  }
}
