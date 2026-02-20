import PPFCalculator from './PPFCalculator';

export const metadata = {
  title: 'PPF Calculator | My Wealth Circle',
  description: 'Calculate PPF maturity value with 7.1% interest rate. 15-year lock-in with yearly breakdown.',
  keywords: 'PPF calculator, public provident fund, PPF returns India, 80C tax saving',
};

export default function PPFPage() {
  return <PPFCalculator />;
}