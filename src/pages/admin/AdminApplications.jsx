import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  Printer,
  Check,
  X,
  ShieldAlert,
  Clock,
  UserCheck,
  ShieldCheck,
  Download,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Award,
  Users,
  AlertCircle,
  FileSpreadsheet,
  ExternalLink,
  History
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import OfficialMembershipForm from '../../components/membership/OfficialMembershipForm';
import { formatINR, formatDate } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';

const AdminApplications = () => {
  const {
    applications,
    branches,
    associates,
    approveApplication,
    confirmPaymentAndActivate,
    rejectApplication,
    requestCorrection,
    updateDocumentStatus,
    auditLogs,
    addToast
  } = useFinance();
  const { user: currentAdmin } = useAuth();

  // Filters state
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedBranch, setSelectedBranch] = useState('ALL');

  // Modals state
  const [dossierApp, setDossierApp] = useState(null);
  const [activeDossierTab, setActiveDossierTab] = useState('overview');
  const [formModalApp, setFormModalApp] = useState(null);

  // Action Modals
  const [approveCandidate, setApproveCandidate] = useState(null);
  const [allocatedEmpId, setAllocatedEmpId] = useState('');
  const [allocatedBranch, setAllocatedBranch] = useState('BR-001');

  const [rejectCandidate, setRejectCandidate] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [correctionCandidate, setCorrectionCandidate] = useState(null);
  const [correctionNotes, setCorrectionNotes] = useState('');

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: applications.length,
      pendingPayment: applications.filter((a) => a.status !== 'Approved' && a.status !== 'Rejected').length,
      submitted: applications.filter(
        (a) => a.status === 'Submitted' || a.status === 'Under Review'
      ).length,
      pendingDocs: applications.filter((a) => {
        const hasUnverified = a.documents?.some((d) => d.status === 'Under Review' || d.status === 'Uploaded');
        return hasUnverified && a.status !== 'Approved' && a.status !== 'Rejected';
      }).length,
      approved: applications.filter((a) => a.status === 'Approved').length,
      rejected: applications.filter((a) => a.status === 'Rejected').length,
      correction: applications.filter((a) => a.status === 'Correction Requested').length
    };
  }, [applications]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase();
      const name = (app.member?.name || app.fullName || '').toLowerCase();
      const appId = (app.id || '').toLowerCase();
      const email = (app.member?.email || app.email || '').toLowerCase();
      const phone = (app.member?.phone || app.mobile || '');

      const matchSearch =
        name.includes(q) || appId.includes(q) || email.includes(q) || phone.includes(q);

      if (!matchSearch) return false;

      // Tab filter
      if (activeTab === 'PENDING_PAYMENT') {
        if (app.status === 'Approved' || app.status === 'Rejected') return false;
      } else if (activeTab === 'SUBMITTED') {
        if (app.status !== 'Submitted' && app.status !== 'Under Review') return false;
      } else if (activeTab === 'PENDING_DOCS') {
        const hasPending = app.documents?.some((d) => d.status === 'Under Review' || d.status === 'Uploaded');
        if (!hasPending || app.status === 'Approved' || app.status === 'Rejected') return false;
      } else if (activeTab === 'APPROVED') {
        if (app.status !== 'Approved') return false;
      } else if (activeTab === 'REJECTED') {
        if (app.status !== 'Rejected') return false;
      } else if (activeTab === 'CORRECTION') {
        if (app.status !== 'Correction Requested') return false;
      }

      // Branch filter
      if (selectedBranch !== 'ALL') {
        const appBranch = app.member?.branch_name || app.branchName;
        const branchObj = branches.find((b) => b.id === selectedBranch);
        if (branchObj && appBranch && !appBranch.includes(branchObj.name) && !appBranch.includes(branchObj.code)) {
          return false;
        }
      }

      return true;
    });
  }, [applications, search, activeTab, selectedBranch, branches]);

  // Handle Approve Trigger
  const handleOpenApprove = (app) => {
    setApproveCandidate(app);
    setAllocatedEmpId(app.emp_id || `EMP-2026-${Math.floor(100 + Math.random() * 900)}`);
    setAllocatedBranch(app.branch_id || 'BR-001');
  };

  const handleConfirmApprove = async () => {
    if (!approveCandidate) return;
    if (confirmPaymentAndActivate) {
      await confirmPaymentAndActivate(approveCandidate.id, {
        assignedEmpId: allocatedEmpId,
        assignedBranchId: allocatedBranch,
        adminName: currentAdmin?.name || 'Bhagirathi Mohapatra (Managing Director)'
      });
    } else {
      await approveApplication(approveCandidate.id, {
        assignedEmpId: allocatedEmpId,
        assignedBranchId: allocatedBranch,
        adminName: currentAdmin?.name || 'Bhagirathi Mohapatra (Managing Director)'
      });
    }
    setApproveCandidate(null);
    if (dossierApp?.id === approveCandidate.id) {
      setDossierApp(null);
    }
  };

  // Handle Reject Trigger
  const handleOpenReject = (app) => {
    setRejectCandidate(app);
    setRejectionReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectCandidate || !rejectionReason.trim()) {
      addToast?.('Please provide a mandatory reason for rejection.', 'error');
      return;
    }
    await rejectApplication(
      rejectCandidate.id,
      rejectionReason.trim(),
      currentAdmin?.name || 'Bhagirathi Mohapatra (Managing Director)'
    );
    setRejectCandidate(null);
    if (dossierApp?.id === rejectCandidate.id) {
      setDossierApp(null);
    }
  };

  // Handle Correction Trigger
  const handleOpenCorrection = (app) => {
    setCorrectionCandidate(app);
    setCorrectionNotes('');
  };

  const handleConfirmCorrection = async () => {
    if (!correctionCandidate || !correctionNotes.trim()) {
      addToast?.('Please specify instructions for required correction.', 'error');
      return;
    }
    await requestCorrection(
      correctionCandidate.id,
      correctionNotes.trim(),
      currentAdmin?.name || 'Bhagirathi Mohapatra (Managing Director)'
    );
    setCorrectionCandidate(null);
    if (dossierApp?.id === correctionCandidate.id) {
      setDossierApp(null);
    }
  };

  // Export Applications to CSV
  const handleExportCSV = () => {
    const headers = [
      'Application ID',
      'Name',
      'Mobile',
      'Email',
      'Branch',
      'Fee Receipt',
      'Shares Count',
      'Status',
      'Submitted Date'
    ];
    const rows = filteredApps.map((a) => [
      a.id,
      `"${a.member?.name || a.fullName || 'Applicant'}"`,
      a.member?.phone || a.mobile || '',
      a.member?.email || a.email || '',
      `"${a.member?.branch_name || a.branchName || 'HQ'}"`,
      a.membership_fee_receipt || 'REC-500',
      a.share_count || 10,
      a.status,
      a.created_at || ''
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Utkal_Finance_Applications_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast?.('Application records exported successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Membership Applications
            </h2>
            <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              {counts.submitted} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer statutory associate membership applications, verify KYC proofs, and allocate Member &amp; EMP IDs
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">Total Applications</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{counts.all}</div>
          <span className="text-[10px] text-slate-500 font-medium">All recorded dossiers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/20">
          <span className="text-[11px] font-bold uppercase text-amber-700 block tracking-wider">Submitted / Review</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{counts.submitted}</div>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting decision</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs bg-indigo-50/20">
          <span className="text-[11px] font-bold uppercase text-indigo-700 block tracking-wider">Pending KYC Check</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">{counts.pendingDocs}</div>
          <span className="text-[10px] text-indigo-600 font-medium">Unverified document cards</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <span className="text-[11px] font-bold uppercase text-emerald-700 block tracking-wider">Approved Members</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{counts.approved}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Allocated UF-2026 IDs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs bg-rose-50/20">
          <span className="text-[11px] font-bold uppercase text-rose-700 block tracking-wider">Rejected</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{counts.rejected}</div>
          <span className="text-[10px] text-rose-600 font-medium">With recorded grounds</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Applications', count: counts.all },
              { id: 'PENDING_PAYMENT', label: 'Payment Verification', count: counts.pendingPayment },
              { id: 'SUBMITTED', label: 'New / Submitted', count: counts.submitted },
              { id: 'PENDING_DOCS', label: 'Pending Docs', count: counts.pendingDocs },
              { id: 'APPROVED', label: 'Approved Members', count: counts.approved },
              { id: 'REJECTED', label: 'Rejected', count: counts.rejected },
              { id: 'CORRECTION', label: 'Corrections', count: counts.correction }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-finance-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Branch Select */}
          <div className="flex items-center gap-2.5 flex-1 lg:max-w-md justify-end">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Name, App ID, Mobile, Email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 outline-none"
              />
            </div>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-finance-600 outline-none"
            >
              <option value="ALL">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Application ID</th>
                <th className="px-5 py-3.5">Applicant Details</th>
                <th className="px-5 py-3.5">Assigned Branch</th>
                <th className="px-5 py-3.5">Share &amp; Fee</th>
                <th className="px-5 py-3.5">KYC Documents</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <ClipboardCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">No applications found</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search filters.</p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const verifiedDocs = app.documents?.filter((d) => d.status === 'Verified')?.length || 0;
                  const totalDocs = app.documents?.length || 5;
                  const allDocsVerified = verifiedDocs === totalDocs;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Application ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-finance-900">{app.id}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatDate(app.created_at || '2026-09-01')}
                        </div>
                      </td>

                      {/* Applicant Details */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-finance-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {(app.member?.name || app.fullName || 'U').charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {app.member?.name || app.fullName || 'Applicant'}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>{app.member?.phone || app.mobile || '-'}</span>
                              <span>&bull;</span>
                              <span className="truncate max-w-[140px]">
                                {app.member?.email || app.email || '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Branch */}
                      <td className="px-5 py-4 text-slate-700 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {app.member?.branch_name || app.branchName || 'Bhubaneswar HQ'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Code: {app.member?.branch_code || app.branchCode || '075101'}
                        </div>
                      </td>

                      {/* Share & Fee + Payment Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>Fee: <strong className="text-emerald-700">{formatINR(app.membership_fee || 200)}</strong></span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {app.payment_method || 'UPI'}: <span className="font-bold text-slate-700">{app.payment_txn_ref || app.membership_fee_receipt || 'REC-200'}</span>
                        </div>
                        <div className="mt-1">
                          {app.status === 'Approved' || app.payment_status === 'Payment Successful' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              ✓ Payment Successful
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Pending Verification
                            </span>
                          )}
                        </div>
                      </td>

                      {/* KYC Documents */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                              allDocsVerified
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {verifiedDocs}/{totalDocs} Verified
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                            app.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : app.status === 'Correction Requested'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status === 'Approved' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : app.status === 'Rejected' ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          {app.status}
                        </span>
                        {app.member_id && (
                          <div className="font-mono text-[10px] text-finance-600 font-bold mt-1">
                            {app.member_id}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Dossier Viewer */}
                          <button
                            onClick={() => {
                              setDossierApp(app);
                              setActiveDossierTab('overview');
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-finance-600 hover:bg-slate-100 transition-colors"
                            title="View Full 9-Step Application Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Print Statutory Form */}
                          <button
                            onClick={() => setFormModalApp(app)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Print Statutory 2-Page Membership Form"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Payment Successful Button (if not already approved) */}
                          {app.status !== 'Approved' && (
                            <button
                              onClick={() => handleOpenApprove(app)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                              title="Verify payment and activate member ID"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Payment Successful</span>
                            </button>
                          )}

                          {/* Reject Button (if not rejected) */}
                          {app.status !== 'Rejected' && app.status !== 'Approved' && (
                            <button
                              onClick={() => handleOpenReject(app)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Reject Application"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. DOSSIER VIEWER MODAL */}
      {dossierApp && (
        <Modal
          isOpen={!!dossierApp}
          onClose={() => setDossierApp(null)}
          title={`Membership Application Dossier - ${dossierApp.id}`}
          subtitle={`Applicant: ${dossierApp.member?.name || dossierApp.fullName} (Govt. Reg. U64199OD2026PLC054968)`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
            {/* Dossier Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
              {[
                { id: 'overview', label: 'Summary & Status' },
                { id: 'personal', label: 'Personal & Contact' },
                { id: 'addresses', label: 'Addresses' },
                { id: 'documents', label: `Documents (${dossierApp.documents?.length || 5})` },
                { id: 'shares_deposit', label: 'Shares & Nominee' },
                { id: 'witness_statutory', label: 'Witness & Signature' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDossierTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    activeDossierTab === tab.id
                      ? 'bg-finance-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: Overview */}
            {activeDossierTab === 'overview' && (
              <div className="space-y-4">
                {/* Status Hero */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">Current Status:</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          dossierApp.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : dossierApp.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {dossierApp.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted on: <strong>{formatDate(dossierApp.created_at || '2026-09-01')}</strong> &bull;
                      Branch: <strong>{dossierApp.member?.branch_name || dossierApp.branchName || 'Bhubaneswar HQ'}</strong>
                    </p>
                    {dossierApp.rejection_reason && (
                      <p className="text-xs text-rose-700 font-semibold mt-1">
                        Rejection Grounds: {dossierApp.rejection_reason}
                      </p>
                    )}
                    {dossierApp.correction_notes && (
                      <p className="text-xs text-orange-700 font-semibold mt-1">
                        Correction Requested: {dossierApp.correction_notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setFormModalApp(dossierApp)}
                      className="px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> Printable Form
                    </button>
                    {dossierApp.status !== 'Approved' && (
                      <button
                        onClick={() => handleOpenApprove(dossierApp)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Application
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px]">APPLICATION ID</span>
                    <span className="font-mono font-bold text-slate-900">{dossierApp.id}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px]">MEMBERSHIP FEE &amp; UTR</span>
                    <span className="font-bold text-emerald-700 block">₹{dossierApp.membership_fee || 200} ({dossierApp.payment_status || 'Pending'})</span>
                    <span className="font-mono text-[10px] text-slate-500 truncate block">
                      {dossierApp.payment_method || 'UPI'}: {dossierApp.payment_txn_ref || 'UTR Pending'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px]">SHARE NUMBER</span>
                    <span className="font-mono font-bold text-slate-900">{dossierApp.share_number || 'SH-8492'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px]">ALLOTTED MEMBER ID</span>
                    <span className="font-mono font-bold text-finance-600">{dossierApp.member_id || 'Pending Approval'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Personal & Contact */}
            {activeDossierTab === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h5 className="font-bold uppercase tracking-wider text-[#003E9E] text-[11px] mb-2">
                      Personal Identity
                    </h5>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Legal Name</span>
                      <span className="font-bold text-slate-900">
                        {dossierApp.title || ''} {dossierApp.fullName || dossierApp.member?.name || dossierApp.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Father / Spouse Name</span>
                      <span className="font-semibold text-slate-800">
                        <span className="text-slate-500 font-normal mr-1">({dossierApp.guardianType || dossierApp.member?.guardian_type || 'S/o.'})</span>
                        {dossierApp.fatherOrHusbandName || dossierApp.member?.father_or_husband_name || dossierApp.father_or_husband_name || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Date of Birth / Age</span>
                      <span className="font-semibold text-slate-800">
                        {formatDate(dossierApp.dob || dossierApp.member?.dob || '1995-01-01')} ({dossierApp.age || dossierApp.member?.age || 29} Yrs)
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Gender / Marital Status</span>
                      <span className="font-semibold text-slate-800">
                        {dossierApp.gender || dossierApp.member?.gender || 'Male'} / {dossierApp.maritalStatus || dossierApp.member?.marital_status || 'Married'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Religion / Category</span>
                      <span className="font-semibold text-slate-800">
                        {dossierApp.religion || dossierApp.member?.religion || 'Hindu'} / {dossierApp.category || dossierApp.member?.category || 'General'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">PAN Number</span>
                      <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {dossierApp.panNo || dossierApp.member?.pan_no || 'Not Provided'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h5 className="font-bold uppercase tracking-wider text-[#003E9E] text-[11px] mb-2">
                      Professional &amp; Contact
                    </h5>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Primary Mobile</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {dossierApp.mobileNumber || dossierApp.phone || dossierApp.member?.phone || dossierApp.mobile}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Alternate Mobile</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        {dossierApp.alternateMobile || dossierApp.member?.alternate_mobile || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Email Address</span>
                      <span className="font-semibold text-slate-800">
                        {dossierApp.email || dossierApp.member?.email || dossierApp.user?.email}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Educational Qualification</span>
                      <span className="font-semibold text-slate-800">
                        {dossierApp.education || dossierApp.member?.education || dossierApp.member?.educational_qualification || 'Graduate / P.G.'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Occupation</span>
                      <span className="font-semibold text-slate-800">
                        {dossierApp.occupation || dossierApp.member?.occupation || 'Business'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Associate Code / Name</span>
                      <span className="font-semibold text-slate-800">
                        {dossierApp.associateCode || dossierApp.associate_code || 'UTK-ASC-101'} ({dossierApp.associateName || dossierApp.associate_name || 'Pradeep Kumar Jena'})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Addresses */}
            {activeDossierTab === 'addresses' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold uppercase tracking-wider text-slate-700 text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-finance-600" /> Permanent Address (Statutory)
                  </h5>
                  <div className="pt-1 space-y-1">
                    <p className="text-slate-900 font-bold leading-relaxed">
                      {dossierApp.permanentAddress?.address || dossierApp.permanent_address || dossierApp.member?.address || 'Plot 142, VIP Area, Saheed Nagar'}
                    </p>
                    <p className="text-slate-600">
                      Taluka: <strong>{dossierApp.permanentAddress?.taluka || dossierApp.taluka || dossierApp.city || 'Bhubaneswar'}</strong>, District: <strong>{dossierApp.permanentAddress?.district || dossierApp.district || 'Khurda'}</strong>
                    </p>
                    <p className="text-slate-600">
                      State: <strong>{dossierApp.permanentAddress?.state || dossierApp.state || 'Odisha'}</strong> - PIN: <strong className="font-mono">{dossierApp.permanentAddress?.pinCode || dossierApp.pinCode || '751001'}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold uppercase tracking-wider text-emerald-800 text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Correspondence / Mailing Address
                  </h5>
                  <div className="pt-1 space-y-1">
                    <p className="text-slate-900 font-bold leading-relaxed">
                      {dossierApp.correspondenceAddress?.address || dossierApp.correspondence_address || dossierApp.permanentAddress?.address || dossierApp.permanent_address || 'Same as Permanent Address'}
                    </p>
                    <p className="text-slate-600">
                      District: <strong>{dossierApp.correspondenceAddress?.district || dossierApp.permanentAddress?.district || 'Khurda'}</strong>, State: <strong>{dossierApp.correspondenceAddress?.state || dossierApp.permanentAddress?.state || 'Odisha'}</strong>
                    </p>
                    <p className="text-slate-600">
                      PIN: <strong className="font-mono">{dossierApp.correspondenceAddress?.pinCode || dossierApp.permanentAddress?.pinCode || '751001'}</strong> &bull; Phone: <strong className="font-mono">{dossierApp.correspondenceAddress?.mobileNumber || dossierApp.phone || dossierApp.mobileNumber || 'Same'}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Documents */}
            {activeDossierTab === 'documents' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Verify or reject applicant attachments as mandated by Nidhi Rules 2014:
                </p>

                <div className="space-y-2.5">
                  {(dossierApp.documents && dossierApp.documents.length > 0
                    ? dossierApp.documents
                    : [
                        { id: 'DOC-1', document_type: '3 Colour Photographs', status: 'Verified' },
                        { id: 'DOC-2', document_type: 'Aadhaar Card', document_number: dossierApp.primaryDocNumber || '5421-9988-1234', status: 'Verified' },
                        { id: 'DOC-3', document_type: 'PAN Card', document_number: dossierApp.panNo || 'ABCPS1489K', status: 'Verified' },
                        { id: 'DOC-4', document_type: 'Educational Certificate', document_number: 'DEG-8491', status: 'Verified' },
                        { id: 'DOC-5', document_type: 'Birth Certificate', document_number: 'BC-1987-0941', status: 'Verified' }
                      ]
                  ).map((doc) => (
                    <div
                      key={doc.id || doc.type}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{doc.type || doc.document_type}</span>
                          {(doc.document_number || doc.docNumber || doc.documentNumber) && (
                            <span className="font-mono text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                              {doc.document_number || doc.docNumber || doc.documentNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          File: <span className="font-mono text-slate-700">{doc.fileName || doc.file_name || 'attachment.pdf'}</span> &bull; Status: <strong className={doc.status === 'Verified' ? 'text-emerald-700' : 'text-amber-700'}>{doc.status || 'Uploaded'}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.status !== 'Verified' && (
                          <button
                            onClick={() => updateDocumentStatus(dossierApp.id, doc.id, 'Verified')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3 h-3" /> Verify
                          </button>
                        )}
                        {doc.status !== 'Rejected' && (
                          <button
                            onClick={() => updateDocumentStatus(dossierApp.id, doc.id, 'Rejected', 'Document unreadable or invalid')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Shares & Nominee */}
            {activeDossierTab === 'shares_deposit' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                    Share Capital &amp; Repayment Preference
                  </h5>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Share Certificate Number</span>
                    <span className="font-mono font-bold text-slate-900">{dossierApp.share_number || 'SH-8492'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Share Count &amp; Paid Value</span>
                    <span className="font-bold text-slate-900">{dossierApp.shareCount || dossierApp.share_count || 10} Shares (₹{dossierApp.share_value || 200})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Depositor Status</span>
                    <span className="font-semibold text-slate-800">{dossierApp.depositor_status || 'Share Holder'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Repayment Preference</span>
                    <span className="font-semibold text-slate-800">{dossierApp.repaymentMode || dossierApp.repayment_preference || 'First depositor'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Form 15G / 15H Enclosed</span>
                    <span className="font-semibold text-slate-800">{dossierApp.form_15g_enclosed !== false ? 'Yes (Enclosed)' : 'No'}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                    Nominee Designation
                  </h5>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Nominee Name</span>
                    <span className="font-bold text-slate-900">{dossierApp.nomineeName || dossierApp.nominee_name || dossierApp.nominee?.name || 'Family Nominee'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Relationship</span>
                    <span className="font-semibold text-slate-800">{dossierApp.nomineeRelationship || dossierApp.nominee_relation || dossierApp.nominee?.relationship || 'Spouse'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Nominee Age</span>
                    <span className="font-semibold text-slate-800">{dossierApp.nomineeAge || dossierApp.nominee_age || dossierApp.nominee?.age || '32'} Years</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Nominee Mobile</span>
                    <span className="font-mono font-semibold text-slate-800">{dossierApp.nomineeMobile || dossierApp.nominee?.mobileNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Nominee Address</span>
                    <span className="font-semibold text-slate-800">{dossierApp.nomineeAddress || dossierApp.nominee_address || dossierApp.nominee?.address || 'Same as applicant address'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Witness & Signature */}
            {activeDossierTab === 'witness_statutory' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                    Statutory Witness Details
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Witness Name</span>
                      <span className="font-bold text-slate-900">{dossierApp.witnessName || dossierApp.witness_name || dossierApp.witness?.name || 'Pradeep Kumar Sahoo'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Is Company Member?</span>
                      <span className="font-bold text-slate-900">
                        {(dossierApp.witnessIsMember ?? dossierApp.witness_is_member ?? dossierApp.witness?.isMember) ? `Yes (Member #${dossierApp.witnessMembershipNo || dossierApp.witness_membership_no || 'UF-1012'})` : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Witness Mobile</span>
                      <span className="font-semibold text-slate-800 font-mono">{dossierApp.witnessMobile || dossierApp.witness_mobile || dossierApp.witness?.mobileNumber || '9861011223'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Witness Address</span>
                      <span className="font-semibold text-slate-800">{dossierApp.witnessAddress || dossierApp.witness_address || dossierApp.witness?.address || 'Saheed Nagar, Bhubaneswar'}</span>
                    </div>
                  </div>
                </div>

                {/* Digital Signature */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h5 className="font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-2">
                    Applicant Digital Signature
                  </h5>
                  <div className="border border-slate-300 bg-white rounded-xl p-4 flex flex-col items-center justify-center min-h-[120px]">
                    {dossierApp.signature || dossierApp.signatureData || dossierApp.digitalSignature ? (
                      <img
                        src={dossierApp.signature || dossierApp.signatureData || dossierApp.digitalSignature}
                        alt="Digital Signature"
                        className="max-h-24 max-w-[280px] object-contain filter contrast-125"
                      />
                    ) : (
                      <span className="font-serif italic text-lg text-slate-700">
                        {dossierApp.fullName || dossierApp.member?.name || dossierApp.name || 'Signed Electronically'}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 mt-2">
                      Verified Electronic Signature Captured on Application Submission ({formatDate(dossierApp.signatureDate || dossierApp.created_at || '2026-09-01')})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* 2. APPROVE & CONFIRM PAYMENT MODAL */}
      {approveCandidate && (
        <Modal
          isOpen={!!approveCandidate}
          onClose={() => setApproveCandidate(null)}
          title="Verify Payment & Activate Member ID"
          subtitle={`Applicant: ${approveCandidate.member?.name || approveCandidate.fullName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            {/* Payment Details Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] uppercase font-bold text-emerald-900">Joining Fee Verification</span>
                <span className="text-lg font-black text-emerald-800 font-mono">₹ {approveCandidate.membership_fee || 200}.00</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-emerald-200/80">
                <div>
                  <span className="text-slate-500 block">Payment Mode:</span>
                  <strong className="text-slate-900">{approveCandidate.payment_method || 'UPI / Gateway'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Txn / UTR Reference:</span>
                  <strong className="text-slate-900 font-mono break-all">{approveCandidate.payment_txn_ref || approveCandidate.membership_fee_receipt || 'REC-200'}</strong>
                </div>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Clicking <strong>"Payment Successful &amp; Activate Member"</strong> will mark the ₹200 fee as received, approve the application, and activate the member account for portal sign in.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Allocate Employee / Agent ID (EMP ID) *
              </label>
              <input
                type="text"
                value={allocatedEmpId}
                onChange={(e) => setAllocatedEmpId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-finance-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Allotted Branch *
              </label>
              <select
                value={allocatedBranch}
                onChange={(e) => setAllocatedBranch(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-finance-600 outline-none bg-white"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setApproveCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Payment Successful &amp; Activate Member
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. REJECT CONFIRMATION MODAL */}
      {rejectCandidate && (
        <Modal
          isOpen={!!rejectCandidate}
          onClose={() => setRejectCandidate(null)}
          title="Reject Membership Application"
          subtitle={`Applicant: ${rejectCandidate.member?.name || rejectCandidate.fullName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>
                Statutory regulatory guidelines require a recorded reason for all application rejections.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mandatory Grounds for Rejection *
              </label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incomplete address proof, PAN card mismatch with income tax records, under 18 years of age..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setRejectCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectionReason.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <X className="w-4 h-4" /> Reject Application
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. PRINTABLE STATUTORY MEMBERSHIP FORM MODAL */}
      {formModalApp && (
        <Modal
          isOpen={!!formModalApp}
          onClose={() => setFormModalApp(null)}
          title={`Official Statutory Membership Form - ${formModalApp.id}`}
          subtitle="Exact 2-Page Statutory Form (Govt. Reg. No. U64199OD2026PLC054968)"
          maxWidth="max-w-5xl"
        >
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print 2-Page Form
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto bg-slate-200 p-2 sm:p-4 rounded-xl">
              <OfficialMembershipForm
                data={{
                  ...formModalApp,
                  ...(formModalApp.member || {}),
                  id: formModalApp.member_id || formModalApp.id,
                  applicationId: formModalApp.id,
                  status: formModalApp.status,
                  name: formModalApp.member?.name || formModalApp.fullName,
                  empId: formModalApp.emp_id || 'EMP-104',
                  branchName: formModalApp.member?.branch_name || formModalApp.branchName || 'Bhubaneswar HQ',
                  branchCode: formModalApp.member?.branch_code || formModalApp.branchCode || '075101',
                  digitalSignature: formModalApp.signature || formModalApp.signatureData || formModalApp.digitalSignature
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminApplications;
