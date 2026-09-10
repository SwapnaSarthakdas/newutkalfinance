import React, { useState } from 'react';
import { TrendingUp, PlusCircle, Calendar, ShieldCheck, Award, ArrowUpRight } from 'lucide-react';
import Badge from '../../components/common/Badge';
import CreateDepositModal from '../../components/member/CreateDepositModal';
import { formatINR, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

const MemberDeposits = () => {
  const { user } = useAuth();
  const { deposits } = useFinance();

  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Filter deposits for current member
  const memberDeposits = deposits.filter((d) => d.memberId === user?.id);

  // Aggregates
  const totalDepositAmount = memberDeposits.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const activeDeposits = memberDeposits.filter((d) => d.status === 'Active');
  const totalMaturityValue = memberDeposits.reduce((acc, curr) => acc + (curr.maturityAmount || curr.amount || 0), 0);
  const nextMaturity = activeDeposits[0]?.maturityDate || '10 Mar 2028';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Deposit Portfolio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fixed Deposits, Recurring Deposits, and high-yield term schemes compounding your wealth
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Deposit</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Deposit
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatINR(totalDepositAmount)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Invested principal capital</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Active Deposits
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {activeDeposits.length} Accounts
          </div>
          <p className="text-xs text-slate-500 mt-1">Generating guaranteed interest</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Projected Maturity Amount
          </span>
          <div className="text-2xl sm:text-3xl font-black text-finance-600">
            {formatINR(totalMaturityValue)}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            + {formatINR(totalMaturityValue - totalDepositAmount)} Interest
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Next Maturity Date
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatDate(nextMaturity)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Auto-credit to savings balance</p>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Term Deposits</h3>
            <p className="text-xs text-slate-500 mt-0.5">Active Fixed and Recurring Deposit accounts</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            RBI Insured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Deposit ID</th>
                <th className="px-6 py-3.5">Scheme Type</th>
                <th className="px-6 py-3.5">Principal</th>
                <th className="px-6 py-3.5">Interest Rate</th>
                <th className="px-6 py-3.5">Start Date</th>
                <th className="px-6 py-3.5">Maturity Date</th>
                <th className="px-6 py-3.5">Maturity Value</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memberDeposits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No term deposits booked yet. Click "Create New Deposit" to start compounding.
                  </td>
                </tr>
              ) : (
                memberDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {dep.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      {dep.type}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                      {formatINR(dep.amount)}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 whitespace-nowrap">
                      {dep.interestRate}% p.a.
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {formatDate(dep.startDate)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {formatDate(dep.maturityDate)}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-finance-600 whitespace-nowrap">
                      {formatINR(dep.maturityAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={dep.status} size="xs" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <CreateDepositModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};

export default MemberDeposits;
