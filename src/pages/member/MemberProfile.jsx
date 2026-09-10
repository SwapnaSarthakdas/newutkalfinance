import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Users, ShieldCheck, Edit3, KeyRound, FileText, Printer } from 'lucide-react';
import EditProfileModal from '../../components/member/EditProfileModal';
import Modal from '../../components/common/Modal';
import OfficialMembershipForm from '../../components/membership/OfficialMembershipForm';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

const MemberProfile = () => {
  const { user } = useAuth();
  const { members } = useFinance();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);

  const member = members.find((m) => m.id === user?.id) || user || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Member Profile &amp; KYC
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified membership information, contact address, and registered beneficiary details
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setFormModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100 text-red-950 text-xs font-bold uppercase tracking-wider shadow-xs transition-all"
            title="View your official statutory 2-page application document"
          >
            <FileText className="w-4 h-4 text-red-700" />
            <span>Membership Form</span>
          </button>

          <button
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            <Edit3 className="w-4 h-4 text-emerald-400" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100">
          <div className="w-24 h-24 rounded-2xl bg-finance-900 text-white font-bold flex items-center justify-center overflow-hidden border-2 border-slate-200 flex-shrink-0 shadow-md">
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">{member.name?.charAt(0) || 'U'}</span>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h3 className="text-2xl font-black text-slate-900">{member.name}</h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> KYC Verified
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {member.accountStatus || 'Active'}
              </span>
            </div>

            <p className="text-xs font-mono text-finance-600 font-bold">
              Member ID: {member.id} &bull; Joined {formatDate(member.joinedDate || '2024-01-15')}
            </p>

            <p className="text-xs text-slate-500 max-w-xl">
              Newutkal Finance Ltd. Certified Member with statutory associate membership rights (Reg. No.: U64199OD2026PLC054968).
            </p>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {/* Personal & Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-4 h-4 text-finance-600" />
              <span>Personal &amp; Contact Details</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Full Legal Name</span>
                <span className="font-semibold text-slate-900">{member.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Date of Birth</span>
                <span className="font-medium text-slate-900">{formatDate(member.dob || '1987-06-14')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Gender</span>
                <span className="font-medium text-slate-900">{member.gender || 'Male'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Registered Email</span>
                <span className="font-medium text-slate-900">{member.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Primary Mobile</span>
                <span className="font-medium text-slate-900">{member.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Current Occupation</span>
                <span className="font-medium text-slate-900">{member.occupation || 'Professional'}</span>
              </div>
            </div>
          </div>

          {/* Address & Nominee Details */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
                <MapPin className="w-4 h-4 text-finance-600" />
                <span>Residential Address</span>
              </h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <p className="font-semibold text-slate-900">{member.address}</p>
                <p className="text-slate-600">{member.city}, {member.state} - {member.pinCode}</p>
                <p className="text-[10px] text-slate-400">Address Proof Verified via UIDAI / Aadhaar</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
                <Users className="w-4 h-4 text-finance-600" />
                <span>Registered Nominee / Beneficiary</span>
              </h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominee Name</span>
                  <span className="font-bold text-slate-900">{member.nomineeName || 'Sunita Sharma'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Relationship</span>
                  <span className="font-medium text-slate-700">{member.nomineeRelationship || 'Spouse'}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Nomination Status</span>
                  <span className="text-emerald-700 font-semibold">Active &bull; 100% Share</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />

      {/* Official 2-Page Membership Form Modal */}
      {formModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setFormModalOpen(false)}
          title="Official Membership Application Form (2 Pages)"
          subtitle={`Statutory Registered Application &bull; Member ID: ${member.id}`}
          maxWidth="max-w-5xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200 text-xs">
              <span className="text-red-900 font-bold">
                Certified by Govt. of India &bull; Reg. No.: U64199OD2026PLC054968
              </span>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-2 bg-slate-100 rounded-xl">
              <OfficialMembershipForm data={member} isBlank={false} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MemberProfile;
