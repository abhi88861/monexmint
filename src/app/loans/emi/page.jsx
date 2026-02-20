// ─────────────────────────────────────────────────────────────
// app/loans/emi/page.jsx  →  SERVER COMPONENT (no 'use client')
// Rule: metadata export ONLY works in Server Components
// This file ONLY does: SEO metadata + JSON-LD + renders client component
// ─────────────────────────────────────────────────────────────

import EMICalculator from './EMICalculator';

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata = {
  title: 'EMI Calculator | My Wealth Circle',
  description:
    'Calculate your loan EMI instantly. Free EMI calculator for home, car & personal loans with full amortisation schedule.',
  keywords: 'EMI calculator, loan EMI, monthly installment calculator, India',
  openGraph: {
    title: 'EMI Calculator | My Wealth Circle',
    description:
      'Calculate your loan EMI instantly. Free EMI calculator for home, car & personal loans.',
    type: 'website',
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EMI Calculator',
  url: 'https://mywealthcircle.in/loans/emi',
  description: 'Free EMI calculator for home, car and personal loans.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

// ─── Page (Server Component) ───────────────────────────────────
export default function EMIPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <EMICalculator />
    </>
  );
}