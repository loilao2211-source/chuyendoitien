import Script from "next/script";
import UsdVndAmountTool from "@/components/seo/UsdVndAmountTool";
import { getUsdVndSnapshot } from "@/lib/seoSnapshots";

export const dynamic = "force-dynamic";

const title = "50 USD bằng bao nhiêu tiền Việt? Quy đổi 50 đô sang VND";
const description =
  "50 USD bằng bao nhiêu VND hôm nay? Công cụ tự động lấy tỷ giá USD/VND mới nhất và quy đổi trực tiếp 50 đô la Mỹ sang tiền Việt.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "https://chuyendoitien.com/50-usd-vnd",
  },
  openGraph: {
    title,
    description,
    url: "https://chuyendoitien.com/50-usd-vnd",
    type: "article",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "50 USD bằng bao nhiêu tiền Việt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trang này tự động lấy tỷ giá USD/VND mới nhất từ API của công cụ và nhân với 50 để ra số tiền VND tham khảo.",
      },
    },
    {
      "@type": "Question",
      name: "Kết quả 50 USD sang VND có phải số tiền thực nhận không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Không hoàn toàn. Số tiền thực nhận có thể thấp hơn do phí, chênh lệch mua bán và tỷ giá của từng ngân hàng hoặc dịch vụ đổi tiền.",
      },
    },
  ],
};

export default async function Page() {
  const snapshot = await getUsdVndSnapshot();

  return (
    <>
      <Script
        id="faq-50-usd-vnd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <UsdVndAmountTool
        initialAmount={50}
        initialRate={snapshot.rate}
        initialUpdatedAt={snapshot.updatedAt}
        initialSource={snapshot.source}
      />
    </>
  );
}
