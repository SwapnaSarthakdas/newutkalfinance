import React, { useState } from 'react';
import { UserPlus, User, Mail, Phone, MapPin, Wallet, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import AddMemberModal from './AddMemberModal';

const AdminQuickAddBar = () => {
  const { addMember, addToast } = useFinance();

  const [isExpanded, setIsExpanded] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bhubaneswar');
  const [deposit, setDeposit] = useState('25000');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastCreated, setLastCreated] = useState(null);

  const cities = ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Balasore', 'Puri', 'Angul'];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter member full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg('Please provide at least an email address or mobile number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const fallbackEmail = email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.') || 'member'}@utkalfinance.com`;
        const fallbackPhone = phone.trim() || '+91 98610 ' + Math.floor(10000 + Math.random() * 90000);

        const newMember = addMember({
          name: name.trim(),
          email: fallbackEmail,
          phone: fallbackPhone,
          city: city,
          occupation: 'Member / Professional',
          initialDeposit: Number(deposit) || 25000,
        });

        setLastCreated(newMember);
        setName('');
        setEmail('');
        setPhone('');
        setDeposit('25000');
        setIsSubmitting(false);

        addToast(`Member ${newMember.name} registered! ID: ${newMember.id}`, 'success');
      } catch (err) {
        setIsSubmitting(false);
        setErrorMsg('Failed to add member: ' + (err.message || 'Unknown error'));
      }
    }, 400);
  };

  const handleFillSample = () => {
    const sampleFirstNames = ['Debasish', 'Priyabrata', 'Lipsa', 'Subrat', 'Ananya', 'Soumya', 'Tanmay'];
    const sampleLastNames = ['Panda', 'Mohapatra', 'Rath', 'Samal', 'Tripathy', 'Behera', 'Mishra'];
    const fName = sampleFirstNames[Math.floor(Math.random() * sampleFirstNames.length)];
    const lName = sampleLastNames[Math.floor(Math.random() * sampleLastNames.length)];
    const fullName = `${fName} ${lName}`;
    setName(fullName);
    setEmail(`${fName.toLowerCase()}.${lName.toLowerCase()}@gmail.com`);
    setPhone('+91 ' + (9861000000 + Math.floor(Math.random() * 900000)));
    setCity(cities[Math.floor(Math.random() * cities.length)]);
    setDeposit(['25000', '50000', '100000', '75000'][Math.floor(Math.random() * 4)]);
    setErrorMsg('');
  };

  return (
    <div className="mb-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Bar Header Strip */}
      <div className="bg-gradient-to-r from-finance-900 via-finance-850 to-slate-900 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight">Quick Add Member Bar</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Admin Action
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Instantly enroll a new member into the core ledger with allocated Core Member ID
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillSample}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-slate-200 hover:text-white transition-colors border border-white/10"
            title="Auto-fill sample member data"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Sample Data</span>
          </button>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-finance-700/60 hover:bg-finance-700 text-[11px] font-semibold text-slate-200 hover:text-white transition-colors border border-finance-600/50"
          >
            <span>Detailed Form</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle Bar"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bar Body (Inputs & Action) */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100">
          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg('')} className="text-rose-500 hover:text-rose-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {lastCreated && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between gap-2 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Successfully enrolled <strong>{lastCreated.name}</strong> with Member ID:{' '}
                  <strong className="font-mono">{lastCreated.id}</strong> (Deposit: ₹
                  {Number(lastCreated.availableBalance || 25000).toLocaleString('en-IN')})
                </span>
              </div>
              <button
                onClick={() => setLastCreated(null)}
                className="text-emerald-700 hover:text-emerald-900 font-semibold text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleQuickAdd} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-end">
            {/* Full Name */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Legal Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Suman Mohanty"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-finance-600 shadow-xs"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. suman@gmail.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-finance-600 shadow-xs"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98610 xxxxx"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-finance-600 shadow-xs"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Branch City */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hub / City
              </label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-finance-600 shadow-xs appearance-none"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Initial Deposit */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Initial Deposit
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="5000"
                  min="0"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-finance-600 shadow-xs"
                />
                <span className="text-xs font-bold text-slate-400 absolute left-3 top-2">₹</span>
              </div>
            </div>

            {/* Action Submit Button */}
            <div className="md:col-span-12 flex justify-end gap-2 pt-1 border-t border-slate-200/60 mt-2">
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setEmail('');
                  setPhone('');
                  setErrorMsg('');
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Enrolling...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>+ Add Member Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Detailed Modal if requested */}
      <AddMemberModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default AdminQuickAddBar;
