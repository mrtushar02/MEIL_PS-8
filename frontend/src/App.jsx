import React, { useState, useEffect } from 'react';
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
        role: { id: 'CSR_OFFICER', title: 'CSR & Community Lead', shortName: 'CSR & Community', color: '#2563EB' }
      },
      'COMPLIANCE_OFFICER': {
        email: 'governance.lead@meilgroup.in',
        role: { id: 'COMPLIANCE_OFFICER', title: 'Governance & Compliance Lead', shortName: 'Governance', color: '#1E40AF' }
      },
      'GROUP_CSO': {
        email: 'cso@meilgroup.in',
        role: { id: 'GROUP_CSO', title: 'Group CSO', shortName: 'Group CSO', color: '#1E40AF' }
      },
      'SUPER_ADMIN': {
        email: 'admin@meilgroup.in',
        role: { id: 'SUPER_ADMIN', title: 'Executive ESG Admin', shortName: 'Admin', color: '#2563EB' }
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
      console.warn('Real login during role switch failed, applying local state transition:', e.message);
      const fallbackSession = {
        user: {
          name: target.role.title,
          full_name: target.role.title,
          email: target.email,
          scopes: []
        },
        role: target.role
      };
      setSession(fallbackSession);
      setActiveTab('overview');
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
