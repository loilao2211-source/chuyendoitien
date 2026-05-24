'use client';

export default function Attribution() {
  return (
    <div className="bg-gray-100 p-4 text-center text-xs text-gray-600 rounded mt-6">
      <p>
        Data sources: <a href="https://open.er-api.com" className="text-blue-600 hover:underline">open.er-api</a> |{' '}
        <a href="https://coingecko.com" className="text-blue-600 hover:underline">CoinGecko</a> |{' '}
        <a href="https://metals-api.com" className="text-blue-600 hover:underline">Metals API</a> |{' '}
        <a href="https://eia.gov" className="text-blue-600 hover:underline">EIA</a> |{' '}
        <a href="https://webgia.com" className="text-blue-600 hover:underline">WebGia</a>
      </p>
      <p className="mt-2">
        <a href="/phuong-phap-du-lieu" className="text-blue-600 hover:underline">Phương pháp dữ liệu</a> |{' '}
        <a href="/blog" className="text-blue-600 hover:underline">Blog</a> |{' '}
        <a href="/about" className="text-blue-600 hover:underline">Giới thiệu</a> |{' '}
        <a href="/contact" className="text-blue-600 hover:underline">Liên hệ</a> |{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">Chính sách riêng tư</a> |{' '}
        <a href="/disclaimer" className="text-blue-600 hover:underline">Miễn trừ trách nhiệm</a>
      </p>
    </div>
  );
}
