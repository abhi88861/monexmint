// import axios from 'axios';

// const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8081';
// const CALCULATOR_BASE = '/calculator';

// // Log API base URL in development for debugging
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
//   console.info('[API] Base URL:', API_GATEWAY_URL);
// }

// // Create axios instance
// const apiClient = axios.create({
//   baseURL: API_GATEWAY_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000,
// });

// // Request interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     // Add any auth tokens here if needed in future
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle errors globally
//     if (error.response) {
//       console.error('API Error:', error.response.data);
//     } else if (error.request) {
//       console.error('Network Error:', error.request);
//     } else {
//       console.error('Error:', error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// // Loan Calculator APIs
// export const loanAPI = {
//   // Generic EMI
//   calculateEmi: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/loan/emi`, data),
  
//   // Home Loan EMI
//   calculateHomeLoan: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/loan/home/emi`, data),
  
//   // Car Loan EMI
//   calculateCarLoan: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/loan/car/emi`, data),
  
//   // Personal Loan EMI
//   calculatePersonalLoan: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/loan/personal/emi`, data),
  
//   // Loan Eligibility
//   calculateEligibility: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/loan/eligibility`, data),
  
//   // Prepayment
//   calculatePrepayment: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/loan/prepayment`, data),
  
//   // Flat vs Reducing
//   compareFlatVsReducing: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/loan/flat-vs-reducing`, data),
  
//   // Tenure Calculator
//   calculateTenure: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/loan/tenure`, data),

//   // Balance Transfer
//   calculateBalanceTransfer: (data) =>
//   apiClient.post('/calculator/loan/balance-transfer', data),

// };

// // Investment Calculator APIs
// export const investmentAPI = {
//   // SIP Calculator
//   calculateSip: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/investment/sip`, data),
  
//   // Step-Up SIP
//   calculateStepUpSip: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/investment/step-up-sip`, data),
  
//   // Lumpsum
//   calculateLumpsum: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/investment/lumpsum`, data),
  
//   // SWP
//   calculateSwp: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/investment/swp`, data),
  
//   // CAGR
//   calculateCagr: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/investment/cagr`, data),
  
//   // Compound Interest
//   calculateCompoundInterest: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/investment/compound-interest`, data),
  
//   // Stock Average
//   calculateStockAverage: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/investment/stock-average`, data),
  
//   // XIRR
//   calculateXirr: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/investment/xirr`, data),
  
//   // Goal Planning
//   calculateGoalPlanning: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/investment/goal-planning`, data),
//   //10
//   calculateMutualFund: (data) =>
//   apiClient.post(`${CALCULATOR_BASE}/investment/mutual-fund`, data),
//   //11
//   calculateRiskReturn: (data) =>
//   apiClient.post(`${CALCULATOR_BASE}/investment/risk-return`, data),
// };
// export const governmentAPI = {
//   calculatePPF: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/government/ppf`, data),
//    calculateEPF: (data) => 
//     apiClient.post(`${CALCULATOR_BASE}/government/epf`, data),
//    calculateNps: (data) =>
//   apiClient.post(`${CALCULATOR_BASE}/government/nps`, data),
//    calculateSsy: (data) =>
//   apiClient.post(`${CALCULATOR_BASE}/government/ssy`, data),

//    calculateApy: (data) =>
//   apiClient.post(`${CALCULATOR_BASE}/government/apy`, data),

//    calculateNsc: (data) =>
//   apiClient.post(`${CALCULATOR_BASE}/government/nsc`, data),

//    calculateKvp: (data) =>
//   apiClient.post(`${CALCULATOR_BASE}/government/kvp`, data),

//    calculateScss: (data) =>
//   apiClient.post(`${CALCULATOR_BASE}/government/scss`, data),

//    calculateMis: (data) =>
//   apiClient.post(`${CALCULATOR_BASE}/government/mis`, data),

// };

//   // Banking Calculator APIs
// export const bankingAPI = {

//   // FD Calculator
//   calculateFd: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/banking/fd`, data),

//   // RD Calculator
//   calculateRd: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/banking/rd`, data),

//   // Savings Interest Calculator
//   calculateSavingsInterest: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/banking/savings-interest`, data),

//   // Overdraft Interest Calculator
//   calculateOverdraft: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/banking/overdraft`, data),

//   // Credit Card Interest Calculator
//   calculateCreditCardInterest: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/banking/credit-card-interest`, data),

// };
// export const salaryTaxAPI = {
//   calculateSalary: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/salary-tax/salary`, data),

//   calculateHra: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/salary-tax/hra`, data),

