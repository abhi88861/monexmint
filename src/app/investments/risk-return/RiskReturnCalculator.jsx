'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateRiskReturn } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function RiskReturnCalculator() {

  const [formData, setFormData] = useState({
    investmentAmount: '100000',
    nominalReturn:    '12',
    inflationRate:    '6',
    tenureYears:      '10',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const amount    = parseFloat(formData.investmentAmount);
    const nominal   = parseFloat(formData.nominalReturn);
    const inflation = parseFloat(formData.inflationRate);
    const years     = parseFloat(formData.tenureYears);

    if (!amount || amount <= 0 || !years || years <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateRiskReturn(amount, nominal, inflation, years);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Risk-Return Calculator</h1>
          <p className={styles.description}>
            Analyze nominal vs real returns after adjusting for inflation and risk.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Investment Parameters">
              <div className={styles.form}>

                <Input
                  label="Investment Amount"
                  type="number"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                />

                <Input
                  label="Expected Nominal Return (p.a.)"
                  type="number"
                  name="nominalReturn"
                  value={formData.nominalReturn}
                  onChange={handleChange}
                  suffix="%"
                  step="0.5"
                  helpText="Before inflation"
                />

                <Input
                  label="Expected Inflation Rate (p.a.)"
                  type="number"
                  name="inflationRate"
                  value={formData.inflationRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.5"
                  helpText="India avg: 5-7%"
                />

                <Input
                  label="Investment Period (years)"
                  type="number"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
                  min="1"
                  max="50"
                />

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Real Return (after inflation)</div>
                    <div className={styles.emiValue}>{result.realReturn}%</div>
                  </div>
                </Card>

                <Card title="Return Analysis">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Nominal Return</div>
                      <div className={styles.summaryValue}>{result.nominalReturn}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Inflation Rate</div>
                      <div className={styles.summaryValue} style={{ color: '#ef4444' }}>
                        {result.inflationRate}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Real Return</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {result.realReturn}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Risk Category</div>
                      <div className={styles.summaryValue}>{result.riskCategory}</div>
                    </div>

                  </div>
                </Card>

                <Card title="Value Projection">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Investment</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.investmentAmount)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Nominal Value</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.nominalValue)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Real Value</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.realValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Inflation Loss</div>
                      <div className={styles.summaryValue} style={{ color: '#ef4444' }}>
                        {formatCurrency(result.inflationLoss)}
                      </div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.investmentAmount} returns={result.realGain} />
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📉</div>
                  <p>Enter parameters to analyze risk-return</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>Understanding Risk & Return</h2>
          <p>Real return accounts for inflation to show actual purchasing power gain.</p>
          <h3>Fisher Equation</h3>
          <p><strong>Real Return = [(1 + Nominal) ÷ (1 + Inflation)] − 1</strong></p>
        </Card>

      </div>
    </div>
  );
}