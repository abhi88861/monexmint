// // API Configuration
// export const API_CONFIG = {
//   GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8081',
//   CALCULATOR_BASE: '/calculator',
//   TIMEOUT: 10000,
// };

// // Calculator Categories
// export const CALCULATOR_CATEGORIES = {
//   LOANS: 'loans',
//   INVESTMENTS: 'investments',
//   GOVERNMENT: 'government',
//   BANKING: 'banking',
//   SALARY_TAX: 'salary-tax',
//   BUSINESS_TAX: 'business-tax',
//   VALUE_TOOLS: 'value-tools',
// };

// // Loan Types
// export const LOAN_TYPES = {
//   EMI: 'emi',
//   HOME_LOAN: 'home-loan',
//   CAR_LOAN: 'car-loan',
//   PERSONAL_LOAN: 'personal-loan',
//   FLAT_VS_REDUCING: 'flat-vs-reducing',
//   ELIGIBILITY: 'eligibility',
//   PREPAYMENT: 'prepayment',
//   TENURE: 'tenure',
//   BALANCE_TRANSFER: 'balance-transfer',
// };

// // Investment Types
// export const INVESTMENT_TYPES = {
//   SIP: 'sip',
//   STEP_UP_SIP: 'step-up-sip',
//   LUMPSUM: 'lumpsum',
//   SWP: 'swp',
//   CAGR: 'cagr',
//   COMPOUND_INTEREST: 'compound-interest',
//   STOCK_AVERAGE: 'stock-average',
//   XIRR: 'xirr',
//   GOAL_PLANNING: 'goal-planning',
//   RISK_RETURN: 'risk-return',
// };

// // Currency Format
// export const CURRENCY_FORMAT = {
//   LOCALE: 'en-IN',
//   CURRENCY: 'INR',
//   SYMBOL: '₹',
// };

// // Chart Colors
// export const CHART_COLORS = {
//   PRIMARY: '#6366f1',
//   SECONDARY: '#8b5cf6',
//   SUCCESS: '#10b981',
//   WARNING: '#f59e0b',
//   DANGER: '#ef4444',
//   INFO: '#3b82f6',
//   PRINCIPAL: '#6366f1',
//   INTEREST: '#f59e0b',
//   INVESTED: '#3b82f6',
//   RETURNS: '#10b981',
// };

// // Format currency in Indian format
// export const formatCurrency = (amount) => {
//   if (!amount && amount !== 0) return '₹0';
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0,
//   }).format(amount);
// };

// // Format number in Indian format
// export const formatNumber = (num) => {
//   if (!num && num !== 0) return '0';
//   return new Intl.NumberFormat('en-IN').format(num);
// };

// // Format percentage
// export const formatPercentage = (value) => {
//   if (!value && value !== 0) return '0%';
//   return `${value.toFixed(2)}%`;
// };

// export default {
//   API_CONFIG,
//   CALCULATOR_CATEGORIES,
//   LOAN_TYPES,
//   INVESTMENT_TYPES,
//   CURRENCY_FORMAT,
//   CHART_COLORS,
//   formatCurrency,
//   formatNumber,
//   formatPercentage,
// };
// ============================================================
//  MY WEALTH CIRCLE — constants.js
//  Single source of truth for all app-wide constants,
//  labels, routes, chart colors, and format helpers.
// ============================================================

// ─────────────────────────────────────────────────────────────
// API Configuration
// ─────────────────────────────────────────────────────────────
export const API_CONFIG = {
  GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8081',
  CALCULATOR_BASE: '/calculator',
  TIMEOUT: 10000,
};

// ─────────────────────────────────────────────────────────────
// Calculator Categories  (matches folder names in /app)
// ─────────────────────────────────────────────────────────────
export const CALCULATOR_CATEGORIES = {
  LOANS:        'loans',
  INVESTMENTS:  'investments',
  GOVERNMENT:   'government',
  BANKING:      'banking',
  SALARY_TAX:   'salary-tax',
  BUSINESS_TAX: 'business-tax',
  VALUE_TOOLS:  'value-tools',
};

// ─────────────────────────────────────────────────────────────
// Loan Types
// ─────────────────────────────────────────────────────────────
export const LOAN_TYPES = {
  EMI:              'emi',
  HOME_LOAN:        'home-loan',
  CAR_LOAN:         'car-loan',
  PERSONAL_LOAN:    'personal-loan',
  FLAT_VS_REDUCING: 'flat-vs-reducing',
  ELIGIBILITY:      'eligibility',
  PREPAYMENT:       'prepayment',
  TENURE:           'tenure',
  BALANCE_TRANSFER: 'balance-transfer',
};

