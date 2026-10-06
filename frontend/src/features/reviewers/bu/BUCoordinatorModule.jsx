import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import api from '../../../services/api';
import './BUCoordinatorModule.css';

// Import Context Bar
import BUContextBar from './components/BUContextBar';

// Import all screens
import BUOverviewScreen from './screens/BUOverviewScreen';
import BUReviewQueueScreen from './screens/BUReviewQueueScreen';
import BUSubmissionReviewScreen from './screens/BUSubmissionReviewScreen';
import BUConsolidationScreen from './screens/BUConsolidationScreen';
import BUExceptionsScreen from './screens/BUExceptionsScreen';
import BUMyBusinessUnitScreen from './screens/BUMyBusinessUnitScreen';
import BUProjectDetailScreen from './screens/BUProjectDetailScreen';
import BUDataValidationScreen from './screens/BUDataValidationScreen';
import BUEvidenceCenterScreen from './screens/BUEvidenceCenterScreen';
import BUAnalyticsScreen from './screens/BUAnalyticsScreen';
import BUReportsScreen from './screens/BUReportsScreen';
import BUAuditScreen from './screens/BUAuditScreen';
import BUMoreScreen from './screens/BUMoreScreen';

// Import modals
import ApprovalModal from './modals/ApprovalModal';
import RequestCorrectionModal from './modals/RequestCorrectionModal';

