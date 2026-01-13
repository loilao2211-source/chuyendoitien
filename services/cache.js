/**
 * Simple in-memory cache with TTL (Time To Live)
 * Used for caching API responses to reduce API calls
 */

const cache = new Map();

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/not found
 */
export function getCache(key) {
  const entry = cache.get(key);
  
  if (!entry) return null;
  
  const now = Date.now();
  if (now > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

/**
 * Set cache data with TTL
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttlMs - Time to live in milliseconds (default: 2 hours)
 */
export function setCache(key, data, ttlMs = 2 * 60 * 60 * 1000) {
  const expiresAt = Date.now() + ttlMs;
  cache.set(key, { data, expiresAt });
}

/**
 * Clear specific cache key
 * @param {string} key - Cache key to clear
 */
export function clearCache(key) {
  cache.delete(key);
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  cache.clear();
}

/**
 * Get cache statistics
 * @returns {object} Cache stats
 */
export function getCacheStats() {
  const now = Date.now();
  let activeCount = 0;
  let expiredCount = 0;
  
  cache.forEach((entry) => {
    if (now <= entry.expiresAt) {
      activeCount++;
    } else {
      expiredCount++;
    }
  });
  
  return {
    total: cache.size,
    active: activeCount,
    expired: expiredCount,
  };
}
