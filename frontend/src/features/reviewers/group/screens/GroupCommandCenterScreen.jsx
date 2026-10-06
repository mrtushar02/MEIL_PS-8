import React from 'react';
import { Shield, TrendingDown, Sun, Droplets, CheckCircle2, AlertTriangle, ArrowRight, Lock, Download, Award, Building2, Layers } from 'lucide-react';

export default function GroupCommandCenterScreen({ onNavigate, onSelectSubsidiary }) {
  const subsidiaries = [
    { code: 'SUB-01', name: 'Megha Hydro & Infrastructure', bus: 6, sites: 42, scope12: '64,120 tCO2e', readiness: 93.2, status: 'Approved', auditor: 'PwC Verified', exceptions: 4 },
    { code: 'SUB-02', name: 'Megha City Gas & Distribution', bus: 5, sites: 38, scope12: '22,450 tCO2e', readiness: 98.1, status: 'Approved', auditor: 'PwC Verified', exceptions: 0 },
    { code: 'SUB-03', name: 'Megha Solar & Clean Energy', bus: 4, sites: 52, scope12: '8,920 tCO2e', readiness: 100.0, status: 'Approved', auditor: 'PwC Verified', exceptions: 0 },
    { code: 'SUB-04', name: 'Megha Electric Mobility (Olectra)', bus: 6, sites: 24, scope12: '14,210 tCO2e', readiness: 97.4, status: 'Approved', auditor: 'PwC Verified', exceptions: 1 },
    { code: 'SUB-05', name: 'Megha Heavy Engineering & Manufacturing', bus: 8, sites: 48, scope12: '48,150 tCO2e', readiness: 94.0, status: 'Approved', auditor: 'PwC Verified', exceptions: 2 },
    { code: 'SUB-06', name: 'Megha International Ventures & Transmission', bus: 7, sites: 54, scope12: '26,400 tCO2e', readiness: 91.5, status: 'In Review', auditor: 'Under Audit', exceptions: 3 }
  ];

  return (
    <div className="group-command-center">
      {/* 6 Top KPIs */}
      <div className="group-stats-grid">
        <div className="group-stat-card">
          <div className="group-stat-header">
            <span className="group-stat-label">Consolidated Scope 1+2</span>
            <TrendingDown size={18} color="#059669" />
          </div>
          <div className="group-stat-value">184,250 <span style={{ fontSize: '0.9rem', color: '#64748B' }}>tCO2e</span></div>
          <span className="group-stat-subtext" style={{ color: '#059669' }}>↓ 4.2% YoY Decarbonization</span>
        </div>

        <div className="group-stat-card">
          <div className="group-stat-header">
            <span className="group-stat-label">Scope 3 Footprint</span>
            <Layers size={18} color="#4338CA" />
          </div>
          <div className="group-stat-value">412,800 <span style={{ fontSize: '0.9rem', color: '#64748B' }}>tCO2e</span></div>
          <span className="group-stat-subtext" style={{ color: '#4338CA' }}>Supply Chain & Logistics</span>
        </div>

        <div className="group-stat-card">
          <div className="group-stat-header">
            <span className="group-stat-label">Renewable Energy Mix</span>
            <Sun size={18} color="#D97706" />
          </div>
          <div className="group-stat-value">38.6%</div>
          <span className="group-stat-subtext" style={{ color: '#D97706' }}>Target: 40% by FY25</span>
        </div>

        <div className="group-stat-card">
          <div className="group-stat-header">
            <span className="group-stat-label">Water Recycled & Reused</span>
            <Droplets size={18} color="#2563EB" />
          </div>
          <div className="group-stat-value">68.2%</div>
          <span className="group-stat-subtext" style={{ color: '#2563EB' }}>Zero Liquid Discharge in 18 Plants</span>
        </div>

        <div className="group-stat-card">
          <div className="group-stat-header">
            <span className="group-stat-label">Safety TRIR / LTIFR</span>
            <CheckCircle2 size={18} color="#059669" />
          </div>
          <div className="group-stat-value">0.08</div>
          <span className="group-stat-subtext" style={{ color: '#059669' }}>Zero Fatalities Across 258 Sites</span>
        </div>

        <div className="group-stat-card" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', borderColor: '#C7D2FE' }}>
          <div className="group-stat-header">
            <span className="group-stat-label" style={{ color: '#3730A3' }}>BRSR Core Readiness</span>
            <Award size={18} color="#4338CA" />
          </div>
          <div className="group-stat-value" style={{ color: '#312E81' }}>96.4%</div>
          <span className="group-stat-subtext" style={{ color: '#4338CA' }}>Ready for Board Lock</span>
        </div>
      </div>

      {/* Subsidiary Progress Matrix */}
      <div className="group-card" style={{ marginBottom: '1.5rem' }}>
        <div className="group-card-header">
          <div>
            <h2 className="group-card-title">Enterprise Subsidiary ESG Consolidation Matrix</h2>
            <p className="group-card-subtitle">
              Mandatory SEBI tier-2 rollups across all 6 Group subsidiaries (36 Business Units, 258 Project Sites)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="group-btn-secondary" onClick={() => onNavigate && onNavigate('hierarchy')}>
              <Layers size={14} /> View 4-Tier Hierarchy
            </button>
            <button className="group-btn-primary" onClick={() => onNavigate && onNavigate('final-lock')}>
              <Lock size={14} /> Lock Reporting Period
            </button>
          </div>
        </div>

        <div className="group-table-container">
          <table className="group-table">
            <thead>
              <tr>
                <th>Subsidiary Code & Entity Name</th>
                <th>Business Units</th>
                <th>Project Sites</th>
                <th>Scope 1+2 Footprint</th>
                <th>Assurance Readiness</th>
                <th>Third-Party Status</th>
                <th>Exceptions</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subsidiaries.map(sub => (
                <tr key={sub.code}>
                  <td>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#0F172A' }}>
                        <Building2 size={16} color="#4338CA" />
                        {sub.name}
                      </div>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748B' }}>
                        Code: {sub.code}
                      </span>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 600 }}>{sub.bus} BUs</span></td>
                  <td><span style={{ color: '#475569' }}>{sub.sites} Sites</span></td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#1E293B' }}>{sub.scope12}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '130px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${sub.readiness}%`,
                          background: sub.readiness >= 95 ? '#10B981' : '#4338CA',
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>
                        {sub.readiness}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={sub.status === 'Approved' ? 'group-badge-success' : 'group-badge-warning'}>
                      {sub.auditor}
                    </span>
                  </td>
                  <td>
                    {sub.exceptions > 0 ? (
                      <span className="group-badge-warning">
                        {sub.exceptions} Flags
                      </span>
                    ) : (
                      <span className="group-badge-success">0 Clean</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="group-btn-outline" 
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => onSelectSubsidiary ? onSelectSubsidiary(sub) : onNavigate && onNavigate('performance')}
                    >
                      Inspect Subsidiary <ArrowRight size={13} />
                    </button>
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
