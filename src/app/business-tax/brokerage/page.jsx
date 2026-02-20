// 'use client';
// import React, { useState } from 'react';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { formatCurrency } from '@/lib/constants';
// import styles from '../../loans/emi/page.module.css';

// export default function BrokerageCalculator() {
//   const [formData, setFormData] = useState({
//     tradeValue: '100000',
//     brokeragePercent: '0.05',
//     sttPercent: '0.1',
//     exchangeTxn: '0.00325',
//     gstPercent: '18',
//     stampDuty: '0.003',
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
//       const value = parseFloat(formData.tradeValue);
//       const brokerage = value * (parseFloat(formData.brokeragePercent) / 100);
//       const stt = value * (parseFloat(formData.sttPercent) / 100);
//       const exchange = value * (parseFloat(formData.exchangeTxn) / 100);
//       const gst = (brokerage + exchange) * (parseFloat(formData.gstPercent) / 100);
//       const stamp = value * (parseFloat(formData.stampDuty) / 100);
//       const total = brokerage + stt + exchange + gst + stamp;

//       setResult({
//         tradeValue: value,
//         brokerage: Math.round(brokerage * 100) / 100,
//         stt: Math.round(stt * 100) / 100,
//         exchange: Math.round(exchange * 100) / 100,
//         gst: Math.round(gst * 100) / 100,
//         stampDuty: Math.round(stamp * 100) / 100,
//         totalCharges: Math.round(total * 100) / 100,
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
//           <h1 className={styles.title}>Brokerage Calculator</h1>
//           <p className={styles.description}>Calculate trading charges (Equity/Intraday)</p>
//         </div>
//         <div className={styles.content}>
//           <div className={styles.formSection}>
//             <Card title="Trade Details">
//               <form onSubmit={handleCalculate} className={styles.form}>
//                 <Input label="Trade Value" type="number" name="tradeValue" value={formData.tradeValue}
//                   onChange={handleChange} prefix="₹" required min="0" />
//                 <Input label="Brokerage %" type="number" name="brokeragePercent" value={formData.brokeragePercent}
//                   onChange={handleChange} suffix="%" min="0" step="0.01" helpText="e.g. 0.05% for Zerodha" />
//                 <Input label="STT %" type="number" name="sttPercent" value={formData.sttPercent}
//                   onChange={handleChange} suffix="%" min="0" step="0.01" helpText="0.1% on buy for delivery" />
//                 <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Calculate</Button>
//               </form>
//             </Card>
//           </div>
//           <div className={styles.resultsSection}>
//             {result ? (
//               <>
//                 <Card variant="gradient" className={styles.emiCard}>
//                   <div className={styles.emiResult}>
//                     <div className={styles.emiLabel}>Total Charges</div>
//                     <div className={styles.emiValue}>{formatCurrency(result.totalCharges)}</div>
//                   </div>
//                 </Card>
//                 <Card title="Breakdown">
//                   <div className={styles.summaryGrid}>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Brokerage</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.brokerage)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>STT</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.stt)}</div></div>
//                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Exchange</div>
//                       <div className={styles.summaryValue}>{formatCurrency(result.exchange)}</div></div>
//                   </div>
//                 </Card>
//               </>
//             ) : (
//               <Card><div className={styles.placeholder}><div className={styles.placeholderIcon}>📈</div><p>Enter trade value</p></div></Card>
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

export default function BrokerageCalculator() {

  const [formData, setFormData] = useState({
    buyPrice: '100',
    sellPrice: '120',
    quantity: '100',
    brokeragePercent: '0.3'
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
  const fetchBrokerage = useCallback(async () => {

    const buyPrice = parseFloat(formData.buyPrice);
    const sellPrice = parseFloat(formData.sellPrice);
    const quantity = parseFloat(formData.quantity);
    const brokeragePercent = parseFloat(formData.brokeragePercent);

    if (!buyPrice || !sellPrice || !quantity) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const res = await businessAPI.calculateBrokerage({
        buyPrice,
        sellPrice,
        quantity,
        brokeragePercent
      });

      setResult(res.data);

    } catch (err) {

      setResult(null);
      setError(
        err.response?.data?.message ||
        'Brokerage calculation failed'
      );

    } finally {
      setLoading(false);
    }

  }, [formData]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(fetchBrokerage, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchBrokerage]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Brokerage Calculator</h1>
          <p className={styles.description}>
            Calculate brokerage and net profit/loss
          </p>
        </div>

        <div className={styles.content}>

          {/* FORM */}
          <div className={styles.formSection}>
            <Card title="Trade Details">

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
                  label="Brokerage %"
                  type="number"
                  name="brokeragePercent"
                  value={formData.brokeragePercent}
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
                {/* NET PROFIT CARD */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>
                      Net Profit / Loss
                    </div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.netProfit)}
                    </div>
                  </div>
                </Card>

                {/* SUMMARY */}
                <Card title="Trade Summary">

                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>
                        Turnover
                      </div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.turnover)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>
                        Brokerage
                      </div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.brokerageAmount)}
                      </div>
                    </div>

                  </div>

                </Card>

              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>📊</div>
                    <p>Enter trade details</p>
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
