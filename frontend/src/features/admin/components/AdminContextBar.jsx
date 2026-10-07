import React from 'react';
import { ShieldCheck, Activity, RefreshCw } from 'lucide-react';

export default function AdminContextBar({
  lastSync = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  onRefresh,
  isRefreshing = false
}) {
  return (
    <div className="admin-context-bar">
      <div className="admin-context-left">
        <span style={{ color: '#0F172A', fontWeight: '700' }}>MEIL ESG</span>
        <span className="admin-context-slash">/</span>
        <span className="admin-context-tag">Platform Administration</span>
      </div>

      <div className="admin-context-center">
        <div className="admin-env-pill">
          <span className="admin-env-indicator" />
          <span>Environment: Production / Enterprise</span>
        </div>
      </div>

      <div className="admin-context-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} color="#16A34A" />
          <span>System Status: <strong style={{ color: '#0F172A' }}>Operational</strong></span>
        </div>

        <span style={{ color: '#CBD5E1' }}>•</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Last Sync: <strong style={{ color: '#0F172A' }}>{lastSync}</strong></span>
          {onRefresh && (
            <button 
              type="button" 
              onClick={onRefresh}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                borderRadius: '4px'
              }}
              title="Refresh Platform State"
            >
              <RefreshCw size={13} className={isRefreshing ? 'spin' : ''} />
            </button>
          )}
        </div>

        <span style={{ color: '#CBD5E1' }}>•</span>

        <div className="admin-session-badge">
          <ShieldCheck size={13} />
          <span>Admin Session: Active</span>
        </div>
      </div>
    </div>
  );
}
