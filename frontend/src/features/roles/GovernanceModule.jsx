import React, { useState } from 'react';
import {
  INITIAL_POLICIES,
  INITIAL_OBLIGATIONS,
  INITIAL_CONTROLS,
  INITIAL_ASSESSMENTS,
  INITIAL_ETHICS_CASES,
  INITIAL_GRIEVANCES,
  INITIAL_ACTIONS,
  INITIAL_DISCLOSURES,
  INITIAL_EVIDENCE_ITEMS,
  INITIAL_SUBMISSIONS,
  INITIAL_ACTION_CENTER_TASKS,
  INITIAL_BRSR_MAPPINGS,
  INITIAL_AUDIT_LOGS
} from './governance/governanceData';

import GovOverviewScreen from './governance/screens/GovOverviewScreen';
import GovPoliciesScreen from './governance/screens/GovPoliciesScreen';
import GovPolicyDetailScreen from './governance/screens/GovPolicyDetailScreen';
import GovObligationsScreen from './governance/screens/GovObligationsScreen';
import GovControlsScreen from './governance/screens/GovControlsScreen';
import GovAssessmentsScreen from './governance/screens/GovAssessmentsScreen';
import GovEthicsScreen from './governance/screens/GovEthicsScreen';
import GovComplaintsScreen from './governance/screens/GovComplaintsScreen';
import GovActionsScreen from './governance/screens/GovActionsScreen';
import GovDisclosuresScreen from './governance/screens/GovDisclosuresScreen';
import GovEvidenceScreen from './governance/screens/GovEvidenceScreen';
import GovSubmissionsScreen from './governance/screens/GovSubmissionsScreen';
import GovAnalyticsScreen from './governance/screens/GovAnalyticsScreen';
import GovActionCenterScreen from './governance/screens/GovActionCenterScreen';
import GovBRSRMappingScreen from './governance/screens/GovBRSRMappingScreen';
import GovAuditScreen from './governance/screens/GovAuditScreen';

import AddPolicyModal from './governance/modals/AddPolicyModal';
import AddObligationModal from './governance/modals/AddObligationModal';
import RegisterCaseModal from './governance/modals/RegisterCaseModal';

import { api } from '../../services/api';
import './GovernanceModule.css';

