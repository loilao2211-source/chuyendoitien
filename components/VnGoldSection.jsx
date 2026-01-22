"use client";

import { useMemo } from "react";

/**
 * VnGoldSection - Hiển thị giá vàng Việt Nam + so sánh với vàng quốc tế
 * Props:
 * - vnGold: data từ API /api/vn/gold
 * - vnGoldError: error message nếu có
 * - xauUsd: giá vàng quốc tế (USD/oz)
 * - usdToVnd: tỷ giá USD -> VND
 * - alwaysOpen: luôn hiển thị, không collapsible (default: false)
 */
export default function VnGoldSection({ vnGold, vnGoldError, xauUsd, usdToVnd, alwaysOpen = false }) {
  // Tính giá vàng quốc tế quy đổi sang VND theo đơn vị VN
  const goldIntlVnd = useMemo(() => {
    if (!xauUsd || !usdToVnd) return null;
    
    // Sanity check: XAU/USD should be in reasonable range [500-10000] USD/oz
    if (xauUsd < 500 || xauUsd > 10000) {
      console.warn(`[VnGoldSection] Invalid XAU/USD: ${xauUsd}, expected [500-10000]`);
      return null;
    }
    
    // Constants (standardized)
    const TROY_OZ_TO_GRAM = 31.1034768; // 1 troy ounce = 31.1034768 grams
    const LUONG_TO_GRAM = 37.5; // 1 lượng = 10 chỉ = 37.5 grams
    
    const gramPrice = xauUsd / TROY_OZ_TO_GRAM; // USD/gram
    const luongPrice = gramPrice * LUONG_TO_GRAM; // USD/lượng
    const luongVnd = luongPrice * usdToVnd; // VND/lượng
    
    // Sanity check: VND/lượng should be in reasonable range [30M-150M]
    if (luongVnd < 30_000_000 || luongVnd > 150_000_000) {
      console.warn(`[VnGoldSection] Invalid VND/lượng: ${luongVnd}, expected [30M-150M]`);
      return null;
    }
    
    return {
      ozVnd: xauUsd * usdToVnd,
      gramVnd: gramPrice * usdToVnd,
      luongVnd: luongVnd,
      luongUsd: luongPrice
    };
  }, [xauUsd, usdToVnd]);

  // So sánh chênh lệch giữa vàng VN và quốc tế
  const comparison = useMemo(() => {
    if (!vnGold || !goldIntlVnd) return null;
    
    // Lấy giá SJC để so sánh (thường cao nhất)
    const sjc = vnGold.items.find(item => item.brand.includes('SJC'));
    if (!sjc) return null;
    
    const vnAvg = (sjc.buy + sjc.sell) / 2;
    const diff = vnAvg - goldIntlVnd.luongVnd;
    const diffPercent = (diff / goldIntlVnd.luongVnd) * 100;
    
    return {
      vnAvg,
      intlVnd: goldIntlVnd.luongVnd,
      diff,
      diffPercent
    };
  }, [vnGold, goldIntlVnd]);

  if (!vnGold && !vnGoldError) {
    return (
      <div className="glass-panel rounded-2xl border border-gray-100 max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (vnGoldError) {
    return (
      <div className="glass-panel rounded-2xl border border-red-100 max-w-5xl mx-auto p-6 bg-red-50/50">
        <p className="text-sm text-red-600">{vnGoldError}</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl border border-amber-100 max-w-5xl mx-auto p-6 bg-gradient-to-br from-amber-50/30 to-white">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg">
              �🇳
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Giá vàng Việt Nam</h3>
              <p className="text-xs text-gray-600">Tham khảo — Cập nhật thủ công</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600">
            <div>Cập nhật: {new Date(vnGold.updatedAt).toLocaleString('vi-VN')}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Đơn vị: {vnGold.unit}</div>
          </div>
        </div>

        {/* Comparison Cards */}
        {comparison && (
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="text-xs text-blue-700 font-semibold mb-1">🌍 QUỐC TẾ (quy đổi tham khảo)</div>
              <div className="text-xl font-bold text-blue-900">{comparison.intlVnd.toLocaleString('vi-VN')} ₫</div>
              <div className="text-xs text-blue-600 mt-1">1 lượng (37.5g) theo XAU/USD</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <div className="text-xs text-amber-700 font-semibold mb-1">🇻🇳 VIỆT NAM (thị trường thực tế)</div>
              <div className="text-xl font-bold text-amber-900">{comparison.vnAvg.toLocaleString('vi-VN')} ₫</div>
              <div className="text-xs text-amber-600 mt-1">1 lượng SJC (trung bình)</div>
            </div>
            <div className={`bg-gradient-to-br ${comparison.diff >= 0 ? 'from-red-50 to-red-100 border-red-200' : 'from-green-50 to-green-100 border-green-200'} rounded-xl p-4 border`}>
              <div className={`text-xs font-semibold mb-1 ${comparison.diff >= 0 ? 'text-red-700' : 'text-green-700'}`}>CHÊNH LỆCH</div>
              <div className={`text-xl font-bold ${comparison.diff >= 0 ? 'text-red-900' : 'text-green-900'}`}>
                {comparison.diff >= 0 ? '+' : ''}{comparison.diff.toLocaleString('vi-VN')} ₫
              </div>
              <div className={`text-xs mt-1 ${comparison.diff >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {comparison.diffPercent >= 0 ? '+' : ''}{Number.isFinite(comparison.diffPercent) ? comparison.diffPercent.toFixed(2) : 'N/A'}% so với quốc tế
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-amber-50 text-amber-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Thương hiệu</th>
                <th className="px-4 py-3 text-left font-semibold">Loại</th>
                <th className="px-4 py-3 text-right font-semibold">Mua vào</th>
                <th className="px-4 py-3 text-right font-semibold">Bán ra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {vnGold.items.map((item, idx) => (
                <tr key={`${item.brand}-${item.type}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.logo && (
                        <img
                          src={item.logo}
                          alt={`${item.brand} logo`}
                          className="h-8 w-8 object-contain rounded-md bg-white border border-gray-100"
                        />
                      )}
                      <span className="font-bold text-gray-900">{item.brand}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">{item.type}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-green-700">{item.buy.toLocaleString('vi-VN')} ₫</div>
                    {goldIntlVnd && (
                      <div className="text-xs text-gray-500">≈ ${Number.isFinite(item.buy) && Number.isFinite(usdToVnd) && usdToVnd > 0 ? (item.buy / usdToVnd).toFixed(0) : 'N/A'}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-red-700">{item.sell.toLocaleString('vi-VN')} ₫</div>
                    {goldIntlVnd && (
                      <div className="text-xs text-gray-500">≈ ${Number.isFinite(item.sell) && Number.isFinite(usdToVnd) && usdToVnd > 0 ? (item.sell / usdToVnd).toFixed(0) : 'N/A'}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <div className="flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <div>
              <strong>Lưu ý:</strong> {vnGold.note || 'Giá tham khảo từ các thương hiệu lớn tại Việt Nam. Cập nhật thủ công. Giá thực tế thay đổi theo từng thương hiệu và thời điểm giao dịch.'}
            </div>
          </div>
        </div>

        {/* USD Conversion Info */}
        {goldIntlVnd && (
          <div className="text-xs text-gray-600 pt-2 border-t border-gray-100 space-y-1">
            <p>💱 Quy đổi: <strong>1 USD = {usdToVnd.toLocaleString('vi-VN')} VND</strong></p>
            <p>🪙 XAU/USD: <strong>${Number.isFinite(xauUsd) ? xauUsd.toFixed(2) : 'N/A'}/oz</strong> → <strong>{Number.isFinite(goldIntlVnd.gramVnd) ? goldIntlVnd.gramVnd.toFixed(0) : 'N/A'} ₫/gram</strong> → <strong>{goldIntlVnd.luongVnd.toLocaleString('vi-VN')} ₫/lượng</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
