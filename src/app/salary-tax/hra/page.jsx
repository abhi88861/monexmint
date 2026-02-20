// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { calculateHRAExemption } from '@/lib/calculators';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function HRACalculator() {
//   const [formData, setFormData] = useState({
//     monthlyBasic: '40000',
//     hraReceived: '20000',
//     rentPaid: '25000',
//     isMetro: 'true',
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
//       const annualSalary = parseFloat(formData.monthlyBasic) * 12;
//       const hraReceived = parseFloat(formData.hraReceived);
//       const rentPaid = parseFloat(formData.rentPaid);
//       const isMetro = formData.isMetro === 'true';
//       const r = calculateHRAExemption(annualSalary, hraReceived, rentPaid, isMetro);
//       setResult({ ...r, hraReceived, taxableHRA: hraReceived - r.exemption });
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
//           <h1 className={styles.title}>HRA Calculator</h1>
//           <p className={styles.description}>House Rent Allowance exemption</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="HRA Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Monthly Basic Salary" type="number" name="monthlyBasic" value={formData.monthlyBasic}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="HRA Received (monthly)" type="number" name="hraReceived" value={formData.hraReceived}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="Rent Paid (monthly)" type="number" name="rentPaid" value={formData.rentPaid}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Metro City?</label>
//                   <select name="isMetro" value={formData.isMetro} onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem' }}>
//                     <option value="true">Yes (50% of Basic)</option>
//                     <option value="false">No (40% of Basic)</option>
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
//                     <div className={styles.emiLabel}>HRA Exemption</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.exemption)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Taxable HRA</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.taxableHRA)}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>🏠</div><p>Enter HRA details</p></div></Card>
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

const DEBOUNCE_MS = 500;

export default function HRACalculator() {

  const [formData, setFormData] = useState({
    monthlyBasic: '40000',
    hraReceived: '20000',
    rentPaid: '25000',
    isMetro: 'true',
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
  const fetchHra = useCallback(async () => {

    const monthlyBasic = parseFloat(formData.monthlyBasic);
    const hraReceived = parseFloat(formData.hraReceived);
    const rentPaid = parseFloat(formData.rentPaid);
    const metroCity = formData.isMetro === 'true';

    if (!monthlyBasic || !hraReceived || !rentPaid) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      // Convert to backend payload (ANNUAL BASIC)
      const payload = {
        basicSalary: monthlyBasic * 12,
        hraReceived,
        rentPaid,
        metroCity
      };

      const response = await salaryTaxAPI.calculateHra(payload);

      setResult(response.data);

      setDerived({
        taxableHra: response.data.taxableHra,
        exemption: response.data.hraExemption
      });

    } catch (err) {
      setResult(null);
      setError(
        err.response?.data?.message ||
        'HRA calculation failed. Check backend.'
      );
    } finally {
      setLoading(false);
    }

  }, [formData]);

  // ================= DEBOUNCE =================
  useEffect(() => {
    const t = setTimeout(fetchHra, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchHra]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>HRA Calculator</h1>
          <p className={styles.description}>
            Calculate HRA exemption instantly
          </p>
        </div>

        <div className={styles.content}>

          {/* LEFT FORM */}
          <div className={styles.formSection}>
            <Card title="HRA Details">

              <div className={styles.form}>

                <Input
                  label="Monthly Basic Salary"
                  type="number"
                  name="monthlyBasic"
                  value={formData.monthlyBasic}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="HRA Received (Monthly)"
                  type="number"
                  name="hraReceived"
                  value={formData.hraReceived}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="Rent Paid (Monthly)"
                  type="number"
                  name="rentPaid"
                  value={formData.rentPaid}
                  onChange={handleChange}
                  prefix="₹"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className={styles.label}>Metro City?</label>
                  <select
                    name="isMetro"
                    value={formData.isMetro}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="true">Yes (50% Basic)</option>
                    <option value="false">No (40% Basic)</option>
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

                {/* RESULT */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>HRA Exemption</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(derived.exemption)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="HRA Summary">

                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Taxable HRA</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(derived.taxableHra)}
                      </div>
                    </div>

                  </div>

                  <LoanPieChart
                    principal={derived.exemption}
                    interest={derived.taxableHra}
                  />

                </Card>

                {/* EXPLANATION */}
                <Card>
                  <h3>About HRA Exemption</h3>

                  <p>
                    HRA exemption is calculated based on lowest of:
                  </p>

                  <ul>
                    <li>Actual HRA received</li>
                    <li>50% of salary (Metro) / 40% (Non Metro)</li>
                    <li>Rent paid – 10% of salary</li>
                  </ul>

                </Card>

              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>🏠</div>
                    <p>Enter HRA details to see results</p>
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
