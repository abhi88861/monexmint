# Finance Calculators - Full Stack Application

A comprehensive Next.js frontend application integrated with Spring Boot backend for financial calculators including loans, investments, government schemes, banking, taxes, and more.

## 🎯 Features

### ✅ Implemented Calculators

#### Loan Calculators
- ✅ EMI Calculator
- ✅ Home Loan Calculator
- ✅ Car Loan Calculator
- ✅ Personal Loan Calculator
- ✅ Loan Eligibility Calculator
- ✅ Prepayment Calculator
- ✅ Flat vs Reducing Rate Calculator
- ✅ Loan Tenure Calculator

#### Investment Calculators
- ✅ SIP Calculator
- ✅ Step-up SIP Calculator
- ✅ Lumpsum Calculator
- ✅ SWP Calculator
- ✅ CAGR Calculator
- ✅ Compound Interest Calculator
- ✅ Stock Average Calculator
- ✅ XIRR Calculator
- ✅ Goal Planning Calculator

### 🔜 Coming Soon
- Government Scheme Calculators (PPF, EPF, NPS, SSY, etc.)
- Banking Calculators (FD, RD, etc.)
- Tax Calculators (Income Tax, HRA, TDS, etc.)
- Business & Tax Tools (GST, Capital Gains, etc.)

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: CSS Modules with custom design system
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios for API calls
- **Fonts**: Sora & JetBrains Mono

### Backend (Spring Boot)
- **API Gateway**: Port 8081
- **Calculator Service**: Port 8082
- **Service Discovery**: Eureka (Port 8761)
- **CORS**: Enabled for local development

## 📋 Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Java 17 or later (for backend)
- Spring Boot backend running

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finance-calculators
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8081
```

### 4. Start Backend Services

Ensure your Spring Boot backend is running:

1. Start Eureka Server (Port 8761)
2. Start API Gateway (Port 8081)
3. Start Calculator Service (Port 8082)

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
finance-calculators/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.jsx            # Root layout
│   │   ├── page.jsx              # Home page
│   │   ├── loans/                # Loan calculators
│   │   │   ├── emi/
│   │   │   ├── home-loan/
│   │   │   ├── car-loan/
│   │   │   └── ...
│   │   └── investments/          # Investment calculators
│   │       ├── sip/
│   │       ├── step-up-sip/
│   │       └── ...
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Card.jsx
│   │   ├── charts/               # Chart components
│   │   │   ├── LoanPieChart.jsx
│   │   │   └── InvestmentBarChart.jsx
│   │   └── layout/               # Layout components
│   │       └── Header.jsx
│   │
│   ├── lib/
│   │   ├── apiClient.js          # API integration
│   │   └── constants.js          # App constants & utilities
│   │
│   └── styles/
│       └── globals.css           # Global styles
│
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
└── package.json                  # Dependencies
```

## 🔌 Backend API Integration

### API Endpoints

#### Loan Calculators
```
POST /calculator/loan/emi
POST /calculator/loan/home/emi
POST /calculator/loan/car/emi
POST /calculator/loan/personal/emi
POST /calculator/loan/eligibility
POST /calculator/loan/prepayment
POST /calculator/loan/flat-vs-reducing
POST /calculator/loan/tenure
```

#### Investment Calculators
```
POST /calculator/investment/sip
POST /calculator/investment/step-up-sip
POST /calculator/investment/lumpsum
POST /calculator/investment/swp
POST /calculator/investment/cagr
POST /calculator/investment/compound-interest
POST /calculator/investment/stock-average
POST /calculator/investment/xirr
POST /calculator/investment/goal-planning
```

### API Client Usage

```javascript
import { loanAPI, investmentAPI } from '@/lib/apiClient';

// Loan EMI Calculation
const emiResponse = await loanAPI.calculateEmi({
  loanAmount: 1000000,
  rateOfInterest: 8.5,
  tenureMonths: 240
});

// SIP Calculation
const sipResponse = await investmentAPI.calculateSip({
  monthlyInvestment: 10000,
  expectedReturnRate: 12,
  tenureYears: 10
});
```

## 🎨 Design System

### Colors
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Purple)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Danger**: #ef4444 (Red)

### Typography
- **Primary Font**: Sora (Display & UI)
- **Monospace**: JetBrains Mono (Numbers & Code)

### Components
- **Button**: Multiple variants (primary, secondary, outline, danger, success)
- **Input**: With prefix/suffix support, validation states
- **Card**: Hoverable, gradient, outlined variants
- **Charts**: Pie charts, bar charts with custom tooltips

## 🛠️ Development

### Creating New Calculator Pages

1. Create a new page file in the appropriate category:
```javascript
// src/app/loans/new-calculator/page.jsx
'use client';
import { useState } from 'react';
import { loanAPI } from '@/lib/apiClient';
// ... implement calculator logic
```

2. Use existing components:
```javascript
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
```

3. Follow the established pattern for state management and API calls

### Adding New API Endpoints

Update `src/lib/apiClient.js`:

```javascript
export const newCategoryAPI = {
  calculateSomething: (data) => 
    apiClient.post(`${CALCULATOR_BASE}/new-category/endpoint`, data),
};
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint: 768px for mobile/desktop
- Sticky header navigation
- Touch-friendly UI elements

## 🧪 Testing

### Manual Testing
1. Ensure backend services are running
2. Test each calculator with various inputs
3. Verify calculations against expected results
4. Check responsive behavior on different devices

## 🚀 Production Build

```bash
npm run build
npm start
```

## 🔐 Environment Variables

Required environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8081

# Optional: For production
NEXT_PUBLIC_API_GATEWAY_URL=https://api.yourdomain.com
```

## 📝 Notes

- All monetary values are in Indian Rupees (₹)
- Interest rates are annual percentages
- Tenure inputs are validated for realistic ranges
- Error handling implemented for API failures
- Loading states for better UX

## 🤝 Backend Configuration

### CORS Setup
Your Spring Boot API Gateway should have CORS configured:

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:3000"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders:
              - "*"
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Recharts Documentation](https://recharts.org/)
- [Axios Documentation](https://axios-http.com/)

## 📄 License

[Add your license here]

## 👥 Contributing

[Add contribution guidelines if applicable]

---

**Status**: Active Development
**Frontend**: ✅ Loans & Investments Completed
**Backend Integration**: ✅ Fully Integrated
**Remaining**: Government, Banking, and Tax Calculators (Backend pending)
