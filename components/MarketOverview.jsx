/**
 * MarketOverview Component
 * Dashboard section showing key market metrics with chart
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import ChartSection from './ChartSection';

export default function MarketOverview() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('usd-vnd');

  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/prices/latest', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gateway error');

      const fxRates = json?.data?.fx?.rates || json?.data?.fx || {};
      const crypto = json?.data?.crypto || {};
      const gold = json?.data?.gold;
      const oil = json?.data?.oil || {};

      const usdVnd = fxRates?.VND;
      const eurUsd = fxRates?.EUR;
      const eurVnd = usdVnd && eurUsd ? usdVnd / eurUsd : null;

      setMarketData({
        'USD/VND': usdVnd || null,
        'EUR/VND': eurVnd || null,
        'BTC/USD': crypto?.bitcoin || null,
        'ETH/USD': crypto?.ethereum || null,
        'XAU/USD': typeof gold === 'number' ? gold : gold?.price || null,
        'Brent': oil?.brent || null,
      });
    } catch (err) {
      console.error('[MarketOverview] Error:', err);
      setMarketData(null);
      setError('Không tải được dữ liệu Top 6.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const assetConfig = {
    'usd-vnd': {
      title: 'USD/VND',
      apiEndpoint: '/api/fx/historical',
      queryParams: { from: 'USD', to: 'VND' },
      color: '#3b82f6',
    },
    'btc': {
      title: 'BTC/USD',
      apiEndpoint: '/api/crypto/historical',
      queryParams: { id: 'bitcoin' },
      color: '#f97316',
    },
    'eth': {
      title: 'ETH/USD',
      apiEndpoint: '/api/crypto/historical',
      queryParams: { id: 'ethereum' },
      color: '#8b5cf6',
    },
    'xau': {
      title: 'XAU/USD',
      apiEndpoint: '/api/gold/historical',
      queryParams: {},
      color: '#eab308',
    },
  };

  const currentConfig = assetConfig[selectedAsset];

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          📊 Tổng quan thị trường
        </h2>
        <p className="text-gray-600">
          Theo dõi các chỉ số tài chính quan trọng trong một dashboard
        </p>
      </div>

      {/* Asset Selector */}
      <div className="flex justify-center gap-3">
        {Object.entries(assetConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedAsset(key)}
            className={`
              px-4 py-2 rounded-lg font-semibold text-sm transition-all
              ${selectedAsset === key
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {config.title}
          </button>
        ))}
      </div>

      {/* Chart */}
      {currentConfig && (
        <ChartSection
          title={`Biểu đồ ${currentConfig.title}`}
          subtitle="Lịch sử giá 30 ngày"
          apiEndpoint={currentConfig.apiEndpoint}
          queryParams={currentConfig.queryParams}
          color={currentConfig.color}
          icon="📈"
        />
      )}

      {/* Market Summary Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top 6 Chỉ số</h3>
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : marketData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(marketData).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-700">{key}</span>
                <span className="text-lg font-bold text-gray-900">
                  {typeof value === 'number' && Number.isFinite(value)
                    ? value.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '—'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 space-y-3">
            <div>{error || 'Không tải được dữ liệu'}</div>
            <button
              type="button"
              onClick={fetchMarketData}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-sm hover:shadow-md"
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
