import React from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

export default function AdminReportsScreen() {
  const reports = [
    { id: '1', name: 'User Directory & Scope Audit Report', type: 'System', date: '29 Sep 2026', period: 'FY 2025-26', status: 'Completed', format: 'PDF / CSV' },
    { id: '2', name: 'Role & Permission Matrix Authorization Summary', type: 'Security', date: '29 Sep 2026', period: 'Permanent', status: 'Completed', format: 'PDF' },
    { id: '3', name: 'Group Organization Structure & Project Allocation', type: 'Organization', date: '28 Sep 2026', period: 'FY 2025-26', status: 'Completed', format: 'PDF / XLSX' },
    { id: '4', name: 'Site Project Environmental Readiness Index', type: 'Operations', date: '28 Sep 2026', period: 'Q2 FY26', status: 'Completed', format: 'PDF' },
    { id: '5', name: 'Cryptographic Audit Trail WORM Export Manifest', type: 'Regulatory', date: '27 Sep 2026', period: 'September 2025', status: 'Completed', format: 'JSON-LD' },
    { id: '6', name: 'Platform Operational Health & Telemetry Benchmark', type: 'Operations', date: '27 Sep 2026', period: 'Trailing 30D', status: 'Completed', format: 'PDF' }
  ];

  const handleDownload = (report) => {
    // Generate synthetic download for verified administrative summary
    const content = `MEIL ESG ENTERPRISE REPORT\nTitle: ${report.name}\nType: ${report.type}\nPeriod: ${report.period}\nGenerated: ${report.date}\nStatus: Cryptographically Verified\nIssuer: System Super Administrator`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-reports-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Administrative Reports</h2>
          <p>Generate, verify, and export authoritative system-level administrative reports</p>
        </div>

        <div className="admin-actions-group">
          <button type="button" className="admin-btn admin-btn-primary">
            <Plus size={14} /> Generate Report
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Category</th>
              <th>Generated Date</th>
              <th>Reporting Period</th>
              <th>Format</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={15} color="#2563EB" />
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>{r.name}</span>
                  </div>
                </td>
                <td><span className="admin-badge admin-badge-purple">{r.type}</span></td>
                <td>{r.date}</td>
                <td><strong>{r.period}</strong></td>
                <td><code>{r.format}</code></td>
                <td><span className="admin-badge admin-badge-success">{r.status}</span></td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    type="button" 
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                    onClick={() => handleDownload(r)}
                  >
                    <Download size={12} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
