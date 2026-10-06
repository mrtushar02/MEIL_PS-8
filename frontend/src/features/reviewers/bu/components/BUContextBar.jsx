import React from 'react';
import { ChevronRight, Building2, Calendar, CheckCircle2 } from 'lucide-react';

export default function BUContextBar({
  group = 'MEIL Group',
  division = 'MEIL Core Infrastructure Division',
  businessUnit = 'Tunnels Business Unit',
  buShortName = 'Tunnels',
  reportingPeriod = 'September 2026',
  cycleStatus = 'Review Cycle Active'
}) {
  return (
    <div
      className="bu-card"
      style={{
        padding: '10px 18px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(219, 234, 254, 0.8)',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(37, 99, 235, 0.04)'
      }}
    >
      {/* LEFT: 4-Tier Hierarchy Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B' }}>
        <Building2 size={15} color="#2563EB" />
        <span style={{ fontWeight: 600, color: '#334155' }}>{group}</span>
        <ChevronRight size={13} color="#94A3B8" />
        <span style={{ fontWeight: 600, color: '#334155' }}>{division}</span>
        <ChevronRight size={13} color="#94A3B8" />
        <span
          style={{
            fontWeight: 700,
            color: '#2563EB',
            background: 'rgba(37, 99, 235, 0.08)',
            padding: '2px 8px',
            borderRadius: '6px'
          }}
        >
          {businessUnit}
        </span>
      </div>

      {/* CENTER: Business Unit Identification */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
        <span style={{ color: '#64748B', fontWeight: 500 }}>Business Unit:</span>
        <span style={{ fontWeight: 700, color: '#0F172A' }}>{buShortName}</span>
      </div>

      {/* RIGHT: Period & Review Cycle Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
          <Calendar size={14} color="#64748B" />
          <span>Reporting Period:</span>
          <strong style={{ color: '#0F172A' }}>{reportingPeriod}</strong>
        </div>

        <div style={{ width: '1px', height: '16px', background: '#E2E8F0' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#16A34A',
              boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.2)'
            }}
          />
          <span style={{ fontWeight: 600, color: '#16A34A', fontSize: '12px' }}>
            {cycleStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
