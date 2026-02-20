'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateBalanceTransfer } from '@/lib/calculators';
import { formatCurrency, formatTenure } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function BalanceTransferCalculator() {
  const [formData, setFormData] = useState({
    outstandingPrincipal: '1500000',
    currentRate:          '9.5',
    newRate:              '8.0',
    remainingMonths:      '180',
    transferFeePercent:   '1',
  });

  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const outstandingPrincipal = parseFloat(formData.outstandingPrincipal);
    const currentRate          = parseFloat(formData.currentRate);
    const newRate              = parseFloat(formData.newRate);
    const remainingMonths      = parseInt(formData.remainingMonths, 10);
    const transferFeePercent   = parseFloat(formData.transferFeePercent) || 0;

    if (
      !outstandingPrincipal || outstandingPrincipal < 1000 ||
      !currentRate          || currentRate          <= 0   ||
      !newRate              || newRate              <= 0   ||
      !remainingMonths      || remainingMonths      < 1
    ) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateBalanceTransfer(
      outstandingPrincipal, currentRate, newRate, remainingMonths, transferFeePercent
    );
    setResult(data);
    setLoading(false);
  }, [
    formData.outstandingPrincipal,
    formData.currentRate,
    formData.newRate,
    formData.remainingMonths,
    formData.transferFeePercent,
  ]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const remainingYears     = Math.floor(Number(formData.remainingMonths) / 12);
  const remainingMonthsRem = Number(formData.remainingMonths) % 12;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Loan Balance Transfer Calculator</h1>
          <p className={styles.description}>
            Should you transfer your home loan to a lender offering a lower rate?
            Calculate exact savings, break-even point, and net benefit after fees.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Current Loan Details">
              <div className={styles.form}>

                <Input
                  label="Outstanding Principal"
                  type="number"
                  name="outstandingPrincipal"
                  value={formData.outstandingPrincipal}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="10000"
                  helpText="Remaining loan balance to be paid"
                />

                <Input
                  label="Current Interest Rate"
                  type="number"
                  name="currentRate"
                  value={formData.currentRate}
                  onChange={handleChange}
                  suffix="%"
                  min="0.1"
                  max="50"
                  step="0.1"
                  helpText="Your existing lender's annual rate"
                />

                <Input
                  label="Remaining Tenure (months)"
                  type="number"
                  name="remainingMonths"
                  value={formData.remainingMonths}
                  onChange={handleChange}
                  suffix="months"
                  min="1"
                  max="360"
                  step="1"
                  helpText={
                    remainingYears > 0
                      ? `= ${remainingYears} year${remainingYears !== 1 ? 's' : ''} ${
                          remainingMonthsRem > 0
                            ? `${remainingMonthsRem} month${remainingMonthsRem !== 1 ? 's' : ''}`
                            : ''
                        }`
                      : ''
                  }
                />

              </div>
            </Card>

            <Card title="New Lender Details">
              <div className={styles.form}>

                <Input
                  label="New Interest Rate"
                  type="number"
                  name="newRate"
                  value={formData.newRate}
                  onChange={handleChange}
                  suffix="%"
                  min="0.1"
                  max="50"
                  step="0.1"
                  helpText="New lender's offered annual rate"
                />

                <Input
                  label="Processing / Transfer Fee"
                  type="number"
                  name="transferFeePercent"
                  value={formData.transferFeePercent}
                  onChange={handleChange}
                  suffix="% of outstanding"
                  min="0"
                  max="5"
                  step="0.1"
                  helpText="New lender's one-time processing fee"
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
                {/* Verdict Banner */}
                <div className={result.worthTransferring ? styles.verdictGood : styles.verdictBad}>
                  <div className={styles.verdictIcon}>
                    {result.worthTransferring ? '✅' : '❌'}
                  </div>
                  <div className={styles.verdictText}>
                    <div className={styles.verdictTitle}>
                      {result.worthTransferring
                        ? 'Balance Transfer is Beneficial!'
                        : 'Balance Transfer is NOT Recommended'}
                    </div>
                    <div className={styles.verdictSub}>
                      {result.worthTransferring
                        ? `You save ${formatCurrency(result.totalSavings)} by switching lenders`
                        : `You would pay ${formatCurrency(Math.abs(result.totalSavings))} more after the transfer`}
                    </div>
                  </div>
                </div>

                {/* EMI Comparison */}
                <Card title="Monthly EMI Comparison">
                  <div className={styles.emiCompareGrid}>

                    <div className={styles.emiCompareCard}>
                      <div className={styles.emiCompareBadge} style={{ background: '#fef2f2', color: '#ef4444', borderColor: '#fecaca' }}>
                        Current Lender — {formData.currentRate}%
                      </div>
                      <div className={styles.emiCompareValue}>{formatCurrency(result.currentEMI)}</div>
                      <div className={styles.emiCompareLabel}>per month</div>
                    </div>

                    <div className={styles.vsCircle}>VS</div>

                    <div className={styles.emiCompareCard}>
                      <div className={styles.emiCompareBadge} style={{ background: '#f0fdf4', color: '#10b981', borderColor: '#bbf7d0' }}>
                        New Lender — {formData.newRate}%
                      </div>
                      <div className={styles.emiCompareValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.newEMI)}
                      </div>
                      <div className={styles.emiCompareLabel}>per month</div>
                    </div>

                  </div>

                  {result.currentEMI > result.newEMI && (
                    <div className={styles.emiSavingBadge}>
                      Monthly Saving: <strong>{formatCurrency(result.currentEMI - result.newEMI)}</strong>
                    </div>
                  )}
                </Card>

                {/* Full Cost Comparison */}
                <Card title="Total Cost Comparison">
                  <div className={styles.costCompareGrid}>

                    <div className={styles.costCard} style={{ borderColor: '#fecaca', background: '#fff5f5' }}>
                      <div className={styles.costCardHeader}>Current Lender</div>
                      <div className={styles.costItem}>
                        <span>Total Payable</span>
                        <span className={styles.costValue}>{formatCurrency(result.currentTotal)}</span>
                      </div>
                      <div className={styles.costItem}>
                        <span>Total Interest</span>
                        <span style={{ color: '#ef4444', fontWeight: 700 }}>{formatCurrency(result.currentInterest)}</span>
                      </div>
                      <div className={styles.costItem}>
                        <span>Transfer Fee</span>
                        <span>—</span>
                      </div>
                    </div>

                    <div className={styles.costCard} style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}>
                      <div className={styles.costCardHeader}>New Lender</div>
                      <div className={styles.costItem}>
                        <span>Total Payable</span>
                        <span className={styles.costValue}>{formatCurrency(result.newTotal)}</span>
                      </div>
                      <div className={styles.costItem}>
                        <span>Total Interest</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>{formatCurrency(result.newInterest)}</span>
                      </div>
                      <div className={styles.costItem}>
                        <span>Transfer Fee</span>
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>{formatCurrency(result.transferFee)}</span>
                      </div>
                    </div>

                  </div>
                </Card>

                {/* Key Metrics */}
                <Card title="Key Metrics">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Savings</div>
                      <div
                        className={styles.summaryValue}
                        style={{ color: result.worthTransferring ? '#10b981' : '#ef4444' }}
                      >
                        {result.worthTransferring ? '' : '-'}{formatCurrency(Math.abs(result.totalSavings))}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Transfer Fee</div>
                      <div className={styles.summaryValue} style={{ color: '#f59e0b' }}>
                        {formatCurrency(result.transferFee)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Break-Even Period</div>
                      <div className={styles.summaryValue}>
                        {result.breakEvenMonth && result.breakEvenMonth > 0
                          ? `${result.breakEvenMonth} months`
                          : result.worthTransferring ? 'Immediate' : 'Never'}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Rate Reduction</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {(parseFloat(formData.currentRate) - parseFloat(formData.newRate)).toFixed(2)}%
                      </div>
                    </div>

                  </div>

                  {/* Break-even visualization */}
                  {result.worthTransferring && result.breakEvenMonth && result.breakEvenMonth > 0 && (
                    <div className={styles.breakEvenSection}>
                      <div className={styles.breakEvenLabel}>
                        <span>Break-Even Progress</span>
                        <span className={styles.breakEvenPercent}>
                          Month {result.breakEvenMonth} of {formData.remainingMonths}
                        </span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${Math.min(100, (result.breakEvenMonth / Number(formData.remainingMonths)) * 100)}%`,
                          }}
                        />
                      </div>
                      <p className={styles.breakEvenNote}>
                        After month {result.breakEvenMonth}, every subsequent month you benefit from lower interest.
                      </p>
                    </div>
                  )}
                </Card>

                {/* Interest Bar Comparison */}
                <Card title="Total Interest Comparison">
                  <div className={styles.barComparison}>
                    <div className={styles.barRow}>
                      <div className={styles.barLabel}>Current Lender</div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{ width: '100%', background: '#ef4444' }}
                        />
                      </div>
                      <div className={styles.barValue}>{formatCurrency(result.currentInterest)}</div>
                    </div>
                    <div className={styles.barRow}>
                      <div className={styles.barLabel}>New Lender</div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: result.currentInterest > 0
                              ? `${(result.newInterest / result.currentInterest) * 100}%`
                              : '0%',
                            background: '#10b981',
                          }}
                        />
                      </div>
                      <div className={styles.barValue}>{formatCurrency(result.newInterest)}</div>
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
                      Enter loan details to evaluate balance transfer benefit
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>
        </div>

        {/* ── INFO SECTION ───────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About Loan Balance Transfer Calculator</h2>
          <p>
            A loan balance transfer means moving your outstanding loan from your current lender
            to a new lender offering a lower interest rate. While the lower rate saves interest,
            there are processing fees and costs involved — this calculator helps you decide if
            the switch is truly worth it.
          </p>

          <h3>When Should You Transfer?</h3>
          <ul>
            <li>The new rate is at least <strong>0.5% lower</strong> than your current rate.</li>
            <li>You have a <strong>significant outstanding balance</strong> (typically ₹20L+).</li>
            <li>You have <strong>enough remaining tenure</strong> to recoup the transfer fee (usually 3+ years).</li>
            <li>The <strong>break-even period</strong> is within your remaining tenure.</li>
          </ul>

          <h3>Costs to Consider</h3>
          <ul>
            <li><strong>Processing Fee:</strong> New lender charges 0.5–1% of the outstanding loan.</li>
            <li><strong>Foreclosure Charges:</strong> Some lenders charge 1–2% for early closure (not applicable for floating rate home loans per RBI).</li>
            <li><strong>Legal & Documentation:</strong> ₹5,000–₹15,000 for property document transfer.</li>
            <li><strong>MODT/Stamp Duty:</strong> State-specific charges for new mortgage registration.</li>
          </ul>

          <h3>RBI Rules on Balance Transfer</h3>
          <ul>
            <li>For floating rate home loans, existing lenders cannot charge prepayment or foreclosure penalty.</li>
            <li>Fixed rate loans may still have foreclosure charges — check your loan agreement.</li>
            <li>Your CIBIL score impacts the rate offered by the new lender.</li>
          </ul>

          <h3>Steps to Transfer</h3>
          <ul>
            <li>Get a Foreclosure Letter from your current lender showing outstanding balance and principal.</li>
            <li>Apply for a new loan with the new lender by submitting income and property documents.</li>
            <li>New lender disburses the amount directly to your existing lender.</li>
            <li>You start repaying EMIs to the new lender.</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}