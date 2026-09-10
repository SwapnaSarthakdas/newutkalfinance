import React, { useState } from 'react';
import { CreditCard, PlusCircle, Calendar, CheckCircle2, AlertCircle, ArrowUpRight, Clock, Shield } from 'lucide-react';
import Badge from '../../components/common/Badge';
import ApplyLoanModal from '../../components/member/ApplyLoanModal';
import PayEmiModal from '../../components/member/PayEmiModal';
import { formatINR, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

const MemberLoans = () => {
  const { user } = useAuth();
  const { loans } = useFinance();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [payEmiModalOpen, setPayEmiModalOpen] = useState(false);
  const [selectedLoanForEmi, setSelectedLoanForEmi] = useState(null);

  // Filter loans for current member
  const memberLoans = loans.filter((l) => l.memberId === user?.id);

  // Aggregate stats
  const totalPrincipal = memberLoans.reduce((acc, curr) => acc + (curr.principalAmount || 0), 0);
  const totalOutstanding = memberLoans
    .filter((l) => l.status === 'Active')
    .reduce((acc, curr) => acc + (curr.outstandingAmount || 0), 0);
  const activeLoansCount = memberLoans.filter((l) => l.status === 'Active').length;

  const handleOpenPayEmi = (loan) => {
    setSelectedLoanForEmi(loan);
    setPayEmiModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Credit &amp; Loan Accounts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor repayment schedules, amortizations, and apply for retail or commercial credit
          </p>
        </div>

        <button
          onClick={() => setApplyModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Apply for New Loan</span>
        </button>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Outstanding Balance
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatINR(totalOutstanding)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Across {activeLoansCount} active credit facilities</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Cumulative Disbursed
          </span>
          <div className="text-2xl sm:text-3xl font-black text-finance-600">
            {formatINR(totalPrincipal)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Total credit approved by Utkal Finance</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Credit Rating &amp; Standing
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            785 / 900
          </div>
          <p className="text-xs text-slate-500 mt-1">Excellent tier &bull; Eligible for instant pre-approval</p>
        </div>
      </div>

      {/* Active Loans Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Your Loan Portfolio
        </h3>

        {memberLoans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-card">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No active loans found</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Need capital for business, personal, home or vehicle? Apply in less than 2 minutes.
            </p>
            <button
              onClick={() => setApplyModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-finance-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-finance-800"
            >
              Apply for Loan
            </button>
          </div>
        ) : (
          memberLoans.map((loan) => {
            const repaidAmount = Math.max(0, loan.principalAmount - loan.outstandingAmount);
            const progressPercent = Math.min(100, Math.round((repaidAmount / loan.principalAmount) * 100)) || 0;

            return (
              <div
                key={loan.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-finance-50 text-finance-600 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{loan.loanType}</h4>
                        <Badge status={loan.status} size="xs" />
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Loan ID: {loan.id}</span>
                    </div>
                  </div>

                  {loan.status === 'Active' && (
                    <button
                      onClick={() => handleOpenPayEmi(loan)}
                      className="px-4 py-2 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto shadow-xs"
                    >
                      Pay Monthly EMI ({formatINR(loan.monthlyEMI)})
                    </button>
                  )}
                </div>

                {/* Loan Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sanctioned Principal</span>
                    <strong className="text-sm font-bold text-slate-900">{formatINR(loan.principalAmount)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Outstanding Balance</span>
                    <strong className="text-sm font-bold text-finance-600">{formatINR(loan.outstandingAmount)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Interest Rate</span>
                    <strong className="text-sm font-bold text-slate-900">{loan.interestRate}% p.a.</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Next EMI Due Date</span>
                    <strong className="text-sm font-bold text-amber-600">
                      {loan.nextEMIDate ? formatDate(loan.nextEMIDate) : 'N/A'}
                    </strong>
                  </div>
                </div>

                {/* Repayment Progress Bar */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                    <span>Repayment Progress ({loan.paidTenureMonths || 0} of {loan.tenureMonths} Months Paid)</span>
                    <span className="font-bold text-slate-700">{progressPercent}% Repaid</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  {loan.purpose && (
                    <p className="text-[11px] text-slate-500 mt-2">
                      Purpose: <span className="text-slate-700 font-medium">{loan.purpose}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <ApplyLoanModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />

      {selectedLoanForEmi && (
        <PayEmiModal
          isOpen={payEmiModalOpen}
          onClose={() => {
            setPayEmiModalOpen(false);
            setSelectedLoanForEmi(null);
          }}
          loan={selectedLoanForEmi}
        />
      )}
    </div>
  );
};

export default MemberLoans;
