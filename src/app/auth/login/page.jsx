'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with your auth service API
      // const res = await fetch(process.env.NEXT_PUBLIC_AUTH_URL + '/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      await new Promise(r => setTimeout(r, 500));
      setError('Auth service not connected. Connect your backend auth API.');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Card title="Sign in to My Wealth Circle" className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Email" type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Password" type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <div className={styles.error}>{error}</div>}
            <Button type="submit" variant="primary" fullWidth loading={loading}>Sign in</Button>
          </form>
          <p className={styles.footer}>
            <Link href="/">Back to Home</Link>
            <Link href="/account">My Account</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
