'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateSWP } from '@/lib/calculators';
import { formatCurrency, formatShortCurrency, formatTenure } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

function CorpusAreaChart({ chartData, depletionMonth }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltipBox}>
          <p className={styles.tooltipYear}>Month {label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, margin: '0.2rem 0', fontWeight: 700, fontSize: '0.85rem' }}>
              {p.name}: {formatCurrency(Math.round(p.value))}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <defs>
            <linearGradient id="corpusGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="withdrawalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'Month', position: 'insideBottom', offset: -4, fontSize: 11, fill: '#94a3b8' }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => formatShortCurrency(v)} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {depletionMonth && depletionMonth > 0 && (
            <ReferenceLine x={depletionMonth} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Depleted', fill: '#ef4444', fontSize: 11 }} />
          )}
          <Area type="monotone" dataKey="balance"            name="Corpus Balance"       stroke="#6366f1" fill="url(#corpusGradient)"     strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="cumulativeWithdrawn" name="Total Withdrawn"   stroke="#f59e0b" fill="url(#withdrawalGradient)"  strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function SWPCalculator() {
  const [formData, setFormData] = useState({
    initialCorpus:     '5000000',
    monthlyWithdrawal: '30000',
    annualReturnRate:  '8',
    tenureYears:       '20',
  });

  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [chartData, setChartData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const initialCorpus     = parseFloat(formData.initialCorpus);
    const monthlyWithdrawal = parseFloat(formData.monthlyWithdrawal);
    const annualReturnRate  = parseFloat(formData.annualReturnRate);
    const tenureYears       = parseInt(formData.tenureYears, 10);

    if (
      !initialCorpus     || initialCorpus     <= 0 ||
      !monthlyWithdrawal || monthlyWithdrawal <= 0 ||
      !annualReturnRate  || annualReturnRate  < 0  ||
      !tenureYears       || tenureYears       < 1
    ) {
      setResult(null);
      setChartData([]);
      return;
    }

    setLoading(true);

    const data = calculateSWP(initialCorpus, monthlyWithdrawal, annualReturnRate, tenureYears);

    // Build month-wise chart data (sample every Nth month for performance)
    const r = annualReturnRate / 100 / 12;
    const n = tenureYears * 12;
    let balance = initialCorpus;
    let cumulativeWithdrawn = 0;
    const rawChartData = [];
    let depletionMonth = null;

    for (let m = 1; m <= n; m++) {
      balance = balance * (1 + r);
      if (balance <= 0) { depletionMonth = m; break; }
      const withdrawal = Math.min(monthlyWithdrawal, balance);
      balance -= withdrawal;
      cumulativeWithdrawn += withdrawal;
      rawChartData.push({
        month: m,
        balance: Math.max(0, Math.round(balance)),
        cumulativeWithdrawn: Math.round(cumulativeWithdrawn),
      });
      if (balance <= 0) { depletionMonth = m; break; }
    }

    // Sample for chart (every 3rd month if large)
    const step = n > 60 ? Math.ceil(n / 60) : 1;
    const sampled = rawChartData.filter((_, i) => i % step === 0 || i === rawChartData.length - 1);

    setChartData(sampled);
    setResult({ ...data, depletionMonth });
    setLoading(false);
  }, [
    formData.initialCorpus,
    formData.monthlyWithdrawal,
    formData.annualReturnRate,
    formData.tenureYears,
  ]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  // Quick corpus presets
  const CORPUS_PRESETS = [
    { label: '25L',  value: '2500000'  },
    { label: '50L',  value: '5000000'  },
    { label: '1Cr',  value: '10000000' },
    { label: '2Cr',  value: '20000000' },
  ];

  // Quick return presets
  const RETURN_PRESETS = [
    { label: 'Debt (7%)',   value: '7'  },
    { label: 'Hybrid (8%)', value: '8'  },
    { label: 'Equity (10%)', value: '10' },
    { label: 'Equity (12%)', value: '12' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>SWP Calculator</h1>
          <p className={styles.description}>
            Systematic Withdrawal Plan — Calculate how long your retirement corpus lasts
            and find the sustainable monthly withdrawal amount that never depletes your wealth.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Corpus & Withdrawal Details">
              <div className={styles.form}>

                <div className={styles.fieldGroup}>
                  <Input
                    label="Initial Corpus"
                    type="number"
                    name="initialCorpus"
                    value={formData.initialCorpus}
                    onChange={handleChange}
                    prefix="₹"
                    min="10000"
                    step="100000"
                    helpText="Your retirement corpus / total invested amount"
                  />
                  <div className={styles.presetRow}>
                    {CORPUS_PRESETS.map((p) => (
                      <button
                        key={p.value}
                        className={`${styles.presetBtn} ${formData.initialCorpus === p.value ? styles.presetBtnActive : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, initialCorpus: p.value }))}
                      >
                        ₹{p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Monthly Withdrawal"
                  type="number"
                  name="monthlyWithdrawal"
                  value={formData.monthlyWithdrawal}
                  onChange={handleChange}
                  prefix="₹"
                  min="100"
                  step="500"
                  helpText="Amount you wish to withdraw each month"
                />

                <div className={styles.fieldGroup}>
                  <Input
                    label="Expected Annual Return"
                    type="number"
                    name="annualReturnRate"
                    value={formData.annualReturnRate}
                    onChange={handleChange}
                    suffix="%"
                    min="0"
                    max="30"
                    step="0.5"
                    helpText="Expected portfolio return while withdrawing"
                  />
                  <div className={styles.presetRow}>
                    {RETURN_PRESETS.map((p) => (
                      <button
                        key={p.value}
                        className={`${styles.presetBtn} ${formData.annualReturnRate === p.value ? styles.presetBtnActive : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, annualReturnRate: p.value }))}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Withdrawal Period"
                  type="number"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
                  min="1"
                  max="50"
                  step="1"
                  helpText="How long you plan to withdraw"
                />

                {loading && (
                  <div className={styles.loading}>Calculating…</div>
                )}

              </div>
            </Card>

            {/* Sustainable Withdrawal Widget */}
            {result && (
              <Card className={styles.sustainCard}>
                <div className={styles.sustainContent}>
                  <div className={styles.sustainIcon}>♻️</div>
                  <div>
                    <div className={styles.sustainTitle}>Sustainable Monthly Withdrawal</div>
                    <div className={styles.sustainValue}>
                      {formatCurrency(result.sustainableMonthlyWithdrawal)}
                    </div>
                    <div className={styles.sustainNote}>
                      This amount ensures your corpus <strong>never depletes</strong> (interest-only withdrawal)
                    </div>
                  </div>
                </div>
                <div className={styles.sustainComparison}>
                  <div className={`${styles.sustainCompItem} ${parseFloat(formData.monthlyWithdrawal) <= result.sustainableMonthlyWithdrawal ? styles.sustainGood : styles.sustainWarn}`}>
                    <span>Your withdrawal</span>
                    <span>{formatCurrency(parseFloat(formData.monthlyWithdrawal))}</span>
                  </div>
                  <div className={styles.sustainCompItem}>
                    <span>Sustainable limit</span>
                    <span>{formatCurrency(result.sustainableMonthlyWithdrawal)}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* ── RIGHT RESULTS ──────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {/* Status Banner */}
                <div className={result.fullyDepleted ? styles.depletedBanner : styles.safeBanner}>
                  <div className={styles.bannerIcon}>
                    {result.fullyDepleted ? '⚠️' : '✅'}
                  </div>
                  <div className={styles.bannerText}>
                    <div className={styles.bannerTitle}>
                      {result.fullyDepleted
                        ? `Corpus Depletes After ${formatTenure(result.monthsSustained)}`
                        : `Corpus Sustains Full ${formData.tenureYears}-Year Period`}
                    </div>
                    <div className={styles.bannerSub}>
                      {result.fullyDepleted
                        ? `Consider reducing withdrawal to ${formatCurrency(result.sustainableMonthlyWithdrawal)}/month to preserve corpus`
                        : `Final corpus remaining: ${formatCurrency(result.finalCorpus)}`}
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <Card title="SWP Summary">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Initial Corpus</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(parseFloat(formData.initialCorpus))}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Withdrawn</div>
                      <div className={styles.summaryValue} style={{ color: '#f59e0b' }}>
                        {formatCurrency(result.totalWithdrawn)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Final Corpus</div>
                      <div
                        className={styles.summaryValue}
                        style={{ color: result.finalCorpus > 0 ? '#10b981' : '#ef4444' }}
                      >
                        {formatCurrency(result.finalCorpus)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Months Sustained</div>
                      <div className={styles.summaryValue}>
                        {result.monthsSustained} mo
                        {result.fullyDepleted
                          ? ` (${Math.floor(result.monthsSustained / 12)}y ${result.monthsSustained % 12}m)`
                          : ' ✓'}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Corpus Depletion Chart */}
                {chartData.length > 0 && (
                  <Card title="Corpus Balance Over Time">
                    <CorpusAreaChart
                      chartData={chartData}
                      depletionMonth={result.depletionMonth}
                    />
                  </Card>
                )}

                {/* Withdrawal Scenarios Table */}
                <Card title="Withdrawal Scenarios">
                  <p className={styles.tableNote}>
                    How different monthly withdrawals affect corpus duration
                  </p>
                  <div className={styles.tableWrapper}>
                    <table className={styles.scenarioTable}>
                      <thead>
                        <tr>
                          <th>Monthly Withdrawal</th>
                          <th>Total Withdrawn</th>
                          <th>Duration</th>
                          <th>Final Corpus</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const corpus   = parseFloat(formData.initialCorpus);
                          const rate     = parseFloat(formData.annualReturnRate);
                          const tenure   = parseInt(formData.tenureYears, 10);
                          if (!corpus || !rate || !tenure) return null;

                          const multiples = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
                          const base = parseFloat(formData.monthlyWithdrawal);

                          return multiples.map((mult) => {
                            const withdrawal = Math.round(base * mult);
                            const res = calculateSWP(corpus, withdrawal, rate, tenure);
                            const isSelected = withdrawal === Math.round(base);
                            return (
                              <tr
                                key={mult}
                                className={isSelected ? styles.selectedRow : ''}
                              >
                                <td>{formatCurrency(withdrawal)}</td>
                                <td>{formatCurrency(res.totalWithdrawn)}</td>
                                <td>{formatTenure(res.monthsSustained)}</td>
                                <td
                                  style={{
                                    color: res.finalCorpus > 0 ? '#10b981' : '#ef4444',
                                    fontWeight: 700,
                                  }}
                                >
                                  {formatCurrency(res.finalCorpus)}
                                </td>
                                <td>
                                  <span className={res.fullyDepleted ? styles.badgeDepleted : styles.badgeSafe}>
                                    {res.fullyDepleted ? '⚠ Depletes' : '✓ Safe'}
                                  </span>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>💸</div>
                    <p className={styles.placeholderText}>
                      Enter corpus and withdrawal details to see your SWP plan
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>
        </div>

        {/* ── INFO SECTION ───────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About SWP — Systematic Withdrawal Plan</h2>
          <p>
            A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount from your mutual fund
            corpus at regular intervals. It is commonly used during retirement to create a monthly income
            stream while keeping the remaining corpus invested and growing.
          </p>

          <h3>How SWP Works</h3>
          <p>
            Each month, your corpus first earns returns at the portfolio rate, and then the withdrawal
            amount is deducted. If returns exceed the withdrawal, the corpus grows. If withdrawals exceed
            returns, the corpus gradually depletes.
          </p>

          <h3>Sustainable Withdrawal Rate</h3>
          <ul>
            <li>
              The <strong>sustainable monthly withdrawal</strong> = Corpus × Monthly Return Rate.
              At this amount, you withdraw only the interest — the principal stays intact forever.
            </li>
            <li>
              For a ₹1 Cr corpus at 8% return: Sustainable = ₹1,00,00,000 × (8%/12) ≈ <strong>₹66,667/month</strong>.
            </li>
            <li>
              Withdrawing above this rate gradually depletes the corpus.
            </li>
          </ul>

          <h3>SWP Tax Advantages</h3>
          <ul>
            <li>SWP from equity funds: LTCG of 10% (beyond ₹1L gain in a year) if held over 12 months.</li>
            <li>Much more tax-efficient than FD interest, which is fully taxable as per slab.</li>
            <li>Each SWP redemption is treated as a separate transaction — earlier units redeemed first (FIFO).</li>
          </ul>

          <h3>SWP vs FD Interest — Which Is Better?</h3>
          <ul>
            <li><strong>FD Interest:</strong> Fully taxable at slab rate (30% for highest bracket). Real return is lower.</li>
            <li><strong>SWP from Equity MF:</strong> Only capital gain portion is taxable; return portion is tax-free.</li>
            <li><strong>Inflation:</strong> SWP corpus can grow with equity returns, protecting against inflation. FD may not.</li>
          </ul>

          <h3>Tips for a Successful SWP</h3>
          <ul>
            <li>Keep 1–2 years of expenses in liquid fund / FD as buffer before starting SWP.</li>
            <li>Withdraw less than the sustainable rate for corpus preservation.</li>
            <li>Review and adjust withdrawal annually based on returns and expenses.</li>
            <li>Use a mix of debt and equity to balance growth and stability.</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}