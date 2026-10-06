import React, { useState, useEffect } from 'react';
import ExecutiveBoardContextBar from './components/ExecutiveBoardContextBar';
import ExecutiveBoardOverviewScreen from './screens/ExecutiveBoardOverviewScreen';
import ESGRatingsBenchmarkingScreen from './screens/ESGRatingsBenchmarkingScreen';
import CapitalAllocationScreen from './screens/CapitalAllocationScreen';
import StatutoryRiskSummaryScreen from './screens/StatutoryRiskSummaryScreen';
import BoardDossierExportScreen from './screens/BoardDossierExportScreen';
import './ExecutiveBoardModule.css';

export default function ExecutiveBoardModule({ user, activeTab = 'overview', onTabChange }) {
  const [internalView, setInternalView] = useState('overview');

  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'overview') setInternalView('overview');
      else if (activeTab === 'ratings' || activeTab === 'benchmarking') setInternalView('ratings');
      else if (activeTab === 'capex' || activeTab === 'allocation') setInternalView('capex');
      else if (activeTab === 'risk' || activeTab === 'risks') setInternalView('risk');
      else if (activeTab === 'dossier' || activeTab === 'reports') setInternalView('dossier');
    }
  }, [activeTab]);

  const handleNavigate = (view) => {
    setInternalView(view);
    if (onTabChange) onTabChange(view);
  };

  return (
    <div className="exec-bd-container">
      <ExecutiveBoardContextBar user={user} />

      {internalView === 'overview' && (
        <ExecutiveBoardOverviewScreen onNavigate={handleNavigate} />
      )}
      {internalView === 'ratings' && (
        <ESGRatingsBenchmarkingScreen />
      )}
      {internalView === 'capex' && (
        <CapitalAllocationScreen />
      )}
      {internalView === 'risk' && (
        <StatutoryRiskSummaryScreen />
      )}
      {internalView === 'dossier' && (
        <BoardDossierExportScreen />
      )}
    </div>
  );
}
