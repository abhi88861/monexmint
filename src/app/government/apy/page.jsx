// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function APYCalculator() {
//   const [formData, setFormData] = useState({
//     currentAge: '25',
//     pensionAmount: '5000',
//   });

//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // APY contribution table (approximate monthly contributions)
//   const getMonthlyContribution = (age, pension) => {
//     const contributions = {
//       18: { 1000: 42, 2000: 84, 3000: 126, 4000: 168, 5000: 210 },
//       25: { 1000: 76, 2000: 151, 3000: 226, 4000: 301, 5000: 376 },
//       30: { 1000: 116, 2000: 231, 3000: 347, 4000: 462, 5000: 577 },
//       35: { 1000: 181, 2000: 362, 3000: 543, 4000: 724, 5000: 902 },
//       40: { 1000: 291, 2000: 582, 3000: 873, 4000: 1164, 5000: 1454 },
//     };

//     // Find closest age bracket
//     const ages = [18, 25, 30, 35, 40];
//     const closestAge = ages.reduce((prev, curr) => 
//       Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
//     );

//     return contributions[closestAge][pension] || 210;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCalculate = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const age = parseInt(formData.currentAge);
//       const pension = parseInt(formData.pensionAmount);
      
//       const monthlyContribution = getMonthlyContribution(age, pension);
//       const contributionYears = 60 - age;
//       const totalContribution = monthlyContribution * 12 * contributionYears;

//       setResult({
//         monthlyContribution: monthlyContribution,
//         monthlyPension: pension,
//         totalContribution: totalContribution,
//         contributionYears: contributionYears,
//         pensionStartAge: 60,
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
//           <h1 className={styles.title}>APY Calculator</h1>
//           <p className={styles.description}>
//             Calculate your Atal Pension Yojana monthly contribution
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="APY Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input
//                   label="Current Age"
//                   type="number"
//                   name="currentAge"
//                   value={formData.currentAge}
//                   onChange={handleChange}
//                   suffix="years"
//                   required
//                   min="18"
//                   max="40"
//                   helpText="Entry age: 18-40 years"
//                 />

//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>
//                     Desired Monthly Pension
//                   </label>
//                   <select
//                     name="pensionAmount"
//                     value={formData.pensionAmount}
//                     onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '1rem', fontFamily: 'inherit' }}
//                     required
//                   >
//                     <option value="1000">₹1,000</option>
//                     <option value="2000">₹2,000</option>
//                     <option value="3000">₹3,000</option>
//                     <option value="4000">₹4,000</option>
//                     <option value="5000">₹5,000</option>
//                   </select>
//                   <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
//                     Choose from fixed pension options
//                   </span>
//                 </div>

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate APY Contribution
//                 </Button>
//               </form>
//             </Card>
//           </div>

//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Monthly Contribution Required</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.monthlyContribution)}
//                     </div>
//                   </div>
//                 </Card>

//                 <Card title="Pension Details">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Monthly Pension at 60</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.monthlyPension)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Total Contribution</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.totalContribution)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Contribution Period</div>
//                       <div className={styles.summaryValue}>
//                         {result.contributionYears} years
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Pension Start Age</div>
//                       <div className={styles.summaryValue}>
//                         {result.pensionStartAge} years
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>About Atal Pension Yojana</h3>
//                   <p>APY is a government-backed pension scheme for unorganized sector workers.</p>
//                   <h4>Key Features:</h4>
//                   <ul>
//                     <li>Guaranteed pension: ₹1,000 to ₹5,000 per month</li>
//                     <li>Government co-contribution for eligible subscribers</li>
//                     <li>Spouse gets same pension after subscriber's death</li>
//                     <li>Nominee gets corpus after both deaths</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>👴</div>
//                   <p className={styles.placeholderText}>
//                     Plan your pension with Atal Pension Yojana
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

export default function APYCalculator() {

  const [formData, setFormData] = useState({
    currentAge: '25',
    pensionAmount: '3000',
  });

  const [result, setResult] = useState(null);

  const handleChange = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const fetchResult = useCallback(async () => {

    try {

      const res = await governmentAPI.calculateApy({
        currentAge: Number(formData.currentAge),
        pensionAmount: Number(formData.pensionAmount),
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
          <h1 className={styles.title}>APY Calculator</h1>
          <p className={styles.description}>
            Atal Pension Yojana Pension Planning
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="APY Details">

              <div className={styles.form}>

                <Input label="Current Age"
                  name="currentAge"
                  value={formData.currentAge}
                  onChange={handleChange}
                  suffix="years"
                />

                <Input label="Desired Pension"
                  name="pensionAmount"
                  value={formData.pensionAmount}
                  onChange={handleChange}
                  prefix="₹"
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
                    <div>Monthly Contribution</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.monthlyContribution)}
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
                      Pension After 60
                      <div>{formatCurrency(result.pensionAmount)}</div>
                    </div>

                    <div>
                      Contribution Years
                      <div>{result.contributionYears}</div>
                    </div>

                  </div>

                  <InvestmentBarChart
                    invested={result.totalInvested}
                    returns={result.pensionAmount * 12 * 20}
                  />

                </Card>
              </>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h3>About APY</h3>
          <p>
            Atal Pension Yojana is a government pension scheme for unorganized sector workers.
            It guarantees fixed pension after age 60.
          </p>
        </Card>

      </div>
    </div>
  );
}
