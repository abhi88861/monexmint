// 'use client';
// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useTheme } from '@/context/ThemeContext';
// import Logo from './Logo';
// import styles from './Header.module.css';

// export default function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const { theme, setTheme } = useTheme();

//   const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

//   return (
//     <header className={styles.header}>
//       <div className={styles.container}>
//         <Link href="/" className={styles.logo}>
//           <Logo />
//           <span className={styles.logoText}>COUNTPENNY</span>
//         </Link>

//         <nav className={styles.nav}>
//           <Link href="/" className={styles.navLink}>Home</Link>
//           <Link href="/calculators" className={styles.navLink}>Calculators</Link>
//           <Link href="/account" className={styles.navLink}>My Account</Link>
//           <button
//             type="button"
//             className={styles.themeBtn}
//             onClick={toggleTheme}
//             aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
//             title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
//           >
//             {theme === 'dark' ? '☀️' : '🌙'}
//           </button>
//         </nav>

//         <button
//           className={styles.mobileMenuBtn}
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           aria-label="Menu"
//         >
//           <span className={styles.hamburger}></span>
//         </button>
//       </div>

//       {mobileMenuOpen && (
//         <div className={styles.mobileMenu}>
//           <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
//           <Link href="/calculators" onClick={() => setMobileMenuOpen(false)}>Calculators</Link>
//           <Link href="/account" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
//           <button type="button" className={styles.mobileThemeBtn} onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}>
//             {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
//           </button>
//         </div>
//       )}
//     </header>
//   );
// }
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import Logo from './Logo';
import styles from './Header.module.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* Logo */}
        {/* <Link href="/" className={styles.logo}>
          <Logo />
          <span className={styles.logoText}>MONEX MINT</span>
        </Link> */}
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image
            src="/logoMM.png"
            alt="MonexMint Logo"
            width={150}
            height={45}
            priority
          />
          <span className={styles.logoText}>MONEX MINT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/calculators" className={styles.navLink}>Calculators</Link>
          <Link href="/about" className={styles.navLink}>About Us</Link>

          {/* <Link href="/account" className={styles.navLink}>My Account</Link> */}

          <button
            type="button"
            className={styles.themeBtn}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <span className={styles.hamburger}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/calculators" onClick={() => setMobileMenuOpen(false)}>Calculators</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>

          {/* <Link href="/account">My Account</Link> */}

          <button
            type="button"
            className={styles.mobileThemeBtn}
            onClick={() => {
              toggleTheme();
              setMobileMenuOpen(false);
            }}
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      )}
    </header>
  );
}