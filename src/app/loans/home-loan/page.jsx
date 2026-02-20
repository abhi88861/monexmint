// // // 'use client';
// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import Input from '@/components/ui/Input';
// // // import Card from '@/components/ui/Card';
// // // import LoanPieChart from '@/components/charts/LoanPieChart';
// // // import AdSlot from '@/components/ads/AdSlot';
// // // import { loanAPI } from '@/lib/apiClient';
// // // import { formatCurrency } from '@/lib/constants';
// // // import styles from '../emi/page.module.css';

// // // const DEBOUNCE_MS = 500;

// // // export default function HomeLoanCalculator() {
// // //   const [formData, setFormData] = useState({
// // //     loanAmount: '5000000',
// // //     rateOfInterest: '8.5',
// // //     tenureMonths: '240',
// // //   });
// // //   const [result, setResult] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState(null);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData(prev => ({ ...prev, [name]: value }));
// // //   };

// // //   // const fetchResult = useCallback(async () => {
// // //   //   const principal = parseFloat(formData.loanAmount);
// // //   //   const rate = parseFloat(formData.rateOfInterest);
// // //   //   const tenure = parseInt(formData.tenureMonths, 10);
// // //   //   if (!principal || principal < 1000 || !rate || tenure < 1) {
// // //   //     setResult(null);
// // //   //     return;
// // //   //   }
// // //   //   setLoading(true);
// // //   //   setError(null);
// // //   //   try {
// // //   //     const res = await loanAPI.calculateHomeLoan({ loanAmount: principal, rateOfInterest: rate, tenureMonths: tenure });
// // //   //     setResult(res.data);
// // //   //   } catch (err) {
// // //   //     setResult(null);
// // //   //     setError(err.response?.data?.message || 'Calculation failed. Ensure backend is running.');
// // //   //   } finally {
// // //   //     setLoading(false);
// // //   //   }
// // //   // }, [formData.loanAmount, formData.rateOfInterest, formData.tenureMonths]);
// // //   const fetchResult = useCallback(async () => {
// // //   const principal = parseFloat(formData.loanAmount);
// // //   const rate = parseFloat(formData.rateOfInterest);
// // //   const tenure = parseInt(formData.tenureMonths, 10);

// // //   if (!principal || principal < 1000 || !rate || tenure < 1) {
// // //     setResult(null);
// // //     return;
// // //   }

// // //   setLoading(true);
// // //   setError(null);

// // //   try {

// // //     const res = await loanAPI.calculateHomeLoan({
// // //       principal: principal,
// // //       annualRate: rate,
// // //       tenureMonths: tenure
// // //     });

// // //     setResult(res.data);

// // //   } catch (err) {
// // //     setResult(null);
// // //     setError(err.response?.data?.message || 'Calculation failed.');
// // //   } finally {
// // //     setLoading(false);
// // //   }

// // // }, [formData.loanAmount, formData.rateOfInterest, formData.tenureMonths]);


// // //   useEffect(() => {
// // //     const t = setTimeout(fetchResult, DEBOUNCE_MS);
// // //     return () => clearTimeout(t);
// // //   }, [fetchResult]);

// // //   const tenureYears = Math.floor(Number(formData.tenureMonths) / 12);

