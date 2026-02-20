'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AdSlot from '@/components/ads/AdSlot';
import { calculateXIRR } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

export default function XIRRCalculator() {

  const [cashFlows, setCashFlows] = useState([
    { id: 1, date: '2023-01-15', amount: -10000 },
    { id: 2, date: '2023-06-10', amount: -15000 },
    { id: 3, date: '2024-01-20', amount: -20000 },
    { id: 4, date: '2025-02-18', amount: 60000 },
  ]);

  const [result, setResult] = useState(null);
  const [calculated, setCalculated] = useState(false);

  const handleCashFlowChange = (id, field, value) => {
    setCashFlows(prev => prev.map(cf => 
      cf.id === id ? { ...cf, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : cf
    ));
    setCalculated(false);
  };

  const addCashFlow = () => {
    setCashFlows(prev => [...prev, { id: Date.now(), date: '', amount: 0 }]);
  };

  const removeCashFlow = (id) => {
    if (cashFlows.length > 2) {
      setCashFlows(prev => prev.filter(cf => cf.id !== id));
      setCalculated(false);
    }
  };

  const calculate = () => {
    const data = calculateXIRR(cashFlows);
    setResult(data);
    setCalculated(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>XIRR Calculator</h1>
          <p className={styles.description}>
            Calculate Extended Internal Rate of Return for irregular mutual fund investments.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Cash Flows (- = investment, + = redemption)">
              <div className={styles.form}>
                {cashFlows.map((cf, idx) => (
                  <div key={cf.id} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1.2fr 1fr auto', 
                    gap: '0.75rem', 
                    marginBottom: '1rem', 
                    alignItems: 'end' 
                  }}>
                    <Input
                      label={`Flow ${idx + 1} - Date`}
                      type="date"
                      value={cf.date}
                      onChange={(e) => handleCashFlowChange(cf.id, 'date', e.target.value)}
                    />
                    <Input
                      label="Amount"
                      type="number"
                      value={cf.amount}
                      onChange={(e) => handleCashFlowChange(cf.id, 'amount', e.target.value)}
                      prefix="₹"
                      step="0.01"
                      helpText={cf.amount < 0 ? "Investment" : cf.amount > 0 ? "Redemption" : ""}
                    />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => removeCashFlow(cf.id)} 
                      disabled={cashFlows.length <= 2}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" fullWidth onClick={addCashFlow}>
                  + Add Cash Flow
                </Button>
                <Button variant="primary" fullWidth onClick={calculate} style={{ marginTop: '1rem' }}>
                  Calculate XIRR
                </Button>
              </div>
            </Card>
          </div>

          <div className={styles.resultsSection}>
            <AdSlot format="rectangle" />

            {calculated && result && !result.error ? (
              <>
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>XIRR (Annualized)</div>
                    <div className={styles.emiValue}>{result.xirr.toFixed(2)}%</div>
                  </div>
                </Card>

                <Card title="Return Analysis">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>XIRR %</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {result.xirr.toFixed(2)}%
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Cash Flows</div>
                      <div className={styles.summaryValue}>{cashFlows.length}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Performance</div>
                      <div className={styles.summaryValue} style={{ 
                        color: result.xirr >= 12 ? '#10b981' : result.xirr >= 8 ? '#f59e0b' : '#ef4444' 
                      }}>
                        {result.xirr >= 15 ? 'Excellent' : result.xirr >= 12 ? 'Good' : result.xirr >= 8 ? 'Average' : 'Below Par'}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#64748b', marginTop: '1.5rem' }}>
                    Annualized return: <strong style={{ color: '#10b981' }}>{result.xirr.toFixed(2)}%</strong>
                  </p>
                </Card>
              </>
            ) : calculated && result && result.error ? (
              <Card variant="danger">
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#dc2626' }}>Error</h3>
                <p style={{ margin: 0, color: '#b91c1c' }}>{result.error}</p>
              </Card>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📊</div>
                  <p>Add cash flows and click Calculate</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About XIRR</h2>
          <p>XIRR calculates annualized returns for irregular cash flows at different dates.</p>
          <h3>How to Enter Data</h3>
          <ul>
            <li><strong>Negative (-):</strong> Investments (money out)</li>
            <li><strong>Positive (+):</strong> Redemptions/current value (money in)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}