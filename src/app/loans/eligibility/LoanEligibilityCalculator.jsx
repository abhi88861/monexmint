'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateLoanEligibility } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function LoanEligibilityCalculator() {

  const [formData, setFormData] = useState({
    monthlyIncome:  '100000',
    foirPercent:    '50',
    existingEMI:    '15000',
    rateOfInterest: '8.5',
    tenureMonths:   '240',
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
    const monthlyIncome = parseFloat(formData.monthlyIncome);
    const foirPercent   = parseFloat(formData.foirPercent);
    const existingEMI   = parseFloat(formData.existingEMI);
    const annualRate    = parseFloat(formData.rateOfInterest);
    const tenureMonths  = parseInt(formData.tenureMonths, 10);

    if (
      !monthlyIncome || monthlyIncome <= 0 ||
      !foirPercent   || foirPercent   <= 0 ||
      !annualRate    || annualRate    <= 0 ||
      !tenureMonths  || tenureMonths  < 1
    ) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateLoanEligibility(
      monthlyIncome,
      foirPercent,
      existingEMI || 0,
      annualRate,
      tenureMonths
    );
    setResult(data);
    setLoading(false);

  }, [
    formData.monthlyIncome,
    formData.foirPercent,
    formData.existingEMI,
    formData.rateOfInterest,
    formData.tenureMonths,
  ]);

  // ─── Debounce ─────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const tenureYears = Math.floor(Number(formData.tenureMonths) / 12);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Loan Eligibility Calculator</h1>
          <p className={styles.description}>
            Check how much home or personal loan you are eligible for based on your monthly income,
            existing EMIs, and Fixed Obligation to Income Ratio (FOIR).
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Your Financial Details">
              <div className={styles.form}>

                <Input
                  label="Monthly Gross Income"
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  prefix="₹"
                  min="10000"
                  step="5000"
                  helpText="Your total monthly salary (before deductions)"
                />

                <Input
                  label="Existing EMIs (if any)"
                  type="number"
                  name="existingEMI"
                  value={formData.existingEMI}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="1000"
                  helpText="Total of all current loan EMIs"
                />

                <Input
                  label="FOIR (Fixed Obligation to Income Ratio)"
                  type="number"
                  name="foirPercent"
                  value={formData.foirPercent}
                  onChange={handleChange}
                  suffix="%"
                  min="30"
                  max="60"
                  step="5"
                  helpText="Banks typically allow 40-50% FOIR"
                />

                <Input
                  label="Expected Interest Rate"
                  type="number"
                  name="rateOfInterest"
                  value={formData.rateOfInterest}
                  onChange={handleChange}
                  suffix="%"
                  min="0.1"
                  max="30"
                  step="0.1"
                  helpText="Expected annual interest rate"
                />

                <Input
                  label="Loan Tenure (months)"
                  type="number"
                  name="tenureMonths"
                  value={formData.tenureMonths}
                  onChange={handleChange}
                  suffix="months"
                  min="12"
                  max="360"
                  step="12"
                  helpText={`= ${tenureYears} years`}
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
                {/* Eligible Amount Card */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Maximum Eligible Loan</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.eligibleAmount)}
                    </div>
                  </div>
                </Card>

                {/* Breakdown */}
                <Card title="Eligibility Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly Income</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.monthlyIncome)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>FOIR %</div>
                      <div className={styles.summaryValue}>
                        {result.foirPercent}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Existing EMIs</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.existingEMI)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Max EMI Allowed</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.maxEMI)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Rate</div>
                      <div className={styles.summaryValue}>
                        {formData.rateOfInterest}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Loan Tenure</div>
                      <div className={styles.summaryValue}>
                        {tenureYears} years
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Eligible Loan Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1', fontSize: '1.75rem' }}>
                        {formatCurrency(result.eligibleAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly EMI</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.maxEMI)}
                      </div>
                    </div>

                  </div>
                </Card>

                {/* Formula Explanation */}
                <Card title="How Is This Calculated?" variant="outlined">
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7' }}>
                    <p><strong>Step 1:</strong> Calculate Max EMI Allowed</p>
                    <p style={{ marginLeft: '1rem', color: '#64748b' }}>
                      Max EMI = (Monthly Income × FOIR%) − Existing EMIs<br/>
                      Max EMI = (₹{formatCurrency(result.monthlyIncome)} × {result.foirPercent}%) − ₹{formatCurrency(result.existingEMI)}<br/>
                      <strong>Max EMI = ₹{formatCurrency(result.maxEMI)}</strong>
                    </p>

                    <p style={{ marginTop: '1rem' }}><strong>Step 2:</strong> Calculate Eligible Loan</p>
                    <p style={{ marginLeft: '1rem', color: '#64748b' }}>
                      Based on EMI of ₹{formatCurrency(result.maxEMI)} at {formData.rateOfInterest}% for {tenureYears} years<br/>
                      <strong>Eligible Loan = ₹{formatCurrency(result.eligibleAmount)}</strong>
                    </p>
                  </div>
                </Card>

                {/* Status Indicator */}
                {result.maxEMI > 0 ? (
                  <Card variant="success">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#059669' }}>You are Eligible!</h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#047857' }}>
                        You can apply for a loan up to <strong>₹{formatCurrency(result.eligibleAmount)}</strong> with
                        monthly EMI of <strong>₹{formatCurrency(result.maxEMI)}</strong>
                      </p>
                    </div>
                  </Card>
                ) : (
                  <Card variant="danger">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>❌</div>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#dc2626' }}>Not Eligible</h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#b91c1c' }}>
                        Your existing EMIs (₹{formatCurrency(result.existingEMI)}) exceed the allowed FOIR limit.
                        Consider paying off existing loans before applying for a new one.
                      </p>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>📊</div>
                    <p className={styles.placeholderText}>
                      Enter your financial details to check loan eligibility
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>

        </div>

        {/* ── INFO SECTION ───────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About Loan Eligibility Calculator</h2>
          <p>
            This calculator helps you determine the maximum loan amount you are eligible for based on
            your monthly income, existing financial obligations, and the lender's Fixed Obligation to
            Income Ratio (FOIR) criteria.
          </p>

          <h3>What is FOIR?</h3>
          <p>
            <strong>FOIR (Fixed Obligation to Income Ratio)</strong> is the percentage of your monthly
            income that goes toward paying EMIs and other fixed obligations. Banks use FOIR to assess
            your repayment capacity and determine how much additional loan you can afford.
          </p>
          <p>
            <strong>Formula:</strong> FOIR % = (Total Monthly EMIs ÷ Gross Monthly Income) × 100
          </p>

          <h3>FOIR Guidelines by Lenders</h3>
          <ul>
            <li><strong>SBI, HDFC, ICICI (Home Loans):</strong> 40-50% FOIR</li>
            <li><strong>Personal Loans:</strong> 50-55% FOIR</li>
            <li><strong>Car Loans:</strong> 45-50% FOIR</li>
            <li><strong>High Net Worth Individuals:</strong> Up to 60% FOIR</li>
            <li><strong>Low Credit Score Applicants:</strong> 35-40% FOIR (conservative)</li>
          </ul>

          <h3>Factors Affecting Loan Eligibility</h3>
          <ul>
            <li><strong>Monthly Income:</strong> Higher income = higher loan eligibility</li>
            <li><strong>Existing EMIs:</strong> Lower existing obligations = more borrowing capacity</li>
            <li><strong>Credit Score:</strong> 750+ gets maximum eligibility, 650-749 moderate, below 650 limited</li>
            <li><strong>Age:</strong> Younger applicants get longer tenure, hence higher eligibility</li>
            <li><strong>Employment Stability:</strong> 2+ years in current job increases eligibility</li>
            <li><strong>Property Value (for home loans):</strong> Banks lend 80-90% LTV (Loan-to-Value)</li>
          </ul>

          <h3>How to Increase Your Loan Eligibility</h3>
          <ul>
            <li><strong>Add a Co-Applicant:</strong> Spouse's income adds to total, increases eligibility by 50-70%</li>
            <li><strong>Pay Off Existing Loans:</strong> Reduces existing EMIs, frees up FOIR capacity</li>
            <li><strong>Improve Credit Score:</strong> Above 750 qualifies for maximum loan amount</li>
            <li><strong>Choose Longer Tenure:</strong> Lower monthly EMI = higher loan eligibility</li>
            <li><strong>Show Additional Income:</strong> Rental income, freelance earnings (if documented)</li>
            <li><strong>Reduce Credit Card Utilization:</strong> Keep below 30% of limit</li>
          </ul>

          <h3>Example Calculation</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Scenario:</strong></p>
            <ul style={{ marginBottom: '1rem' }}>
              <li>Monthly Income: ₹1,00,000</li>
              <li>Existing Car Loan EMI: ₹15,000</li>
              <li>FOIR Allowed: 50%</li>
              <li>Interest Rate: 8.5% p.a.</li>
              <li>Tenure: 20 years</li>
            </ul>
            <p><strong>Calculation:</strong></p>
            <ul>
              <li>Max Total EMI = ₹1,00,000 × 50% = ₹50,000</li>
              <li>Available for New Loan = ₹50,000 − ₹15,000 = ₹35,000</li>
              <li>Eligible Loan Amount = ₹35,000 → ~₹48,00,000</li>
            </ul>
          </div>

          <h3>Important Notes</h3>
          <ul>
            <li>This is an <strong>indicative calculation</strong>. Actual eligibility depends on lender's internal policies.</li>
            <li>Banks may consider <strong>other obligations</strong> like rent, utility bills in FOIR.</li>
            <li>Higher FOIR (60%+) leaves little room for emergencies — risky financial position.</li>
            <li>For <strong>joint loans</strong>, both applicants' incomes and obligations are considered.</li>
            <li><strong>Self-employed</strong> individuals: Eligibility based on ITR of last 2-3 years.</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}