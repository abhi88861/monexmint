import StockAverageCalculator from './StockAverageCalculator';

export const metadata = {
  title: 'Stock Average Calculator | My Wealth Circle',
  description: 'Calculate average buy price across multiple stock purchases. Free stock averaging down calculator India.',
  keywords: 'stock average calculator, averaging down, stock portfolio average price India',
};

export default function StockAveragePage() {
  return <StockAverageCalculator />;
}