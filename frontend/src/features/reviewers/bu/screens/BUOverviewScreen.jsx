import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Paperclip, 
  ShieldCheck, 
  RotateCcw, 
  TrendingUp,
  Inbox,
  ArrowRight,
  Sparkles,
  ExternalLink,
  User,
  ShieldAlert,
  Droplet,
  Zap,
  Trash2,
  Users,
  Scale
} from 'lucide-react';

export default function BUOverviewScreen({
  submissions = [],
  projects = [],
  consolidation = {},
  onOpenSubmission,
  onNavigate
}) {
  const [snapshotTab, setSnapshotTab] = useState('Environment');

  // Aggregate real stats
  const totalSubmissions = submissions.length || 37;
  const pendingCount = submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'BU_REVIEW').length || 8;
  const approvedCount = submissions.filter(s => s.status === 'BU_APPROVED' || s.status === 'SUBSIDIARY_APPROVED').length || 24;
  const correctionCount = submissions.filter(s => s.status === 'CORRECTION_REQUIRED').length || 3;
  const slaRiskCount = 2;

  const readinessScore = 92.4;
  const submissionCoverage = 96.2;
  const evidenceCoverage = 94.8;
  const highRiskCount = 3;

  // Section 3: Review Queue Summary (Top 5 Pending Submissions)
  const topPendingSubmissions = [
    { id: 'SUB-2026-091', project: 'Zojila Tunnel', period: 'Sep 2026', quality: 98, evidence: '14/14', risk: 'Low', sla: '18h', status: 'Pending Review' },
    { id: 'SUB-2026-087', project: 'Gayatri Project', period: 'Sep 2026', quality: 82, evidence: '12/14', risk: 'Medium', sla: '6h', status: 'SLA At Risk' },
    { id: 'SUB-2026-084', project: 'Tunnel B', period: 'Sep 2026', quality: 72, evidence: '8/14', risk: 'High', sla: 'Overdue (-2h)', status: 'Correction Req.' },
    { id: 'SUB-2026-081', project: 'Gayatri Link', period: 'Sep 2026', quality: 92, evidence: '14/14', risk: 'Low', sla: '24h', status: 'Pending Review' },
    { id: 'SUB-2026-075', project: 'River Link', period: 'Sep 2026', quality: 95, evidence: '13/14', risk: 'Low', sla: '32h', status: 'Pending Review' },
  ];

  // Section 4: Recent Activity Timeline
  const recentActivities = [
    { actor: 'Tenzin Dorjey', role: 'Site Officer', timestamp: '2 hours ago', action: 'Submission SUB-2026-091 received for Zojila Tunnel', type: 'submission' },
    { actor: 'System Gate', role: 'Automated Rule Engine', timestamp: '2 hours ago', action: 'Automated validation passed (8/8 rules passed)', type: 'validation' },
    { actor: 'Tenzin Dorjey', role: 'Site Officer', timestamp: '3 hours ago', action: 'Evidence uploaded: Diesel_Invoice.pdf (SHA-256 verified)', type: 'evidence' },
    { actor: 'R. K. Sharma', role: 'BU Coordinator', timestamp: '5 hours ago', action: 'Correction requested for SUB-2026-084 (Tunnel B)', type: 'correction' },
    { actor: 'R. K. Sharma', role: 'BU Coordinator', timestamp: 'Yesterday', action: 'Submission SUB-2026-082 (Metro Phase 1) approved to Subsidiary', type: 'approval' }
  ];

  // Section 5: Project Performance Matrix
  const projectMatrix = [
    { name: 'Zojila Tunnel', scope1: 420, scope2: 380, energy: '2.4M kWh', water: '65,000 KL', waste: '93%', ltifr: 0.00, readiness: 96, status: 'Approved' },
    { name: 'Gayatri Project', scope1: 390, scope2: 320, energy: '1.8M kWh', water: '62,000 KL', waste: '88%', ltifr: 0.02, readiness: 91, status: 'Approved' },
    { name: 'Tunnel B', scope1: 350, scope2: 240, energy: '1.2M kWh', water: '45,000 KL', waste: '76%', ltifr: 0.08, readiness: 72, status: 'Correction' },
    { name: 'River Link', scope1: 310, scope2: 200, energy: '1.5M kWh', water: '55,000 KL', waste: '84%', ltifr: 0.05, readiness: 85, status: 'Approved' },
    { name: 'Metro Phase 1', scope1: 260, scope2: 210, energy: '1.4M kWh', water: '48,000 KL', waste: '87%', ltifr: 0.04, readiness: 89, status: 'Review' },
    { name: 'Expressway', scope1: 285, scope2: 195, energy: '1.6M kWh', water: '51,000 KL', waste: '91%', ltifr: 0.00, readiness: 94, status: 'Approved' },
  ];

  // Section 6: Upcoming Review Deadlines
  const upcomingDeadlines = [
    { project: 'Gayatri Project', submissionId: 'SUB-2026-087', deadline: 'Today, 18:00', remaining: '6h remaining', urgency: 'At Risk' },
    { project: 'Tunnel B', submissionId: 'SUB-2026-084', deadline: 'Yesterday, 20:00', remaining: 'Overdue by 2h', urgency: 'Overdue' },
    { project: 'Zojila Tunnel', submissionId: 'SUB-2026-091', deadline: 'Tomorrow, 12:00', remaining: '18h remaining', urgency: 'Healthy' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ── 1. TOP: HERO + BU HEALTH PANEL ── */}
      <div className="bu-hero-card">
        <div className="bu-hero-content">
          <div className="bu-hero-title-row">
            <h1 className="bu-hero-title">Business Unit Review Center</h1>
          </div>
          <div className="bu-hero-subtitle">
            Business Unit Sustainability Reviewer / Coordinator • R. K. Sharma
          </div>
          <p className="bu-hero-desc">
            Review project submissions, verify ESG data, inspect evidence, manage exceptions, monitor review SLA, consolidate BU performance, and approve verified submissions for subsidiary review.
          </p>

          <div className="bu-hero-chips">
            <div className="bu-hero-chip">
              <span style={{ color: '#64748B' }}>Current Cycle:</span> <strong>September 2026</strong>
            </div>
            <div className="bu-hero-chip">
              <span style={{ color: '#64748B' }}>Review Scope:</span> <strong>6 Projects</strong>
            </div>
            <div className="bu-hero-chip" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
              <span style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A' }} />
                Review Cycle Active
              </span>
            </div>
          </div>
        </div>

        {/* Right: BU Health Panel matching Item 8 */}
        <div className="bu-hero-gauge-wrap">
          <div className="bu-radial-score">
            <span className="bu-score-value">{readinessScore}%</span>
            <span className="bu-score-label">BU ESG Readiness</span>
          </div>

          <div className="bu-gauge-stats">
            <div className="bu-gauge-stat-item">
              <span className="bu-gauge-stat-label">Submission Coverage</span>
              <span className="bu-gauge-stat-val">{submissionCoverage}%</span>
            </div>
            <div className="bu-gauge-stat-item">
              <span className="bu-gauge-stat-label">Evidence Coverage</span>
              <span className="bu-gauge-stat-val">{evidenceCoverage}%</span>
            </div>
            <div className="bu-gauge-stat-item">
              <span className="bu-gauge-stat-label">Validation Pass Rate</span>
              <span className="bu-gauge-stat-val" style={{ color: '#16A34A' }}>97.1%</span>
            </div>
            <div className="bu-gauge-stat-item">
              <span className="bu-gauge-stat-label">High-Risk Items</span>
              <span className="bu-gauge-stat-val" style={{ color: '#DC2626' }}>0{highRiskCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SECOND: PRIMARY KPI ROW (6 CARDS) ── */}
      <div className="bu-kpi-grid">
        <div className="bu-kpi-card" onClick={() => onNavigate?.('review-queue')} style={{ cursor: 'pointer' }}>
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">Pending Review</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Inbox size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#2563EB' }}>0{pendingCount}</div>
          <div className="bu-kpi-sub">Needs reviewer attention</div>
        </div>

        <div className="bu-kpi-card">
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">Approved</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16A34A' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#16A34A' }}>{approvedCount}</div>
          <div className="bu-kpi-sub">This reporting period</div>
        </div>

        <div className="bu-kpi-card" onClick={() => onNavigate?.('review-queue')} style={{ cursor: 'pointer' }}>
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">Correction Required</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' }}>
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#DC2626' }}>0{correctionCount}</div>
          <div className="bu-kpi-sub">Returned to project teams</div>
        </div>

        <div className="bu-kpi-card" onClick={() => onNavigate?.('exceptions')} style={{ cursor: 'pointer' }}>
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">SLA At Risk</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#D97706' }}>0{slaRiskCount}</div>
          <div className="bu-kpi-sub">Requires immediate attention</div>
        </div>

        <div className="bu-kpi-card" onClick={() => onNavigate?.('evidence')} style={{ cursor: 'pointer' }}>
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">Evidence Coverage</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}>
              <Paperclip size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#7C3AED' }}>{evidenceCoverage}%</div>
          <div className="bu-kpi-sub">Verified submissions</div>
        </div>

        <div className="bu-kpi-card" onClick={() => onNavigate?.('data-validation')} style={{ cursor: 'pointer' }}>
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">Validation Pass Rate</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0D9488' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#0D9488' }}>97.1%</div>
          <div className="bu-kpi-sub">Automated quality gate</div>
        </div>
      </div>

      {/* ── 3. THIRD ROW: REVIEW QUEUE SUMMARY & RISK/SLA SUMMARY ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Left: Review Queue Summary */}
        <div className="bu-card">
          <div className="bu-card-header">
            <div>
              <h3 className="bu-card-title">Review Queue Summary</h3>
              <p className="bu-card-subtitle">Top pending submissions requiring coordinator review</p>
            </div>
            <button
              className="bu-btn bu-btn-secondary"
              onClick={() => onNavigate?.('review-queue')}
              style={{ padding: '6px 12px', fontSize: '11px', height: '30px' }}
            >
              <span>View Full Queue</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="bu-table-container">
            <table className="bu-table">
              <thead>
                <tr>
                  <th>Submission</th>
                  <th>Project</th>
                  <th>Quality</th>
                  <th>Evidence</th>
                  <th>Risk</th>
                  <th>SLA</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {topPendingSubmissions.map(sub => (
                  <tr key={sub.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563EB' }}>
                        {sub.id}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{sub.project}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: sub.quality >= 90 ? '#16A34A' : '#D97706' }}>
                        {sub.quality}%
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#475569' }}>{sub.evidence}</span>
                    </td>
                    <td>
                      <span
                        className={sub.risk === 'High' ? 'bu-badge-danger' : sub.risk === 'Medium' ? 'bu-badge-warning' : 'bu-badge-neutral'}
                        style={{ fontSize: '10px' }}
                      >
                        {sub.risk}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: sub.sla.includes('Overdue') ? '#DC2626' : '#475569' }}>
                        {sub.sla}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="bu-btn bu-btn-primary"
                        style={{ padding: '3px 10px', fontSize: '11px', height: '26px' }}
                        onClick={() => onOpenSubmission && onOpenSubmission(sub.id)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Risk & SLA Summary */}
        <div className="bu-card">
          <div className="bu-card-header">
            <div>
              <h3 className="bu-card-title">Risk & SLA Summary</h3>
              <p className="bu-card-subtitle">Submission exposure and deadline pressure</p>
            </div>
            <ShieldAlert size={18} color="#D97706" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: '10px', border: '1px solid #FECACA' }}>
              <span style={{ fontSize: '11px', color: '#991B1B', display: 'block', fontWeight: 600 }}>Critical</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#DC2626' }}>01</span>
            </div>
            <div style={{ background: '#FFFBEB', padding: '12px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
              <span style={{ fontSize: '11px', color: '#92400E', display: 'block', fontWeight: 600 }}>High</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#D97706' }}>03</span>
            </div>
            <div style={{ background: '#F0F9FF', padding: '12px', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
              <span style={{ fontSize: '11px', color: '#075985', display: 'block', fontWeight: 600 }}>Medium</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0284C7' }}>04</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Due Today</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#DC2626' }}>1 Submission</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Due Tomorrow</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#D97706' }}>3 Submissions</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Overdue</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#DC2626' }}>1 Submission (Tunnel B)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. FOURTH ROW: BU ESG SNAPSHOT & RECENT ACTIVITY ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left: BU ESG Snapshot (Tabs: Environment, Social, Governance) */}
        <div className="bu-card">
          <div className="bu-card-header">
            <div>
              <h3 className="bu-card-title">Business Unit ESG Snapshot</h3>
              <p className="bu-card-subtitle">Consolidated operational metrics across 6 sites</p>
            </div>
            <div className="bu-segmented-nav" style={{ margin: 0 }}>
              {['Environment', 'Social', 'Governance'].map(tab => (
                <button
                  key={tab}
                  className={`bu-segmented-btn ${snapshotTab === tab ? 'active' : ''}`}
                  onClick={() => setSnapshotTab(tab)}
                  style={{ padding: '3px 10px', fontSize: '11px' }}
                >
                  <span>{tab}</span>
                </button>
              ))}
            </div>
          </div>

          {snapshotTab === 'Environment' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Scope 1</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>2,015 tCO2e</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Scope 2</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>1,545 tCO2e</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Energy</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>9.9M kWh</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Renewable</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#16A34A' }}>22% Mix</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Water Recycled</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0284C7' }}>88.2%</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Waste Diversion</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#059669' }}>81.4%</span>
              </div>
            </div>
          )}

          {snapshotTab === 'Social' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Workforce Strength</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>1,840 Personnel</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>LTIFR Safety Rate</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#16A34A' }}>0.04 (Target &lt;0.1)</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>HSE Training Hours</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>12.4 hrs / worker</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Safety Audit Score</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#059669' }}>94.6%</span>
              </div>
            </div>
          )}

          {snapshotTab === 'Governance' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>BRSR Principles Mapped</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>9 / 9 Principles</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Statutory Compliance</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#16A34A' }}>100% Compliant</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>External Audit Readiness</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#059669' }}>97.8% Ready</span>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Ledger Hash Chain</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#2563EB' }}>184 Verified Blocks</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Recent Activity Timeline matching Item 11 */}
        <div className="bu-card">
          <div className="bu-card-header">
            <div>
              <h3 className="bu-card-title">Recent Activity</h3>
              <p className="bu-card-subtitle">Real-time custody events & coordinator workflow</p>
            </div>
            <Clock size={16} color="#64748B" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map((act, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  paddingBottom: '10px',
                  borderBottom: idx !== recentActivities.length - 1 ? '1px solid #F1F5F9' : 'none'
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background:
                      act.type === 'approval'
                        ? '#16A34A'
                        : act.type === 'correction'
                        ? '#DC2626'
                        : '#2563EB',
                    marginTop: '5px',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: 500 }}>
                    {act.action}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    <strong>{act.actor}</strong> ({act.role}) • {act.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. FIFTH ROW: PROJECT PERFORMANCE MATRIX ── */}
      <div className="bu-card">
        <div className="bu-card-header">
          <div>
            <h3 className="bu-card-title">Project Performance Matrix</h3>
            <p className="bu-card-subtitle">Operational emissions, resource consumption, and readiness across sites</p>
          </div>
          <span className="bu-badge-neutral" style={{ fontSize: '11px' }}>6 Project Sites</span>
        </div>

        <div className="bu-table-container">
          <table className="bu-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Scope 1 (tCO2e)</th>
                <th>Scope 2 (tCO2e)</th>
                <th>Energy (kWh)</th>
                <th>Water (KL)</th>
                <th>Waste (%)</th>
                <th>Safety (LTIFR)</th>
                <th>Readiness</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {projectMatrix.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{row.name}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{row.scope1}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{row.scope2}</span>
                  </td>
                  <td>
                    <span style={{ color: '#475569' }}>{row.energy}</span>
                  </td>
                  <td>
                    <span style={{ color: '#475569' }}>{row.water}</span>
                  </td>
                  <td>
                    <span style={{ color: '#475569' }}>{row.waste}</span>
                  </td>
                  <td>
                    <span style={{ color: '#16A34A', fontWeight: 600 }}>{row.ltifr}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: row.readiness >= 90 ? '#16A34A' : '#D97706' }}>
                      {row.readiness}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span
                      className={
                        row.status === 'Approved'
                          ? 'bu-badge-success'
                          : row.status === 'Correction'
                          ? 'bu-badge-danger'
                          : 'bu-badge-warning'
                      }
                      style={{ fontSize: '11px' }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 6. SIXTH ROW: UPCOMING REVIEW DEADLINES ── */}
      <div className="bu-card">
        <div className="bu-card-header">
          <div>
            <h3 className="bu-card-title">Upcoming Review Deadlines</h3>
            <p className="bu-card-subtitle">
              SLA tracking against 72-hour SEBI turnaround mandate
            </p>
          </div>
          <Clock size={16} color="#2563EB" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {upcomingDeadlines.map((dl, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontWeight: 700, color: '#0F172A', display: 'block', fontSize: '13px' }}>
                  {dl.project}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#2563EB' }}>
                  {dl.submissionId}
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '4px' }}>
                  Deadline: {dl.deadline}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  className={
                    dl.urgency === 'Overdue'
                      ? 'bu-badge-danger'
                      : dl.urgency === 'At Risk'
                      ? 'bu-badge-warning'
                      : 'bu-badge-success'
                  }
                  style={{ fontSize: '10px' }}
                >
                  {dl.urgency}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginTop: '4px' }}>
                  {dl.remaining}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
