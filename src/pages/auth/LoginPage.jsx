import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

const LoginPage = ({ onNavigate }) => {
  const { login, loginAsDemo } = useAuth();
  const { addToast } = useFinance();

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

    const targetId = identifier.trim() || 'admin@utkalfinance.com';
    const targetPass = password || 'admin123';

    setIsLoading(true);
    try {
      await login(targetId, targetPass, 'ADMIN');
      setSuccessMsg('Administrator authentication verified! Redirecting to Admin Portal...');
      setTimeout(() => {
        onNavigate('admin-dashboard');
      }, 300);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      loginAsDemo('ADMIN');
      addToast('Logged in as Administrator (Operations Head Desk)', 'success');
      onNavigate('admin-dashboard');
    }, 400);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      addToast('Password reset link has been dispatched to your registered administrator email.', 'info');
      setForgotModalOpen(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="cursor-pointer flex items-center gap-4" onClick={() => onNavigate('home')}>
            <Logo size="md" />
            <img
              src="/banner.jpg"
              alt="Govt. of India Certified"
              className="hidden md:block h-8 w-auto object-contain rounded border border-amber-300/40 shadow-xs"
            />
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Website
          </button>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 pb-4">
            <div className="text-center mb-6 flex flex-col items-center">
              <div 
                className="mb-4 cursor-pointer hover:opacity-95 transition-opacity" 
                onClick={() => onNavigate('home')}
                title="Return to Utkal Finance Home"
              >
                <Logo size="lg" showTagline={true} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-finance-100 text-finance-900 text-xs font-bold mb-2">
                <Shield className="w-3.5 h-3.5 text-finance-700" />
                <span>Executive &amp; Audit Portal</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Administrator Portal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Authorized Utkal Finance executive &amp; administrative personnel only
              </p>
            </div>

            {/* Default Demo Helper Banner */}
            <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex flex-col text-left">
                <span className="font-semibold text-slate-700 text-[11px]">
                  Demo Admin Credentials
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  admin@utkalfinance.com / admin123
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('admin@utkalfinance.com');
                  setPassword('admin123');
                  addToast('Admin credentials auto-filled!', 'info');
                }}
                className="px-2 py-1 rounded-lg bg-finance-600 hover:bg-finance-700 text-white font-bold text-[10px] transition-colors"
              >
                Reset Demo
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Admin Email / Username
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin@utkalfinance.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-finance-600 bg-slate-50/50 focus:bg-white transition-all pl-10"
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
                    className="text-xs font-semibold text-finance-600 hover:text-finance-800 transition-colors"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-finance-600 bg-slate-50/50 focus:bg-white transition-all pl-10 pr-10"
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
                  <span>Remember this terminal</span>
                </label>
                <span className="text-slate-400 text-[11px]">256-Bit SSL Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
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

            {/* Quick 1-Click Demo Login Panel */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
                Quick 1-Click Evaluation Login
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" /> Admin Demo Console
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Operations Head Desk &bull; Executive Controls</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-800">
                  1-Click Login &rarr;
                </span>
              </button>
            </div>
          </div>

          {/* Footer Navigation Link */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-600 flex flex-wrap items-center justify-center gap-2">
            <span>Restricted Administrator Access</span>
            <span className="text-slate-300">&bull;</span>
            <button
              onClick={() => onNavigate('home')}
              className="font-bold text-finance-600 hover:text-finance-800 underline transition-colors"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Utkal Finance Limited. Regulated by Reserve Bank of India.
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Your Account Password"
        subtitle="Provide your registered email address or Member ID to receive a secure recovery code."
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Registered Email Address *</label>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="e.g. rajesh.sharma@utkalfinance.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-finance-600"
            />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            An encrypted one-time password (OTP) and password reset token will be dispatched to your registered email and mobile number.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={forgotSubmitted}
              className="px-5 py-2 rounded-xl bg-finance-900 text-white text-xs font-bold tracking-wide uppercase hover:bg-finance-800 flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{forgotSubmitted ? 'Sending Link...' : 'Dispatch Reset OTP'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoginPage;
