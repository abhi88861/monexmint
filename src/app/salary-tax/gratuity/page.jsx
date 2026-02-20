// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { calculateGratuity } from '@/lib/calculators';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function GratuityCalculator() {
//   const [formData, setFormData] = useState({
//     lastSalary: '50000',
//     yearsOfService: '10',
//     isGovernment: 'false',
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
//       const lastSalary = parseFloat(formData.lastSalary);
//       const years = parseFloat(formData.yearsOfService);
//       const isGov = formData.isGovernment === 'true';
//       const r = calculateGratuity(lastSalary, years, isGov);
//       setResult({ gratuity: r.gratuity, lastSalary, yearsOfService: years });
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
//           <h1 className={styles.title}>Gratuity Calculator</h1>
//           <p className={styles.description}>Calculate gratuity (Last Salary × 15/26 × Years)</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Employment Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Last Drawn Salary (Basic + DA)" type="number" name="lastSalary"
//                   value={formData.lastSalary} onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="Years of Service" type="number" name="yearsOfService" value={formData.yearsOfService}
//                   onChange={handleChange} required min="5" step="0.5" helpText="Minimum 5 years" />
//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Government Employee?</label>
//                   <select name="isGovernment" value={formData.isGovernment} onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem' }}>
//                     <option value="false">No (Private)</option>
//                     <option value="true">Yes</option>
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
//                     <div className={styles.emiLabel}>Gratuity Amount</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.gratuity)}</div>
//                   </div>
//                 </Card>
//                 <Card className={styles.infoCard}>
//                   <h3>Gratuity Formula</h3>
//                   <p>Private: (Last Salary × 15/26) × Years of Service. Government: Last Salary × 0.5 × Years.</p>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>🎖️</div><p>Enter details</p></div></Card>
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
import LoanPieChart from '@/components/charts/LoanPieChart';
import { salaryTaxAPI } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/constants';
import styles from '../../loans/emi/page.module.css';

const DEBOUNCE_MS = 600;

export default function GratuityCalculator() {

  const [formData, setFormData] = useState({
    lastSalary: '50000',
    yearsOfService: '10',
    isGovernment: 'false'
  });

  const [result, setResult] = useState(null);
  const [derived, setDerived] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ================= API =================
  const fetchGratuity = useCallback(async () => {

    const lastSalary = parseFloat(formData.lastSalary);
    const years = parseFloat(formData.yearsOfService);

    if (!lastSalary || !years || years < 1) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const payload = {
        lastDrawnSalary: lastSalary,
        yearsOfService: years
      };

      const response = await salaryTaxAPI.calculateGratuity(payload);

      setResult(response.data);

      setDerived({
        gratuity: response.data.gratuityAmount || 0
      });

    } catch (err) {
      setResult(null);
      setError(
        err.response?.data?.message ||
        'Gratuity calculation failed. Check backend.'
      );
    } finally {
      setLoading(false);
    }

  }, [formData]);

  // ================= AUTO CALCULATE =================
  useEffect(() => {
    const t = setTimeout(fetchGratuity, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchGratuity]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Gratuity Calculator</h1>
          <p className={styles.description}>
            Calculate gratuity instantly based on last salary & service years
          </p>
        </div>

        <div className={styles.content}>

          {/* LEFT FORM */}
          <div className={styles.formSection}>
            <Card title="Employment Details">

              <div className={styles.form}>

                <Input
                  label="Last Drawn Salary (Basic + DA)"
                  type="number"
                  name="lastSalary"
                  value={formData.lastSalary}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="Years of Service"
                  type="number"
                  name="yearsOfService"
                  value={formData.yearsOfService}
                  onChange={handleChange}
                  step="0.5"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className={styles.label}>Government Employee?</label>
                  <select
                    name="isGovernment"
                    value={formData.isGovernment}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="false">Private</option>
                    <option value="true">Government</option>
                  </select>
                </div>

                {error && <div className={styles.error}>{error}</div>}
                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>

            </Card>
          </div>

          {/* RIGHT RESULT */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && derived ? (
              <>

                {/* RESULT CARD */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Gratuity Amount</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(derived.gratuity)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="Gratuity Breakdown">

                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Last Salary</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(Number(formData.lastSalary))}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Service Years</div>
                      <div className={styles.summaryValue}>
                        {formData.yearsOfService}
                      </div>
                    </div>

                  </div>

                  <LoanPieChart
                    principal={Number(formData.lastSalary)}
                    interest={derived.gratuity}
                  />

                </Card>

                {/* EXPLANATION */}
                <Card>
                  <h3>Gratuity Calculation</h3>

                  <p>
                    Gratuity is paid to employees who complete minimum 5 years
                    of continuous service.
                  </p>

                  <h4>Private Sector Formula</h4>
                  <p>
                    Gratuity = Last Salary × 15 / 26 × Years of Service
                  </p>

                  <h4>Government Employees</h4>
                  <p>
                    May have different rules based on department policies.
                  </p>

                </Card>

              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>🎖️</div>
                    <p>Enter salary & service years to calculate gratuity</p>
                  </div>
                </Card>
              )
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
