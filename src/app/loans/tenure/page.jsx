import LoanTenureCalculator from './tenurecalculator';

export const metadata = {
  title: 'Loan Tenure Calculator | My Wealth Circle',
  description:
    'Find the exact loan tenure for your desired EMI amount. Free loan tenure calculator India.',
  keywords: 'loan tenure calculator, EMI to tenure calculator India',
  openGraph: {
    title: 'Loan Tenure Calculator | My Wealth Circle',
    description: 'Find the exact loan tenure for your desired EMI amount.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Loan Tenure Calculator',
  url: 'https://mywealthcircle.in/loans/tenure',
  description: 'Calculate loan tenure from desired EMI amount.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function LoanTenurePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <LoanTenureCalculator />
    </>
  );
}