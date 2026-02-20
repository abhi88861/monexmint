// ─────────────────────────────────────────────────────────────
// app/investments/compound-interest/page.jsx  →  SERVER COMPONENT
// ─────────────────────────────────────────────────────────────

import CompoundInterestCalculator from './CompoundInterestCalculator';

export const metadata = {
  title: 'Compound Interest Calculator | My Wealth Circle',
  description: 'Calculate compound interest with daily, monthly, quarterly or annual compounding. Free CI calculator India.',
  keywords: 'compound interest calculator, CI calculator, compounding frequency, investment calculator India',
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Compound Interest Calculator',
  url: 'https://mywealthcircle.in/investments/compound-interest',
};

export default function CompoundInterestPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <CompoundInterestCalculator />
    </>
  );
}