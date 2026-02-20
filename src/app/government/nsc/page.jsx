// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function NSCCalculator() {
//   const [formData, setFormData] = useState({
//     investmentAmount: '100000',
//     interestRate: '7.7',
//     tenure: '5',
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
//       const principal = parseFloat(formData.investmentAmount);
//       const rate = parseFloat(formData.interestRate) / 100;
//       const tenure = parseInt(formData.tenure);

//       // Compound interest formula: A = P(1 + r)^t
//       const maturityAmount = principal * Math.pow(1 + rate, tenure);
//       const totalInterest = maturityAmount - principal;

//       setResult({
//         maturityAmount: Math.round(maturityAmount),
//         principal: principal,
//         totalInterest: Math.round(totalInterest),
//         tenure: tenure,
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
//           <h1 className={styles.title}>NSC Calculator</h1>
//           <p className={styles.description}>
//             Calculate National Savings Certificate returns
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="NSC Investment Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input
//                   label="Investment Amount"
//                   type="number"
//                   name="investmentAmount"
//                   value={formData.investmentAmount}
//                   onChange={handleChange}
//                   prefix="₹"
//                   required
//                   min="1000"
//                   helpText="Minimum investment: ₹1,000"
//                 />

//                 <Input
//                   label="Tenure"
//                   type="number"
//                   name="tenure"
//                   value={formData.tenure}
//                   onChange={handleChange}
//                   suffix="years"
//                   required
//                   min="5"
//                   max="5"
//                   helpText="Fixed tenure of 5 years"
//                 />

//                 <Input
//                   label="Interest Rate (Current)"
//                   type="number"
//                   name="interestRate"
//                   value={formData.interestRate}
//                   onChange={handleChange}
//                   suffix="%"
//                   required
//                   step="0.1"
//                   helpText="Current rate: 7.7% p.a. compounded annually"
//                 />

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate NSC Returns
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

//                 <Card title="Investment Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Principal Amount</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.principal)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Total Interest</div>
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
//                       <div className={styles.summaryLabel}>Investment Period</div>
//                       <div className={styles.summaryValue}>
//                         {result.tenure} years
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>About National Savings Certificate</h3>
//                   <p>NSC is a fixed-income investment scheme backed by the Government of India.</p>
//                   <h4>Key Features:</h4>
//                   <ul>
//                     <li>Tax deduction under Section 80C</li>
//                     <li>Fixed 5-year tenure</li>
//                     <li>Guaranteed returns</li>
//                     <li>Available at any post office</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>📜</div>
//                   <p className={styles.placeholderText}>
//                     Calculate your NSC returns
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
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import { governmentAPI } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/constants';
import styles from '../../loans/emi/page.module.css';

const DEBOUNCE = 600;

export default function NSCCalculator() {

  const [formData, setFormData] = useState({
    investmentAmount: '100000',
    tenureYears: '5',
    interestRate: '7.7',
  });

  const [result, setResult] = useState(null);

  const handleChange = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const fetchResult = useCallback(async () => {

    try {

      const res = await governmentAPI.calculateNsc({
        investmentAmount: Number(formData.investmentAmount),
        tenureYears: Number(formData.tenureYears),
        interestRate: Number(formData.interestRate),
      });

      setResult(res.data);

    } catch (e) {
      console.error(e);
    }

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(fetchResult, DEBOUNCE);
    return () => clearTimeout(t);
  }, [fetchResult]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>NSC Calculator</h1>
          <p className={styles.description}>
            National Savings Certificate Returns Calculator
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="NSC Details">

              <div className={styles.form}>

                <Input label="Investment Amount"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input label="Tenure"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
                />

                <Input label="Interest Rate"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  suffix="%"
                />

              </div>

            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && (
              <>
                <Card variant="gradient">
                  <div className={styles.emiResult}>
                    <div>Maturity Amount</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.maturityAmount)}
                    </div>
                  </div>
                </Card>

                <Card title="Summary">

                  <div className={styles.summaryGrid}>

                    <div>
                      Total Invested
                      <div>{formatCurrency(result.totalInvested)}</div>
                    </div>

                    <div>
                      Interest Earned
                      <div>{formatCurrency(result.totalInterest)}</div>
                    </div>

                  </div>

                  <InvestmentBarChart
                    invested={result.totalInvested}
                    returns={result.totalInterest}
                  />

                </Card>
              </>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h3>About NSC</h3>
          <p>
            National Savings Certificate is a Government fixed income investment scheme.
            Interest is compounded annually and paid at maturity.
          </p>
        </Card>

      </div>
    </div>
  );
}
