'use client';

import { useEffect, useMemo, useState } from 'react';
import LastUpdated from './LastUpdated';
import { addUTMParams, getAffiliatesByCategory } from '@/data/affiliateConfig';

export default function ConverterForm({
  mode = 'fx',
  fromOptions = [],
  toOptions = [],
  onConvert = null,
  referenceData = null,
  lastUpdated = null,
  disclaimerText = '',
}) {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState(fromOptions[0]?.value || '');
  const [to, setTo] = useState(toOptions[0]?.value || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultMeta, setResultMeta] = useState(null);

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
          {isDataReady ? <span className="text-emerald-600">● Live</span> : <span className="text-amber-600">● Loading</span>}
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
              {resultMeta.amount} {resultMeta.from} = {result.toFixed(4)} {resultMeta.to}
            </p>
          </div>

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
