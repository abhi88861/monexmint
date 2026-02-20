'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateEPF } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function EPFCalculator() {

  const [formData, setFormData] = useState({
    monthlyBasicPlusDA:           '30000',
    employeeContributionPercent:  '12',
    currentCorpus:                '0',
    tenureYears:                  '30',
    annualRate:                   '8.25',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const basic    = parseFloat(formData.monthlyBasicPlusDA);
    const empPct   = parseFloat(formData.employeeContributionPercent);
    const corpus   = parseFloat(formData.currentCorpus);
    const years    = parseFloat(formData.tenureYears);
    const rate     = parseFloat(formData.annualRate);

    if (!basic || basic <= 0 || !years || years <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateEPF(basic, empPct, corpus, years, rate);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>EPF Calculator</h1>
          <p className={styles.description}>
            Calculate Employee Provident Fund maturity with 8.25% interest rate. 
            12% employee + 3.67% employer contribution to PF.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="EPF Details">
              <div className={styles.form}>

                <Input
                  label="Monthly Basic + DA"
                  type="number"
                  name="monthlyBasicPlusDA"
                  value={formData.monthlyBasicPlusDA}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="Basic salary + Dearness Allowance"
                />

                <Input
                  label="Employee Contribution"
                  type="number"
                  name="employeeContributionPercent"
                  value={formData.employeeContributionPercent}
                  onChange={handleChange}
                  suffix="%"
                  min="12"
                  max="12"
                  step="0"
                  helpText="Fixed at 12% of Basic + DA"
                />

                <Input
                  label="Current EPF Balance"
                  type="number"
                  name="currentCorpus"
                  value={formData.currentCorpus}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="10000"
                  helpText="Existing PF balance (if any)"
                />

                <Input
                  label="Years to Retirement"
                  type="number"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
                  min="1"
                  max="40"
                />

                <Input
                  label="Interest Rate (p.a.)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.05"
                  helpText="Current: 8.25% (FY 2023-24)"
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
                    <div className={styles.emiLabel}>Total EPF at Retirement</div>
                    <div className={styles.emiValue}>{formatCurrency(result.grandMaturity)}</div>
                  </div>
                </Card>

                <Card title="Monthly Contribution">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Employee (12%)</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.monthlyEmployeeContrib)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Employer (3.67% to PF)</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.monthlyEmployerContrib)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Monthly</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.totalMonthlyContrib)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>EPS (8.33%)</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(parseFloat(formData.monthlyBasicPlusDA) * 0.0833)}
                      </div>
                    </div>

                  </div>
                </Card>

                <Card title="EPF Maturity Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Current Balance</div>
                      <div className={styles.summaryValue}>{formatCurrency(parseFloat(formData.currentCorpus))}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Future Value of Current</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.existingCorpusFV)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>New Contributions</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.totalInvested)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Earned</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.totalReturns)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>From New SIP</div>
                      <div className={styles.summaryValue} style={{ color: '#8b5cf6' }}>
                        {formatCurrency(result.maturityValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Grand Total</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1', fontSize: '1.75rem' }}>
                        {formatCurrency(result.grandMaturity)}
                      </div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.totalInvested} returns={result.totalReturns} />
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>💼</div>
                  <p>Enter EPF details</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About EPF (Employee Provident Fund)</h2>
          <p>
            EPF is a mandatory retirement savings scheme for salaried employees earning up to ₹15,000/month 
            (voluntary above that). Both employee and employer contribute monthly.
          </p>

          <h3>Contribution Structure</h3>
          <ul>
            <li><strong>Employee:</strong> 12% of Basic + DA (mandatory)</li>
            <li><strong>Employer:</strong> 12% of Basic + DA split as:
              <ul style={{ marginTop: '0.5rem' }}>
                <li>3.67% → Employee Provident Fund (EPF)</li>
                <li>8.33% → Employee Pension Scheme (EPS) - max ₹1,250/month</li>
              </ul>
            </li>
            <li><strong>Total to PF:</strong> Employee 12% + Employer 3.67% = 15.67%</li>
          </ul>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Interest Rate:</strong> 8.25% p.a. (FY 2023-24, announced yearly)</li>
            <li><strong>Compounding:</strong> Monthly compounding, credited annually</li>
            <li><strong>Tax Benefit:</strong> EEE status (contributions, interest, withdrawal all tax-free)</li>
            <li><strong>Lock-in:</strong> Till retirement (58 years) or job change</li>
            <li><strong>Withdrawal:</strong> Full withdrawal on retirement/unemployment (60 days)</li>
            <li><strong>Partial Withdrawal:</strong> Allowed for medical, education, home purchase</li>
          </ul>

          <h3>EPF vs EPS</h3>
          <ul>
            <li><strong>EPF (Provident Fund):</strong> Lumpsum corpus at retirement</li>
            <li><strong>EPS (Pension Scheme):</strong> Monthly pension after 58 years (min 10 years service)</li>
            <li>EPS contribution capped at ₹15,000 basic (₹1,250/month max)</li>
            <li>EPS pension = (Pensionable salary × Service years) ÷ 70</li>
          </ul>

          <h3>Withdrawal Rules</h3>
          <ul>
            <li><strong>Full Withdrawal:</strong> After 2 months unemployment or at 58 years</li>
            <li><strong>75% Withdrawal:</strong> After 1 month unemployment</li>
            <li><strong>Partial Withdrawal:</strong> 
              <ul style={{ marginTop: '0.5rem' }}>
                <li>Medical emergency (self/family)</li>
                <li>Home purchase/construction (after 5 years)</li>
                <li>Child marriage/education (after 7 years)</li>
                <li>Home loan repayment (after 10 years)</li>
              </ul>
            </li>
          </ul>

          <h3>Tax Implications</h3>
          <ul>
            <li><strong>Contributions:</strong> Tax deduction under 80C (up to ₹1.5L)</li>
            <li><strong>Interest:</strong> Tax-free (but taxable if &gt; ₹2.5L annual contribution post Apr 2021)</li>
            <li><strong>Withdrawal:</strong> Tax-free after 5 years continuous service</li>
            <li><strong>Before 5 years:</strong> Taxable as salary income</li>
          </ul>

          <h3>Transfer & Portability</h3>
          <ul>
            <li>UAN (Universal Account Number) links all PF accounts</li>
            <li>Auto-transfer on job change via UAN</li>
            <li>Online claims via EPFO portal (no employer approval needed)</li>
          </ul>

          <h3>EPF vs VPF</h3>
          <ul>
            <li><strong>EPF:</strong> Mandatory 12% contribution</li>
            <li><strong>VPF (Voluntary PF):</strong> Additional contribution beyond 12% (max 100% of Basic)</li>
            <li>VPF earns same 8.25% interest</li>
            <li>VPF also gets 80C benefit (combined ₹1.5L limit)</li>
          </ul>

          <h3>When EPF Makes Sense</h3>
          <ul>
            <li>Guaranteed 8.25% returns (better than FD, comparable to PPF)</li>
            <li>Employer's 3.67% is FREE money (instant 30% return on your 12%)</li>
            <li>Tax-free returns (effective return ~10-11% in 30% tax bracket)</li>
            <li>Forced savings for retirement</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}