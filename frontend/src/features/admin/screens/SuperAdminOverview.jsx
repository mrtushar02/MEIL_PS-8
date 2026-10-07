import React from 'react';
import AdminHero from '../components/AdminHero';
import AdminKpiStrip from '../components/AdminKpiStrip';
import { 
  Activity, 
  ShieldCheck, 
  Users, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function SuperAdminOverview({
  overviewData = {},
  onSelectTab,
  onViewAudit
}) {
  const kpi = overviewData.kpi || {};
  const security = overviewData.security_overview || {};
  const activity = overviewData.system_activity || [];
  const tasks = overviewData.recent_tasks || [];

  return (
    <div className="admin-overview-screen">
      {/* 1. Control Center Hero */}
      <AdminHero kpi={kpi} />

      {/* 2. KPI Strip */}
      <AdminKpiStrip kpi={kpi} onSelectTab={onSelectTab} />

      {/* 3. Two-Column System Activity & Security Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginBottom: '22px' }}>
        {/* Left: System Activity */}
        <div className="admin-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#2563EB" />
              <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
                System Activity (Recent)
              </h3>
            </div>
            <button 
              type="button" 
              className="admin-btn admin-btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '11px' }}
              onClick={() => onSelectTab?.('audit')}
            >
              View Full Audit Trail <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activity.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                No recent system events logged yet.
              </div>
            ) : (
              activity.slice(0, 6).map((item) => (
                <div 
                  key={item.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(248, 250, 252, 0.7)',
                    border: '1px solid rgba(241, 245, 249, 0.9)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: item.status === 'SUCCESS' ? '#16A34A' : '#D97706'
                    }} />
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#0F172A' }}>
                        {item.action.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        by <strong>{item.actor}</strong> ({item.role}) • {item.entity}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="admin-badge admin-badge-success" style={{ fontSize: '10px' }}>
                      {item.status}
                    </span>
                    <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '3px' }}>
                      Hash: {item.hash}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Security Overview */}
        <div className="admin-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#16A34A" />
              <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
                Security Overview
              </h3>
            </div>
            <button 
              type="button" 
              className="admin-btn admin-btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '11px' }}
              onClick={() => onSelectTab?.('security')}
            >
              Security Center <ExternalLink size={12} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div style={{ padding: '12px', background: 'rgba(234, 244, 255, 0.6)', borderRadius: '12px', border: '1px solid rgba(219, 234, 254, 0.8)' }}>
              <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: '700' }}>Authentication</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                {security.authentication_health || 99.9}%
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Zero breach status</div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(245, 243, 255, 0.6)', borderRadius: '12px', border: '1px solid rgba(237, 233, 254, 0.8)' }}>
              <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: '700' }}>JWT Validation</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                {security.jwt_validation || 99.8}%
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>SHA-256 HMAC active</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '10px', fontSize: '12px' }}>
              <span style={{ color: '#64748B' }}>Active Sessions</span>
              <strong style={{ color: '#0F172A' }}>{security.active_sessions || 12}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '10px', fontSize: '12px' }}>
              <span style={{ color: '#64748B' }}>Revoked Tokens in Blocklist</span>
              <strong style={{ color: '#0F172A' }}>{security.revoked_sessions || 3}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '10px', fontSize: '12px' }}>
              <span style={{ color: '#64748B' }}>Failed Logins (Last 24h)</span>
              <strong style={{ color: security.failed_logins_24h > 0 ? '#D97706' : '#16A34A' }}>
                {security.failed_logins_24h || 2}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '10px', fontSize: '12px' }}>
              <span style={{ color: '#64748B' }}>Rate Limit Events (15 min window)</span>
              <strong style={{ color: '#0F172A' }}>{security.rate_limit_events || 8}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Open Administrative Governance Tasks */}
      <div className="admin-card" style={{ margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#2563EB" />
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
              Open Administrative Tasks & Governance Milestones
            </h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {tasks.map((task) => (
            <div 
              key={task.id}
              style={{
                padding: '14px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(226, 232, 240, 0.85)',
                boxShadow: 'var(--admin-shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`admin-badge ${task.priority === 'HIGH' ? 'admin-badge-warning' : 'admin-badge-blue'}`} style={{ fontSize: '10px' }}>
                  {task.priority} PRIORITY
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{task.due}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                {task.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#16A34A', fontWeight: '600' }}>
                <CheckCircle2 size={12} /> {task.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
