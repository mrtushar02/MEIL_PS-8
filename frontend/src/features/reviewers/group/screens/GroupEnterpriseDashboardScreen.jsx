import React from 'react';
import { Shield, Sparkles, TrendingDown, Sun, Droplets, Award, ArrowRight, Lock, CheckCircle2, FileText } from 'lucide-react';

export default function GroupEnterpriseDashboardScreen({ onNavigate }) {
  return (
    <div className="group-enterprise-dashboard-screen">
      {/* Executive Hero */}
      <div className="group-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 100%)', border: '1px solid #C7D2FE' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="group-badge-indigo" style={{ marginBottom: '0.4rem' }}>
              <Sparkles size={12} style={{ display: 'inline', marginRight: '0.2rem' }} /> Enterprise Executive ESG Panoramic
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E1B4B', margin: '0.2rem 0' }}>
              MEIL Group Corporate Sustainability Review FY25 Q2
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
              Consolidated ESG performance across 6 group companies, 36 business units, and 258 infrastructure projects
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="group-btn-secondary" onClick={() => onNavigate && onNavigate('statutory-reports')}>
              <FileText size={15} /> Board ESG Dossier
            </button>
            <button className="group-btn-primary" onClick={() => onNavigate && onNavigate('final-lock')}>
              <Lock size={15} /> Statutory Lock
            </button>
          </div>
        </div>
      </div>

      {/* Panoramic 4-Quadrant Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Quadrant 1: Decarbonization */}
        <div className="group-card">
          <div className="group-card-header">
            <h3 className="group-card-title">1. Decarbonization (Scope 1 & 2)</h3>
            <span className="group-badge-success">-4.2% YoY</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>
            184,250 <span style={{ fontSize: '0.85rem', color: '#64748B' }}>tCO2e</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.4rem' }}>
            Calculated under CEA Baseline v19 (0.716 kg CO2e/kWh). On track for Net Zero 2045.
          </p>
          <button className="group-btn-outline" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }} onClick={() => onNavigate && onNavigate('enterprise-esg')}>
            View Carbon Accounting <ArrowRight size={13} />
          </button>
        </div>

        {/* Quadrant 2: Clean Transition */}
        <div className="group-card">
          <div className="group-card-header">
            <h3 className="group-card-title">2. Clean Energy & Water</h3>
            <span className="group-badge-indigo">38.6% Green</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4338CA' }}>
            142 GWh <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Clean Power</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.4rem' }}>
            68.2% water recycled across high water-stressed industrial clusters.
          </p>
          <button className="group-btn-outline" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }} onClick={() => onNavigate && onNavigate('enterprise-esg')}>
            View Energy & Water Balance <ArrowRight size={13} />
          </button>
        </div>

        {/* Quadrant 3: Safety & Human Capital */}
        <div className="group-card">
          <div className="group-card-header">
            <h3 className="group-card-title">3. Safety & People</h3>
            <span className="group-badge-success">Zero Fatalities</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669' }}>
            0.08 <span style={{ fontSize: '0.85rem', color: '#64748B' }}>LTIFR Rate</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.4rem' }}>
            124,500 hours HSE safety training conducted across all 258 construction sites.
          </p>
          <button className="group-btn-outline" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }} onClick={() => onNavigate && onNavigate('enterprise-esg')}>
            View Social Metrics <ArrowRight size={13} />
          </button>
        </div>

        {/* Quadrant 4: SEBI BRSR Assurance */}
        <div className="group-card">
          <div className="group-card-header">
            <h3 className="group-card-title">4. SEBI Assurance</h3>
            <span className="group-badge-success">PwC Verified</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#312E81' }}>
            96.4% <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Audit Ready</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.4rem' }}>
            426 of 472 evidence artifacts verified with reasonable/limited assurance opinion.
          </p>
          <button className="group-btn-outline" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }} onClick={() => onNavigate && onNavigate('assurance')}>
            Inspect Assurance Center <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
