'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoanPieChart from '@/components/charts/LoanPieChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculatePersonalLoanEMI } from '@/lib/calculators';
import { formatCurrency, formatTenure } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function PersonalLoanCalculator() {

  const [formData, setFormData] = useState({
    loanAmount:            '500000',
    rateOfInterest:        '12',
    tenureMonths:          '36',
    processingFeePercent:  '2',
  });

  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [amortView, setAmortView] = useState('yearly');

  // ─── Input handler ────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ─── Calculation ──────────────────────────────────────────
  const compute = useCallback(() => {
    const loanAmount           = parseFloat(formData.loanAmount);
    const annualRate           = parseFloat(formData.rateOfInterest);
    const tenureMonths         = parseInt(formData.tenureMonths, 10);
    const processingFeePercent = parseFloat(formData.processingFeePercent);

    if (
      !loanAmount    || loanAmount    < 1000 ||
      !annualRate    || annualRate    <= 0   ||
      !tenureMonths  || tenureMonths  < 1
    ) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculatePersonalLoanEMI(
      loanAmount,
      annualRate,
      tenureMonths,
      processingFeePercent
    );
    setResult(data);
    setLoading(false);

  }, [
    formData.loanAmount,
    formData.rateOfInterest,
    formData.tenureMonths,
    formData.processingFeePercent,
  ]);

  // ─── Debounce ─────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  // ─── Aggregate monthly → yearly ───────────────────────────
  const getYearlySchedule = (schedule) => {
    if (!schedule || schedule.length === 0) return [];
    
    const years = [];
    let yearData = { year: 1, emiPaid: 0, principalPaid: 0, interestPaid: 0, balance: 0 };

    schedule.forEach((month, idx) => {
      yearData.emiPaid       += month.emi;
      yearData.principalPaid += month.principal;
      yearData.interestPaid  += month.interest;
      yearData.balance        = month.balance;

      if ((idx + 1) % 12 === 0 || idx === schedule.length - 1) {
        years.push({ ...yearData });
        yearData = { year: yearData.year + 1, emiPaid: 0, principalPaid: 0, interestPaid: 0, balance: 0 };
      }
    });

    return years;
  };

  const tenureYears     = Math.floor(Number(formData.tenureMonths) / 12);
  const tenureMonthsRem = Number(formData.tenureMonths) % 12;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Personal Loan EMI Calculator</h1>
          <p className={styles.description}>
            Calculate your personal loan EMI with processing fee, effective APR, and full amortization schedule.
            Get instant unsecured loan calculations.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Personal Loan Details">
              <div className={styles.form}>

                <Input
                  label="Loan Amount"
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="10000"
                  helpText="Unsecured loan amount (no collateral)"
                />

                <Input
                  label="Interest Rate (per annum)"
                  type="number"
                  name="rateOfInterest"
                  value={formData.rateOfInterest}
                  onChange={handleChange}
                  suffix="%"
                  min="0.1"
                  max="36"
                  step="0.1"
                  helpText="Annual interest rate (higher than secured loans)"
                />

                <Input
                  label="Loan Tenure (months)"
                  type="number"
                  name="tenureMonths"
                  value={formData.tenureMonths}
                  onChange={handleChange}
                  suffix="months"
                  min="6"
                  max="60"
                  step="6"
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

                <Input
                  label="Processing Fee"
                  type="number"
                  name="processingFeePercent"
                  value={formData.processingFeePercent}
                  onChange={handleChange}
                  suffix="%"
                  min="0"
                  max="5"
                  step="0.1"
                  helpText={`= ${formatCurrency((formData.loanAmount * formData.processingFeePercent) / 100)}`}
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
                {/* Monthly EMI Card */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Monthly EMI</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.emi)}
                    </div>
                  </div>
                </Card>

                {/* Summary */}
                <Card title="Personal Loan Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Loan Amount</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.principal)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Processing Fee</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.processingFee)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Net Disbursed</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.netDisbursed)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Nominal Rate</div>
                      <div className={styles.summaryValue}>
                        {formData.rateOfInterest}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Effective APR</div>
                      <div className={styles.summaryValue} style={{ color: '#ef4444' }}>
                        {result.effectiveAPR}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#f59e0b' }}>
                        {formatCurrency(result.totalInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Payable</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.totalPayable)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Loan Tenure</div>
                      <div className={styles.summaryValue}>
                        {formatTenure(result.tenureMonths)}
                      </div>
                    </div>

                  </div>

                  <LoanPieChart
                    principal={result.principal}
                    interest={result.totalInterest}
                  />
                </Card>

                {/* Effective APR Explanation */}
                <Card variant="warning" title="⚠️ About Effective APR">
                  <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.6' }}>
                    <strong>Effective APR ({result.effectiveAPR}%)</strong> is higher than the nominal rate
                    because processing fee reduces your net disbursed amount. You pay EMI on ₹{formatCurrency(result.principal)},
                    but receive only ₹{formatCurrency(result.netDisbursed)} after deducting ₹{formatCurrency(result.processingFee)} processing fee.
                  </p>
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>💳</div>
                    <p className={styles.placeholderText}>
                      Enter personal loan details to see your EMI
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>

        </div>

        {/* ── AMORTIZATION TABLE ─────────────────────────── */}
        {result && result.schedule && result.schedule.length > 0 && (
          <Card title="Your Amortization Details" className={styles.amortCard}>
            
            <div className={styles.toggleGroup}>
              <Button
                variant={amortView === 'yearly' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setAmortView('yearly')}
              >
                Yearly
              </Button>
              <Button
                variant={amortView === 'monthly' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setAmortView('monthly')}
              >
                Monthly
              </Button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.amortTable}>
                <thead>
                  <tr>
                    <th>{amortView === 'yearly' ? 'Year' : 'Month'}</th>
                    <th>EMI Paid</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortView === 'yearly' ? (
                    getYearlySchedule(result.schedule).map((row) => (
                      <tr key={row.year}>
                        <td>{row.year}</td>
                        <td>{formatCurrency(row.emiPaid)}</td>
                        <td>{formatCurrency(row.principalPaid)}</td>
                        <td>{formatCurrency(row.interestPaid)}</td>
                        <td>{formatCurrency(row.balance)}</td>
                      </tr>
                    ))
                  ) : (
                    result.schedule.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{formatCurrency(row.emi)}</td>
                        <td>{formatCurrency(row.principal)}</td>
                        <td>{formatCurrency(row.interest)}</td>
                        <td>{formatCurrency(row.balance)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ── INFO SECTION ───────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About Personal Loan EMI Calculator</h2>
          <p>
            A personal loan is an unsecured loan that doesn't require collateral. Banks and NBFCs offer
            personal loans for various purposes like medical emergencies, weddings, education, debt consolidation,
            home renovation, or travel. Since there's no collateral, interest rates are higher than secured loans.
          </p>

          <h3>Key Features of Personal Loans</h3>
          <ul>
            <li><strong>Unsecured</strong> — No collateral or security required</li>
            <li><strong>Quick Disbursal</strong> — Approval within 24-48 hours for good credit scores</li>
            <li><strong>Flexible Use</strong> — Can be used for any legitimate purpose</li>
            <li><strong>Higher Interest</strong> — 10.5% to 24% p.a. (vs 8-9% for home loans)</li>
            <li><strong>Shorter Tenure</strong> — 1 to 5 years typically</li>
            <li><strong>Processing Fee</strong> — 1% to 3% of loan amount (non-refundable)</li>
          </ul>

          <h3>Effective APR vs Nominal Rate</h3>
          <p>
            <strong>Effective APR (Annual Percentage Rate)</strong> includes processing fee impact.
            Example: Loan of ₹5,00,000 at 12% with 2% processing fee:
          </p>
          <ul>
            <li>Processing Fee: ₹10,000</li>
            <li>Net Disbursed: ₹4,90,000 (but EMI calculated on ₹5,00,000)</li>
            <li>Effective APR: ~12.82% (higher than nominal 12%)</li>
          </ul>
          <p>Always compare effective APR across lenders, not just the advertised rate.</p>

          <h3>Eligibility Criteria</h3>
          <ul>
            <li>Age: 21-60 years (salaried), 25-65 years (self-employed)</li>
            <li>Minimum monthly income: ₹25,000 (salaried), ₹3L annual (self-employed)</li>
            <li>Credit Score: 750+ (excellent), 650-749 (good), below 650 (difficult approval)</li>
            <li>Employment: Min 2 years total experience, 1 year in current job</li>
            <li>FOIR: EMI should not exceed 50% of monthly income</li>
          </ul>

          <h3>Tips to Get Best Personal Loan</h3>
          <ul>
            <li><strong>Maintain High Credit Score</strong> — 750+ gets lowest rates (10.5-12%)</li>
            <li><strong>Compare Effective APR</strong> — Not just interest rate, include processing fee</li>
            <li><strong>Borrow Only What You Need</strong> — Avoid overborrowing (tempting but costly)</li>
            <li><strong>Choose Shorter Tenure</strong> — Higher EMI but much lower total interest</li>
            <li><strong>Check Prepayment Penalty</strong> — Some lenders charge 2-5% on foreclosure</li>
            <li><strong>Negotiate Processing Fee</strong> — Can be waived for high credit scores</li>
            <li><strong>Avoid Multiple Applications</strong> — Each hard inquiry reduces credit score</li>
          </ul>

          <h3>Hidden Charges to Watch For</h3>
          <ul>
            <li>Processing Fee: 1-3% (non-refundable even if loan rejected)</li>
            <li>Prepayment/Foreclosure Penalty: 0-5% of outstanding principal</li>
            <li>Late Payment Fee: ₹500-1000 per default</li>
            <li>Bounce Charges: ₹300-750 per failed EMI auto-debit</li>
            <li>Documentation Charges: ₹500-2000 one-time</li>
            <li>GST: 18% on all fees (processing fee, foreclosure, late payment)</li>
          </ul>

          <h3>When to Avoid Personal Loans</h3>
          <ul>
            <li>For depreciating assets (vacations, consumer goods) — use savings instead</li>
            <li>For stock market investments — risky, interest &gt; potential returns</li>
            <li>When cheaper alternatives exist (gold loan, loan against FD/PPF)</li>
            <li>If your FOIR is already above 40% — indicates over-leverage</li>
            <li>For amounts below ₹50,000 — high processing fee makes it expensive</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}