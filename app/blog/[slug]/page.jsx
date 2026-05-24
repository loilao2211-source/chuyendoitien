import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/lib/blogPosts";

const categoryFaqs = {
  "USD/VND": [
    {
      question: "Tỷ giá trên công cụ có dùng để giao dịch ngay không?",
      answer:
        "Không nên xem là giá chốt giao dịch. Đây là tỷ giá tham khảo để ước tính nhanh; khi giao dịch thật bạn cần kiểm tra giá mua vào, bán ra và phí tại ngân hàng hoặc dịch vụ đang dùng.",
    },
    {
      question: "Vì sao cùng USD/VND nhưng mỗi nơi một giá?",
      answer:
        "Mỗi nơi có nguồn dữ liệu, spread, phí và mục đích giao dịch khác nhau. Ngân hàng, tiệm vàng, API thị trường và P2P thường không thể trùng tuyệt đối.",
    },
  ],
  "Tỷ giá": [
    {
      question: "Nên xem tỷ giá trong bao lâu trước khi đổi tiền?",
      answer:
        "Nếu số tiền nhỏ, tra tại thời điểm giao dịch thường là đủ. Nếu số tiền lớn, nên theo dõi vài ngày và so sánh thêm phí, spread và thời điểm chốt giá.",
    },
    {
      question: "Kết quả quy đổi có bao gồm phí chưa?",
      answer:
        "Thông thường chưa. Công cụ quy đổi cho giá trị tham khảo theo tỷ giá; phí chuyển tiền, phí rút, phí thẻ hoặc spread giao dịch cần được kiểm tra riêng.",
    },
  ],
  "Vàng": [
    {
      question: "Nên dùng giá mua vào hay bán ra khi tính vàng?",
      answer:
        "Nếu bạn mua vàng, hãy dùng giá bán ra. Nếu bạn bán vàng, hãy dùng giá mua vào. Dùng sai chiều giá sẽ làm kết quả lệch đáng kể.",
    },
    {
      question: "Giá vàng trong nước có giống XAU/USD không?",
      answer:
        "Không hoàn toàn. XAU/USD là giá vàng thế giới theo troy ounce, còn giá SJC, PNJ, DOJI tại Việt Nam theo lượng và chịu thêm cung cầu, thương hiệu, spread mua bán.",
    },
  ],
  Crypto: [
    {
      question: "USDT có luôn bằng đúng 1 USD không?",
      answer:
        "USDT thường neo quanh 1 USD nhưng khi đổi sang VND có thể lệch do cung cầu, phí sàn, phương thức thanh toán và rủi ro P2P.",
    },
    {
      question: "Có nên chỉ chọn nơi có tỷ giá USDT/VND cao nhất?",
      answer:
        "Không nên. Tỷ giá cao có thể đi kèm rủi ro đối tác, phí ẩn, thời gian xử lý lâu hoặc điều kiện giao dịch khó hơn.",
    },
  ],
  "Dầu": [
    {
      question: "Giá dầu Brent/WTI có quyết định trực tiếp giá xăng Việt Nam không?",
      answer:
        "Không trực tiếp. Giá xăng trong nước còn chịu thuế, phí, chi phí phân phối, tỷ giá USD/VND và kỳ điều hành.",
    },
    {
      question: "Nên xem giá dầu theo ngày hay theo xu hướng?",
      answer:
        "Nên xem xu hướng nhiều ngày. Một phiên tăng giảm ngắn hạn chưa đủ để kết luận giá xăng trong nước sẽ thay đổi ngay.",
    },
  ],
};

