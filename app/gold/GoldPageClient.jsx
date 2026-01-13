"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import ConverterForm from "@/components/ConverterForm";
import Disclaimer from "@/components/Disclaimer";
import PriceCard from "@/components/PriceCard";
import RefreshBar from "@/components/RefreshBar";
import ErrorBanner from "@/components/ErrorBanner";
import ValueExplorer from "@/components/ValueExplorer";
import TransferOptionsTable from "@/components/TransferOptionsTable";
import AffiliateOptions from "@/components/AffiliateOptions";
import VnGoldSection from "@/components/VnGoldSection";
import ChartSection from "@/components/ChartSection";
import vnPrices from "@/data/vn-prices.json";

const units = vnPrices.units;
import PriceTable from "@/components/PriceTable";
import CollapsibleSection from "@/components/CollapsibleSection";
import { useUsdToVnd } from "@/lib/hooks/useUsdToVnd";

export default function GoldPageClient() {
  const [referenceData, setReferenceData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [explorerResult, setExplorerResult] = useState(null);
  const [vnGold, setVnGold] = useState(null);
  const [vnGoldError, setVnGoldError] = useState(null);
  const [selectedGoldType, setSelectedGoldType] = useState('xau'); // New state
  const [gatewayFxRate, setGatewayFxRate] = useState(null);
  const [gatewayGold, setGatewayGold] = useState(null);

  const { usdToVnd, fxError, fxLoading, refetchFx } = useUsdToVnd({
    prefetchedRate: gatewayFxRate,
    disableFetch: true,
  });

  const OZ_TO_GRAM = 31.1034768;
  const GRAM_PER_CHI = 3.75;
  const GRAM_PER_LUONG = 37.5;

  const REFRESH_INTERVAL_MS = 120 * 60 * 1000;

  const fetchGoldPrice = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/prices/latest', { cache: 'no-store' });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Gateway error');

      const fx = json?.data?.fx || {};
      const rates = fx?.rates || fx;
      const goldPrice = json?.data?.gold || json?.data?.gold?.price;

      setGatewayFxRate(rates?.VND || null);
      setGatewayGold(goldPrice);
      setReferenceData({ xauUsd: goldPrice });
      setLastUpdated(json.updatedAt || json?.sources?.gold?.updatedAt || null);
      setError(json.status === 'stale' ? 'Dữ liệu từ cache (stale).' : null);
    } catch (err) {
      console.error('[gold] Price Gateway error:', err.message);
      setError("Kết nối chậm hoặc máy chủ bận. Hãy thử làm mới sau.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGoldPrice();
  }, [fetchGoldPrice]);

  useEffect(() => {
    const loadVnGold = async () => {
      try {
        const res = await fetch('/api/vn/gold', { cache: 'no-store' });
        const json = await res.json();
        if (json.ok) {
          setVnGold(json.data);
          setVnGoldError(null);
        } else {
          setVnGold(null);
          setVnGoldError(json.error || 'Không tải được giá vàng Việt Nam');
        }
      } catch (err) {
        setVnGold(null);
        setVnGoldError('Không tải được giá vàng Việt Nam');
      }
    };
    loadVnGold();
  }, []);

  const fxRatesForExplorer = useMemo(() => (usdToVnd ? { VND: usdToVnd } : null), [usdToVnd]);

  const goldUnits = units.gold.conversions;

  const vnGoldPriceMap = useMemo(() => {
    if (!vnGold?.items) return null;
    const map = {};
    vnGold.items.forEach((item) => {
      const brand = (item.brand || '').toLowerCase();
      if (brand.includes('sjc')) map.vn_sjc = item.sell;
      if (brand.includes('pnj')) map.vn_pnj = item.sell;
      if (brand.includes('doji')) map.vn_doji = item.sell;
      if (brand.includes('minh châu') || brand.includes('minh chau') || brand.includes('btmc')) map.vn_btmc = item.sell;
      if (brand.includes('bảo tín') || brand.includes('bao tin')) map.vn_baotin = item.sell;
    });
    return map;
  }, [vnGold]);

  const unitOptions = Object.entries(goldUnits).map(([key, unit]) => ({
    value: key,
    label: `${unit.icon || '✨'} ${unit.label} (${unit.unit})`,
  }));

  const goldTableData = useMemo(() => {
    if (!referenceData?.xauUsd) return null;
    const ounce = referenceData.xauUsd;
    const gram = ounce / OZ_TO_GRAM;
    const chi = gram * GRAM_PER_CHI;
    const cay = gram * GRAM_PER_LUONG;
    return { ounce, gram, chi, cay };
  }, [referenceData]);

  const handleConvert = async ({ amount, from, to, data }) => {
    const xauUsd = referenceData?.xauUsd;

    const isCurrency = (u) => u === 'usd' || u === 'vnd';
    const isWeight = (u) => ['troy_oz', 'gram', 'chi', 'cay', 'luong'].includes(u);
    const isVnPrice = (u) => u.startsWith('vn_');

    const weightToOz = (val, unit) => {
      switch (unit) {
        case 'troy_oz':
          return val;
        case 'gram':
          return val / OZ_TO_GRAM;
        case 'chi':
          return (val * GRAM_PER_CHI) / OZ_TO_GRAM;
        case 'cay':
        case 'luong':
          return (val * GRAM_PER_LUONG) / OZ_TO_GRAM;
        default:
          return null;
      }
    };

    const ozToUnit = (oz, unit) => {
      switch (unit) {
        case 'troy_oz':
          return oz;
        case 'gram':
          return oz * OZ_TO_GRAM;
        case 'chi':
          return (oz * OZ_TO_GRAM) / GRAM_PER_CHI;
        case 'cay':
        case 'luong':
          return (oz * OZ_TO_GRAM) / GRAM_PER_LUONG;
        default:
          return null;
      }
    };

    const priceVndPerLuong = (unit) => {
      if (!unit) return null;
      if (vnGoldPriceMap && vnGoldPriceMap[unit]) return vnGoldPriceMap[unit];
      return goldUnits[unit]?.priceVnd || null;
    };

    if (from === to) return amount;

    if ((from === 'vnd' || to === 'vnd') && !usdToVnd) {
      throw new Error('Cần tỷ giá USD/VND. Thử lại FX.');
    }

    // Currency <-> Currency
    if (isCurrency(from) && isCurrency(to)) {
      return from === 'usd' ? amount * usdToVnd : amount / usdToVnd;
    }

    // Weight <-> Weight
    if (isWeight(from) && isWeight(to)) {
      const oz = weightToOz(amount, from);
      if (oz === null) throw new Error('Đơn vị nguồn không hợp lệ');
      const result = ozToUnit(oz, to);
      if (result === null) throw new Error('Đơn vị đích không hợp lệ');
      return result;
    }

    // Currency -> Weight (world gold)
    if (isCurrency(from) && isWeight(to)) {
      if (!xauUsd) throw new Error('Cần giá XAU/USD');
      const amountUsd = from === 'usd' ? amount : amount / usdToVnd;
      const oz = amountUsd / xauUsd;
      return ozToUnit(oz, to);
    }

    // Weight -> Currency (world gold)
    if (isWeight(from) && isCurrency(to)) {
      if (!xauUsd) throw new Error('Cần giá XAU/USD');
      const oz = weightToOz(amount, from);
      const usd = oz * xauUsd;
      return to === 'usd' ? usd : usd * usdToVnd;
    }

    // VN price -> Currency / Weight / VN price
    if (isVnPrice(from)) {
      const priceFrom = priceVndPerLuong(from);
      if (!priceFrom) throw new Error('Thiếu giá vàng VN');

      if (isCurrency(to)) {
        const totalVnd = amount * priceFrom;
        return to === 'usd' ? totalVnd / usdToVnd : totalVnd;
      }

      if (isWeight(to)) {
        if (!xauUsd) throw new Error('Cần giá XAU/USD');
        const totalVnd = amount * priceFrom;
        const oz = (totalVnd / usdToVnd) / xauUsd;
        return ozToUnit(oz, to);
      }

      if (isVnPrice(to)) {
        const priceTo = priceVndPerLuong(to);
        if (!priceTo) throw new Error('Thiếu giá vàng VN');
        const totalVnd = amount * priceFrom;
        return totalVnd / priceTo;
      }
    }

    // Currency / Weight -> VN price
    if (isVnPrice(to)) {
      const priceTo = priceVndPerLuong(to);
      if (!priceTo) throw new Error('Thiếu giá vàng VN');

      if (isCurrency(from)) {
        const totalVnd = from === 'usd' ? amount * usdToVnd : amount;
        return totalVnd / priceTo;
      }

      if (isWeight(from)) {
        if (!xauUsd) throw new Error('Cần giá XAU/USD');
        const oz = weightToOz(amount, from);
        const usd = oz * xauUsd;
        const totalVnd = usd * usdToVnd;
        return totalVnd / priceTo;
      }
    }

    throw new Error('Không thể chuyển đổi giữa các đơn vị này');
  };

  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center justify-end max-w-5xl mx-auto px-4">
        <span className="text-sm text-gray-500">Vàng (XAU/USD) • Ounce Troy</span>
      </div>

      {/* Hero Section - Light Theme */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="relative rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg py-8 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
          <div className="relative space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80 font-semibold">Gold • XAU</p>
            <h1 className="text-3xl md:text-4xl font-bold drop-shadow-sm">
              Giá vàng quốc tế & quy đổi đơn vị
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              XAU/USD từ thị trường thế giới. Chuyển đổi ounce, gram, chỉ, cây — chuẩn cho người Việt.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-[11px] font-semibold text-white/70 pt-1">
              <span className="px-3 py-1 rounded-full bg-white/20">Cập nhật: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Đang tải...'}</span>
              <span className="px-3 py-1 rounded-full bg-white/15">Mỗi 120 phút</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <ValueExplorer
          context="gold"
          referenceData={referenceData}
          fxRate={usdToVnd}
          fxOk={!fxError}
          fxLoading={fxLoading}
          fxError={fxError}
          onRetryFx={refetchFx}
          onResult={setExplorerResult}
        />
      </div>

      {/* Gold Price Chart with Type Selector */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🪙</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Biểu đồ giá vàng</h3>
                <p className="text-sm text-gray-600">Lịch sử giá theo thời gian</p>
              </div>
            </div>
          </div>

          {/* Gold Type Selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { type: 'xau', label: 'XAU/USD (World)', color: '#eab308' },
              { type: 'sjc', label: 'Vàng SJC', color: '#f59e0b' },
              { type: 'pnj', label: 'Vàng PNJ', color: '#fbbf24' },
              { type: 'btmc', label: 'BTMC', color: '#fcd34d' },
              { type: 'doji', label: 'Doji', color: '#fde68a' },
            ].map(({ type, label }) => {
              const isActive = selectedGoldType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedGoldType(type)}
                  className={`
                    px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all
                    ${isActive 
                      ? 'bg-yellow-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {selectedGoldType === 'xau' ? (
            <ChartSection
              title="XAU/USD"
              subtitle="Giá vàng thế giới (USD per troy ounce)"
              apiEndpoint="/api/gold/historical"
              color="#eab308"
              yAxisLabel="USD per oz"
              icon="📈"
            />
          ) : (
            <ChartSection
              title={`Vàng ${selectedGoldType.toUpperCase()}`}
              subtitle="Giá vàng Việt Nam (VND per lượng)"
              apiEndpoint="/api/vn-gold/historical"
              queryParams={{ brand: selectedGoldType }}
              color="#f59e0b"
              yAxisLabel="VND per lượng"
              icon="📈"
            />
          )}
        </div>
      </div>

      {/* Chuyển đổi chi tiết - Always Open */}
      <div className="glass-panel rounded-2xl border border-amber-100 max-w-5xl mx-auto p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🔄</span>
            <span>Chuyển đổi chi tiết</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">Converter</span>
          </h3>
        </div>
        <ConverterForm
          mode="gold"
          fromOptions={unitOptions}
          toOptions={unitOptions}
          referenceData={referenceData}
          lastUpdated={lastUpdated}
          onConvert={handleConvert}
          disclaimerText="Giá vàng được cập nhật mỗi 120 phút. Đối chiếu lại tại cửa hàng/nhà vàng khi giao dịch."
        />
      </div>

      <AffiliateOptions
        category="gold"
        resultsReady={true}
      />

      {/* Vietnam Gold Prices Section */}
      <div className="px-4">
        <VnGoldSection 
          vnGold={vnGold}
          vnGoldError={vnGoldError}
          xauUsd={referenceData?.xauUsd}
          usdToVnd={usdToVnd}
          alwaysOpen={true}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <PriceCard
          title="Giá vàng (XAU / USD)"
          price={referenceData?.xauUsd || 0}
          unit="USD mỗi ounce troy"
          loading={!referenceData}
          prefix="$"
          decimals={2}
          tone="amber"
        />
        <PriceCard
          title="Giá 1 oz → VND"
          price={referenceData?.xauUsd && usdToVnd ? referenceData.xauUsd * usdToVnd : 0}
          unit="Quy đổi tham khảo"
          loading={!referenceData || !usdToVnd}
          prefix="₫"
          decimals={0}
          tone="green"
          locale="vi-VN"
        />
        <PriceCard
          title="Giá 1 gram (USD)"
          price={referenceData?.xauUsd ? referenceData.xauUsd / 31.1035 : 0}
          unit="USD mỗi gram"
          loading={!referenceData}
          prefix="$"
          decimals={2}
          tone="gray"
        />
      </div>

      <RefreshBar
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={fetchGoldPrice}
        refreshIntervalMs={REFRESH_INTERVAL_MS}
        showButton={true}
      />

      {error && <ErrorBanner message={error} />}
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

      <CollapsibleSection title="Bảng giá chi tiết" badge="USD & quy đổi">
        <PriceTable
          data={goldTableData}
          title="Quy đổi vàng theo đơn vị"
          currencyPrefix="$"
          valueFormatter={(v) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(v)}
          renderLabel={(key) => {
            const labels = { ounce: '🪙 Ounce troy', gram: '⚖️ Gram', chi: '💍 Chỉ', cay: '🏅 Cây' };
            return labels[key] || key;
          }}
        />
      </CollapsibleSection>

      <div className="glass-panel p-6 rounded-2xl max-w-5xl mx-auto border border-amber-100" id="explanations">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Bảng quy đổi đơn vị</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-800">
          <div className="p-3 rounded-xl bg-white/80 border border-amber-100">
            <p className="font-semibold mb-1">Ounce Troy</p>
            <p>Đơn vị quốc tế cho kim loại quý. 1 oz = 31,1035 gram.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-amber-100">
            <p className="font-semibold mb-1">Gram</p>
            <p>Phổ biến cho trang sức, tính nhanh khối lượng nhỏ.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-amber-100">
            <p className="font-semibold mb-1">Chỉ (VN)</p>
            <p>Đơn vị truyền thống tại Việt Nam (≈ 3,75g). 10 chỉ = 1 cây.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-amber-100">
            <p className="font-semibold mb-1">Cây</p>
            <p>Dùng cho giao dịch lớn. 1 cây = 10 chỉ.</p>
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