//   calculateIncomeTax: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/salary-tax/income-tax`, data),

//   calculateGratuity: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/salary-tax/gratuity`, data),
//   calculateTds: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/salary-tax/tds`, data),

//   calculateBonus: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/salary-tax/bonus`, data),

//   calculateTakeHome: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/salary-tax/take-home`, data),
// };

//   export const businessAPI = {

//   calculateGst: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/business/gst`, data),

//   calculateBrokerage: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/business/brokerage`, data),

//   calculateCapitalGains: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/business/capital-gains`, data),

//   calculateStampDuty: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/business/stamp-duty`, data),

//   calculateProfessionalTax: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/business/professional-tax`, data),

// };

// export const inflationAPI = {

//   calculateInflation: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/inflation/inflation-rate`, data),

//   calculateRealReturn: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/inflation/real-return`, data),

//   calculateFutureValue: (data) =>
//     apiClient.post(`${CALCULATOR_BASE}/inflation/future-value`, data),

// };

// export default apiClient;
import axios from 'axios';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8081';

// Log API base URL in development for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.info('[API] Base URL:', API_GATEWAY_URL);
}

// ─────────────────────────────────────────────────────────────
// Axios Instance
// All calculator math now runs client-side in lib/calculators.js
// This file is ONLY for: Auth, User Account, Save History
// ─────────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─────────────────────────────────────────────────────────────
// Request Interceptor
// Attaches JWT token from localStorage to every request
// ─────────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('mwc_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────
// Response Interceptor
// Handles 401 (session expired), logs errors
// ─────────────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 401 — token expired or invalid, redirect to login
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mwc_token');
          localStorage.removeItem('mwc_user');
          window.location.href = '/auth/login';
        }
      }
      console.error('[API Error]', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('[Network Error]', error.request);
    } else {
      console.error('[Error]', error.message);
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────
// AUTH APIs
// POST /auth/register
// POST /auth/login
// POST /auth/logout
// POST /auth/refresh-token
// POST /auth/forgot-password
// POST /auth/reset-password
// GET  /auth/me
// ─────────────────────────────────────────────────────────────
export const authAPI = {

  // Register new user
  register: (data) =>
    apiClient.post('/auth/register', data),

  // Login — returns JWT token
  login: (data) =>
    apiClient.post('/auth/login', data),

  // Logout — invalidate token on server
  logout: () =>
    apiClient.post('/auth/logout'),

  // Refresh JWT token before expiry
  refreshToken: () =>
    apiClient.post('/auth/refresh-token'),

  // Send forgot password email
  forgotPassword: (data) =>
    apiClient.post('/auth/forgot-password', data),

  // Reset password with token from email
  resetPassword: (data) =>
    apiClient.post('/auth/reset-password', data),

  // Get current logged-in user profile
  getMe: () =>
    apiClient.get('/auth/me'),

};

// ─────────────────────────────────────────────────────────────
// USER ACCOUNT APIs
// GET    /account/profile
// PUT    /account/profile
// PUT    /account/change-password
// DELETE /account/delete
// ─────────────────────────────────────────────────────────────
export const accountAPI = {

  // Get user profile details
  getProfile: () =>
    apiClient.get('/account/profile'),

  // Update user profile (name, phone, preferences)
  updateProfile: (data) =>
    apiClient.put('/account/profile', data),

  // Change password (requires current password)
  changePassword: (data) =>
    apiClient.put('/account/change-password', data),

  // Delete account permanently
  deleteAccount: () =>
    apiClient.delete('/account/delete'),

};

// ─────────────────────────────────────────────────────────────
// CALCULATION HISTORY APIs  (optional — save results for logged-in users)
// GET    /history
// POST   /history
// DELETE /history/:id
// DELETE /history  (clear all)
// ─────────────────────────────────────────────────────────────
export const historyAPI = {

  // Get saved calculation history for current user
  getHistory: (params) =>
    apiClient.get('/history', { params }),

  // Save a calculation result
  // data: { calculatorType, inputs, results, label }
  saveCalculation: (data) =>
    apiClient.post('/history', data),

  // Delete one saved calculation by ID
  deleteCalculation: (id) =>
    apiClient.delete(`/history/${id}`),

  // Clear all history for current user
  clearAllHistory: () =>
    apiClient.delete('/history'),

};

// ─────────────────────────────────────────────────────────────
// CONTACT / FEEDBACK API  (optional)
// POST /contact
// ─────────────────────────────────────────────────────────────
export const contactAPI = {

  // Submit contact form or feedback
  sendMessage: (data) =>
    apiClient.post('/contact', data),

};

export default apiClient;