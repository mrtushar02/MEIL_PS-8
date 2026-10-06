import React from 'react';
import { Eye, Briefcase, Calendar, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ExecutiveBoardContextBar({ user, period = 'FY 2024-25 Q2' }) {
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
      boxShadow: '0 4px 20px -2px rgba(30, 41, 59, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(30, 41, 59, 0.28)'
        }}>
          <Eye size={24} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              MEIL Group Board of Directors & C-Suite Briefing
            </span>
            <span className="exec-bd-badge-slate" style={{ fontSize: '0.7rem' }}>
              Apex Leadership Desk
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
            <span>Executive: <strong>{user?.name || 'K. Venkatarama Reddy (Managing Director)'}</strong></span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#1E293B', fontWeight: 600 }}>
              <Briefcase size={13} /> Group Turnover: ₹ 32,800 Cr
            </span>
            <span>•</span>
            <span style={{ color: '#059669', fontWeight: 600 }}>MSCI ESG Rating: BBB (Upgrade to A on track)</span>
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
          <Calendar size={15} color="#1E293B" />
          <span>{period}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          background: '#F1F5F9',
          border: '1px solid #CBD5E1',
          padding: '0.45rem 0.95rem',
          borderRadius: '12px'
        }}>
          <Award size={18} color="#1E293B" />
          <div>
            <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>Enterprise Value Impact</div>
            <div style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 800 }}>Top Quartile in EPC Sector</div>
          </div>
        </div>
      </div>
    </div>
  );
}
