import Script from "next/script";
import GoldLuongUsdTool from "@/components/seo/GoldLuongUsdTool";
import { getGoldUsdSnapshot, getUsdVndSnapshot, getVnGoldSnapshot } from "@/lib/seoSnapshots";

export const dynamic = "force-dynamic";

const title = "1 lượng vàng bằng bao nhiêu USD? Quy đổi vàng sang đô la";
const description =
  "1 lượng vàng bằng bao nhiêu USD? Công cụ tự động lấy giá vàng Việt Nam, tỷ giá USD/VND và giá XAU/USD để quy đổi trực tiếp.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "https://chuyendoitien.com/1-luong-vang-bao-nhieu-usd",
  },
  openGraph: {
    title,
    description,
    url: "https://chuyendoitien.com/1-luong-vang-bao-nhieu-usd",
    type: "article",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "1 lượng vàng bằng bao nhiêu chỉ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1 lượng vàng bằng 10 chỉ, tương đương 37,5 gram vàng.",
      },
    },
    {
      "@type": "Question",
      name: "Vì sao giá vàng Việt Nam quy USD khác giá vàng thế giới?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Giá vàng Việt Nam chịu ảnh hưởng bởi thương hiệu, cung cầu nội địa và chênh lệch mua bán; còn giá vàng thế giới thường được niêm yết theo troy ounce XAU/USD.",
      },
    },
  ],
};

export default async function Page() {
  const [vnGoldSnapshot, fxSnapshot, goldSnapshot] = await Promise.all([
    getVnGoldSnapshot(),
    getUsdVndSnapshot(),
    getGoldUsdSnapshot(),
  ]);
  const sjc = vnGoldSnapshot.items.find((item) => item.brand === "SJC") || vnGoldSnapshot.items[0] || null;

  return (
    <>
      <Script
        id="faq-1-luong-vang-usd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GoldLuongUsdTool
        initialLuong={1}
        initialVnGold={sjc}
        initialUsdToVnd={fxSnapshot.rate}
        initialXauUsd={goldSnapshot.xauUsd}
        initialUpdatedAt={vnGoldSnapshot.updatedAt || fxSnapshot.updatedAt}
      />
    </>
  );
}
