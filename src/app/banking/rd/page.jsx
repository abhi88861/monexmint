// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function RDCalculator() {
//   const [formData, setFormData] = useState({
//     monthlyDeposit: '5000',
//     interestRate: '7',
//     tenure: '12',
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
//       const P = parseFloat(formData.monthlyDeposit);
//       const r = parseFloat(formData.interestRate) / 100;
//       const n = parseInt(formData.tenure);

//       // RD formula: M = P * [(1 + r/4)^(4*n/12) - 1] / [1 - (1 + r/4)^(-1/3)]
//       const quarterlyRate = r / 4;
//       const quarters = (4 * n) / 12;
      
//       let maturityAmount = 0;
//       for (let i = 1; i <= n; i++) {
//         const remainingQuarters = (n - i + 1) / 3;
//         maturityAmount += P * Math.pow(1 + quarterlyRate, remainingQuarters);
//       }

//       const totalDeposits = P * n;
//       const totalInterest = maturityAmount - totalDeposits;

//       setResult({
//         monthlyDeposit: P,
//         totalDeposits: totalDeposits,
//         totalInterest: Math.round(totalInterest),
//         maturityAmount: Math.round(maturityAmount),
//         tenure: n,
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
//           <h1 className={styles.title}>RD Calculator</h1>
//           <p className={styles.description}>
//             Calculate Recurring Deposit maturity amount with monthly deposits
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="RD Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input
//                   label="Monthly Deposit"
//                   type="number"
//                   name="monthlyDeposit"
//                   value={formData.monthlyDeposit}
//                   onChange={handleChange}
//                   prefix="₹"
//                   required
//                   min="100"
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
//                 />

//                 <Input
//                   label="Tenure"
//                   type="number"
//                   name="tenure"
//                   value={formData.tenure}
//                   onChange={handleChange}
//                   suffix="months"
//                   required
//                   min="6"
//                   max="120"
//                 />

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate RD Returns
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

//                 <Card title="RD Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Monthly Deposit</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.monthlyDeposit)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Total Deposits</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.totalDeposits)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Interest Earned</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.totalInterest)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Tenure</div>
//                       <div className={styles.summaryValue}>
//                         {result.tenure} months
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>About Recurring Deposits</h3>
//                   <p>RD allows you to save regularly with guaranteed returns.</p>
//                   <h4>Key Features:</h4>
//                   <ul>
//                     <li>Regular monthly savings habit</li>
//                     <li>Higher interest than savings account</li>
//                     <li>Flexible tenure (6 months to 10 years)</li>
//                     <li>Loan facility against RD</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>💰</div>
//                   <p className={styles.placeholderText}>
//                     Calculate your RD maturity amount
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

export default function RDCalculator() {

  const [formData, setFormData] = useState({
    monthlyDeposit: '5000',
    annualInterestRate: '7',
    tenureMonths: '12',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================= Input Handler =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ================= API Call =================
  const fetchRd = useCallback(async () => {

    const monthlyDeposit = parseFloat(formData.monthlyDeposit);
    const annualInterestRate = parseFloat(formData.annualInterestRate);
    const tenureMonths = parseInt(formData.tenureMonths, 10);

    if (!monthlyDeposit || monthlyDeposit < 100 || !annualInterestRate || tenureMonths < 1) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const response = await bankingAPI.calculateRd({
        monthlyDeposit,
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

  }, [formData.monthlyDeposit, formData.annualInterestRate, formData.tenureMonths]);

  // ================= Debounce Auto Calculate =================
  useEffect(() => {
    const t = setTimeout(fetchRd, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchRd]);

  const tenureYears = Math.floor(Number(formData.tenureMonths) / 12);
  const tenureMonthsRem = Number(formData.tenureMonths) % 12;

  const totalDeposits =
    Number(formData.monthlyDeposit) * Number(formData.tenureMonths);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>RD Calculator</h1>
          <p className={styles.description}>
            Calculate Recurring Deposit maturity amount with monthly deposits instantly
          </p>
        </div>

        <div className={styles.content}>

          {/* LEFT FORM */}
          <div className={styles.formSection}>
            <Card title="RD Details">

              <div className={styles.form}>

                <Input
                  label="Monthly Deposit"
                  type="number"
                  name="monthlyDeposit"
                  value={formData.monthlyDeposit}
                  onChange={handleChange}
                  prefix="₹"
                  min="100"
                  step="100"
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
                  min="6"
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
                <Card title="RD Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly Deposit</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(Number(formData.monthlyDeposit))}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Deposits</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(totalDeposits)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Earned</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.interestEarned)}
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
                    principal={totalDeposits}
                    interest={result.interestEarned}
                  />

                </Card>

                {/* EXPLANATION */}
                <Card>
                  <h3>About Recurring Deposits</h3>

                  <p>
                    Recurring Deposits (RD) help investors build disciplined saving habits
                    by depositing a fixed amount every month and earning guaranteed returns.
                  </p>

                  <h4>How RD Interest is Calculated</h4>
                  <p>
                    RD interest is usually compounded quarterly by banks. Interest is
                    calculated for each monthly installment separately until maturity.
                  </p>

                  <h4>Why Invest in RD?</h4>
                  <ul>
                    <li>Builds monthly savings discipline</li>
                    <li>Guaranteed returns (no market risk)</li>
                    <li>Flexible tenure from 6 months to 10 years</li>
                    <li>Loan facility available against RD</li>
                  </ul>

                </Card>

              </>
            ) : (
              !loading && !error && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>💰</div>
                    <p>Enter RD details to see results</p>
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
