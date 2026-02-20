// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// // State-wise monthly professional tax (approx)
// const STATE_TAX = {
//   Maharashtra: { max: 250, min: 0 },
//   Karnataka: { max: 200, min: 0 },
//   WestBengal: { max: 250, min: 0 },
//   TamilNadu: { max: 250, min: 0 },
//   Gujarat: { max: 200, min: 0 },
//   AndhraPradesh: { max: 200, min: 0 },
//   Telangana: { max: 200, min: 0 },
//   MadhyaPradesh: { max: 200, min: 0 },
//   Odisha: { max: 200, min: 0 },
// };

// export default function ProfessionalTaxCalculator() {
//   const [formData, setFormData] = useState({
//     monthlySalary: '50000',
//     state: 'Maharashtra',
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
//       const salary = parseFloat(formData.monthlySalary);
//       const stateConfig = STATE_TAX[formData.state] || { max: 200, min: 0 };
//       let tax = 0;
//       if (salary > 15000) tax = stateConfig.max;
//       else if (salary > 10000) tax = Math.min(150, stateConfig.max);
//       else if (salary > 7500) tax = Math.min(100, stateConfig.max);
//       const annual = tax * 12;

//       setResult({
//         monthlyTax: tax,
//         annualTax: annual,
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
//           <h1 className={styles.title}>Professional Tax Calculator</h1>
//           <p className={styles.description}>State-wise professional tax (approximate)</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Salary Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Monthly Gross Salary" type="number" name="monthlySalary"
//                   value={formData.monthlySalary} onChange={handleChange} prefix="₹" required min="0" />
//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>State</label>
//                   <select name="state" value={formData.state} onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem' }}>
//                     {Object.keys(STATE_TAX).map(s => (
//                       <option key={s} value={s}>{s.replace(/([A-Z])/g, ' $1').trim()}</option>
//                     ))}
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
//                     <div className={styles.emiLabel}>Monthly Professional Tax</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.monthlyTax)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Annual</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.annualTax)}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>🏛️</div><p>Enter salary</p></div></Card>
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
import { businessAPI } from '@/lib/apiClient';
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

const COLORS = ['#14b8a6', '#6366f1'];

export default function ProfessionalTaxCalculator() {

  const [formData, setFormData] = useState({
    monthlySalary: '30000'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // API Call
  const fetchProfessionalTax = useCallback(async () => {

    const monthlySalary = parseFloat(formData.monthlySalary);

    if (!monthlySalary || monthlySalary <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const res = await businessAPI.calculateProfessionalTax({
        monthlySalary
      });

      setResult(res.data);

    } catch (err) {

      setResult(null);
      setError(
        err.response?.data?.message ||
        'Professional tax calculation failed'
      );

    } finally {
      setLoading(false);
    }

  }, [formData]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(fetchProfessionalTax, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchProfessionalTax]);

  // Chart Data
  const chartData = result ? [
    { name: 'Monthly Tax', value: result.monthlyTax },
    { name: 'Remaining Salary', value: Number(formData.monthlySalary) - result.monthlyTax }
  ] : [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Professional Tax Calculator</h1>
          <p className={styles.description}>
            Calculate monthly and yearly professional tax
          </p>
        </div>

        <div className={styles.content}>

          {/* FORM */}
          <div className={styles.formSection}>
            <Card title="Salary Details">

              <div className={styles.form}>

                <Input
                  label="Monthly Salary"
                  type="number"
                  name="monthlySalary"
                  value={formData.monthlySalary}
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

            {result ? (
              <>
                {/* MONTHLY TAX CARD */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Monthly Professional Tax</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.monthlyTax)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="Professional Tax Summary">

                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Annual Tax</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.annualTax)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Remaining Salary</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(
                          Number(formData.monthlySalary) - result.monthlyTax
                        )}
                      </div>
                    </div>

                  </div>

                </Card>

                {/* CHART */}
                <Card title="Salary Distribution">

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

                      <Tooltip formatter={(v) => formatCurrency(v)} />
                      <Legend />

                    </PieChart>
                  </div>

                </Card>

              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>💼</div>
                    <p>Enter salary to calculate tax</p>
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
