import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers,
  X 
} from 'lucide-react';
import { exportToCsv } from '../../../utils/exportUtils';
import esgStore from '../../../services/esgStore';

export default function AdminReportsScreen() {
  const [reports, setReports] = useState([
    { id: '1', name: 'User Directory & Scope Audit Report', type: 'System', date: '29 Sep 2026', period: 'FY 2025-26', status: 'Completed', format: 'PDF / CSV' },
    { id: '2', name: 'Role & Permission Matrix Authorization Summary', type: 'Security', date: '29 Sep 2026', period: 'Permanent', status: 'Completed', format: 'PDF' },
    { id: '3', name: 'Group Organization Structure & Project Allocation', type: 'Organization', date: '28 Sep 2026', period: 'FY 2025-26', status: 'Completed', format: 'PDF / XLSX' },
    { id: '4', name: 'Site Project Environmental Readiness Index', type: 'Operations', date: '28 Sep 2026', period: 'Q2 FY26', status: 'Completed', format: 'PDF' },
    { id: '5', name: 'Cryptographic Audit Trail WORM Export Manifest', type: 'Regulatory', date: '27 Sep 2026', period: 'September 2025', status: 'Completed', format: 'JSON-LD' },
    { id: '6', name: 'Platform Operational Health & Telemetry Benchmark', type: 'Operations', date: '27 Sep 2026', period: 'Trailing 30D', status: 'Completed', format: 'PDF' }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [newReportName, setNewReportName] = useState('');
  const [newReportType, setNewReportType] = useState('Regulatory');
  const [newPeriod, setNewPeriod] = useState('FY 2025-26');

  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!newReportName.trim()) return;
    const newRep = {
      id: String(reports.length + 1),
      name: newReportName.trim(),
      type: newReportType,
      date: '07 Oct 2026',
      period: newPeriod,
      status: 'Completed',
      format: 'PDF / CSV'
    };
    setReports([newRep, ...reports]);
    esgStore.addAuditLog('ADMIN_REPORT_GENERATED', `Generated administrative report: ${newRep.name}`, 'ADMIN');
    setIsGenerating(false);
    setNewReportName('');
  };

  const handleDownload = (report) => {
    exportToCsv(`${report.name.replace(/\s+/g, '_')}.csv`, [
      {
        'Report Name': report.name,
        'Category': report.type,
        'Period': report.period,
        'Generated Date': report.date,
        'Status': 'Cryptographically Verified',
        'Issuer': 'System Super Administrator',
        'Cryptographic Signature': 'sha256:91bf...42a'
      }
    ]);
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
          <button 
            type="button" 
            className="admin-btn admin-btn-primary"
            onClick={() => setIsGenerating(true)}
          >
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

      {isGenerating && (
        <div className="admin-modal-overlay" onClick={() => setIsGenerating(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#2563EB" />
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Generate Administrative Report
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsGenerating(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleGenerateReport}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Report Title
                  </label>
                  <input 
                    type="text" 
                    value={newReportName} 
                    onChange={e => setNewReportName(e.target.value)} 
                    placeholder="e.g., Q3 Consolidated Carbon Footprint Dossier"
                    required 
                    className="admin-search-input"
                    style={{ width: '100%', height: '38px', borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0 12px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                      Category
                    </label>
                    <select 
                      value={newReportType} 
                      onChange={e => setNewReportType(e.target.value)}
                      className="admin-select"
                      style={{ width: '100%', height: '38px' }}
                    >
                      <option value="Regulatory">Regulatory</option>
                      <option value="Security">Security</option>
                      <option value="Operations">Operations</option>
                      <option value="Organization">Organization</option>
                      <option value="System">System</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                      Reporting Period
                    </label>
                    <input 
                      type="text" 
                      value={newPeriod} 
                      onChange={e => setNewPeriod(e.target.value)}
                      className="admin-search-input"
                      style={{ width: '100%', height: '38px', borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0 12px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsGenerating(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn admin-btn-primary"
                >
                  Compile & Seal Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
