"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnswerBlock from '@/components/AnswerBlock';
import FAQSection from '@/components/FAQSection';
import DataSource from '@/components/DataSource';
import VietnamContext from '@/components/VietnamContext';
import PriceChart from '@/components/PriceChart';

export default function GiaDauTheGioiHomNayPageClient() {
  const [oilPrices, setOilPrices] = useState({ brent: null, wti: null });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/oil');
        const data = await res.json();
        
        if (data?.brent || data?.wti) {
          setOilPrices({
            brent: data.brent,
            wti: data.wti
          });
          
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
        console.error('Error fetching oil prices:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const faqs = [
    {
      question: "Dầu Brent và dầu WTI khác nhau như thế nào?",
      answer: "Brent là dầu thô khai thác từ Biển Bắc (châu Âu), WTI (West Texas Intermediate) là dầu từ Texas (Mỹ). Brent được dùng làm chuẩn giá dầu quốc tế (60-70% sản lượng thế giới), WTI là chuẩn tại Bắc Mỹ. Brent thường đắt hơn WTI 2-5 USD/thùng do chi phí vận chuyển và chất lượng."
    },
    {
      question: "Giá dầu thế giới ảnh hưởng như thế nào đến giá xăng dầu Việt Nam?",
      answer: "Giá xăng dầu Việt Nam điều chỉnh theo giá dầu thế giới với độ trễ 10-15 ngày (kỳ điều hành). Công thức: Giá xăng VN = Giá Brent/WTI + Chi phí nhập khẩu + Thuế + Quỹ bình ổn + Lợi nhuận. Khi dầu thế giới tăng/giảm 10%, xăng VN thường tăng/giảm 5-7% (do quỹ bình ổn hấp thụ biến động)."
    },
    {
      question: "1 thùng dầu bằng bao nhiêu lít?",
      answer: "1 thùng dầu (barrel) = 159 lít = 42 gallon Mỹ. Đây là đơn vị chuẩn giao dịch dầu quốc tế. Ví dụ: dầu Brent 85 USD/thùng = 85/159 = 0.53 USD/lít (~13,000 VND/lít giá gốc chưa thuế)."
    },
    {
      question: "Khi nào giá dầu tăng, khi nào giảm?",
      answer: "Giá dầu tăng khi: (1) OPEC+ cắt giảm sản lượng, (2) Nhu cầu toàn cầu tăng (mùa hè Mỹ, tết châu Á), (3) Xung đột Trung Đông, (4) USD yếu. Giá dầu giảm khi: (1) Tăng sản lượng Mỹ (dầu đá phiến), (2) Suy thoái kinh tế, (3) Dự trữ dầu thô Mỹ tăng mạnh."
    },
    {
      question: "Tại sao giá xăng Việt Nam không giảm ngay khi dầu thế giới giảm?",
      answer: "3 lý do chính: (1) Kỳ điều hành 10-15 ngày/lần (không theo ngày), (2) Quỹ bình ổn giá đang âm (phải trích thêm để trả nợ quỹ), (3) Thuế môi trường và phí cố định không đổi (chiếm 30-40% giá bán). Khi dầu thế giới giảm, phần giảm thường bị hấp thụ bởi quỹ bình ổn."
    }
  ];

  const dataSources = [
    "EIA (U.S. Energy Information Administration) - giá dầu Brent & WTI",
    "Dữ liệu cập nhật mỗi 2 giờ",
    "Tham chiếu thêm: Petrolimex, giá xăng dầu trong nước Việt Nam"
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Giá dầu thế giới hôm nay là bao nhiêu?
      </h1>

      {loading ? (
        <div className="bg-gray-100 rounded-lg p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </div>
      ) : (
        <AnswerBlock lastUpdated={lastUpdated}>
          Giá dầu thế giới hôm nay: Dầu <strong className="text-indigo-700 text-xl">Brent ${oilPrices.brent ? oilPrices.brent.toFixed(2) : '...'}/thùng</strong>, 
          dầu <strong className="text-indigo-700 text-xl">WTI ${oilPrices.wti ? oilPrices.wti.toFixed(2) : '...'}/thùng</strong>. 
          Giá xăng dầu tại Việt Nam sẽ điều chỉnh theo giá này với độ trễ khoảng 10-15 ngày.
        </AnswerBlock>
      )}

      <VietnamContext icon="⛽">
        <strong>Ảnh hưởng đến giá xăng dầu Việt Nam:</strong>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between items-center bg-white rounded-lg p-3">
            <span>Giá dầu Brent (gốc):</span>
            <span className="font-bold">{oilPrices.brent ? `$${oilPrices.brent.toFixed(2)}/thùng` : '...'}</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded-lg p-3">
            <span>Quy đổi sang lít:</span>
            <span className="font-bold">{oilPrices.brent ? `$${(oilPrices.brent / 159).toFixed(2)}/lít` : '...'}</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded-lg p-3">
            <span>Giá gốc tại Việt Nam (chưa thuế):</span>
            <span className="font-bold text-green-700">
              {oilPrices.brent ? `~${((oilPrices.brent / 159) * 25000).toLocaleString('vi-VN')} VND/lít` : '...'}
            </span>
          </div>
          <p className="text-xs mt-2 text-gray-600">
            * Giá xăng bán lẻ tại Việt Nam = Giá gốc + Thuế (8,000 VND) + Phí kinh doanh + Quỹ bình ổn
          </p>
        </div>
      </VietnamContext>

      {/* Price Comparison */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          So sánh Brent vs WTI
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-blue-200 rounded-lg p-5 bg-blue-50">
            <div className="text-sm text-gray-600 mb-1">🛢️ Dầu Brent</div>
            <div className="text-3xl font-bold text-blue-700 mb-2">
              ${oilPrices.brent ? oilPrices.brent.toFixed(2) : '...'}
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• Khai thác: Biển Bắc (châu Âu)</div>
              <div>• Chuẩn quốc tế (60-70% thế giới)</div>
              <div>• Dùng làm tham chiếu giá xăng VN</div>
            </div>
          </div>
          <div className="border-2 border-orange-200 rounded-lg p-5 bg-orange-50">
            <div className="text-sm text-gray-600 mb-1">🛢️ Dầu WTI</div>
            <div className="text-3xl font-bold text-orange-700 mb-2">
              ${oilPrices.wti ? oilPrices.wti.toFixed(2) : '...'}
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• Khai thác: Texas (Mỹ)</div>
              <div>• Chuẩn Bắc Mỹ</div>
              <div>• Thường rẻ hơn Brent 2-5 USD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Biểu đồ giá dầu Brent 30 ngày
        </h2>
        <PriceChart pair="BRENT" />
      </div>

      <DataSource sources={dataSources} />
      <FAQSection faqs={faqs} />

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">Xem thêm</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <Link href="/oil" className="text-blue-700 hover:text-blue-800 font-medium">
            → Công cụ chuyển đổi đơn vị dầu
          </Link>
          <Link href="/gia-vang-hom-nay" className="text-blue-700 hover:text-blue-800 font-medium">
            → Giá vàng thế giới hôm nay
          </Link>
          <Link href="/usd-vnd" className="text-blue-700 hover:text-blue-800 font-medium">
            → Tỷ giá USD/VND
          </Link>
          <Link href="/phuong-phap-du-lieu" className="text-blue-700 hover:text-blue-800 font-medium">
            → Phương pháp tính giá dầu
          </Link>
        </div>
      </div>
    </div>
  );
}
