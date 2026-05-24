import './globals.css';
import Navbar from '@/components/Navbar';
import Attribution from '@/components/Attribution';

export const metadata = {
  title: 'Chuyển Đổi Tiền - Công cụ quy đổi tiền tệ, vàng, crypto trực tuyến',
  description: 'Chuyển đổi tiền tệ (USD, VND), Bitcoin, vàng XAU, dầu thô với tỷ giá cập nhật theo thời gian thực. Công cụ miễn phí, nhanh chóng và chính xác.',
  keywords: 'chuyển đổi tiền, quy đổi tiền tệ, USD sang VND, giá vàng, giá Bitcoin, chuyendoitien',
  metadataBase: new URL('https://chuyendoitien.com'),
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://chuyendoitien.com',
  },
  openGraph: {
    title: 'Chuyển Đổi Tiền - Quy đổi tiền tệ, vàng, crypto miễn phí',
    description: 'Công cụ chuyển đổi tiền tệ, Bitcoin, vàng, dầu với tỷ giá trực tuyến cập nhật liên tục',
    url: 'https://chuyendoitien.com',
    siteName: 'ChuyenDoiTien',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chuyển Đổi Tiền - Quy đổi tiền tệ miễn phí',
    description: 'Chuyển đổi USD, VND, Bitcoin, vàng với tỷ giá thời gian thực',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ChuyenDoiTien',
  alternateName: 'Chuyển Đổi Tiền',
  url: 'https://chuyendoitien.com',
  description: 'Công cụ chuyển đổi tiền tệ, vàng, dầu và cryptocurrency trực tuyến với tỷ giá thời gian thực',
  inLanguage: 'vi-VN',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://chuyendoitien.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ChuyenDoiTien',
  applicationCategory: 'FinanceApplication',
  description: 'Ứng dụng web chuyển đổi tiền tệ, vàng, dầu và cryptocurrency với tỷ giá trực tuyến miễn phí',
  url: 'https://chuyendoitien.com',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'VND',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LYLNG1VS61"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LYLNG1VS61');
            `,
          }}
        />
        
        <link rel="alternate" hrefLang="vi" href="https://chuyendoitien.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://chuyendoitien.com/" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <Attribution />
          </div>
        </footer>
      </body>
    </html>
  );
}
