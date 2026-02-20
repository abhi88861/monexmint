// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { calculateFutureValue } from '@/lib/calculators';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function FutureValueCalculator() {
//   const [formData, setFormData] = useState({
//     presentValue: '100000',
//     rate: '8',
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
//       const presentValue = parseFloat(formData.presentValue);
//       const rate = parseFloat(formData.rate);
//       const years = parseInt(formData.years);
//       const r = calculateFutureValue(presentValue, rate, years);
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
//           <h1 className={styles.title}>Future Value of Money</h1>
//           <p className={styles.description}>FV = PV × (1 + r)^n</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Input Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Present Value" type="number" name="presentValue" value={formData.presentValue}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="Growth Rate %" type="number" name="rate" value={formData.rate}
//                   onChange={handleChange} suffix="%" required min="0" max="30" step="0.1" />
//                 <Input label="Years" type="number" name="years" value={formData.years}
//                   onChange={handleChange} required min="1" max="50" />
//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Calculate</Button>
//               </form>
//             </Card>
//           </div>
//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Future Value</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.futureValue)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Present Value</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.presentValue)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Years</div>
//                       <div className={styles.summaryValue}>{result.years}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>💰</div><p>Enter present value and rate</p></div></Card>
//             )}
//           </div>
//         </div>
//         <Card className={styles.infoCard}>
//           <h3>About Future Value</h3>
//           <p>FV = PV × (1 + r)^n. Use growth rate for investment returns or inflation rate for cost projections.</p>
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

export default function FutureValueCalculator() {

  const [formData, setFormData] = useState({
    presentValue: '100000',
    rate: '10',
    years: '10'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchFutureValue = useCallback(async () => {

    const res = await inflationAPI.calculateFutureValue({
      presentValue: parseFloat(formData.presentValue),
      rate: parseFloat(formData.rate),
      years: parseInt(formData.years)
    });

    setResult(res.data);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(fetchFutureValue, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchFutureValue]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Future Value Calculator</h1>
          <p className={styles.description}>
            Calculate future value of money
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Investment Details">

              <div className={styles.form}>

                <Input label="Present Value" prefix="₹"
                  name="presentValue" value={formData.presentValue}
                  onChange={handleChange} />

                <Input label="Return Rate %" name="rate"
                  value={formData.rate} onChange={handleChange} />

                <Input label="Years" name="years"
                  value={formData.years} onChange={handleChange} />

              </div>

            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && (
              <Card variant="gradient" className={styles.emiCard}>
                <div className={styles.emiResult}>
                  <div className={styles.emiLabel}>Future Value</div>
                  <div className={styles.emiValue}>
                    {formatCurrency(result.futureValue)}
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
