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
import VnFuelSection from "@/components/VnFuelSection";
import ChartSection from "@/components/ChartSection";
import vnPrices from "@/data/vn-prices.json";

const units = vnPrices.units;
import PriceTable from "@/components/PriceTable";
import CollapsibleSection from "@/components/CollapsibleSection";
import { useUsdToVnd } from "@/lib/hooks/useUsdToVnd";

export default function OilPageClient() {
  const [referenceData, setReferenceData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [oilType, setOilType] = useState("brent");
  const [error, setError] = useState(null);
  const [dataStatus, setDataStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [explorerResult, setExplorerResult] = useState(null);
  const [vnFuel, setVnFuel] = useState(null);
  const [vnFuelError, setVnFuelError] = useState(null);
  const [selectedFuelType, setSelectedFuelType] = useState('brent'); // New state for chart
  const [gatewayFxRate, setGatewayFxRate] = useState(null);
  const [gatewayOil, setGatewayOil] = useState(null);

  const { usdToVnd, fxError, fxLoading, refetchFx } = useUsdToVnd({
    prefetchedRate: gatewayFxRate,
    disableFetch: true,
  });

  const REFRESH_INTERVAL_MS = 120 * 60 * 1000;

  const fetchOilPrice = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/prices/latest', { cache: 'no-store' });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Gateway error');

      const fx = json?.data?.fx || {};
      const rates = fx?.rates || fx;
      const oil = json?.data?.oil || {};

      setGatewayFxRate(rates?.VND || null);
      setGatewayOil(oil);

      const price = oilType === 'wti' ? oil?.wti : oil?.brent;
      setReferenceData(price ? { price } : null);
      setLastUpdated(json.updatedAt || json?.sources?.oil?.updatedAt || null);
      setDataStatus(json.status || null);
      setError(json.status === 'stale' ? 'Dữ liệu từ cache (stale).' : json.status === 'estimated' ? 'Một phần dữ liệu đang dùng nguồn ước tính/fallback.' : null);
    } catch {
      setError("Kết nối chậm hoặc máy chủ bận. Hãy thử làm mới sau.");
    } finally {
      setRefreshing(false);
    }
  }, [oilType]);

  useEffect(() => {
    fetchOilPrice();
  }, [fetchOilPrice]);

  useEffect(() => {
    const loadVnFuel = async () => {
      try {
        const res = await fetch('/api/vn/fuel', { cache: 'no-store' });
        const json = await res.json();
        if (json.ok) {
          setVnFuel(json.data);
          setVnFuelError(null);
        } else {
          setVnFuel(null);
          setVnFuelError(json.error || 'Không tải được giá xăng VN');
        }
      } catch {
        setVnFuel(null);
        setVnFuelError('Không tải được giá xăng VN');
      }
    };
    loadVnFuel();
  }, []);

  const fxRatesForExplorer = useMemo(() => (usdToVnd ? { VND: usdToVnd } : null), [usdToVnd]);

  const oilUnits = units.oil.conversions;
  const litersPerBarrel = units.oil.barrel_to_liter;

  const vnFuelPriceMap = useMemo(() => {
    if (!vnFuel?.items) return null;
    const map = {};
    vnFuel.items.forEach((item) => {
      const code = (item.code || '').toLowerCase();
      if (code.includes('e5')) map.vn_e5 = item.region1;
      if (code.includes('ron95')) map.vn_ron95 = item.region1;
      if (code.includes('do') || code.includes('diesel')) map.vn_do = item.region1;
    });
    return map;
  }, [vnFuel]);

  const oilTableData = useMemo(() => {
    if (!referenceData?.price) return null;
    const barrel = referenceData.price;
    const liter = barrel / litersPerBarrel;
    const gallon = barrel / oilUnits.gallon_us.fromBarrel;
    return { barrel, liter, gallon };
  }, [referenceData, litersPerBarrel, oilUnits]);

  const oilTypeOptions = [
    { value: "brent", label: "Brent Crude" },
    { value: "wti", label: "WTI Crude" },
  ];

  const unitOptions = Object.entries(oilUnits).map(([key, unit]) => ({
    value: key,
    label: `${key.startsWith('vn_') ? '🇻🇳' : key === 'barrel' ? '🛢️' : key === 'liter' ? '🧴' : '⛽'} ${unit.label} (${unit.unit})`,
  }));

  const handleConvert = async ({ amount, from, to, data }) => {
    const isCurrency = (u) => u === 'usd' || u === 'vnd';
    const isVolume = (u) => ['barrel', 'liter', 'gallon_us'].includes(u);
    const isVnFuel = (u) => u.startsWith('vn_');

    const toLiters = (val, unit) => {
      switch (unit) {
        case 'liter':
          return val;
        case 'barrel':
          return val * litersPerBarrel;
        case 'gallon_us':
          return val * (litersPerBarrel / 42);
        default:
          return isVnFuel(unit) ? val : null; // treat VN fuel amount as liters
      }
    };

    const fromLiters = (liters, unit) => {
      switch (unit) {
        case 'liter':
          return liters;
        case 'barrel':
          return liters / litersPerBarrel;
        case 'gallon_us':
          return liters / (litersPerBarrel / 42);
        default:
          return isVnFuel(unit) ? liters : null;
      }
    };

    const priceVndPerLiter = (unit) => {
      if (!unit) return null;
      if (vnFuelPriceMap && vnFuelPriceMap[unit]) return vnFuelPriceMap[unit];
      return oilUnits[unit]?.priceVnd || null;
    };

    if (from === to) return amount;

    if ((from === 'vnd' || to === 'vnd') && !usdToVnd) {
      throw new Error('Cần tỷ giá USD/VND. Thử lại FX.');
    }

    // Currency <-> Currency
    if (isCurrency(from) && isCurrency(to)) {
      return from === 'usd' ? amount * usdToVnd : amount / usdToVnd;
    }

    // Volume <-> Volume (world units)
    if (isVolume(from) && isVolume(to)) {
      const liters = toLiters(amount, from);
      const result = fromLiters(liters, to);
      if (result === null) throw new Error('Đơn vị không hợp lệ');
      return result;
    }

    // Currency -> Volume using world oil price
    if (isCurrency(from) && isVolume(to)) {
      if (!referenceData?.price) throw new Error('Cần giá dầu quốc tế');
      const usdAmount = from === 'usd' ? amount : amount / usdToVnd;
      const barrels = usdAmount / referenceData.price;
      const liters = barrels * litersPerBarrel;
      return fromLiters(liters, to);
    }

    // Volume -> Currency using world oil price
    if (isVolume(from) && isCurrency(to)) {
      if (!referenceData?.price) throw new Error('Cần giá dầu quốc tế');
      const liters = toLiters(amount, from);
      const barrels = liters / litersPerBarrel;
      const usd = barrels * referenceData.price;
      return to === 'usd' ? usd : usd * usdToVnd;
    }

    // VN fuel (price per liter) conversions
    if (isVnFuel(from)) {
      const priceFrom = priceVndPerLiter(from);
      if (!priceFrom) throw new Error('Thiếu giá xăng/dầu VN');
      const liters = toLiters(amount, from); // amount interpreted as liters

      if (isCurrency(to)) {
        const totalVnd = liters * priceFrom;
        return to === 'usd' ? totalVnd / usdToVnd : totalVnd;
      }

      if (isVolume(to)) {
        return fromLiters(liters, to);
      }

      if (isVnFuel(to)) {
        const priceTo = priceVndPerLiter(to);
        if (!priceTo) throw new Error('Thiếu giá xăng/dầu VN');
        const totalVnd = liters * priceFrom;
        return totalVnd / priceTo; // liters của loại đích
      }
    }

    if (isVnFuel(to)) {
      const priceTo = priceVndPerLiter(to);
      if (!priceTo) throw new Error('Thiếu giá xăng/dầu VN');

      if (isCurrency(from)) {
        const totalVnd = from === 'usd' ? amount * usdToVnd : amount;
        return totalVnd / priceTo; // liters mua được
      }

      if (isVolume(from)) {
        const liters = toLiters(amount, from);
        return liters; // chuyển đổi thể tích trực tiếp
      }

      if (isVnFuel(from)) {
        const priceFrom = priceVndPerLiter(from);
        const totalVnd = amount * priceFrom;
        return totalVnd / priceTo;
      }
    }

    throw new Error('Không thể chuyển đổi giữa các đơn vị này');
  };

  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center justify-end max-w-5xl mx-auto px-4">
        <span className="text-sm text-gray-500">Dầu Brent & WTI • USD/thùng</span>
      </div>

      {/* Hero Section - Light Theme */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="relative rounded-2xl bg-gradient-to-r from-slate-600 to-gray-600 text-white shadow-lg py-8 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
          <div className="relative space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80 font-semibold">Oil • Energy</p>
            <h1 className="text-3xl md:text-4xl font-bold drop-shadow-sm">
              Giá dầu Brent & WTI trực tuyến
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Dầu thô quốc tế real-time. Quy đổi thùng, lít, gallon — đơn giản, nhanh chóng.
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
          context="oil"
          referenceData={referenceData}
          fxRate={usdToVnd}
          fxOk={!fxError}
          fxLoading={fxLoading}
          fxError={fxError}
          onRetryFx={refetchFx}
          onResult={setExplorerResult}
        />
      </div>

      {/* Oil/Fuel Price Chart with Type Selector */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛢️</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Biểu đồ giá dầu & xăng</h3>
                <p className="text-sm text-gray-600">Lịch sử giá theo thời gian</p>
              </div>
            </div>
          </div>

          {/* Fuel Type Selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { type: 'brent', label: 'Brent Crude', color: '#f97316' },
              { type: 'wti', label: 'WTI Crude', color: '#fb923c' },
              { type: 'E5 RON92', label: 'Xăng E5 RON92', color: '#fdba74' },
              { type: 'RON95-III', label: 'Xăng RON95', color: '#fed7aa' },
              { type: 'DO 0.05S', label: 'Dầu Diesel', color: '#ffedd5' },
            ].map(({ type, label }) => {
              const isActive = selectedFuelType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedFuelType(type)}
                  className={`
                    px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all
                    ${isActive 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {(selectedFuelType === 'brent' || selectedFuelType === 'wti') ? (
            <ChartSection
              title={selectedFuelType === 'brent' ? 'Brent Crude Oil' : 'WTI Crude Oil'}
              subtitle="Giá dầu thô thế giới (USD per barrel)"
              apiEndpoint="/api/oil/historical"
              queryParams={{ type: selectedFuelType }}
              color="#f97316"
              yAxisLabel="USD per barrel"
              icon="📈"
            />
          ) : (
            <ChartSection
              title={selectedFuelType}
              subtitle="Giá xăng dầu Việt Nam (VND per liter)"
              apiEndpoint="/api/vn-fuel/historical"
              queryParams={{ fuel: selectedFuelType }}
              color="#fb923c"
              yAxisLabel="VND per liter"
              icon="📈"
            />
          )}
        </div>
      </div>

      {/* Chuyển đổi chi tiết - Always Open */}
      <div className="glass-panel rounded-2xl border border-orange-100 max-w-5xl mx-auto p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🔄</span>
            <span>Chuyển đổi chi tiết</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">Converter</span>
          </h3>
        </div>
        <ConverterForm
          mode="oil"
          fromOptions={unitOptions}
          toOptions={unitOptions}
          referenceData={referenceData}
          lastUpdated={lastUpdated}
          dataStatus={dataStatus}
          onConvert={handleConvert}
          disclaimerText="Giá dầu cập nhật mỗi 120 phút. Đối chiếu với nhà cung cấp khi giao dịch."
        />
      </div>

      <AffiliateOptions
        category="fuel"
        resultsReady={true}
      />

      {/* Vietnam Fuel Prices Section */}
      <div className="px-4">
        <VnFuelSection 
          vnFuel={vnFuel}
          vnFuelError={vnFuelError}
          usdToVnd={usdToVnd}
          alwaysOpen={true}
        />
      </div>

      <div className="max-w-md mx-auto mb-2 glass-panel rounded-2xl p-4 border border-orange-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn loại dầu</label>
        <select
          value={oilType}
          onChange={(e) => setOilType(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {oilTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto" id="price-table">
        <PriceCard
          title={`${oilType.toUpperCase()} giá mỗi thùng`}
          price={referenceData?.price || 0}
          unit="USD/thùng"
          loading={!referenceData}
          prefix="$"
          decimals={2}
          tone="gray"
        />
        <PriceCard
          title="Giá mỗi lít"
          price={referenceData?.price ? referenceData.price / litersPerBarrel : 0}
          unit="USD/L"
          loading={!referenceData}
          prefix="$"
          decimals={3}
          tone="blue"
        />
        <PriceCard
          title="Giá thùng → VND"
          price={referenceData?.price && usdToVnd ? referenceData.price * usdToVnd : 0}
          unit="Quy đổi tham khảo"
          loading={!referenceData || !usdToVnd}
          prefix="₫"
          decimals={0}
          tone="green"
          locale="vi-VN"
        />
      </div>

      <RefreshBar
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={fetchOilPrice}
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
          data={oilTableData}
          title="Giá dầu theo đơn vị"
          currencyPrefix="$"
          valueFormatter={(v) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(v)}
          renderLabel={(key) => {
            const labels = { barrel: '🛢️ Thùng (bbl)', liter: '🧴 Lít', gallon: '⛽ Gallon (US)' };
            return labels[key] || key;
          }}
        />
      </CollapsibleSection>

      <div className="glass-panel p-6 rounded-2xl max-w-5xl mx-auto border border-orange-100" id="explanations">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Sự khác biệt giữa Brent & WTI</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-800">
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold mb-1">Brent</p>
            <p>Hỗn hợp Biển Bắc, chuẩn tham chiếu toàn cầu cho xuất khẩu.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold mb-1">WTI</p>
            <p>Tiêu chuẩn Mỹ, giao dịch trên NYMEX, phản ánh thị trường nội địa.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl max-w-5xl mx-auto border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Quy đổi đơn vị nhanh</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-800">
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold mb-1">Thùng (bbl)</p>
            <p>Đơn vị chuẩn cho dầu thô, tương đương 42 gallon Mỹ.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold mb-1">Lít</p>
            <p>1 thùng ≈ 158,987 lít. Phù hợp cho tính toán vận tải.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold mb-1">Gallon (US)</p>
            <p>1 thùng = 42 gallon. Dùng phổ biến tại Mỹ.</p>
          </div>
        </div>
      </div>

      <Disclaimer />

    </div>
  );
}
