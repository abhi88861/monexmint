// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function SCSSCalculator() {
//   const [formData, setFormData] = useState({
//     investmentAmount: '1500000',
//     interestRate: '8.2',
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

//       // SCSS pays quarterly interest
//       const quarterlyInterest = (principal * rate) / 4;
//       const annualInterest = principal * rate;
//       const totalInterest = annualInterest * tenure;
//       const maturityAmount = principal + totalInterest;

//       setResult({
//         principal: principal,
//         quarterlyInterest: Math.round(quarterlyInterest),
//         annualInterest: Math.round(annualInterest),
//         totalInterest: Math.round(totalInterest),
//         maturityAmount: Math.round(maturityAmount),
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
//           <h1 className={styles.title}>SCSS Calculator</h1>
//           <p className={styles.description}>
//             Calculate Senior Citizens Savings Scheme returns and quarterly interest
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="SCSS Investment Details">
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
//                   max="3000000"
//                   helpText="Min: ₹1,000, Max: ₹30,00,000"
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
//                   helpText="Fixed 5 years (extendable by 3 years)"
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
//                   helpText="Current rate: 8.2% p.a. (paid quarterly)"
//                 />

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate SCSS Returns
//                 </Button>
//               </form>
//             </Card>
//           </div>

//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Quarterly Interest Income</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.quarterlyInterest)}
//                     </div>
//                   </div>
//                 </Card>

//                 <Card title="Income & Maturity Details">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Investment Amount</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.principal)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Annual Interest</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.annualInterest)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Total Interest (5 years)</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.totalInterest)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Maturity Amount</div>
//                       <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
//                         {formatCurrency(result.maturityAmount)}
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>About SCSS</h3>
//                   <p>Senior Citizens Savings Scheme is a government-backed savings instrument for citizens above 60 years.</p>
//                   <h4>Key Features:</h4>
//                   <ul>
//                     <li>Highest interest rate among government schemes</li>
//                     <li>Quarterly interest payouts for regular income</li>
//                     <li>Tax deduction under Section 80C</li>
//                     <li>Suitable for retirement planning</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>👵</div>
//                   <p className={styles.placeholderText}>
//                     Plan your retirement income with SCSS
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

export default function SCSSCalculator() {

  const [formData, setFormData] = useState({
    investmentAmount: '1500000',
    interestRate: '8.2',
    tenureYears: '5',
  });

  const [result, setResult] = useState(null);

  const handleChange = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const fetchResult = useCallback(async () => {

    try {

      const res = await governmentAPI.calculateScss({
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
          <h1 className={styles.title}>SCSS Calculator</h1>
          <p className={styles.description}>
            Senior Citizen Savings Scheme Returns Calculator
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="SCSS Details">

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
                      Total Interest
                      <div>{formatCurrency(result.totalInterest)}</div>
                    </div>

                    <div>
                      Quarterly Interest
                      <div>{formatCurrency(result.quarterlyInterest)}</div>
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
          <h3>About SCSS</h3>
          <p>
            SCSS is a retirement savings scheme for senior citizens offering
            guaranteed quarterly income with government backing.
          </p>
        </Card>

      </div>
    </div>
  );
}
