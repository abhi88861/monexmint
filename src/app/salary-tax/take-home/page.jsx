// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import { calculateIncomeTax } from '@/lib/calculators';
// import styles from '../../loans/emi/page.module.css';

// export default function TakeHomeCalculator() {
//   const [formData, setFormData] = useState({
//     monthlyGross: '100000',
//     regime: 'new',
//     pfPercent: '12',
//     deductions: '0',
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
//       const monthlyGross = parseFloat(formData.monthlyGross);
//       const pfPercent = parseFloat(formData.pfPercent) / 100;
//       const basic = monthlyGross * 0.4;
//       const pfEmployee = Math.min(basic * pfPercent, 1500);
//       const annualGross = monthlyGross * 12;
//       const annualPf = pfEmployee * 12;
//       const annualDeductions = formData.regime === 'old' ? parseFloat(formData.deductions) : 0;
//       const annualTaxable = annualGross - annualPf - annualDeductions;
//       const taxCalc = calculateIncomeTax(annualTaxable, formData.regime);
//       const monthlyTax = taxCalc.totalTax / 12;
//       const takeHome = monthlyGross - pfEmployee - monthlyTax;

//       setResult({
//         monthlyTakeHome: Math.round(takeHome * 100) / 100,
//         annualTax: taxCalc.totalTax,
//         pfDeduction: pfEmployee,
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
//           <h1 className={styles.title}>Take-Home Salary Calculator</h1>
//           <p className={styles.description}>Monthly take-home from gross salary</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Salary Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Monthly Gross Salary" type="number" name="monthlyGross"
//                   value={formData.monthlyGross} onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="PF %" type="number" name="pfPercent" value={formData.pfPercent}
//                   onChange={handleChange} suffix="%" min="0" max="12" />
//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Regime</label>
//                   <select name="regime" value={formData.regime} onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem' }}>
//                     <option value="new">New</option>
//                     <option value="old">Old</option>
//                   </select>
//                 </div>
//                 {formData.regime === 'old' && (
//                   <Input label="Annual Deductions" type="number" name="deductions" value={formData.deductions}
//                     onChange={handleChange} prefix="₹" min="0" />
//                 )}
//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Calculate</Button>
//               </form>
//             </Card>
//           </div>
//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Monthly Take-Home</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.monthlyTakeHome)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Deductions">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Annual Tax</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.annualTax)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>PF (monthly)</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.pfDeduction)}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>💰</div><p>Enter salary</p></div></Card>
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
// import { calculateIncomeTax } from '@/lib/calculators';
// import styles from '../../loans/emi/page.module.css';

// const DEBOUNCE_MS = 500;

// export default function TakeHomeCalculator() {

//   const [formData, setFormData] = useState({
//     monthlyGross: '100000',
//     regime: 'new',
//     pfPercent: '12',
//     deductions: '0',
//   });

