import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import HorizontalNav from './HorizontalNav';
import DataStreamDashboard from './DataStreamDashboard';
import './MainDashboard.css';

import DataEntryModule from '../data-entry/DataEntryModule';
import EvidenceVault from '../evidence/EvidenceVault';
import SubmissionsManager from '../submissions/SubmissionsManager';
import HRModule from '../roles/HRModule';
import EHSModule from '../roles/EHSModule';
import ProcurementModule from '../roles/ProcurementModule';
import CSRModule from '../roles/CSRModule';
import GovernanceModule from '../roles/GovernanceModule';
import MyProjectModule from '../organization/MyProjectModule';
import ReportsModule from '../reports/ReportsModule';
import AnalyticsModule from '../analytics/AnalyticsModule';
import AuditTraceabilityModule from '../audit/AuditTraceabilityModule';
import BUCoordinatorModule from '../reviewers/bu/BUCoordinatorModule';
import SubsidiaryHeadModule from '../reviewers/subsidiary/SubsidiaryHeadModule';
import GroupCSOModule from '../reviewers/group/GroupCSOModule';

export default function MainDashboard({
  user = { name: 'Rohit Kumar', email: 'rohit.kumar@meil.in' },
  role = { id: 'PROJECT_OFFICER', title: 'Project / Site User' },
  activeTab = 'overview',
  onTabChange,
  onLogout,
  onSwitchRole,
  reportingPeriod = 'September 2026',
  onPeriodChange
}) {
  const isOverview = activeTab === 'overview' || activeTab === 'data-inbox';

  return (
    <div className="dashboard-viewport">
      {/* 1. Atmospheric Ambient Background */}
      <div className="dashboard-atmosphere">
        <div className="dashboard-ambient-light dashboard-ambient-light-1" />
        <div className="dashboard-ambient-light dashboard-ambient-light-2" />
      </div>

      {/* 2. Top Header & Horizontal Navigation (Always visible) */}
      <DashboardHeader 
        user={user} 
        role={role} 
        onLogout={onLogout}
        onNavigateTab={onTabChange}
        onSwitchRole={onSwitchRole}
      />
      <HorizontalNav 
        role={role} 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
      />

      {/* 3. Tab Content Router */}
      {role?.id === 'BU_COORDINATOR' ? (
        <div style={{ maxWidth: '1720px', width: '98%', margin: '14px auto 0', padding: '0 8px', position: 'relative', zIndex: 10 }}>
          <BUCoordinatorModule 
            user={user} 
            activeTab={activeTab} 
            onTabChange={onTabChange} 
          />
        </div>
      ) : role?.id === 'SUBSIDIARY_HEAD' ? (
        <div style={{ maxWidth: '1720px', width: '98%', margin: '14px auto 0', padding: '0 8px', position: 'relative', zIndex: 10 }}>
          <SubsidiaryHeadModule 
            user={user} 
            activeTab={activeTab} 
            onTabChange={onTabChange} 
          />
        </div>
      ) : role?.id === 'GROUP_CSO' ? (
        <div style={{ maxWidth: '1720px', width: '98%', margin: '14px auto 0', padding: '0 8px', position: 'relative', zIndex: 10 }}>
          <GroupCSOModule 
            user={user} 
            activeTab={activeTab} 
            onTabChange={onTabChange} 
          />
        </div>
      ) : role?.id === 'EHS_OFFICER' && activeTab !== 'reports' ? (
        <div style={{ maxWidth: '1680px', width: '96%', margin: '14px auto 0', padding: '0 12px', position: 'relative', zIndex: 10 }}>
          <EHSModule 
            activeTab={activeTab} 
            onNavigateTab={onTabChange} 
            reportingPeriod={reportingPeriod} 
            user={user} 
          />
        </div>
      ) : role?.id === 'PROCUREMENT_OFFICER' && activeTab !== 'reports' ? (
        <div style={{ maxWidth: '1680px', width: '96%', margin: '14px auto 0', padding: '0 12px', position: 'relative', zIndex: 10 }}>
          <ProcurementModule 
            activeTab={activeTab} 
            onNavigateTab={onTabChange} 
            reportingPeriod={reportingPeriod} 
            user={user} 
          />
        </div>
      ) : role?.id === 'CSR_OFFICER' && activeTab !== 'reports' ? (
        <div style={{ maxWidth: '1680px', width: '96%', margin: '14px auto 0', padding: '0 12px', position: 'relative', zIndex: 10 }}>
          <CSRModule 
            activeTab={activeTab} 
            onNavigateTab={onTabChange} 
            reportingPeriod={reportingPeriod} 
            user={user} 
          />
        </div>
      ) : role?.id === 'COMPLIANCE_OFFICER' && activeTab !== 'reports' ? (
        <div style={{ maxWidth: '1680px', width: '96%', margin: '14px auto 0', padding: '0 12px', position: 'relative', zIndex: 10 }}>
          <GovernanceModule 
            activeTab={activeTab} 
            onNavigateTab={onTabChange} 
            reportingPeriod={reportingPeriod} 
            user={user} 
          />
        </div>
      ) : role?.id === 'HR_OFFICER' && activeTab !== 'my-project' && activeTab !== 'data-entry' && activeTab !== 'reports' && activeTab !== 'analytics' && activeTab !== 'audit' ? (
        <div style={{ maxWidth: '1680px', width: '95%', margin: '14px auto 0', padding: '0 16px', position: 'relative', zIndex: 10 }}>
          <HRModule 
            activeTab={activeTab} 
            onNavigateTab={onTabChange} 
            reportingPeriod={reportingPeriod} 
            user={user} 
          />
        </div>
      ) : activeTab === 'my-project' ? (
        <div style={{ maxWidth: '1440px', margin: '20px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <MyProjectModule 
            onSelectProject={(p) => onTabChange?.('overview')} 
            onNavigateTab={onTabChange} 
          />
        </div>
      ) : activeTab === 'data-entry' ? (
        <div style={{ maxWidth: '1680px', width: '95%', margin: '14px auto 0', padding: '0 16px', position: 'relative', zIndex: 10 }}>
          <DataEntryModule 
            onSubmissionComplete={() => onTabChange?.('submissions')} 
            onNavigate={(tab) => onTabChange?.(tab)}
          />
        </div>
      ) : activeTab === 'reports' ? (
        <div style={{ maxWidth: '1440px', margin: '20px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <ReportsModule onNavigate={(tab) => onTabChange?.(tab)} />
        </div>
      ) : activeTab === 'analytics' ? (
        <div style={{ maxWidth: '1440px', margin: '20px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <AnalyticsModule onNavigate={(tab) => onTabChange?.(tab)} />
        </div>
      ) : activeTab === 'audit' ? (
        <div style={{ maxWidth: '1440px', margin: '20px auto 0', padding: '0 32px', position: 'relative', zIndex: 10 }}>
          <AuditTraceabilityModule />
        </div>
      ) : (activeTab === 'workforce' || activeTab === 'training' || activeTab === 'wellbeing' || activeTab === 'human-rights') ? (
        <div style={{ maxWidth: '1680px', width: '95%', margin: '14px auto 0', padding: '0 16px', position: 'relative', zIndex: 10 }}>
          <HRModule 
            activeTab={activeTab} 
            onNavigateTab={onTabChange} 
            reportingPeriod={reportingPeriod} 
            user={user} 
          />
        </div>
      ) : activeTab === 'evidence' ? (
        <div style={{ maxWidth: '1440px', margin: '20px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <EvidenceVault onNavigate={(tab) => onTabChange?.(tab)} />
        </div>
      ) : activeTab === 'submissions' ? (
        <div style={{ maxWidth: '1440px', margin: '20px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <SubmissionsManager onNavigate={(tab) => onTabChange?.(tab)} />
        </div>
      ) : (
        /* Primary Master DATASTREAM Workspace Layout — Pixel-Perfect to Reference Design */
        <DataStreamDashboard 
          user={user}
          role={role}
          onNavigateTab={onTabChange}
          reportingPeriod={reportingPeriod}
          onPeriodChange={onPeriodChange}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}
