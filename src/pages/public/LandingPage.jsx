import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  ChevronLeft,
  Award,
  Users,
  PhoneCall,
  Mail,
  MapPin,
  Send,
  Zap,
  FileText,
  FileSpreadsheet,
  Smartphone,
  Gift,
  Calculator,
  Percent,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Building,
  HelpCircle
} from 'lucide-react';
import Footer from '../../components/common/Footer';
import { calculateEMI, calculateFDReturns, calculateRDReturns } from '../../utils/calculators';
import { formatINR } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';

const LandingPage = ({ onNavigate }) => {
  const { addToast } = useFinance();

  // =========================================================================
  // 1. FINANCIAL CALCULATOR SUITE STATE (Utkarsh Bank Style)
  // =========================================================================
  const [calcTab, setCalcTab] = useState('home-loan'); // 'home-loan' | 'personal-loan' | 'fd' | 'gold-loan'

  // Home Loan & Business Loan State
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [loanTenure, setLoanTenure] = useState(180); // months (15 yrs)
  const [loanRate, setLoanRate] = useState(8.75);

  // Personal Loan State
  const [plAmount, setPlAmount] = useState(300000);
  const [plTenure, setPlTenure] = useState(36); // months
  const [plRate, setPlRate] = useState(11.5);

  // FD State
  const [fdAmount, setFdAmount] = useState(300000);
  const [fdTenure, setFdTenure] = useState(3); // years
  const [fdRate, setFdRate] = useState(8.25);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);

  // Gold Loan State
  const [goldGrams, setGoldGrams] = useState(40); // grams
  const [goldPurity, setGoldPurity] = useState(22); // 22K or 24K
  const goldRatePerGram = goldPurity === 22 ? 6250 : 6800;
  const estimatedGoldLoan = Math.round(goldGrams * goldRatePerGram * 0.75); // 75% LTV

  // Computed results
  const homeLoanResult = calculateEMI(loanAmount, loanRate, loanTenure);
  const personalLoanResult = calculateEMI(plAmount, plRate, plTenure);
  const actualFdRate = isSeniorCitizen ? fdRate + 0.25 : fdRate;
  const fdResult = calculateFDReturns(fdAmount, actualFdRate, fdTenure);

  // =========================================================================
  // 2. HERO CAROUSEL STATE
  // =========================================================================
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const heroSlides = [
    {
      id: 'fd-rate',
      tag: 'Special Festive Interest Rates',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
      dotColor: 'bg-amber-500',
      title: 'Secure Your Future with High-Yield Fixed Deposits',
      subtitle: 'Earn up to 8.25%* p.a. on Fixed Deposits & 8.50%* p.a. for Senior Citizens. Safe compounding with quarterly interest payout directly to your account.',
      badge: 'DICGC Insured & Regulated',
      primaryBtnText: 'Calculate Returns',
      primaryAction: () => {
        setCalcTab('fd');
        const el = document.getElementById('calculator-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      secondaryBtnText: 'Open FD Account',
      secondaryAction: () => onNavigate('register'),
      stats: [
        { label: 'General Rate', val: '8.25% p.a.' },
        { label: 'Senior Citizens', val: '8.50% p.a.' },
        { label: 'Tenure', val: '7 Days - 10 Yrs' }
      ],
      gradient: 'from-[#FFFDF7] via-[#F6F9FE] to-[#EEF5FF]',
      image: '/fd-banner.jpg',
      imageAlt: 'Secure Your Future with High-Yield Fixed Deposits',
      cardBadge: 'Safe Growth & High Yield'
    },
    {
      id: 'savings-acc',
      tag: 'Zero Balance & Digital Passbook',
      tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      dotColor: 'bg-emerald-500',
      title: 'Make Life Easier with Digital Savings Accounts',
      subtitle: 'Open an Instant High-Interest Savings Account with up to 7.50%* returns credited quarterly. Complete zero-balance facility with instant digital passbook and doorstep banking support.',
      badge: '100% Paperless Opening',
      primaryBtnText: 'Open Account Online',
      primaryAction: () => onNavigate('register'),
      secondaryBtnText: 'Download Blank Form',
      secondaryAction: () => onNavigate('membership-form'),
      stats: [
        { label: 'Savings Yield', val: 'Up to 7.50%*' },
        { label: 'Min. Balance', val: '₹0 (Zero)' },
        { label: 'Passbook', val: 'Digital Passbook' }
      ],
      gradient: 'from-[#F5FBF7] via-[#F4F9FD] to-[#EAF4FF]',
      image: '/savings-banner.jpg',
      imageAlt: 'Zero Balance Digital Savings Accounts',
      cardBadge: 'Zero Balance • Digital'
    },
    {
      id: 'loans',
      tag: 'Fast-Track Credit Solutions',
      tagColor: 'bg-blue-100 text-blue-900 border-blue-300',
      dotColor: 'bg-blue-600',
      title: 'Turn Your Ambitions Into Reality with Low EMI Loans',
      subtitle: 'Fast-track MSME Business Loans, Home Loans & Gold Loans up to ₹10 Crores. Minimal paperwork, transparent underwriting, and disbursal within 24 to 48 hours.',
      badge: 'Zero Hidden Processing Fees',
      primaryBtnText: 'Apply For Loan',
      primaryAction: () => onNavigate('register'),
      secondaryBtnText: 'Calculate EMI',
      secondaryAction: () => {
        setCalcTab('home-loan');
        const el = document.getElementById('calculator-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      stats: [
        { label: 'Loan Limit', val: 'Up to ₹10 Cr' },
        { label: 'EMI Starts', val: '₹740 / Lakh' },
        { label: 'Disbursal', val: '24-48 Hours' }
      ],
      gradient: 'from-[#F0F5FF] via-[#F6FAFF] to-[#E9F1FE]',
      image: '/ambition-loans-banner.jpg',
      imageAlt: 'Turn Your Ambitions Into Reality with Low EMI Loans',
      cardBadge: 'Low EMI • Fast Disbursal'
    },
    {
      id: 'digital-banking',
      tag: 'Next-Gen Banking Experience',
      tagColor: 'bg-purple-100 text-purple-900 border-purple-300',
      dotColor: 'bg-purple-600',
      title: 'Utkal Digital & WhatsApp Banking at Your Fingertips',
      subtitle: 'Experience 24/7 financial control. Check account balances, transfer funds via UPI, pay bills via Bharat Connect, and get instant receipts on WhatsApp.',
      badge: '256-Bit Bank Encryption',
      primaryBtnText: 'WhatsApp Banking',
      primaryAction: () => window.open('https://wa.me/919776175240?text=Hi%2C%20Utkal%20Finance', '_blank'),
      secondaryBtnText: 'Admin Console Login',
      secondaryAction: () => onNavigate('admin-login'),
      stats: [
        { label: 'Availability', val: '24 x 7 x 365' },
        { label: 'WhatsApp Desk', val: '+91 9776175240' },
        { label: 'Security', val: 'SHA-256 SSL' }
      ],
      gradient: 'from-[#FBF8FF] via-[#F5F7FF] to-[#EBF0FF]',
      image: '/utkal-tower.jpg',
      imageAlt: 'Utkal Digital & WhatsApp Banking',
      cardBadge: '24x7 Digital Desk'
    }
  ];

  // Auto slide interval
  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isCarouselPaused, heroSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };



  // =========================================================================
  // 3. CONTACT / INQUIRY FORM STATE
  // =========================================================================
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Home Loan',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      addToast('Please provide your name and contact phone number.', 'warning');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Thank you! Our branch financial advisor will contact you within 2 business hours.', 'success');
      setContactForm({ name: '', phone: '', email: '', service: 'Home Loan', message: '' });
    }, 800);
  };

  // =========================================================================
  // 4. UTKARSH 4-CARD PRODUCTS DATA
  // =========================================================================
  const bankingProducts = [
    {
      title: 'Savings Account',
      tagline: 'Earn up to 7.50%* on your Savings Account and get interest credited quarterly.',
      icon: PiggyBank,
      color: 'from-blue-600 to-indigo-700',
      rate: 'Up to 7.50%*',
      features: ['Zero Balance BSBDA Available', 'Instant Digital Passbook', 'Unlimited UPI & ATM Usage', 'Quarterly Interest Payout'],
      badge: 'High Liquidity',
      actionText: 'Open Savings Account',
      actionRoute: 'register',
      bgImage: '/savings-ai-bg.jpg',
      overlay: 'from-blue-950/90 via-blue-900/60 to-blue-950/70'
    },
    {
      title: 'Deposits (FD & RD)',
      tagline: 'Earn interest rates up to 8.25%* p.a. and 8.50%* p.a. for Senior Citizens.',
      icon: TrendingUp,
      color: 'from-amber-600 to-orange-700',
      rate: 'Up to 8.25%*',
      features: ['Safe DICGC Insurance Cover', 'Compounded Quarterly Returns', 'Tenures from 7 Days to 10 Yrs', 'Tax Saver 80C Options'],
      badge: 'Guaranteed Returns',
      actionText: 'Book Fixed Deposit',
      actionRoute: 'calculator',
      bgImage: '/deposits-ai-bg.jpg',
      overlay: 'from-amber-950/92 via-amber-900/65 to-orange-950/75'
    },
    {
      title: 'Loans & Advances',
      tagline: 'Get Loan amount up to ₹10 Crores with flexible tenure up to 15 years.',
      icon: CreditCard,
      color: 'from-purple-600 to-violet-800',
      rate: 'From 8.4% p.a.',
      features: ['Home Loan & Griha Sudhar', 'MSME Working Capital', 'Instant Gold Loan Valuation', 'Minimal KYC Documentation'],
      badge: 'Quick Approval',
      actionText: 'Apply For Loan',
      actionRoute: 'calculator',
      bgImage: '/loans-ai-bg.jpg',
      overlay: 'from-purple-950/92 via-purple-900/65 to-violet-950/75'
    },
    {
      title: 'Insurance & Investments',
      tagline: 'Turn your surplus funds into security for a better and confident tomorrow.',
      icon: Wallet,
      color: 'from-emerald-600 to-teal-800',
      rate: 'Protection + Growth',
      features: ['Family Term Life Insurance', 'Cashless Health Hospitalisation', 'Atal Pension Yojana (APY)', 'Dedicated Advisory Desk'],
      badge: 'Family Security',
      actionText: 'Explore Coverage',
      actionRoute: 'services',
      bgImage: '/insurance-ai-bg.jpg',
      overlay: 'from-emerald-950/92 via-teal-950/65 to-emerald-900/75'
    }
  ];


  // Financial literacy insights / blogs
  const financialBlogs = [
    {
      title: 'Zero Balance vs Regular Savings Account: Complete Comparison 2026',
      desc: 'Understand key differences in average monthly balance requirements, interest credit cycles, and digital benefits.',
      date: 'Aug 2026',
      readTime: '4 min read'
    },
    {
      title: 'Senior Citizen Fixed Deposit Guide: Maximize Returns with Safe Compounding',
      desc: 'How retirees can benefit from additional 0.50% interest bonus and monthly interest payout schemes.',
      date: 'Aug 2026',
      readTime: '5 min read'
    },
    {
      title: 'MSME Business Loan Eligibility: Steps to Fast-Track Your Working Capital',
      desc: 'A step-by-step checklist of GST records, projected turnover, and collateral-free loan solutions in Odisha.',
      date: 'Sep 2026',
      readTime: '6 min read'
    },
    {
      title: 'Digital Banking Safety: 10 Golden Rules to Protect Against Cyber Scams',
      desc: 'Essential security guidelines on OTP verification, UPI PIN confidentiality, and recognizing phishing attempts.',
      date: 'Sep 2026',
      readTime: '4 min read'
    }
  ];

  const activeSlide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* SECTION 1: HIGH-IMPACT HERO BANNER CAROUSEL (Utkarsh Bank Style)           */}
      {/* ========================================================================= */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFD] to-[#EDF3FA] text-slate-900 select-none border-b border-slate-200/80"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        {/* Subtle Geometric Dot Mesh & Ambient Bank Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#003E9E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Slide Copy */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left animate-in fade-in duration-500" key={`slide-text-${currentSlide}`}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs bg-white/80 backdrop-blur-xs">
                <span className={`w-2 h-2 rounded-full ${activeSlide.dotColor || 'bg-emerald-500'} animate-ping flex-shrink-0`} />
                <span className={activeSlide.tagColor}>{activeSlide.tag}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {activeSlide.title}
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {activeSlide.subtitle}
              </p>

              {/* Stats Highlights on Slide */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
                {activeSlide.stats.map((st, sIdx) => (
                  <div key={sIdx} className="p-2.5 sm:p-3 rounded-2xl bg-white shadow-xs border border-slate-200/80 backdrop-blur-xs hover:border-blue-200 transition-colors">
                    <div className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">{st.label}</div>
                    <div className="text-sm sm:text-base font-extrabold text-[#003E9E] font-mono mt-0.5">{st.val}</div>
                  </div>
                ))}
              </div>

              {/* Slide Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-4">
                <button
                  onClick={activeSlide.primaryAction}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{activeSlide.primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={activeSlide.secondaryAction}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm uppercase tracking-wider border border-slate-300 hover:border-slate-400 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{activeSlide.secondaryBtnText}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Right Card / Interactive Visual with Generated High-Impact Image */}
            <div className="lg:col-span-5" key={`slide-image-${currentSlide}`}>
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl shadow-blue-950/15 bg-white group aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={activeSlide.image}
                  alt={activeSlide.imageAlt || activeSlide.title}
                  className="w-full h-full object-cover object-center transform transition-all duration-700 group-hover:scale-105 animate-in fade-in duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/10 pointer-events-none" />

                {/* Top Floating Glass Badges */}
                <div className="absolute top-3.5 inset-x-3.5 sm:top-4 sm:inset-x-4 flex items-center justify-between pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-[11px] sm:text-xs font-bold text-slate-800 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{activeSlide.cardBadge || activeSlide.badge}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md border border-emerald-400/30 text-[10px] sm:text-[11px] font-bold text-white shadow-md">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    <span>Govt. Regulated</span>
                  </div>
                </div>

                {/* Bottom Floating Details Strip */}
                <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 p-3 sm:p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between gap-3 text-white">
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate">{activeSlide.tag}</div>
                    <div className="text-xs sm:text-sm font-extrabold text-white font-mono truncate flex items-center gap-1.5">
                      <span className="text-amber-400">●</span>
                      <span>{activeSlide.badge}</span>
                    </div>
                  </div>
                  <button
                    onClick={activeSlide.primaryAction}
                    className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>{activeSlide.id === 'loans' ? 'Apply Loan' : 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Pagination Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-200/80 mt-10">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-[#003E9E]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#003E9E] transition-colors cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#003E9E] transition-colors cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Statutory Trust Indicators Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 mt-6">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                ₹
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Associate Membership</span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 font-mono">₹ 200 Only</strong>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Capital Governance</span>
                <strong className="text-xs sm:text-sm font-bold text-emerald-700 font-mono">₹ 250+ Cr Assets</strong>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <Users className="w-7 h-7 text-[#003E9E] flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Active Community</span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 font-mono">15,000+ Members</strong>
              </div>
            </div>
            <button
              onClick={() => onNavigate('membership-form')}
              className="p-3.5 rounded-2xl bg-blue-50/80 hover:bg-blue-100/70 border border-blue-200/80 flex items-center justify-between text-left group transition-all cursor-pointer"
            >
              <div>
                <span className="text-[10px] text-blue-700 block font-semibold uppercase tracking-wider">Statutory PDF</span>
                <strong className="text-xs sm:text-sm font-bold text-[#003E9E] group-hover:underline">Download Form</strong>
              </div>
              <FileText className="w-5 h-5 text-[#003E9E]" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: FLASH NOTIFICATION / MARQUEE BAR (Utkarsh Bank Signature)       */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#4A2C7D] text-white py-2 px-3 sm:px-6 shadow-inner flex items-center overflow-hidden border-b border-purple-900 select-none">
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded text-[10px] sm:text-xs uppercase tracking-wider mr-3 z-10 shadow-sm">
          <Zap className="w-3 h-3 text-slate-950" />
          <span>Notice</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1 relative">
          <div className="animate-marquee text-xs sm:text-sm font-medium text-slate-100">
            <span className="mx-4">
              📢 <strong>Revision in Term Deposit Rates:</strong> Earn up to <strong>8.25% p.a.</strong> on Fixed Deposits and <strong>8.50% p.a.</strong> for Senior Citizens w.e.f. Q1 FY 2026-27.
            </span>
            <span className="mx-4 text-amber-300">
              🛡️ <strong>Statutory Membership:</strong> Associate Membership fee of ₹ 200 registered under 2013 &amp; 2014 Rules respectively. Reg. No. U64199OD2026PLC054968.
            </span>
            <span className="mx-4 text-emerald-300">
              🔒 <strong>Cyber Advisory:</strong> Utkal Finance never solicits your confidential OTP, UPI PIN, or netbanking passwords over telephone or SMS.
            </span>
            <span className="mx-4">
              📄 <strong>Form Center:</strong> Download the official 2-Page Membership Application Document online for quick doorstep verification.
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: "MAKE LIFE EASIER WITH NEW AGE BANKING PRODUCTS" (Utkarsh S2)   */}
      {/* ========================================================================= */}
      <section id="products-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-wider font-extrabold text-finance-600 bg-finance-50 px-3 py-1 rounded-full border border-finance-100">
              Retail &amp; Institutional Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Make Life Easier with New Age Banking Products
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
              Take a look at what's new right now. Transparent credit, high-yield deposit instruments, and secure digital banking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {bankingProducts.map((prod, idx) => {
              const Icon = prod.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-finance-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Card Header with Distinctive Gradient & Icon */}
                  <div className={`p-6 bg-gradient-to-br ${prod.color} text-white relative overflow-hidden`}>
                    {/* Background AI Image */}
                    {prod.bgImage && (
                      <>
                        <img
                          src={prod.bgImage}
                          alt={prod.title}
                          className="absolute inset-0 w-full h-full object-cover object-center opacity-75 group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${prod.overlay || 'from-slate-950/90 via-slate-900/60 to-slate-950/70'} pointer-events-none`} />
                      </>
                    )}

                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/30 backdrop-blur-xs">
                        {prod.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mt-4 relative z-10">{prod.title}</h3>
                    <div className="text-2xl font-black text-amber-300 font-mono mt-1 relative z-10">
                      {prod.rate}
                    </div>

                    {/* Decorative pattern circle */}
                    <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-xs pointer-events-none" />
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {prod.tagline}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                      {prod.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (prod.actionRoute === 'calculator') {
                          const el = document.getElementById('calculator-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          onNavigate(prod.actionRoute);
                        }
                      }}
                      className="w-full mt-4 py-2.5 rounded-xl bg-white hover:bg-finance-50 text-finance-600 font-bold text-xs border border-finance-200 hover:border-finance-400 transition-all flex items-center justify-center gap-1.5 shadow-2xs group-hover:bg-finance-600 group-hover:text-white"
                    >
                      <span>{prod.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: "COUNT YOUR PATH TO SUCCESS" - CALCULATORS (Utkarsh S3)         */}
      {/* ========================================================================= */}
      <section id="calculator-section" className="py-16 sm:py-20 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Interactive Financial Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Count your path to <span className="text-finance-600">success!</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Plan with accurate bank-grade formulas. Calculate exact monthly EMIs or forecast deposit growth.
            </p>

            {/* Utkarsh Calculator Tab Switcher */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-300/80 shadow-xs max-w-2xl mx-auto">
              <button
                onClick={() => setCalcTab('home-loan')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  calcTab === 'home-loan'
                    ? 'bg-finance-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-finance-600 hover:bg-slate-50'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Home Loan</span>
              </button>

              <button
                onClick={() => setCalcTab('personal-loan')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  calcTab === 'personal-loan'
                    ? 'bg-finance-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-finance-600 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>MSME &amp; Personal</span>
              </button>

              <button
                onClick={() => setCalcTab('fd')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  calcTab === 'fd'
                    ? 'bg-finance-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-finance-600 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>FD &amp; RD Returns</span>
              </button>

              <button
                onClick={() => setCalcTab('gold-loan')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  calcTab === 'gold-loan'
                    ? 'bg-finance-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-finance-600 hover:bg-slate-50'
                }`}
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Gold Loan</span>
              </button>
            </div>
          </div>

          {/* Calculator Card Body */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
            {/* TAB 1: HOME LOAN EMI CALCULATOR */}
            {calcTab === 'home-loan' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="md:col-span-7 space-y-6">
                  {/* Amount */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Home Loan Amount
                      </label>
                      <span className="text-base font-extrabold text-finance-600 font-mono">
                        {formatINR(loanAmount)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500000"
                      max="10000000"
                      step="50000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-finance-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>₹5 Lakhs</span>
                      <span>₹50 Lakhs</span>
                      <span>₹1 Crore</span>
                    </div>
                  </div>

                  {/* Tenure */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Tenure (Years / Months)
                      </label>
                      <span className="text-base font-extrabold text-finance-600 font-mono">
                        {loanTenure / 12} Years ({loanTenure} Mos)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="240"
                      step="12"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-finance-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>1 Year</span>
                      <span>10 Years</span>
                      <span>20 Years</span>
                    </div>
                  </div>

                  {/* Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Interest Rate (% p.a.)
                      </label>
                      <span className="text-base font-extrabold text-finance-600 font-mono">
                        {loanRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="8.0"
                      max="15.0"
                      step="0.1"
                      value={loanRate}
                      onChange={(e) => setLoanRate(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-finance-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>8.0%</span>
                      <span>11.5%</span>
                      <span>15.0%</span>
                    </div>
                  </div>
                </div>

                {/* Readout Column */}
                <div className="md:col-span-5 bg-gradient-to-br from-[#111827] via-[#0A2540] to-[#001E50] rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                      Calculated Monthly EMI
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono mt-2 tracking-tight">
                      {formatINR(homeLoanResult.emi)}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Per month for {loanTenure} installments</p>
                  </div>

                  <div className="my-6 pt-5 border-t border-white/15 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Principal Amount</span>
                      <span className="font-semibold text-white font-mono">{formatINR(loanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total Interest</span>
                      <span className="font-semibold text-amber-300 font-mono">{formatINR(homeLoanResult.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                      <span className="text-white">Total Amount Payable</span>
                      <span className="text-white font-mono">{formatINR(homeLoanResult.totalPayment)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('register')}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all text-center shadow-md cursor-pointer"
                  >
                    Apply for this Loan
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PERSONAL & MSME LOAN */}
            {calcTab === 'personal-loan' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Personal / MSME Loan Amount
                      </label>
                      <span className="text-base font-extrabold text-finance-600 font-mono">
                        {formatINR(plAmount)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="25000"
                      value={plAmount}
                      onChange={(e) => setPlAmount(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-finance-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>₹50,000</span>
                      <span>₹10 Lakhs</span>
                      <span>₹20 Lakhs</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Tenure (Months)
                      </label>
                      <span className="text-base font-extrabold text-finance-600 font-mono">
                        {plTenure} Months ({(plTenure / 12).toFixed(1)} Yrs)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="60"
                      step="6"
                      value={plTenure}
                      onChange={(e) => setPlTenure(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-finance-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>12 Months</span>
                      <span>36 Months</span>
                      <span>60 Months</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Interest Rate (% p.a.)
                      </label>
                      <span className="text-base font-extrabold text-finance-600 font-mono">
                        {plRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="9.5"
                      max="18.0"
                      step="0.25"
                      value={plRate}
                      onChange={(e) => setPlRate(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-finance-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>9.5%</span>
                      <span>13.5%</span>
                      <span>18.0%</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 bg-gradient-to-br from-[#241744] to-[#0A2540] rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                      Calculated Monthly EMI
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono mt-2 tracking-tight">
                      {formatINR(personalLoanResult.emi)}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Per month for {plTenure} installments</p>
                  </div>

                  <div className="my-6 pt-5 border-t border-white/15 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Principal</span>
                      <span className="font-semibold text-white font-mono">{formatINR(plAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total Interest</span>
                      <span className="font-semibold text-amber-300 font-mono">{formatINR(personalLoanResult.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                      <span className="text-white">Total Payable</span>
                      <span className="text-white font-mono">{formatINR(personalLoanResult.totalPayment)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('register')}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all text-center shadow-md cursor-pointer"
                  >
                    Apply for this Loan
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: FD & RD MATURITY CALCULATOR */}
            {calcTab === 'fd' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Deposit Principal Amount
                      </label>
                      <span className="text-base font-extrabold text-emerald-600 font-mono">
                        {formatINR(fdAmount)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="2500000"
                      step="10000"
                      value={fdAmount}
                      onChange={(e) => setFdAmount(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>₹10,000</span>
                      <span>₹12.5 Lakhs</span>
                      <span>₹25 Lakhs</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Tenure (Years)
                      </label>
                      <span className="text-base font-extrabold text-emerald-600 font-mono">
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
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>1 Year</span>
                      <span>5 Years</span>
                      <span>10 Years</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Senior Citizen Bonus (+0.25%)</span>
                      <span className="text-[11px] text-slate-500">Applicable for investors 60 years and above</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSeniorCitizen}
                      onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                      className="w-5 h-5 accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="md:col-span-5 bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                      Maturity Value ({actualFdRate}% p.a.)
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-2 tracking-tight">
                      {formatINR(fdResult.maturityAmount)}
                    </div>
                    <p className="text-xs text-emerald-200 mt-1">Compounded quarterly over {fdTenure} years</p>
                  </div>

                  <div className="my-6 pt-5 border-t border-emerald-400/30 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-emerald-200">Total Deposit</span>
                      <span className="font-semibold text-white font-mono">{formatINR(fdAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-200">Interest Earned</span>
                      <span className="font-bold text-amber-300 font-mono">{formatINR(fdResult.interestEarned)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('register')}
                    className="w-full py-3 rounded-xl bg-white text-emerald-900 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all text-center shadow-md cursor-pointer"
                  >
                    Book Fixed Deposit
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: GOLD LOAN CALCULATOR */}
            {calcTab === 'gold-loan' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Gold Weight in Grams (Net)
                      </label>
                      <span className="text-base font-extrabold text-amber-600 font-mono">
                        {goldGrams} Grams
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="250"
                      step="5"
                      value={goldGrams}
                      onChange={(e) => setGoldGrams(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>5 g</span>
                      <span>125 g</span>
                      <span>250 g</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Gold Purity Standard
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setGoldPurity(22)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                          goldPurity === 22
                            ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-2xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div>22 Karat (91.6%)</div>
                        <span className="text-[10px] text-slate-500 font-normal">₹6,250 / gram</span>
                      </button>
                      <button
                        onClick={() => setGoldPurity(24)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                          goldPurity === 24
                            ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-2xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div>24 Karat (99.9%)</div>
                        <span className="text-[10px] text-slate-500 font-normal">₹6,800 / gram</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <p className="font-semibold">Safe &amp; Insured Vault Storage</p>
                    <span className="text-[11px] text-amber-800">Your gold jewellery is evaluated transparently and stored in high-security biometric bank vaults.</span>
                  </div>
                </div>

                <div className="md:col-span-5 bg-gradient-to-br from-[#78350F] via-[#92400E] to-[#B45309] rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-amber-200">
                      Eligible Loan Amount (75% LTV)
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-amber-200 font-mono mt-2 tracking-tight">
                      {formatINR(estimatedGoldLoan)}
                    </div>
                    <p className="text-xs text-amber-100 mt-1">Instant valuation on {goldGrams}g @ {goldPurity}K</p>
                  </div>

                  <div className="my-6 pt-5 border-t border-amber-400/30 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-amber-200">Valuation Rate</span>
                      <span className="font-semibold text-white font-mono">₹{goldRatePerGram}/g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200">Max Disbursal Time</span>
                      <span className="font-bold text-white">Under 30 Minutes</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('register')}
                    className="w-full py-3 rounded-xl bg-white text-amber-950 font-black text-xs uppercase tracking-wider hover:bg-slate-100 transition-all text-center shadow-md cursor-pointer"
                  >
                    Apply for Gold Loan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* ========================================================================= */}
      {/* SECTION 7: STATUTORY GOVERNANCE & MD LEADERSHIP SPOTLIGHT                 */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Govt. Certified Accreditation</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Rooted in Odisha, Built on Ethical Trust &amp; Stability
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Registered under the provisions of the Companies Act 2013 &amp; 2014 rules respectively, working on the lines of a Nidhi Company. Associate Membership fee of <strong>₹ 200</strong> entitles members to high-yield deposit options, affordable loans, and full institutional participation.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Registration No.</span>
                  <strong className="text-xs sm:text-sm font-mono text-slate-900 block mt-0.5">U64199OD2026PLC054968</strong>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Capital Governance</span>
                  <strong className="text-xs sm:text-sm font-bold text-finance-600 block mt-0.5">₹ 250+ Cr Assets</strong>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-500 block">Principal Location</span>
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">Bhubaneswar, Odisha</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('membership-form')}
                  className="px-6 py-3 rounded-xl bg-finance-600 hover:bg-finance-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span>Statutory Membership Form (PDF)</span>
                </button>
                <button
                  onClick={() => onNavigate('brochure')}
                  className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-finance-600" />
                  <span>Corporate Brochure</span>
                </button>
              </div>
            </div>

            {/* Leadership Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-finance-950 via-finance-900 to-finance-850 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Managing Director's Desk</span>
                    <span className="text-[10px] text-slate-400 font-mono">ODISHA</span>
                  </div>

                  <blockquote className="text-sm sm:text-base italic text-slate-200 leading-relaxed">
                    "Our mission is clear: absolute protection of member deposits, complete transparency in credit, and empowering Odisha's local enterprises to thrive."
                  </blockquote>

                  <div className="pt-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-base shadow-md">
                      BM
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Bhagirathi Mohapatra</h4>
                      <p className="text-xs text-amber-300 font-semibold">Managing Director &bull; Newutkal Finance Ltd.</p>
                      <p className="text-[11px] text-slate-400 font-mono">Mobile: +91 9776175240</p>
                    </div>
                  </div>

                  {/* Official Card Preview Thumbnail */}
                  <div className="pt-2">
                    <div className="rounded-xl overflow-hidden border border-white/15 p-1 bg-white/5">
                      <img
                        src="/managing-director-card.jpg"
                        alt="Bhagirathi Mohapatra - Managing Director"
                        className="w-full h-auto rounded-lg object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: "RELATED BLOGS & FINANCIAL LITERACY" (Utkarsh Blogs Section)    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-finance-600 bg-finance-50 px-3 py-1 rounded-full border border-finance-100">
                Customer Education &amp; Knowledge
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                Related <span className="text-finance-600">Financial Insights</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigate('about')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-finance-600 text-slate-800 hover:text-finance-600 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>View All Articles</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialBlogs.map((b, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                    <span>{b.date}</span>
                    <span>{b.readTime}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm hover:text-finance-600 transition-colors line-clamp-2">
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('about')}
                    className="text-xs font-bold text-finance-600 hover:text-finance-800 flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: INQUIRY FORM & CONNECT WITH SPECIALISTS                         */}
      {/* ========================================================================= */}
      <section id="contact" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-wider font-extrabold text-finance-600 bg-finance-50 px-3 py-1 rounded-full border border-finance-100">
                Help &amp; Support
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Connect With Our Financial Specialists
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Have questions regarding loan eligibility, fixed deposit interest rates, or opening a new associate member account? Our dedicated advisory desk is here to assist.
              </p>

              <div className="space-y-4 pt-2 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-finance-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Principal Headquarters</h5>
                    <p className="text-slate-600 mt-0.5">Plot no-N/5-172, Nayapalli, IRC village, Bhubaneswar-751015, Odisha</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <PhoneCall className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Toll Free &amp; Helpline</h5>
                    <p className="text-slate-600 mt-0.5 font-mono">1800 123 9878 &bull; +91 9776175240</p>
                    <span className="text-[10px] text-slate-500">Monday - Saturday (9:30 AM to 6:30 PM)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Official Email</h5>
                    <p className="text-slate-600 mt-0.5">bhagirathimohapatra79@gmail.com</p>
                    <p className="text-[11px] text-finance-600 font-mono">www.newutkalfinance.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Send a Service Inquiry</h3>
                <p className="text-xs text-slate-500 mb-6">Our advisory desk will get back to you within 2 business hours.</p>

                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
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
                      <label className="block font-bold text-slate-700 mb-1">Contact Number * (10 Digits)</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          inputMode="numeric"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          placeholder="10-digit mobile (e.g. 9861054321)"
                          className="w-full px-4 pr-12 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-finance-600"
                        />
                        <span className={`absolute right-3 top-3 text-[10px] font-mono font-bold ${contactForm.phone?.length === 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {contactForm.phone?.length || 0}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="e.g. name@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-finance-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Select Service</label>
                      <select
                        value={contactForm.service}
                        onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-finance-600"
                      >
                        <option value="Home Loan">Home Loan &amp; Griha Sudhar</option>
                        <option value="MSME Business Loan">MSME Business Loan</option>
                        <option value="Gold Loan">Gold Loan</option>
                        <option value="Fixed Deposit">Fixed Deposit (FD)</option>
                        <option value="Savings Account">Zero Balance Savings Account</option>
                        <option value="Personal Loan">Personal Loan &amp; Advances</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Inquiry Details</label>
                    <textarea
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Share details regarding loan amount, deposit tenure, or specific queries..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-finance-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-finance-900 to-finance-800 hover:from-finance-800 hover:to-finance-700 text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Submitting Inquiry...</span>
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

      {/* Global Bank Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