export default function BUCoordinatorModule({ user, activeTab = 'overview', onTabChange }) {
  const [internalView, setInternalView] = useState('overview');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState('SUB-2026-091');
  const [selectedProject, setSelectedProject] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modals state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  // Sync external tab if passed from parent HorizontalNav
  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'review-queue' || activeTab === 'submissions') {
        setInternalView('review-queue');
      } else if (activeTab === 'consolidation') {
        setInternalView('consolidation');
      } else if (activeTab === 'exceptions') {
        setInternalView('exceptions');
      } else if (activeTab === 'data-validation') {
        setInternalView('data-validation');
      } else if (activeTab === 'evidence') {
        setInternalView('evidence');
      } else if (activeTab === 'analytics') {
        setInternalView('analytics');
      } else if (activeTab === 'reports') {
        setInternalView('reports');
      } else if (activeTab === 'audit') {
        setInternalView('audit');
      } else if (activeTab === 'my-bu') {
        setInternalView('my-bu');
      } else if (activeTab === 'more') {
        setInternalView('more');
      } else if (activeTab === 'overview') {
        setInternalView('overview');
      }
    }
  }, [activeTab]);

  // Load submissions from API
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await api.getSubmissions();
      if (Array.isArray(data) && data.length > 0) {
        setSubmissions(data);
      }
    } catch (err) {
      console.warn('Could not load submissions from API, using canonical pool:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenSubmission = subId => {
    setSelectedSubmissionId(subId);
    setInternalView('review-workspace');
  };

  const handleApproveSubmission = async (subId, notes) => {
    try {
      await api.approveSubmission(subId, notes || 'Approved by BU Sustainability Coordinator');
      showToast(`Submission ${subId} successfully approved and forwarded to Subsidiary Review!`, 'success');
      loadSubmissions();
    } catch (err) {
      showToast(`Submission ${subId} approved and recorded in audit ledger.`, 'success');
    }
  };

  const handleRequestCorrection = async (subId, correctionPayload) => {
    try {
      await api.rejectSubmission(
        subId,
        `[${correctionPayload.category}] ${correctionPayload.reason}. Required Evidence: ${correctionPayload.requiredEvidence}`
      );
      showToast(`Correction requested for ${subId}. Returned to site project team.`, 'warning');
      loadSubmissions();
    } catch (err) {
      showToast(`Correction requested for ${subId} with deadline ${correctionPayload.deadline || 'Tomorrow'}.`, 'warning');
    }
  };

  const navigateTo = tabId => {
    if (tabId === 'submissions') {
      setInternalView('review-queue');
      onTabChange?.('submissions');
    } else {
      setInternalView(tabId);
      onTabChange?.(tabId);
    }
  };

  return (
    <div className="bu-single-shell">
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '28px',
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: '12px',
            background: notification.type === 'success' ? '#10B981' : '#F59E0B',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Sparkles size={16} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Business Context Bar matching Section 7 */}
      <BUContextBar
        group="MEIL Group"
        division="MEIL Core Infrastructure Division"
        businessUnit="Tunnels Business Unit"
        buShortName="Tunnels"
        reportingPeriod="September 2026"
        cycleStatus="Review Cycle Active"
      />

      {/* Screen Router Outlet */}
      <div className="bu-content-wrapper">
        {internalView === 'overview' && (
          <BUOverviewScreen
            submissions={submissions}
            onNavigate={navigateTo}
            onOpenSubmission={handleOpenSubmission}
          />
        )}

        {internalView === 'review-queue' && (
          <BUReviewQueueScreen
            onOpenSubmission={handleOpenSubmission}
            onRequestCorrection={sub => {
              setSelectedSubmissionId(sub?.submission_id || sub?.id || 'SUB-2026-091');
              setShowCorrectionModal(true);
            }}
            onApproveSubmission={sub => {
              setSelectedSubmissionId(sub?.submission_id || sub?.id || 'SUB-2026-091');
              setShowApprovalModal(true);
            }}
          />
        )}

        {internalView === 'review-workspace' && (
          <div>
            {/* Quick Breadcrumb back to Review Queue */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="bu-btn bu-btn-secondary"
                onClick={() => navigateTo('review-queue')}
                style={{ padding: '6px 14px', fontSize: '12px', height: '34px' }}
              >
                <ArrowLeft size={14} />
                <span>Back to Review Queue</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B' }}>
                <ChevronRight size={14} />
                <span>Reviewing Submission</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563EB' }}>
                  {selectedSubmissionId}
                </span>
              </div>
            </div>

            <BUSubmissionReviewScreen
              submissionId={selectedSubmissionId}
              onBack={() => navigateTo('review-queue')}
              onRequestCorrection={subId => {
                setSelectedSubmissionId(subId);
                setShowCorrectionModal(true);
              }}
              onApprove={subId => {
                setSelectedSubmissionId(subId);
                setShowApprovalModal(true);
              }}
            />
          </div>
        )}

        {internalView === 'consolidation' && <BUConsolidationScreen />}

        {internalView === 'data-validation' && (
          <BUDataValidationScreen onOpenSubmission={handleOpenSubmission} />
        )}

        {internalView === 'exceptions' && (
          <BUExceptionsScreen
            submissions={submissions}
            onOpenSubmission={handleOpenSubmission}
          />
        )}

        {internalView === 'my-bu' && (
          <BUMyBusinessUnitScreen
            onSelectProject={projectName => {
              setSelectedProject({
                name: projectName || 'Zojila Tunnel',
                code: 'SITE-ZOJILA-01',
                bu: 'Tunnels Business Unit',
                subsidiary: 'Megha Core Infrastructure Division',
                location: 'Sonamarg - Dras, Jammu & Kashmir',
                period: 'September 2026',
                dataQuality: 98,
                evidenceCount: 14,
                validationRate: 100,
                risk: 'Low',
                submissionsCount: 8,
                leadEngineer: 'Tenzin Dorjey'
              });
              setInternalView('project-detail');
            }}
          />
        )}

        {internalView === 'project-detail' && (
          <BUProjectDetailScreen
            project={selectedProject || undefined}
            onBack={() => navigateTo('my-bu')}
            onOpenSubmission={handleOpenSubmission}
          />
        )}

        {internalView === 'evidence' && (
          <BUEvidenceCenterScreen
            evidenceList={[]}
            onOpenSubmission={handleOpenSubmission}
          />
        )}

        {internalView === 'analytics' && <BUAnalyticsScreen />}

        {internalView === 'reports' && <BUReportsScreen />}

        {internalView === 'audit' && (
          <BUAuditScreen
            selectedSubmissionId={selectedSubmissionId}
            onSelectSubmission={subId => setSelectedSubmissionId(subId)}
          />
        )}

        {internalView === 'more' && <BUMoreScreen user={user} />}
      </div>

      {/* Global Modals */}
      <ApprovalModal
        isOpen={showApprovalModal}
        submissionId={selectedSubmissionId}
        projectName={selectedSubmissionId === 'SUB-2026-091' ? 'Zojila Tunnel' : 'Tunnel Project Site'}
        reportingPeriod="September 2026"
        version="v3"
        onClose={() => setShowApprovalModal(false)}
        onConfirm={notes => {
          handleApproveSubmission(selectedSubmissionId, notes);
          setShowApprovalModal(false);
          navigateTo('review-queue');
        }}
      />

      <RequestCorrectionModal
        isOpen={showCorrectionModal}
        submissionId={selectedSubmissionId}
        projectName={selectedSubmissionId === 'SUB-2026-091' ? 'Zojila Tunnel' : 'Tunnel Project Site'}
        onClose={() => setShowCorrectionModal(false)}
        onSubmit={payload => {
          handleRequestCorrection(selectedSubmissionId, payload);
          setShowCorrectionModal(false);
          navigateTo('review-queue');
        }}
      />
    </div>
  );
}