//   const [result, setResult] = useState(null);
//   const [extraData, setExtraData] = useState(null); // for chart + summary
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const fetchTakeHome = useCallback(async () => {

//     const monthlyGross = parseFloat(formData.monthlyGross);
//     const pfPercent = parseFloat(formData.pfPercent) / 100;

//     if (!monthlyGross || monthlyGross <= 0) {
//       setResult(null);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {

//       // PF Calculation
//       const basic = monthlyGross * 0.4;
//       const pfEmployee = Math.min(basic * pfPercent, 1800);

//       // Tax Calculation (Frontend helper)
//       const annualGross = monthlyGross * 12;
//       const annualPf = pfEmployee * 12;
//       const annualDeductions =
//         formData.regime === 'old'
//           ? parseFloat(formData.deductions || 0)
//           : 0;

//       const taxable = annualGross - annualPf - annualDeductions;

//       const taxCalc = calculateIncomeTax(taxable, formData.regime);
//       const monthlyTax = taxCalc.totalTax / 12;

//       // Backend Call
//       const response = await salaryTaxAPI.calculateTakeHome({
//         grossSalary: monthlyGross,
//         totalDeductions: pfEmployee,
//         tax: monthlyTax
//       });

//       setResult(response.data);

//       setExtraData({
//         pfEmployee,
//         monthlyTax,
//         annualTax: taxCalc.totalTax
//       });

//     } catch (err) {
//       setResult(null);
//       setError(
//         err.response?.data?.message ||
//         'Take home calculation failed. Check backend.'
//       );
//     } finally {
//       setLoading(false);
//     }

//   }, [formData]);

//   useEffect(() => {
//     const t = setTimeout(fetchTakeHome, DEBOUNCE_MS);
//     return () => clearTimeout(t);
//   }, [fetchTakeHome]);

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>

//         {/* HEADER */}
//         <div className={styles.header}>
//           <h1 className={styles.title}>Take-Home Salary Calculator</h1>
//           <p className={styles.description}>
//             Calculate monthly take-home salary after PF and tax deductions
//           </p>
//         </div>

//         <div className={styles.content}>

//           {/* LEFT FORM */}
//           <div className={styles.formSection}>
//             <Card title="Salary Details">

//               <div className={styles.form}>

//                 <Input
//                   label="Monthly Gross Salary"
//                   type="number"
//                   name="monthlyGross"
//                   value={formData.monthlyGross}
//                   onChange={handleChange}
//                   prefix="₹"
//                   min="1"
//                 />

//                 <Input
//                   label="PF Percentage"
//                   type="number"
//                   name="pfPercent"
//                   value={formData.pfPercent}
//                   onChange={handleChange}
//                   suffix="%"
//                   min="0"
//                   max="12"
//                 />

//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ fontWeight: 600 }}>Tax Regime</label>
//                   <select
//                     name="regime"
//                     value={formData.regime}
//                     onChange={handleChange}
//                     style={{
//                       width: '100%',
//                       padding: '0.875rem',
//                       borderRadius: '0.75rem',
//                       border: '2px solid #e2e8f0'
//                     }}
//                   >
//                     <option value="new">New Regime</option>
//                     <option value="old">Old Regime</option>
//                   </select>
//                 </div>

//                 {formData.regime === 'old' && (
//                   <Input
//                     label="Annual Deductions"
//                     type="number"
//                     name="deductions"
//                     value={formData.deductions}
//                     onChange={handleChange}
//                     prefix="₹"
//                   />
//                 )}

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
//                 {/* TAKE HOME CARD */}
//                 <Card variant="gradient" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Monthly Take Home</div>
//                     <div className={styles.emiValue}>
//                       {formatCurrency(result.takeHomeSalary)}
//                     </div>
//                   </div>
//                 </Card>

//                 {/* SUMMARY */}
//                 <Card title="Salary Breakdown">

//                   <div className={styles.summaryGrid}>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Gross Salary</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(Number(formData.monthlyGross))}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>PF Deduction</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(extraData.pfEmployee)}
//                       </div>
//                     </div>

//                     <div className={styles.summaryItem}>
//                       <div className={styles.summaryLabel}>Tax Deduction</div>
//                       <div className={styles.summaryValue}>
//                         {formatCurrency(extraData.monthlyTax)}
//                       </div>
//                     </div>

//                   </div>

//                   <LoanPieChart
//                     principal={result.takeHomeSalary}
//                     interest={extraData.pfEmployee + extraData.monthlyTax}
//                   />

//                 </Card>

//                 {/* INFO */}
//                 <Card className={styles.infoCard}>
//                   <h3>About Take Home Salary</h3>
//                   <p>
//                     Take-home salary is the actual salary credited after PF,
//                     income tax, and other deductions.
//                   </p>

//                   <h4>Major Deductions</h4>
//                   <ul>
//                     <li>Provident Fund (PF)</li>
//                     <li>Professional Tax</li>
//                     <li>Income Tax / TDS</li>
//                     <li>Insurance / Other Deductions</li>
//                   </ul>
//                 </Card>

//               </>
//             ) : (
//               !loading && !error && (
//                 <Card>
//                   <div className={styles.placeholder}>
//                     <div className={styles.placeholderIcon}>💰</div>
//                     <p>Enter salary details to calculate take-home</p>
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

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const DEBOUNCE_MS = 500;

const COLORS = ['#14b8a6', '#f59e0b'];

export default function TdsCalculator() {

  const [formData, setFormData] = useState({
    annualTax: '100000'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // API Call
  const fetchTds = useCallback(async () => {

    const annualTax = parseFloat(formData.annualTax);

    if (!annualTax || annualTax <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const res = await salaryTaxAPI.calculateTds({
        annualTax
      });

      setResult(res.data);

    } catch (err) {

      console.error(err);

      setResult(null);
      setError(
        err.response?.data?.message ||
        'TDS calculation failed'
      );

    } finally {
      setLoading(false);
    }

  }, [formData]);

  // Debounce API
  useEffect(() => {
    const t = setTimeout(fetchTds, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchTds]);

  // Chart Data
  const chartData = result ? [
    { name: 'Annual TDS', value: result.annualTds },
    { name: 'Monthly TDS (x12)', value: result.monthlyTds * 12 }
  ] : [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>TDS Calculator</h1>
          <p className={styles.description}>
            Estimate Tax Deducted at Source (TDS)
          </p>
        </div>

        <div className={styles.content}>

          {/* FORM */}
          <div className={styles.formSection}>
            <Card title="TDS Details">

              <div className={styles.form}>

                <Input
                  label="Annual Tax"
                  type="number"
                  name="annualTax"
                  value={formData.annualTax}
                  onChange={handleChange}
                  prefix="₹"
                />

                {loading && <div>Calculating...</div>}
                {error && (
                  <div style={{ color: 'red' }}>{error}</div>
                )}

              </div>

            </Card>
          </div>

          {/* RESULT */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && (
              <>

                {/* Annual TDS Card */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Annual TDS</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.annualTds)}
                    </div>
                  </div>
                </Card>

                {/* Summary */}
                <Card title="TDS Summary">

                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>
                        Monthly TDS
                      </div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.monthlyTds)}
                      </div>
                    </div>

                  </div>

                </Card>

                {/* Chart */}
                <Card title="TDS Distribution">

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <PieChart width={320} height={260}>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        label
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                      />

                      <Legend />
                    </PieChart>
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
