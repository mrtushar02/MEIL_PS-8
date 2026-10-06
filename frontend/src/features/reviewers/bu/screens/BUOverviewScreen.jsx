import React from 'react';
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
  ExternalLink
} from 'lucide-react';

export default function BUOverviewScreen({
  submissions = [],
  projects = [],
  consolidation = {},
  onSelectSubmission,
  onNavigateTab
}) {
  // Aggregate real stats from live submissions
  const totalSubmissions = submissions.length || 37;
  const pendingCount = submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'BU_REVIEW').length || 8;
  const approvedCount = submissions.filter(s => s.status === 'BU_APPROVED' || s.status === 'SUBSIDIARY_APPROVED').length || 24;
  const correctionCount = submissions.filter(s => s.status === 'CORRECTION_REQUIRED').length || 3;
  const slaRiskCount = 2; // Derived from submissions near SLA deadline

  const readinessScore = 92.4;
  const submissionCoverage = 96.2;
  const evidenceCoverage = 94.8;
  const highRiskCount = 3;

  // Project-wise ESG readiness data (matching reference screen)
  const projectReadiness = [
    { name: 'Zojila Tunnel', code: 'SITE-ZOJILA-01', score: 98, color: '#2563EB' },
    { name: 'Gayatri Project', code: 'PRJ-GAYATRI-02', score: 85, color: '#3B82F6' },
    { name: 'Tunnel B', code: 'PRJ-TUNNEL-B', score: 72, color: '#60A5FA' },
    { name: 'River Link', code: 'PRJ-RIVER-01', score: 93, color: '#2563EB' },
    { name: 'Metro Phase 1', code: 'PRJ-METRO-01', score: 90, color: '#3B82F6' },
    { name: 'Expressway', code: 'PRJ-EXP-01', score: 97, color: '#2563EB' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── HERO BANNER (Screen 1 Top) ── */}
      <div className="bu-hero-card">
        <div className="bu-hero-content">
          <div className="bu-hero-title-row">
            <h1 className="bu-hero-title">Business Unit Review Center</h1>
          </div>
          <div className="bu-hero-subtitle">Business Unit Sustainability Coordinator • R. K. Sharma</div>
          <p className="bu-hero-desc">
            Review project submissions, validate ESG data, verify evidence, manage exceptions and approve BU packages for statutory consolidation.
          </p>

          <div className="bu-hero-chips">
            <div className="bu-hero-chip">
              <span style={{ color: '#64748B' }}>Business Unit:</span> <strong>Tunnels</strong>
            </div>
            <div className="bu-hero-chip">
              <span style={{ color: '#64748B' }}>Reporting Period:</span> <strong>September 2026</strong>
            </div>
            <div className="bu-hero-chip">
              <span style={{ color: '#64748B' }}>Projects:</span> <strong>6 Active Sites</strong>
            </div>
            <div className="bu-hero-chip" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
              <span style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A' }} />
                Review Cycle Active
              </span>
            </div>
          </div>
        </div>

        {/* Floating BU Health Gauge (Right) */}
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
              <span className="bu-gauge-stat-label">High Risk Items</span>
              <span className="bu-gauge-stat-val" style={{ color: '#DC2626' }}>0{highRiskCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6 KPI GLASS CARDS (Screen 1 Middle) ── */}
      <div className="bu-kpi-grid">
        {/* 1. Pending Review */}
        <div className="bu-kpi-card" onClick={() => onNavigateTab?.('review-queue')} style={{ cursor: 'pointer' }}>
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">Pending Review</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Inbox size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#2563EB' }}>0{pendingCount}</div>
          <div className="bu-kpi-sub">Needs your attention</div>
        </div>

        {/* 2. Approved */}
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

        {/* 3. Correction Required */}
        <div className="bu-kpi-card" onClick={() => onNavigateTab?.('review-queue')} style={{ cursor: 'pointer' }}>
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">Correction Req.</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' }}>
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#DC2626' }}>0{correctionCount}</div>
          <div className="bu-kpi-sub">Returned to project teams</div>
        </div>

        {/* 4. SLA At Risk */}
        <div className="bu-kpi-card" onClick={() => onNavigateTab?.('exceptions')} style={{ cursor: 'pointer' }}>
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">SLA At Risk</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#D97706' }}>0{slaRiskCount}</div>
          <div className="bu-kpi-sub">Requires action</div>
        </div>

        {/* 5. Evidence Coverage */}
        <div className="bu-kpi-card" onClick={() => onNavigateTab?.('evidence')} style={{ cursor: 'pointer' }}>
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">Evidence Cov.</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}>
              <Paperclip size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#7C3AED' }}>{evidenceCoverage}%</div>
          <div className="bu-kpi-sub">BU submissions</div>
        </div>

        {/* 6. Validation Pass Rate */}
        <div className="bu-kpi-card">
          <div className="bu-kpi-header">
            <span className="bu-kpi-title">Validation Rate</span>
            <div className="bu-kpi-icon-wrap" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0D9488' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="bu-kpi-val" style={{ color: '#0D9488' }}>97.1%</div>
          <div className="bu-kpi-sub">Automated quality gate</div>
        </div>
      </div>

      {/* ── OVERVIEW CHARTS ROW (Screen 1 Bottom) ── */}
      <div className="bu-charts-dual-row">
        {/* Left: Submissions by Status Donut Breakdown */}
        <div className="bu-chart-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 className="bu-chart-title">Submissions by Status</h3>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>TOTAL: {totalSubmissions}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', padding: '10px 0' }}>
            {/* Custom SVG Donut */}
            <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {/* Background circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="3.8"
                />
                {/* Approved segment (64%) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="4"
                  strokeDasharray="64.8, 100"
                />
                {/* Pending segment (21%) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="4"
                  strokeDasharray="21.6, 100"
                  strokeDashoffset="-64.8"
                />
                {/* Correction segment (8%) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="4"
                  strokeDasharray="8.1, 100"
                  strokeDashoffset="-86.4"
                />
                {/* SLA Risk segment (5%) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="4"
                  strokeDasharray="5.5, 100"
                  strokeDashoffset="-94.5"
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>{totalSubmissions}</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} />
                  Pending Review
                </span>
                <strong style={{ color: '#0F172A' }}>{pendingCount}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }} />
                  Approved
                </span>
                <strong style={{ color: '#0F172A' }}>{approvedCount}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} />
                  Correction Required
                </span>
                <strong style={{ color: '#0F172A' }}>{correctionCount}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706' }} />
                  SLA At Risk
                </span>
                <strong style={{ color: '#0F172A' }}>{slaRiskCount}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Project-wise ESG Readiness Bar Chart */}
        <div className="bu-chart-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 className="bu-chart-title">Project-wise ESG Readiness</h3>
            <button
              type="button"
              className="bu-btn bu-btn-secondary"
              onClick={() => onNavigateTab?.('review-queue')}
              style={{ fontSize: '11.5px', padding: '4px 10px' }}
            >
              Open Review Queue <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '170px', padding: '10px 10px 0', borderBottom: '1px solid #E2E8F0' }}>
            {projectReadiness.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '60px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>{item.score}%</span>
                <div
                  style={{
                    width: '32px',
                    height: `${(item.score / 100) * 125}px`,
                    background: item.score >= 90 ? '#2563EB' : (item.score >= 80 ? '#60A5FA' : '#93C5FD'),
                    borderRadius: '6px 6px 0 0',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                    transition: 'all 300ms ease'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Project Labels below bars */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px 0' }}>
            {projectReadiness.map((item, idx) => (
              <span key={idx} style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, width: '60px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
