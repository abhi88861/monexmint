'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateSIP } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function SIPCalculator() {

  const [formData, setFormData] = useState({
    monthlyInvestment:  '10000',
    expectedReturnRate: '12',
    tenureYears:        '10',
  });

  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  // ─── Input handler ────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ─── Calculation ──────────────────────────────────────────
  const compute = useCallback(() => {
    const monthlyInvestment  = parseFloat(formData.monthlyInvestment);
    const annualReturnRate   = parseFloat(formData.expectedReturnRate);
    const tenureYears        = parseFloat(formData.tenureYears);

    if (
      !monthlyInvestment || monthlyInvestment <= 0 ||
      !annualReturnRate  || annualReturnRate  <= 0 ||
      !tenureYears       || tenureYears       <= 0
    ) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateSIP(monthlyInvestment, annualReturnRate, tenureYears);
    
    // Build year-by-year breakdown
    const yearlyBreakdown = [];
    const monthlyRate = annualReturnRate / 100 / 12;
    let corpus = 0;
    
    for (let year = 1; year <= tenureYears; year++) {
      for (let month = 1; month <= 12; month++) {
        corpus = (corpus + monthlyInvestment) * (1 + monthlyRate);
      }
      const invested = monthlyInvestment * 12 * year;
      const returns = corpus - invested;
      yearlyBreakdown.push({
        year,
        invested: Math.round(invested),
        corpus: Math.round(corpus),
        returns: Math.round(returns),
      });
    }

    setResult({ ...data, yearlyBreakdown });
    setLoading(false);

  }, [formData.monthlyInvestment, formData.expectedReturnRate, formData.tenureYears]);

  // ─── Debounce ─────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>SIP Calculator</h1>
          <p className={styles.description}>
            Calculate your Systematic Investment Plan (SIP) returns, maturity value, and wealth gained
            with year-by-year breakdown. Plan your mutual fund investments smartly.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="SIP Investment Details">
              <div className={styles.form}>

                <Input
                  label="Monthly Investment"
                  type="number"
                  name="monthlyInvestment"
                  value={formData.monthlyInvestment}
                  onChange={handleChange}
                  prefix="₹"
                  min="500"
                  step="500"
                  helpText="Amount to invest every month"
                />

                <Input
                  label="Expected Return Rate (p.a.)"
                  type="number"
                  name="expectedReturnRate"
                  value={formData.expectedReturnRate}
                  onChange={handleChange}
                  suffix="%"
                  min="1"
                  max="30"
                  step="0.5"
                  helpText="Expected annual returns (equity: 12-15%)"
                />

                <Input
                  label="Investment Period (years)"
                  type="number"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
                  min="1"
                  max="40"
                  step="1"
                  helpText="How long you plan to invest"
                />

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          {/* ── RIGHT RESULTS ──────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {/* Maturity Value Card */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Maturity Value</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.maturityValue)}
                    </div>
                  </div>
                </Card>

                {/* Summary */}
                <Card title="Investment Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Invested</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.totalInvested)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Returns</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.totalReturns)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Maturity Value</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.maturityValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Absolute Return</div>
                      <div className={styles.summaryValue} style={{ color: '#8b5cf6' }}>
                        {result.absoluteReturn.toFixed(2)}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Wealth Ratio</div>
                      <div className={styles.summaryValue}>
                        {result.wealthRatio.toFixed(2)}x
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Investment Period</div>
                      <div className={styles.summaryValue}>
                        {formData.tenureYears} years
                      </div>
                    </div>

                  </div>

                  <InvestmentBarChart
                    invested={result.totalInvested}
                    returns={result.totalReturns}
                  />
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>📈</div>
                    <p className={styles.placeholderText}>
                      Enter SIP details to see your wealth growth
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>

        </div>

        {/* ── YEAR-BY-YEAR BREAKDOWN TABLE ─────────────────── */}
        {result && result.yearlyBreakdown && result.yearlyBreakdown.length > 0 && (
          <Card title="Year-by-Year Wealth Growth" className={styles.amortCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.amortTable}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Total Invested</th>
                    <th>Returns Earned</th>
                    <th>Corpus Value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>{formatCurrency(row.invested)}</td>
                      <td style={{ color: '#10b981' }}>{formatCurrency(row.returns)}</td>
                      <td style={{ color: '#6366f1', fontWeight: 700 }}>{formatCurrency(row.corpus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ── INFO SECTION ───────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About SIP Calculator</h2>
          <p>
            A Systematic Investment Plan (SIP) is a method of investing a fixed sum regularly in mutual funds.
            SIP allows you to invest in a disciplined manner without worrying about market volatility and timing.
            It is one of the most popular investment strategies for building long-term wealth.
          </p>

          <h3>SIP Formula</h3>
          <p><strong>FV = P × [((1 + r)^n − 1) / r] × (1 + r)</strong></p>
          <ul>
            <li><strong>FV</strong> — Future Value (Maturity Amount)</li>
            <li><strong>P</strong> — Monthly Investment Amount</li>
            <li><strong>r</strong> — Monthly Return Rate (Annual Rate ÷ 12 ÷ 100)</li>
            <li><strong>n</strong> — Total number of months</li>
          </ul>

          <h3>Benefits of SIP</h3>
          <ul>
            <li><strong>Rupee Cost Averaging</strong> — Buy more units when NAV is low, fewer when high</li>
            <li><strong>Power of Compounding</strong> — Returns generate their own returns over time</li>
            <li><strong>Disciplined Investing</strong> — Auto-debit ensures regular investment</li>
            <li><strong>Flexibility</strong> — Start with as low as ₹500/month, increase anytime</li>
            <li><strong>No Market Timing</strong> — Eliminates need to time the market</li>
            <li><strong>Tax Benefits</strong> — ELSS funds offer 80C deduction up to ₹1.5L</li>
          </ul>

          <h3>Expected Return Rates by Fund Type</h3>
          <ul>
            <li><strong>Equity Funds (Large Cap):</strong> 11-13% p.a.</li>
            <li><strong>Equity Funds (Mid Cap):</strong> 12-15% p.a.</li>
            <li><strong>Equity Funds (Small Cap):</strong> 14-18% p.a. (higher risk)</li>
            <li><strong>Hybrid Funds:</strong> 9-12% p.a.</li>
            <li><strong>Debt Funds:</strong> 6-9% p.a.</li>
            <li><strong>ELSS (Tax Saving):</strong> 11-14% p.a.</li>
          </ul>
          <p><em>Note: Past performance does not guarantee future returns. These are indicative ranges.</em></p>

          <h3>How to Start a SIP</h3>
          <ul>
            <li><strong>Step 1:</strong> Complete KYC (Aadhaar, PAN card required)</li>
            <li><strong>Step 2:</strong> Choose mutual fund based on goals and risk appetite</li>
            <li><strong>Step 3:</strong> Decide monthly investment amount</li>
            <li><strong>Step 4:</strong> Select SIP date (1st, 7th, 15th, 25th of month)</li>
            <li><strong>Step 5:</strong> Set up auto-debit from bank account</li>
            <li><strong>Step 6:</strong> Monitor annually, rebalance if needed</li>
          </ul>

          <h3>SIP Investment Tips</h3>
          <ul>
            <li><strong>Start Early:</strong> 10-year delay can reduce corpus by 60-70%</li>
            <li><strong>Invest Regularly:</strong> Never skip installments, even in market falls</li>
            <li><strong>Increase with Income:</strong> Step-up SIP by 10% annually</li>
            <li><strong>Stay Invested:</strong> Minimum 5 years for equity, 10+ for wealth creation</li>
            <li><strong>Diversify:</strong> Mix large-cap, mid-cap, and debt funds</li>
            <li><strong>Don't Panic Sell:</strong> Market corrections are buying opportunities</li>
            <li><strong>Review Annually:</strong> Check fund performance, switch if underperforming 3 years</li>
          </ul>

          <h3>Common SIP Mistakes to Avoid</h3>
          <ul>
            <li>Stopping SIP during market falls (this is when you get best returns)</li>
            <li>Investing in too many funds (5-7 funds is optimal)</li>
            <li>Ignoring expense ratio (prefer funds with ratio below 1.5%)</li>
            <li>Choosing wrong SIP date (pick 1-2 days after salary credit)</li>
            <li>Not reviewing portfolio (annual review essential)</li>
            <li>Redeeming too early (minimum 5 years for equity)</li>
          </ul>

          <h3>Tax Implications</h3>
          <ul>
            <li><strong>Equity Funds:</strong> LTCG 10% (&gt;₹1L, held &gt;1 year), STCG 15% (&lt;1 year)</li>
            <li><strong>Debt Funds:</strong> Taxed as per income slab (post Apr 2023)</li>
            <li><strong>ELSS:</strong> 80C deduction up to ₹1.5L, 3-year lock-in</li>
            <li><strong>Dividend:</strong> Taxed as per income slab (TDS 10% if &gt;₹5000)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}