// ─────────────────────────────────────────────────────────────
// Investment Types
// ─────────────────────────────────────────────────────────────
export const INVESTMENT_TYPES = {
  SIP:               'sip',
  STEP_UP_SIP:       'step-up-sip',
  LUMPSUM:           'lumpsum',
  SWP:               'swp',
  CAGR:              'cagr',
  COMPOUND_INTEREST: 'compound-interest',
  STOCK_AVERAGE:     'stock-average',
  XIRR:              'xirr',
  GOAL_PLANNING:     'goal-planning',
  MUTUAL_FUND:       'mutual-fund',
  RISK_RETURN:       'risk-return',
};

// ─────────────────────────────────────────────────────────────
// Government Scheme Types
// ─────────────────────────────────────────────────────────────
export const GOVERNMENT_TYPES = {
  PPF:  'ppf',
  EPF:  'epf',
  NPS:  'nps',
  SSY:  'ssy',
  APY:  'apy',
  NSC:  'nsc',
  MIS:  'mis',
  KVP:  'kvp',
  SCSS: 'scss',
};

// ─────────────────────────────────────────────────────────────
// Banking Types
// ─────────────────────────────────────────────────────────────
export const BANKING_TYPES = {
  FD:              'fd',
  RD:              'rd',
  SAVINGS_ACCOUNT: 'savings-account',
  OVERDRAFT:       'overdraft',
  CREDIT_CARD:     'credit-card',
};

// ─────────────────────────────────────────────────────────────
// Salary & Tax Types
// ─────────────────────────────────────────────────────────────
export const SALARY_TAX_TYPES = {
  SALARY:      'salary',
  HRA:         'hra',
  INCOME_TAX:  'income-tax',
  GRATUITY:    'gratuity',
  TDS:         'tds',
  BONUS:       'bonus',
  TAKE_HOME:   'take-home',
};

// ─────────────────────────────────────────────────────────────
// Business & Tax Types
// ─────────────────────────────────────────────────────────────
export const BUSINESS_TAX_TYPES = {
  GST:               'gst',
  BROKERAGE:         'brokerage',
  CAPITAL_GAINS:     'capital-gains',
  STAMP_DUTY:        'stamp-duty',
  PROFESSIONAL_TAX:  'professional-tax',
};

// ─────────────────────────────────────────────────────────────
// Value / Inflation Tool Types
// ─────────────────────────────────────────────────────────────
export const VALUE_TOOL_TYPES = {
  INFLATION:    'inflation',
  REAL_RETURN:  'real-return',
  FUTURE_VALUE: 'future-value',
};

// ─────────────────────────────────────────────────────────────
// Currency & Locale
// ─────────────────────────────────────────────────────────────
export const CURRENCY_FORMAT = {
  LOCALE:   'en-IN',
  CURRENCY: 'INR',
  SYMBOL:   '₹',
};

// ─────────────────────────────────────────────────────────────
// Chart Colors  (used across LoanPieChart, InvestmentBarChart etc.)
// ─────────────────────────────────────────────────────────────
export const CHART_COLORS = {
  PRIMARY:   '#6366f1',
  SECONDARY: '#8b5cf6',
  SUCCESS:   '#10b981',
  WARNING:   '#f59e0b',
  DANGER:    '#ef4444',
  INFO:      '#3b82f6',
  // Semantic aliases used directly in chart components
  PRINCIPAL: '#6366f1',
  INTEREST:  '#f59e0b',
  INVESTED:  '#3b82f6',
  RETURNS:   '#10b981',
  CORPUS:    '#8b5cf6',
  WITHDRAWAL:'#ef4444',
};

// ─────────────────────────────────────────────────────────────
// GST Rates  (standard rates used in India)
// ─────────────────────────────────────────────────────────────
export const GST_RATES = [0, 3, 5, 12, 18, 28];

