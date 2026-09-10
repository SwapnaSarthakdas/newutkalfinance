import React, { useState } from 'react';
import Modal from '../common/Modal';
import { calculateFDReturns } from '../../utils/calculators';
import { formatINR } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { TrendingUp, AlertCircle } from 'lucide-react';

const CreateDepositModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { createDeposit } = useFinance();

  const [type, setType] = useState('Fixed Deposit (Cumulative)');
  const [amount, setAmount] = useState(100000);
  const [tenureMonths, setTenureMonths] = useState(36);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Scheme rates
  const schemeRates = {
    'Fixed Deposit (Cumulative)': 7.75,
    'Fixed Deposit (Monthly Payout)': 7.50,
    'Recurring Deposit': 7.25,
    'Senior Citizen Shield FD': 8.25,
    'Tax Saver Fixed Deposit (5 Yrs)': 7.10
  };

  const interestRate = schemeRates[type] || 7.5;
  const tenureYears = tenureMonths / 12;
  const calcResult = calculateFDReturns(amount, interestRate, tenureYears);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (amount < 5000) {
      setErrorMsg('Minimum deposit amount is ₹5,000.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      createDeposit({
        memberId: user?.id || 'UF-2026-1048',
        memberName: user?.name || 'Rajesh Sharma',
        type,
        amount,
        tenureMonths,
        interestRate
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Open a Term / Recurring Deposit"
      subtitle="Lock in high guaranteed interest rates backed by Utkal Finance"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Deposit Scheme *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
          >
            <option value="Fixed Deposit (Cumulative)">Fixed Deposit (Cumulative) - 7.75% p.a.</option>
            <option value="Fixed Deposit (Monthly Payout)">Fixed Deposit (Monthly Interest) - 7.50% p.a.</option>
            <option value="Recurring Deposit">Recurring Deposit (RD) - 7.25% p.a.</option>
            <option value="Senior Citizen Shield FD">Senior Citizen Special FD - 8.25% p.a.</option>
            <option value="Tax Saver Fixed Deposit (5 Yrs)">Tax Saver Fixed Deposit - 7.10% p.a.</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deposit Amount (₹) *</label>
            <input
              type="number"
              required
              min="5000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tenure Period *</label>
            <select
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="12">12 Months (1 Year)</option>
              <option value="24">24 Months (2 Years)</option>
              <option value="36">36 Months (3 Years)</option>
              <option value="48">48 Months (4 Years)</option>
              <option value="60">60 Months (5 Years)</option>
              <option value="120">120 Months (10 Years)</option>
            </select>
          </div>
        </div>

        {/* Maturity Preview */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-finance-950 text-white border border-slate-800 space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400">Projected Maturity Value</span>
            <span className="text-xl font-black text-emerald-400">
              {formatINR(calcResult.maturityAmount)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span className="text-[10px] text-slate-400 block">Guaranteed Annual Rate</span>
              <strong className="text-slate-200">{interestRate}% p.a. (Quarterly)</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Total Interest Earned</span>
              <strong className="text-amber-400">{formatINR(calcResult.interestEarned)}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isSubmitting ? 'Booking Deposit...' : 'Confirm Deposit Booking'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDepositModal;
