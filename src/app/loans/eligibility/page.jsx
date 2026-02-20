// ─────────────────────────────────────────────────────────────
// app/loans/eligibility/page.jsx  →  SERVER COMPONENT
// ─────────────────────────────────────────────────────────────

import LoanEligibilityCalculator from './LoanEligibilityCalculator';

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata = {
  title: 'Loan Eligibility Calculator | My Wealth Circle',
  description:
    'Check how much home or personal loan you are eligible for based on income, existing EMIs and FOIR. Free loan eligibility calculator India.',
  keywords: 'loan eligibility calculator, how much loan can I get, FOIR calculator, home loan eligibility India',
  openGraph: {
    title: 'Loan Eligibility Calculator | My Wealth Circle',
    description: 'Check your loan eligibility based on income and FOIR.',
    type: 'website',
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Loan Eligibility Calculator',
  url: 'https://mywealthcircle.in/loans/eligibility',
  description: 'Calculate maximum loan amount based on income and FOIR.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

// ─── Page ─────────────────────────────────────────────────────
export default function LoanEligibilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <LoanEligibilityCalculator />
    </>
  );
}