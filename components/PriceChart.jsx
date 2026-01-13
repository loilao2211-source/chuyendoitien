/**
 * PriceChart Component
 * Professional price chart using Chart.js with gradient fills
 */

"use client";

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PriceChart({
  title,
  data = [],
  loading = false,
  error = null,
  yAxisLabel = 'Price (USD)',
  color = '#6366f1', // indigo-500
}) {
  const chartRef = useRef(null);

  // Transform data for Chart.js
  const chartData = {
    labels: data.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: title,
        data: data.map((d) => d.price || d.rate || d.value || 0),
        borderColor: color,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, `${color}40`); // 25% opacity
          gradient.addColorStop(1, `${color}00`); // 0% opacity
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13,
          weight: '600',
        },
        bodyFont: {
          size: 14,
          weight: '700',
        },
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            
            // IMPORTANT: Tooltip shows FULL number, no abbreviation
            // This prevents confusion with "24k" showing instead of "26,174.44"
            if (value >= 1000) {
              return value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            } else {
              return value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              });
            }
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          maxTicksLimit: 8,
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: (value) => {
            // Y-axis can use compact notation (24.5k) for space efficiency
            // Tooltip will still show full number (24,567.89)
            return value.toLocaleString('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
              maximumFractionDigits: 1,
            });
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-sm text-gray-600">
              Biểu đồ tạm thời chưa có dữ liệu lịch sử
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}
