// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function FDCalculator() {
//   const [formData, setFormData] = useState({
//     principal: '100000',
//     interestRate: '7.5',
//     tenure: '12',
//     compoundingFrequency: 'quarterly',
//   });

//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCalculate = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const principal = parseFloat(formData.principal);
//       const rate = parseFloat(formData.interestRate) / 100;
//       const tenureMonths = parseInt(formData.tenure);
//       const years = tenureMonths / 12;

//       // Compounding frequency
//       const frequencies = {
//         monthly: 12,
//         quarterly: 4,
//         halfYearly: 2,
//         yearly: 1
//       };
//       const n = frequencies[formData.compoundingFrequency];

//       // Compound interest formula: A = P(1 + r/n)^(nt)
//       const maturityAmount = principal * Math.pow(1 + rate / n, n * years);
//       const totalInterest = maturityAmount - principal;

//       setResult({
//         principal: principal,
//         maturityAmount: Math.round(maturityAmount),
//         totalInterest: Math.round(totalInterest),
//         tenure: tenureMonths,
//         effectiveRate: ((maturityAmount / principal - 1) / years * 100).toFixed(2),
//       });
//     } catch (err) {
//       console.error('Calculation error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>
//         <div className={styles.header}>
//           <h1 className={styles.title}>FD Calculator</h1>
//           <p className={styles.description}>
//             Calculate Fixed Deposit maturity amount and interest earned
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="FD Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input
//                   label="Deposit Amount"
//                   type="number"
//                   name="principal"
//                   value={formData.principal}
//                   onChange={handleChange}
//                   prefix="₹"
//                   required
//                   min="1000"
//                 />

//                 <Input
//                   label="Interest Rate (per annum)"
//                   type="number"
//                   name="interestRate"
//                   value={formData.interestRate}
//                   onChange={handleChange}
//                   suffix="%"
//                   required
//                   step="0.1"
//                   helpText="Annual interest rate offered by bank"
//                 />

//                 <Input
//                   label="Tenure"
//                   type="number"
//                   name="tenure"
//                   value={formData.tenure}
//                   onChange={handleChange}
//                   suffix="months"
//                   required
//                   min="1"
//                   max="120"
//                 />

//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>
//                     Compounding Frequency
//                   </label>
//                   <select
//                     name="compoundingFrequency"
//                     value={formData.compoundingFrequency}
//                     onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '1rem', fontFamily: 'inherit' }}
//                   >
//                     <option value="monthly">Monthly</option>
//                     <option value="quarterly">Quarterly</option>
//                     <option value="halfYearly">Half-Yearly</option>
//                     <option value="yearly">Yearly</option>
//                   </select>
//                 </div>

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate FD Returns
//                 </Button>
//               </form>
//             </Card>
//           </div>

//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Maturity Amount</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.maturityAmount)}
//                     </div>
//                   </div>
//                 </Card>

//                 <Card title="FD Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Principal Amount</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.principal)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Interest Earned</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.totalInterest)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Maturity Value</div>
//                       <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
//                         {formatCurrency(result.maturityAmount)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Effective Rate</div>
//                       <div className={styles.summaryValue}>
//                         {result.effectiveRate}%
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>About Fixed Deposits</h3>
//                   <p>Fixed Deposits offer guaranteed returns with principal protection from banks.</p>
//                   <h4>Key Features:</h4>
//                   <ul>
//                     <li>Safe and guaranteed returns</li>
//                     <li>Higher interest than savings accounts</li>
//                     <li>Flexible tenure options</li>
//                     <li>Premature withdrawal allowed with penalty</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>🏦</div>
//                   <p className={styles.placeholderText}>
//                     Enter FD details to calculate maturity amount
//                   </p>
//                 </div>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import LoanPieChart from '@/components/charts/LoanPieChart';
import { bankingAPI } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/constants';
import styles from '../../loans/emi/page.module.css';

const DEBOUNCE_MS = 500;

