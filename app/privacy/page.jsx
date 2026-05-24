export const metadata = {
  title: "Chính sách riêng tư | ChuyenDoiTien",
  description: "Chính sách riêng tư của ChuyenDoiTien về analytics, cookie và dữ liệu người dùng.",
  alternates: {
    canonical: "https://chuyendoitien.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-950">Chính sách riêng tư</h1>
      <p className="text-gray-700 leading-8">
        ChuyenDoiTien sử dụng công cụ phân tích như Google Analytics để hiểu cách người dùng truy cập website và cải thiện
        trải nghiệm. Dữ liệu phân tích thường ở dạng tổng hợp, không nhằm nhận diện cá nhân cụ thể.
      </p>
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-950">Cookie và analytics</h2>
        <p className="text-gray-700 leading-8">
          Trình duyệt có thể lưu cookie phục vụ thống kê truy cập, đo hiệu năng hoặc ghi nhớ lựa chọn giao diện. Bạn có thể
          chặn hoặc xóa cookie trong cài đặt trình duyệt.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-950">Liên kết bên thứ ba</h2>
        <p className="text-gray-700 leading-8">
          Website có thể chứa liên kết tới nguồn dữ liệu hoặc đối tác. Khi rời khỏi ChuyenDoiTien, chính sách riêng tư của
          website bên thứ ba sẽ được áp dụng.
        </p>
      </section>
    </main>
  );
}

