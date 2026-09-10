import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Award,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Lock,
  FileText,
  Users,
  Calendar,
  Percent,
  Layers,
  Sparkles,
  QrCode,
  Stamp,
  Download,
  Eye,
  ExternalLink,
  FileCheck,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import Logo from '../common/Logo';
import { formatINR } from '../../utils/formatters';

const officialDocuments = [
  {
    id: 'epan',
    title: 'Govt. of India e-PAN Card',
    category: 'Taxation & Statutory Entity Identity',
    authority: 'Income Tax Department, Government of India',
    regNumber: 'AALCN9756G',
    date: '11/08/2026',
    summary: 'Statutory Permanent Account Number card issued electronically under Section 139A of Income Tax Act with verified digital seal and encrypted QR code.',
    pdfUrl: '/documents/govt_income_tax_epan_card.jpg',
    downloadName: 'Newutkal_Finance_Govt_ePAN_Card.jpg',
    badge: 'Statutory Identity',
    badgeColor: 'emerald',
    pages: ['/documents/govt_income_tax_epan_card.jpg'],
    pageCount: 1,
    isImage: true,
  },
  {
    id: 'name-approval',
    title: 'SPICe+ Part A: MCA Name Reservation & Approval',
    category: 'Corporate Incorporation Sanction',
    authority: 'Ministry of Corporate Affairs (MCA), Govt. of India',
    regNumber: 'SRN: AC4997381',
    date: '30/07/2026',
    summary: 'Official sanction issued by Central Registration Centre reserving the corporate title "NEWUTKAL FINANCE LIMITED" as a Public Company Limited by Shares.',
    pdfUrl: '/documents/govt_mca_name_approval.pdf',
    downloadName: 'Newutkal_Finance_MCA_Name_Approval.pdf',
    badge: 'MCA Approved',
    badgeColor: 'blue',
    pages: [
      '/documents/pages/media_1788847359349_page_1.png',
      '/documents/pages/media_1788847359349_page_2.png',
    ],
    pageCount: 2,
    isImage: false,
  },
  {
    id: 'moa',
    title: 'Form INC-33: e-Memorandum of Association (e-MOA)',
    category: 'Core Statutory Objects Charter',
    authority: 'Registrar of Companies / Companies Act, 2013',
    regNumber: 'SRN: 1-26921343422_SRN_FORM_1786082996896',
    date: 'August 2026',
    summary: 'Official 6-page corporate constitution pursuant to Schedule I (Sections 4 & 5) certifying financial lending powers, micro-credit, deposit mobilization, technology platforms, subscriber capital, and witness DSC.',
    pdfUrl: '/documents/official_e_moa_inc_33.pdf',
    downloadName: 'Newutkal_Finance_Official_eMOA_INC33.pdf',
    badge: '6-Page Legal Charter',
    badgeColor: 'amber',
    pages: [
      '/documents/pages/media_1788847359541_page_1.png',
      '/documents/pages/media_1788847359541_page_2.png',
      '/documents/pages/media_1788847359541_page_3.png',
      '/documents/pages/media_1788847359541_page_4.png',
      '/documents/pages/media_1788847359541_page_5.png',
      '/documents/pages/media_1788847359541_page_6.png',
    ],
    pageCount: 6,
    isImage: false,
  },
  {
    id: 'aoa',
    title: 'Form INC-34: e-Articles of Association (e-AOA)',
    category: 'Statutory Governance Regulations',
    authority: 'Ministry of Corporate Affairs, Govt. of India',
    regNumber: 'Pursuant to Companies Act, 2013',
    date: 'August 2026',
    summary: 'Comprehensive 42-page statutory internal governance rules governing share capital distribution, board caucuses, executive powers of directors, internal audits, and regulatory reserve ratios.',
    pdfUrl: '/documents/official_e_aoa_inc_34.pdf',
    downloadName: 'Newutkal_Finance_Official_eAOA_INC34.pdf',
    badge: '42-Page Complete AOA',
    badgeColor: 'purple',
    pages: [
      '/documents/pages/media_1788847360480_page_1.png',
      '/documents/pages/media_1788847360480_page_10.png',
    ],
    pageCount: 42,
    isImage: false,
  },
];