export default function FDCalculator() {

  const [formData, setFormData] = useState({
    principal: '100000',
    annualInterestRate: '7.5',
    tenureMonths: '12'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================= Handle Input =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ================= API Call =================
  const fetchFd = useCallback(async () => {

    const principal = parseFloat(formData.principal);
    const annualInterestRate = parseFloat(formData.annualInterestRate);
    const tenureMonths = parseInt(formData.tenureMonths, 10);

    if (!principal || principal < 1000 || !annualInterestRate || tenureMonths < 1) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const response = await bankingAPI.calculateFd({
        principal,
        annualInterestRate,
        tenureMonths
      });

      setResult(response.data);

    } catch (err) {
      setResult(null);
      setError(
        err.response?.data?.message ||
        'Calculation failed. Ensure backend is running.'
      );
    } finally {
      setLoading(false);
    }

  }, [formData.principal, formData.annualInterestRate, formData.tenureMonths]);

  // ================= Debounce Auto Calculate =================
  useEffect(() => {
    const t = setTimeout(fetchFd, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchFd]);

  const tenureYears = Math.floor(Number(formData.tenureMonths) / 12);
  const tenureMonthsRem = Number(formData.tenureMonths) % 12;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>FD Calculator</h1>
          <p className={styles.description}>
            Calculate Fixed Deposit maturity amount and interest earned instantly
          </p>
        </div>

        <div className={styles.content}>

          {/* LEFT FORM */}
          <div className={styles.formSection}>
            <Card title="FD Details">

              <div className={styles.form}>

                <Input
                  label="Deposit Amount"
                  type="number"
                  name="principal"
                  value={formData.principal}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                />

                <Input
                  label="Interest Rate (per annum)"
                  type="number"
                  name="annualInterestRate"
                  value={formData.annualInterestRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                />

                <Input
                  label="Tenure"
                  type="number"
                  name="tenureMonths"
                  value={formData.tenureMonths}
                  onChange={handleChange}
                  suffix="months"
                  min="1"
                  max="120"
                  helpText={
                    tenureYears > 0
                      ? `${tenureYears} years ${tenureMonthsRem} months`
                      : ''
                  }
                />

                {error && <div className={styles.error}>{error}</div>}
                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>

            </Card>
          </div>

          {/* RIGHT RESULT */}
          <div className={styles.resultsSection}>

            {/* AD SLOT */}
            <AdSlot format="rectangle" />

            {result ? (
              <>

                {/* RESULT CARD */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Maturity Amount</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.maturityAmount)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="FD Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Principal</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(Number(formData.principal))}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Earned</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.interestEarned)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Value</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.maturityAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tenure</div>
                      <div className={styles.summaryValue}>
                        {formData.tenureMonths} months
                      </div>
                    </div>

                  </div>

                  {/* GRAPH */}
                  <LoanPieChart
                    principal={Number(formData.principal)}
                    interest={result.interestEarned}
                  />

                </Card>

                {/* EXPLANATION */}
                <Card>
                  <h3>About Fixed Deposits</h3>

                  <p>
                    Fixed Deposits (FDs) are one of the safest investment options offered by banks.
                    They provide guaranteed returns with zero market risk.
                  </p>

                  <h4>How FD Interest is Calculated</h4>
                  <p>
                    Banks calculate FD interest using compound interest formula:
                    <br />
                    <b>A = P (1 + r/n) ^ (n × t)</b>
                  </p>

                  <ul>
                    <li>P = Principal Amount</li>
                    <li>r = Annual Interest Rate</li>
                    <li>n = Compounding Frequency</li>
                    <li>t = Time in Years</li>
                  </ul>

                  <h4>Why Invest in FD?</h4>
                  <ul>
                    <li>Guaranteed returns</li>
                    <li>Capital protection</li>
                    <li>Flexible tenure</li>
                    <li>Senior citizen higher rates</li>
                  </ul>

                </Card>

              </>
            ) : (
              !loading && !error && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>🏦</div>
                    <p>Enter FD details to see results</p>
                  </div>
                </Card>
              )
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
