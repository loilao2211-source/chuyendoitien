import Script from "next/script";
import GiaVangHomNayPageClient from "./GiaVangHomNayPageClient.jsx";

export const metadata = {
  title: "Giá vàng hôm nay | XAU/USD, SJC, chỉ và lượng vàng",
  description:
    "Xem giá vàng thế giới XAU/USD, quy đổi sang VND/oz, VND/chỉ, VND/lượng và so sánh với giá vàng SJC, PNJ, DOJI tại Việt Nam.",
  keywords:
    "giá vàng hôm nay, giá vàng thế giới, giá vàng sjc, xau usd, 1 chỉ vàng bao nhiêu tiền, 1 lượng vàng bao nhiêu tiền",
  alternates: {
    canonical: "https://chuyendoitien.com/gia-vang-hom-nay",
  },
  openGraph: {
    title: "Giá vàng hôm nay - XAU/USD và vàng Việt Nam",
    description:
      "Quy đổi giá vàng thế giới sang đơn vị Việt Nam và so sánh với giá vàng trong nước.",
    url: "https://chuyendoitien.com/gia-vang-hom-nay",
    type: "article",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Giá vàng thế giới và giá vàng SJC khác nhau thế nào?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Giá vàng thế giới thường được niêm yết theo XAU/USD cho 1 troy ounce. Giá vàng SJC tại Việt Nam là giá mua vào và bán ra theo lượng, chịu thêm cung cầu trong nước, thương hiệu, chênh lệch mua bán và chính sách từng đơn vị.",
      },
    },
    {
      "@type": "Question",
      name: "1 oz vàng bằng bao nhiêu chỉ và lượng?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1 troy ounce vàng bằng khoảng 31,1035 gram. Tại Việt Nam, 1 chỉ bằng 3,75 gram và 1 lượng bằng 37,5 gram, nên 1 oz bằng khoảng 8,294 chỉ hoặc 0,829 lượng.",
      },
    },
    {
      "@type": "Question",
      name: "Nên dùng giá mua vào hay bán ra khi tính vàng?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nếu bạn muốn mua vàng, hãy xem giá bán ra. Nếu bạn muốn bán vàng, hãy xem giá mua vào. Chênh lệch giữa hai mức này là chi phí quan trọng cần tính trước khi giao dịch.",
      },
    },
  ],
};

export default function GiaVangHomNayPage() {
  return (
    <>
      <Script
        id="gia-vang-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GiaVangHomNayPageClient />
    </>
  );
}
