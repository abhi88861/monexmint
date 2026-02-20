import EPFCalculator from './Epfcalculator.jsx';

export const metadata = {
  title: 'EPF Calculator | My Wealth Circle',
  description: 'Calculate Employee Provident Fund maturity with 8.25% interest. 12% employee + 3.67% employer contribution.',
  keywords: 'EPF calculator, employee provident fund, PF calculator India, retirement planning',
};

export default function EPFPage() {
  return <EPFCalculator />;
}