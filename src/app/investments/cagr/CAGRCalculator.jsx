'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateCAGR, calculateLumpsum } from '@/lib/calculators';
import { formatCurrency, formatShortCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';

function GrowthLineChart({ startValue, endValue, tenureYears, cagr }) {
  // Build year-by-year projection
  const data = [];
  for (let y = 0; y <= tenureYears; y++) {
    const projected = startValue * Math.pow(1 + cagr / 100, y);
    data.push({
      year: y,
      value: Math.round(projected),
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltipBox}>
          <p className={styles.tooltipYear}>Year {label}</p>
          <p style={{ color: '#6366f1', fontWeight: 700, margin: '0.2rem 0', fontSize: '0.9rem' }}>
            Value: {formatCurrency(payload[0]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            label={{ value: 'Year', position: 'insideBottom', offset: -4, fontSize: 11, fill: '#94a3b8' }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => formatShortCurrency(v)}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceDot x={0}            y={Math.round(startValue)} r={5} fill="#3b82f6" stroke="#ffffff" strokeWidth={2} />
          <ReferenceDot x={tenureYears}  y={Math.round(endValue)}   r={5} fill="#10b981" stroke="#ffffff" strokeWidth={2} />
          <Line
            type="monotone"
            dataKey="value"
            name="Portfolio Value"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#6366f1' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Mode: Calculate CAGR | Calculate Future Value | Calculate PV ──────────
const MODES = [
  { id: 'cagr',   label: 'Find CAGR',         desc: 'Know start & end value — find growth rate' },
  { id: 'future', label: 'Find Future Value',  desc: 'Know CAGR & start — find what it becomes' },
  { id: 'pv',     label: 'Find Present Value', desc: 'Know CAGR & goal — find needed investment' },
];

export default function CAGRCalculator() {
  const [mode, setMode] = useState('cagr');

  // Mode: cagr
  const [cagrForm, setCagrForm] = useState({
    presentValue:  '100000',
    futureValue:   '300000',
    tenureYears:   '10',
  });

  // Mode: future
  const [futureForm, setFutureForm] = useState({
    presentValue:  '100000',
    cagrRate:      '12',
    tenureYears:   '10',
  });

  // Mode: pv
  const [pvForm, setPvForm] = useState({
    futureValue:  '1000000',
    cagrRate:     '12',
    tenureYears:  '10',
  });

  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCagrChange = (e) => {
    const { name, value } = e.target;
    setCagrForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFutureChange = (e) => {
    const { name, value } = e.target;
    setFutureForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePvChange = (e) => {
    const { name, value } = e.target;
    setPvForm(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    setLoading(true);

    if (mode === 'cagr') {
      const pv    = parseFloat(cagrForm.presentValue);
      const fv    = parseFloat(cagrForm.futureValue);
      const years = parseInt(cagrForm.tenureYears, 10);

      if (!pv || pv <= 0 || !fv || fv <= 0 || !years || years < 1) {
        setResult(null); setLoading(false); return;
      }

      const data = calculateCAGR(pv, fv, years);
      setResult({ ...data, mode: 'cagr', pv, fv, years });

    } else if (mode === 'future') {
      const pv    = parseFloat(futureForm.presentValue);
      const rate  = parseFloat(futureForm.cagrRate);
      const years = parseInt(futureForm.tenureYears, 10);

      if (!pv || pv <= 0 || !rate || rate <= 0 || !years || years < 1) {
        setResult(null); setLoading(false); return;
      }

      const data = calculateLumpsum(pv, rate, years);
      const absoluteReturn = ((data.maturityValue - pv) / pv) * 100;
      setResult({
        mode: 'future',
        pv,
        fv: data.maturityValue,
        years,
        cagr: rate,
        maturityValue: data.maturityValue,
        totalReturns: data.totalReturns,
        absoluteReturn: Math.round(absoluteReturn * 100) / 100,
        wealthRatio: Math.round((data.maturityValue / pv) * 100) / 100,
        gain: Math.round(data.totalReturns),
      });

    } else if (mode === 'pv') {
      const fv    = parseFloat(pvForm.futureValue);
      const rate  = parseFloat(pvForm.cagrRate);
      const years = parseInt(pvForm.tenureYears, 10);

      if (!fv || fv <= 0 || !rate || rate <= 0 || !years || years < 1) {
        setResult(null); setLoading(false); return;
      }

      const pv = fv / Math.pow(1 + rate / 100, years);
      const gain = fv - pv;
      setResult({
        mode: 'pv',
        pv: Math.round(pv * 100) / 100,
        fv,
        years,
        cagr: rate,
        gain: Math.round(gain),
        absoluteReturn: Math.round(((fv - pv) / pv) * 100 * 100) / 100,
        wealthRatio: Math.round((fv / pv) * 100) / 100,
      });
    }

    setLoading(false);
  }, [mode, cagrForm, futureForm, pvForm]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  // Benchmark comparison data
  const BENCHMARKS = [
    { name: 'Savings Account', cagr: 3.5,  color: '#94a3b8' },
    { name: 'FD (5yr)',        cagr: 7.0,  color: '#64748b' },
    { name: 'PPF',             cagr: 7.1,  color: '#3b82f6' },
    { name: 'NPS',             cagr: 9.5,  color: '#8b5cf6' },
    { name: 'Nifty 50 (10yr)', cagr: 12.0, color: '#10b981' },
    { name: 'Small Cap',       cagr: 15.0, color: '#f59e0b' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>CAGR Calculator</h1>
          <p className={styles.description}>
            Compound Annual Growth Rate — measure the true annual growth of any investment.
            Works three ways: find CAGR, find future value, or find required investment.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>

            {/* Mode Selector */}
            <Card title="Calculator Mode">
              <div className={styles.modeGrid}>
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    className={`${styles.modeBtn} ${mode === m.id ? styles.modeBtnActive : ''}`}
                    onClick={() => { setMode(m.id); setResult(null); }}
                  >
                    <span className={styles.modeBtnLabel}>{m.label}</span>
                    <span className={styles.modeBtnDesc}>{m.desc}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Form based on mode */}
            <Card title={
              mode === 'cagr'   ? 'Find CAGR' :
              mode === 'future' ? 'Find Future Value' :
              'Find Present Value'
            }>
              <div className={styles.form}>

                {mode === 'cagr' && (
                  <>
                    <Input
                      label="Initial Investment / Present Value"
                      type="number"
                      name="presentValue"
                      value={cagrForm.presentValue}
                      onChange={handleCagrChange}
                      prefix="₹"
                      min="1"
                      step="1000"
                      helpText="Your original investment amount"
                    />
                    <Input
                      label="Final Value / Current Value"
                      type="number"
                      name="futureValue"
                      value={cagrForm.futureValue}
                      onChange={handleCagrChange}
                      prefix="₹"
                      min="1"
                      step="1000"
                      helpText="What your investment is worth now / at maturity"
                    />
                    <Input
                      label="Investment Period"
                      type="number"
                      name="tenureYears"
                      value={cagrForm.tenureYears}
                      onChange={handleCagrChange}
                      suffix="years"
                      min="1"
                      max="50"
                      step="1"
                      helpText="How many years you held the investment"
                    />
                  </>
                )}

                {mode === 'future' && (
                  <>
                    <Input
                      label="Initial Investment"
                      type="number"
                      name="presentValue"
                      value={futureForm.presentValue}
                      onChange={handleFutureChange}
                      prefix="₹"
                      min="1"
                      step="1000"
                      helpText="Amount you invest today"
                    />
                    <Input
                      label="Expected CAGR"
                      type="number"
                      name="cagrRate"
                      value={futureForm.cagrRate}
                      onChange={handleFutureChange}
                      suffix="% p.a."
                      min="0.1"
                      max="100"
                      step="0.5"
                      helpText="Expected compound annual growth rate"
                    />
                    <Input
                      label="Investment Period"
                      type="number"
                      name="tenureYears"
                      value={futureForm.tenureYears}
                      onChange={handleFutureChange}
                      suffix="years"
                      min="1"
                      max="50"
                      step="1"
                      helpText="How long you plan to stay invested"
                    />
                  </>
                )}

                {mode === 'pv' && (
                  <>
                    <Input
                      label="Target / Goal Amount"
                      type="number"
                      name="futureValue"
                      value={pvForm.futureValue}
                      onChange={handlePvChange}
                      prefix="₹"
                      min="1"
                      step="10000"
                      helpText="How much you want to accumulate"
                    />
                    <Input
                      label="Expected CAGR"
                      type="number"
                      name="cagrRate"
                      value={pvForm.cagrRate}
                      onChange={handlePvChange}
                      suffix="% p.a."
                      min="0.1"
                      max="100"
                      step="0.5"
                      helpText="Expected compound annual growth rate"
                    />
                    <Input
                      label="Investment Period"
                      type="number"
                      name="tenureYears"
                      value={pvForm.tenureYears}
                      onChange={handlePvChange}
                      suffix="years"
                      min="1"
                      max="50"
                      step="1"
                      helpText="How many years until you need the money"
                    />
                  </>
                )}

                {loading && (
                  <div className={styles.loading}>Calculating…</div>
                )}

              </div>
            </Card>

            {/* CAGR Formula Reference */}
            <Card className={styles.formulaCard}>
              <div className={styles.formulaContent}>
                <div className={styles.formulaTitle}>CAGR Formula</div>
                <div className={styles.formulaEquation}>
                  CAGR = (FV / PV)<sup>1/n</sup> − 1
                </div>
                <div className={styles.formulaLegend}>
                  <span>FV = Final Value</span>
                  <span>PV = Present Value</span>
                  <span>n = Years</span>
                </div>
              </div>
            </Card>

          </div>

          {/* ── RIGHT RESULTS ──────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {/* Primary Result Hero */}
                <Card variant="gradient" className={styles.heroCard}>
                  <div className={styles.heroContent}>
                    {result.mode === 'cagr' && (
                      <>
                        <div className={styles.heroLabel}>CAGR</div>
                        <div className={styles.heroValue}>{result.cagr}%</div>
                        <div className={styles.heroMeta}>per annum</div>
                      </>
                    )}
                    {result.mode === 'future' && (
                      <>
                        <div className={styles.heroLabel}>Future Value</div>
                        <div className={styles.heroValue}>{formatCurrency(result.fv)}</div>
                        <div className={styles.heroMeta}>after {result.years} years at {result.cagr}% CAGR</div>
                      </>
                    )}
                    {result.mode === 'pv' && (
                      <>
                        <div className={styles.heroLabel}>Required Investment Today</div>
                        <div className={styles.heroValue}>{formatCurrency(result.pv)}</div>
                        <div className={styles.heroMeta}>to reach {formatCurrency(result.fv)} in {result.years} years</div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Summary Grid */}
                <Card title="Investment Summary">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Present Value</div>
                      <div className={styles.summaryValue} style={{ color: '#3b82f6' }}>
                        {formatCurrency(result.pv)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Future Value</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.fv)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Gain</div>
                      <div className={styles.summaryValue} style={{ color: '#8b5cf6' }}>
                        {formatCurrency(result.gain)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Wealth Ratio</div>
                      <div className={styles.summaryValue} style={{ color: '#f59e0b' }}>
                        {result.wealthRatio}×
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Absolute Return</div>
                      <div className={styles.summaryValue}>{result.absoluteReturn}%</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>
                        {result.mode === 'cagr' ? 'CAGR' : 'Rate Used'}
                      </div>
                      <div className={styles.summaryValue}>{result.cagr}% p.a.</div>
                    </div>
                  </div>

                  {/* Growth Line Chart */}
                  <GrowthLineChart
                    startValue={result.pv}
                    endValue={result.fv}
                    tenureYears={result.years}
                    cagr={result.cagr}
                  />
                </Card>

                {/* Benchmark Comparison */}
                <Card title="CAGR Benchmark Comparison">
                  <p className={styles.benchmarkNote}>
                    How does your {result.cagr}% CAGR compare to common investment options?
                  </p>
                  <div className={styles.benchmarkList}>
                    {BENCHMARKS.map((b) => {
                      const diff = result.cagr - b.cagr;
                      const isHigher = diff > 0;
                      const maxWidth = Math.max(...BENCHMARKS.map(x => x.cagr), result.cagr);
                      return (
                        <div key={b.name} className={styles.benchmarkRow}>
                          <div className={styles.benchmarkName}>{b.name}</div>
                          <div className={styles.benchmarkBarTrack}>
                            <div
                              className={styles.benchmarkBarFill}
                              style={{
                                width: `${(b.cagr / maxWidth) * 100}%`,
                                background: b.color,
                              }}
                            />
                          </div>
                          <div className={styles.benchmarkRate}>{b.cagr}%</div>
                          <div
                            className={styles.benchmarkDiff}
                            style={{ color: isHigher ? '#10b981' : '#ef4444' }}
                          >
                            {isHigher ? '+' : ''}{diff.toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                    {/* Your investment bar */}
                    <div className={`${styles.benchmarkRow} ${styles.benchmarkYours}`}>
                      <div className={styles.benchmarkName}>Your Investment</div>
                      <div className={styles.benchmarkBarTrack}>
                        <div
                          className={styles.benchmarkBarFill}
                          style={{
                            width: `${(result.cagr / Math.max(...BENCHMARKS.map(x => x.cagr), result.cagr)) * 100}%`,
                            background: '#6366f1',
                          }}
                        />
                      </div>
                      <div className={styles.benchmarkRate} style={{ color: '#6366f1', fontWeight: 800 }}>
                        {result.cagr}%
                      </div>
                      <div className={styles.benchmarkDiff}>—</div>
                    </div>
                  </div>
                </Card>

                {/* Multi-year CAGR Scenarios */}
                <Card title="What ₹1 Lakh Becomes at Different CAGRs">
                  <div className={styles.tableWrapper}>
                    <table className={styles.scenarioTable}>
                      <thead>
                        <tr>
                          <th>CAGR</th>
                          <th>5 Years</th>
                          <th>10 Years</th>
                          <th>15 Years</th>
                          <th>20 Years</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[5, 7, 10, 12, 15, 18, 20, result.cagr].sort((a, b) => a - b)
                          .filter((v, i, arr) => arr.indexOf(v) === i)
                          .map((cagr) => {
                            const base = 100000;
                            const isSelected = cagr === result.cagr;
                            return (
                              <tr key={cagr} className={isSelected ? styles.selectedRow : ''}>
                                <td style={{ fontWeight: isSelected ? 800 : 400, color: isSelected ? '#6366f1' : 'inherit' }}>
                                  {cagr}%{isSelected ? ' ★' : ''}
                                </td>
                                <td>{formatShortCurrency(Math.round(base * Math.pow(1 + cagr / 100, 5)))}</td>
                                <td>{formatShortCurrency(Math.round(base * Math.pow(1 + cagr / 100, 10)))}</td>
                                <td>{formatShortCurrency(Math.round(base * Math.pow(1 + cagr / 100, 15)))}</td>
                                <td>{formatShortCurrency(Math.round(base * Math.pow(1 + cagr / 100, 20)))}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>📈</div>
                    <p className={styles.placeholderText}>
                      Enter investment details to calculate CAGR
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>
        </div>

        {/* ── INFO SECTION ───────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About CAGR Calculator</h2>
          <p>
            CAGR (Compound Annual Growth Rate) is the rate at which an investment would have grown
            if it grew at a steady annual rate. It is the most accurate way to compare investment
            performance over time, eliminating the noise of year-to-year volatility.
          </p>

          <h3>CAGR Formula</h3>
          <p>
            <strong>CAGR = (FV / PV)^(1/n) − 1</strong>
          </p>
          <ul>
            <li><strong>FV</strong> — Final Value of the investment</li>
            <li><strong>PV</strong> — Present / Initial Value of the investment</li>
            <li><strong>n</strong> — Number of years</li>
          </ul>

          <h3>Three Modes of the Calculator</h3>
          <ul>
            <li><strong>Find CAGR:</strong> You know what you invested and what it's worth now — find the annual growth rate.</li>
            <li><strong>Find Future Value:</strong> You know how much you're investing and the expected CAGR — find the maturity amount.</li>
            <li><strong>Find Present Value:</strong> You have a future goal — find how much you need to invest today at a given CAGR.</li>
          </ul>

          <h3>CAGR vs Absolute Return vs XIRR</h3>
          <ul>
            <li><strong>Absolute Return:</strong> Simple percentage gain irrespective of time. Not comparable across different periods.</li>
            <li><strong>CAGR:</strong> Annualised return — makes any two investments comparable regardless of duration. Best for lumpsum investments.</li>
            <li><strong>XIRR:</strong> Extended IRR — used for SIPs and irregular cash flows. More accurate than CAGR for periodic investments.</li>
          </ul>

          <h3>Typical CAGRs in India (Historical, Not Guaranteed)</h3>
          <ul>
            <li>Savings Account: 3–4% p.a.</li>
            <li>Fixed Deposit (5yr): 6.5–7.5% p.a.</li>
            <li>PPF: 7.1% p.a. (current rate)</li>
            <li>Debt Mutual Funds: 6–9% p.a.</li>
            <li>Nifty 50 (10-yr rolling): ~12% p.a.</li>
            <li>Mid/Small Cap Equity: 13–18% p.a. (with high risk)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}