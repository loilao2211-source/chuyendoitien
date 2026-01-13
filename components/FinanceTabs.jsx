'use client';

import { useEffect, useMemo, useState } from 'react';
import MiniValueExplorer from './MiniValueExplorer';
import DataTable from './DataTable';
import TransferOptions from './TransferOptions';
import RefreshBar from './RefreshBar';
import ErrorBanner from './ErrorBanner';
import PriceCard from './PriceCard';
import { flagForCurrency } from '@/lib/flags';
import currencies from '@/data/currencies.json';
import cryptoCoins from '@/data/cryptoCoins.json';
import { fetchRates } from '@/services/fxService';

const fxSymbols = currencies.filter((c) => c.code !== 'USD').map((c) => c.code).join(',');

const formatNumber = (v, opts = {}) => {
  const { min = 2, max = 2, locale = 'en-US' } = opts;
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return new Intl.NumberFormat(locale, { minimumFractionDigits: min, maximumFractionDigits: max }).format(v);
};

export default function FinanceTabs() {
  const [active, setActive] = useState('fx');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const [result, setResult] = useState(null);

  const tabs = useMemo(() => ([
    { key: 'fx', label: 'FX', refreshMs: 30 * 60 * 1000 },
    { key: 'crypto', label: 'Crypto', refreshMs: 60 * 60 * 1000 },
    { key: 'gold', label: 'Gold Spot', refreshMs: 120 * 60 * 1000 },
    { key: 'oil', label: 'Oil Spot', refreshMs: 120 * 60 * 1000 },
  ]), []);

  const load = async (key) => {
    setLoading((s) => ({ ...s, [key]: true }));
    setError((s) => ({ ...s, [key]: null }));
    try {
      let res, json;
      if (key === 'fx') {
        // Use unified fxService
        const symbols = currencies.filter((c) => c.code !== 'USD').map((c) => c.code);
        const { rates, updatedAt } = await fetchRates('USD', symbols);
        setData((s) => ({ ...s, fx: { referenceData: rates, lastUpdated: updatedAt } }));
      } else if (key === 'crypto') {
        const ids = cryptoCoins.map((c) => c.id).join(',');
        res = await fetch(`/api/crypto?vs=usd&ids=${ids}`);
        json = await res.json();
        if (json.ok) {
          setData((s) => ({ ...s, crypto: { referenceData: json.data.prices, lastUpdated: json.lastUpdated } }));
        } else {
          throw new Error('Không tải được giá crypto.');
        }
      } else if (key === 'gold') {
        res = await fetch('/api/gold?quote=USD');
        json = await res.json();
        if (json.ok) {
          setData((s) => ({ ...s, gold: { referenceData: { xauUsd: json.data.xauUsd }, lastUpdated: json.lastUpdated } }));
        } else {
          throw new Error('Không tải được giá vàng.');
        }
      } else if (key === 'oil') {
        res = await fetch('/api/oil?type=brent');
        json = await res.json();
        if (json.ok) {
          setData((s) => ({ ...s, oil: { referenceData: { price: json.data.price }, lastUpdated: json.lastUpdated } }));
        } else {
          throw new Error('Không tải được giá dầu.');
        }
      }
    } catch (err) {
      setError((s) => ({ ...s, [key]: err.message || 'Lỗi tải dữ liệu' }));
    } finally {
      setLoading((s) => ({ ...s, [key]: false }));
    }
  };

  useEffect(() => {
    load(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const renderTable = () => {
    if (active === 'fx') {
      const referenceData = data.fx?.referenceData || {};
      const rows = Object.entries(referenceData).map(([code, rate]) => ({
        code,
        rate,
        label: `${flagForCurrency(code)} ${code}`.trim(),
      }));
      return (
        <DataTable
          title="Tỷ giá (USD làm gốc)"
          loading={!!loading.fx && !rows.length}
          rows={rows}
          columns={[
            { key: 'label', label: 'Mã', sortable: true },
            { key: 'rate', label: 'Giá', align: 'right', sortable: true, render: (v) => formatNumber(v, { min: v >= 100 ? 2 : 4, max: 4 }) },
          ]}
          initialRows={15}
          emptyMessage="Chưa có tỷ giá"
        />
      );
    }
    if (active === 'crypto') {
      const referenceData = data.crypto?.referenceData || {};
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
      const rows = Object.entries(referenceData).map(([key, price]) => ({
        code: key,
        price,
        label: `${iconMap[key] || '⬡'} ${key.toUpperCase()}`,
      }));
      return (
        <DataTable
          title="Giá crypto (USD)"
          loading={!!loading.crypto && !rows.length}
          rows={rows}
          columns={[
            { key: 'label', label: 'Mã', sortable: true },
            { key: 'price', label: 'Giá', align: 'right', sortable: true, render: (v) => formatNumber(v, { max: 6 }) },
          ]}
          initialRows={15}
          emptyMessage="Chưa có giá crypto"
        />
      );
    }
    if (active === 'gold') {
      const ref = data.gold?.referenceData;
      const rows = ref?.xauUsd
        ? [
            { label: 'XAU / USD (oz)', value: ref.xauUsd },
            { label: 'Gram (USD)', value: ref.xauUsd / 31.1035 },
          ]
        : [];
      return (
        <DataTable
          title="Giá vàng spot"
          loading={!!loading.gold && !rows.length}
          rows={rows}
          columns={[
            { key: 'label', label: 'Chỉ số', sortable: true },
            { key: 'value', label: 'Giá', align: 'right', sortable: true, render: (v) => formatNumber(v, { max: 2 }) },
          ]}
          initialRows={15}
          emptyMessage="Chưa có giá vàng"
        />
      );
    }
    if (active === 'oil') {
      const ref = data.oil?.referenceData;
      const rows = ref?.price
        ? [
            { label: 'Brent (USD/thùng)', value: ref.price },
            { label: 'USD/Lít', value: ref.price / 158.987 },
          ]
        : [];
      return (
        <DataTable
          title="Giá dầu Brent"
          loading={!!loading.oil && !rows.length}
          rows={rows}
          columns={[
            { key: 'label', label: 'Chỉ số', sortable: true },
            { key: 'value', label: 'Giá', align: 'right', sortable: true, render: (v) => formatNumber(v, { max: 3 }) },
          ]}
          initialRows={15}
          emptyMessage="Chưa có giá dầu"
        />
      );
    }
    return null;
  };

  const featuredCards = () => {
    if (active === 'fx') {
      const ref = data.fx?.referenceData;
      return (
        <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <PriceCard title="1 USD → VND" price={ref?.VND || 0} unit="VND" loading={!ref} prefix="₫" decimals={0} tone="green" locale="vi-VN" />
          <PriceCard title="1 USD → EUR" price={ref?.EUR || 0} unit="EUR" loading={!ref} prefix="€" decimals={3} tone="blue" />
          <PriceCard title="1 USD → JPY" price={ref?.JPY || 0} unit="JPY" loading={!ref} prefix="¥" decimals={2} tone="gray" />
        </div>
      );
    }
    if (active === 'crypto') {
      const ref = data.crypto?.referenceData;
      return (
        <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <PriceCard title="Bitcoin" price={ref?.bitcoin || 0} unit="USD/BTC" loading={!ref} prefix="$" decimals={2} tone="blue" />
          <PriceCard title="Ethereum" price={ref?.ethereum || 0} unit="USD/ETH" loading={!ref} prefix="$" decimals={2} tone="green" />
          <PriceCard title="Solana" price={ref?.solana || 0} unit="USD/SOL" loading={!ref} prefix="$" decimals={2} tone="gray" />
        </div>
      );
    }
    if (active === 'gold') {
      const ref = data.gold?.referenceData;
      return (
        <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <PriceCard title="XAU / USD" price={ref?.xauUsd || 0} unit="USD/oz" loading={!ref} prefix="$" decimals={2} tone="amber" />
          <PriceCard title="Gram (USD)" price={ref?.xauUsd ? ref.xauUsd / 31.1035 : 0} unit="USD/gram" loading={!ref} prefix="$" decimals={2} tone="green" />
          <PriceCard title="XAU → VND" price={ref?.xauUsd && data.fx?.referenceData?.VND ? ref.xauUsd * data.fx.referenceData.VND : 0} unit="Tham khảo" loading={!ref || !data.fx?.referenceData} prefix="₫" decimals={0} tone="blue" locale="vi-VN" />
        </div>
      );
    }
    if (active === 'oil') {
      const ref = data.oil?.referenceData;
      return (
        <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <PriceCard title="Brent" price={ref?.price || 0} unit="USD/thùng" loading={!ref} prefix="$" decimals={2} tone="gray" />
          <PriceCard title="USD/Lít" price={ref?.price ? ref.price / 158.987 : 0} unit="USD/L" loading={!ref} prefix="$" decimals={3} tone="blue" />
          <PriceCard title="Thùng → VND" price={ref?.price && data.fx?.referenceData?.VND ? ref.price * data.fx.referenceData.VND : 0} unit="Tham khảo" loading={!ref || !data.fx?.referenceData} prefix="₫" decimals={0} tone="green" locale="vi-VN" />
        </div>
      );
    }
    return null;
  };

  const lastUpdated = data[active]?.lastUpdated;
  const refreshMs = tabs.find((t) => t.key === active)?.refreshMs;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${active === t.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <MiniValueExplorer
        context={active === 'fx' ? 'fx' : active}
        referenceData={data[active]?.referenceData}
        fxRates={data.fx?.referenceData}
        onResult={setResult}
      />

      <TransferOptions result={result} />

      {featuredCards()}

      <RefreshBar
        lastUpdated={lastUpdated}
        refreshing={!!loading[active]}
        onRefresh={() => load(active)}
        refreshIntervalMs={refreshMs}
        showButton={true}
      />

      {error[active] && <ErrorBanner message={error[active]} />}

      {renderTable()}
    </div>
  );
}
