import React, { useState, useEffect, useCallback } from 'react';
import './SuperAdminModule.css';
import AdminContextBar from './components/AdminContextBar';
import SuperAdminOverview from './screens/SuperAdminOverview';
import AdminUsersScreen from './screens/AdminUsersScreen';
import AdminRolesScreen from './screens/AdminRolesScreen';
import AdminOrganizationScreen from './screens/AdminOrganizationScreen';
import AdminProjectsScreen from './screens/AdminProjectsScreen';
import AdminReportingPeriodsScreen from './screens/AdminReportingPeriodsScreen';
import AdminWorkflowScreen from './screens/AdminWorkflowScreen';
import AdminBRSRConfigScreen from './screens/AdminBRSRConfigScreen';
import AdminSecurityCenterScreen from './screens/AdminSecurityCenterScreen';
import AdminSystemHealthScreen from './screens/AdminSystemHealthScreen';
import AdminAuditScreen from './screens/AdminAuditScreen';
import AdminReportsScreen from './screens/AdminReportsScreen';
import AdminDataStorageScreen from './screens/AdminDataStorageScreen';
import AdminNotificationsScreen from './screens/AdminNotificationsScreen';
import AdminSettingsScreen from './screens/AdminSettingsScreen';

import { api } from '../../services/api';

export default function SuperAdminModule({
  user,
  activeTab = 'overview',
  onTabChange
}) {
  const [overviewData, setOverviewData] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [reportingPeriods, setReportingPeriods] = useState([]);
  const [workflowData, setWorkflowData] = useState(null);
  const [securityData, setSecurityData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [storageData, setStorageData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [factors, setFactors] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Load all primary backend datasets with deduplication and error resilience
  const loadAdminData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setIsRefreshing(true);

    try {
      // Parallel requests to backend APIs
      const [
        overviewRes,
        usersRes,
        rolesRes,
        permsRes,
        treeRes,
        projectsRes,
        periodsRes,
        workflowRes,
        secRes,
        healthRes,
        storageRes,
        notifsRes,
        auditRes,
        factorsRes
      ] = await Promise.allSettled([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getAdminRoles(),
        api.getAdminPermissions(),
        api.getOrganizationTree(),
        api.getProjects(),
        api.getReportingPeriods(),
        api.getAdminWorkflow(),
        api.getAdminSecurity(),
        api.getAdminHealth(),
        api.getAdminStorage(),
        api.getAdminNotifications(),
        api.getAuditLogs({ limit: 50 }),
        api.getEmissionFactors()
      ]);

      if (overviewRes.status === 'fulfilled') setOverviewData(overviewRes.value);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value);
      if (rolesRes.status === 'fulfilled') setRoles(rolesRes.value);
      if (permsRes.status === 'fulfilled') setPermissions(permsRes.value);
      if (treeRes.status === 'fulfilled') setTreeData(treeRes.value);
      if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value);
      if (periodsRes.status === 'fulfilled') setReportingPeriods(periodsRes.value);
      if (workflowRes.status === 'fulfilled') setWorkflowData(workflowRes.value);
      if (secRes.status === 'fulfilled') setSecurityData(secRes.value);
      if (healthRes.status === 'fulfilled') setHealthData(healthRes.value);
      if (storageRes.status === 'fulfilled') setStorageData(storageRes.value);
      if (notifsRes.status === 'fulfilled') setNotifications(notifsRes.value);
      if (auditRes.status === 'fulfilled') setAuditLogs(auditRes.value);
      if (factorsRes.status === 'fulfilled') setFactors(factorsRes.value);

      setLastSync(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('[AdminModule] Failed to fetch system data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  return (
    <div className="admin-workspace">
      {/* Dedicated Administrator Context Bar */}
      <AdminContextBar 
        lastSync={lastSync}
        onRefresh={() => loadAdminData(true)}
        isRefreshing={isRefreshing}
      />

      {/* Screen Routing */}
      {activeTab === 'overview' && (
        <SuperAdminOverview 
          overviewData={overviewData || {}}
          onSelectTab={onTabChange}
          onViewAudit={() => onTabChange?.('audit')}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsersScreen 
          users={users}
          roles={roles}
          isLoading={isLoading}
          onRefresh={() => loadAdminData(true)}
        />
      )}

      {activeTab === 'roles' && (
        <AdminRolesScreen 
          roles={roles}
          permissions={permissions}
        />
      )}

      {activeTab === 'organization' && (
        <AdminOrganizationScreen 
          treeData={treeData}
        />
      )}

      {activeTab === 'projects' && (
        <AdminProjectsScreen 
          projects={projects}
          treeData={treeData}
        />
      )}

      {activeTab === 'reporting-periods' && (
        <AdminReportingPeriodsScreen 
          periods={reportingPeriods}
          onRefresh={() => loadAdminData(true)}
        />
      )}

      {activeTab === 'workflow' && (
        <AdminWorkflowScreen 
          workflowData={workflowData}
        />
      )}

      {activeTab === 'brsr-config' && (
        <AdminBRSRConfigScreen 
          factors={factors}
        />
      )}

      {activeTab === 'security' && (
        <AdminSecurityCenterScreen 
          securityData={securityData}
        />
      )}

      {activeTab === 'health' && (
        <AdminSystemHealthScreen 
          healthData={healthData}
        />
      )}

      {activeTab === 'audit' && (
        <AdminAuditScreen 
          auditLogs={auditLogs}
        />
      )}

      {activeTab === 'reports' && (
        <AdminReportsScreen />
      )}

      {activeTab === 'storage' && (
        <AdminDataStorageScreen 
          storageData={storageData}
        />
      )}

      {activeTab === 'notifications' && (
        <AdminNotificationsScreen 
          notifications={notifications}
        />
      )}

      {activeTab === 'settings' && (
        <AdminSettingsScreen />
      )}
    </div>
  );
}
