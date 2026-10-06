import React, { useState, useEffect } from 'react';
import BRSRManagerContextBar from './components/BRSRManagerContextBar';
import BRSRManagerOverviewScreen from './screens/BRSRManagerOverviewScreen';
import NGRBCNinePrinciplesScreen from './screens/NGRBCNinePrinciplesScreen';
import BRSRCoreAssuranceScreen from './screens/BRSRCoreAssuranceScreen';
import XBRLPackagingScreen from './screens/XBRLPackagingScreen';
import GapAnalysisScreen from './screens/GapAnalysisScreen';
import FilingCenterScreen from './screens/FilingCenterScreen';
import './BRSRManagerModule.css';

export default function BRSRManagerModule({ user, activeTab = 'overview', onTabChange }) {
  const [internalView, setInternalView] = useState('overview');

  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'overview') setInternalView('overview');
      else if (activeTab === 'principles') setInternalView('principles');
      else if (activeTab === 'core-assurance' || activeTab === 'assurance') setInternalView('core-assurance');
      else if (activeTab === 'xbrl') setInternalView('xbrl');
      else if (activeTab === 'gaps') setInternalView('gaps');
      else if (activeTab === 'filing') setInternalView('filing');
    }
  }, [activeTab]);

  const handleNavigate = (view) => {
    setInternalView(view);
    if (onTabChange) onTabChange(view);
  };

  return (
    <div className="brsr-mgr-container">
      <BRSRManagerContextBar user={user} />

      {internalView === 'overview' && (
        <BRSRManagerOverviewScreen onNavigate={handleNavigate} />
      )}
      {internalView === 'principles' && (
        <NGRBCNinePrinciplesScreen />
      )}
      {internalView === 'core-assurance' && (
        <BRSRCoreAssuranceScreen />
      )}
      {internalView === 'xbrl' && (
        <XBRLPackagingScreen />
      )}
      {internalView === 'gaps' && (
        <GapAnalysisScreen />
      )}
      {internalView === 'filing' && (
        <FilingCenterScreen />
      )}
    </div>
  );
}
