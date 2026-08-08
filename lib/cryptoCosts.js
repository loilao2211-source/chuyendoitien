import exchangeFees from '@/data/exchangeFees.json';

const FIAT_CODES = new Set(['USD', 'VND']);

export const VIETNAM_CRYPTO_TAX = {
  personalIncomeTaxPercent: 0.1,
  vatPercent: 0,
  source: 'Thong tu 32/2026/TT-BTC',
  note:
    'Ca nhan chuyen nhuong tai san ma hoa qua to chuc cung cap dich vu chiu thue TNCN 0.1% tren gia chuyen nhuong tung lan; chuyen nhuong/kinh doanh tai san ma hoa khong chiu VAT.',
};

function toFiniteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function isCryptoAsset(code, prices) {
  return Boolean(code && prices && Number.isFinite(prices[code]) && prices[code] > 0);
}

export function getCryptoTradeValueUsd({ amountInput, from, to, resultValue, prices, usdToVndRate }) {
  if (isCryptoAsset(from, prices)) {
    return amountInput * prices[from];
  }

  if (isCryptoAsset(to, prices)) {
    return resultValue * prices[to];
  }

  if (from === 'USD') return amountInput;
  if (from === 'VND' && usdToVndRate > 0) return amountInput / usdToVndRate;
  if (to === 'USD') return resultValue;
  if (to === 'VND' && usdToVndRate > 0) return resultValue / usdToVndRate;

  return 0;
}

export function estimateCryptoExitCosts({
  amountInput,
  from,
  to,
  resultValue,
  prices,
  usdToVndRate,
  exchange = 'default',
}) {
  const config = exchangeFees[exchange] || exchangeFees.default;
  const rate = toFiniteNumber(usdToVndRate, 0);
  const tradeValueUsd = getCryptoTradeValueUsd({
    amountInput,
    from,
    to,
    resultValue,
    prices,
    usdToVndRate: rate,
  });
  const grossValueVND = tradeValueUsd * rate;
  const sellsCryptoToFiat = isCryptoAsset(from, prices) && FIAT_CODES.has(to);
  const involvesCrypto = isCryptoAsset(from, prices) || isCryptoAsset(to, prices);

  const spreadPercent = involvesCrypto ? toFiniteNumber(config.spreadPercent, 0) : 0;
  const spotFeePercent = involvesCrypto ? toFiniteNumber(config.spotFeePercent, 0) : 0;
  const personalIncomeTaxPercent = sellsCryptoToFiat
    ? toFiniteNumber(config.personalIncomeTaxPercent, VIETNAM_CRYPTO_TAX.personalIncomeTaxPercent)
    : 0;
  const fiatWithdrawalFeeVND = sellsCryptoToFiat && to === 'VND'
    ? toFiniteNumber(config.fiatWithdrawalFeeVND, 0)
    : 0;
  const networkFeeVND = involvesCrypto && to !== 'VND'
    ? toFiniteNumber(config.networkFeeUsd, 0) * rate
    : 0;

  const spreadFeeVND = (grossValueVND * spreadPercent) / 100;
  const spotFeeVND = (grossValueVND * spotFeePercent) / 100;
  const personalIncomeTaxVND = (grossValueVND * personalIncomeTaxPercent) / 100;
  const totalFeeVND = spreadFeeVND + spotFeeVND + networkFeeVND + fiatWithdrawalFeeVND + personalIncomeTaxVND;
  const netAfterExitVND = to === 'VND' ? Math.max(0, resultValue - totalFeeVND) : null;

  return {
    grossValueVND,
    spreadPercent,
    spotFeePercent,
    personalIncomeTaxPercent,
    vatPercent: VIETNAM_CRYPTO_TAX.vatPercent,
    spreadFeeVND,
    spotFeeVND,
    networkFeeVND,
    fiatWithdrawalFeeVND,
    personalIncomeTaxVND,
    totalFeeVND,
    netAfterExitVND,
    taxable: sellsCryptoToFiat,
    note: VIETNAM_CRYPTO_TAX.note,
  };
}
