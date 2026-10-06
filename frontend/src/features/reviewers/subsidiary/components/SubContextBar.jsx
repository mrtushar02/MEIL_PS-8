import React from 'react';
import { Building2, ShieldCheck, Calendar, CheckCircle2, ChevronRight, Layers, AlertTriangle } from 'lucide-react';

export default function SubContextBar({ 
  user,
  selectedBu = 'All Business Units',
  period = 'FY 2024-25 Q2',
  readiness = '93.2%',
  onPeriodChange
}) {
  return (
    <div className="sub-context-bar" style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '20px',
      padding: '0.85rem 1.5rem',
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: '0 4px 20px -2px rgba(124, 58, 237, 0.05)'
    }}>
      {/* Left: Subsidiary Entity Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
        }}>
          <Building2 size={22} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
              MEIL Hydro & Infrastructure Subsidiary
            </span>
            <span className="sub-badge-purple" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              Tier-2 Subsidiary
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
            <span>Code: <strong>SUB-01-MEIL</strong></span>
            <span>•</span>
            <span>Head: <strong>{user?.name || 'V. Krishna'}</strong></span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#7C3AED', fontWeight: 600 }}>
              <Layers size={13} /> 6 Business Units (258 Sites)
            </span>
          </div>
        </div>
      </div>

      {/* Right: Period & Regulatory Readiness */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          padding: '0.4rem 0.8rem',
          borderRadius: '10px',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#334155'
        }}>
          <Calendar size={15} color="#7C3AED" />
          <span>{period}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#F5F3FF',
          border: '1px solid #DDD6FE',
          padding: '0.4rem 0.85rem',
          borderRadius: '10px'
        }}>
          <ShieldCheck size={16} color="#7C3AED" />
          <div>
            <div style={{ fontSize: '0.7rem', color: '#6D28D9', fontWeight: 700, textTransform: 'uppercase' }}>SEBI BRSR Readiness</div>
            <div style={{ fontSize: '0.85rem', color: '#4C1D95', fontWeight: 800 }}>{readiness} Consolidated</div>
          </div>
        </div>
      </div>
    </div>
  );
}
