"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import ConverterForm from '@/components/ConverterForm';
import PriceCard from '@/components/PriceCard';
import PriceTable from '@/components/PriceTable';
import Disclaimer from '@/components/Disclaimer';
import currencies from '@/data/currencies.json';
import RefreshBar from '@/components/RefreshBar';
import ErrorBanner from '@/components/ErrorBanner';
import ValueExplorer from '@/components/ValueExplorer';
import TransferOptionsTable from '@/components/TransferOptionsTable';
import AffiliateOptions from '@/components/AffiliateOptions';
import CollapsibleSection from '@/components/CollapsibleSection';
import ChartSection from '@/components/ChartSection';
import PriceChart from '@/components/PriceChart';
import RangeSelector from '@/components/RangeSelector';
import { flagForCurrency } from '@/lib/flags';
import { useUsdToVnd } from '@/lib/hooks/useUsdToVnd';
import { fetchHistoricalRates } from '@/services/fxService';

const symbols = currencies
  .filter((c) => c.code !== 'USD')
  .map((c) => c.code)
  .join(',');

export default function CurrencyPage() {
  const [referenceData, setReferenceData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [explorerResult, setExplorerResult] = useState(null);
  const [selectedCurrencyPair, setSelectedCurrencyPair] = useState('USD-VND');
  const [chartRange, setChartRange] = useState(30);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [gatewayFxRate, setGatewayFxRate] = useState(null);
  const { usdToVnd, fxError, fxLoading, refetchFx } = useUsdToVnd({
    prefetchedRate: gatewayFxRate,
    disableFetch: true,
  });

  const REFRESH_INTERVAL_MS = 30 * 60 * 1000;

  const fetchRates = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/prices/latest', { cache: 'no-store' });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Gateway error');

      const fx = json?.data?.fx || {};
      const rates = fx?.rates || fx;

      setReferenceData(rates);
      setGatewayFxRate(rates?.VND || null);
      setLastUpdated(json.updatedAt || json?.sources?.fx?.updatedAt || null);
      setError(json.status === 'stale' ? 'Dữ liệu FX từ cache (stale).' : null);
    } catch (err) {
      console.error('[currency] Price Gateway error:', err.message);
      setError('Mạng chậm hoặc lỗi máy chủ. Hãy thử làm mới sau ít phút.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Fetch chart data
  const fetchChartData = useCallback(async () => {
    setChartLoading(true);
    setChartError(null);
    
    try {
      const [from, to] = selectedCurrencyPair.split('-');
      const data = await fetchHistoricalRates(from, to, chartRange);
      setChartData(data);
    } catch (err) {
      console.error('[Currency Chart] Error:', err);
      setChartError('Lỗi kết nối khi tải biểu đồ');
    } finally {
      setChartLoading(false);
    }
  }, [selectedCurrencyPair, chartRange]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const flagMap = useMemo(() => Object.fromEntries(currencies.map((c) => [c.code, c.flag || flagForCurrency(c.code)])), []);
  const nameMap = useMemo(() => Object.fromEntries(currencies.map((c) => [c.code, c.name || c.code])), []);

  const currencyOptions = currencies.map((c) => ({
    value: c.code,
    label: `${flagForCurrency(c.code)} ${c.code} • ${c.name}`,
  }));

  const handleConvert = async ({ amount, from, to, data }) => {
    const rates = { USD: 1, ...data };
    
    // Import unified converter
    const { convert } = await import('@/lib/currencyConverter');
    
    try {
      const result = convert(amount, from, to, rates);
      return result;
    } catch (err) {
      throw new Error(err.message || 'Không thể chuyển đổi');
    }
  };

  return (
    <div className="py-8 space-y-6">
      {/* Hero Section - Light Theme */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg py-8 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
          <div className="relative space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80 font-semibold">Currency • FX</p>
            <h1 className="text-3xl md:text-4xl font-bold drop-shadow-sm">
              Chuyển đổi tiền tệ thời gian thực
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Tỷ giá FX từ 50+ quốc gia. Công thức chuẩn, quy đổi chính xác từ VND, USD sang bất kỳ loại tiền nào.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-[11px] font-semibold text-white/70 pt-1">
              <span className="px-3 py-1 rounded-full bg-white/20">Cập nhật: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Đang tải...'}</span>
              <span className="px-3 py-1 rounded-full bg-white/15">Mỗi 30 phút</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <ValueExplorer
          context="currency"
          referenceData={referenceData}
          fxRate={usdToVnd}
          fxOk={!!usdToVnd && !fxError}
          fxLoading={fxLoading}
          fxError={fxError}
          onRetryFx={refetchFx}
          onResult={setExplorerResult}
        />
      </div>

      {/* FX Rate Chart with Currency Pair Selector */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💱</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Biểu đồ tỷ giá</h3>
                <p className="text-sm text-gray-600">Lịch sử tỷ giá theo thời gian</p>
              </div>
            </div>
            <RangeSelector 
              selected={chartRange} 
              onChange={setChartRange}
              ranges={[7, 30, 90, 365]}
            />
          </div>

          {/* Currency Pair Selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { pair: 'USD-VND', label: 'USD/VND', color: '#3b82f6' },
              { pair: 'EUR-VND', label: 'EUR/VND', color: '#8b5cf6' },
              { pair: 'JPY-VND', label: 'JPY/VND', color: '#ec4899' },
              { pair: 'GBP-VND', label: 'GBP/VND', color: '#10b981' },
              { pair: 'CNY-VND', label: 'CNY/VND', color: '#f59e0b' },
            ].map(({ pair, label }) => {
              const isActive = selectedCurrencyPair === pair;
              return (
                <button
                  key={pair}
                  onClick={() => setSelectedCurrencyPair(pair)}
                  className={`
                    px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all
                    ${isActive 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <PriceChart
            title={selectedCurrencyPair.replace('-', '/')}
            data={chartData}
            loading={chartLoading}
            error={chartError}
            yAxisLabel={selectedCurrencyPair.split('-')[1]}
            color="#3b82f6"
          />
        </div>
      </div>

      {/* Chuyển đổi chi tiết - Always Open */}
      <div className="glass-panel rounded-2xl border border-blue-100 max-w-5xl mx-auto p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🔄</span>
            <span>Chuyển đổi chi tiết</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">Converter</span>
          </h3>
        </div>
        <ConverterForm
          mode="fx"
          fromOptions={currencyOptions}
          toOptions={currencyOptions}
          referenceData={referenceData}
          lastUpdated={lastUpdated}
          onConvert={handleConvert}
          disclaimerText="Tỷ giá được cập nhật mỗi 30 phút. Đối chiếu lại tại ngân hàng trước khi giao dịch."
        />
      </div>

      {fxError && (
        <div className="max-w-5xl mx-auto px-4">
          <ErrorBanner message={fxError} />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={refetchFx}
              className="text-sm text-blue-700 font-semibold hover:underline"
            >
              Thử lại FX
            </button>
          </div>
        </div>
      )}

      <AffiliateOptions
        category="money_transfer"
        baseMoney={explorerResult?.baseMoney || 'VND'}
        amount={explorerResult?.amount}
        usdEquivalent={explorerResult?.usd}
        resultsReady={!!explorerResult}
      />

      <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <PriceCard
          title="1 USD → VND"
          price={usdToVnd || referenceData?.VND || 0}
          unit="Việt Nam Đồng"
          loading={!referenceData && !usdToVnd}
          prefix="₫"
          decimals={0}
          tone="green"
          locale="vi-VN"
        />
        <PriceCard
          title="1 USD → EUR"
          price={referenceData?.EUR || 0}
          unit="Euro"
          loading={!referenceData}
          prefix="€"
          decimals={3}
          tone="blue"
        />
        <PriceCard
          title="1 USD → JPY"
          price={referenceData?.JPY || 0}
          unit="Yen"
          loading={!referenceData}
          prefix="¥"
          decimals={2}
          tone="gray"
        />
      </div>

      <RefreshBar
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={fetchRates}
        refreshIntervalMs={REFRESH_INTERVAL_MS}
        showButton={true}
      />

      {error && <ErrorBanner message={error} />}

      <CollapsibleSection title="Bảng giá chi tiết" badge="Tự động cập nhật">
        <PriceTable
          data={referenceData}
          title="Tỷ giá quy đổi (USD làm gốc)"
          currencyPrefix=""
          valueFormatter={(v) => {
            return new Intl.NumberFormat('en-US', {
              minimumFractionDigits: v >= 100 ? 2 : 4,
              maximumFractionDigits: 4,
            }).format(v);
          }}
          renderLabel={(code) => {
            const flag = flagMap[code] || flagForCurrency(code);
            const name = nameMap[code] || code;
            return `${flag} ${code.toUpperCase()} • ${name}`;
          }}
        />
      </CollapsibleSection>

      <div className="glass-panel p-6 rounded-2xl max-w-5xl mx-auto border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Mẹo sử dụng</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="p-3 rounded-xl bg-white/70 border border-gray-100">
            <p className="font-semibold mb-1">Chọn đúng chiều</p>
            <p>Sử dụng nút "Đổi chiều" để hoán đổi nhanh giữa USD ↔ VND hoặc các cặp khác.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/70 border border-gray-100">
            <p className="font-semibold mb-1">Nhập nhanh</p>
            <p>Nút 1 - 10 - 100 giúp điền số nhanh cho tính toán sơ bộ.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/70 border border-gray-100">
            <p className="font-semibold mb-1">Độ trễ dữ liệu</p>
            <p>Dữ liệu được cache 2 giờ để tải nhanh; kiểm tra ngân hàng khi giao dịch.</p>
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
