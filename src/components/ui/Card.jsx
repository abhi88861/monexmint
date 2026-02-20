import React from 'react';
import styles from './Card.module.css';

export default function Card({ 
  children, 
  title, 
  subtitle,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props 
}) {
  const cardClass = `${styles.card} ${styles[variant]} ${hoverable ? styles.hoverable : ''} ${className}`;
  
  return (
    <div className={cardClass} {...props}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
