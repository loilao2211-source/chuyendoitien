"use client";

import { getAffiliatesByCategory, categoryMeta } from '@/data/affiliateConfig';

/**
 * AffiliateOptions Component
 * Hiển thị affiliate phù hợp theo category của từng trang
 * 
 * @param {string} category - money_transfer | crypto | gold | fuel
 * @param {string} baseMoney - VND | USD (for formatting)
 * @param {number} amount - Amount being converted
 * @param {number} usdEquivalent - USD equivalent value
 * @param {boolean} resultsReady - Show only when ValueExplorer has results
 */
export default function AffiliateOptions({ 
  category = 'money_transfer', 
  baseMoney = 'VND',
  amount,
  usdEquivalent,
  resultsReady = true 
}) {
  // Don't show if no results yet (optional behavior)
  if (!resultsReady && category === 'money_transfer') {
    return null;
  }

  const affiliates = getAffiliatesByCategory(category);
  const meta = categoryMeta[category] || categoryMeta.money_transfer;
  
  if (!affiliates || affiliates.length === 0) {
    return null;
  }

  const locale = baseMoney === 'VND' ? 'vi-VN' : 'en-US';

  return (
    <div className="glass-panel rounded-xl p-6 max-w-5xl mx-auto border border-blue-100">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-gray-900">{meta.title}</h3>
          {amount && usdEquivalent && category === 'money_transfer' && (
            <p className="text-xs text-gray-600">
              {amount?.toLocaleString?.(locale)} {baseMoney} ≈ ${usdEquivalent?.toLocaleString?.('en-US', { maximumFractionDigits: 2 })}
            </p>
          )}
        </div>
        <p className="text-xs text-gray-600">{meta.subtitle}</p>
      </div>

      {/* Affiliate Cards Grid */}
      <div className={`grid ${affiliates.length === 2 ? 'md:grid-cols-2' : affiliates.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-3`}>
        {affiliates.map((affiliate) => (
          <div 
            key={affiliate.id} 
            className="flex flex-col justify-between px-4 py-3 rounded-lg border border-gray-200 bg-white/90 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="mb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{affiliate.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{affiliate.name}</p>
                    {affiliate.badge && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-700">
                        {affiliate.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">{affiliate.description}</p>
              <p className="text-[11px] text-gray-500">{affiliate.fee}</p>
            </div>
            
            {affiliate.outboundHref === '#' ? (
              <button
                disabled
                className="w-full text-center px-3 py-2 rounded-md text-xs font-semibold bg-gray-200 text-gray-500 cursor-not-allowed"
              >
                Sắp cập nhật
              </button>
            ) : (
              <a
                href={affiliate.href}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="block text-center px-3 py-2 rounded-md text-xs font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                {affiliate.cta}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-[11px] text-gray-500 text-center">
          ℹ️ {meta.disclaimer}
        </p>
      </div>
    </div>
  );
}
