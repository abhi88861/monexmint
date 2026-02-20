// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { calculateGST } from '@/lib/calculators';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function GSTCalculator() {
//   const [formData, setFormData] = useState({
//     amount: '1000',
//     gstRate: '18',
//     isInclusive: 'false',
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
//       const amount = parseFloat(formData.amount);
//       const gstRate = parseFloat(formData.gstRate);
//       const isInclusive = formData.isInclusive === 'true';
//       const r = calculateGST(amount, gstRate, isInclusive);
//       setResult(r);
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
//           <h1 className={styles.title}>GST Calculator</h1>
//           <p className={styles.description}>Add or remove GST from amount</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="GST Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Amount" type="number" name="amount" value={formData.amount}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="GST Rate" type="number" name="gstRate" value={formData.gstRate}
//                   onChange={handleChange} suffix="%" required min="0" max="28" step="0.01"
//                   helpText="5%, 12%, 18%, 28%" />
//                 <div style={{ marginBottom: '1.5rem' }}>
//                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Amount is</label>
//                   <select name="isInclusive" value={formData.isInclusive} onChange={handleChange}
//                     style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem' }}>
//                     <option value="false">Exclusive of GST</option>
//                     <option value="true">Inclusive of GST</option>
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
//                     <div className={styles.emiLabel}>Total (with GST)</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.total)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Breakdown">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Base Amount</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.baseAmount)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>GST</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.gstAmount)}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>🧾</div><p>Enter amount</p></div></Card>
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

const DEBOUNCE_MS = 500;

export default function GSTCalculator() {

  const [formData, setFormData] = useState({
    amount: '1000',
    gstRate: '18'
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
  const fetchGst = useCallback(async () => {

    const amount = parseFloat(formData.amount);
    const gstRate = parseFloat(formData.gstRate);

    if (!amount || amount <= 0 || !gstRate || gstRate <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const res = await businessAPI.calculateGst({
        amount,
        gstRate
      });

      setResult(res.data);

    } catch (err) {

      setResult(null);
      setError(
        err.response?.data?.message ||
        'GST calculation failed'
      );

    } finally {
      setLoading(false);
    }

  }, [formData]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(fetchGst, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchGst]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>GST Calculator</h1>
          <p className={styles.description}>
            Add GST to base amount
          </p>
        </div>

        <div className={styles.content}>

          {/* FORM */}
          <div className={styles.formSection}>
            <Card title="GST Details">

              <div className={styles.form}>

                <Input
                  label="Amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="GST Rate"
                  type="number"
                  name="gstRate"
                  value={formData.gstRate}
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
                {/* TOTAL CARD */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Total Amount</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.totalAmount)}
                    </div>
                  </div>
                </Card>

                {/* BREAKDOWN */}
                <Card title="GST Breakdown">

                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>
                        GST Amount
                      </div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.gstAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>
                        Base Amount
                      </div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(
                          Number(formData.amount)
                        )}
                      </div>
                    </div>

                  </div>

                </Card>

              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>🧾</div>
                    <p>Enter amount to calculate GST</p>
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
