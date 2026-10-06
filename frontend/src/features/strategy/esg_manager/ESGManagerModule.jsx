import React, { useState, useEffect } from 'react';
import ESGManagerContextBar from './components/ESGManagerContextBar';
import ESGManagerOverviewScreen from './screens/ESGManagerOverviewScreen';
import DecarbonizationRoadmapScreen from './screens/DecarbonizationRoadmapScreen';
import RenewableTransitionScreen from './screens/RenewableTransitionScreen';
import ESGCommitteeDeskScreen from './screens/ESGCommitteeDeskScreen';
import SupplierEngagementScreen from './screens/SupplierEngagementScreen';
import ESGTargetsTrackerScreen from './screens/ESGTargetsTrackerScreen';
import './ESGManagerModule.css';

export default function ESGManagerModule({ user, activeTab = 'overview', onTabChange }) {
  const [internalView, setInternalView] = useState('overview');

  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'overview') setInternalView('overview');
      else if (activeTab === 'roadmap') setInternalView('roadmap');
      else if (activeTab === 'renewables' || activeTab === 'energy') setInternalView('renewables');
      else if (activeTab === 'committee') setInternalView('committee');
      else if (activeTab === 'suppliers') setInternalView('suppliers');
      else if (activeTab === 'targets') setInternalView('targets');
    }
  }, [activeTab]);

  const handleNavigate = (view) => {
    setInternalView(view);
    if (onTabChange) onTabChange(view);
  };

  return (
    <div className="esg-mgr-container">
      <ESGManagerContextBar user={user} />

      {internalView === 'overview' && (
        <ESGManagerOverviewScreen onNavigate={handleNavigate} />
      )}
      {internalView === 'roadmap' && (
        <DecarbonizationRoadmapScreen />
      )}
      {internalView === 'renewables' && (
        <RenewableTransitionScreen />
      )}
      {internalView === 'committee' && (
        <ESGCommitteeDeskScreen />
      )}
      {internalView === 'suppliers' && (
        <SupplierEngagementScreen />
      )}
      {internalView === 'targets' && (
        <ESGTargetsTrackerScreen />
      )}
    </div>
  );
}
