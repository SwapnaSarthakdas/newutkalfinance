import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

const AddMemberModal = ({ isOpen, onClose }) => {
  const { addMember } = useFinance();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bhubaneswar');
  const [occupation, setOccupation] = useState('Business Owner');
  const [initialDeposit, setInitialDeposit] = useState(50000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !phone) {
      setError('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addMember({
        name: fullName,
        email,
        phone,
        city,
        occupation,
        initialDeposit
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Member (Admin Desk)"
      subtitle="Create a new member account and allocate core banking ID"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Suman Mohanty"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="suman@domain.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98610 00000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">City / Branch Hub</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="Bhubaneswar">Bhubaneswar (HQ)</option>
              <option value="Cuttack">Cuttack Branch</option>
              <option value="Rourkela">Rourkela Branch</option>
              <option value="Berhampur">Berhampur Branch</option>
              <option value="Sambalpur">Sambalpur Branch</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Occupation</label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Initial Savings Balance (₹)</label>
          <input
            type="number"
            min="0"
            step="1000"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>{isSubmitting ? 'Registering...' : 'Provision Member'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemberModal;
