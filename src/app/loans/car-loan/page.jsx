// ─────────────────────────────────────────────────────────────
// app/loans/car-loan/page.jsx  →  SERVER COMPONENT
// ─────────────────────────────────────────────────────────────

import CarLoanCalculator from './CarLoanCalculator';

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata = {
  title: 'Car Loan EMI Calculator | My Wealth Circle',
  description:
    'Calculate car loan EMI with on-road price, RTO charges, insurance, and full amortization schedule. Free car loan calculator India.',
  keywords: 'car loan EMI calculator, auto loan calculator, car loan India, on-road price calculator',
  openGraph: {
    title: 'Car Loan EMI Calculator | My Wealth Circle',
    description: 'Calculate car loan EMI with on-road price and amortization schedule.',
    type: 'website',
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Car Loan EMI Calculator',
  url: 'https://mywealthcircle.in/loans/car-loan',
  description: 'Calculate car loan EMI with on-road price, RTO and insurance.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

// ─── Page ─────────────────────────────────────────────────────
export default function CarLoanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <CarLoanCalculator />
    </>
  );
}