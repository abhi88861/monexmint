import React from 'react';
import styles from './Input.module.css';

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  min,
  max,
  step,
  disabled = false,
  error,
  helpText,
  prefix,
  suffix,
  ...props
}) {
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`${styles.input} ${error ? styles.error : ''} ${prefix ? styles.hasPrefix : ''} ${suffix ? styles.hasSuffix : ''}`}
          {...props}
        />
        
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      
      {error && <span className={styles.errorText}>{error}</span>}
      {helpText && !error && <span className={styles.helpText}>{helpText}</span>}
    </div>
  );
}
