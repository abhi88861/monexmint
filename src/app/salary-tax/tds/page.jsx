// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { calculateIncomeTax } from '@/lib/calculators';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function TDSCalculator() {
//   const [formData, setFormData] = useState({
//     grossIncome: '1000000',
//     regime: 'new',
//     deductions: '50000',
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
//       const grossIncome = parseFloat(formData.grossIncome);
//       const deductions = formData.regime === 'old' ? parseFloat(formData.deductions) : 0;
//       const r = calculateIncomeTax(grossIncome, formData.regime, deductions);
//       const monthlyTds = r.totalTax / 12;
//       setResult({
//         totalTds: r.totalTax,
//         monthlyTds: Math.round(monthlyTds * 100) / 100,
//         taxableIncome: r.taxableIncome,
//       });
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
//           <h1 className={styles.title}>TDS Calculator</h1>
//           <p className={styles.description}>Tax Deducted at Source - estimate TDS on salary</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Income Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Annual Gross Income" type="number" name="grossIncome" value={formData.grossIncome}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Regime</label>
//                   <select name="regime" value={formData.regime} onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem' }}>
//                     <option value="new">New Regime</option>
//                     <option value="old">Old Regime</option>
//                   </select>
//                 </div>
//                 {formData.regime === 'old' && (
//                   <Input label="Deductions" type="number" name="deductions" value={formData.deductions}
//                     onChange={handleChange} prefix="₹" min="0" />
//                 )}
//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Calculate TDS</Button>
//               </form>
//             </Card>
//           </div>
//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="gradient" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Annual TDS</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.totalTds)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Monthly TDS</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.monthlyTds)}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>📋</div><p>Enter income</p></div></Card>
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
import { salaryTaxAPI } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/constants';
import styles from '../../loans/emi/page.module.css';

const DEBOUNCE_MS = 500;

export default function TdsCalculator() {

  const [formData, setFormData] = useState({
    annualIncome: '1000000',
    deductions: '50000'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // API Call
  const fetchTds = useCallback(async () => {

    const annualIncome = parseFloat(formData.annualIncome);
    const deductions = parseFloat(formData.deductions || 0);

    if (!annualIncome || annualIncome <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      // const res = await salaryTaxAPI.calculateTds({
      //   annualIncome,
      //   deductions
      // });
      const res = await salaryTaxAPI.calculateTds({
  annualTax: annualIncome * 0.1   // Example 10% tax
});


      setResult(res.data);

    } catch (err) {
      setResult(null);
      setError(
        err.response?.data?.message ||
        'TDS calculation failed'
      );
    } finally {
      setLoading(false);
    }

  }, [formData]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(fetchTds, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchTds]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>TDS Calculator</h1>
          <p className={styles.description}>
            Estimate Tax Deducted at Source (TDS) on salary
          </p>
        </div>

        <div className={styles.content}>

          {/* FORM */}
          <div className={styles.formSection}>
            <Card title="Income Details">

              <div className={styles.form}>

                <Input
                  label="Annual Income"
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="Deductions"
                  type="number"
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleChange}
                  prefix="₹"
                />

                {loading && <div>Calculating...</div>}
                {error && <div className={styles.error}>{error}</div>}

              </div>

            </Card>
          </div>

          {/* RESULT */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && (
              <>
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Annual TDS</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.totalTds)}
                    </div>
                  </div>
                </Card>

                <Card title="TDS Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly TDS</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.monthlyTds)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Taxable Income</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.taxableIncome)}
                      </div>
                    </div>

                  </div>
                </Card>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
