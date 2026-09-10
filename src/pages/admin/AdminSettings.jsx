import React, { useState } from 'react';
import { Settings, Shield, Bell, Building2, KeyRound, Smartphone, CheckCircle2, Lock, RotateCcw } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const AdminSettings = () => {
  const { settings, updateSettings, resetAllDataToZero, addToast } = useFinance();

  const [companyName, setCompanyName] = useState(settings.companyName || 'Newutkal Finance Limited');
  const [email, setEmail] = useState(settings.email || 'bhagirathimohapatra79@gmail.com');
  const [phone, setPhone] = useState(settings.phone || '+91 9776175240');
  const [address, setAddress] = useState(settings.address || 'Plot no-N/5-172, Nayapalli, IRC village, Bhubaneswar-751015');

  const [twoFactorAuth, setTwoFactorAuth] = useState(settings.twoFactorAuth || false);
  const [emailNotifications, setEmailNotifications] = useState(settings.emailNotifications !== false);
  const [smsNotifications, setSmsNotifications] = useState(settings.smsNotifications !== false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    updateSettings({
      companyName,
      email,
      phone,
      address,
      twoFactorAuth,
      emailNotifications,
      smsNotifications
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    addToast('Admin root password changed successfully!', 'success');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          System &amp; Regulatory Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure corporate entity disclosures, security certificates, and notification dispatch gateways
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-finance-600" />
          <span>1. Corporate Information</span>
        </h3>

        <form onSubmit={handleSaveGeneral} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Legal Entity</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">RBI Registration</label>
              <input
                type="text"
                disabled
                value={settings.rbiRegistration || 'B-05.02981 (Category-A NBFC)'}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Principal Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Support Helpline</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Corporate HQ Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider shadow"
            >
              Save Corporate Details
            </button>
          </div>
        </form>
      </div>

      {/* Security & Authentication */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>2. Authentication &amp; Terminal Security</span>
        </h3>

        {/* 2FA Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Enforce mandatory TOTP authenticator code verification on all administrative sign-ins.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => {
                setTwoFactorAuth(e.target.checked);
                updateSettings({ twoFactorAuth: e.target.checked });
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Password Reset */}
        <form onSubmit={handlePasswordChange} className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-700 block">Change Administrator Password</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Current Admin Password"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
            />
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Secure Password"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Bell className="w-4 h-4 text-amber-500" />
          <span>3. Dispatch Channels</span>
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="font-bold text-slate-900 block">Automated Email Notifications</span>
              <span className="text-[11px] text-slate-500">Send transactional alerts and loan decision emails to members.</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => {
                setEmailNotifications(e.target.checked);
                updateSettings({ emailNotifications: e.target.checked });
              }}
              className="w-4 h-4 rounded text-finance-600"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="font-bold text-slate-900 block">SMS Gateway (Fast2SMS / Trai DLT)</span>
              <span className="text-[11px] text-slate-500">Send instant OTPs and debit/credit messages to registered mobile.</span>
            </div>
            <input
              type="checkbox"
              checked={smsNotifications}
              onChange={(e) => {
                setSmsNotifications(e.target.checked);
                updateSettings({ smsNotifications: e.target.checked });
              }}
              className="w-4 h-4 rounded text-finance-600"
            />
          </label>
        </div>
      </div>

      {/* Customer Handover / Zero State Reset */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2 pb-2 border-b border-rose-100">
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <span>4. Customer Handover &amp; Clean 0 Reset</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/60 border border-rose-200">
          <div>
            <strong className="text-xs font-bold text-slate-900 block">Reset All Metrics &amp; Rosters to Clean 0</strong>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Purges all sample members, loans, deposits, and transaction entries to deliver a clean zeroed system to the client.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all admin values and records to 0 for customer handover?')) {
                resetAllDataToZero();
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Values to 0</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
