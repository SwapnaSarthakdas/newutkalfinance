import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Eye,
  FileSpreadsheet,
  Download,
  AlertCircle,
  ShieldCheck,
  Building2,
  UserCheck,
  FileText,
  Clock,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { formatINR, formatDate } from '../../utils/formatters';
import { memberMonthlyActivity } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import ApplyLoanModal from '../../components/member/ApplyLoanModal';
import CreateDepositModal from '../../components/member/CreateDepositModal';
import PayEmiModal from '../../components/member/PayEmiModal';
import TransactionDetailModal from '../../components/member/TransactionDetailModal';

const MemberOverview = ({ onNavigateTab }) => {
  const { user, activeApplication } = useAuth();
  const { members, loans, deposits, transactions, applications, addToast } = useFinance();

  // Find live member record or fallback to user
  const currentMember = members.find((m) => m.id === user?.id) || user || {};

  // Find associated membership application
  const appRecord = activeApplication || applications?.find(
    (a) => a.member_id === currentMember.id || a.emp_id === (currentMember.emp_id || currentMember.empId) || a.email === currentMember.email || a.mobile === currentMember.phone
  ) || {
    id: 'APP-2024-1048',
    status: 'Approved',
    emp_id: currentMember.empId || currentMember.emp_id || 'EMP-2024-001',
    member_id: currentMember.id || 'UF-2026-1048',
    branch_name: currentMember.branchName || 'Bhubaneswar HQ (075101)',
    documents: [
      { id: '1', status: 'Verified' },
      { id: '2', status: 'Verified' },
      { id: '3', status: 'Verified' },
      { id: '4', status: 'Verified' },
      { id: '5', status: 'Verified' }
    ]
  };

  // Verification counts & profile completeness
  const verifiedDocs = appRecord?.documents?.filter((d) => d.status === 'Verified')?.length || (currentMember.kycStatus === 'Verified' ? 5 : 4);
  const totalDocs = appRecord?.documents?.length || 5;
  const docStatusText = `${verifiedDocs}/${totalDocs} Verified`;
  
  // Profile completion score calculation
  const hasBasic = currentMember.name && currentMember.phone && currentMember.email ? 25 : 15;
  const hasAddress = currentMember.address ? 20 : 10;
  const hasNominee = currentMember.nomineeName ? 20 : 10;
  const hasDocs = verifiedDocs === totalDocs ? 25 : Math.round((verifiedDocs / totalDocs) * 25);
  const hasShares = 10;
  const profileCompletionPercent = Math.min(100, hasBasic + hasAddress + hasNominee + hasDocs + hasShares);

  const [copiedId, setCopiedId] = useState(false);
  const handleCopyId = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    addToast?.(`Copied ${text} to clipboard`, 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Member's loans and deposits
  const memberLoans = loans.filter((l) => l.memberId === currentMember.id);
  const activeLoans = memberLoans.filter((l) => l.status === 'Active');
  const activeLoanTotal = activeLoans.reduce((acc, curr) => acc + (curr.outstandingAmount || 0), 0);

  const memberDeposits = deposits.filter((d) => d.memberId === currentMember.id);
  const activeDepositsTotal = memberDeposits
    .filter((d) => d.status === 'Active')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Next EMI
  const nextPaymentAmount = activeLoans[0]?.monthlyEMI || currentMember.nextPayment || 0;
  const nextPaymentDate = activeLoans[0]?.nextEMIDate || currentMember.nextPaymentDate || '15 Sep 2026';

  // Member transactions
  const memberTxns = transactions.filter((t) => !t.memberId || t.memberId === currentMember.id);
  const recentTxns = memberTxns.slice(0, 6);

  // Modals state
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [payEmiModalOpen, setPayEmiModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  return (
    <div className="space-y-8">
      {/* 1. Member Statutory Overview Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Top Banner Gradient Stripe */}
        <div className="bg-gradient-to-r from-finance-950 via-finance-900 to-finance-800 px-6 sm:px-8 py-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl text-white overflow-hidden shadow-inner flex-shrink-0">
              {currentMember.avatar ? (
                <img src={currentMember.avatar} alt={currentMember.name} className="w-full h-full object-cover" />
              ) : (
                <span>{currentMember.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">{currentMember.name}</h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {currentMember.accountStatus || 'Active Member'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-finance-700/30 text-finance-200 border border-finance-500/40">
                  App: {appRecord?.status || 'Approved'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Govt. Regd: <strong>U64199OD2026PLC054968</strong></span>
                <span>&bull;</span>
                <span>Member Since: <strong>{formatDate(currentMember.joinedDate || '2024-01-15')}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigateTab('application')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-300" /> Track Application
            </button>
            <button
              onClick={() => onNavigateTab('profile')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors"
            >
              <UserCheck className="w-4 h-4" /> Full Profile
            </button>
          </div>
        </div>

        {/* Statutory Details Key-Value Grid */}
        <div className="p-6 sm:p-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 border-b border-slate-100 bg-slate-50/50">
          {/* Membership ID */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Membership ID</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-sm text-finance-900">{currentMember.id || 'UF-2026-1048'}</span>
              <button
                onClick={() => handleCopyId(currentMember.id || 'UF-2026-1048')}
                className="text-slate-400 hover:text-finance-600 p-0.5"
                title="Copy Member ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* EMP ID */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">EMP ID</span>
            <span className="font-mono font-bold text-sm text-slate-800">
              {currentMember.empId || currentMember.emp_id || appRecord.emp_id || 'EMP-2024-001'}
            </span>
          </div>

          {/* Branch & Code */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Branch &amp; Code</span>
            <div className="flex items-center gap-1 text-slate-800 font-semibold text-xs truncate">
              <Building2 className="w-3.5 h-3.5 text-finance-600 flex-shrink-0" />
              <span className="truncate">{currentMember.branchName || appRecord.branch_name || 'Bhubaneswar HQ (075101)'}</span>
            </div>
          </div>

          {/* Application Status */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Application Status</span>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              appRecord.status === 'Approved'
                ? 'bg-emerald-100 text-emerald-800'
                : appRecord.status === 'Rejected'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              <CheckCircle2 className="w-3 h-3" />
              {appRecord.status || 'Approved'}
            </span>
          </div>

          {/* Document Verification Status */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">KYC Documents</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {docStatusText}
            </span>
          </div>

          {/* Profile Completion Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Profile Status</span>
              <span className="text-xs font-bold text-finance-700">{profileCompletionPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Banner Notice if Pending EMI */}
      {nextPaymentAmount > 0 && (
        <div className="bg-gradient-to-r from-finance-900 to-finance-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-finance-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Monthly Loan EMI Scheduled</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Next installment of <strong className="text-white">{formatINR(nextPaymentAmount)}</strong> is scheduled for{' '}
                <strong className="text-amber-300">{formatDate(nextPaymentDate)}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPayEmiModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto shadow-sm"
          >
            Pay EMI Now
          </button>
        </div>
      )}

      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Available Balance"
          value={formatINR(currentMember.availableBalance || 485250)}
          subtitle="Savings A/C **4910"
          icon={Wallet}
          iconBg="bg-finance-50 text-finance-600"
          trend="+8.4%"
          trendType="up"
          actionLabel="Deposit Funds"
          onAction={() => setDepositModalOpen(true)}
        />

        <StatCard
          title="Total Deposits"
          value={formatINR(activeDepositsTotal || currentMember.totalDeposits || 1250000)}
          subtitle={`${memberDeposits.length} Active Portfolios`}
          icon={TrendingUp}
          iconBg="bg-emerald-50 text-emerald-600"
          trend="+12.5%"
          trendType="up"
          actionLabel="New Deposit"
          onAction={() => setDepositModalOpen(true)}
        />

        <StatCard
          title="Active Loan"
          value={formatINR(activeLoanTotal || currentMember.activeLoan || 320000)}
          subtitle={`${activeLoans.length} Active Credit Accounts`}
          icon={CreditCard}
          iconBg="bg-amber-50 text-amber-600"
          trend="- ₹14,500/mo"
          trendType="down"
          actionLabel="Apply Loan"
          onAction={() => setLoanModalOpen(true)}
        />

        <StatCard
          title="Next Payment"
          value={nextPaymentAmount > 0 ? formatINR(nextPaymentAmount) : '₹0'}
          subtitle={nextPaymentAmount > 0 ? `Due on ${formatDate(nextPaymentDate)}` : 'No Dues Pending'}
          icon={Calendar}
          iconBg="bg-indigo-50 text-indigo-600"
          badgeText={nextPaymentAmount > 0 ? 'NACH Active' : 'Cleared'}
          actionLabel={nextPaymentAmount > 0 ? 'Prepay' : null}
          onAction={nextPaymentAmount > 0 ? () => setPayEmiModalOpen(true) : null}
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Quick Financial Shortcuts
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setDepositModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Open Term Deposit (FD)
            </button>
            <button
              onClick={() => setLoanModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-finance-50 text-finance-700 hover:bg-finance-100 text-xs font-bold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Apply for Loan
            </button>
            {activeLoans.length > 0 && (
              <button
                onClick={() => setPayEmiModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" /> Repay Monthly EMI
              </button>
            )}
            <button
              onClick={() => onNavigateTab('statements')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Download Statement
            </button>
          </div>
        </div>
      </div>

      {/* Financial Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Deposit vs Withdrawal Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Cash Inflow &amp; Outflow</h3>
              <p className="text-xs text-slate-500 mt-0.5">Deposits vs Withdrawals over the past 6 months</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              FY 2026
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberMonthlyActivity} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [formatINR(val), '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="deposits" name="Deposits" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="withdrawals" name="Withdrawals" fill="#64748B" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Balance Growth Trend Area Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Balance Growth Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Steady net capital trajectory</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              +18.3%
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memberMonthlyActivity} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [formatINR(val), 'Account Balance']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#balanceGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live records of your latest debits, credits, and loan payments</p>
          </div>
          <button
            onClick={() => onNavigateTab('transactions')}
            className="text-xs font-bold text-finance-600 hover:text-finance-800 flex items-center gap-1 self-start sm:self-auto"
          >
            View Full Ledger &rarr;
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTxns.map((txn) => {
                const isDeposit = ['Deposit', 'Transfer'].includes(txn.type);
                return (
                  <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                      {formatDate(txn.date)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs truncate">
                      {txn.description}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={txn.type} size="xs" />
                    </td>
                    <td className={`px-6 py-4 font-extrabold whitespace-nowrap ${
                      isDeposit ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {isDeposit ? '+' : '-'}{formatINR(txn.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={txn.status} size="xs" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedTxn(txn)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-finance-600 hover:bg-slate-100 transition-colors"
                        title="View Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ApplyLoanModal
        isOpen={loanModalOpen}
        onClose={() => setLoanModalOpen(false)}
      />

      <CreateDepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
      />

      {activeLoans.length > 0 && (
        <PayEmiModal
          isOpen={payEmiModalOpen}
          onClose={() => setPayEmiModalOpen(false)}
          loan={activeLoans[0]}
        />
      )}

      <TransactionDetailModal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        transaction={selectedTxn}
      />
    </div>
  );
};

export default MemberOverview;
