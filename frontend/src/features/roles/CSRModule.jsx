import React, { useState, useEffect } from 'react';
import {
  INITIAL_CSR_PROJECTS,
  INITIAL_COMMUNITIES,
  INITIAL_BENEFICIARIES_DATA,
  INITIAL_IMPACT_INDICATORS,
  INITIAL_STAKEHOLDERS,
  INITIAL_GRIEVANCES,
  INITIAL_EVIDENCE_ITEMS,
  INITIAL_SUBMISSIONS,
  INITIAL_ACTION_CENTER_ITEMS
} from './csr/csrData';
import api from '../../services/api';

import CSROverviewScreen from './csr/screens/CSROverviewScreen';
import CSRProjectsScreen from './csr/screens/CSRProjectsScreen';
import CSRProjectDetailScreen from './csr/screens/CSRProjectDetailScreen';
import CSRCommunityScreen from './csr/screens/CSRCommunityScreen';
import CSRBeneficiariesScreen from './csr/screens/CSRBeneficiariesScreen';
import CSRSocialImpactScreen from './csr/screens/CSRSocialImpactScreen';
import CSRStakeholdersScreen from './csr/screens/CSRStakeholdersScreen';
import CSRGrievancesScreen from './csr/screens/CSRGrievancesScreen';
import CSREvidenceScreen from './csr/screens/CSREvidenceScreen';
import CSRSubmissionsScreen from './csr/screens/CSRSubmissionsScreen';
import CSRAnalyticsScreen from './csr/screens/CSRAnalyticsScreen';
import CSRActionCenterScreen from './csr/screens/CSRActionCenterScreen';

import CreateCSRProjectModal from './csr/modals/CreateCSRProjectModal';
import LogCommunityActivityModal from './csr/modals/LogCommunityActivityModal';
import RegisterGrievanceModal from './csr/modals/RegisterGrievanceModal';
import './CSRModule.css';

export default function CSRModule({
  activeTab = 'overview',
  onNavigateTab,
  reportingPeriod = 'September 2026',
  user = { name: 'Priya Nair', role_title: 'CSR & Community Lead' }
}) {
  const [projects, setProjects] = useState(INITIAL_CSR_PROJECTS);
  const [communities, setCommunities] = useState(INITIAL_COMMUNITIES);
  const [grievances, setGrievances] = useState(INITIAL_GRIEVANCES);
  const [selectedProject, setSelectedProject] = useState(INITIAL_CSR_PROJECTS[0]);

  useEffect(() => {
    // 1. Fetch CSR Projects
    api.getCSRProjects().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
        setSelectedProject(data[0]);
      }
    }).catch(err => console.warn('Backend CSR projects fetch fallback:', err));

    // 2. Fetch CSR Communities
    api.getCSRCommunities().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setCommunities(data);
      }
    }).catch(err => console.warn('Backend CSR communities fetch fallback:', err));

    // 3. Fetch CSR Grievances
    api.getCSRGrievances().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setGrievances(data);
      }
    }).catch(err => console.warn('Backend CSR grievances fetch fallback:', err));
  }, []);

  // Modal open states
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [isRegisterGrievanceOpen, setIsRegisterGrievanceOpen] = useState(false);

  // Handlers
  const handleAddProject = async (newProj) => {
    try {
      await api.createCSRProject(newProj);
      const data = await api.getCSRProjects();
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
        return;
      }
    } catch (e) {
      console.warn('Real CSR project creation completed or fell back:', e);
    }
    setProjects((prev) => [newProj, ...prev]);
  };

  const handleRegisterGrievance = (newGrv) => {
    setGrievances((prev) => [newGrv, ...prev]);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'projects':
      case 'csr-projects':
        return (
          <CSRProjectsScreen
            projects={projects}
            onNavigateTab={onNavigateTab}
            onSelectProject={(p) => setSelectedProject(p)}
            onOpenCreateProject={() => setIsCreateProjectOpen(true)}
          />
        );

      case 'project-detail':
        return (
          <CSRProjectDetailScreen
            project={selectedProject}
            onNavigateTab={onNavigateTab}
            onBack={() => onNavigateTab?.('projects')}
          />
        );

      case 'community':
      case 'locations':
        return (
          <CSRCommunityScreen
            communities={communities}
            onNavigateTab={onNavigateTab}
          />
        );

      case 'beneficiaries':
        return (
          <CSRBeneficiariesScreen
            onNavigateTab={onNavigateTab}
          />
        );

      case 'social-impact':
      case 'impact':
        return (
          <CSRSocialImpactScreen
            onNavigateTab={onNavigateTab}
          />
        );

      case 'stakeholders':
        return (
          <CSRStakeholdersScreen
            onNavigateTab={onNavigateTab}
          />
        );

      case 'grievances':
        return (
          <CSRGrievancesScreen
            onNavigateTab={onNavigateTab}
            onOpenRegisterGrievance={() => setIsRegisterGrievanceOpen(true)}
          />
        );

      case 'evidence':
        return (
          <CSREvidenceScreen
            onNavigateTab={onNavigateTab}
          />
        );

      case 'submissions':
        return (
          <CSRSubmissionsScreen
            onNavigateTab={onNavigateTab}
          />
        );

      case 'analytics':
        return (
          <CSRAnalyticsScreen
            onNavigateTab={onNavigateTab}
            onOpenRegisterGrievance={() => setIsRegisterGrievanceOpen(true)}
          />
        );

      case 'actions':
      case 'action-center':
        return (
          <CSRActionCenterScreen
            onNavigateTab={onNavigateTab}
          />
        );

      case 'overview':
      default:
        return (
          <CSROverviewScreen
            projects={projects}
            onNavigateTab={onNavigateTab}
            onOpenCreateProject={() => setIsCreateProjectOpen(true)}
            onOpenLogActivity={() => setIsLogActivityOpen(true)}
            reportingPeriod={reportingPeriod}
          />
        );
    }
  };

  return (
    <div className="csr-module-root" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Active Screen Rendering */}
      {renderScreen()}

      {/* Global Modals */}
      <CreateCSRProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onAddProject={handleAddProject}
      />

      <LogCommunityActivityModal
        isOpen={isLogActivityOpen}
        onClose={() => setIsLogActivityOpen(false)}
        projects={projects}
      />

      <RegisterGrievanceModal
        isOpen={isRegisterGrievanceOpen}
        onClose={() => setIsRegisterGrievanceOpen(false)}
        onRegisterGrievance={handleRegisterGrievance}
        projects={projects}
      />
    </div>
  );
}
