import PrepaymentCalculator from './prepaymentcalculator';

export const metadata = {
  title: 'Loan Prepayment & Foreclosure Calculator | My Wealth Circle',
  description:
    'Calculate interest saved and new tenure after loan prepayment. Free prepayment and foreclosure calculator India.',
  keywords: 'loan prepayment calculator, foreclosure savings, part payment calculator India',
  openGraph: {
    title: 'Loan Prepayment & Foreclosure Calculator | My Wealth Circle',
    description: 'Calculate interest saved and new tenure after loan prepayment.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Loan Prepayment & Foreclosure Calculator',
  url: 'https://mywealthcircle.in/loans/prepayment',
  description: 'Calculate interest saved and new tenure after loan prepayment.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function PrepaymentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <PrepaymentCalculator />
    </>
  );
}