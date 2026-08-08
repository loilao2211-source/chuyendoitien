const assert = require('node:assert/strict');
const exchangeFees = require('../data/exchangeFees.json');

const EPSILON = 1e-9;
const OZ_TO_GRAM = 31.1034768;
const GRAM_PER_CHI = 3.75;
const GRAM_PER_LUONG = 37.5;
const LITER_PER_BARREL = 158.987;
const GALLON_PER_BARREL = 42;

function closeTo(actual, expected, label, epsilon = EPSILON) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `${label}: expected ${expected}, got ${actual}`
  );
}

function convertCurrency(amount, from, to, rates) {
  if (from === to) return amount;
  const amountUsd = from === 'USD' ? amount : amount / rates[from];
  return to === 'USD' ? amountUsd : amountUsd * rates[to];
}

function goldWeightToOz(amount, unit) {
  if (unit === 'troy_oz') return amount;
  if (unit === 'gram') return amount / OZ_TO_GRAM;
  if (unit === 'chi') return (amount * GRAM_PER_CHI) / OZ_TO_GRAM;
  if (unit === 'luong' || unit === 'cay') return (amount * GRAM_PER_LUONG) / OZ_TO_GRAM;
  throw new Error(`Unknown gold unit: ${unit}`);
}

function ozToGoldWeight(oz, unit) {
  if (unit === 'troy_oz') return oz;
  if (unit === 'gram') return oz * OZ_TO_GRAM;
  if (unit === 'chi') return (oz * OZ_TO_GRAM) / GRAM_PER_CHI;
  if (unit === 'luong' || unit === 'cay') return (oz * OZ_TO_GRAM) / GRAM_PER_LUONG;
  throw new Error(`Unknown gold unit: ${unit}`);
}

function oilVolumeToLiters(amount, unit) {
  if (unit === 'liter') return amount;
  if (unit === 'barrel') return amount * LITER_PER_BARREL;
  if (unit === 'gallon_us') return amount * (LITER_PER_BARREL / GALLON_PER_BARREL);
  throw new Error(`Unknown oil unit: ${unit}`);
}

function litersToOilVolume(liters, unit) {
  if (unit === 'liter') return liters;
  if (unit === 'barrel') return liters / LITER_PER_BARREL;
  if (unit === 'gallon_us') return liters / (LITER_PER_BARREL / GALLON_PER_BARREL);
  throw new Error(`Unknown oil unit: ${unit}`);
}

function estimateCryptoExitCosts({
  amountInput,
  from,
  to,
  resultValue,
  prices,
  usdToVndRate,
  exchange = 'default',
}) {
  const config = exchangeFees[exchange] || exchangeFees.default;
  const isCrypto = (code) => Boolean(prices[code]);
  const tradeValueUsd = isCrypto(from)
    ? amountInput * prices[from]
    : isCrypto(to)
      ? resultValue * prices[to]
      : from === 'VND'
        ? amountInput / usdToVndRate
        : amountInput;
  const grossValueVND = tradeValueUsd * usdToVndRate;
  const sellsCryptoToFiat = isCrypto(from) && (to === 'VND' || to === 'USD');
  const spreadFeeVND = (grossValueVND * config.spreadPercent) / 100;
  const spotFeeVND = (grossValueVND * config.spotFeePercent) / 100;
  const personalIncomeTaxVND = sellsCryptoToFiat
    ? (grossValueVND * config.personalIncomeTaxPercent) / 100
    : 0;
  const networkFeeVND = to === 'VND' ? 0 : config.networkFeeUsd * usdToVndRate;
  const fiatWithdrawalFeeVND = sellsCryptoToFiat && to === 'VND' ? config.fiatWithdrawalFeeVND : 0;
  const totalFeeVND = spreadFeeVND + spotFeeVND + personalIncomeTaxVND + networkFeeVND + fiatWithdrawalFeeVND;

  return {
    grossValueVND,
    spreadFeeVND,
    spotFeeVND,
    personalIncomeTaxVND,
    networkFeeVND,
    fiatWithdrawalFeeVND,
    totalFeeVND,
    netAfterExitVND: to === 'VND' ? resultValue - totalFeeVND : null,
    taxable: sellsCryptoToFiat,
  };
}

function run() {
  const rates = { USD: 1, VND: 25000, EUR: 0.9, JPY: 150 };

  closeTo(convertCurrency(100, 'USD', 'VND', rates), 2_500_000, 'USD to VND');
  closeTo(convertCurrency(1_000_000, 'VND', 'USD', rates), 40, 'VND to USD');
  closeTo(convertCurrency(1_000_000, 'VND', 'EUR', rates), 36, 'VND to EUR via USD');
  closeTo(convertCurrency(90, 'EUR', 'VND', rates), 2_500_000, 'EUR to VND via USD');

  closeTo(goldWeightToOz(1, 'luong'), GRAM_PER_LUONG / OZ_TO_GRAM, '1 luong to oz');
  closeTo(ozToGoldWeight(1, 'chi'), OZ_TO_GRAM / GRAM_PER_CHI, '1 oz to chi');
  closeTo(ozToGoldWeight(goldWeightToOz(10, 'chi'), 'luong'), 1, '10 chi to 1 luong');

  closeTo(oilVolumeToLiters(1, 'barrel'), LITER_PER_BARREL, '1 barrel to liter');
  closeTo(litersToOilVolume(LITER_PER_BARREL, 'gallon_us'), GALLON_PER_BARREL, '1 barrel to gallon');
  closeTo(litersToOilVolume(oilVolumeToLiters(42, 'gallon_us'), 'barrel'), 1, '42 gallon to 1 barrel');

  const prices = { bitcoin: 50000, tether: 1 };
  const sellOneBtcVnd = 1 * prices.bitcoin * rates.VND;
  const sellCosts = estimateCryptoExitCosts({
    amountInput: 1,
    from: 'bitcoin',
    to: 'VND',
    resultValue: sellOneBtcVnd,
    prices,
    usdToVndRate: rates.VND,
  });
  closeTo(sellCosts.grossValueVND, 1_250_000_000, 'BTC sale gross VND');
  closeTo(sellCosts.spreadFeeVND, 6_250_000, 'BTC sale spread');
  closeTo(sellCosts.spotFeeVND, 1_250_000, 'BTC sale spot fee');
  closeTo(sellCosts.personalIncomeTaxVND, 1_250_000, 'BTC sale PIT 0.1%');
  closeTo(sellCosts.totalFeeVND, 8_750_000, 'BTC sale total estimated cost');
  closeTo(sellCosts.netAfterExitVND, 1_241_250_000, 'BTC sale net after exit');
  assert.equal(sellCosts.taxable, true, 'Selling crypto to VND should be taxable');

  const buyUsdtCosts = estimateCryptoExitCosts({
    amountInput: 25_000_000,
    from: 'VND',
    to: 'tether',
    resultValue: 1000,
    prices,
    usdToVndRate: rates.VND,
  });
  assert.equal(buyUsdtCosts.taxable, false, 'Buying crypto with VND should not apply sale PIT');
  closeTo(buyUsdtCosts.personalIncomeTaxVND, 0, 'Buy crypto PIT');

  console.log('[verify-finance] All formula checks passed.');
}

run();
