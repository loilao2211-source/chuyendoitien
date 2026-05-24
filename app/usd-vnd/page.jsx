import Script from 'next/script';
import UsdVndPageClient from './UsdVndPageClient';

export const metadata = {
  title: 'Tỷ Giá USD Sang VND Hôm Nay | Chuyển Đổi Dollar Việt Nam',
  description: '1 USD = ? VND hôm nay. Tỷ giá USD/VND cập nhật theo thời gian thực, so sánh ngân hàng Việt Nam. Chênh lệch mua/bán, thời điểm đổi tiền tốt nhất.',
  keywords: 'tỷ giá usd vnd, 1 usd bằng bao nhiêu vnd, usd sang vnd, đổi usd sang vnd, tỷ giá dollar việt nam',
  alternates: {
    canonical: 'https://chuyendoitien.com/usd-vnd',
  },
  openGraph: {
    title: 'Tỷ Giá USD/VND Hôm Nay - Cập Nhật Theo Giờ',
    description: 'Tỷ giá USD sang VND mới nhất tại Việt Nam. So sánh ngân hàng, tiệm vàng, P2P.',
    url: 'https://chuyendoitien.com/usd-vnd',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tỷ Giá USD/VND Hôm Nay',
    description: '1 USD = ? VND. Cập nhật theo thời gian thực',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Tỷ giá USD/VND này lấy từ đâu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tỷ giá được lấy từ Open Exchange Rates API, tổng hợp từ nhiều ngân hàng và sàn giao dịch quốc tế. Đây là tỷ giá tham chiếu thị trường tự do (free market rate), không phải tỷ giá ngân hàng Việt Nam.',
      },
    },
    {
      '@type': 'Question',
      name: 'Có giống tỷ giá mua/bán tại ngân hàng Việt Nam không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Không hoàn toàn giống. Ngân hàng Việt Nam (như Vietcombank, BIDV) niêm yết tỷ giá mua/bán chênh lệch 1-2% so với tỷ giá thị trường tự do. Tỷ giá trên trang này phản ánh giá thị trường quốc tế, thường cao hơn tỷ giá mua của ngân hàng 50-200 VND.',
      },
    },
    {
      '@type': 'Question',
      name: 'Nên đổi USD hay USDT khi chuyển tiền về Việt Nam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'USDT (Tether) thường có tỷ giá tốt hơn USD tiền mặt 0.5-1% tại Việt Nam, đặc biệt qua các sàn P2P. Tuy nhiên, USDT có rủi ro pháp lý và biến động giá. USD tiền mặt an toàn hơn nhưng chênh lệch cao hơn khi đổi tại ngân hàng.',
      },
    },
  ],
};

export default function UsdVndPage() {
  return (
    <>
      <Script
        id="usd-vnd-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <UsdVndPageClient />
    </>
  );
}
