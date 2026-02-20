'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Charts.module.css';

export default function InvestmentBarChart({ invested, returns }) {
  const data = [
    {
      name: 'Investment',
      'Invested Amount': invested,
      'Returns': returns,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          {payload.map((entry, index) => (
            <div key={index} className={styles.tooltipItem}>
              <p className={styles.tooltipLabel} style={{ color: entry.color }}>
                {entry.name}
              </p>
              <p className={styles.tooltipValue}>
                ₹{entry.value.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis 
            stroke="#64748b"
            tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Invested Amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Returns" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
