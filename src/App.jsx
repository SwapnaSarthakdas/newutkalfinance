import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Toast from './components/common/Toast';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MemberDashboard from './pages/member/MemberDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import MembershipFormPage from './pages/public/MembershipFormPage';
import BrochurePage from './pages/public/BrochurePage';

// Inner App Controller that uses Auth & Finance Contexts
const AppController = () => {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const { addToast } = useFinance();

  // Route state
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  // Sync route with window hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setCurrentRoute(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (routeId) => {
    // Role-based route guard
    if (routeId === 'admin-dashboard') {
      let currentRole = role;
      let isAuth = isAuthenticated || !!user;
      const savedSession = localStorage.getItem('utkal_finance_auth_v1');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed.role) currentRole = parsed.role;
          if (parsed.user) isAuth = true;
        } catch {}
      }

      if (!isAuth) {
        window.location.hash = 'login';
        setCurrentRoute('login');
        addToast('Please log in with administrator credentials.', 'warning');
        return;
      }
      if (currentRole !== 'ADMIN') {
        window.location.hash = 'member-dashboard';
        setCurrentRoute('member-dashboard');
        addToast('Access denied: Administrator privileges required.', 'warning');
        return;
      }
    }

    const savedSession = localStorage.getItem('utkal_finance_auth_v1');
    let hasValidUser = isAuthenticated || !!user;
    if (!hasValidUser && savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.user) hasValidUser = true;
      } catch {}
    }

    if (routeId === 'member-dashboard') {
      if (!hasValidUser) {
        window.location.hash = 'login';
        setCurrentRoute('login');
        addToast('Please log in to access your member dashboard.', 'info');
        return;
      }
    }

    // Scroll to sections on home page if requested
    if (['about', 'services', 'why-us', 'calculator', 'contact'].includes(routeId)) {
      if (currentRoute !== 'home') {
        window.location.hash = 'home';
        setCurrentRoute('home');
        setTimeout(() => {
          const el = document.getElementById(routeId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return;
      } else {
        const el = document.getElementById(routeId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    window.location.hash = routeId;
    setCurrentRoute(routeId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold tracking-wide">Loading Utkal Finance...</span>
        </div>
      </div>
    );
  }

  // Render appropriate view based on route & role guards
  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'membership-form':
      case 'blank-form':
      case 'blank-membership-form':
        return <MembershipFormPage onNavigate={navigate} />;
      case 'brochure':
      case 'handover-brochure':
      case 'company-brochure':
        return <BrochurePage onNavigate={navigate} />;
      case 'member-dashboard': {
        const savedSession = localStorage.getItem('utkal_finance_auth_v1');
        let hasValidUser = isAuthenticated || !!user;
        if (!hasValidUser && savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            if (parsed && parsed.user) hasValidUser = true;
          } catch {}
        }
        if (!hasValidUser) {
          return <LoginPage onNavigate={navigate} />;
        }
        return <MemberDashboard onNavigate={navigate} />;
      }
      case 'admin-dashboard': {
        const savedSession = localStorage.getItem('utkal_finance_auth_v1');
        let currentRole = role;
        let isAuth = isAuthenticated || !!user;
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            if (parsed.role) currentRole = parsed.role;
            if (parsed.user) isAuth = true;
          } catch {}
        }
        if (!isAuth || currentRole !== 'ADMIN') {
          return <LoginPage onNavigate={navigate} />;
        }
        return <AdminDashboard onNavigate={navigate} />;
      }
      case 'home':
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-finance-600 selection:text-white">
      {renderCurrentView()}
      <Toast />
    </div>
  );
};

// Root App with Providers
function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppController />
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
