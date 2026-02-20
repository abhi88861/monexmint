// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function IncomeTaxCalculator() {
//   const [formData, setFormData] = useState({
//     annualIncome: '1000000',
//     regime: 'new',
//     deductions: '50000',
//   });

//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const calculateTax = (income, regime) => {
//     if (regime === 'new') {
//       // New Tax Regime (FY 2024-25)
//       if (income <= 300000) return 0;
//       if (income <= 700000) return (income - 300000) * 0.05;
//       if (income <= 1000000) return 20000 + (income - 700000) * 0.10;
//       if (income <= 1200000) return 50000 + (income - 1000000) * 0.15;
//       if (income <= 1500000) return 80000 + (income - 1200000) * 0.20;
//       return 140000 + (income - 1500000) * 0.30;
//     } else {
//       // Old Tax Regime
//       if (income <= 250000) return 0;
//       if (income <= 500000) return (income - 250000) * 0.05;
//       if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
//       return 112500 + (income - 1000000) * 0.30;
//     }
//   };

//   const handleCalculate = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const income = parseFloat(formData.annualIncome);
//       const deductions = formData.regime === 'old' ? parseFloat(formData.deductions) : 0;
//       const taxableIncome = income - deductions;
      
//       const tax = calculateTax(taxableIncome, formData.regime);
//       const cess = tax * 0.04; // 4% cess
//       const totalTax = tax + cess;
//       const netIncome = income - totalTax;

//       setResult({
//         grossIncome: income,
//         deductions: deductions,
//         taxableIncome: taxableIncome,
//         incomeTax: Math.round(tax),
//         cess: Math.round(cess),
//         totalTax: Math.round(totalTax),
//         netIncome: Math.round(netIncome),
//         effectiveRate: ((totalTax / income) * 100).toFixed(2),
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
//           <h1 className={styles.title}>Income Tax Calculator</h1>
//           <p className={styles.description}>
//             Calculate your income tax for FY 2024-25
//           </p>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Income Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input
//                   label="Annual Income"
//                   type="number"
//                   name="annualIncome"
//                   value={formData.annualIncome}
//                   onChange={handleChange}
//                   prefix="₹"
//                   required
//                   min="0"
//                 />

//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>
//                     Tax Regime
//                   </label>
//                   <select
//                     name="regime"
//                     value={formData.regime}
//                     onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '1rem', fontFamily: 'inherit' }}
//                   >
//                     <option value="new">New Tax Regime (No deductions)</option>
//                     <option value="old">Old Tax Regime (With deductions)</option>
//                   </select>
//                 </div>

//                 {formData.regime === 'old' && (
//                   <Input
//                     label="Deductions (80C, 80D, etc.)"
//                     type="number"
//                     name="deductions"
//                     value={formData.deductions}
//                     onChange={handleChange}
//                     prefix="₹"
//                     required
//                     min="0"
//                     helpText="Total deductions under various sections"
//                   />
//                 )}

//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
//                   Calculate Tax
//                 </Button>
//               </form>
//             </Card>
//           </div>

//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Total Tax Payable</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.totalTax)}
//                     </div>
//                   </div>
//                 </Card>

//                 <Card title="Tax Breakdown">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Gross Income</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.grossIncome)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Taxable Income</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.taxableIncome)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Income Tax</div>
//                       <div className={styles.summaryValue} style={{ color: '#ef4444' }}>
//                         {formatCurrency(result.incomeTax)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Health & Education Cess</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(result.cess)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Net Income</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>
//                         {formatCurrency(result.netIncome)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Effective Tax Rate</div>
//                       <div className={styles.summaryValue}>
//                         {result.effectiveRate}%
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className={styles.infoCard}>
//                   <h3>Income Tax Slabs (FY 2024-25)</h3>
//                   <h4>New Regime:</h4>
//                   <ul>
//                     <li>Up to ₹3L: Nil</li>
//                     <li>₹3L - ₹7L: 5%</li>
//                     <li>₹7L - ₹10L: 10%</li>
//                     <li>₹10L - ₹12L: 15%</li>
//                     <li>₹12L - ₹15L: 20%</li>
//                     <li>Above ₹15L: 30%</li>
//                   </ul>
//                 </Card>
//               </>
//             ) : (
//               <Card>
//                 <div className={styles.placeholder}>
//                   <div className={styles.placeholderIcon}>💼</div>
//                   <p className={styles.placeholderText}>
//                     Calculate your income tax liability
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
import LoanPieChart from '@/components/charts/LoanPieChart';
import { salaryTaxAPI } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/constants';
import styles from '../../loans/emi/page.module.css';

