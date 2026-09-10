import React, { useState } from 'react';
import { HelpCircle, MessageSquare, PhoneCall, Mail, ChevronDown, ChevronUp, Send, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const MemberSupport = () => {
  const { addToast } = useFinance();
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Loan Query');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      q: 'How do I pay my monthly loan EMI?',
      a: 'You can repay your EMI directly from your Available Balance by clicking "Pay EMI" in the Loans section, or set up an e-NACH auto-debit mandate via UPI or NetBanking.'
    },
    {
      q: 'When is interest credited on my Fixed Deposit?',
      a: 'Cumulative Fixed Deposits compound interest quarterly and credit the total payout at maturity. Monthly interest payout deposits credit interest on the 1st of every calendar month.'
    },
    {
      q: 'How can I update my nominee or address details?',
      a: 'Go to "My Profile" in the member sidebar and click "Edit Profile". You can modify your address, phone number, and registered nominee details with instant digital verification.'
    },
    {
      q: 'Are deposits with Utkal Finance insured and regulated?',
      a: 'Yes, Utkal Finance is a Category-A Non-Banking Financial Company regulated by the Reserve Bank of India (RBI). All capital operations follow strict statutory liquidity ratio (SLR) norms.'
    }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Support ticket #TKT-8924 raised! An executive will respond within 4 hours.', 'success');
      setTicketSubject('');
      setTicketMessage('');
    }, 600);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Help &amp; Member Support
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Find answers to common financial queries, connect with our branch advisors, or submit a support ticket
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-finance-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Direct Channels */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-finance-50 text-finance-600 flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Official Helpline</span>
                <span className="text-sm font-bold text-slate-900">+91 9776175240</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Support Desk</span>
                <span className="text-xs font-bold text-slate-900 break-all">bhagirathimohapatra79@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Raise Ticket Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
            <h3 className="text-base font-bold text-slate-900 mb-1">Raise a Support Ticket</h3>
            <p className="text-xs text-slate-500 mb-4">Our specialized team will assist you shortly.</p>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
                >
                  <option value="Loan Query">Loan Disbursal &amp; Repayment</option>
                  <option value="Deposit Query">Fixed &amp; Recurring Deposit</option>
                  <option value="Transaction Issue">Payment / NEFT Transfer Issue</option>
                  <option value="KYC Update">KYC &amp; Profile Verification</option>
                  <option value="Other">General Account Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief summary of your query"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Explain your question or problem in detail..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-finance-600 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting Ticket...' : 'Submit Support Request'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberSupport;
