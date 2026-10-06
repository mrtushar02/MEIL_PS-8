import React from 'react';
import { Shield, Building, Calendar, CheckCircle2, Award, Lock, Sparkles, Layers } from 'lucide-react';

export default function GroupContextBar({ user, period = 'FY 2024-25 Q2', readiness = '96.4%' }) {
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
      boxShadow: '0 4px 20px -2px rgba(67, 56, 202, 0.06)'
    }}>
      {/* Group Entity Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #4338CA 0%, #1E1B4B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(67, 56, 202, 0.28)'
        }}>
          <Shield size={24} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              MEIL Group Corporate ESG Command
            </span>
            <span className="group-badge-indigo" style={{ fontSize: '0.7rem' }}>
              Group HQ (Tier-1 Apex)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
            <span>CSO: <strong>{user?.name || 'Dr. Rajeshwar Rao'}</strong></span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4338CA', fontWeight: 600 }}>
              <Layers size={13} /> 6 Subsidiaries • 36 BUs • 258 Sites
            </span>
            <span>•</span>
            <span style={{ color: '#059669', fontWeight: 600 }}>PwC Third-Party Assurance Active</span>
          </div>
        </div>
      </div>

      {/* Period & Enterprise Readiness Status */}
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
          <Calendar size={15} color="#4338CA" />
          <span>{period}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          background: '#EEF2FF',
          border: '1px solid #C7D2FE',
          padding: '0.45rem 0.95rem',
          borderRadius: '12px'
        }}>
          <Award size={18} color="#4338CA" />
          <div>
            <div style={{ fontSize: '0.68rem', color: '#3730A3', fontWeight: 700, textTransform: 'uppercase' }}>SEBI BRSR Assurance Score</div>
            <div style={{ fontSize: '0.9rem', color: '#1E1B4B', fontWeight: 800 }}>{readiness} Audit Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}
