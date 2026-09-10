import React, { useState } from 'react';
import Modal from '../common/Modal';
import { formatINR } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';
import { CreditCard, CheckCircle2, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';

const PayEmiModal = ({ isOpen, onClose, loan }) => {
  const { payLoanEMI } = useFinance();
  const [paymentMode, setPaymentMode] = useState('netbanking');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!loan) return null;

  const handlePaySubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      payLoanEMI(loan.id, loan.monthlyEMI);
      setIsProcessing(false);
      onClose();
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Repay Loan EMI"
      subtitle={`Payment for ${loan.loanType} #${loan.id}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handlePaySubmit} className="space-y-5">
        {/* Loan Repayment Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Outstanding Balance</span>
            <span className="font-semibold text-slate-900">{formatINR(loan.outstandingAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>Monthly EMI Due</span>
            <span className="text-xl text-finance-600 font-extrabold">{formatINR(loan.monthlyEMI)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Select Repayment Mode</label>
          <div className="space-y-2">
            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMode === 'netbanking' ? 'border-finance-600 bg-finance-50/50' : 'border-slate-200 hover:bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMode"
                  value="netbanking"
                  checked={paymentMode === 'netbanking'}
                  onChange={() => setPaymentMode('netbanking')}
                  className="text-finance-600 focus:ring-finance-600"
                />
                <span className="text-xs font-semibold text-slate-900">Utkal Finance Linked Savings Account</span>
              </div>
              <Wallet className="w-4 h-4 text-finance-600" />
            </label>

            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMode === 'upi' ? 'border-finance-600 bg-finance-50/50' : 'border-slate-200 hover:bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMode"
                  value="upi"
                  checked={paymentMode === 'upi'}
                  onChange={() => setPaymentMode('upi')}
                  className="text-finance-600 focus:ring-finance-600"
                />
                <span className="text-xs font-semibold text-slate-900">Instant UPI (GPay, PhonePe, Paytm)</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Fast</span>
            </label>

            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMode === 'debit' ? 'border-finance-600 bg-finance-50/50' : 'border-slate-200 hover:bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMode"
                  value="debit"
                  checked={paymentMode === 'debit'}
                  onChange={() => setPaymentMode('debit')}
                  className="text-finance-600 focus:ring-finance-600"
                />
                <span className="text-xs font-semibold text-slate-900">Debit Card / NetBanking Gateway</span>
              </div>
              <CreditCard className="w-4 h-4 text-slate-400" />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center gap-2"
          >
            {isProcessing ? (
              <span>Authorizing Transfer...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pay {formatINR(loan.monthlyEMI)}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PayEmiModal;