// ─────────────────────────────────────────────────────────────
// Indian States  (used in Stamp Duty & Professional Tax)
// ─────────────────────────────────────────────────────────────
export const INDIAN_STATES = [
  { value: 'andhra',        label: 'Andhra Pradesh' },
  { value: 'assam',         label: 'Assam' },
  { value: 'bihar',         label: 'Bihar' },
  { value: 'chhattisgarh',  label: 'Chhattisgarh' },
  { value: 'delhi',         label: 'Delhi' },
  { value: 'goa',           label: 'Goa' },
  { value: 'gujarat',       label: 'Gujarat' },
  { value: 'haryana',       label: 'Haryana' },
  { value: 'himachal',      label: 'Himachal Pradesh' },
  { value: 'jharkhand',     label: 'Jharkhand' },
  { value: 'karnataka',     label: 'Karnataka' },
  { value: 'kerala',        label: 'Kerala' },
  { value: 'madhyapradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra',   label: 'Maharashtra' },
  { value: 'manipur',       label: 'Manipur' },
  { value: 'odisha',        label: 'Odisha' },
  { value: 'punjab',        label: 'Punjab' },
  { value: 'rajasthan',     label: 'Rajasthan' },
  { value: 'telangana',     label: 'Telangana' },
  { value: 'tamilnadu',     label: 'Tamil Nadu' },
  { value: 'uttarpradesh',  label: 'Uttar Pradesh' },
  { value: 'uttarakhand',   label: 'Uttarakhand' },
  { value: 'westbengal',    label: 'West Bengal' },
];

// ─────────────────────────────────────────────────────────────
// Metro Cities  (for HRA exemption — 50% vs 40% of Basic)
// ─────────────────────────────────────────────────────────────
export const METRO_CITIES = [
  'Mumbai', 'Delhi', 'Kolkata', 'Chennai',
  'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad',
];

// ─────────────────────────────────────────────────────────────
// Tax Regimes
// ─────────────────────────────────────────────────────────────
export const TAX_REGIMES = {
  NEW: 'new',
  OLD: 'old',
};

// Tax regime labels for UI dropdowns
export const TAX_REGIME_OPTIONS = [
  { value: 'new', label: 'New Regime (Default FY 2024-25)' },
  { value: 'old', label: 'Old Regime (With Deductions)' },
];

// ─────────────────────────────────────────────────────────────
// Compounding Frequency Options  (for FD, CI calculators)
// ─────────────────────────────────────────────────────────────
export const COMPOUNDING_OPTIONS = [
  { value: 1,   label: 'Annually' },
  { value: 2,   label: 'Half-Yearly' },
  { value: 4,   label: 'Quarterly' },
  { value: 12,  label: 'Monthly' },
  { value: 365, label: 'Daily' },
];

// ─────────────────────────────────────────────────────────────
// Loan Tenure Options  (quick-select buttons)
// ─────────────────────────────────────────────────────────────
export const LOAN_TENURE_OPTIONS = [
  { value: 12,  label: '1 Yr' },
  { value: 36,  label: '3 Yrs' },
  { value: 60,  label: '5 Yrs' },
  { value: 120, label: '10 Yrs' },
  { value: 180, label: '15 Yrs' },
  { value: 240, label: '20 Yrs' },
  { value: 300, label: '25 Yrs' },
  { value: 360, label: '30 Yrs' },
];

// ─────────────────────────────────────────────────────────────
// SIP Tenure Options  (quick-select buttons)
// ─────────────────────────────────────────────────────────────
export const SIP_TENURE_OPTIONS = [
  { value: 1,  label: '1 Yr' },
  { value: 3,  label: '3 Yrs' },
  { value: 5,  label: '5 Yrs' },
  { value: 10, label: '10 Yrs' },
  { value: 15, label: '15 Yrs' },
  { value: 20, label: '20 Yrs' },
  { value: 25, label: '25 Yrs' },
  { value: 30, label: '30 Yrs' },
];

// ─────────────────────────────────────────────────────────────
// TDS Payment Types  (for TDS Calculator dropdown)
// ─────────────────────────────────────────────────────────────
export const TDS_PAYMENT_TYPES = [
  { value: 'fdInterest',      label: 'FD Interest (Sec 194A)' },
  { value: 'rentLand',        label: 'Rent - Land/Building (Sec 194I)' },
  { value: 'rentMachinery',   label: 'Rent - Machinery (Sec 194I)' },
  { value: 'professionalFee', label: 'Professional Fee (Sec 194J)' },
  { value: 'contractPayment', label: 'Contractor Payment (Sec 194C)' },
  { value: 'commission',      label: 'Commission/Brokerage (Sec 194H)' },
  { value: 'lottery',         label: 'Lottery / Winnings (Sec 194B)' },
  { value: 'insurance',       label: 'Insurance Maturity (Sec 194DA)' },
  { value: 'dividends',       label: 'Dividends (Sec 194)' },
];

