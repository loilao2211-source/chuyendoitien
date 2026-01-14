import FinanceTabs from '@/components/FinanceTabs';
import Disclaimer from '@/components/Disclaimer';

export const metadata = {
  title: 'Bảng Điều Khiển Tài Chính - Tổng hợp tiền tệ, crypto, vàng, dầu',
  description: 'Bảng điều khiển tài chính tổng hợp với tabs FX, crypto, vàng và dầu. Xem tất cả tỷ giá và giá cả trong một giao diện thống nhất.',
  keywords: 'bảng điều khiển tài chính, finance dashboard, tổng hợp giá, fx crypto gold oil',
  alternates: {
    canonical: 'https://chuyendoitien.com/finance',
  },
  openGraph: {
    title: 'Bảng Điều Khiển Tài Chính - ChuyenDoiTien',
    description: 'Tổng hợp tiền tệ, crypto, vàng, dầu trong một giao diện',
    url: 'https://chuyendoitien.com/finance',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bảng Điều Khiển Tài Chính',
    description: 'Tổng hợp FX, crypto, vàng, dầu',
  },
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
