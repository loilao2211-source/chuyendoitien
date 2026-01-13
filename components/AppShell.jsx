import Navbar from '@/components/Navbar';
import Attribution from '@/components/Attribution';
import Disclaimer from '@/components/Disclaimer';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white/70 backdrop-blur py-6 mt-6">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <Attribution />
          <div className="text-xs text-gray-500 leading-relaxed">
            <p>Giá chỉ mang tính tham khảo. Vui lòng kiểm tra nguồn chính thức trước khi giao dịch.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
