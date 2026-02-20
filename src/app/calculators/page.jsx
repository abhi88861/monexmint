'use client';
import React from 'react';
import Link from 'next/link';
import styles from './calculators.module.css';

export default function Calculators() {
  const categories = [
    {
      title: 'Loan Calculators',
      icon: '🏦',
      description: 'EMIs, eligibility, prepayment, and loan planning',
      calculators: [
        { name: 'EMI Calculator', path: '/loans/emi' },
        { name: 'Home Loan', path: '/loans/home-loan' },
        { name: 'Car Loan', path: '/loans/car-loan' },
        { name: 'Personal Loan', path: '/loans/personal-loan' },
        { name: 'Loan Eligibility', path: '/loans/eligibility' },
        { name: 'Prepayment Calculator', path: '/loans/prepayment' },
        { name: 'Flat vs Reducing', path: '/loans/flat-vs-reducing' },
        { name: 'Loan Tenure', path: '/loans/tenure' },
        { name: 'Balance Transfer', path: '/loans/balance-transfer' },
      ]
    },
    {
      title: 'Investment & Wealth',
      icon: '📈',
      description: 'SIP, lumpsum, SWP, CAGR, and goal planning',
      calculators: [
        { name: 'SIP Calculator', path: '/investments/sip' },
        { name: 'Step-up SIP', path: '/investments/step-up-sip' },
        { name: 'Lumpsum', path: '/investments/lumpsum' },
        { name: 'SWP Calculator', path: '/investments/swp' },
        { name: 'CAGR', path: '/investments/cagr' },
        { name: 'Compound Interest', path: '/investments/compound-interest' },
        { name: 'Stock Average', path: '/investments/stock-average' },
        { name: 'XIRR', path: '/investments/xirr' },
        { name: 'Goal Planning', path: '/investments/goal-planning' },
        { name: 'Mutual Fund Returns', path: '/investments/mutual-fund-returns' },
        { name: 'Risk vs Return', path: '/investments/risk-return' },
      ]
    },
    {
      title: 'Government Savings & Pension',
      icon: '🏛️',
      description: 'PPF, EPF, NPS, SSY, APY, NSC, KVP, SCSS, Post Office MIS',
      calculators: [
        { name: 'PPF', path: '/government/ppf' },
        { name: 'EPF', path: '/government/epf' },
        { name: 'NPS', path: '/government/nps' },
        { name: 'SSY', path: '/government/ssy' },
        { name: 'APY', path: '/government/apy' },
        { name: 'NSC', path: '/government/nsc' },
        { name: 'KVP', path: '/government/kvp' },
        { name: 'SCSS', path: '/government/scss' },
        { name: 'Post Office MIS', path: '/government/post-office-mis' },
      ]
    },
    {
      title: 'Banking & Deposits',
      icon: '🏦',
      description: 'FD, RD, savings interest, overdraft',
      calculators: [
        { name: 'FD Calculator', path: '/banking/fd' },
        { name: 'RD Calculator', path: '/banking/rd' },
        { name: 'Savings Interest', path: '/banking/savings-interest' },
        { name: 'Overdraft', path: '/banking/overdraft' },
        { name: 'Credit Card Interest', path: '/banking/credit-card-interest' },
      ]
    },
    {
      title: 'Salary, Income & Tax',
      icon: '👔',
      description: 'CTC, take-home, HRA, gratuity, TDS, bonus',
      calculators: [
        { name: 'Salary (CTC → In-Hand)', path: '/salary-tax/salary' },
        { name: 'Take-Home Salary', path: '/salary-tax/take-home' },
        { name: 'Income Tax', path: '/salary-tax/income-tax' },
        { name: 'HRA Calculator', path: '/salary-tax/hra' },
        { name: 'Gratuity', path: '/salary-tax/gratuity' },
        { name: 'TDS Calculator', path: '/salary-tax/tds' },
        { name: 'Bonus Calculator', path: '/salary-tax/bonus' },
      ]
    },
    {
      title: 'Tax & Business',
      icon: '🧾',
      description: 'GST, brokerage, capital gains, stamp duty, professional tax',
      calculators: [
        { name: 'GST Calculator', path: '/business-tax/gst' },
        { name: 'Brokerage', path: '/business-tax/brokerage' },
        { name: 'Capital Gains Tax', path: '/business-tax/capital-gains' },
        { name: 'Stamp Duty', path: '/business-tax/stamp-duty' },
        { name: 'Professional Tax', path: '/business-tax/professional-tax' },
      ]
    },
    {
      title: 'Inflation & Value',
      icon: '📉',
      description: 'Inflation, real rate, future value',
      calculators: [
        { name: 'Inflation Calculator', path: '/value-tools/inflation' },
        { name: 'Real Rate of Return', path: '/value-tools/real-rate' },
        { name: 'Future Value of Money', path: '/value-tools/future-value' },
      ]
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All Calculators</h1>
          <p className={styles.description}>
            Choose from our comprehensive suite of financial calculators
          </p>
        </div>

        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <div key={category.title} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryIcon}>{category.icon}</span>
                <div>
                  <h2 className={styles.categoryTitle}>{category.title}</h2>
                  <p className={styles.categoryDesc}>{category.description}</p>
                </div>
              </div>
              
              <div className={styles.calculatorGrid}>
                {category.calculators.map((calc) => (
                  <Link key={calc.path} href={calc.path} className={styles.calcCard}>
                    <div className={styles.calcCardContent}>
                      <span className={styles.calcCardName}>{calc.name}</span>
                      <span className={styles.calcCardArrow}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
