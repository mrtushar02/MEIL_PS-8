import React, { useState, useEffect, useCallback } from 'react';
import {
  getHSEOverview,
  getHSEIncidents,
  createHSEIncident,
  updateHSEIncidentStatus,
  getHSEInspections,
  createHSEInspection,
  getHSECorrectiveActions,
  createHSECorrectiveAction,
  updateHSEActionStatus,
  getHSETraining,
  createHSETrainingBatch,
  getHSEEnvironmental,
  createHSEEnvironmentalRecord,
  getHSEEvidence,
  uploadHSEEvidence,
  getHSESubmissions,
  createHSESubmission
} from '../../services/api';

import EHSOverviewScreen from './ehs/screens/EHSOverviewScreen';
import EHSSafetyScreen from './ehs/screens/EHSSafetyScreen';
import EHSIncidentsScreen from './ehs/screens/EHSIncidentsScreen';
import EHSInspectionsScreen from './ehs/screens/EHSInspectionsScreen';
import EHSCorrectiveActionsScreen from './ehs/screens/EHSCorrectiveActionsScreen';
import EHSTrainingScreen from './ehs/screens/EHSTrainingScreen';
import EHSEnvironmentalScreen from './ehs/screens/EHSEnvironmentalScreen';
import EHSEvidenceScreen from './ehs/screens/EHSEvidenceScreen';
import EHSSubmissionsScreen from './ehs/screens/EHSSubmissionsScreen';
import EHSAnalyticsScreen from './ehs/screens/EHSAnalyticsScreen';
import EHSComplianceScreen from './ehs/screens/EHSComplianceScreen';
import EHSAuditScreen from './ehs/screens/EHSAuditScreen';

import ReportIncidentModal from './ehs/modals/ReportIncidentModal';
import IncidentDetailDrawer from './ehs/drawers/IncidentDetailDrawer';
import './EHSModule.css';

