'use client';

import React, { useMemo, useState } from 'react';

export default function DataTable({ columns = [], rows = [], loading = false, initialRows = 15, emptyMessage = 'No data', title }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState(columns[1]?.key || columns[0]?.key || null);
  const [sortDir, setSortDir] = useState('desc');
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)));
  }, [rows, query]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const sortedRows = [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return sortedRows;
  }, [filtered, sortKey, sortDir]);

  const visible = showAll ? sorted : sorted.slice(0, initialRows);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-gray-100 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3">
        <div className="flex items-center gap-2">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          <span className="text-xs text-gray-500">Tự động cập nhật</span>
        </div>
        <input
          type="search"
          placeholder="Tìm kiếm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-64 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wide">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-2 px-3 font-semibold cursor-pointer select-none ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                  onClick={() => toggleSort(col.key)}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span>{col.label}</span>
                    {sortKey === col.key && <span>{sortDir === 'asc' ? '▲' : '▼'}</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && [...Array(6)].map((_, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 px-3 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                    <div className="h-4 bg-gray-100 animate-pulse rounded" />
                  </td>
                ))}
              </tr>
            ))}

            {!loading && visible.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-white/70">
                {columns.map((col) => (
                  <td key={col.key} className={`py-2 px-3 ${col.align === 'right' ? 'text-right' : 'text-left'} text-gray-900 font-medium`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length === 0 && (
        <p className="text-sm text-gray-500 mt-3">{emptyMessage}</p>
      )}

      {filtered.length > initialRows && (
        <div className="flex justify-center mt-3">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            {showAll ? 'Thu gọn' : 'Xem tất cả'}
          </button>
        </div>
      )}
    </div>
  );
}
