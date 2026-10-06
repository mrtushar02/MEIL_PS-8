import React from 'react';
import { TrendingDown, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ForecastingSimulationScreen() {
  const scenarios = [
    { name: 'Business-As-Usual (BAU)', description: 'Continues current grid mix and diesel consumption rates without additional clean tech investment.', forecast2030: '248,000 tCO2e', variance: '+14% above SBTi 1.5°C' },
    { name: 'Planned Transition (Base Plan)', description: 'Execution of 140 MW solar PPAs, B5 biodiesel blend, and 40% electric transport fleet.', forecast2030: '142,000 tCO2e', variance: '-42% (SBTi Aligned)' },
    { name: 'Aggressive Net Zero Acceleration', description: 'Early deployment of green hydrogen heavy tunneling rigs, 100% renewable power, green steel.', forecast2030: '94,000 tCO2e', variance: '-62% (Fastest Decarbonization)' }
  ];

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
          <span className="esg-ana-badge-cyan">3 Scenarios Modeled</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {scenarios.map((sc, idx) => (
          <div key={idx} className="esg-ana-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{sc.name}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>{sc.description}</p>
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
