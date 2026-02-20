'use client';
import React from 'react';
import styles from './Header.module.css';

export default function Logo() {
  return (
    <span className={styles.logoIcon} aria-hidden>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M12 24V12l6 8 6-8v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </span>
  );
}
