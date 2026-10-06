import React, { useState, useEffect } from 'react';
import SubContextBar from './components/SubContextBar';
import SubOverviewScreen from './screens/SubOverviewScreen';
import SubBUReviewCenterScreen from './screens/SubBUReviewCenterScreen';
import SubBUPackageDetailScreen from './screens/SubBUPackageDetailScreen';
import SubESGPerformanceScreen from './screens/SubESGPerformanceScreen';
import SubBRSRImpactScreen from './screens/SubBRSRImpactScreen';
import SubApprovalCenterScreen from './screens/SubApprovalCenterScreen';
import SubEvidenceReviewScreen from './screens/SubEvidenceReviewScreen';
import SubExceptionsScreen from './screens/SubExceptionsScreen';
import SubReportsAuditScreen from './screens/SubReportsAuditScreen';
import './SubsidiaryHeadModule.css';

export default function SubsidiaryHeadModule({ user, activeTab = 'overview', onTabChange }) {
  const [internalView, setInternalView] = useState('overview');
  const [selectedBU, setSelectedBU] = useState('Tunnels BU');
  const [notification, setNotification] = useState(null);

  // Sync with parent HorizontalNav activeTab
  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'overview') setInternalView('overview');
      else if (activeTab === 'bu-review' || activeTab === 'review-queue') setInternalView('bu-review');
      else if (activeTab === 'package-detail') setInternalView('package-detail');
      else if (activeTab === 'esg-performance' || activeTab === 'consolidation') setInternalView('esg-performance');
      else if (activeTab === 'brsr-impact') setInternalView('brsr-impact');
      else if (activeTab === 'approvals' || activeTab === 'approval-center') setInternalView('approvals');
      else if (activeTab === 'evidence') setInternalView('evidence');
      else if (activeTab === 'exceptions') setInternalView('exceptions');
      else if (activeTab === 'reports' || activeTab === 'audit') setInternalView('reports');
    }
  }, [activeTab]);

  const handleSelectBU = (buName) => {
    setSelectedBU(buName);
    setInternalView('package-detail');
    if (onTabChange) onTabChange('package-detail');
  };

  const handleApproveSubsidiaryPackage = () => {
    setNotification('Entire Subsidiary ESG Package approved and signed! Forwarded to Group CSO.');
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="sub-module-container" style={{ padding: '1rem 1.5rem', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Subsidiary Context Bar */}
      <SubContextBar user={user} />

      {/* Notification Toast */}
      {notification && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          padding: '0.75rem 1.25rem',
          borderRadius: '12px',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
        }}>
          <span>{notification}</span>
          <button 
            onClick={() => setNotification(null)}
            style={{ border: 'none', background: 'transparent', color: '#065F46', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Screen Router */}
      {internalView === 'overview' && (
        <SubOverviewScreen 
          onNavigate={(screen) => {
            setInternalView(screen);
            if (onTabChange) onTabChange(screen);
          }}
          onSelectBU={handleSelectBU}
        />
      )}

      {internalView === 'bu-review' && (
        <SubBUReviewCenterScreen 
          onSelectBU={handleSelectBU}
        />
      )}

      {internalView === 'package-detail' && (
        <SubBUPackageDetailScreen 
          selectedBU={selectedBU}
          onBack={() => {
            setInternalView('bu-review');
            if (onTabChange) onTabChange('bu-review');
          }}
        />
      )}

      {internalView === 'esg-performance' && (
        <SubESGPerformanceScreen />
      )}

      {internalView === 'brsr-impact' && (
        <SubBRSRImpactScreen />
      )}

      {internalView === 'approvals' && (
        <SubApprovalCenterScreen 
          onApproveAll={handleApproveSubsidiaryPackage}
        />
      )}

      {internalView === 'evidence' && (
        <SubEvidenceReviewScreen />
      )}

      {internalView === 'exceptions' && (
        <SubExceptionsScreen />
      )}

      {internalView === 'reports' && (
        <SubReportsAuditScreen />
      )}
    </div>
  );
}