// ─────────────────────────────────────────────────────────────
// Capital Gains Asset Types
// ─────────────────────────────────────────────────────────────
export const ASSET_TYPES = [
  { value: 'equity',    label: 'Equity Shares / Equity MF' },
  { value: 'equityMF',  label: 'Equity Mutual Funds' },
  { value: 'debtMF',    label: 'Debt Mutual Funds / Bonds' },
  { value: 'property',  label: 'Property / Real Estate' },
  { value: 'gold',      label: 'Gold / Digital Gold' },
];

// ─────────────────────────────────────────────────────────────
// Brokerage Segment Types
// ─────────────────────────────────────────────────────────────
export const BROKERAGE_SEGMENTS = [
  { value: 'equityDelivery', label: 'Equity - Delivery' },
  { value: 'equityIntraday', label: 'Equity - Intraday' },
  { value: 'futuresIndex',   label: 'F&O - Futures' },
  { value: 'optionsIndex',   label: 'F&O - Options' },
];

// ─────────────────────────────────────────────────────────────
// APY Pension Options
// ─────────────────────────────────────────────────────────────
export const APY_PENSION_OPTIONS = [
  { value: 1000, label: '₹1,000 / month' },
  { value: 2000, label: '₹2,000 / month' },
  { value: 3000, label: '₹3,000 / month' },
  { value: 4000, label: '₹4,000 / month' },
  { value: 5000, label: '₹5,000 / month' },
];

// ─────────────────────────────────────────────────────────────
// Goal Types  (for Goal Planning Calculator)
// ─────────────────────────────────────────────────────────────
export const GOAL_TYPES = [
  { value: 'retirement',  label: '🏖️ Retirement', icon: '🏖️' },
  { value: 'education',   label: '🎓 Child Education', icon: '🎓' },
  { value: 'house',       label: '🏠 Buy a House', icon: '🏠' },
  { value: 'marriage',    label: '💍 Marriage', icon: '💍' },
  { value: 'travel',      label: '✈️ Travel / Vacation', icon: '✈️' },
  { value: 'emergency',   label: '🏥 Emergency Fund', icon: '🏥' },
  { value: 'vehicle',     label: '🚗 Buy a Vehicle', icon: '🚗' },
  { value: 'custom',      label: '🎯 Custom Goal', icon: '🎯' },
];

