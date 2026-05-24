"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnswerBlock from '@/components/AnswerBlock';
import FAQSection from '@/components/FAQSection';
import DataSource from '@/components/DataSource';
import VietnamContext from '@/components/VietnamContext';

export default function Usd100VndPageClient() {
  const [rate, setRate] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch('/api/fx?base=USD&symbols=VND');
        const data = await res.json();
        if (data?.rates?.VND) {
          setRate(data.rates.VND);
          setResult(data.rates.VND * 100);
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
        console.error('Error fetching USD rate:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, []);

  const faqs = [
    {
      question: "100 USD đổi được bao nhiêu tiền Việt Nam thực tế?",
      answer: "Tại ngân hàng Việt Nam (Vietcombank, BIDV), bạn sẽ nhận được ít hơn khoảng 50,000-150,000 VND so với con số trên do chênh lệch tỷ giá mua/bán. Ví dụ: nếu tỷ giá thị trường là 25,000 VND/USD, ngân hàng có thể mua lại USD của bạn ở mức 24,850 VND/USD."
    },
    {
      question: "100 USD tiền mặt hay 100 USD chuyển khoản có giá trị khác nhau không?",
      answer: "Có khác nhau. USD tiền mặt tại Việt Nam thường được đổi với tỷ giá thấp hơn 0.5-1% so với chuyển khoản quốc tế (wire transfer). Tiền mặt còn phụ thuộc vào tình trạng tờ tiền (cũ/mới, rách/nguyên) và mệnh giá (tờ 100 USD có giá tốt hơn tờ 1-20 USD)."
    },
    {
      question: "Đổi 100 USD ở đâu có lợi nhất tại Việt Nam?",
      answer: "Thứ tự từ tốt đến kém: (1) Sàn P2P crypto (USDT) - chênh lệch thấp nhất nhưng rủi ro pháp lý, (2) Tiệm vàng uy tín - tỷ giá tốt hơn ngân hàng 0.2-0.5%, (3) Ngân hàng - an toàn nhất nhưng tỷ giá thấp, (4) Khách sạn/sân bay - tệ nhất, chênh lệch 3-5%."
    },
    {
      question: "Có bị phạt khi mang 100 USD vào Việt Nam không?",
      answer: "Không. Mức quy định hiện tại là 5,000 USD. Nếu mang từ 5,000 USD trở lên phải khai báo hải quan. Mang dưới 5,000 USD (bao gồm 100 USD) không cần khai báo và hoàn toàn hợp pháp."
    },
    {
      question: "100 USD có thể mua được gì tại Việt Nam?",
      answer: "Với khoảng 2.5 triệu VND (100 USD), bạn có thể: (1) Ăn uống 2 người tại nhà hàng trung bình 10-15 bữa, (2) Thuê khách sạn 3 sao 3-4 đêm, (3) Mua 1 chiếc điện thoại phổ thông hoặc 2-3 bộ quần áo, (4) Chi tiêu ăn uống bình thường 7-10 ngày."
    }
  ];

  const dataSources = [
    "Open Exchange Rates API - tỷ giá thị trường quốc tế",
    "Tham chiếu Vietcombank, BIDV, Techcombank (chênh lệch -50 đến -150 VND/USD)",
    "Cập nhật mỗi 2 giờ, múi giờ GMT+7"
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        100 USD bằng bao nhiêu tiền Việt Nam?
      </h1>

      {loading ? (
        <div className="bg-gray-100 rounded-lg p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </div>
      ) : (
        <AnswerBlock lastUpdated={lastUpdated}>
          100 USD hiện tương đương <strong className="text-indigo-700 text-2xl">{result ? result.toLocaleString('vi-VN') : '...'} VND</strong> theo tỷ giá thị trường tự do. 
          Tuy nhiên, khi đổi tại ngân hàng Việt Nam, bạn sẽ nhận được ít hơn khoảng 50,000-150,000 VND do chênh lệch tỷ giá mua/bán.
        </AnswerBlock>
      )}

      <VietnamContext icon="💵">
        <strong>Thực tế khi đổi 100 USD tại Việt Nam:</strong>
        <ul className="mt-2 space-y-2 text-sm">
          <li>🏦 <strong>Ngân hàng (Vietcombank, BIDV):</strong> Nhận ~{result ? (result - 100000).toLocaleString('vi-VN') : '...'} VND (trừ phí chênh lệch)</li>
          <li>🏪 <strong>Tiệm vàng:</strong> Nhận ~{result ? (result - 50000).toLocaleString('vi-VN') : '...'} VND (tỷ giá tốt hơn ngân hàng)</li>
          <li>📱 <strong>P2P (USDT):</strong> Nhận ~{result ? (result - 25000).toLocaleString('vi-VN') : '...'} VND (tốt nhất nhưng có rủi ro)</li>
          <li>🏨 <strong>Khách sạn/Sân bay:</strong> Nhận ~{result ? (result - 200000).toLocaleString('vi-VN') : '...'} VND (tệ nhất, tránh dùng)</li>
        </ul>
      </VietnamContext>

      {/* Quick Calculator */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Quy đổi nhanh USD sang VND
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[50, 100, 200, 500, 1000].map(amount => (
            <div key={amount} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="text-sm text-gray-600 mb-1">{amount} USD</div>
              <div className="text-xl font-bold text-indigo-700">
                ≈ {rate ? (rate * amount).toLocaleString('vi-VN') : '...'} VND
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          💡 <strong>Lưu ý:</strong> Đây là tỷ giá tham khảo. Khi giao dịch thực tế, bạn sẽ nhận ít hơn do phí chênh lệch.
        </div>
      </div>

      <DataSource sources={dataSources} />
      <FAQSection faqs={faqs} />

      {/* Internal Linking */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-4">Công cụ liên quan</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <Link href="/usd-vnd" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → Tỷ giá USD/VND hôm nay
          </Link>
          <Link href="/usdt-vnd" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → So sánh USDT vs USD
          </Link>
          <Link href="/currency" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → Công cụ chuyển đổi tiền tệ
          </Link>
          <Link href="/phuong-phap-du-lieu" className="text-indigo-600 hover:text-indigo-700 font-medium">
            → Phương pháp tính tỷ giá
          </Link>
        </div>
      </div>
    </div>
  );
}
