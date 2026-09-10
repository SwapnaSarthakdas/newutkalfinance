import React from 'react';
import { Bell, CheckCircle2, Clock, Check, ShieldCheck, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

const MemberNotificationsPage = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useFinance();

  const memberNotifs = notifications.filter(
    (n) => n.target === 'member' && (!n.memberId || n.memberId === user?.id)
  );

  const icons = {
    payment: <CreditCard className="w-5 h-5 text-amber-500" />,
    deposit: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    security: <ShieldCheck className="w-5 h-5 text-finance-600" />,
    loan: <CreditCard className="w-5 h-5 text-indigo-500" />,
    alert: <AlertCircle className="w-5 h-5 text-rose-500" />
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Notification Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates regarding EMI schedules, deposit interest, and account security alerts
          </p>
        </div>

        {memberNotifs.some((n) => !n.read) && (
          <button
            onClick={() => markAllNotificationsAsRead('member', user?.id)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card divide-y divide-slate-100 overflow-hidden">
        {memberNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium">No notifications yet</p>
          </div>
        ) : (
          memberNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.link) {
                  const tab = notif.link.replace('/member/', '');
                  if (tab) onNavigateTab(tab);
                }
              }}
              className={`p-5 flex items-start gap-4 hover:bg-slate-50/80 cursor-pointer transition-colors ${
                !notif.read ? 'bg-finance-50/50' : ''
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
                <span className="w-2.5 h-2.5 rounded-full bg-finance-600 flex-shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberNotificationsPage;
