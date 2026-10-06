import React from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Eye,
  ExternalLink
} from 'lucide-react';

export default function SubOverviewScreen({ onSelectBU, onNavigate }) {
  const buPerformanceData = [
    { name: 'Tunnels', projects: 14, submissions: 14, readiness: 96, evidence: 96, risk: 'Low', status: 'Approved', statusClass: 'sub-badge-success' },
    { name: 'Water', projects: 9, submissions: 9, readiness: 91, evidence: 94, risk: 'Low', status: 'Approved', statusClass: 'sub-badge-success' },
    { name: 'Energy', projects: 5, submissions: 5, readiness: 92, evidence: 95, risk: 'Medium', status: 'Approved', statusClass: 'sub-badge-success' },
    { name: 'Infrastructure', projects: 5, submissions: 5, readiness: 67, evidence: 71, risk: 'High', status: 'Correction', statusClass: 'sub-badge-danger' },
    { name: 'Metro', projects: 3, submissions: 3, readiness: 95, evidence: 92, risk: 'Low', status: 'Approved', statusClass: 'sub-badge-success' },
    { name: 'Expressway', projects: 2, submissions: 2, readiness: 85, evidence: 88, risk: 'Medium', status: 'Review', statusClass: 'sub-badge-warning' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. HERO BANNER ── */}
      <div className="sub-hero-card">
        <div style={{ flex: 1 }}>
          <div className="sub-hero-subtitle">Subsidiary ESG Review Center</div>
          <h1 className="sub-hero-title">MEIL Core Infrastructure Division</h1>
          <p className="sub-hero-desc">
            Review BU packages, validate consolidated data, monitor cross-unit ESG indicators, and approve consolidated division statements for Group Executive review.
          </p>

          <div className="sub-hero-chips">
            <div className="sub-hero-chip">
              <span style={{ color: '#64748B' }}>Reporting Period:</span> <strong>September 2026</strong>
            </div>
            <div className="sub-hero-chip">
              <span style={{ color: '#64748B' }}>Scope:</span> <strong>6 Business Units • 38 Projects</strong>
            </div>
            <div className="sub-hero-chip" style={{ background: '#F3E8FF', borderColor: '#E9D5FF' }}>
              <span style={{ color: '#7C3AED', fontWeight: 600 }}>Division Review Stage Active</span>
            </div>
          </div>
        </div>

        {/* Right Radial Gauge: 93.2% */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.1) 100%)',
            border: '4px solid #7C3AED',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)',
            textAlign: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
            93.2%
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED', marginTop: '4px' }}>
            Subsidiary Readiness
          </span>
        </div>
      </div>

      {/* ── 2. KPI STRIP ── */}
      <div className="sub-kpi-grid">
        <div className="sub-kpi-card">
          <span className="sub-kpi-label">Business Units</span>
          <div className="sub-kpi-val" style={{ color: '#7C3AED' }}>06</div>
          <span className="sub-kpi-sub">Total operational units</span>
        </div>

        <div className="sub-kpi-card">
          <span className="sub-kpi-label">Projects</span>
          <div className="sub-kpi-val">38</div>
          <span className="sub-kpi-sub">Reporting across division</span>
        </div>

        <div className="sub-kpi-card" onClick={() => onNavigate?.('bu-review')} style={{ cursor: 'pointer' }}>
          <span className="sub-kpi-label">Pending BU Review</span>
          <div className="sub-kpi-val" style={{ color: '#D97706' }}>07</div>
          <span className="sub-kpi-sub">Awaiting division signoff</span>
        </div>

        <div className="sub-kpi-card">
          <span className="sub-kpi-label">Approved</span>
          <div className="sub-kpi-val" style={{ color: '#16A34A' }}>29</div>
          <span className="sub-kpi-sub">Approved BU packages</span>
        </div>

        <div className="sub-kpi-card">
          <span className="sub-kpi-label">Correction Required</span>
          <div className="sub-kpi-val" style={{ color: '#DC2626' }}>04</div>
          <span className="sub-kpi-sub">Returned to BUs</span>
        </div>

        <div className="sub-kpi-card">
          <span className="sub-kpi-label">ESG Readiness</span>
          <div className="sub-kpi-val" style={{ color: '#059669' }}>93.2%</div>
          <span className="sub-kpi-sub">Division composite score</span>
        </div>
      </div>

      {/* ── 3. BU PERFORMANCE OVERVIEW TABLE (Matching Screen 1) ── */}
      <div className="sub-card">
        <div className="sub-card-header">
          <div>
            <h3 className="sub-card-title">BU Performance Overview</h3>
            <p className="sub-card-subtitle">
              Submission coverage, data readiness, and review status across all 6 Business Units
            </p>
          </div>
          <button
            className="sub-btn sub-btn-secondary"
            onClick={() => onNavigate?.('bu-review')}
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            <span>Review BU Packages</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="sub-table-container">
          <table className="sub-table">
            <thead>
              <tr>
                <th>Business Unit</th>
                <th>Projects</th>
                <th>Submissions</th>
                <th>Readiness</th>
                <th>Evidence</th>
                <th>Risk</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {buPerformanceData.map(bu => (
                <tr key={bu.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={16} color="#7C3AED" />
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{bu.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#475569' }}>{bu.projects}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#475569' }}>{bu.submissions}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: bu.readiness >= 90 ? '#16A34A' : bu.readiness >= 80 ? '#D97706' : '#DC2626' }}>
                      {bu.readiness}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{bu.evidence}%</span>
                  </td>
                  <td>
                    <span
                      className={bu.risk === 'High' ? 'sub-badge-danger' : bu.risk === 'Medium' ? 'sub-badge-warning' : 'sub-badge-success'}
                      style={{ fontSize: '10px' }}
                    >
                      {bu.risk}
                    </span>
                  </td>
                  <td>
                    <span className={bu.statusClass} style={{ fontSize: '11px' }}>
                      {bu.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="sub-btn sub-btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '11px' }}
                      onClick={() => onSelectBU && onSelectBU(bu.name)}
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
