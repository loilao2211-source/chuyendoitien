// Normalize response format across all APIs
export const normalize = {
  success(data, { source, cached, ttl = 7200, lastUpdated, sourceType, isEstimated, note } = {}) {
    return {
      ok: true,
      source: source || data?.source,
      ...(sourceType || data?.sourceType ? { sourceType: sourceType || data?.sourceType } : {}),
      ...(typeof isEstimated === 'boolean' || typeof data?.isEstimated === 'boolean'
        ? { isEstimated: typeof isEstimated === 'boolean' ? isEstimated : data.isEstimated }
        : {}),
      cached: cached || false,
      ttl,
      lastUpdated: lastUpdated || data?.updatedAt || new Date().toISOString(),
      ...(note || data?.note ? { note: note || data.note } : {}),
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
