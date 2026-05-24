import Script from "next/script";
import GoldChiTool from "@/components/seo/GoldChiTool";
import { getVnGoldSnapshot } from "@/lib/seoSnapshots";

export const dynamic = "force-dynamic";

const title = "1 chỉ vàng bao nhiêu tiền hôm nay? Công cụ tính tự động";
const description =
  "1 chỉ vàng bao nhiêu tiền? Trang tự động lấy giá vàng Việt Nam mới nhất, chia theo đơn vị chỉ và cho phép đổi nhiều chỉ theo từng thương hiệu.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "https://chuyendoitien.com/1-chi-vang-bao-nhieu-tien",
  },
  openGraph: {
    title,
    description,
    url: "https://chuyendoitien.com/1-chi-vang-bao-nhieu-tien",
    type: "article",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "1 chỉ vàng bằng bao nhiêu lượng?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1 lượng vàng bằng 10 chỉ, vì vậy 1 chỉ bằng 0,1 lượng vàng.",
      },
    },
    {
      "@type": "Question",
      name: "Giá 1 chỉ vàng được tính như thế nào?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Giá 1 chỉ vàng = giá 1 lượng vàng chia 10. Trang này tự lấy giá vàng Việt Nam từ API rồi tính theo số chỉ người dùng nhập.",
      },
    },
  ],
};

export default async function Page() {
  const snapshot = await getVnGoldSnapshot();

  return (
    <>
      <Script
        id="faq-1-chi-vang"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GoldChiTool
        initialChi={1}
        initialItems={snapshot.items}
        initialUpdatedAt={snapshot.updatedAt}
      />
    </>
  );
}
