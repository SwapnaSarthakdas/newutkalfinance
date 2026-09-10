import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Wallet,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Calculator,
  ChevronRight,
  Award,
  Users,
  Building2,
  PhoneCall,
  Mail,
  MapPin,
  Send,
  Zap,
  Percent,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { calculateEMI, calculateFDReturns } from '../../utils/calculators';
import { formatINR } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';

const LandingPage = ({ onNavigate }) => {
  const { addToast } = useFinance();

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTenure, setLoanTenure] = useState(36); // months
  const [loanRate, setLoanRate] = useState(10.5);

  // FD Calculator State
  const [fdAmount, setFdAmount] = useState(200000);
  const [fdTenure, setFdTenure] = useState(3); // years
  const [fdRate, setFdRate] = useState(7.75);

  // Calculator Tab
  const [calcTab, setCalcTab] = useState('loan'); // 'loan' | 'fd'

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Loans',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emiCalcResult = calculateEMI(loanAmount, loanRate, loanTenure);
  const fdCalcResult = calculateFDReturns(fdAmount, fdRate, fdTenure);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      addToast('Please provide your name and contact number.', 'warning');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Thank you! Our financial advisor will contact you within 2 business hours.', 'success');
      setContactForm({ name: '', phone: '', email: '', service: 'Loans', message: '' });
    }, 800);
  };

  const services = [
    {
      title: 'Savings Accounts',
      desc: 'High-yield member savings accounts with attractive interest rates, digital passbooks, and round-the-clock liquidity.',
      icon: PiggyBank,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
      badge: 'Up to 5.5% p.a.'
    },
    {
      title: 'Credit & Loans',
      desc: 'Transparent personal, business, gold, and home loans with rapid approval, zero hidden charges, and flexible EMIs.',
      icon: CreditCard,
      color: 'from-finance-600/15 to-finance-800/15 text-finance-600',
      badge: 'From 8.4% p.a.'
    },
    {
      title: 'Term & Recurring Deposits',
      desc: 'Fixed Deposits and Recurring Deposits designed to compound your wealth safely with guaranteed returns.',
      icon: TrendingUp,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600',
      badge: 'Up to 8.25% p.a.'
    },
    {
      title: 'Financial Planning',
      desc: 'Comprehensive wealth preservation and strategic advisory tailored for retail investors and small businesses.',
      icon: Wallet,
      color: 'from-purple-500/10 to-pink-500/10 text-purple-600',
      badge: 'Advisory Desk'
    },
    {
      title: 'Account Management',
      desc: 'Self-service digital portal for instant KYC updates, nominee registrations, account statements, and tax proofs.',
      icon: FileText,
      color: 'from-finance-600/15 to-finance-700/15 text-finance-700',
      badge: '100% Digital'
    },
    {
      title: 'Transaction Management',
      desc: 'Real-time fund transfers, auto-debit NACH mandates, UPI integrations, and detailed downloadable audit trails.',
      icon: Zap,
      color: 'from-rose-500/10 to-red-500/10 text-rose-600',
      badge: 'Instant Settlement'
    }
  ];

  const whyChooseUs = [
    {
      title: 'Secure & Regulated',
      desc: 'Governed by RBI NBFC regulations and backed by 256-bit bank-grade encryption across all financial transactions.',
      icon: Lock,
      highlight: 'RBI Regulated'
    },
    {
      title: 'Complete Transparency',
      desc: 'Zero hidden processing fees, no surprise foreclosure penalties, and crystal-clear amortization schedules.',
      icon: CheckCircle2,
      highlight: 'Zero Hidden Fees'
    },
    {
      title: 'Fast Processing',
      desc: 'Digital document verification and automated risk modeling enable loan disbursals in as fast as 24 to 48 hours.',
      icon: Clock,
      highlight: '24-48h Disbursal'
    },
    {
      title: 'Trusted Management',
      desc: 'Over 12 years of ethical leadership, sound credit governance, and a spotless audit track record in Odisha.',
      icon: Award,
      highlight: '12+ Yrs Proven'
    },
    {
      title: 'Digital First Access',
      desc: 'Complete financial operations from the comfort of your home: check balances, pay EMIs, book FDs, and track dues.',
      icon: Zap,
      highlight: 'Anytime Anywhere'
    },
    {
      title: '24/7 Account Access',
      desc: 'Round-the-clock ledger visibility, instant downloadable statements, and proactive payment notification alerts.',
      icon: ShieldCheck,
      highlight: '365 Days Active'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onNavigate={onNavigate} currentPage="home" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200">
        {/* Blurred Banner Background Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
          <div className="w-full h-full max-w-7xl relative opacity-30 transform scale-110">
            <img
              src="/banner.jpg"
              alt=""
              className="w-full h-full object-cover md:object-contain filter blur-2xl lg:blur-3xl"
            />
          </div>
          {/* Subtle gradient scrim to maintain pristine text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-slate-100/90" />
        </div>

        {/* Subtle decorative background shapes */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-finance-100/40 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-finance-50 border border-finance-200 text-finance-800 text-[11px] sm:text-xs font-semibold shadow-xs max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0"></span>
                <span className="truncate">Certified by Govt. of India &bull; Reg. No: U64199OD2026PLC054968</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-black tracking-tight leading-[1.15]">
                Smart Financial Management with{' '}
                <span className="text-finance-600 block sm:inline">New Utkal Finance</span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                New Utkal Finance Limited delivers secure, certified, and technology-driven banking solutions. Empowering individuals, entrepreneurs, and families with accessible loans, high-yield deposits, and seamless digital account governance.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2">
                <button
                  onClick={() => onNavigate('register')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-finance-600 hover:bg-finance-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-finance-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Become a Member</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('membership-form')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#003E9E] border-2 border-[#003E9E] font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#003E9E]" />
                  <span>Membership Form</span>
                </button>
                <button
                  onClick={() => onNavigate('brochure')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-finance-600" />
                  <span>Brochure</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left">
                <div className="p-2 sm:p-0">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">₹250+ Cr</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Assets Managed</div>
                </div>
                <div className="p-2 sm:p-0">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">15,000+</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Active Members</div>
                </div>
                <div className="p-2 sm:p-0">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">99.8%</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Approval Reliability</div>
                </div>
                <div className="p-2 sm:p-0">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">12 Hubs</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Across Odisha</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Card / Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-slate-200/80 relative">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 p-0.5 shadow-sm flex items-center justify-center overflow-hidden">
                      <img src="/logo.jpg" alt="New Utkal Finance" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Member Financial Snapshot</h4>
                      <p className="text-xs text-slate-500">Live Secure Dashboard</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                  </span>
                </div>

                <div className="space-y-4 my-6">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Member Balance</div>
                      <div className="text-2xl font-extrabold text-slate-900 tracking-tight">₹4,85,250</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded">
                        +14.2% Growth
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">Verified Member</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-finance-50/50 rounded-xl border border-finance-100">
                      <div className="text-[11px] text-finance-800 font-medium">Active Deposits</div>
                      <div className="text-base font-bold text-slate-900 mt-0.5">₹12,50,000</div>
                      <div className="text-[10px] text-emerald-600 mt-1">7.75% avg yield</div>
                    </div>
                    <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100">
                      <div className="text-[11px] text-amber-800 font-medium">Next Loan EMI</div>
                      <div className="text-base font-bold text-slate-900 mt-0.5">₹14,500</div>
                      <div className="text-[10px] text-amber-700 mt-1">Due 15 Sep 2026</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Ready to unlock your member benefits?</span>
                  <button
                    onClick={() => onNavigate('register')}
                    className="font-bold text-finance-600 hover:text-finance-800 flex items-center gap-1"
                  >
                    Register Now &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Membership Application Form Spotlight */}
      <section className="bg-gradient-to-r from-[#001B47] via-[#002766] to-[#001438] text-white py-12 border-b border-[#003E9E]/40 relative overflow-hidden">
        {/* Ambient subtle glow matching logo colors */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-b from-[#003E9E]/40 to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#003E9E]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Govt. Certified Application Document</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Official Membership Application Form
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                Registered under 2013 &amp; 2014 rules respectively, working on the lines of Nidhi Company. Associate Membership fee of <strong>₹ 200</strong> entitles members to high-yield deposits, credit facilities, and full voting privileges.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300 font-mono pt-1">
                <span>Reg. No.: <strong className="text-amber-300 font-bold">U64199OD2026PLC054968</strong></span>
                <span>&bull;</span>
                <span>HQ: Bhubaneswar, Odisha</span>
                <span>&bull;</span>
                <span>Statutory 2-Page Format</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full lg:w-auto">
              <button
                onClick={() => onNavigate('membership-form')}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#003E9E] hover:bg-[#002E78] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#003E9E]/30 transition-all flex items-center justify-center gap-2 border border-blue-400/40"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Blank Statutory Form (PDF)</span>
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 border border-slate-200"
              >
                <Users className="w-4 h-4 text-[#003E9E]" />
                <span>Apply as Member Online</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-bold text-finance-600 bg-finance-50 px-3 py-1 rounded-full border border-finance-100">
              Complete Financial Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Comprehensive Financial Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              From capital for your entrepreneurial ambitions to high-return fixed deposits that grow your family's future, Utkal Finance offers regulated, dependable products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 hover:bg-white rounded-2xl p-7 border border-slate-200/80 hover:border-finance-300 shadow-sm hover:shadow-card-hover transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-xs">
                        {svc.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-finance-600 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-2.5 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onNavigate('register')}
                      className="font-semibold text-finance-600 hover:text-finance-800 flex items-center gap-1"
                    >
                      Explore &amp; Apply <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-400">Instant Digital Flow</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Financial Calculator Section */}
      <section id="calculator" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Interactive Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Plan Your Finances Accurately
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Calculate exact monthly loan repayments or forecast your deposit returns with zero obligation.
            </p>

            {/* Toggle Tabs */}
            <div className="mt-8 inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300">
              <button
                onClick={() => setCalcTab('loan')}
                className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  calcTab === 'loan' ? 'bg-white text-finance-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Loan EMI Calculator
              </button>
              <button
                onClick={() => setCalcTab('fd')}
                className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  calcTab === 'fd' ? 'bg-white text-finance-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fixed Deposit Calculator
              </button>
            </div>
          </div>

          {/* Calculator Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-card border border-slate-200">
            {calcTab === 'loan' ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                {/* Sliders Column */}
                <div className="md:col-span-7 space-y-6">
                  {/* Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Loan Amount
                      </label>
                      <span className="text-base font-extrabold text-finance-600">
                        {formatINR(loanAmount)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="25000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-finance-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>₹50,000</span>
                      <span>₹25 Lakhs</span>
                      <span>₹50 Lakhs</span>
                    </div>
                  </div>

                  {/* Tenure Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Tenure (Months)
                      </label>
                      <span className="text-base font-extrabold text-finance-600">
                        {loanTenure} Months ({(loanTenure / 12).toFixed(1)} Yrs)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      step="6"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-finance-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>12 Months</span>
                      <span>60 Months</span>
                      <span>120 Months</span>
                    </div>
                  </div>

                  {/* Interest Rate Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Interest Rate (% p.a.)
                      </label>
                      <span className="text-base font-extrabold text-finance-600">
                        {loanRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="7.5"
                      max="18.0"
                      step="0.25"
                      value={loanRate}
                      onChange={(e) => setLoanRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-finance-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>7.5%</span>
                      <span>12.0%</span>
                      <span>18.0%</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Summary Column */}
                <div className="md:col-span-5 bg-gradient-to-br from-finance-950 via-finance-900 to-finance-850 rounded-2xl p-5 sm:p-8 text-white flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                      Calculated Monthly EMI
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
                      {formatINR(emiCalcResult.emi)}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Per month for {loanTenure} installments</p>
                  </div>

                  <div className="my-6 pt-6 border-t border-finance-800 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Principal Amount</span>
                      <span className="font-semibold text-white">{formatINR(loanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Interest Payable</span>
                      <span className="font-semibold text-amber-400">{formatINR(emiCalcResult.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-finance-800/80">
                      <span className="text-slate-300 font-bold">Total Amount Payable</span>
                      <span className="font-bold text-white">{formatINR(emiCalcResult.totalPayment)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('register')}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all text-center"
                  >
                    Apply for this Loan
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                {/* FD Inputs */}
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Total Investment Amount
                      </label>
                      <span className="text-base font-extrabold text-emerald-600">
                        {formatINR(fdAmount)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="2000000"
                      step="10000"
                      value={fdAmount}
                      onChange={(e) => setFdAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>₹10,000</span>
                      <span>₹10 Lakhs</span>
                      <span>₹20 Lakhs</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Tenure (Years)
                      </label>
                      <span className="text-base font-extrabold text-emerald-600">
                        {fdTenure} {fdTenure === 1 ? 'Year' : 'Years'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={fdTenure}
                      onChange={(e) => setFdTenure(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>1 Year</span>
                      <span>5 Years</span>
                      <span>10 Years</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Interest Rate (% p.a.)
                      </label>
                      <span className="text-base font-extrabold text-emerald-600">
                        {fdRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5.5"
                      max="9.0"
                      step="0.25"
                      value={fdRate}
                      onChange={(e) => setFdRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>5.5%</span>
                      <span>7.5%</span>
                      <span>9.0%</span>
                    </div>
                  </div>
                </div>

                {/* FD Results */}
                <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-finance-950 to-slate-950 rounded-2xl p-5 sm:p-8 text-white flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                      Projected Maturity Value
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
                      {formatINR(fdCalcResult.maturityAmount)}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Compounded quarterly over {fdTenure} years</p>
                  </div>

                  <div className="my-6 pt-6 border-t border-slate-800 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Principal Deposit</span>
                      <span className="font-semibold text-white">{formatINR(fdAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Wealth Gained (Interest)</span>
                      <span className="font-semibold text-emerald-400">{formatINR(fdCalcResult.interestEarned)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('register')}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all text-center"
                  >
                    Open Fixed Deposit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Utkal Finance */}
      <section id="why-us" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-bold text-finance-600 bg-finance-50 px-3 py-1 rounded-full border border-finance-100">
              Institutional Trust
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Why Choose Utkal Finance
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              We combine the warmth and personal accountability of community financial institutions with cutting-edge digital infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-7 border border-slate-200/80 hover:border-slate-300 hover:bg-white transition-all shadow-card hover:shadow-card-hover"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-finance-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">
                      {item.highlight}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-wider font-bold text-finance-600 bg-finance-50 px-3 py-1 rounded-full border border-finance-100">
                About Utkal Finance
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Rooted in Odisha, Empowering Financial Prosperity
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Founded with a mission to eliminate financial friction for hard-working entrepreneurs, professionals, and households across eastern India, Utkal Finance has grown into a highly trusted Category-A Non-Banking Financial Company (NBFC).
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Under the regulatory oversight of the Reserve Bank of India, our institution blends ethical human credit underwriting with secure cloud-native ledger architecture. Every member is treated not merely as an account number, but as an esteemed partner in regional growth.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-finance-600">100%</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">RBI NBFC Compliance</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-emerald-600">4.9 / 5</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">Customer Trust Index</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-gradient-to-br from-finance-900 via-finance-850 to-finance-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                {/* Blurred banner watermark */}
                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                  <img src="/banner.jpg" alt="" className="w-full h-full object-cover filter blur-lg scale-125" />
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Board Governance Standards
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    "Our commitment is simple: absolute safety of member deposits and equitable access to productive credit."
                  </h3>
                  <div className="pt-4 border-t border-finance-800 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-finance-700 to-finance-950 border-2 border-amber-400 flex items-center justify-center font-black text-amber-300 text-sm shadow-md">
                        BM
                      </div>
                      <div>
                        <div className="font-bold text-base text-white">Bhagirathi Mohapatra</div>
                        <div className="text-xs text-amber-300 font-semibold">Managing Director &bull; Newutkal Finance Ltd.</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">Govt. Reg. No.: U64199OD2026PLC054968</div>
                      </div>
                    </div>

                    {/* Official MD Credentials Badge / Card Preview */}
                    <div className="rounded-2xl overflow-hidden border border-white/15 bg-white/5 p-2 backdrop-blur-xs shadow-lg">
                      <img 
                        src="/managing-director-card.jpg" 
                        alt="Bhagirathi Mohapatra - Managing Director, Newutkal Finance Limited" 
                        className="w-full h-auto rounded-xl shadow-xs border border-white/10 object-contain hover:scale-[1.01] transition-transform duration-300"
                      />
                      <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-slate-300">
                        <span>Certified By Govt. of India</span>
                        <span className="font-mono text-amber-300">Mob: +91 9776175240</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-wider font-bold text-finance-600 bg-finance-50 px-3 py-1 rounded-full border border-finance-100">
                Get In Touch
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Connect With Our Financial Specialists
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Have questions regarding loan eligibility, fixed deposit interest rates, or opening a new member account? Reach out to our dedicated support team or visit any regional branch.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <MapPin className="w-5 h-5 text-finance-600 flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Principal Headquarters</h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Plot no-N/5-172, Nayapalli, IRC village, Bhubaneswar-751015
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <PhoneCall className="w-5 h-5 text-finance-600 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Official Helpline &amp; Mobile</h5>
                    <p className="text-xs text-slate-600 mt-0.5 font-mono">+91 9776175240 (Mon-Sat, 9:30 AM - 6:30 PM)</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Mail className="w-5 h-5 text-finance-600 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Direct Email &amp; Web</h5>
                    <p className="text-xs text-slate-600 mt-0.5">bhagirathimohapatra79@gmail.com</p>
                    <p className="text-[11px] text-finance-600 font-mono">www.newutkalfinance.com</p>
                  </div>
                </div>

                {/* Managing Director Leadership Badge */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-finance-50 to-slate-50 border border-finance-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-finance-600 block">Executive Leadership</span>
                    <strong className="text-sm font-bold text-slate-900 block">Bhagirathi Mohapatra</strong>
                    <span className="text-xs text-slate-500">Managing Director</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 font-semibold">
                    Reg: U64199OD2026PLC054968
                  </span>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Send an Inquiry</h3>
                <p className="text-xs text-slate-500 mb-6">Our advisory desk will get back to you within 2 business hours.</p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Alok Das"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-finance-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Number *</label>
                      <input
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="e.g. +91 98610 00000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-finance-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="e.g. name@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-finance-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Service Required</label>
                      <select
                        value={contactForm.service}
                        onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-finance-600"
                      >
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Home Loan">Home Loan</option>
                        <option value="SME Business Loan">SME Business Loan</option>
                        <option value="Fixed Deposit">Fixed Deposit (FD)</option>
                        <option value="Recurring Deposit">Recurring Deposit (RD)</option>
                        <option value="Account Opening">New Member Account Opening</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Requirements</label>
                    <textarea
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Share details regarding loan amount, tenure or specific queries..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-finance-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-finance-900 hover:bg-finance-800 text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
