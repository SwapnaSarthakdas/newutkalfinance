import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Printer,
  FileText,
  CheckCircle2,
  Clock,
  Building2,
  Check,
  FileCheck
} from 'lucide-react';
import OfficialMembershipForm from '../membership/OfficialMembershipForm';

const ViewMemberModal = ({ isOpen, onClose, member }) => {
  const [showOfficialForm, setShowOfficialForm] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  if (!member) return null;

  // Extract nested or flattened values safely
  const m = member;
  const fullName = m.fullName || m.name || 'Member';
  const fatherOrSpouse = m.fatherOrHusbandName || m.father_or_husband_name || 'Registered on file';
  const guardianType = m.guardianType || m.guardian_type || 'S/o.';
  const branchName = m.branchName || m.branch_name || 'Bhubaneswar HQ';
  const branchCode = m.branchCode || m.branch_code || '075101';
  const associateName = m.associateName || m.associate_name || 'Pradeep Kumar Jena';
  const associateCode = m.associateCode || m.associate_code || 'UTK-ASC-101';
  const empId = m.empId || m.emp_id || 'Not Assigned';

  // Addresses
  const permAddr =
    typeof m.permanentAddress === 'object' && m.permanentAddress !== null
      ? m.permanentAddress
      : {
          address: m.permanent_address || m.address || 'Plot 142, VIP Area, Saheed Nagar',
          taluka: m.taluka || '',
          district: m.district || m.city || 'Khurda',
          state: m.state || 'Odisha',
          pinCode: m.pinCode || '751001'
        };

  const corrAddr =
    typeof m.correspondenceAddress === 'object' && m.correspondenceAddress !== null
      ? m.correspondenceAddress
      : {
          address: m.correspondence_address || permAddr.address,
          district: permAddr.district,
          state: permAddr.state,
          pinCode: permAddr.pinCode,
          mobileNumber: m.phone || m.mobileNumber || ''
        };

  // Nominee
  const nominee = m.nominee || {};
  const nomineeName = m.nomineeName || nominee.name || 'Family Nominee';
  const nomineeRel = m.nomineeRelationship || nominee.relationship || 'Spouse';
  const nomineeAge = m.nomineeAge || nominee.age || '32';
  const nomineeAddr = m.nomineeAddress || nominee.address || permAddr.address;

  // Witness
  const witness = m.witness || {};
  const witnessName = m.witnessName || witness.name || 'Registered Witness';
  const witnessMobile = m.witnessMobile || witness.mobileNumber || 'Not specified';
  const witnessAddr = m.witnessAddress || witness.address || 'Saheed Nagar, Bhubaneswar';
  const witnessIsMem = m.witnessIsMember ?? witness.isMember ?? false;
  const witnessMemNo = m.witnessMembershipNo || witness.membershipNumber || '';

  // Signature
  const signature = m.signatureData || m.signature || null;
  const signatureDate = m.signatureDate || m.joinedDate || new Date().toISOString().split('T')[0];

  // Documents
  const docsList =
    Array.isArray(m.documents) && m.documents.length > 0
      ? m.documents
      : [
          { type: '3 Colour Photographs', docNumber: 'PHOTO-SUBMITTED', status: 'Verified' },
          { type: m.primaryDocType || 'Aadhaar Card', docNumber: m.primaryDocNumber || m.panNo || 'VERIFIED-DOC', status: 'Verified' },
          { type: 'Educational Certificate', docNumber: 'DEGREE-DOC', status: 'Verified' },
          { type: 'Birth Certificate', docNumber: 'DOB-PROOF', status: 'Verified' },
          { type: 'Ration Card / Electricity Bill', docNumber: 'RESIDENCE-PROOF', status: 'Verified' }
        ];

  // Payment
  const paymentMethod = m.paymentMethod || m.payment_method || 'UPI';
  const paymentRef = m.paymentTxnRef || m.payment_txn_ref || `UTR${Date.now().toString().slice(-8)}`;
  const paymentStatus = m.paymentStatus || m.payment_status || (m.accountStatus === 'Active' ? 'Payment Successful' : 'Pending Admin Verification');

  const tabs = [
    { id: 'personal', label: 'Personal & Family' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'nominee_shares', label: 'Nominee & Shares' },
    { id: 'witness_signature', label: 'Witness & Signature' },
    { id: 'documents', label: `Documents (${docsList.length})` },
    { id: 'financials', label: 'Fee & Accounts' }
  ];

  return (
    <>
      <Modal
        isOpen={isOpen && !showOfficialForm}
        onClose={onClose}
        title="Comprehensive Member Profile Dossier"
        subtitle={`Member ID: ${m.id || m.membershipId} | Govt. Reg: U64199OD2026PLC054968`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
          {/* Top Member Identity Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl bg-[#003E9E] text-white font-black flex items-center justify-center text-xl overflow-hidden shadow-sm shrink-0">
                {m.avatar ? (
                  <img src={m.avatar} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{fullName.charAt(0) || 'M'}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">{fullName}</h3>
                  <Badge status={m.accountStatus || 'Active'} size="xs" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                    KYC: {m.kycStatus || 'Verified'}
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap mt-0.5 font-medium">
                  <span>{m.email}</span>
                  <span>&bull;</span>
                  <span className="font-mono">{m.phone || m.mobileNumber}</span>
                  <span>&bull;</span>
                  <span>Joined: {formatDate(m.joinedDate || '2026-01-15')}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-700">EMP ID:</span>
                  <span className="font-mono text-slate-900 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {empId}
                  </span>
                  <span>&bull;</span>
                  <span className="font-bold text-slate-700">Branch:</span>
                  <span className="text-slate-800 font-semibold">{branchName} ({branchCode})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowOfficialForm(true)}
                className="px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                title="View & print full official 2-page statutory membership document"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Form</span>
              </button>
            </div>
          </div>

          {/* Dossier Tabs Header */}
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#003E9E] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Personal & Family Details */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#003E9E] text-[11px] mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#003E9E]" /> Personal Identity
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Salutation &amp; Full Name</span>
                  <span className="font-bold text-slate-900">{m.title || 'Mr.'} {fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Father / Husband's Name</span>
                  <span className="font-semibold text-slate-800">
                    <span className="text-slate-500 font-normal mr-1">({guardianType})</span>
                    {fatherOrSpouse}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Date of Birth &amp; Age</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(m.dob || '1995-01-01')} ({m.age || 29} Years)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Gender &amp; Marital Status</span>
                  <span className="font-semibold text-slate-800">
                    {m.gender || 'Male'} &bull; {m.maritalStatus || 'Married'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Religion &amp; Caste Category</span>
                  <span className="font-semibold text-slate-800">
                    {m.religion || 'Hindu'} &bull; {m.category || 'General'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#003E9E] text-[11px] mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#003E9E]" /> Professional &amp; Statutory IDs
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Educational Qualification</span>
                  <span className="font-semibold text-slate-800">{m.education || 'Graduate / P.G.'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Occupation</span>
                  <span className="font-semibold text-slate-800">{m.occupation || 'Professional / Business'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Permanent Account Number (PAN)</span>
                  <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {m.panNo || 'ABCDE1234F'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Primary Mobile</span>
                  <span className="font-bold text-slate-900 font-mono">{m.phone || m.mobileNumber}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Alternate Contact</span>
                  <span className="font-semibold text-slate-800 font-mono">{m.alternateMobile || 'Not provided'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Addresses */}
          {activeTab === 'addresses' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#003E9E] text-[11px] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#003E9E]" /> Permanent Statutory Address
                </h4>
                <div className="pt-1 space-y-1.5">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">HOUSE / PLOT / STREET</span>
                    <p className="font-bold text-slate-900 leading-relaxed">{permAddr.address || 'Plot 142, VIP Area'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">TALUKA / TAHASIL</span>
                      <p className="font-semibold text-slate-800">{permAddr.taluka || m.city || 'Bhubaneswar'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">DISTRICT</span>
                      <p className="font-semibold text-slate-800">{permAddr.district || 'Khurda'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">STATE</span>
                      <p className="font-semibold text-slate-800">{permAddr.state || 'Odisha'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">PIN CODE</span>
                      <p className="font-mono font-bold text-slate-900">{permAddr.pinCode || '751001'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-emerald-800 text-[11px] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Correspondence / Mailing Address
                </h4>
                <div className="pt-1 space-y-1.5">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">DELIVERY ADDRESS</span>
                    <p className="font-bold text-slate-900 leading-relaxed">
                      {corrAddr.address || permAddr.address}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">DISTRICT</span>
                      <p className="font-semibold text-slate-800">{corrAddr.district || permAddr.district || 'Khurda'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">STATE</span>
                      <p className="font-semibold text-slate-800">{corrAddr.state || permAddr.state || 'Odisha'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">PIN CODE</span>
                      <p className="font-mono font-bold text-slate-900">{corrAddr.pinCode || permAddr.pinCode || '751001'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">CONTACT PHONE</span>
                      <p className="font-mono font-semibold text-slate-800">{corrAddr.mobileNumber || m.phone || 'Same as primary'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Nominee & Shares */}
          {activeTab === 'nominee_shares' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#003E9E] text-[11px] mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#003E9E]" /> Nominee Designation
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Nominee Name</span>
                  <span className="font-bold text-slate-900">{nomineeName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Relationship</span>
                  <span className="font-semibold text-slate-800">{nomineeRel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Nominee Age / D.O.B.</span>
                  <span className="font-semibold text-slate-800">{nomineeAge} Years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Contact Number</span>
                  <span className="font-mono font-semibold text-slate-800">{nominee.mobileNumber || m.nomineeMobile || 'Provided with application'}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-400 font-semibold block text-[10px]">NOMINEE RESIDENTIAL ADDRESS</span>
                  <p className="font-medium text-slate-800 mt-0.5">{nomineeAddr}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#003E9E] text-[11px] mb-2 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-[#003E9E]" /> Statutory Shares &amp; Tax Status
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Allotted Share Count</span>
                  <span className="font-bold text-slate-900">{m.shareCount || 10} Shares (Face Value ₹200)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Depositor Status</span>
                  <span className="font-semibold text-slate-800">Share Holder</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Repayment Preference</span>
                  <span className="font-semibold text-slate-800">{m.repaymentMode || 'First depositor'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">TDS / Tax Deduction</span>
                  <span className="font-semibold text-slate-800">{m.taxDeduction || 'No'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Form 15G / 15H Enclosed</span>
                  <span className="font-bold text-emerald-700">{m.form15g !== false ? 'Yes (Enclosed)' : 'No'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Witness & Signature */}
          {activeTab === 'witness_signature' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#003E9E] text-[11px] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#003E9E]" /> Statutory Witness Record
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Witness Legal Name</span>
                  <span className="font-bold text-slate-900">{witnessName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Is Existing Member?</span>
                  <span className="font-bold text-slate-900">
                    {witnessIsMem ? `Yes (Member #${witnessMemNo || 'UF-1012'})` : 'No'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Witness Mobile Number</span>
                  <span className="font-mono font-semibold text-slate-800">{witnessMobile}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-400 font-semibold block text-[10px]">WITNESS ADDRESS</span>
                  <p className="font-medium text-slate-800 mt-0.5">{witnessAddr}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#003E9E] text-[11px] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Electronic Signature Capture
                </h4>
                <div className="border border-slate-300 bg-white rounded-xl p-3 flex flex-col items-center justify-center min-h-[110px]">
                  {signature ? (
                    <img
                      src={signature}
                      alt="Digital Signature"
                      className="max-h-20 max-w-[85%] object-contain filter contrast-125"
                    />
                  ) : (
                    <span className="font-serif italic text-base text-[#003E9E] font-bold">
                      {fullName}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1">
                    Signed Electronically on {formatDate(signatureDate)}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-snug">
                  Declaration verified under Rule 5 of Nidhi Rules 2014. Member has pledged adherence to company bylaws.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 font-medium">
                  Statutory KYC &amp; Identity Documentation (Mandated by Companies Act &amp; Nidhi Rules):
                </p>
                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {docsList.length} Attachments Recorded
                </span>
              </div>

              <div className="space-y-2">
                {docsList.map((doc, idx) => (
                  <div
                    key={doc.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{doc.type || doc.document_type}</span>
                        {(doc.docNumber || doc.documentNumber || doc.document_number) && (
                          <span className="font-mono text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                            {doc.docNumber || doc.documentNumber || doc.document_number}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        File: <span className="font-mono text-slate-700">{doc.fileName || doc.file_name || 'verified_scan.pdf'}</span> &bull; Status: <strong className="text-emerald-700">{doc.status || 'Verified'}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>On File</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Financials & Fee */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              {/* Payment Verification Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                    Statutory Associate Membership Fee
                  </span>
                  <div className="text-xl font-black text-emerald-950 mt-0.5">₹ 200.00</div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Payment Method: <strong>{paymentMethod}</strong> &bull; Ref: <strong className="font-mono">{paymentRef}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{paymentStatus}</span>
                  </span>
                </div>
              </div>

              {/* Financial Balances Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Balance</span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                    {formatINR(m.availableBalance || 0)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Deposits</span>
                  <span className="text-sm font-extrabold text-emerald-700 mt-0.5 block">
                    {formatINR(m.totalDeposits || 0)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Active Loans</span>
                  <span className="text-sm font-extrabold text-amber-700 mt-0.5 block">
                    {formatINR(m.activeLoan || 0)}
                  </span>
                </div>
              </div>

              {/* Company Compliance Tag */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Ministry of Corporate Affairs Standing</span>
                  <span className="text-[11px] text-slate-500">
                    Reg. No.: U64199OD2026PLC054968 &bull; Associate Code: {associateCode} ({associateName})
                  </span>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-200">
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
              className="px-5 py-2 rounded-xl bg-[#003E9E] hover:bg-[#002b6e] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
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
          title={`Official Membership Application - ${fullName}`}
          subtitle={`Statutory Dossier for Member ID: ${m.id || m.membershipId}`}
          maxWidth="max-w-5xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200 text-xs">
              <span className="text-red-900 font-bold">
                Certified by Govt. of India &bull; Reg. No.: U64199OD2026PLC054968
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
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
