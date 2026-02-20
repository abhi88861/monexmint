// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function SavingsInterestCalculator() {
//   const [formData, setFormData] = useState({
//     balance: '100000',
//     interestRate: '3.5',
//     months: '12',
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
//       const balance = parseFloat(formData.balance);
//       const rate = parseFloat(formData.interestRate) / 100;
//       const months = parseInt(formData.months);

//       // Savings account interest (simple interest, calculated monthly)
//       const monthlyInterest = (balance * rate) / 12;
//       const totalInterest = monthlyInterest * months;
//       const finalBalance = balance + totalInterest;

//       setResult({
//         initialBalance: balance,
//         monthlyInterest: Math.round(monthlyInterest),
//         totalInterest: Math.round(totalInterest),
//         finalBalance: Math.round(finalBalance),
//         months: months,
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
//           <h1 className={styles.title}>Savings Account Interest</h1>
//           <p className={styles.description}>
//             Calculate interest earned on your savings account balance
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Account Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input
//                   label="Account Balance"
//                   type="number"
//                   name="balance"
//                   value={formData.balance}
//                   onChange={handleChange}
//                   prefix="₹"
//                   required
//                   min="0"
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
//                   helpText="Typical range: 2.7% - 4%"
//                 />

//                 <Input
//                   label="Time Period"
//                   type="number"
//                   name="months"
//                   value={formData.months}
//                   onChange={handleChange}
//                   suffix="months"
//                   required
//                   min="1"
//                   max="120"
//                 />

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate Interest
//                 </Button>
//               </form>
//             </Card>
//           </div>

//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Total Interest Earned</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.totalInterest)}
//                     </div>
//                   </div>
//                 </Card>

//                 <Card title="Interest Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Initial Balance</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.initialBalance)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Monthly Interest</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.monthlyInterest)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Total Interest</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.totalInterest)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Final Balance</div>
//                       <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
//                         {formatCurrency(result.finalBalance)}
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>About Savings Account Interest</h3>
//                   <p>Savings accounts offer modest interest on your daily balance.</p>
//                   <h4>Key Points:</h4>
//                   <ul>
//                     <li>Interest calculated on daily balance</li>
//                     <li>Credited quarterly or monthly</li>
//                     <li>Different rates for different balance slabs</li>
//                     <li>Fully liquid - withdraw anytime</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>💳</div>
//                   <p className={styles.placeholderText}>
//                     Calculate interest on your savings
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

export default function SavingsInterestCalculator() {

  const [formData, setFormData] = useState({
    balance: '100000',
    annualInterestRate: '3.5',
    days: '365',
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
  const fetchSavingsInterest = useCallback(async () => {

    const balance = parseFloat(formData.balance);
    const annualInterestRate = parseFloat(formData.annualInterestRate);
    const days = parseInt(formData.days, 10);

    if (!balance || balance < 0 || !annualInterestRate || days < 1) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const response = await bankingAPI.calculateSavingsInterest({
        balance,
        annualInterestRate,
        days
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

  }, [formData.balance, formData.annualInterestRate, formData.days]);

  // ================= Debounce =================
  useEffect(() => {
    const t = setTimeout(fetchSavingsInterest, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchSavingsInterest]);

  const estimatedFinalBalance =
    Number(formData.balance) + (result?.interestEarned || 0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Savings Interest Calculator</h1>
          <p className={styles.description}>
            Calculate interest earned on your savings account balance instantly
          </p>
        </div>

        <div className={styles.content}>

          {/* LEFT FORM */}
          <div className={styles.formSection}>
            <Card title="Savings Details">

              <div className={styles.form}>

                <Input
                  label="Account Balance"
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                />

                <Input
                  label="Interest Rate (per annum)"
                  type="number"
                  name="annualInterestRate"
                  value={formData.annualInterestRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Typical range: 2.5% – 4%"
                />

                <Input
                  label="Time Period"
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  suffix="days"
                  min="1"
                  max="3650"
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
                    <div className={styles.emiLabel}>Interest Earned</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.interestEarned)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="Savings Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Balance</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(Number(formData.balance))}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Earned</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.interestEarned)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Estimated Final Balance</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(estimatedFinalBalance)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Time Period</div>
                      <div className={styles.summaryValue}>
                        {formData.days} days
                      </div>
                    </div>

                  </div>

                  {/* GRAPH */}
                  <LoanPieChart
                    principal={Number(formData.balance)}
                    interest={result.interestEarned}
                  />

                </Card>

                {/* EXPLANATION */}
                <Card>
                  <h3>About Savings Account Interest</h3>

                  <p>
                    Savings accounts provide interest on your balance while keeping
                    your money fully liquid and safe.
                  </p>

                  <h4>How Savings Interest is Calculated</h4>
                  <p>
                    Most banks calculate savings interest using the daily balance method:
                  </p>

                  <p>
                    <b>Interest = (Balance × Rate × Days) / 365</b>
                  </p>

                  <h4>Key Benefits</h4>
                  <ul>
                    <li>High liquidity — withdraw anytime</li>
                    <li>Safe and secure</li>
                    <li>Interest credited monthly or quarterly</li>
                    <li>No lock-in period</li>
                  </ul>

                </Card>

              </>
            ) : (
              !loading && !error && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>💳</div>
                    <p>Enter savings details to see results</p>
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
