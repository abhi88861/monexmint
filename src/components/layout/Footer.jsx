import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.grid}>

          {/* About */}
          <div className={styles.section}>
            <h3 className={styles.heading}>About MONEXMINT</h3>
            <p className={styles.text}>
              MONEXMINT is a modern financial intelligence platform offering
              accurate calculators for loans, investments, tax planning,
              banking, and wealth growth. Fast, secure, and built for smarter decisions.
            </p>
          </div>

          {/* Loans */}
          <div className={styles.section}>
            <h3 className={styles.heading}>Loans</h3>
            <ul className={styles.list}>
              <li><Link href="/loans/emi">EMI Calculator</Link></li>
              <li><Link href="/loans/home-loan">Home Loan</Link></li>
              <li><Link href="/loans/personal-loan">Personal Loan</Link></li>
              <li><Link href="/loans/eligibility">Loan Eligibility</Link></li>
            </ul>
          </div>

          {/* Investments */}
          <div className={styles.section}>
            <h3 className={styles.heading}>Investments</h3>
            <ul className={styles.list}>
              <li><Link href="/investments/sip">SIP Calculator</Link></li>
              <li><Link href="/investments/lumpsum">Lumpsum</Link></li>
              <li><Link href="/investments/cagr">CAGR</Link></li>
              <li><Link href="/investments/xirr">XIRR</Link></li>
            </ul>
          </div>

          {/* Tax & Banking */}
          <div className={styles.section}>
            <h3 className={styles.heading}>Tax & Banking</h3>
            <ul className={styles.list}>
              <li><Link href="/salary-tax/income-tax">Income Tax</Link></li>
              <li><Link href="/banking/fd">FD Calculator</Link></li>
              <li><Link href="/banking/rd">RD Calculator</Link></li>
              <li><Link href="/banking/savings-interest">Savings Interest</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.section}>
            <h3 className={styles.heading}>Resources</h3>
            <ul className={styles.list}>
              {/* <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Use</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li> */}
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-of-use">Terms of Use</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>

            <div className={styles.social}>
              <a href="#" className={styles.socialLink}>📧</a>
              <a href="#" className={styles.socialLink}>🐦</a>
              <a href="#" className={styles.socialLink}>📘</a>
              <a href="#" className={styles.socialLink}>💼</a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} MONEXMINT. All rights reserved.
          </p>
          <p className={styles.tagline}>
            Financial calculations are for informational purposes only.
            Please consult a certified financial advisor before making decisions.
          </p>
        </div>

      </div>
    </footer>
  );
}