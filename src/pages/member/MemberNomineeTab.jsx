import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Edit3,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../../components/common/Modal';

const MemberNomineeTab = () => {
  const { user } = useAuth();
  const { members, addToast } = useFinance();
  const currentMember = members.find((m) => m.id === user?.id) || user || {};

  const [nominee, setNominee] = useState({
    title: currentMember.nomineeTitle || 'Mrs.',
    name: currentMember.nomineeName || 'Sunita Sharma',
    lastName: currentMember.nomineeLastName || 'Sharma',
    relationship: currentMember.nomineeRelationship || 'Spouse',
    dob: currentMember.nomineeDob || '1989-08-22',
    age: currentMember.nomineeAge || '37',
    address: currentMember.nomineeAddress || currentMember.address || 'Plot 142, VIP Area, Saheed Nagar, Bhubaneswar',
    mobileNumber: currentMember.nomineeMobile || '9861099887',
    idDetails: currentMember.nomineeIdDetails || 'Aadhaar Card: XXXX-XXXX-4421'
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...nominee });

  const handleSaveNominee = (e) => {
    e.preventDefault();
    setNominee({ ...formData });
    setEditModalOpen(false);
    addToast('Nominee details updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Nominee / Beneficiary Details
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered beneficiary designated under Section 72 of the Companies Act 2013
          </p>
        </div>

        <button
          onClick={() => setEditModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs self-start sm:self-auto"
        >
          <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Update Nominee</span>
        </button>
      </div>

      {/* Main Nominee Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-finance-50 text-finance-700 flex items-center justify-center font-bold text-xl border border-finance-200">
              {nominee.name?.charAt(0) || 'N'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">{nominee.title} {nominee.name}</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Primary Nominee
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Relationship: <strong>{nominee.relationship}</strong> &bull; Age: <strong>{nominee.age} Years</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date of Birth
            </span>
            <strong className="text-slate-900 text-sm">{nominee.dob}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> Contact Mobile Number
            </span>
            <strong className="text-slate-900 text-sm font-mono">{nominee.mobileNumber}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" /> Identity Reference
            </span>
            <strong className="text-slate-900 text-sm">{nominee.idDetails}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> Residential Address
            </span>
            <strong className="text-slate-900 text-sm">{nominee.address}</strong>
          </div>
        </div>
      </div>

      {/* Edit Nominee Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Update Nominee Information"
        subtitle="Modify statutory nominee designation for your Newutkal Finance membership"
      >
        <form onSubmit={handleSaveNominee} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Title</label>
              <select
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Nominee Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Relationship *</label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Mobile Number</label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Permanent Residential Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-finance-900 text-white font-bold"
            >
              Save Nominee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MemberNomineeTab;
