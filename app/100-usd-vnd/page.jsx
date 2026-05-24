import Script from "next/script";
import UsdVndAmountTool from "@/components/seo/UsdVndAmountTool";
import { getUsdVndSnapshot } from "@/lib/seoSnapshots";

export const dynamic = "force-dynamic";

const title = "100 USD bằng bao nhiêu tiền Việt? Quy đổi 100 đô sang VND";
const description =
  "100 USD bằng bao nhiêu VND hôm nay? Công cụ tự động lấy tỷ giá USD/VND mới nhất và quy đổi trực tiếp 100 đô la Mỹ sang tiền Việt.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "https://chuyendoitien.com/100-usd-vnd",
  },
  openGraph: {
    title,
    description,
    url: "https://chuyendoitien.com/100-usd-vnd",
    type: "article",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "100 USD bằng bao nhiêu tiền Việt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trang này tự động lấy tỷ giá USD/VND mới nhất từ API của công cụ và nhân với 100 để ra số tiền VND tham khảo.",
      },
    },
    {
      "@type": "Question",
      name: "Đổi 100 USD ở ngân hàng có giống kết quả trên trang không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Có thể khác. Ngân hàng và dịch vụ đổi tiền áp dụng tỷ giá mua bán riêng, nên số tiền thực nhận thường chênh lệch so với tỷ giá tham khảo.",
      },
    },
  ],
};

export default async function Page() {
  const snapshot = await getUsdVndSnapshot();

  return (
    <>
      <Script
        id="faq-100-usd-vnd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <UsdVndAmountTool
        initialAmount={100}
        initialRate={snapshot.rate}
        initialUpdatedAt={snapshot.updatedAt}
        initialSource={snapshot.source}
      />
    </>
  );
}
