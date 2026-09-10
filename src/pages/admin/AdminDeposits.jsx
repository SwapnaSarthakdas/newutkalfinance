import React, { useState, useMemo } from 'react';
import { TrendingUp, PlusCircle, Search, Download, Calendar, ShieldCheck } from 'lucide-react';
import Badge from '../../components/common/Badge';
import AddDepositModal from '../../components/admin/AddDepositModal';
import { formatINR, formatDate } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';

const AdminDeposits = () => {
  const { deposits, addToast } = useFinance();

  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filteredDeposits = useMemo(() => {
    return deposits.filter((d) => {
      const q = search.toLowerCase();
      return (
        d.id.toLowerCase().includes(q) ||
        d.memberName.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
      );
    });
  }, [deposits, search]);

  const totalDepositsSum = deposits.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalMaturitySum = deposits.reduce((acc, curr) => acc + (curr.maturityAmount || curr.amount || 0), 0);

  const weightedRate = deposits.length > 0
    ? (deposits.reduce((acc, curr) => acc + (Number(curr.interestRate) || 0), 0) / deposits.length).toFixed(2)
    : '0.00';

  const handleExportCSV = () => {
    const headers = ['Deposit ID', 'Member ID', 'Member Name', 'Scheme Type', 'Amount (INR)', 'Interest Rate (%)', 'Start Date', 'Maturity Date', 'Maturity Value (INR)', 'Status'];
    const rows = filteredDeposits.map((d) => [
      d.id,
      d.memberId,
      `"${d.memberName}"`,
      d.type,
      d.amount,
      d.interestRate,
      d.startDate,
      d.maturityDate,
      d.maturityAmount,
      d.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Utkal_Finance_Deposits_Master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Deposit portfolio exported to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Deposit Management Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor term deposits, SLR liquidity compliance, and upcoming maturities
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Deposit</span>
          </button>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Active Capital
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatINR(totalDepositsSum)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Across {deposits.length} member accounts</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Future Maturity Obligation
          </span>
          <div className="text-2xl sm:text-3xl font-black text-finance-600">
            {formatINR(totalMaturitySum)}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Fully backed by statutory reserves</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Weighted Average Return
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {weightedRate}% p.a.
          </div>
          <p className="text-xs text-slate-500 mt-1">Compounded quarterly</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by deposit ID, member name, scheme..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-slate-50 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Deposit ID</th>
                <th className="px-6 py-3.5">Member Name</th>
                <th className="px-6 py-3.5">Scheme Type</th>
                <th className="px-6 py-3.5">Principal</th>
                <th className="px-6 py-3.5">Yield Rate</th>
                <th className="px-6 py-3.5">Maturity Date</th>
                <th className="px-6 py-3.5">Maturity Payout</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <TrendingUp className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">No deposit accounts found (0 active deposits)</p>
                    <p className="text-xs text-slate-400 mt-1">Create a new deposit to record transactions.</p>
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {dep.id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{dep.memberName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{dep.memberId}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {dep.type}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900 whitespace-nowrap">
                      {formatINR(dep.amount)}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 whitespace-nowrap">
                      {dep.interestRate}% p.a.
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
      <AddDepositModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
};

export default AdminDeposits;
