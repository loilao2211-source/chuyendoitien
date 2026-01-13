// Normalize response format across all APIs
export const normalize = {
  success(data, { source, cached, ttl = 7200 }) {
    return {
      ok: true,
      source,
      cached: cached || false,
      ttl,
      lastUpdated: new Date().toISOString(),
      data,
    };
  },

  error(code, message, detail) {
    return {
      ok: false,
      error: {
        code,
        message,
        ...(detail && { detail }),
      },
    };
  },

  // Helper to sort and normalize parameter strings
  sortParams(str) {
    return str
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .sort()
      .join(',');
  },

  // Helper to build consistent cache keys
  cacheKey(prefix, params) {
    return `${prefix}:${params}`;
  },
};

export default normalize;
