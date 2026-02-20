'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './account.module.css';

export default function AccountPage() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Account</h1>
          <p className={styles.description}>
            Manage your profile and preferences
          </p>
        </div>

        <div className={styles.content}>
          <Card title="Theme" className={styles.card}>
            <div className={styles.themeRow}>
              <span>Appearance</span>
              <button
                type="button"
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <span className={styles.toggleTrack}>
                  <span className={styles.toggleThumb} data-theme={theme} />
                </span>
                <span className={styles.themeLabel}>
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>
            </div>
          </Card>

          <Card title="Login" className={styles.card}>
            {user ? (
              <div className={styles.userInfo}>
                <p>Welcome, {user.name || user.email}</p>
                <Button variant="outline" onClick={() => setUser(null)}>Logout</Button>
              </div>
            ) : (
              <div className={styles.loginPlaceholder}>
                <p>Sign in with your My Wealth Circle account. Backend auth API can be connected here.</p>
                <Link href="/auth/login">
                  <Button variant="primary">Login</Button>
                </Link>
              </div>
            )}
          </Card>

          <Card title="Quick Links" className={styles.card}>
            <div className={styles.links}>
              <Link href="/calculators">All Calculators</Link>
              <Link href="/">Home</Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
