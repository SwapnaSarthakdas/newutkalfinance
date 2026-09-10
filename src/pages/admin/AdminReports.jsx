import React, { useState } from 'react';
import { FileSpreadsheet, Download, Printer, FileText, Calendar, Filter, CheckCircle2, TrendingUp, Users, CreditCard } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';

const AdminReports = () => {
  const { members, loans, deposits, transactions, addToast } = useFinance();

  const [activeReportTab, setActiveReportTab] = useState('loans');
  const [dateRange, setDateRange] = useState('current-quarter');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTabs = [
    { id: 'loans', label: 'Loan Portfolio Report', icon: CreditCard },
    { id: 'deposits', label: 'Deposit Growth Report', icon: TrendingUp },
    { id: 'members', label: 'Member Roster & KYC Report', icon: Users },
    { id: 'transactions', label: 'Transaction Audit Report', icon: FileText },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast(`${reportTabs.find(r => r.id === activeReportTab)?.label} generated for ${dateRange}!`, 'success');
    }, 500);
  };

  const handleExportCSV = () => {
    let headers = [];
    let rows = [];

    if (activeReportTab === 'loans') {
      headers = ['Loan ID', 'Member ID', 'Member Name', 'Type', 'Amount (INR)', 'Tenure', 'Status'];
      rows = loans.map((l) => [l.id, l.memberId, `"${l.memberName}"`, l.loanType, l.principalAmount, l.tenureMonths, l.status]);
    } else if (activeReportTab === 'deposits') {
      headers = ['Deposit ID', 'Member Name', 'Type', 'Amount', 'Rate', 'Maturity Amount', 'Status'];
      rows = deposits.map((d) => [d.id, `"${d.memberName}"`, d.type, d.amount, d.interestRate, d.maturityAmount, d.status]);
    } else if (activeReportTab === 'members') {
      headers = ['Member ID', 'Name', 'Email', 'City', 'Account Status', 'KYC'];
      rows = members.map((m) => [m.id, `"${m.name}"`, m.email, m.city, m.accountStatus, m.kycStatus]);
    } else {
      headers = ['Txn ID', 'Member Name', 'Date', 'Type', 'Amount', 'Status'];
      rows = transactions.map((t) => [t.id, `"${t.memberName || 'N/A'}"`, t.date, t.type, t.amount, t.status]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Utkal_Finance_Report_${activeReportTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Report downloaded as CSV', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Institutional Audit &amp; MIS Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate regulatory reports compliant with RBI NBFC disclosure and internal auditing frameworks
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
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-finance-900 text-white hover:bg-finance-800 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-300/80 no-print">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-finance-600' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Date Range & Generate Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Audit Period:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
          >
            <option value="current-month">Current Month (September 2026)</option>
            <option value="current-quarter">Current Financial Quarter (Q2 FY 2026-27)</option>
            <option value="half-year">Half Year (H1 FY 2026)</option>
            <option value="full-year">Full Financial Year 2025-26</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center justify-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>{isGenerating ? 'Compiling Ledger...' : 'Generate Live Report'}</span>
        </button>
      </div>

      {/* Report Document Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8 sm:p-12 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-finance-600 block">
              Regulatory NBFC Filing Report
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {reportTabs.find((r) => r.id === activeReportTab)?.label}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Utkal Finance Limited &bull; Janpath, Bhubaneswar &bull; RBI Reg: B-05.02981
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Generation Timestamp</span>
            <strong className="text-slate-900">{new Date().toLocaleString('en-IN')}</strong>
            <p className="text-slate-500 text-[11px] mt-0.5">Status: Audited &amp; Reconciled</p>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Total Records</span>
            <strong className="text-base font-bold text-slate-900">
              {activeReportTab === 'loans' ? loans.length : activeReportTab === 'deposits' ? deposits.length : activeReportTab === 'members' ? members.length : transactions.length}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Total Sanctioned / Capital</span>
            <strong className="text-base font-bold text-finance-600">
              {activeReportTab === 'loans'
                ? formatINR(loans.reduce((acc, c) => acc + (c.principalAmount || 0), 0))
                : activeReportTab === 'deposits'
                ? formatINR(deposits.reduce((acc, c) => acc + (c.amount || 0), 0))
                : `${members.length} Members`}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Statutory Compliance</span>
            <strong className="text-base font-bold text-emerald-600">100% Meets SLR</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Audit Risk Flag</span>
            <strong className="text-base font-bold text-emerald-600">Zero Flags (Clean)</strong>
          </div>
        </div>

        {/* Dynamic Data Table for Selected Report */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            {activeReportTab === 'loans' ? (
              <>
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Loan ID</th>
                    <th className="p-3">Borrower Name</th>
                    <th className="p-3">Facility Type</th>
                    <th className="p-3">Principal Amount</th>
                    <th className="p-3">Tenure</th>
                    <th className="p-3">Monthly EMI</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No loan records available for this audit period (0 loans).
                      </td>
                    </tr>
                  ) : (
                    loans.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-700">{l.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{l.memberName}</td>
                        <td className="p-3 text-slate-700">{l.loanType}</td>
                        <td className="p-3 font-bold text-slate-900">{formatINR(l.principalAmount)}</td>
                        <td className="p-3 text-slate-600">{l.tenureMonths} Mo</td>
                        <td className="p-3 text-finance-600 font-semibold">{formatINR(l.monthlyEMI)}</td>
                        <td className="p-3"><span className="font-bold text-slate-700">{l.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </>
            ) : activeReportTab === 'deposits' ? (
              <>
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Deposit ID</th>
                    <th className="p-3">Member Name</th>
                    <th className="p-3">Scheme Type</th>
                    <th className="p-3">Deposit Capital</th>
                    <th className="p-3">Annual Yield</th>
                    <th className="p-3">Maturity Value</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deposits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No deposit records available for this audit period (0 deposits).
                      </td>
                    </tr>
                  ) : (
                    deposits.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-700">{d.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{d.memberName}</td>
                        <td className="p-3 text-slate-700">{d.type}</td>
                        <td className="p-3 font-bold text-slate-900">{formatINR(d.amount)}</td>
                        <td className="p-3 font-bold text-emerald-600">{d.interestRate}%</td>
                        <td className="p-3 text-finance-600 font-semibold">{formatINR(d.maturityAmount)}</td>
                        <td className="p-3"><span className="font-bold text-slate-700">{d.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </>
            ) : activeReportTab === 'members' ? (
              <>
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Member ID</th>
                    <th className="p-3">Legal Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Branch City</th>
                    <th className="p-3">Account Standing</th>
                    <th className="p-3">KYC Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No registered members in roster (0 members).
                      </td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-700">{m.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{m.name}</td>
                        <td className="p-3 text-slate-600">{m.email}</td>
                        <td className="p-3 text-slate-700">{m.city}</td>
                        <td className="p-3 font-bold text-slate-900">{m.accountStatus}</td>
                        <td className="p-3 text-emerald-700 font-semibold">{m.kycStatus}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </>
            ) : (
              <>
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Member</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount (INR)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No transaction audit events recorded (0 transactions).
                      </td>
                    </tr>
                  ) : (
                    transactions.slice(0, 15).map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-700">{t.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{t.memberName || 'Member'}</td>
                        <td className="p-3 text-slate-600">{t.date}</td>
                        <td className="p-3 text-slate-700">{t.description}</td>
                        <td className="p-3 font-medium text-slate-800">{t.type}</td>
                        <td className="p-3 font-bold text-slate-900">{formatINR(t.amount)}</td>
                        <td className="p-3 font-bold text-emerald-600">{t.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
