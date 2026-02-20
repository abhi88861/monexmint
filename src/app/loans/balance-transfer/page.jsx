import BalanceTransferCalculator from './balancetransfercalculator';

export const metadata = {
  title: 'Loan Balance Transfer Calculator | My Wealth Circle',
  description:
    'Calculate savings from transferring your loan to a lower interest rate lender. Break-even analysis included.',
  keywords: 'loan balance transfer calculator, home loan transfer savings India',
  openGraph: {
    title: 'Loan Balance Transfer Calculator | My Wealth Circle',
    description: 'Calculate savings from transferring your loan to a lower interest rate lender.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Loan Balance Transfer Calculator',
  url: 'https://mywealthcircle.in/loans/balance-transfer',
  description: 'Calculate savings from loan balance transfer with break-even analysis.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function BalanceTransferPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <BalanceTransferCalculator />
    </>
  );
}