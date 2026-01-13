import CryptoPageClient from './CryptoPageClient';

export const metadata = {
  title: 'Crypto Converter - Bitcoin, Ethereum, Tether | PriceConverter',
  description: 'Convert cryptocurrencies in real-time. Bitcoin to USD, Ethereum, and 12+ other major cryptocurrencies. Free and instant conversion.',
  keywords: 'crypto converter, bitcoin price, ethereum price, cryptocurrency converter, BTC to USD',
  openGraph: {
    title: 'Cryptocurrency Converter - Real-Time Crypto Prices',
    description: 'Convert between Bitcoin, Ethereum, and other cryptocurrencies instantly',
    type: 'website',
  },
  canonical: 'https://priceconverter.vercel.app/crypto',
};

export default function CryptoPage() {
  return <CryptoPageClient />;
}
