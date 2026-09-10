// Initial clean data for Utkal Finance application (Zeroed for production / customer delivery)

export const initialMembers = [];

export const initialLoans = [];

export const initialDeposits = [];

export const initialTransactions = [];

export const initialNotifications = [];

export const initialSettings = {
  companyName: 'Newutkal Finance Limited',
  managingDirector: 'Bhagirathi Mohapatra',
  registrationNo: 'U64199OD2026PLC054968',
  rbiRegistration: 'Certified by Govt. of India (Reg. No.: U64199OD2026PLC054968)',
  address: 'Plot no-N/5-172, Nayapalli, IRC village, Bhubaneswar-751015',
  email: 'bhagirathimohapatra79@gmail.com',
  website: 'www.newutkalfinance.com',
  phone: '+91 9776175240',
  operatingHours: 'Monday - Saturday: 9:30 AM - 6:30 PM (IST)',
  twoFactorAuth: false,
  emailNotifications: true,
  smsNotifications: true,
  systemAlerts: true
};

// Chart sample data zeroed out
export const memberMonthlyActivity = [
  { month: 'Apr', deposits: 0, withdrawals: 0, balance: 0 },
  { month: 'May', deposits: 0, withdrawals: 0, balance: 0 },
  { month: 'Jun', deposits: 0, withdrawals: 0, balance: 0 },
  { month: 'Jul', deposits: 0, withdrawals: 0, balance: 0 },
  { month: 'Aug', deposits: 0, withdrawals: 0, balance: 0 },
  { month: 'Sep', deposits: 0, withdrawals: 0, balance: 0 },
];

export const adminMemberGrowth = [
  { month: 'Oct 25', members: 0, loans: 0, deposits: 0 },
  { month: 'Nov 25', members: 0, loans: 0, deposits: 0 },
  { month: 'Dec 25', members: 0, loans: 0, deposits: 0 },
  { month: 'Jan 26', members: 0, loans: 0, deposits: 0 },
  { month: 'Feb 26', members: 0, loans: 0, deposits: 0 },
  { month: 'Mar 26', members: 0, loans: 0, deposits: 0 },
];

export const adminDepositOverview = [
  { month: 'Apr', inflow: 0, outflow: 0 },
  { month: 'May', inflow: 0, outflow: 0 },
  { month: 'Jun', inflow: 0, outflow: 0 },
  { month: 'Jul', inflow: 0, outflow: 0 },
  { month: 'Aug', inflow: 0, outflow: 0 },
  { month: 'Sep', inflow: 0, outflow: 0 },
];

export const loanDistributionData = [
  { name: 'Home Loans', value: 0, color: '#2563EB' },
  { name: 'Business Loans', value: 0, color: '#10B981' },
  { name: 'Personal Loans', value: 0, color: '#F59E0B' },
  { name: 'Vehicle & Gold', value: 0, color: '#8B5CF6' },
];