// // //   return (
// // //     <div className={styles.page}>
// // //       <div className={styles.container}>
// // //         <div className={styles.header}>
// // //           <h1 className={styles.title}>Home Loan Calculator</h1>
// // //           <p className={styles.description}>Calculate your home loan EMI and plan your dream home purchase</p>
// // //         </div>
// // //         <div className={styles.content}>
// // //           <div className={styles.formSection}>
// // //             <Card title="Loan Details">
// // //               <div className={styles.form}>
// // //                 <Input label="Loan Amount" type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} prefix="₹" min="1000" step="10000" />
// // //                 <Input label="Interest Rate (p.a.)" type="number" name="rateOfInterest" value={formData.rateOfInterest} onChange={handleChange} suffix="%" min="0.1" max="30" step="0.1" />
// // //                 <Input label="Tenure" type="number" name="tenureMonths" value={formData.tenureMonths} onChange={handleChange} suffix="months" min="12" max="360" step="12" helpText={`${tenureYears} years`} />
// // //                 {error && <div className={styles.error}>{error}</div>}
// // //                 {loading && <div className={styles.loading}>Calculating…</div>}
// // //               </div>
// // //             </Card>
// // //           </div>
// // //           <div className={styles.resultsSection}>
// // //             <AdSlot format="rectangle" />
// // //             {result ? (
// // //               <>
// // //                 <Card variant="gradient" className={styles.emiCard}>
// // //                   <div className={styles.emiResult}>
// // //                     <div className={styles.emiLabel}>Monthly EMI</div>
// // //                     <div className={styles.emiValue}>{formatCurrency(result.emi)}</div>
// // //                   </div>
// // //                 </Card>
// // //                 <Card title="Summary">
// // //                   <div className={styles.summaryGrid}>
// // //                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Principal</div><div className={styles.summaryValue}>{formatCurrency(result.principal)}</div></div>
// // //                     <div className={styles.summaryItem}><div className={styles.summaryLabel}>Total Interest</div><div className={styles.summaryValue} style={{ color: '#f59e0b' }}>{formatCurrency(result.totalInterest)}</div></div>
// // //                   </div>
// // //                   <LoanPieChart principal={result.principal} interest={result.totalInterest} />
// // //                 </Card>
// // //               </>
// // //             ) : !loading && !error && (
// // //               <Card>
// // //                 <div className={styles.placeholder}>
// // //                   <div className={styles.placeholderIcon}>🏠</div>
// // //                   <p className={styles.placeholderText}>Enter loan details to see results</p>
// // //                 </div>
// // //               </Card>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // 'use client';

// // import React, { useState, useEffect, useCallback } from 'react';
// // import Input from '@/components/ui/Input';
// // import Card from '@/components/ui/Card';
// // import LoanPieChart from '@/components/charts/LoanPieChart';
// // import AdSlot from '@/components/ads/AdSlot';
// // import { loanAPI } from '@/lib/apiClient';
// // import { formatCurrency } from '@/lib/constants';
// // import styles from '../emi/page.module.css';

// // const DEBOUNCE_MS = 500;

// // export default function HomeLoanCalculator() {

// //   const [formData, setFormData] = useState({
// //     loanAmount: '5000000',
// //     rateOfInterest: '8.5',
// //     tenureMonths: '240',
// //   });

// //   const [result, setResult] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const fetchResult = useCallback(async () => {

// //     const principal = parseFloat(formData.loanAmount);
// //     const rate = parseFloat(formData.rateOfInterest);
// //     const tenure = parseInt(formData.tenureMonths, 10);

// //     if (!principal || principal < 1000 || !rate || tenure < 1) {
// //       setResult(null);
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);

// //     try {

// //       const res = await loanAPI.calculateHomeLoan({
// //         principal: principal,
// //         annualRate: rate,
// //         tenureMonths: tenure
// //       });

// //       setResult(res.data);

// //     } catch (err) {
// //       setResult(null);
// //       setError(err.response?.data?.message || 'Calculation failed.');
// //     } finally {
// //       setLoading(false);
// //     }

// //   }, [formData.loanAmount, formData.rateOfInterest, formData.tenureMonths]);

// //   useEffect(() => {
// //     const t = setTimeout(fetchResult, DEBOUNCE_MS);
// //     return () => clearTimeout(t);
// //   }, [fetchResult]);

// //   const tenureYears = Math.floor(Number(formData.tenureMonths) / 12);

// //   return (
// //     <div className={styles.page}>
// //       <div className={styles.container}>

// //         <div className={styles.header}>
// //           <h1 className={styles.title}>Home Loan Calculator</h1>
// //           <p className={styles.description}>
// //             Calculate your home loan EMI and plan your dream home purchase
// //           </p>
// //         </div>

// //         <div className={styles.content}>

// //           {/* FORM */}
// //           <div className={styles.formSection}>
// //             <Card title="Loan Details">
// //               <div className={styles.form}>

// //                 <Input
// //                   label="Loan Amount"
// //                   type="number"
// //                   name="loanAmount"
// //                   value={formData.loanAmount}
// //                   onChange={handleChange}
// //                   prefix="₹"
// //                   min="1000"
// //                   step="10000"
// //                 />

// //                 <Input
// //                   label="Interest Rate (p.a.)"
// //                   type="number"
// //                   name="rateOfInterest"
// //                   value={formData.rateOfInterest}
// //                   onChange={handleChange}
// //                   suffix="%"
// //                   min="0.1"
// //                   max="30"
// //                   step="0.1"
// //                 />

