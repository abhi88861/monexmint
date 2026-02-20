'use client';

import AdSlot from '@/components/ads/AdSlot';
import CalculatorSEO from '@/components/seo/CalculatorSEO';
import styles from '@/app/calculators/loans/emi/page.module.css';

export default function CalculatorLayout({
  title,
  description,
  schema,
  children,
  resultSection,
  infoSection
}) {
  return (
    <div className={styles.page}>
      <CalculatorSEO
        title={title}
        description={description}
        schema={schema}
      />

      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.content}>

          {/* LEFT SIDE FORM */}
          {children}

          {/* RIGHT SIDE RESULT */}
          <div className={styles.resultsSection}>

            {/* ✅ AUTO AD INJECTION */}
            <AdSlot format="rectangle" />

            {resultSection}

          </div>

        </div>

        {/* BOTTOM INFO */}
        {infoSection}

      </div>
    </div>
  );
}
