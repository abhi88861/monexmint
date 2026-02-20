'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import LoanPieChart from '@/components/charts/LoanPieChart';
import { calculateLoanTenure } from '@/lib/calculators';
import { formatCurrency, formatTenure } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function LoanTenureCalculator() {
  const [formData, setFormData] = useState({
    principal:   '1000000',
    annualRate:  '8.5',
    desiredEMI:  '15000',
  });

  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const principal  = parseFloat(formData.principal);
    const annualRate = parseFloat(formData.annualRate);
    const desiredEMI = parseFloat(formData.desiredEMI);

    if (
      !principal  || principal  < 1000 ||
      !annualRate || annualRate <= 0   ||
      !desiredEMI || desiredEMI <= 0
    ) {
      setResult(null);
      setError(null);
      return;
    }

    setLoading(true);
    const data = calculateLoanTenure(principal, annualRate, desiredEMI);

    if (data && data.error) {
      setError(data.error);
      setResult(null);
    } else {
      setError(null);
      setResult(data);
    }

    setLoading(false);
  }, [formData.principal, formData.annualRate, formData.desiredEMI]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  // Minimum EMI to avoid error
  const minEMIHint = (() => {
    const p = parseFloat(formData.principal);
    const r = parseFloat(formData.annualRate);
    if (!p || !r) return null;
    const monthlyRate = r / 100 / 12;
    return Math.ceil(p * monthlyRate) + 1;
  })();

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Loan Tenure Calculator</h1>
          <p className={styles.description}>
            Find out exactly how long it will take to repay your loan based on
            your desired monthly EMI amount.
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
                  helpText="Total loan amount (principal)"
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
                  label="Desired Monthly EMI"
                  type="number"
                  name="desiredEMI"
                  value={formData.desiredEMI}
                  onChange={handleChange}
                  prefix="₹"
                  min="1"
                  step="500"
                  helpText={
                    minEMIHint
                      ? `Minimum EMI must exceed ₹${minEMIHint.toLocaleString('en-IN')}`
                      : 'How much you can pay per month'
                  }
                />

                {loading && (
                  <div className={styles.loading}>Calculating…</div>
                )}

                {error && (
                  <div className={styles.errorBox}>
                    <span className={styles.errorIcon}>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

              </div>
            </Card>

            {/* Quick EMI Suggestions */}
            {parseFloat(formData.principal) > 0 && parseFloat(formData.annualRate) > 0 && (
              <Card title="Quick EMI Options">
                <p className={styles.quickNote}>
                  Common tenure options for ₹{Number(formData.principal).toLocaleString('en-IN')} at {formData.annualRate}% p.a.
                </p>
                <div className={styles.quickGrid}>
                  {[60, 120, 180, 240, 300, 360].map((months) => {
                    const r = parseFloat(formData.annualRate) / 100 / 12;
                    const p = parseFloat(formData.principal);
                    if (!p || !r) return null;
                    const emi = (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
                    return (
                      <button
                        key={months}
                        className={styles.quickBtn}
                        onClick={() =>
                          setFormData(prev => ({ ...prev, desiredEMI: String(Math.round(emi)) }))
                        }
                      >
                        <span className={styles.quickBtnTenure}>{months / 12} yr</span>
                        <span className={styles.quickBtnEMI}>{formatCurrency(Math.round(emi))}</span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* ── RIGHT RESULTS ──────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {/* Tenure Result Card */}
                <Card variant="gradient" className={styles.tenureCard}>
                  <div className={styles.tenureHero}>
                    <div className={styles.tenureHeroLabel}>Loan Tenure Required</div>
                    <div className={styles.tenureHeroValue}>
                      {result.tenureYears > 0 && (
                        <span className={styles.tenureYears}>{result.tenureYears} <small>yrs</small></span>
                      )}
                      {result.remainingMonths > 0 && (
                        <span className={styles.tenureMonths}>{result.remainingMonths} <small>mo</small></span>
                      )}
                    </div>
                    <div className={styles.tenureMonthsTotal}>
                      {result.tenureMonths} months total
                    </div>
                  </div>
                </Card>

                {/* Summary */}
                <Card title="Loan Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Loan Amount</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.principal)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly EMI</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.emi)}
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
                      <div className={styles.summaryValue}>{formatCurrency(result.totalPayable)}</div>
                    </div>

                  </div>

                  <LoanPieChart
                    principal={result.principal}
                    interest={result.totalInterest}
                  />
                </Card>

                {/* Tenure Impact Table */}
                <Card title="How EMI Affects Tenure">
                  <p className={styles.tableNote}>
                    See how changing your EMI changes the loan tenure
                  </p>
                  <div className={styles.tableWrapper}>
                    <table className={styles.impactTable}>
                      <thead>
                        <tr>
                          <th>Monthly EMI</th>
                          <th>Tenure</th>
                          <th>Total Interest</th>
                          <th>Total Payable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const p = parseFloat(formData.principal);
                          const annualRate = parseFloat(formData.annualRate);
                          if (!p || !annualRate) return null;
                          const r = annualRate / 100 / 12;
                          const minEMI = p * r;

                          const multipliers = [1.1, 1.2, 1.3, 1.5, 1.75, 2.0, 2.5, 3.0];
                          const baseEMI = minEMI;

                          return multipliers.map((mult) => {
                            const emi = baseEMI * mult;
                            if (emi <= minEMI) return null;
                            const months = Math.ceil(
                              -Math.log(1 - (p * r) / emi) / Math.log(1 + r)
                            );
                            if (!isFinite(months) || months <= 0) return null;
                            const totalPayable = emi * months;
                            const totalInterest = totalPayable - p;
                            const isSelected = Math.round(emi) === Math.round(parseFloat(formData.desiredEMI));
                            return (
                              <tr key={mult} className={isSelected ? styles.selectedRow : ''}>
                                <td>{formatCurrency(Math.round(emi))}</td>
                                <td>{formatTenure(months)}</td>
                                <td>{formatCurrency(Math.round(totalInterest))}</td>
                                <td>{formatCurrency(Math.round(totalPayable))}</td>
                              </tr>
                            );
                          }).filter(Boolean);
                        })()}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            ) : (
              !loading && !error && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>📊</div>
                    <p className={styles.placeholderText}>
                      Enter loan details and desired EMI to calculate tenure
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>
        </div>

        {/* ── INFO SECTION ───────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About Loan Tenure Calculator</h2>
          <p>
            Instead of finding your EMI for a fixed tenure, this calculator works in reverse —
            you tell it how much EMI you can afford, and it tells you exactly how long the loan will take.
          </p>

          <h3>Tenure Formula</h3>
          <p>
            <strong>N = −ln(1 − P×r/EMI) / ln(1+r)</strong>
          </p>
          <ul>
            <li><strong>N</strong> — Tenure in months</li>
            <li><strong>P</strong> — Principal loan amount</li>
            <li><strong>r</strong> — Monthly interest rate (Annual ÷ 12 ÷ 100)</li>
            <li><strong>EMI</strong> — Your desired monthly installment</li>
          </ul>

          <h3>Important Rules</h3>
          <ul>
            <li>Your EMI must be higher than the monthly interest on the full principal (otherwise the loan never reduces).</li>
            <li>Higher EMI = shorter tenure = less total interest paid.</li>
            <li>Use the "Quick EMI Options" table to see standard EMIs for common tenures.</li>
          </ul>

          <h3>How to Use</h3>
          <ul>
            <li>Enter your loan amount and interest rate.</li>
            <li>Enter the EMI you can comfortably afford each month.</li>
            <li>The calculator instantly shows how many months your loan will last.</li>
            <li>Use the tenure impact table to compare different EMI levels.</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}