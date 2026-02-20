'use client';
import React from 'react';
import AdSlot from '@/components/ads/AdSlot';

export default function InvestmentsLayout({ children }) {
  return (
    <>
      <AdSlot format="horizontal" />
      {children}
    </>
  );
}
