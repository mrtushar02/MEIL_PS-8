import React from 'react';
import { FileCheck, ShieldCheck, Download, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function EvidenceScrutinyScreen() {
  const artifacts = [
    { id: 'SMP-2024-001', name: 'Zojila Diesel Bulk Tanker Invoice #IOCL-491', site: 'Zojila Tunnel Site', hash: 'sha256:4a8b...19e', auditorNote: 'Quantity matches IOCL delivery challan and site log', verification: 'Passed (Clean)' },
    { id: 'SMP-2024-002', name: 'Rohtang Pass HT DISCOM Bill BESCOM-8812', site: 'Rohtang Pass Site', hash: 'sha256:7c1d...88f', auditorNote: 'Units consumed matched CEA baseline factor calculation', verification: 'Passed (Clean)' },
    { id: 'SMP-2024-003', name: 'Ramagundam Flue Gas CPCB Continuous Log', site: 'Thermal Infra Unit 4', hash: 'sha256:92e4...31a', auditorNote: 'PM2.5 spike mitigated; recalibration certificate verified', verification: 'Passed (Resolved)' },
    { id: 'SMP-2024-004', name: 'Kaleshwaram Lift Irrig. CGWA Water Log', site: 'Kaleshwaram Lift Irrig.', hash: 'sha256:55f2...bc0', auditorNote: 'Ultrasonic flow meter calibration sheet verified valid', verification: 'Passed (Clean)' }
  ];

  return (
    <div className="audit-usr-scrutiny">
      <div className="audit-usr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="audit-usr-card-header">
          <div>
            <h2 className="audit-usr-card-title">Cryptographic Evidence Artifact Scrutiny & Hash Verification</h2>
            <p className="audit-usr-card-subtitle">
              Inspection of underlying source documents, meter telemetry calibration records, and SHA-256 byte signatures
            </p>
          </div>
          <span className="audit-usr-badge-amber">SHA-256 Cryptographic Tamper-Proof Seals Verified</span>
        </div>
      </div>

      <div className="audit-usr-card">
        <div className="audit-usr-table-container">
          <table className="audit-usr-table">
            <thead>
              <tr>
                <th>Sample ID</th>
                <th>Evidence Artifact Name</th>
                <th>Project Site</th>
                <th>SHA-256 Hash</th>
                <th>Auditor Workpaper Working Note</th>
                <th style={{ textAlign: 'right' }}>Scrutiny Result</th>
              </tr>
            </thead>
            <tbody>
              {artifacts.map(a => (
                <tr key={a.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#B45309' }}>{a.id}</span>
                  </td>
                  <td><span style={{ fontWeight: 700, color: '#0F172A' }}>{a.name}</span></td>
                  <td><span style={{ color: '#475569' }}>{a.site}</span></td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', background: '#F8FAFC', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{a.hash}</span>
                  </td>
                  <td><span style={{ fontSize: '0.8rem', color: '#334155' }}>{a.auditorNote}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="audit-usr-badge-amber">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                      {a.verification}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
