import React, { useState, useEffect, useCallback } from 'react';
import { 
  getHROverview, 
  getHRWorkforce, 
  getHRTraining, 
  getHRWellbeing, 
  getHRHumanRights, 
  getHREvidence, 
  getHRSubmissions 
} from '../../services/api';

// Dedicated Sub-Screens
import HROverviewScreen from './hr/HROverviewScreen';
import HRWorkforceScreen from './hr/HRWorkforceScreen';
import HRTrainingScreen from './hr/HRTrainingScreen';
import HRWellbeingScreen from './hr/HRWellbeingScreen';
import HRHumanRightsScreen from './hr/HRHumanRightsScreen';
import HREvidenceScreen from './hr/HREvidenceScreen';
import HRSubmissionsScreen from './hr/HRSubmissionsScreen';
import './HRModule.css';

export default function HRModule({ 
  activeTab = 'overview', 
  onNavigateTab, 
  reportingPeriod = 'September 2026', 
  user 
}) {
  const [data, setData] = useState({
    overview: null,
    workforce: [],
    training: [],
    wellbeing: null,
    humanRights: null,
    evidence: [],
    submissions: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all domain data from backend
  const fetchAllHRData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        overviewRes,
        workforceRes,
        trainingRes,
        wellbeingRes,
        humanRightsRes,
        evidenceRes,
        submissionsRes
      ] = await Promise.allSettled([
        getHROverview(),
        getHRWorkforce(),
        getHRTraining(),
        getHRWellbeing(),
        getHRHumanRights(),
        getHREvidence(),
        getHRSubmissions()
      ]);

      setData({
        overview: overviewRes.status === 'fulfilled' ? overviewRes.value : null,
        workforce: workforceRes.status === 'fulfilled' ? (workforceRes.value?.records || workforceRes.value || []) : [],
        training: trainingRes.status === 'fulfilled' ? (trainingRes.value?.records || trainingRes.value || []) : [],
        wellbeing: wellbeingRes.status === 'fulfilled' ? wellbeingRes.value : null,
        humanRights: humanRightsRes.status === 'fulfilled' ? humanRightsRes.value : null,
        evidence: evidenceRes.status === 'fulfilled' ? (evidenceRes.value?.records || evidenceRes.value || []) : [],
        submissions: submissionsRes.status === 'fulfilled' ? (submissionsRes.value?.records || submissionsRes.value || []) : []
      });
    } catch (err) {
      console.warn('Backend fetch failed or partially degraded, falling back to local dataset:', err);
      setError('Live backend partially unreachable. Retaining active session data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllHRData();
  }, [fetchAllHRData]);

  // Render the appropriate section based on activeTab
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'workforce':
        return (
          <HRWorkforceScreen 
            workforce={data.workforce} 
            onRefresh={fetchAllHRData} 
            loading={loading}
            stats={data.overview?.stats}
          />
        );

      case 'training':
        return (
          <HRTrainingScreen 
            trainingData={data.training} 
            onRefresh={fetchAllHRData} 
            loading={loading}
            stats={data.overview?.stats}
          />
        );

      case 'wellbeing':
        return (
          <HRWellbeingScreen 
            wellbeingData={data.wellbeing} 
            onRefresh={fetchAllHRData} 
            loading={loading}
          />
        );

      case 'human-rights':
        return (
          <HRHumanRightsScreen 
            humanRightsData={data.humanRights} 
            onRefresh={fetchAllHRData} 
            loading={loading}
          />
        );

      case 'evidence':
        return (
          <HREvidenceScreen 
            evidence={data.evidence} 
            onRefresh={fetchAllHRData} 
            loading={loading}
          />
        );

      case 'submissions':
        return (
          <HRSubmissionsScreen 
            submissions={data.submissions} 
            onRefresh={fetchAllHRData} 
            loading={loading}
            stats={data.overview?.stats}
            user={user}
          />
        );

      case 'overview':
      default:
        return (
          <HROverviewScreen 
            overview={data.overview} 
            onRefresh={fetchAllHRData} 
            loading={loading}
            onNavigateTab={onNavigateTab}
            reportingPeriod={reportingPeriod}
          />
        );
    }
  };

  return (
    <div className="w-full pb-16 animate-in fade-in duration-200">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex items-center justify-between shadow-xs">
          <span>{error}</span>
          <button 
            onClick={fetchAllHRData} 
            className="font-semibold underline ml-2 hover:text-amber-900"
          >
            Retry
          </button>
        </div>
      )}

      {renderActiveScreen()}
    </div>
  );
}
