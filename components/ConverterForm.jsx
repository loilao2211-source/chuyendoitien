'use client';

import { useEffect, useMemo, useState } from 'react';
import LastUpdated from './LastUpdated';
import { addUTMParams, getAffiliatesByCategory } from '@/data/affiliateConfig';
import { estimateCryptoExitCosts } from '@/lib/cryptoCosts';

// Helper: Convert number to Vietnamese words
function numberToVietnameseWords(amount) {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'không';

  const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const units = ['', 'nghìn', 'triệu', 'tỷ'];

  function readGroup(num) {
    if (num === 0) return '';
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const one = num % 10;

    let result = '';
    if (hundred > 0) {
      result += ones[hundred] + ' trăm';
    }
    if (ten > 0) {
      if (result && ten === 0 && one > 0) {
        result += ' lẻ';
      } else {
        if (result) result += ' ';
        result += ten === 1 ? 'mười' : ones[ten] + ' mươi';
      }
    } else if (hundred > 0 && one > 0) {
      result += ' lẻ';
    }
    if (one > 0) {
      if (result) result += ' ';
      if (one === 1 && ten > 1) {
        result += 'mốt';
      } else if (one === 5 && ten >= 1) {
        result += 'lăm';
      } else {
        result += ones[one];
      }
    }
    return result;
  }

  const groups = [];
  let num = rounded;
  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }

  let result = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    if (group > 0) {
      if (result) result += ' ';
      result += readGroup(group);
      if (i > 0 && i < units.length) {
        result += ' ' + units[i];
      } else if (i >= units.length) {
        // Handle larger numbers: nghìn tỷ, triệu tỷ, etc.
        const unitIndex = i % units.length;
        const multiplier = Math.floor(i / units.length);
        if (unitIndex === 0 && multiplier > 0) {
          result += ' ' + units[3]; // tỷ
          for (let j = 1; j < multiplier; j++) {
            result += ' ' + units[3];
          }
        } else {
          result += ' ' + units[unitIndex];
          for (let j = 0; j < multiplier; j++) {
            result += ' ' + units[3];
          }
        }
      }
    }
  }

  return result;
}

