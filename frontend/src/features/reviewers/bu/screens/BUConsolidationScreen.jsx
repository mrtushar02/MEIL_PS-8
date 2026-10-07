import React, { useState } from 'react';
import { 
  Layers, 
  BarChart3, 
  Leaf, 
  Users, 
  Scale, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  Download
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function BUConsolidationScreen({
  consolidation = {},
  projects = [],
  reportingPeriod = 'September 2026'
}) {
  const [pillar, setPillar] = useState('ENVIRONMENTAL'); // ENVIRONMENTAL, SOCIAL, GOVERNANCE

  // Real or calculated project matrix data (matching Screen 6 reference)
  const projectRows = [
    { name: 'Zojila Tunnel', scope1: 420, scope2: 380, energy: '2.4M', water: '65,000', waste: '92%', safety: 0.00, score: 98, status: 'Approved' },
    { name: 'Gayatri Project', scope1: 380, scope2: 320, energy: '1.8M', water: '62,000', waste: '88%', safety: 0.02, score: 91, status: 'Approved' },
    { name: 'Tunnel B', scope1: 350, scope2: 340, energy: '1.2M', water: '46,000', waste: '76%', safety: 0.38, score: 72, status: 'Correction' },
    { name: 'River Link', scope1: 310, scope2: 280, energy: '1.6M', water: '55,000', waste: '84%', safety: 0.05, score: 88, status: 'Pending' },
    { name: 'Metro Phase 1', scope1: 260, scope2: 210, energy: '1.4M', water: '48,000', waste: '87%', safety: 0.04, score: 90, status: 'Approved' },
    { name: 'Expressway', scope1: 290, scope2: 240, energy: '1.5M', water: '51,000', waste: '89%', safety: 0.00, score: 97, status: 'Approved' },
  ];

  const approvedCount = projectRows.filter(r => r.status === 'Approved').length;
  const pendingCount = projectRows.filter(r => r.status === 'Pending').length;
  const correctionCount = projectRows.filter(r => r.status === 'Correction').length;
  const avgReadiness = (projectRows.reduce((acc, r) => acc + r.score, 0) / projectRows.length).toFixed(1);

  const handleExportMatrix = () => {
    exportToCsv('MEIL_BU_Consolidation_Matrix.csv', projectRows.map(p => ({
      Project: p.name,
      Scope1_tCO2e: p.scope1,
      Scope2_tCO2e: p.scope2,
      Energy_kWh: p.energy,
      Water_kL: p.water,
      Waste_Recycled: p.waste,
      LTIFR_Safety: p.safety,
      ESG_Score: p.score,
      Approval_Status: p.status
    })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── Top Summary Header & Metrics (Screen 6 Top) ── */}
      <div className="bu-hero-card" style={{ padding: '22px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Business Unit Consolidation</h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
              Consolidated ESG performance across all {projectRows.length} projects in Highways & Himalayan Tunnels BU.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Period: {reportingPeriod}</span>
            <button
              type="button"
              className="bu-btn bu-btn-secondary"
              onClick={handleExportMatrix}
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              <Download size={14} /> Export Matrix
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Counters Strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        <div className="bu-kpi-card">
          <span className="bu-kpi-title">Projects</span>
          <div className="bu-kpi-val">{String(projectRows.length).padStart(2, '0')}</div>
          <div className="bu-kpi-sub">Sites reporting</div>
        </div>
        <div className="bu-kpi-card">
          <span className="bu-kpi-title">Total Submissions</span>
          <div className="bu-kpi-val">37</div>
          <div className="bu-kpi-sub">Total packages</div>
        </div>
        <div className="bu-kpi-card">
          <span className="bu-kpi-title">Approved</span>
          <div className="bu-kpi-val" style={{ color: '#16A34A' }}>{approvedCount}</div>
          <div className="bu-kpi-sub">Statutory pass</div>
        </div>
        <div className="bu-kpi-card">
          <span className="bu-kpi-title">Pending</span>
          <div className="bu-kpi-val" style={{ color: '#2563EB' }}>{pendingCount}</div>
          <div className="bu-kpi-sub">Under BU review</div>
        </div>
        <div className="bu-kpi-card">
          <span className="bu-kpi-title">Correction</span>
          <div className="bu-kpi-val" style={{ color: '#DC2626' }}>{correctionCount}</div>
          <div className="bu-kpi-sub">Rework cycle</div>
        </div>
        <div className="bu-kpi-card">
          <span className="bu-kpi-title">BU Readiness</span>
          <div className="bu-kpi-val" style={{ color: '#7C3AED' }}>{avgReadiness}%</div>
          <div className="bu-kpi-sub">SEBI BRSR Core</div>
        </div>
      </div>

      {/* ── Pillar Tabs (Screen 6 Middle) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="bu-segmented-controls" style={{ padding: '6px' }}>
          <button
            type="button"
            className={`bu-segmented-btn ${pillar === 'ENVIRONMENTAL' ? 'active' : ''}`}
            onClick={() => setPillar('ENVIRONMENTAL')}
            style={{ padding: '7px 20px', fontSize: '13px' }}
          >
            Environmental (Scope 1, 2, Energy, Water, Waste)
          </button>
          <button
            type="button"
            className={`bu-segmented-btn ${pillar === 'SOCIAL' ? 'active' : ''}`}
            onClick={() => setPillar('SOCIAL')}
            style={{ padding: '7px 20px', fontSize: '13px' }}
          >
            Social (Workforce, Safety, LTIFR, Human Rights)
          </button>
          <button
            type="button"
            className={`bu-segmented-btn ${pillar === 'GOVERNANCE' ? 'active' : ''}`}
            onClick={() => setPillar('GOVERNANCE')}
            style={{ padding: '7px 20px', fontSize: '13px' }}
          >
            Governance (Compliance, Anti-Corruption, Audit)
          </button>
        </div>
      </div>

      {/* ── Visual Charts Row ── */}
      <div className="bu-charts-dual-row">
        {/* Scope 1 Emissions by Project */}
        <div className="bu-chart-card">
          <h3 className="bu-chart-title">Scope 1 Emissions (tCO₂e) by Project</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '150px', padding: '10px 10px 0', borderBottom: '1px solid #E2E8F0' }}>
            {[
              { name: 'Zojila', val: 420 },
              { name: 'Gayatri', val: 380 },
              { name: 'Tunnel B', val: 350 },
              { name: 'River Link', val: 310 },
              { name: 'Metro', val: 260 },
              { name: 'Expressway', val: 290 },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '50px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>{p.val}</span>
                <div style={{
                  width: '28px',
                  height: `${(p.val / 450) * 110}px`,
                  background: '#2563EB',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
                }} />
                <span style={{ fontSize: '10px', color: '#64748B', whiteSpace: 'nowrap' }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Consumption by Project */}
        <div className="bu-chart-card">
          <h3 className="bu-chart-title">Energy Consumption (kWh) by Project</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '150px', padding: '10px 10px 0', borderBottom: '1px solid #E2E8F0' }}>
            {[
              { name: 'Zojila', val: '2.4M', height: 110 },
              { name: 'Gayatri', val: '1.8M', height: 85 },
              { name: 'Tunnel B', val: '1.2M', height: 58 },
              { name: 'River Link', val: '1.6M', height: 75 },
              { name: 'Metro', val: '1.4M', height: 68 },
              { name: 'Expressway', val: '1.5M', height: 72 },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '50px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>{p.val}</span>
                <div style={{
                  width: '28px',
                  height: `${p.height}px`,
                  background: '#0D9488',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 4px 10px rgba(13, 148, 136, 0.2)'
                }} />
                <span style={{ fontSize: '10px', color: '#64748B', whiteSpace: 'nowrap' }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Project-wise Performance Matrix Table (Screen 6 Bottom) ── */}
      <div className="bu-table-card">
        <div className="bu-table-header-row">
          <div>
            <h3 className="bu-table-title">Project-wise Contribution Matrix</h3>
            <p className="bu-table-subtitle">Consolidated operational metrics audited against statutory CEA baselines.</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <table className="bu-data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Scope 1 (tCO₂e)</th>
                <th>Scope 2 (tCO₂e)</th>
                <th>Energy (kWh)</th>
                <th>Water (KL)</th>
                <th>Waste Diversion</th>
                <th>Safety (LTIFR)</th>
                <th>ESG Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projectRows.map((row, idx) => (
                <tr key={idx}>
                  <td><strong style={{ color: '#0F172A' }}>{row.name}</strong></td>
                  <td style={{ color: '#D97706', fontWeight: 600 }}>{row.scope1}</td>
                  <td style={{ color: '#2563EB', fontWeight: 600 }}>{row.scope2}</td>
                  <td>{row.energy}</td>
                  <td>{row.water}</td>
                  <td><span style={{ color: '#16A34A', fontWeight: 700 }}>{row.waste}</span></td>
                  <td><span style={{ color: row.safety === 0 ? '#16A34A' : '#DC2626', fontWeight: 700 }}>{row.safety}</span></td>
                  <td><strong style={{ color: '#0F172A' }}>{row.score}%</strong></td>
                  <td>
                    <span className={`bu-badge ${
                      row.status === 'Approved' ? 'bu-badge-approved' : (row.status === 'Pending' ? 'bu-badge-pending' : 'bu-badge-correction')
                    }`}>
                      {row.status}
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
