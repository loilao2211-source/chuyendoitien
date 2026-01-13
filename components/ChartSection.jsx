/**
 * ChartSection - Reusable chart section with range selector
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import PriceChart from './PriceChart';
import RangeSelector from './RangeSelector';

export default function ChartSection({
  title = "Biểu đồ giá",
  subtitle = "Lịch sử giá theo thời gian",
  apiEndpoint,
  queryParams = {},
  color = '#6366f1',
  yAxisLabel = 'Price (USD)',
  icon = '📈',
  selector = null, // Optional: Custom selector component
  onSelectorChange = null, // Optional: Callback for selector changes
}) {
  const [chartRange, setChartRange] = useState(30);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);

  // Stringify queryParams to avoid infinite re-renders
  const queryParamsStr = JSON.stringify(queryParams);

  const fetchChartData = useCallback(async () => {
    setChartLoading(true);
    setChartError(null);

    try {
      const params = new URLSearchParams({
        ...(queryParamsStr && typeof queryParamsStr === 'string' ? JSON.parse(queryParamsStr) : {}),
        days: chartRange,
      });
      
      const res = await fetch(`${apiEndpoint}?${params}`);
      const json = await res.json();

      if (json.ok) {
        setChartData(json.data);
      } else {
        setChartError(json.error || 'Không tải được dữ liệu biểu đồ');
      }
    } catch (err) {
      console.error('[ChartSection] Fetch error:', err);
      setChartError('Lỗi kết nối khi tải biểu đồ');
    } finally {
      setChartLoading(false);
    }
  }, [apiEndpoint, chartRange, queryParamsStr]);

  useEffect(() => {
    if (apiEndpoint) {
      fetchChartData();
    }
  }, [fetchChartData, apiEndpoint]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        <RangeSelector
          selected={chartRange}
          onChange={setChartRange}
          ranges={[7, 30, 90, 365]}
        />
      </div>

      {selector && (
        <div className="mb-4">
          {selector}
        </div>
      )}

      <PriceChart
        title={title}
        data={chartData}
        loading={chartLoading}
        error={chartError}
        yAxisLabel={yAxisLabel}
        color={color}
      />
    </div>
  );
}
