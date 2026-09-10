import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminOverview from './AdminOverview';
import AdminApplications from './AdminApplications';
import AdminMembers from './AdminMembers';
import AdminLoans from './AdminLoans';
import AdminDeposits from './AdminDeposits';
import AdminTransactions from './AdminTransactions';
import AdminReports from './AdminReports';
import AdminNotifications from './AdminNotifications';
import AdminSettings from './AdminSettings';
import AdminProfile from './AdminProfile';
import OfficialBrochure from '../../components/brochure/OfficialBrochure';
import AdminQuickAddBar from '../../components/admin/AdminQuickAddBar';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = ({ onNavigate }) => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return <AdminOverview onNavigateTab={setCurrentTab} />;
      case 'applications':
        return <AdminApplications />;
      case 'members':
        return <AdminMembers onNavigateTab={setCurrentTab} />;
      case 'loans':
        return <AdminLoans />;
      case 'deposits':
        return <AdminDeposits />;
      case 'transactions':
        return <AdminTransactions />;
      case 'payments':
        return <AdminTransactions />;
      case 'reports':
        return <AdminReports />;
      case 'notifications':
        return <AdminNotifications onNavigateTab={setCurrentTab} />;
      case 'brochure':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Corporate &amp; Customer Handover Brochure
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official Newutkal Finance Limited prospectus with product rates, governance certificates, and branch directory
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all self-start sm:self-auto"
              >
                <span>Print / Save as PDF</span>
              </button>
            </div>
            <OfficialBrochure />
          </div>
        );
      case 'settings':
        return <AdminSettings />;
      case 'profile':
        return <AdminProfile />;
      default:
        return <AdminOverview onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex relative overflow-hidden">
      {/* Subtle blurred banner backdrop */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 flex items-center justify-center">
        <img src="/banner.jpg" alt="" className="w-full h-full max-w-6xl object-contain filter blur-2xl" />
      </div>
      {/* Dark Executive Admin Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onSelectTab={setCurrentTab}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AdminQuickAddBar />
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
