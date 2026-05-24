import Script from 'next/script';
import GiaDauTheGioiHomNayPageClient from './GiaDauTheGioiHomNayPageClient';

export const metadata = {
  title: 'Giá Dầu Thế Giới Hôm Nay | Brent & WTI - Ảnh Hưởng Giá Xăng VN',
  description: 'Giá dầu Brent, WTI hôm nay. Ảnh hưởng đến giá xăng dầu Việt Nam như thế nào? Quy đổi thùng sang lít. Biểu đồ lịch sử 30 ngày.',
  keywords: 'giá dầu hôm nay, giá dầu thế giới, dầu brent, dầu wti, giá xăng việt nam',
  alternates: {
    canonical: 'https://chuyendoitien.com/gia-dau-the-gioi-hom-nay',
  },
  openGraph: {
    title: 'Giá Dầu Thế Giới Hôm Nay - Brent & WTI',
    description: 'Giá dầu Brent, WTI cập nhật theo giờ. Ảnh hưởng đến xăng dầu Việt Nam.',
    url: 'https://chuyendoitien.com/gia-dau-the-gioi-hom-nay',
    type: 'article',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Dầu Brent và dầu WTI khác nhau như thế nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brent là dầu khai thác từ Biển Bắc (châu Âu), WTI từ Texas (Mỹ). Brent là chuẩn giá dầu quốc tế (60-70% thế giới), WTI là chuẩn Bắc Mỹ. Brent thường đắt hơn WTI 2-5 USD/thùng.',
      },
    },
    {
      '@type': 'Question',
      name: 'Giá dầu thế giới ảnh hưởng như thế nào đến giá xăng Việt Nam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Giá xăng Việt Nam điều chỉnh theo giá dầu thế giới với độ trễ 10-15 ngày. Khi dầu tăng/giảm 10%, xăng VN thường tăng/giảm 5-7% do quỹ bình ổn hấp thụ biến động.',
      },
    },
    {
      '@type': 'Question',
      name: '1 thùng dầu bằng bao nhiêu lít?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '1 thùng dầu (barrel) = 159 lít = 42 gallon Mỹ. Đây là đơn vị chuẩn giao dịch dầu quốc tế.',
      },
    },
  ],
};

export default function GiaDauTheGioiHomNayPage() {
  return (
    <>
      <Script
        id="gia-dau-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GiaDauTheGioiHomNayPageClient />
    </>
  );
}
