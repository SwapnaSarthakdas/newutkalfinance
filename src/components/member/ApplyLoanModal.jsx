import React, { useState } from 'react';
import Modal from '../common/Modal';
import { calculateEMI } from '../../utils/calculators';
import { formatINR } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { CreditCard, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

const ApplyLoanModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { applyLoan } = useFinance();

  const [loanType, setLoanType] = useState('Personal Loan');
  const [amount, setAmount] = useState(300000);
  const [tenure, setTenure] = useState(36);
  const [purpose, setPurpose] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(120000);
  const [employmentType, setEmploymentType] = useState('Salaried - Private Sector');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Loan rates per type
  const interestRates = {
    'Personal Loan': 10.5,
    'Home Loan': 8.4,
    'Business Loan': 11.2,
    'Vehicle Loan': 9.25,
    'Gold Loan': 7.8,
    'Education Loan': 8.75
  };

  const currentRate = interestRates[loanType] || 10.0;
  const emiData = calculateEMI(amount, currentRate, tenure);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!purpose.trim()) {
      setErrorMsg('Please specify the purpose of the loan.');
      return;
    }

    if (amount <= 0 || tenure <= 0) {
      setErrorMsg('Please enter valid amount and tenure.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      applyLoan({
        memberId: user?.id || 'UF-2026-1048',
        memberName: user?.name || 'Rajesh Sharma',
        loanType,
        amount,
        tenure,
        interestRate: currentRate,
        monthlyEMI: emiData.emi,
        purpose,
        monthlyIncome,
        employmentType
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for a New Loan"
      subtitle="Complete your digitized application for instant credit evaluation"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Loan Category *</label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="Personal Loan">Personal Loan (10.5% p.a.)</option>
              <option value="Home Loan">Home Loan (8.4% p.a.)</option>
              <option value="Business Loan">Business Expansion Loan (11.2% p.a.)</option>
              <option value="Vehicle Loan">Vehicle Loan (9.25% p.a.)</option>
              <option value="Gold Loan">Gold Loan (7.8% p.a.)</option>
              <option value="Education Loan">Higher Education Loan (8.75% p.a.)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Employment Type *</label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="Salaried - Private Sector">Salaried - Private Sector</option>
              <option value="Salaried - Public / Govt">Salaried - Public / Govt</option>
              <option value="Self-Employed Professional">Self-Employed Professional</option>
              <option value="Business Owner / Merchant">Business Owner / Merchant</option>
              <option value="Agri-Producer">Agri-Producer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Required Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="25000"
              max="10000000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Repayment Tenure (Months) *
            </label>
            <select
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="12">12 Months (1 Year)</option>
              <option value="24">24 Months (2 Years)</option>
              <option value="36">36 Months (3 Years)</option>
              <option value="48">48 Months (4 Years)</option>
              <option value="60">60 Months (5 Years)</option>
              <option value="84">84 Months (7 Years)</option>
              <option value="120">120 Months (10 Years)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Monthly Net Income (₹) *
            </label>
            <input
              type="number"
              required
              min="15000"
              step="5000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Loan Purpose *</label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Business Working Capital / Home Renovation"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
            />
          </div>
        </div>

        {/* Live Calculation Preview Box */}
        <div className="p-4 rounded-2xl bg-finance-950 text-white border border-finance-800 space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-finance-850">
            <span className="text-xs text-slate-400 font-medium">Estimated Monthly EMI</span>
            <span className="text-xl font-black text-emerald-400">{formatINR(emiData.emi)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Interest Rate</span>
              <strong className="text-slate-200">{currentRate}% p.a.</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Total Interest</span>
              <strong className="text-amber-400">{formatINR(emiData.totalInterest)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Total Payable</span>
              <strong className="text-white">{formatINR(emiData.totalPayment)}</strong>
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
            className="px-6 py-2.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>{isSubmitting ? 'Submitting Application...' : 'Submit Loan Application'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyLoanModal;
