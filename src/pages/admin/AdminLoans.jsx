import React, { useState, useMemo } from 'react';
import { CreditCard, Search, CheckCircle2, XCircle, FileText, Download, Clock, Filter, Eye } from 'lucide-react';
import Badge from '../../components/common/Badge';
import ReviewLoanModal from '../../components/admin/ReviewLoanModal';
import { formatINR, formatDate } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';

const AdminLoans = () => {
  const { loans, updateLoanStatus, addToast } = useFinance();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLoan, setSelectedLoan] = useState(null);

  const filteredLoans = useMemo(() => {
    return loans.filter((ln) => {
      const q = search.toLowerCase();
      const match =
        ln.id.toLowerCase().includes(q) ||
        ln.memberName.toLowerCase().includes(q) ||
        ln.loanType.toLowerCase().includes(q);

      if (!match) return false;

      if (statusFilter !== 'ALL' && ln.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [loans, search, statusFilter]);

  const handleExportCSV = () => {
    const headers = ['Loan ID', 'Member ID', 'Member Name', 'Loan Type', 'Amount (INR)', 'Tenure (Mo)', 'Rate (%)', 'EMI (INR)', 'Status'];
    const rows = filteredLoans.map((l) => [
      l.id,
      l.memberId,
      `"${l.memberName}"`,
      l.loanType,
      l.principalAmount,
      l.tenureMonths,
      l.interestRate,
      l.monthlyEMI,
      l.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Utkal_Finance_Loan_Desk_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Loan portfolio exported to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Loan Underwriting &amp; Applications Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Credit assessment, document verification, sanctions, and disbursal approvals
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Loan Portfolio</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Loan ID, borrower name, loan category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-slate-50 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
          >
            <option value="ALL">All Statuses ({loans.length})</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Active">Active &amp; Repaying</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Fully Repaid</option>
          </select>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Loan ID</th>
                <th className="px-6 py-3.5">Borrower</th>
                <th className="px-6 py-3.5">Loan Category</th>
                <th className="px-6 py-3.5">Sanctioned Amount</th>
                <th className="px-6 py-3.5">Tenure</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <CreditCard className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">No loan records found (0 loans)</p>
                    <p className="text-xs text-slate-400 mt-1">There are no active or pending loan applications in the underwriting queue.</p>
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {loan.id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{loan.memberName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{loan.memberId}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {loan.loanType}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900 whitespace-nowrap">
                      {formatINR(loan.principalAmount)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {loan.tenureMonths} Months ({loan.interestRate}% p.a.)
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={loan.status} size="xs" />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLoan(loan)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-finance-600" />
                          <span>Review</span>
                        </button>

                        {loan.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => updateLoanStatus(loan.id, 'Approved')}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              title="Quick Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLoan(loan);
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewLoanModal
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
        loan={selectedLoan}
      />
    </div>
  );
};

export default AdminLoans;
