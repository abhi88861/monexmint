// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function PostOfficeMISCalculator() {
//   const [formData, setFormData] = useState({
//     investmentAmount: '450000',
//     interestRate: '7.4',
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

//       // MIS pays monthly interest
//       const monthlyInterest = (principal * rate) / 12;
//       const annualInterest = principal * rate;
//       const totalInterest5Years = annualInterest * 5;

//       setResult({
//         principal: principal,
//         monthlyInterest: Math.round(monthlyInterest),
//         annualInterest: Math.round(annualInterest),
//         totalInterest5Years: Math.round(totalInterest5Years),
//         tenure: 5,
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
//           <h1 className={styles.title}>Post Office MIS Calculator</h1>
//           <p className={styles.description}>
//             Calculate Monthly Income Scheme returns and regular monthly income
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="MIS Investment Details">
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
//                   max="900000"
//                   step="1000"
//                   helpText="Min: ₹1,000, Max: ₹9,00,000 (₹4.5L for single, ₹9L for joint)"
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
//                   helpText="Current rate: 7.4% p.a. (paid monthly)"
//                 />

//                 <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '0.75rem', marginBottom: '1rem' }}>
//                   <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>
//                     <strong>Tenure:</strong> Fixed 5 years
//                   </p>
//                 </div>

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate Monthly Income
//                 </Button>
//               </form>
//             </Card>
//           </div>

//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Monthly Income</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.monthlyInterest)}
//                     </div>
//                   </div>
//                 </Card>

//                 <Card title="Income Details">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Investment Amount</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.principal)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Monthly Income</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.monthlyInterest)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Annual Income</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.annualInterest)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Total Interest (5 years)</div>
//                       <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
//                         {formatCurrency(result.totalInterest5Years)}
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>About Post Office MIS</h3>
//                   <p>Monthly Income Scheme provides fixed monthly income on your investment.</p>
//                   <h4>Key Features:</h4>
//                   <ul>
//                     <li>Regular monthly income</li>
//                     <li>5-year maturity period</li>
//                     <li>Government-backed security</li>
//                     <li>Premature withdrawal after 1 year with penalty</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>📮</div>
//                   <p className={styles.placeholderText}>
//                     Calculate your monthly income from Post Office MIS
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

export default function MISCalculator() {

  const [formData, setFormData] = useState({
    investmentAmount: '900000',
    interestRate: '7.4',
    tenureYears: '5',
  });

  const [result, setResult] = useState(null);

  const handleChange = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const fetchResult = useCallback(async () => {

    try {

      const res = await governmentAPI.calculateMis({
        investmentAmount: Number(formData.investmentAmount),
        interestRate: Number(formData.interestRate),
        tenureYears: Number(formData.tenureYears),
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
          <h1 className={styles.title}>Post Office MIS Calculator</h1>
          <p className={styles.description}>
            Monthly Income from Post Office MIS Scheme
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="MIS Details">

              <div className={styles.form}>

                <Input label="Investment Amount"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input label="Interest Rate"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  suffix="%"
                />

                <Input label="Tenure"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
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
                    <div>Monthly Income</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.monthlyIncome)}
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
                      Total Interest
                      <div>{formatCurrency(result.totalInterest)}</div>
                    </div>

                    <div>
                      Maturity Amount
                      <div>{formatCurrency(result.maturityAmount)}</div>
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
          <h3>About Post Office MIS</h3>
          <p>
            MIS provides fixed monthly income with capital safety.
            Ideal for retirees needing regular income.
          </p>
        </Card>

      </div>
    </div>
  );
}
