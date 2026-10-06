import React from 'react';
import { Search, ShieldCheck, Calendar, Award, CheckCircle2, UserCheck } from 'lucide-react';

export default function AuditorContextBar({ user, period = 'FY 2024-25 Q2' }) {
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
      boxShadow: '0 4px 20px -2px rgba(180, 83, 9, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(180, 83, 9, 0.28)'
        }}>
          <Search size={24} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              PricewaterhouseCoopers (PwC) — Independent ESG Assurance Engagement
            </span>
            <span className="audit-usr-badge-amber" style={{ fontSize: '0.7rem' }}>
              ISAE 3410 / 3000 Mandate
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
            <span>Lead Auditor: <strong>{user?.name || 'R. Singhania, FCA (PwC ESG Partner)'}</strong></span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#B45309', fontWeight: 600 }}>
              <ShieldCheck size={13} /> 426 / 472 Samples Verified
            </span>
            <span>•</span>
            <span style={{ color: '#059669', fontWeight: 600 }}>Materiality Threshold 5.0% Met</span>
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
          <Calendar size={15} color="#B45309" />
          <span>{period}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          padding: '0.45rem 0.95rem',
          borderRadius: '12px'
        }}>
          <Award size={18} color="#B45309" />
          <div>
            <div style={{ fontSize: '0.68rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase' }}>Opinion Type</div>
            <div style={{ fontSize: '0.9rem', color: '#78350F', fontWeight: 800 }}>Clean Unqualified Opinion</div>
          </div>
        </div>
      </div>
    </div>
  );
}
