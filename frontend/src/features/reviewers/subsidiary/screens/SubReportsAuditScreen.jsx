import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, ShieldCheck, History, ArrowDownToLine, Eye, Printer, FileSpreadsheet } from 'lucide-react';

export default function SubReportsAuditScreen() {
  const [activeTab, setActiveTab] = useState('reports');

  const reports = [
    {
      id: 'REP-SUB-01',
      title: 'SEBI BRSR Core Subsidiary Dossier FY25 Q2',
      format: 'PDF + XBRL',
      size: '12.4 MB',
      status: 'Generated & Signed',
      generatedDate: '28 Oct 2024 16:30 IST',
      description: 'Comprehensive 9-principle BRSR Core report covering all 6 Business Units with SEBI Annexure I & II formatting.'
    },
    {
      id: 'REP-SUB-02',
      title: 'GHG Inventory Scope 1, Scope 2 & Scope 3 Ledger',
      format: 'Excel / XLSX',
      size: '4.8 MB',
      status: 'Ready for Download',
      generatedDate: '28 Oct 2024 14:15 IST',
      description: 'Emission factor baseline v19 (0.716 kg CO2e/kWh) calculation breakdown across 258 project sites.'
    },
    {
      id: 'REP-SUB-03',
      title: 'Water Withdrawal, Consumption & Discharge Audit',
      format: 'PDF',
      size: '6.1 MB',
      status: 'Ready for Download',
      generatedDate: '27 Oct 2024 11:20 IST',
      description: 'Water stress zone analysis, CGWA compliance, recycled water volume across hydro and infrastructure packages.'
    },
    {
      id: 'REP-SUB-04',
      title: 'Executive ESG Briefing for Subsidiary Board & MD',
      format: 'Presentation / PDF',
      size: '8.9 MB',
      status: 'Approved',
      generatedDate: '26 Oct 2024 18:45 IST',
      description: 'High-level synthesis of safety statistics, decarbonization roadmap, carbon intensity per crore revenue.'
    }
  ];

  const auditLog = [
    { timestamp: '28 Oct 2024 17:10:04', actor: 'V. Krishna (Subsidiary Head)', action: 'Approved Entire Subsidiary Package', target: 'FY25-Q2 Package', hash: 'e83a9...b01' },
    { timestamp: '28 Oct 2024 16:45:12', actor: 'P. Nair (Tunnels BU Coord)', action: 'Submitted BU Package', target: 'Tunnels BU (42 Sites)', hash: 'a12b4...88c' },
    { timestamp: '28 Oct 2024 15:30:00', actor: 'A. Rao (Water BU Coord)', action: 'Uploaded Recalibrated Meter Log', target: 'Kaleshwaram Lift Irrig.', hash: '99f01...d3e' },
    { timestamp: '28 Oct 2024 14:12:44', actor: 'R. Sharma (Energy BU Coord)', action: 'Flagged PM2.5 Exceedance Mitigation', target: 'Thermal Infra Unit 4', hash: '55c32...f4a' },
    { timestamp: '28 Oct 2024 12:00:19', actor: 'K. Patel (Metro BU Coord)', action: 'Closed Near-Miss Safety Flag', target: 'Bengaluru Metro Ph 2A', hash: '33e10...77b' }
  ];

  return (
    <div className="sub-reports-audit-screen">
      {/* Tabs */}
      <div className="sub-card" style={{ marginBottom: '1.25rem', padding: '0.75rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('reports')}
            className={`sub-btn-outline ${activeTab === 'reports' ? 'sub-btn-primary' : ''}`}
            style={{
              borderRadius: '12px',
              padding: '0.45rem 1.2rem',
              fontSize: '0.82rem',
              background: activeTab === 'reports' ? '#7C3AED' : '#FFFFFF',
              color: activeTab === 'reports' ? '#FFFFFF' : '#475569',
              borderColor: activeTab === 'reports' ? '#7C3AED' : '#E2E8F0'
            }}
          >
            <FileText size={14} style={{ marginRight: '0.4rem', display: 'inline' }} />
            Statutory Reports & Dossiers
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`sub-btn-outline ${activeTab === 'audit' ? 'sub-btn-primary' : ''}`}
            style={{
              borderRadius: '12px',
              padding: '0.45rem 1.2rem',
              fontSize: '0.82rem',
              background: activeTab === 'audit' ? '#7C3AED' : '#FFFFFF',
              color: activeTab === 'audit' ? '#FFFFFF' : '#475569',
              borderColor: activeTab === 'audit' ? '#7C3AED' : '#E2E8F0'
            }}
          >
            <History size={14} style={{ marginRight: '0.4rem', display: 'inline' }} />
            Immutable Audit Trail & Signatures
          </button>
        </div>
      </div>

      {activeTab === 'reports' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {reports.map(rep => (
            <div key={rep.id} className="sub-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="sub-badge-purple">{rep.format}</span>
                  <span className="sub-badge-success">{rep.status}</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0.5rem 0' }}>
                  {rep.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                  {rep.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.75rem' }}>
                  Generated: {rep.generatedDate} • {rep.size}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                <button className="sub-btn-primary" style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem', background: '#7C3AED' }}>
                  <Download size={14} /> Download Package
                </button>
                <button className="sub-btn-outline" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }} title="Preview Report">
                  <Eye size={14} />
                </button>
                <button className="sub-btn-outline" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }} title="Print / Export">
                  <Printer size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sub-card">
          <div className="sub-card-header">
            <div>
              <h3 className="sub-card-title">Immutable Verification Ledger</h3>
              <p className="sub-card-subtitle">Cryptographically logged regulatory actions with SHA-256 tamper seals</p>
            </div>
            <span className="sub-badge-purple">
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
              SEBI Compliant Trail
            </span>
          </div>

          <div className="sub-table-container">
            <table className="sub-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Authority / Actor</th>
                  <th>Action Executed</th>
                  <th>Target Package / Site</th>
                  <th style={{ textAlign: 'right' }}>Tamper-Proof Block Hash</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((log, idx) => (
                  <tr key={idx}>
                    <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{log.timestamp}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{log.actor}</span>
                    </td>
                    <td>
                      <span className="sub-badge-purple" style={{ fontSize: '0.75rem' }}>{log.action}</span>
                    </td>
                    <td><span style={{ color: '#334155', fontSize: '0.82rem' }}>{log.target}</span></td>
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
      )}
    </div>
  );
}
