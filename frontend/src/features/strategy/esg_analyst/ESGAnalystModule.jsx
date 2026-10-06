import React, { useState, useEffect } from 'react';
import ESGAnalystContextBar from './components/ESGAnalystContextBar';
import ESGAnalystOverviewScreen from './screens/ESGAnalystOverviewScreen';
import EmissionFactorStudioScreen from './screens/EmissionFactorStudioScreen';
import DataDiagnosticsScreen from './screens/DataDiagnosticsScreen';
import IntensityModelingScreen from './screens/IntensityModelingScreen';
import ForecastingSimulationScreen from './screens/ForecastingSimulationScreen';
import AuditQueryWorkbenchScreen from './screens/AuditQueryWorkbenchScreen';
import './ESGAnalystModule.css';

export default function ESGAnalystModule({ user, activeTab = 'overview', onTabChange }) {
  const [internalView, setInternalView] = useState('overview');

  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'overview') setInternalView('overview');
      else if (activeTab === 'factors') setInternalView('factors');
      else if (activeTab === 'diagnostics') setInternalView('diagnostics');
      else if (activeTab === 'intensity') setInternalView('intensity');
      else if (activeTab === 'forecasting') setInternalView('forecasting');
      else if (activeTab === 'workbench') setInternalView('workbench');
    }
  }, [activeTab]);

  const handleNavigate = (view) => {
    setInternalView(view);
    if (onTabChange) onTabChange(view);
  };

  return (
    <div className="esg-ana-container">
      <ESGAnalystContextBar user={user} />

      {internalView === 'overview' && (
        <ESGAnalystOverviewScreen onNavigate={handleNavigate} />
      )}
      {internalView === 'factors' && (
        <EmissionFactorStudioScreen />
      )}
      {internalView === 'diagnostics' && (
        <DataDiagnosticsScreen />
      )}
      {internalView === 'intensity' && (
        <IntensityModelingScreen />
      )}
      {internalView === 'forecasting' && (
        <ForecastingSimulationScreen />
      )}
      {internalView === 'workbench' && (
        <AuditQueryWorkbenchScreen />
      )}
    </div>
  );
}