export default function ConverterForm({
  mode = 'fx',
  fromOptions = [],
  toOptions = [],
  onConvert = null,
  referenceData = null,
  lastUpdated = null,
  dataStatus = null,
  usdToVndRate = null,
  disclaimerText = '',
}) {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState(fromOptions[0]?.value || '');
  const [to, setTo] = useState(toOptions[0]?.value || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultMeta, setResultMeta] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState('default');

  // Detect page category from mode to serve contextual affiliate suggestion
  const category = useMemo(() => {
    switch (mode) {
      case 'fx':
        return 'money_transfer';
      case 'crypto':
        return 'crypto';
      case 'gold':
        return 'gold';
      case 'oil':
        return 'fuel';
      case 'interest':
        return 'interest';
      default:
        return 'money_transfer';
    }
  }, [mode]);

  const affiliatePick = useMemo(() => {
    const list = getAffiliatesByCategory(category) || [];
    return list.find((item) => item?.outboundHref && item.outboundHref !== '#') || list[0];
  }, [category]);

  const affiliateHref = useMemo(() => {
    if (!affiliatePick?.href) return null;
    return addUTMParams(affiliatePick.href, category);
  }, [affiliatePick?.href, category]);

  const isDataReady = referenceData && Object.keys(referenceData).length > 0;
  const statusCopy = dataStatus === 'estimated'
    ? { text: 'Ước tính', className: 'text-amber-600' }
    : dataStatus === 'stale'
      ? { text: 'Stale', className: 'text-amber-600' }
      : isDataReady
        ? { text: 'Live', className: 'text-emerald-600' }
        : { text: 'Loading', className: 'text-amber-600' };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setError(null);
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setResultMeta(null);

    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (from === to && mode !== 'gold' && mode !== 'oil') {
      setError('From and To currencies cannot be the same');
      return;
    }

    if (!isDataReady) {
      setError('Exchange rates not loaded');
      return;
    }

    setLoading(true);

    try {
      if (onConvert) {
        const output = await onConvert({
          amount: numAmount,
          from,
          to,
          data: referenceData,
        });
        setResult(output);
        setResultMeta({ amount: numAmount, from, to });
      }
    } catch (err) {
      setError(err.message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleConvert} className="glass-panel rounded-2xl p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wide">{mode}</span>
          <span className={statusCopy.className}>● {statusCopy.text}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="hidden sm:inline">Chọn nhanh:</span>
          {[1, 10, 100].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(String(preset))}
              className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            placeholder="Nhập số lượng"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Từ</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            disabled={!isDataReady}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            {fromOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Đến</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            disabled={!isDataReady}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            {toOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-4">
        <button
          type="button"
          onClick={swap}
          className="flex-1 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 transition"
        >
          Đổi chiều
        </button>

        <button
          type="submit"
          disabled={!isDataReady || loading}
          className="flex-[2] py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60"
        >
          {loading ? 'Đang đổi...' : 'Chuyển đổi'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {result !== null && resultMeta && (
        <>
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-green-100">
            <p className="text-sm text-gray-600">Kết quả</p>
            <p className="text-2xl font-bold text-emerald-700">
              {resultMeta.amount} {resultMeta.from} = {(() => {
                // Adaptive decimal formatting
                const isCrypto = !['USD', 'VND', 'EUR', 'GBP', 'JPY'].includes(resultMeta.to);
                if (isCrypto) {
                  // BTC and ETH: 8 decimals
                  if (['bitcoin', 'ethereum'].includes(resultMeta.to)) {
                    return result.toFixed(8);
                  }
                  // Other cryptos: 6-8 decimals based on value
                  if (result < 0.0001) {
                    return result.toFixed(8);
                  }
                  return result.toFixed(6);
                }
                // Fiat currencies
                if (resultMeta.to === 'VND') {
                  return Math.round(result).toLocaleString();
                }
                return result.toFixed(4);
              })()} {resultMeta.to}
            </p>
            {resultMeta.to === 'VND' && (
              <p className="text-sm text-emerald-600 mt-2">
                Bằng chữ: {numberToVietnameseWords(result)} đồng
              </p>
            )}
            {/* Display USD/VND rate when VND is involved */}
            {(resultMeta.from === 'VND' || resultMeta.to === 'VND') && usdToVndRate && (
              <p className="text-xs text-emerald-600/80 mt-1.5">
                Tỷ giá quy đổi: 1 USD ≈ {usdToVndRate.toLocaleString()} VND
              </p>
            )}
          </div>

          {/* Crypto fee/tax estimation block */}
          {mode === 'crypto' && (
          <div className="mt-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-700">Ước tính phí, thuế khi rút khỏi sàn</p>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-600">Sàn (tuỳ chọn):</label>
                <select
                  value={selectedExchange}
                  onChange={(e) => setSelectedExchange(e.target.value)}
                  className="text-[10px] px-2 py-0.5 border border-gray-300 rounded bg-white text-gray-700"
                >
                  <option value="default">Ước tính chung</option>
                  <option value="binance">Binance</option>
                  <option value="okx">OKX</option>
                  <option value="bybit">Bybit</option>
                </select>
              </div>
            </div>
            {(() => {
              const fees = estimateCryptoExitCosts({
                amountInput: resultMeta.amount,
                from: resultMeta.from,
                to: resultMeta.to,
                resultValue: result,
                prices: referenceData,
                usdToVndRate: usdToVndRate || 25000,
                exchange: selectedExchange,
              });
              return (
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Spread:</span>
                    <span>{fees.spreadPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí spot trading:</span>
                    <span>{fees.spotFeePercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí mạng:</span>
                    <span>{fees.networkFeeVND.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí rút VND:</span>
                    <span>{fees.fiatWithdrawalFeeVND.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế TNCN tạm tính:</span>
                    <span>
                      {fees.personalIncomeTaxPercent}% ({Math.round(fees.personalIncomeTaxVND).toLocaleString()} VND)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT chuyển nhượng:</span>
                    <span>{fees.vatPercent}%</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-1 mt-1 font-semibold text-gray-800">
                    <span>Tổng phí ước tính:</span>
                    <span>{Math.round(fees.totalFeeVND).toLocaleString()} VND</span>
                  </div>
                  {fees.netAfterExitVND !== null && (
                    <div className="flex justify-between font-semibold text-emerald-700">
                      <span>Còn lại sau phí/thuế:</span>
                      <span>{Math.round(fees.netAfterExitVND).toLocaleString()} VND</span>
                    </div>
                  )}
                </div>
              );
            })()}
            <p className="text-[10px] text-gray-500 mt-2 italic">
              Ước tính tham khảo. Thuế TNCN áp dụng khi bán/chuyển nhượng crypto ra fiat; phí thực tế phụ thuộc sàn, ngân hàng và thời điểm.
            </p>
          </div>
          )}

          {affiliatePick && (
            <div className="mt-3 p-3 rounded-lg border border-blue-100 bg-blue-50/80 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-xs text-blue-900">
                <p className="font-semibold flex items-center gap-1">
                  <span>🤝</span>
                  {affiliatePick.name} phù hợp với thao tác của bạn
                </p>
                <p className="text-[11px] text-blue-800/80">{affiliatePick.description}</p>
              </div>
              {affiliateHref ? (
                <a
                  href={affiliateHref}
                  rel="nofollow"
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                >
                  {affiliatePick.cta}
                </a>
              ) : (
                <span className="text-[11px] text-gray-500">Liên kết sẽ sớm cập nhật</span>
              )}
            </div>
          )}
        </>
      )}

      {!isDataReady && (
        <p className="text-center text-gray-500 text-sm mt-4">Đang tải dữ liệu...</p>
      )}

      <LastUpdated timestamp={lastUpdated} />

      {disclaimerText && (
        <p className="text-xs text-gray-600 text-center mt-3 leading-relaxed">{disclaimerText}</p>
      )}
    </form>
  );
}
