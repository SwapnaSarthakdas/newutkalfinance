import React, { useState } from 'react';
import {
  FileCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  FileText,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { api } from '../../services/api';

const DEFAULT_DOCUMENTS = [
  { id: 'DOC-1', type: '3 Recent Colour Photographs', status: 'Verified', fileName: 'passport_photo.jpg', docNumber: 'PHOTO-001', verifiedDate: '2024-01-16' },
  { id: 'DOC-2', type: 'Aadhaar / Voter ID / PAN Card / Driving Licence', status: 'Verified', fileName: 'aadhaar_card.pdf', docNumber: '5421-XXXX-1234', verifiedDate: '2024-01-16' },
  { id: 'DOC-3', type: 'Educational Certificate', status: 'Verified', fileName: 'degree_certificate.pdf', docNumber: 'DEG-UTK-849', verifiedDate: '2024-01-16' },
  { id: 'DOC-4', type: 'Birth Certificate', status: 'Verified', fileName: 'birth_certificate.pdf', docNumber: 'BC-1987-0941', verifiedDate: '2024-01-16' },
  { id: 'DOC-5', type: 'Ration Card / Account Statement / Electricity Bill', status: 'Verified', fileName: 'electricity_bill.pdf', docNumber: 'EB-7510-09', verifiedDate: '2024-01-16' }
];

const MemberDocumentsTab = () => {
  const { user } = useAuth();
  const { addToast } = useFinance();
  const [docs, setDocs] = useState(DEFAULT_DOCUMENTS);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleFileUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    setTimeout(() => {
      setDocs((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          status: 'Under Review',
          fileName: file.name
        };
        return updated;
      });
      setUploadingIndex(null);
      addToast(`Document "${docs[index].type}" uploaded for verification.`, 'success');
    }, 600);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Under Review
          </span>
        );
      case 'Uploaded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-finance-700 bg-finance-50 px-2.5 py-1 rounded-full border border-finance-200">
            <FileCheck className="w-3.5 h-3.5 text-finance-600" />
            Uploaded
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            Not Uploaded
          </span>
        );
    }
  };

  const verifiedCount = docs.filter((d) => d.status === 'Verified').length;
  const completionPercent = Math.round((verifiedCount / docs.length) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            KYC Document Verification Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statutory KYC attachments mandated under Companies Act 2013 &amp; Nidhi Rules
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">KYC Standing</span>
            <strong className="text-xs text-slate-900">{verifiedCount} of {docs.length} Verified</strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center border border-emerald-200">
            {completionPercent}%
          </div>
        </div>
      </div>

      {/* Security Info Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Bank-Grade Document Privacy</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Your documents are encrypted using 256-bit AES encryption and strictly accessible only to authorized audit officers.
            </p>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {docs.map((doc, idx) => (
          <div
            key={doc.id}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 flex-shrink-0">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{doc.type}</h4>
                  {getStatusBadge(doc.status)}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  {doc.docNumber && (
                    <span>Reference: <strong className="font-mono text-slate-700">{doc.docNumber}</strong></span>
                  )}
                  {doc.fileName && (
                    <span>File: <span className="font-mono text-slate-600">{doc.fileName}</span></span>
                  )}
                  {doc.verifiedDate && (
                    <span className="text-emerald-700">Verified: {doc.verifiedDate}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>{uploadingIndex === idx ? 'Uploading...' : 'Re-upload / Update'}</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  disabled={uploadingIndex === idx}
                  onChange={(e) => handleFileUpload(idx, e)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDocumentsTab;
