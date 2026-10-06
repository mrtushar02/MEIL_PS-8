import React from 'react';
import { Filter, Layers, CheckCircle2 } from 'lucide-react';

export default function SampleSelectionScreen() {
  const samples = [
    { site: 'Zojila Tunnel Site (site-102)', subsidiary: 'Hydro & Infra (SUB-01)', riskWeight: 'High (Himalayan Corridor)', samplesSelected: '42 Files', method: '100% Substantive Testing' },
    { site: 'Ramagundam STPP Unit 4', subsidiary: 'Hydro & Infra (SUB-01)', riskWeight: 'High (Continuous Emissions)', samplesSelected: '36 Files', method: 'Targeted High-Risk Sampling' },
    { site: 'Bengaluru Metro Ph 2A', subsidiary: 'Hydro & Infra (SUB-01)', riskWeight: 'Medium (High Traction Energy)', samplesSelected: '28 Files', method: 'Random Representative' },
    { site: 'Kaleshwaram Lift Irrig. Pkg 2', subsidiary: 'Hydro & Infra (SUB-01)', riskWeight: 'High (Water Withdrawal)', samplesSelected: '40 Files', method: 'Substantive Telemetry Audit' },
    { site: 'Olectra EV Manufacturing Yard', subsidiary: 'Electric Mobility (SUB-04)', riskWeight: 'Low (Clean Facility)', samplesSelected: '18 Files', method: 'Random Representative' }
  ];

  return (
    <div className="audit-usr-samples">
      <div className="audit-usr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="audit-usr-card-header">
          <div>
            <h2 className="audit-usr-card-title">Auditor Sample Selection Engine & Materiality Weights</h2>
            <p className="audit-usr-card-subtitle">
              Stratified random & risk-weighted sampling protocols across 6 subsidiaries and 258 construction sites
            </p>
          </div>
          <span className="audit-usr-badge-amber">Stratified Sample Population: 472 Artifacts</span>
        </div>
      </div>

      <div className="audit-usr-card">
        <div className="audit-usr-table-container">
          <table className="audit-usr-table">
            <thead>
              <tr>
                <th>Audited Project Site</th>
                <th>Parent Subsidiary</th>
                <th>ESG Risk Weight</th>
                <th>Sample Count Selected</th>
                <th style={{ textAlign: 'right' }}>Sampling Methodology</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((s, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{s.site}</span>
                  </td>
                  <td><span style={{ color: '#475569' }}>{s.subsidiary}</span></td>
                  <td>
                    <span style={{ fontWeight: 600, color: s.riskWeight.startsWith('High') ? '#DC2626' : '#D97706' }}>
                      {s.riskWeight}
                    </span>
                  </td>
                  <td><span style={{ fontWeight: 700 }}>{s.samplesSelected}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="audit-usr-badge-amber">{s.method}</span>
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
