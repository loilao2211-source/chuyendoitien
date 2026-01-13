import vnPrices from '@/data/vn-prices.json';

const units = vnPrices.units;

/**
 * Convert any base currency to USD
 * @param {number} amount - Amount in base currency
 * @param {string} baseMoney - Base currency code ('USD' or 'VND')
 * @param {object} fxRates - FX rates object where USD=1 and others are rates vs USD
 * @returns {number} Amount in USD
 */
export const toUSD = (amount, baseMoney, fxRates) => {
  if (!amount || amount <= 0) return 0;
  
  if (baseMoney === 'USD') return amount;
  
  if (baseMoney === 'VND') {
    const rate = fxRates?.VND;
    if (!rate || !Number.isFinite(rate) || rate <= 0) {
      throw new Error('Thiếu tỷ giá VND/USD hoặc tỷ giá không hợp lệ');
    }
    // VND to USD: divide by rate (e.g., 1,000,000 VND / 25,000 = 40 USD)
    return amount / rate;
  }
  
  // Support other currencies if provided in fxRates
  if (fxRates && fxRates[baseMoney]) {
    const rate = fxRates[baseMoney];
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error(`Tỷ giá ${baseMoney}/USD không hợp lệ`);
    }
    return amount / rate;
  }
  
  throw new Error(`Loại tiền ${baseMoney} không được hỗ trợ`);
};

export const fromUSDToCurrencies = (usd, fxRates, targets = []) => {
  if (!fxRates) return {};
  const list = targets.length > 0 ? targets : Object.keys(fxRates);
  return Object.fromEntries(
    list
      .filter((code) => fxRates[code])
      .map((code) => [code, usd * fxRates[code]])
  );
};

export const fromUSDToCrypto = (usd, cryptoPrices, targets = []) => {
  if (!cryptoPrices) return {};
  const list = targets.length > 0 ? targets : Object.keys(cryptoPrices);
  return Object.fromEntries(
    list
      .filter((id) => cryptoPrices[id])
      .map((id) => [id, usd / cryptoPrices[id]])
  );
};

export const fromUSDToGold = (usd, xauUsd) => {
  if (!xauUsd) return {};
  const oz = usd / xauUsd;
  const gram = oz * units.gold.troy_oz_to_gram;
  const chi = gram * units.gold.gram_to_chi;
  const cay = chi * units.gold.chi_to_cay;
  return { oz, gram, chi, cay };
};

export const fromUSDToOil = (usd, pricePerBarrel) => {
  if (!pricePerBarrel) return {};
  const barrels = usd / pricePerBarrel;
  const liter = barrels * units.oil.barrel_to_liter;
  const gallon = barrels * 42;
  return { barrels, liter, gallon };
};
