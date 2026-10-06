import React from 'react';
import { Target, TrendingDown, Sun, Truck, Layers, Award, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ESGManagerOverviewScreen({ onNavigate }) {
  const initiatives = [
    { title: 'Project Electric Heavy Tippers Transition', scope: 'Scope 1 Levers', target: '-22,000 tCO2e', status: 'In Execution', completion: '64%', lead: 'Fleet Logistics' },
    { title: 'Captive Solar PPA 140 MW Rooftop & Ground', scope: 'Scope 2 Levers', target: '-48,500 tCO2e', status: 'Commissioned', completion: '100%', lead: 'Energy BU' },
    { title: 'Slag & Pozzolanic Low-Carbon Concrete Mandate', scope: 'Scope 3 Levers', target: '-94,000 tCO2e', status: 'Scaling Up', completion: '78%', lead: 'Procurement' },
    { title: 'Zero Liquid Discharge (ZLD) Water Recycling', scope: 'Water Stewardship', target: '68.2% Reused', status: 'Operating', completion: '92%', lead: 'HSE Teams' }
  ];

  return (
    <div className="esg-mgr-overview">
      {/* 4 Hero KPI Cards */}
      <div className="esg-mgr-stats-grid">
        <div className="esg-mgr-stat-card">
          <div className="esg-mgr-stat-header">
            <span className="esg-mgr-stat-label">Net Zero Target Year</span>
            <Target size={18} color="#047857" />
          </div>
          <div className="esg-mgr-stat-value">2045</div>
          <span className="esg-mgr-stat-subtext">5 Years Ahead of India COP26</span>
        </div>

        <div className="esg-mgr-stat-card">
          <div className="esg-mgr-stat-header">
            <span className="esg-mgr-stat-label">2030 Interim Abatement</span>
            <TrendingDown size={18} color="#047857" />
          </div>
          <div className="esg-mgr-stat-value">42.6%</div>
          <span className="esg-mgr-stat-subtext">Base Year FY22 Baseline</span>
        </div>

        <div className="esg-mgr-stat-card">
          <div className="esg-mgr-stat-header">
            <span className="esg-mgr-stat-label">Renewable Energy Share</span>
            <Sun size={18} color="#D97706" />
          </div>
          <div className="esg-mgr-stat-value">38.6%</div>
          <span className="esg-mgr-stat-subtext" style={{ color: '#D97706' }}>Target: 50% by 2027</span>
        </div>

        <div className="esg-mgr-stat-card">
          <div className="esg-mgr-stat-header">
            <span className="esg-mgr-stat-label">Supplier ESG Coverage</span>
            <Truck size={18} color="#2563EB" />
          </div>
          <div className="esg-mgr-stat-value">84.2%</div>
          <span className="esg-mgr-stat-subtext" style={{ color: '#2563EB' }}>Top 500 Suppliers Assessed</span>
        </div>
      </div>

      {/* Flagship Decarbonization Initiatives */}
      <div className="esg-mgr-card">
        <div className="esg-mgr-card-header">
          <div>
            <h2 className="esg-mgr-card-title">Flagship Decarbonization & Transition Levers</h2>
            <p className="esg-mgr-card-subtitle">
              High-impact sustainability programs actively managed across the MEIL enterprise hierarchy
            </p>
          </div>
          <button className="esg-mgr-btn-primary" onClick={() => onNavigate && onNavigate('roadmap')}>
            View Detailed Roadmap <ArrowRight size={14} />
          </button>
        </div>

        <div className="esg-mgr-table-container">
          <table className="esg-mgr-table">
            <thead>
              <tr>
                <th>Initiative Program</th>
                <th>Target Category</th>
                <th>Estimated CO2e Abatement</th>
                <th>Execution Team</th>
                <th>Milestone Progress</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {initiatives.map((init, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{init.title}</span>
                  </td>
                  <td>
                    <span className="esg-mgr-badge-emerald">{init.scope}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#047857' }}>{init.target}</span>
                  </td>
                  <td><span style={{ color: '#475569' }}>{init.lead}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '120px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: init.completion, height: '100%', background: '#047857', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{init.completion}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="esg-mgr-badge-emerald">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                      {init.status}
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
