import React from 'react';
import { History, ShieldCheck, Download } from 'lucide-react';

export default function AuditTrailLedgerScreen() {
  const trails = [
    { timestamp: '28 Oct 2024 16:30:15', auditor: 'R. Singhania (PwC Partner)', action: 'Issued Unqualified Clean Assurance Statement', hash: 'e91fa...09b' },
    { timestamp: '28 Oct 2024 14:15:22', auditor: 'PwC Climate Senior Manager', action: 'Sample Testing Completed for 142 Scope 1 & 2 Sites', hash: '88bc1...33d' },
    { timestamp: '27 Oct 2024 17:40:00', auditor: 'PwC ESG Auditor', action: 'Verified Ultrasonic Water Meter Calibration Form', hash: '55da2...71e' },
    { timestamp: '27 Oct 2024 11:20:00', auditor: 'TUV Nord Safety Lead', action: 'Confirmed Zero Fatalities Across 258 Construction Sites', hash: '33cb9...44a' }
  ];

  return (
    <div className="audit-usr-ledger">
      <div className="audit-usr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="audit-usr-card-header">
          <div>
            <h2 className="audit-usr-card-title">Auditor Immutable Verification Ledger & Workpaper Trail</h2>
            <p className="audit-usr-card-subtitle">
              Cryptographically timestamped action logs documenting all testing procedures, sample checks, and partner sign-offs
            </p>
          </div>
          <button className="audit-usr-btn-outline" style={{ fontSize: '0.8rem' }}>
            <Download size={14} /> Export Workpaper CSV
          </button>
        </div>

        <div className="audit-usr-table-container">
          <table className="audit-usr-table">
            <thead>
              <tr>
                <th>Timestamp (IST)</th>
                <th>Auditor Practitioner</th>
                <th>Assurance Action Executed</th>
                <th style={{ textAlign: 'right' }}>Audit Ledger Hash</th>
              </tr>
            </thead>
            <tbody>
              {trails.map((t, idx) => (
                <tr key={idx}>
                  <td><span style={{ fontSize: '0.8rem', color: '#64748B' }}>{t.timestamp}</span></td>
                  <td><span style={{ fontWeight: 700, color: '#0F172A' }}>{t.auditor}</span></td>
                  <td><span className="audit-usr-badge-amber">{t.action}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', background: '#F8FAFC', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{t.hash}</span>
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
