import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, TrendingUp, ThermometerSun, CloudRain, Flame, CheckCircle2 } from 'lucide-react';

export default function GroupRiskManagementScreen() {
  const [filterCategory, setFilterCategory] = useState('All');

  const risks = [
    { id: 'RSK-01', title: 'CBAM Export Carbon Border Adjustment Risk', category: 'Transition', likelihood: 'High', impact: 'Severe', financialExposure: '₹ 45 Cr', mitigation: 'Low-carbon electric arc furnace steel sourcing agreements.', status: 'Mitigated' },
    { id: 'RSK-02', title: 'Flash Flood & Cloudburst in Himalayan Tunnel Corridors', category: 'Physical (Acute)', likelihood: 'Medium', impact: 'Severe', financialExposure: '₹ 80 Cr', mitigation: 'Early warning radar telemetry & high-capacity dewatering pumps.', status: 'Active Control' },
    { id: 'RSK-03', title: 'Severe Heatwave Hours Affecting Site Labor Productivity', category: 'Physical (Chronic)', likelihood: 'High', impact: 'Moderate', financialExposure: '₹ 22 Cr', mitigation: 'Mandatory midday break protocols, hydration stations, ORS kits.', status: 'Controlled' },
    { id: 'RSK-04', title: 'Groundwater Depletion & SPCB Borewell Sanctions', category: 'Regulatory', likelihood: 'Medium', impact: 'High', financialExposure: '₹ 30 Cr', mitigation: 'Rainwater harvesting and 100% STP treated effluent reuse.', status: 'Active Control' }
  ];

  return (
    <div className="group-risk-screen">
      {/* Risk Metrics */}
      <div className="group-stats-grid">
        <div className="group-stat-card">
          <span className="group-stat-label">Identified ESG Risks</span>
          <div className="group-stat-value" style={{ color: '#D97706' }}>12</div>
          <span className="group-stat-subtext">4 High Priority, 8 Moderate</span>
        </div>

        <div className="group-stat-card">
          <span className="group-stat-label">Quantified Value at Risk</span>
          <div className="group-stat-value">₹ 177 Cr</div>
          <span className="group-stat-subtext">TCFD Scenario (1.5°C vs 3°C)</span>
        </div>

        <div className="group-stat-card">
          <span className="group-stat-label">Mitigation Budget Deployed</span>
          <div className="group-stat-value" style={{ color: '#059669' }}>₹ 54 Cr</div>
          <span className="group-stat-subtext">Resilience infrastructure installed</span>
        </div>

        <div className="group-stat-card">
          <span className="group-stat-label">TCFD Alignment</span>
          <div className="group-stat-value" style={{ color: '#4338CA' }}>100%</div>
          <span className="group-stat-subtext">Governance & Strategy Disclosed</span>
        </div>
      </div>

      {/* Risk Register Table */}
      <div className="group-card">
        <div className="group-card-header">
          <div>
            <h3 className="group-card-title">Enterprise Climate & ESG Risk Register</h3>
            <p className="group-card-subtitle">Aligned with Task Force on Climate-Related Financial Disclosures (TCFD) recommendations</p>
          </div>
        </div>

        <div className="group-table-container">
          <table className="group-table">
            <thead>
              <tr>
                <th>Risk Code</th>
                <th>Risk Title & Scope</th>
                <th>Category</th>
                <th>Likelihood / Impact</th>
                <th>Quantified Value at Risk</th>
                <th>Mitigation Control Strategy</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map(r => (
                <tr key={r.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#4338CA' }}>{r.id}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.title}</span>
                  </td>
                  <td>
                    <span className="group-badge-neutral">{r.category}</span>
                  </td>
                  <td>
                    <span className={r.likelihood === 'High' ? 'group-badge-danger' : 'group-badge-warning'}>
                      {r.likelihood} / {r.impact}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#DC2626' }}>{r.financialExposure}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#334155' }}>{r.mitigation}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="group-badge-success">{r.status}</span>
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
