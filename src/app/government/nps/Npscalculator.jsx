'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateNPS } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function NPSCalculator() {

  const [formData, setFormData] = useState({
    monthlyContribution: '5000',
    annualReturnRate:    '10',
    currentAge:          '30',
    retirementAge:       '60',
    annuityPercent:      '40',
    annuityRate:         '6',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const monthly    = parseFloat(formData.monthlyContribution);
    const returnRate = parseFloat(formData.annualReturnRate);
    const currAge    = parseInt(formData.currentAge);
    const retAge     = parseInt(formData.retirementAge);
    const annPct     = parseFloat(formData.annuityPercent);
    const annRate    = parseFloat(formData.annuityRate);

    if (!monthly || monthly <= 0 || currAge >= retAge) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateNPS(monthly, returnRate, currAge, retAge, annPct, annRate);
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
          <h1 className={styles.title}>NPS Calculator</h1>
          <p className={styles.description}>
            Calculate National Pension Scheme maturity, lumpsum withdrawal, and monthly pension 
            with annuity. Market-linked retirement planning.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="NPS Investment Details">
              <div className={styles.form}>

                <Input
                  label="Monthly Contribution"
                  type="number"
                  name="monthlyContribution"
                  value={formData.monthlyContribution}
                  onChange={handleChange}
                  prefix="₹"
                  min="500"
                  step="500"
                  helpText="Min ₹500/month or ₹6000/year"
                />

                <Input
                  label="Expected Return (p.a.)"
                  type="number"
                  name="annualReturnRate"
                  value={formData.annualReturnRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.5"
                  helpText="Aggressive: 10-12%, Moderate: 8-10%"
                />

                <Input
                  label="Current Age"
                  type="number"
                  name="currentAge"
                  value={formData.currentAge}
                  onChange={handleChange}
                  suffix="years"
                  min="18"
                  max="70"
                />

                <Input
                  label="Retirement Age"
                  type="number"
                  name="retirementAge"
                  value={formData.retirementAge}
                  onChange={handleChange}
                  suffix="years"
                  min="60"
                  max="75"
                  helpText="Normal: 60, can defer till 75"
                />

                <Input
                  label="Annuity Allocation"
                  type="number"
                  name="annuityPercent"
                  value={formData.annuityPercent}
                  onChange={handleChange}
                  suffix="%"
                  min="40"
                  max="100"
                  helpText="Min 40% mandatory for annuity"
                />

                <Input
                  label="Annuity Rate"
                  type="number"
                  name="annuityRate"
                  value={formData.annuityRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.5"
                  helpText="Expected annuity return: 5-7%"
                />

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && !result.error ? (
              <>
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Monthly Pension</div>
                    <div className={styles.emiValue}>{formatCurrency(result.estimatedMonthlyPension)}</div>
                  </div>
                </Card>

                <Card title="NPS Maturity Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Invested</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.totalInvested)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Returns</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.totalReturns)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Maturity Corpus</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.maturityValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Years to Retirement</div>
                      <div className={styles.summaryValue}>{result.tenureYears} years</div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.totalInvested} returns={result.totalReturns} />
                </Card>

                <Card title="At Retirement - Your Options">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Lumpsum Withdrawal ({100 - parseFloat(formData.annuityPercent)}%)</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.5rem' }}>
                        {formatCurrency(result.lumpsumWithdrawal)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Annuity Purchase ({formData.annuityPercent}%)</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1', fontSize: '1.5rem' }}>
                        {formatCurrency(result.annuityCorpus)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly Pension</div>
                      <div className={styles.summaryValue} style={{ color: '#8b5cf6', fontSize: '1.75rem' }}>
                        {formatCurrency(result.estimatedMonthlyPension)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Yearly Pension</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.estimatedMonthlyPension * 12)}
                      </div>
                    </div>

                  </div>
                </Card>

                <Card variant="success">
                  <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.7', color: '#047857' }}>
                    💡 <strong>At retirement:</strong> You get ₹{formatCurrency(result.lumpsumWithdrawal)} lumpsum 
                    + ₹{formatCurrency(result.estimatedMonthlyPension)}/month pension for life!
                  </p>
                </Card>
              </>
            ) : result && result.error ? (
              <Card variant="danger">
                <p style={{ color: '#dc2626', margin: 0 }}>{result.error}</p>
              </Card>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🏦</div>
                  <p>Enter NPS details</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About NPS (National Pension Scheme)</h2>
          <p>
            NPS is a government-sponsored market-linked pension scheme offering retirement corpus + 
            guaranteed monthly pension. Flexible, portable, and tax-efficient.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Minimum Investment:</strong> ₹500/month or ₹6,000/year</li>
            <li><strong>Lock-in:</strong> Till 60 years (can defer till 75)</li>
            <li><strong>Returns:</strong> Market-linked (8-12% historical average)</li>
            <li><strong>Annuity:</strong> Min 40% corpus for annuity purchase (mandatory)</li>
            <li><strong>Lumpsum:</strong> Max 60% corpus withdrawal at retirement</li>
            <li><strong>Tax Benefits:</strong> 80CCD(1): ₹1.5L + 80CCD(1B): ₹50K extra = ₹2L total</li>
          </ul>

          <h3>Account Types</h3>
          <ul>
            <li><strong>Tier-I (Pension):</strong> Locked till 60, tax benefits, mandatory annuity</li>
            <li><strong>Tier-II (Savings):</strong> No lock-in, no tax benefit, fully withdrawable</li>
          </ul>

          <h3>Asset Allocation Options</h3>
          <ul>
            <li><strong>Equity (E):</strong> Up to 75% in stocks (higher returns, higher risk)</li>
            <li><strong>Corporate Bonds (C):</strong> Fixed income securities</li>
            <li><strong>Government Securities (G):</strong> Safest, lowest returns</li>
            <li><strong>Alternative (A):</strong> REITs, InvITs (max 5%)</li>
            <li><strong>Auto Choice:</strong> Age-based auto allocation (Aggressive/Moderate/Conservative)</li>
          </ul>

          <h3>Withdrawal Options at Maturity (Age 60)</h3>
          <ul>
            <li><strong>Mandatory Annuity:</strong> Min 40% for monthly pension</li>
            <li><strong>Lumpsum:</strong> Max 60% withdrawal (taxable)</li>
            <li><strong>Defer:</strong> Continue till 75 (corpus keeps growing)</li>
            <li><strong>Staggered:</strong> Withdraw 60% in 10 equal annual installments</li>
          </ul>

          <h3>Premature Withdrawal</h3>
          <ul>
            <li><strong>Before 60:</strong> 80% annuity, 20% lumpsum (only in specific cases)</li>
            <li><strong>After 3 years:</strong> Partial withdrawal (max 25%) for medical, education, home</li>
            <li><strong>Before 3 years:</strong> Only if critical illness/death</li>
          </ul>

          <h3>Tax Benefits</h3>
          <ul>
            <li><strong>80CCD(1):</strong> Employee contribution up to ₹1.5L (within overall 80C limit)</li>
            <li><strong>80CCD(1B):</strong> Additional ₹50,000 deduction (exclusive, over and above 80C)</li>
            <li><strong>80CCD(2):</strong> Employer contribution (10% of salary, no limit)</li>
            <li><strong>Maturity:</strong> 60% lumpsum taxable, 40% annuity corpus tax-free</li>
            <li><strong>Pension Income:</strong> Taxable as salary</li>
          </ul>

          <h3>NPS vs Other Options</h3>
          <ul>
            <li><strong>NPS vs EPF:</strong> NPS market-linked (higher risk/return), EPF guaranteed 8.25%</li>
            <li><strong>NPS vs PPF:</strong> NPS ₹2L tax benefit, PPF only ₹1.5L</li>
            <li><strong>NPS vs Mutual Funds:</strong> NPS has annuity lock-in, MF fully flexible</li>
            <li><strong>NPS vs APY:</strong> NPS corpus-based, APY fixed pension guarantee</li>
          </ul>

          <h3>Who Should Invest in NPS?</h3>
          <ul>
            <li>Self-employed/businessmen (no EPF)</li>
            <li>Looking for additional ₹50K tax deduction (over 80C)</li>
            <li>Want market-linked returns for retirement</li>
            <li>Okay with 40% annuity lock-in</li>
            <li>Long investment horizon (20+ years)</li>
          </ul>

          <h3>Annuity Options at Retirement</h3>
          <ul>
            <li><strong>Life Annuity:</strong> Pension for life (stops on death)</li>
            <li><strong>Joint Life:</strong> Pension continues for spouse</li>
            <li><strong>Return of Purchase Price:</strong> Corpus returned to nominee on death</li>
            <li><strong>Increasing Annuity:</strong> Pension increases 3% annually</li>
          </ul>

          <h3>Important Points</h3>
          <ul>
            <li>PRAN (Permanent Retirement Account Number) — portable across jobs</li>
            <li>Can switch between active/auto choice anytime</li>
            <li>Exit load: 0.25% if exit before 60</li>
            <li>Nomination mandatory</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}