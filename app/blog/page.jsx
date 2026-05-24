import Link from "next/link";
import { blogCategories, blogPosts, blogSeoClusters } from "@/lib/blogPosts";

export const metadata = {
  title: "Blog tiền tệ, giá vàng, tỷ giá và dữ liệu thị trường | ChuyenDoiTien",
  description:
    "Trung tâm kiến thức về USD/VND, giá vàng SJC, PNJ, DOJI, USDT/VND, dầu thế giới và cách đọc dữ liệu giá cho người Việt.",
  alternates: {
    canonical: "https://chuyendoitien.com/blog",
  },
  openGraph: {
    title: "Blog tiền tệ, giá vàng, tỷ giá và dữ liệu thị trường | ChuyenDoiTien",
    description:
      "Các bài hướng dẫn evergreen kết hợp công cụ quy đổi để trả lời nhanh nhu cầu tìm kiếm về tiền tệ, vàng, crypto và dầu.",
    url: "https://chuyendoitien.com/blog",
    type: "website",
  },
};

const marketBriefs = [
  {
    label: "USD/VND",
    value: "Tỷ giá tham khảo",
    href: "/currency",
    note: "Mở trang tiền tệ để xem công cụ quy đổi, bảng tỷ giá và biểu đồ.",
  },
  {
    label: "Vàng Việt Nam",
    value: "SJC, PNJ, DOJI",
    href: "/gold",
    note: "Mở trang vàng để xem XAU/USD, SJC, PNJ, DOJI và công cụ đổi đơn vị.",
  },
  {
    label: "USDT/VND",
    value: "Crypto sang tiền Việt",
    href: "/crypto",
    note: "Mở trang crypto để xem BTC, ETH, USDT và quy đổi sang VND.",
  },
  {
    label: "Dầu",
    value: "Brent & WTI",
    href: "/oil",
    note: "Mở trang dầu để xem Brent, WTI, biểu đồ và quy đổi thùng/lít/gallon.",
  },
];

const toolLinks = [
  { href: "/100-usd-vnd", label: "100 USD to VND" },
  { href: "/50-usd-vnd", label: "50 USD to VND" },
  { href: "/1-chi-vang-bao-nhieu-tien", label: "1 chỉ vàng" },
  { href: "/1-luong-vang-bao-nhieu-usd", label: "1 lượng vàng sang USD" },
  { href: "/phuong-phap-du-lieu", label: "Nguồn dữ liệu" },
];

const formatDate = (value) => new Date(value).toLocaleDateString("vi-VN");

export default function BlogPage() {
  const [leadPost, secondPost, thirdPost, ...remainingPosts] = blogPosts;

  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img
          src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1800&q=80"
          alt="Bàn làm việc tài chính với tiền, biểu đồ và máy tính"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-300">
              Vietnam money intelligence
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Blog tiền tệ, giá vàng và tỷ giá cho người Việt
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-100 md:text-lg">
              Không chỉ đăng bài ngắn. Đây là hub kiến thức gắn trực tiếp với công cụ quy đổi:
              đọc bối cảnh, kiểm tra nguồn dữ liệu, rồi tính ngay con số bạn cần.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {toolLinks.slice(0, 4).map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-md border border-white/25 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3 self-end">
            {marketBriefs.map((brief) => (
              <Link
                key={brief.href}
                href={brief.href}
                className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur hover:bg-white/15"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                    {brief.label}
                  </p>
                  <span className="text-xs font-semibold text-slate-200">Mở chuyên mục</span>
                </div>
                <p className="mt-2 text-xl font-bold">{brief.value}</p>
                <p className="mt-1 text-sm leading-6 text-slate-200">{brief.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <Link href={`/blog/${leadPost.slug}`} className="block">
              <img src={leadPost.image} alt={leadPost.imageAlt} className="h-80 w-full object-cover" />
            </Link>
            <div className="p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
                Bài nền tảng
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
                <Link href={`/blog/${leadPost.slug}`} className="hover:text-indigo-700">
                  {leadPost.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-3xl leading-8 text-slate-700">{leadPost.description}</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-slate-500">
                  {leadPost.category} · {formatDate(leadPost.updatedAt)} · {leadPost.readingTime}
                </span>
                <Link
                  href={`/blog/${leadPost.slug}`}
                  className="rounded-md bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  Đọc phân tích
                </Link>
              </div>
            </div>
          </article>

          <div className="grid gap-5">
            {[secondPost, thirdPost].map((post) => (
              <article key={post.slug} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <Link href={`/blog/${post.slug}`} className="block">
                  <img src={post.image} alt={post.imageAlt} className="h-40 w-full object-cover" />
                </Link>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
                    {post.category}
                  </p>
                  <h3 className="mt-2 text-xl font-bold leading-snug text-slate-950">
                    <Link href={`/blog/${post.slug}`} className="hover:text-indigo-700">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{post.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-700">
                SEO topic clusters
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Cụm nội dung đang xây để kéo traffic</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Mỗi cụm nhắm vào một nhóm truy vấn có nhu cầu rõ: trả lời nhanh, so sánh thị trường,
              hoặc kiểm tra độ tin cậy dữ liệu trước khi giao dịch.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {blogSeoClusters.map((cluster) => (
              <div key={cluster.label} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-bold text-slate-950">{cluster.label}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cluster.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-700">
              Chuyên mục
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Đọc theo nhu cầu thị trường</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {blogCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:bg-indigo-50"
            >
              <h3 className="text-xl font-bold text-slate-950">{category.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-700">
              Bài viết mới và evergreen
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Kiến thức có thể dùng ngay với tool</h2>
          </div>
          <Link href="/phuong-phap-du-lieu" className="text-sm font-bold text-indigo-700 hover:text-indigo-900">
            Xem phương pháp dữ liệu
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {remainingPosts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <img src={post.image} alt={post.imageAlt} className="h-44 w-full object-cover" />
              </Link>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
                    {post.category}
                  </p>
                  <span className="text-xs font-semibold text-slate-500">{post.readingTime}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold leading-snug text-slate-950">
                  <Link href={`/blog/${post.slug}`} className="hover:text-indigo-700">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{post.description}</p>
                <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                  Intent: {post.intent}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-white md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">
              Công cụ liên quan
            </p>
            <h2 className="mt-3 text-3xl font-bold">Đọc xong có thể tính ngay</h2>
            <p className="mt-3 leading-8 text-slate-300">
              Blog không tách rời sản phẩm. Mỗi bài đều dẫn người đọc về công cụ quy đổi hoặc trang dữ liệu
              để tăng thời gian ở lại và khả năng quay lại website.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {toolLinks.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-lg border border-white/15 bg-white/10 px-4 py-4 font-bold hover:bg-white/15"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
