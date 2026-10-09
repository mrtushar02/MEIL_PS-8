import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import AuthFlow from './features/auth/AuthFlow';
import MainDashboard from './features/dashboard/MainDashboard';
import { api } from './services/api';

export function App() {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('meil_active_session');
      const token = localStorage.getItem('meil_access_token');
      if (saved && token) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved session', e);
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [reportingPeriod, setReportingPeriod] = useState('September 2026');

  // Initialize Lenis Ultra-Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);
    window.lenis = lenis;

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  // Smooth scroll to top when activeTab changes
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: false, duration: 0.6 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  // Verify active JWT token on mount
  useEffect(() => {
    const token = localStorage.getItem('meil_access_token');
    if (token) {
      api.getCurrentUser()
        .then(userData => {
          setSession(prev => {
            if (!prev) return null;
            return {
              ...prev,
              user: {
                ...prev.user,
                id: userData.id,
                email: userData.email,
                full_name: userData.full_name,
                scopes: userData.scopes,
                permissions: userData.permissions
              }
            };
          });
        })
        .catch(err => {
          console.warn('Session token validation failed, redirecting to login:', err.message);
          api.logout();
          localStorage.removeItem('meil_active_session');
          setSession(null);
        });
    } else {
      setSession(null);
    }
  }, []);

  // Handle successful login from AuthFlow
  const handleLoginSuccess = ({ user, role }) => {
    const newSession = {
      user: {
        id: user.user_id || user.id,
        name: user.full_name || user.name || 'Authorized Officer',
        full_name: user.full_name || user.name || 'Authorized Officer',
        email: user.email || 'officer@meilgroup.in',
        scopes: user.scopes || [],
        permissions: user.permissions || []
      },
      role: role || {
        id: 'PROJECT_OFFICER',
        title: 'Project / Site User',
        shortName: 'Project / Site',
        color: '#0284C7'
      }
    };
    try {
      localStorage.setItem('meil_active_session', JSON.stringify(newSession));
    } catch (e) {}
    setSession(newSession);
    setActiveTab('overview');
  };

  const handleLogout = async () => {
    await api.logout();
    try {
      localStorage.removeItem('meil_active_session');
      localStorage.removeItem('meil_access_token');
    } catch (e) {}
    setSession(null);
    setActiveTab('overview');
  };

  // Instant role switcher with real JWT re-authentication
  const handleSwitchRole = async (newRoleId) => {
    const roleMap = {
      'PROJECT_OFFICER': {
        email: 'site.officer@meilgroup.in',
        role: { id: 'PROJECT_OFFICER', title: 'Project / Site User', shortName: 'Project / Site', color: '#0284C7' }
      },
      'HR_OFFICER': {
        email: 'hr.director@meilgroup.in',
        role: { id: 'HR_OFFICER', title: 'HR & Workforce Manager', shortName: 'HR', color: '#2563EB' }
      },
      'EHS_OFFICER': {
        email: 'ehs.head@meilgroup.in',
        role: { id: 'EHS_OFFICER', title: 'EHS & Safety Specialist', shortName: 'EHS / Safety', color: '#059669' }
      },
      'PROCUREMENT_OFFICER': {
        email: 'procurement@meilgroup.in',
        role: { id: 'PROCUREMENT_OFFICER', title: 'Procurement & Scope 3 Officer', shortName: 'Procurement', color: '#D97706' }
      },
      'CSR_OFFICER': {
        email: 'csr.lead@meilgroup.in',
        role: { id: 'CSR_OFFICER', title: 'CSR & Community Lead', shortName: 'CSR & Community', color: '#DB2777' }
      },
      'COMPLIANCE_OFFICER': {
        email: 'compliance@meilgroup.in',
        role: { id: 'COMPLIANCE_OFFICER', title: 'Governance & Compliance Lead', shortName: 'Governance', color: '#1E40AF' }
      },
      'BU_COORDINATOR': {
        email: 'bu.coordinator@meilgroup.in',
        role: { id: 'BU_COORDINATOR', title: 'BU Reviewer / Coordinator', shortName: 'BU Coordinator', color: '#0D9488' }
      },
      'SUBSIDIARY_HEAD': {
        email: 'sub.head@meilgroup.in',
        role: { id: 'SUBSIDIARY_HEAD', title: 'Subsidiary ESG Reviewer / Head', shortName: 'Subsidiary Head', color: '#7C3AED' }
      },
      'GROUP_CSO': {
        email: 'cso@meilgroup.in',
        role: { id: 'GROUP_CSO', title: 'Group / HQ ESG Reviewer / CSO', shortName: 'Group CSO', color: '#4338CA' }
      },
      'ESG_MANAGER': {
        email: 'esg.manager@meilgroup.in',
        role: { id: 'ESG_MANAGER', title: 'ESG / Sustainability Manager', shortName: 'ESG Manager', color: '#047857' }
      },
      'ESG_ANALYST': {
        email: 'esg.analyst@meilgroup.in',
        role: { id: 'ESG_ANALYST', title: 'ESG Analyst', shortName: 'ESG Analyst', color: '#0891B2' }
      },
      'BRSR_MANAGER': {
        email: 'brsr.manager@meilgroup.in',
        role: { id: 'BRSR_MANAGER', title: 'BRSR Manager', shortName: 'BRSR Manager', color: '#3B82F6' }
      },
      'ASSURANCE_AUDITOR': {
        email: 'auditor@meilgroup.in',
        role: { id: 'ASSURANCE_AUDITOR', title: 'Auditor / Assurance User', shortName: 'Auditor', color: '#B45309' }
      },
      'EXECUTIVE': {
        email: 'executive@meilgroup.in',
        role: { id: 'EXECUTIVE', title: 'Management / Executive User', shortName: 'Executive', color: '#1E293B' }
      },
      'SUPER_ADMIN': {
        email: 'admin@meilgroup.in',
        role: { id: 'SUPER_ADMIN', title: 'Super Administrator', shortName: 'Admin', color: '#6366F1' }
      }
    };

    const target = roleMap[newRoleId] || roleMap['PROJECT_OFFICER'];

    try {
      // Re-authenticate against backend to get valid token & claims for the chosen role
      const authData = await api.login(target.email, 'password123');
      const newSession = {
        user: {
          id: authData.user_id,
          name: authData.full_name,
          full_name: authData.full_name,
          email: target.email,
          scopes: authData.scopes || [],
          permissions: authData.permissions || []
        },
        role: target.role
      };
      localStorage.setItem('meil_active_session', JSON.stringify(newSession));
      setSession(newSession);
      setActiveTab('overview');
    } catch (e) {
      console.error('Role switch authentication failed:', e.message);
      alert(`Role switch to ${target.role.title} failed: ${e.message}`);
    }
  };

  return (
    <>
      {!session ? (
        <AuthFlow onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MainDashboard
          user={session.user}
          role={session.role}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          reportingPeriod={reportingPeriod}
          onPeriodChange={setReportingPeriod}
          onSwitchRole={handleSwitchRole}
        />
      )}
    </>
  );
}

export default App;
