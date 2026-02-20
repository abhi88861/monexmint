// ─────────────────────────────────────────────────────────────
// app/investments/step-up-sip/page.jsx  →  SERVER COMPONENT
// ─────────────────────────────────────────────────────────────

import StepUpSIPCalculator from './StepUpSIPCalculator';

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata = {
  title: 'Step-Up SIP Calculator | My Wealth Circle',
  description:
    'Calculate step-up SIP returns with annual increment. See how increasing your SIP yearly grows wealth faster. Free step-up SIP calculator India.',
  keywords: 'step up SIP calculator, top up SIP, increasing SIP calculator, step up mutual fund India',
  openGraph: {
    title: 'Step-Up SIP Calculator | My Wealth Circle',
    description: 'Calculate step-up SIP returns with annual increment and yearly breakdown.',
    type: 'website',
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Step-Up SIP Calculator',
  url: 'https://mywealthcircle.in/investments/step-up-sip',
  description: 'Calculate step-up SIP returns with annual increment.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

// ─── Page ─────────────────────────────────────────────────────
export default function StepUpSIPPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <StepUpSIPCalculator />
    </>
  );
}