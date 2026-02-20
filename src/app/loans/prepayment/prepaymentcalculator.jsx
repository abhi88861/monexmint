'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AdSlot from '@/components/ads/AdSlot';
import { calculatePrepayment } from '@/lib/calculators';
import { formatCurrency, formatTenure } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function PrepaymentCalculator() {
  const [formData, setFormData] = useState({
    principal:        '2000000',
    annualRate:       '8.5',
    tenureMonths:     '240',
    prepaymentAmount: '200000',
    prepaymentMonth:  '12',
  });

  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const principal        = parseFloat(formData.principal);
    const annualRate       = parseFloat(formData.annualRate);
    const tenureMonths     = parseInt(formData.tenureMonths, 10);
    const prepaymentAmount = parseFloat(formData.prepaymentAmount);
    const prepaymentMonth  = parseInt(formData.prepaymentMonth, 10);

    if (
      !principal        || principal        < 1000 ||
      !annualRate       || annualRate       <= 0   ||
      !tenureMonths     || tenureMonths     < 1    ||
      !prepaymentAmount || prepaymentAmount <= 0   ||
      !prepaymentMonth  || prepaymentMonth  < 1    ||
      prepaymentMonth > tenureMonths
    ) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculatePrepayment(
      principal, annualRate, tenureMonths, prepaymentAmount, prepaymentMonth
    );
    setResult(data);
    setLoading(false);
  }, [
    formData.principal,
    formData.annualRate,
    formData.tenureMonths,
    formData.prepaymentAmount,
    formData.prepaymentMonth,
  ]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const tenureYears     = Math.floor(Number(formData.tenureMonths) / 12);
  const tenureMonthsRem = Number(formData.tenureMonths) % 12;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Prepayment / Foreclosure Calculator</h1>
          <p className={styles.description}>
            See how much interest you save and how your loan tenure reduces
            when you make a lump sum prepayment on your loan.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Loan Details">
              <div className={styles.form}>

                <Input
                  label="Loan Amount"
                  type="number"
                  name="principal"
                  value={formData.principal}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="10000"
                  helpText="Original loan principal amount"
                />

                <Input
                  label="Interest Rate (per annum)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  min="0.1"
                  max="50"
                  step="0.1"
                  helpText="Annual interest rate"
                />

                <Input
                  label="Loan Tenure (months)"
                  type="number"
                  name="tenureMonths"
                  value={formData.tenureMonths}
                  onChange={handleChange}
                  suffix="months"
                  min="1"
                  max="360"
                  step="1"
                  helpText={
                    tenureYears > 0
                      ? `= ${tenureYears} year${tenureYears !== 1 ? 's' : ''} ${
                          tenureMonthsRem > 0
                            ? `${tenureMonthsRem} month${tenureMonthsRem !== 1 ? 's' : ''}`
                            : ''
                        }`
                      : ''
                  }
                />

              </div>
            </Card>

            <Card title="Prepayment Details">
              <div className={styles.form}>

                <Input
                  label="Prepayment Amount"
                  type="number"
                  name="prepaymentAmount"
                  value={formData.prepaymentAmount}
                  onChange={handleChange}
                  prefix="₹"
                  min="1"
                  step="10000"
                  helpText="Lump sum amount you plan to prepay"
                />

                <Input
                  label="Prepayment After (month)"
                  type="number"
                  name="prepaymentMonth"
                  value={formData.prepaymentMonth}
                  onChange={handleChange}
                  suffix="months"
                  min="1"
                  max={formData.tenureMonths}
                  step="1"
                  helpText="Which month you will make the prepayment"
                />

                {loading && (
                  <div className={styles.loading}>Calculating…</div>
                )}

              </div>
            </Card>
          </div>

          {/* ── RIGHT RESULTS ──────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {/* Hero Savings Card */}
                <Card variant="gradient" className={styles.savingsCard}>
                  <div className={styles.savingsHero}>
                    <div className={styles.savingsHeroLeft}>
                      <div className={styles.savingsHeroLabel}>Total Interest Saved</div>
                      <div className={styles.savingsHeroValue}>{formatCurrency(result.interestSaved)}</div>
                    </div>
                    <div className={styles.savingsDivider} />
                    <div className={styles.savingsHeroRight}>
                      <div className={styles.savingsHeroLabel}>Time Saved</div>
                      <div className={styles.savingsHeroValue}>{formatTenure(result.monthsSaved)}</div>
                    </div>
                  </div>
                </Card>

                {/* Before vs After Comparison */}
                <Card title="Before vs After Prepayment">
                  <div className={styles.beforeAfterGrid}>

                    <div className={styles.beforeCard}>
                      <div className={styles.beforeAfterHeader}>
                        <span className={styles.beforeBadge}>Without Prepayment</span>
                      </div>
                      <div className={styles.beforeAfterItems}>
                        <div className={styles.beforeAfterItem}>
                          <span>Monthly EMI</span>
                          <span className={styles.itemValue}>{formatCurrency(result.emi)}</span>
                        </div>
                        <div className={styles.beforeAfterItem}>
                          <span>Loan Tenure</span>
                          <span className={styles.itemValue}>{formatTenure(Number(formData.tenureMonths))}</span>
                        </div>
                        <div className={styles.beforeAfterItem}>
                          <span>Total Interest</span>
                          <span className={styles.itemValueRed}>{formatCurrency(result.normalTotalInterest)}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.afterCard}>
                      <div className={styles.beforeAfterHeader}>
                        <span className={styles.afterBadge}>With Prepayment</span>
                      </div>
                      <div className={styles.beforeAfterItems}>
                        <div className={styles.beforeAfterItem}>
                          <span>Monthly EMI</span>
                          <span className={styles.itemValue}>{formatCurrency(result.emi)}</span>
                        </div>
                        <div className={styles.beforeAfterItem}>
                          <span>New Tenure</span>
                          <span className={styles.itemValueGreen}>{formatTenure(result.newTenureMonths)}</span>
                        </div>
                        <div className={styles.beforeAfterItem}>
                          <span>Total Interest</span>
                          <span className={styles.itemValueGreen}>{formatCurrency(result.newTotalInterest)}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </Card>

                {/* Summary Stats */}
                <Card title="Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Your Monthly EMI</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.emi)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Months Saved</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {result.monthsSaved} months
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Saved</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.interestSaved)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Amount Paid</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.totalAmountPaid)}</div>
                    </div>

                  </div>

                  {/* Savings Progress Bar */}
                  {result.normalTotalInterest > 0 && (
                    <div className={styles.progressSection}>
                      <div className={styles.progressLabel}>
                        <span>Interest Saving Rate</span>
                        <span className={styles.progressPercent}>
                          {((result.interestSaved / result.normalTotalInterest) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${Math.min(100, (result.interestSaved / result.normalTotalInterest) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Card>

                {/* Interest Comparison Visual */}
                <Card title="Interest Cost Comparison">
                  <div className={styles.barComparison}>
                    <div className={styles.barRow}>
                      <div className={styles.barLabel}>Without Prepayment</div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{ width: '100%', background: '#ef4444' }}
                        />
                      </div>
                      <div className={styles.barValue}>{formatCurrency(result.normalTotalInterest)}</div>
                    </div>
                    <div className={styles.barRow}>
                      <div className={styles.barLabel}>With Prepayment</div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: result.normalTotalInterest > 0
                              ? `${(result.newTotalInterest / result.normalTotalInterest) * 100}%`
                              : '0%',
                            background: '#10b981',
                          }}
                        />
                      </div>
                      <div className={styles.barValue}>{formatCurrency(result.newTotalInterest)}</div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>📊</div>
                    <p className={styles.placeholderText}>
                      Enter loan and prepayment details to see your savings
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>
        </div>

        {/* ── INFO SECTION ───────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About Prepayment / Foreclosure Calculator</h2>
          <p>
            Prepaying your loan — even partially — can save you lakhs in interest and significantly
            reduce your loan tenure. This calculator helps you visualise the exact benefit of any
            lump sum prepayment.
          </p>

          <h3>How Prepayment Works</h3>
          <p>
            When you make a partial prepayment, the extra amount goes directly toward reducing your
            outstanding principal. This means less interest accrues in future months, either reducing
            your EMI or shortening your tenure (most lenders default to shortening tenure).
          </p>

          <h3>Types of Prepayment</h3>
          <ul>
            <li><strong>Partial Prepayment:</strong> Pay a lump sum to reduce outstanding principal. EMI stays the same but tenure reduces.</li>
            <li><strong>Full Foreclosure:</strong> Pay off the entire outstanding loan before tenure ends. Some lenders charge a foreclosure fee.</li>
            <li><strong>EMI Increase:</strong> Pay a higher EMI each month. Effectively same as monthly micro-prepayments.</li>
          </ul>

          <h3>Prepayment Charges</h3>
          <ul>
            <li>Home loans on floating rate: <strong>No prepayment charges</strong> (RBI rule).</li>
            <li>Car loans: Usually 3–5% of prepaid amount.</li>
            <li>Personal loans: Usually 2–5% of outstanding amount.</li>
            <li>Fixed rate loans: Lenders may charge 1–2% prepayment penalty.</li>
          </ul>

          <h3>Best Time to Prepay</h3>
          <ul>
            <li>Early in the loan tenure — more of each EMI goes to interest, so prepayment saves more.</li>
            <li>When you receive a bonus, inheritance, or any lump sum income.</li>
            <li>Before the loan crosses 50% of its tenure for maximum benefit.</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}