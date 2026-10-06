import React from 'react';
import { BarChart3, Cpu, Database, TrendingDown, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ESGAnalystOverviewScreen({ onNavigate }) {
  const models = [
    { name: 'Grid Electricity CEA Baseline v19', factor: '0.716 kg CO2e / kWh', source: 'CEA India CO2 Database v19', recordsCovered: '1,420 Bills', status: 'Verified Active' },
    { name: 'Diesel Stationary & Mining Machinery', factor: '2.68 kg CO2e / L', source: 'IPCC 2006 Guidelines Table 3.2.1', recordsCovered: '3,840 Logs', status: 'Verified Active' },
    { name: 'Blast Furnace Slag Cement Embodied CO2', factor: '0.42 kg CO2e / kg', source: 'EPD India Verified Spec', recordsCovered: '924 Challans', status: 'Verified Active' },
    { name: 'Water Withdrawal Ground vs Surface Index', factor: '1.00 m³ / kL', source: 'CGWA Statutory Norms', recordsCovered: '512 Meters', status: 'Verified Active' }
  ];

  return (
    <div className="esg-ana-overview">
      <div className="esg-ana-stats-grid">
        <div className="esg-ana-stat-card">
          <div className="esg-ana-stat-header">
            <span className="esg-ana-stat-label">Ingested Data Points</span>
            <Database size={18} color="#0891B2" />
          </div>
          <div className="esg-ana-stat-value">64,280</div>
          <span className="esg-ana-stat-subtext">Across 258 construction sites</span>
        </div>

        <div className="esg-ana-stat-card">
          <div className="esg-ana-stat-header">
            <span className="esg-ana-stat-label">Statistical Outliers</span>
            <Cpu size={18} color="#059669" />
          </div>
          <div className="esg-ana-stat-value" style={{ color: '#059669' }}>0</div>
          <span className="esg-ana-stat-subtext">Z-Score &gt; 3.0 cleared</span>
        </div>

        <div className="esg-ana-stat-card">
          <div className="esg-ana-stat-header">
            <span className="esg-ana-stat-label">Emission Models</span>
            <BarChart3 size={18} color="#2563EB" />
          </div>
          <div className="esg-ana-stat-value">14 Active</div>
          <span className="esg-ana-stat-subtext" style={{ color: '#2563EB' }}>GHG Protocol Compliant</span>
        </div>

        <div className="esg-ana-stat-card">
          <div className="esg-ana-stat-header">
            <span className="esg-ana-stat-label">Model Confidence</span>
            <ShieldCheck size={18} color="#0891B2" />
          </div>
          <div className="esg-ana-stat-value">99.8%</div>
          <span className="esg-ana-stat-subtext">PwC Audit Sample Ready</span>
        </div>
      </div>

      <div className="esg-ana-card">
        <div className="esg-ana-card-header">
          <div>
            <h2 className="esg-ana-card-title">Statutory Calculation Engines & Emission Factors</h2>
            <p className="esg-ana-card-subtitle">Authoritative calculation baseline parameters used for enterprise consolidation</p>
          </div>
          <button className="esg-ana-btn-primary" onClick={() => onNavigate && onNavigate('factors')}>
            Factor Studio <ArrowRight size={14} />
          </button>
        </div>

        <div className="esg-ana-table-container">
          <table className="esg-ana-table">
            <thead>
              <tr>
                <th>Calculation Model Name</th>
                <th>Authoritative Factor</th>
                <th>Regulatory Reference</th>
                <th>Processed Ingestion Scope</th>
                <th style={{ textAlign: 'right' }}>Engine Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{m.name}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0891B2' }}>{m.factor}</span>
                  </td>
                  <td><span style={{ color: '#475569' }}>{m.source}</span></td>
                  <td><span style={{ fontWeight: 600 }}>{m.recordsCovered}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="esg-ana-badge-cyan">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                      {m.status}
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
