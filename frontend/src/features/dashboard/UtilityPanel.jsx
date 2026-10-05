import React from 'react';
import {
  CheckCircle2,
  Clock,
  FileText,
  UploadCloud,
  ShieldCheck
} from 'lucide-react';
import GlassCard from '../../components/glass/GlassCard';
import GlassBadge from '../../components/glass/GlassBadge';
import GlassButton from '../../components/glass/GlassButton';

export function UtilityPanel({ onNavigateToSubmissions, onNavigateToEvidence }) {
  const submissionSteps = [
    { label: 'Site Data Entry', status: 'COMPLETED', date: 'Sep 26', officer: 'Tenzin Dorjey' },
    { label: 'Primary Evidence Linked', status: 'COMPLETED', date: 'Sep 27', officer: 'IOCL & Discom' },
    { label: 'BU Coordinator Review', status: 'IN_PROGRESS', date: 'Sep 29', officer: 'R. K. Sharma' },
    { label: 'Subsidiary Sign-off', status: 'PENDING', date: 'Pending', officer: 'Director ESG' },
    { label: 'Group Statutory Audit', status: 'PENDING', date: 'Pending', officer: 'Bureau Veritas' },
  ];

  const recentEvidence = [
    { name: 'TSSPDCL_Sept_Meter_Bill.pdf', size: '2.4 MB', type: 'PDF', status: 'VERIFIED', tag: 'Scope 2' },
    { name: 'IOCL_Diesel_Challan_4819.pdf', size: '1.8 MB', type: 'PDF', status: 'VERIFIED', tag: 'Scope 1' },
    { name: 'ETP_Treated_Water_Test.pdf', size: '3.1 MB', type: 'PDF', status: 'AUDITED', tag: 'Water' },
  ];

  const auditEvents = [
    { action: 'Diesel consumption logged: 384,000 L', time: '14 mins ago', user: 'Tenzin D.' },
    { action: 'Attached IOCL invoice #4819', time: '1 hour ago', user: 'Tenzin D.' },
    { action: 'Outlier flag marked: heavy monsoon pumping', time: '3 hours ago', user: 'System Engine' },
  ];

  return (
    <>
      {/* 1. 5-Stage Maker-Checker Workflow State */}
      <GlassCard level={2} style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              Maker-Checker Workflow
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              September 2025 Submission #SUB-KALES-09
            </p>
          </div>
          <GlassBadge status="warning">Under Review</GlassBadge>
        </div>

        {/* Vertical Stepper */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
          {submissionSteps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative' }}>
              {/* Stepper Dot */}
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: step.status === 'COMPLETED' ? 'var(--state-success)' : step.status === 'IN_PROGRESS' ? 'var(--blue-accent)' : 'rgba(200, 217, 231, 0.6)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '700',
                flexShrink: 0,
                marginTop: '1px',
                boxShadow: step.status === 'IN_PROGRESS' ? '0 0 0 4px var(--blue-glow)' : 'none'
              }}>
                {step.status === 'COMPLETED' ? <CheckCircle2 size={13} /> : idx + 1}
              </div>

              {/* Step Info */}
              <div style={{ flexGrow: 1, lineHeight: '1.3' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{step.officer}</span>
                  <span>{step.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '18px' }}>
          <GlassButton variant="secondary" size="sm" onClick={onNavigateToSubmissions} style={{ width: '100%' }}>
            View Full Lifecycle Trail
          </GlassButton>
        </div>
      </GlassCard>

      {/* 2. Evidence Library Quick Vault */}
      <GlassCard level={2} style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              Primary Evidence Vault
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Mandatory third-party assurance proof
            </p>
          </div>
          <ShieldCheck size={18} color="var(--state-success)" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentEvidence.map((doc, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid var(--border-soft)',
                borderRadius: '10px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 150ms ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <FileText size={18} color="var(--blue-accent)" />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '12.5px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {doc.size} • {doc.tag}
                  </div>
                </div>
              </div>

              <GlassBadge status="success" size="sm">
                {doc.status}
              </GlassBadge>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '14px' }}>
          <GlassButton variant="secondary" size="sm" onClick={onNavigateToEvidence} icon={UploadCloud} style={{ width: '100%' }}>
            Upload Verification Document
          </GlassButton>
        </div>
      </GlassCard>

      {/* 3. Immutable Audit Trail Feed */}
      <GlassCard level={2} style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Recent Audit Trail
          </h3>
          <Clock size={16} color="var(--text-muted)" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {auditEvents.map((evt, idx) => (
            <div key={idx} style={{ borderLeft: '2px solid var(--blue-accent)', paddingLeft: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)' }}>
                {evt.action}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {evt.time} by <span style={{ fontWeight: '600' }}>{evt.user}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
}

export default UtilityPanel;
