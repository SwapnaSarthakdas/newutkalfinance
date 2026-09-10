import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  Settings,
  Bell,
  LogOut,
  X,
  Shield,
  Briefcase,
  WalletCards,
  UserCheck,
  ClipboardCheck,
  BookOpen
} from 'lucide-react';
import Logo from '../common/Logo';

const AdminSidebar = ({ currentTab, onSelectTab, isOpen, onClose, onLogout }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications Desk', icon: ClipboardCheck },
    { id: 'members', label: 'Member Management', icon: Users },
    { id: 'loans', label: 'Loan Management', icon: CreditCard },
    { id: 'deposits', label: 'Deposit Management', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'payments', label: 'Payments Desk', icon: WalletCards },
    { id: 'reports', label: 'Audit Reports', icon: FileSpreadsheet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'brochure', label: 'Company Brochure', icon: BookOpen },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'profile', label: 'Admin Profile', icon: UserCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Admin Sidebar Container (Dark Navy/Slate Executive Theme) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-finance-950 border-r border-finance-850 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-20 px-6 border-b border-finance-850 flex items-center justify-between">
            <Logo variant="light" size="sm" showTagline={false} />
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-finance-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Role Tag */}
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Operations Control
            </span>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Admin Mode
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-finance-800 text-white font-bold border border-finance-700 shadow-sm'
                      : 'text-slate-400 hover:bg-finance-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-finance-850">
          <div className="p-3 bg-finance-900/60 rounded-xl border border-finance-800 mb-3 flex items-center gap-2.5 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-[11px] leading-tight">
              Executive Tier &bull; Audit Trail Logged
            </span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
