import React from 'react';
import { 
  Users, 
  Key, 
  Network, 
  FolderKanban, 
  AlertTriangle, 
  ShieldCheck 
} from 'lucide-react';

export default function AdminKpiStrip({
  kpi = {},
  onSelectTab
}) {
  const cards = [
    {
      id: 'users',
      title: 'Active Users',
      value: kpi.active_users || '17',
      sub: 'All enterprise tiers',
      icon: Users,
      color: '#2563EB',
      bg: 'rgba(37, 99, 235, 0.08)',
      targetTab: 'users'
    },
    {
      id: 'roles',
      title: 'Active Roles',
      value: kpi.active_roles || '15',
      sub: '15 canonical definitions',
      icon: Key,
      color: '#7C3AED',
      bg: 'rgba(124, 58, 237, 0.08)',
      targetTab: 'roles'
    },
    {
      id: 'nodes',
      title: 'Organization Nodes',
      value: kpi.organization_nodes || '273',
      sub: 'HQ, 6 Subs, 6 BUs, 258+ Sites',
      icon: Network,
      color: '#0D9488',
      bg: 'rgba(13, 148, 136, 0.08)',
      targetTab: 'organization'
    },
    {
      id: 'projects',
      title: 'Active Projects',
      value: kpi.active_projects || '258+',
      sub: 'Across 18 states in India',
      icon: FolderKanban,
      color: '#0284C7',
      bg: 'rgba(2, 132, 199, 0.08)',
      targetTab: 'projects'
    },
    {
      id: 'alerts',
      title: 'Open System Alerts',
      value: kpi.open_alerts ? `0${kpi.open_alerts}` : '03',
      sub: '1 SLA risk, 2 security logs',
      icon: AlertTriangle,
      color: '#D97706',
      bg: 'rgba(217, 119, 6, 0.08)',
      targetTab: 'notifications'
    },
    {
      id: 'audit',
      title: 'Audit Integrity',
      value: kpi.audit_integrity || '100%',
      sub: 'Cryptographic chain verified',
      icon: ShieldCheck,
      color: '#16A34A',
      bg: 'rgba(22, 163, 74, 0.08)',
      targetTab: 'audit'
    }
  ];

  return (
    <div className="admin-kpi-grid">
      {cards.map((c) => {
        const IconComp = c.icon;
        return (
          <div 
            key={c.id} 
            className="admin-kpi-card" 
            onClick={() => onSelectTab && onSelectTab(c.targetTab)}
            style={{ cursor: onSelectTab ? 'pointer' : 'default' }}
          >
            <div className="admin-kpi-top">
              <span className="admin-kpi-title">{c.title}</span>
              <div className="admin-kpi-icon-wrap" style={{ background: c.bg, color: c.color }}>
                <IconComp size={16} />
              </div>
            </div>
            <div className="admin-kpi-value">{c.value}</div>
            <div className="admin-kpi-sub">{c.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