const DEBOUNCE_MS = 600;

export default function IncomeTaxCalculator() {

  const [formData, setFormData] = useState({
    annualIncome: '1000000',
    regime: 'new',
    deductions: '50000'
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
  const fetchIncomeTax = useCallback(async () => {

    const annualIncome = parseFloat(formData.annualIncome);
    const deductions = parseFloat(formData.deductions || 0);

    if (!annualIncome || annualIncome <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      // Old regime → send deductions
      // New regime → deductions = 0
      const payload = {
        annualIncome,
        deductions80C: formData.regime === 'old' ? deductions : 0,
        deductions80D: 0
      };

      const response = await salaryTaxAPI.calculateIncomeTax(payload);

      const apiResult = response.data;

      // Derived UI values
      const cess = apiResult.taxPayable * 0.04;
      const totalTax = apiResult.taxPayable + cess;

      setResult(apiResult);

      setDerived({
        cess,
        totalTax,
        netIncome: annualIncome - totalTax,
        effectiveRate: ((totalTax / annualIncome) * 100).toFixed(2)
      });

    } catch (err) {
      setResult(null);
      setError(
        err.response?.data?.message ||
        'Income tax calculation failed. Check backend.'
      );
    } finally {
      setLoading(false);
    }

  }, [formData]);

  // ================= AUTO CALCULATE =================
  useEffect(() => {
    const t = setTimeout(fetchIncomeTax, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchIncomeTax]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Income Tax Calculator</h1>
          <p className={styles.description}>
            Calculate your income tax instantly
          </p>
        </div>

        <div className={styles.content}>

          {/* LEFT FORM */}
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

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className={styles.label}>Tax Regime</label>
                  <select
                    name="regime"
                    value={formData.regime}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="new">New Regime</option>
                    <option value="old">Old Regime</option>
                  </select>
                </div>

                {formData.regime === 'old' && (
                  <Input
                    label="Deductions"
                    type="number"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleChange}
                    prefix="₹"
                  />
                )}

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
                    <div className={styles.emiLabel}>Total Tax Payable</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(derived.totalTax)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="Tax Breakdown">

                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Taxable Income</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.taxableIncome)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Income Tax</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.taxPayable)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Cess (4%)</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(derived.cess)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Net Income</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(derived.netIncome)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Effective Rate</div>
                      <div className={styles.summaryValue}>
                        {derived.effectiveRate}%
                      </div>
                    </div>

                  </div>

                  <LoanPieChart
                    principal={derived.netIncome}
                    interest={derived.totalTax}
                  />

                </Card>

                {/* EXPLANATION */}
                <Card>
                  <h3>Income Tax FY 2024-25</h3>

                  <p>
                    Tax is calculated based on selected regime and taxable income.
                  </p>

                  <h4>New Regime</h4>
                  <ul>
                    <li>Lower tax rates</li>
                    <li>Minimal deductions allowed</li>
                  </ul>

                  <h4>Old Regime</h4>
                  <ul>
                    <li>Higher tax rates</li>
                    <li>Allows deductions (80C, 80D etc)</li>
                  </ul>

                </Card>

              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>💼</div>
                    <p>Enter income to see tax breakdown</p>
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
