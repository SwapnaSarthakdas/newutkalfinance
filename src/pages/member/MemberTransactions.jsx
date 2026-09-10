import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Printer, Eye, ArrowDownRight, ArrowUpRight, Calendar, RefreshCw } from 'lucide-react';
import Badge from '../../components/common/Badge';
import TransactionDetailModal from '../../components/member/TransactionDetailModal';
import { formatINR, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

const MemberTransactions = () => {
  const { user } = useAuth();
  const { transactions, addToast } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL' | '30' | '90'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const itemsPerPage = 8;

  // Filter transactions for this member
  const memberTransactions = useMemo(() => {
    return transactions.filter(
      (t) => !t.memberId || t.memberId === user?.id
    );
  }, [transactions, user]);

  // Apply search and filters
  const filteredTransactions = useMemo(() => {
    return memberTransactions.filter((txn) => {
      // Search
      const query = searchQuery.toLowerCase();
      const matchSearch =
        txn.id.toLowerCase().includes(query) ||
        txn.description.toLowerCase().includes(query) ||
        (txn.reference && txn.reference.toLowerCase().includes(query));

      if (!matchSearch) return false;

      // Type filter
      if (typeFilter !== 'ALL' && txn.type !== typeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && txn.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [memberTransactions, searchQuery, typeFilter, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Description', 'Type', 'Amount (INR)', 'Payment Method', 'Status', 'Reference'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      t.paymentMethod || 'Core Banking',
      t.status,
      t.reference || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Utkal_Finance_Transactions_${user?.id || 'Member'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Transaction ledger downloaded as CSV', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Transaction History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of all deposits, withdrawals, fund transfers, and EMI repayments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, description, reference UTR..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-slate-50 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="ALL">All Types (Deposits, EMIs, Transfers)</option>
              <option value="Deposit">Deposits &amp; Credits</option>
              <option value="Withdrawal">Withdrawals</option>
              <option value="Loan Payment">Loan EMI Payments</option>
              <option value="Transfer">Transfers</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="sm:col-span-2 flex items-center justify-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setStatusFilter('ALL');
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Date &amp; Time</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((txn) => {
                  const isCredit = ['Deposit', 'Transfer'].includes(txn.type);
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {txn.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                        {txn.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{txn.description}</div>
                        {txn.reference && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Ref: {txn.reference}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={txn.type} size="xs" />
                      </td>
                      <td className={`px-6 py-4 font-extrabold whitespace-nowrap ${
                        isCredit ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {isCredit ? '+' : '-'}{formatINR(txn.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={txn.status} size="xs" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedTxn(txn)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-finance-600" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Previous
            </button>
            <span className="font-semibold text-slate-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        transaction={selectedTxn}
      />
    </div>
  );
};

export default MemberTransactions;
