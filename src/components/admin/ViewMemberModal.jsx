import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { formatINR, formatDate } from '../../utils/formatters';
import { User, Phone, Mail, MapPin, Calendar, Briefcase, Users, ShieldCheck, CreditCard, TrendingUp, Printer, FileText } from 'lucide-react';
import OfficialMembershipForm from '../membership/OfficialMembershipForm';

const ViewMemberModal = ({ isOpen, onClose, member }) => {
  const [showOfficialForm, setShowOfficialForm] = useState(false);

  if (!member) return null;

  return (
    <>
      <Modal
        isOpen={isOpen && !showOfficialForm}
        onClose={onClose}
        title="Member Profile Dossier"
        subtitle={`Member ID: ${member.id}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          {/* Profile Card Top */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-finance-900 text-white font-bold flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <span>{member.name?.charAt(0) || 'M'}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <Badge status={member.accountStatus} size="xs" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{member.email} &bull; {member.phone}</p>
              <p className="text-[11px] text-slate-400">Joined on {formatDate(member.joinedDate || '2024-01-15')}</p>
            </div>
          </div>

          {/* Financial Highlights */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Balance</span>
              <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                {formatINR(member.availableBalance || 0)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Deposits</span>
              <span className="text-sm font-extrabold text-emerald-700 mt-0.5 block">
                {formatINR(member.totalDeposits || 0)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Active Loans</span>
              <span className="text-sm font-extrabold text-amber-700 mt-0.5 block">
                {formatINR(member.activeLoan || 0)}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Residential Details</span>
              <p className="font-semibold text-slate-900">{member.address}</p>
              <p className="text-slate-600">{member.city}, {member.state} - {member.pinCode}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nominee Information</span>
              <p className="font-semibold text-slate-900">{member.nomineeName || 'Registered on file'}</p>
              <p className="text-slate-600">Relationship: {member.nomineeRelationship || 'Family'}</p>
            </div>
          </div>

          {/* Statutory Registration Box */}
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-red-950 uppercase tracking-wider block">
                Statutory Membership Application Record
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Reg. No.: U64199OD2026PLC054968 &bull; Associate Membership Fee: ₹ 200
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowOfficialForm(true)}
              className="px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 flex-shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Form</span>
            </button>
          </div>

          {/* Compliance Checklist */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Compliance &amp; Verification Checks
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Aadhaar e-KYC: Verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>PAN Card: Active</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>CIBIL Score: 785</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setShowOfficialForm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-800 hover:text-red-950 hover:underline"
            >
              <Printer className="w-4 h-4" />
              <span>Print 2-Page Official Membership Form</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-finance-900 text-white text-xs font-bold uppercase tracking-wider"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </Modal>

      {/* Official 2-Page Form Modal */}
      {showOfficialForm && (
        <Modal
          isOpen={true}
          onClose={() => setShowOfficialForm(false)}
          title={`Official Membership Application - ${member.name}`}
          subtitle={`Statutory Dossier for Member ID: ${member.id}`}
          maxWidth="max-w-5xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200 text-xs">
              <span className="text-red-900 font-bold">
                Certified by Govt. of India &bull; Reg. No.: U64199OD2026PLC054968
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setShowOfficialForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Back to Dossier
                </button>
              </div>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-2 bg-slate-100 rounded-xl">
              <OfficialMembershipForm data={member} isBlank={false} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ViewMemberModal;
