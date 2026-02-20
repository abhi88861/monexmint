// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function OverdraftCalculator() {
//   const [formData, setFormData] = useState({
//     overdraftLimit: '100000',
//     amountUsed: '50000',
//     interestRate: '12',
//     daysUsed: '30',
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
//       const amountUsed = parseFloat(formData.amountUsed);
//       const rate = parseFloat(formData.interestRate) / 100;
//       const days = parseInt(formData.daysUsed);

//       // Interest = Principal × Rate × Days / 365
//       const interest = (amountUsed * rate * days) / 365;
//       const totalAmount = amountUsed + interest;
//       const dailyInterest = interest / days;

//       setResult({
//         amountUsed: amountUsed,
//         interestCharged: Math.round(interest),
//         totalRepayment: Math.round(totalAmount),
//         dailyInterest: Math.round(dailyInterest),
//         days: days,
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
//           <h1 className={styles.title}>Overdraft Calculator</h1>
//           <p className={styles.description}>
//             Calculate interest on overdraft facility usage
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Overdraft Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input
//                   label="Overdraft Limit"
//                   type="number"
//                   name="overdraftLimit"
//                   value={formData.overdraftLimit}
//                   onChange={handleChange}
//                   prefix="₹"
//                   required
//                   min="0"
//                 />

//                 <Input
//                   label="Amount Used"
//                   type="number"
//                   name="amountUsed"
//                   value={formData.amountUsed}
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
//                 />

//                 <Input
//                   label="Days Used"
//                   type="number"
//                   name="daysUsed"
//                   value={formData.daysUsed}
//                   onChange={handleChange}
//                   suffix="days"
//                   required
//                   min="1"
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
//                     <div className={styles.emiLabel}>Interest Charged</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.interestCharged)}
//                     </div>
//                   </div>
//                 </Card>

//                 <Card title="Overdraft Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Amount Used</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.amountUsed)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Interest</div>
//                       <div className={styles.summaryValue} style={{ color: '#ef4444' }}>
//                         {formatCurrency(result.interestCharged)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Total Repayment</div>
//                       <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
//                         {formatCurrency(result.totalRepayment)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Daily Interest</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.dailyInterest)}
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>About Overdraft Facility</h3>
//                   <p>Overdraft allows you to withdraw more than your account balance up to a limit.</p>
//                   <h4>Key Features:</h4>
//                   <ul>
//                     <li>Interest charged only on amount used</li>
//                     <li>Calculated on daily basis</li>
//                     <li>Flexible repayment</li>
//                     <li>Useful for short-term cash needs</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>💸</div>
//                   <p className={styles.placeholderText}>
//                     Calculate overdraft interest charges
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

export default function OverdraftCalculator() {

  const [formData, setFormData] = useState({
    overdraftLimit: '100000',
    overdraftAmount: '50000',
    annualInterestRate: '12',
    daysUsed: '30',
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
  const fetchOverdraft = useCallback(async () => {

    const overdraftAmount = parseFloat(formData.overdraftAmount);
    const annualInterestRate = parseFloat(formData.annualInterestRate);
    const daysUsed = parseInt(formData.daysUsed, 10);

    if (!overdraftAmount || overdraftAmount < 0 || !annualInterestRate || daysUsed < 1) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const response = await bankingAPI.calculateOverdraft({
        overdraftAmount,
        annualInterestRate,
        daysUsed
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

  }, [formData.overdraftAmount, formData.annualInterestRate, formData.daysUsed]);

  // ================= Debounce Auto Calculate =================
  useEffect(() => {
    const t = setTimeout(fetchOverdraft, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchOverdraft]);

  const interestCharged = result?.interestPayable || 0;
  const totalRepayment = Number(formData.overdraftAmount) + interestCharged;
  const dailyInterest = formData.daysUsed
    ? interestCharged / Number(formData.daysUsed)
    : 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Overdraft Interest Calculator</h1>
          <p className={styles.description}>
            Calculate interest charged on overdraft usage instantly
          </p>
        </div>

        <div className={styles.content}>

          {/* LEFT FORM */}
          <div className={styles.formSection}>
            <Card title="Overdraft Details">

              <div className={styles.form}>

                <Input
                  label="Overdraft Limit"
                  type="number"
                  name="overdraftLimit"
                  value={formData.overdraftLimit}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                />

                <Input
                  label="Amount Used"
                  type="number"
                  name="overdraftAmount"
                  value={formData.overdraftAmount}
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
                />

                <Input
                  label="Days Used"
                  type="number"
                  name="daysUsed"
                  value={formData.daysUsed}
                  onChange={handleChange}
                  suffix="days"
                  min="1"
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
                    <div className={styles.emiLabel}>Interest Charged</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(interestCharged)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="Overdraft Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Amount Used</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(Number(formData.overdraftAmount))}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Charged</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(interestCharged)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Repayment</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(totalRepayment)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Daily Interest</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(dailyInterest)}
                      </div>
                    </div>

                  </div>

                  {/* GRAPH */}
                  <LoanPieChart
                    principal={Number(formData.overdraftAmount)}
                    interest={interestCharged}
                  />

                </Card>

                {/* EXPLANATION */}
                <Card>
                  <h3>About Overdraft Facility</h3>

                  <p>
                    Overdraft allows you to withdraw money beyond your account balance
                    up to a bank-approved limit.
                  </p>

                  <h4>How Overdraft Interest is Calculated</h4>
                  <p>
                    Banks charge interest only on the amount used and for the exact
                    number of days used:
                  </p>

                  <p>
                    <b>Interest = (Amount Used × Rate × Days) / 365</b>
                  </p>

                  <h4>Key Benefits</h4>
                  <ul>
                    <li>Pay interest only on amount used</li>
                    <li>Daily interest calculation</li>
                    <li>No fixed EMI like loans</li>
                    <li>Useful for short-term liquidity</li>
                  </ul>

                </Card>

              </>
            ) : (
              !loading && !error && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>💸</div>
                    <p>Enter overdraft details to see results</p>
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
