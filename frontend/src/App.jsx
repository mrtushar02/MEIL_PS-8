import React, { useState } from 'react';
import AuthFlow from './features/auth/AuthFlow';
import MainDashboard from './features/dashboard/MainDashboard';

export function App() {
  // Initialize session from localStorage or default to active Project/Site session
  // Allows testing both the DataStream Dashboard and the Role Selection flow seamlessly
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('meil_active_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved session', e);
    }
    return {
      user: {
        name: 'Rohit Kumar',
        full_name: 'Rohit Kumar',
        email: 'rohit.kumar@meilgroup.in'
      },
      role: {
        id: 'PROJECT_OFFICER',
        title: 'Project / Site User',
        shortName: 'Project / Site',
        color: '#0284C7'
      }
    };
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [reportingPeriod, setReportingPeriod] = useState('September 2026');

  // Handle successful login from AuthFlow
  const handleLoginSuccess = ({ user, role }) => {
    const newSession = {
      user: {
        name: user.full_name || user.name || 'Rohit Kumar',
        full_name: user.full_name || user.name || 'Rohit Kumar',
        email: user.email || 'rohit.kumar@meilgroup.in'
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

  const handleLogout = () => {
    try {
      localStorage.removeItem('meil_active_session');
    } catch (e) {}
    setSession(null);
    setActiveTab('overview');
  };

  // Instant role switcher handler
  const handleSwitchRole = (newRoleId) => {
    const roleMap = {
      'PROJECT_OFFICER': {
        user: { name: 'Rohit Kumar', email: 'site.officer@meilgroup.in', avatar: '/avatar_rohit.jpg' },
        role: { id: 'PROJECT_OFFICER', title: 'Project / Site User', shortName: 'Project / Site', color: '#0284C7' }
      },
      'HR_OFFICER': {
        user: { name: 'Sunita Raman', email: 'hr.director@meilgroup.in', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces' },
        role: { id: 'HR_OFFICER', title: 'HR & Workforce Manager', shortName: 'HR', color: '#2563EB' }
      },
      'EHS_OFFICER': {
        user: { name: 'Rajeshwar K.', email: 'ehs.head@meilgroup.in', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces' },
        role: { id: 'EHS_OFFICER', title: 'EHS & Safety Specialist', shortName: 'EHS / Safety', color: '#059669' }
      },
      'PROCUREMENT_OFFICER': {
        user: { name: 'Anand Mahindra V.', email: 'procurement@meilgroup.in', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces' },
        role: { id: 'PROCUREMENT_OFFICER', title: 'Procurement & Scope 3 Officer', shortName: 'Procurement', color: '#D97706' }
      },
      'CSR_OFFICER': {
        user: { name: 'Priya Nair', email: 'csr.lead@meilgroup.in', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces' },
        role: { id: 'CSR_OFFICER', title: 'CSR & Community Lead', shortName: 'CSR & Community', color: '#2563EB' }
      },
      'COMPLIANCE_OFFICER': {
        user: { name: 'Rohit Kumar', email: 'governance.lead@meilgroup.in', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
        role: { id: 'COMPLIANCE_OFFICER', title: 'Governance & Compliance Lead', shortName: 'Governance', color: '#1E40AF' }
      }
    };

    const target = roleMap[newRoleId] || roleMap['PROJECT_OFFICER'];
    const newSession = {
      user: {
        name: target.user.name,
        full_name: target.user.name,
        email: target.user.email,
        avatar: target.user.avatar
      },
      role: target.role
    };

    try {
      localStorage.setItem('meil_active_session', JSON.stringify(newSession));
    } catch (e) {}
    setSession(newSession);
    setActiveTab('overview');
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
