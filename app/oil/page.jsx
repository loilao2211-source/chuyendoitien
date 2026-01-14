import Script from 'next/script';
import OilPageClient from './OilPageClient';

export const metadata = {
  title: 'Giá Dầu Hôm Nay - Giá dầu Brent & WTI, quy đổi thùng sang lít',
  description: 'Giá dầu thô Brent và WTI cập nhật theo thời gian thực. Chuyển đổi thùng sang lít, gallon. Dữ liệu từ EIA, cập nhật mỗi 2 giờ.',
  keywords: 'giá dầu hôm nay, giá dầu thô, Brent oil, WTI oil, chuyển đổi thùng dầu sang lít',
  alternates: {
    canonical: 'https://chuyendoitien.com/oil',
  },
  openGraph: {
    title: 'Giá Dầu Hôm Nay - Brent & WTI thời gian thực',
    description: 'Theo dõi giá dầu thô và chuyển đổi đơn vị dầu miễn phí',
    url: 'https://chuyendoitien.com/oil',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giá Dầu Hôm Nay - Brent & WTI',
    description: 'Giá dầu thô cập nhật 2 giờ/lần',
  },
};

const oilFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Giá dầu hôm nay là bao nhiêu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Giá dầu Brent và WTI được cập nhật mỗi 2 giờ từ EIA (Cơ quan Thông tin Năng lượng Hoa Kỳ). Bạn có thể xem giá dầu thô hiện tại theo USD/thùng trong công cụ của chúng tôi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Dầu Brent và WTI khác nhau như thế nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brent là dầu thô khai thác từ Biển Bắc (châu Âu), WTI là dầu khai thác từ Mỹ. Brent thường được dùng làm chuẩn giá dầu quốc tế, WTI là chuẩn tại Bắc Mỹ.',
      },
    },
    {
      '@type': 'Question',
      name: 'Làm sao chuyển đổi thùng dầu sang lít?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '1 thùng dầu (barrel) = 159 lít = 42 gallon. Công cụ của chúng tôi tự động quy đổi giữa các đơn vị thùng, lít và gallon.',
      },
    },
  ],
};

export default function OilPage() {
  return (
    <>
      <Script
        id="oil-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(oilFaqSchema) }}
      />
      <OilPageClient />
    </>
  );
}
