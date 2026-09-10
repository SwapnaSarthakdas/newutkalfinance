import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialMembers,
  initialLoans,
  initialDeposits,
  initialTransactions,
  initialNotifications,
  initialSettings
} from '../data/mockData';
import { api } from '../services/api';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // Purge legacy mock data cache once on load to ensure clean zero state
  try {
    ['members_v1', 'applications_v1', 'loans_v1', 'deposits_v1', 'transactions_v1', 'notifs_v1'].forEach((k) => {
      localStorage.removeItem(`utkal_finance_${k}`);
    });
  } catch (e) {
    // Ignore localStorage errors
  }

  // Load or fallback to initial clean data
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('utkal_finance_members_v2');
      return saved ? JSON.parse(saved) : initialMembers;
    } catch {
      return initialMembers;
    }
  });

  // Statutory Applications Workflow State (Zeroed for customer delivery)
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('utkal_finance_applications_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [branches, setBranches] = useState([
    { id: 'BR-001', code: '075101', name: 'Bhubaneswar HQ (Nayapalli, IRC Village)', district: 'Khurda', state: 'Odisha' },
    { id: 'BR-002', code: '075302', name: 'Cuttack Main Branch', district: 'Cuttack', state: 'Odisha' },
    { id: 'BR-003', code: '076903', name: 'Rourkela Commercial', district: 'Sundargarh', state: 'Odisha' },
    { id: 'BR-004', code: '076104', name: 'Berhampur Branch', district: 'Ganjam', state: 'Odisha' },
    { id: 'BR-005', code: '075205', name: 'Puri Grand Road', district: 'Puri', state: 'Odisha' }
  ]);

  const [associates, setAssociates] = useState([
    { id: 'ASC-001', code: 'UTK-ASC-101', name: 'Pradeep Kumar Jena', branch_id: 'BR-001', status: 'Active' },
    { id: 'ASC-002', code: 'UTK-ASC-102', name: 'Manoj Kumar Panda', branch_id: 'BR-002', status: 'Active' },
    { id: 'ASC-003', code: 'UTK-ASC-103', name: 'Soumya Ranjan Das', branch_id: 'BR-003', status: 'Active' },
    { id: 'ASC-004', code: 'UTK-ASC-104', name: 'Gitanjali Mohapatra', branch_id: 'BR-001', status: 'Active' }
  ]);

  const [auditLogs, setAuditLogs] = useState([]);

  const [loans, setLoans] = useState(() => {
    try {
      const saved = localStorage.getItem('utkal_finance_loans_v2');
      return saved ? JSON.parse(saved) : initialLoans;
    } catch {
      return initialLoans;
    }
  });

  const [deposits, setDeposits] = useState(() => {
    try {
      const saved = localStorage.getItem('utkal_finance_deposits_v2');
      return saved ? JSON.parse(saved) : initialDeposits;
    } catch {
      return initialDeposits;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('utkal_finance_transactions_v2');
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('utkal_finance_notifs_v2');
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('utkal_finance_settings_v2');
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  // Simple Toast state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset entire application metrics to clean 0
  const resetAllDataToZero = () => {
    setMembers([]);
    setLoans([]);
    setDeposits([]);
    setTransactions([]);
    setNotifications([]);
    setApplications([]);
    setAuditLogs([]);
    try {
      ['members_v1', 'applications_v1', 'loans_v1', 'deposits_v1', 'transactions_v1', 'notifs_v1',
       'members_v2', 'applications_v2', 'loans_v2', 'deposits_v2', 'transactions_v2', 'notifs_v2'].forEach((k) => {
        localStorage.removeItem(`utkal_finance_${k}`);
      });
    } catch (e) {}
    addToast('All metrics and rosters reset to clean 0 state', 'info');
  };

  // Synchronize members and applications from backend REST API on mount
  useEffect(() => {
    let isMounted = true;
    const syncBackendData = async () => {
      try {
        const [appsRes, membersRes] = await Promise.allSettled([
          api.applications.getAll(),
          api.members.getAll()
        ]);

        if (isMounted && appsRes.status === 'fulfilled' && appsRes.value?.applications) {
          const backendApps = appsRes.value.applications;
          setApplications((prev) => {
            const map = new Map();
            prev.forEach((a) => map.set(a.id, a));
            backendApps.forEach((a) => map.set(a.id, { ...(map.get(a.id) || {}), ...a }));
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('utkal_finance_applications_v2', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }

        if (isMounted && membersRes.status === 'fulfilled' && membersRes.value?.members) {
          const backendMembers = membersRes.value.members;
          setMembers((prev) => {
            const map = new Map();
            prev.forEach((m) => map.set(m.id, m));
            backendMembers.forEach((m) => map.set(m.id, { ...(map.get(m.id) || {}), ...m }));
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('utkal_finance_members_v2', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      } catch (err) {
        console.warn('Backend sync fallback to local storage:', err.message);
      }
    };

    syncBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('utkal_finance_members_v2', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('utkal_finance_loans_v2', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('utkal_finance_deposits_v2', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('utkal_finance_transactions_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('utkal_finance_notifs_v2', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('utkal_finance_settings_v2', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('utkal_finance_applications_v2', JSON.stringify(applications));
  }, [applications]);

  // Member Management Actions
  const addMember = (memberData) => {
    const newId = memberData.id || memberData.membershipId || `UF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMember = {
      ...memberData,
      id: newId,
      membershipId: newId,
      empId: memberData.empId || memberData.emp_id || '',
      name: memberData.name || memberData.fullName,
      fullName: memberData.fullName || memberData.name,
      title: memberData.title || 'Mr.',
      firstName: memberData.firstName || '',
      middleName: memberData.middleName || '',
      lastName: memberData.lastName || '',
      fatherOrHusbandName: memberData.fatherOrHusbandName || memberData.father_or_husband_name || '',
      guardianType: memberData.guardianType || memberData.guardian_type || 'S/o.',
      email: memberData.email,
      phone: memberData.phone || memberData.mobileNumber,
      mobileNumber: memberData.mobileNumber || memberData.phone,
      alternateMobile: memberData.alternateMobile || memberData.alternate_mobile || '',
      password: memberData.password || 'member123',
      gender: memberData.gender || 'Male',
      dob: memberData.dob || memberData.dateOfBirth || '1995-01-01',
      age: memberData.age || 29,
      maritalStatus: memberData.maritalStatus || memberData.marital_status || 'Married',
      religion: memberData.religion || 'Hindu',
      category: memberData.category || 'General',
      education: memberData.education || 'Graduate / P.G.',
      occupation: memberData.occupation || 'Professional',
      panNo: memberData.panNo || memberData.pan_no || '',
      address: memberData.address || memberData.permanentAddress?.address || '',
      city: memberData.city || memberData.permanentAddress?.district || 'Bhubaneswar',
      taluka: memberData.taluka || memberData.permanentAddress?.taluka || '',
      district: memberData.district || memberData.permanentAddress?.district || 'Khurda',
      state: memberData.state || memberData.permanentAddress?.state || 'Odisha',
      pinCode: memberData.pinCode || memberData.permanentAddress?.pinCode || '751001',
      permanentAddress: memberData.permanentAddress || {
        address: memberData.address || '',
        taluka: memberData.taluka || '',
        district: memberData.district || 'Khurda',
        state: memberData.state || 'Odisha',
        pinCode: memberData.pinCode || '751001'
      },
      correspondenceAddress: memberData.correspondenceAddress || {
        address: memberData.address || '',
        district: memberData.district || 'Khurda',
        state: memberData.state || 'Odisha',
        pinCode: memberData.pinCode || '751001',
        mobileNumber: memberData.phone || memberData.mobileNumber || ''
      },
      branchId: memberData.branchId || 'BR-001',
      branchName: memberData.branchName || memberData.branch_name || 'Bhubaneswar HQ',
      branchCode: memberData.branchCode || memberData.branch_code || '075101',
      associateId: memberData.associateId || 'ASC-001',
      associateName: memberData.associateName || memberData.associate_name || 'Pradeep Kumar Jena',
      associateCode: memberData.associateCode || memberData.associate_code || 'UTK-ASC-101',
      nominee: memberData.nominee || null,
      nomineeName: memberData.nomineeName || memberData.nominee?.name || '',
      nomineeRelationship: memberData.nomineeRelationship || memberData.nominee?.relationship || '',
      nomineeAge: memberData.nomineeAge || memberData.nominee?.age || '',
      nomineeAddress: memberData.nomineeAddress || memberData.nominee?.address || '',
      witness: memberData.witness || null,
      witnessName: memberData.witnessName || memberData.witness?.name || '',
      witnessIsMember: memberData.witnessIsMember ?? memberData.witness?.isMember ?? false,
      witnessMembershipNo: memberData.witnessMembershipNo || memberData.witness?.membershipNumber || '',
      witnessMobile: memberData.witnessMobile || memberData.witness?.mobileNumber || '',
      witnessAddress: memberData.witnessAddress || memberData.witness?.address || '',
      witnessDistrict: memberData.witnessDistrict || memberData.witness?.district || '',
      witnessState: memberData.witnessState || memberData.witness?.state || '',
      witnessPinCode: memberData.witnessPinCode || memberData.witness?.pinCode || '',
      shareCount: Number(memberData.shareCount) || 10,
      repaymentMode: memberData.repaymentMode || 'First depositor',
      taxDeduction: memberData.taxDeduction || 'No',
      form15g: memberData.form15g ?? true,
      documents: memberData.documents || [],
      primaryDocType: memberData.primaryDocType || 'Aadhaar Card',
      primaryDocNumber: memberData.primaryDocNumber || '',
      signatureData: memberData.signatureData || memberData.signature || null,
      signature: memberData.signature || memberData.signatureData || null,
      signatureDate: memberData.signatureDate || new Date().toISOString().split('T')[0],
      paymentMethod: memberData.paymentMethod || memberData.payment_method || 'UPI',
      paymentTxnRef: memberData.paymentTxnRef || memberData.payment_txn_ref || null,
      paymentAmount: memberData.paymentAmount || memberData.payment_amount || 200,
      paymentStatus: memberData.paymentStatus || memberData.payment_status || 'Pending Admin Verification',
      accountStatus: memberData.accountStatus || 'Pending Verification',
      kycStatus: memberData.kycStatus || 'Under Review',
      joinedDate: memberData.joinedDate || new Date().toISOString().split('T')[0],
      availableBalance: memberData.availableBalance ?? (memberData.initialDeposit ? Number(memberData.initialDeposit) : 0),
      totalDeposits: memberData.totalDeposits ?? (memberData.paymentStatus === 'Payment Successful' ? 200 : 0),
      activeLoan: memberData.activeLoan ?? 0,
      nextPayment: 0,
      nextPaymentDate: null,
      avatar: memberData.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`
    };

    setMembers((prev) => {
      const updated = [newMember, ...prev.filter((m) => m.id !== newId)];
      try {
        localStorage.setItem('utkal_finance_members_v2', JSON.stringify(updated));
      } catch (err) {
        console.error('Storage error:', err);
      }
      return updated;
    });

    // Admin Notification
    const notif = {
      id: `notif-${Date.now()}`,
      target: 'admin',
      title: 'New Member Registered',
      message: `${newMember.name} (${newMember.id}) applied for membership. Status: ${newMember.accountStatus}.`,
      time: 'Just now',
      read: false,
      type: 'member',
      link: '/admin/members'
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(`Member account created successfully! Member ID: ${newId}`, 'success');
    return newMember;
  };

  const updateMember = (id, updatedFields) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
    addToast('Member information updated successfully', 'success');
  };

  const toggleMemberStatus = (id) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newStatus = m.accountStatus === 'Active' ? 'Suspended' : 'Active';
          addToast(`Member status changed to ${newStatus}`, 'info');
          return { ...m, accountStatus: newStatus };
        }
        return m;
      })
    );
  };

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    addToast('Member record removed successfully', 'warning');
  };

  // Loan Actions
  const applyLoan = (loanData) => {
    const loanId = `LN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLoan = {
      id: loanId,
      memberId: loanData.memberId,
      memberName: loanData.memberName,
      loanType: loanData.loanType,
      principalAmount: Number(loanData.amount),
      outstandingAmount: Number(loanData.amount),
      interestRate: Number(loanData.interestRate || 9.5),
      monthlyEMI: Number(loanData.monthlyEMI),
      tenureMonths: Number(loanData.tenure),
      paidTenureMonths: 0,
      startDate: new Date().toISOString().split('T')[0],
      nextEMIDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
      purpose: loanData.purpose,
      monthlyIncome: Number(loanData.monthlyIncome),
      employmentType: loanData.employmentType
    };

    setLoans((prev) => [newLoan, ...prev]);

    // Admin Notification
    const adminNotif = {
      id: `notif-${Date.now()}`,
      target: 'admin',
      title: 'New Loan Application',
      message: `${loanData.memberName} applied for ${loanData.loanType} of ₹${Number(loanData.amount).toLocaleString('en-IN')}.`,
      time: 'Just now',
      read: false,
      type: 'loan',
      link: '/admin/loans'
    };

    // Member Notification
    const memberNotif = {
      id: `notif-${Date.now() + 1}`,
      target: 'member',
      memberId: loanData.memberId,
      title: 'Loan Application Submitted',
      message: `Your application for ${loanData.loanType} (${loanId}) has been received and is under review.`,
      time: 'Just now',
      read: false,
      type: 'loan',
      link: '/member/loans'
    };

    setNotifications((prev) => [adminNotif, memberNotif, ...prev]);
    addToast(`Loan Application ${loanId} submitted for review!`, 'success');
    return newLoan;
  };

  const updateLoanStatus = (loanId, newStatus, reason = '') => {
    setLoans((prev) =>
      prev.map((ln) => {
        if (ln.id === loanId) {
          const updated = { ...ln, status: newStatus, rejectionReason: reason };
          
          // If approved, update member's active loan amount
          if (newStatus === 'Approved') {
            setMembers((mPrev) =>
              mPrev.map((m) => {
                if (m.id === ln.memberId) {
                  return {
                    ...m,
                    activeLoan: (m.activeLoan || 0) + ln.principalAmount,
                    nextPayment: ln.monthlyEMI,
                    nextPaymentDate: ln.nextEMIDate
                  };
                }
                return m;
              })
            );

            // Record disbursement transaction
            const disburseTxn = {
              id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
              memberId: ln.memberId,
              memberName: ln.memberName,
              date: new Date().toISOString().replace('T', ' ').substring(0, 16),
              description: `Loan Disbursement - ${ln.loanType} #${ln.id}`,
              type: 'Deposit',
              amount: ln.principalAmount,
              paymentMethod: 'Direct Loan Disbursal',
              status: 'Completed',
              reference: `DISB${Math.floor(10000000 + Math.random() * 90000000)}`
            };
            setTransactions((tPrev) => [disburseTxn, ...tPrev]);
          }

          // Member notification
          const notif = {
            id: `notif-${Date.now()}`,
            target: 'member',
            memberId: ln.memberId,
            title: `Loan Application ${newStatus}`,
            message: newStatus === 'Approved' 
              ? `Congratulations! Your ${ln.loanType} (${ln.id}) has been approved and ready for disbursement.`
              : `Your ${ln.loanType} (${ln.id}) was not approved: ${reason || 'Criteria not met.'}`,
            time: 'Just now',
            read: false,
            type: 'loan',
            link: '/member/loans'
          };
          setNotifications((nPrev) => [notif, ...nPrev]);

          return updated;
        }
        return ln;
      })
    );

    addToast(`Loan ${loanId} marked as ${newStatus}`, newStatus === 'Approved' ? 'success' : 'warning');
  };

  const payLoanEMI = (loanId, amount) => {
    const numAmount = Number(amount);
    let targetLoan = null;

    setLoans((prev) =>
      prev.map((ln) => {
        if (ln.id === loanId) {
          targetLoan = ln;
          const newOutstanding = Math.max(0, ln.outstandingAmount - numAmount);
          const newPaidTenure = (ln.paidTenureMonths || 0) + 1;
          const isFinished = newOutstanding === 0;

          return {
            ...ln,
            outstandingAmount: newOutstanding,
            paidTenureMonths: newPaidTenure,
            status: isFinished ? 'Completed' : ln.status
          };
        }
        return ln;
      })
    );

    if (targetLoan) {
      // Record transaction
      const txn = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        memberId: targetLoan.memberId,
        memberName: targetLoan.memberName,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        description: `EMI Payment - ${targetLoan.loanType} #${targetLoan.id}`,
        type: 'Loan Payment',
        amount: numAmount,
        paymentMethod: 'Instant NetBanking / UPI',
        status: 'Completed',
        reference: `EMI${Date.now().toString().slice(-8)}`
      };
      setTransactions((tPrev) => [txn, ...tPrev]);

      // Deduct from balance
      setMembers((mPrev) =>
        mPrev.map((m) => {
          if (m.id === targetLoan.memberId) {
            return {
              ...m,
              availableBalance: Math.max(0, (m.availableBalance || 0) - numAmount),
              activeLoan: Math.max(0, (m.activeLoan || 0) - numAmount)
            };
          }
          return m;
        })
      );

      addToast(`EMI Payment of ₹${numAmount.toLocaleString('en-IN')} successful!`, 'success');
    }
  };

  // Deposit Actions
  const createDeposit = (depositData) => {
    const depId = `DP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const amount = Number(depositData.amount);
    const tenureMonths = Number(depositData.tenureMonths);
    const rate = Number(depositData.interestRate || 7.5);

    // Calculate approximate maturity
    const r = rate / 100;
    const t = tenureMonths / 12;
    const maturity = Math.round(amount * Math.pow(1 + r / 4, 4 * t));

    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + tenureMonths);

    const newDeposit = {
      id: depId,
      memberId: depositData.memberId,
      memberName: depositData.memberName,
      type: depositData.type || 'Fixed Deposit (Cumulative)',
      amount: amount,
      interestRate: rate,
      tenureMonths: tenureMonths,
      startDate: new Date().toISOString().split('T')[0],
      maturityDate: maturityDate.toISOString().split('T')[0],
      maturityAmount: maturity,
      status: 'Active'
    };

    setDeposits((prev) => [newDeposit, ...prev]);

    // Update member's total deposits and available balance
    setMembers((mPrev) =>
      mPrev.map((m) => {
        if (m.id === depositData.memberId) {
          return {
            ...m,
            totalDeposits: (m.totalDeposits || 0) + amount,
            availableBalance: Math.max(0, (m.availableBalance || 0) - amount)
          };
        }
        return m;
      })
    );

    // Record Transaction
    const txn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      memberId: depositData.memberId,
      memberName: depositData.memberName,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Deposit Booking - ${newDeposit.type} #${depId}`,
      type: 'Deposit',
      amount: amount,
      paymentMethod: 'Account Debit',
      status: 'Completed',
      reference: `DEP${Math.floor(10000000 + Math.random() * 90000000)}`
    };
    setTransactions((tPrev) => [txn, ...tPrev]);

    addToast(`New deposit of ₹${amount.toLocaleString('en-IN')} booked successfully!`, 'success');
    return newDeposit;
  };

  // Transaction Actions
  const addTransaction = (txnData) => {
    const newTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Completed',
      reference: `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      ...txnData
    };
    setTransactions((prev) => [newTxn, ...prev]);
    addToast('Transaction recorded successfully', 'success');
    return newTxn;
  };

  // Notification Actions
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = (targetRole, memberId = null) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (targetRole === 'admin' && n.target === 'admin') {
          return { ...n, read: true };
        }
        if (targetRole === 'member' && n.target === 'member' && (!memberId || n.memberId === memberId)) {
          return { ...n, read: true };
        }
        return n;
      })
    );
    addToast('All notifications marked as read', 'info');
  };

  // Application Workflow Actions
  const addApplication = (appData) => {
    const appId = appData.id || `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      ...appData,
      id: appId,
      status: appData.status || 'Submitted',
      membership_fee: appData.membership_fee || 200,
      payment_amount: appData.payment_amount || 200,
      payment_status: appData.payment_status || 'Pending Admin Verification',
      payment_method: appData.payment_method || appData.paymentMethod || 'UPI',
      payment_txn_ref: appData.payment_txn_ref || appData.paymentTxnRef || `UTR${Date.now().toString().slice(-8)}`,
      created_at: appData.created_at || new Date().toISOString()
    };

    setApplications((prev) => {
      const updated = [newApp, ...prev.filter((a) => a.id !== appId)];
      try {
        localStorage.setItem('utkal_finance_applications_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Dispatch Admin Notification for incoming payment verification request
    const notif = {
      id: `notif-${Date.now()}`,
      target: 'admin',
      title: 'New ₹200 Payment & Member Verification Request',
      message: `${newApp.member?.name || newApp.fullName || 'New Applicant'} submitted ₹200 joining fee via ${newApp.payment_method} (Ref: ${newApp.payment_txn_ref}). Click to verify and activate.`,
      time: 'Just now',
      read: false,
      type: 'payment',
      link: '/admin/applications'
    };
    setNotifications((prev) => [notif, ...prev]);

    return newApp;
  };

  const confirmPaymentAndActivate = async (appId, { assignedEmpId, assignedBranchId, adminName } = {}) => {
    let targetApp = applications.find((a) => a.id === appId);
    const allocatedMemberId = targetApp?.member_id || targetApp?.member?.id || `UF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const empId = assignedEmpId || targetApp?.emp_id || `EMP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const applicantName = targetApp?.member?.name || targetApp?.fullName || 'New Member';
    const method = targetApp?.payment_method || 'UPI / Gateway';
    const txnRef = targetApp?.payment_txn_ref || `PAY-${Date.now().toString().slice(-8)}`;

    try {
      await api.applications.updateStatus(appId, {
        status: 'Approved',
        paymentStatus: 'Payment Successful',
        assignedEmpId: empId,
        assignedBranchId,
        adminName
      });
    } catch (e) {
      console.warn('API confirm payment fallback to local state:', e.message);
    }

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            status: 'Approved',
            payment_status: 'Payment Successful',
            member_id: allocatedMemberId,
            emp_id: empId,
            approval_date: new Date().toISOString().split('T')[0],
            approved_by: adminName || 'Bhagirathi Mohapatra (Managing Director)'
          };
        }
        return a;
      })
    );

    // Activate the member in members list or create if not present
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === allocatedMemberId || (targetApp?.email && m.email === targetApp?.email));
      if (exists) {
        return prev.map((m) => {
          if (m.id === allocatedMemberId || (targetApp?.email && m.email === targetApp?.email)) {
            return {
              ...m,
              ...(targetApp?.member || {}),
              ...targetApp,
              id: allocatedMemberId,
              membershipId: allocatedMemberId,
              accountStatus: 'Active',
              kycStatus: 'Verified',
              emp_id: empId,
              empId: empId,
              totalDeposits: Math.max(m.totalDeposits || 0, 200),
              availableBalance: Math.max(m.availableBalance || 0, 25000)
            };
          }
          return m;
        });
      } else {
        const newMem = {
          ...(targetApp?.member || {}),
          ...targetApp,
          id: allocatedMemberId,
          membershipId: allocatedMemberId,
          emp_id: empId,
          empId: empId,
          name: applicantName,
          fullName: applicantName,
          email: targetApp?.user?.email || targetApp?.email || `${allocatedMemberId.toLowerCase()}@utkalfinance.com`,
          phone: targetApp?.user?.mobileNumber || targetApp?.mobileNumber || targetApp?.mobile || '',
          accountStatus: 'Active',
          kycStatus: 'Verified',
          joinedDate: new Date().toISOString().split('T')[0],
          availableBalance: 25000,
          totalDeposits: 200,
          activeLoan: 0,
          branchName: targetApp?.branchName || targetApp?.member?.branch_name || 'Bhubaneswar HQ'
        };
        return [newMem, ...prev];
      }
    });

    // Record the ₹200 fee in transaction ledger
    const newTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      memberId: allocatedMemberId,
      memberName: applicantName,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Associate Joining Fee (₹200 Paid via ${method})`,
      type: 'Fee',
      amount: 200,
      paymentMethod: method,
      status: 'Completed',
      reference: txnRef
    };
    setTransactions((prev) => [newTxn, ...prev]);

    // Member notification
    const memNotif = {
      id: `notif-${Date.now()}`,
      target: 'member',
      memberId: allocatedMemberId,
      title: 'Payment Successful & Member ID Activated!',
      message: `Your membership joining fee of ₹200 via ${method} has been verified by the Admin. Your Member ID (${allocatedMemberId}) is now Active!`,
      time: 'Just now',
      read: false,
      type: 'success'
    };
    setNotifications((prev) => [memNotif, ...prev]);

    addToast(`Payment marked as Successful! Member ID ${allocatedMemberId} is now Active.`, 'success');
  };

  const approveApplication = async (appId, { assignedEmpId, assignedBranchId, adminName } = {}) => {
    return confirmPaymentAndActivate(appId, { assignedEmpId, assignedBranchId, adminName });
  };

  const rejectApplication = async (appId, rejectionReason, adminName = 'Admin Officer') => {
    if (!rejectionReason) {
      addToast('Rejection reason is required', 'error');
      return;
    }
    try {
      await api.applications.updateStatus(appId, {
        status: 'Rejected',
        rejectionReason,
        adminName
      });
    } catch (e) {
      console.warn('API reject fallback to local state:', e.message);
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Rejected', rejection_reason: rejectionReason } : a))
    );
    addToast(`Application ${appId} marked as Rejected.`, 'warning');
  };

  const requestCorrection = async (appId, correctionNotes, adminName = 'Admin Officer') => {
    try {
      await api.applications.updateStatus(appId, {
        status: 'Correction Requested',
        correctionNotes,
        adminName
      });
    } catch (e) {
      console.warn('API correction fallback to local state:', e.message);
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Correction Requested', correction_notes: correctionNotes } : a))
    );
    addToast(`Correction request sent for application ${appId}`, 'info');
  };

  const updateDocumentStatus = async (appId, docId, status, rejectionReason = null) => {
    try {
      await api.applications.updateDocumentStatus(appId, docId, { status, rejectionReason });
    } catch (e) {
      console.warn('API doc update fallback to local state:', e.message);
    }

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId && a.documents) {
          return {
            ...a,
            documents: a.documents.map((d) =>
              d.id === docId ? { ...d, status, rejection_reason: rejectionReason } : d
            )
          };
        }
        return a;
      })
    );
    addToast(`Document marked as ${status}`, 'info');
  };

  // Settings Actions
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('System settings saved successfully', 'success');
  };

  return (
    <FinanceContext.Provider
      value={{
        members,
        loans,
        deposits,
        transactions,
        notifications,
        settings,
        toasts,
        applications,
        branches,
        associates,
        auditLogs,
        addToast,
        removeToast,
        // Member methods
        addMember,
        updateMember,
        toggleMemberStatus,
        deleteMember,
        // Application & Document methods
        addApplication,
        confirmPaymentAndActivate,
        approveApplication,
        rejectApplication,
        requestCorrection,
        updateDocumentStatus,
        // Loan methods
        applyLoan,
        updateLoanStatus,
        payLoanEMI,
        // Deposit methods
        createDeposit,
        // Transaction methods
        addTransaction,
        // Notification methods
        markNotificationAsRead,
        markAllNotificationsAsRead,
        // Settings methods
        updateSettings,
        resetAllDataToZero
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
