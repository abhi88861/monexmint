
export function formatIndianCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '0';
  const num = Math.round(amount);
  const str = String(Math.abs(num));
  let result = '';
  if (str.length <= 3) {
    result = str;
  } else {
    result = str.slice(-3);
    let remaining = str.slice(0, -3);
    while (remaining.length > 2) {
      result = remaining.slice(-2) + ',' + result;
      remaining = remaining.slice(0, -2);
    }
    result = remaining + ',' + result;
  }
  return num < 0 ? '-' + result : result;
}

/**
 * Convert months to human-readable string e.g. 26 → "2 Years 2 Months"
 */
export function monthsToYearsMonths(totalMonths) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months} Month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} Year${years !== 1 ? 's' : ''}`;
  return `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`;
}

/**
 * Build a full amortisation schedule for a loan
 * Returns array of { month, emi, principal, interest, balance }
 */
export function buildAmortisationSchedule(principal, annualRate, tenureMonths) {
  const r = annualRate / 100 / 12;
  let balance = principal;
  const schedule = [];

  const emi =
    r === 0
      ? principal / tenureMonths
      : (principal * r * Math.pow(1 + r, tenureMonths)) /
        (Math.pow(1 + r, tenureMonths) - 1);

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    schedule.push({
      month,
      emi: Math.round(emi * 100) / 100,
      principal: Math.round(principalPaid * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }
  return schedule;
}


// ═══════════════════════════════════════════════════════════════
// CATEGORY 1 — 🏦 LOAN CALCULATORS
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 1. EMI Calculator
//    Formula: EMI = [P × R × (1+R)^N] / [(1+R)^N − 1]
//    P = Principal, R = Monthly Rate, N = Tenure in months
// ─────────────────────────────────────────────────────────────
export function calculateEMI(principal, annualRate, tenureMonths) {
  if (!principal || principal <= 0 || !tenureMonths || tenureMonths <= 0) {
    return { emi: 0, totalInterest: 0, totalPayable: 0, principal: 0, tenureMonths: 0 };
  }

  const r = annualRate / 100 / 12;
  let emi;

  if (r === 0) {
    emi = principal / tenureMonths;
  } else {
    emi =
      (principal * r * Math.pow(1 + r, tenureMonths)) /
      (Math.pow(1 + r, tenureMonths) - 1);
  }

  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principal;

  return {
    emi: Math.round(emi * 100) / 100,
    principal,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
    tenureMonths,
    schedule: buildAmortisationSchedule(principal, annualRate, tenureMonths),
  };
}

// ─────────────────────────────────────────────────────────────
// 2. Home Loan EMI
//    Same EMI formula but with home-loan-specific outputs:
//    LTV check, stamp duty estimate, processing fee
// ─────────────────────────────────────────────────────────────
export function calculateHomeLoanEMI(
  propertyValue,
  downPaymentPercent,
  annualRate,
  tenureYears,
  processingFeePercent = 0.5
) {
  const downPayment = (propertyValue * downPaymentPercent) / 100;
  const loanAmount = propertyValue - downPayment;
  const tenureMonths = tenureYears * 12;
  const base = calculateEMI(loanAmount, annualRate, tenureMonths);
  const processingFee = (loanAmount * processingFeePercent) / 100;
  const ltv = (loanAmount / propertyValue) * 100;

  return {
    ...base,
    propertyValue,
    downPayment: Math.round(downPayment),
    loanAmount: Math.round(loanAmount),
    processingFee: Math.round(processingFee),
    ltvPercent: Math.round(ltv * 100) / 100,
    tenureYears,
  };
}

// ─────────────────────────────────────────────────────────────
// 3. Car Loan EMI
//    Includes on-road price, insurance, RTO charges
// ─────────────────────────────────────────────────────────────
export function calculateCarLoanEMI(
  exShowroomPrice,
  downPaymentAmount,
  annualRate,
  tenureYears,
  insuranceAmount = 0,
  rtoPercent = 9
) {
  const rtoCharges = (exShowroomPrice * rtoPercent) / 100;
  const onRoadPrice = exShowroomPrice + rtoCharges + insuranceAmount;
  const loanAmount = onRoadPrice - downPaymentAmount;
  const tenureMonths = tenureYears * 12;
  const base = calculateEMI(Math.max(0, loanAmount), annualRate, tenureMonths);

  return {
    ...base,
    exShowroomPrice,
    rtoCharges: Math.round(rtoCharges),
    insuranceAmount,
    onRoadPrice: Math.round(onRoadPrice),
    downPaymentAmount,
    loanAmount: Math.round(Math.max(0, loanAmount)),
    tenureYears,
  };
}

// ─────────────────────────────────────────────────────────────
// 4. Personal Loan EMI
//    Unsecured loan — higher rates, shorter tenure
//    Also calculates effective APR including processing fee
// ─────────────────────────────────────────────────────────────
export function calculatePersonalLoanEMI(
  loanAmount,
  annualRate,
  tenureMonths,
  processingFeePercent = 2
) {
  const base = calculateEMI(loanAmount, annualRate, tenureMonths);
  const processingFee = (loanAmount * processingFeePercent) / 100;
  const netDisbursed = loanAmount - processingFee;

  // Effective APR: find rate such that PV of EMIs = net disbursed
  // Approximate using Newton-Raphson (5 iterations sufficient)
  let guessRate = annualRate / 100 / 12;
  for (let i = 0; i < 10; i++) {
    const pv =
      (base.emi * (1 - Math.pow(1 + guessRate, -tenureMonths))) / guessRate;
    const f = pv - netDisbursed;
    const df =
      (base.emi *
        (tenureMonths * Math.pow(1 + guessRate, -(tenureMonths + 1)) * guessRate -
          (1 - Math.pow(1 + guessRate, -tenureMonths)))) /
      (guessRate * guessRate);
    guessRate = guessRate - f / df;
    if (isNaN(guessRate)) { guessRate = annualRate / 100 / 12; break; }
  }

  const effectiveAPR = Math.round(guessRate * 12 * 100 * 100) / 100;

  return {
    ...base,
    processingFee: Math.round(processingFee),
    netDisbursed: Math.round(netDisbursed),
    effectiveAPR,
  };
}

// ─────────────────────────────────────────────────────────────
// 5. Flat vs Reducing Interest Rate
//    Flat:      EMI = (P + P×r×N) / (N×12)
//    Reducing:  Standard EMI formula
//    Flat-to-Reducing equivalent rate via iteration
// ─────────────────────────────────────────────────────────────
export function calculateFlatVsReducing(principal, flatRate, tenureYears) {
  const tenureMonths = tenureYears * 12;

  // Flat EMI
  const totalFlatInterest = principal * (flatRate / 100) * tenureYears;
  const flatEMI = (principal + totalFlatInterest) / tenureMonths;

  // Find reducing rate that gives same EMI (bisection search)
  let lo = 0, hi = flatRate * 3, reducingRate = flatRate;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const r = mid / 100 / 12;
    const emi =
      (principal * r * Math.pow(1 + r, tenureMonths)) /
      (Math.pow(1 + r, tenureMonths) - 1);
    if (emi < flatEMI) lo = mid;
    else hi = mid;
    reducingRate = mid;
  }

  const reducingResult = calculateEMI(principal, reducingRate, tenureMonths);

  return {
    flatRate,
    flatEMI: Math.round(flatEMI * 100) / 100,
    flatTotalInterest: Math.round(totalFlatInterest * 100) / 100,
    flatTotalPayable: Math.round((principal + totalFlatInterest) * 100) / 100,
    equivalentReducingRate: Math.round(reducingRate * 100) / 100,
    reducingEMI: reducingResult.emi,
    reducingTotalInterest: reducingResult.totalInterest,
    reducingTotalPayable: reducingResult.totalPayable,
    interestDifference: Math.round(
      (totalFlatInterest - reducingResult.totalInterest) * 100
    ) / 100,
    principal,
    tenureMonths,
  };
}

// ─────────────────────────────────────────────────────────────
// 6. Loan Eligibility Calculator
//    Based on FOIR (Fixed Obligation to Income Ratio)
//    Max Loan = (Gross Income × FOIR% − Existing EMIs) / EMI-per-₹1
// ─────────────────────────────────────────────────────────────
export function calculateLoanEligibility(
  monthlyIncome,
  foirPercent,
  existingEMI,
  annualRate,
  tenureMonths
) {
  if (monthlyIncome <= 0 || foirPercent <= 0) {
    return { eligibleAmount: 0, maxEMI: 0 };
  }

  const maxEMI = (monthlyIncome * foirPercent) / 100 - (existingEMI || 0);
  if (maxEMI <= 0) return { eligibleAmount: 0, maxEMI: 0 };

  // EMI for ₹1 lakh at given rate & tenure
  const emiPerLakh = calculateEMI(100000, annualRate, tenureMonths).emi;
  const eligibleAmount = Math.floor((maxEMI / emiPerLakh) * 100000);

  return {
    eligibleAmount: Math.max(0, Math.min(eligibleAmount, 100000000)),
    maxEMI: Math.round(maxEMI * 100) / 100,
    foirPercent,
    monthlyIncome,
    existingEMI: existingEMI || 0,
    annualRate,
    tenureMonths,
  };
}

// ─────────────────────────────────────────────────────────────
// 7. Prepayment / Foreclosure Calculator
//    Simulates month-by-month balance, applies prepayment at given month
//    Returns interest saved and new tenure
// ─────────────────────────────────────────────────────────────
export function calculatePrepayment(
  principal,
  annualRate,
  tenureMonths,
  prepaymentAmount,
  prepaymentMonth
) {
  const r = annualRate / 100 / 12;
  const emi = calculateEMI(principal, annualRate, tenureMonths).emi;
  let balance = principal;
  let totalPaid = 0;
  let month = 0;

  // Simulate with prepayment
  while (balance > 1 && month < tenureMonths * 2) {
    month++;
    const interest = balance * r;
    const principalPaid = Math.min(emi - interest, balance);
    balance -= principalPaid;
    totalPaid += Math.min(emi, balance + emi); // guard

    if (month === prepaymentMonth && prepaymentAmount > 0) {
      const actualPrepay = Math.min(prepaymentAmount, balance);
      balance -= actualPrepay;
      totalPaid += actualPrepay;
    }
    if (balance <= 1) break;
  }

  const normalTotalPayable = emi * tenureMonths;
  const normalTotalInterest = normalTotalPayable - principal;
  const newTotalInterest = Math.max(0, totalPaid - principal - prepaymentAmount);
  const interestSaved = Math.max(0, normalTotalInterest - newTotalInterest);
  const monthsSaved = Math.max(0, tenureMonths - month);

  return {
    emi: Math.round(emi * 100) / 100,
    newTenureMonths: month,
    monthsSaved,
    interestSaved: Math.round(interestSaved * 100) / 100,
    normalTotalInterest: Math.round(normalTotalInterest * 100) / 100,
    newTotalInterest: Math.round(newTotalInterest * 100) / 100,
    totalAmountPaid: Math.round(totalPaid * 100) / 100,
  };
}

// ─────────────────────────────────────────────────────────────
// 8. Loan Tenure Calculator
//    Given a desired EMI, find how many months are needed
//    N = −ln(1 − P×r/EMI) / ln(1+r)
// ─────────────────────────────────────────────────────────────
export function calculateLoanTenure(principal, annualRate, desiredEMI) {
  if (principal <= 0 || desiredEMI <= 0) return null;
  const r = annualRate / 100 / 12;

  if (r === 0) {
    const months = Math.ceil(principal / desiredEMI);
    return {
      tenureMonths: months,
      tenureYears: Math.floor(months / 12),
      remainingMonths: months % 12,
      emi: desiredEMI,
      totalPayable: Math.round(desiredEMI * months * 100) / 100,
      totalInterest: 0,
    };
  }

  if (desiredEMI <= principal * r) {
    return { error: 'EMI too low to cover monthly interest. Please increase EMI.' };
  }

  const tenureMonths = Math.ceil(
    -Math.log(1 - (principal * r) / desiredEMI) / Math.log(1 + r)
  );
  const totalPayable = desiredEMI * tenureMonths;
  const totalInterest = totalPayable - principal;

  return {
    tenureMonths,
    tenureYears: Math.floor(tenureMonths / 12),
    remainingMonths: tenureMonths % 12,
    emi: desiredEMI,
    totalPayable: Math.round(totalPayable * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    principal,
  };
}

// ─────────────────────────────────────────────────────────────
// 9. Balance Transfer Calculator  (Loan Balance Transfer)
//    Compare cost of staying vs switching lender
//    Includes processing fee of new lender
// ─────────────────────────────────────────────────────────────
export function calculateBalanceTransfer(
  outstandingPrincipal,
  currentRate,
  newRate,
  remainingMonths,
  transferFeePercent = 1
) {
  // Current lender — continue paying
  const currentEMI = calculateEMI(outstandingPrincipal, currentRate, remainingMonths).emi;
  const currentTotal = currentEMI * remainingMonths;
  const currentInterest = currentTotal - outstandingPrincipal;

  // New lender — after transfer fee
  const transferFee = (outstandingPrincipal * transferFeePercent) / 100;
  const newLoanAmount = outstandingPrincipal + transferFee;
  const newEMI = calculateEMI(newLoanAmount, newRate, remainingMonths).emi;
  const newTotal = newEMI * remainingMonths;
  const newInterest = newTotal - newLoanAmount;

  const savings = currentTotal - newTotal;
  const breakEvenMonth = savings > 0 ? Math.ceil(transferFee / (currentEMI - newEMI)) : null;

  return {
    currentEMI: Math.round(currentEMI * 100) / 100,
    currentTotal: Math.round(currentTotal * 100) / 100,
    currentInterest: Math.round(currentInterest * 100) / 100,
    newEMI: Math.round(newEMI * 100) / 100,
    newTotal: Math.round(newTotal * 100) / 100,
    newInterest: Math.round(newInterest * 100) / 100,
    transferFee: Math.round(transferFee * 100) / 100,
    totalSavings: Math.round(savings * 100) / 100,
    breakEvenMonth,
    worthTransferring: savings > 0,
  };
}


// ═══════════════════════════════════════════════════════════════
// CATEGORY 2 — 📈 INVESTMENT & WEALTH CALCULATORS
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 1. SIP Calculator
//    FV = P × [((1+r)^n − 1) / r] × (1+r)
//    Beginning-of-period SIP (most common)
// ─────────────────────────────────────────────────────────────
export function calculateSIP(monthlyInvestment, annualReturnRate, tenureYears) {
  if (monthlyInvestment <= 0 || tenureYears <= 0) {
    return { maturityValue: 0, totalInvested: 0, totalReturns: 0 };
  }
  const r = annualReturnRate / 100 / 12;
  const n = tenureYears * 12;
  const totalInvested = monthlyInvestment * n;

  let maturityValue;
  if (r === 0) {
    maturityValue = totalInvested;
  } else {
    maturityValue =
      monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  }

  const totalReturns = maturityValue - totalInvested;
  const absoluteReturn = (totalReturns / totalInvested) * 100;

  return {
    maturityValue: Math.round(maturityValue * 100) / 100,
    totalInvested,
    totalReturns: Math.round(totalReturns * 100) / 100,
    absoluteReturn: Math.round(absoluteReturn * 100) / 100,
    wealthRatio: Math.round((maturityValue / totalInvested) * 100) / 100,
  };
}

// ─────────────────────────────────────────────────────────────
// 2. Step-Up SIP Calculator  (Annual increment in SIP amount)
//    Simulates year-by-year with increasing monthly SIP
// ─────────────────────────────────────────────────────────────
export function calculateStepUpSIP(
  initialMonthlyInvestment,
  annualReturnRate,
  tenureYears,
  annualStepUpPercent
) {
  const r = annualReturnRate / 100 / 12;
  let corpus = 0;
  let totalInvested = 0;
  let currentSIP = initialMonthlyInvestment;

  for (let year = 0; year < tenureYears; year++) {
    for (let month = 0; month < 12; month++) {
      corpus = (corpus + currentSIP) * (1 + r);
      totalInvested += currentSIP;
    }
    currentSIP = currentSIP * (1 + annualStepUpPercent / 100);
  }

  const totalReturns = corpus - totalInvested;

  return {
    maturityValue: Math.round(corpus * 100) / 100,
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalReturns: Math.round(totalReturns * 100) / 100,
    finalMonthlyInvestment: Math.round(currentSIP * 100) / 100,
    absoluteReturn: Math.round((totalReturns / totalInvested) * 100 * 100) / 100,
  };
}

// ─────────────────────────────────────────────────────────────
// 3. Lumpsum Calculator
//    FV = P × (1 + r)^n
// ─────────────────────────────────────────────────────────────
export function calculateLumpsum(principal, annualReturnRate, tenureYears) {
  if (principal <= 0 || tenureYears <= 0) {
    return { maturityValue: 0, totalInvested: 0, totalReturns: 0 };
  }
  const maturityValue = principal * Math.pow(1 + annualReturnRate / 100, tenureYears);
  const totalReturns = maturityValue - principal;

  return {
    maturityValue: Math.round(maturityValue * 100) / 100,
    totalInvested: principal,
    totalReturns: Math.round(totalReturns * 100) / 100,
    absoluteReturn: Math.round((totalReturns / principal) * 100 * 100) / 100,
    wealthRatio: Math.round((maturityValue / principal) * 100) / 100,
  };
}

// ─────────────────────────────────────────────────────────────
// 4. SWP — Systematic Withdrawal Plan
//    Each month: corpus grows by r, then withdrawal is deducted
//    Also calculates sustainable monthly withdrawal (so corpus never depletes)
// ─────────────────────────────────────────────────────────────
export function calculateSWP(
  initialCorpus,
  monthlyWithdrawal,
  annualReturnRate,
  tenureYears
) {
  const r = annualReturnRate / 100 / 12;
  const n = tenureYears * 12;
  let balance = initialCorpus;
  let totalWithdrawn = 0;
  let monthsSustained = 0;

  for (let m = 0; m < n; m++) {
    balance = balance * (1 + r);
    if (balance <= 0) break;
    const withdrawal = Math.min(monthlyWithdrawal, balance);
    balance -= withdrawal;
    totalWithdrawn += withdrawal;
    monthsSustained++;
    if (balance <= 0) break;
  }

  // Sustainable withdrawal: SWP that preserves corpus = corpus × r (simplified)
  const sustainableMonthly = r > 0 ? Math.round(initialCorpus * r * 100) / 100 : 0;

  return {
    finalCorpus: Math.round(Math.max(0, balance) * 100) / 100,
    totalWithdrawn: Math.round(totalWithdrawn * 100) / 100,
    monthsSustained,
    fullyDepleted: balance <= 0,
    sustainableMonthlyWithdrawal: sustainableMonthly,
  };
}

// ─────────────────────────────────────────────────────────────
// 5. CAGR Calculator
//    CAGR = (FV / PV)^(1/n) − 1
// ─────────────────────────────────────────────────────────────
export function calculateCAGR(presentValue, futureValue, tenureYears) {
  if (presentValue <= 0 || tenureYears <= 0) return { cagr: 0 };
  const cagr = (Math.pow(futureValue / presentValue, 1 / tenureYears) - 1) * 100;
  const absoluteReturn = ((futureValue - presentValue) / presentValue) * 100;

  return {
    cagr: Math.round(cagr * 100) / 100,
    absoluteReturn: Math.round(absoluteReturn * 100) / 100,
    presentValue,
    futureValue,
    gain: Math.round(futureValue - presentValue),
  };
}

// ─────────────────────────────────────────────────────────────
// 6. Compound Interest Calculator
//    A = P × (1 + r/n)^(n×t)
//    Supports different compounding frequencies
// ─────────────────────────────────────────────────────────────
export function calculateCompoundInterest(
  principal,
  annualRate,
  tenureYears,
  compoundingFrequency = 12   // 1=Annual, 2=Half-yearly, 4=Quarterly, 12=Monthly, 365=Daily
) {
  if (principal <= 0 || tenureYears <= 0) {
    return { maturityAmount: 0, totalInterest: 0 };
  }
  const n = compoundingFrequency;
  const r = annualRate / 100;
  const maturityAmount = principal * Math.pow(1 + r / n, n * tenureYears);
  const totalInterest = maturityAmount - principal;
  const effectiveAnnualRate =
    (Math.pow(1 + r / n, n) - 1) * 100;

  return {
    maturityAmount: Math.round(maturityAmount * 100) / 100,
    principal,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveAnnualRate: Math.round(effectiveAnnualRate * 100) / 100,
    absoluteReturn: Math.round((totalInterest / principal) * 100 * 100) / 100,
  };
}

// ─────────────────────────────────────────────────────────────
// 7. Stock Average Calculator  (Buy More to Lower Average)
//    Weighted average price across multiple purchases
// ─────────────────────────────────────────────────────────────
export function calculateStockAverage(trades) {
  // trades: [{ quantity: number, price: number }, ...]
  if (!trades || trades.length === 0) return { averagePrice: 0, totalQuantity: 0, totalCost: 0 };

  const validTrades = trades.filter(t => t.quantity > 0 && t.price > 0);
  if (validTrades.length === 0) return { averagePrice: 0, totalQuantity: 0, totalCost: 0 };

  const totalQuantity = validTrades.reduce((sum, t) => sum + t.quantity, 0);
  const totalCost = validTrades.reduce((sum, t) => sum + t.quantity * t.price, 0);
  const averagePrice = totalCost / totalQuantity;

  return {
    averagePrice: Math.round(averagePrice * 100) / 100,
    totalQuantity,
    totalCost: Math.round(totalCost * 100) / 100,
    trades: validTrades.map(t => ({
      quantity: t.quantity,
      price: t.price,
      investment: Math.round(t.quantity * t.price * 100) / 100,
      weightPercent: Math.round(((t.quantity * t.price) / totalCost) * 100 * 100) / 100,
    })),
  };
}

// ─────────────────────────────────────────────────────────────
// 8. XIRR Calculator
//    Extended Internal Rate of Return for irregular cash flows
//    Uses Newton-Raphson iteration on XNPV
//    cashFlows: [{ date: Date, amount: number }]  (negative = investment, positive = return)
// ─────────────────────────────────────────────────────────────
export function calculateXIRR(cashFlows, guess = 0.1) {
  if (!cashFlows || cashFlows.length < 2) return { xirr: null, error: 'Need at least 2 cash flows' };

  const dates = cashFlows.map(cf => new Date(cf.date));
  const amounts = cashFlows.map(cf => cf.amount);
  const t0 = dates[0];

  // Days between date and first date
  const dayDiff = (d) => (d - t0) / (1000 * 60 * 60 * 24);

  function xnpv(rate) {
    return amounts.reduce((sum, amount, i) => {
      return sum + amount / Math.pow(1 + rate, dayDiff(dates[i]) / 365);
    }, 0);
  }

  function xnpvDerivative(rate) {
    return amounts.reduce((sum, amount, i) => {
      const days = dayDiff(dates[i]);
      return sum - (days / 365) * amount / Math.pow(1 + rate, days / 365 + 1);
    }, 0);
  }

  let rate = guess;
  for (let i = 0; i < 100; i++) {
    const npv = xnpv(rate);
    const dnpv = xnpvDerivative(rate);
    if (Math.abs(dnpv) < 1e-12) break;
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < 1e-8) {
      rate = newRate;
      break;
    }
    rate = newRate;
    if (rate <= -1) rate = -0.999;
  }

  const finalNPV = xnpv(rate);
  if (Math.abs(finalNPV) > 1) {
    return { xirr: null, error: 'Could not converge. Check cash flows.' };
  }

  return {
    xirr: Math.round(rate * 10000) / 100,  // as percentage
    xirrDecimal: Math.round(rate * 100000) / 100000,
  };
}

// ─────────────────────────────────────────────────────────────
// 9. Goal Planning Calculator
//    "How much SIP do I need to reach a goal?"
//    Supports: education, house, retirement, marriage, travel
// ─────────────────────────────────────────────────────────────
export function calculateGoalPlanning(
  targetAmount,
  currentSavings,
  annualReturnRate,
  tenureYears,
  inflationRate = 0
) {
  // Inflation-adjust the target
  const inflationAdjustedTarget =
    inflationRate > 0
      ? targetAmount * Math.pow(1 + inflationRate / 100, tenureYears)
      : targetAmount;

  // Future value of current savings
  const fvCurrentSavings =
    currentSavings * Math.pow(1 + annualReturnRate / 100, tenureYears);

  // Remaining corpus needed from SIP
  const remainingCorpus = Math.max(0, inflationAdjustedTarget - fvCurrentSavings);

  // Required monthly SIP
  const r = annualReturnRate / 100 / 12;
  const n = tenureYears * 12;
  let requiredSIP = 0;

  if (remainingCorpus > 0) {
    if (r === 0) {
      requiredSIP = remainingCorpus / n;
    } else {
      requiredSIP = (remainingCorpus * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
    }
  }

  // Also calculate required lumpsum today
  const requiredLumpsum =
    remainingCorpus > 0
      ? remainingCorpus / Math.pow(1 + annualReturnRate / 100, tenureYears)
      : 0;

  return {
    targetAmount,
    inflationAdjustedTarget: Math.round(inflationAdjustedTarget),
    currentSavings,
    fvCurrentSavings: Math.round(fvCurrentSavings),
    remainingCorpus: Math.round(remainingCorpus),
    requiredMonthlySIP: Math.round(requiredSIP * 100) / 100,
    requiredLumpsumToday: Math.round(requiredLumpsum * 100) / 100,
    tenureYears,
    annualReturnRate,
  };
}
// ═══════════════════════════════════════════════════════════════
// ADD THESE FUNCTIONS TO YOUR lib/calculators.js FILE
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// Mutual Fund Returns Calculator
// Calculates absolute return, CAGR, and compares with index
// ─────────────────────────────────────────────────────────────
export function calculateMutualFund(
  investedAmount,
  currentValue,
  investmentDate,
  redemptionDate,
  benchmarkReturnPercent = 12
) {
  const start = new Date(investmentDate);
  const end = new Date(redemptionDate);
  const daysDiff = (end - start) / (1000 * 60 * 60 * 24);
  const years = daysDiff / 365;

  const absoluteReturn = currentValue - investedAmount;
  const absoluteReturnPercent = (absoluteReturn / investedAmount) * 100;

  const cagr = years > 0
    ? (Math.pow(currentValue / investedAmount, 1 / years) - 1) * 100
    : 0;

  const benchmarkValue = investedAmount * Math.pow(1 + benchmarkReturnPercent / 100, years);
  const outperformance = cagr - benchmarkReturnPercent;

  return {
    investedAmount,
    currentValue,
    absoluteReturn: Math.round(absoluteReturn),
    absoluteReturnPercent: Math.round(absoluteReturnPercent * 100) / 100,
    cagr: Math.round(cagr * 100) / 100,
    years: Math.round(years * 100) / 100,
    daysDiff: Math.round(daysDiff),
    benchmarkReturn: benchmarkReturnPercent,
    benchmarkValue: Math.round(benchmarkValue),
    outperformance: Math.round(outperformance * 100) / 100,
    performanceSummary: cagr > benchmarkReturnPercent ? 'Outperforming' : 'Underperforming',
  };
}

// ─────────────────────────────────────────────────────────────
// Risk-Return Calculator
// Analyzes investment with nominal return, inflation, and risk
// ─────────────────────────────────────────────────────────────
export function calculateRiskReturn(
  investmentAmount,
  nominalReturn,
  inflationRate,
  tenureYears
) {
  const realReturn = ((1 + nominalReturn / 100) / (1 + inflationRate / 100) - 1) * 100;
  
  const nominalValue = investmentAmount * Math.pow(1 + nominalReturn / 100, tenureYears);
  const realValue = investmentAmount * Math.pow(1 + realReturn / 100, tenureYears);
  
  const nominalGain = nominalValue - investmentAmount;
  const inflationLoss = nominalValue - realValue;
  const realGain = realValue - investmentAmount;

  // Risk-adjusted metrics
  const sharpeRatio = realReturn > 0 ? realReturn / 15 : 0; // Assuming 15% volatility
  const riskCategory = 
    realReturn >= 12 ? 'High Return, High Risk' :
    realReturn >= 8 ? 'Moderate Return, Moderate Risk' :
    realReturn >= 4 ? 'Low Return, Low Risk' : 'Below Inflation';

  return {
    investmentAmount,
    nominalReturn,
    inflationRate,
    realReturn: Math.round(realReturn * 100) / 100,
    tenureYears,
    nominalValue: Math.round(nominalValue),
    realValue: Math.round(realValue),
    nominalGain: Math.round(nominalGain),
    realGain: Math.round(realGain),
    inflationLoss: Math.round(inflationLoss),
    purchasingPowerGain: Math.round((realGain / investmentAmount) * 100 * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    riskCategory,
  };
}


// ═══════════════════════════════════════════════════════════════
// CATEGORY 3 — 🏛️ GOVERNMENT SAVINGS & PENSION SCHEMES (INDIA)
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 1. PPF — Public Provident Fund
//    15-year lock-in, extendable in 5-year blocks
//    Interest credited annually at year end
//    Rate: 7.1% p.a. (as of FY2024-25, subject to quarterly revision)
// ─────────────────────────────────────────────────────────────
export function calculatePPF(
  yearlyDeposit,
  tenureYears = 15,
  annualRate = 7.1
) {
  if (yearlyDeposit < 500 || yearlyDeposit > 150000) {
    return { error: 'PPF deposit must be between ₹500 and ₹1,50,000 per year.' };
  }

  const r = annualRate / 100;
  let balance = 0;
  const yearlyBreakdown = [];

  for (let year = 1; year <= tenureYears; year++) {
    const openingBalance = balance;
    balance = (balance + yearlyDeposit) * (1 + r);
    yearlyBreakdown.push({
      year,
      deposit: yearlyDeposit,
      openingBalance: Math.round(openingBalance),
      interestEarned: Math.round(balance - openingBalance - yearlyDeposit),
      closingBalance: Math.round(balance),
    });
  }

  const totalDeposited = yearlyDeposit * tenureYears;
  const totalInterest = balance - totalDeposited;

  return {
    maturityValue: Math.round(balance),
    totalDeposited,
    totalInterest: Math.round(totalInterest),
    tenureYears,
    annualRate,
    yearlyBreakdown,
  };
}

// ─────────────────────────────────────────────────────────────
// 2. EPF — Employee Provident Fund
//    Employee: 12% of Basic+DA  | Employer: 3.67% to PF, 8.33% to EPS
//    Interest: 8.25% p.a. (FY2023-24), compounded monthly, credited annually
// ─────────────────────────────────────────────────────────────
export function calculateEPF(
  monthlyBasicPlusDa,
  employeeContributionPercent = 12,
  currentCorpus = 0,
  tenureYears = 30,
  annualRate = 8.25
) {
  const employerPFPercent = 3.67; // rest goes to EPS
  const monthlyEmployeeContrib = (monthlyBasicPlusDa * employeeContributionPercent) / 100;
  const monthlyEmployerContrib = (monthlyBasicPlusDa * employerPFPercent) / 100;
  const totalMonthlyContrib = monthlyEmployeeContrib + monthlyEmployerContrib;

  const result = calculateSIP(totalMonthlyContrib, annualRate, tenureYears);
  const corpusFV = currentCorpus * Math.pow(1 + annualRate / 100, tenureYears);

  return {
    ...result,
    monthlyEmployeeContrib: Math.round(monthlyEmployeeContrib * 100) / 100,
    monthlyEmployerContrib: Math.round(monthlyEmployerContrib * 100) / 100,
    totalMonthlyContrib: Math.round(totalMonthlyContrib * 100) / 100,
    existingCorpusFV: Math.round(corpusFV),
    grandMaturity: Math.round(result.maturityValue + corpusFV),
    annualRate,
  };
}

// ─────────────────────────────────────────────────────────────
// 3. NPS — National Pension Scheme
//    Accumulation phase: SIP calculation
//    At maturity: min 40% must be used for annuity
// ─────────────────────────────────────────────────────────────
export function calculateNPS(
  monthlyContribution,
  annualReturnRate,
  currentAge,
  retirementAge = 60,
  annuityPercent = 40,
  annuityRate = 6
) {
  const tenureYears = retirementAge - currentAge;
  if (tenureYears <= 0) return { error: 'Retirement age must be greater than current age.' };

  const sipResult = calculateSIP(monthlyContribution, annualReturnRate, tenureYears);
  const maturity = sipResult.maturityValue;

  const annuityCorpus = (maturity * annuityPercent) / 100;
  const lumpsumWithdrawal = maturity - annuityCorpus;
  const monthlyPension = (annuityCorpus * annuityRate) / 100 / 12;

  return {
    maturityValue: Math.round(maturity),
    totalInvested: sipResult.totalInvested,
    totalReturns: sipResult.totalReturns,
    annuityCorpus: Math.round(annuityCorpus),
    lumpsumWithdrawal: Math.round(lumpsumWithdrawal),
    estimatedMonthlyPension: Math.round(monthlyPension),
    tenureYears,
    annualReturnRate,
    annuityPercent,
    annuityRate,
  };
}

// ─────────────────────────────────────────────────────────────
// 4. SSY — Sukanya Samriddhi Yojana
//    Deposits for first 15 years, matures at 21 years from opening
//    Rate: 8.2% p.a. (FY2024-25)
//    Min ₹250 / Max ₹1,50,000 per year
// ─────────────────────────────────────────────────────────────
export function calculateSSY(
  yearlyDeposit,
  girlCurrentAge,
  annualRate = 8.2
) {
  if (yearlyDeposit < 250 || yearlyDeposit > 150000) {
    return { error: 'SSY deposit must be between ₹250 and ₹1,50,000 per year.' };
  }
  if (girlCurrentAge > 10) {
    return { error: 'Account can only be opened for girls below age 10.' };
  }

  const accountOpeningAge = girlCurrentAge;
  const depositYears = 15;
  const maturityAge = 21;
  const totalTenure = maturityAge - accountOpeningAge;
  const r = annualRate / 100;

  let balance = 0;
  const yearlyBreakdown = [];

  for (let year = 1; year <= totalTenure; year++) {
    const deposit = year <= depositYears ? yearlyDeposit : 0;
    const openingBalance = balance;
    balance = (balance + deposit) * (1 + r);
    yearlyBreakdown.push({
      year,
      girlAge: accountOpeningAge + year,
      deposit,
      interest: Math.round(balance - openingBalance - deposit),
      closingBalance: Math.round(balance),
    });
  }

  const totalDeposited = yearlyDeposit * depositYears;

  return {
    maturityValue: Math.round(balance),
    totalDeposited,
    totalInterest: Math.round(balance - totalDeposited),
    maturityAge,
    depositYears,
    annualRate,
    yearlyBreakdown,
  };
}

// ─────────────────────────────────────────────────────────────
// 5. APY — Atal Pension Yojana
//    Government guarantees fixed pension of ₹1000–₹5000/month
//    Contribution depends on age at entry and desired pension
// ─────────────────────────────────────────────────────────────
export function calculateAPY(currentAge, desiredMonthlyPension) {
  // Official APY contribution table (monthly contributions)
  // Source: PFRDA official table
  const apyTable = {
    18: { 1000: 42,  2000: 84,  3000: 126, 4000: 168, 5000: 210 },
    19: { 1000: 46,  2000: 92,  3000: 138, 4000: 183, 5000: 228 },
    20: { 1000: 50,  2000: 100, 3000: 150, 4000: 198, 5000: 248 },
    21: { 1000: 54,  2000: 108, 3000: 162, 4000: 215, 5000: 269 },
    22: { 1000: 59,  2000: 117, 3000: 177, 4000: 234, 5000: 292 },
    23: { 1000: 64,  2000: 127, 3000: 192, 4000: 254, 5000: 318 },
    24: { 1000: 70,  2000: 139, 3000: 208, 4000: 277, 5000: 346 },
    25: { 1000: 76,  2000: 151, 3000: 226, 4000: 301, 5000: 376 },
    26: { 1000: 82,  2000: 164, 3000: 246, 4000: 327, 5000: 409 },
    27: { 1000: 90,  2000: 178, 3000: 268, 4000: 356, 5000: 446 },
    28: { 1000: 97,  2000: 194, 3000: 292, 4000: 388, 5000: 485 },
    29: { 1000: 106, 2000: 212, 3000: 318, 4000: 423, 5000: 529 },
    30: { 1000: 116, 2000: 231, 3000: 347, 4000: 462, 5000: 577 },
    31: { 1000: 126, 2000: 252, 3000: 379, 4000: 504, 5000: 630 },
    32: { 1000: 138, 2000: 276, 3000: 414, 4000: 551, 5000: 689 },
    33: { 1000: 151, 2000: 302, 3000: 453, 4000: 602, 5000: 752 },
    34: { 1000: 165, 2000: 330, 3000: 495, 4000: 659, 5000: 824 },
    35: { 1000: 181, 2000: 362, 3000: 543, 4000: 722, 5000: 902 },
    36: { 1000: 198, 2000: 396, 3000: 594, 4000: 792, 5000: 990 },
    37: { 1000: 218, 2000: 436, 3000: 654, 4000: 870, 5000: 1087 },
    38: { 1000: 240, 2000: 480, 3000: 720, 4000: 957, 5000: 1196 },
    39: { 1000: 264, 2000: 528, 3000: 792, 4000: 1054, 5000: 1318 },
    40: { 1000: 291, 2000: 582, 3000: 873, 4000: 1164, 5000: 1454 },
  };

  if (currentAge < 18 || currentAge > 40) {
    return { error: 'APY is available for ages 18 to 40 only.' };
  }

  const validPensions = [1000, 2000, 3000, 4000, 5000];
  if (!validPensions.includes(desiredMonthlyPension)) {
    return { error: 'Desired pension must be ₹1000, ₹2000, ₹3000, ₹4000, or ₹5000.' };
  }

  const monthlyContribution = apyTable[currentAge][desiredMonthlyPension];
  const yearsToRetirement = 60 - currentAge;
  const totalContribution = monthlyContribution * 12 * yearsToRetirement;
  const pensionCorpus = desiredMonthlyPension * 12 * (1 / 0.08); // ~8% annuity estimate

  return {
    monthlyContribution,
    yearlyContribution: monthlyContribution * 12,
    totalContribution,
    yearsToRetirement,
    guaranteedMonthlyPension: desiredMonthlyPension,
    estimatedCorpus: Math.round(pensionCorpus),
    nomineeLumpsum: Math.round(pensionCorpus),
    currentAge,
  };
}

// ─────────────────────────────────────────────────────────────
// 6. NSC — National Savings Certificate
//    5-year fixed term | Compounded annually but paid at maturity
//    Rate: 7.7% p.a. (FY2024-25)
// ─────────────────────────────────────────────────────────────
export function calculateNSC(
  principal,
  annualRate = 7.7,
  tenureYears = 5
) {
  const maturityValue = principal * Math.pow(1 + annualRate / 100, tenureYears);
  const totalInterest = maturityValue - principal;

  // Year-wise interest for 80C deduction (interest reinvested counts as fresh deposit)
  const yearlyInterest = [];
  let prevBalance = principal;
  for (let year = 1; year <= tenureYears; year++) {
    const balance = principal * Math.pow(1 + annualRate / 100, year);
    yearlyInterest.push({
      year,
      interestEarned: Math.round((balance - prevBalance) * 100) / 100,
      deductibleUnder80C: year < tenureYears, // last year interest not reinvested
      balance: Math.round(balance * 100) / 100,
    });
    prevBalance = balance;
  }

  return {
    principal,
    maturityValue: Math.round(maturityValue * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    annualRate,
    tenureYears,
    yearlyInterest,
  };
}

// ─────────────────────────────────────────────────────────────
// 7. Post Office MIS — Monthly Income Scheme
//    5-year scheme | Monthly interest payout (not compounded)
//    Rate: 7.4% p.a. (FY2024-25) | Max: ₹9L single, ₹15L joint
// ─────────────────────────────────────────────────────────────
export function calculatePostOfficeMIS(
  principal,
  annualRate = 7.4,
  tenureYears = 5
) {
  if (principal > 900000) {
    return { warning: 'Maximum investment for single account is ₹9,00,000.', principal };
  }

  const monthlyInterest = (principal * annualRate) / 100 / 12;
  const totalInterest = monthlyInterest * tenureYears * 12;

  return {
    principal,
    monthlyInterest: Math.round(monthlyInterest * 100) / 100,
    quarterlyInterest: Math.round(monthlyInterest * 3 * 100) / 100,
    yearlyInterest: Math.round(monthlyInterest * 12 * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    maturityValue: principal, // principal returned at maturity (no compounding)
    totalReturns: Math.round(principal + totalInterest),
    annualRate,
    tenureYears,
  };
}

// ─────────────────────────────────────────────────────────────
// 8. KVP — Kisan Vikas Patra
//    Doubles investment at a fixed period
//    Rate: 7.5% p.a. → doubles in ~115 months (9 yrs 7 months) as of FY2024-25
// ─────────────────────────────────────────────────────────────
export function calculateKVP(
  principal,
  annualRate = 7.5
) {
  // Doubling period in months
  const doublingMonths = Math.ceil(
    (Math.log(2) / Math.log(1 + annualRate / 100)) * 12
  );
  const doublingYears = Math.floor(doublingMonths / 12);
  const doublingRemMonths = doublingMonths % 12;

  // Value at any point
  const valueAfter = (months) =>
    Math.round(principal * Math.pow(1 + annualRate / 100, months / 12) * 100) / 100;

  return {
    principal,
    maturityValue: principal * 2,
    doublingMonths,
    doublingYears,
    doublingRemMonths,
    doublingPeriodText: `${doublingYears} Years ${doublingRemMonths} Months`,
    annualRate,
    value1Year: valueAfter(12),
    value3Year: valueAfter(36),
    value5Year: valueAfter(60),
  };
}

// ─────────────────────────────────────────────────────────────
// 9. SCSS — Senior Citizen Savings Scheme
//    For 60+ | 5-year tenure (extendable by 3 yrs once)
//    Quarterly interest payout | Rate: 8.2% p.a. (FY2024-25)
//    Max deposit: ₹30 Lakhs
// ─────────────────────────────────────────────────────────────
export function calculateSCSS(
  principal,
  annualRate = 8.2,
  tenureYears = 5
) {
  if (principal > 3000000) {
    return { error: 'Maximum deposit in SCSS is ₹30,00,000.' };
  }
  if (principal < 1000) {
    return { error: 'Minimum deposit in SCSS is ₹1,000.' };
  }

  const quarterlyInterest = (principal * annualRate) / 100 / 4;
  const totalQuarters = tenureYears * 4;
  const totalInterest = quarterlyInterest * totalQuarters;
  const yearlyInterest = quarterlyInterest * 4;

  return {
    principal,
    quarterlyInterest: Math.round(quarterlyInterest * 100) / 100,
    monthlyEquivalent: Math.round((quarterlyInterest / 3) * 100) / 100,
    yearlyInterest: Math.round(yearlyInterest * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    maturityValue: Math.round(principal + totalInterest),
    annualRate,
    tenureYears,
  };
}


// ═══════════════════════════════════════════════════════════════
// CATEGORY 4 — 💰 BANKING & DEPOSIT CALCULATORS
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 1. FD — Fixed Deposit
//    A = P × (1 + r/n)^(n×t)  — Quarterly compounding (default for banks)
//    Also shows TDS if interest > ₹40,000 p.a.
// ─────────────────────────────────────────────────────────────
export function calculateFD(
  principal,
  annualRate,
  tenureMonths,
  compoundingFrequency = 4,   // 4 = quarterly (bank default)
  isSeniorCitizen = false
) {
  const effectiveRate = isSeniorCitizen ? annualRate + 0.5 : annualRate;
  const n = compoundingFrequency;
  const t = tenureMonths / 12;
  const r = effectiveRate / 100;

  const maturityAmount = principal * Math.pow(1 + r / n, n * t);
  const totalInterest = maturityAmount - principal;
  const annualInterest = totalInterest / t;
  const tdsApplicable = annualInterest > (isSeniorCitizen ? 50000 : 40000);
  const tdsAmount = tdsApplicable ? totalInterest * 0.1 : 0;
  const effectiveAnnualRate = (Math.pow(1 + r / n, n) - 1) * 100;

  return {
    principal,
    maturityAmount: Math.round(maturityAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    annualInterest: Math.round(annualInterest * 100) / 100,
    effectiveAnnualRate: Math.round(effectiveAnnualRate * 100) / 100,
    tdsApplicable,
    tdsAmount: Math.round(tdsAmount * 100) / 100,
    netMaturity: Math.round((maturityAmount - tdsAmount) * 100) / 100,
    isSeniorCitizen,
    effectiveRate,
    tenureMonths,
  };
}

// ─────────────────────────────────────────────────────────────
// 2. RD — Recurring Deposit
//    Quarterly compounding: M = R × [(1+i)^n − 1] / (1 − (1+i)^(−1/3))
//    where i = quarterly rate, n = total quarters
// ─────────────────────────────────────────────────────────────
export function calculateRD(
  monthlyDeposit,
  annualRate,
  tenureMonths,
  isSeniorCitizen = false
) {
  const effectiveRate = isSeniorCitizen ? annualRate + 0.5 : annualRate;
  const quarterlyRate = effectiveRate / 100 / 4;
  const n = tenureMonths / 3; // total quarters

  let maturityAmount = 0;
  for (let quarter = 1; quarter <= n; quarter++) {
    // Each quarter's 3 monthly deposits
    maturityAmount += monthlyDeposit * 3 * Math.pow(1 + quarterlyRate, n - quarter + 1);
  }

  const totalDeposited = monthlyDeposit * tenureMonths;
  const interestEarned = maturityAmount - totalDeposited;

  return {
    monthlyDeposit,
    maturityAmount: Math.round(maturityAmount * 100) / 100,
    totalDeposited,
    interestEarned: Math.round(interestEarned * 100) / 100,
    effectiveRate,
    tenureMonths,
    isSeniorCitizen,
  };
}

// ─────────────────────────────────────────────────────────────
// 3. Savings Account Interest Calculator
//    Daily balance method (used by most Indian banks)
//    Interest = (Daily Balance × Rate) / 365
//    Credited quarterly
// ─────────────────────────────────────────────────────────────
export function calculateSavingsAccountInterest(
  averageMonthlyBalance,
  annualRate,
  months = 12
) {
  const dailyRate = annualRate / 100 / 365;
  const annualInterest = averageMonthlyBalance * annualRate / 100;
  const periodInterest = annualInterest * (months / 12);
  const monthlyInterest = annualInterest / 12;
  const tdsApplicable = annualInterest > 10000; // TDS threshold for savings

  return {
    averageMonthlyBalance,
    annualInterest: Math.round(annualInterest * 100) / 100,
    monthlyInterest: Math.round(monthlyInterest * 100) / 100,
    quarterlyInterest: Math.round((annualInterest / 4) * 100) / 100,
    periodInterest: Math.round(periodInterest * 100) / 100,
    tdsApplicable,
    tdsAmount: tdsApplicable ? Math.round(periodInterest * 0.1 * 100) / 100 : 0,
    dailyRate: Math.round(dailyRate * 1000000) / 1000000,
    annualRate,
  };
}

// ─────────────────────────────────────────────────────────────
// 4. Overdraft Interest Calculator
//    Interest = (Principal × Rate × Days) / 365
//    Daily reducing balance
// ─────────────────────────────────────────────────────────────
export function calculateOverdraftInterest(
  overdraftAmount,
  annualRate,
  utilizationDays,
  processingFeePercent = 0.5
) {
  const dailyRate = annualRate / 100 / 365;
  const interest = overdraftAmount * dailyRate * utilizationDays;
  const processingFee = (overdraftAmount * processingFeePercent) / 100;
  const totalCost = interest + processingFee;

  return {
    overdraftAmount,
    interest: Math.round(interest * 100) / 100,
    processingFee: Math.round(processingFee * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    effectiveDailyRate: Math.round(dailyRate * 100 * 100) / 100,
    annualRate,
    utilizationDays,
  };
}

// ─────────────────────────────────────────────────────────────
// 5. Credit Card Interest Calculator
//    Monthly compounding on outstanding balance
//    Also calculates minimum payment trap
// ─────────────────────────────────────────────────────────────
export function calculateCreditCardInterest(
  outstandingBalance,
  annualRate,
  months,
  monthlyPayment = 0
) {
  const monthlyRate = annualRate / 100 / 12;

  // If no monthly payment — just track compounding
  if (monthlyPayment === 0) {
    const totalAmount = outstandingBalance * Math.pow(1 + monthlyRate, months);
    return {
      outstandingBalance,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalInterest: Math.round((totalAmount - outstandingBalance) * 100) / 100,
      monthlyRate: Math.round(monthlyRate * 100 * 100) / 100,
      annualRate,
    };
  }

  // Simulate month-by-month with payments
  let balance = outstandingBalance;
  let totalInterestPaid = 0;
  let monthCount = 0;

  while (balance > 0 && monthCount < 600) {
    const interest = balance * monthlyRate;
    totalInterestPaid += interest;
    balance = balance + interest - monthlyPayment;
    monthCount++;
    if (balance <= 0) { balance = 0; break; }
  }

  // Minimum payment (usually 5% or ₹200 whichever is higher)
  const minPayment = Math.max(200, outstandingBalance * 0.05);
  let minBalance = outstandingBalance, minInterest = 0, minMonths = 0;
  while (minBalance > 0 && minMonths < 600) {
    const interest = minBalance * monthlyRate;
    minInterest += interest;
    const payment = Math.max(200, minBalance * 0.05);
    minBalance = minBalance + interest - payment;
    minMonths++;
    if (minBalance <= 0) break;
  }

  return {
    outstandingBalance,
    monthlyPayment,
    monthsToPayoff: monthCount,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    totalAmountPaid: Math.round((outstandingBalance + totalInterestPaid) * 100) / 100,
    minPaymentMonths: minMonths,
    minPaymentInterest: Math.round(minInterest * 100) / 100,
    interestSavedVsMinPayment: Math.round((minInterest - totalInterestPaid) * 100) / 100,
    monthlyRate: Math.round(monthlyRate * 100 * 100) / 100,
    annualRate,
  };
}


// ═══════════════════════════════════════════════════════════════
// CATEGORY 5 — 👔 SALARY, INCOME & TAX CALCULATORS
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 1. Salary Calculator — CTC to In-Hand
//    Breaks down: Basic, HRA, PF, PT, LTA, bonus, etc.
// ─────────────────────────────────────────────────────────────
export function calculateCTCToInHand(
  annualCTC,
  basicPercent = 50,
  hraPercent = 50,      // % of Basic
  isMetroCity = true,
  rentPaidMonthly = 0,
  otherAllowances = 0
) {
  const basic = (annualCTC * basicPercent) / 100;
  const hra = (basic * hraPercent) / 100;
  const lta = basic * 0.0833; // ~1 month basic
  const specialAllowance = annualCTC - basic - hra - lta - otherAllowances -
    Math.min(basic * 0.12, 21600) * 2; // minus both PF contributions

  // Employee PF: 12% of basic, capped at ₹1800/month = ₹21600/year
  const employeePF = Math.min(basic * 0.12, 21600);
  const employerPF = Math.min(basic * 0.12, 21600);

  // Professional Tax (varies by state, using ₹2400 as common)
  const professionalTax = 2400;

  // HRA Exemption
  const hraExempt = rentPaidMonthly > 0
    ? Math.min(
        hra,
        rentPaidMonthly * 12 - basic * 0.1,
        basic * (isMetroCity ? 0.5 : 0.4)
      )
    : 0;
  const taxableHRA = Math.max(0, hra - hraExempt);

  const grossSalary = annualCTC - employerPF;
  const netAnnual = grossSalary - employeePF - professionalTax;
  const inHandMonthly = Math.round(netAnnual / 12);

  return {
    annualCTC,
    basic: Math.round(basic),
    hra: Math.round(hra),
    lta: Math.round(lta),
    specialAllowance: Math.max(0, Math.round(specialAllowance)),
    employeePF: Math.round(employeePF),
    employerPF: Math.round(employerPF),
    professionalTax,
    grossSalary: Math.round(grossSalary),
    netAnnualSalary: Math.round(netAnnual),
    inHandMonthly,
    hraExemption: Math.round(Math.max(0, hraExempt)),
    taxableHRA: Math.round(taxableHRA),
  };
}

// ─────────────────────────────────────────────────────────────
// 2. HRA Exemption Calculator
//    Exempt = Min of:
//      a) Actual HRA received
//      b) 50% of Basic (Metro) or 40% (Non-Metro)
//      c) Rent paid − 10% of Basic Salary (annual)
// ─────────────────────────────────────────────────────────────
export function calculateHRAExemption(
  annualBasicSalary,
  monthlyHRAReceived,
  monthlyRentPaid,
  isMetroCity
) {
  const annualHRA = monthlyHRAReceived * 12;
  const annualRent = monthlyRentPaid * 12;

  const exemptA = annualHRA;
  const exemptB = annualBasicSalary * (isMetroCity ? 0.5 : 0.4);
  const exemptC = Math.max(0, annualRent - annualBasicSalary * 0.1);
  const exemption = Math.min(exemptA, exemptB, exemptC);
  const taxableHRA = annualHRA - exemption;

  return {
    annualBasicSalary,
    annualHRA,
    annualRent,
    exemptA: Math.round(exemptA),
    exemptB: Math.round(exemptB),
    exemptC: Math.round(exemptC),
    exemption: Math.round(exemption),
    taxableHRA: Math.round(Math.max(0, taxableHRA)),
    monthlyExemption: Math.round(exemption / 12),
    isMetroCity,
  };
}

// ─────────────────────────────────────────────────────────────
// 3. Income Tax Calculator — Old vs New Regime
//    FY 2024-25 (AY 2025-26)
//    New regime: Rebate u/s 87A for income ≤ ₹7L (no tax)
// ─────────────────────────────────────────────────────────────
export function calculateIncomeTax(
  annualIncome,
  regime = 'new',
  deductions = {}
) {
  const {
    section80C = 0,        // Max ₹1.5L
    section80D = 0,        // Health insurance
    section80CCD1B = 0,    // NPS extra ₹50K
    housingLoanInterest = 0, // Section 24B — Max ₹2L
    hraExemption = 0,
    ltaExemption = 0,
    standardDeduction = 50000, // ₹50,000 standard deduction (both regimes now)
  } = deductions;

  let taxableIncome;

  if (regime === 'old') {
    const totalDeductions =
      Math.min(section80C, 150000) +
      Math.min(section80D, 100000) +
      Math.min(section80CCD1B, 50000) +
      Math.min(housingLoanInterest, 200000) +
      hraExemption +
      ltaExemption +
      standardDeduction;
    taxableIncome = Math.max(0, annualIncome - totalDeductions);
  } else {
    // New regime: only standard deduction allowed
    taxableIncome = Math.max(0, annualIncome - standardDeduction);
  }

  let tax = 0;

  if (regime === 'new') {
    // New Tax Regime Slabs FY 2024-25 (Budget 2024)
    if (taxableIncome <= 300000) tax = 0;
    else if (taxableIncome <= 700000) tax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 20000 + (taxableIncome - 700000) * 0.10;
    else if (taxableIncome <= 1200000) tax = 50000 + (taxableIncome - 1000000) * 0.15;
    else if (taxableIncome <= 1500000) tax = 80000 + (taxableIncome - 1200000) * 0.20;
    else tax = 140000 + (taxableIncome - 1500000) * 0.30;

    // Rebate u/s 87A: No tax if taxable income ≤ ₹7 lakhs
    if (taxableIncome <= 700000) tax = 0;
  } else {
    // Old Tax Regime Slabs FY 2024-25
    if (taxableIncome <= 250000) tax = 0;
    else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.20;
    else tax = 112500 + (taxableIncome - 1000000) * 0.30;

    // Rebate u/s 87A: for income ≤ ₹5L, tax rebate up to ₹12,500
    if (taxableIncome <= 500000) tax = Math.max(0, tax - 12500);
  }

  // Surcharge
  let surcharge = 0;
  if (annualIncome > 5000000 && annualIncome <= 10000000) surcharge = tax * 0.10;
  else if (annualIncome > 10000000 && annualIncome <= 20000000) surcharge = tax * 0.15;
  else if (annualIncome > 20000000 && annualIncome <= 50000000) surcharge = tax * 0.25;
  else if (annualIncome > 50000000) surcharge = tax * 0.37;

  const cess = (tax + surcharge) * 0.04; // 4% Health & Education Cess
  const totalTax = tax + surcharge + cess;
  const effectiveTaxRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;

  return {
    annualIncome,
    taxableIncome: Math.round(taxableIncome),
    incomeTax: Math.round(tax),
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    totalTax: Math.round(totalTax),
    netIncome: Math.round(annualIncome - totalTax),
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    regime,
  };
}

/**
 * Compare both regimes and suggest the better one
 */
export function compareIncomeTaxRegimes(annualIncome, deductions = {}) {
  const newRegime = calculateIncomeTax(annualIncome, 'new', deductions);
  const oldRegime = calculateIncomeTax(annualIncome, 'old', deductions);
  const saving = oldRegime.totalTax - newRegime.totalTax;

  return {
    newRegime,
    oldRegime,
    betterRegime: saving >= 0 ? 'new' : 'old',
    taxSaving: Math.abs(saving),
    recommendation:
      saving >= 0
        ? `New Regime saves ₹${formatIndianCurrency(saving)} in taxes.`
        : `Old Regime saves ₹${formatIndianCurrency(Math.abs(saving))} in taxes.`,
  };
}

// ─────────────────────────────────────────────────────────────
// 4. Gratuity Calculator
//    For private sector: Gratuity = (Last Salary × 15 × Years) / 26
//    For government: Gratuity = (Last Salary × ½ × Years)
//    Min service: 5 years | Max tax-free: ₹20 Lakhs
// ─────────────────────────────────────────────────────────────
export function calculateGratuity(
  lastMonthlyBasicPlusDA,
  yearsOfService,
  isGovernmentEmployee = false,
  isCoveredUnderAct = true
) {
  if (yearsOfService < 5 && !isGovernmentEmployee) {
    return {
      gratuity: 0,
      note: 'Minimum 5 years of continuous service required for gratuity eligibility.',
    };
  }

  let gratuity;
  if (isGovernmentEmployee) {
    gratuity = lastMonthlyBasicPlusDA * 0.5 * yearsOfService;
  } else if (isCoveredUnderAct) {
    // Payment of Gratuity Act formula
    gratuity = (lastMonthlyBasicPlusDA * 15 * yearsOfService) / 26;
  } else {
    // Not covered — employer's own formula (usually 15/30)
    gratuity = (lastMonthlyBasicPlusDA * 15 * yearsOfService) / 30;
  }

  const taxFreeLimit = 2000000; // ₹20 Lakhs
  const taxableGratuity = Math.max(0, gratuity - taxFreeLimit);

  return {
    gratuity: Math.round(gratuity * 100) / 100,
    taxFreeAmount: Math.round(Math.min(gratuity, taxFreeLimit) * 100) / 100,
    taxableGratuity: Math.round(taxableGratuity * 100) / 100,
    isTaxFree: gratuity <= taxFreeLimit,
    yearsOfService,
    lastSalary: lastMonthlyBasicPlusDA,
  };
}

// ─────────────────────────────────────────────────────────────
// 5. TDS Calculator
//    Based on Section 194 series — most common types
// ─────────────────────────────────────────────────────────────
export function calculateTDS(amount, paymentType, hasPAN = true) {
  // TDS rates as per Income Tax Act
  const tdsRates = {
    salary:          { rate: null,  threshold: 0,      section: '192', note: 'As per slab' },
    fdInterest:      { rate: hasPAN ? 10 : 20, threshold: 40000, section: '194A' },
    rentLand:        { rate: hasPAN ? 10 : 20, threshold: 240000, section: '194I(b)' },
    rentMachinery:   { rate: hasPAN ? 2  : 20, threshold: 240000, section: '194I(a)' },
    professionalFee: { rate: hasPAN ? 10 : 20, threshold: 30000,  section: '194J' },
    contractPayment: { rate: hasPAN ? 1  : 20, threshold: 30000,  section: '194C' },
    commission:      { rate: hasPAN ? 5  : 20, threshold: 15000,  section: '194H' },
    lottery:         { rate: 30,               threshold: 10000,  section: '194B' },
    insurance:       { rate: hasPAN ? 5  : 20, threshold: 100000, section: '194DA' },
    dividends:       { rate: hasPAN ? 10 : 20, threshold: 5000,   section: '194' },
  };

  const config = tdsRates[paymentType];
  if (!config) return { error: 'Unknown payment type.' };

  const aboveThreshold = amount > config.threshold;
  const tdsRate = config.rate || 0;
  const tdsAmount = aboveThreshold ? (amount * tdsRate) / 100 : 0;

  return {
    amount,
    paymentType,
    section: config.section,
    tdsRate,
    threshold: config.threshold,
    aboveThreshold,
    tdsAmount: Math.round(tdsAmount * 100) / 100,
    netAmount: Math.round((amount - tdsAmount) * 100) / 100,
    hasPAN,
  };
}

// ─────────────────────────────────────────────────────────────
// 6. Bonus / Variable Pay Calculator
//    Calculates in-hand bonus after tax & PF deductions
// ─────────────────────────────────────────────────────────────
export function calculateBonus(
  annualCTC,
  bonusAmount,
  existingAnnualTaxableIncome,
  regime = 'new'
) {
  // Tax on total income including bonus
  const taxWithBonus = calculateIncomeTax(
    existingAnnualTaxableIncome + bonusAmount, regime
  ).totalTax;

  // Tax on income without bonus
  const taxWithoutBonus = calculateIncomeTax(
    existingAnnualTaxableIncome, regime
  ).totalTax;

  const taxOnBonus = taxWithBonus - taxWithoutBonus;
  const inHandBonus = bonusAmount - taxOnBonus;
  const effectiveBonusTaxRate = bonusAmount > 0 ? (taxOnBonus / bonusAmount) * 100 : 0;

  return {
    bonusAmount,
    taxOnBonus: Math.round(taxOnBonus),
    inHandBonus: Math.round(inHandBonus),
    effectiveBonusTaxRate: Math.round(effectiveBonusTaxRate * 100) / 100,
    inHandPercent: Math.round((inHandBonus / bonusAmount) * 100 * 100) / 100,
  };
}

// ─────────────────────────────────────────────────────────────
// 7. Take-Home Salary Calculator (Monthly breakdown)
//    Shows monthly in-hand from annual CTC with all deductions
// ─────────────────────────────────────────────────────────────
export function calculateTakeHomeSalary(
  annualCTC,
  regime = 'new',
  deductions = {}
) {
  const salaryBreakdown = calculateCTCToInHand(
    annualCTC,
    50, 50, true, 0, 0
  );

  const taxResult = calculateIncomeTax(
    salaryBreakdown.grossSalary, regime, {
      standardDeduction: 50000,
      ...deductions
    }
  );

  const monthlyTax = taxResult.totalTax / 12;
  const monthlyInHand = Math.round(
    (salaryBreakdown.grossSalary - salaryBreakdown.employeePF -
     salaryBreakdown.professionalTax - taxResult.totalTax) / 12
  );

  return {
    annualCTC,
    grossMonthly: Math.round(salaryBreakdown.grossSalary / 12),
    employeePFMonthly: Math.round(salaryBreakdown.employeePF / 12),
    professionalTaxMonthly: Math.round(salaryBreakdown.professionalTax / 12),
    incomeTaxMonthly: Math.round(monthlyTax),
    totalDeductionMonthly: Math.round(
      (salaryBreakdown.employeePF + salaryBreakdown.professionalTax + taxResult.totalTax) / 12
    ),
    inHandMonthly: monthlyInHand,
    annualTax: taxResult.totalTax,
    effectiveTaxRate: taxResult.effectiveTaxRate,
    regime,
  };
}


// ═══════════════════════════════════════════════════════════════
// CATEGORY 6 — 🧾 TAX & BUSINESS CALCULATORS
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 1. GST Calculator
//    Add GST: Total = Amount × (1 + Rate/100)
//    Remove GST: Base = Amount / (1 + Rate/100)
//    CGST = SGST = Rate/2 for intra-state | IGST = Rate for inter-state
// ─────────────────────────────────────────────────────────────
export function calculateGST(
  amount,
  gstRate,
  isInclusive = false,
  transactionType = 'intra'  // 'intra' | 'inter'
) {
  let baseAmount, gstAmount, totalAmount;

  if (isInclusive) {
    baseAmount = amount / (1 + gstRate / 100);
    gstAmount = amount - baseAmount;
    totalAmount = amount;
  } else {
    baseAmount = amount;
    gstAmount = amount * gstRate / 100;
    totalAmount = amount + gstAmount;
  }

  const isIntra = transactionType === 'intra';

  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    cgst: isIntra ? Math.round(gstAmount / 2 * 100) / 100 : 0,
    sgst: isIntra ? Math.round(gstAmount / 2 * 100) / 100 : 0,
    igst: !isIntra ? Math.round(gstAmount * 100) / 100 : 0,
    gstRate,
    isInclusive,
    transactionType,
  };
}

// ─────────────────────────────────────────────────────────────
// 2. Brokerage Calculator
//    Equity Delivery, Intraday, F&O — Zerodha-style charges
//    Includes: Brokerage, STT, Exchange charges, SEBI fee, GST, Stamp duty
// ─────────────────────────────────────────────────────────────
export function calculateBrokerage(
  buyPrice,
  sellPrice,
  quantity,
  segment = 'equityDelivery'
) {
  const buyTurnover = buyPrice * quantity;
  const sellTurnover = sellPrice * quantity;
  const totalTurnover = buyTurnover + sellTurnover;
  const profitLoss = (sellPrice - buyPrice) * quantity;

  const config = {
    equityDelivery: {
      brokeragePercent: 0,       // Zero brokerage at most discount brokers
      sttBuy: 0.001,             // 0.1% on buy
      sttSell: 0.001,            // 0.1% on sell
      exchangeCharge: 0.0000345, // NSE: 0.00345%
      sebi: 0.0000001,           // ₹10 per crore
      stampDuty: 0.00015,        // 0.015% on buy side
    },
    equityIntraday: {
      brokeragePercent: 0.0003,  // 0.03% or ₹20 max per order
      sttBuy: 0,
      sttSell: 0.00025,          // 0.025% on sell only
      exchangeCharge: 0.0000345,
      sebi: 0.0000001,
      stampDuty: 0.00003,        // 0.003% on buy
    },
    futuresIndex: {
      brokerageFlat: 20,         // ₹20 per order
      sttBuy: 0,
      sttSell: 0.0001,
      exchangeCharge: 0.000002,
      sebi: 0.0000001,
      stampDuty: 0.00002,
    },
    optionsIndex: {
      brokerageFlat: 20,
      sttBuy: 0,
      sttSell: 0.000625,         // on premium
      exchangeCharge: 0.0000053,
      sebi: 0.0000001,
      stampDuty: 0.00003,
    },
  };

  const c = config[segment] || config.equityDelivery;

  const brokerage =
    c.brokerageFlat !== undefined
      ? c.brokerageFlat * 2 // buy + sell
      : Math.min(20, buyTurnover * c.brokeragePercent) +
        Math.min(20, sellTurnover * c.brokeragePercent);

  const stt = buyTurnover * (c.sttBuy || 0) + sellTurnover * (c.sttSell || 0);
  const exchangeCharge = totalTurnover * (c.exchangeCharge || 0);
  const sebiCharge = totalTurnover * (c.sebi || 0);
  const stampDuty = buyTurnover * (c.stampDuty || 0);
  const gst = (brokerage + exchangeCharge + sebiCharge) * 0.18;

  const totalCharges = brokerage + stt + exchangeCharge + sebiCharge + stampDuty + gst;
  const breakeven = buyPrice + totalCharges / quantity;

  return {
    buyTurnover: Math.round(buyTurnover * 100) / 100,
    sellTurnover: Math.round(sellTurnover * 100) / 100,
    profitLoss: Math.round(profitLoss * 100) / 100,
    brokerage: Math.round(brokerage * 100) / 100,
    stt: Math.round(stt * 100) / 100,
    exchangeCharge: Math.round(exchangeCharge * 100) / 100,
    sebiCharge: Math.round(sebiCharge * 100) / 100,
    stampDuty: Math.round(stampDuty * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    totalCharges: Math.round(totalCharges * 100) / 100,
    netPnL: Math.round((profitLoss - totalCharges) * 100) / 100,
    breakeven: Math.round(breakeven * 100) / 100,
    segment,
  };
}

// ─────────────────────────────────────────────────────────────
// 3. Capital Gains Tax Calculator 🔥
//    Equity/MF — STCG 15% (<12 months), LTCG 10% (>12 months, >₹1L exemption)
//    Debt MF — STCG as per slab, LTCG 20% with indexation (before Apr 2023 units)
//    Property — STCG as per slab (<24 months), LTCG 20% with indexation
// ─────────────────────────────────────────────────────────────
export function calculateCapitalGains(
  buyPrice,
  sellPrice,
  units,
  holdingMonths,
  assetType = 'equity',    // 'equity' | 'debtMF' | 'property' | 'gold'
  annualIncome = 0,        // needed for STCG slab rate
  costInflationIndex = null // { buy: number, sell: number } for property/debt indexation
) {
  const investedAmount = buyPrice * units;
  const saleAmount = sellPrice * units;
  const absoluteGain = saleAmount - investedAmount;

  let isLongTerm = false;
  let taxAmount = 0;
  let indexedCost = investedAmount;
  let taxRate = 0;
  let taxType = '';

  if (assetType === 'equity' || assetType === 'equityMF') {
    isLongTerm = holdingMonths >= 12;
    if (isLongTerm) {
      taxType = 'LTCG';
      taxRate = 10;
      const exemptGain = 100000; // ₹1 Lakh exemption
      taxAmount = Math.max(0, (absoluteGain - exemptGain)) * 0.10;
    } else {
      taxType = 'STCG';
      taxRate = 15;
      taxAmount = absoluteGain > 0 ? absoluteGain * 0.15 : 0;
    }
  } else if (assetType === 'debtMF' || assetType === 'gold') {
    // Post Apr 2023: All gains taxed as per income slab (no LTCG benefit for debt MF)
    isLongTerm = holdingMonths >= 36;
    taxType = 'STCG (slab rate)';
    taxRate = null; // Slab rate
    const slabTax = calculateIncomeTax(annualIncome + absoluteGain, 'new');
    const baseTax = calculateIncomeTax(annualIncome, 'new');
    taxAmount = Math.max(0, slabTax.totalTax - baseTax.totalTax);
  } else if (assetType === 'property') {
    isLongTerm = holdingMonths >= 24;
    if (isLongTerm) {
      taxType = 'LTCG';
      taxRate = 20;
      if (costInflationIndex) {
        indexedCost = (investedAmount * costInflationIndex.sell) / costInflationIndex.buy;
      }
      const indexedGain = saleAmount - indexedCost;
      taxAmount = Math.max(0, indexedGain) * 0.20;
    } else {
      taxType = 'STCG (slab rate)';
      taxRate = null;
      const slabTax = calculateIncomeTax(annualIncome + absoluteGain, 'old');
      const baseTax = calculateIncomeTax(annualIncome, 'old');
      taxAmount = Math.max(0, slabTax.totalTax - baseTax.totalTax);
    }
  }

  const surcharge = taxAmount * (absoluteGain > 5000000 ? 0.15 : 0);
  const cess = (taxAmount + surcharge) * 0.04;
  const totalTax = taxAmount + surcharge + cess;

  return {
    investedAmount: Math.round(investedAmount * 100) / 100,
    saleAmount: Math.round(saleAmount * 100) / 100,
    absoluteGain: Math.round(absoluteGain * 100) / 100,
    indexedCost: Math.round(indexedCost * 100) / 100,
    indexedGain: Math.round((saleAmount - indexedCost) * 100) / 100,
    isLongTerm,
    holdingMonths,
    taxType,
    taxRate,
    taxAmount: Math.round(taxAmount * 100) / 100,
    surcharge: Math.round(surcharge * 100) / 100,
    cess: Math.round(cess * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    netGain: Math.round((absoluteGain - totalTax) * 100) / 100,
    effectiveTaxRate: absoluteGain > 0
      ? Math.round((totalTax / absoluteGain) * 100 * 100) / 100
      : 0,
    assetType,
  };
}

// ─────────────────────────────────────────────────────────────
// 4. Stamp Duty Calculator
//    State-wise stamp duty on property purchase
//    Rates vary: 4–8% depending on state + registration charge 1%
// ─────────────────────────────────────────────────────────────
export function calculateStampDuty(
  propertyValue,
  state,
  ownershipType = 'male' // 'male' | 'female' | 'joint'
) {
  // Stamp duty rates (% of property value) — FY 2024-25
  const stampDutyRates = {
    maharashtra:   { male: 6, female: 5, joint: 6 },
    delhi:         { male: 6, female: 4, joint: 5 },
    karnataka:     { male: 5, female: 5, joint: 5 },
    tamilnadu:     { male: 7, female: 7, joint: 7 },
    gujarat:       { male: 4.9, female: 4.9, joint: 4.9 },
    rajasthan:     { male: 6, female: 5, joint: 6 },
    uttarpradesh:  { male: 7, female: 6, joint: 7 },
    westbengal:    { male: 6, female: 6, joint: 6 },
    telangana:     { male: 5, female: 5, joint: 5 },
    andhra:        { male: 5, female: 5, joint: 5 },
    kerala:        { male: 8, female: 8, joint: 8 },
    haryana:       { male: 7, female: 5, joint: 7 },
    madhyapradesh: { male: 7.5, female: 7.5, joint: 7.5 },
    punjab:        { male: 7, female: 5, joint: 7 },
    default:       { male: 6, female: 5, joint: 6 },
  };

  const rates = stampDutyRates[state.toLowerCase().replace(/\s/g, '')] || stampDutyRates.default;
  const stampDutyRate = rates[ownershipType] || rates.male;
  const registrationCharge = 1; // typically 1% everywhere

  const stampDuty = (propertyValue * stampDutyRate) / 100;
  const registration = (propertyValue * registrationCharge) / 100;
  const totalCost = propertyValue + stampDuty + registration;

  return {
    propertyValue,
    stampDutyRate,
    stampDuty: Math.round(stampDuty),
    registrationCharge: Math.round(registration),
    totalCharges: Math.round(stampDuty + registration),
    totalCost: Math.round(totalCost),
    state,
    ownershipType,
  };
}

// ─────────────────────────────────────────────────────────────
// 5. Professional Tax Calculator (State-wise)
//    Deducted by employer monthly | Max ₹2500/year
// ─────────────────────────────────────────────────────────────
export function calculateProfessionalTax(monthlyGrossSalary, state) {
  // Professional tax slabs (monthly salary → monthly PT)
  const ptSlabs = {
    maharashtra: [
      { upTo: 7500, tax: 0 },
      { upTo: 10000, tax: 175 },
      { upTo: Infinity, tax: 200 }, // ₹300 in Feb
    ],
    karnataka: [
      { upTo: 15000, tax: 0 },
      { upTo: 25000, tax: 150 },
      { upTo: 35000, tax: 200 },
      { upTo: Infinity, tax: 200 },
    ],
    andhra: [
      { upTo: 15000, tax: 0 },
      { upTo: Infinity, tax: 200 },
    ],
    telangana: [
      { upTo: 15000, tax: 0 },
      { upTo: Infinity, tax: 200 },
    ],
    westbengal: [
      { upTo: 8500, tax: 0 },
      { upTo: 10000, tax: 90 },
      { upTo: 15000, tax: 110 },
      { upTo: 25000, tax: 130 },
      { upTo: 40000, tax: 150 },
      { upTo: Infinity, tax: 200 },
    ],
    gujarat: [
      { upTo: 5999, tax: 0 },
      { upTo: 8999, tax: 80 },
      { upTo: 11999, tax: 150 },
      { upTo: Infinity, tax: 200 },
    ],
    default: [
      { upTo: 10000, tax: 0 },
      { upTo: Infinity, tax: 200 },
    ],
  };

  const slabs = ptSlabs[state.toLowerCase().replace(/\s/g, '')] || ptSlabs.default;
  let monthlyPT = 0;
  for (const slab of slabs) {
    if (monthlyGrossSalary <= slab.upTo) {
      monthlyPT = slab.tax;
      break;
    }
  }

  return {
    monthlyGrossSalary,
    monthlyProfessionalTax: monthlyPT,
    annualProfessionalTax: monthlyPT * 12,
    state,
    note: 'Professional tax rates may vary. Consult state government website for latest slabs.',
  };
}


// ═══════════════════════════════════════════════════════════════
// CATEGORY 7 — 📉 INFLATION & VALUE CALCULATORS
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 1. Inflation Calculator
//    Future value: FV = PV × (1 + r)^n
//    Present value of future amount: PV = FV / (1 + r)^n
// ─────────────────────────────────────────────────────────────
export function calculateInflation(
  presentValue,
  annualInflationRate,
  tenureYears
) {
  const futureValue = presentValue * Math.pow(1 + annualInflationRate / 100, tenureYears);
  const purchasingPowerToday = presentValue / Math.pow(1 + annualInflationRate / 100, tenureYears);
  const totalInflation = ((futureValue - presentValue) / presentValue) * 100;

  // Year-wise breakdown
  const yearlyBreakdown = [];
  for (let y = 1; y <= Math.min(tenureYears, 30); y++) {
    yearlyBreakdown.push({
      year: y,
      equivalentAmount: Math.round(presentValue * Math.pow(1 + annualInflationRate / 100, y)),
    });
  }

  return {
    presentValue,
    futureEquivalent: Math.round(futureValue * 100) / 100,
    purchasingPowerDecline: Math.round((presentValue - purchasingPowerToday) * 100) / 100,
    totalInflationPercent: Math.round(totalInflation * 100) / 100,
    annualInflationRate,
    tenureYears,
    yearlyBreakdown,
  };
}

// ─────────────────────────────────────────────────────────────
// 2. Real Rate of Return Calculator
//    Fisher Equation: Real Rate = [(1 + Nominal) / (1 + Inflation)] − 1
// ─────────────────────────────────────────────────────────────
export function calculateRealRateOfReturn(
  nominalReturnRate,
  inflationRate
) {
  const realRate = ((1 + nominalReturnRate / 100) / (1 + inflationRate / 100) - 1) * 100;
  const simpleApprox = nominalReturnRate - inflationRate;

  return {
    nominalReturnRate,
    inflationRate,
    realRate: Math.round(realRate * 100) / 100,
    simpleApproximation: Math.round(simpleApprox * 100) / 100,
    isPositive: realRate > 0,
    note: realRate < 0
      ? 'Your investment is losing purchasing power. Consider higher-return instruments.'
      : 'Your investment is beating inflation.',
  };
}

// ─────────────────────────────────────────────────────────────
// 3. Future Value of Money Calculator
//    How much is today's money worth in the future?
//    Also: how much do you need to save today to have a target future amount?
// ─────────────────────────────────────────────────────────────
export function calculateFutureValue(
  presentValue,
  annualReturnRate,
  tenureYears,
  annualInflationRate = 0
) {
  const nominalFV = presentValue * Math.pow(1 + annualReturnRate / 100, tenureYears);
  const realFV =
    annualInflationRate > 0
      ? nominalFV / Math.pow(1 + annualInflationRate / 100, tenureYears)
      : nominalFV;

  // Present value needed to reach a target
  const pvForTarget = (target) =>
    Math.round(target / Math.pow(1 + annualReturnRate / 100, tenureYears) * 100) / 100;

  const yearlyGrowth = [];
  for (let y = 1; y <= Math.min(tenureYears, 30); y++) {
    const nomVal = presentValue * Math.pow(1 + annualReturnRate / 100, y);
    const realVal =
      annualInflationRate > 0
        ? nomVal / Math.pow(1 + annualInflationRate / 100, y)
        : nomVal;
    yearlyGrowth.push({
      year: y,
      nominalValue: Math.round(nomVal),
      realValue: Math.round(realVal),
    });
  }

  return {
    presentValue,
    nominalFutureValue: Math.round(nominalFV * 100) / 100,
    realFutureValue: Math.round(realFV * 100) / 100,
    totalGainNominal: Math.round((nominalFV - presentValue) * 100) / 100,
    totalGainReal: Math.round((realFV - presentValue) * 100) / 100,
    annualReturnRate,
    annualInflationRate,
    tenureYears,
    pvForTarget,
    yearlyGrowth,
  };
}