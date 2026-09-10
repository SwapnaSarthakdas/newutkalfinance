import React, { useState } from 'react';
import {
  Printer,
  FileDown,
  ArrowLeft,
  Shield,
  ShieldCheck,
  CheckCircle2,
  FileText,
  UserPlus,
  RefreshCw,
  Info,
  Building2,
  PhoneCall,
  Mail,
  HelpCircle,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Calendar,
  MapPin,
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import OfficialMembershipForm from '../../components/membership/OfficialMembershipForm';
import Logo from '../../components/common/Logo';
import Modal from '../../components/common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const MembershipFormPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { members, addMember, addApplication, addToast } = useFinance();

  const [formMode, setFormMode] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('filled')) {
      return 'filled';
    }
    return 'blank';
  });
  const [fillModalOpen, setFillModalOpen] = useState(false);
  const [createdMember, setCreatedMember] = useState(null);

  // Form State for Online Membership Application & Password
  const [formData, setFormData] = useState({
    fullName: '',
    fatherOrHusbandName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    dob: '1992-05-15',
    gender: 'Male',
    maritalStatus: 'Married',
    occupation: 'Service',
    panNo: '',
    address: '',
    city: 'Bhubaneswar',
    taluka: '',
    district: 'Khurda',
    state: 'Odisha',
    pinCode: '751007',
    nomineeName: '',
    nomineeRelationship: 'Spouse',
    nomineeAge: '30',
    agreedTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If newly created member exists, display it; otherwise use active logged-in member or demo
  const activeMember = createdMember || members.find((m) => m.id === user?.id) || members[0] || {};

  const handlePrint = () => {
    window.print();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleInputChange = handleChange;

  const handleRegisterForm = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Full legal name is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid Gmail / Email address for portal login.');
      return;
    }
    if (!formData.mobileNumber.trim() || formData.mobileNumber.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for portal login.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }
    if (!formData.agreedTerms) {
      setErrorMsg('You must agree to the statutory membership terms.');
      return;
    }

    setIsSubmitting(true);
    const memId = `UF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const empId = `EMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentRef = `UTR${Date.now().toString().slice(-8)}`;

    const memberPayload = {
      id: memId,
      membershipId: memId,
      empId,
      name: formData.fullName,
      fullName: formData.fullName,
      firstName: formData.fullName.split(' ')[0] || 'Member',
      lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
      fatherOrHusbandName: formData.fatherOrHusbandName,
      email: formData.email.trim().toLowerCase(),
      phone: formData.mobileNumber.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      password: formData.password,
      dob: formData.dob || '1992-05-15',
      gender: formData.gender || 'Male',
      maritalStatus: formData.maritalStatus || 'Married',
      occupation: formData.occupation || 'Service',
      religion: 'Hindu',
      category: 'General',
      education: 'Graduate / P.G.',
      panNo: formData.panNo || 'ABCDE1234F',
      address: formData.address || 'Plot 142, VIP Area, Saheed Nagar',
      city: formData.city || 'Bhubaneswar',
      taluka: formData.taluka || formData.city || 'Bhubaneswar',
      district: formData.district || 'Khurda',
      state: formData.state || 'Odisha',
      pinCode: formData.pinCode || '751007',
      permanentAddress: {
        address: formData.address || 'Plot 142, VIP Area, Saheed Nagar',
        taluka: formData.taluka || formData.city || 'Bhubaneswar',
        district: formData.district || 'Khurda',
        state: formData.state || 'Odisha',
        pinCode: formData.pinCode || '751007'
      },
      correspondenceAddress: {
        address: formData.address || 'Plot 142, VIP Area, Saheed Nagar',
        district: formData.district || 'Khurda',
        state: formData.state || 'Odisha',
        pinCode: formData.pinCode || '751007',
        mobileNumber: formData.mobileNumber.trim()
      },
      nominee: {
        name: formData.nomineeName || 'Family Nominee',
        relationship: formData.nomineeRelationship || 'Spouse',
        age: formData.nomineeAge || '30',
        address: formData.address || 'Plot 142, VIP Area, Saheed Nagar, Bhubaneswar'
      },
      nomineeName: formData.nomineeName || 'Family Nominee',
      nomineeRelationship: formData.nomineeRelationship || 'Spouse',
      nomineeAge: formData.nomineeAge || '30',
      initialDeposit: 25000,
      branchName: `${formData.city || 'Bhubaneswar'} Branch`,
      paymentMethod: 'UPI',
      paymentTxnRef: paymentRef,
      paymentStatus: 'Pending Admin Verification',
      agreedTerms: true
    };

    // 1. Submit to Backend API in background
    api.auth.register(memberPayload).catch((err) => {
      console.warn('Background API register call in MembershipForm:', err.message);
    });

    const newMember = addMember(memberPayload);

    if (addApplication) {
      addApplication({
        id: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        member_id: memId,
        status: 'Submitted',
        membership_fee: 200,
        payment_amount: 200,
        payment_status: 'Pending Admin Verification',
        payment_method: 'UPI',
        payment_txn_ref: paymentRef,
        created_at: new Date().toISOString(),
        ...newMember,
        member: newMember
      });
    }

    setCreatedMember(newMember);
    setFormMode('filled');
    setIsSubmitting(false);
    setFillModalOpen(false);
    addToast('Statutory Membership Form registered successfully! Admin can now view all details.', 'success');
  };
  const handleFormSubmit = handleRegisterForm;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-[#003E9E] selection:text-white">
      {/* Top Application Bar - Hidden in Print */}
      <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Back Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="cursor-pointer flex items-center gap-3" onClick={() => onNavigate('home')}>
              <Logo size="sm" showTagline={false} />
              <div className="hidden sm:block border-l border-slate-200 pl-3">
                <span className="text-xs font-bold text-slate-900 block">
                  Official Statutory Membership Form
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Reg. No.: U64199OD2026PLC054968
                </span>
              </div>
            </div>
          </div>

          {/* Center Form Mode Switcher */}
          <div className="flex items-center bg-slate-200/90 p-1 rounded-xl border border-slate-300">
            <button
              onClick={() => setFormMode('blank')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                formMode === 'blank'
                  ? 'bg-[#003E9E] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Blank Printable Form</span>
              {formMode === 'blank' && <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>}
            </button>
            <button
              onClick={() => setFormMode('filled')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                formMode === 'filled'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Pre-filled Example</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setFillModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#003E9E] to-[#0A3F9F] hover:from-[#002E78] hover:to-[#001B47] text-white text-xs font-bold transition-all shadow-sm"
              title="Fill form and set portal login password"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Fill Form <span className="hidden sm:inline">&amp; Set Password</span></span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-finance-900 hover:bg-finance-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-4 text-emerald-400" />
              <span><span className="hidden sm:inline">Print / </span>PDF</span>
            </button>

            <button
              onClick={() => onNavigate('admin-login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all border border-slate-200 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-purple-700" />
              <span>Admin Login</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Form Display Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-4 py-6">
        
        {/* Success Alert Banner after Submitting Form with Password */}
        {createdMember && (
          <div className="no-print mb-6 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-emerald-950">
                      Membership Registered Successfully!
                    </span>
                    <span className="text-[11px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                      Member ID: {createdMember.id}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 mt-1">
                    Your official membership form below has been populated. Your application has been recorded and submitted to the Administrator for verification.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Return to Home</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Informational Guidance Notice - Hidden in Print */}
        <div className="no-print mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#003E9E] flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#003E9E]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Statutory Membership Application Document</span>
                  <span className="text-[10px] font-mono bg-blue-100 text-[#003E9E] px-2 py-0.5 rounded font-bold uppercase">
                    Govt. Certified
                  </span>
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Official statutory Membership Application Form of <strong>Newutkal Finance Ltd.</strong> (Govt. Reg. No. <span className="font-mono font-semibold text-slate-800">U64199OD2026PLC054968</span>). Exact 2-page physical statutory document format for associate membership with full regulatory compliance.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end text-xs">
              <button
                onClick={() => setFillModalOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-[#003E9E] to-[#0A3F9F] hover:from-[#002E78] hover:to-[#001B47] text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>Fill &amp; Set Password</span>
              </button>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
                Associate Fee: <strong className="text-slate-900">₹ 200</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Notice */}
        <div className="md:hidden no-print flex items-center justify-between gap-2 px-3.5 py-2 mb-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-xs">
          <span className="font-semibold text-[11px]">📜 Official Statutory Form</span>
          <span className="text-[10px] text-amber-700 font-mono">↔️ Swipe sideways to view full sheet</span>
        </div>

        {/* The 2-Page Official Membership Form Component */}
        <div className="w-full overflow-x-auto pb-4 -mx-1 sm:mx-0 px-1 sm:px-0">
          <div className="min-w-[640px] md:min-w-0">
            <OfficialMembershipForm
              data={activeMember}
              isBlank={formMode === 'blank'}
              onPrint={handlePrint}
            />
          </div>
        </div>

        {/* Guidance Checklist Footer - Hidden in Print */}
        <div className="no-print mt-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#003E9E]" />
            <span>Application Guidelines &amp; Portal Authentication</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <strong className="text-slate-900 block flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#003E9E]" /> 1. Set Portal Password
              </strong>
              <p>Set your confidential password while filling this form. This password links securely to your registered Gmail and Mobile number.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <strong className="text-slate-900 block flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-finance-600" /> 2. Sign In with Gmail or Phone
              </strong>
              <p>Once registered, access your account from any device by entering either your Gmail ID or Mobile Number with your password.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <strong className="text-slate-900 block flex items-center gap-1">
                <Printer className="w-3.5 h-3.5 text-emerald-600" /> 3. Official Print &amp; KYC
              </strong>
              <p>Print the filled 2-page statutory document for your branch records or download it as PDF anytime.</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer - Hidden in Print */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Newutkal Finance Ltd. Registered under Companies Act 2013 &amp; 2014 rules, working on the lines of Nidhi Company.
      </footer>

      {/* Online Membership Application & Password Setting Modal */}
      <Modal
        isOpen={fillModalOpen}
        onClose={() => setFillModalOpen(false)}
        title="Fill Membership Form & Set Portal Password"
        subtitle="Complete your statutory membership details and create your login password for Gmail / Phone access."
        maxWidth="max-w-3xl"
      >
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* SECTION 1: Personal Details */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#003E9E] block mb-2 pb-1 border-b border-blue-200">
              1. Personal &amp; Statutory Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Rajesh Kumar Mohapatra"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Father's / Husband's Name</label>
                <input
                  type="text"
                  name="fatherOrHusbandName"
                  value={formData.fatherOrHusbandName}
                  onChange={handleInputChange}
                  placeholder="e.g. Ramesh Chandra Mohapatra"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E] bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Dedicated Online Portal Credentials & Password */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#001B47] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#003E9E]" />
                <span>2. Security Contact &amp; Passcode Verification (Gmail / Mobile)</span>
              </span>
              <span className="text-[10px] text-[#003E9E] font-semibold bg-blue-100 text-[#003E9E] px-2 py-0.5 rounded">
                Official Verification
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              You will use the <strong>Gmail ID</strong> and <strong>Mobile Number</strong> entered here for statutory membership identity verification and notifications.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Login Gmail / Email ID *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rajesh@gmail.com"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E] bg-white"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Login Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 9861054321 (10 digits)"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E] bg-white"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Set Portal Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E] bg-white"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter password"
                    className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E] bg-white"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Address & Nominee */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#003E9E] block mb-2 pb-1 border-b border-blue-200">
              3. Address, Nominee &amp; Verification
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Permanent Residential Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Plot/Flat No, Street, Landmark"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City / Taluka</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nominee Legal Name</label>
                <input
                  type="text"
                  name="nomineeName"
                  value={formData.nomineeName}
                  onChange={handleInputChange}
                  placeholder="e.g. Sunita Mohapatra"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nominee Relationship</label>
                <select
                  name="nomineeRelationship"
                  value={formData.nomineeRelationship}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#003E9E] focus:border-[#003E9E] bg-white"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                required
                name="agreedTerms"
                checked={formData.agreedTerms}
                onChange={handleInputChange}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#003E9E] focus:ring-[#003E9E]"
              />
              <span>
                I agree to the statutory rules, bye-laws, and Associate Membership terms (₹ 500) of <strong>Newutkal Finance Ltd.</strong> and confirm that the password and credentials entered here will be used to access my account.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setFillModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#003E9E] to-[#0A3F9F] hover:from-[#002E78] hover:to-[#001B47] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Generating Official Form...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Submit &amp; Generate Form</span>
                </>
              )}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default MembershipFormPage;
