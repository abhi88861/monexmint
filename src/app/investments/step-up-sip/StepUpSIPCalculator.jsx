'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateStepUpSIP } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 200;

export default function StepUpSIPCalculator() {

  const [formData, setFormData] = useState({
    initialMonthlyInvestment: '10000',
    expectedReturnRate:        '12',
    tenureYears:               '10',
    annualStepUpPercent:       '10',
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
    const initialMonthly   = parseFloat(formData.initialMonthlyInvestment);
    const annualReturnRate = parseFloat(formData.expectedReturnRate);
    const tenureYears      = parseFloat(formData.tenureYears);
    const annualStepUp     = parseFloat(formData.annualStepUpPercent);

    if (
      !initialMonthly   || initialMonthly   <= 0 ||
      !annualReturnRate || annualReturnRate <= 0 ||
      !tenureYears      || tenureYears      <= 0 ||
      !annualStepUp     || annualStepUp     < 0
    ) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateStepUpSIP(
      initialMonthly,
      annualReturnRate,
      tenureYears,
      annualStepUp
    );

    // Build year-by-year breakdown showing SIP increment
    const yearlyBreakdown = [];
    const monthlyRate = annualReturnRate / 100 / 12;
    let corpus = 0;
    let totalInvested = 0;
    let currentSIP = initialMonthly;

    for (let year = 1; year <= tenureYears; year++) {
      let yearInvestment = 0;
      for (let month = 1; month <= 12; month++) {
        corpus = (corpus + currentSIP) * (1 + monthlyRate);
        totalInvested += currentSIP;
        yearInvestment += currentSIP;
      }
      const returns = corpus - totalInvested;
      yearlyBreakdown.push({
        year,
        sipAmount: Math.round(currentSIP),
        yearInvestment: Math.round(yearInvestment),
        totalInvested: Math.round(totalInvested),
        returns: Math.round(returns),
        corpus: Math.round(corpus),
      });
      currentSIP = currentSIP * (1 + annualStepUp / 100);
    }

    setResult({ ...data, yearlyBreakdown });
    setLoading(false);

  }, [
    formData.initialMonthlyInvestment,
    formData.expectedReturnRate,
    formData.tenureYears,
    formData.annualStepUpPercent,
  ]);

  // ─── Debounce ─────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  // ─── Calculate comparison with regular SIP ────────────────
  const regularSIPValue = result
    ? formData.initialMonthlyInvestment * 12 * formData.tenureYears
    : 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Step-Up SIP Calculator</h1>
          <p className={styles.description}>
            Calculate your Step-Up SIP returns with annual increment. See how increasing your SIP
            investment every year accelerates wealth creation with detailed year-by-year breakdown.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Step-Up SIP Details">
              <div className={styles.form}>

                <Input
                  label="Initial Monthly Investment"
                  type="number"
                  name="initialMonthlyInvestment"
                  value={formData.initialMonthlyInvestment}
                  onChange={handleChange}
                  prefix="₹"
                  min="500"
                  step="500"
                  helpText="Starting SIP amount in Year 1"
                />

                <Input
                  label="Annual Step-Up"
                  type="number"
                  name="annualStepUpPercent"
                  value={formData.annualStepUpPercent}
                  onChange={handleChange}
                  suffix="%"
                  min="0"
                  max="50"
                  step="5"
                  helpText={`SIP will increase by ${formData.annualStepUpPercent}% every year`}
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
                  helpText="Expected annual returns"
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
                      <div className={styles.summaryLabel}>Initial Monthly SIP</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(parseFloat(formData.initialMonthlyInvestment))}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Final Monthly SIP</div>
                      <div className={styles.summaryValue} style={{ color: '#8b5cf6' }}>
                        {formatCurrency(result.finalMonthlyInvestment)}
                      </div>
                    </div>

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

                  </div>

                  <InvestmentBarChart
                    invested={result.totalInvested}
                    returns={result.totalReturns}
                  />
                </Card>

                {/* Comparison with Regular SIP */}
                <Card title="Step-Up vs Regular SIP" variant="success">
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7' }}>
                    <p style={{ margin: '0 0 1rem 0' }}>
                      <strong>With Step-Up:</strong> ₹{formatCurrency(result.maturityValue)}
                    </p>
                    <p style={{ margin: '0 0 1rem 0', color: '#64748b' }}>
                      Your final SIP amount: <strong>₹{formatCurrency(result.finalMonthlyInvestment)}</strong><br/>
                      Total invested: <strong>₹{formatCurrency(result.totalInvested)}</strong>
                    </p>
                    <p style={{ margin: '0 0 1rem 0', color: '#64748b' }}>
                      <strong>Without Step-Up:</strong> If you kept initial SIP of ₹{formatCurrency(parseFloat(formData.initialMonthlyInvestment))} constant,
                      you would have invested only <strong>₹{formatCurrency(regularSIPValue)}</strong>
                    </p>
                    <p style={{ margin: 0, color: '#059669', fontWeight: 700 }}>
                      💡 Extra investment of ₹{formatCurrency(result.totalInvested - regularSIPValue)} with step-up
                      creates significantly higher wealth!
                    </p>
                  </div>
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>📈</div>
                    <p className={styles.placeholderText}>
                      Enter step-up SIP details to see accelerated wealth growth
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>

        </div>

        {/* ── YEAR-BY-YEAR BREAKDOWN TABLE ─────────────────── */}
        {result && result.yearlyBreakdown && result.yearlyBreakdown.length > 0 && (
          <Card title="Year-by-Year Wealth Growth (with SIP Increment)" className={styles.amortCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.amortTable}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Monthly SIP</th>
                    <th>Year Investment</th>
                    <th>Total Invested</th>
                    <th>Returns Earned</th>
                    <th>Corpus Value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td style={{ color: '#8b5cf6', fontWeight: 600 }}>{formatCurrency(row.sipAmount)}</td>
                      <td>{formatCurrency(row.yearInvestment)}</td>
                      <td>{formatCurrency(row.totalInvested)}</td>
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
          <h2>About Step-Up SIP Calculator</h2>
          <p>
            A Step-Up SIP (also called Top-Up SIP or Increasing SIP) allows you to increase your monthly
            SIP investment by a fixed percentage every year. This strategy helps you align your investments
            with your rising income and accelerates wealth creation significantly.
          </p>

          <h3>How Step-Up SIP Works</h3>
          <p>
            Instead of investing a fixed amount every month, you increase your SIP contribution annually:
          </p>
          <ul>
            <li>Year 1: Start with ₹10,000/month</li>
            <li>Year 2: Increase to ₹11,000/month (10% step-up)</li>
            <li>Year 3: Increase to ₹12,100/month (10% step-up)</li>
            <li>Year 4: Increase to ₹13,310/month (10% step-up)</li>
            <li>...and so on</li>
          </ul>

          <h3>Benefits of Step-Up SIP</h3>
          <ul>
            <li><strong>Matches Income Growth:</strong> Your salary increases ~10% annually, so should your SIP</li>
            <li><strong>Accelerated Wealth:</strong> Higher contributions + compounding = significantly larger corpus</li>
            <li><strong>Inflation Adjusted:</strong> Keeps your real investment value constant</li>
            <li><strong>Disciplined Approach:</strong> Auto-increment ensures you don't miss opportunities</li>
            <li><strong>Goal Achievement:</strong> Reach financial goals 3-5 years faster than regular SIP</li>
          </ul>

          <h3>Step-Up SIP vs Regular SIP — Example</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Scenario:</strong></p>
            <ul>
              <li>Initial SIP: ₹10,000/month</li>
              <li>Return Rate: 12% p.a.</li>
              <li>Tenure: 20 years</li>
            </ul>
            <p><strong>Regular SIP (constant ₹10,000):</strong></p>
            <ul>
              <li>Total Invested: ₹24,00,000</li>
              <li>Maturity: ~₹99,00,000</li>
            </ul>
            <p><strong>Step-Up SIP (10% annual increase):</strong></p>
            <ul>
              <li>Total Invested: ₹68,70,000</li>
              <li>Maturity: ~₹2,27,00,000</li>
              <li><strong style={{ color: '#10b981' }}>Extra Wealth: ₹1,28,00,000 (129% more!)</strong></li>
            </ul>
          </div>

          <h3>Recommended Step-Up Percentage</h3>
          <ul>
            <li><strong>Conservative (5-7%):</strong> For stable jobs with modest salary growth</li>
            <li><strong>Moderate (10-12%):</strong> For corporate jobs with regular increments</li>
            <li><strong>Aggressive (15-20%):</strong> For high-growth careers (IT, startups, consulting)</li>
            <li><strong>Custom:</strong> Align with your average salary increment</li>
          </ul>

          <h3>When to Choose Step-Up SIP</h3>
          <ul>
            <li>You are early in your career (25-35 years) with income growth potential</li>
            <li>You receive regular annual increments/bonuses</li>
            <li>You want to reach financial goals faster (retirement, home, education)</li>
            <li>You want to beat inflation and maintain real investment value</li>
            <li>You have 10+ year investment horizon (long-term wealth creation)</li>
          </ul>

          <h3>How to Set Up Step-Up SIP</h3>
          <ul>
            <li><strong>Step 1:</strong> Choose mutual fund and start regular SIP first</li>
            <li><strong>Step 2:</strong> After 12 months, request step-up facility from fund house</li>
            <li><strong>Step 3:</strong> Select step-up percentage (typically 5%, 10%, 15%, or 20%)</li>
            <li><strong>Step 4:</strong> SIP amount auto-increases every year on anniversary date</li>
            <li><strong>Step 5:</strong> You can modify or pause step-up anytime</li>
          </ul>

          <h3>Important Considerations</h3>
          <ul>
            <li><strong>Don't Overcommit:</strong> Ensure 10-20% salary increase before choosing step-up</li>
            <li><strong>Emergency Fund First:</strong> Maintain 6-month expenses before aggressive step-up</li>
            <li><strong>Review Annually:</strong> Adjust step-up % if income situation changes</li>
            <li><strong>Not All Funds:</strong> Check if your mutual fund offers step-up facility</li>
            <li><strong>Fixed Step-Up:</strong> Most funds offer % increase, not flexible amounts</li>
          </ul>

          <h3>Tax Implications (Same as Regular SIP)</h3>
          <ul>
            <li><strong>Equity Funds:</strong> LTCG 10% (&gt; ₹1L, held &gt; 1 year), STCG 15% (&lt; 1 year)</li>
            <li><strong>ELSS:</strong> 80C deduction up to ₹1.5L, 3-year lock-in</li>
            <li>Each SIP installment is treated as separate investment for tax calculation</li>
          </ul>

          <h3>Common Mistakes to Avoid</h3>
          <ul>
            <li>Choosing very high step-up (25%+) — difficult to sustain</li>
            <li>Not reviewing when job/income changes significantly</li>
            <li>Forgetting step-up is active — can strain finances if not monitored</li>
            <li>Stopping SIP during market falls (defeats the purpose of SIP)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}