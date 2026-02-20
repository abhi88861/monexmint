import LumpsumCalculator from './LumpsumCalculator';

export const metadata = {
  title: 'Lumpsum Calculator | My Wealth Circle',
  description:
    'Calculate lumpsum mutual fund investment returns. One-time investment future value calculator India.',
  keywords: 'lumpsum calculator, one time investment calculator, mutual fund lumpsum India',
  openGraph: {
    title: 'Lumpsum Calculator | My Wealth Circle',
    description: 'Calculate lumpsum mutual fund investment returns. One-time investment future value calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lumpsum Investment Calculator',
  url: 'https://mywealthcircle.in/investments/lumpsum',
  description: 'Calculate the future value of a one-time lump sum investment.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function LumpsumPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <LumpsumCalculator />
    </>
  );
}