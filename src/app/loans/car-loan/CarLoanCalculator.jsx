'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoanPieChart from '@/components/charts/LoanPieChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateCarLoanEMI } from '@/lib/calculators';
import { formatCurrency, formatTenure } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function CarLoanCalculator() {

  const [formData, setFormData] = useState({
    exShowroomPrice:   '800000',
    downPaymentAmount: '100000',
    rateOfInterest:    '9.5',
    tenureYears:       '5',
    insuranceAmount:   '50000',
    rtoPercent:        '9',
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
    const exShowroomPrice   = parseFloat(formData.exShowroomPrice);
    const downPaymentAmount = parseFloat(formData.downPaymentAmount);
    const annualRate        = parseFloat(formData.rateOfInterest);
    const tenureYears       = parseFloat(formData.tenureYears);
    const insuranceAmount   = parseFloat(formData.insuranceAmount);
    const rtoPercent        = parseFloat(formData.rtoPercent);

    if (
      !exShowroomPrice || exShowroomPrice < 10000 ||
      !annualRate      || annualRate      <= 0    ||
      !tenureYears     || tenureYears     < 1
    ) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateCarLoanEMI(
      exShowroomPrice,
      downPaymentAmount,
      annualRate,
      tenureYears,
      insuranceAmount,
      rtoPercent
    );
    setResult(data);
    setLoading(false);

  }, [
    formData.exShowroomPrice,
    formData.downPaymentAmount,
    formData.rateOfInterest,
    formData.tenureYears,
    formData.insuranceAmount,
    formData.rtoPercent,
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
          <h1 className={styles.title}>Car Loan EMI Calculator</h1>
          <p className={styles.description}>
            Calculate your car loan EMI with on-road price, RTO charges, insurance, and full amortization schedule.
            Plan your dream car purchase with accurate calculations.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Car Loan Details">
              <div className={styles.form}>

                <Input
                  label="Ex-Showroom Price"
                  type="number"
                  name="exShowroomPrice"
                  value={formData.exShowroomPrice}
                  onChange={handleChange}
                  prefix="₹"
                  min="10000"
                  step="10000"
                  helpText="Base price of the car (before registration)"
                />

                <Input
                  label="Down Payment"
                  type="number"
                  name="downPaymentAmount"
                  value={formData.downPaymentAmount}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="5000"
                  helpText="Your upfront payment"
                />

                <Input
                  label="Insurance Amount"
                  type="number"
                  name="insuranceAmount"
                  value={formData.insuranceAmount}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="1000"
                  helpText="Comprehensive car insurance (annual)"
                />

                <Input
                  label="RTO Charges"
                  type="number"
                  name="rtoPercent"
                  value={formData.rtoPercent}
                  onChange={handleChange}
                  suffix="%"
                  min="0"
                  max="20"
                  step="0.5"
                  helpText={`= ${formatCurrency((formData.exShowroomPrice * formData.rtoPercent) / 100)}`}
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
                  max="7"
                  step="1"
                  helpText={`= ${formData.tenureYears * 12} months`}
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
                <Card title="Car Loan Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Ex-Showroom Price</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.exShowroomPrice)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>RTO Charges</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.rtoCharges)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Insurance</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.insuranceAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>On-Road Price</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.onRoadPrice)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Down Payment</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.downPaymentAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Loan Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.loanAmount)}
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
                    <div className={styles.placeholderIcon}>🚗</div>
                    <p className={styles.placeholderText}>
                      Enter car loan details to see your EMI
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
          <h2>About Car Loan EMI Calculator</h2>
          <p>
            A car loan (also called auto loan or vehicle loan) is a secured loan provided by banks,
            NBFCs, and car manufacturers to purchase a new or used car. The loan is repaid through
            Equated Monthly Installments (EMIs) over a period of 1 to 7 years.
          </p>

          <h3>On-Road Price Calculation</h3>
          <p><strong>On-Road Price = Ex-Showroom + RTO + Insurance + Other Charges</strong></p>
          <ul>
            <li><strong>Ex-Showroom Price</strong> — Base price of the car at the dealership</li>
            <li><strong>RTO Charges</strong> — Road Tax + Registration (8-12% of ex-showroom price)</li>
            <li><strong>Insurance</strong> — Comprehensive insurance (mandatory first year)</li>
            <li><strong>Other Charges</strong> — Accessories, extended warranty, handling fees</li>
          </ul>

          <h3>Car Loan Components</h3>
          <ul>
            <li><strong>Down Payment</strong> — Your upfront contribution (10-25% recommended)</li>
            <li><strong>Loan Amount</strong> — On-Road Price − Down Payment</li>
            <li><strong>Interest Rate</strong> — 7.5% to 14% p.a. depending on lender and credit score</li>
            <li><strong>Tenure</strong> — 1 to 7 years (most common: 3-5 years)</li>
          </ul>

          <h3>Tips to Get Best Car Loan</h3>
          <ul>
            <li>Compare interest rates from banks, NBFCs, and manufacturer financing.</li>
            <li>Maintain credit score above 750 for lower interest rates.</li>
            <li>Pay at least 20% down payment to reduce EMI burden.</li>
            <li>Choose shorter tenure (3-4 years) if possible — saves interest.</li>
            <li>Check for hidden charges: processing fee, prepayment penalty, foreclosure.</li>
            <li>Avoid taking loan for full on-road price — increases EMI significantly.</li>
            <li>Consider used car loan rates (usually 1-2% higher than new car).</li>
          </ul>

          <h3>Eligibility Criteria</h3>
          <ul>
            <li>Age: 21-65 years</li>
            <li>Minimum monthly income: ₹20,000 (salaried), ₹2L annual (self-employed)</li>
            <li>Credit Score: 650+ acceptable, 750+ for best rates</li>
            <li>Employment: Min 1 year in current organization (salaried)</li>
            <li>Max EMI: Should not exceed 50% of monthly income</li>
          </ul>

          <h3>Tax Benefits</h3>
          <p>
            <strong>Important:</strong> Unlike home loans, car loans do NOT offer any tax deductions
            on principal or interest under current Income Tax Act. However, if the car is used for
            business purposes, interest may be claimed as business expense under Section 37.
          </p>
        </Card>

      </div>
    </div>
  );
}