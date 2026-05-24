export const metadata = {
  title: "Giới thiệu ChuyenDoiTien | Công cụ quy đổi cho người Việt",
  description:
    "ChuyenDoiTien là công cụ tham khảo tỷ giá, vàng, crypto và xăng dầu cho người dùng Việt Nam.",
  alternates: {
    canonical: "https://chuyendoitien.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-950">Giới thiệu ChuyenDoiTien</h1>
      <p className="text-gray-700 leading-8">
        ChuyenDoiTien là website công cụ giúp người dùng Việt Nam tra cứu và quy đổi nhanh các giá trị tài chính phổ biến:
        USD/VND, crypto, vàng, xăng dầu và một số đơn vị liên quan.
      </p>
      <p className="text-gray-700 leading-8">
        Website tập trung vào tính minh bạch: hiển thị nguồn dữ liệu, thời điểm cập nhật, công thức tính và cảnh báo khi
        kết quả chỉ nên dùng để tham khảo.
      </p>
      <p className="text-gray-700 leading-8">
        ChuyenDoiTien không phải ngân hàng, sàn giao dịch, đơn vị môi giới hay cố vấn tài chính.
      </p>
    </main>
  );
}

