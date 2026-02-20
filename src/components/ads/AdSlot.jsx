'use client';
import React from 'react';
import styles from './AdSlot.module.css';

/**
 * AdSense placeholder container. Replace with actual AdSense component when you have publisher ID.
 * Usage: <AdSlot slotId="optional-id" format="rectangle" />
 */
export default function AdSlot({ slotId, format = 'rectangle', className = '' }) {
  return (
    <div className={`${styles.wrapper} ${className}`} data-format={format}>
      <div className={styles.placeholder}>
        <span className={styles.label}>AD</span>
        <span className={styles.text}>
          {slotId ? `Ad slot: ${slotId}` : 'Advertisement now free'}
        </span>
      </div>
    </div>
  );
}
