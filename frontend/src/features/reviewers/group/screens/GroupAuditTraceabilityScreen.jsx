import React from 'react';
import { History, ShieldCheck, Download, Search, CheckCircle2 } from 'lucide-react';

export default function GroupAuditTraceabilityScreen() {
  const auditLogs = [
    { timestamp: '28 Oct 2024 17:10:04', actor: 'V. Krishna (Sub Head)', entity: 'Hydro & Infra (SUB-01)', action: 'Approved Entire Subsidiary Package', hash: 'e83a9...b01' },
    { timestamp: '28 Oct 2024 16:50:22', actor: 'M. Anand (Sub Head)', entity: 'City Gas & Dist (SUB-02)', action: 'Approved Entire Subsidiary Package', hash: 'c94f1...92d' },
    { timestamp: '28 Oct 2024 16:30:15', actor: 'D. Sen (Sub Head)', entity: 'Solar & Clean Energy (SUB-03)', action: 'Approved Entire Subsidiary Package', hash: '71ac3...10e' },
    { timestamp: '28 Oct 2024 15:45:10', actor: 'S. Rawat (Sub Head)', entity: 'Electric Mobility (SUB-04)', action: 'Approved Entire Subsidiary Package', hash: '44b82...09a' },
    { timestamp: '28 Oct 2024 14:20:00', actor: 'PwC Climate Audit Team', entity: 'Group Corporate Scope 1+2', action: 'Issued Unqualified Assurance Memo', hash: '992cd...fe3' },
    { timestamp: '27 Oct 2024 18:00:19', actor: 'P. Nair (BU Coord)', entity: 'Tunnels BU (42 Sites)', action: 'Approved BU Consolidated Package', hash: 'a12b4...88c' }
  ];

  return (
    <div className="group-audit-screen">
      <div className="group-card" style={{ marginBottom: '1.25rem' }}>
        <div className="group-card-header">
          <div>
            <h2 className="group-card-title">Group Cryptographic Audit Trail & Traceability Ledger</h2>
            <p className="group-card-subtitle">
              Immutable SHA-256 sealed transaction trail logging all reviews, overrides, submissions, and approvals across 4 governance tiers
            </p>
          </div>
          <button className="group-btn-outline" style={{ fontSize: '0.8rem' }}>
            <Download size={14} /> Export Audit Log CSV
          </button>
        </div>

        <div className="group-table-container">
          <table className="group-table">
            <thead>
              <tr>
                <th>Timestamp (IST)</th>
                <th>Authority / Actor</th>
                <th>Governed Entity</th>
                <th>Action Executed</th>
                <th style={{ textAlign: 'right' }}>SHA-256 Ledger Hash</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{log.timestamp}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{log.actor}</span>
                  </td>
                  <td><span style={{ fontWeight: 600, color: '#334155' }}>{log.entity}</span></td>
                  <td>
                    <span className="group-badge-indigo">{log.action}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748B', background: '#F8FAFC', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {log.hash}
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
