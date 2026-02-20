'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateGoalPlanning } from '@/lib/calculators';
import { formatCurrency, GOAL_TYPES } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function GoalPlanningCalculator() {

  const [formData, setFormData] = useState({
    goalType:           'retirement',
    targetAmount:       '10000000',
    yearsToGoal:        '20',
    inflationRate:      '6',
    expectedReturn:     '12',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const targetAmount    = parseFloat(formData.targetAmount);
    const yearsToGoal     = parseFloat(formData.yearsToGoal);
    const inflationRate   = parseFloat(formData.inflationRate);
    const expectedReturn  = parseFloat(formData.expectedReturn);

    if (!targetAmount || targetAmount <= 0 || !yearsToGoal || yearsToGoal <= 0 || !expectedReturn || expectedReturn <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateGoalPlanning(targetAmount, yearsToGoal, expectedReturn, inflationRate);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const selectedGoal = GOAL_TYPES.find(g => g.value === formData.goalType) || GOAL_TYPES[0];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Goal Planning Calculator</h1>
          <p className={styles.description}>
            Plan for retirement, child education, house purchase, or any financial goal. 
            Calculate required SIP and lumpsum with inflation adjustment.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Your Financial Goal">
              <div className={styles.form}>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Goal Type
                  </label>
                  <select
                    name="goalType"
                    value={formData.goalType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                  >
                    {GOAL_TYPES.map(goal => (
                      <option key={goal.value} value={goal.value}>
                        {goal.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Target Amount (Today's Value)"
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  prefix="₹"
                  min="10000"
                  step="10000"
                  helpText="How much you need in today's money"
                />

                <Input
                  label="Years to Goal"
                  type="number"
                  name="yearsToGoal"
                  value={formData.yearsToGoal}
                  onChange={handleChange}
                  suffix="years"
                  min="1"
                  max="50"
                  step="1"
                  helpText="Time remaining to achieve this goal"
                />

                <Input
                  label="Expected Return Rate (p.a.)"
                  type="number"
                  name="expectedReturn"
                  value={formData.expectedReturn}
                  onChange={handleChange}
                  suffix="%"
                  min="1"
                  max="30"
                  step="0.5"
                  helpText="Expected investment returns (equity: 12-15%)"
                />

                <Input
                  label="Inflation Rate (p.a.)"
                  type="number"
                  name="inflationRate"
                  value={formData.inflationRate}
                  onChange={handleChange}
                  suffix="%"
                  min="0"
                  max="15"
                  step="0.5"
                  helpText="Expected inflation (India avg: 5-7%)"
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
                    <div className={styles.emiLabel}>Future Value Needed</div>
                    <div className={styles.emiValue}>{formatCurrency(result.futureValue)}</div>
                  </div>
                </Card>

                <Card title={`${selectedGoal.icon} Goal Summary`}>
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Today's Target</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.targetAmount)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Future Value</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.futureValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Time Remaining</div>
                      <div className={styles.summaryValue}>{result.yearsToGoal} years</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Inflation Impact</div>
                      <div className={styles.summaryValue} style={{ color: '#ef4444' }}>
                        {((result.futureValue - result.targetAmount) / result.targetAmount * 100).toFixed(1)}%
                      </div>
                    </div>

                  </div>
                </Card>

                <Card title="Investment Options" variant="success">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly SIP Required</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.75rem' }}>
                        {formatCurrency(result.monthlySIP)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Lumpsum Required</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1', fontSize: '1.75rem' }}>
                        {formatCurrency(result.lumpsumRequired)}
                      </div>
                    </div>

                  </div>

                  <p style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#047857', marginTop: '1rem' }}>
                    <strong>Option 1:</strong> Start SIP of ₹{formatCurrency(result.monthlySIP)}/month for {result.yearsToGoal} years<br/>
                    <strong>Option 2:</strong> Invest ₹{formatCurrency(result.lumpsumRequired)} lumpsum today<br/>
                    <strong>Option 3:</strong> Combine both - lower SIP + partial lumpsum
                  </p>
                </Card>

                <Card title="Inflation-Adjusted Breakdown">
                  <InvestmentBarChart invested={result.targetAmount} returns={result.futureValue - result.targetAmount} />
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#64748b', marginTop: '1.5rem' }}>
                    Due to <strong>{formData.inflationRate}%</strong> annual inflation over <strong>{result.yearsToGoal} years</strong>, 
                    what costs ₹{formatCurrency(result.targetAmount)} today will cost <strong style={{ color: '#6366f1' }}>₹{formatCurrency(result.futureValue)}</strong> in the future.
                  </p>
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>🎯</div>
                    <p className={styles.placeholderText}>Enter your financial goal details</p>
                  </div>
                </Card>
              )
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About Goal Planning</h2>
          <p>
            Goal planning helps you calculate exactly how much to invest monthly (SIP) or as lumpsum 
            to achieve your financial goals like retirement, child education, house purchase, etc. 
            It accounts for inflation to give realistic targets.
          </p>

          <h3>Common Financial Goals</h3>
          <ul>
            <li><strong>🏖️ Retirement:</strong> Target: 25-30x annual expenses | Timeline: 20-30 years</li>
            <li><strong>🎓 Child Education:</strong> Target: ₹50L-₹1Cr | Timeline: 10-18 years</li>
            <li><strong>🏠 House Purchase:</strong> Target: Down payment (20-30%) | Timeline: 5-10 years</li>
            <li><strong>💍 Marriage:</strong> Target: ₹15L-₹50L | Timeline: 5-15 years</li>
            <li><strong>✈️ Dream Vacation:</strong> Target: ₹5L-₹20L | Timeline: 2-5 years</li>
            <li><strong>🏥 Emergency Fund:</strong> Target: 6-12 months expenses | Timeline: 1-2 years</li>
          </ul>

          <h3>Why Inflation Matters</h3>
          <p>
            If you need ₹1 Cr for retirement in 30 years, but ignore 6% inflation, you'll actually 
            need <strong>₹5.74 Cr</strong> to maintain the same purchasing power. This calculator 
            automatically adjusts for inflation.
          </p>

          <h3>SIP vs Lumpsum - Which to Choose?</h3>
          <ul>
            <li><strong>Choose SIP if:</strong> You have regular income, long timeline (10+ years), want rupee-cost averaging</li>
            <li><strong>Choose Lumpsum if:</strong> You have surplus cash now, short timeline (1-3 years), market is low</li>
            <li><strong>Best approach:</strong> Start with lumpsum (if you have) + monthly SIP (from salary)</li>
          </ul>

          <h3>How to Achieve Your Goals Faster</h3>
          <ul>
            <li><strong>Start Early:</strong> 5 years earlier can reduce required SIP by 40-50%</li>
            <li><strong>Step-Up SIP:</strong> Increase SIP by 10% annually as salary grows</li>
            <li><strong>Higher Returns:</strong> Choose equity funds for goals 7+ years away</li>
            <li><strong>Bonus/Increment:</strong> Invest 30-50% of bonuses toward goals</li>
            <li><strong>Tax Savings:</strong> Use ELSS funds for 80C + goal planning</li>
          </ul>

          <h3>Goal-Specific Tips</h3>

          <h4>🏖️ Retirement Planning</h4>
          <ul>
            <li>Target: 25-30x your current annual expenses</li>
            <li>Start at 25: SIP ₹10K → ₹3-4 Cr at 60</li>
            <li>Use NPS for additional tax benefits (₹50K extra deduction)</li>
            <li>Keep 3-4 years expenses in debt funds after retirement</li>
          </ul>

          <h4>🎓 Child Education</h4>
          <ul>
            <li>Engineering in India (2025): ₹20-30L | Abroad: ₹50L-₹1.5Cr</li>
            <li>Start SIP when child is born for best results</li>
            <li>Use Sukanya Samriddhi (girl child) + mutual funds</li>
            <li>Move to debt 2 years before goal to protect capital</li>
          </ul>

          <h4>🏠 House Purchase</h4>
          <ul>
            <li>Save 20-30% down payment to avoid high EMIs</li>
            <li>Use equity funds for goals 5+ years away</li>
            <li>Switch to debt/FD 1 year before purchase</li>
            <li>Don't compromise emergency fund for down payment</li>
          </ul>

          <h3>Asset Allocation by Timeline</h3>
          <ul>
            <li><strong>10+ years away:</strong> 80-100% equity funds</li>
            <li><strong>5-10 years away:</strong> 60-80% equity, 20-40% debt</li>
            <li><strong>3-5 years away:</strong> 40-60% equity, 40-60% debt</li>
            <li><strong>1-3 years away:</strong> 20-40% equity, 60-80% debt/FD</li>
            <li><strong> 1 year away:</strong> 100% debt/FD (capital protection)</li>
          </ul>

          <h3>Common Mistakes to Avoid</h3>
          <ul>
            <li>❌ Not accounting for inflation (biggest mistake!)</li>
            <li>❌ Starting too late (delays double the effort)</li>
            <li>❌ Keeping all in equity till goal date (risky)</li>
            <li>❌ Withdrawing early for non-emergencies</li>
            <li>❌ Not reviewing/rebalancing annually</li>
            <li>❌ Underestimating costs (add 20% buffer)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}