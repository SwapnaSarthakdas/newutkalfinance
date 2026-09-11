import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Phone,
  MapPin,
  FileText,
  Search,
  Bell,
  LogIn,
  User,
  UserPlus,
  ChevronDown,
  ArrowRight,
  Shield,
  ShieldCheck,
  Building,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Smartphone,
  HelpCircle,
  ExternalLink,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onNavigate, currentPage = 'home' }) => {
  const { user, role, logout } = useAuth();

  // Navigation & Dropdown states
  const [activeSegment, setActiveSegment] = useState('personal'); // 'personal' | 'business' | 'nri' | 'micro'
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // category id or null
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locateModalOpen, setLocateModalOpen] = useState(false);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);

  const megaMenuTimeoutRef = useRef(null);

  const handleNav = (routeId) => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setLoginDropdownOpen(false);
    if (onNavigate) {
      onNavigate(routeId);
    }
  };

  // Mega Menu Data for Personal Banking (modeled directly after Utkarsh Bank)
  const personalMegaCategories = [
    {
      id: 'savings',
      label: 'Savings Account',
      badge: 'Up to 7.50%*',
      items: [
        { name: 'Standard Savings Account', desc: 'Daily banking with high liquidity and quarterly interest', route: 'register' },
        { name: 'Premium Savings Account', desc: 'Exclusive rewards, premium debit card & higher transaction limits', route: 'register' },
        { name: 'Naveen Savings Account', desc: 'Customized digital banking for young professionals', route: 'register' },
        { name: 'BSBDA Zero Balance', desc: 'Basic Savings Bank Deposit Account with zero balance maintenance', route: 'register' },
        { name: 'Corporate Salary Account', desc: 'Seamless monthly payroll credit with zero account charges', route: 'register' }
      ]
    },
    {
      id: 'deposits',
      label: 'Deposits',
      badge: '8.25% p.a.',
      items: [
        { name: 'Fixed Deposit (FD)', desc: 'Guaranteed high returns with quarterly compounding interest', route: 'calculator' },
        { name: 'Recurring Deposit (RD)', desc: 'Systematic monthly savings starting from ₹500/month', route: 'calculator' },
        { name: 'Senior Citizen Special FD', desc: 'Additional 0.50% bonus interest rate for senior citizens (8.50%)', route: 'calculator' },
        { name: 'Tax Saver FD (Sec 80C)', desc: 'Deduction up to ₹1.5 Lakh under 80C with 5-year lock-in', route: 'calculator' }
      ]
    },
    {
      id: 'loans',
      label: 'Loans',
      badge: 'Instant Disbursal',
      items: [
        { name: 'Home Loan & Griha Sudhar', desc: 'Finance your dream home or renovation at low EMI rates', route: 'calculator' },
        { name: 'MSME Business Loan', desc: 'Working capital & machinery financing for enterprises up to ₹10 Cr', route: 'calculator' },
        { name: 'Gold Loan (Jewellery)', desc: 'Quick funds against gold ornaments with per-gram transparency', route: 'calculator' },
        { name: 'Personal Loan', desc: 'Instant financial liquidity for emergencies, medical, or education', route: 'calculator' },
        { name: 'Loan Against Property (LAP)', desc: 'Unlock equity in your residential or commercial property', route: 'calculator' }
      ]
    },
    {
      id: 'insurance',
      label: 'Insurance & Investment',
      items: [
        { name: 'Comprehensive Term Life', desc: 'Financial protection for your dependents and loved ones', route: 'services' },
        { name: 'Health & Medical Cover', desc: 'Cashless hospitalisation coverage for self & family', route: 'services' },
        { name: 'Atal Pension Yojana (APY)', desc: 'Govt. co-contributed retirement pension for unorganised sector', route: 'services' },
        { name: 'Wealth Advisory Desk', desc: 'Custom portfolio planning for community members', route: 'services' }
      ]
    }
  ];

  // Quick search directory
  const searchableLinks = [
    { title: 'Open Savings Account', category: 'Savings', route: 'register' },
    { title: 'Fixed Deposit Rates (8.25%)', category: 'Deposits', route: 'calculator' },
    { title: 'Home Loan EMI Calculator', category: 'Calculators', route: 'calculator' },
    { title: 'MSME Business Loan', category: 'Loans', route: 'calculator' },
    { title: 'Gold Loan per Gram Rate', category: 'Loans', route: 'calculator' },
    { title: 'Download Membership Form (PDF)', category: 'Forms', route: 'membership-form' },
    { title: 'Corporate Brochure & Handover Document', category: 'Brochure', route: 'brochure' },
    { title: 'Registered Office Address (Nayapalli, Bhubaneswar)', category: 'Contact', route: 'contact' },
    { title: 'Administrator Console Login', category: 'Admin', route: 'admin-login' },
    { title: 'Admin Governance Dashboard', category: 'Admin', route: 'admin-dashboard' },
  ];

  const filteredSearch = searchQuery.trim() === ''
    ? searchableLinks
    : searchableLinks.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-md select-none">
        {/* ========================================================================= */}
        {/* MAIN HEADER BAR (Logo, Segment Tabs, Search, Login)                      */}
        {/* ========================================================================= */}
        <div className="bg-white border-b border-slate-200 relative z-20">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
              {/* Bank Logo */}
              <div
                className="cursor-pointer flex-shrink-0"
                onClick={() => handleNav('home')}
                title="New Utkal Finance Limited - Back to Home"
              >
                <Logo size="md" stackedOnMobile={true} />
              </div>

              {/* Segment Navigation (Personal, Business, NRI, Micro Banking, etc.) */}
              <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
                <button
                  onClick={() => handleNav('home')}
                  className={`px-3 py-1.5 rounded-lg text-xs 2xl:text-sm font-bold transition-all ${
                    currentPage === 'home'
                      ? 'bg-finance-50 text-finance-600 font-extrabold border-b-2 border-finance-600 shadow-2xs'
                      : 'text-slate-700 hover:text-finance-600 hover:bg-slate-50'
                  }`}
                >
                  Personal
                </button>
                <button
                  onClick={() => handleNav('about')}
                  className="px-2.5 py-1.5 text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-finance-600 transition-colors"
                >
                  About Us
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className={`px-2.5 py-1.5 text-xs 2xl:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    currentPage === 'register'
                      ? 'bg-finance-50 text-finance-600 font-extrabold border-b-2 border-finance-600 shadow-2xs'
                      : 'text-finance-600 hover:bg-finance-50/80'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Become a Member</span>
                  <span className="text-[9.5px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    ₹200
                  </span>
                </button>
                <button
                  onClick={() => handleNav('membership-form')}
                  className="px-2.5 py-1.5 text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-finance-600 transition-colors flex items-center gap-1"
                >
                  <span>Statutory Form</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                </button>
                <button
                  onClick={() => handleNav('brochure')}
                  className="px-2.5 py-1.5 text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-finance-600 transition-colors"
                >
                  Brochure
                </button>
                <button
                  onClick={() => handleNav('contact')}
                  className="px-2.5 py-1.5 text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-finance-600 transition-colors"
                >
                  Help &amp; Support
                </button>
              </nav>

              {/* Right Action Cluster: Search, Notifications, Become a Member & Login Dropdown */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Search Button */}
                <button
                  onClick={() => setSearchModalOpen(true)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-finance-600 transition-colors cursor-pointer"
                  title="Search Services, Rates & Products"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-finance-600 transition-colors relative cursor-pointer"
                    title="Important Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                  </button>

                  {notificationsOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in"
                      onMouseLeave={() => setNotificationsOpen(false)}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-finance-600" />
                          <span>Bank Announcements</span>
                        </h4>
                        <span className="text-[11px] font-semibold text-finance-600">3 New</span>
                      </div>
                      <div className="space-y-3 py-3 text-xs max-h-72 overflow-y-auto">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="font-bold text-slate-900 mb-0.5">Revision in Term Deposit Interest Rates</div>
                          <p className="text-slate-600 text-[11px]">
                            Fixed Deposit rates updated to 8.25% p.a. for general citizens and 8.50% p.a. for Senior Citizens.
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">Effective Q1 FY 2026-27</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                          <div className="font-bold text-amber-900 mb-0.5">Statutory 2-Page Membership Form</div>
                          <p className="text-amber-800 text-[11px]">
                            Download the official Associate Membership Form (Fee ₹200) registered under 2013 &amp; 2014 Rules.
                          </p>
                          <button
                            onClick={() => { setNotificationsOpen(false); handleNav('membership-form'); }}
                            className="text-[10px] font-bold text-finance-600 hover:underline mt-1 cursor-pointer"
                          >
                            Download Form &rarr;
                          </button>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="font-bold text-slate-900 mb-0.5">Cyber Security &amp; OTP Advisory</div>
                          <p className="text-slate-600 text-[11px]">
                            Utkal Finance will never call or SMS asking for your confidential OTP, UPI PIN, or netbanking passwords.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary CTA: Become a Member */}
                <button
                  onClick={() => handleNav('register')}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#003E9E] via-[#0A3F9F] to-finance-700 hover:from-[#002E78] hover:to-finance-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
                  title="Apply for Statutory Associate Membership (Fee: ₹200)"
                >
                  <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                  <span className="hidden xs:inline">Become a Member</span>
                  <span className="xs:hidden">Join</span>
                </button>

                {/* Authenticated Admin Portal or Admin Login */}
                {user ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleNav('admin-dashboard')}
                      className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer shrink-0"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span className="hidden sm:inline">Admin Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={logout}
                      className="px-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer shrink-0"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleNav('admin-login')}
                      className="hidden md:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors border border-slate-200 cursor-pointer shrink-0"
                    >
                      <Shield className="w-3.5 h-3.5 text-slate-600" />
                      <span>Admin</span>
                    </button>
                  </div>
                )}

                {/* Mobile Hamburger Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                  aria-label="Toggle Menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* ========================================================================= */}
        {/* MOBILE NAVIGATION DRAWER                                                  */}
        {/* ========================================================================= */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-300 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2">
            <div className="p-4 space-y-4">

              {/* Administrator Login in Mobile Drawer */}
              <div>
                <button
                  onClick={() => handleNav('admin-login')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-900 via-slate-900 to-finance-950 text-white hover:from-purple-800 hover:to-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Administrator Login Console</span>
                </button>
              </div>

              {/* Banking Products Accordion */}
              <div className="space-y-1 divide-y divide-slate-100">
                {personalMegaCategories.map((cat) => (
                  <details key={cat.id} className="group py-2">
                    <summary className="flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer list-none">
                      <div className="flex items-center gap-2">
                        <span>{cat.label}</span>
                        {cat.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                            {cat.badge}
                          </span>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="pl-3 pr-1 py-2 space-y-2 mt-1 border-l-2 border-finance-200">
                      {cat.items.map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleNav(sub.route)}
                          className="w-full text-left py-1 text-xs text-slate-600 hover:text-finance-600 font-medium block"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </details>
                ))}
              </div>

              {/* Quick Pages */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs font-semibold">
                <button onClick={() => handleNav('about')} className="text-left py-1 text-slate-700 hover:text-finance-600">
                  About Us
                </button>
                <button onClick={() => handleNav('membership-form')} className="text-left py-1 text-finance-600 font-bold">
                  Statutory Form (PDF)
                </button>
                <button onClick={() => handleNav('brochure')} className="text-left py-1 text-slate-700 hover:text-finance-600">
                  Corporate Brochure
                </button>
                <button onClick={() => handleNav('contact')} className="text-left py-1 text-slate-700 hover:text-finance-600">
                  Contact &amp; Branches
                </button>
              </div>

              {/* Mobile CTA */}
              <button
                onClick={() => handleNav('register')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#003E9E] via-[#0A3F9F] to-finance-700 hover:from-[#002E78] hover:to-finance-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>Become a Member (₹200 Fee)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mobile Helpline & Address */}
              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-900">Toll Free Support: 1800 123 9878</div>
                <div className="text-slate-500">Nayapalli, IRC Village, Bhubaneswar-751015</div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* SEARCH MODAL DIALOG                                                       */}
      {/* ========================================================================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-finance-600 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search banking products, interest rates, loans, calculators..."
                className="w-full text-sm sm:text-base outline-hidden text-slate-900 placeholder-slate-400 font-medium"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 max-h-96 overflow-y-auto space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {searchQuery ? `Search Results (${filteredSearch.length})` : 'Popular Searches'}
              </div>
              {filteredSearch.length > 0 ? (
                filteredSearch.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchModalOpen(false);
                      handleNav(item.route);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-finance-600">
                        {item.title}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
                        {item.category}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-finance-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No matching banking products found. Try searching for "Loan", "FD", or "Form".
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
              Press ESC or click outside to dismiss
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BRANCH LOCATOR MODAL                                                      */}
      {/* ========================================================================= */}
      {locateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-finance-900 to-finance-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Utkal Branch &amp; Hub Locator</h3>
              </div>
              <button
                onClick={() => setLocateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900 text-sm">Principal Headquarters &amp; Main Branch</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Open Mon-Sat</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Plot no-N/5-172, Nayapalli, IRC village, Bhubaneswar-751015, Odisha
                </p>
                <div className="mt-2 text-slate-600 font-mono">
                  Phone: <strong className="text-finance-600">+91 9776175240</strong> &bull; Toll Free: <strong className="text-finance-600">1800 123 9878</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block mb-1">Cuttack Regional Branch</span>
                <p className="text-slate-600">Badambadi Commercial Complex, Cuttack, Odisha - 753012</p>
                <div className="mt-1 text-slate-500">Retail Banking &amp; Financial Services Center</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block mb-1">Berhampur &amp; Southern Odisha Hub</span>
                <p className="text-slate-600">Main Road, Gandhi Nagar, Berhampur, Ganjam - 760001</p>
                <div className="mt-1 text-slate-500">Retail Deposits &amp; Gold Loan Counter</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">12+ service outlets across Odisha</span>
              <button
                onClick={() => { setLocateModalOpen(false); handleNav('contact'); }}
                className="text-xs font-bold text-finance-600 hover:underline"
              >
                View Full Contact Details &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GRIEVANCE / LODGE A COMPLAINT MODAL                                       */}
      {/* ========================================================================= */}
      {complaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-finance-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Grievance Redressal &amp; Complaints</h3>
              </div>
              <button
                onClick={() => setComplaintModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                At New Utkal Finance Limited, we adhere strictly to customer protection and transparent banking practices. If you have an unresolved service issue or unauthorized transaction report:
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">Level 1: Branch / Helpline Support</div>
                <p className="text-slate-600">Call Toll Free <strong>1800 123 9878</strong> or email <span className="text-finance-600 font-mono">customercare@utkalfinance.com</span>.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">Level 2: Principal Nodal Officer</div>
                <p className="text-slate-600">Write to the Grievance Redressal Officer at Head Office, Nayapalli, Bhubaneswar.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">Level 3: Integrated Ombudsman</div>
                <p className="text-slate-600">Escalate per regulatory guidelines under the RBI Integrated Ombudsman Scheme.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setComplaintModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => { setComplaintModalOpen(false); handleNav('contact'); }}
                className="px-4 py-2 rounded-xl bg-finance-600 hover:bg-finance-700 text-white text-xs font-bold"
              >
                Contact Nodal Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