// ─────────────────────────────────────────────────────────────
// Navigation — Calculator Menu  (used in Header dropdown & Footer)
// ─────────────────────────────────────────────────────────────
export const CALCULATOR_NAV = [
  {
    category: 'Loans',
    icon: '🏦',
    href: '/loans',
    items: [
      { label: 'EMI Calculator',             href: '/loans/emi' },
      { label: 'Home Loan EMI',              href: '/loans/home-loan' },
      { label: 'Car Loan EMI',               href: '/loans/car-loan' },
      { label: 'Personal Loan EMI',          href: '/loans/personal-loan' },
      { label: 'Flat vs Reducing Rate',      href: '/loans/flat-vs-reducing' },
      { label: 'Loan Eligibility',           href: '/loans/eligibility' },
      { label: 'Prepayment Calculator',      href: '/loans/prepayment' },
      { label: 'Loan Tenure Calculator',     href: '/loans/tenure' },
      { label: 'Balance Transfer',           href: '/loans/balance-transfer' },
    ],
  },
  {
    category: 'Investments',
    icon: '📈',
    href: '/investments',
    items: [
      { label: 'SIP Calculator',             href: '/investments/sip' },
      { label: 'Step-Up SIP',                href: '/investments/step-up-sip' },
      { label: 'Lumpsum Calculator',         href: '/investments/lumpsum' },
      { label: 'SWP Calculator',             href: '/investments/swp' },
      { label: 'CAGR Calculator',            href: '/investments/cagr' },
      { label: 'Compound Interest',          href: '/investments/compound-interest' },
      { label: 'Stock Average',              href: '/investments/stock-average' },
      { label: 'XIRR Calculator',            href: '/investments/xirr' },
      { label: 'Goal Planning',              href: '/investments/goal-planning' },
    ],
  },
  {
    category: 'Govt Schemes',
    icon: '🏛️',
    href: '/government',
    items: [
      { label: 'PPF Calculator',             href: '/government/ppf' },
      { label: 'EPF Calculator',             href: '/government/epf' },
      { label: 'NPS Calculator',             href: '/government/nps' },
      { label: 'SSY Calculator',             href: '/government/ssy' },
      { label: 'APY Calculator',             href: '/government/apy' },
      { label: 'NSC Calculator',             href: '/government/nsc' },
      { label: 'Post Office MIS',            href: '/government/mis' },
      { label: 'KVP Calculator',             href: '/government/kvp' },
      { label: 'SCSS Calculator',            href: '/government/scss' },
    ],
  },
  {
    category: 'Banking',
    icon: '💰',
    href: '/banking',
    items: [
      { label: 'FD Calculator',              href: '/banking/fd' },
      { label: 'RD Calculator',              href: '/banking/rd' },
      { label: 'Savings Account Interest',   href: '/banking/savings-account' },
      { label: 'Overdraft Interest',         href: '/banking/overdraft' },
      { label: 'Credit Card Interest',       href: '/banking/credit-card' },
    ],
  },
  {
    category: 'Salary & Tax',
    icon: '👔',
    href: '/salary-tax',
    items: [
      { label: 'CTC to In-Hand',             href: '/salary-tax/salary' },
      { label: 'HRA Exemption',              href: '/salary-tax/hra' },
      { label: 'Income Tax',                 href: '/salary-tax/income-tax' },
      { label: 'Gratuity Calculator',        href: '/salary-tax/gratuity' },
      { label: 'TDS Calculator',             href: '/salary-tax/tds' },
      { label: 'Bonus Calculator',           href: '/salary-tax/bonus' },
      { label: 'Take-Home Salary',           href: '/salary-tax/take-home' },
    ],
  },
  {
    category: 'Tax & Business',
    icon: '🧾',
    href: '/business-tax',
    items: [
      { label: 'GST Calculator',             href: '/business-tax/gst' },
      { label: 'Brokerage Calculator',       href: '/business-tax/brokerage' },
      { label: 'Capital Gains Tax',          href: '/business-tax/capital-gains' },
      { label: 'Stamp Duty Calculator',      href: '/business-tax/stamp-duty' },
      { label: 'Professional Tax',           href: '/business-tax/professional-tax' },
    ],
  },
  {
    category: 'Inflation & Value',
    icon: '📉',
    href: '/value-tools',
    items: [
      { label: 'Inflation Calculator',       href: '/value-tools/inflation' },
      { label: 'Real Rate of Return',        href: '/value-tools/real-return' },
      { label: 'Future Value of Money',      href: '/value-tools/future-value' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// SEO — Default meta for each calculator page
// Import in each page.jsx as: import { CALCULATOR_SEO } from '@/lib/constants'
// ─────────────────────────────────────────────────────────────
export const CALCULATOR_SEO = {
  // Loans
  emi: {
    title: 'EMI Calculator | My Wealth Circle',
    description: 'Calculate your loan EMI instantly. Free EMI calculator for home, car & personal loans with amortisation schedule.',
    keywords: 'EMI calculator, loan EMI, monthly installment calculator, India',
  },
  'home-loan': {
    title: 'Home Loan EMI Calculator | My Wealth Circle',
    description: 'Calculate your home loan EMI, total interest payable and monthly repayment schedule. Free home loan calculator India.',
    keywords: 'home loan EMI calculator, housing loan EMI, mortgage calculator India',
  },
  'car-loan': {
    title: 'Car Loan EMI Calculator | My Wealth Circle',
    description: 'Calculate car loan EMI including on-road price, RTO charges and insurance. Free car loan EMI calculator India.',
    keywords: 'car loan EMI calculator, auto loan calculator, vehicle loan India',
  },
  'personal-loan': {
    title: 'Personal Loan EMI Calculator | My Wealth Circle',
    description: 'Calculate personal loan EMI, total interest and effective APR. Instant personal loan calculator India.',
    keywords: 'personal loan EMI calculator, unsecured loan calculator India',
  },
  'flat-vs-reducing': {
    title: 'Flat vs Reducing Interest Rate Calculator | My Wealth Circle',
    description: 'Compare flat rate vs reducing balance rate on your loan. Find the equivalent reducing rate for any flat rate loan.',
    keywords: 'flat rate vs reducing rate, loan interest comparison calculator India',
  },
  eligibility: {
    title: 'Loan Eligibility Calculator | My Wealth Circle',
    description: 'Check how much home or personal loan you are eligible for based on your income, existing EMIs and FOIR.',
    keywords: 'loan eligibility calculator, how much loan can I get, FOIR calculator India',
  },
  prepayment: {
    title: 'Loan Prepayment & Foreclosure Calculator | My Wealth Circle',
    description: 'Calculate interest saved and new tenure after loan prepayment. Free prepayment and foreclosure calculator India.',
    keywords: 'loan prepayment calculator, foreclosure savings, part payment calculator India',
  },
  tenure: {
    title: 'Loan Tenure Calculator | My Wealth Circle',
    description: 'Find the exact loan tenure for your desired EMI amount. Free loan tenure calculator India.',
    keywords: 'loan tenure calculator, EMI to tenure calculator India',
  },
  'balance-transfer': {
    title: 'Loan Balance Transfer Calculator | My Wealth Circle',
    description: 'Calculate savings from transferring your loan to a lower interest rate lender. Break-even analysis included.',
    keywords: 'loan balance transfer calculator, home loan transfer savings India',
  },
  // Investments
  sip: {
    title: 'SIP Calculator | My Wealth Circle',
    description: 'Calculate SIP returns, maturity value and wealth gained. Free SIP calculator for mutual fund investments India.',
    keywords: 'SIP calculator, mutual fund SIP, systematic investment plan calculator India',
  },
  'step-up-sip': {
    title: 'Step-Up SIP Calculator | My Wealth Circle',
    description: 'Calculate returns for SIP with annual step-up. See how increasing your SIP yearly grows your wealth faster.',
    keywords: 'step up SIP calculator, increasing SIP, top-up SIP calculator India',
  },
  lumpsum: {
    title: 'Lumpsum Calculator | My Wealth Circle',
    description: 'Calculate lumpsum mutual fund investment returns. One-time investment future value calculator India.',
    keywords: 'lumpsum calculator, one time investment calculator, mutual fund lumpsum India',
  },
  swp: {
    title: 'SWP Calculator | My Wealth Circle',
    description: 'Calculate systematic withdrawal plan returns. Find out how long your corpus lasts with monthly withdrawals.',
    keywords: 'SWP calculator, systematic withdrawal plan, monthly withdrawal from mutual fund India',
  },
  cagr: {
    title: 'CAGR Calculator | My Wealth Circle',
    description: 'Calculate Compound Annual Growth Rate of any investment. Free CAGR calculator India.',
    keywords: 'CAGR calculator, compound annual growth rate, investment return calculator India',
  },
  'compound-interest': {
    title: 'Compound Interest Calculator | My Wealth Circle',
    description: 'Calculate compound interest with daily, monthly, quarterly or annual compounding. Free compound interest calculator.',
    keywords: 'compound interest calculator, CI formula, compounding frequency calculator India',
  },
  'stock-average': {
    title: 'Stock Average Calculator | My Wealth Circle',
    description: 'Calculate the average buy price of your stock across multiple purchases. Free stock average down calculator.',
    keywords: 'stock average calculator, average down calculator, share average price India',
  },
  xirr: {
    title: 'XIRR Calculator | My Wealth Circle',
    description: 'Calculate XIRR for irregular mutual fund SIP investments and cash flows. Extended IRR calculator India.',
    keywords: 'XIRR calculator, mutual fund XIRR, irregular investment return India',
  },
  'goal-planning': {
    title: 'Goal Planning Calculator | My Wealth Circle',
    description: 'Calculate how much SIP or lumpsum you need to reach your financial goal. Retirement, education, house planning.',
    keywords: 'goal planning calculator, financial goal SIP, retirement planning calculator India',
  },
  // Government
  ppf: {
    title: 'PPF Calculator | My Wealth Circle',
    description: 'Calculate PPF maturity amount, total interest and year-wise breakdown. Free PPF calculator India 2024-25.',
    keywords: 'PPF calculator, public provident fund calculator, PPF maturity 2024 India',
  },
  epf: {
    title: 'EPF Calculator | My Wealth Circle',
    description: 'Calculate EPF corpus at retirement. Employee Provident Fund maturity calculator with employer contribution.',
    keywords: 'EPF calculator, employee provident fund calculator, PF maturity calculator India',
  },
  nps: {
    title: 'NPS Calculator | My Wealth Circle',
    description: 'Calculate NPS corpus, lumpsum withdrawal and monthly pension at retirement. National Pension Scheme calculator.',
    keywords: 'NPS calculator, national pension scheme calculator, NPS pension calculator India',
  },
  ssy: {
    title: 'Sukanya Samriddhi Yojana Calculator | My Wealth Circle',
    description: 'Calculate SSY maturity amount for your daughter. Sukanya Samriddhi Yojana calculator 2024-25.',
    keywords: 'SSY calculator, Sukanya Samriddhi Yojana calculator, girl child savings India',
  },
  apy: {
    title: 'Atal Pension Yojana Calculator | My Wealth Circle',
    description: 'Find your APY monthly contribution based on age and desired pension. Atal Pension Yojana calculator India.',
    keywords: 'APY calculator, atal pension yojana, monthly contribution APY India',
  },
  nsc: {
    title: 'NSC Calculator | My Wealth Circle',
    description: 'Calculate NSC maturity amount and year-wise interest. National Savings Certificate calculator India 2024.',
    keywords: 'NSC calculator, national savings certificate calculator, post office NSC India',
  },
  mis: {
    title: 'Post Office MIS Calculator | My Wealth Circle',
    description: 'Calculate Post Office Monthly Income Scheme interest payout. Free MIS calculator India 2024-25.',
    keywords: 'post office MIS calculator, monthly income scheme, post office savings India',
  },
  kvp: {
    title: 'KVP Calculator | My Wealth Circle',
    description: 'Calculate when your Kisan Vikas Patra investment doubles. KVP doubling period calculator India 2024.',
    keywords: 'KVP calculator, kisan vikas patra, money doubling scheme India',
  },
  scss: {
    title: 'SCSS Calculator | My Wealth Circle',
    description: 'Calculate Senior Citizen Savings Scheme quarterly interest and total returns. SCSS calculator India 2024-25.',
    keywords: 'SCSS calculator, senior citizen savings scheme, quarterly interest calculator India',
  },
  // Banking
  fd: {
    title: 'FD Calculator | My Wealth Circle',
    description: 'Calculate Fixed Deposit maturity amount with quarterly compounding. Free FD calculator for all banks India.',
    keywords: 'FD calculator, fixed deposit calculator, bank FD maturity calculator India',
  },
  rd: {
    title: 'RD Calculator | My Wealth Circle',
    description: 'Calculate Recurring Deposit maturity amount and interest earned. Free RD calculator India.',
    keywords: 'RD calculator, recurring deposit calculator, monthly deposit maturity India',
  },
  'savings-account': {
    title: 'Savings Account Interest Calculator | My Wealth Circle',
    description: 'Calculate savings account interest earned monthly, quarterly and annually. Free savings interest calculator India.',
    keywords: 'savings account interest calculator, bank savings interest, savings account return India',
  },
  overdraft: {
    title: 'Overdraft Interest Calculator | My Wealth Circle',
    description: 'Calculate bank overdraft interest charges based on utilization days and amount. Free OD calculator India.',
    keywords: 'overdraft interest calculator, OD account interest, bank overdraft charges India',
  },
  'credit-card': {
    title: 'Credit Card Interest Calculator | My Wealth Circle',
    description: 'Calculate credit card interest charges, payoff time and minimum payment trap. Free credit card calculator India.',
    keywords: 'credit card interest calculator, credit card payoff calculator, minimum payment India',
  },
  // Salary & Tax
  salary: {
    title: 'Salary Calculator — CTC to In-Hand | My Wealth Circle',
    description: 'Convert annual CTC to monthly in-hand salary. Includes PF, HRA, professional tax breakdown. Free salary calculator India.',
    keywords: 'salary calculator, CTC to in-hand, take home salary calculator India 2024',
  },
  hra: {
    title: 'HRA Exemption Calculator | My Wealth Circle',
    description: 'Calculate HRA exemption under Section 10(13A). Free HRA calculator for metro and non-metro cities India.',
    keywords: 'HRA exemption calculator, house rent allowance exemption, HRA tax saving India',
  },
  'income-tax': {
    title: 'Income Tax Calculator FY 2024-25 | My Wealth Circle',
    description: 'Compare Old vs New Income Tax Regime FY 2024-25. Calculate tax savings with our free income tax calculator India.',
    keywords: 'income tax calculator 2024-25, old vs new tax regime, income tax calculator India',
  },
  gratuity: {
    title: 'Gratuity Calculator | My Wealth Circle',
    description: 'Calculate your gratuity amount under Payment of Gratuity Act. Free gratuity calculator India.',
    keywords: 'gratuity calculator, gratuity formula, gratuity calculation India',
  },
  tds: {
    title: 'TDS Calculator | My Wealth Circle',
    description: 'Calculate TDS on FD interest, rent, professional fees and more. Free TDS calculator India 2024-25.',
    keywords: 'TDS calculator, tax deducted at source, TDS on FD rent salary India',
  },
  bonus: {
    title: 'Bonus & Variable Pay Calculator | My Wealth Circle',
    description: 'Calculate in-hand bonus after income tax deduction. Free bonus tax calculator India 2024-25.',
    keywords: 'bonus calculator, variable pay tax calculator, in-hand bonus after tax India',
  },
  'take-home': {
    title: 'Take-Home Salary Calculator | My Wealth Circle',
    description: 'Calculate exact monthly take-home salary with all deductions. Free take-home salary calculator India 2024.',
    keywords: 'take home salary calculator, monthly in-hand salary, net salary calculator India',
  },
  // Business Tax
  gst: {
    title: 'GST Calculator | My Wealth Circle',
    description: 'Add or remove GST from any amount. Calculate CGST, SGST, IGST for intra and inter-state transactions.',
    keywords: 'GST calculator, add remove GST, CGST SGST IGST calculator India',
  },
  brokerage: {
    title: 'Brokerage Calculator | My Wealth Circle',
    description: 'Calculate stock trading charges: brokerage, STT, exchange charges, GST and stamp duty. Zerodha style calculator.',
    keywords: 'brokerage calculator, stock trading charges, STT calculator, Zerodha brokerage India',
  },
  'capital-gains': {
    title: 'Capital Gains Tax Calculator | My Wealth Circle',
    description: 'Calculate STCG and LTCG tax on equity, mutual funds, property and gold. Capital gains tax calculator India 2024.',
    keywords: 'capital gains tax calculator, STCG LTCG tax, equity mutual fund tax India',
  },
  'stamp-duty': {
    title: 'Stamp Duty Calculator | My Wealth Circle',
    description: 'Calculate property stamp duty and registration charges state-wise. Free stamp duty calculator India 2024.',
    keywords: 'stamp duty calculator, property registration charges, stamp duty India state wise',
  },
  'professional-tax': {
    title: 'Professional Tax Calculator | My Wealth Circle',
    description: 'Calculate monthly professional tax deduction state-wise. Free professional tax calculator India.',
    keywords: 'professional tax calculator, state wise professional tax, PT deduction India',
  },
  // Value Tools
  inflation: {
    title: 'Inflation Calculator | My Wealth Circle',
    description: 'Calculate the impact of inflation on your money. Find future equivalent and purchasing power with our inflation calculator.',
    keywords: 'inflation calculator, purchasing power calculator, inflation impact India',
  },
  'real-return': {
    title: 'Real Rate of Return Calculator | My Wealth Circle',
    description: 'Calculate real rate of return after adjusting for inflation using Fisher equation. Free real return calculator.',
    keywords: 'real rate of return calculator, inflation adjusted return, Fisher equation calculator',
  },
  'future-value': {
    title: 'Future Value of Money Calculator | My Wealth Circle',
    description: 'Calculate the future value of money with expected returns and inflation. Free future value calculator India.',
    keywords: 'future value of money calculator, FV calculator, time value of money India',
  },
};

// ─────────────────────────────────────────────────────────────
// Format Helpers  (pure utility — no side effects)
// ─────────────────────────────────────────────────────────────

// Format amount as Indian currency string  ₹12,34,567
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number in Indian numbering system  12,34,567
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format percentage  12.34%
export const formatPercentage = (value, decimals = 2) => {
  if (!value && value !== 0) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

// Convert large numbers to short form  ₹12.5L, ₹1.2Cr
export const formatShortCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000)   return `${sign}₹${(abs / 100000).toFixed(2)}L`;
  if (abs >= 1000)     return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  return `${sign}₹${abs}`;
};

// Convert months to "X Years Y Months" string
export const formatTenure = (totalMonths) => {
  if (!totalMonths) return '0 Months';
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months} Month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} Year${years !== 1 ? 's' : ''}`;
  return `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`;
};

// ─────────────────────────────────────────────────────────────
// Default Export  (for legacy imports that use default)
// ─────────────────────────────────────────────────────────────
export default {
  API_CONFIG,
  CALCULATOR_CATEGORIES,
  LOAN_TYPES,
  INVESTMENT_TYPES,
  GOVERNMENT_TYPES,
  BANKING_TYPES,
  SALARY_TAX_TYPES,
  BUSINESS_TAX_TYPES,
  VALUE_TOOL_TYPES,
  CURRENCY_FORMAT,
  CHART_COLORS,
  GST_RATES,
  INDIAN_STATES,
  METRO_CITIES,
  TAX_REGIMES,
  TAX_REGIME_OPTIONS,
  COMPOUNDING_OPTIONS,
  LOAN_TENURE_OPTIONS,
  SIP_TENURE_OPTIONS,
  TDS_PAYMENT_TYPES,
  ASSET_TYPES,
  BROKERAGE_SEGMENTS,
  APY_PENSION_OPTIONS,
  GOAL_TYPES,
  CALCULATOR_NAV,
  CALCULATOR_SEO,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatShortCurrency,
  formatTenure,
};