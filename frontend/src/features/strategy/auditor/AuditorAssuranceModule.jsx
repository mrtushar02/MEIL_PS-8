import React, { useState, useEffect } from 'react';
import AuditorContextBar from './components/AuditorContextBar';
import AuditorAssuranceOverviewScreen from './screens/AuditorAssuranceOverviewScreen';
import SampleSelectionScreen from './screens/SampleSelectionScreen';
import EvidenceScrutinyScreen from './screens/EvidenceScrutinyScreen';
import AuditorFindingsScreen from './screens/AuditorFindingsScreen';
import AssuranceOpinionScreen from './screens/AssuranceOpinionScreen';
import AuditTrailLedgerScreen from './screens/AuditTrailLedgerScreen';
import './AuditorAssuranceModule.css';

export default function AuditorAssuranceModule({ user, activeTab = 'overview', onTabChange }) {
  const [internalView, setInternalView] = useState('overview');

  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'overview') setInternalView('overview');
      else if (activeTab === 'samples') setInternalView('samples');
      else if (activeTab === 'scrutiny' || activeTab === 'evidence') setInternalView('scrutiny');
      else if (activeTab === 'findings') setInternalView('findings');
      else if (activeTab === 'opinion') setInternalView('opinion');
      else if (activeTab === 'ledger' || activeTab === 'audit') setInternalView('ledger');
    }
  }, [activeTab]);

  const handleNavigate = (view) => {
    setInternalView(view);
    if (onTabChange) onTabChange(view);
  };

  return (
    <div className="audit-usr-container">
      <AuditorContextBar user={user} />

      {internalView === 'overview' && (
        <AuditorAssuranceOverviewScreen onNavigate={handleNavigate} />
      )}
      {internalView === 'samples' && (
        <SampleSelectionScreen />
      )}
      {internalView === 'scrutiny' && (
        <EvidenceScrutinyScreen />
      )}
      {internalView === 'findings' && (
        <AuditorFindingsScreen />
      )}
      {internalView === 'opinion' && (
        <AssuranceOpinionScreen />
      )}
      {internalView === 'ledger' && (
        <AuditTrailLedgerScreen />
      )}
    </div>
  );
}
