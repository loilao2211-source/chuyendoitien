"use client";

import { affiliateLinks } from '@/lib/affiliateLinks';

export default function TransferOptionsTable({ baseMoney, amount, usdEquivalent, resultsReady }) {
  if (!resultsReady) return null;

  const locale = baseMoney === 'VND' ? 'vi-VN' : 'en-US';

  const rows = [
    {
      name: 'Wise',
      fee: '~0.6–1%',
      cta: 'See fees',
      href: affiliateLinks.wise,
    },
    {
      name: 'PayPal',
      fee: '~3–4%',
      cta: 'See fees',
      href: affiliateLinks.paypal,
    },
  ];

  return (
    <div className="glass-panel rounded-xl p-4 max-w-5xl mx-auto border border-blue-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-gray-900">Transfer options</p>
        <p className="text-xs text-gray-600">
          {amount?.toLocaleString?.(locale)} {baseMoney} ≈ ${usdEquivalent?.toLocaleString?.('en-US', { maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {rows.map((row) => (
          <div key={row.name} className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-200 bg-white/90">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
              <p className="text-xs text-gray-600">Estimated fee: {row.fee}</p>
            </div>
            <a
              href={row.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              {row.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
