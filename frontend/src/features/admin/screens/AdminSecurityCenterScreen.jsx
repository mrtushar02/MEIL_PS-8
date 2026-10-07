import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Activity,
  LogOut
} from 'lucide-react';

export default function AdminSecurityCenterScreen({
  securityData = {}
}) {
  const metrics = securityData.metrics || {
    active_sessions: 12,
    revoked_tokens: 3,
    failed_logins_24h: 4,
    locked_accounts: 1,
    rate_limit_events: 8,
    security_alerts: 2
  };

  const events = securityData.recent_security_events || [
    { id: '1', time: '10:24', date: '2026-10-07', event: 'Failed login attempt (rate-limited)', user: 'Unknown', ip: '192.168.1.45', status: 'Blocked' },
    { id: '2', time: '09:12', date: '2026-10-07', event: 'Successful login', user: 'R. K. Sharma', ip: '10.0.0.12', status: 'Success' },
    { id: '3', time: '08:45', date: '2026-10-07', event: 'Multiple failed logins', user: 'Unknown', ip: '192.168.1.78', status: 'Alert' },
    { id: '4', time: '07:21', date: '2026-10-07', event: 'Suspicious activity investigated', user: 'System', ip: '10.0.0.5', status: 'Investigating' }
  ];

  return (
    <div className="admin-security-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Security Center</h2>
          <p>Monitor authentication health, cryptographic session states, token blocklists, and security events</p>
        </div>
      </div>

      {/* Top 6 Security KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div className="admin-card" style={{ margin: 0, padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>ACTIVE SESSIONS</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#16A34A', marginTop: '4px' }}>
            {metrics.active_sessions}
          </div>
          <div style={{ fontSize: '10.5px', color: '#16A34A' }}>Authorized users</div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>REVOKED TOKENS</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            {metrics.revoked_tokens}
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748B' }}>SHA-256 Blocklist</div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>FAILED LOGINS</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#DC2626', marginTop: '4px' }}>
            {metrics.failed_logins_24h}
          </div>
          <div style={{ fontSize: '10.5px', color: '#DC2626' }}>Last 24h</div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>LOCKED ACCOUNTS</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#D97706', marginTop: '4px' }}>
            {metrics.locked_accounts}
          </div>
          <div style={{ fontSize: '10.5px', color: '#D97706' }}>15-min lockout</div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>RATE LIMIT EVENTS</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563EB', marginTop: '4px' }}>
            {metrics.rate_limit_events}
          </div>
          <div style={{ fontSize: '10.5px', color: '#2563EB' }}>IP Throttled</div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>SECURITY ALERTS</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#DC2626', marginTop: '4px' }}>
            {metrics.security_alerts}
          </div>
          <div style={{ fontSize: '10.5px', color: '#DC2626' }}>Requires review</div>
        </div>
      </div>

      {/* Recent Security Events Table */}
      <div className="admin-table-card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Recent Security & Authentication Events
          </h3>
          <span className="admin-badge admin-badge-blue">Real-Time Audit Stream</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Security Event</th>
              <th>User / Actor</th>
              <th>Source IP</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={12} color="#64748B" />
                    <strong>{ev.time}</strong>
                  </div>
                </td>
                <td style={{ fontWeight: '600', color: '#0F172A' }}>{ev.event}</td>
                <td>{ev.user}</td>
                <td><code>{ev.ip}</code></td>
                <td>
                  <span className={`admin-badge ${
                    ev.status === 'Success' ? 'admin-badge-success' : 
                    ev.status === 'Blocked' ? 'admin-badge-danger' : 'admin-badge-warning'
                  }`}>
                    {ev.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cryptographic Protection Blueprint */}
      <div className="admin-card" style={{ margin: 0, padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
          Zero-Trust Security Controls & Cryptographic Architecture
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563EB', marginBottom: '4px' }}>
              Stateless JWT Token Policy
            </div>
            <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
              Signed via HS256 algorithm with 480-minute TTL. No plain tokens stored on database; revocation verified via in-memory SHA-256 blocklist.
            </div>
          </div>

          <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#16A34A', marginBottom: '4px' }}>
              Brute-Force Lockout Defense
            </div>
            <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
              Strict lockout enforced after 5 consecutive failed authentication attempts within a 15-minute sliding window. Returns HTTP 429 Too Many Requests.
            </div>
          </div>

          <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#7C3AED', marginBottom: '4px' }}>
              Cryptographic WORM Audit Trails
            </div>
            <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
              Every privilege change, user update, and lock action is hashed using SHA-256 with pointer to previous event hash, guaranteeing immutable chain integrity.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
