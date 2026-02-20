// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function CreditCardInterestCalculator() {
//   const [formData, setFormData] = useState({
//     outstandingBalance: '50000',
//     interestRate: '36',
//     monthlyPayment: '5000',
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
//       let balance = parseFloat(formData.outstandingBalance);
//       const monthlyRate = parseFloat(formData.interestRate) / 100 / 12;
//       const payment = parseFloat(formData.monthlyPayment);

//       let totalInterest = 0;
//       let months = 0;
//       const maxMonths = 360; // 30 years cap

//       while (balance > 0 && months < maxMonths) {
//         const interest = balance * monthlyRate;
//         totalInterest += interest;
//         balance = balance + interest - payment;
//         months++;

//         if (payment <= interest) {
//           // Payment doesn't cover interest
//           break;
//         }
//       }

//       const totalPaid = payment * months;
//       const totalAmount = balance <= 0 ? totalPaid : 0;

//       setResult({
//         outstandingBalance: parseFloat(formData.outstandingBalance),
//         monthlyPayment: payment,
//         totalInterest: Math.round(totalInterest),
//         totalAmount: Math.round(totalAmount),
//         monthsToPayoff: months,
//         canPayoff: balance <= 0,
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
//           <h1 className={styles.title}>Credit Card Interest Calculator</h1>
//           <p className={styles.description}>
//             Calculate how long it takes to pay off credit card debt
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Credit Card Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input
//                   label="Outstanding Balance"
//                   type="number"
//                   name="outstandingBalance"
//                   value={formData.outstandingBalance}
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
//                   helpText="Typical range: 24% - 48%"
//                 />

//                 <Input
//                   label="Monthly Payment"
//                   type="number"
//                   name="monthlyPayment"
//                   value={formData.monthlyPayment}
//                   onChange={handleChange}
//                   prefix="₹"
//                   required
//                   min="1"
//                 />

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate Payoff Time
//                 </Button>
//               </form>
//             </Card>
//           </div>

//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 {result.canPayoff ? (
//                   <>
//                     <Card variant="success" className={styles.emiCard}>
//                       <div className={styles.emiResult}>
//                         <div className={styles.emiLabel}>Time to Pay Off</div>
//                         <div className={styles.emiValue}>
//                           {result.monthsToPayoff} months
//                         </div>
//                       </div>
//                     </Card>

//                     <Card title="Payment Summary">
//                       <div className={styles.summaryGrid}>
//                         <div className={styles.summaryItem}>
//                           <div className={styles.summaryLabel}>Outstanding Balance</div>
//                           <div className={styles.summaryValue}>
//                             {formatCurrency(result.outstandingBalance)}
//                           </div>
//                         </div>

//                         <div className={styles.summaryItem}>
//                           <div className={styles.summaryLabel}>Monthly Payment</div>
//                           <div className={styles.summaryValue}>
//                             {formatCurrency(result.monthlyPayment)}
//                           </div>
//                         </div>

//                         <div className={styles.summaryItem}>
//                           <div className={styles.summaryLabel}>Total Interest</div>
//                           <div className={styles.summaryValue} style={{ color: '#ef4444' }}>
//                             {formatCurrency(result.totalInterest)}
//                           </div>
//                         </div>

//                         <div className={styles.summaryItem}>
//                           <div className={styles.summaryLabel}>Total Amount Paid</div>
//                           <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
//                             {formatCurrency(result.totalAmount)}
//                           </div>
//                         </div>
//                       </div>
//                     </Card>
//                   </>
//                 ) : (
//                   <Card variant="warning">
//                     <div style={{ textAlign: 'center', padding: '2rem' }}>
//                       <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
//                       <h3 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>Warning!</h3>
//                       <p style={{ color: '#92400e' }}>
//                         Your monthly payment is too low to cover the interest. 
//                         Please increase your payment amount to pay off the debt.
//                       </p>
//                     </div>
//                   </Card>
//                 )}

//                 <Card className={styles.infoCard}>
//                   <h3>About Credit Card Interest</h3>
//                   <p>Credit cards charge high interest rates on outstanding balances.</p>
//                   <h4>Tips to Save:</h4>
//                   <ul>
//                     <li>Pay full balance before due date to avoid interest</li>
//                     <li>Pay more than minimum payment</li>
//                     <li>Consider balance transfer to lower rate card</li>
//                     <li>Avoid cash withdrawals - higher charges</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>💳</div>
//                   <p className={styles.placeholderText}>
//                     Calculate credit card payoff time
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

export default function CreditCardInterestCalculator() {

  const [formData, setFormData] = useState({
    outstandingAmount: '50000',
    annualInterestRate: '36',
    days: '30'
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
  const fetchCreditCardInterest = useCallback(async () => {

    const outstandingAmount = parseFloat(formData.outstandingAmount);
    const annualInterestRate = parseFloat(formData.annualInterestRate);
    const days = parseInt(formData.days, 10);

    if (!outstandingAmount || outstandingAmount < 1 || !annualInterestRate || days < 1) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const response = await bankingAPI.calculateCreditCardInterest({
        outstandingAmount,
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

  }, [formData.outstandingAmount, formData.annualInterestRate, formData.days]);

  // ================= Debounce Auto Calculate =================
  useEffect(() => {
    const t = setTimeout(fetchCreditCardInterest, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchCreditCardInterest]);

  const interestAmount = result?.interestAmount || 0;
  const totalPayable = result?.totalAmountPayable ||
    Number(formData.outstandingAmount) + interestAmount;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Credit Card Interest Calculator</h1>
          <p className={styles.description}>
            Calculate credit card interest and total payable amount instantly
          </p>
        </div>

        <div className={styles.content}>

          {/* LEFT FORM */}
          <div className={styles.formSection}>
            <Card title="Credit Card Details">

              <div className={styles.form}>

                <Input
                  label="Outstanding Balance"
                  type="number"
                  name="outstandingAmount"
                  value={formData.outstandingAmount}
                  onChange={handleChange}
                  prefix="₹"
                  min="1"
                />

                <Input
                  label="Interest Rate (per annum)"
                  type="number"
                  name="annualInterestRate"
                  value={formData.annualInterestRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Typical range: 24% – 48%"
                />

                <Input
                  label="Interest Period"
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  suffix="days"
                  min="1"
                  max="365"
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
                      {formatCurrency(interestAmount)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="Credit Card Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Outstanding Balance</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(Number(formData.outstandingAmount))}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Charged</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(interestAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Payable</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(totalPayable)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Period</div>
                      <div className={styles.summaryValue}>
                        {formData.days} days
                      </div>
                    </div>

                  </div>

                  {/* GRAPH */}
                  <LoanPieChart
                    principal={Number(formData.outstandingAmount)}
                    interest={interestAmount}
                  />

                </Card>

                {/* EXPLANATION */}
                <Card>
                  <h3>About Credit Card Interest</h3>

                  <p>
                    Credit cards charge high interest rates if you carry forward
                    outstanding balance after the due date.
                  </p>

                  <h4>How Credit Card Interest is Calculated</h4>
                  <p>
                    Most banks calculate interest daily on outstanding balance:
                  </p>

                  <p>
                    <b>Interest = (Outstanding × Rate × Days) / 365</b>
                  </p>

                  <h4>Tips to Save Interest</h4>
                  <ul>
                    <li>Pay full statement balance before due date</li>
                    <li>Avoid minimum payment trap</li>
                    <li>Use balance transfer offers</li>
                    <li>Avoid cash withdrawals</li>
                  </ul>

                </Card>

              </>
            ) : (
              !loading && !error && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>💳</div>
                    <p>Enter credit card details to see results</p>
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