export default function GovernanceModule({
  activeTab = 'overview',
  onNavigateTab,
  reportingPeriod = 'September 2026',
  user = { name: 'Adv. S. K. Nair', role_title: 'Governance & Compliance Lead' }
}) {
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [obligations, setObligations] = useState(INITIAL_OBLIGATIONS);
  const [controls, setControls] = useState(INITIAL_CONTROLS);
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENTS);
  const [cases, setCases] = useState(INITIAL_ETHICS_CASES);
  const [complaints, setComplaints] = useState(INITIAL_GRIEVANCES);
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [disclosures, setDisclosures] = useState(INITIAL_DISCLOSURES);
  const [evidenceItems, setEvidenceItems] = useState(INITIAL_EVIDENCE_ITEMS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [actionTasks, setActionTasks] = useState(INITIAL_ACTION_CENTER_TASKS);
  const [mappings, setMappings] = useState(INITIAL_BRSR_MAPPINGS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Selected policy for Screen 3: Policy Detail (defaults to POL-002)
  const [selectedPolicy, setSelectedPolicy] = useState(INITIAL_POLICIES[1]);

  // Modal open states
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);
  const [isAddObligationOpen, setIsAddObligationOpen] = useState(false);
  const [isRegisterCaseOpen, setIsRegisterCaseOpen] = useState(false);
  const [caseModalType, setCaseModalType] = useState('ethics');

  // Live backend sync on mount
  useEffect(() => {
    api.getGovernancePolicies()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(p => {
            const matched = INITIAL_POLICIES.find(ip => ip.code === p.policy_code || ip.id === p.id);
            return {
              id: p.id || p.policy_code,
              code: p.policy_code,
              name: p.title || (matched ? matched.name : p.policy_code),
              category: p.category || 'Governance',
              department: matched ? matched.department : 'Legal & Ethics',
              owner: 'Legal',
              ownerName: user.name || 'Adv. S. K. Nair',
              effectiveDate: p.approval_date || (matched ? matched.effectiveDate : '01 Jan 2024'),
              reviewDate: matched ? matched.reviewDate : '01 Jan 2026',
              version: matched ? matched.version : 'v1.0',
              status: 'Active',
              approvalStatus: p.board_approved ? 'Approved' : 'Under Review',
              evidenceCount: matched ? matched.evidenceCount : 2,
              scope: 'Group Level & Subsidiaries',
              description: matched ? matched.description : `Policy governing ${p.category}`,
              applicability: 'All Employees & Business Partners',
              documentUrl: p.weblink || (matched ? matched.documentUrl : null),
              relatedObligations: matched ? matched.relatedObligations : ['CO-001'],
              relatedControls: matched ? matched.relatedControls : ['CTR-001']
            };
          });
          setPolicies(mapped);
          if (mapped.length > 0) {
            setSelectedPolicy(mapped[0]);
          }
        }
      })
      .catch(err => {
        console.warn('[Governance] Live policies fetch fallback:', err.message);
      });
  }, []);

  // Mutation handlers
  const handleAddPolicy = async (newPol) => {
    setPolicies(prev => [newPol, ...prev]);
    // Log in audit trail
    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        dateTime: 'Just now',
        user: user.name || 'Adv. S. K. Nair',
        action: 'Policy Created',
        entity: 'Policy',
        entityId: newPol.id,
        details: `${newPol.name} registered`
      },
      ...prev
    ]);

    try {
      await api.createGovernancePolicy({
        policy_code: newPol.code || newPol.id,
        title: newPol.name,
        category: newPol.category || 'Governance',
        board_approved: true,
        approval_date: newPol.effectiveDate || new Date().toISOString().split('T')[0],
        weblink: newPol.documentUrl || 'https://meil.in/governance',
        coverage_pct: 100.0,
        grievance_redressal_defined: true
      });
    } catch (e) {
      console.warn('[Governance] Backend create policy synced locally:', e.message);
    }
  };

  const handleAddObligation = (newObl) => {
    setObligations(prev => [newObl, ...prev]);
    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        dateTime: 'Just now',
        user: user.name || 'Adv. S. K. Nair',
        action: 'Obligation Created',
        entity: 'Obligation',
        entityId: newObl.id,
        details: `${newObl.requirement} added`
      },
      ...prev
    ]);
  };

  const handleRegisterCase = (newCase) => {
    if (caseModalType === 'ethics') {
      setCases(prev => [newCase, ...prev]);
    } else {
      setComplaints(prev => [newCase, ...prev]);
    }
    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        dateTime: 'Just now',
        user: user.name || 'Adv. S. K. Nair',
        action: caseModalType === 'ethics' ? 'Ethics Case Logged' : 'Grievance Registered',
        entity: caseModalType === 'ethics' ? 'Ethics' : 'Grievance',
        entityId: newCase.id,
        details: newCase.description
      },
      ...prev
    ]);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'policies':
        return (
          <GovPoliciesScreen
            policies={policies}
            onSelectPolicy={(p) => setSelectedPolicy(p)}
            onOpenAddPolicy={() => setIsAddPolicyOpen(true)}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'policy-detail':
        return (
          <GovPolicyDetailScreen
            policy={selectedPolicy}
            onBack={() => onNavigateTab?.('policies')}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'obligations':
      case 'compliance':
        return (
          <GovObligationsScreen
            obligations={obligations}
            onOpenAddObligation={() => setIsAddObligationOpen(true)}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'controls':
        return (
          <GovControlsScreen
            controls={controls}
            onOpenAddControl={() => alert('Opening Add Control configuration...')}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'assessments':
        return (
          <GovAssessmentsScreen
            assessments={assessments}
            onOpenStartAssessment={() => alert('Starting new periodic compliance assessment...')}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'ethics':
        return (
          <GovEthicsScreen
            cases={cases}
            onOpenRegisterCase={() => {
              setCaseModalType('ethics');
              setIsRegisterCaseOpen(true);
            }}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'grievances':
      case 'complaints':
        return (
          <GovComplaintsScreen
            complaints={complaints}
            onOpenRegisterComplaint={() => {
              setCaseModalType('grievance');
              setIsRegisterCaseOpen(true);
            }}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'actions':
      case 'compliance-actions':
        return (
          <GovActionsScreen
            actions={actions}
            onOpenCreateAction={() => alert('Creating CAPA / Compliance Action...')}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'disclosures':
        return (
          <GovDisclosuresScreen
            disclosures={disclosures}
            onOpenCreateRecord={() => alert('Creating Governance Disclosure record...')}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'evidence':
        return (
          <GovEvidenceScreen
            evidenceItems={evidenceItems}
            onOpenUploadEvidence={() => alert('Opening Evidence Upload Dialog...')}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'submissions':
        return (
          <GovSubmissionsScreen
            submissions={submissions}
            onOpenCreateSubmission={() => alert('Initiating new governance submission workflow...')}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'analytics':
        return (
          <GovAnalyticsScreen
            onNavigateTab={onNavigateTab}
          />
        );

      case 'action-center':
      case 'compliance-center':
        return (
          <GovActionCenterScreen
            actionTasks={actionTasks}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'brsr-mapping':
      case 'brsr':
        return (
          <GovBRSRMappingScreen
            mappings={mappings}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'audit':
      case 'traceability':
        return (
          <GovAuditScreen
            auditLogs={auditLogs}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'overview':
      default:
        return (
          <GovOverviewScreen
            onNavigateTab={onNavigateTab}
            onOpenAddPolicy={() => setIsAddPolicyOpen(true)}
            onOpenAddRecord={() => setIsAddObligationOpen(true)}
          />
        );
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {renderScreen()}

      {/* ──── MODALS ──── */}
      <AddPolicyModal
        isOpen={isAddPolicyOpen}
        onClose={() => setIsAddPolicyOpen(false)}
        onAddPolicy={handleAddPolicy}
      />

      <AddObligationModal
        isOpen={isAddObligationOpen}
        onClose={() => setIsAddObligationOpen(false)}
        onAddObligation={handleAddObligation}
      />

      <RegisterCaseModal
        isOpen={isRegisterCaseOpen}
        type={caseModalType}
        onClose={() => setIsRegisterCaseOpen(false)}
        onRegisterCase={handleRegisterCase}
      />
    </div>
  );
}
