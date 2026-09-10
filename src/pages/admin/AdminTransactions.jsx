import React, { useState, useMemo } from 'react';
import { Receipt, Search, Download, Eye, RefreshCw, Printer, ShieldCheck } from 'lucide-react';
import Badge from '../../components/common/Badge';
import TransactionDetailModal from '../../components/member/TransactionDetailModal';
import { formatINR, formatDateTime } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';

const AdminTransactions = () => {
  const { transactions, addToast } = useFinance();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const q = search.toLowerCase();
      const match =
        t.id.toLowerCase().includes(q) ||
        (t.memberName && t.memberName.toLowerCase().includes(q)) ||
        t.description.toLowerCase().includes(q) ||
        (t.reference && t.reference.toLowerCase().includes(q));

      if (!match) return false;
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

      return true;
    });
  }, [transactions, search, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Member ID', 'Member Name', 'Date', 'Description', 'Type', 'Amount', 'Payment Method', 'Status', 'Reference'];
    const rows = filtered.map((t) => [
      t.id,
      t.memberId || 'N/A',
      `"${t.memberName || 'Member'}"`,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      t.paymentMethod || 'Core Gateway',
      t.status,
      t.reference || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Utkal_Finance_Audit_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Audit transactions exported to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Transaction Ledger &amp; Settlement Audit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time electronic clearing, NACH mandate debits, and fund transfers across all accounts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Audit Ledger</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by ID, member, description, UTR reference..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-slate-50 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="sm:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
          >
            <option value="ALL">All Types</option>
            <option value="Deposit">Deposit / Credit</option>
            <option value="Withdrawal">Withdrawal / Debit</option>
            <option value="Loan Payment">Loan Payment</option>
            <option value="Transfer">Transfer</option>
          </select>
        </div>

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

        <div className="sm:col-span-2 flex items-center justify-end">
          <button
            onClick={() => {
              setSearch('');
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

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Txn ID</th>
                <th className="px-6 py-3.5">Member</th>
                <th className="px-6 py-3.5">Date &amp; Time</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5">Channel</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">No transaction ledger entries found (0 transactions)</p>
                    <p className="text-xs text-slate-400 mt-1">Transactions will appear automatically upon payments, loans, and deposits.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {t.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{t.memberName || 'Member'}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{t.memberId || 'UF-Core'}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {t.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{t.description}</div>
                      {t.reference && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Ref: {t.reference}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {t.paymentMethod || 'Core Banking'}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900 whitespace-nowrap">
                      {formatINR(t.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={t.status} size="xs" />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTxn(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-finance-600 hover:bg-slate-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
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

      {/* Transaction Receipt Modal */}
      <TransactionDetailModal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        transaction={selectedTxn}
      />
    </div>
  );
};

export default AdminTransactions;
