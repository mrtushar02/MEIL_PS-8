import React, { useState } from 'react';
import { Flame, Zap, Truck, Sun, Droplets, HeartHandshake, ShieldCheck, TrendingDown, Layers, BarChart2 } from 'lucide-react';

export default function GroupEnterpriseESGScreen() {
  const [activeTab, setActiveTab] = useState('environmental');

  return (
    <div className="group-enterprise-esg-screen">
      {/* Category Tabs */}
      <div className="group-card" style={{ marginBottom: '1.25rem', padding: '0.75rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[
            { id: 'environmental', label: 'Environmental (GHG, Energy, Water, Circularity)' },
            { id: 'social', label: 'Social (Workforce, Health & Safety, CSR 2% PAT)' },
            { id: 'governance', label: 'Governance (Board Diversity, Ethics, Anti-Corruption)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group-btn-outline ${activeTab === tab.id ? 'group-btn-primary' : ''}`}
              style={{
                borderRadius: '12px',
                padding: '0.45rem 1.1rem',
                fontSize: '0.82rem',
                background: activeTab === tab.id ? '#4338CA' : '#FFFFFF',
                color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                borderColor: activeTab === tab.id ? '#4338CA' : '#E2E8F0'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'environmental' && (
        <>
          {/* GHG Pillars */}
          <div className="group-stats-grid">
            <div className="group-stat-card">
              <div className="group-stat-header">
                <span className="group-stat-label">Scope 1 Direct</span>
                <Flame size={18} color="#EA580C" />
              </div>
              <div className="group-stat-value">112,400 <span style={{ fontSize: '0.85rem', color: '#64748B' }}>tCO2e</span></div>
              <span className="group-stat-subtext" style={{ color: '#059669' }}>-3.8% Diesel optimization on sites</span>
            </div>

            <div className="group-stat-card">
              <div className="group-stat-header">
                <span className="group-stat-label">Scope 2 Indirect (Grid)</span>
                <Zap size={18} color="#2563EB" />
              </div>
              <div className="group-stat-value">71,850 <span style={{ fontSize: '0.85rem', color: '#64748B' }}>tCO2e</span></div>
              <span className="group-stat-subtext" style={{ color: '#2563EB' }}>CEA Baseline v19 (0.716 kg/kWh)</span>
            </div>

            <div className="group-stat-card">
              <div className="group-stat-header">
                <span className="group-stat-label">Scope 3 Value Chain</span>
                <Truck size={18} color="#7C3AED" />
              </div>
              <div className="group-stat-value">412,800 <span style={{ fontSize: '0.85rem', color: '#64748B' }}>tCO2e</span></div>
              <span className="group-stat-subtext" style={{ color: '#7C3AED' }}>Cement, Steel & Logistics</span>
            </div>

            <div className="group-stat-card">
              <div className="group-stat-header">
                <span className="group-stat-label">Renewable Share</span>
                <Sun size={18} color="#D97706" />
              </div>
              <div className="group-stat-value">38.6%</div>
              <span className="group-stat-subtext" style={{ color: '#D97706' }}>142 GWh Clean Generation</span>
            </div>
          </div>

          {/* Decarbonization Roadmap & Intensity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="group-card">
              <h3 className="group-card-title" style={{ marginBottom: '0.5rem' }}>Decarbonization Trajectory (Net Zero 2045)</h3>
              <p className="group-card-subtitle" style={{ marginBottom: '1.25rem' }}>
                Group-wide Scope 1 & 2 carbon intensity reduction path against SEBI top-100 benchmarks
              </p>

              {/* Progress bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>FY22 Baseline</span>
                    <span style={{ fontWeight: 700 }}>24.2 tCO2e / ₹ Cr Revenue</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: '#94A3B8' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>FY24 Actual</span>
                    <span style={{ fontWeight: 700, color: '#4338CA' }}>19.8 tCO2e / ₹ Cr Revenue (-18.2%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '82%', height: '100%', background: '#4338CA' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>FY25 Target (Current Cycle)</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>17.5 tCO2e / ₹ Cr Revenue (-27.7%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '72%', height: '100%', background: '#10B981' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="group-card">
              <h3 className="group-card-title" style={{ marginBottom: '0.5rem' }}>Water & Material Circularity</h3>
              <p className="group-card-subtitle" style={{ marginBottom: '1.25rem' }}>
                Water stewardship across water-stressed river basins and industrial reuse
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>WATER INTENSITY</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563EB', marginTop: '0.2rem' }}>42.1 m³</div>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>↓ 6.1% per ₹ Cr</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>RECYCLED WATER</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>68.2%</div>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>ZLD in 18 Plants</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>HAZARDOUS WASTE</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>100%</div>
                  <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 600 }}>SPCB Manifest Tracked</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>SLAG REUSE IN ROAD</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#7C3AED', marginTop: '0.2rem' }}>340,000 t</div>
                  <span style={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: 600 }}>Circular Infrastructure</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'social' && (
        <div className="group-card">
          <h3 className="group-card-title">Social Performance & Human Capital</h3>
          <p className="group-card-subtitle" style={{ marginBottom: '1.25rem' }}>
            Workforce health & safety, training hours, gender ratio, and CSR Schedule VII execution
          </p>
          <div className="group-stats-grid">
            <div className="group-stat-card">
              <span className="group-stat-label">Zero Fatalities</span>
              <div className="group-stat-value" style={{ color: '#059669' }}>0</div>
              <span className="group-stat-subtext">Across 258 construction sites</span>
            </div>
            <div className="group-stat-card">
              <span className="group-stat-label">CSR Spends (Statutory 2% PAT)</span>
              <div className="group-stat-value" style={{ color: '#4338CA' }}>₹ 84.6 Cr</div>
              <span className="group-stat-subtext">100% disbursed to approved trusts</span>
            </div>
            <div className="group-stat-card">
              <span className="group-stat-label">HSE Training Hours</span>
              <div className="group-stat-value">124,500 hrs</div>
              <span className="group-stat-subtext">Average 18 hrs / worker</span>
            </div>
            <div className="group-stat-card">
              <span className="group-stat-label">Permanent Workforce Covered</span>
              <div className="group-stat-value">100%</div>
              <span className="group-stat-subtext">EPF, ESI & Health Insurance</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="group-card">
          <h3 className="group-card-title">Corporate Governance & Ethics</h3>
          <p className="group-card-subtitle" style={{ marginBottom: '1.25rem' }}>
            Board oversight, audit committee reviews, anti-bribery policies, and whistle-blower resolution
          </p>
          <div className="group-stats-grid">
            <div className="group-stat-card">
              <span className="group-stat-label">Independent Directors</span>
              <div className="group-stat-value">50%</div>
              <span className="group-stat-subtext">Meets SEBI LODR Regulation 17</span>
            </div>
            <div className="group-stat-card">
              <span className="group-stat-label">ESG Board Committee</span>
              <div className="group-stat-value" style={{ color: '#059669' }}>Quarterly</div>
              <span className="group-stat-subtext">Chaired by Independent Director</span>
            </div>
            <div className="group-stat-card">
              <span className="group-stat-label">Whistleblower Cases Resolved</span>
              <div className="group-stat-value">100%</div>
              <span className="group-stat-subtext">Zero pending vigilance cases</span>
            </div>
            <div className="group-stat-card">
              <span className="group-stat-label">Statutory Compliance Score</span>
              <div className="group-stat-value" style={{ color: '#4338CA' }}>100%</div>
              <span className="group-stat-subtext">MCA, SEBI, GST, CPCB flawless</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
