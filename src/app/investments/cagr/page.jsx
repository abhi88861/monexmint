import CAGRCalculator from './CAGRCalculator';

export const metadata = {
  title: 'CAGR Calculator | My Wealth Circle',
  description:
    'Calculate Compound Annual Growth Rate of any investment. Free CAGR calculator India.',
  keywords: 'CAGR calculator, compound annual growth rate, investment return calculator India',
  openGraph: {
    title: 'CAGR Calculator | My Wealth Circle',
    description: 'Calculate Compound Annual Growth Rate of any investment.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CAGR Calculator',
  url: 'https://mywealthcircle.in/investments/cagr',
  description: 'Calculate CAGR, find future value, or find required investment amount.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CAGRPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <CAGRCalculator />
    </>
  );
}