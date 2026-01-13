// HTTP wrapper with timeout and basic retry logic
export const http = {
  async fetch(url, options = {}) {
    const {
      timeout = 10000,
      retries = 1,
      headers = {},
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...options,
          headers: {
            'User-Agent': 'PriceConverter/1.0',
            ...headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          // Wait before retry (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    throw lastError;
  },
};

export default http;
