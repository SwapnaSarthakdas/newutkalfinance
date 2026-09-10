import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialMembers } from '../data/mockData';
import { api } from '../services/api';

const AuthContext = createContext();

const STORAGE_KEY = 'utkal_finance_auth_v1';
const TOKEN_KEY = 'utkal_finance_session_token';
const APP_STORAGE_KEY = 'utkal_finance_active_app_v1';

// Default Verified Demo Member for seamless customer presentation and portal walkthrough
export const defaultDemoMember = {
  id: 'UF-2026-1048',
  membership_id: 'UF-2026-1048',
  emp_id: 'EMP-2024-001',
  empId: 'EMP-2024-001',
  name: 'Rajesh Sharma',
  first_name: 'Rajesh',
  last_name: 'Sharma',
  father_or_husband_name: 'Sunil Sharma',
  dob: '1990-05-15',
  age: 36,
  gender: 'Male',
  email: 'rajesh.sharma@utkalfinance.com',
  phone: '9876543210',
  mobileNumber: '9876543210',
  role: 'MEMBER',
  accountStatus: 'Active',
  account_status: 'Active',
  kycStatus: 'Verified',
  kyc_status: 'Verified',
  membershipFeePaid: true,
  membershipFee: 500,
  shareCount: 10,
  shareValue: 500,
  joinedDate: '2026-08-15',
  branch: 'Bhubaneswar HQ (Nayapalli, IRC Village)',
  branch_id: 'BR-001',
  branchCode: '075101',
  branch_code: '075101',
  availableBalance: 0,
  available_balance: 0,
  totalDeposits: 0,
  total_deposits: 0,
  activeLoan: 0,
  active_loan: 0,
  address: 'Plot no-N/5-172, Nayapalli, IRC village, Bhubaneswar-751015, Odisha',
  permanentAddress: {
    address: 'Plot no-N/5-172, Nayapalli, IRC village',
    taluka: 'Nayapalli',
    district: 'Khurda',
    state: 'Odisha',
    pinCode: '751015'
  },
  nominee: {
    title: 'Mrs.',
    name: 'Pooja Sharma',
    relationship: 'Spouse',
    mobileNumber: '9876543211',
    dob: '1993-08-20',
    age: 33
  },
  witness: {
    name: 'Minati Mishra',
    membershipNumber: 'UF-2024-001',
    proofType: 'Aadhaar Card',
    proofNumber: 'XXXX-XXXX-8921'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'ADMIN' | 'MEMBER' | null
  const [activeApplication, setActiveApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.user) {
          setUser(parsed.user);
          setRole(parsed.role);
        }
      }
      const savedApp = localStorage.getItem(APP_STORAGE_KEY);
      if (savedApp) {
        setActiveApplication(JSON.parse(savedApp));
      }
    } catch (e) {
      console.error('Failed to load session from storage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (userData, userRole, token = null, application = null) => {
    if (!userData) {
      userData = userRole === 'ADMIN'
        ? {
            id: 'ADM-001',
            name: 'Bhagirathi Mohapatra (Managing Director)',
            email: 'admin@utkalfinance.com',
            role: 'ADMIN',
            department: 'Executive Administration'
          }
        : defaultDemoMember;
    }
    setUser(userData);
    setRole(userRole);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, role: userRole }));
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (application) {
      setActiveApplication(application);
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(application));
    }
  };

  const login = async (identifier, password, requestedRole = 'MEMBER') => {
    setIsLoading(true);

    // 1. First attempt to authenticate via Backend REST API
    try {
      const res = await api.auth.login(identifier, password, requestedRole);
      if (res && res.success) {
        const authUser = res.member
          ? { ...res.member, role: res.role }
          : {
              ...(res.user || {}),
              role: res.role,
              name: res.user?.name || (res.role === 'ADMIN' ? 'Bhagirathi Mohapatra (Managing Director)' : 'Rajesh Sharma'),
              id: res.user?.membershipId || res.user?.id || (res.role === 'ADMIN' ? 'ADM-001' : 'UF-2026-1048'),
              department: res.role === 'ADMIN' ? 'Executive Administration' : undefined,
              avatar: res.role === 'ADMIN' ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' : undefined
            };
        saveSession(authUser, res.role, res.token, res.application);
        setIsLoading(false);
        return { success: true, role: res.role };
      }
    } catch (apiErr) {
      // If error is explicit auth rejection for invalid credentials on existing account
      if (apiErr.message && (apiErr.message.includes('Incorrect password') || apiErr.message.includes('locked') || apiErr.message.includes('Account Suspended'))) {
        setIsLoading(false);
        throw apiErr;
      }
      console.warn('Backend login fallback to client store:', apiErr.message);
    }

    // 2. Client-Side Fallback for standalone/offline preview
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Admin Fallback
    if (requestedRole === 'ADMIN' || cleanId.includes('admin')) {
      if (cleanPass === 'admin123' || cleanPass === 'admin' || cleanId === 'admin@utkalfinance.com' || cleanPass.length > 0) {
        const adminUser = {
          id: 'ADM-001',
          name: 'Bhagirathi Mohapatra (Managing Director)',
          email: 'admin@utkalfinance.com',
          role: 'ADMIN',
          department: 'Executive Administration',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
        };
        saveSession(adminUser, 'ADMIN');
        setIsLoading(false);
        return { success: true, role: 'ADMIN' };
      }
    }

    // Member Fallback
    let storedMembers = [];
    try {
      const stored = localStorage.getItem('utkal_finance_members_v2') || localStorage.getItem('utkal_finance_members_v1');
      storedMembers = stored ? JSON.parse(stored) : [];
    } catch {
      storedMembers = [];
    }

    const cleanNumbers = cleanId.replace(/\D/g, '');
    let matchedMember = storedMembers.find((m) => {
      const emailMatch = m.email && m.email.trim().toLowerCase() === cleanId;
      const idMatch = m.id && m.id.trim().toLowerCase() === cleanId;
      const empMatch = (m.emp_id || m.empId) && (m.emp_id || m.empId).trim().toLowerCase() === cleanId;
      
      const memberPhoneDigits = (m.phone || m.mobileNumber || '').replace(/\D/g, '');
      const phoneMatch =
        cleanNumbers.length >= 7 &&
        memberPhoneDigits.length >= 7 &&
        (memberPhoneDigits.slice(-10) === cleanNumbers.slice(-10) ||
         memberPhoneDigits.includes(cleanNumbers) ||
         cleanNumbers.includes(memberPhoneDigits));

      return emailMatch || idMatch || empMatch || phoneMatch;
    });

    // If identifier matches default member or requested role is MEMBER fallback to defaultDemoMember
    if (!matchedMember && (
      cleanId.includes('rajesh') ||
      cleanId.includes('member') ||
      cleanId === 'demo' ||
      cleanNumbers === '9876543210' ||
      cleanId === 'emp-2024-001' ||
      cleanId === 'uf-2026-1048' ||
      cleanId === 'rajesh.sharma@utkalfinance.com' ||
      requestedRole === 'MEMBER'
    )) {
      matchedMember = (storedMembers && storedMembers.length > 0) ? storedMembers[0] : defaultDemoMember;
    }

    if (matchedMember) {
      if (!cleanPass) {
        setIsLoading(false);
        throw new Error('Please enter your password to sign in.');
      }
      const expectedPass = matchedMember.password || 'member123';
      if (cleanPass !== expectedPass && cleanPass !== 'member123') {
        setIsLoading(false);
        throw new Error('Incorrect password. Please enter the password you created in the Membership Form (or member123 for demo).');
      }

      // Check account activation status
      const status = matchedMember.accountStatus || matchedMember.account_status || 'Active';
      if (status === 'Pending Verification' || status === 'Pending' || status === 'Pending Payment Approval') {
        setIsLoading(false);
        throw new Error('Payment & Membership Verification Pending: Your ₹200 fee payment request has been submitted to the Admin / Agent. Once the administrator verifies the payment and marks it successful, your Member ID will be activated and you can access your portal.');
      }
      if (status === 'Suspended') {
        setIsLoading(false);
        throw new Error('Account Suspended: Please contact Utkal Finance administration.');
      }

      saveSession(matchedMember, 'MEMBER');
      setIsLoading(false);
      return { success: true, role: 'MEMBER' };
    }

    setIsLoading(false);
    throw new Error('No membership account found for this Mobile Number, EMP ID, or Email. Please check or register.');
  };

  const loginAsDemo = (demoRole) => {
    if (demoRole === 'ADMIN') {
      const adminUser = {
        id: 'ADM-001',
        name: 'Bhagirathi Mohapatra (Managing Director)',
        email: 'admin@utkalfinance.com',
        role: 'ADMIN',
        department: 'Executive Administration',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      };
      saveSession(adminUser, 'ADMIN');
      return { success: true, role: 'ADMIN' };
    } else {
      let storedMembers = [];
      try {
        const stored = localStorage.getItem('utkal_finance_members_v2') || localStorage.getItem('utkal_finance_members_v1');
        storedMembers = stored ? JSON.parse(stored) : [];
      } catch {
        storedMembers = [];
      }
      const member = (storedMembers && storedMembers.length > 0) ? storedMembers[0] : defaultDemoMember;
      saveSession(member, 'MEMBER');
      return { success: true, role: 'MEMBER' };
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setActiveApplication(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(APP_STORAGE_KEY);
  };

  const updateCurrentUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updated, role }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        activeApplication,
        setActiveApplication,
        saveSession,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
