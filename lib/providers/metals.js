// Metals API provider for gold prices (XAU/USD)
// Free tier: https://metals-api.com/ (limited calls)
// For production: set METALS_API_KEY env var

import { http } from '../http.js';

export const metals = {
  async getGoldPrice(quote = 'USD') {
    try {
      const apiKey = process.env.METALS_API_KEY;

      if (!apiKey) {
        // Fallback to mock data for demo (replace with actual API when key available)
        // Updated to realistic Jan 2026 price (~$4500/oz)
        return {
          quote,
          xauUsd: 4509.21,
          unit: 'USD_per_troy_oz',
          source: 'mock', // Mark as demo data
        };
      }

      const url = `https://metals-api.com/api/spot?base=XAU&target=${quote}&api_key=${apiKey}`;
      const data = await http.fetch(url, { timeout: 8000, retries: 2 });

      if (!data.rates || !data.rates[quote]) {
        throw new Error('Invalid gold price response');
      }

      return {
        quote,
        xauUsd: data.rates[quote],
        unit: 'USD_per_troy_oz',
        source: 'metals-api',
      };
    } catch (error) {
      throw new Error(`Metals API error: ${error.message}`);
    }
  },
};

export default metals;
