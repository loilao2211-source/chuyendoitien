// Frankfurter API provider for currency exchange rates
import { http } from '../http.js';
import { PROVIDERS } from '../constants.js';

export const frankfurter = {
  async getRates(base = 'USD', symbols = ['USD']) {
    const symbolsStr = Array.isArray(symbols) ? symbols.join(',') : symbols;

    try {
      const url = `${PROVIDERS.FRANKFURTER}/latest?from=${base}&to=${symbolsStr}`;
      const data = await http.fetch(url, { timeout: 8000, retries: 2 });

      if (!data.rates) {
        throw new Error('Invalid response from Frankfurter');
      }

      return {
        base: data.base || base,
        rates: data.rates,
      };
    } catch (error) {
      throw new Error(`Frankfurter API error: ${error.message}`);
    }
  },
};

export default frankfurter;
