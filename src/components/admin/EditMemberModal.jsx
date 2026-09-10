import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { CheckCircle2 } from 'lucide-react';

const EditMemberModal = ({ isOpen, onClose, member }) => {
  const { updateMember } = useFinance();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [accountStatus, setAccountStatus] = useState('Active');
  const [kycStatus, setKycStatus] = useState('Verified');

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setEmail(member.email || '');
      setPhone(member.phone || '');
      setCity(member.city || '');
      setAccountStatus(member.accountStatus || 'Active');
      setKycStatus(member.kycStatus || 'Verified');
    }
  }, [member]);

  if (!member) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMember(member.id, {
      name,
      email,
      phone,
      city,
      accountStatus,
      kycStatus
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Member: ${member.name}`}
      subtitle={`Member ID: ${member.id}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
            <select
              value={accountStatus}
              onChange={(e) => setAccountStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">KYC Status</label>
            <select
              value={kycStatus}
              onChange={(e) => setKycStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
            >
              <option value="Verified">Verified</option>
              <option value="In Review">In Review</option>
              <option value="Flagged">Flagged</option>
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
            className="px-5 py-2 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider shadow"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditMemberModal;
