import React, { useState } from 'react';
import { TrendingDown, Cpu, Sparkles, CheckCircle2, Download } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function ForecastingSimulationScreen() {
  const [selectedIdx, setSelectedIdx] = useState(1);

  const scenarios = [
    { id: 'SC-01', name: 'Business-As-Usual (BAU)', description: 'Continues current grid mix and diesel consumption rates without additional clean tech investment.', forecast2030: '248,000 tCO2e', variance: '+14% above SBTi 1.5°C', investment: '₹ 0 Cr' },
    { id: 'SC-02', name: 'Planned Transition (Base Plan)', description: 'Execution of 140 MW solar PPAs, B5 biodiesel blend, and 40% electric transport fleet.', forecast2030: '142,000 tCO2e', variance: '-42% (SBTi Aligned)', investment: '₹ 280 Cr' },
    { id: 'SC-03', name: 'Aggressive Net Zero Acceleration', description: 'Early deployment of green hydrogen heavy tunneling rigs, 100% renewable power, green steel.', forecast2030: '94,000 tCO2e', variance: '-62% (Fastest Decarbonization)', investment: '₹ 540 Cr' }
  ];

  const handleExport = () => {
    exportToCsv('MEIL_Emission_Forecasting_Scenarios.csv', scenarios.map(s => ({
      'Scenario Code': s.id,
      'Scenario Name': s.name,
      'Trajectory Modeling': s.description,
      'Forecast 2030 Emissions': s.forecast2030,
      'Variance from SBTi': s.variance,
      'Estimated Green Capex': s.investment
    })));
  };

  return (
    <div className="esg-ana-forecasting">
      <div className="esg-ana-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-ana-card-header">
          <div>
            <h2 className="esg-ana-card-title">Predictive Decarbonization Scenario Simulator</h2>
            <p className="esg-ana-card-subtitle">
              Monte Carlo & deterministic emissions trajectory forecasting models calibrated against historical MEIL asset data
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span className="esg-ana-badge-cyan">Active: {scenarios[selectedIdx].name}</span>
            <button className="esg-ana-btn-primary" onClick={handleExport} style={{ fontSize: '0.8rem' }}>
              <Download size={13} /> Export Forecast Models
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {scenarios.map((sc, idx) => (
          <div 
            key={idx} 
            className="esg-ana-card"
            style={{
              cursor: 'pointer',
              border: selectedIdx === idx ? '2px solid #0891B2' : '1px solid #E2E8F0',
              background: selectedIdx === idx ? 'rgba(8, 145, 178, 0.04)' : '#FFFFFF'
            }}
            onClick={() => setSelectedIdx(idx)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className="esg-ana-badge-cyan">{sc.id}</span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{sc.name}</h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>{sc.description}</p>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginTop: '0.4rem' }}>
                  Capex Requirement: <span style={{ color: '#0F172A' }}>{sc.investment}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0891B2' }}>{sc.forecast2030}</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: sc.variance.includes('+') ? '#DC2626' : '#059669' }}>
                  {sc.variance}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
