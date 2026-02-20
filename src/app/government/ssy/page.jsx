// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function SSYCalculator() {
//   const [formData, setFormData] = useState({
//     yearlyDeposit: '100000',
//     girlAge: '5',
//     interestRate: '8.2',
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
//       const yearlyDeposit = parseFloat(formData.yearlyDeposit);
//       const girlAge = parseInt(formData.girlAge);
//       const rate = parseFloat(formData.interestRate) / 100;

//       // Deposit period: Until girl turns 15 (15 - current age)
//       const depositYears = 15 - girlAge;
//       // Maturity: When girl turns 21
//       const maturityYears = 21 - girlAge;

//       let balance = 0;
      
//       // Calculate with deposits (until age 15)
//       for (let year = 1; year <= depositYears; year++) {
//         balance = (balance + yearlyDeposit) * (1 + rate);
//       }
      
//       // Calculate without deposits (15 to 21)
//       const remainingYears = maturityYears - depositYears;
//       for (let year = 1; year <= remainingYears; year++) {
//         balance = balance * (1 + rate);
//       }

//       const totalInvested = yearlyDeposit * depositYears;
//       const totalInterest = balance - totalInvested;

//       setResult({
//         maturityAmount: Math.round(balance),
//         totalInvested: totalInvested,
//         totalInterest: Math.round(totalInterest),
//         depositYears: depositYears,
//         maturityAge: 21,
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
//           <h1 className={styles.title}>SSY Calculator</h1>
//           <p className={styles.description}>
//             Calculate Sukanya Samriddhi Yojana returns for your girl child
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="SSY Investment Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input
//                   label="Yearly Investment"
//                   type="number"
//                   name="yearlyDeposit"
//                   value={formData.yearlyDeposit}
//                   onChange={handleChange}
//                   prefix="₹"
//                   required
//                   min="250"
//                   max="150000"
//                   helpText="Min: ₹250, Max: ₹1,50,000 per year"
//                 />

//                 <Input
//                   label="Girl's Current Age"
//                   type="number"
//                   name="girlAge"
//                   value={formData.girlAge}
//                   onChange={handleChange}
//                   suffix="years"
//                   required
//                   min="0"
//                   max="10"
//                   helpText="Account can be opened until girl turns 10"
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
//                   helpText="Current rate: 8.2% p.a."
//                 />

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate SSY Returns
//                 </Button>
//               </form>
//             </Card>
//           </div>

//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Maturity Amount at Age 21</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.maturityAmount)}
//                     </div>
//                   </div>
//                 </Card>

//                 <Card title="Investment Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Total Invested</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.totalInvested)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Total Interest</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.totalInterest)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Investment Period</div>
//                       <div className={styles.summaryValue}>
//                         {result.depositYears} years
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Maturity Age</div>
//                       <div className={styles.summaryValue}>
//                         {result.maturityAge} years
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>About Sukanya Samriddhi Yojana</h3>
//                   <p>SSY is a government savings scheme for girl child, part of Beti Bachao Beti Padhao campaign.</p>
//                   <h4>Key Features:</h4>
//                   <ul>
//                     <li>Higher interest rate than PPF</li>
//                     <li>Tax-free returns under Section 80C</li>
//                     <li>Deposits until girl turns 15, matures at 21</li>
//                     <li>Partial withdrawal allowed for higher education</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>👧</div>
//                   <p className={styles.placeholderText}>
//                     Secure your girl child's future with SSY
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

export default function SSYCalculator() {

  const [formData, setFormData] = useState({
    yearlyDeposit: '50000',
    girlAge: '5',
    interestRate: '8.2',
  });

  const [result, setResult] = useState(null);

  const handleChange = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const fetchResult = useCallback(async () => {

    try {

      const res = await governmentAPI.calculateSsy({
        yearlyDeposit: Number(formData.yearlyDeposit),
        girlAge: Number(formData.girlAge),
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
          <h1 className={styles.title}>SSY Calculator</h1>
          <p className={styles.description}>
            Sukanya Samriddhi Yojana maturity calculation
          </p>
        </div>

        <div className={styles.content}>

          {/* FORM */}
          <div className={styles.formSection}>
            <Card title="SSY Details">

              <div className={styles.form}>

                <Input label="Yearly Deposit"
                  name="yearlyDeposit"
                  value={formData.yearlyDeposit}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input label="Girl Child Age"
                  name="girlAge"
                  value={formData.girlAge}
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

          {/* RESULT */}
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
                      <div style={{ color: '#10b981' }}>
                        {formatCurrency(result.totalInterest)}
                      </div>
                    </div>

                    <div>
                      Maturity Age
                      <div>{result.maturityAge} Years</div>
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
          <h3>About SSY</h3>
          <p>
            Sukanya Samriddhi Yojana is a government scheme for girl child savings.
            Deposit allowed for 15 years. Maturity at 21 years from account opening.
          </p>
        </Card>

      </div>
    </div>
  );
}