const OfficialBrochure = ({ className = '' }) => {
  const [activeDocModal, setActiveDocModal] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const openDocModal = (doc, initialPage = 0) => {
    setActiveDocModal(doc);
    setCurrentPageIndex(initialPage);
  };

  const closeDocModal = () => {
    setActiveDocModal(null);
    setCurrentPageIndex(0);
  };

  return (
    <div className={`bg-white text-slate-900 shadow-2xl rounded-3xl border border-slate-200 overflow-hidden max-w-5xl mx-auto print:shadow-none print:border-none print:rounded-none print:max-w-none ${className}`}>
      
      {/* ========================================================= */}
      {/* 1. BROCHURE COVER & INSTITUTIONAL HEADER */}
      {/* ========================================================= */}
      <div className="relative bg-gradient-to-br from-slate-950 via-finance-950 to-finance-900 text-white p-8 sm:p-12 overflow-hidden print:bg-white print:text-slate-900 print:p-6 print:border-b-4 print:border-finance-900">
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none print:hidden"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-finance-600/10 rounded-full filter blur-3xl pointer-events-none print:hidden"></div>

        {/* Top Header Row */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/10 print:border-slate-300">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner print:border-slate-300 print:bg-transparent">
              <Logo variant="light" size="lg" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 print:bg-slate-100 print:text-emerald-800 print:border-emerald-300">
                <ShieldCheck className="w-3 h-3" /> Certified by Govt. of India
              </span>
              <p className="text-xs text-slate-300 mt-1 font-mono print:text-slate-600">
                CIN: <strong className="text-white print:text-slate-900">U64199OD2026PLC054968</strong> &bull; PAN: <strong className="text-amber-300 print:text-slate-900">AALCN9756G</strong>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-300 print:text-slate-700">
            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block print:text-amber-700">
              Institutional Corporate Prospectus
            </span>
            <strong className="text-sm text-white print:text-slate-900 block font-black">
              Official Handover &amp; Statutory Dossier
            </strong>
            <span className="text-[11px] text-slate-400 print:text-slate-500">
              Bhubaneswar, Odisha &bull; Certified Regulatory Copy
            </span>
          </div>
        </div>

        {/* Hero Title & Mission */}
        <div className="relative z-10 pt-8 sm:pt-10 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight print:text-3xl print:text-slate-900">
            Pioneering Financial Security, Credit Mobility &amp; Wealth Creation in Odisha
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed font-normal print:text-slate-700">
            Newutkal Finance Limited is established as a statutory non-banking financial institution dedicated to sustainable retail credit, secured capital growth, transparent statutory deposits, and doorstep banking with institutional-grade governance.
          </p>
        </div>

        {/* Executive Metrics Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10 print:border-slate-300 print:text-slate-900">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 print:border-slate-200 print:bg-slate-50">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block print:text-slate-600">
              Statutory Status
            </span>
            <strong className="text-sm sm:text-base font-bold text-white print:text-slate-900">
              Govt. Registered
            </strong>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 print:border-slate-200 print:bg-slate-50">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block print:text-slate-600">
              Permanent Account No.
            </span>
            <strong className="text-sm sm:text-base font-bold text-amber-300 print:text-amber-800 font-mono">
              AALCN9756G
            </strong>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 print:border-slate-200 print:bg-slate-50">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block print:text-slate-600">
              SLR Liquidity
            </span>
            <strong className="text-sm sm:text-base font-bold text-emerald-400 print:text-emerald-700">
              100% Compliant
            </strong>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 print:border-slate-200 print:bg-slate-50">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block print:text-slate-600">
              Statutory Annexures
            </span>
            <strong className="text-sm sm:text-base font-bold text-white print:text-slate-900">
              4 Certified Copies
            </strong>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. ZERO-BALANCE PRODUCTION HANDOVER AUDIT CERTIFICATE */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-10 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-white border-b border-slate-200 print:p-6 print:border-b">
        <div className="border-2 border-dashed border-emerald-500/40 rounded-2xl p-6 sm:p-8 bg-white shadow-sm print:shadow-none">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Verified Clean Ledger
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  Customer Handover Audit Certificate
                </h3>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 block">Baseline Clearance Date</span>
              <strong className="text-sm text-slate-900 font-mono">
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </strong>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
            This certifies that <strong>Newutkal Finance Limited</strong> has established an unencumbered, pristine zero-balance operational state across all institutional ledgers. The portal, branch database, and lending management engines are calibrated to ₹0.00 with zero historical liabilities or non-performing assets, guaranteeing complete audit readiness for customer handover.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Active Members</span>
              <strong className="text-xl sm:text-2xl font-black text-slate-900">0</strong>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Ready for Onboarding</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Disbursed Loans</span>
              <strong className="text-xl sm:text-2xl font-black text-slate-900">{formatINR(0)}</strong>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Zero Debt Exposure</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Public Deposits</span>
              <strong className="text-xl sm:text-2xl font-black text-slate-900">{formatINR(0)}</strong>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Zero Liabilities</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">NPA &amp; Overdues</span>
              <strong className="text-xl sm:text-2xl font-black text-emerald-600">0.00%</strong>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Pristine Health</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CORE FINANCIAL PRODUCTS CATALOG */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-10 space-y-10 print:p-6 print:space-y-6">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-finance-600 block">
            Product Portfolio &amp; Interest Framework
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Empowering Financial Independence Through Tailored Solutions
          </h2>
          <div className="w-16 h-1 bg-finance-600 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Grid of Credit & Loan Solutions */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <CreditCard className="w-5 h-5 text-finance-600" />
            <h3 className="text-lg font-bold text-slate-900">1. Retail &amp; Commercial Credit Solutions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-finance-500 transition-colors">
              <span className="text-[11px] font-bold text-finance-700 bg-finance-100 px-2.5 py-0.5 rounded-full">
                Secured Property
              </span>
              <h4 className="text-base font-bold text-slate-900">Home Construction &amp; Extension Loan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Long-term capital for residential home construction, plot purchase, and home improvement across Odisha.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
                <span className="text-slate-500">Interest: <strong>8.50% - 9.50% p.a.</strong></span>
                <span className="text-slate-500">Tenure: <strong>Up to 240 Mo</strong></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-finance-500 transition-colors">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                MSME Expansion
              </span>
              <h4 className="text-base font-bold text-slate-900">Business &amp; Trade Commercial Loan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Working capital financing, machinery acquisition, and inventory enhancement for verified local traders.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
                <span className="text-slate-500">Interest: <strong>10.0% - 12.0% p.a.</strong></span>
                <span className="text-slate-500">Tenure: <strong>Up to 84 Mo</strong></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-finance-500 transition-colors">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Instant Collateral
              </span>
              <h4 className="text-base font-bold text-slate-900">Gold &amp; Precious Metal Loan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Same-day disbursal backed by physical hallmark bullion assessment with secure high-security branch vaulting.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
                <span className="text-slate-500">Interest: <strong>8.00% - 9.00% p.a.</strong></span>
                <span className="text-slate-500">Tenure: <strong>Up to 24 Mo</strong></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-finance-500 transition-colors">
              <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                Vehicle Mobility
              </span>
              <h4 className="text-base font-bold text-slate-900">Commercial &amp; Two-Wheeler Finance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Affordable vehicle loans for commercial utility operators, farmers, and family transport mobility.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
                <span className="text-slate-500">Interest: <strong>9.00% - 10.5% p.a.</strong></span>
                <span className="text-slate-500">Tenure: <strong>Up to 60 Mo</strong></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-finance-500 transition-colors">
              <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                Personal Credit
              </span>
              <h4 className="text-base font-bold text-slate-900">Personal &amp; Emergency Credit Facility</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Emergency financial liquidity for medical expenses, higher education, marriage, and family events.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
                <span className="text-slate-500">Interest: <strong>11.5% - 13.5% p.a.</strong></span>
                <span className="text-slate-500">Tenure: <strong>Up to 48 Mo</strong></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-finance-500 transition-colors">
              <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                Agri Infrastructure
              </span>
              <h4 className="text-base font-bold text-slate-900">Agricultural &amp; Kisan Equipment Loan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Subsidized credit lines for irrigation equipment, cold-storage, seeds, and seasonal crop investments.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
                <span className="text-slate-500">Interest: <strong>7.50% - 8.50% p.a.</strong></span>
                <span className="text-slate-500">Tenure: <strong>Up to 60 Mo</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings & Term Deposits Matrix */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">2. Member Deposit &amp; Capital Accumulation Schemes</h3>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3.5">Scheme Title</th>
                  <th className="p-3.5">Min. Deposit</th>
                  <th className="p-3.5">Tenure</th>
                  <th className="p-3.5">Annual Return (ROI)</th>
                  <th className="p-3.5">Special Benefits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-bold text-slate-900">High-Yield Fixed Deposit (FD)</td>
                  <td className="p-3.5">₹5,000</td>
                  <td className="p-3.5">12 to 60 Months</td>
                  <td className="p-3.5 font-bold text-emerald-700">7.25% - 9.00%</td>
                  <td className="p-3.5 text-slate-600">+0.50% p.a. extra for Senior Citizens</td>
                </tr>
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-bold text-slate-900">Monthly Recurring Deposit (RD)</td>
                  <td className="p-3.5">₹500 / month</td>
                  <td className="p-3.5">12 to 36 Months</td>
                  <td className="p-3.5 font-bold text-emerald-700">6.75% - 8.00%</td>
                  <td className="p-3.5 text-slate-600">Auto-debit through NACH / UPI mandate</td>
                </tr>
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-bold text-slate-900">Daily Micro-Savings (Pigmy)</td>
                  <td className="p-3.5">₹50 / day</td>
                  <td className="p-3.5">6 to 24 Months</td>
                  <td className="p-3.5 font-bold text-emerald-700">5.50% - 6.50%</td>
                  <td className="p-3.5 text-slate-600">Doorstep Collection by Verified Associates</td>
                </tr>
                <tr className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-bold text-slate-900">Special Growth Bonds</td>
                  <td className="p-3.5">₹25,000</td>
                  <td className="p-3.5">100 Months</td>
                  <td className="p-3.5 font-bold text-emerald-700">8.50% Guaranteed</td>
                  <td className="p-3.5 text-slate-600">Double Capital Return on Maturity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. DIGITAL STATUTORY MEMBERSHIP PROCESS */}
        {/* ========================================================= */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">3. Statutory Membership &amp; KYC Workflow</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-finance-900 text-white font-bold flex items-center justify-center text-xs">1</div>
              <h5 className="font-bold text-slate-900 text-xs">Application Submission</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Applicant submits legal biodata, occupation, address, nominee, and witness details via portal or 2-page branch form.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-finance-900 text-white font-bold flex items-center justify-center text-xs">2</div>
              <h5 className="font-bold text-slate-900 text-xs">₹200 Statutory Fee</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Mandatory entry fee &amp; minimum 10 equity shares allocation under Section 45-IA statutory framework.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-finance-900 text-white font-bold flex items-center justify-center text-xs">3</div>
              <h5 className="font-bold text-slate-900 text-xs">Identity &amp; KYC Audit</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Verification of Aadhaar, PAN card, educational credential, proof of birth, and biometric / signature capture.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">4</div>
              <h5 className="font-bold text-slate-900 text-xs">Activation &amp; Passbook</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Managing Director / Admin clearance unlocks official Member ID, digital portal access, and loan eligibility.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. STATUTORY REGULATORY DOCUMENTS & GOVT CERTIFICATES */}
        {/* ========================================================= */}
        <div id="statutory-annexures" className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">4. Statutory Regulatory Documents &amp; Legal Copies</h3>
                <p className="text-xs text-slate-500">
                  Certified government approvals, incorporation filings, constitutional charters, and taxation credentials.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
              Govt. Verified Annexures
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {officialDocuments.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-finance-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge & Reg Number */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {doc.category}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-0.5 group-hover:text-finance-700 transition-colors">
                        {doc.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 whitespace-nowrap flex-shrink-0">
                      {doc.badge}
                    </span>
                  </div>

                  {/* Summary & Metadata */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {doc.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 text-[11px] space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Authority:</span>
                      <span className="text-slate-900 font-semibold">{doc.authority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Statutory Ref:</span>
                      <span className="text-emerald-700 font-bold font-mono">{doc.regNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Pages / Date:</span>
                      <span className="text-slate-700 font-medium">{doc.pageCount} {doc.pageCount === 1 ? 'Page' : 'Pages'} &bull; {doc.date}</span>
                    </div>
                  </div>

                  {/* Visual Document Scan Preview Thumbnail */}
                  <div
                    onClick={() => openDocModal(doc, 0)}
                    className="relative cursor-pointer rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[16/9] mb-4 group/preview flex items-center justify-center"
                    title="Click to expand full document"
                  >
                    <img
                      src={doc.pages[0]}
                      alt={doc.title}
                      className="w-full h-full object-contain filter group-hover/preview:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                      <span className="text-xs font-semibold flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" /> Click to Inspect Full Document
                      </span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                        {doc.pageCount} {doc.pageCount === 1 ? 'Page' : 'Pages'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => openDocModal(doc, 0)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-finance-50 text-slate-700 hover:text-finance-700 text-xs font-bold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500 group-hover:text-finance-700" />
                    <span>Inspect Document</span>
                  </button>

                  <a
                    href={doc.pdfUrl}
                    download={doc.downloadName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-finance-600 hover:bg-finance-700 text-white text-xs font-bold transition-all shadow-xs"
                    title="Download original file"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. REGIONAL BRANCH NETWORK & LEADERSHIP */}
        {/* ========================================================= */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-slate-900">5. Regional Branch Hubs Network (Odisha)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-finance-700 block">Headquarters &bull; Code: 075101</span>
              <strong className="text-slate-900 block text-sm">Bhubaneswar HQ</strong>
              <p className="text-slate-600">Plot 142, VIP Area, Saheed Nagar, Bhubaneswar, Khurda</p>
              <p className="text-slate-500 pt-1 font-mono">Manager: Bhagirathi Mohapatra &bull; 0674-2548900</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-finance-700 block">Branch &bull; Code: 075302</span>
              <strong className="text-slate-900 block text-sm">Cuttack Main Branch</strong>
              <p className="text-slate-600">Buxi Bazar, Near High Court, Cuttack - 753001</p>
              <p className="text-slate-500 pt-1 font-mono">Manager: Minati Mishra &bull; 0671-2415600</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-finance-700 block">Branch &bull; Code: 076903</span>
              <strong className="text-slate-900 block text-sm">Rourkela Commercial Hub</strong>
              <p className="text-slate-600">Civil Township, Sector 4, Rourkela, Sundargarh - 769004</p>
              <p className="text-slate-500 pt-1 font-mono">Manager: P. K. Mohanty &bull; 0661-2501200</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-finance-700 block">Branch &bull; Code: 076104</span>
              <strong className="text-slate-900 block text-sm">Berhampur Branch</strong>
              <p className="text-slate-600">Old Bus Stand Road, Berhampur, Ganjam - 760001</p>
              <p className="text-slate-500 pt-1 font-mono">Manager: A. K. Sahu &bull; 0680-2223400</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-finance-700 block">Branch &bull; Code: 075205</span>
              <strong className="text-slate-900 block text-sm">Puri Grand Road Branch</strong>
              <p className="text-slate-600">Grand Road, Near Jagannath Temple, Puri - 752001</p>
              <p className="text-slate-500 pt-1 font-mono">Manager: R. K. Tripathy &bull; 06752-224500</p>
            </div>

            <div className="p-4 rounded-2xl bg-finance-900 text-white space-y-1 flex flex-col justify-center">
              <strong className="text-sm font-bold block">Need Assistance or Franchise?</strong>
              <p className="text-slate-300 text-[11px]">Connect directly with executive administration for institutional banking.</p>
              <span className="text-emerald-400 font-bold font-mono text-xs block pt-1">+91 9776175240</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 7. OFFICIAL EXECUTIVE SIGN-OFF & CORPORATE SEAL */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-10 bg-slate-50 border-t border-slate-200 print:bg-white print:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Managing Director Signature Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 print:border-slate-300">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Authorized Executive Signatory
            </span>
            <div className="font-serif italic text-lg text-slate-900 border-b border-slate-300 pb-1">
              Bhagirathi Mohapatra
            </div>
            <div>
              <strong className="text-xs text-slate-900 block font-bold">Bhagirathi Mohapatra</strong>
              <span className="text-[11px] text-slate-500">Managing Director &bull; DIN / Board Member</span>
            </div>
          </div>

          {/* Corporate Seal */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 print:border-slate-300">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-finance-600 flex items-center justify-center text-finance-700 bg-finance-50">
              <Stamp className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-finance-900 pt-1">
              Official Corporate Seal
            </span>
            <span className="text-[10px] text-slate-500">Newutkal Finance Limited &bull; Bhubaneswar</span>
          </div>

          {/* Contact Coordinates */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs print:border-slate-300">
            <strong className="text-xs font-bold text-slate-900 block">Registered Corporate Office</strong>
            <p className="text-slate-600 text-[11px]">
              Plot no-N/5-172, Nayapalli, IRC village, Bhubaneswar-751015, Odisha
            </p>
            <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
              <div>Phone: <strong>+91 9776175240</strong></div>
              <div>Email: <strong>bhagirathimohapatra79@gmail.com</strong></div>
              <div>Portal: <strong>www.newutkalfinance.com</strong></div>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-[11px] text-slate-400 print:text-slate-500">
          &copy; {new Date().getFullYear()} Newutkal Finance Limited. CIN: U64199OD2026PLC054968 &bull; PAN: AALCN9756G. Certified by Govt. of India.
        </div>
      </div>

      {/* ========================================================= */}
      {/* 8. INTERACTIVE DOCUMENT LIGHTBOX / MODAL */}
      {/* ========================================================= */}
      {activeDocModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 no-print animate-in fade-in duration-200"
          onClick={closeDocModal}
        >
          <div
            className="bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block truncate">
                    {activeDocModal.category} &bull; {activeDocModal.regNumber}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {activeDocModal.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={activeDocModal.pdfUrl}
                  download={activeDocModal.downloadName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-finance-600 hover:bg-finance-500 text-white text-xs font-bold transition-all shadow-sm"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  onClick={closeDocModal}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Close viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Image Viewer Area */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950/90 flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative max-w-full max-h-[65vh] flex items-center justify-center">
                <img
                  src={activeDocModal.pages[currentPageIndex] || activeDocModal.pages[0]}
                  alt={`${activeDocModal.title} Page ${currentPageIndex + 1}`}
                  className="max-w-full max-h-[65vh] object-contain rounded-xl border border-slate-800 shadow-2xl bg-white"
                />
              </div>

              {/* Multi-page controls */}
              {activeDocModal.pages.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-800/80 w-full max-w-md">
                  <button
                    disabled={currentPageIndex === 0}
                    onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <span className="text-xs text-slate-400 font-mono">
                    Page <strong className="text-white">{currentPageIndex + 1}</strong> of <strong className="text-white">{activeDocModal.pages.length}</strong>
                  </span>

                  <button
                    disabled={currentPageIndex === activeDocModal.pages.length - 1}
                    onClick={() => setCurrentPageIndex((prev) => Math.min(activeDocModal.pages.length - 1, prev + 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer Description */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="truncate">
                {activeDocModal.summary}
              </span>
              <span className="text-slate-500 font-mono text-[11px] flex-shrink-0">
                Authority: {activeDocModal.authority}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OfficialBrochure;
