"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnswerBlock from '@/components/AnswerBlock';
import FAQSection from '@/components/FAQSection';
import DataSource from '@/components/DataSource';
import VietnamContext from '@/components/VietnamContext';

export default function UsdtVndPageClient() {
  const [usdtRate, setUsdtRate] = useState(null);
  const [usdRate, setUsdRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    async function fetchRates() {
      try {
        const [cryptoRes, fxRes] = await Promise.all([
          fetch('/api/crypto?symbols=tether'),
          fetch('/api/fx?base=USD&symbols=VND')
        ]);
        
        const cryptoData = await cryptoRes.json();
        const fxData = await fxRes.json();
        
        if (cryptoData?.tether?.usd && fxData?.rates?.VND) {
          // USDT price in USD, then convert to VND
          const usdtToUsd = cryptoData.tether.usd;
          const usdToVnd = fxData.rates.VND;
          setUsdtRate(usdtToUsd * usdToVnd);
          setUsdRate(usdToVnd);
          
          const now = new Date();
          setLastUpdated(now.toLocaleString('vi-VN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }));
        }
      } catch (error) {
        console.error('Error fetching rates:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  const faqs = [
    {
      question: "USDT và USD có giá trị giống nhau không?",
      answer: "Về lý thuyết, 1 USDT = 1 USD (stablecoin được neo giá). Nhưng trên thực tế tại Việt Nam, USDT thường có tỷ giá tốt hơn USD tiền mặt 0.3-0.8% do tính thanh khoản cao trên sàn P2P và không cần vận chuyển vật lý như tiền mặt."
    },
    {
      question: "Đổi USDT sang VND có hợp pháp tại Việt Nam không?",
      answer: "Vùng xám pháp lý. Hiện tại Việt Nam chưa công nhận cryptocurrency là phương tiện thanh toán hợp pháp, nhưng cũng không cấm giao dịch P2P. Rủi ro chính là: (1) Không được bảo vệ pháp lý nếu bị lừa đảo, (2) Khó chứng minh nguồn gốc tiền khi giao dịch lớn, (3) Có thể bị ngân hàng phong tỏa tài khoản nếu phát hiện giao dịch crypto thường xuyên."
    },
    {
      question: "Nên dùng sàn nào để đổi USDT sang VND tại Việt Nam?",
      answer: "An toàn nhất: (1) Binance P2P - nhiều người bán uy tín, có bảo vệ escrow, (2) Remitano - sàn có trụ sở tại Việt Nam, (3) OKX P2P - tỷ giá cạnh tranh. Tránh: giao dịch trực tiếp qua Telegram/Facebook (rủi ro lừa đảo cao), các sàn không tên tuổi."
    },
    {
      question: "Chênh lệch giữa USDT và USD khi đổi sang VND là bao nhiêu?",
      answer: "Hiện tại tại Việt Nam, USDT thường tốt hơn USD tiền mặt khoảng 50-150 VND/đô la. Ví dụ: USD tiền mặt đổi được 24,850 VND thì USDT đổi được 24,950-25,000 VND (qua sàn P2P uy tín)."
    },
    {
      question: "Rủi ro khi giữ USDT thay vì USD hoặc VND?",
      answer: "3 rủi ro chính: (1) Rủi ro pháp lý - Việt Nam có thể cấm hoàn toàn trong tương lai, (2) Rủi ro depeg - USDT có thể mất neo giá 1:1 với USD (đã xảy ra vài lần trong quá khứ), (3) Rủi ro nền tảng - sàn giao dịch có thể bị hack hoặc đóng cửa."
    }
  ];

  const dataSources = [
    "CoinGecko API - giá USDT/USD theo thời gian thực",
    "Open Exchange Rates - tỷ giá USD/VND",
    "Tham chiếu thêm: Binance P2P, Remitano (tỷ giá P2P thực tế tại Việt Nam)",
    "Cập nhật mỗi 2 giờ"
  ];

  const diff = usdtRate && usdRate ? usdtRate - usdRate : 0;
  const diffPercent = diff && usdRate ? ((diff / usdRate) * 100).toFixed(2) : 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Tỷ giá USDT sang VND hôm nay là bao nhiêu?
      </h1>

      {loading ? (
        <div className="bg-gray-100 rounded-lg p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </div>
      ) : (
        <AnswerBlock lastUpdated={lastUpdated}>
          1 USDT hiện tương đương <strong className="text-indigo-700 text-xl">{usdtRate ? usdtRate.toLocaleString('vi-VN') : '...'} VND</strong> trên thị trường P2P Việt Nam,
          {diff > 0 ? ' cao hơn ' : ' thấp hơn '}
          USD tiền mặt khoảng <strong>{Math.abs(diff).toFixed(0)} VND</strong> ({diffPercent}%). 
          Đây là giá tham khảo từ các sàn giao dịch quốc tế.
        </AnswerBlock>
      )}

      <VietnamContext>
        <strong>Quan trọng về giao dịch USDT tại Việt Nam:</strong>
        <ul className="mt-2 space-y-2 list-disc list-inside">
          <li><strong>Ưu điểm:</strong> Tỷ giá tốt hơn USD tiền mặt, chuyển nhanh, không cần vận chuyển vật lý</li>
          <li><strong>Nhược điểm:</strong> Không được pháp luật bảo vệ, rủi ro lừa đảo P2P, ngân hàng có thể phong tỏa TK</li>
          <li><strong>Khuyến nghị:</strong> Chỉ giao dịch qua sàn uy tín (Binance, Remitano), số tiền nhỏ, kiểm tra uy tín người bán</li>
        </ul>
      </VietnamContext>

      {/* Comparison Table */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          So sánh USDT vs USD khi đổi sang VND
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Loại tiền</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Tỷ giá (VND)</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Kênh giao dịch</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Độ an toàn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-medium">USDT (P2P)</td>
                <td className="px-4 py-3 text-green-600 font-bold">{usdtRate ? usdtRate.toLocaleString('vi-VN') : '...'}</td>
                <td className="px-4 py-3 text-sm">Binance P2P, Remitano</td>
                <td className="px-4 py-3 text-sm">⭐⭐⭐ (Trung bình)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">USD tiền mặt</td>
                <td className="px-4 py-3">{usdRate ? usdRate.toLocaleString('vi-VN') : '...'}</td>
                <td className="px-4 py-3 text-sm">Ngân hàng, tiệm vàng</td>
                <td className="px-4 py-3 text-sm">⭐⭐⭐⭐⭐ (Cao nhất)</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-4 py-3 font-bold">Chênh lệch</td>
                <td className="px-4 py-3 font-bold text-green-700">+{diff > 0 ? diff.toFixed(0) : 0} VND</td>
                <td className="px-4 py-3 text-sm font-medium">USDT tốt hơn {diffPercent}%</td>
                <td className="px-4 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <DataSource sources={dataSources} />
      <FAQSection faqs={faqs} />

      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-4">Xem thêm</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <Link href="/usd-vnd" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → Tỷ giá USD/VND hôm nay
          </Link>
          <Link href="/100-usd-vnd" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → 100 USD bằng bao nhiêu VND?
          </Link>
          <Link href="/crypto" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → Giá Bitcoin và cryptocurrency khác
          </Link>
          <Link href="/currency" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → Công cụ chuyển đổi tiền tệ
          </Link>
        </div>
      </div>
    </div>
  );
}
