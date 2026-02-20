// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { calculateInflation } from '@/lib/calculators';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function InflationCalculator() {
//   const [formData, setFormData] = useState({
//     amount: '100000',
//     inflationRate: '6',
//     years: '10',
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
//       const amount = parseFloat(formData.amount);
//       const inflationRate = parseFloat(formData.inflationRate);
//       const years = parseInt(formData.years);
//       const r = calculateInflation(amount, inflationRate, years);
//       setResult(r);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>
//         <div className={styles.header}>
//           <h1 className={styles.title}>Inflation Calculator</h1>
//           <p className={styles.description}>Future value and purchasing power of money</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Input Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Present Amount" type="number" name="amount" value={formData.amount}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="Expected Inflation %" type="number" name="inflationRate" value={formData.inflationRate}
//                   onChange={handleChange} suffix="%" required min="0" max="20" step="0.1" />
//                 <Input label="Years" type="number" name="years" value={formData.years}
//                   onChange={handleChange} required min="1" max="50" />
//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Calculate</Button>
//               </form>
//             </Card>
//           </div>
//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="gradient" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Future Equivalent Value</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.futureEquivalent)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Present Value</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.presentValue)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Purchasing Power</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.purchasingPower)}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>📉</div><p>Enter amount and inflation</p></div></Card>
//             )}
//           </div>
//         </div>
//         <Card className={styles.infoCard}>
//           <h3>About Inflation</h3>
//           <p>Future Equivalent: Amount needed in future to buy what ₹X buys today. Purchasing Power: What today&apos;s ₹X will be worth in future.</p>
//         </Card>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { inflationAPI } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/constants';
import styles from '../../loans/emi/page.module.css';

const DEBOUNCE_MS = 500;

export default function InflationCalculator() {

  const [formData, setFormData] = useState({
    presentValue: '100000',
    inflationRate: '6',
    years: '10'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchInflation = useCallback(async () => {

    const presentValue = parseFloat(formData.presentValue);
    const inflationRate = parseFloat(formData.inflationRate);
    const years = parseInt(formData.years);

    if (!presentValue) return;

    setLoading(true);

    try {

      const res = await inflationAPI.calculateInflation({
        presentValue,
        inflationRate,
        years
      });

      setResult(res.data);

    } finally {
      setLoading(false);
    }

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(fetchInflation, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchInflation]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Inflation Calculator</h1>
          <p className={styles.description}>
            Calculate future cost due to inflation
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Inflation Details">

              <div className={styles.form}>

                <Input label="Present Value" prefix="₹"
                  name="presentValue" value={formData.presentValue}
                  onChange={handleChange} />

                <Input label="Inflation Rate" suffix="%"
                  name="inflationRate" value={formData.inflationRate}
                  onChange={handleChange} />

                <Input label="Years"
                  name="years" value={formData.years}
                  onChange={handleChange} />

                {loading && <div>Calculating...</div>}

              </div>

            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && (
              <Card variant="gradient" className={styles.emiCard}>
                <div className={styles.emiResult}>
                  <div className={styles.emiLabel}>Future Cost</div>
                  <div className={styles.emiValue}>
                    {formatCurrency(result.futureCost)}
                  </div>
                </div>
              </Card>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
