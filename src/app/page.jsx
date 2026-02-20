'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';

/* ================= Animated Counter ================= */

function AnimatedCounter({ value, suffix }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(counter);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <span>
      {value === 99.9 ? count.toFixed(1) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

/* ================= Data ================= */

const stats = [
  { label: 'Calculations Performed', value: 1000000, suffix: '+' },
  { label: 'Active Users', value: 250000, suffix: '+' },
  { label: 'Financial Tools', value: 50, suffix: '+' },
  { label: 'Accuracy Rate', value: 99.9, suffix: '%' },
];

const features = [
  {
    title: 'Accurate Financial Engines',
    desc: 'Advanced backend-powered calculations for precise results.',
  },
  {
    title: 'Modern & Fast',
    desc: 'Lightning fast performance built with Next.js.',
  },
  {
    title: 'Secure & Private',
    desc: 'Your financial inputs never leave your device.',
  },
  {
    title: 'All-in-One Platform',
    desc: 'Loans, investments, taxes and banking tools in one place.',
  },
];

const categories = [
  { name: 'Loan Calculators', path: '/loans/emi' },
  { name: 'Investment Tools', path: '/investments/sip' },
  { name: 'Tax & Salary', path: '/salary-tax/income-tax' },
  { name: 'Banking & Deposits', path: '/banking/fd' },
];

export default function Home() {
  return (
    <div className={styles.homePage}>

      {/* ================= HERO ================= */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            MONEX MINT
            
            <span className={styles.heroGradient}>
              Smart Financial Decisions, Simplified
            </span>
          </h1>

          <p className={styles.heroSubtitle}>
            India’s modern financial calculator platform for loans,
            investments, tax planning, and wealth growth.
          </p>

          <div className={styles.heroCta}>
            <Link href="/calculators" className={styles.btnPrimary}>
              Explore Calculators
            </Link>
            <Link href="/loans/emi" className={styles.btnSecondary}>
              Try EMI Calculator
            </Link>
          </div>

          <div className={styles.trustRow}>
            <span>✔ 100% Free</span>
            <span>✔ No Signup Required</span>
            <span>✔ Secure & Private</span>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={styles.statCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: index * 0.15,
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className={styles.statValue}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className={styles.statLabel}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className={styles.featureSection}>
        <h2 className={styles.sectionTitle}>Why Choose MONEXMINT?</h2>
        <div className={styles.featureGrid}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.15,
              }}
              viewport={{ once: true }}
            >
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CATEGORY ================= */}
      <section className={styles.categorySection}>
        <h2 className={styles.sectionTitle}>Main Calculators</h2>
        <div className={styles.categoryGrid}>
          {categories.map((cat, i) => (
            <Link key={i} href={cat.path} className={styles.categoryCard}>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ================= BLOG ================= */}
      <section className={styles.blogSection}>
        <h2 className={styles.sectionTitle}>Latest Financial Insights</h2>
        <div className={styles.blogGrid}>
          <Link href="/blog/emi-vs-prepayment" className={styles.blogCard}>
            <h3>EMI vs Prepayment: What Saves More?</h3>
            <p>Understand when prepaying your loan is beneficial.</p>
          </Link>

          <Link href="/blog/sip-vs-lumpsum" className={styles.blogCard}>
            <h3>SIP vs Lumpsum Investment</h3>
            <p>Which investment strategy builds more wealth?</p>
          </Link>

          <Link href="/blog/income-tax-saving-tips" className={styles.blogCard}>
            <h3>Top Income Tax Saving Tips</h3>
            <p>Legally reduce your tax burden using smart planning.</p>
          </Link>
        </div>
      </section>

    </div>
  );
}