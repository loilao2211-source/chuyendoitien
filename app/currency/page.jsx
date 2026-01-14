import Script from 'next/script';
import CurrencyPageClient from './CurrencyPageClient';

export const metadata = {
  title: 'Chuyển Đổi Tiền Tệ - Quy đổi USD sang VND và 20+ loại tiền',
  description: 'Công cụ chuyển đổi tiền tệ miễn phí với tỷ giá trực tuyến. Quy đổi USD sang VND, EUR, JPY và 20+ loại tiền khác. Cập nhật 2 giờ/lần, chính xác và nhanh chóng.',
  keywords: 'chuyển đổi tiền tệ, quy đổi USD sang VND, tỷ giá ngoại tệ, chuyển đổi ngoại tệ, currency converter',
  alternates: {
    canonical: 'https://chuyendoitien.com/currency',
  },
  openGraph: {
    title: 'Chuyển Đổi Tiền Tệ - Quy đổi USD, VND, EUR miễn phí',
    description: 'Chuyển đổi hơn 20 loại tiền tệ với tỷ giá trực tuyến cập nhật liên tục',
    url: 'https://chuyendoitien.com/currency',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chuyển Đổi Tiền Tệ - USD sang VND',
    description: 'Quy đổi tiền tệ miễn phí với tỷ giá cập nhật 2 giờ/lần',
  },
};

const currencyFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Tỷ giá USD sang VND hôm nay là bao nhiêu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tỷ giá USD/VND được cập nhật tự động mỗi 2 giờ từ nguồn dữ liệu Open ER-API. Bạn có thể xem tỷ giá hiện tại và lịch sử trong công cụ chuyển đổi tiền tệ của chúng tôi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Công cụ hỗ trợ những loại tiền tệ nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chúng tôi hỗ trợ hơn 20 loại tiền tệ phổ biến bao gồm USD, VND, EUR, GBP, JPY, CNY, THB, SGD và nhiều loại khác.',
      },
    },
    {
      '@type': 'Question',
      name: 'Làm sao để chuyển đổi tiền tệ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chọn loại tiền gốc và loại tiền đích, nhập số tiền cần chuyển đổi, sau đó nhấn nút "Chuyển đổi". Kết quả hiện ra ngay lập tức với tỷ giá thời gian thực.',
      },
    },
  ],
};

export default function CurrencyPage() {
  return (
    <>
      <Script
        id="currency-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(currencyFaqSchema) }}
      />
      <CurrencyPageClient />
    </>
  );
}
