"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnswerBlock from '@/components/AnswerBlock';
import FAQSection from '@/components/FAQSection';
import DataSource from '@/components/DataSource';
import VietnamContext from '@/components/VietnamContext';
import ConverterForm from '@/components/ConverterForm';
import PriceChart from '@/components/PriceChart';

export default function UsdVndPageClient() {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch('/api/fx?base=USD&symbols=VND');
        const data = await res.json();
        if (data?.rates?.VND) {
          setRate(data.rates.VND);
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
        console.error('Error fetching USD/VND rate:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, []);

  const faqs = [
    {
      question: "Tỷ giá USD/VND này lấy từ đâu?",
      answer: "Tỷ giá được lấy từ Open Exchange Rates API, tổng hợp từ nhiều ngân hàng và sàn giao dịch quốc tế. Đây là tỷ giá tham chiếu thị trường tự do (free market rate), không phải tỷ giá ngân hàng Việt Nam."
    },
    {
      question: "Có giống tỷ giá mua/bán tại ngân hàng Việt Nam không?",
      answer: "Không hoàn toàn giống. Ngân hàng Việt Nam (như Vietcombank, BIDV) niêm yết tỷ giá mua/bán chênh lệch 1-2% so với tỷ giá thị trường tự do. Tỷ giá trên trang này phản ánh giá thị trường quốc tế, thường cao hơn tỷ giá mua của ngân hàng 50-200 VND."
    },
    {
      question: "Mức chênh lệch bao nhiêu là bình thường khi đổi USD tại Việt Nam?",
      answer: "Chênh lệch mua/bán tại ngân hàng: 50-150 VND/USD. Tại tiệm vàng/đổi tiền tư nhân: 100-300 VND/USD. Nếu chênh lệch trên 500 VND/USD, cần cẩn trọng về tính minh bạch của nguồn đổi tiền."
    },
    {
      question: "Nên đổi USD hay USDT khi chuyển tiền về Việt Nam?",
      answer: "USDT (Tether) thường có tỷ giá tốt hơn USD tiền mặt 0.5-1% tại Việt Nam, đặc biệt qua các sàn P2P. Tuy nhiên, USDT có rủi ro pháp lý và biến động giá. USD tiền mặt an toàn hơn nhưng chênh lệch cao hơn khi đổi tại ngân hàng."
    },
    {
      question: "Khi nào nên đổi USD sang VND?",
      answer: "Thời điểm tốt: Khi USD tăng giá mạnh (thường cuối năm hoặc khi FED tăng lãi suất). Nên theo dõi biểu đồ lịch sử 6-12 tháng để xác định mốc giá cao. Tránh đổi vào đầu tháng (nhu cầu VND cao, tỷ giá thường thấp hơn)."
    }
  ];

  const dataSources = [
    "Open Exchange Rates API (tỷ giá thị trường tự do)",
    "Dữ liệu cập nhật mỗi 2 giờ một lần",
    "Tham chiếu từ các ngân hàng và sàn giao dịch quốc tế",
    "So sánh với tỷ giá ngân hàng Vietcombank, BIDV (chỉ mang tính tham khảo)"
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* H1 as Question */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Tỷ giá USD sang VND hôm nay là bao nhiêu?
      </h1>

      {/* Answer-First Block - CRITICAL for AI Citation */}
      {loading ? (
        <div className="bg-gray-100 rounded-lg p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </div>
      ) : (
        <AnswerBlock lastUpdated={lastUpdated}>
          1 USD hiện tương đương <strong className="text-indigo-700 text-xl">{rate ? rate.toLocaleString('vi-VN') : '...'} VND</strong> tại thị trường tự do Việt Nam, 
          cập nhật theo tỷ giá quốc tế mới nhất. Tỷ giá mua/bán tại ngân hàng Việt Nam có thể chênh lệch 50-150 VND so với con số này.
        </AnswerBlock>
      )}

      {/* Vietnam Context */}
      <VietnamContext>
        <strong>Lưu ý quan trọng:</strong> Tỷ giá USD/VND trên trang này là tỷ giá tham chiếu thị trường quốc tế. 
        Khi giao dịch tại Việt Nam, bạn sẽ nhận được tỷ giá khác nhau tùy theo:
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Ngân hàng (Vietcombank, BIDV, Techcombank): tỷ giá thấp hơn 50-150 VND</li>
          <li>Tiệm vàng/đổi tiền: tỷ giá có thể cao hơn nhưng chênh lệch mua/bán lớn</li>
          <li>Sàn P2P (crypto): tỷ giá tốt nhưng có rủi ro pháp lý</li>
        </ul>
      </VietnamContext>

      {/* Converter Tool */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Công cụ chuyển đổi USD ↔ VND
        </h2>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <ConverterForm 
            defaultFrom="USD" 
            defaultTo="VND" 
            defaultAmount={100}
          />
        </div>
      </div>

      {/* Historical Chart */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Biểu đồ lịch sử USD/VND 30 ngày
        </h2>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <PriceChart pair="USD-VND" />
        </div>
      </div>

      {/* Data Source */}
      <DataSource sources={dataSources} />

      {/* FAQ Section - Search Intent Focused */}
      <FAQSection faqs={faqs} />

      {/* Internal Linking */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-4">Xem thêm tỷ giá liên quan</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <Link href="/100-usd-vnd" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → 100 USD bằng bao nhiêu VND?
          </Link>
          <Link href="/usdt-vnd" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → Tỷ giá USDT/VND hôm nay
          </Link>
          <Link href="/currency" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → Chuyển đổi 20+ loại tiền tệ khác
          </Link>
          <Link href="/crypto" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → Giá Bitcoin và cryptocurrency
          </Link>
        </div>
      </div>
    </div>
  );
}
