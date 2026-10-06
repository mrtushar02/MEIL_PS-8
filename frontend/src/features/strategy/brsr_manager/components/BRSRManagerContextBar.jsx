import React from 'react';
import { Scale, FileCheck, Calendar, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function BRSRManagerContextBar({ user, period = 'FY 2024-25 Q2' }) {
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
      boxShadow: '0 4px 20px -2px rgba(37, 99, 235, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)'
        }}>
          <Scale size={24} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              MEIL SEBI BRSR Regulatory Authority Desk
            </span>
            <span className="brsr-mgr-badge-blue" style={{ fontSize: '0.7rem' }}>
              SEBI Mandate 2021 / 2023 / 2025
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
            <span>Lead: <strong>{user?.name || 'S. Mukherjee (BRSR Manager)'}</strong></span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#2563EB', fontWeight: 600 }}>
              <FileCheck size={13} /> NGRBC 9 Principles Complete
            </span>
            <span>•</span>
            <span style={{ color: '#059669', fontWeight: 600 }}>XBRL Taxonomy Validated</span>
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
          <Calendar size={15} color="#2563EB" />
          <span>{period}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          padding: '0.45rem 0.95rem',
          borderRadius: '12px'
        }}>
          <ShieldCheck size={18} color="#2563EB" />
          <div>
            <div style={{ fontSize: '0.68rem', color: '#1E40AF', fontWeight: 700, textTransform: 'uppercase' }}>SEBI Core Assurance Readiness</div>
            <div style={{ fontSize: '0.9rem', color: '#172554', fontWeight: 800 }}>98.2% Filing Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}
