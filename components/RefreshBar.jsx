"use client";

import { useEffect, useMemo, useState } from "react";

const formatDuration = (ms) => {
  if (!Number.isFinite(ms) || ms < 0) return "–";
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export default function RefreshBar({ lastUpdated, onRefresh, refreshing = false, refreshIntervalMs = 2 * 60 * 60 * 1000, showButton = true }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const nextRefreshIn = useMemo(() => {
    if (!lastUpdated) return null;
    const last = new Date(lastUpdated).getTime();
    if (Number.isNaN(last)) return null;
    const nextAt = last + refreshIntervalMs;
    return Math.max(nextAt - now, 0);
  }, [lastUpdated, now, refreshIntervalMs]);

  const displayLast = useMemo(() => {
    if (!lastUpdated) return "Chưa có dữ liệu";
    const d = new Date(lastUpdated);
    if (Number.isNaN(d.getTime())) return "Chưa có dữ liệu";
    return d.toLocaleString();
  }, [lastUpdated]);

  return (
    <div className="glass-panel rounded-2xl p-4 max-w-5xl mx-auto border border-blue-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="text-sm text-gray-700">
        <div className="font-semibold text-gray-900">Lần cập nhật gần nhất: {displayLast}</div>
        <div className="text-gray-600 text-xs">
          Làm mới mỗi {Math.round(refreshIntervalMs / 60000)} phút • Còn lại: {nextRefreshIn ? formatDuration(nextRefreshIn) : "–"}
        </div>
      </div>
      {showButton && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-50 transition disabled:opacity-60"
        >
          {refreshing ? "Đang làm mới..." : "Làm mới ngay"}
        </button>
      )}
    </div>
  );
}
