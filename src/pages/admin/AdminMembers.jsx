import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  Power,
  ShieldCheck,
  AlertTriangle,
  Download,
  Filter,
  FileText,
  Printer,
  ClipboardCheck,
  Check
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import AddMemberModal from '../../components/admin/AddMemberModal';
import EditMemberModal from '../../components/admin/EditMemberModal';
import ViewMemberModal from '../../components/admin/ViewMemberModal';
import Modal from '../../components/common/Modal';
import OfficialMembershipForm from '../../components/membership/OfficialMembershipForm';
import { formatDate } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';

const AdminMembers = ({ onNavigateTab }) => {
  const { members, applications, toggleMemberStatus, confirmPaymentAndActivate, deleteMember, addToast } = useFinance();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [viewMember, setViewMember] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [selectedFormMember, setSelectedFormMember] = useState(null);
  const [isFormBlank, setIsFormBlank] = useState(false);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch =
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.includes(q);

      if (!matchSearch) return false;

      if (statusFilter !== 'ALL' && m.accountStatus !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [members, search, statusFilter]);

  const confirmDelete = () => {
    if (deleteCandidate) {
      deleteMember(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Member ID', 'Name', 'Email', 'Phone', 'City', 'Status', 'KYC', 'Joined Date'];
    const rows = filteredMembers.map((m) => [
      m.id,
      `"${m.name}"`,
      m.email,
      m.phone,
      m.city,
      m.accountStatus,
      m.kycStatus,
      m.joinedDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Utkal_Finance_Members_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Member roster exported to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Member Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer verified member accounts, KYC standing, and membership privileges
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('applications')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-xs font-bold shadow-xs transition-colors"
              title="Review statutory member applications"
            >
              <ClipboardCheck className="w-4 h-4 text-amber-600" />
              <span>
                Applications ({applications?.filter((a) => a.status === 'Submitted' || a.status === 'Under Review').length || 0})
              </span>
            </button>
          )}
          <button
            onClick={() => {
              setIsFormBlank(true);
              setSelectedFormMember({});
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-900 hover:bg-red-100 text-xs font-bold shadow-xs transition-colors"
            title="Print blank official 2-page form for branch use"
          >
            <FileText className="w-4 h-4 text-red-700" />
            <span>Blank Form</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Roster</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Add New Member</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, email, phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-slate-50 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
          >
            <option value="ALL">All Members ({members.length})</option>
            <option value="Active">Active Only</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending Review</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Member ID</th>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">City</th>
                <th className="px-6 py-3.5">Account Status</th>
                <th className="px-6 py-3.5">Joined Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">No member records found (0 members)</p>
                    <p className="text-xs text-slate-400 mt-1">Use "Add New Member" or the Quick-Add bar to register a new member account.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {m.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-finance-900 text-white font-bold flex items-center justify-center text-xs overflow-hidden flex-shrink-0">
                          {m.avatar ? (
                            <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{m.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{m.name}</span>
                          <span className="text-[10px] text-slate-400">{m.occupation}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{m.email}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{m.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {m.city}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={m.accountStatus} size="xs" />
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {formatDate(m.joinedDate)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setIsFormBlank(false);
                            setSelectedFormMember(m);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="View / Print Official 2-Page Membership Form"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setViewMember(m)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-finance-600 hover:bg-slate-100"
                          title="View Full Profile Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditMember(m)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Edit Member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {m.accountStatus !== 'Active' && (
                          <button
                            onClick={() => {
                              const linkedApp = applications.find(a => a.member_id === m.id || (a.email && a.email === m.email));
                              if (linkedApp && confirmPaymentAndActivate) {
                                confirmPaymentAndActivate(linkedApp.id);
                              } else {
                                toggleMemberStatus(m.id);
                              }
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold flex items-center gap-1 shadow-xs"
                            title="Confirm ₹200 Payment & Activate Member Account"
                          >
                            <Check className="w-3 h-3" />
                            <span>Activate</span>
                          </button>
                        )}

                        <button
                          onClick={() => toggleMemberStatus(m.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            m.accountStatus === 'Active'
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={m.accountStatus === 'Active' ? 'Deactivate Member' : 'Activate Member'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteCandidate(m)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Member Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddMemberModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <EditMemberModal
        isOpen={!!editMember}
        onClose={() => setEditMember(null)}
        member={editMember}
      />

      <ViewMemberModal
        isOpen={!!viewMember}
        onClose={() => setViewMember(null)}
        member={viewMember}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Member Deletion"
        subtitle="Permanent ledger removal warning"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Are you sure you want to delete this member?</span>
            </p>
            <p>
              This will remove member <strong>{deleteCandidate?.name}</strong> ({deleteCandidate?.id}) and revoke their digital portal access.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteCandidate(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow"
            >
              Confirm Deletion
            </button>
          </div>
        </div>
      </Modal>

      {/* Official Membership Application Form Modal */}
      {selectedFormMember !== null && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFormMember(null)}
          title={isFormBlank ? "Blank Statutory Membership Application Form (2 Pages)" : `Official Membership Form - ${selectedFormMember.name || 'Member'}`}
          subtitle="Certified by Govt. of India Reg. No.: U64199OD2026PLC054968"
          maxWidth="max-w-5xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200 text-xs">
              <span className="text-red-900 font-bold">
                {isFormBlank ? 'Blank Official 2-Page Form for Counter Print' : `Filled Statutory Dossier (${selectedFormMember.id || ''})`}
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
              <OfficialMembershipForm data={selectedFormMember} isBlank={isFormBlank} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminMembers;
