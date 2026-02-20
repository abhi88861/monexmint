// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import { calculateIncomeTax } from '@/lib/calculators';
// import styles from '../../loans/emi/page.module.css';

// export default function SalaryCalculator() {
//   const [formData, setFormData] = useState({
//     ctc: '1200000',
//     basicPercent: '40',
//     hraPercent: '50',
//     specialAllowance: '0',
//     pfEmployer: '12',
//     pfEmployee: '12',
//     gratuity: '4.81',
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
//       const ctc = parseFloat(formData.ctc);
//       const basic = ctc * (parseFloat(formData.basicPercent) / 100);
//       const hra = basic * (parseFloat(formData.hraPercent) / 100);
//       const specialAllowance = parseFloat(formData.specialAllowance) || 0;
//       const grossSalary = basic + hra + specialAllowance;
//       const pfEmployee = Math.min(basic * (parseFloat(formData.pfEmployee) / 100), 1800 * 12);
//       const pfEmployer = Math.min(basic * (parseFloat(formData.pfEmployer) / 100), 1800 * 12);
//       const gratuity = basic * (parseFloat(formData.gratuity) / 100);
//       const annualGross = grossSalary * 12;
//       const annualPfEmployee = pfEmployee * 12;
//       const annualTaxable = annualGross - annualPfEmployee;
//       const taxCalc = calculateIncomeTax(annualTaxable, 'new');
//       const monthlyTax = taxCalc.totalTax / 12;
//       const monthlyTakeHome = grossSalary - pfEmployee - monthlyTax;

//       setResult({
//         ctc, basic, hra, specialAllowance, grossSalary, pfEmployee, pfEmployer, gratuity,
//         annualGross, annualTaxable, totalTax: taxCalc.totalTax,
//         monthlyTakeHome: Math.round(monthlyTakeHome * 100) / 100,
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
//           <h1 className={styles.title}>Salary Calculator (CTC → In-Hand)</h1>
//           <p className={styles.description}>Calculate take-home salary from CTC</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="CTC Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Annual CTC" type="number" name="ctc" value={formData.ctc}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="Basic % of CTC" type="number" name="basicPercent" value={formData.basicPercent}
//                   onChange={handleChange} suffix="%" min="30" max="60" helpText="Typically 40-50%" />
//                 <Input label="HRA % of Basic" type="number" name="hraPercent" value={formData.hraPercent}
//                   onChange={handleChange} suffix="%" min="0" max="100" helpText="50% metro, 40% non-metro" />
//                 <Input label="Special Allowance (monthly)" type="number" name="specialAllowance" value={formData.specialAllowance}
//                   onChange={handleChange} prefix="₹" min="0" />
//                 <Input label="PF Employee %" type="number" name="pfEmployee" value={formData.pfEmployee}
//                   onChange={handleChange} suffix="%" helpText="Typically 12%" />
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
//                 <Card title="Breakdown">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>CTC</div><div className={styles.summaryValue}>{formatCurrency(result.ctc)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Annual Tax</div><div className={styles.summaryValue}>{formatCurrency(result.totalTax)}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>💼</div><p>Enter CTC to calculate</p></div></Card>
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

export default function SalaryCalculator() {

  const [formData, setFormData] = useState({
    ctc: '1200000',
    basicPercent: '40',
    hraPercent: '50',
    specialAllowance: '0',
    pfEmployee: '12'
  });

  const [result, setResult] = useState(null);
  const [derived, setDerived] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================= Input =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ================= API =================
  const fetchSalary = useCallback(async () => {

    const ctc = parseFloat(formData.ctc);
    const basicPercent = parseFloat(formData.basicPercent);
    const hraPercent = parseFloat(formData.hraPercent);
    const specialAllowance = parseFloat(formData.specialAllowance || 0);
    const pfEmployeePercent = parseFloat(formData.pfEmployee);

    if (!ctc || ctc <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      // ===== Convert UI → Backend Payload =====
      const basic = ctc * (basicPercent / 100);
      const hra = basic * (hraPercent / 100);
      const pfEmployee = basic * (pfEmployeePercent / 100);

      const grossSalary = basic + hra + specialAllowance;

      // Backend expects annual deductions
      const annualPfEmployee = pfEmployee * 12;

      const payload = {
        basicSalary: basic,
        hra: hra,
        otherAllowances: specialAllowance,
        deductions: annualPfEmployee / 12
      };

      const response = await salaryTaxAPI.calculateSalary(payload);

      setResult(response.data);

      setDerived({
        grossSalary,
        pfEmployee,
        monthlyTakeHome:
          response.data.netSalary
      });

    } catch (err) {
      setResult(null);
      setError(
        err.response?.data?.message ||
        'Salary calculation failed. Check backend.'
      );
    } finally {
      setLoading(false);
    }

  }, [formData]);

  // ================= Debounce =================
  useEffect(() => {
    const t = setTimeout(fetchSalary, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchSalary]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Salary Calculator (CTC → In-Hand)</h1>
          <p className={styles.description}>
            Calculate take-home salary from CTC instantly
          </p>
        </div>

        <div className={styles.content}>

          {/* LEFT FORM */}
          <div className={styles.formSection}>
            <Card title="CTC Details">

              <div className={styles.form}>

                <Input
                  label="Annual CTC"
                  type="number"
                  name="ctc"
                  value={formData.ctc}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="Basic % of CTC"
                  type="number"
                  name="basicPercent"
                  value={formData.basicPercent}
                  onChange={handleChange}
                  suffix="%"
                />

                <Input
                  label="HRA % of Basic"
                  type="number"
                  name="hraPercent"
                  value={formData.hraPercent}
                  onChange={handleChange}
                  suffix="%"
                />

                <Input
                  label="Special Allowance (Monthly)"
                  type="number"
                  name="specialAllowance"
                  value={formData.specialAllowance}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="PF Employee %"
                  type="number"
                  name="pfEmployee"
                  value={formData.pfEmployee}
                  onChange={handleChange}
                  suffix="%"
                />

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
                    <div className={styles.emiLabel}>Monthly Take Home</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(derived.monthlyTakeHome)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="Salary Summary">

                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Gross Salary</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.grossSalary)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Net Salary</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.netSalary)}
                      </div>
                    </div>

                  </div>

                  <LoanPieChart
                    principal={result.netSalary}
                    interest={result.grossSalary - result.netSalary}
                  />

                </Card>

                {/* EXPLANATION */}
                <Card>
                  <h3>About Salary Breakdown</h3>
                  <p>
                    Your take-home salary depends on PF deductions,
                    tax deductions, and salary structure.
                  </p>

                  <h4>Key Components</h4>
                  <ul>
                    <li>Basic Salary — Core pay component</li>
                    <li>HRA — House Rent Allowance</li>
                    <li>PF — Retirement savings</li>
                    <li>Special Allowance — Flexible salary portion</li>
                  </ul>

                </Card>

              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>💼</div>
                    <p>Enter CTC to see salary breakdown</p>
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
