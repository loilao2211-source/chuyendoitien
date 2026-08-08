// CoinGecko API provider for cryptocurrency prices
import { http } from '../http.js';
import { PROVIDERS } from '../constants.js';

export const coingecko = {
  async getPrices(ids = ['bitcoin', 'ethereum'], vs = 'usd') {
    const idsStr = Array.isArray(ids) ? ids.join(',') : ids;

    try {
      const url = `${PROVIDERS.COINGECKO}/simple/price?ids=${idsStr}&vs_currencies=${vs}&include_last_updated_at=true`;
      const data = await http.fetch(url, { timeout: 8000, retries: 2 });

      if (!data) {
        throw new Error('Invalid response from CoinGecko');
      }

      // Transform CoinGecko format { bitcoin: { usd: 95000 } } to { bitcoin: 95000 }
      const prices = {};
      const lastUpdatedAt = {};
      Object.entries(data).forEach(([id, values]) => {
        prices[id] = values[vs.toLowerCase()];
        if (values.last_updated_at) {
          lastUpdatedAt[id] = values.last_updated_at;
        }
      });

      return {
        vs,
        prices,
        lastUpdatedAt,
        source: 'coingecko',
        sourceType: 'live',
        isEstimated: false,
        updatedAt: Object.values(lastUpdatedAt).length
          ? new Date(Math.max(...Object.values(lastUpdatedAt)) * 1000).toISOString()
          : new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`CoinGecko API error: ${error.message}`);
    }
  },
};

export default coingecko;
