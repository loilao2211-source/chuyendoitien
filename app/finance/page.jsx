import FinanceTabs from '@/components/FinanceTabs';
import Disclaimer from '@/components/Disclaimer';

export const metadata = {
  title: 'Finance Hub | Aggregated FX, Crypto, Gold, Oil',
  description: 'Finance hub with tabs for FX, crypto, gold, and oil using existing APIs.',
};

export default function FinancePage() {
  return (
    <div className="py-10 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-500 font-semibold">Finance Hub</p>
        <h1 className="text-4xl font-bold text-gray-900">Bảng điều khiển tài chính tổng hợp</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Tabs tổng hợp FX, crypto, vàng và dầu. Dùng Mini Value Explorer cho ước tính nhanh, bảng dữ liệu có tìm kiếm và sắp xếp.
        </p>
      </div>

      <FinanceTabs />

      <Disclaimer />
    </div>
  );
}
