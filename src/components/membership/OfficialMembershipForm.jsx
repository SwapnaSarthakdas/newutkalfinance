import React from 'react';

/**
 * Digit/Character Grid Boxes (used for EMP ID, Date, Membership ID, Branch Code, Witness data)
 */
const DigitBoxes = ({ count = 8, value = '', placeholders = null, className = '' }) => {
  const cleanVal = String(value || '').replace(/[^a-zA-Z0-9]/g, '');
  const chars = cleanVal.padEnd(count, ' ').slice(0, count).split('');
  const isFullWidth = className.includes('w-full') || className.includes('flex-1');

  return (
    <div className={`inline-flex items-stretch border border-[#003E9E] bg-white ${className}`}>
      {Array.from({ length: count }).map((_, idx) => {
        const char = chars[idx] && chars[idx] !== ' ' ? chars[idx] : '';
        const placeholderChar = placeholders && placeholders[idx] ? placeholders[idx] : '';
        return (
          <div
            key={idx}
            className={`${isFullWidth ? 'flex-1 min-w-[12px] h-5 sm:h-6' : 'w-4 h-5 sm:w-5 sm:h-6'} border-r last:border-r-0 border-[#003E9E] flex items-center justify-center font-mono font-bold text-[9px] sm:text-xs text-slate-900 select-none`}
          >
            {char || (placeholderChar ? (
              <span className="text-[7.5px] sm:text-[9px] text-slate-400 font-normal">{placeholderChar}</span>
            ) : '')}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Checkbox Item matching the official statutory form block style
 */
const CheckboxItem = ({ label, checked = false, className = '' }) => (
  <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-900 leading-tight ${className}`}>
    <span className="w-3.5 h-3.5 border border-[#003E9E] inline-flex items-center justify-center text-[10px] font-bold bg-white text-[#003E9E] shrink-0">
      {checked ? '✓' : ''}
    </span>
    <span className="whitespace-nowrap">{label}</span>
  </span>
);

/**
 * OfficialMembershipForm
 * Exact pixel-faithful 1:1 reproduction of the official 2-Page Newutkal Finance Ltd. Membership Application Form
 */
const OfficialMembershipForm = ({
  data = {},
  isBlank = false
}) => {
  const d = isBlank ? {} : data;

  // Format date string to DDMMYYYY
  const formatDateToDigits = (dateStr) => {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return '';
      const day = String(dt.getDate()).padStart(2, '0');
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const year = String(dt.getFullYear());
      return `${day}${month}${year}`;
    } catch {
      return '';
    }
  };

  const dobDigits = d.dob ? formatDateToDigits(d.dob) : '';
  const dateDigits = d.joinedDate
    ? formatDateToDigits(d.joinedDate)
    : (isBlank ? '' : formatDateToDigits(new Date().toISOString()));

  const calculateAge = (dob) => {
    if (!dob) return '';
    try {
      const b = new Date(dob);
      const diff = Date.now() - b.getTime();
      return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    } catch {
      return '';
    }
  };

  const displayAge = d.age || calculateAge(d.dob) || '';

  // Helpers to detect selection
  const occ = (d.occupation || '').toLowerCase();
  const rel = (d.religion || '').toLowerCase();
  const cat = (d.category || '').toUpperCase();
  const gen = (d.gender || '').toLowerCase();
  const mar = (d.maritalStatus || '').toLowerCase();
  const edu = (d.education || '').toLowerCase();

  return (
    <div className="official-membership-form-root font-sans text-slate-900 text-xs">
      <style>{`
        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always !important;
            break-after: page !important;
          }
          .official-sheet {
            margin: 0 !important;
            padding: 8mm !important;
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* ========================================================================= */}
      {/* PAGE 1: MEMBERSHIP APPLICATION FORM                                       */}
      {/* ========================================================================= */}
      <div className="official-sheet page-break bg-white mx-auto my-6 p-4 sm:p-6 md:p-8 border-2 border-[#003E9E] shadow-xl max-w-[850px] relative text-slate-900 text-[10px] sm:text-[11px] leading-snug">
        
        {/* Top Header Block */}
        <div className="flex items-center justify-between gap-2 pb-2">
          {/* Logo & Company Name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.jpg"
              alt="Newutkal Finance Ltd."
              className="h-12 sm:h-14 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black text-[#003E9E] tracking-tight leading-tight">
                Newutkal Finance Ltd.
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-[#003E9E] tracking-wider">
                TRUST | GROWTH | PROSPERITY
              </span>
            </div>
          </div>

          {/* Center Box: Application Title */}
          <div className="border border-[#003E9E] px-3 sm:px-4 py-1 text-center">
            <span className="text-xs sm:text-sm font-black tracking-wide text-[#003E9E] uppercase block">
              MEMBERSHIP APPLICATION FORM
            </span>
          </div>

          {/* Right Box: Govt. Reg No */}
          <div className="border border-[#003E9E] px-2 sm:px-3 py-1 text-center text-[9px] sm:text-[10px] font-bold text-slate-900">
            <div>
              <span className="text-[#003E9E] font-extrabold">CERTIFIED BY GOVT. OF INDIA</span>{' '}
              <span>Reg. No.: U64199OD2026PLC054968</span>
            </div>
          </div>
        </div>

        {/* Address / Contact Info Line */}
        <div className="text-center text-[9.5px] sm:text-[10.5px] text-slate-700 pt-1 pb-1 font-medium">
          Plot no-N/5-172, Nayapalli, IRC village, Bhubaneswar-751015 | Mob: +91 9776175240 | Email: bhagirathimohapatra79@gmail.com | Web: www.newutkalfinance.com
        </div>

        {/* Company Registration Tagline */}
        <div className="text-center font-bold text-[#003E9E] text-[10px] sm:text-[11px] pb-2">
          A Company Registered 2013 &amp; 2014 rules respectively, working on the lines of Nidhi Company.
        </div>

        {/* Identification Table (EMP ID, Date, Membership ID, Branch) */}
        <div className="border border-[#003E9E] text-[10px] sm:text-[11px]">
          {/* Row 1: EMP ID & Date */}
          <div className="flex border-b border-[#003E9E]">
            <div className="flex items-center gap-1.5 p-1 sm:p-1.5 border-r border-[#003E9E] w-1/2">
              <span className="font-bold text-slate-900 shrink-0">EMP ID</span>
              <DigitBoxes count={8} value={d.empId || (isBlank ? '' : 'EMP-104')} />
            </div>
            <div className="flex items-center gap-1.5 p-1 sm:p-1.5 w-1/2 justify-end">
              <span className="font-bold text-slate-900 shrink-0">Date</span>
              <DigitBoxes
                count={8}
                value={dateDigits}
                placeholders={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
              />
            </div>
          </div>

          {/* Row 2: Membership ID */}
          <div className="flex border-b border-[#003E9E]">
            <div className="flex items-center gap-1.5 p-1 sm:p-1.5 border-r border-[#003E9E] w-1/2">
              <span className="font-bold text-slate-900 shrink-0">Membership ID</span>
              <DigitBoxes count={8} value={d.membershipId || d.memberId || d.id || (isBlank ? '' : 'UF-1048')} />
            </div>
            <div className="w-1/2 p-1 sm:p-1.5"></div>
          </div>

          {/* Row 3: Branch Name & Branch Code */}
          <div className="flex border-b border-[#003E9E]">
            <div className="flex items-center gap-1.5 p-1 sm:p-1.5 border-r border-[#003E9E] flex-1">
              <span className="font-bold text-slate-900 shrink-0">Branch Name:</span>
              <span className="font-semibold text-slate-900 uppercase">
                {d.branchName || (isBlank ? '' : 'Bhubaneswar Main')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1 sm:p-1.5 shrink-0">
              <span className="font-bold text-slate-900 shrink-0">Branch Code</span>
              <DigitBoxes count={7} value={d.branchCode || (isBlank ? '' : '075101')} />
            </div>
          </div>

          {/* Row 4: Applicant Name */}
          <div className="flex items-center gap-2 p-1 sm:p-1.5 border-b border-[#003E9E]">
            <span className="font-bold text-slate-900 shrink-0">Mr. / Miss. / Mrs.</span>
            <span className="font-bold text-slate-900 uppercase tracking-wide flex-1">
              {d.name || d.fullName || ''}
            </span>
          </div>

          {/* Row 5: Guardian Name */}
          <div className="flex items-center gap-2 p-1 sm:p-1.5">
            <span className="font-bold text-slate-900 shrink-0">S/o. / D/o. / W/o</span>
            <span className="font-semibold text-slate-900 flex-1">
              {d.fatherOrHusbandName || d.father_or_husband_name || d.fatherName || ''}
            </span>
          </div>
        </div>

        {/* Declaration Text */}
        <p className="mt-2 text-justify text-[9.5px] sm:text-[10px] leading-normal text-slate-900">
          I submit my application form to be an associate member of "Newutkal Finance Ltd." with the Membership fee of Rs. 200 after acceptance of my membership I will abide by all the existing rules, regulation, sub-rules any amendment modification or done by the company from time to time. I solemnly declare that I am not a member of any other company similar in nature of "Newutkal Finance Ltd.". However all information provided by me in the application form is true and correct to the best of my knowledge.
        </p>

        {/* SECTION: Member Details */}
        <div className="mt-2">
          <div className="text-center font-bold text-[#003E9E] text-xs pb-0.5">
            Member Details :
          </div>
          <table className="w-full border-collapse border border-[#003E9E] text-left text-[9px] sm:text-[10px]">
            <thead>
              <tr className="border-b border-[#003E9E] text-center font-bold text-[#003E9E]">
                <th className="p-1 border-r border-[#003E9E] w-[22%]">D.O.B.</th>
                <th className="p-1 border-r border-[#003E9E] w-[10%]">Gender</th>
                <th className="p-1 border-r border-[#003E9E] w-[13%]">Marital Status</th>
                <th className="p-1 border-r border-[#003E9E] w-[23%]">Educational Qualification</th>
                <th className="p-1 border-r border-[#003E9E] w-[18%]">Religion</th>
                <th className="p-1 w-[14%]">Catagory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#003E9E]">
              {/* Row 1 */}
              <tr>
                {/* D.O.B. boxes */}
                <td className="p-1 border-r border-[#003E9E] text-center align-middle">
                  <DigitBoxes
                    count={8}
                    value={dobDigits}
                    placeholders={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
                  />
                </td>

                {/* Male */}
                <td className="p-1 border-r border-[#003E9E] align-middle">
                  <CheckboxItem label="Male" checked={gen === 'male'} />
                </td>

                {/* Married */}
                <td className="p-1 border-r border-[#003E9E] align-middle">
                  <CheckboxItem label="Married" checked={mar === 'married' || (!isBlank && !mar)} />
                </td>

                {/* Below Matric & Graduate/P.G. */}
                <td className="p-1 border-r border-[#003E9E] align-middle">
                  <div className="flex items-center justify-between gap-1">
                    <CheckboxItem label="Below Matric" checked={edu.includes('below')} />
                    <CheckboxItem label="Graduate / P.G." checked={edu.includes('grad') || (!isBlank && !edu)} />
                  </div>
                </td>

                {/* Hindu / Sikh / Jain */}
                <td className="p-1 border-r border-[#003E9E] align-middle">
                  <div className="flex items-center justify-between gap-1">
                    <CheckboxItem label="Hindu" checked={rel === 'hindu' || (!isBlank && !rel)} />
                    <CheckboxItem label="Sikh" checked={rel === 'sikh'} />
                    <CheckboxItem label="Jain" checked={rel === 'jain'} />
                  </div>
                </td>

                {/* BC / SC */}
                <td className="p-1 align-middle">
                  <div className="flex items-center justify-around gap-1">
                    <CheckboxItem label="BC" checked={cat === 'BC' || cat === 'OBC'} />
                    <CheckboxItem label="SC" checked={cat === 'SC'} />
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                {/* Age (Attach Birth Certificate) */}
                <td className="p-1 border-r border-[#003E9E] align-middle text-center">
                  <span className="text-[8.5px] sm:text-[9.5px]">Age (Attach Birth Certificate): </span>
                  <span className="font-bold text-slate-900">{displayAge}</span>
                </td>

                {/* Female */}
                <td className="p-1 border-r border-[#003E9E] align-middle">
                  <CheckboxItem label="Female" checked={gen === 'female'} />
                </td>

                {/* Unmarried */}
                <td className="p-1 border-r border-[#003E9E] align-middle">
                  <CheckboxItem label="Unmarried" checked={mar === 'unmarried' || mar === 'single'} />
                </td>

                {/* Matric / 10+2 & Professional */}
                <td className="p-1 border-r border-[#003E9E] align-middle">
                  <div className="flex items-center justify-between gap-1">
                    <CheckboxItem label="Matric / 10+2" checked={edu.includes('matric') || edu.includes('10+2') || edu.includes('12')} />
                    <CheckboxItem label="Professional" checked={edu.includes('prof')} />
                  </div>
                </td>

                {/* Muslim / Christian / Other */}
                <td className="p-1 border-r border-[#003E9E] align-middle">
                  <div className="flex items-center justify-between gap-1">
                    <CheckboxItem label="Muslim" checked={rel === 'muslim'} />
                    <CheckboxItem label="Christian" checked={rel === 'christian'} />
                    <CheckboxItem label="Other" checked={rel === 'other'} />
                  </div>
                </td>

                {/* ST / General */}
                <td className="p-1 align-middle">
                  <div className="flex items-center justify-around gap-1">
                    <CheckboxItem label="ST" checked={cat === 'ST'} />
                    <CheckboxItem label="General" checked={cat === 'GENERAL' || (!isBlank && !cat)} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION: Please fill in Appropriate Block */}
        <div className="mt-2">
          <div className="text-center font-bold text-[#003E9E] text-xs pb-0.5">
            Please fill in Appropriate Block
          </div>
          <table className="w-full border-collapse border border-[#003E9E] text-left text-[8.5px] sm:text-[9.5px]">
            <tbody className="divide-y divide-[#003E9E]">
              {/* Row 1: Occupation */}
              <tr>
                <td className="p-1 font-bold border-r border-[#003E9E] w-[24%]">Occupation</td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Service" checked={occ.includes('service') || occ.includes('salaried')} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Business" checked={occ.includes('business') || (!isBlank && !occ)} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Farming" checked={occ.includes('farm') || occ.includes('agri')} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Professional" checked={occ.includes('prof')} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Housewife" checked={occ.includes('housewife') || occ.includes('homemaker')} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Student" checked={occ.includes('student')} /></td>
                <td className="p-1"><CheckboxItem label="Other" checked={occ.includes('other')} /></td>
              </tr>

              {/* Row 2: Domicile (Attach Photo Copy) */}
              <tr>
                <td className="p-1 font-bold border-r border-[#003E9E]">Domicile (Attach Photo Copy)</td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Aadhar Card" checked={!isBlank} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Voter I.D." checked={false} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Electricity Bill" checked={false} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Telephone Bill" checked={false} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Education" checked={false} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Ration Card" checked={false} /></td>
                <td className="p-1"><CheckboxItem label="Other" checked={false} /></td>
              </tr>

              {/* Row 3: Identity Card (Attach Photo Copy) */}
              <tr>
                <td className="p-1 font-bold border-r border-[#003E9E]">Identity Card (Attach Photo Copy)</td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Identity Card" checked={false} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Voter I.D." checked={false} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="PAN Card" checked={!isBlank} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Pass Port" checked={false} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Driving Licence" checked={false} /></td>
                <td className="p-1 border-r border-[#003E9E]"><CheckboxItem label="Other" checked={false} /></td>
                <td className="p-1"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION: Permanent Address */}
        <div className="mt-2 border border-[#003E9E]">
          <div className="text-center font-bold text-[#003E9E] text-xs py-0.5 border-b border-[#003E9E]">
            Permanent Address
          </div>
          
          {/* Street Address Line */}
          <div className="p-1 sm:p-1.5 border-b border-[#003E9E] min-h-[22px]">
            <span className="font-semibold text-slate-900">
              {d.permanentAddress?.address || d.permanent_address || d.permAddress || d.address || (isBlank ? '' : 'Plot 142, VIP Area, Saheed Nagar')}
            </span>
          </div>

          {/* Taluka / District / State */}
          <div className="flex border-b border-[#003E9E] text-[9.5px] sm:text-[10.5px]">
            <div className="p-1 border-r border-[#003E9E] w-1/3">
              <span className="font-bold">Taluka: </span>
              <span className="font-semibold">{d.permanentAddress?.taluka || d.permTaluka || d.taluka || d.city || ''}</span>
            </div>
            <div className="p-1 border-r border-[#003E9E] w-1/3">
              <span className="font-bold">District: </span>
              <span className="font-semibold">{d.permanentAddress?.district || d.permDistrict || d.district || (isBlank ? '' : 'Khurda')}</span>
            </div>
            <div className="p-1 w-1/3">
              <span className="font-bold">State: </span>
              <span className="font-semibold">{d.permanentAddress?.state || d.permState || d.state || (isBlank ? '' : 'Odisha')}</span>
            </div>
          </div>

          {/* Pin Code / E-mail ID / Mo. No. / PAN No. */}
          <div className="flex text-[9.5px] sm:text-[10.5px]">
            <div className="p-1 border-r border-[#003E9E] w-1/4">
              <span className="font-bold">Pin Code: </span>
              <span className="font-semibold">{d.permanentAddress?.pinCode || d.permPinCode || d.pinCode || (isBlank ? '' : '751007')}</span>
            </div>
            <div className="p-1 border-r border-[#003E9E] w-1/4 truncate">
              <span className="font-bold">E-mail ID: </span>
              <span className="font-semibold">{d.email || d.user?.email || ''}</span>
            </div>
            <div className="p-1 border-r border-[#003E9E] w-1/4">
              <span className="font-bold">Mo. No.: </span>
              <span className="font-semibold">{d.mobileNumber || d.phone || d.mobile || ''}</span>
            </div>
            <div className="p-1 w-1/4">
              <span className="font-bold">PAN No.: </span>
              <span className="font-semibold">{d.panNo || d.pan_no || (isBlank ? '' : 'ABCDE1234F')}</span>
            </div>
          </div>
        </div>

        {/* SECTION: Status of the Depositor */}
        <div className="mt-2">
          <div className="text-center font-bold text-[#003E9E] text-xs pb-0.5">
            Status of the Depositor
          </div>
          <div className="border border-[#003E9E]">
            {/* Upper Split: Left = Tax; Right = Share Holder & Repayment */}
            <div className="flex border-b border-[#003E9E]">
              {/* Left Box: Tax to be deducted */}
              <div className="p-1.5 border-r border-[#003E9E] w-[35%] flex flex-col justify-between text-[9px] sm:text-[10px]">
                <div className="font-bold text-slate-900">Tax to be deducted</div>
                <div className="flex items-center gap-2 py-0.5">
                  <CheckboxItem label="Yes" checked={false} />
                  <CheckboxItem label="No" checked={!isBlank} />
                  <CheckboxItem label="Not" checked={false} />
                </div>
                <div className="text-[8.5px] sm:text-[9.5px] leading-tight">
                  <div>Applicable Tax not to be deducted</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-3 h-3 border border-[#003E9E] inline-block bg-white text-center text-[9px] font-bold text-[#003E9E]">
                      {!isBlank ? '✓' : ''}
                    </span>
                    <span>Form 15G/15H Enclosed</span>
                  </div>
                </div>
              </div>

              {/* Right Box: Share Holder, Repayment, Value */}
              <div className="p-1 sm:p-1.5 w-[65%] text-[9px] sm:text-[10px] space-y-1">
                {/* Share Holder & Date */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <CheckboxItem label="Share Holder" checked={!isBlank} />
                    <span className="font-bold ml-1">Share No.</span>
                    <span className="font-semibold underline decoration-[#003E9E] px-1">
                      {d.shareNo || (isBlank ? '............' : 'SH-8492')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">Date</span>
                    <DigitBoxes
                      count={8}
                      value={dateDigits}
                      placeholders={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
                    />
                  </div>
                </div>

                {/* Repayment Option */}
                <div className="pt-0.5">
                  <span className="font-bold block text-[8.5px] sm:text-[9.5px]">
                    Repayment of Deposit to be made payment to:
                  </span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <CheckboxItem label="First depositor" checked={!isBlank} />
                    <CheckboxItem label="Any one or Supervisor" checked={false} />
                  </div>
                </div>

                {/* Mode of operation & Value */}
                <div className="pt-0.5 flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <CheckboxItem label="Either or Survivor" checked={false} />
                    <CheckboxItem label="Jointly" checked={false} />
                    <CheckboxItem label="Former of Survivor Share" checked={false} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-0.5 text-[8.5px] sm:text-[9.5px]">
                  <div>
                    <span className="font-bold">Value: </span>
                    <span className="font-semibold underline decoration-[#003E9E] px-1">
                      {d.shareValue || (isBlank ? '............' : '₹ 500')}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">Share Purchase: </span>
                    <span className="font-semibold underline decoration-[#003E9E] px-1">
                      {d.sharePurchase || (isBlank ? '............' : '10 Shares')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Nominee Info */}
            <div className="p-1 sm:p-1.5 space-y-1 text-[9.5px] sm:text-[10.5px]">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <span className="font-bold">Nominee : Mr. / Mrs. / Ms. </span>
                  <span className="font-semibold">{d.nomineeName || d.nominee?.name || d.nominee_name || (isBlank ? '' : 'Sunita')}</span>
                </div>
                <div className="w-1/3">
                  <span className="font-bold">Last Name </span>
                  <span className="font-semibold">{d.nomineeLastName || d.nominee?.lastName || (isBlank ? '' : 'Sharma')}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <span className="font-bold">Relationship : </span>
                  <span className="font-semibold">{d.nomineeRelationship || d.nominee?.relationship || d.nominee_relation || (isBlank ? '' : 'Spouse')}</span>
                </div>
                <div className="w-1/3">
                  <span className="font-bold">Age : </span>
                  <span className="font-semibold">{d.nomineeAge || d.nominee?.age || d.nominee_age || (isBlank ? '' : '32')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Details of witness / Proof */}
        <div className="mt-2">
          <div className="text-center font-bold text-[#003E9E] text-xs pb-0.5">
            Details of witness / Proof
          </div>
          <div className="border border-[#003E9E] text-[9px] sm:text-[10px]">
            {/* Row 1: Witness Membership Check */}
            <div className="flex items-center justify-between p-1 border-b border-[#003E9E]">
              <span className="font-bold text-slate-900">
                If witness is a member of Newutkal Finance Ltd., Then mention membership Number
              </span>
              <div className="flex items-center gap-1">
                <span className="font-bold">Membership No.</span>
                <DigitBoxes count={8} value={d.witnessMembershipNo || d.witness?.membershipNumber || d.witness_membership_no || (isBlank ? '' : 'UF-1012')} />
              </div>
            </div>

            {/* Row 2: Witness Name Grid Boxes */}
            <div className="flex items-center p-1 border-b border-[#003E9E]">
              <span className="font-bold w-36 shrink-0">Mr. / Mrs. / Miss</span>
              <DigitBoxes
                count={28}
                value={d.witnessName || d.witness?.name || d.witness_name || (isBlank ? '' : 'PRADEEP KUMAR SAHOO')}
                className="w-full"
              />
            </div>

            {/* Row 3: Witness Correspondence Address Grid Boxes */}
            <div className="flex items-center p-1 border-b border-[#003E9E]">
              <span className="font-bold w-36 shrink-0">Correspondence Address</span>
              <DigitBoxes
                count={28}
                value={d.witnessAddress || d.witness?.address || d.witness_address || (isBlank ? '' : 'KHANDAGIRI BHUBANESWAR')}
                className="w-full"
              />
            </div>

            {/* Row 4: District & State */}
            <div className="flex border-b border-[#003E9E]">
              <div className="flex items-center p-1 border-r border-[#003E9E] w-1/2">
                <span className="font-bold w-20 shrink-0">District</span>
                <DigitBoxes count={14} value={d.witnessDistrict || d.witness?.district || d.witness_district || (isBlank ? '' : 'KHURDA')} />
              </div>
              <div className="flex items-center p-1 w-1/2">
                <span className="font-bold w-16 shrink-0">State</span>
                <DigitBoxes count={14} value={d.witnessState || d.witness?.state || d.witness_state || (isBlank ? '' : 'ODISHA')} />
              </div>
            </div>

            {/* Row 5: Pin Code & Mobile No. */}
            <div className="flex">
              <div className="flex items-center p-1 border-r border-[#003E9E] w-1/2">
                <span className="font-bold w-20 shrink-0">Pin Code</span>
                <DigitBoxes count={6} value={d.witnessPin || d.witnessPinCode || d.witness?.pinCode || (isBlank ? '' : '751030')} />
              </div>
              <div className="flex items-center p-1 w-1/2">
                <span className="font-bold w-20 shrink-0">Mobile No.</span>
                <DigitBoxes count={10} value={d.witnessMobile || d.witness?.mobileNumber || d.witness_mobile || (isBlank ? '' : '9861011223')} />
              </div>
            </div>
          </div>
        </div>

        {/* Associate Information Row */}
        <div className="mt-2 flex items-center justify-between text-[10px] sm:text-[11px] gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900">Associate Code</span>
            <DigitBoxes count={8} value={d.associateCode || (isBlank ? '' : 'ASC-092')} />
          </div>
          <div>
            <span className="font-bold">Associate Name </span>
            <span className="font-semibold underline decoration-[#003E9E] px-2">
              {d.associateName || (isBlank ? '..............................' : 'B. K. Mohapatra')}
            </span>
          </div>
          <div>
            <span className="font-bold">Associate Sign. </span>
            <span className="font-serif italic font-semibold underline decoration-[#003E9E] px-2 text-[#003E9E]">
              {isBlank ? '....................' : (d.associateSign || 'B.Mohapatra')}
            </span>
          </div>
        </div>

        {/* SECTION: ONLY FOR OFFICE USE */}
        <div className="mt-2 border-2 border-[#003E9E] p-1.5 sm:p-2 text-[9px] sm:text-[10px]">
          <div className="text-center font-black text-[#003E9E] text-xs uppercase tracking-wide mb-1">
            ONLY FOR OFFICE USE
          </div>
          
          <div className="border-t border-[#003E9E] pt-1">
            <div className="text-slate-800 text-center font-medium mb-1">
              After review by the Divisional Manager / Membership Committee / Authorized Officer of the
              Newutkal Finance Ltd., the above application is <strong>Accepted / Rejected</strong>.
            </div>

            <div className="flex border-t border-[#003E9E] pt-1.5">
              {/* Left Column: Attachments List */}
              <div className="w-[40%] border-r border-[#003E9E] pr-2 text-[8.5px] sm:text-[9.5px] space-y-0.5">
                <div className="font-bold text-slate-900">Attachments :</div>
                <div>1. Three New Colour Photograph</div>
                <div>2. Aadhar/Voter Id/Pan Card/Driving License</div>
                <div>3. Educational Certificate</div>
                <div>4. Birth Certificate</div>
                <div>5. Ration card/A/c Statement/Electricity Bill</div>
              </div>

              {/* Middle Column: Official Allocation Fields */}
              <div className="w-[32%] border-r border-[#003E9E] px-2 space-y-1.5 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Date</span>
                  <span className="border-b border-[#003E9E] flex-1 ml-2 text-center font-mono">
                    {d.verificationDate || (isBlank ? '' : '15/01/2026')}
                  </span>
                </div>
                <div>
                  <span className="font-bold block">Receipt No. of Membership Fee</span>
                  <span className="border-b border-[#003E9E] block text-center font-mono font-semibold">
                    {d.receiptNo || (isBlank ? '' : 'REC-2026-9481')}
                  </span>
                </div>
                <div>
                  <span className="font-bold block">Allocation Membership Number</span>
                  <span className="border-b border-[#003E9E] block text-center font-mono font-bold text-[#003E9E]">
                    {d.id || d.allocationMembershipNo || (isBlank ? '' : 'UF-2026-1048')}
                  </span>
                </div>
              </div>

              {/* Right Column: Office Stamp & Signature Box */}
              <div className="w-[28%] pl-2 flex flex-col justify-between text-center">
                <div className="font-bold text-[8.5px] sm:text-[9px] text-slate-900">
                  Office Stamp &amp; Signature of Authorized Officer
                </div>
                <div className="h-16 border border-dashed border-[#003E9E] mt-1 flex items-center justify-center bg-blue-50/20">
                  {!isBlank && (
                    <div className="text-center font-serif text-[9px] text-[#003E9E] leading-tight">
                      <div className="font-bold border border-[#0f4c81] px-1 py-0.5 rounded text-[8px]">
                        NEWUTKAL FINANCE LTD.
                      </div>
                      <div className="italic mt-0.5">Authorized Signatory</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* PAGE 2: TERMS & CONDITIONS                                                */}
      {/* ========================================================================= */}
      <div className="official-sheet bg-white mx-auto my-6 p-6 sm:p-10 md:p-12 border-4 border-[#003E9E] shadow-xl max-w-[850px] relative text-slate-900 text-xs sm:text-sm leading-relaxed">
        
        {/* Title: Terms & Conditions For Membership */}
        <div className="text-center pb-4 mb-4">
          <h2 className="text-base sm:text-lg font-black text-[#003E9E] uppercase tracking-wide underline underline-offset-4 decoration-[#003E9E]">
            Terms &amp; Conditions For Membership
          </h2>
        </div>

        {/* 8 Membership Conditions - Verbatim */}
        <ol className="space-y-2.5 sm:space-y-3 text-slate-900 list-decimal pl-6 text-[11px] sm:text-[12.5px] leading-normal">
          <li className="pl-1">
            The declaration in writing by the applicant that he/she is not Member of any other company similar to the Newutkal Finance Ltd.
          </li>
          <li className="pl-1">
            The application qualified all the term &amp; conditions of Newutkal Finance Ltd.
          </li>
          <li className="pl-1">
            The application should either be a resident of working within work area of Newutkal Finance Ltd.
          </li>
          <li className="pl-1">
            The application must be minimum of 18 Years of Age.
          </li>
          <li className="pl-1">
            The organizing division / Membership Committee / Authorized Officer of Newutkal Finance Ltd. reserve the right to accept or rejectany application.
          </li>
          <li className="pl-1">
            The applicants should never have been declared bankrupt or charge for bankruptcy by competent court.
          </li>
          <li className="pl-1">
            TDS &amp; all other taxes are applicable as per Govt. norms.
          </li>
          <li className="pl-1 font-semibold text-slate-950">
            I accept all the Terms and Conditions of Newutkal Finance Ltd. and I want to be a member of Newutkal Finance Ltd.
          </li>
        </ol>

        {/* Title: Cancellation of Membership */}
        <div className="mt-8 pt-4 pb-2 text-center">
          <h3 className="text-sm sm:text-base font-black text-[#003E9E] uppercase tracking-wide">
            Terms &amp; Conditions Regarding Cancellation of Membership
          </h3>
        </div>

        {/* Subtitle */}
        <div className="font-bold text-slate-900 text-xs sm:text-[13px] mb-2 pl-2">
          The Membership of any Member can be cancelled basic Facts:
        </div>

        {/* 4 Cancellation Conditions - Verbatim */}
        <ol className="space-y-2.5 sm:space-y-3 text-slate-900 list-decimal pl-6 text-[11px] sm:text-[12.5px] leading-normal">
          <li className="pl-1">
            If the present occupation of the member similar to that of Newutkal Finance Ltd. or it affects the business of company.
          </li>
          <li className="pl-1">
            If the member doesn’t deposit his/ her balance within 30 days of receipt of notice from the company.
          </li>
          <li className="pl-1">
            If the member has not done a transaction of minimum Rs-10,000/-continuously in the past 2 Years.
          </li>
          <li className="pl-1">
            If the Member has been sentenced by an authorized court for any criminal offence other than political reason.
          </li>
        </ol>

        {/* Signature & Stamp Boxes Area */}
        <div className="mt-14 sm:mt-20 pt-6 space-y-8">
          {/* Row 1: Customer Sign./Thumb impression */}
          <div className="flex items-center justify-between gap-4">
            <div className="w-1/2 font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between pr-4">
              <span>Customer Sign./Thumb impression</span>
              <span>Stamp &amp;</span>
            </div>
            <div className="w-1/2 flex justify-end">
              <div className="border-2 border-[#003E9E] h-24 sm:h-28 w-64 sm:w-80 bg-white flex items-center justify-center p-2 relative">
                {!isBlank && (
                  d.digitalSignature || d.signature || d.signatureData ? (
                    <img
                      src={d.digitalSignature || d.signature || d.signatureData}
                      alt="Customer Signature"
                      className="max-h-20 max-w-[85%] object-contain"
                    />
                  ) : (
                    <span className="font-serif italic font-bold text-base sm:text-lg text-[#003E9E]">
                      {d.name || d.fullName || 'R. Sharma'}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Office Stamp & Signature of Authorized officer */}
          <div className="flex items-center justify-between gap-4">
            <div className="w-1/2 font-bold text-xs sm:text-sm text-slate-900 leading-snug">
              <div>Office Stamp &amp; Signature</div>
              <div>Signature of Authorized officer</div>
            </div>
            <div className="w-1/2 flex justify-end">
              <div className="border-2 border-[#003E9E] h-24 sm:h-28 w-64 sm:w-80 bg-white flex items-center justify-center p-2 relative">
                {!isBlank && (
                  <div className="w-20 h-20 rounded-full border-2 border-[#003E9E]/70 text-[#003E9E] text-[9px] font-black flex items-center justify-center text-center rotate-[-10deg]">
                    NEWUTKAL
                    <br />
                    OFFICIAL
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OfficialMembershipForm;
