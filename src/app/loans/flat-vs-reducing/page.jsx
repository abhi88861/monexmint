import FlatVsReducingCalculator from './flatvsreducingcalculator';

export const metadata = {
  title: 'Flat vs Reducing Interest Rate Calculator | My Wealth Circle',
  description:
    'Compare flat rate vs reducing balance rate on your loan. Find the equivalent reducing rate for any flat rate loan.',
  keywords: 'flat rate vs reducing rate, loan interest comparison calculator India',
  openGraph: {
    title: 'Flat vs Reducing Interest Rate Calculator | My Wealth Circle',
    description: 'Compare flat rate vs reducing balance rate on your loan.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Flat vs Reducing Interest Rate Calculator',
  url: 'https://mywealthcircle.in/loans/flat-vs-reducing',
  description: 'Compare flat rate vs reducing balance interest rate on loans.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function FlatVsReducingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <FlatVsReducingCalculator />
    </>
  );
}