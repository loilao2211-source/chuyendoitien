// In-memory cache for development
// For production on Vercel, integrate with Upstash Redis
const memoryCache = new Map();

export const cache = {
  // Get value from cache
  async get(key) {
    try {
      // Try Redis if available
      if (process.env.UPSTASH_REDIS_REST_URL) {
        const response = await fetch(
          `${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            },
          }
        );
        const data = await response.json();
        if (data.result && typeof data.result === 'string') {
          try {
            return JSON.parse(data.result);
          } catch (parseError) {
            console.error('[Cache] JSON parse error for key:', key, parseError);
            return null;
          }
        }
        return null;
      }
    } catch (error) {
      console.error('[Cache] Redis get error:', error);
    }

    // Fallback to memory cache (dev only)
    const stored = memoryCache.get(key);
    if (!stored) return null;

    if (Date.now() > stored.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    return stored.value;
  },

  // Set value with TTL (in seconds)
  async set(key, value, ttlSeconds = 7200) {
    try {
      // Try Redis if available
      if (process.env.UPSTASH_REDIS_REST_URL) {
        await fetch(
          `${process.env.UPSTASH_REDIS_REST_URL}/set/${key}/${encodeURIComponent(
            JSON.stringify(value)
          )}/EX/${ttlSeconds}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            },
          }
        );
        return;
      }
    } catch (error) {
      console.error('[Cache] Redis set error:', error);
    }

    // Fallback to memory cache (dev only)
    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  },

  // Clear cache (for testing)
  clear() {
    memoryCache.clear();
  },
};

export default cache;
