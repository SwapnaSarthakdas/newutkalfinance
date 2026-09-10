import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, ChevronRight, Lock } from 'lucide-react';
import Logo from './Logo';
import Modal from './Modal';

const Footer = ({ onNavigate }) => {
  const [legalModal, setLegalModal] = useState(null); // 'terms' | 'privacy' | null

  return (
    <footer className="bg-finance-950 text-slate-300 border-t border-slate-800 relative overflow-hidden">
      {/* Blurred banner watermark in footer background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] overflow-hidden z-0">
        <img src="/banner.jpg" alt="" className="w-full h-full object-cover filter blur-xl scale-110" />
      </div>

      {/* Top Banner */}
      <div className="border-b border-finance-850 py-8 bg-finance-900/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Your Financial Security is Our Priority</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Certified by Govt. of India &bull; Bank-grade 256-bit encryption &bull; 100% Insured & Regulated
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-sm text-center"
            >
              Open Member Account
            </button>
            <button
              onClick={() => onNavigate('brochure')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-xs tracking-wide uppercase transition-all text-center cursor-pointer"
            >
              Corporate Brochure
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              New Utkal Finance Limited is a premier certified financial institution delivering transparent, secure, and technologically advanced savings, loans, and investment solutions.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Government Certified Reg. No: <strong className="text-white">U64199OD2026PLC054968</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Category: <strong>NBFC &bull; Financial Services</strong></span>
              </div>
            </div>
            <div className="pt-2">
              <img
                src="/banner.jpg"
                alt="New Utkal Finance Limited Official Banner"
                className="h-10 w-auto rounded border border-finance-700/60 object-contain shadow-sm"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Quick Links</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> About Utkal Finance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Financial Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('why-us')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Why Choose Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Financial Calculators
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('brochure')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" /> Official Corporate Brochure
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blank-form')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Blank Membership Form
                </button>
              </li>
            </ul>
          </div>

          {/* Financial Services */}
          <div>
            <h5 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Our Services</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Personal & Gold Loans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> SME & Commercial Loans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> High-Yield Fixed Deposits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Recurring Deposits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> Financial Advisory
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate Contact */}
          <div>
            <h5 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Corporate Office</h5>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 9776175240</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>bhagirathimohapatra79@gmail.com</span>
              </li>
              <li className="pt-1">
                <span className="text-[11px] text-amber-300 font-semibold block">
                  Bhagirathi Mohapatra &bull; Managing Director
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Web: www.newutkalfinance.com
                </span>
              </li>
              <li className="pt-1">
                <span className="inline-flex items-center gap-1 text-slate-400 text-[11px] bg-slate-900 border border-slate-800 px-2 py-1 rounded">
                  <Lock className="w-3 h-3 text-emerald-400" /> Govt. Reg: U64199OD2026PLC054968
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="bg-black/40 border-t border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Newutkal Finance Limited. All Rights Reserved. Certified by Govt. of India (Reg. No.: U64199OD2026PLC054968).
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-slate-300 transition-colors"
            >
              Grievance Officer
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      <Modal
        isOpen={!!legalModal}
        onClose={() => setLegalModal(null)}
        title={legalModal === 'terms' ? 'Terms & Conditions - Utkal Finance' : 'Privacy & Security Policy'}
        subtitle="Last updated: January 2026 &bull; Utkal Finance Limited"
      >
        <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
          {legalModal === 'terms' ? (
            <>
              <p>
                <strong>1. Acceptance of Terms:</strong> By opening an account, accessing the Utkal Finance member portal, or applying for credit facilities, you agree to abide by all RBI NBFC guidelines, Fair Practices Code, and standard lending agreements.
              </p>
              <p>
                <strong>2. Credit &amp; Verification:</strong> Utkal Finance reserves the right to evaluate financial background, verify KYC documents with UIDAI/CIBIL/Equifax, and report repayment behavior to credit bureaus.
              </p>
              <p>
                <strong>3. Interest &amp; Repayment:</strong> Interest calculations on loans and deposits follow standardized annual percentage rates (APR) without hidden penalties or prepayment surcharges for individual borrowers.
              </p>
              <p>
                <strong>4. Dispute Resolution:</strong> Any disputes are subject to the exclusive jurisdiction of the competent courts in Bhubaneswar, Odisha.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Data Protection:</strong> Utkal Finance adheres strictly to the Digital Personal Data Protection Act (DPDPA 2023) and RBI Cyber Security Guidelines.
              </p>
              <p>
                <strong>2. Encrypted Transactions:</strong> All financial messages, credentials, and KYC documents are encrypted using SHA-256 and AES-256 standards in transit and at rest.
              </p>
              <p>
                <strong>3. No Third-Party Reselling:</strong> Your personal, financial, and credit data will never be sold or leased to third-party telemarketers.
              </p>
            </>
          )}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setLegalModal(null)}
              className="px-5 py-2 rounded-xl bg-finance-900 text-white font-semibold text-xs"
            >
              Close &amp; Understand
            </button>
          </div>
        </div>
      </Modal>
    </footer>
  );
};

export default Footer;
