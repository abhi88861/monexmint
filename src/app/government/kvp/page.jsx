// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function KVPCalculator() {
//   const [formData, setFormData] = useState({
//     investmentAmount: '10000',
//     interestRate: '7.5',
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

//       // KVP doubles the investment
//       // Calculate time to double: t = ln(2) / ln(1 + r)
//       const timeToDouble = Math.log(2) / Math.log(1 + rate);
//       const maturityAmount = principal * 2; // Money doubles

//       setResult({
//         maturityAmount: Math.round(maturityAmount),
//         principal: principal,
//         totalInterest: Math.round(maturityAmount - principal),
//         maturityPeriod: timeToDouble.toFixed(2),
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
//           <h1 className={styles.title}>KVP Calculator</h1>
//           <p className={styles.description}>
//             Calculate Kisan Vikas Patra maturity - Your money doubles!
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="KVP Investment Details">
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
//                   helpText="Minimum: ₹1,000"
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
//                   helpText="Current rate: 7.5% p.a."
//                 />

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate Maturity
//                 </Button>
//               </form>
//             </Card>
//           </div>

//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Maturity Amount (Doubled)</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.maturityAmount)}
//                     </div>
//                   </div>
//                 </Card>

//                 <Card title="Investment Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Investment Amount</div>
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
//                       <div className={styles.summaryLabel}>Maturity Amount</div>
//                       <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
//                         {formatCurrency(result.maturityAmount)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Time to Double</div>
//                       <div className={styles.summaryValue}>
//                         {result.maturityPeriod} years
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>About Kisan Vikas Patra</h3>
//                   <p>KVP is a savings certificate scheme where your investment doubles in a fixed period.</p>
//                   <h4>Key Features:</h4>
//                   <ul>
//                     <li>Investment doubles at maturity</li>
//                     <li>Available at post offices</li>
//                     <li>Can be used as collateral for loans</li>
//                     <li>Transferable from one person to another</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>🌾</div>
//                   <p className={styles.placeholderText}>
//                     See when your investment will double
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

export default function KVPCalculator() {

  const [formData, setFormData] = useState({
    investmentAmount: '100000',
    interestRate: '7.5',
    tenureYears: '10',
  });

  const [result, setResult] = useState(null);

  const handleChange = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const fetchResult = useCallback(async () => {

    try {

      const res = await governmentAPI.calculateKvp({
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
          <h1 className={styles.title}>KVP Calculator</h1>
          <p className={styles.description}>
            Kisan Vikas Patra Returns Calculator
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="KVP Details">

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
          <h3>About KVP</h3>
          <p>
            Kisan Vikas Patra is a Government savings scheme where money doubles
            in a fixed period. It is safe and guaranteed.
          </p>
        </Card>

      </div>
    </div>
  );
}
