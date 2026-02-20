'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoanPieChart from '@/components/charts/LoanPieChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateHomeLoanEMI } from '@/lib/calculators';
import { formatCurrency, formatTenure } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function HomeLoanCalculator() {

  const [formData, setFormData] = useState({
    propertyValue:       '5000000',
    downPaymentPercent:  '20',
    rateOfInterest:      '8.5',
    tenureYears:         '20',
    processingFeePercent: '0.5',
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
    const propertyValue        = parseFloat(formData.propertyValue);
    const downPaymentPercent   = parseFloat(formData.downPaymentPercent);
    const annualRate           = parseFloat(formData.rateOfInterest);
    const tenureYears          = parseFloat(formData.tenureYears);
    const processingFeePercent = parseFloat(formData.processingFeePercent);

    if (
      !propertyValue  || propertyValue  < 10000 ||
      !annualRate     || annualRate     <= 0    ||
      !tenureYears    || tenureYears    < 1
    ) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateHomeLoanEMI(
      propertyValue,
      downPaymentPercent,
      annualRate,
      tenureYears,
      processingFeePercent
    );
    setResult(data);
    setLoading(false);

  }, [
    formData.propertyValue,
    formData.downPaymentPercent,
    formData.rateOfInterest,
    formData.tenureYears,
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Home Loan EMI Calculator</h1>
          <p className={styles.description}>
            Calculate your home loan EMI with property value, down payment, and LTV ratio.
            Plan your dream home purchase with full amortization schedule.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Home Loan Details">
              <div className={styles.form}>

                <Input
                  label="Property Value"
                  type="number"
                  name="propertyValue"
                  value={formData.propertyValue}
                  onChange={handleChange}
                  prefix="₹"
                  min="10000"
                  step="100000"
                  helpText="Total cost of the property"
                />

                <Input
                  label="Down Payment"
                  type="number"
                  name="downPaymentPercent"
                  value={formData.downPaymentPercent}
                  onChange={handleChange}
                  suffix="%"
                  min="0"
                  max="90"
                  step="5"
                  helpText={`= ${formatCurrency((formData.propertyValue * formData.downPaymentPercent) / 100)}`}
                />

                <Input
                  label="Interest Rate (per annum)"
                  type="number"
                  name="rateOfInterest"
                  value={formData.rateOfInterest}
                  onChange={handleChange}
                  suffix="%"
                  min="0.1"
                  max="30"
                  step="0.1"
                  helpText="Annual interest rate"
                />

                <Input
                  label="Loan Tenure (years)"
                  type="number"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
                  min="1"
                  max="30"
                  step="1"
                  helpText={`= ${formData.tenureYears * 12} months`}
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
                  helpText="One-time processing fee (% of loan)"
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
                <Card title="Home Loan Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Property Value</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.propertyValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Down Payment</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.downPayment)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Loan Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.loanAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>LTV Ratio</div>
                      <div className={styles.summaryValue}>
                        {result.ltvPercent}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Processing Fee</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.processingFee)}
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
                        {result.tenureYears} years
                      </div>
                    </div>

                  </div>

                  <LoanPieChart
                    principal={result.loanAmount}
                    interest={result.totalInterest}
                  />
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>🏠</div>
                    <p className={styles.placeholderText}>
                      Enter home loan details to see your EMI
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
            
            {/* Toggle Buttons */}
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
          <h2>About Home Loan EMI Calculator</h2>
          <p>
            A home loan (also called housing loan or mortgage) is a secured loan provided by
            banks and NBFCs to purchase a residential property. The loan is repaid through
            Equated Monthly Installments (EMIs) over a period of 5 to 30 years.
          </p>

          <h3>Key Components</h3>
          <ul>
            <li><strong>Property Value</strong> — Total cost of the house/flat you want to buy</li>
            <li><strong>Down Payment</strong> — Your upfront contribution (usually 10-20% of property value)</li>
            <li><strong>Loan Amount</strong> — Property Value − Down Payment</li>
            <li><strong>LTV (Loan-to-Value)</strong> — Loan Amount ÷ Property Value × 100 (max 80-90%)</li>
            <li><strong>Processing Fee</strong> — One-time charge by lender (0.25% to 1% of loan)</li>
          </ul>

          <h3>Home Loan EMI Formula</h3>
          <p><strong>EMI = [P × R × (1+R)^N] / [(1+R)^N − 1]</strong></p>
          <ul>
            <li><strong>P</strong> — Loan amount (Property Value − Down Payment)</li>
            <li><strong>R</strong> — Monthly interest rate</li>
            <li><strong>N</strong> — Tenure in months</li>
          </ul>

          <h3>Tips to Get Best Home Loan</h3>
          <ul>
            <li>Compare interest rates from multiple banks before finalizing.</li>
            <li>Maintain a good credit score (750+) to get lower interest rates.</li>
            <li>Pay higher down payment to reduce loan amount and EMI burden.</li>
            <li>Consider shorter tenure if you can afford higher EMI — saves interest.</li>
            <li>Check for hidden charges: processing fee, prepayment penalty, legal fees.</li>
            <li>Claim tax deductions: ₹1.5L under 80C (principal) + ₹2L under 24(b) (interest).</li>
          </ul>

          <h3>Eligibility Criteria</h3>
          <ul>
            <li>Age: 21-65 years</li>
            <li>Minimum monthly income: ₹25,000 (salaried), ₹3L annual (self-employed)</li>
            <li>FOIR (Fixed Obligation to Income Ratio): Usually 40-50%</li>
            <li>Credit Score: 750+ recommended</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}