// //                 <Input
// //                   label="Tenure"
// //                   type="number"
// //                   name="tenureMonths"
// //                   value={formData.tenureMonths}
// //                   onChange={handleChange}
// //                   suffix="months"
// //                   min="12"
// //                   max="360"
// //                   step="12"
// //                   helpText={`${tenureYears} years`}
// //                 />

// //                 {error && <div className={styles.error}>{error}</div>}
// //                 {loading && <div className={styles.loading}>Calculating…</div>}

// //               </div>
// //             </Card>
// //           </div>

// //           {/* RESULT */}
// //           <div className={styles.resultsSection}>

// //             <AdSlot format="rectangle" />

// //             {result ? (
// //               <>

// //                 {/* EMI */}
// //                 <Card variant="gradient" className={styles.emiCard}>
// //                   <div className={styles.emiResult}>
// //                     <div className={styles.emiLabel}>Monthly EMI</div>
// //                     <div className={styles.emiValue}>
// //                       {formatCurrency(result.emi)}
// //                     </div>
// //                   </div>
// //                 </Card>

// //                 {/* SUMMARY */}
// //                 <Card title="Summary">
// //                   <div className={styles.summaryGrid}>

// //                     {/* ✅ FIXED PRINCIPAL */}
// //                     <div className={styles.summaryItem}>
// //                       <div className={styles.summaryLabel}>Principal</div>
// //                       <div className={styles.summaryValue}>
// //                         {formatCurrency(Number(formData.loanAmount))}
// //                       </div>
// //                     </div>

// //                     <div className={styles.summaryItem}>
// //                       <div className={styles.summaryLabel}>Total Interest</div>
// //                       <div className={styles.summaryValue} style={{ color: '#f59e0b' }}>
// //                         {formatCurrency(result.totalInterest)}
// //                       </div>
// //                     </div>

// //                     <div className={styles.summaryItem}>
// //                       <div className={styles.summaryLabel}>Total Amount</div>
// //                       <div className={styles.summaryValue}>
// //                         {formatCurrency(result.totalAmount)}
// //                       </div>
// //                     </div>

// //                   </div>

// //                   {/* ✅ FIXED PIE CHART */}
// //                   <LoanPieChart
// //                     principal={Number(formData.loanAmount)}
// //                     interest={result.totalInterest}
// //                   />

// //                 </Card>

// //               </>
// //             ) : !loading && !error && (
// //               <Card>
// //                 <div className={styles.placeholder}>
// //                   <div className={styles.placeholderIcon}>🏠</div>
// //                   <p className={styles.placeholderText}>
// //                     Enter loan details to see results
// //                   </p>
// //                 </div>
// //               </Card>
// //             )}

// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import HomeLoanCalculator from './HomeLoanCalculator';

// export const metadata = {
//   title: 'Home Loan EMI Calculator | My Wealth Circle',
//   description:
//     'Calculate Home Loan EMI, interest and full amortization schedule yearly and monthly.',
//   keywords: 'Home loan EMI calculator India, housing loan EMI, amortization schedule',
// };

// const SCHEMA = {
//   '@context': 'https://schema.org',
//   '@type': 'WebApplication',
//   name: 'Home Loan EMI Calculator',
//   applicationCategory: 'FinanceApplication',
//   operatingSystem: 'All',
//   offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
// };

// export default function HomeLoanPage() {
//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
//       />
//       <HomeLoanCalculator />
//     </>
//   );
// }
// ─────────────────────────────────────────────────────────────
// app/loans/home-loan/page.jsx  →  SERVER COMPONENT
// ─────────────────────────────────────────────────────────────

import HomeLoanCalculator from './HomeLoanCalculator';

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata = {
  title: 'Home Loan EMI Calculator | My Wealth Circle',
  description:
    'Calculate home loan EMI with property value, down payment, LTV ratio and full amortization schedule. Free housing loan calculator India.',
  keywords: 'home loan EMI calculator, housing loan calculator, property loan EMI India, LTV calculator',
  openGraph: {
    title: 'Home Loan EMI Calculator | My Wealth Circle',
    description: 'Calculate home loan EMI with down payment and amortization schedule.',
    type: 'website',
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Home Loan EMI Calculator',
  url: 'https://mywealthcircle.in/loans/home-loan',
  description: 'Calculate home loan EMI with property value and down payment.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

// ─── Page ─────────────────────────────────────────────────────
export default function HomeLoanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <HomeLoanCalculator />
    </>
  );
}