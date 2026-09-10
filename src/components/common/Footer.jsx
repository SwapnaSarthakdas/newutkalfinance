import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Phone,
  ChevronRight,
  Lock,
  MapPin,
  FileText,
  HelpCircle,
  Plus,
  Minus,
  ArrowUp,
  ExternalLink
} from 'lucide-react';
import Logo from './Logo';
import Modal from './Modal';

const Footer = ({ onNavigate }) => {
  const [legalModal, setLegalModal] = useState(null); // 'terms' | 'privacy' | null
  const [showImportantInfo, setShowImportantInfo] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111827] text-slate-300 border-t border-slate-800 relative overflow-hidden select-none">
      {/* Top Security & Assurance Banner */}
      <div className="border-b border-slate-800 py-6 bg-[#0f172a]/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base flex items-center gap-2">
                <span>Certified by Govt. of India</span>
                <span className="text-[11px] font-mono font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  U64199OD2026PLC054968
                </span>
              </h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Bank-grade 256-bit encryption &bull; 100% Insured &bull; Working on the lines of Nidhi Company (2013 &amp; 2014 Rules)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-auto">
            <button
              onClick={() => onNavigate && onNavigate('register')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-finance-600 to-finance-700 hover:from-finance-500 hover:to-finance-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Become a Member (₹200)
            </button>
            <button
              onClick={() => onNavigate && onNavigate('membership-form')}
              className="px-4 py-2.5 rounded-xl border border-blue-400/40 hover:bg-white/5 text-blue-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Statutory Form (PDF)</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('brochure')}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Corporate Brochure
            </button>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Directory (Utkarsh Bank Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 text-xs">
          {/* Column 1: Personal Banking */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-xs tracking-wider uppercase border-b border-finance-600 pb-1.5 inline-block">
              Personal Banking
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition-colors text-left">
                  Standard Savings Account
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition-colors text-left">
                  Premium Savings Account
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition-colors text-left">
                  BSBDA Zero Balance Account
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Fixed Deposits (up to 8.25%*)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Senior Citizen Special FD (8.50%)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Recurring Deposits (RD)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors text-left">
                  RuPay Debit Cards &amp; Offers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Loans & Credit */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-xs tracking-wider uppercase border-b border-finance-600 pb-1.5 inline-block">
              Loans &amp; Advances
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Home Loan &amp; Griha Sudhar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  MSME &amp; Business Loan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Gold Loan (Per Gram Rates)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Personal Emergency Loan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Loan Against Property (LAP)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors text-left">
                  Commercial Vehicle Financing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Small Enterprise Business Loans
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Ways to Bank & Payments */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-xs tracking-wider uppercase border-b border-finance-600 pb-1.5 inline-block">
              Ways to Bank
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('membership-form')} className="hover:text-white transition-colors text-left">
                  Online Membership Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-login')} className="hover:text-white transition-colors text-left">
                  Official Admin Console
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/919776175240"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-left"
                >
                  <span>WhatsApp Banking</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors text-left">
                  Branch &amp; Micro-ATM Network
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors text-left">
                  Bharat Connect Bill Pay
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors text-left">
                  Positive Pay Verification
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors text-left">
                  Auto NACH Debit Mandate
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Calculators & Tools */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-xs tracking-wider uppercase border-b border-finance-600 pb-1.5 inline-block">
              Calculators &amp; Tools
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Home Loan EMI Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Personal Loan Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Fixed Deposit (FD) Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Recurring Deposit (RD) Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors text-left">
                  Gold Loan Value Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors text-left">
                  Branch &amp; ATM Hub Locator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: About & Institutional */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h5 className="text-white font-bold text-xs tracking-wider uppercase border-b border-finance-600 pb-1.5 inline-block">
              About &amp; Governance
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors text-left">
                  About Utkal Finance Limited
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors text-left">
                  Board of Directors &amp; MD Desk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('brochure')} className="hover:text-white transition-colors text-left">
                  Corporate Profile &amp; Handover
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('membership-form')} className="hover:text-white transition-colors text-left">
                  Download Statutory Forms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors text-left">
                  Grievance Redressal Officer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors text-left font-semibold text-amber-400">
                  Admin Governance Portal
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Connect With Us Section (Utkarsh Bank Layout) */}
      <div className="border-t border-slate-800 bg-[#0B1120] py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* Address */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Registered &amp; Head Office:</strong>
                <p className="text-slate-400 leading-relaxed">
                  Utkal Tower, Plot no-N/5-172, Nayapalli, IRC village, Bhubaneswar-751015, Odisha
                </p>
              </div>
            </div>

            {/* Call Us */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Tele-Banking &amp; Helplines:</strong>
                <div className="text-slate-400 space-y-0.5">
                  <div>Toll Free: <a href="tel:18001239878" className="text-amber-300 font-bold font-mono">1800 123 9878</a></div>
                  <div>Member Helpdesk: <a href="tel:18002081788" className="text-slate-300 font-mono">1800 208 1788</a></div>
                  <div>Mobile Desk: <a href="tel:+919776175240" className="text-slate-300 font-mono">+91 9776175240</a></div>
                </div>
              </div>
            </div>

            {/* Email Us */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Official Communications:</strong>
                <div className="text-slate-400 space-y-0.5">
                  <p><a href="mailto:customercare@utkalfinance.com" className="hover:text-white">customercare@utkalfinance.com</a></p>
                  <p><a href="mailto:bhagirathimohapatra79@gmail.com" className="hover:text-white">bhagirathimohapatra79@gmail.com</a></p>
                  <p className="text-slate-500 text-[10px]">Mon-Sat (9:30 AM to 6:30 PM)</p>
                </div>
              </div>
            </div>

            {/* Grievance Redressal */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Customer Protection:</strong>
                <p className="text-slate-400 leading-relaxed">
                  Complaints, compensation policy &amp; RBI Integrated Ombudsman mechanism.
                </p>
                <button
                  onClick={() => onNavigate('contact')}
                  className="mt-1.5 text-finance-300 hover:text-white font-bold inline-flex items-center gap-1"
                >
                  <span>Lodge Complaint</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Information Toggle Accordion (Utkarsh Bank Style) */}
      <div className="border-t border-slate-800 bg-[#090D16] py-4 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowImportantInfo(!showImportantInfo)}
            className="w-full flex items-center justify-between text-slate-400 hover:text-white font-bold py-2 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-finance-400"></span>
              <span className="uppercase tracking-wider">Regulatory Disclosures &amp; Statutory Information</span>
            </span>
            <div className="flex items-center gap-1 text-[11px] text-finance-300">
              <span>{showImportantInfo ? 'Collapse Disclosures' : 'View All Disclosures'}</span>
              {showImportantInfo ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {showImportantInfo && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-[11px] text-slate-400 animate-in fade-in">
              <button onClick={() => setLegalModal('terms')} className="hover:text-white text-left">Disclaimer</button>
              <button onClick={() => onNavigate('about')} className="hover:text-white text-left">Fair Practices Code</button>
              <button onClick={() => onNavigate('membership-form')} className="hover:text-white text-left">Form Center (Statutory)</button>
              <button onClick={() => onNavigate('brochure')} className="hover:text-white text-left">GST Registration Numbers</button>
              <button onClick={() => onNavigate('calculator')} className="hover:text-white text-left">MCLR &amp; Base Rates</button>
              <button onClick={() => onNavigate('calculator')} className="hover:text-white text-left">Interest Calculation Method</button>
              <button onClick={() => onNavigate('calculator')} className="hover:text-white text-left">APR Calculator</button>
              <button onClick={() => onNavigate('about')} className="hover:text-white text-left">Annual Report &amp; Returns</button>
              <button onClick={() => onNavigate('about')} className="hover:text-white text-left">Basel Pillar III Disclosures</button>
              <button onClick={() => onNavigate('contact')} className="hover:text-white text-left">DICGC Deposit Insurance</button>
              <button onClick={() => onNavigate('contact')} className="hover:text-white text-left">RBI Integrated Ombudsman</button>
              <button onClick={() => onNavigate('about')} className="hover:text-white text-left">Cybersecurity Standards</button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Copyright, Browser Compliance & Social Links */}
      <div className="bg-black py-6 border-t border-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-center lg:text-left space-y-0.5">
            <p className="text-slate-400">
              &copy; {new Date().getFullYear()} New Utkal Finance Limited. All Rights Reserved. Reg. No.: U64199OD2026PLC054968.
            </p>
            <p className="text-[11px] text-slate-600">
              Site best viewed in modern browsers (Chrome 58+, Edge, Firefox 53+, Safari 10.1+).
            </p>
          </div>

          {/* Social Follow Links */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-semibold">Follow Us:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/919776175240"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                title="WhatsApp"
              >
                💬
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors font-bold"
                title="Facebook"
              >
                f
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-sky-600/20 text-sky-400 flex items-center justify-center hover:bg-sky-600 hover:text-white transition-colors font-bold"
                title="LinkedIn"
              >
                in
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors font-bold"
                title="YouTube"
              >
                ▶
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Smooth Scroll to Top Button (Utkarsh Bank Style) */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl bg-gradient-to-br from-[#4A2C7D] to-[#002C78] hover:from-[#371E60] hover:to-[#001E50] text-white shadow-2xl border border-white/20 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95"
        title="Back to Top"
      >
        <ArrowUp className="w-4 h-4" />
        <span className="text-[8.5px] font-black uppercase tracking-tighter">TOP</span>
      </button>

      {/* Legal Disclaimers Modal */}
      <Modal
        isOpen={!!legalModal}
        onClose={() => setLegalModal(null)}
        title={legalModal === 'terms' ? 'Statutory Terms & Disclosures - Utkal Finance' : 'Privacy & Security Policy'}
        subtitle="New Utkal Finance Limited &bull; Reg. No.: U64199OD2026PLC054968"
      >
        <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
          <p>
            <strong>1. Regulatory Framework:</strong> New Utkal Finance Limited is registered under the provisions of the Companies Act 2013 &amp; 2014 rules respectively, working on the lines of a Nidhi Company.
          </p>
          <p>
            <strong>2. Member Capital &amp; Associate Membership:</strong> Associate Membership fee of ₹ 200 entitles members to high-yield deposit accounts, affordable loans, and institutional participation.
          </p>
          <p>
            <strong>3. Security Standards:</strong> 256-bit encryption safeguards all financial records and transactions. Deposits are held in accordance with statutory guidelines.
          </p>
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setLegalModal(null)}
              className="px-5 py-2 rounded-xl bg-finance-900 text-white font-semibold text-xs"
            >
              Close Disclosures
            </button>
          </div>
        </div>
      </Modal>
    </footer>
  );
};

export default Footer;
