'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateMutualFund } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function MutualFundReturnsCalculator() {

  const [formData, setFormData] = useState({
    investedAmount:        '100000',
    currentValue:          '150000',
    investmentDate:        '2020-01-01',
    redemptionDate:        '2025-02-18',
    benchmarkReturnPercent: '12',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const invested = parseFloat(formData.investedAmount);
    const current  = parseFloat(formData.currentValue);
    const benchmark = parseFloat(formData.benchmarkReturnPercent);

    if (!invested || invested <= 0 || !current || current <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateMutualFund(
      invested,
      current,
      formData.investmentDate,
      formData.redemptionDate,
      benchmark
    );
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
          <h1 className={styles.title}>Mutual Fund Returns Calculator</h1>
          <p className={styles.description}>
            Calculate absolute returns, CAGR, and compare performance against benchmark index.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Investment Details">
              <div className={styles.form}>

                <Input
                  label="Invested Amount"
                  type="number"
                  name="investedAmount"
                  value={formData.investedAmount}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                />

                <Input
                  label="Current Value"
                  type="number"
                  name="currentValue"
                  value={formData.currentValue}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="1000"
                />

                <Input
                  label="Investment Date"
                  type="date"
                  name="investmentDate"
                  value={formData.investmentDate}
                  onChange={handleChange}
                />

                <Input
                  label="Redemption Date"
                  type="date"
                  name="redemptionDate"
                  value={formData.redemptionDate}
                  onChange={handleChange}
                />

                <Input
                  label="Benchmark Return (p.a.)"
                  type="number"
                  name="benchmarkReturnPercent"
                  value={formData.benchmarkReturnPercent}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Nifty 50: ~12%, Sensex: ~11%"
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
                    <div className={styles.emiLabel}>CAGR</div>
                    <div className={styles.emiValue}>{result.cagr}%</div>
                  </div>
                </Card>

                <Card title="Performance Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Invested</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.investedAmount)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Current Value</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.currentValue)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Absolute Gain</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.absoluteReturn)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Absolute Return %</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {result.absoluteReturnPercent}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>CAGR</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {result.cagr}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Holding Period</div>
                      <div className={styles.summaryValue}>{result.years} years</div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.investedAmount} returns={result.absoluteReturn} />
                </Card>

                <Card title="Benchmark Comparison">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Your CAGR</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {result.cagr}%
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Benchmark</div>
                      <div className={styles.summaryValue}>{result.benchmarkReturn}%</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Outperformance</div>
                      <div className={styles.summaryValue} style={{ 
                        color: result.outperformance >= 0 ? '#10b981' : '#ef4444' 
                      }}>
                        {result.outperformance > 0 ? '+' : ''}{result.outperformance}%
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Performance</div>
                      <div className={styles.summaryValue} style={{ 
                        color: result.performanceSummary === 'Outperforming' ? '#10b981' : '#ef4444' 
                      }}>
                        {result.performanceSummary}
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📊</div>
                  <p>Enter investment details</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About Mutual Fund Returns</h2>
          <p>CAGR (Compound Annual Growth Rate) shows annualized returns accounting for compounding.</p>
          <h3>Formulas</h3>
          <ul>
            <li><strong>Absolute Return %</strong> = (Current Value − Invested) ÷ Invested × 100</li>
            <li><strong>CAGR %</strong> = (Current Value ÷ Invested)^(1/Years) − 1 × 100</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}