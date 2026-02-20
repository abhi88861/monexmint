// ─────────────────────────────────────────────────────────────
// app/loans/personal-loan/page.jsx  →  SERVER COMPONENT
// ─────────────────────────────────────────────────────────────

import PersonalLoanCalculator from './PersonalLoanCalculator';

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata = {
  title: 'Personal Loan EMI Calculator | My Wealth Circle',
  description:
    'Calculate personal loan EMI with processing fee, effective APR, and full amortization schedule. Free unsecured loan calculator India.',
  keywords: 'personal loan EMI calculator, unsecured loan calculator, personal loan India, effective APR calculator',
  openGraph: {
    title: 'Personal Loan EMI Calculator | My Wealth Circle',
    description: 'Calculate personal loan EMI with effective APR and amortization schedule.',
    type: 'website',
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Personal Loan EMI Calculator',
  url: 'https://mywealthcircle.in/loans/personal-loan',
  description: 'Calculate personal loan EMI with processing fee and effective APR.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

// ─── Page ─────────────────────────────────────────────────────
export default function PersonalLoanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <PersonalLoanCalculator />
    </>
  );
}