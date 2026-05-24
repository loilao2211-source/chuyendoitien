import Script from 'next/script';
import UsdtVndPageClient from './UsdtVndPageClient';

export const metadata = {
  title: 'Tỷ Giá USDT Sang VND Hôm Nay | So Sánh USDT vs USD Tại Việt Nam',
  description: '1 USDT = ? VND. So sánh tỷ giá USDT và USD khi đổi sang VND tại Việt Nam. Hợp pháp? Đổi ở đâu an toàn? Chênh lệch bao nhiêu?',
  keywords: 'tỷ giá usdt vnd, usdt sang vnd, đổi usdt sang vnd, usdt vietnam, tether vnd',
  alternates: {
    canonical: 'https://chuyendoitien.com/usdt-vnd',
  },
  openGraph: {
    title: 'Tỷ Giá USDT/VND Hôm Nay - So Sánh USD vs USDT',
    description: 'USDT có lợi hơn USD khi đổi sang VND? So sánh chi tiết.',
    url: 'https://chuyendoitien.com/usdt-vnd',
    type: 'article',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Đổi USDT sang VND có hợp pháp tại Việt Nam không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vùng xám pháp lý. Việt Nam chưa công nhận cryptocurrency là phương tiện thanh toán hợp pháp, nhưng không cấm giao dịch P2P. Rủi ro: không được bảo vệ pháp lý nếu bị lừa đảo, khó chứng minh nguồn gốc tiền, ngân hàng có thể phong tỏa tài khoản.',
      },
    },
    {
      '@type': 'Question',
      name: 'Chênh lệch giữa USDT và USD khi đổi sang VND là bao nhiêu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'USDT thường tốt hơn USD tiền mặt khoảng 50-150 VND/đô la tại Việt Nam. Ví dụ: USD tiền mặt đổi được 24,850 VND thì USDT đổi được 24,950-25,000 VND qua sàn P2P uy tín.',
      },
    },
    {
      '@type': 'Question',
      name: 'Nên dùng sàn nào để đổi USDT sang VND tại Việt Nam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An toàn nhất: Binance P2P (nhiều người bán uy tín, bảo vệ escrow), Remitano (sàn có trụ sở tại Việt Nam), OKX P2P (tỷ giá cạnh tranh). Tránh giao dịch trực tiếp qua Telegram/Facebook.',
      },
    },
  ],
};

export default function UsdtVndPage() {
  return (
    <>
      <Script
        id="usdt-vnd-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <UsdtVndPageClient />
    </>
  );
}
