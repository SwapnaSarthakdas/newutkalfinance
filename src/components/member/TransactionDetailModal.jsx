import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { formatINR, formatDateTime } from '../../utils/formatters';
import { Printer, CheckCircle2, Copy, FileText, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  const { addToast } = useFinance();

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.reference || transaction.id);
    addToast('Reference UTR copied to clipboard!', 'info');
  };

  const isCredit = ['Deposit', 'Transfer'].includes(transaction.type);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Receipt"
      subtitle={`Transaction Reference #${transaction.id}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        {/* Receipt Header Card */}
        <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="inline-flex p-3 rounded-2xl bg-white border border-slate-200 shadow-xs mb-3">
            {isCredit ? (
              <ArrowDownRight className="w-8 h-8 text-emerald-600" />
            ) : (
              <ArrowUpRight className="w-8 h-8 text-rose-600" />
            )}
          </div>

          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {isCredit ? '+' : '-'}{formatINR(transaction.amount)}
          </div>
          <div className="mt-2">
            <Badge status={transaction.status} size="sm" />
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {transaction.description}
          </p>
        </div>

        {/* Transaction Meta Breakdown */}
        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Transaction ID</span>
            <span className="font-mono font-bold text-slate-900">{transaction.id}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Date &amp; Time</span>
            <span className="font-medium text-slate-900">{formatDateTime(transaction.date)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Transaction Type</span>
            <span className="font-semibold text-slate-900">{transaction.type}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Payment Gateway / Channel</span>
            <span className="font-medium text-slate-900">{transaction.paymentMethod || 'Utkal Core Banking'}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Bank Reference / UTR</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-900 font-medium">
              <span>{transaction.reference || 'UTR8892019482'}</span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="text-slate-400 hover:text-slate-700"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Receipt</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailModal;
