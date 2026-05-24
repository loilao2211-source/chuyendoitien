import Link from "next/link";

export const metadata = {
  title: "Phương pháp dữ liệu và nguồn tham chiếu | ChuyenDoiTien",
  description:
    "Cách ChuyenDoiTien thu thập, cache, fallback và hiển thị tỷ giá USD/VND, giá vàng, xăng dầu và crypto cho người dùng Việt Nam.",
  alternates: {
    canonical: "https://chuyendoitien.com/phuong-phap-du-lieu",
  },
};

const dataGroups = [
  {
    title: "Tỷ giá tiền tệ",
    source:
      "open.er-api.com cho USD/VND và các cặp phổ biến. Một số provider khác còn nằm trong code như phương án dự phòng.",
    refresh:
      "API route có cache/revalidate để giảm lỗi rate limit và giữ dữ liệu đủ mới cho nhu cầu tham khảo trong ngày.",
    caveat:
      "Đây là tỷ giá tham khảo, không phải giá mua/bán cuối cùng tại ngân hàng, tiệm vàng hoặc dịch vụ chuyển tiền.",
  },
  {
    title: "Crypto",
    source: "CoinGecko API cho giá crypto theo USD.",
    refresh: "Cache server để giảm rate limit và giữ tốc độ tải trang ổn định.",
    caveat:
      "Giá P2P tại Việt Nam có thể khác giá quốc tế do thanh khoản, phí sàn, phương thức thanh toán và spread mua bán.",
  },
  {
    title: "Vàng quốc tế",
    source:
      "Yahoo Finance hoặc Metals API khi khả dụng. Response luôn ghi source để dễ kiểm tra.",
    refresh:
      "Ưu tiên dữ liệu mới và có kiểm tra khoảng giá hợp lý cho XAU/USD trước khi hiển thị.",
    caveat:
      "XAU/USD là giá vàng quốc tế theo troy ounce, không thay thế giá vàng SJC/PNJ/DOJI trong nước.",
  },
  {
    title: "Vàng Việt Nam",
    source:
      "Ưu tiên giavang.now public API cho nhiều thương hiệu; nếu lỗi sẽ thử SJC XML, cuối cùng mới dùng snapshot trong data/vn-prices.json.",
    refresh:
      "Runtime API tự lấy nguồn live và cache khoảng 10 phút. File JSON chỉ còn vai trò fallback khi nguồn live không khả dụng.",
    caveat:
      "Giá mua/bán thực tế có thể khác theo cửa hàng, khu vực, sản phẩm và thời điểm giao dịch.",
  },
  {
    title: "Xăng dầu Việt Nam",
    source: "WebGia/Petrolimex cho giá bán lẻ; snapshot fallback nằm trong data/vn-prices.json.",
    refresh:
      "Có script npm run update:vn-prices và workflow GitHub Actions để cập nhật snapshot định kỳ.",
    caveat:
      "Mazut có thể dùng fallback nếu nguồn live không có dòng dữ liệu phù hợp.",
  },
  {
    title: "Dầu Brent/WTI",
    source: "EIA khi có API key; nếu chưa cấu hình key sẽ dùng fallback/demo data trong service.",
    refresh: "Cache để tránh gọi API quá nhiều.",
    caveat:
      "Không nên dùng giá dầu quốc tế để suy ra trực tiếp giá xăng Việt Nam vì còn thuế, phí và kỳ điều hành.",
  },
];

export default function PhuongPhapDuLieuPage() {
  return (
    <main className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase text-indigo-700">Minh bạch dữ liệu</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-950">
          Phương pháp dữ liệu và nguồn tham chiếu
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-700">
          ChuyenDoiTien là công cụ tham khảo, không phải đơn vị tài chính hay nơi niêm yết giá giao dịch.
          Trang này giải thích dữ liệu đến từ đâu, được cache thế nào và khi nào có thể sai lệch.
        </p>
      </section>

      <section className="grid gap-4">
        {dataGroups.map((group) => (
          <article key={group.title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-gray-950">{group.title}</h2>
            <dl className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
              <div>
                <dt className="font-semibold text-gray-950">Nguồn dữ liệu</dt>
                <dd>{group.source}</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-950">Cách cập nhật</dt>
                <dd>{group.refresh}</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-950">Giới hạn cần biết</dt>
                <dd>{group.caveat}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
        <h2 className="text-xl font-bold">Cách hiểu kết quả trên website</h2>
        <p className="mt-2">
          Mọi kết quả quy đổi là số tham khảo tại thời điểm cập nhật. Khi giao dịch thật, bạn cần kiểm tra
          giá cuối cùng với ngân hàng, sàn, doanh nghiệp vàng hoặc nhà cung cấp dịch vụ vì phí và chênh lệch
          mua bán có thể thay đổi.
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-xl font-bold text-gray-950">Snapshot Việt Nam dùng để làm gì?</h2>
        <p className="mt-2 text-gray-700">
          Dữ liệu snapshot nằm tại <code>data/vn-prices.json</code>. Với vàng Việt Nam, snapshot chỉ dùng khi
          nguồn live không truy cập được. Với xăng dầu, snapshot vẫn có thể được cập nhật bằng lệnh{" "}
          <code>npm run update:vn-prices</code> hoặc GitHub Actions.
        </p>
      </section>

      <section className="rounded-lg border border-indigo-100 bg-indigo-50 p-5">
        <h2 className="text-xl font-bold text-gray-950">Trang liên quan</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-indigo-700">
          <Link href="/disclaimer">Tuyên bố miễn trừ</Link>
          <Link href="/privacy">Chính sách riêng tư</Link>
          <Link href="/about">Giới thiệu</Link>
          <Link href="/contact">Liên hệ</Link>
        </div>
      </section>
    </main>
  );
}
