import React from 'react';
import { Layers, TrendingDown, Flame, Zap, Truck, CheckCircle2, Download } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function DecarbonizationRoadmapScreen() {
  const roadmapSteps = [
    { year: '2023 - 2025 (Current)', phase: 'Operational Energy Efficiency', scope1: '-12%', scope2: '-35%', action: 'Grid electricity conversion to green tariff, B5 biodiesel blend trials on diesel generators.', status: 'Active' },
    { year: '2026 - 2030', phase: 'Fleet & Renewable Scaling', scope1: '-30%', scope2: '-70%', action: '100% captive solar deployment for metro/tunnel project power, electric machinery deployment.', status: 'Planned' },
    { year: '2031 - 2040', phase: 'Supply Chain Decarbonization', scope1: '-65%', scope2: '-95%', action: 'Green hydrogen tunneling equipment, zero-emission steel and low-carbon cement contracts.', status: 'Modeled' },
    { year: '2041 - 2045', phase: 'Net Zero Residual Offset', scope1: '-90%', scope2: '-100%', action: 'High-permanence certified nature-based carbon removals for residual hard-to-abate processes.', status: 'Vision' }
  ];

  const handleExport = () => {
    exportToCsv('MEIL_Decarbonization_Roadmap.csv', roadmapSteps.map(s => ({
      'Milestone Period': s.year,
      'Phase Focus': s.phase,
      'Scope 1 Target': s.scope1,
      'Scope 2 Target': s.scope2,
      'Key Initiatives & Levers': s.action,
      'Status': s.status
    })));
  };

  return (
    <div className="esg-mgr-roadmap">
      <div className="esg-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-mgr-card-header">
          <div>
            <h2 className="esg-mgr-card-title">MEIL Group Decarbonization Pathway (2023–2045)</h2>
            <p className="esg-mgr-card-subtitle">
              Science-based targets aligned with Paris Agreement 1.5°C threshold and SEBI Net Zero reporting guidance
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span className="esg-mgr-badge-emerald">SBTi Pathway Validated</span>
            <button className="esg-mgr-btn-outline" onClick={handleExport} style={{ fontSize: '0.8rem' }}>
              <Download size={13} /> Export Roadmap
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {roadmapSteps.map((s, idx) => (
          <div key={idx} className="esg-mgr-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span className="esg-mgr-badge-emerald" style={{ marginBottom: '0.35rem' }}>{s.year}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>{s.phase}</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                  Scope 1: {s.scope1}
                </span>
                <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                  Scope 2: {s.scope2}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: '0.5rem 0' }}>
              {s.action}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <span className="esg-mgr-badge-emerald">{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