export default function EHSModule({
  activeTab = 'overview',
  onNavigateTab,
  reportingPeriod = 'September 2026',
  user = { name: 'Rohit Kumar', role_title: 'EHS & Safety Specialist' }
}) {
  const [data, setData] = useState({
    overview: null,
    incidents: [],
    inspections: [],
    correctiveActions: [],
    training: [],
    environmental: [],
    evidence: [],
    submissions: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal and Drawer states
  const [isReportIncidentModalOpen, setIsReportIncidentModalOpen] = useState(false);
  const [selectedIncidentForDrawer, setSelectedIncidentForDrawer] = useState(null);

  // Fetch all domain data from backend/api
  const fetchAllHSEData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        overviewRes,
        incidentsRes,
        inspectionsRes,
        actionsRes,
        trainingRes,
        envRes,
        evidenceRes,
        submissionsRes
      ] = await Promise.allSettled([
        getHSEOverview(),
        getHSEIncidents(),
        getHSEInspections(),
        getHSECorrectiveActions(),
        getHSETraining(),
        getHSEEnvironmental(),
        getHSEEvidence(),
        getHSESubmissions()
      ]);

      setData({
        overview: overviewRes.status === 'fulfilled' ? overviewRes.value : null,
        incidents: incidentsRes.status === 'fulfilled' ? incidentsRes.value : [],
        inspections: inspectionsRes.status === 'fulfilled' ? inspectionsRes.value : [],
        correctiveActions: actionsRes.status === 'fulfilled' ? actionsRes.value : [],
        training: trainingRes.status === 'fulfilled' ? trainingRes.value : [],
        environmental: envRes.status === 'fulfilled' ? envRes.value : [],
        evidence: evidenceRes.status === 'fulfilled' ? evidenceRes.value : [],
        submissions: submissionsRes.status === 'fulfilled' ? submissionsRes.value : []
      });
    } catch (err) {
      console.warn('Backend fetch failed, using enterprise state:', err);
      setError('Live backend partially unreachable. Retaining active session data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllHSEData();
  }, [fetchAllHSEData]);

  // Handler functions for real mutations
  const handleReportIncident = async (newIncidentData) => {
    try {
      const res = await createHSEIncident(newIncidentData);
      setData(prev => ({
        ...prev,
        incidents: [res, ...prev.incidents]
      }));
      setIsReportIncidentModalOpen(false);
    } catch (err) {
      console.error('Failed to report incident:', err);
    }
  };

  const handleUpdateIncidentStatus = async (id, status, notes) => {
    try {
      const res = await updateHSEIncidentStatus(id, status, notes);
      setData(prev => ({
        ...prev,
        incidents: prev.incidents.map(inc => inc.id === id ? { ...inc, status: res.status } : inc)
      }));
      if (selectedIncidentForDrawer?.id === id) {
        setSelectedIncidentForDrawer(prev => prev ? { ...prev, status: res.status } : null);
      }
    } catch (err) {
      console.error('Failed to update incident status:', err);
    }
  };

  const handleCreateInspection = async (newInspData) => {
    try {
      const res = await createHSEInspection(newInspData);
      setData(prev => ({
        ...prev,
        inspections: [res, ...prev.inspections]
      }));
    } catch (err) {
      console.error('Failed to create inspection:', err);
    }
  };

  const handleCreateAction = async (newActionData) => {
    try {
      const res = await createHSECorrectiveAction(newActionData);
      setData(prev => ({
        ...prev,
        correctiveActions: [res, ...prev.correctiveActions]
      }));
    } catch (err) {
      console.error('Failed to create action:', err);
    }
  };

  const handleUpdateActionStatus = async (id, status) => {
    try {
      const res = await updateHSEActionStatus(id, status);
      setData(prev => ({
        ...prev,
        correctiveActions: prev.correctiveActions.map(act => act.id === id ? { ...act, status: res.status } : act)
      }));
    } catch (err) {
      console.error('Failed to update action status:', err);
    }
  };

  const handleCreateTrainingBatch = async (newBatchData) => {
    try {
      const res = await createHSETrainingBatch(newBatchData);
      setData(prev => ({
        ...prev,
        training: [res, ...prev.training]
      }));
    } catch (err) {
      console.error('Failed to create training batch:', err);
    }
  };

  const handleCreateEnvironmentalRecord = async (newEnvData) => {
    try {
      const res = await createHSEEnvironmentalRecord(newEnvData);
      setData(prev => ({
        ...prev,
        environmental: [res, ...prev.environmental]
      }));
    } catch (err) {
      console.error('Failed to create environmental record:', err);
    }
  };

  const handleUploadEvidence = async (newEvData) => {
    try {
      const res = await uploadHSEEvidence(newEvData);
      setData(prev => ({
        ...prev,
        evidence: [res, ...prev.evidence]
      }));
    } catch (err) {
      console.error('Failed to upload evidence:', err);
    }
  };

  const handleCreateSubmission = async (newSubData) => {
    try {
      const res = await createHSESubmission(newSubData);
      setData(prev => ({
        ...prev,
        submissions: [res, ...prev.submissions]
      }));
    } catch (err) {
      console.error('Failed to create submission:', err);
    }
  };

  // Render the appropriate sub-screen based on activeTab (12 distinct screens matching image)
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'safety':
        return (
          <EHSSafetyScreen
            incidents={data.incidents}
            onOpenReportIncidentModal={() => setIsReportIncidentModalOpen(true)}
            onOpenIncidentDetail={(inc) => setSelectedIncidentForDrawer(inc)}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'incidents':
        return (
          <EHSIncidentsScreen
            incidents={data.incidents}
            onOpenReportIncidentModal={() => setIsReportIncidentModalOpen(true)}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'inspections':
        return (
          <EHSInspectionsScreen
            inspections={data.inspections}
            onCreateInspection={handleCreateInspection}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'corrective-actions':
        return (
          <EHSCorrectiveActionsScreen
            actions={data.correctiveActions}
            onCreateAction={handleCreateAction}
            onUpdateActionStatus={handleUpdateActionStatus}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'training':
        return (
          <EHSTrainingScreen
            trainingBatches={data.training}
            onCreateTrainingBatch={handleCreateTrainingBatch}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'environmental':
        return (
          <EHSEnvironmentalScreen
            records={data.environmental}
            onCreateRecord={handleCreateEnvironmentalRecord}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'evidence':
        return (
          <EHSEvidenceScreen
            evidence={data.evidence}
            onUploadEvidence={handleUploadEvidence}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'submissions':
        return (
          <EHSSubmissionsScreen
            submissions={data.submissions}
            onCreateSubmission={handleCreateSubmission}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'analytics':
        return (
          <EHSAnalyticsScreen
            overview={data.overview}
            incidents={data.incidents}
            user={user}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'compliance':
        return (
          <EHSComplianceScreen
            overview={data.overview}
            correctiveActions={data.correctiveActions}
            inspections={data.inspections}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'audit':
        return (
          <EHSAuditScreen
            onNavigateTab={onNavigateTab}
          />
        );

      case 'overview':
      default:
        return (
          <EHSOverviewScreen
            overview={data.overview}
            incidents={data.incidents}
            onNavigateTab={onNavigateTab}
            onOpenReportIncidentModal={() => setIsReportIncidentModalOpen(true)}
            onOpenIncidentDetail={(inc) => setSelectedIncidentForDrawer(inc)}
          />
        );
    }
  };

  return (
    <div className="ehs-module-root" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Error alert banner if any */}
      {error && (
        <div style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#B45309', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button 
            type="button" 
            onClick={fetchAllHSEData} 
            style={{ fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#B45309' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Render the Active Screen Component (Exact Replica) */}
      {renderActiveScreen()}

      {/* Global Report Incident Modal */}
      <ReportIncidentModal
        isOpen={isReportIncidentModalOpen}
        onClose={() => setIsReportIncidentModalOpen(false)}
        onSubmit={handleReportIncident}
      />

      {/* Global Incident Detail Drawer */}
      <IncidentDetailDrawer
        incident={selectedIncidentForDrawer}
        onClose={() => setSelectedIncidentForDrawer(null)}
        onUpdateStatus={handleUpdateIncidentStatus}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
}
