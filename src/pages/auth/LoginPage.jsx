import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Sparkles
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

const LoginPage = ({ onNavigate }) => {
  const { login, loginAsDemo } = useAuth();
  const { addToast } = useFinance();

  // Form Fields strictly for Admin
  const [identifier, setIdentifier] = useState('admin@utkalfinance.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot Password Modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const targetId = identifier.trim();
    const targetPass = password;

    if (!targetId || !targetPass) {
      setErrorMsg('Please enter your administrator username and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(targetId, targetPass, 'ADMIN');
      setSuccessMsg('Administrator authentication verified! Redirecting to Admin Console...');
      setTimeout(() => {
        onNavigate('admin-dashboard');
      }, 350);
    } catch (err) {
      setErrorMsg(
        err.message || 'Authentication failed. Please verify administrator credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      loginAsDemo('ADMIN');
      addToast('Logged in as Administrator (Managing Director Desk)', 'success');
      onNavigate('admin-dashboard');
    }, 350);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      addToast(
        'Password recovery OTP has been dispatched to authorized administrator email.',
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

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Authorized Administrator Only</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Administrator Console
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Executive management, member KYC verification, loan approvals &amp; statutory compliance ledger
              </p>
            </div>

            {/* Quick Demo Credentials Banner */}
            <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs">
              <div className="flex flex-col text-left min-w-0 pr-2">
                <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span>Demo Admin Account</span>
                </span>
                <span className="font-mono text-[10.5px] text-slate-500 truncate mt-0.5">
                  admin@utkalfinance.com / admin123
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('admin@utkalfinance.com');
                  setPassword('admin123');
                  addToast('Admin demo credentials filled', 'info');
                }}
                className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
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
                  Admin Username or Official Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin@utkalfinance.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50 focus:bg-white transition-all pl-10"
                  />
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
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
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50 focus:bg-white transition-all pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-600"
                  />
                  <span>Remember this terminal</span>
                </label>
                <span className="text-slate-400 text-[11px]">256-Bit SSL Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-900 via-slate-900 to-finance-950 hover:from-purple-800 hover:to-slate-800 text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Evaluation Login */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
                Instant 1-Click Admin Evaluation
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full p-3 rounded-2xl border border-slate-200/90 bg-slate-50 hover:bg-purple-50/60 hover:border-purple-300 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    <span>Operations Head Desk Demo</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">
                    Managing Director Desk &bull; Executive Controls &bull; KYC Ledger
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 flex-shrink-0">
                  1-Click &rarr;
                </span>
              </button>
            </div>
          </div>

          {/* Card Bottom Link */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-600 flex items-center justify-center gap-3">
            <span>Restricted Administrator Access</span>
            <span className="text-slate-300">&bull;</span>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-bold text-purple-700 hover:text-purple-900 hover:underline transition-colors cursor-pointer"
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
        title="Reset Administrator Password"
        subtitle="Provide your registered official email address to receive a secure recovery code."
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Registered Official Email *
            </label>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="e.g. admin@utkalfinance.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            A secure recovery verification code and temporary login token will be dispatched to your authorized administrator email.
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
              className="px-5 py-2 rounded-xl bg-purple-950 text-white text-xs font-bold tracking-wide uppercase hover:bg-purple-900 flex items-center gap-1.5 cursor-pointer"
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
