// Constants and defaults
export const TTL = 7200; // 2 hours in seconds

export const DEFAULT_CURRENCIES = ['USD', 'VND', 'THB', 'EUR', 'GBP'];
export const DEFAULT_CRYPTO_SYMBOLS = ['bitcoin', 'ethereum', 'tether'];
export const DEFAULT_CRYPTO_VS = 'usd';
export const DEFAULT_GOLD_QUOTE = 'USD';
export const DEFAULT_OIL_TYPE = 'brent';

// Provider endpoints
export const PROVIDERS = {
  FRANKFURTER: 'https://api.frankfurter.app',
  COINGECKO: 'https://api.coingecko.com/api/v3',
  // EIA: 'https://api.eia.gov/v2', // Requires API key
  // METALS: 'https://metals-api.com', // Requires API key
};

// For free tier, use alternative sources
export const FREE_GOLD_SOURCE = 'metals-api-free'; // placeholder
export const FREE_OIL_SOURCE = 'eia-free'; // placeholder

export default {
  TTL,
  DEFAULT_CURRENCIES,
  DEFAULT_CRYPTO_SYMBOLS,
  DEFAULT_CRYPTO_VS,
  DEFAULT_GOLD_QUOTE,
  DEFAULT_OIL_TYPE,
  PROVIDERS,
};
