/**
 * Unified Currency Converter Utilities
 * Chuẩn hóa logic chuyển đổi theo công thức 2 bước qua USD
 * 
 * Công thức:
 * 1. amountUSD = amountInput * rate[from]  (nếu from !== USD)
 * 2. result = amountUSD / rate[to]          (nếu to !== USD)
 * 
 * Trong đó rates là tỷ giá so với USD (USD = 1)
 */

/**
 * Chuyển đổi từ currency bất kỳ sang USD
 * @param {number} amount - Số tiền cần chuyển
 * @param {string} fromCurrency - Mã tiền tệ gốc (USD, VND, EUR, etc.)
 * @param {Object} rates - Object chứa tỷ giá { VND: 25000, EUR: 0.92, ... }
 * @returns {number} - Giá trị USD
 */
export function convertCurrencyToUSD(amount, fromCurrency, rates) {
  console.log('[convertCurrencyToUSD]', { amount, fromCurrency, rates });
  
  if (!amount || amount <= 0) {
    return 0;
  }

  // Nếu from là USD thì return luôn
  if (fromCurrency === 'USD') {
    return amount;
  }

  // Lấy tỉ giá của currency gốc so với USD
  const rateFrom = rates?.[fromCurrency];
  
  if (!rateFrom || !Number.isFinite(rateFrom) || rateFrom <= 0) {
    throw new Error(`Không có tỉ giá cho ${fromCurrency}`);
  }

  // Với rates[VND] = 25000 nghĩa là 1 USD = 25000 VND
  // => 1 VND = 1/25000 USD
  // => amountVND * (1/rate) = amountUSD
  const amountUSD = amount / rateFrom;
  
  console.log('[convertCurrencyToUSD] Result:', { rateFrom, amountUSD });
  return amountUSD;
}

/**
 * Chuyển đổi từ USD sang currency bất kỳ
 * @param {number} amountUSD - Số tiền USD
 * @param {string} toCurrency - Mã tiền tệ đích
 * @param {Object} rates - Object chứa tỷ giá
 * @returns {number} - Giá trị sau convert
 */
export function convertUSDToTarget(amountUSD, toCurrency, rates) {
  console.log('[convertUSDToTarget]', { amountUSD, toCurrency, rates });
  
  if (!amountUSD || amountUSD <= 0) {
    return 0;
  }

  // Nếu to là USD thì return luôn
  if (toCurrency === 'USD') {
    return amountUSD;
  }

  // Lấy tỉ giá của currency đích so với USD
  const rateTo = rates?.[toCurrency];
  
  if (!rateTo || !Number.isFinite(rateTo) || rateTo <= 0) {
    throw new Error(`Không có tỉ giá cho ${toCurrency}`);
  }

  // Với rates[VND] = 25000 nghĩa là 1 USD = 25000 VND
  // => amountUSD * rate = amountVND
  const result = amountUSD * rateTo;
  
  console.log('[convertUSDToTarget] Result:', { rateTo, result });
  return result;
}

/**
 * Chuyển đổi trực tiếp giữa 2 currency bất kỳ (qua USD)
 * @param {number} amount - Số tiền cần chuyển
 * @param {string} from - Mã tiền tệ gốc
 * @param {string} to - Mã tiền tệ đích
 * @param {Object} rates - Object chứa tỷ giá
 * @returns {number} - Giá trị sau convert
 */
export function convert(amount, from, to, rates) {
  console.log('[convert]', { amount, from, to, rates });
  
  // Nếu from === to thì return luôn
  if (from === to) {
    return amount;
  }

  // Bước 1: Chuyển từ from sang USD
  const amountUSD = convertCurrencyToUSD(amount, from, rates);
  
  // Bước 2: Chuyển từ USD sang to
  const result = convertUSDToTarget(amountUSD, to, rates);
  
  console.log('[convert] Final:', { amountUSD, result });
  return result;
}

/**
 * Chuyển đổi cho Crypto (price-based)
 * Crypto prices đã là USD per coin, nên logic khác một chút
 * @param {number} amount - Số lượng coin/token
 * @param {string} from - Crypto ID (bitcoin, ethereum)
 * @param {string} to - Crypto ID đích
 * @param {Object} prices - { bitcoin: 45000, ethereum: 2500, ... }
 * @returns {number}
 */
export function convertCrypto(amount, from, to, prices) {
  console.log('[convertCrypto]', { amount, from, to, prices });
  
  if (from === to) {
    return amount;
  }

  const fromPrice = prices?.[from];
  const toPrice = prices?.[to];

  if (!fromPrice || !Number.isFinite(fromPrice) || fromPrice <= 0) {
    throw new Error(`Không có giá cho ${from}`);
  }

  if (!toPrice || !Number.isFinite(toPrice) || toPrice <= 0) {
    throw new Error(`Không có giá cho ${to}`);
  }

  // amount coin FROM * giá USD = amountUSD
  const amountUSD = amount * fromPrice;
  
  // amountUSD / giá TO = số coin TO
  const result = amountUSD / toPrice;
  
  console.log('[convertCrypto] Result:', { fromPrice, toPrice, amountUSD, result });
  return result;
}

// Test cases (chạy trong console để verify)
export function runTests() {
  const testRates = { VND: 25000, EUR: 0.92, GBP: 0.79 };
  
  console.group('=== CURRENCY CONVERTER TESTS ===');
  
  // Test 1: 1,000,000 VND -> USD
  try {
    const test1 = convert(1_000_000, 'VND', 'USD', testRates);
    console.log('✅ Test 1: 1,000,000 VND -> USD =', test1, 'USD (expected: 40)');
  } catch (e) {
    console.error('❌ Test 1 failed:', e.message);
  }
  
  // Test 2: 100 USD -> VND
  try {
    const test2 = convert(100, 'USD', 'VND', testRates);
    console.log('✅ Test 2: 100 USD -> VND =', test2, 'VND (expected: 2,500,000)');
  } catch (e) {
    console.error('❌ Test 2 failed:', e.message);
  }
  
  // Test 3: 1,000,000 VND -> EUR
  try {
    const test3 = convert(1_000_000, 'VND', 'EUR', testRates);
    console.log('✅ Test 3: 1,000,000 VND -> EUR =', test3, 'EUR (expected: ~36.8)');
  } catch (e) {
    console.error('❌ Test 3 failed:', e.message);
  }
  
  // Test 4: VND -> BTC (qua USD)
  try {
    const cryptoPrices = { bitcoin: 45000 };
    const vndToUSD = convert(1_000_000, 'VND', 'USD', testRates);
    const usdToBTC = vndToUSD / cryptoPrices.bitcoin;
    console.log('✅ Test 4: 1,000,000 VND -> BTC =', usdToBTC, 'BTC (expected: ~0.000889)');
  } catch (e) {
    console.error('❌ Test 4 failed:', e.message);
  }
  
  // Test 5: Same currency
  try {
    const test5 = convert(100, 'USD', 'USD', testRates);
    console.log('✅ Test 5: 100 USD -> USD =', test5, 'USD (expected: 100)');
  } catch (e) {
    console.error('❌ Test 5 failed:', e.message);
  }
  
  console.groupEnd();
}
