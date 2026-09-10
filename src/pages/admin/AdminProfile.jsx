import React from 'react';
import { Shield, User, Mail, Building2, KeyRound, Clock, Laptop } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Administrator Profile &amp; Governance Credentials
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Executive authorization tier, security privileges, and active session audit records
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-finance-950 text-emerald-400 flex items-center justify-center font-bold text-2xl border-2 border-slate-200 flex-shrink-0">
            <Shield className="w-10 h-10" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900">{user?.name || 'Bhagirathi Mohapatra'}</h3>
              <span className="text-xs font-bold bg-amber-500/20 text-amber-800 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Managing Director
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'bhagirathimohapatra79@gmail.com'}</p>
            <p className="text-[11px] font-mono text-finance-600 mt-1">
              Admin Identity: ADM-001 &bull; Managing Director &amp; Board Governance
            </p>
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Assigned Administrative Capabilities
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block font-bold">Loan Sanctioning</strong>
              <span className="text-slate-500 text-[11px]">Authorized up to ₹1.00 Crore credit sanction limit</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block font-bold">KYC Clearance</strong>
              <span className="text-slate-500 text-[11px]">Full authority to approve or flag member identities</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block font-bold">RBI Ledger Reporting</strong>
              <span className="text-slate-500 text-[11px]">Export statutory MIS returns &amp; audited trial balance</span>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Administrative Terminals
          </h4>
          <div className="space-y-2 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-emerald-700" />
                <div>
                  <strong className="text-slate-900 block font-bold">Windows 11 &bull; Chrome Core Terminal (Current)</strong>
                  <span className="text-[11px] text-slate-500">IP: 103.24.12.98 (Bhubaneswar, Odisha) &bull; 256-Bit SSL</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Active Terminal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
