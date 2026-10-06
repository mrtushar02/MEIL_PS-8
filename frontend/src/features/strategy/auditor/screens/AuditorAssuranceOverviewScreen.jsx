import React from 'react';
import { Search, ShieldCheck, CheckCircle2, Award, FileText, ArrowRight, Download } from 'lucide-react';

export default function AuditorAssuranceOverviewScreen({ onNavigate }) {
  const auditStreams = [
    { stream: 'Scope 1 Diesel & Fuel Logs', standard: 'ISAE 3410', totalEvidence: '142 Files', verified: '142 Files (100%)', variance: '0.4% (Pass)', status: 'Reasonable Assurance' },
    { stream: 'Scope 2 HT Grid Electricity Invoices', standard: 'ISAE 3410', totalEvidence: '128 Files', verified: '128 Files (100%)', variance: '0.1% (Pass)', status: 'Reasonable Assurance' },
    { stream: 'Water Withdrawal Meter Telemetry', standard: 'ISAE 3000', totalEvidence: '88 Files', verified: '82 Files (93%)', variance: '1.2% (Pass)', status: 'Reasonable Assurance' },
    { stream: 'Hazardous Waste Form-10 Manifests', standard: 'CPCB Guidelines', totalEvidence: '114 Files', verified: '74 Files (65%)', variance: '2.1% (Pass)', status: 'Limited Assurance' }
  ];

  return (
    <div className="audit-usr-overview">
      <div className="audit-usr-stats-grid">
        <div className="audit-usr-stat-card">
          <div className="audit-usr-stat-header">
            <span className="audit-usr-stat-label">Assurance Sampling</span>
            <Search size={18} color="#B45309" />
          </div>
          <div className="audit-usr-stat-value">426 / 472</div>
          <span className="audit-usr-stat-subtext">90.3% Sample Coverage</span>
        </div>

        <div className="audit-usr-stat-card">
          <div className="audit-usr-stat-header">
            <span className="audit-usr-stat-label">Materiality Threshold</span>
            <ShieldCheck size={18} color="#059669" />
          </div>
          <div className="audit-usr-stat-value" style={{ color: '#059669' }}>1.1% Var</div>
          <span className="audit-usr-stat-subtext">Allowed threshold: 5.0%</span>
        </div>

        <div className="audit-usr-stat-card">
          <div className="audit-usr-stat-header">
            <span className="audit-usr-stat-label">Active Observations</span>
            <FileText size={18} color="#D97706" />
          </div>
          <div className="audit-usr-stat-value" style={{ color: '#D97706' }}>2 Minor</div>
          <span className="audit-usr-stat-subtext">0 Material Weaknesses</span>
        </div>

        <div className="audit-usr-stat-card">
          <div className="audit-usr-stat-header">
            <span className="audit-usr-stat-label">Auditor Opinion</span>
            <Award size={18} color="#B45309" />
          </div>
          <div className="audit-usr-stat-value">Unqualified</div>
          <span className="audit-usr-stat-subtext">Ready for issuance</span>
        </div>
      </div>

      <div className="audit-usr-card">
        <div className="audit-usr-card-header">
          <div>
            <h2 className="audit-usr-card-title">Audited Workstreams & Engagement Scope</h2>
            <p className="audit-usr-card-subtitle">
              PwC Independent practitioner testing in accordance with International Standards on Assurance Engagements (ISAE)
            </p>
          </div>
          <button className="audit-usr-btn-primary" onClick={() => onNavigate && onNavigate('opinion')}>
            Draft Assurance Statement <ArrowRight size={14} />
          </button>
        </div>

        <div className="audit-usr-table-container">
          <table className="audit-usr-table">
            <thead>
              <tr>
                <th>Assurance Workstream</th>
                <th>Standard Applied</th>
                <th>Total Sample Universe</th>
                <th>Testing Completion</th>
                <th>Recorded Variance</th>
                <th style={{ textAlign: 'right' }}>Opinion Level</th>
              </tr>
            </thead>
            <tbody>
              {auditStreams.map((st, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{st.stream}</span>
                  </td>
                  <td><span className="audit-usr-badge-amber">{st.standard}</span></td>
                  <td><span style={{ color: '#475569' }}>{st.totalEvidence}</span></td>
                  <td><span style={{ fontWeight: 700, color: '#059669' }}>{st.verified}</span></td>
                  <td><span style={{ fontWeight: 600 }}>{st.variance}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="audit-usr-badge-amber">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                      {st.status}
                    </span>
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
