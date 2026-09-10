import React from 'react';
import {
  LayoutDashboard,
  User,
  CreditCard,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  HelpCircle,
  LogOut,
  Bell,
  X,
  Shield,
  FileText,
  FileCheck,
  PieChart,
  KeyRound,
  Users
} from 'lucide-react';
import Logo from '../common/Logo';

const MemberSidebar = ({ currentTab, onSelectTab, isOpen, onClose, onLogout }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'application', label: 'Membership Application', icon: FileText },
    { id: 'documents', label: 'Documents & KYC', icon: FileCheck },
    { id: 'nominee', label: 'Nominee Details', icon: Users },
    { id: 'shares', label: 'Share Details', icon: PieChart },
    { id: 'deposits', label: 'Deposit Details', icon: TrendingUp },
    { id: 'loans', label: 'Loans & EMIs', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'statements', label: 'Statements', icon: FileSpreadsheet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'support', label: 'Support & Help', icon: HelpCircle },
    { id: 'password', label: 'Change Password', icon: KeyRound }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between">
            <Logo size="sm" showTagline={false} />
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3">
              Member Dashboard
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-finance-50 text-finance-700 font-bold border border-finance-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-finance-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-3 flex items-center gap-2.5 text-xs text-slate-600">
            <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="leading-tight text-[11px]">
              256-Bit Encrypted Member Portal Session
            </span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MemberSidebar;
