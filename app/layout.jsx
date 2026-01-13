import './globals.css';
import Navbar from '@/components/Navbar';
import Attribution from '@/components/Attribution';

export const metadata = {
  title: 'PriceConverter - Dashboard',
  description: 'Convert currency, crypto, gold, and oil prices with real-time rates',
  openGraph: {
    title: 'PriceConverter - Dashboard',
    description: 'Convert currency, crypto, gold, and oil prices with real-time rates',
  },
};

const financialSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'PriceConverter',
  description: 'Convert currency, crypto, gold, and oil prices with real-time rates.',
  url: 'https://priceconverter.vercel.app/',
  applicationCategory: 'FinanceApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  areaServed: { '@type': 'Country', name: 'Worldwide' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" hrefLang="en" href="https://priceconverter.vercel.app/" />
        <link rel="alternate" hrefLang="vi" href="https://priceconverter.vercel.app/" />
        <link rel="alternate" hrefLang="x-default" href="https://priceconverter.vercel.app/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(financialSchema) }}
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
