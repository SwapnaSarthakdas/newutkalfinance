import React, { useState } from 'react';
import MemberSidebar from '../../components/member/MemberSidebar';
import MemberHeader from '../../components/member/MemberHeader';
import MemberOverview from './MemberOverview';
import MemberProfile from './MemberProfile';
import MemberTransactions from './MemberTransactions';
import MemberLoans from './MemberLoans';
import MemberDeposits from './MemberDeposits';
import MemberStatements from './MemberStatements';
import MemberNotificationsPage from './MemberNotificationsPage';
import MemberSupport from './MemberSupport';
import MemberApplicationTab from './MemberApplicationTab';
import MemberDocumentsTab from './MemberDocumentsTab';
import MemberNomineeTab from './MemberNomineeTab';
import MemberSharesTab from './MemberSharesTab';
import MemberPasswordTab from './MemberPasswordTab';
import { useAuth } from '../../context/AuthContext';

const MemberDashboard = ({ onNavigate }) => {
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
        return <MemberOverview onNavigateTab={setCurrentTab} />;
      case 'profile':
        return <MemberProfile />;
      case 'application':
        return <MemberApplicationTab />;
      case 'documents':
        return <MemberDocumentsTab />;
      case 'nominee':
        return <MemberNomineeTab />;
      case 'shares':
        return <MemberSharesTab />;
      case 'deposits':
        return <MemberDeposits />;
      case 'loans':
        return <MemberLoans />;
      case 'transactions':
        return <MemberTransactions />;
      case 'statements':
        return <MemberStatements />;
      case 'notifications':
        return <MemberNotificationsPage onNavigateTab={setCurrentTab} />;
      case 'support':
        return <MemberSupport />;
      case 'password':
        return <MemberPasswordTab />;
      default:
        return <MemberOverview onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex relative overflow-hidden">
      {/* Subtle blurred banner backdrop */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 flex items-center justify-center">
        <img src="/banner.jpg" alt="" className="w-full h-full max-w-6xl object-contain filter blur-2xl" />
      </div>
      {/* Sidebar */}
      <MemberSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Header */}
        <MemberHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onSelectTab={setCurrentTab}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;
