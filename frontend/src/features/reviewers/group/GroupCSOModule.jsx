import React, { useState, useEffect } from 'react';
import GroupContextBar from './components/GroupContextBar';
import GroupCommandCenterScreen from './screens/GroupCommandCenterScreen';
import GroupHierarchyExplorerScreen from './screens/GroupHierarchyExplorerScreen';
import GroupEnterpriseESGScreen from './screens/GroupEnterpriseESGScreen';
import GroupBRSRCommandScreen from './screens/GroupBRSRCommandScreen';
import GroupAssuranceCenterScreen from './screens/GroupAssuranceCenterScreen';
import GroupFinalApprovalLockScreen from './screens/GroupFinalApprovalLockScreen';
import GroupRiskManagementScreen from './screens/GroupRiskManagementScreen';
import GroupStatutoryReportsScreen from './screens/GroupStatutoryReportsScreen';
import GroupAnalyticsScreen from './screens/GroupAnalyticsScreen';
import GroupAuditTraceabilityScreen from './screens/GroupAuditTraceabilityScreen';
import GroupEnterpriseDashboardScreen from './screens/GroupEnterpriseDashboardScreen';
import './GroupCSOModule.css';

export default function GroupCSOModule({ user, activeTab = 'overview', onTabChange }) {
  const [internalView, setInternalView] = useState('overview');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState(null);

  // Sync with parent HorizontalNav tab changes
  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'overview') setInternalView('overview');
      else if (activeTab === 'hierarchy') setInternalView('hierarchy');
      else if (activeTab === 'enterprise-esg' || activeTab === 'performance') setInternalView('enterprise-esg');
      else if (activeTab === 'brsr-command' || activeTab === 'brsr') setInternalView('brsr-command');
      else if (activeTab === 'assurance') setInternalView('assurance');
      else if (activeTab === 'final-lock' || activeTab === 'lock') setInternalView('final-lock');
      else if (activeTab === 'risk') setInternalView('risk');
      else if (activeTab === 'statutory-reports' || activeTab === 'reports') setInternalView('statutory-reports');
      else if (activeTab === 'analytics') setInternalView('analytics');
      else if (activeTab === 'audit') setInternalView('audit');
      else if (activeTab === 'panoramic' || activeTab === 'dashboard') setInternalView('panoramic');
    }
  }, [activeTab]);

  const handleNavigate = (view) => {
    setInternalView(view);
    if (onTabChange) onTabChange(view);
  };

  const handleSelectSubsidiary = (sub) => {
    setSelectedSubsidiary(sub);
    handleNavigate('hierarchy');
  };

  return (
    <div className="group-cso-container">
      {/* Group Context Bar */}
      <GroupContextBar user={user} />

      {/* Screen Router */}
      {internalView === 'overview' && (
        <GroupCommandCenterScreen 
          onNavigate={handleNavigate}
          onSelectSubsidiary={handleSelectSubsidiary}
        />
      )}

      {internalView === 'hierarchy' && (
        <GroupHierarchyExplorerScreen />
      )}

      {internalView === 'enterprise-esg' && (
        <GroupEnterpriseESGScreen />
      )}

      {internalView === 'brsr-command' && (
        <GroupBRSRCommandScreen />
      )}

      {internalView === 'assurance' && (
        <GroupAssuranceCenterScreen />
      )}

      {internalView === 'final-lock' && (
        <GroupFinalApprovalLockScreen />
      )}

      {internalView === 'risk' && (
        <GroupRiskManagementScreen />
      )}

      {internalView === 'statutory-reports' && (
        <GroupStatutoryReportsScreen />
      )}

      {internalView === 'analytics' && (
        <GroupAnalyticsScreen />
      )}

      {internalView === 'audit' && (
        <GroupAuditTraceabilityScreen />
      )}

      {internalView === 'panoramic' && (
        <GroupEnterpriseDashboardScreen onNavigate={handleNavigate} />
      )}
    </div>
  );
}
