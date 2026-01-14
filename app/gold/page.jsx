import Script from 'next/script';
import GoldPageClient from "./GoldPageClient";

export const metadata = {
  title: "Giá Vàng Hôm Nay - Chuyển đổi XAU/USD, oz sang chỉ miễn phí",
  description: "Giá vàng XAU/USD cập nhật theo thời gian thực. Quy đổi oz sang chỉ, gram, lượng. Dữ liệu từ Metals API, cập nhật mỗi 2 giờ.",
  keywords: "giá vàng hôm nay, giá vàng thế giới, xau usd, chuyển đổi oz sang chỉ, giá vàng SJC",
  alternates: {
    canonical: 'https://chuyendoitien.com/gold',
  },
  openGraph: {
    title: 'Giá Vàng Hôm Nay - XAU/USD thời gian thực',
    description: 'Theo dõi giá vàng thế giới và chuyển đổi đơn vị vàng miễn phí',
    url: 'https://chuyendoitien.com/gold',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giá Vàng Hôm Nay - XAU/USD',
    description: 'Giá vàng thế giới cập nhật 2 giờ/lần',
  },
};

const goldFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Giá vàng hôm nay là bao nhiêu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Giá vàng XAU/USD được cập nhật mỗi 2 giờ từ Metals API. Bạn có thể xem giá vàng thế giới hiện tại tính theo oz, gram hoặc chỉ trong công cụ của chúng tôi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Làm thế nào để chuyển đổi oz sang chỉ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '1 oz vàng (troy ounce) = 31.1035 gram = 8.3 chỉ (Việt Nam). Công cụ của chúng tôi tự động quy đổi giữa các đơn vị oz, gram, chỉ và lượng.',
      },
    },
    {
      '@type': 'Question',
      name: 'Giá vàng SJC khác giá vàng thế giới như thế nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Giá vàng thế giới (XAU/USD) là giá giao ngay quốc tế. Giá vàng SJC thường cao hơn do thuế, phí gia công và biên độ mua/bán tại Việt Nam.',
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <Script
        id="gold-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(goldFaqSchema) }}
      />
      <GoldPageClient />
    </>
  );
}
