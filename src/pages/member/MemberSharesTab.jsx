import React from 'react';
import {
  PieChart,
  Award,
  CheckCircle2,
  Calendar,
  CreditCard,
  Download,
  FileBadge,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

const MemberSharesTab = () => {
  const { user } = useAuth();
  const { members, addToast } = useFinance();
  const currentMember = members.find((m) => m.id === user?.id) || user || {};

  const shareDetails = {
    shareNumber: 'SH-8492',
    certificateNumber: 'CERT-UTK-2024-8492',
    shareCount: 10,
    faceValue: 50,
    totalShareValue: 500,
    allotmentDate: currentMember.joinedDate || '2024-01-15',
    repaymentPreference: 'First depositor',
    taxDeduction: 'No (Form 15G Enclosed)',
    statutoryStatus: 'Fully Paid & Allotted'
  };

  const handleDownloadCertificate = () => {
    addToast('Official Share Certificate generated for download.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Share Capital &amp; Allotment Portfolio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statutory equity shareholding under Companies Act 2013 &amp; Nidhi Rules 2014
          </p>
        </div>

        <button
          onClick={handleDownloadCertificate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Download Certificate</span>
        </button>
      </div>

      {/* Share Certificate Visual Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-finance-950 via-finance-900 to-finance-850 text-white border border-finance-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-finance-800 relative z-10">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold block">
              Official Share Certificate
            </span>
            <div className="text-2xl font-mono font-black text-white mt-0.5">
              {shareDetails.certificateNumber}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ✓ {shareDetails.statutoryStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs relative z-10">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Share Number</span>
            <strong className="text-white text-base font-mono">{shareDetails.shareNumber}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Quantity Held</span>
            <strong className="text-white text-base font-mono">{shareDetails.shareCount} Equity Shares</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Paid-up Value</span>
            <strong className="text-emerald-400 text-base font-mono">₹ {shareDetails.totalShareValue}.00</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Allotment Date</span>
            <strong className="text-white text-sm">{shareDetails.allotmentDate}</strong>
          </div>
        </div>
      </div>

      {/* Preferences & Repayment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">
            Repayment of Deposit Preference
          </span>
          <div className="text-sm font-bold text-slate-900">
            {shareDetails.repaymentPreference}
          </div>
          <p className="text-[11px] text-slate-500">
            Designated on your official statutory membership application form Page 1.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">
            TDS / Tax Deduction Standing
          </span>
          <div className="text-sm font-bold text-slate-900">
            {shareDetails.taxDeduction}
          </div>
          <p className="text-[11px] text-slate-500">
            TDS deduction exempt as per submitted Form 15G under Income Tax Act norms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberSharesTab;
