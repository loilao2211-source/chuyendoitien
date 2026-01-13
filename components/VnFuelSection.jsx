"use client";

import { useMemo } from "react";

/**
 * VnFuelSection - Hiển thị giá xăng dầu Việt Nam
 * Props:
 * - vnFuel: data từ API /api/vn/fuel
 * - vnFuelError: error message nếu có
 * - usdToVnd: tỷ giá USD -> VND
 * - alwaysOpen: luôn hiển thị, không collapsible (default: false)
 */
export default function VnFuelSection({ vnFuel, vnFuelError, usdToVnd, alwaysOpen = false }) {
  // Tính giá xăng VN quy đổi sang USD/lít
  const fuelInUsd = useMemo(() => {
    if (!vnFuel || !usdToVnd || usdToVnd === 0) return null;
    return vnFuel.items.map(item => ({
      ...item,
      region1Usd: item.region1 / usdToVnd,
      region2Usd: item.region2 / usdToVnd
    }));
  }, [vnFuel, usdToVnd]);

  if (!vnFuel && !vnFuelError) {
    return (
      <div className="glass-panel rounded-2xl border border-gray-100 max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (vnFuelError) {
    return (
      <div className="glass-panel rounded-2xl border border-red-100 max-w-5xl mx-auto p-6 bg-red-50/50">
        <p className="text-sm text-red-600">{vnFuelError}</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl border border-blue-100 max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-50/30 to-white">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
              ⛽
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Giá xăng dầu Việt Nam</h3>
              <p className="text-xs text-gray-600">Tham khảo — Cập nhật thủ công</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600">
            <div>Cập nhật: {new Date(vnFuel.updatedAt).toLocaleString('vi-VN')}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Đơn vị: {vnFuel.unit}</div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-blue-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Mã</th>
                <th className="px-4 py-3 text-left font-semibold">Tên sản phẩm</th>
                <th className="px-4 py-3 text-right font-semibold">{vnFuel.regions?.[0] || 'Vùng 1'}</th>
                <th className="px-4 py-3 text-right font-semibold">{vnFuel.regions?.[1] || 'Vùng 2'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {vnFuel.items.map((item, idx) => (
                <tr key={item.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                  <td className="px-4 py-3 font-bold text-blue-700">{item.code}</td>
                  <td className="px-4 py-3 text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-gray-900">{item.region1.toLocaleString('vi-VN')} ₫</div>
                    {fuelInUsd && (
                      <div className="text-xs text-gray-500">≈ ${fuelInUsd[idx].region1Usd.toFixed(3)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-gray-900">{item.region2.toLocaleString('vi-VN')} ₫</div>
                    {fuelInUsd && (
                      <div className="text-xs text-gray-500">≈ ${fuelInUsd[idx].region2Usd.toFixed(3)}</div>
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
              <strong>Lưu ý:</strong> {vnFuel.note || 'Giá tham khảo, cập nhật thủ công theo kỳ điều chỉnh. Giá thực tế có thể khác nhau tùy từng cửa hàng và thời điểm.'}
            </div>
          </div>
        </div>

        {/* USD Conversion Info */}
        {usdToVnd && (
          <div className="text-xs text-gray-600 pt-2 border-t border-gray-100">
            <p>💱 Quy đổi USD/VND: <strong>1 USD = {usdToVnd.toLocaleString('vi-VN')} VND</strong> (cập nhật từ API FX)</p>
          </div>
        )}
      </div>
    </div>
  );
}
