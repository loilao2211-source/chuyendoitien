import Link from 'next/link';
import MarketOverview from '@/components/MarketOverview';

export const metadata = {
  title: 'PriceConverter - Dashboard',
  description: 'Convert currency, crypto, gold, and oil prices with real-time rates',
  openGraph: {
    title: 'PriceConverter - Dashboard',
    description: 'Access tools to convert currency, cryptocurrency, gold, and oil prices',
  },
  canonical: 'https://priceconverter.vercel.app/',
};

export default function Dashboard() {
  const tools = [
    {
      title: '💱 Currency Converter',
      description: 'Chuyển đổi USD, VND và 20+ loại tiền với tỷ giá trực tiếp',
      href: '/currency',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: '🪙 Crypto Converter',
      description: 'Theo dõi Bitcoin, Ethereum và hơn 12 đồng phổ biến',
      href: '/crypto',
      color: 'from-orange-400 to-red-600',
    },
    {
      title: '✨ Gold Price',
      description: 'Giá vàng XAU/USD theo thời gian thực, quy đổi oz ↔ chỉ',
      href: '/gold',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      title: '🛢️ Oil Price',
      description: 'Giá dầu Brent & WTI, đổi thùng ↔ lít ↔ gallon',
      href: '/oil',
      color: 'from-gray-600 to-gray-800',
    },
  ];

  return (
    <div className="py-12 space-y-10">
      {/* Hero Headline */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg py-10 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
          <div className="relative space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-white/80 font-semibold">Real-time pricing suite</p>
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-sm">
              Công cụ chuyển đổi giá trị đa năng
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Từ VND sang USD, vàng, dầu, crypto — chỉ 1 bước. Cập nhật 2 giờ/lần, đủ dùng cho tra cứu nhanh.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <div className={`glass-panel bg-gradient-to-br ${tool.color} rounded-2xl p-8 text-white hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer h-full border border-white/30`}>                
              <h2 className="text-2xl font-bold mb-2">{tool.title}</h2>
              <p className="text-sm opacity-90 leading-relaxed">{tool.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold bg-white/20 px-4 py-2 rounded-full">
                Bắt đầu →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Market Overview Section */}
      <MarketOverview />

      <div className="glass-panel p-6 rounded-2xl max-w-5xl mx-auto border border-white/30 mx-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Cách hoạt động</h2>
        <ul className="text-sm text-gray-700 grid md:grid-cols-2 gap-3">
          <li>✓ Chọn công cụ cần dùng: tiền tệ, crypto, vàng, dầu</li>
          <li>✓ Nhập số lượng và chọn chiều quy đổi</li>
          <li>✓ Nhấn "Chuyển đổi" để nhận kết quả ngay lập tức</li>
          <li>✓ Dữ liệu cache 2 giờ để tải nhanh nhưng vẫn đủ mới</li>
        </ul>
      </div>

      <div className="glass-panel p-6 rounded-2xl max-w-5xl mx-auto border border-blue-100 mx-4">
        <h3 className="font-semibold text-gray-900 mb-3">Tính năng nổi bật</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold">Dữ liệu trực tiếp</p>
            <p>Open ER-API, CoinGecko, Metals API, EIA</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold">Nhanh & ổn định</p>
            <p>Cache 2 giờ, tối ưu tốc độ tải</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold">Một nơi cho tất cả</p>
            <p>Tiền tệ, Crypto, Vàng, Dầu cùng giao diện thống nhất</p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100">
            <p className="font-semibold">Tương thích di động</p>
            <p>Giao diện tối ưu trên mọi thiết bị</p>
          </div>
        </div>
      </div>
    </div>
  );
}
