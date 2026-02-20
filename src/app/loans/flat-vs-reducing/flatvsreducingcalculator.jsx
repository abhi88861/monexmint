'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AdSlot from '@/components/ads/AdSlot';
import { calculateFlatVsReducing } from '@/lib/calculators';
import { formatCurrency, formatTenure } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function FlatVsReducingCalculator() {
  const [formData, setFormData] = useState({
    principal:    '500000',
    flatRate:     '10',
    tenureYears:  '5',
  });

  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const principal   = parseFloat(formData.principal);
    const flatRate    = parseFloat(formData.flatRate);
    const tenureYears = parseInt(formData.tenureYears, 10);

    if (
      !principal   || principal   < 1000 ||
      !flatRate    || flatRate    <= 0   ||
      !tenureYears || tenureYears < 1
    ) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateFlatVsReducing(principal, flatRate, tenureYears);
    setResult(data);
    setLoading(false);
  }, [formData.principal, formData.flatRate, formData.tenureYears]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Flat vs Reducing Interest Rate Calculator</h1>
          <p className={styles.description}>
            Compare the true cost of a flat rate loan versus a reducing balance loan.
            Find the equivalent reducing rate for any flat rate loan.
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
                  step="1000"
                  helpText="Principal loan amount"
                />

                <Input
                  label="Flat Interest Rate (per annum)"
                  type="number"
                  name="flatRate"
                  value={formData.flatRate}
                  onChange={handleChange}
                  suffix="%"
                  min="0.1"
                  max="50"
                  step="0.1"
                  helpText="Annual flat rate as quoted by lender"
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
                  helpText="Total loan duration in years"
                />

                {loading && (
                  <div className={styles.loading}>Calculating…</div>
                )}

              </div>
            </Card>

            {/* Info Box */}
            <Card className={styles.infoBoxCard}>
              <div className={styles.infoBox}>
                <div className={styles.infoBoxIcon}>💡</div>
                <div>
                  <strong>What's the difference?</strong>
                  <p className={styles.infoBoxText}>
                    In a <strong>Flat Rate</strong> loan, interest is calculated on the original principal throughout.
                    In a <strong>Reducing Balance</strong> loan, interest is charged only on the outstanding principal,
                    making it genuinely cheaper.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* ── RIGHT RESULTS ──────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {/* Comparison Cards */}
                <div className={styles.comparisonGrid}>

                  {/* Flat Rate Card */}
                  <Card variant="gradient" className={styles.flatCard}>
                    <div className={styles.rateCardHeader}>
                      <span className={styles.rateCardBadge}>Flat Rate</span>
                      <span className={styles.rateCardRate}>{result.flatRate}%</span>
                    </div>
                    <div className={styles.rateCardEMI}>
                      <div className={styles.emiLabel}>Monthly EMI</div>
                      <div className={styles.emiValue}>{formatCurrency(result.flatEMI)}</div>
                    </div>
                    <div className={styles.rateCardDetails}>
                      <div className={styles.rateCardItem}>
                        <span>Total Interest</span>
                        <span className={styles.interestBad}>{formatCurrency(result.flatTotalInterest)}</span>
                      </div>
                      <div className={styles.rateCardItem}>
                        <span>Total Payable</span>
                        <span>{formatCurrency(result.flatTotalPayable)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Reducing Rate Card */}
                  <Card className={styles.reducingCard}>
                    <div className={styles.rateCardHeader}>
                      <span className={styles.rateCardBadgeGreen}>Reducing Rate</span>
                      <span className={styles.rateCardRateGreen}>{result.equivalentReducingRate}%</span>
                    </div>
                    <div className={styles.rateCardEMI}>
                      <div className={styles.emiLabel}>Monthly EMI</div>
                      <div className={styles.emiValue}>{formatCurrency(result.reducingEMI)}</div>
                    </div>
                    <div className={styles.rateCardDetails}>
                      <div className={styles.rateCardItem}>
                        <span>Total Interest</span>
                        <span className={styles.interestGood}>{formatCurrency(result.reducingTotalInterest)}</span>
                      </div>
                      <div className={styles.rateCardItem}>
                        <span>Total Payable</span>
                        <span>{formatCurrency(result.reducingTotalPayable)}</span>
                      </div>
                    </div>
                  </Card>

                </div>

                {/* Summary Insight */}
                <Card title="Key Insight">
                  <div className={styles.insightBox}>
                    <div className={styles.insightMain}>
                      <div className={styles.insightLabel}>Equivalent Reducing Rate for {result.flatRate}% Flat</div>
                      <div className={styles.insightValue}>{result.equivalentReducingRate}% p.a.</div>
                      <p className={styles.insightNote}>
                        A flat rate of <strong>{result.flatRate}%</strong> is effectively equivalent to a
                        reducing balance rate of <strong>{result.equivalentReducingRate}%</strong>.
                      </p>
                    </div>

                    <div className={styles.savingsHighlight}>
                      <div className={styles.savingsLabel}>Extra Interest in Flat Rate</div>
                      <div className={styles.savingsValue}>{formatCurrency(result.interestDifference)}</div>
                      <p className={styles.savingsNote}>More interest paid with flat rate vs reducing rate</p>
                    </div>
                  </div>

                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Loan Amount</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.principal)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tenure</div>
                      <div className={styles.summaryValue}>{formatTenure(result.tenureMonths)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Flat EMI</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.flatEMI)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Reducing EMI</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.reducingEMI)}</div>
                    </div>
                  </div>
                </Card>

                {/* Visual Bar Comparison */}
                <Card title="Interest Cost Comparison">
                  <div className={styles.barComparison}>
                    <div className={styles.barRow}>
                      <div className={styles.barLabel}>Flat Rate Interest</div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: '100%',
                            background: '#ef4444',
                          }}
                        />
                      </div>
                      <div className={styles.barValue}>{formatCurrency(result.flatTotalInterest)}</div>
                    </div>
                    <div className={styles.barRow}>
                      <div className={styles.barLabel}>Reducing Rate Interest</div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${(result.reducingTotalInterest / result.flatTotalInterest) * 100}%`,
                            background: '#10b981',
                          }}
                        />
                      </div>
                      <div className={styles.barValue}>{formatCurrency(result.reducingTotalInterest)}</div>
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
                      Enter loan details to compare flat vs reducing rates
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>
        </div>

        {/* ── INFO SECTION ───────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About Flat vs Reducing Interest Rate</h2>
          <p>
            When lenders quote interest rates, they often use the flat rate method which appears lower
            but actually costs you more. Understanding the difference is crucial before taking any loan.
          </p>

          <h3>Flat Rate Method</h3>
          <p>
            <strong>EMI = (Principal + Total Interest) / Tenure in Months</strong>
          </p>
          <p>
            Interest is calculated on the original principal for the entire tenure.
            Even as you repay, interest keeps being charged on the full original amount.
          </p>

          <h3>Reducing Balance Method</h3>
          <p>
            <strong>EMI = [P × R × (1+R)^N] / [(1+R)^N − 1]</strong>
          </p>
          <p>
            Interest is charged only on the outstanding principal after each EMI payment.
            As you repay, your interest burden reduces — this is the fairer method.
          </p>

          <h3>Rule of Thumb</h3>
          <ul>
            <li>A flat rate of 10% is roughly equivalent to a reducing rate of 17–18%.</li>
            <li>Always ask lenders for the reducing balance rate equivalent.</li>
            <li>Home loans and car loans in India typically use the reducing balance method.</li>
            <li>Some personal and consumer loans may quote flat rates — be cautious.</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}