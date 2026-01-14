import Script from 'next/script';
import CryptoPageClient from './CryptoPageClient';

export const metadata = {
  title: 'Chuyển Đổi Tiền Crypto - Giá Bitcoin, Ethereum, Tether hôm nay',
  description: 'Chuyển đổi Bitcoin, Ethereum và 12+ loại cryptocurrency phổ biến sang USD, VND. Giá crypto thời gian thực từ CoinGecko. Miễn phí và nhanh chóng.',
  keywords: 'giá bitcoin, giá ethereum, chuyển đổi crypto, bitcoin sang usd, cryptocurrency converter, btc to usd',
  alternates: {
    canonical: 'https://chuyendoitien.com/crypto',
  },
  openGraph: {
    title: 'Chuyển Đổi Crypto - Giá Bitcoin, Ethereum thời gian thực',
    description: 'Công cụ chuyển đổi Bitcoin, Ethereum và cryptocurrency với giá cập nhật liên tục',
    url: 'https://chuyendoitien.com/crypto',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chuyển Đổi Crypto - Giá Bitcoin hôm nay',
    description: 'Giá Bitcoin, Ethereum và 12+ crypto cập nhật real-time',
  },
};

const cryptoFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Giá Bitcoin hôm nay là bao nhiêu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Giá Bitcoin được cập nhật tự động mỗi 2 giờ từ CoinGecko API. Bạn có thể xem giá Bitcoin hiện tại tính theo USD và VND trong công cụ chuyển đổi crypto của chúng tôi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hỗ trợ những loại cryptocurrency nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chúng tôi hỗ trợ hơn 12 loại cryptocurrency phổ biến bao gồm Bitcoin (BTC), Ethereum (ETH), Tether (USDT), BNB, Solana, XRP, Cardano, Dogecoin và nhiều coin khác.',
      },
    },
    {
      '@type': 'Question',
      name: 'Dữ liệu giá crypto lấy từ đâu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chúng tôi sử dụng CoinGecko API - một trong những nguồn dữ liệu cryptocurrency uy tín nhất thế giới với giá cập nhật từ hàng trăm sàn giao dịch.',
      },
    },
  ],
};

export default function CryptoPage() {
  return (
    <>
      <Script
        id="crypto-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cryptoFaqSchema) }}
      />
      <CryptoPageClient />
    </>
  );
}
