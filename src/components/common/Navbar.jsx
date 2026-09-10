import React, { useState } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, User, LogIn } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onNavigate, currentPage = 'home' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, logout } = useAuth();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'why-us', label: 'Why Utkal' },
    { id: 'brochure', label: 'Brochure' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (id) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Blurred banner in navbar background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.08] z-0">
        <img src="/banner.jpg" alt="" className="w-full h-full object-cover filter blur-xl scale-125" />
      </div>

      {/* Top Official Government Certification Banner */}
      <div className="relative overflow-hidden bg-slate-950 text-white border-b border-finance-800/60 z-10">
        {/* Ambient blurred banner glow backdrop */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <img src="/banner.jpg" alt="" className="w-full h-full object-cover filter blur-md scale-110" />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1 sm:py-1.5 relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src="/banner.jpg"
              alt="New Utkal Finance Limited - Certified by Govt. of India"
              className="h-7 sm:h-10 md:h-11 w-auto object-contain rounded shadow-sm border border-amber-400/40 bg-white/5 flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-wider truncate">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 flex-shrink-0" /> Certified by Govt. of India
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-300 font-mono truncate">
                Reg: <strong className="text-white">U64199OD2026PLC054968</strong> <span className="hidden sm:inline">&bull; 100% Encrypted &amp; Insured</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-300 flex-shrink-0">
            <a
              href="tel:+919776175240"
              className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-slate-300 hover:text-white font-medium bg-white/10 hover:bg-white/15 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg transition-colors"
              title="Call Helpline"
            >
              <span className="text-emerald-400">📞</span>
              <span className="font-semibold">+91 9776175240</span>
            </a>
            <span className="hidden lg:inline text-slate-600">&bull;</span>
            <span className="hidden lg:inline text-slate-300 text-xs">bhagirathimohapatra79@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo with strict flex-shrink-0 to prevent compression */}
          <div className="cursor-pointer flex-shrink-0" onClick={() => handleNav('home')}>
            <Logo size="md" />
          </div>

          {/* Desktop Nav Links with responsive spacing & whitespace-nowrap */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-6 2xl:gap-8 flex-1 justify-center px-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`text-xs xl:text-sm transition-colors hover:text-finance-600 whitespace-nowrap px-1 py-1 ${currentPage === link.id ? 'text-finance-600 font-bold' : 'text-black font-medium'
                  }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate(role === 'ADMIN' ? 'admin-dashboard' : 'member-dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-sm font-semibold shadow-sm transition-all"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    currentPage === 'login'
                      ? 'bg-finance-50 text-finance-700 font-bold border border-finance-300 shadow-xs'
                      : 'text-black hover:text-finance-600 hover:bg-slate-100'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-finance-600 hover:bg-finance-700 text-white text-sm font-semibold shadow-sm shadow-finance-600/20 transition-all hover:shadow-md"
                >
                  <span>Become a Member</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Action & Hamburger */}
          <div className="lg:hidden flex items-center gap-1.5">
            {!user ? (
              <button
                onClick={() => onNavigate('login')}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                  currentPage === 'login'
                    ? 'border-finance-600 bg-finance-600 text-white shadow-xs'
                    : 'border-finance-200 bg-finance-50 text-finance-600 hover:bg-finance-100'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate(role === 'ADMIN' ? 'admin-dashboard' : 'member-dashboard')}
                className="text-xs font-bold text-white bg-finance-900 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portal</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 relative overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
            <img src="/banner.jpg" alt="" className="w-full h-full object-cover filter blur-lg" />
          </div>
          <div className="relative z-10 flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-finance-600"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate(role === 'ADMIN' ? 'admin-dashboard' : 'member-dashboard');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-finance-900 text-white text-sm font-semibold shadow"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  Go to Admin Portal
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('login');
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                    currentPage === 'login'
                      ? 'border-finance-500 bg-finance-50 text-finance-700 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <LogIn className="w-4 h-4 text-finance-600" />
                  Admin Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('register');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-finance-600 text-white text-sm font-semibold hover:bg-finance-700 shadow"
                >
                  Become a Member
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
