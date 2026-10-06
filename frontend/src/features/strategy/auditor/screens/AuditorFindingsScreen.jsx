import React from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';

export default function AuditorFindingsScreen() {
  const findings = [
    { id: 'OBS-2024-01', classification: 'Minor Observation', parameter: 'P6_E4 Hazardous Waste', finding: 'Hazardous waste Form-10 acknowledgment stamp from UPPCB was pending for batch #41 lube oil.', managementResponse: 'Transporter acknowledgment verified; formal stamped manifest uploaded on Oct 28.', status: 'Cleared / Closed' },
    { id: 'OBS-2024-02', classification: 'Informational Note', parameter: 'P6_E3 Water Abstraction', finding: 'Ultrasonic flow meter telemetry experienced temporary 2-hour offline buffer at Kaleshwaram site.', managementResponse: 'Offline data logger buffer successfully synced; zero data lost.', status: 'Cleared / Closed' }
  ];

  return (
    <div className="audit-usr-findings">
      <div className="audit-usr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="audit-usr-card-header">
          <div>
            <h2 className="audit-usr-card-title">Audit Findings, Observations & Management Letters</h2>
            <p className="audit-usr-card-subtitle">
              Formal audit inquiries, management representations, and corrective evidence clearances
            </p>
          </div>
          <span className="audit-usr-badge-amber">Zero Unresolved Audit Findings</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {findings.map(f => (
          <div key={f.id} className="audit-usr-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <div>
                <span className="audit-usr-badge-amber" style={{ marginBottom: '0.35rem' }}>{f.classification}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>{f.id}: {f.parameter}</h3>
              </div>
              <span className="audit-usr-badge-amber">{f.status}</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: '0.4rem 0' }}>
              <strong>Auditor Observation:</strong> {f.finding}
            </p>
            <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Management Clearance: </span>
              <span style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>{f.managementResponse}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
