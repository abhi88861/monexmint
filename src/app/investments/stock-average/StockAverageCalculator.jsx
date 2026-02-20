'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AdSlot from '@/components/ads/AdSlot';
import { calculateStockAverage } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

export default function StockAverageCalculator() {

  const [trades, setTrades] = useState([
    { id: 1, quantity: 100, price: 500 },
    { id: 2, quantity: 50, price: 450 },
  ]);

  const [result, setResult] = useState(null);

  const handleTradeChange = (id, field, value) => {
    setTrades(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: parseFloat(value) || 0 } : t
    ));
  };

  const addTrade = () => {
    setTrades(prev => [...prev, { id: Date.now(), quantity: 0, price: 0 }]);
  };

  const removeTrade = (id) => {
    if (trades.length > 1) {
      setTrades(prev => prev.filter(t => t.id !== id));
    }
  };

  React.useEffect(() => {
    const data = calculateStockAverage(trades);
    setResult(data);
  }, [trades]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Stock Average Calculator</h1>
          <p className={styles.description}>
            Calculate weighted average buy price across multiple stock purchases.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Your Stock Trades">
              <div className={styles.form}>
                {trades.map((trade, idx) => (
                  <div key={trade.id} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr auto', 
                    gap: '0.75rem', 
                    marginBottom: '1rem', 
                    alignItems: 'end' 
                  }}>
                    <Input
                      label={`Trade ${idx + 1} - Qty`}
                      type="number"
                      value={trade.quantity}
                      onChange={(e) => handleTradeChange(trade.id, 'quantity', e.target.value)}
                      min="1"
                    />
                    <Input
                      label="Price/share"
                      type="number"
                      value={trade.price}
                      onChange={(e) => handleTradeChange(trade.id, 'price', e.target.value)}
                      prefix="₹"
                      step="0.01"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeTrade(trade.id)}
                      disabled={trades.length === 1}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" fullWidth onClick={addTrade}>
                  + Add Trade
                </Button>
              </div>
            </Card>
          </div>

          <div className={styles.resultsSection}>
            <AdSlot format="rectangle" />

            {result && result.totalQuantity > 0 ? (
              <>
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Average Price</div>
                    <div className={styles.emiValue}>{formatCurrency(result.averagePrice)}</div>
                  </div>
                </Card>

                <Card title="Portfolio Summary">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Shares</div>
                      <div className={styles.summaryValue}>{result.totalQuantity}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Cost</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.totalCost)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Average Price</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.averagePrice)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Trades</div>
                      <div className={styles.summaryValue}>{result.trades.length}</div>
                    </div>
                  </div>
                </Card>

                <Card title="Trade Breakdown" className={styles.amortCard}>
                  <div className={styles.tableWrapper}>
                    <table className={styles.amortTable}>
                      <thead>
                        <tr>
                          <th>Trade</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Investment</th>
                          <th>Weight %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.trades.map((trade, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{trade.quantity}</td>
                            <td>{formatCurrency(trade.price)}</td>
                            <td>{formatCurrency(trade.investment)}</td>
                            <td style={{ color: '#6366f1', fontWeight: 600 }}>{trade.weightPercent.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📊</div>
                  <p>Add trades to calculate average</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About Stock Average Calculator</h2>
          <p>Calculates weighted average buy price when you purchase the same stock at different prices.</p>
          <h3>Formula</h3>
          <p><strong>Average Price = Total Investment ÷ Total Shares</strong></p>
        </Card>

      </div>
    </div>
  );
}