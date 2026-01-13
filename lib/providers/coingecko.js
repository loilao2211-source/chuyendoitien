// CoinGecko API provider for cryptocurrency prices
import { http } from '../http.js';
import { PROVIDERS } from '../constants.js';

export const coingecko = {
  async getPrices(ids = ['bitcoin', 'ethereum'], vs = 'usd') {
    const idsStr = Array.isArray(ids) ? ids.join(',') : ids;

    try {
      const url = `${PROVIDERS.COINGECKO}/simple/price?ids=${idsStr}&vs_currencies=${vs}`;
      const data = await http.fetch(url, { timeout: 8000, retries: 2 });

      if (!data) {
        throw new Error('Invalid response from CoinGecko');
      }

      // Transform CoinGecko format { bitcoin: { usd: 95000 } } to { bitcoin: 95000 }
      const prices = {};
      Object.entries(data).forEach(([id, values]) => {
        prices[id] = values[vs.toLowerCase()];
      });

      return {
        vs,
        prices,
      };
    } catch (error) {
      throw new Error(`CoinGecko API error: ${error.message}`);
    }
  },
};

export default coingecko;
