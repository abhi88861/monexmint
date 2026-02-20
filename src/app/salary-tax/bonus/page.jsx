// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { calculateIncomeTax } from '@/lib/calculators';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function BonusCalculator() {
//   const [formData, setFormData] = useState({
//     annualSalary: '800000',
//     bonusAmount: '50000',
//     regime: 'new',
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
//       const annualSalary = parseFloat(formData.annualSalary);
//       const bonusAmount = parseFloat(formData.bonusAmount);
//       const taxWithoutBonus = calculateIncomeTax(annualSalary, formData.regime).totalTax;
//       const taxWithBonus = calculateIncomeTax(annualSalary + bonusAmount, formData.regime).totalTax;
//       const bonusTax = taxWithBonus - taxWithoutBonus;
//       const bonusAfterTax = bonusAmount - bonusTax;
//       setResult({
//         bonusAmount, bonusTax, bonusAfterTax: Math.round(bonusAfterTax * 100) / 100,
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
//           <h1 className={styles.title}>Bonus / Variable Pay Calculator</h1>
//           <p className={styles.description}>Calculate tax on bonus and take-home bonus</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Bonus Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Annual Salary (excluding bonus)" type="number" name="annualSalary"
//                   value={formData.annualSalary} onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="Bonus Amount" type="number" name="bonusAmount" value={formData.bonusAmount}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tax Regime</label>
//                   <select name="regime" value={formData.regime} onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem' }}>
//                     <option value="new">New</option>
//                     <option value="old">Old</option>
//                   </select>
//                 </div>
//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Calculate</Button>
//               </form>
//             </Card>
//           </div>
//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Bonus After Tax</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.bonusAfterTax)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Gross Bonus</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.bonusAmount)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Tax on Bonus</div>
//                       <div className={styles.summaryValue} style={{ color: '#ef4444' }}>{formatCurrency(result.bonusTax)}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>🎁</div><p>Enter bonus details</p></div></Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import Input from '@/components/ui/Input';
// import Card from '@/components/ui/Card';
// import AdSlot from '@/components/ads/AdSlot';
// import LoanPieChart from '@/components/charts/LoanPieChart';
// import { salaryTaxAPI } from '@/lib/apiClient';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// const DEBOUNCE_MS = 500;

// export default function BonusCalculator() {

//   const [formData, setFormData] = useState({
//     basicSalary: '50000',
//     bonusPercent: '10',
//   });

//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const fetchBonus = useCallback(async () => {

//     const basicSalary = parseFloat(formData.basicSalary);
//     const bonusPercent = parseFloat(formData.bonusPercent);

//     if (!basicSalary || basicSalary <= 0 || !bonusPercent || bonusPercent < 0) {
//       setResult(null);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {

//       const response = await salaryTaxAPI.calculateBonus({
//         basicSalary,
//         bonusPercent
//       });

//       setResult(response.data);

//     } catch (err) {
//       setResult(null);
//       setError(
//         err.response?.data?.message ||
//         'Bonus calculation failed. Check backend service.'
//       );
//     } finally {
//       setLoading(false);
//     }

//   }, [formData.basicSalary, formData.bonusPercent]);

//   useEffect(() => {
//     const t = setTimeout(fetchBonus, DEBOUNCE_MS);
//     return () => clearTimeout(t);
//   }, [fetchBonus]);

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>

//         {/* HEADER */}
//         <div className={styles.header}>
//           <h1 className={styles.title}>Bonus Calculator</h1>
//           <p className={styles.description}>
//             Calculate performance or annual bonus based on salary percentage
//           </p>
//         </div>

//         <div className={styles.content}>

//           {/* LEFT FORM */}
//           <div className={styles.formSection}>
//             <Card title="Bonus Details">

//               <div className={styles.form}>

//                 <Input
//                   label="Basic Salary"
//                   type="number"
//                   name="basicSalary"
//                   value={formData.basicSalary}
//                   onChange={handleChange}
//                   prefix="₹"
//                   min="1"
//                 />

//                 <Input
//                   label="Bonus Percentage"
//                   type="number"
//                   name="bonusPercent"
//                   value={formData.bonusPercent}
//                   onChange={handleChange}
//                   suffix="%"
//                   min="0"
//                   step="0.1"
//                 />

//                 {error && <div className={styles.error}>{error}</div>}
//                 {loading && <div className={styles.loading}>Calculating…</div>}

//               </div>

//             </Card>
//           </div>

//           {/* RIGHT RESULT */}
//           <div className={styles.resultsSection}>

//             <AdSlot format="rectangle" />

//             {result ? (
//               <>
//                 {/* RESULT */}
//                 <Card variant="gradient" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Bonus Amount</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.bonusAmount)}
//                     </div>
//                   </div>
//                 </Card>

//                 {/* SUMMARY */}
//                 <Card title="Bonus Summary">
//                   <div className={styles.summaryGrid}>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Basic Salary</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(Number(formData.basicSalary))}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Bonus Earned</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.bonusAmount)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Total Salary (With Bonus)</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.totalSalaryWithBonus)}
//                       </div>
//                     </div>

//                   </div>

//                   <LoanPieChart
//                     principal={Number(formData.basicSalary)}
//                     interest={result.bonusAmount}
//                   />

//                 </Card>

//                 {/* INFO */}
//                 <Card className={styles.infoCard}>
//                   <h3>About Salary Bonus</h3>
//                   <p>
//                     Bonuses are additional earnings paid based on performance,
//                     company profit, or annual appraisal cycles.
//                   </p>

//                   <h4>Common Bonus Types</h4>
//                   <ul>
//                     <li>Performance Bonus</li>
//                     <li>Annual Bonus</li>
//                     <li>Joining Bonus</li>
//                     <li>Retention Bonus</li>
//                   </ul>
//                 </Card>

//               </>
//             ) : (
//               !loading && !error && (
//                 <Card>
//                   <div className={styles.placeholder}>
//                     <div className={styles.placeholderIcon}>🎁</div>
//                     <p>Enter salary details to calculate bonus</p>
//                   </div>
//                 </Card>
//               )
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

export default function BonusCalculator() {

  const [formData, setFormData] = useState({
    basicSalary: '50000',
    bonusPercent: '10'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchBonus = useCallback(async () => {

    const basicSalary = parseFloat(formData.basicSalary);
    const bonusPercent = parseFloat(formData.bonusPercent);

    if (!basicSalary || !bonusPercent) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const res = await salaryTaxAPI.calculateBonus({
        basicSalary,
        bonusPercent
      });

      setResult(res.data);

    } catch (err) {
      setError('Bonus calculation failed');
      setResult(null);
    } finally {
      setLoading(false);
    }

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(fetchBonus, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchBonus]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Bonus Calculator</h1>
          <p className={styles.description}>
            Calculate bonus based on salary percentage
          </p>
        </div>

        <div className={styles.content}>

          {/* FORM */}
          <div className={styles.formSection}>
            <Card title="Bonus Details">

              <div className={styles.form}>

                <Input
                  label="Basic Salary"
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="Bonus %"
                  type="number"
                  name="bonusPercent"
                  value={formData.bonusPercent}
                  onChange={handleChange}
                  suffix="%"
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
                    <div className={styles.emiLabel}>Bonus Amount</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.bonusAmount)}
                    </div>
                  </div>
                </Card>

                <Card title="Summary">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Salary</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(Number(formData.basicSalary))}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Salary With Bonus</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.totalSalaryWithBonus)}
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
