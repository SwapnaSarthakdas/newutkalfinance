// Financial calculation formulas

/**
 * Calculates monthly EMI
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate in percentage (e.g. 10.5)
 * @param {number} tenureMonths - Tenure in months
 */
export const calculateEMI = (principal, annualRate, tenureMonths) => {
  if (!principal || !annualRate || !tenureMonths) return { emi: 0, totalPayment: 0, totalInterest: 0 };
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest)
  };
};

/**
 * Calculates Fixed Deposit maturity
 * A = P * (1 + r/4)^(4*t)  (quarterly compounding)
 */
export const calculateFDReturns = (principal, annualRate, tenureYears) => {
  if (!principal || !annualRate || !tenureYears) return { maturityAmount: 0, interestEarned: 0 };
  const r = annualRate / 100;
  const n = 4; // Quarterly compounding
  const t = tenureYears;
  const maturityAmount = principal * Math.pow(1 + r / n, n * t);
  const interestEarned = maturityAmount - principal;

  return {
    maturityAmount: Math.round(maturityAmount),
    interestEarned: Math.round(interestEarned)
  };
};

/**
 * Calculates Recurring Deposit maturity
 * M = P * ((1+r/n)^(n*t) - 1) / (1 - (1+r/n)^(-1/3))
 */
export const calculateRDReturns = (monthlyDeposit, annualRate, tenureMonths) => {
  if (!monthlyDeposit || !annualRate || !tenureMonths) return { totalInvested: 0, maturityAmount: 0, interestEarned: 0 };
  const totalInvested = monthlyDeposit * tenureMonths;
  // Approximate standard bank quarterly compounding formula for RD
  const i = annualRate / 400;
  let maturityAmount = 0;
  for (let m = 1; m <= tenureMonths; m++) {
    maturityAmount += monthlyDeposit * Math.pow(1 + i, (tenureMonths - m + 1) / 3);
  }
  const interestEarned = maturityAmount - totalInvested;

  return {
    totalInvested: Math.round(totalInvested),
    maturityAmount: Math.round(maturityAmount),
    interestEarned: Math.round(interestEarned)
  };
};
