import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Calendar,
  BookOpen,
  User,
  HelpCircle,
  Info,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function BUMoreScreen({ user }) {
  const [autoNotifySLA, setAutoNotifySLA] = useState(true);
  const [highlightAnomalies, setHighlightAnomalies] = useState(true);
  const [autoVerifyHashes, setAutoVerifyHashes] = useState(true);

  return (
    <div className="bu-more-screen">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Card 1: Reviewer Workflow Preferences */}
        <div className="bu-card">
          <div className="bu-card-header">
            <div>
              <h3 className="bu-card-title">Review Preferences</h3>
              <p className="bu-card-subtitle">
                Workflow automation and alert thresholds for BU Sustainability Coordinator
              </p>
            </div>
            <Settings size={18} color="#2563EB" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block' }}>
                  Auto-alert SLA Breaches
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  Notify when review queue turnaround reaches 75% of 72-hour window
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoNotifySLA}
                onChange={e => setAutoNotifySLA(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#2563EB' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block' }}>
                  Highlight YoY Anomalies (&gt;10%)
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  Flag fuel or energy deviations exceeding historical project baselines
                </span>
              </div>
              <input
                type="checkbox"
                checked={highlightAnomalies}
                onChange={e => setHighlightAnomalies(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#2563EB' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block' }}>
                  Strict Cryptographic Verification
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  Block approval if evidence SHA-256 does not match vendor registry
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoVerifyHashes}
                onChange={e => setAutoVerifyHashes(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#2563EB' }}
              />
            </label>
          </div>
        </div>

        {/* Card 2: Regulatory Reference Standards */}
        <div className="bu-card">
          <div className="bu-card-header">
            <div>
              <h3 className="bu-card-title">Regulatory Standards & Factors</h3>
              <p className="bu-card-subtitle">
                Governed carbon emission factors and statutory frameworks
              </p>
            </div>
            <BookOpen size={18} color="#10B981" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
            <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontWeight: 700, color: '#0F172A', display: 'block' }}>
                CEA India Grid Baseline Database (Version 19.0)
              </span>
              <span style={{ color: '#475569' }}>
                Standard factor: <strong>0.716 kg CO2e / kWh</strong> (National weighted average emission factor)
              </span>
            </div>

            <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontWeight: 700, color: '#0F172A', display: 'block' }}>
                SEBI BRSR Core Mandate (Circular 2023 & 2025)
              </span>
              <span style={{ color: '#475569' }}>
                Mandatory reasonable assurance on 9 ESG attributes across value chain
              </span>
            </div>

            <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontWeight: 700, color: '#0F172A', display: 'block' }}>
                ICAI Standard on Assurance Engagements (SAE 3410)
              </span>
              <span style={{ color: '#475569' }}>
                Verification protocol for greenhouse gas statements and immutable audit trails
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: User Profile & Scope Bounds */}
        <div className="bu-card">
          <div className="bu-card-header">
            <div>
              <h3 className="bu-card-title">User Scope & Authority</h3>
              <p className="bu-card-subtitle">
                RBAC permissions and organizational tier
              </p>
            </div>
            <User size={18} color="#6366F1" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Full Name</span>
              <strong style={{ color: '#0F172A' }}>{user?.full_name || 'R. K. Sharma'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Assigned Role</span>
              <strong style={{ color: '#2563EB' }}>BU Coordinator (BU_COORDINATOR)</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Authorized Scope</span>
              <strong style={{ color: '#0F172A' }}>Tunnels Business Unit (bu-tunnels)</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Parent Subsidiary</span>
              <strong style={{ color: '#0F172A' }}>Megha Core Infrastructure Division</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Allowed Projects</span>
              <strong style={{ color: '#0F172A' }}>6 Authorized Landmark Sites</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Approval Authority</span>
              <strong style={{ color: '#16A34A' }}>BU Review ➔ Subsidiary Forward</strong>
            </div>
          </div>
        </div>

        {/* Card 4: System Information */}
        <div className="bu-card">
          <div className="bu-card-header">
            <div>
              <h3 className="bu-card-title">System Information</h3>
              <p className="bu-card-subtitle">
                Enterprise software build and audit engine status
              </p>
            </div>
            <Info size={18} color="#0EA5E9" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B' }}>Platform Version</span>
              <strong style={{ color: '#0F172A' }}>MEIL ESG Platform v2.4 (Enterprise)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B' }}>Audit Ledger Engine</span>
              <strong style={{ color: '#16A34A' }}>SHA-256 Merkle DAG (Active)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B' }}>Active Reporting Cycle</span>
              <strong style={{ color: '#0F172A' }}>September 2026 (FY 2026-27 Q2)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#64748B' }}>Security Isolation</span>
              <strong style={{ color: '#2563EB' }}>Tier-2 Multi-Tenant Role Isolation</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
