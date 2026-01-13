// EIA API provider for oil prices
// Free tier: https://www.eia.gov/opendata/ (requires registration)
// For production: set EIA_API_KEY env var

import { http } from '../http.js';

export const eia = {
  async getOilPrice(type = 'brent') {
    try {
      const apiKey = process.env.EIA_API_KEY;

      if (!apiKey) {
        // Fallback to mock data for demo (replace with actual API when key available)
        return {
          type,
          price: type === 'brent' ? 78.25 : 75.50,
          unit: 'USD_per_barrel',
          source: 'mock', // Mark as demo data
        };
      }

      // EIA series IDs:
      // Brent: PET.BRENTEU.D
      // WTI: PET.CRUDE_OIL_WTI.D
      const seriesId = type === 'brent' ? 'PET.BRENTEU.D' : 'PET.CRUDE_OIL_WTI.D';

      const url = `https://api.eia.gov/v2/petroleum/prices/api/series?series_id=${seriesId}&api_key=${apiKey}&data[0]=value&length=1`;
      const data = await http.fetch(url, { timeout: 8000, retries: 2 });

      if (!data.response?.data?.[0]?.[0]) {
        throw new Error('Invalid oil price response');
      }

      return {
        type,
        price: parseFloat(data.response.data[0][0]),
        unit: 'USD_per_barrel',
        source: 'eia',
      };
    } catch (error) {
      throw new Error(`EIA API error: ${error.message}`);
    }
  },
};

export default eia;
