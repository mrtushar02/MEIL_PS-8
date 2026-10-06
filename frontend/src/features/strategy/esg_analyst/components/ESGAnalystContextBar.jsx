import React from 'react';
import { BarChart3, Cpu, Calendar, Database, CheckCircle2, TrendingDown } from 'lucide-react';

export default function ESGAnalystContextBar({ user, period = 'FY 2024-25 Q2' }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(226, 232, 240, 0.85)',
      borderRadius: '22px',
      padding: '0.9rem 1.6rem',
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: '0 4px 20px -2px rgba(8, 145, 178, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #0891B2 0%, #155E75 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(8, 145, 178, 0.28)'
        }}>
          <BarChart3 size={24} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              MEIL Quantitative ESG Modeling & Analytics Lab
            </span>
            <span className="esg-ana-badge-cyan" style={{ fontSize: '0.7rem' }}>
              Analytical Engine
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
            <span>Analyst: <strong>{user?.name || 'V. Ramanathan (ESG Analyst)'}</strong></span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#0891B2', fontWeight: 600 }}>
              <Cpu size={13} /> CEA Baseline v19 (0.716 kg CO2e/kWh)
            </span>
            <span>•</span>
            <span style={{ color: '#059669', fontWeight: 600 }}>258 Sites Ingested • 0 Anomalies</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          padding: '0.45rem 0.85rem',
          borderRadius: '12px',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: '#334155'
        }}>
          <Calendar size={15} color="#0891B2" />
          <span>{period}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          background: '#ECFEFF',
          border: '1px solid #A5F3FC',
          padding: '0.45rem 0.95rem',
          borderRadius: '12px'
        }}>
          <Database size={18} color="#0891B2" />
          <div>
            <div style={{ fontSize: '0.68rem', color: '#0E7490', fontWeight: 700, textTransform: 'uppercase' }}>Ingestion Data Quality</div>
            <div style={{ fontSize: '0.9rem', color: '#164E63', fontWeight: 800 }}>99.8% High Fidelity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
