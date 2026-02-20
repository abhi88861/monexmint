// ─────────────────────────────────────────────────────────────
// app/investments/sip/page.jsx  →  SERVER COMPONENT
// ─────────────────────────────────────────────────────────────

import SIPCalculator from './SIPCalculator';

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata = {
  title: 'SIP Calculator | My Wealth Circle',
  description:
    'Calculate SIP returns, maturity value and wealth gained. Free SIP calculator for mutual fund investments with yearly breakdown. India.',
  keywords: 'SIP calculator, mutual fund SIP, systematic investment plan calculator, SIP returns India',
  openGraph: {
    title: 'SIP Calculator | My Wealth Circle',
    description: 'Calculate SIP returns and maturity value with yearly breakdown.',
    type: 'website',
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SIP Calculator',
  url: 'https://mywealthcircle.in/investments/sip',
  description: 'Calculate SIP returns for mutual fund investments.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

// ─── Page ─────────────────────────────────────────────────────
export default function SIPPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <SIPCalculator />
    </>
  );
}