import React from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  Clock,
  Receipt,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import StatCard from '../../components/common/StatCard';
import { formatINR, formatLakhCrore } from '../../utils/formatters';
import {
  adminMemberGrowth,
  adminDepositOverview,
  loanDistributionData
} from '../../data/mockData';
import { useFinance } from '../../context/FinanceContext';

const AdminOverview = ({ onNavigateTab }) => {
  const { members, loans, deposits, transactions } = useFinance();

  // Dynamic calculations (all default to clean 0)
  const totalMembersCount = members.length;
  const pendingLoans = loans.filter((l) => l.status === 'Pending');
  const activeLoans = loans.filter((l) => l.status === 'Active');

  const totalLoansValue = loans.reduce((acc, curr) => acc + (curr.principalAmount || 0), 0);
  const totalDepositsValue = deposits.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const netSurplus = totalDepositsValue - totalLoansValue;

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="bg-gradient-to-r from-finance-950 via-finance-900 to-finance-850 rounded-2xl p-6 text-white border border-finance-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            Executive Ledger Live
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
            Utkal Finance Institutional Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring across branch hubs, retail credit portfolios, and statutory liquidity reserves.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => onNavigateTab('loans')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingLoans.length} Pending Loans</span>
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2 rounded-xl bg-finance-800 hover:bg-finance-700 text-white text-xs font-bold uppercase tracking-wider transition-all border border-finance-700"
          >
            Audit Reports
          </button>
          <button
            onClick={() => onNavigateTab('brochure')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Customer Brochure</span>
          </button>
        </div>
      </div>

      {/* 6 Executive KPI Cards - 2 Rows of 3 for Spacious, Uncrowded Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Total Members"
          value={totalMembersCount.toLocaleString()}
          subtitle="Registered Members"
          icon={Users}
          iconBg="bg-finance-50 text-finance-600"
          trend="+0 this mo"
          trendType="up"
          actionLabel="Manage"
          onAction={() => onNavigateTab('members')}
        />

        <StatCard
          title="Total Deposits"
          value={formatINR(totalDepositsValue)}
          subtitle="Capital Under Mgmt"
          icon={TrendingUp}
          iconBg="bg-emerald-50 text-emerald-600"
          trend="₹0 MoM"
          trendType="up"
          actionLabel="View"
          onAction={() => onNavigateTab('deposits')}
        />

        <StatCard
          title="Total Loans"
          value={formatINR(totalLoansValue)}
          subtitle="Disbursed Credit"
          icon={CreditCard}
          iconBg="bg-amber-50 text-amber-600"
          trend="₹0 Disbursed"
          trendType="up"
          actionLabel="Audit"
          onAction={() => onNavigateTab('loans')}
        />

        <StatCard
          title="Pending Applications"
          value={pendingLoans.length.toString()}
          subtitle="Need Verification"
          icon={Clock}
          iconBg="bg-rose-50 text-rose-600"
          trend="0 Pending"
          trendType="down"
          actionLabel="Review"
          onAction={() => onNavigateTab('loans')}
        />

        <StatCard
          title="Today's Transactions"
          value={transactions.length.toString()}
          subtitle="Settled via Core Gateway"
          icon={Receipt}
          iconBg="bg-indigo-50 text-indigo-600"
          trend="0 Today"
          trendType="up"
          actionLabel="Logs"
          onAction={() => onNavigateTab('transactions')}
        />

        <StatCard
          title="Monthly Revenue"
          value={formatINR(0)}
          subtitle="Net Interest Margin"
          icon={DollarSign}
          iconBg="bg-emerald-50 text-emerald-600"
          trend="0.0%"
          trendType="up"
          actionLabel="Details"
          onAction={() => onNavigateTab('reports')}
        />
      </div>

      {/* Primary Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Member Growth Graph */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Member Onboarding &amp; Account Growth</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly registrations, loan borrowers, and depositors</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Past 6 Months
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminMemberGrowth} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="members" name="Total Members" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="deposits" name="Active Depositors" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="loans" name="Credit Borrowers" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loan Distribution Doughnut Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Loan Portfolio Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Asset allocation by credit category</p>
          </div>

          <div className="h-56 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {loanDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val}%`, 'Allocation']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
            {loanDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}: <strong>{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Graphs: Inflow vs Outflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Deposit Inflow vs Outflow Trends</h3>
              <p className="text-xs text-slate-500 mt-0.5">Capital velocity in Crores (₹ Cr)</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Net Surplus {formatINR(netSurplus)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adminDepositOverview} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}Cr`}
                />
                <Tooltip
                  formatter={(val) => [`₹${val} Crores`, '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="inflow" name="Deposit Inflow (₹ Cr)" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="outflow" name="Maturity Outflow (₹ Cr)" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Loan Approvals Quick Action Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Pending Loan Approvals</h3>
              <button
                onClick={() => onNavigateTab('loans')}
                className="text-xs font-bold text-finance-600 hover:text-finance-800"
              >
                View All &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {pendingLoans.length === 0 ? (
                <div className="py-8 px-4 text-center text-slate-400 text-xs">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">No pending loan applications</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">All borrower records are currently up to date.</p>
                </div>
              ) : (
                pendingLoans.slice(0, 3).map((l) => (
                  <div key={l.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{l.memberName}</h4>
                      <p className="text-[11px] text-slate-500">{l.loanType} &bull; {l.tenureMonths} Mo</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-900 block">{formatINR(l.principalAmount)}</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Pending</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automated credit evaluation active</span>
            <button
              onClick={() => onNavigateTab('loans')}
              className="font-bold text-finance-600 hover:text-finance-800"
            >
              Open Underwriting Desk &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
