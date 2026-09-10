import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { formatINR, formatDate } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';
import { CheckCircle2, XCircle, FileText, AlertTriangle, ShieldCheck, Download } from 'lucide-react';

const ReviewLoanModal = ({ isOpen, onClose, loan }) => {
  const { updateLoanStatus } = useFinance();
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showDocs, setShowDocs] = useState(false);

  if (!loan) return null;

  const handleApprove = () => {
    updateLoanStatus(loan.id, 'Approved');
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    updateLoanStatus(loan.id, 'Rejected', rejectReason);
    setRejectMode(false);
    setRejectReason('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Credit Underwriting &amp; Loan Evaluation"
      subtitle={`Application Reference #${loan.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Applicant Overview */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">{loan.memberName}</h4>
              <Badge status={loan.status} size="xs" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Member ID: <strong className="text-slate-700">{loan.memberId}</strong> &bull; Category: {loan.loanType}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Applied Amount</span>
            <span className="text-2xl font-black text-finance-600">{formatINR(loan.principalAmount)}</span>
          </div>
        </div>

        {/* Evaluation Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">Repayment Tenure</span>
            <strong className="text-slate-900 font-bold text-sm">{loan.tenureMonths} Months</strong>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">Assessed Interest</span>
            <strong className="text-slate-900 font-bold text-sm">{loan.interestRate}% p.a.</strong>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">Monthly EMI</span>
            <strong className="text-slate-900 font-bold text-sm">{formatINR(loan.monthlyEMI)}</strong>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">Reported Income</span>
            <strong className="text-emerald-700 font-bold text-sm">{formatINR(loan.monthlyIncome || 120000)}/mo</strong>
          </div>
        </div>

        {/* Application Specifics */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Stated Purpose:</span>
            <span className="font-semibold text-slate-900">{loan.purpose || 'Working Capital'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Employment Sector:</span>
            <span className="font-semibold text-slate-900">{loan.employmentType || 'Salaried'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Application Submission Date:</span>
            <span className="font-semibold text-slate-900">{formatDate(loan.startDate)}</span>
          </div>
        </div>

        {/* Document Verification Drawer Toggle */}
        <div className="border border-slate-200 rounded-xl p-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <FileText className="w-4 h-4 text-finance-600" />
              <span>Applicant Attached Documents (3 Files)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowDocs(!showDocs)}
              className="text-xs font-bold text-finance-600 hover:text-finance-800"
            >
              {showDocs ? 'Hide Documents' : 'View Documents'}
            </button>
          </div>

          {showDocs && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700">Bank Statement (Last 6 Months) - Verified</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">e-Sign Valid</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700">Aadhaar &amp; PAN Card Copy</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">UIDAI Match</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700">ITR Return FY 2024-25 / Salary Slips</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Validated</span>
              </div>
            </div>
          )}
        </div>

        {/* Rejection Prompt Form */}
        {rejectMode && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
            <span className="text-xs font-bold text-rose-800 block">
              Specify Reason for Loan Rejection *
            </span>
            <textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Debt-to-income ratio exceeds acceptable lending criteria."
              className="w-full px-3 py-2 rounded-lg border border-rose-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectMode(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>

          {loan.status === 'Pending' && !rejectMode && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRejectMode(true)}
                className="px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Reject Application</span>
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve &amp; Disburse</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReviewLoanModal;
