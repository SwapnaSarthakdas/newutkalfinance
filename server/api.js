import crypto from 'crypto';
import { db, hashPassword, verifyPassword, generateId } from './db.js';

// Auto-detect identifier type
export function detectIdentifierType(value) {
  if (!value) return 'UNKNOWN';
  const clean = value.trim();

  // If contains @ -> EMAIL
  if (clean.includes('@')) {
    return 'EMAIL';
  }

  // If pure digits or standard phone with +91 -> PHONE
  const digits = clean.replace(/\D/g, '');
  if ((digits.length === 10 || (digits.length === 12 && digits.startsWith('91'))) && !/[a-zA-Z]/.test(clean)) {
    return 'PHONE';
  }

  // If starts with EMP or ADM -> EMP_ID
  if (/^(EMP|ADM)/i.test(clean)) {
    return 'EMP_ID';
  }

  // If starts with UF -> MEMBERSHIP_ID
  if (/^UF/i.test(clean)) {
    return 'MEMBERSHIP_ID';
  }

  // Fallback if alphanumeric
  if (digits.length >= 10) {
    return 'PHONE';
  }

  return 'USERNAME';
}

// Request Body Parser helper
export async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

// Send JSON response helper
export function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Master API Handler
export async function handleApiRequest(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const method = req.method.toUpperCase();

  try {
    // -------------------------------------------------------------
    // AUTHENTICATION ROUTES
    // -------------------------------------------------------------

    // POST /api/auth/validate-unique
    if (pathname === '/api/auth/validate-unique' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { email, mobileNumber, empId, membershipId } = body;
      const check = db.checkUniqueness({ email, mobileNumber, empId, membershipId });
      return sendJson(res, 200, check);
    }

    // POST /api/auth/register
    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await parseJsonBody(req);
      const {
        // Step 1: Personal
        title = 'Mr.',
        firstName,
        middleName = '',
        lastName,
        fullName,
        fatherOrHusbandName,
        guardianType = 'S/o.',
        dob,
        age,
        gender = 'Male',
        maritalStatus = 'Married',
        education = 'Graduate / P.G.',
        religion = 'Hindu',
        category = 'General',
        occupation = 'Business',
        // Step 2: Contact & Address
        mobileNumber,
        alternateMobile = '',
        email,
        panNo,
        permanentAddress,
        correspondenceAddress,
        // Step 3: Company & Membership
        empId,
        membershipId,
        branchId = 'BR-001',
        associateId = 'ASC-001',
        password,
        // Step 4: Nominee
        nominee,
        // Step 5: Share Details
        shareCount = 10,
        repaymentMode = 'First depositor',
        taxDeduction = 'No',
        form15g = true,
        // Step 6: Identity Documents
        primaryDocType = 'Aadhaar Card',
        primaryDocNumber,
        documents = [],
        // Step 7: Witness
        witness,
        // Step 8: Terms
        agreedTerms,
        // Step 9: Signature
        signatureData,
        signatureDate = new Date().toISOString().split('T')[0]
      } = body;

      // Server-Side Validations
      if (!firstName || !lastName) {
        return sendJson(res, 400, { success: false, message: 'First name and last name are required.' });
      }
      if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 10) {
        return sendJson(res, 400, { success: false, message: 'Valid 10-digit mobile number is required.' });
      }
      if (!email || !email.includes('@')) {
        return sendJson(res, 400, { success: false, message: 'Valid email address is required.' });
      }
      const effectivePassword = password && password.length >= 6 ? password : 'member123';
      if (!agreedTerms && !body.agreeTerms) {
        return sendJson(res, 400, { success: false, message: 'You must accept the statutory terms and conditions.' });
      }

      // Check Uniqueness
      const uniqueCheck = db.checkUniqueness({ email, mobileNumber, empId, membershipId });
      if (!uniqueCheck.isUnique) {
        return sendJson(res, 409, { success: false, message: uniqueCheck.message, field: uniqueCheck.field });
      }

      // Generate IDs
      const applicationId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const userId = `USR-MEM-${Math.floor(1000 + Math.random() * 9000)}`;
      const computedFullName = fullName || `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim();

      // Create User Record
      const userRecord = db.insert('users', {
        id: userId,
        username: email.split('@')[0],
        email: email.trim().toLowerCase(),
        mobile_number: mobileNumber.trim(),
        emp_id: empId || null,
        membership_id: membershipId || null,
        password_hash: hashPassword(effectivePassword),
        role: 'MEMBER',
        failed_login_attempts: 0,
        locked_until: null
      });

      // Fetch Branch and Associate details
      const branch = db.findById('branches', branchId) || db.table('branches')[0];
      const associate = db.findById('associates', associateId) || db.table('associates')[0];

      // Create Application Record (Status: Submitted)
      const applicationRecord = db.insert('membership_applications', {
        id: applicationId,
        user_id: userId,
        member_id: membershipId || null, // assigned membership ID
        emp_id: empId || null,
        status: 'Submitted',
        rejection_reason: null,
        correction_notes: null,
        membership_fee: 200,
        payment_method: body.paymentMethod || body.payment_method || 'UPI',
        payment_txn_ref: body.paymentTxnRef || body.payment_txn_ref || body.paymentRef || null,
        payment_status: 'Pending Admin Verification',
        membership_fee_receipt: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        share_number: `SH-${Math.floor(1000 + Math.random() * 9000)}`,
        share_count: Number(shareCount) || 10,
        share_value: 200,
        share_date: signatureDate.replace(/-/g, ''),
        depositor_status: 'Share Holder',
        repayment_preference: repaymentMode,
        tax_deducted: taxDeduction,
        form_15g_enclosed: Boolean(form15g),
        signature_data: signatureData || null,
        signature_date: signatureDate
      });

      // Create Addresses
      if (permanentAddress) {
        db.insert('addresses', {
          id: generateId('ADDR'),
          application_id: applicationId,
          member_id: null,
          type: 'Permanent',
          address_line: permanentAddress.address || '',
          taluka: permanentAddress.taluka || '',
          district: permanentAddress.district || 'Khurda',
          state: permanentAddress.state || 'Odisha',
          pin_code: permanentAddress.pinCode || '751001',
          mobile_number: mobileNumber
        });
      }

      if (correspondenceAddress) {
        db.insert('addresses', {
          id: generateId('ADDR'),
          application_id: applicationId,
          member_id: null,
          type: 'Correspondence',
          address_line: correspondenceAddress.address || permanentAddress?.address || '',
          district: correspondenceAddress.district || permanentAddress?.district || 'Khurda',
          state: correspondenceAddress.state || permanentAddress?.state || 'Odisha',
          pin_code: correspondenceAddress.pinCode || permanentAddress?.pinCode || '751001',
          mobile_number: correspondenceAddress.mobileNumber || mobileNumber
        });
      }

      // Create Nominee
      if (nominee) {
        db.insert('nominees', {
          id: generateId('NOM'),
          application_id: applicationId,
          member_id: null,
          title: nominee.title || 'Mr.',
          name: nominee.name || '',
          last_name: nominee.lastName || '',
          relationship: nominee.relationship || 'Spouse',
          dob: nominee.dob || null,
          age: nominee.age ? Number(nominee.age) : null,
          address: nominee.address || permanentAddress?.address || '',
          mobile_number: nominee.mobileNumber || '',
          id_details: nominee.idDetails || ''
        });
      }

      // Create Witness
      if (witness) {
        db.insert('witnesses', {
          id: generateId('WIT'),
          application_id: applicationId,
          member_id: null,
          name: witness.name || '',
          is_member: Boolean(witness.isMember),
          membership_number: witness.membershipNumber || '',
          mobile_number: witness.mobileNumber || '',
          address: witness.address || '',
          district: witness.district || '',
          state: witness.state || '',
          pin_code: witness.pinCode || '',
          proof_type: witness.proofType || 'Aadhaar Card',
          proof_number: witness.proofNumber || ''
        });
      }

      // Create Share Details
      db.insert('share_details', {
        id: generateId('SHR'),
        application_id: applicationId,
        member_id: null,
        share_number: applicationRecord.share_number,
        share_count: applicationRecord.share_count,
        share_value: applicationRecord.share_value,
        share_date: signatureDate,
        repayment_mode: repaymentMode,
        certificate_number: `CERT-UTK-${Math.floor(1000 + Math.random() * 9000)}`
      });

      // Create Documents
      const defaultDocs = [
        { type: '3 Colour Photographs', docNumber: 'PHOTO-SUBMITTED' },
        { type: primaryDocType, docNumber: primaryDocNumber || 'PENDING' },
        { type: 'Educational Certificate', docNumber: 'DEGREE-DOC' },
        { type: 'Birth Certificate', docNumber: 'DOB-PROOF' },
        { type: 'Ration Card / Statement / Electricity Bill', docNumber: 'RESIDENCE-PROOF' }
      ];

      for (const d of defaultDocs) {
        const uploadedMatch = (documents || []).find((u) => u.type === d.type || u.documentType === d.type);
        db.insert('documents', {
          id: generateId('DOC'),
          application_id: applicationId,
          member_id: null,
          document_type: d.type,
          document_number: uploadedMatch?.documentNumber || d.docNumber,
          file_name: uploadedMatch?.fileName || `${d.type.toLowerCase().replace(/\s+/g, '_')}.pdf`,
          file_url: uploadedMatch?.fileUrl || null,
          status: uploadedMatch ? 'Uploaded' : 'Not Uploaded',
          rejection_reason: null,
          verified_by: null,
          verified_at: null
        });
      }

      // Create Pending Member record so applicant has an account
      const memberRecord = db.insert('members', {
        id: membershipId || `PENDING-${applicationId}`,
        membership_id: membershipId || null,
        user_id: userId,
        application_id: applicationId,
        emp_id: empId || null,
        title,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        name: computedFullName,
        fullName: computedFullName,
        father_or_husband_name: fatherOrHusbandName || '',
        fatherOrHusbandName: fatherOrHusbandName || '',
        guardian_type: guardianType,
        guardianType: guardianType,
        dob: dob || '1995-01-01',
        age: age ? Number(age) : 29,
        gender,
        marital_status: maritalStatus,
        maritalStatus: maritalStatus,
        education,
        religion,
        category,
        occupation,
        branch_id: branch.id,
        branch_name: branch.name,
        branch_code: branch.code,
        branchName: branch.name,
        branchCode: branch.code,
        associate_id: associate.id,
        associate_code: associate.code,
        associate_name: associate.name,
        associateName: associate.name,
        associateCode: associate.code,
        account_status: 'Pending Verification',
        accountStatus: 'Pending Verification',
        kyc_status: 'Under Review',
        kycStatus: 'Under Review',
        available_balance: 0,
        total_deposits: 0,
        active_loan: 0,
        joined_date: new Date().toISOString().split('T')[0],
        joinedDate: new Date().toISOString().split('T')[0],
        pan_no: panNo || '',
        panNo: panNo || '',
        alternate_mobile: alternateMobile || '',
        alternateMobile: alternateMobile || '',
        phone: mobileNumber,
        mobileNumber: mobileNumber,
        email: email,
        permanent_address: permanentAddress?.address || '',
        permanentAddress: permanentAddress || null,
        address: permanentAddress?.address || '',
        taluka: permanentAddress?.taluka || '',
        city: permanentAddress?.district || permanentAddress?.taluka || 'Bhubaneswar',
        district: permanentAddress?.district || 'Khurda',
        state: permanentAddress?.state || 'Odisha',
        pinCode: permanentAddress?.pinCode || '751001',
        correspondence_address: correspondenceAddress?.address || permanentAddress?.address || '',
        correspondenceAddress: correspondenceAddress || null,
        nominee_name: nominee?.name || '',
        nomineeName: nominee?.name || '',
        nominee_relationship: nominee?.relationship || '',
        nomineeRelationship: nominee?.relationship || '',
        nominee_age: nominee?.age || null,
        nomineeAge: nominee?.age || null,
        nominee_address: nominee?.address || '',
        nomineeAddress: nominee?.address || '',
        nominee: nominee || null,
        witness_name: witness?.name || '',
        witnessName: witness?.name || '',
        witness_mobile: witness?.mobileNumber || '',
        witnessMobile: witness?.mobileNumber || '',
        witness_address: witness?.address || '',
        witnessAddress: witness?.address || '',
        witness: witness || null,
        share_count: Number(shareCount) || 10,
        shareCount: Number(shareCount) || 10,
        repayment_mode: repaymentMode,
        repaymentMode: repaymentMode,
        tax_deduction: taxDeduction,
        form15g: Boolean(form15g),
        signature_data: signatureData || null,
        signatureData: signatureData || null,
        signature_date: signatureDate,
        payment_method: body.paymentMethod || body.payment_method || 'UPI',
        paymentMethod: body.paymentMethod || body.payment_method || 'UPI',
        payment_txn_ref: body.paymentTxnRef || body.payment_txn_ref || body.paymentRef || null,
        paymentTxnRef: body.paymentTxnRef || body.payment_txn_ref || body.paymentRef || null,
        payment_status: 'Pending Admin Verification'
      });

      // Notification
      db.insert('notifications', {
        id: generateId('NOTIF'),
        target_role: 'ADMIN',
        user_id: null,
        title: 'New Statutory Membership Application',
        message: `${computedFullName} submitted application ${applicationId} (Fee ₹200 recorded via ${body.paymentMethod || body.payment_method || 'UPI'}).`,
        type: 'member',
        read: false,
        link: '/admin/applications'
      });

      // Audit Log
      db.logAudit({
        actorId: userId,
        actorName: computedFullName,
        actorRole: 'MEMBER',
        action: 'APPLICATION_SUBMITTED',
        targetType: 'membership_application',
        targetId: applicationId,
        details: `Submitted 9-step membership application ${applicationId}`
      });

      // Generate Session Token
      const token = `token_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
      db.insert('sessions', {
        id: generateId('SES'),
        user_id: userId,
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      return sendJson(res, 201, {
        success: true,
        message: 'Membership application submitted successfully!',
        applicationId,
        user: {
          id: userId,
          name: computedFullName,
          email: userRecord.email,
          mobileNumber: userRecord.mobile_number,
          empId: userRecord.emp_id,
          membershipId: userRecord.membership_id,
          role: 'MEMBER'
        },
        member: memberRecord,
        application: applicationRecord,
        token
      });
    }

    // POST /api/auth/login
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { identifier, password, requestedRole } = body;

      if (!identifier || !password) {
        return sendJson(res, 400, { success: false, message: 'Identifier and password are required.' });
      }

      const idType = detectIdentifierType(identifier);
      const cleanId = identifier.trim().toLowerCase();
      const cleanDigits = identifier.replace(/\D/g, '').slice(-10);

      // Find user
      const users = db.table('users');
      let user = users.find((u) => {
        if (cleanId === u.email?.toLowerCase()) return true;
        if (cleanId === u.username?.toLowerCase()) return true;
        if (cleanId === u.emp_id?.toLowerCase()) return true;
        if (cleanId === u.membership_id?.toLowerCase()) return true;
        if (cleanDigits && u.mobile_number) {
          const uMob = u.mobile_number.replace(/\D/g, '').slice(-10);
          if (uMob === cleanDigits) return true;
        }
        return false;
      });

      // Admin role match fallback for default admin demo
      if (!user && (cleanId.includes('admin') || requestedRole === 'ADMIN')) {
        user = users.find((u) => u.role === 'ADMIN');
      }

      // Member role match fallback for default member demo
      if (!user && (cleanId.includes('member') || cleanId.includes('rajesh') || cleanDigits === '9876543210' || cleanId === 'rajesh.sharma@utkalfinance.com' || requestedRole === 'MEMBER')) {
        user = users.find((u) => u.role === 'MEMBER');
      }

      if (!user) {
        return sendJson(res, 404, {
          success: false,
          message: 'No account found matching this Mobile Number, EMP ID, or Email. Please check or register.'
        });
      }

      // Check Account Lockout (5 failed attempts locks for 15 mins)
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        const remainingMinutes = Math.ceil((new Date(user.locked_until) - new Date()) / (60 * 1000));
        return sendJson(res, 423, {
          success: false,
          message: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute(s) or reset your password.`
        });
      }

      // Verify Password
      const isValid = verifyPassword(password, user.password_hash);
      if (!isValid) {
        const newFailed = (user.failed_login_attempts || 0) + 1;
        const updates = { failed_login_attempts: newFailed };

        if (newFailed >= 5) {
          updates.locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        }

        db.update('users', user.id, updates);

        db.logAudit({
          actorId: user.id,
          actorName: user.username,
          actorRole: user.role,
          action: 'LOGIN_FAILED',
          targetType: 'user',
          targetId: user.id,
          details: `Failed password attempt (${newFailed}/5)`
        });

        if (newFailed >= 5) {
          return sendJson(res, 423, {
            success: false,
            message: 'Account locked for 15 minutes due to 5 consecutive failed login attempts.'
          });
        }

        return sendJson(res, 401, {
          success: false,
          message: `Incorrect password. ${5 - newFailed} attempt(s) remaining before account lockout.`
        });
      }

      // Clear failed login attempts on successful login
      db.update('users', user.id, { failed_login_attempts: 0, locked_until: null });

      // Generate Session Token
      const token = `token_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
      db.insert('sessions', {
        id: generateId('SES'),
        user_id: user.id,
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      // Find Member record and application
      const member = db.findOne('members', (m) => m.user_id === user.id) || null;
      const application = db.findOne('membership_applications', (a) => a.user_id === user.id) || null;

      db.logAudit({
        actorId: user.id,
        actorName: member?.name || user.username,
        actorRole: user.role,
        action: 'LOGIN_SUCCESS',
        targetType: 'user',
        targetId: user.id,
        details: `Logged in via ${idType} (${identifier})`
      });

      return sendJson(res, 200, {
        success: true,
        token,
        role: user.role,
        user: {
          id: user.id,
          email: user.email,
          mobileNumber: user.mobile_number,
          empId: user.emp_id,
          membershipId: user.membership_id || member?.id,
          role: user.role
        },
        member: member ? {
          ...member,
          email: user.email,
          phone: user.mobile_number,
          empId: user.emp_id || member.emp_id
        } : null,
        application
      });
    }

    // POST /api/auth/forgot-password
    if (pathname === '/api/auth/forgot-password' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { identifier } = body;
      const cleanDigits = (identifier || '').replace(/\D/g, '').slice(-10);

      const user = db.findOne('users', (u) =>
        u.email?.toLowerCase() === identifier?.toLowerCase() ||
        (cleanDigits && u.mobile_number?.replace(/\D/g, '').slice(-10) === cleanDigits)
      );

      if (!user) {
        return sendJson(res, 404, { success: false, message: 'No registered user found for this Email or Mobile Number.' });
      }

      const resetToken = `reset_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
      db.update('users', user.id, { reset_token: resetToken, reset_expires: Date.now() + 3600000 });

      db.logAudit({
        actorId: user.id,
        actorName: user.username,
        actorRole: user.role,
        action: 'PASSWORD_RESET_REQUESTED',
        targetType: 'user',
        targetId: user.id,
        details: 'Password recovery token generated.'
      });

      return sendJson(res, 200, {
        success: true,
        message: 'Password recovery instructions have been sent to your registered Email and Mobile number.',
        resetToken // simulated OTP/token for immediate UI handling
      });
    }

    // POST /api/auth/reset-password
    if (pathname === '/api/auth/reset-password' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { resetToken, newPassword } = body;

      if (!resetToken || !newPassword || newPassword.length < 6) {
        return sendJson(res, 400, { success: false, message: 'Valid token and minimum 6-character password required.' });
      }

      const user = db.findOne('users', (u) => u.reset_token === resetToken && u.reset_expires > Date.now());
      if (!user) {
        return sendJson(res, 400, { success: false, message: 'Password reset token has expired or is invalid.' });
      }

      db.update('users', user.id, {
        password_hash: hashPassword(newPassword),
        reset_token: null,
        reset_expires: null,
        failed_login_attempts: 0,
        locked_until: null
      });

      db.logAudit({
        actorId: user.id,
        actorName: user.username,
        actorRole: user.role,
        action: 'PASSWORD_RESET_COMPLETED',
        targetType: 'user',
        targetId: user.id,
        details: 'Password successfully reset.'
      });

      return sendJson(res, 200, { success: true, message: 'Password has been updated successfully. You can now sign in.' });
    }

    // -------------------------------------------------------------
    // MEMBERSHIP APPLICATIONS WORKFLOW (ADMIN & MEMBER)
    // -------------------------------------------------------------

    // GET /api/applications
    if (pathname === '/api/applications' && method === 'GET') {
      const statusFilter = urlObj.searchParams.get('status');
      const search = (urlObj.searchParams.get('search') || '').toLowerCase();

      let apps = db.findAll('membership_applications');

      // Join with Member, User, Addresses, Nominee, Documents, Share, Witness
      const detailedApps = apps.map((app) => {
        const user = db.findById('users', app.user_id) || {};
        const member = db.findOne('members', (m) => m.application_id === app.id) || {};
        const addresses = db.findAll('addresses', (a) => a.application_id === app.id);
        const nominee = db.findOne('nominees', (n) => n.application_id === app.id);
        const witness = db.findOne('witnesses', (w) => w.application_id === app.id);
        const documents = db.findAll('documents', (d) => d.application_id === app.id);
        const share = db.findOne('share_details', (s) => s.application_id === app.id);

        const permAddr = addresses.find((a) => a.type === 'Permanent') || {};
        const corrAddr = addresses.find((a) => a.type === 'Correspondence') || {};

        const fullName =
          member.fullName ||
          member.name ||
          user.name ||
          `${member.first_name || ''} ${member.last_name || ''}`.trim() ||
          'New Applicant';

        return {
          ...app,
          user: { id: user.id, email: user.email, mobileNumber: user.mobile_number, empId: user.emp_id },
          member: {
            ...member,
            name: fullName,
            fullName,
            email: user.email || member.email,
            phone: user.mobile_number || member.phone || member.mobileNumber,
            address: permAddr.address_line || member.permanent_address || member.address
          },
          name: fullName,
          fullName,
          email: user.email || member.email || app.email || '',
          phone: user.mobile_number || member.phone || member.mobileNumber || '',
          mobileNumber: user.mobile_number || member.phone || member.mobileNumber || '',
          fatherOrHusbandName: member.father_or_husband_name || member.fatherOrHusbandName || '',
          guardianType: member.guardian_type || member.guardianType || 'S/o.',
          dob: member.dob || '',
          age: member.age || '',
          gender: member.gender || 'Male',
          maritalStatus: member.marital_status || member.maritalStatus || 'Married',
          education: member.education || 'Graduate / P.G.',
          religion: member.religion || 'Hindu',
          category: member.category || 'General',
          occupation: member.occupation || 'Business',
          panNo: member.pan_no || member.panNo || '',
          alternateMobile: member.alternate_mobile || member.alternateMobile || '',
          branchName: member.branch_name || member.branchName || 'Bhubaneswar HQ',
          branchCode: member.branch_code || member.branchCode || '075101',
          associateName: member.associate_name || member.associateName || 'Pradeep Kumar Jena',
          associateCode: member.associate_code || member.associateCode || 'UTK-ASC-101',
          permanent_address: permAddr.address_line || member.permanent_address || member.address || '',
          permanentAddress: {
            address: permAddr.address_line || member.permanent_address || member.address || '',
            taluka: permAddr.taluka || member.taluka || '',
            district: permAddr.district || member.district || 'Khurda',
            state: permAddr.state || member.state || 'Odisha',
            pinCode: permAddr.pin_code || member.pinCode || '751001'
          },
          correspondence_address: corrAddr.address_line || member.correspondence_address || permAddr.address_line || member.address || '',
          correspondenceAddress: {
            address: corrAddr.address_line || member.correspondence_address || permAddr.address_line || member.address || '',
            district: corrAddr.district || permAddr.district || 'Khurda',
            state: corrAddr.state || permAddr.state || 'Odisha',
            pinCode: corrAddr.pin_code || permAddr.pin_code || '751001',
            mobileNumber: corrAddr.mobile_number || user.mobile_number || member.phone || ''
          },
          nominee_name: nominee?.name || member.nominee_name || member.nomineeName || '',
          nominee_relation: nominee?.relationship || member.nominee_relationship || member.nomineeRelationship || '',
          nominee_age: nominee?.age || member.nominee_age || member.nomineeAge || '',
          nominee_address: nominee?.address || member.nominee_address || member.nomineeAddress || '',
          nominee: nominee ? {
            title: nominee.title || 'Mr.',
            name: nominee.name || '',
            lastName: nominee.last_name || '',
            relationship: nominee.relationship || '',
            dob: nominee.dob || null,
            age: nominee.age || null,
            address: nominee.address || '',
            mobileNumber: nominee.mobile_number || '',
            idDetails: nominee.id_details || ''
          } : (member.nominee || null),
          witness_name: witness?.name || member.witness_name || member.witnessName || '',
          witness_is_member: witness ? Boolean(witness.is_member) : Boolean(member.witness_is_member),
          witness_membership_no: witness?.membership_number || member.witness_membership_number || member.witnessMembershipNo || '',
          witness_mobile: witness?.mobile_number || member.witness_mobile || member.witnessMobile || '',
          witness_address: witness?.address || member.witness_address || member.witnessAddress || '',
          witness: witness ? {
            name: witness.name,
            isMember: Boolean(witness.is_member),
            membershipNumber: witness.membership_number,
            mobileNumber: witness.mobile_number,
            address: witness.address,
            district: witness.district,
            state: witness.state,
            pinCode: witness.pin_code,
            proofType: witness.proof_type,
            proofNumber: witness.proof_number
          } : (member.witness || null),
          documents: documents.length ? documents : (member.documents || []),
          share: share || null,
          share_number: app.share_number || share?.share_number || 'SH-8492',
          share_count: Number(app.share_count) || share?.share_count || 10,
          share_value: Number(app.share_value) || share?.share_value || 200,
          repayment_preference: app.repayment_preference || 'First depositor',
          depositor_status: app.depositor_status || 'Share Holder',
          form_15g_enclosed: app.form_15g_enclosed ?? true,
          signature: app.signature_data || member.signature_data || null,
          signatureData: app.signature_data || member.signature_data || null,
          signatureDate: app.signature_date || member.signature_date || null,
          membership_fee: app.membership_fee || 200,
          payment_amount: app.membership_fee || 200,
          payment_status: app.payment_status || 'Pending Admin Verification',
          payment_method: app.payment_method || 'UPI',
          payment_txn_ref: app.payment_txn_ref || `UTR${Date.now().toString().slice(-8)}`
        };
      });

      let filtered = detailedApps;
      if (statusFilter && statusFilter !== 'ALL') {
        filtered = filtered.filter((a) => a.status.toLowerCase() === statusFilter.toLowerCase());
      }
      if (search) {
        filtered = filtered.filter((a) =>
          a.id.toLowerCase().includes(search) ||
          a.member?.name?.toLowerCase().includes(search) ||
          a.user?.email?.toLowerCase().includes(search) ||
          a.user?.mobileNumber?.includes(search) ||
          a.emp_id?.toLowerCase().includes(search)
        );
      }

      return sendJson(res, 200, { success: true, applications: filtered, total: filtered.length });
    }

    // GET /api/applications/:id
    if (pathname.startsWith('/api/applications/') && method === 'GET') {
      const appId = pathname.split('/')[3];
      const app = db.findById('membership_applications', appId);

      if (!app) {
        return sendJson(res, 404, { success: false, message: 'Application not found' });
      }

      const user = db.findById('users', app.user_id) || {};
      const member = db.findOne('members', (m) => m.application_id === app.id) || {};
      const addresses = db.findAll('addresses', (a) => a.application_id === app.id);
      const nominee = db.findOne('nominees', (n) => n.application_id === app.id);
      const witness = db.findOne('witnesses', (w) => w.application_id === app.id);
      const documents = db.findAll('documents', (d) => d.application_id === app.id);
      const auditLogs = db.findAll('audit_logs', (l) => l.target_id === app.id);
      const share = db.findOne('share_details', (s) => s.application_id === app.id);

      const permAddr = addresses.find((a) => a.type === 'Permanent') || {};
      const corrAddr = addresses.find((a) => a.type === 'Correspondence') || {};
      const fullName =
        member.fullName ||
        member.name ||
        user.name ||
        `${member.first_name || ''} ${member.last_name || ''}`.trim() ||
        'New Applicant';

      return sendJson(res, 200, {
        success: true,
        application: {
          ...app,
          user: { id: user.id, email: user.email, mobileNumber: user.mobile_number, empId: user.emp_id },
          member: {
            ...member,
            name: fullName,
            fullName,
            email: user.email || member.email,
            phone: user.mobile_number || member.phone || member.mobileNumber,
            address: permAddr.address_line || member.permanent_address || member.address
          },
          name: fullName,
          fullName,
          email: user.email || member.email || app.email || '',
          phone: user.mobile_number || member.phone || member.mobileNumber || '',
          mobileNumber: user.mobile_number || member.phone || member.mobileNumber || '',
          fatherOrHusbandName: member.father_or_husband_name || member.fatherOrHusbandName || '',
          guardianType: member.guardian_type || member.guardianType || 'S/o.',
          dob: member.dob || '',
          age: member.age || '',
          gender: member.gender || 'Male',
          maritalStatus: member.marital_status || member.maritalStatus || 'Married',
          education: member.education || 'Graduate / P.G.',
          religion: member.religion || 'Hindu',
          category: member.category || 'General',
          occupation: member.occupation || 'Business',
          panNo: member.pan_no || member.panNo || '',
          alternateMobile: member.alternate_mobile || member.alternateMobile || '',
          branchName: member.branch_name || member.branchName || 'Bhubaneswar HQ',
          branchCode: member.branch_code || member.branchCode || '075101',
          associateName: member.associate_name || member.associateName || 'Pradeep Kumar Jena',
          associateCode: member.associate_code || member.associateCode || 'UTK-ASC-101',
          permanent_address: permAddr.address_line || member.permanent_address || member.address || '',
          permanentAddress: {
            address: permAddr.address_line || member.permanent_address || member.address || '',
            taluka: permAddr.taluka || member.taluka || '',
            district: permAddr.district || member.district || 'Khurda',
            state: permAddr.state || member.state || 'Odisha',
            pinCode: permAddr.pin_code || member.pinCode || '751001'
          },
          correspondence_address: corrAddr.address_line || member.correspondence_address || permAddr.address_line || member.address || '',
          correspondenceAddress: {
            address: corrAddr.address_line || member.correspondence_address || permAddr.address_line || member.address || '',
            district: corrAddr.district || permAddr.district || 'Khurda',
            state: corrAddr.state || permAddr.state || 'Odisha',
            pinCode: corrAddr.pin_code || permAddr.pin_code || '751001',
            mobileNumber: corrAddr.mobile_number || user.mobile_number || member.phone || ''
          },
          addresses,
          nominee: nominee ? {
            title: nominee.title || 'Mr.',
            name: nominee.name || '',
            lastName: nominee.last_name || '',
            relationship: nominee.relationship || '',
            dob: nominee.dob || null,
            age: nominee.age || null,
            address: nominee.address || '',
            mobileNumber: nominee.mobile_number || '',
            idDetails: nominee.id_details || ''
          } : (member.nominee || null),
          nominee_name: nominee?.name || member.nominee_name || member.nomineeName || '',
          nominee_relation: nominee?.relationship || member.nominee_relationship || member.nomineeRelationship || '',
          nominee_age: nominee?.age || member.nominee_age || member.nomineeAge || '',
          nominee_address: nominee?.address || member.nominee_address || member.nomineeAddress || '',
          witness: witness ? {
            name: witness.name,
            isMember: Boolean(witness.is_member),
            membershipNumber: witness.membership_number,
            mobileNumber: witness.mobile_number,
            address: witness.address,
            district: witness.district,
            state: witness.state,
            pinCode: witness.pin_code,
            proofType: witness.proof_type,
            proofNumber: witness.proof_number
          } : (member.witness || null),
          witness_name: witness?.name || member.witness_name || member.witnessName || '',
          witness_is_member: witness ? Boolean(witness.is_member) : Boolean(member.witness_is_member),
          witness_membership_no: witness?.membership_number || member.witness_membership_number || member.witnessMembershipNo || '',
          witness_mobile: witness?.mobile_number || member.witness_mobile || member.witnessMobile || '',
          witness_address: witness?.address || member.witness_address || member.witnessAddress || '',
          documents: documents.length ? documents : (member.documents || []),
          share: share || null,
          share_number: app.share_number || share?.share_number || 'SH-8492',
          share_count: Number(app.share_count) || share?.share_count || 10,
          share_value: Number(app.share_value) || share?.share_value || 200,
          repayment_preference: app.repayment_preference || 'First depositor',
          depositor_status: app.depositor_status || 'Share Holder',
          form_15g_enclosed: app.form_15g_enclosed ?? true,
          signature: app.signature_data || member.signature_data || null,
          signatureData: app.signature_data || member.signature_data || null,
          signatureDate: app.signature_date || member.signature_date || null,
          membership_fee: app.membership_fee || 200,
          payment_amount: app.membership_fee || 200,
          payment_status: app.payment_status || 'Pending Admin Verification',
          payment_method: app.payment_method || 'UPI',
          payment_txn_ref: app.payment_txn_ref || `UTR${Date.now().toString().slice(-8)}`,
          auditLogs
        }
      });
    }

    // PUT /api/applications/:id/status (Approve / Reject / Correction)
    if (pathname.startsWith('/api/applications/') && pathname.endsWith('/status') && method === 'PUT') {
      const appId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { status, rejectionReason, correctionNotes, assignedEmpId, assignedBranchId, adminName } = body;

      const app = db.findById('membership_applications', appId);
      if (!app) {
        return sendJson(res, 404, { success: false, message: 'Application not found.' });
      }

      const updates = { status };

      if (status === 'Approved') {
        // Allocate official Membership ID (UF-2026-XXXX)
        const membershipId = `UF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const empId = assignedEmpId || app.emp_id || `EMP-2026-${Math.floor(100 + Math.random() * 900)}`;

        updates.member_id = membershipId;
        updates.emp_id = empId;
        updates.approval_date = new Date().toISOString().split('T')[0];
        updates.approved_by = adminName || 'Bhagirathi Mohapatra (Managing Director)';

        // Update User with allocated Membership ID and EMP ID
        db.update('users', app.user_id, {
          membership_id: membershipId,
          emp_id: empId
        });

        // Update Member Record
        const member = db.findOne('members', (m) => m.application_id === appId);
        if (member) {
          db.update('members', member.id, {
            id: membershipId,
            emp_id: empId,
            account_status: 'Active',
            kyc_status: 'Verified',
            branch_id: assignedBranchId || member.branch_id
          });
        }

        // Notify Member
        db.insert('notifications', {
          id: generateId('NOTIF'),
          target_role: 'MEMBER',
          user_id: app.user_id,
          title: '🎉 Membership Application Approved!',
          message: `Congratulations! Your Membership ID is ${membershipId}. You now have full statutory member privileges.`,
          type: 'member',
          read: false,
          link: '#member-dashboard'
        });

        db.logAudit({
          actorId: 'ADM-001',
          actorName: adminName || 'Admin Executive',
          actorRole: 'ADMIN',
          action: 'APPLICATION_APPROVED',
          targetType: 'membership_application',
          targetId: appId,
          details: `Approved application ${appId}. Allocated Member ID ${membershipId}, EMP ID ${empId}.`
        });
      } else if (status === 'Rejected') {
        if (!rejectionReason) {
          return sendJson(res, 400, { success: false, message: 'Rejection reason is required.' });
        }
        updates.rejection_reason = rejectionReason;

        // Update Member Status
        const member = db.findOne('members', (m) => m.application_id === appId);
        if (member) {
          db.update('members', member.id, { account_status: 'Rejected' });
        }

        db.insert('notifications', {
          id: generateId('NOTIF'),
          target_role: 'MEMBER',
          user_id: app.user_id,
          title: 'Membership Application Update',
          message: `Your application ${appId} was rejected. Reason: ${rejectionReason}`,
          type: 'alert',
          read: false,
          link: '#member-dashboard'
        });

        db.logAudit({
          actorId: 'ADM-001',
          actorName: adminName || 'Admin Executive',
          actorRole: 'ADMIN',
          action: 'APPLICATION_REJECTED',
          targetType: 'membership_application',
          targetId: appId,
          details: `Rejected application ${appId}. Reason: ${rejectionReason}`
        });
      } else if (status === 'Correction Requested') {
        updates.correction_notes = correctionNotes || 'Please re-upload clear KYC documents.';
        db.logAudit({
          actorId: 'ADM-001',
          actorName: adminName || 'Admin Executive',
          actorRole: 'ADMIN',
          action: 'APPLICATION_CORRECTION_REQUESTED',
          targetType: 'membership_application',
          targetId: appId,
          details: `Correction requested for application ${appId}: ${updates.correction_notes}`
        });
      }

      const updatedApp = db.update('membership_applications', appId, updates);
      return sendJson(res, 200, { success: true, application: updatedApp });
    }

    // POST /api/applications/:id/documents (Member Uploads Document)
    if (pathname.startsWith('/api/applications/') && pathname.includes('/documents') && method === 'POST') {
      const appId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { documentType, documentNumber, fileName, fileUrl } = body;

      // Check if document already exists
      const existing = db.findOne('documents', (d) => d.application_id === appId && d.document_type === documentType);

      let doc;
      if (existing) {
        doc = db.update('documents', existing.id, {
          document_number: documentNumber || existing.document_number,
          file_name: fileName || existing.file_name,
          file_url: fileUrl || existing.file_url,
          status: 'Uploaded',
          rejection_reason: null
        });
      } else {
        doc = db.insert('documents', {
          id: generateId('DOC'),
          application_id: appId,
          document_type: documentType,
          document_number: documentNumber,
          file_name: fileName,
          file_url: fileUrl,
          status: 'Uploaded'
        });
      }

      // Update application status to Documents Verification if previously Correction
      const app = db.findById('membership_applications', appId);
      if (app && app.status === 'Correction Requested') {
        db.update('membership_applications', appId, { status: 'Documents Verification' });
      }

      return sendJson(res, 200, { success: true, document: doc });
    }

    // PUT /api/applications/:id/documents/:docId (Admin Verifies/Rejects Document)
    if (pathname.startsWith('/api/applications/') && pathname.includes('/documents/') && method === 'PUT') {
      const parts = pathname.split('/');
      const appId = parts[3];
      const docId = parts[5];
      const body = await parseJsonBody(req);
      const { status, rejectionReason, adminName } = body;

      const doc = db.findById('documents', docId);
      if (!doc) {
        return sendJson(res, 404, { success: false, message: 'Document not found.' });
      }

      const updated = db.update('documents', docId, {
        status, // 'Verified' | 'Rejected' | 'Under Review'
        rejection_reason: rejectionReason || null,
        verified_by: adminName || 'Operations Officer',
        verified_at: new Date().toISOString()
      });

      db.logAudit({
        actorId: 'ADM-001',
        actorName: adminName || 'Operations Officer',
        actorRole: 'ADMIN',
        action: `DOCUMENT_${status.toUpperCase()}`,
        targetType: 'document',
        targetId: docId,
        details: `${status} document ${doc.document_type} on application ${appId}`
      });

      return sendJson(res, 200, { success: true, document: updated });
    }

    // -------------------------------------------------------------
    // MEMBER PROFILE & SENSITIVE FIELD LOCKING
    // -------------------------------------------------------------

    // GET /api/members (List All Members with Enriched Data)
    if (pathname === '/api/members' && method === 'GET') {
      const allMembers = db.findAll('members');
      const enrichedMembers = allMembers.map((member) => {
        const user = db.findById('users', member.user_id) || {};
        const addresses = db.findAll('addresses', (a) => a.member_id === member.id || a.application_id === member.application_id);
        const nominee = db.findOne('nominees', (n) => n.member_id === member.id || n.application_id === member.application_id);
        const witness = db.findOne('witnesses', (w) => w.member_id === member.id || w.application_id === member.application_id);
        const documents = db.findAll('documents', (d) => d.member_id === member.id || d.application_id === member.application_id);
        const share = db.findOne('share_details', (s) => s.member_id === member.id || s.application_id === member.application_id);
        const application = db.findById('membership_applications', member.application_id);

        const permAddr = addresses.find((a) => a.type === 'Permanent') || {};
        const corrAddr = addresses.find((a) => a.type === 'Correspondence') || {};
        const fullName =
          member.fullName ||
          member.name ||
          user.name ||
          `${member.first_name || ''} ${member.last_name || ''}`.trim() ||
          'Registered Member';

        return {
          ...member,
          id: member.id || member.membership_id,
          membershipId: member.id || member.membership_id,
          empId: user.emp_id || member.emp_id || '',
          name: fullName,
          fullName,
          email: user.email || member.email || '',
          phone: user.mobile_number || member.phone || member.mobileNumber || '',
          mobileNumber: user.mobile_number || member.phone || member.mobileNumber || '',
          fatherOrHusbandName: member.father_or_husband_name || member.fatherOrHusbandName || '',
          guardianType: member.guardian_type || member.guardianType || 'S/o.',
          dob: member.dob || '1995-01-01',
          age: member.age || 29,
          gender: member.gender || 'Male',
          maritalStatus: member.marital_status || member.maritalStatus || 'Married',
          education: member.education || 'Graduate / P.G.',
          religion: member.religion || 'Hindu',
          category: member.category || 'General',
          occupation: member.occupation || 'Business',
          panNo: member.pan_no || member.panNo || '',
          alternateMobile: member.alternate_mobile || member.alternateMobile || '',
          branchName: member.branch_name || member.branchName || 'Bhubaneswar HQ',
          branchCode: member.branch_code || member.branchCode || '075101',
          associateName: member.associate_name || member.associateName || 'Pradeep Kumar Jena',
          associateCode: member.associate_code || member.associateCode || 'UTK-ASC-101',
          address: permAddr.address_line || member.permanent_address || member.address || '',
          city: permAddr.district || member.city || 'Bhubaneswar',
          taluka: permAddr.taluka || member.taluka || '',
          district: permAddr.district || member.district || 'Khurda',
          state: permAddr.state || member.state || 'Odisha',
          pinCode: permAddr.pin_code || member.pinCode || '751001',
          permanentAddress: {
            address: permAddr.address_line || member.permanent_address || member.address || '',
            taluka: permAddr.taluka || member.taluka || '',
            district: permAddr.district || member.district || 'Khurda',
            state: permAddr.state || member.state || 'Odisha',
            pinCode: permAddr.pin_code || member.pinCode || '751001'
          },
          correspondenceAddress: {
            address: corrAddr.address_line || member.correspondence_address || permAddr.address_line || member.address || '',
            district: corrAddr.district || member.district || 'Khurda',
            state: corrAddr.state || member.state || 'Odisha',
            pinCode: corrAddr.pin_code || member.pinCode || '751001',
            mobileNumber: corrAddr.mobile_number || user.mobile_number || member.phone || ''
          },
          nominee_name: nominee?.name || member.nominee_name || member.nomineeName || '',
          nomineeName: nominee?.name || member.nominee_name || member.nomineeName || '',
          nominee_relationship: nominee?.relationship || member.nominee_relationship || member.nomineeRelationship || '',
          nomineeRelationship: nominee?.relationship || member.nominee_relationship || member.nomineeRelationship || '',
          nominee_age: nominee?.age || member.nominee_age || member.nomineeAge || '',
          nomineeAge: nominee?.age || member.nominee_age || member.nomineeAge || '',
          nominee_address: nominee?.address || member.nominee_address || member.nomineeAddress || '',
          nomineeAddress: nominee?.address || member.nominee_address || member.nomineeAddress || '',
          nominee: nominee ? {
            title: nominee.title || 'Mr.',
            name: nominee.name || '',
            lastName: nominee.last_name || '',
            relationship: nominee.relationship || '',
            dob: nominee.dob || null,
            age: nominee.age || null,
            address: nominee.address || '',
            mobileNumber: nominee.mobile_number || '',
            idDetails: nominee.id_details || ''
          } : (member.nominee || null),
          witness_name: witness?.name || member.witness_name || member.witnessName || '',
          witnessName: witness?.name || member.witness_name || member.witnessName || '',
          witness_is_member: witness ? Boolean(witness.is_member) : Boolean(member.witness_is_member),
          witnessIsMember: witness ? Boolean(witness.is_member) : Boolean(member.witness_is_member),
          witness_membership_no: witness?.membership_number || member.witness_membership_number || member.witnessMembershipNo || '',
          witnessMembershipNo: witness?.membership_number || member.witness_membership_number || member.witnessMembershipNo || '',
          witness_mobile: witness?.mobile_number || member.witness_mobile || member.witnessMobile || '',
          witnessMobile: witness?.mobile_number || member.witness_mobile || member.witnessMobile || '',
          witness_address: witness?.address || member.witness_address || member.witnessAddress || '',
          witnessAddress: witness?.address || member.witness_address || member.witnessAddress || '',
          witness: witness ? {
            name: witness.name,
            isMember: Boolean(witness.is_member),
            membershipNumber: witness.membership_number,
            mobileNumber: witness.mobile_number,
            address: witness.address,
            district: witness.district,
            state: witness.state,
            pinCode: witness.pin_code,
            proofType: witness.proof_type,
            proofNumber: witness.proof_number
          } : (member.witness || null),
          documents: documents.length ? documents : (member.documents || []),
          share: share || null,
          shareCount: Number(member.share_count) || share?.share_count || 10,
          share_count: Number(member.share_count) || share?.share_count || 10,
          repaymentMode: member.repayment_mode || member.repaymentMode || 'First depositor',
          taxDeduction: member.tax_deduction || member.taxDeduction || 'No',
          form15g: member.form15g ?? true,
          signatureData: member.signature_data || member.signatureData || application?.signature_data || null,
          signature: member.signature_data || member.signatureData || application?.signature_data || null,
          signatureDate: member.signature_date || member.signatureDate || null,
          paymentMethod: member.payment_method || member.paymentMethod || application?.payment_method || 'UPI',
          paymentTxnRef: member.payment_txn_ref || member.paymentTxnRef || application?.payment_txn_ref || null,
          paymentStatus: member.payment_status || member.paymentStatus || application?.payment_status || 'Pending Admin Verification',
          accountStatus: member.account_status || member.accountStatus || 'Pending Verification',
          kycStatus: member.kyc_status || member.kycStatus || 'Under Review',
          availableBalance: member.available_balance || member.availableBalance || 0,
          totalDeposits: member.total_deposits || member.totalDeposits || 0,
          activeLoan: member.active_loan || member.activeLoan || 0,
          joinedDate: member.joined_date || member.joinedDate || new Date().toISOString().split('T')[0]
        };
      });

      return sendJson(res, 200, { success: true, members: enrichedMembers, total: enrichedMembers.length });
    }

    // GET /api/members/:id
    if (pathname.startsWith('/api/members/') && method === 'GET') {
      const memberId = pathname.split('/')[3];
      const member = db.findById('members', memberId) || db.findOne('members', (m) => m.id === memberId || m.user_id === memberId);

      if (!member) {
        return sendJson(res, 404, { success: false, message: 'Member not found.' });
      }

      const user = db.findById('users', member.user_id) || {};
      const addresses = db.findAll('addresses', (a) => a.member_id === member.id || a.application_id === member.application_id);
      const nominee = db.findOne('nominees', (n) => n.member_id === member.id || n.application_id === member.application_id);
      const documents = db.findAll('documents', (d) => d.member_id === member.id || d.application_id === member.application_id);
      const share = db.findOne('share_details', (s) => s.member_id === member.id || s.application_id === member.application_id);
      const application = db.findById('membership_applications', member.application_id);

      return sendJson(res, 200, {
        success: true,
        member: {
          ...member,
          email: user.email,
          phone: user.mobile_number,
          empId: user.emp_id || member.emp_id
        },
        addresses,
        nominee,
        documents,
        share,
        application
      });
    }

    // PUT /api/members/:id/profile
    if (pathname.startsWith('/api/members/') && pathname.endsWith('/profile') && method === 'PUT') {
      const memberId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { callerRole = 'MEMBER', permittedUpdates = {} } = body;

      const member = db.findById('members', memberId) || db.findOne('members', (m) => m.id === memberId);
      if (!member) {
        return sendJson(res, 404, { success: false, message: 'Member not found.' });
      }

      // Check for sensitive locked fields if called by normal member:
      const lockedFields = ['pan_no', 'panNo', 'id', 'emp_id', 'empId', 'branch_id', 'branch_name', 'account_status', 'kyc_status'];
      if (callerRole !== 'ADMIN') {
        for (const f of lockedFields) {
          if (f in permittedUpdates && permittedUpdates[f] !== member[f]) {
            return sendJson(res, 403, {
              success: false,
              message: `Field "${f}" is a verified statutory record and cannot be changed without Admin verification.`
            });
          }
        }
      }

      // Safe update
      const allowed = {
        education: permittedUpdates.education || member.education,
        occupation: permittedUpdates.occupation || member.occupation,
        marital_status: permittedUpdates.marital_status || member.marital_status,
        alternate_mobile: permittedUpdates.alternate_mobile || member.alternate_mobile
      };

      if (callerRole === 'ADMIN') {
        if (permittedUpdates.account_status) allowed.account_status = permittedUpdates.account_status;
        if (permittedUpdates.kyc_status) allowed.kyc_status = permittedUpdates.kyc_status;
        if (permittedUpdates.branch_id) allowed.branch_id = permittedUpdates.branch_id;
        if (permittedUpdates.emp_id) allowed.emp_id = permittedUpdates.emp_id;
      }

      const updated = db.update('members', member.id, allowed);

      // Update Correspondence Address if provided
      if (permittedUpdates.correspondenceAddress) {
        const corrAddr = db.findOne('addresses', (a) => (a.member_id === member.id || a.application_id === member.application_id) && a.type === 'Correspondence');
        if (corrAddr) {
          db.update('addresses', corrAddr.id, {
            address_line: permittedUpdates.correspondenceAddress.address || corrAddr.address_line,
            district: permittedUpdates.correspondenceAddress.district || corrAddr.district,
            state: permittedUpdates.correspondenceAddress.state || corrAddr.state,
            pin_code: permittedUpdates.correspondenceAddress.pinCode || corrAddr.pin_code,
            mobile_number: permittedUpdates.correspondenceAddress.mobileNumber || corrAddr.mobile_number
          });
        }
      }

      return sendJson(res, 200, { success: true, member: updated });
    }

    // -------------------------------------------------------------
    // MASTER DATA (BRANCHES, ASSOCIATES, AUDIT LOGS, NOTIFICATIONS)
    // -------------------------------------------------------------

    // GET /api/branches
    if (pathname === '/api/branches' && method === 'GET') {
      return sendJson(res, 200, { success: true, branches: db.table('branches') });
    }

    // GET /api/associates
    if (pathname === '/api/associates' && method === 'GET') {
      return sendJson(res, 200, { success: true, associates: db.table('associates') });
    }

    // GET /api/audit-logs
    if (pathname === '/api/audit-logs' && method === 'GET') {
      return sendJson(res, 200, { success: true, logs: db.table('audit_logs').slice(0, 100) });
    }

    // GET /api/notifications
    if (pathname === '/api/notifications' && method === 'GET') {
      const role = urlObj.searchParams.get('role');
      const userId = urlObj.searchParams.get('userId');

      let notifs = db.table('notifications');
      if (role) {
        notifs = notifs.filter((n) => n.target_role === role || (userId && n.user_id === userId));
      }
      return sendJson(res, 200, { success: true, notifications: notifs });
    }

    // Endpoint not found
    return sendJson(res, 404, { success: false, message: `API endpoint ${method} ${pathname} not found.` });

  } catch (err) {
    console.error(`API Error on ${method} ${pathname}:`, err);
    return sendJson(res, 500, { success: false, message: err.message || 'Internal Server Error' });
  }
}
