// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function CapitalGainsCalculator() {
//   const [formData, setFormData] = useState({
//     purchasePrice: '100',
//     salePrice: '150',
//     quantity: '100',
//     stcgPercent: '15',
//     ltcgExempt: '100000',
//     ltcgPercent: '10',
//     holdingPeriod: '365',
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
//       const purchasePrice = parseFloat(formData.purchasePrice);
//       const salePrice = parseFloat(formData.salePrice);
//       const quantity = parseFloat(formData.quantity);
//       const holdingDays = parseInt(formData.holdingPeriod);

//       const totalGain = (salePrice - purchasePrice) * quantity;
//       const isLTCG = holdingDays >= 365;

//       let tax = 0;
//       if (isLTCG) {
//         const exempt = parseFloat(formData.ltcgExempt) || 100000;
//         const taxable = Math.max(0, totalGain - exempt);
//         tax = taxable * (parseFloat(formData.ltcgPercent) / 100);
//       } else {
//         tax = totalGain * (parseFloat(formData.stcgPercent) / 100);
//       }

//       setResult({
//         totalGain: Math.round(totalGain * 100) / 100,
//         tax: Math.round(tax * 100) / 100,
//         netGain: Math.round((totalGain - tax) * 100) / 100,
//         type: isLTCG ? 'Long Term' : 'Short Term',
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
//           <h1 className={styles.title}>Capital Gains Tax Calculator</h1>
//           <p className={styles.description}>Equity / Mutual Fund capital gains tax</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Transaction Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Purchase Price" type="number" name="purchasePrice" value={formData.purchasePrice}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="Sale Price" type="number" name="salePrice" value={formData.salePrice}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="Quantity" type="number" name="quantity" value={formData.quantity}
//                   onChange={handleChange} required min="1" />
//                 <Input label="Holding Period (days)" type="number" name="holdingPeriod" value={formData.holdingPeriod}
//                   onChange={handleChange} required min="1" helpText="&gt;=365 for LTCG" />
//                 <Input label="STCG Tax %" type="number" name="stcgPercent" value={formData.stcgPercent}
//                   onChange={handleChange} suffix="%" helpText="15% for equity" />
//                 <Input label="LTCG Exempt (₹)" type="number" name="ltcgExempt" value={formData.ltcgExempt}
//                   onChange={handleChange} prefix="₹" helpText="₹1L exempt per FY" />
//                 <Input label="LTCG Tax %" type="number" name="ltcgPercent" value={formData.ltcgPercent}
//                   onChange={handleChange} suffix="%" />
//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Calculate</Button>
//               </form>
//             </Card>
//           </div>
//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="success" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Tax Payable</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.tax)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Summary">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Capital Gain</div>
//                       <div className={styles.summaryValue} style={{ color: '#10b981' }}>{formatCurrency(result.totalGain)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Net Gain</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.netGain)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Type</div>
//                       <div className={styles.summaryValue}>{result.type}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>📊</div><p>Enter transaction</p></div></Card>
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

const COLORS = ['#14b8a6', '#ef4444', '#6366f1'];

export default function CapitalGainsCalculator() {

  const [formData, setFormData] = useState({
    buyPrice: '100',
    sellPrice: '150',
    quantity: '100',
    holdingPeriodMonths: '12'
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
  const fetchCapitalGains = useCallback(async () => {

    const buyPrice = parseFloat(formData.buyPrice);
    const sellPrice = parseFloat(formData.sellPrice);
    const quantity = parseFloat(formData.quantity);
    const holdingPeriodMonths = parseInt(formData.holdingPeriodMonths);

    if (!buyPrice || !sellPrice || !quantity) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const res = await businessAPI.calculateCapitalGains({
        buyPrice,
        sellPrice,
        quantity,
        holdingPeriodMonths
      });

      setResult(res.data);

    } catch (err) {

      setResult(null);
      setError(
        err.response?.data?.message ||
        'Capital gain calculation failed'
      );

    } finally {
      setLoading(false);
    }

  }, [formData]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(fetchCapitalGains, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchCapitalGains]);

  // Chart Data
  const chartData = result ? [
    { name: 'Net Profit', value: result.netProfit },
    { name: 'Tax', value: result.taxAmount },
    { name: 'Investment', value: result.investmentValue }
  ] : [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Capital Gains Calculator</h1>
          <p className={styles.description}>
            Calculate STCG / LTCG tax and profit
          </p>
        </div>

        <div className={styles.content}>

          {/* FORM */}
          <div className={styles.formSection}>
            <Card title="Investment Details">

              <div className={styles.form}>

                <Input
                  label="Buy Price"
                  type="number"
                  name="buyPrice"
                  value={formData.buyPrice}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="Sell Price"
                  type="number"
                  name="sellPrice"
                  value={formData.sellPrice}
                  onChange={handleChange}
                  prefix="₹"
                />

                <Input
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />

                <Input
                  label="Holding Period"
                  type="number"
                  name="holdingPeriodMonths"
                  value={formData.holdingPeriodMonths}
                  onChange={handleChange}
                  suffix="months"
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
                {/* NET PROFIT CARD */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>
                      Net Profit ({result.gainType})
                    </div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.netProfit)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="Capital Gains Summary">

                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Investment</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.investmentValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Sale Value</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.saleValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Capital Gain</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.capitalGain)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tax</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.taxAmount)}
                      </div>
                    </div>

                  </div>

                </Card>

                {/* CHART */}
                <Card title="Gain Distribution">

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
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>📈</div>
                    <p>Enter investment details</p>
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
