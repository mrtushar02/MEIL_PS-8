import React, { useState } from 'react';
import { Cpu, AlertTriangle, CheckCircle2, ShieldCheck, Search, Download } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function DataDiagnosticsScreen() {
  const [searchTerm, setSearchTerm] = useState('');

  const diagnostics = [
    { site: 'Zojila Tunnel Site (site-102)', metric: 'Diesel Fuel Consumption', deviation: '+4.2% vs 3M Rolling Avg', zscore: '1.24 σ', status: 'Normal Operating Variance', action: 'Approved by BU Reviewer' },
    { site: 'Ramagundam STPP Unit 4', metric: 'Continuous Stack PM2.5', deviation: '+18% vs Baseline', zscore: '2.41 σ', status: 'Controlled Exceedance', action: 'Low-NOx burner serviced; cleared' },
    { site: 'Kaleshwaram Lift Irrig. Pkg 2', metric: 'Ultrasonic Canal Water Flow', deviation: '-2.1% vs Pump Telemetry', zscore: '0.85 σ', status: 'Within Tolerance', action: 'Telemetry sensor calibrated' },
    { site: 'Bengaluru Metro Ph 2A', metric: 'Grid Substation Electricity', deviation: '+0.9% vs Billing Invoice', zscore: '0.42 σ', status: 'Within Tolerance', action: 'Matched with BESCOM bill' }
  ];

  const filtered = diagnostics.filter(d => 
    d.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.metric.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv('MEIL_Telemetry_Diagnostics.csv', filtered.map(d => ({
      'Site Identifier': d.site,
      'Diagnostic Metric': d.metric,
      'Recorded Variance': d.deviation,
      'Statistical Z-Score': d.zscore,
      'Analytical Status': d.status,
      'Resolution Trail': d.action
    })));
  };

  return (
    <div className="esg-ana-diagnostics">
      <div className="esg-ana-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-ana-card-header">
          <div>
            <h2 className="esg-ana-card-title">Telemetry Anomaly Detection & Statistical Outlier Engine</h2>
            <p className="esg-ana-card-subtitle">
              Automated Z-score outlier detection and machine telemetry variance checks across 258 project sites
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span className="esg-ana-badge-cyan">Zero Unresolved Outliers</span>
            <button className="esg-ana-btn-primary" onClick={handleExport} style={{ fontSize: '0.8rem' }}>
              <Download size={13} /> Export Diagnostics
            </button>
          </div>
        </div>

        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.4rem 0.8rem' }}>
          <Search size={15} color="#64748B" style={{ marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search diagnostics by site, metric, or status..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem' }}
          />
        </div>
      </div>

      <div className="esg-ana-card">
        <div className="esg-ana-table-container">
          <table className="esg-ana-table">
            <thead>
              <tr>
                <th>Site & Project Identifier</th>
                <th>Diagnostic Metric</th>
                <th>Variance Recorded</th>
                <th>Z-Score</th>
                <th>Analytical Status</th>
                <th style={{ textAlign: 'right' }}>Resolution Trail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{d.site}</span>
                  </td>
                  <td><span style={{ color: '#334155' }}>{d.metric}</span></td>
                  <td><span style={{ fontWeight: 600 }}>{d.deviation}</span></td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0891B2' }}>{d.zscore}</span>
                  </td>
                  <td>
                    <span className="esg-ana-badge-cyan">{d.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>{d.action}</span>
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
