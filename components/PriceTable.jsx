'use client';

import React, { useMemo, useState } from 'react';

const defaultFormatter = (val) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);

export default function PriceTable({
  data,
  title = 'Prices',
  valueFormatter = defaultFormatter,
  currencyPrefix = '',
  renderLabel,
  initialRows = 10,
}) {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const entries = useMemo(() => Object.entries(data), [data]);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return entries;
    const q = query.toLowerCase();
    return entries.filter(([code]) => code.toLowerCase().includes(q));
  }, [entries, query]);

  const visible = showAll ? filtered : filtered.slice(0, initialRows);

  return (
    <div className="glass-panel rounded-2xl p-6 max-w-3xl mx-auto mt-6" id="price-table">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="text-xs text-gray-500">Tự động cập nhật</span>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm mã"
          className="w-full sm:w-56 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left py-2 px-3 font-semibold">Mã</th>
              <th className="text-right py-2 px-3 font-semibold">Giá</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(([code, price]) => (
              <tr key={code} className="border-b border-gray-100 hover:bg-white/60 transition">
                <td className="py-2 px-3 font-medium text-gray-800">
                  {renderLabel ? renderLabel(code) : code.toUpperCase()}
                </td>
                <td className="text-right py-2 px-3 text-gray-900">
                  {typeof price === 'number'
                    ? `${currencyPrefix}${valueFormatter(price)}`
                    : JSON.stringify(price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > initialRows && (
        <div className="flex justify-center mt-3">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            {showAll ? 'Thu gọn bảng' : 'Xem bảng giá chi tiết'}
          </button>
        </div>
      )}
    </div>
  );
}
