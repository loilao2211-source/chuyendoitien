export const metadata = {
  title: "Liên hệ | ChuyenDoiTien",
  description: "Liên hệ ChuyenDoiTien để góp ý dữ liệu, báo lỗi hoặc trao đổi hợp tác nội dung.",
  alternates: {
    canonical: "https://chuyendoitien.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-950">Liên hệ</h1>
      <p className="text-gray-700 leading-8">
        Nếu bạn phát hiện dữ liệu sai, nguồn không cập nhật hoặc muốn góp ý tính năng, hãy liên hệ qua email:
      </p>
      <p className="rounded-lg border border-gray-200 bg-white p-4 font-semibold text-gray-950">
        contact@chuyendoitien.com
      </p>
      <p className="text-sm text-gray-600">
        Khi báo lỗi dữ liệu, vui lòng gửi kèm URL trang, thời điểm kiểm tra và ảnh chụp nếu có.
      </p>
    </main>
  );
}

