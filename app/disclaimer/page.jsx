export const metadata = {
  title: "Tuyên bố miễn trừ trách nhiệm | ChuyenDoiTien",
  description: "Tuyên bố miễn trừ trách nhiệm về dữ liệu tỷ giá, vàng, crypto và xăng dầu trên ChuyenDoiTien.",
  alternates: {
    canonical: "https://chuyendoitien.com/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-950">Tuyên bố miễn trừ trách nhiệm</h1>
      <p className="text-gray-700 leading-8">
        Dữ liệu trên ChuyenDoiTien chỉ mang tính tham khảo và có thể chậm, sai lệch hoặc khác với giá giao dịch thực tế.
      </p>
      <p className="text-gray-700 leading-8">
        ChuyenDoiTien không cung cấp lời khuyên tài chính, đầu tư, pháp lý hay thuế. Bạn cần tự kiểm tra với ngân hàng,
        doanh nghiệp vàng, sàn giao dịch hoặc nhà cung cấp dịch vụ trước khi thực hiện giao dịch.
      </p>
      <p className="text-gray-700 leading-8">
        ChuyenDoiTien không chịu trách nhiệm cho quyết định giao dịch, khoản lỗ, phí phát sinh hoặc bất kỳ hậu quả nào từ
        việc sử dụng thông tin trên website.
      </p>
    </main>
  );
}

