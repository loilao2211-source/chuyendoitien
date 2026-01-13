/**
 * RangeSelector Component
 * Time range selector buttons for charts (7D, 30D, 90D, 1Y)
 */

"use client";

export default function RangeSelector({ selected, onChange, ranges = [7, 30, 90, 365] }) {
  const rangeLabels = {
    7: '7D',
    30: '30D',
    90: '90D',
    365: '1Y',
  };

  return (
    <div className="flex gap-2">
      {ranges.map((days) => (
        <button
          key={days}
          onClick={() => onChange(days)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors
            ${selected === days
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {rangeLabels[days] || `${days}D`}
        </button>
      ))}
    </div>
  );
}
