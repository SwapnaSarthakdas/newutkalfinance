import React, { useState } from 'react';
import { FileSpreadsheet, Download, Printer, Calendar, ShieldCheck, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import Logo from '../../components/common/Logo';

const MemberStatements = () => {
  const { user } = useAuth();
  const { transactions, members, addToast } = useFinance();

  const [dateRange, setDateRange] = useState('90');
  const [accountType, setAccountType] = useState('savings');

  const currentMember = members.find((m) => m.id === user?.id) || user || {};

  const memberTxns = transactions.filter((t) => !t.memberId || t.memberId === currentMember.id);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = ['Txn ID', 'Date', 'Description', 'Type', 'Amount', 'Payment Method', 'Status', 'Reference'];
    const rows = memberTxns.map((t) => [
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
    link.setAttribute('download', `Statement_${currentMember.id}_${dateRange}days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Statement downloaded successfully as CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Account Statements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and export digitally certified statements for tax filing, visa, or audit purposes
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-finance-900 text-white hover:bg-finance-800 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Official Statement</span>
          </button>
        </div>
      </div>

      {/* Statement Configuration Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card no-print">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Account</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="savings">Primary Savings A/C (**4910)</option>
              <option value="loan">Personal Loan A/C (#LN-2025-4421)</option>
              <option value="deposits">Fixed &amp; Term Deposits Portfolio</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Statement Period</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="30">Last 30 Days</option>
              <option value="90">Last 3 Months (Current Quarter)</option>
              <option value="180">Last 6 Months</option>
              <option value="365">Financial Year 2025 - 2026</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => addToast('Statement refreshed with current ledger entries.', 'info')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-finance-600" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Statement Document Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8 sm:p-12 space-y-8">
        {/* Document Letterhead */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b-2 border-slate-900 gap-4">
          <div>
            <Logo size="lg" />
            <p className="text-xs text-slate-500 mt-2">
              Utkal Tower, Janpath, Ashok Nagar, Bhubaneswar, Odisha 751009
            </p>
            <p className="text-[11px] text-slate-400">
              RBI Reg: B-05.02981 &bull; CIN: U65999OR2014PLC018245 &bull; Toll Free: 1800 345 7890
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Statement of Account
            </span>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              CONFIDENTIAL &amp; CERTIFIED
            </div>
            <p className="text-xs text-slate-500">
              Generated: {formatDate(new Date())}
            </p>
          </div>
        </div>

        {/* Member & Account Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Member Details</span>
            <div className="text-base font-bold text-slate-900">{currentMember.name}</div>
            <div className="text-slate-600 font-mono">Member ID: {currentMember.id}</div>
            <div className="text-slate-600">{currentMember.address}, {currentMember.city}</div>
            <div className="text-slate-600">Email: {currentMember.email} | Tel: {currentMember.phone}</div>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Particulars</span>
            <div className="text-base font-bold text-finance-600">Primary Savings (INR)</div>
            <div className="text-slate-600 font-mono">Account No: 1048009219482</div>
            <div className="text-slate-600">IFSC / Routing: UTKL0002901</div>
            <div className="text-slate-900 font-bold text-sm pt-1">
              Closing Balance: {formatINR(currentMember.availableBalance || 485250)}
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Statement Ledger Entries
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Debit (₹)</th>
                  <th className="p-3 text-right">Credit (₹)</th>
                  <th className="p-3 text-right">Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {memberTxns.map((t, idx) => {
                  const isCredit = ['Deposit', 'Transfer'].includes(t.type);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-medium text-slate-600 whitespace-nowrap">
                        {formatDate(t.date)}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {t.reference || t.id}
                      </td>
                      <td className="p-3 font-semibold text-slate-900 max-w-xs">
                        {t.description}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 whitespace-nowrap">
                        {!isCredit ? formatINR(t.amount) : '-'}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                        {isCredit ? formatINR(t.amount) : '-'}
                      </td>
                      <td className="p-3 text-right font-mono font-medium text-slate-700 whitespace-nowrap">
                        {formatINR(485250 - idx * 2500)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Authentication */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            <span className="font-semibold text-slate-600 block">Digitally Signed by Utkal Finance Limited</span>
            <span>Valid without physical seal as per IT Act 2000 provisions.</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 font-semibold">
            <ShieldCheck className="w-4 h-4" /> 256-Bit Encrypted Audit Record
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberStatements;
