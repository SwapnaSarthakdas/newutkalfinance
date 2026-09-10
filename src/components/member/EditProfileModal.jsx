import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import {
  User,
  CheckCircle2,
  Lock,
  ShieldAlert,
  Building2,
  FileText,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateCurrentUser } = useAuth();
  const { members, updateMember, addToast } = useFinance();

  const currentMember = members.find((m) => m.id === user?.id) || user || {};

  // Editable Fields
  const [phone, setPhone] = useState(currentMember.phone || '');
  const [altPhone, setAltPhone] = useState(currentMember.altPhone || '');
  const [correspondenceAddress, setCorrespondenceAddress] = useState(
    currentMember.correspondenceAddress || currentMember.address || ''
  );
  const [city, setCity] = useState(currentMember.city || 'Bhubaneswar');
  const [state, setState] = useState(currentMember.state || 'Odisha');
  const [pinCode, setPinCode] = useState(currentMember.pinCode || '751007');
  const [occupation, setOccupation] = useState(currentMember.occupation || 'Service');
  const [qualification, setQualification] = useState(currentMember.qualification || 'Graduate');
  const [maritalStatus, setMaritalStatus] = useState(currentMember.maritalStatus || 'Married');
  const [nomineeName, setNomineeName] = useState(currentMember.nomineeName || '');
  const [nomineeAge, setNomineeAge] = useState(currentMember.nomineeAge || '32');
  const [nomineeRelationship, setNomineeRelationship] = useState(
    currentMember.nomineeRelationship || 'Spouse'
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    const updated = {
      phone,
      altPhone,
      correspondenceAddress,
      address: correspondenceAddress, // sync primary address if updated
      city,
      state,
      pinCode,
      occupation,
      qualification,
      maritalStatus,
      nomineeName,
      nomineeAge,
      nomineeRelationship
    };

    setTimeout(() => {
      updateCurrentUser(updated);
      if (currentMember.id) {
        updateMember(currentMember.id, updated);
      }
      setIsSaving(false);
      addToast?.('Profile updated successfully!', 'success');
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Member Profile"
      subtitle="Update contact address, profession, and statutory nominee details"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pr-2">
        {/* Statutory Regulatory Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-amber-950">Statutory KYC Security &amp; Compliance Notice</h5>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              In accordance with Section 406 of the Companies Act 2013, verified identity records 
              (<strong>Aadhaar Card, PAN, Member ID, EMP ID, and Assigned Branch</strong>) are locked and 
              cannot be altered directly by members. For identity corrections, please submit a formal correction request 
              or visit your home branch with original documents.
            </p>
          </div>
        </div>

        {/* Section 1: Locked Sensitive KYC Fields */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              <span>Locked Statutory Credentials</span>
            </h4>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Requires Admin Approval
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Membership ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={currentMember.id || 'UF-2026-1048'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-200/70 border border-slate-300 text-slate-700 font-mono font-bold text-xs cursor-not-allowed"
                />
                <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Assigned EMP ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={currentMember.empId || currentMember.emp_id || 'EMP-2024-001'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-200/70 border border-slate-300 text-slate-700 font-mono font-bold text-xs cursor-not-allowed"
                />
                <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Branch Allotment
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={currentMember.branchName || 'Bhubaneswar HQ (075101)'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-200/70 border border-slate-300 text-slate-700 font-semibold text-xs cursor-not-allowed"
                />
                <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Aadhaar Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={currentMember.aadharNo || '•••• •••• 1234'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-200/70 border border-slate-300 text-slate-700 font-mono text-xs cursor-not-allowed"
                />
                <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                PAN Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={currentMember.panNo || '•••••1489K'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-200/70 border border-slate-300 text-slate-700 font-mono text-xs cursor-not-allowed"
                />
                <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Permanent Address (Official KYC)
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={currentMember.address || 'Plot 42, Saheed Nagar, Bhubaneswar'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-200/70 border border-slate-300 text-slate-700 text-xs cursor-not-allowed truncate"
                />
                <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Editable Contact & Correspondence Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            Contact &amp; Correspondence Information (Editable)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Mobile Number *</label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alternate / WhatsApp Mobile</label>
              <input
                type="tel"
                maxLength={10}
                placeholder="Optional 10-digit number"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correspondence / Present Address *
              </label>
              <input
                type="text"
                required
                value={correspondenceAddress}
                onChange={(e) => setCorrespondenceAddress(e.target.value)}
                placeholder="House / Flat No, Street, Locality, Landmark"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City / Town *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Occupation & Demographics */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            Occupation &amp; Demographics
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Occupation</label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
              >
                <option value="Service">Service</option>
                <option value="Business">Business</option>
                <option value="Farming">Farming</option>
                <option value="Professional">Professional</option>
                <option value="Housewife">Housewife</option>
                <option value="Student">Student</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Educational Qualification</label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
              >
                <option value="Matriculation">Matriculation</option>
                <option value="Intermediate / +2">Intermediate / +2</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Marital Status</label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Nominee Preferences */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            Statutory Nominee Designation
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nominee Full Name *</label>
              <input
                type="text"
                required
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                placeholder="Full name as per ID"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nominee Relationship *</label>
              <select
                value={nomineeRelationship}
                onChange={(e) => setNomineeRelationship(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 bg-white"
              >
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nominee Age (Years)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={nomineeAge}
                onChange={(e) => setNomineeAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-finance-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
