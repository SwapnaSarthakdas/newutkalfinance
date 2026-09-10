import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  ShieldCheck,
  Building,
  User,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import OfficialMembershipForm from '../../components/membership/OfficialMembershipForm';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

const STATUS_STEPS = [
  { id: 'Submitted', label: '1. Submitted', desc: 'Application recorded & fee logged' },
  { id: 'Under Review', label: '2. Under Review', desc: 'Assigned to Verification Committee' },
  { id: 'Documents Verification', label: '3. Doc Verification', desc: 'KYC proofs reviewed' },
  { id: 'Approved', label: '4. Approved', desc: 'Membership ID & shares allocated' }
];

const MemberApplicationTab = () => {
  const { user, activeApplication } = useAuth();
  const { members, applications } = useFinance();
  const [formModalOpen, setFormModalOpen] = useState(false);

  // Find live application
  const currentMember = members.find((m) => m.id === user?.id) || user || {};
  const app =
    activeApplication ||
    applications.find((a) => a.user_id === user?.id || a.member_id === currentMember.id) ||
    applications[0] || {
      id: 'APP-2024-1048',
      status: 'Approved',
      membership_fee: 200,
      share_number: 'SH-8492'
    };

  const status = app.status || 'Under Review';
  const isRejected = status === 'Rejected';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Membership Application Status
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of statutory membership filing and official certification
          </p>
        </div>

        <button
          onClick={() => setFormModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>Official 2-Page Document</span>
        </button>
      </div>

      {/* Rejection Alert if Rejected */}
      {isRejected && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-sm text-xs text-rose-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-950 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Membership Application Rejected</span>
          </div>
          <p className="leading-relaxed">
            Your membership application could not be approved due to the following reason:
          </p>
          <div className="p-3 bg-white rounded-xl border border-rose-200 font-medium text-rose-950">
            "{app.rejection_reason || 'Incomplete or unverified identification documents.'}"
          </div>
          <p className="text-[11px] text-rose-700">
            Please contact our compliance desk at <strong>support@utkalfinance.com</strong> or visit your registered branch to submit updated KYC proofs.
          </p>
        </div>
      )}

      {/* Main Status Tracker Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">
              Application ID
            </span>
            <div className="text-2xl font-mono font-black text-slate-900 mt-0.5">
              {app.id}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
                status === 'Approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : status === 'Rejected'
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* 4-Step Visual Progress Tracker */}
        {!isRejected && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Filing &amp; Verification Milestones
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {STATUS_STEPS.map((step, idx) => {
                const stepIndex = STATUS_STEPS.findIndex((s) => s.id === status);
                const isComplete = stepIndex >= idx;
                const isCurrent = status === step.id;

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isComplete
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : isCurrent
                        ? 'bg-amber-50 border-amber-300 text-amber-950 ring-2 ring-amber-300'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold">{step.label}</span>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Application Details Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Allocated Member ID</span>
            <strong className="text-slate-900 font-mono text-sm">{currentMember.id || 'Pending Approval'}</strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee ID</span>
            <strong className="text-slate-900 font-mono text-sm">{currentMember.emp_id || currentMember.empId || 'N/A'}</strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Statutory Fee</span>
            <strong className="text-emerald-700 font-bold text-sm">₹ {app.membership_fee || 200} (Associate Fee)</strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Branch</span>
            <strong className="text-slate-900 text-sm">{currentMember.branchName || currentMember.branch_name || 'Bhubaneswar HQ'}</strong>
          </div>
        </div>
      </div>

      {/* Official 2-Page Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title="Statutory Membership Application Document"
        subtitle="Official 2-Page Application Form of Newutkal Finance Ltd. (Reg. No.: U64199OD2026PLC054968)"
        maxWidth="max-w-5xl"
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print / Download PDF</span>
            </button>
          </div>
          <OfficialMembershipForm data={currentMember} isBlank={false} />
        </div>
      </Modal>
    </div>
  );
};

export default MemberApplicationTab;
