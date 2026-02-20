// import Header from '@/components/layout/Header';
// import Footer from '@/components/layout/Footer';
// import { ThemeProvider } from '@/context/ThemeContext';
// import '@/styles/globals.css';

// // export const metadata = {
// //   title: 'My Wealth Circle - Financial Calculators',
// //   description: 'Free financial calculators for loans, investments, tax planning, and more. EMI, SIP, PPF, FD, and more.',
// // };

// // export default function RootLayout({ children }) {
// //   return (
// //     <html lang="en" suppressHydrationWarning>
// //       <body>
// //         <ThemeProvider>
// //           <Header />
// //           <main style={{ minHeight: 'calc(100vh - 200px)' }}>
// //             {children}
// //           </main>
// //           <Footer />
// //         </ThemeProvider>
// //       </body>
// //     </html>
// //   );
// // }
// export const metadata = {
//   title: 'MONEXMINT - Smart Financial Calculators',
//   description:
//     'Free online financial calculators for EMI, SIP, tax, FD, loans and investments. Modern, fast and accurate.',
//   keywords:
//     'EMI calculator, SIP calculator, income tax calculator, FD calculator India',
//   openGraph: {
//     title: 'MONEXMINT - Financial Calculators',
//     description:
//       'Plan loans, investments and taxes with modern calculators.',
//     url: 'https://monexmint.com',
//     siteName: 'MONEXMINT',
//     type: 'website',
//   },
// };
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import '@/styles/globals.css';

export const metadata = {
  title: 'MONEX MINT - Smart Financial Calculators',
  description:
    'Free online financial calculators for EMI, SIP, tax, FD, loans and investments. Modern, fast and accurate.',
  keywords:
    'EMI calculator, SIP calculator, income tax calculator, FD calculator India',
  openGraph: {
    title: 'MONEX MINT - Financial Calculators',
    description:
      'Plan loans, investments and taxes with modern calculators.',
    url: 'https://monexmint.com',
    siteName: 'MONEX MINT',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}