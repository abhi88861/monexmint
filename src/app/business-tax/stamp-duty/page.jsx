// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// const STATE_RATES = { Maharashtra: 5, Karnataka: 5, Delhi: 6, TamilNadu: 7, Gujarat: 4.9, Default: 5 };

// export default function StampDutyCalculator() {
//   const [formData, setFormData] = useState({
//     propertyValue: '5000000',
//     state: 'Maharashtra',
//     customRate: '5',
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
//       const value = parseFloat(formData.propertyValue);
//       const rate = formData.state === 'Custom' ? parseFloat(formData.customRate) : (STATE_RATES[formData.state] ?? STATE_RATES.Default);
//       const stampDuty = value * (rate / 100);
//       const registration = Math.min(value * 0.01, 30000);
//       const total = stampDuty + registration;

//       setResult({
//         propertyValue: value,
//         stampDuty: Math.round(stampDuty * 100) / 100,
//         registration: Math.round(registration * 100) / 100,
//         total: Math.round(total * 100) / 100,
//         rate,
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
//           <h1 className={styles.title}>Stamp Duty Calculator</h1>
//           <p className={styles.description}>Property registration charges (state-wise)</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Property Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Property Value" type="number" name="propertyValue" value={formData.propertyValue}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>State</label>
//                   <select name="state" value={formData.state} onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem' }}>
//                     {Object.keys(STATE_RATES).filter(k => k !== 'Default').map(s => (
//                       <option key={s} value={s}>{s}</option>
//                     ))}
//                     <option value="Custom">Custom Rate</option>
//                   </select>
//                 </div>
//                 {formData.state === 'Custom' && (
//                   <Input label="Stamp Duty %" type="number" name="customRate" value={formData.customRate}
//                     onChange={handleChange} suffix="%" min="0" max="15" step="0.1" />
//                 )}
//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Calculate</Button>
//               </form>
//             </Card>
//           </div>
//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="gradient" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Total Stamp + Registration</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.total)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Breakdown">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Stamp Duty</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.stampDuty)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Registration</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.registration)}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>📜</div><p>Enter property value</p></div></Card>
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

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b'];

export default function StampDutyCalculator() {

  const [formData, setFormData] = useState({
    propertyValue: '5000000',
    stampDutyPercent: '6',
    registrationPercent: '1'
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
  const fetchStampDuty = useCallback(async () => {

    const propertyValue = parseFloat(formData.propertyValue);
    const stampDutyPercent = parseFloat(formData.stampDutyPercent);
    const registrationPercent = parseFloat(formData.registrationPercent);

    if (!propertyValue || propertyValue <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const res = await businessAPI.calculateStampDuty({
        propertyValue,
        stampDutyPercent,
        registrationPercent
      });

      setResult(res.data);

    } catch (err) {

      setResult(null);
      setError(
        err.response?.data?.message ||
        'Stamp duty calculation failed'
      );

    } finally {
      setLoading(false);
    }

  }, [formData]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(fetchStampDuty, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchStampDuty]);

  // Chart Data
  const chartData = result ? [
    { name: 'Property Value', value: Number(formData.propertyValue) },
    { name: 'Stamp Duty', value: result.stampDutyAmount },
    { name: 'Registration', value: result.registrationAmount }
  ] : [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Stamp Duty Calculator</h1>
          <p className={styles.description}>
            Calculate property stamp duty and registration charges
          </p>
        </div>

        <div className={styles.content}>

          {/* FORM */}
          <div className={styles.formSection}>
            <Card title="Property Details">

              <div className={styles.form}>

                <Input
                  label="Property Value"
                  type="number"
                  name="propertyValue"
                  value={formData.propertyValue}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="Stamp Duty %"
                  type="number"
                  name="stampDutyPercent"
                  value={formData.stampDutyPercent}
                  onChange={handleChange}
                  suffix="%"
                />

                <Input
                  label="Registration %"
                  type="number"
                  name="registrationPercent"
                  value={formData.registrationPercent}
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

            {result ? (
              <>
                {/* TOTAL COST CARD */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Total Cost</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.totalCost)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="Stamp Duty Breakdown">

                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Stamp Duty</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.stampDutyAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Registration</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.registrationAmount)}
                      </div>
                    </div>

                  </div>

                </Card>

                {/* CHART */}
                <Card title="Cost Distribution">

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
                    <div className={styles.placeholderIcon}>🏠</div>
                    <p>Enter property details</p>
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
