"use client";

import { useEffect, useMemo, useState } from "react";
import { toUSD, fromUSDToCurrencies, fromUSDToCrypto, fromUSDToGold, fromUSDToOil } from '@/lib/valueCalc';

const presetsMap = {
  USD: [10, 100, 1000, 10000],
  VND: [500_000, 1_000_000, 5_000_000, 10_000_000, 100_000_000],
};

const cryptoIcons = {
  bitcoin: '🟠',
  ethereum: '🟣',
  tether: '🟢',
  solana: '🟩',
  cardano: '🔵',
  dogecoin: '🟡',
  polkadot: '🟥',
  chainlink: '🧿',
};

export default function ValueExplorer({
  context,
  referenceData,
  fxRate,
  fxRates,
  fxOk = true,
  fxLoading = false,
  fxError = null,
  onRetryFx,
  oilTypeLabel,
  onResult,
}) {
  const [amount, setAmount] = useState('1000000');
  const [debouncedAmount, setDebouncedAmount] = useState('1000000');
  const [baseMoney, setBaseMoney] = useState('VND');

  // Support both fxRate (single number) and fxRates (object with VND)
  const effectiveFxRate = useMemo(() => {
    if (fxRate) return fxRate;
    if (fxRates?.VND) return fxRates.VND;
    return null;
  }, [fxRate, fxRates]);

  const storageKey = useMemo(() => `value-explorer-base-${context}`, [context]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved === 'VND' || saved === 'USD') {
      setBaseMoney(saved);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, baseMoney);
  }, [baseMoney, storageKey]);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedAmount(amount), 250);
    return () => clearTimeout(handle);
  }, [amount]);

  const needFx = baseMoney === 'VND' && context !== 'currency';
  const fxAvailable = fxOk && Number.isFinite(effectiveFxRate) && effectiveFxRate > 0;

  const fxState = useMemo(() => {
    if (!needFx) return 'not-needed';
    if (fxLoading) return 'loading';
    if (fxError) return 'error';
    if (fxAvailable) return 'success';
    return 'idle';
  }, [needFx, fxLoading, fxError, fxAvailable]);

  const parsedAmount = useMemo(() => {
    const n = parseFloat(String(debouncedAmount).replace(/,/g, ''));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [debouncedAmount]);

  // Keep user selection; show proper loading/error states instead of force-switching

  const [conversionError, setConversionError] = useState(null);

  const usdValue = useMemo(() => {
    setConversionError(null);
    
    // Simple and direct conversion logic
    try {
      if (baseMoney === 'USD') {
        // Already in USD
        return parsedAmount;
      }
      
      if (baseMoney === 'VND') {
        // VND to USD conversion
        if (!effectiveFxRate || effectiveFxRate <= 0) {
          setConversionError(fxState === 'error' ? (fxError || 'Không lấy được tỷ giá') : 'Đang tải tỷ giá VND/USD...');
          return null;
        }
        
        const usd = parsedAmount / effectiveFxRate;
        
        // Debug logging
        console.log('[ValueExplorer] VND→USD:', {
          input: parsedAmount,
          rate: effectiveFxRate,
          output: usd,
          context
        });
        
        return usd;
      }
      
      // For other currencies (not supported yet)
      return parsedAmount;
      
    } catch (err) {
      console.error('[ValueExplorer] Conversion error:', err);
      setConversionError(err.message || 'Lỗi quy đổi tiền tệ');
      return null;
    }
  }, [parsedAmount, baseMoney, effectiveFxRate, context]);

  const results = useMemo(() => {
    if (!usdValue || usdValue <= 0) return null;
    switch (context) {
      case 'currency': {
        const targets = ['USD', 'EUR', 'JPY', 'GBP', 'CNY'];
        const fx = { USD: 1, ...(referenceData || {}) };
        const map = fromUSDToCurrencies(usdValue, fx, targets);
        return { type: 'currency', map };
      }
      case 'crypto': {
        const targets = ['bitcoin', 'ethereum', 'tether', 'solana'];
        const map = fromUSDToCrypto(usdValue, referenceData, targets);
        return { type: 'crypto', map };
      }
      case 'gold': {
        if (!referenceData?.xauUsd) return null;
        return { type: 'gold', map: fromUSDToGold(usdValue, referenceData.xauUsd) };
      }
      case 'oil': {
        if (!referenceData?.price) return null;
        return { type: 'oil', map: fromUSDToOil(usdValue, referenceData.price) };
      }
      default:
        return null;
    }
  }, [context, usdValue, referenceData]);

  useEffect(() => {
    if (onResult && usdValue) {
      onResult({ amount: parsedAmount, baseMoney, usd: usdValue });
    }
  }, [onResult, usdValue, parsedAmount, baseMoney]);

  const currencyLocales = {
    USD: 'en-US',
    VND: 'vi-VN',
    EUR: 'de-DE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    CNY: 'zh-CN',
  };

  const format = (val, opts = {}) => {
    if (val === undefined || val === null || Number.isNaN(val)) return '—';
    const currencyCode = opts.currency || baseMoney;
    const isVnd = currencyCode === 'VND';
    const min = opts.min ?? (isVnd ? 0 : 2);
    const max = opts.max ?? (isVnd ? 0 : 2);
    const locale = currencyLocales[currencyCode] || 'en-US';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }).format(val);
  };

  const renderRow = (label, value, suffix = '') => (
    <div key={label} className="flex items-center justify-between px-4 py-2 rounded-lg bg-white/80 border border-gray-100">
      <span className="font-medium text-gray-800">{label}</span>
      <span className="text-gray-900 font-semibold">{value} {suffix}</span>
    </div>
  );

  const presetButtons = presetsMap[baseMoney] || [];

  const loading = !referenceData || (needFx && fxState === 'loading');

  const summaryItems = useMemo(() => {
    if (!results?.map) return [];
    const entries = Object.entries(results.map).slice(0, 6);
    return entries.map(([key, val]) => {
      let label = key;
      if (context === 'crypto') label = key.toUpperCase();
      if (context === 'currency') label = key.toUpperCase();
      if (context === 'gold') label = key === 'oz' ? 'Ounce' : key;
      if (context === 'oil') label = key;
      return { label, value: val };
    });
  }, [results, context]);

  return (
    <div className="glass-panel rounded-2xl p-6 max-w-5xl mx-auto border-2 border-indigo-200 shadow-lg space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-bold">Value Explorer</p>
          <p className="text-xl font-bold text-gray-900">Xem tương đương nhanh theo {baseMoney}</p>
        </div>
        <div className="flex items-center gap-2">
          {['VND', 'USD'].map((b) => (
            <button
              key={b}
              onClick={() => setBaseMoney(b)}
              disabled={b === 'VND' && fxState === 'error'}
              className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                baseMoney === b
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
              } ${b === 'VND' && fxState === 'error' ? 'opacity-50 cursor-not-allowed hover:border-gray-200' : ''}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-700">Số tiền ({baseMoney})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="0"
          />
        </div>
        <div className="flex items-end gap-2 flex-wrap">
          {presetButtons.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
            >
              {p.toLocaleString(baseMoney === 'VND' ? 'vi-VN' : 'en-US')}
            </button>
          ))}
        </div>
      </div>

      {needFx && fxState === 'loading' && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          <span>Đang tải tỷ giá USD↔VND...</span>
        </div>
      )}

      {needFx && fxState === 'error' && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <span>{fxError || 'Không lấy được tỷ giá USD↔VND. Chỉ xem được chế độ USD.'}</span>
          {onRetryFx && (
            <button
              type="button"
              onClick={onRetryFx}
              className="text-sm font-semibold text-red-700 underline"
            >
              Thử lại FX
            </button>
          )}
        </div>
      )}

      {conversionError && !loading && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          ⚠️ {conversionError}
        </div>
      )}

      {loading && (
        <div className="grid md:grid-cols-2 gap-3 animate-pulse">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      )}

      {!loading && results?.map && (
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(results.map).map(([key, val]) => {
            if (context === 'crypto') {
              const icon = cryptoIcons[key] || '⬡';
              return renderRow(`${icon} ${key}`, format(val, { min: 6, max: 6, currency: baseMoney }), key.toUpperCase());
            }
            if (context === 'gold') {
              const labels = { oz: 'Ounce troy', gram: 'Gram', chi: 'Chỉ', cay: 'Cây' };
              const suffixMap = { oz: 'oz', gram: 'g', chi: 'chỉ', cay: 'lượng' };
              return renderRow(labels[key] || key, format(val, { min: 4, max: 4, currency: baseMoney }), suffixMap[key] || '');
            }
            if (context === 'oil') {
              const labels = { barrels: 'Thùng (bbl)', liter: 'Lít', gallon: 'Gallon (US)' };
              const suffixMap = { barrels: 'bbl', liter: 'L', gallon: 'gal' };
              return renderRow(labels[key] || key, format(val, { min: 4, max: 4, currency: baseMoney }), suffixMap[key] || '');
            }
            // currency
            return renderRow(key.toUpperCase(), format(val, { min: 2, max: 2, currency: key }), key.toUpperCase());
          })}
        </div>
      )}

    </div>
  );
}