function getFaqs(post) {
  return post.faqs || categoryFaqs[post.category] || [
    {
      question: "Nội dung này nên dùng như thế nào?",
      answer:
        "Hãy dùng như tài liệu tham khảo để hiểu cách đọc dữ liệu và kiểm tra lại bằng công cụ liên quan trước khi ra quyết định giao dịch.",
    },
    {
      question: "Khi nào cần kiểm tra lại nguồn chính thức?",
      answer:
        "Khi bạn chuẩn bị giao dịch thật, đặc biệt với số tiền lớn, vàng, crypto hoặc chuyển tiền quốc tế.",
    },
  ];
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Bài viết không tồn tại | ChuyenDoiTien",
    };
  }

  return {
    title: `${post.title} | ChuyenDoiTien`,
    description: post.description,
    alternates: {
      canonical: `https://chuyendoitien.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://chuyendoitien.com/blog/${post.slug}`,
      type: "article",
      images: [
        {
          url: post.image,
          alt: post.imageAlt,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug);
  const faqs = getFaqs(post);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.updatedAt,
    dateModified: post.updatedAt,
    inLanguage: "vi-VN",
    mainEntityOfPage: `https://chuyendoitien.com/blog/${post.slug}`,
    author: {
      "@type": "Organization",
      name: "ChuyenDoiTien",
    },
    publisher: {
      "@type": "Organization",
      name: "ChuyenDoiTien",
      url: "https://chuyendoitien.com",
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article>
        <header className="relative overflow-hidden bg-slate-950 text-white">
          <img src={post.image} alt={post.imageAlt} className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="relative mx-auto max-w-4xl px-4 py-16 md:py-24">
            <Link href="/blog" className="text-sm font-semibold text-cyan-200 hover:text-white">
              Blog
            </Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
              {post.category}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">{post.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-100">{post.description}</p>
            <p className="mt-6 text-sm text-slate-200">
              Cập nhật {new Date(post.updatedAt).toLocaleDateString("vi-VN")} · {post.readingTime}
            </p>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[270px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Trong bài này
              </p>
              <div className="mt-4 space-y-3">
                <a
                  href="#quick-answer"
                  className="block text-sm font-semibold leading-6 text-slate-700 hover:text-indigo-700"
                >
                  Trả lời nhanh
                </a>
                {post.sections.map((section, index) => (
                  <a
                    key={section.heading}
                    href={`#section-${index}`}
                    className="block text-sm font-semibold leading-6 text-slate-700 hover:text-indigo-700"
                  >
                    {section.heading}
                  </a>
                ))}
                <a
                  href="#faq"
                  className="block text-sm font-semibold leading-6 text-slate-700 hover:text-indigo-700"
                >
                  Câu hỏi thường gặp
                </a>
              </div>
            </nav>

            {post.intent && (
              <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-5 text-sm leading-7 text-indigo-950">
                <p className="font-bold">Search intent</p>
                <p className="mt-1">{post.intent}</p>
              </div>
            )}
          </aside>

          <div className="space-y-8">
            <section id="quick-answer" className="rounded-lg border border-indigo-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
                Trả lời nhanh
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">{post.title}</h2>
              <p className="text-xl leading-9 text-slate-800">{post.intro}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Chủ đề</p>
                  <p className="mt-2 font-bold text-slate-950">{post.category}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Cập nhật</p>
                  <p className="mt-2 font-bold text-slate-950">{new Date(post.updatedAt).toLocaleDateString("vi-VN")}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Thời gian đọc</p>
                  <p className="mt-2 font-bold text-slate-950">{post.readingTime}</p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-6">
              <h2 className="text-xl font-bold text-slate-950">Điểm chính cần nhớ</h2>
              <ul className="mt-4 space-y-3 text-slate-800">
                {post.takeaways.map((item) => (
                  <li key={item} className="flex gap-3 leading-7">
                    <span className="mt-2 h-2 w-2 flex-none rounded-full bg-cyan-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <AdSlot
              slot={process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_TOP_SLOT}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            />

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Bảng kiểm trước khi áp dụng
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  "Xác định đúng mục đích: tham khảo, mua, bán hay chuyển tiền.",
                  "Kiểm tra nguồn dữ liệu và thời điểm cập nhật.",
                  "So sánh thêm phí, spread và điều kiện giao dịch thật.",
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              {post.sections.map((section, index) => (
                <section key={section.heading} id={`section-${index}`} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold leading-tight text-slate-950 md:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-8 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </section>

            <AdSlot
              slot={process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_MID_SLOT}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            />

            <section className="rounded-lg border border-indigo-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
                Tính ngay bằng công cụ
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Không cần tự nhập lại công thức</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {post.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <span className="font-bold text-indigo-700">{tool.label}</span>
                    <span className="mt-2 block text-sm leading-6 text-slate-600">{tool.description}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section id="faq" className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
                FAQ
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Câu hỏi thường gặp</h2>
              <div className="mt-5 divide-y divide-slate-100">
                {faqs.map((faq) => (
                  <section key={faq.question} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="font-bold text-slate-950">{faq.question}</h3>
                    <p className="mt-2 leading-7 text-slate-700">{faq.answer}</p>
                  </section>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
              Nội dung này chỉ nhằm giải thích cách đọc dữ liệu và sử dụng công cụ. Đây không phải lời
              khuyên tài chính, đầu tư, pháp lý hoặc thuế. Khi giao dịch thật, hãy kiểm tra điều kiện cuối
              cùng tại ngân hàng, sàn, cửa hàng hoặc đơn vị dịch vụ bạn sử dụng.
            </section>
          </div>
        </div>
      </article>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">
              Đọc tiếp
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Bài viết liên quan</h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-indigo-700 hover:text-indigo-900">
            Xem tất cả
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {relatedPosts.map((relatedPost) => (
            <article key={relatedPost.slug} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <Link href={`/blog/${relatedPost.slug}`}>
                <img
                  src={relatedPost.image}
                  alt={relatedPost.imageAlt}
                  className="h-40 w-full object-cover"
                />
              </Link>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
                  {relatedPost.category}
                </p>
                <h3 className="mt-2 font-bold leading-snug text-slate-950">
                  <Link href={`/blog/${relatedPost.slug}`} className="hover:text-indigo-700">
                    {relatedPost.title}
                  </Link>
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
