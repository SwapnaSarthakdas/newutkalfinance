import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Sparkles,
  Smartphone
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

const LoginPage = ({ onNavigate, initialTab = 'MEMBER' }) => {
  const { login, loginAsDemo } = useAuth();
  const { addToast } = useFinance();

  const [activeTab, setActiveTab] = useState(initialTab); // 'MEMBER' | 'ADMIN'

  // Form Fields
  const [identifier, setIdentifier] = useState(
    initialTab === 'ADMIN' ? 'admin@utkalfinance.com' : '9876543210'
  );
  const [password, setPassword] = useState(
    initialTab === 'ADMIN' ? 'admin123' : 'member123'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot Password Modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Switch tab handler
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
    if (tab === 'ADMIN') {
      setIdentifier('admin@utkalfinance.com');
      setPassword('admin123');
    } else {
      setIdentifier('9876543210');
      setPassword('member123');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const targetId = identifier.trim();
    const targetPass = password;

    if (!targetId || !targetPass) {
      setErrorMsg('Please enter your credentials to sign in.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(targetId, targetPass, activeTab);
      setSuccessMsg(`Authentication successful! Redirecting to ${activeTab === 'ADMIN' ? 'Admin Console' : 'Member Portal'}...`);
      setTimeout(() => {
        onNavigate(res.role === 'ADMIN' ? 'admin-dashboard' : 'member-dashboard');
      }, 350);
    } catch (err) {
      setErrorMsg(
        err.message || 'Authentication failed. Please verify your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoRole) => {
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      loginAsDemo(demoRole);
      addToast(
        demoRole === 'ADMIN'
          ? 'Logged in as Administrator (Managing Director Desk)'
          : 'Logged in as Demo Member (Rajesh Sharma - Active)',
        'success'
      );
      onNavigate(demoRole === 'ADMIN' ? 'admin-dashboard' : 'member-dashboard');
    }, 350);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      addToast(
        activeTab === 'ADMIN'
          ? 'Password recovery OTP has been dispatched to authorized administrator email.'
          : 'Password recovery OTP has been sent to your registered email & mobile number.',
        'info'
      );
      setForgotModalOpen(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50">
      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="p-6 sm:p-8 pb-4">
            <div className="text-center mb-6 flex flex-col items-center">
              <div
                className="mb-4 cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => onNavigate('home')}
                title="Return to Utkal Finance Home"
              >
                <Logo size="md" showTagline={true} />
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {activeTab === 'ADMIN' ? 'Administrator Console' : 'Member Portal Login'}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {activeTab === 'ADMIN'
                  ? 'Executive management, member KYC verification, loan approvals & statutory compliance'
                  : 'Access your savings account, view FD deposits, check active loans, and download receipts'}
              </p>
            </div>

            {/* Role Tab Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-5 border border-slate-200">
              <button
                type="button"
                onClick={() => handleTabSwitch('MEMBER')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'MEMBER'
                    ? 'bg-white text-finance-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Member Portal</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('ADMIN')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ADMIN'
                    ? 'bg-gradient-to-r from-purple-900 to-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Console</span>
              </button>
            </div>

            {/* Quick Demo Credentials Banner */}
            <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs">
              <div className="flex flex-col text-left min-w-0 pr-2">
                <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span>{activeTab === 'ADMIN' ? 'Demo Admin Account' : 'Demo Member Account'}</span>
                </span>
                <span className="font-mono text-[10.5px] text-slate-500 truncate mt-0.5">
                  {activeTab === 'ADMIN'
                    ? 'admin@utkalfinance.com / admin123'
                    : '9876543210 / member123'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'ADMIN') {
                    setIdentifier('admin@utkalfinance.com');
                    setPassword('admin123');
                  } else {
                    setIdentifier('9876543210');
                    setPassword('member123');
                  }
                  addToast('Demo credentials filled', 'info');
                }}
                className={`px-2.5 py-1 rounded-xl text-white font-bold text-[10px] transition-colors flex-shrink-0 cursor-pointer shadow-2xs ${
                  activeTab === 'ADMIN'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-finance-600 hover:bg-finance-700'
                }`}
              >
                Auto-fill
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {activeTab === 'ADMIN'
                    ? 'Admin Username or Official Email'
                    : 'Mobile Number, EMP ID, or Email'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      activeTab === 'ADMIN'
                        ? 'admin@utkalfinance.com'
                        : 'e.g. 9876543210 or UF-2026-1048'
                    }
                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 bg-slate-50/50 focus:bg-white transition-all pl-10 ${
                      activeTab === 'ADMIN'
                        ? 'focus:ring-purple-600'
                        : 'focus:ring-finance-600'
                    }`}
                  />
                  {activeTab === 'ADMIN' ? (
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  ) : (
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className={`text-xs font-semibold hover:underline transition-colors ${
                      activeTab === 'ADMIN' ? 'text-purple-600' : 'text-finance-600'
                    }`}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 bg-slate-50/50 focus:bg-white transition-all pl-10 pr-10 ${
                      activeTab === 'ADMIN'
                        ? 'focus:ring-purple-600'
                        : 'focus:ring-finance-600'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-finance-600 focus:ring-finance-600"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-slate-400 text-[11px]">256-Bit SSL Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'ADMIN'
                    ? 'bg-gradient-to-r from-purple-900 via-slate-900 to-finance-950 hover:from-purple-800 hover:to-slate-800'
                    : 'bg-finance-900 hover:bg-finance-800'
                }`}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to {activeTab === 'ADMIN' ? 'Admin Console' : 'Member Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Evaluation Login */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
                Instant 1-Click Evaluation
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(activeTab)}
                className="w-full p-3 rounded-2xl border border-slate-200/90 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1.5">
                    {activeTab === 'ADMIN' ? (
                      <>
                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                        <span>Admin Console Demo</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Member Demo</span>
                      </>
                    )}
                  </div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">
                    {activeTab === 'ADMIN'
                      ? 'Operations Head Desk • Executive Governance'
                      : 'Rajesh Sharma • Savings, FDs, Loans & Passbook'}
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 flex-shrink-0">
                  1-Click &rarr;
                </span>
              </button>
            </div>
          </div>

          {/* Card Bottom Link */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-600 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="font-bold text-finance-600 hover:text-finance-800 hover:underline transition-colors cursor-pointer"
            >
              New Member? Register Here
            </button>
            <span className="text-slate-300">&bull;</span>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-bold text-slate-600 hover:text-slate-900 hover:underline transition-colors cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="py-4 text-center text-xs text-slate-500 border-t border-slate-200/60 bg-white">
        &copy; {new Date().getFullYear()} New Utkal Finance Limited. Reg. No.: U64199OD2026PLC054968. Certified by Govt. of India.
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title={activeTab === 'ADMIN' ? 'Reset Administrator Password' : 'Reset Member Password'}
        subtitle="Provide your registered email address or mobile number to receive a secure recovery code."
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Registered Email or Mobile *
            </label>
            <input
              type="text"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="e.g. member@utkalfinance.com or 9876543210"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-finance-600"
            />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            A secure recovery verification code and temporary login token will be dispatched to your authorized contact details.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={forgotSubmitted}
              className="px-5 py-2 rounded-xl bg-finance-900 text-white text-xs font-bold tracking-wide uppercase hover:bg-finance-800 flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{forgotSubmitted ? 'Sending Code...' : 'Dispatch Reset OTP'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoginPage;
