import OilPageClient from './OilPageClient';

export const metadata = {
  title: 'Oil Price Converter - Brent & WTI Crude Prices | PriceConverter',
  description: 'Real-time crude oil prices (Brent & WTI). Convert barrels to liters and gallons. Live oil rates with 2-hour caching.',
  keywords: 'oil price, crude oil, Brent oil, WTI oil, oil converter, barrel to liter',
  openGraph: {
    title: 'Oil Price Converter - Brent & WTI Rates',
    description: 'Convert oil prices and units instantly with market data',
    type: 'website',
  },
  canonical: 'https://priceconverter.vercel.app/oil',
};

export default function OilPage() {
  return <OilPageClient />;
}
