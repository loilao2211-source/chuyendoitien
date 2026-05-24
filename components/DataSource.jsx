/**
 * DataSource Component
 * Trust signal for AI engines and users
 */

import Link from 'next/link';

export default function DataSource({ sources, methodology = true }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mt-8">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
        <span>📊</span> Nguồn dữ liệu tham chiếu
      </h3>
      <ul className="space-y-2 text-sm text-gray-700">
        {sources.map((source, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-indigo-600 flex-shrink-0">•</span>
            <span>{source}</span>
          </li>
        ))}
      </ul>
      {methodology && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link 
            href="/phuong-phap-du-lieu" 
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1"
          >
            Xem chi tiết phương pháp tính toán →
          </Link>
        </div>
      )}
    </div>
  );
}
