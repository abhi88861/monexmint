'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculatePPF } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function PPFCalculator() {

  const [formData, setFormData] = useState({
    yearlyDeposit: '150000',
    tenureYears:   '15',
    annualRate:    '7.1',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const yearly  = parseFloat(formData.yearlyDeposit);
    const years   = parseFloat(formData.tenureYears);
    const rate    = parseFloat(formData.annualRate);

    if (!yearly || yearly < 500 || yearly > 150000 || !years || years < 15) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculatePPF(yearly, years, rate);
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
          <h1 className={styles.title}>PPF Calculator</h1>
          <p className={styles.description}>
            Calculate Public Provident Fund maturity value with 7.1% interest rate. 
            15-year lock-in with 80C tax benefits up to ₹1.5L.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="PPF Investment Details">
              <div className={styles.form}>

                <Input
                  label="Yearly Deposit"
                  type="number"
                  name="yearlyDeposit"
                  value={formData.yearlyDeposit}
                  onChange={handleChange}
                  prefix="₹"
                  min="500"
                  max="150000"
                  step="500"
                  helpText="Min: ₹500, Max: ₹1,50,000 per year"
                />

                <Input
                  label="Tenure (years)"
                  type="number"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
                  min="15"
                  max="50"
                  helpText="Min 15 years, extendable in 5-year blocks"
                />

                <Input
                  label="Interest Rate (p.a.)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  min="1"
                  max="15"
                  step="0.1"
                  helpText="Current: 7.1% (revised quarterly)"
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
                    <div className={styles.emiLabel}>Maturity Value</div>
                    <div className={styles.emiValue}>{formatCurrency(result.maturityValue)}</div>
                  </div>
                </Card>

                <Card title="PPF Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Deposited</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.totalDeposited)}</div>
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
                        {formatCurrency(result.maturityValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tenure</div>
                      <div className={styles.summaryValue}>{result.tenureYears} years</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Rate</div>
                      <div className={styles.summaryValue}>{result.annualRate}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Wealth Multiplier</div>
                      <div className={styles.summaryValue}>
                        {(result.maturityValue / result.totalDeposited).toFixed(2)}x
                      </div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.totalDeposited} returns={result.totalInterest} />
                </Card>
              </>
            ) : result && result.error ? (
              <Card variant="danger">
                <p style={{ color: '#dc2626', margin: 0 }}>{result.error}</p>
              </Card>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🏛️</div>
                  <p>Enter PPF details</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        {/* YEAR-BY-YEAR BREAKDOWN */}
        {result && result.yearlyBreakdown && (
          <Card title="Year-by-Year Wealth Growth" className={styles.amortCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.amortTable}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Deposit</th>
                    <th>Opening Balance</th>
                    <th>Interest Earned</th>
                    <th>Closing Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>{formatCurrency(row.deposit)}</td>
                      <td>{formatCurrency(row.openingBalance)}</td>
                      <td style={{ color: '#10b981' }}>{formatCurrency(row.interestEarned)}</td>
                      <td style={{ color: '#6366f1', fontWeight: 700 }}>{formatCurrency(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Card className={styles.infoCard}>
          <h2>About PPF (Public Provident Fund)</h2>
          <p>
            PPF is a government-backed long-term savings scheme offering guaranteed returns with EEE 
            (Exempt-Exempt-Exempt) tax status. Deposits, interest, and maturity are all tax-free.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Lock-in Period:</strong> 15 years (extendable in 5-year blocks)</li>
            <li><strong>Interest Rate:</strong> 7.1% p.a. (FY 2024-25, revised quarterly)</li>
            <li><strong>Min Deposit:</strong> ₹500/year | <strong>Max Deposit:</strong> ₹1,50,000/year</li>
            <li><strong>Tax Benefit:</strong> 80C deduction up to ₹1.5L + interest is tax-free</li>
            <li><strong>Compounding:</strong> Annual (interest credited at year end)</li>
            <li><strong>Premature Withdrawal:</strong> Allowed from 7th year (conditions apply)</li>
            <li><strong>Loan:</strong> Available from 3rd to 6th year</li>
          </ul>

          <h3>Who Should Invest?</h3>
          <ul>
            <li>Risk-averse investors seeking guaranteed returns</li>
            <li>Long-term wealth creation (retirement, child education)</li>
            <li>Tax saving under Section 80C</li>
            <li>Senior citizens seeking stable income (post extension)</li>
          </ul>

          <h3>PPF Rules</h3>
          <ul>
            <li>1 account per person (minor accounts allowed via guardian)</li>
            <li>Deposits allowed in max 12 installments per year</li>
            <li>Extension: 5 years with/without contributions</li>
            <li>Nomination facility available</li>
            <li>Transferable across India</li>
          </ul>

          <h3>PPF vs Other Options</h3>
          <ul>
            <li><strong>PPF vs EPF:</strong> PPF voluntary, EPF mandatory for salaried</li>
            <li><strong>PPF vs NPS:</strong> PPF safer but lower returns, NPS market-linked</li>
            <li><strong>PPF vs FD:</strong> PPF tax-free, FD taxable</li>
            <li><strong>PPF vs Mutual Funds:</strong> PPF guaranteed, MF risky but higher potential</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}