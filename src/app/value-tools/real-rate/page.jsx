// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { calculateRealRate } from '@/lib/calculators';
// import styles from '../../loans/emi/page.module.css';

// export default function RealRateCalculator() {
//   const [formData, setFormData] = useState({
//     nominalReturn: '12',
//     inflationRate: '6',
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
//       const nominalReturn = parseFloat(formData.nominalReturn);
//       const inflationRate = parseFloat(formData.inflationRate);
//       const realRate = calculateRealRate(nominalReturn, inflationRate);
//       setResult({ realRate, nominalReturn, inflationRate });
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
//           <h1 className={styles.title}>Real Rate of Return Calculator</h1>
//           <p className={styles.description}>Real return after inflation</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Input Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Nominal Return %" type="number" name="nominalReturn" value={formData.nominalReturn}
//                   onChange={handleChange} suffix="%" required min="-50" max="50" step="0.1" />
//                 <Input label="Inflation %" type="number" name="inflationRate" value={formData.inflationRate}
//                   onChange={handleChange} suffix="%" required min="0" max="30" step="0.1" />
//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Calculate</Button>
//               </form>
//             </Card>
//           </div>
//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Real Rate of Return</div>
//                     <div className={styles.emiValue} style={{ color: result.realRate >= 0 ? '#10b981' : '#ef4444' }}>
//                       {result.realRate}%
//                     </div>
//                   </div>
//                 </Card>
//                 <Card className={styles.infoCard}>
//                   <h3>Formula</h3>
//                   <p>Real Rate = (1 + Nominal) / (1 + Inflation) - 1. This shows your true purchasing power gain.</p>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>📊</div><p>Enter nominal return and inflation</p></div></Card>
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
import { inflationAPI } from '@/lib/apiClient';
import styles from '../../loans/emi/page.module.css';

const DEBOUNCE_MS = 500;

export default function RealReturnCalculator() {

  const [formData, setFormData] = useState({
    nominalReturn: '12',
    inflationRate: '6'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchRealReturn = useCallback(async () => {

    const nominalReturn = parseFloat(formData.nominalReturn);
    const inflationRate = parseFloat(formData.inflationRate);

    if (!nominalReturn) return;

    const res = await inflationAPI.calculateRealReturn({
      nominalReturn,
      inflationRate
    });

    setResult(res.data);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(fetchRealReturn, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchRealReturn]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Real Return Calculator</h1>
          <p className={styles.description}>
            Return adjusted for inflation
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Return Details">

              <div className={styles.form}>

                <Input label="Nominal Return %" name="nominalReturn"
                  value={formData.nominalReturn} onChange={handleChange} />

                <Input label="Inflation Rate %" name="inflationRate"
                  value={formData.inflationRate} onChange={handleChange} />

              </div>

            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && (
              <Card variant="gradient" className={styles.emiCard}>
                <div className={styles.emiResult}>
                  <div className={styles.emiLabel}>Real Return</div>
                  <div className={styles.emiValue}>
                    {result.realReturn.toFixed(2)} %
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
