"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import ConverterForm from "@/components/ConverterForm";
import Disclaimer from "@/components/Disclaimer";
import PriceCard from "@/components/PriceCard";
import PriceTable from "@/components/PriceTable";
import RefreshBar from "@/components/RefreshBar";
import ErrorBanner from "@/components/ErrorBanner";
import ValueExplorer from "@/components/ValueExplorer";
import TransferOptionsTable from "@/components/TransferOptionsTable";
import AffiliateOptions from "@/components/AffiliateOptions";
import CollapsibleSection from "@/components/CollapsibleSection";
import PriceChart from "@/components/PriceChart";
import RangeSelector from "@/components/RangeSelector";
import cryptoCoins from "@/data/cryptoCoins.json";
import { convertCurrencyToUSD, convertUSDToTarget } from "@/lib/currencyConverter";
import { useUsdToVnd } from "@/lib/hooks/useUsdToVnd";

export default function CryptoPageClient() {
  const [referenceData, setReferenceData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [explorerResult, setExplorerResult] = useState(null);
  const [gatewayFxRate, setGatewayFxRate] = useState(null);
  const [gatewayCrypto, setGatewayCrypto] = useState(null);
  
  // Chart state
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [chartRange, setChartRange] = useState(30);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);

  const { usdToVnd, fxError, fxLoading, refetchFx } = useUsdToVnd({
    prefetchedRate: gatewayFxRate,
    disableFetch: true,
  });

  const REFRESH_INTERVAL_MS = 60 * 60 * 1000;

  const fetchPrices = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/prices/latest', { cache: 'no-store' });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Gateway error');

      const fx = json?.data?.fx || {};
      const rates = fx?.rates || fx;
      const crypto = json?.data?.crypto || null;

      setGatewayFxRate(rates?.VND || null);
      setGatewayCrypto(crypto);
      setReferenceData(crypto);
      setLastUpdated(json.updatedAt || json?.sources?.crypto?.updatedAt || null);
      setError(json.status === 'stale' ? 'Dữ liệu từ cache (stale).' : null);
    } catch (err) {
      console.error('[crypto] Price Gateway error:', err.message);
      setError("Kết nối chậm hoặc lỗi máy chủ. Vui lòng làm mới sau.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Fetch chart data
  const fetchChartData = useCallback(async () => {
    setChartLoading(true);
    setChartError(null);
    
    try {
      const res = await fetch(`/api/crypto/historical?id=${selectedCrypto}&days=${chartRange}`);
      const json = await res.json();
      
      if (json.ok) {
        setChartData(json.data);
      } else {
        setChartError(json.error || 'Không tải được dữ liệu biểu đồ');
      }
    } catch (err) {
      setChartError('Lỗi kết nối khi tải biểu đồ');
    } finally {
      setChartLoading(false);
    }
  }, [selectedCrypto, chartRange]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const fxRatesForExplorer = useMemo(() => (usdToVnd ? { VND: usdToVnd } : null), [usdToVnd]);

  const iconMap = {
    bitcoin: '🟠',
    ethereum: '🟣',
    tether: '🟢',
    solana: '🟩',
    cardano: '🔵',
    dogecoin: '🟡',
    polkadot: '🟥',
    chainlink: '🧿',
  };

  const cryptoOptions = cryptoCoins.map((c) => ({
    value: c.id,
    label: `${iconMap[c.id] || '⬡'} ${c.symbol.toUpperCase()} - ${c.name}`,
  }));

  const fiatOptions = [
    { value: 'USD', label: '🇺🇸 USD - Đô la Mỹ' },
    { value: 'VND', label: '🇻🇳 VND - Đồng Việt' },
  ];

  const converterOptions = useMemo(() => [...cryptoOptions, ...fiatOptions], [cryptoOptions]);

  const fxRates = useMemo(
    () => ({ USD: 1, ...(usdToVnd ? { VND: usdToVnd } : {}) }),
    [usdToVnd]
  );

  const handleConvert = useCallback(
    async ({ amount, from, to, data }) => {
      const prices = data || referenceData;

      if (from === to) return amount;

      const requiresFx = from === 'VND' || to === 'VND';
      if (requiresFx && !fxRates.VND) {
        throw new Error('Thiếu tỷ giá USD/VND. Nhấn "Thử lại FX" để tải lại.');
      }

      const isCrypto = (code) => Boolean(prices && prices[code]);

      let amountUSD;
      if (isCrypto(from)) {
        const fromPrice = prices[from];
        if (!fromPrice || fromPrice <= 0) {
          throw new Error(`Không có giá cho ${from.toUpperCase()}`);
        }
        amountUSD = amount * fromPrice;
      } else {
        amountUSD = convertCurrencyToUSD(amount, from, fxRates);
      }

      let result;
      if (isCrypto(to)) {
        const toPrice = prices[to];
        if (!toPrice || toPrice <= 0) {
          throw new Error(`Không có giá cho ${to.toUpperCase()}`);
        }
        result = amountUSD / toPrice;
      } else {
        result = convertUSDToTarget(amountUSD, to, fxRates);
      }

      return result;
    },
    [fxRates, referenceData]
  );

  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center justify-end max-w-5xl mx-auto px-4">
        <span className="text-sm text-gray-500">Crypto • CoinGecko API</span>
      </div>

      {/* Hero Section - Light Theme */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="relative rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg py-8 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
          <div className="relative space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80 font-semibold">Crypto • DeFi</p>
            <h1 className="text-3xl md:text-4xl font-bold drop-shadow-sm">
              Theo dõi & chuyển đổi tiền điện tử
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Bitcoin, Ethereum, 12+ đồng crypto phổ biến. Giá USD real-time, tính toán chéo giữa các coin dễ dàng.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-[11px] font-semibold text-white/70 pt-1">
              <span className="px-3 py-1 rounded-full bg-white/20">Cập nhật: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Đang tải...'}</span>
              <span className="px-3 py-1 rounded-full bg-white/15">Mỗi 60 phút</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Value Explorer - Primary Tool */}
      <div className="px-4">
        <ValueExplorer
          context="crypto"
          referenceData={referenceData}
          fxRate={usdToVnd}
          fxOk={!fxError}
          fxLoading={fxLoading}
          fxError={fxError}
          onRetryFx={refetchFx}
          onResult={setExplorerResult}
        />
      </div>

      {/* 2. Price Chart with Crypto Selector */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Biểu đồ giá</h3>
                <p className="text-sm text-gray-600">Lịch sử giá theo thời gian</p>
              </div>
            </div>
            <RangeSelector 
              selected={chartRange} 
              onChange={setChartRange}
              ranges={[7, 30, 90, 365]}
            />
          </div>
          
          {/* Crypto Selector Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['bitcoin', 'ethereum', 'solana', 'cardano'].map((crypto) => {
              const coin = cryptoCoins.find(c => c.id === crypto);
              const isActive = selectedCrypto === crypto;
              return (
                <button
                  key={crypto}
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`
                    px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all
                    ${isActive 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {coin?.symbol.toUpperCase() || crypto.toUpperCase()}
                </button>
              );
            })}
          </div>

          <PriceChart
            title={`${selectedCrypto.toUpperCase()}/USD`}
            data={chartData}
            loading={chartLoading}
            error={chartError}
            yAxisLabel="Price (USD)"
            color="#f97316"
          />
        </div>
      </div>

      {/* Chuyển đổi chi tiết - Always Open */}
      <div className="glass-panel rounded-2xl border border-orange-100 max-w-5xl mx-auto p-6 mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🔄</span>
            <span>Chuyển đổi chi tiết</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">Converter</span>
          </h3>
        </div>
        <ConverterForm
          mode="crypto"
          fromOptions={converterOptions}
          toOptions={converterOptions}
          referenceData={referenceData}
          lastUpdated={lastUpdated}
          onConvert={handleConvert}
          usdToVndRate={usdToVnd}
          disclaimerText="Giá crypto cập nhật mỗi 60 phút. Kiểm tra lại trên CoinGecko trước khi giao dịch."
        />
      </div>

      {/* FX Error Banner */}
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

      {/* 2. Featured Cards */}
      <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto px-4">
        <PriceCard
          title="Giá Bitcoin"
          price={referenceData?.bitcoin || 0}
          unit="USD mỗi BTC"
          loading={!referenceData}
          prefix="$"
          decimals={2}
          tone="blue"
        />
        <PriceCard
          title="Giá Ethereum"
          price={referenceData?.ethereum || 0}
          unit="USD mỗi ETH"
          loading={!referenceData}
          prefix="$"
          decimals={2}
          tone="green"
        />
        <PriceCard
          title="Giá Solana"
          price={referenceData?.solana || 0}
          unit="USD mỗi SOL"
          loading={!referenceData}
          prefix="$"
          decimals={2}
          tone="gray"
        />
      </div>

      {/* 3. Crypto Services - Affiliate */}
      <div className="px-4">
        <AffiliateOptions
          category="crypto"
          resultsReady={true}
        />
      </div>

      {/* Refresh Bar */}
      <div className="px-4">
        <RefreshBar
          lastUpdated={lastUpdated}
          refreshing={refreshing}
          onRefresh={fetchPrices}
          refreshIntervalMs={REFRESH_INTERVAL_MS}
          showButton={true}
        />
      </div>

      {error && <div className="px-4"><ErrorBanner message={error} /></div>}

      {/* 4. Collapsible: Price Table */}
      <div className="px-4">
        <CollapsibleSection title="Bảng giá chi tiết" badge="USD gốc" defaultOpen={false}>
          <PriceTable
            data={referenceData}
            title="Bảng giá crypto (USD)"
            currencyPrefix="$"
            valueFormatter={(v) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(v)}
            renderLabel={(code) => `${iconMap[code] || '⬡'} ${code.toUpperCase()}`}
          />
        </CollapsibleSection>
      </div>

      {/* 6. Notes */}
      <div className="glass-panel p-5 rounded-2xl max-w-5xl mx-auto border border-orange-100 mx-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Lưu ý thị trường</h2>
        <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-800">
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold mb-1">Biến động cao</p>
            <p>Giá có thể thay đổi nhanh, cần làm mới và kiểm tra nguồn chính.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold mb-1">Thanh khoản</p>
            <p>Tránh giao dịch với khối lượng lớn khi thị trường biến động mạnh.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold mb-1">Bảo mật</p>
            <p>Không chia sẻ khóa cá nhân, luôn dùng ví và sàn uy tín.</p>
          </div>
        </div>
      </div>

      {/* 7. Disclaimer */}
      <div className="px-4">
        <Disclaimer />
      </div>
    </div>
  );
}
