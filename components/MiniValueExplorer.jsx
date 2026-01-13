'use client';

import { useEffect, useMemo, useState } from 'react';
import { toUSD, fromUSDToCurrencies, fromUSDToCrypto, fromUSDToGold, fromUSDToOil } from '@/lib/valueCalc';
import { fetchUsdToVnd } from '@/services/fxService';

const presetsMap = {
  USD: [10, 100, 1000, 10000],
  VND: [500_000, 1_000_000, 5_000_000, 10_000_000],
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

export default function MiniValueExplorer({ context, referenceData, fxRates, onResult }) {
  const [amount, setAmount] = useState('1000000');
  const [debounced, setDebounced] = useState('1000000');
  const [baseMoney, setBaseMoney] = useState('VND');
  const [localFx, setLocalFx] = useState(null);
  const [loadingFx, setLoadingFx] = useState(false);
  const [fxError, setFxError] = useState(null);

  const effectiveFx = fxRates || localFx;
  const storageKey = useMemo(() => `mini-explorer-${context}`, [context]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved === 'USD' || saved === 'VND') setBaseMoney(saved);
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, baseMoney);
  }, [baseMoney, storageKey]);

  useEffect(() => {
    const h = setTimeout(() => setDebounced(amount), 250);
    return () => clearTimeout(h);
  }, [amount]);

  useEffect(() => {
    const needFx = !fxRates && baseMoney === 'VND' && context !== 'fx';
    if (!needFx) return;
    setLoadingFx(true);
    const fetchFx = async () => {
      try {
        const vndRate = await fetchUsdToVnd();
        if (vndRate) {
          setLocalFx({ USD: 1, VND: vndRate });
          setFxError(null);
        } else if (!effectiveFx) {
          setFxError('Không lấy được tỷ giá VND. Thử lại sau.');
        }
      } catch (err) {
        if (!effectiveFx) setFxError('Kết nối chậm, thử lại sau.');
      } finally {
        setLoadingFx(false);
      }
    };
    fetchFx();
  }, [baseMoney, context, fxRates, effectiveFx]);

  const parsed = useMemo(() => {
    const n = parseFloat(String(debounced).replace(/,/g, ''));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [debounced]);

  const usdValue = useMemo(() => {
    try {
      return toUSD(parsed, baseMoney, effectiveFx || referenceData);
    } catch (e) {
      return null;
    }
  }, [parsed, baseMoney, effectiveFx, referenceData]);

  const results = useMemo(() => {
    if (!usdValue || usdValue <= 0) return null;
    switch (context) {
      case 'fx': {
        const fx = { USD: 1, ...(referenceData || {}) };
        const targets = ['USD', 'EUR', 'JPY', 'GBP', 'CNY', 'VND'];
        return { type: 'fx', map: fromUSDToCurrencies(usdValue, fx, targets) };
      }
      case 'crypto': {
        const targets = ['bitcoin', 'ethereum', 'tether', 'solana'];
        return { type: 'crypto', map: fromUSDToCrypto(usdValue, referenceData, targets) };
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
      onResult({ amount: parsed, baseMoney, usd: usdValue });
    }
  }, [onResult, usdValue, parsed, baseMoney]);

  const format = (val, opts = {}) => {
    if (val === undefined || val === null || Number.isNaN(val)) return '—';
    const { min = 2, max = 2 } = opts;
    const locale = (opts.currency === 'VND' || baseMoney === 'VND') ? 'vi-VN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }).format(val);
  };

  const summaryItems = useMemo(() => {
    if (!results?.map) return [];
    return Object.entries(results.map).slice(0, 5).map(([key, val]) => {
      let label = key;
      if (context === 'crypto') label = `${cryptoIcons[key] || '⬡'} ${key.toUpperCase()}`;
      if (context === 'fx') label = key.toUpperCase();
      if (context === 'gold') label = key === 'oz' ? 'Ounce' : key;
      if (context === 'oil') label = key;
      return { label, value: val, key };
    });
  }, [results, context]);

  const loading = !referenceData || (baseMoney === 'VND' && context !== 'fx' && !effectiveFx && loadingFx);

  return (
    <div className="glass-panel rounded-2xl p-4 border border-indigo-100 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-semibold">Mini Value Explorer</p>
          <p className="text-sm font-semibold text-gray-900">Ước tính nhanh theo {baseMoney}</p>
        </div>
        <div className="flex items-center gap-2">
          {['VND', 'USD'].map((b) => (
            <button
              key={b}
              onClick={() => setBaseMoney(b)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                baseMoney === b ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-2">
        <div className="md:col-span-2">
          <label className="text-xs text-gray-700">Số tiền ({baseMoney})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            min="0"
          />
        </div>
        <div className="flex items-end gap-2 flex-wrap">
          {(presetsMap[baseMoney] || []).map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold"
            >
              {p.toLocaleString(baseMoney === 'VND' ? 'vi-VN' : 'en-US')}
            </button>
          ))}
        </div>
      </div>

      {fxError && !effectiveFx && <p className="text-xs text-red-600">{fxError}</p>}

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 animate-pulse">
          {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}
        </div>
      )}

      {!loading && summaryItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {summaryItems.map((item) => (
            <div key={item.key} className="px-3 py-2 rounded-lg bg-white/80 border border-gray-100 flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">{item.label}</span>
              <span className="text-gray-900 font-semibold">{format(item.value, { currency: item.key })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
