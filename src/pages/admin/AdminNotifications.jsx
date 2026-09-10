import React from 'react';
import { Bell, Clock, CreditCard, Users, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const AdminNotifications = ({ onNavigateTab }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useFinance();

  const adminNotifs = notifications.filter((n) => n.target === 'admin');

  const icons = {
    loan: <CreditCard className="w-5 h-5 text-amber-500" />,
    member: <Users className="w-5 h-5 text-finance-600" />,
    deposit: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    alert: <AlertTriangle className="w-5 h-5 text-rose-500" />
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Administrative Alert Stream
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time event logging: new borrower requests, high-value corporate deposits, and mandate clearances
          </p>
        </div>

        {adminNotifs.some((n) => !n.read) && (
          <button
            onClick={() => markAllNotificationsAsRead('admin')}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card divide-y divide-slate-100 overflow-hidden">
        {adminNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium">No alerts currently logged in system queue.</p>
          </div>
        ) : (
          adminNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.link) {
                  const tab = notif.link.replace('/admin/', '');
                  if (tab && onNavigateTab) onNavigateTab(tab);
                }
              }}
              className={`p-5 flex items-start gap-4 hover:bg-slate-50/80 cursor-pointer transition-colors ${
                !notif.read ? 'bg-amber-50/30' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                {icons[notif.type] || <Bell className="w-5 h-5 text-slate-500" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" /> {notif.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>

              {!notif.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
