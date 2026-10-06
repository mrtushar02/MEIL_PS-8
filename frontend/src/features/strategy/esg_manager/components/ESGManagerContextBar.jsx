import React from 'react';
import { Target, Leaf, Calendar, Award, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function ESGManagerContextBar({ user, period = 'FY 2024-25 Q2' }) {
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
      boxShadow: '0 4px 20px -2px rgba(4, 120, 87, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #047857 0%, #064E3B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(4, 120, 87, 0.28)'
        }}>
          <Target size={24} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              MEIL Enterprise Sustainability Strategy Office
            </span>
            <span className="esg-mgr-badge-emerald" style={{ fontSize: '0.7rem' }}>
              Net Zero 2045 Desk
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
            <span>Lead: <strong>{user?.name || 'A. Sundaram (ESG Manager)'}</strong></span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#047857', fontWeight: 600 }}>
              <Leaf size={13} /> SBTi 1.5°C Aligned
            </span>
            <span>•</span>
            <span style={{ color: '#2563EB', fontWeight: 600 }}>42.6% Interim 2030 Target Achieved</span>
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
          <Calendar size={15} color="#047857" />
          <span>{period}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          padding: '0.45rem 0.95rem',
          borderRadius: '12px'
        }}>
          <Award size={18} color="#047857" />
          <div>
            <div style={{ fontSize: '0.68rem', color: '#065F46', fontWeight: 700, textTransform: 'uppercase' }}>Decarbonization Index</div>
            <div style={{ fontSize: '0.9rem', color: '#064E3B', fontWeight: 800 }}>-18.4% Intensity Drop</div>
          </div>
        </div>
      </div>
    </div>
  );
}
