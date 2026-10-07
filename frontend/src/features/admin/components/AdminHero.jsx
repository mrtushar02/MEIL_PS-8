import React from 'react';
import { Shield, Sparkles, Building, Users, Key, AlertTriangle } from 'lucide-react';

export default function AdminHero({
  kpi = {
    active_users: 17,
    active_roles: 15,
    active_projects: 258,
    open_alerts: 3,
    platform_health_pct: 98.7,
    security_status: 'Protected'
  }
}) {
  const healthPct = kpi.platform_health_pct || 98.7;
  // Calculate SVG stroke dash for circular progress
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthPct / 100) * circumference;

  return (
    <div className="admin-hero-card">
      <div className="admin-hero-content">
        <div className="admin-hero-pre">
          <Sparkles size={12} />
          ENTERPRISE CONTROL CENTER
        </div>
        <h1 className="admin-hero-title">Super Administrator</h1>
        <p className="admin-hero-subtitle">
          Manage users, roles, organization hierarchy, security controls, platform configuration, 
          reporting periods and enterprise system health across MEIL Group and its subsidiaries.
        </p>

        <div className="admin-hero-meta-row">
          <div className="admin-scope-chip">
            <Building size={14} color="#2563EB" />
            <span>Administrative Scope:</span>
            <strong style={{ color: '#2563EB' }}>GROUP-WIDE</strong>
          </div>

          <div className="admin-scope-chip">
            <Shield size={14} color="#16A34A" />
            <span>Security Posture:</span>
            <strong style={{ color: '#16A34A' }}>{kpi.security_status || 'Protected'}</strong>
          </div>
        </div>
      </div>

      <div className="admin-hero-health-box">
        <div className="admin-health-dial">
          <svg viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(226, 232, 240, 0.8)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#admin-health-gradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
            <defs>
              <linearGradient id="admin-health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="admin-health-dial-val">
            <span className="pct">{healthPct}%</span>
            <span className="lbl">Health</span>
          </div>
        </div>

        <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
          Platform Health
        </div>

        <div className="admin-health-metrics-grid">
          <div className="admin-hero-mini-stat">
            <span className="lbl">Active Users</span>
            <span className="val">{kpi.active_users || 17}</span>
          </div>
          <div className="admin-hero-mini-stat">
            <span className="lbl">Active Roles</span>
            <span className="val">{kpi.active_roles || 15}</span>
          </div>
          <div className="admin-hero-mini-stat">
            <span className="lbl">Projects</span>
            <span className="val">{kpi.active_projects || '258+'}</span>
          </div>
          <div className="admin-hero-mini-stat">
            <span className="lbl">Pending Alerts</span>
            <span className="val" style={{ color: '#D97706' }}>0{kpi.open_alerts || 3}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
