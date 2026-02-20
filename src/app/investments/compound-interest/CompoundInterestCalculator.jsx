'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateCompoundInterest } from '@/lib/calculators';
import { formatCurrency, COMPOUNDING_OPTIONS } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function CompoundInterestCalculator() {

  const [formData, setFormData] = useState({
    principal:              '100000',
    annualRate:             '8',
    tenureYears:            '5',
    compoundingFrequency:   '4',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const principal    = parseFloat(formData.principal);
    const annualRate   = parseFloat(formData.annualRate);
    const tenureYears  = parseFloat(formData.tenureYears);
    const frequency    = parseInt(formData.compoundingFrequency, 10);

    if (!principal || principal <= 0 || !annualRate || annualRate <= 0 || !tenureYears || tenureYears <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateCompoundInterest(principal, annualRate, tenureYears, frequency);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const frequencyLabel = COMPOUNDING_OPTIONS.find(o => o.value === parseInt(formData.compoundingFrequency))?.label || 'Quarterly';

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Compound Interest Calculator</h1>
          <p className={styles.description}>
            Calculate compound interest with different compounding frequencies. See how daily, monthly, quarterly, or annual compounding affects your returns.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Investment Details">
              <div className={styles.form}>

                <Input
                  label="Principal Amount"
                  type="number"
                  name="principal"
                  value={formData.principal}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="Initial investment"
                />

                <Input
                  label="Annual Interest Rate"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  min="0.1"
                  max="30"
                  step="0.1"
                  helpText="Expected annual return"
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
                  step="1"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Compounding Frequency
                  </label>
                  <select
                    name="compoundingFrequency"
                    value={formData.compoundingFrequency}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                  >
                    {COMPOUNDING_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

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
                    <div className={styles.emiLabel}>Maturity Amount</div>
                    <div className={styles.emiValue}>{formatCurrency(result.maturityAmount)}</div>
                  </div>
                </Card>

                <Card title="Investment Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Principal</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.principal)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.totalInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Maturity Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.maturityAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Effective Rate</div>
                      <div className={styles.summaryValue} style={{ color: '#8b5cf6' }}>
                        {result.effectiveRate.toFixed(2)}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Compounding</div>
                      <div className={styles.summaryValue}>{frequencyLabel}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Absolute Return</div>
                      <div className={styles.summaryValue}>{result.absoluteReturn.toFixed(2)}%</div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.principal} returns={result.totalInterest} />
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>🔢</div>
                    <p className={styles.placeholderText}>Enter details to calculate compound interest</p>
                  </div>
                </Card>
              )
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About Compound Interest</h2>
          <p>
            Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods.
            Einstein reportedly called it "the eighth wonder of the world" because of its exponential growth power.
          </p>

          <h3>Formula</h3>
          <p><strong>A = P(1 + r/n)^(nt)</strong></p>
          <ul>
            <li><strong>A</strong> = Maturity Amount</li>
            <li><strong>P</strong> = Principal</li>
            <li><strong>r</strong> = Annual Rate (decimal)</li>
            <li><strong>n</strong> = Compounding Frequency (per year)</li>
            <li><strong>t</strong> = Time (years)</li>
          </ul>

          <h3>Compounding Frequencies</h3>
          <ul>
            <li><strong>Annually (n=1):</strong> Interest added once per year (PPF, NSC)</li>
            <li><strong>Half-Yearly (n=2):</strong> Interest added twice per year</li>
            <li><strong>Quarterly (n=4):</strong> Interest added 4 times per year (FD default)</li>
            <li><strong>Monthly (n=12):</strong> Interest added 12 times per year (most loans)</li>
            <li><strong>Daily (n=365):</strong> Interest added daily (savings accounts)</li>
          </ul>

          <h3>Impact of Compounding Frequency</h3>
          <p>Example: ₹1,00,000 at 8% for 10 years</p>
          <ul>
            <li>Annual: ₹2,15,892</li>
            <li>Quarterly: ₹2,20,804</li>
            <li>Monthly: ₹2,21,964</li>
            <li>Daily: ₹2,22,544</li>
          </ul>
          <p><em>Higher frequency = Higher returns (but difference is small)</em></p>
        </Card>

      </div>
    </div>
  );
}