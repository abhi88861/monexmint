# Calculator Implementation Guide

This guide helps you quickly create new calculator pages when backend endpoints are ready.

## 📋 Template Structure

Every calculator page follows the same pattern:

### 1. Page Component Structure
```javascript
'use client';
import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
// Import appropriate chart component
import { apiCategory } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/constants';

export default function CalculatorPage() {
  const [formData, setFormData] = useState({
    // Initialize form fields
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle calculation submission
  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiCategory.calculateSomething(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX structure (see below)
  );
}
```

### 2. JSX Layout Pattern

```jsx
<div className={styles.page}>
  <div className={styles.container}>
    {/* Header Section */}
    <div className={styles.header}>
      <h1 className={styles.title}>Calculator Name</h1>
      <p className={styles.description}>Brief description</p>
    </div>

    {/* Main Content - Form & Results */}
    <div className={styles.content}>
      {/* Form Section */}
      <div className={styles.formSection}>
        <Card title="Input Details">
          <form onSubmit={handleCalculate}>
            {/* Input fields */}
            <Button type="submit" loading={loading}>
              Calculate
            </Button>
          </form>
        </Card>
      </div>

      {/* Results Section */}
      <div className={styles.resultsSection}>
        {result ? (
          <>
            <Card variant="gradient">
              {/* Main result display */}
            </Card>
            <Card title="Summary">
              {/* Detailed breakdown */}
              {/* Chart component */}
            </Card>
          </>
        ) : (
          <Card>
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>📊</div>
              <p>Enter details to see results</p>
            </div>
          </Card>
        )}
      </div>
    </div>

    {/* Info Card */}
    <Card>
      <h3>About This Calculator</h3>
      <p>Explanation...</p>
    </Card>
  </div>
</div>
```

## 🎯 Quick Implementation Checklist

### When Backend is Ready:

#### Step 1: Update API Client (`src/lib/apiClient.js`)
```javascript
export const newCategoryAPI = {
  calculateMethod: (data) => 
    apiClient.post(`${CALCULATOR_BASE}/category/endpoint`, data),
};
```

#### Step 2: Create Calculator Page
1. Copy template from `src/app/loans/emi/page.jsx` or `src/app/investments/sip/page.jsx`
2. Rename and modify for your use case
3. Update form fields to match backend request DTO
4. Update result display to match backend response DTO

#### Step 3: Style (Optional)
- Use existing `page.module.css` from EMI calculator
- Or create custom styles if needed

#### Step 4: Add to Homepage
Update `src/app/page.jsx` to include link to new calculator

## 📝 Example: Adding PPF Calculator

### 1. Add API Method
```javascript
// In src/lib/apiClient.js
export const governmentAPI = {
  calculatePPF: (data) => 
    apiClient.post(`${CALCULATOR_BASE}/government/ppf`, data),
};
```

### 2. Create Page File
```javascript
// src/app/government/ppf/page.jsx
'use client';
import { useState } from 'react';
import { governmentAPI } from '@/lib/apiClient';
// ... rest of imports

export default function PPFCalculator() {
  const [formData, setFormData] = useState({
    yearlyDeposit: '100000',
    tenure: '15',
    interestRate: '7.1',
  });

  const handleCalculate = async (e) => {
    e.preventDefault();
    const response = await governmentAPI.calculatePPF({
      yearlyDeposit: parseFloat(formData.yearlyDeposit),
      tenure: parseInt(formData.tenure),
      interestRate: parseFloat(formData.interestRate),
    });
    setResult(response.data);
  };

  // ... rest of component
}
```

### 3. Update Homepage
```javascript
// In src/app/page.jsx
const calculators = {
  // ... existing
  government: [
    { name: 'PPF Calculator', path: '/government/ppf', icon: '🏛️' },
    // ... more
  ],
};
```

## 🔧 Component Reusability

### UI Components Available

#### Button
```jsx
<Button 
  variant="primary|secondary|outline|danger|success"
  size="sm|md|lg"
  loading={boolean}
  fullWidth={boolean}
>
  Text
</Button>
```

#### Input
```jsx
<Input
  label="Label"
  type="number|text"
  name="fieldName"
  value={value}
  onChange={handleChange}
  prefix="₹|%"
  suffix="%|years"
  required
  min={0}
  max={100}
  step={0.1}
  helpText="Helper text"
  error="Error message"
/>
```

#### Card
```jsx
<Card 
  title="Title"
  subtitle="Subtitle"
  variant="default|gradient|success|warning|outlined"
  hoverable={boolean}
>
  Content
</Card>
```

### Chart Components Available

#### LoanPieChart
```jsx
<LoanPieChart 
  principal={1000000} 
  interest={500000} 
/>
```

#### InvestmentBarChart
```jsx
<InvestmentBarChart 
  invested={1200000} 
  returns={800000} 
/>
```

## 📊 Creating New Chart Types

When you need a different chart:

```jsx
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CustomChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#6366f1" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

## 🎨 Styling Guidelines

### Use CSS Modules
```javascript
import styles from './page.module.css';

<div className={styles.container}>
```

### Common Classes Available (from globals.css)
- `.container` - Max-width container
- `.grid`, `.grid-2`, `.grid-3` - Grid layouts
- `.card` - Card styling
- `.btn` - Button styling
- Utility classes: `.text-center`, `.mt-2`, `.mb-3`, `.flex`, etc.

### Color Variables
```css
var(--primary)
var(--secondary)
var(--success)
var(--warning)
var(--danger)
var(--text-primary)
var(--text-secondary)
var(--bg-primary)
var(--border-color)
```

## 🧪 Testing New Calculators

1. **Backend Testing**: Verify endpoint works in Postman/Swagger
2. **Frontend Testing**: 
   - Test with valid inputs
   - Test with edge cases (min/max values)
   - Test error handling (backend down, invalid data)
   - Test loading states
   - Test responsive design

## 🚀 Deployment Checklist

- [ ] All backend endpoints working
- [ ] Frontend environment variables set
- [ ] CORS configured correctly
- [ ] Error handling implemented
- [ ] Loading states working
- [ ] Responsive design tested
- [ ] SEO metadata added
- [ ] Calculations verified for accuracy

## 📱 Mobile Optimization

All pages are mobile-responsive by default. Key features:
- Grid layouts collapse to single column on mobile
- Sticky header with mobile menu
- Touch-friendly buttons and inputs
- Optimized font sizes for mobile

## 🎯 Next Steps

1. Complete backend for Government calculators
2. Complete backend for Banking calculators  
3. Complete backend for Tax calculators
4. Implement each frontend page using this template
5. Add analytics (optional)
6. Add user authentication (optional)
7. Add save/share features (optional)

---

**Quick Start**: Copy `src/app/loans/emi/page.jsx`, modify form fields and API call, done! ✅
