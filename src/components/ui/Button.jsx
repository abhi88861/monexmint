import React from 'react';
import styles from './Button.module.css';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'md',
  ...props 
}) {
  const className = `${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${disabled || loading ? styles.disabled : ''}`;
  
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner}></span>}
      {children}
    </button>
  );
}
