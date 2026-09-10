import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { TrendingUp, AlertCircle } from 'lucide-react';

const AddDepositModal = ({ isOpen, onClose }) => {
  const { members, createDeposit } = useFinance();

  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [type, setType] = useState('Fixed Deposit (Cumulative)');
  const [amount, setAmount] = useState(250000);
  const [tenureMonths, setTenureMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(7.75);

  const handleSubmit = (e) => {
    e.preventDefault();
    const member = members.find((m) => m.id === selectedMemberId) || members[0];
    createDeposit({
      memberId: member.id,
      memberName: member.name,
      type,
      amount,
      tenureMonths,
      interestRate
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Member Deposit (Admin Desk)"
      subtitle="Book term deposits, cumulative schemes or monthly yield accounts"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Select Beneficiary Member *</label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Deposit Scheme</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
          >
            <option value="Fixed Deposit (Cumulative)">Fixed Deposit (Cumulative) - 7.75%</option>
            <option value="Recurring Deposit">Recurring Deposit (RD) - 7.25%</option>
            <option value="Senior Citizen Shield FD">Senior Citizen Special FD - 8.25%</option>
            <option value="Corporate Liquid Deposit">Corporate Liquid Deposit - 7.50%</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              required
              min="10000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tenure (Months)</label>
            <select
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="12">12 Months</option>
              <option value="24">24 Months</option>
              <option value="36">36 Months</option>
              <option value="60">60 Months</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDepositModal;
