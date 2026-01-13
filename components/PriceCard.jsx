'use client';

const formatNumber = (value, decimals, locale = 'en-US') => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export default function PriceCard({
  title,
  price,
  unit,
  loading = false,
  prefix = '',
  decimals = 2,
  tone = 'blue',
  locale = 'en-US',
}) {
  const tones = {
    blue: 'from-blue-50 to-blue-100 text-blue-800 border-blue-100',
    green: 'from-emerald-50 to-green-100 text-emerald-800 border-emerald-100',
    amber: 'from-amber-50 to-yellow-100 text-amber-800 border-amber-100',
    gray: 'from-slate-50 to-gray-100 text-gray-800 border-gray-100',
  };

  const toneClass = tones[tone] || tones.blue;

  return (
    <div className={`glass-panel rounded-2xl p-6 text-center border ${toneClass} max-w-xl mx-auto`}>
      <div className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">{unit}</div>
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      {loading ? (
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <p className="text-5xl font-extrabold tracking-tight text-gray-900">
          {prefix}
          {formatNumber(price, decimals, locale)}
        </p>
      )}
    </div>
  );
}
