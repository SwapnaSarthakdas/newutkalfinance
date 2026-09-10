import React, { useState } from 'react';
import {
  Printer,
  ArrowLeft,
  Share2,
  FileDown,
  ShieldCheck,
  Check,
  ExternalLink,
  Building2,
  Phone,
  Mail,
  Sparkles,
  Download,
  FileText,
  Eye
} from 'lucide-react';
import OfficialBrochure from '../../components/brochure/OfficialBrochure';
import Logo from '../../components/common/Logo';
import { useFinance } from '../../context/FinanceContext';

const statutoryDocs = [
  {
    name: 'Govt. e-PAN Card',
    filename: 'govt_income_tax_epan_card.jpg',
    url: '/documents/govt_income_tax_epan_card.jpg',
    type: 'JPG • Identity',
    tag: 'AALCN9756G',
  },
  {
    name: 'MCA Name Reservation',
    filename: 'govt_mca_name_approval.pdf',
    url: '/documents/govt_mca_name_approval.pdf',
    type: 'PDF • Approval',
    tag: 'SRN: AC4997381',
  },
  {
    name: 'Form INC-33 e-MOA',
    filename: 'official_e_moa_inc_33.pdf',
    url: '/documents/official_e_moa_inc_33.pdf',
    type: 'PDF • 6 Pages',
    tag: 'Section 4 & 5',
  },
  {
    name: 'Form INC-34 e-AOA',
    filename: 'official_e_aoa_inc_34.pdf',
    url: '/documents/official_e_aoa_inc_34.pdf',
    type: 'PDF • 42 Pages',
    tag: 'Govt. Regulations',
  },
];

const BrochurePage = ({ onNavigate }) => {
  const { addToast } = useFinance();
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      addToast('Brochure URL copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const scrollToAnnexures = () => {
    const el = document.getElementById('statutory-annexures');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col print:bg-white print:p-0">
      
      {/* Sticky Action Toolbar (Hidden during Print) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
            title="Return to home page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            title="Return to Admin Panel"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Command</span>
          </button>

          <button
            onClick={scrollToAnnexures}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Statutory Copies</span>
          </button>
        </div>

        {/* Center Title Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-900">Official Institutional Brochure</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 font-mono text-[11px]">Newutkal Finance Limited</span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            title="Copy brochure share link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-finance-600 hover:bg-finance-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-finance-600/20 transition-all hover:shadow-lg"
            title="Print brochure or save as PDF"
          >
            <Printer className="w-4 h-4 text-emerald-300" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Body */}
      <main className="flex-1 py-8 sm:py-12 px-2 sm:px-6 max-w-5xl mx-auto w-full print:p-0 print:m-0 print:max-w-none">
        
        {/* Helper Banner & Download Bar for Customer Handover (Hidden on print) */}
        <div className="mb-6 space-y-3 no-print">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-finance-950 via-finance-900 to-finance-850 text-white border border-finance-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight">Customer Handover Prospectus &amp; Statutory Dossier</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Includes full certified zero-balance baseline, product matrices, and authentic Government of India PDF copies.
                </p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-xs self-start sm:self-auto"
            >
              Export A4 PDF
            </button>
          </div>

          {/* Quick PDF Annexure Download Bar */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
              <FileDown className="w-4 h-4 text-finance-600" />
              <span>Official Regulatory PDF Downloads:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
              {statutoryDocs.map((doc) => (
                <a
                  key={doc.name}
                  href={doc.url}
                  download={doc.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-finance-50 hover:border-finance-300 border border-slate-200 text-slate-700 hover:text-finance-800 text-[11px] font-semibold transition-all group"
                  title={`Download ${doc.name}`}
                >
                  <span className="truncate">{doc.name}</span>
                  <Download className="w-3 h-3 text-slate-400 group-hover:text-finance-600 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* The Printable Official Brochure Component */}
        <OfficialBrochure />
      </main>

      {/* Footer (Hidden during Print) */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500 no-print">
        <p>Newutkal Finance Limited &bull; Certified Corporate Brochure &bull; CIN: U64199OD2026PLC054968 &bull; PAN: AALCN9756G</p>
      </footer>
    </div>
  );
};

export default BrochurePage;
