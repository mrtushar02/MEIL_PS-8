import React, { useState } from 'react';
import {
  Send,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  Download,
  Eye
} from 'lucide-react';
import { INITIAL_SUBMISSIONS } from '../csrData';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function CSRSubmissionsScreen({ onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState(null);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [newSub, setNewSub] = useState({
    module: 'CSR Projects',
    scope: 'Hyderabad Rural Water Supply Phase 2',
    period: 'FY 2024-25 Q3',
    submitted_by: 'CSR Field Lead',
    remarks: 'Field telemetry and beneficiary records audited'
  });

  const handleExportCsv = () => {
    exportToCsv('MEIL_CSR_Submissions.csv', submissions.map(s => ({
      Submission_ID: s.id,
      Module: s.module,
      Scope: s.scope,
      Period: s.period,
      Submitted_By: s.submitted_by,
      Submission_Date: s.date,
      Status: s.status,
      Reviewer: s.reviewer,
      Approver: s.approver,
      Remarks: s.remarks || ''
    })));
  };

  const handleCreateSubmission = (e) => {
    e.preventDefault();
    const created = {
      id: `SUB-CSR-2025-${String(submissions.length + 1).padStart(3, '0')}`,
      module: newSub.module,
      scope: newSub.scope,
      period: newSub.period,
      submitted_by: newSub.submitted_by,
      date: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      reviewer: 'Regional CSR Lead',
      approver: 'Head of CSR (HQ)',
      remarks: newSub.remarks || 'Standard quarterly CSR impact dossier'
    };
    setSubmissions([created, ...submissions]);
    setIsCreateOpen(false);
  };

  const handleStatusUpdate = (subId, newStatus) => {
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: newStatus } : s));
    if (selectedSubmission && selectedSubmission.id === subId) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
    }
  };

  const handleFixResubmit = (e) => {
    e.preventDefault();
    if (!correctionTarget) return;
    setSubmissions(prev => prev.map(s => s.id === correctionTarget.id ? {
      ...s,
      status: 'Submitted',
      remarks: `[Corrected]: ${correctionNotes || 'Data discrepancies reconciled'}`
    } : s));
    setCorrectionTarget(null);
    setCorrectionNotes('');
  };

  const filteredSubmissions = submissions.filter((s) =>
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusChip = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'csr-status-chip approved';
      case 'under review':
        return 'csr-status-chip pending';
      case 'correction required':
        return 'csr-status-chip correction-required';
      case 'submitted':
        return 'csr-status-chip submitted';
      default:
        return 'csr-status-chip draft';
    }
  };

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Send size={24} />
            </div>
            <div>
              <div className="csr-pill-tag">GOVERNANCE & APPROVALS</div>
              <h1 className="csr-hero-title">Submissions</h1>
              <p className="csr-hero-subtitle">
                All Projects • All Submission Types • All Statuses
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <button className="csr-btn-outline" onClick={handleExportCsv} title="Export Submissions to CSV">
              <Download size={15} />
              Export CSV
            </button>
            <button className="csr-btn-primary" onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} />
              + Create Submission
            </button>
          </div>
        </div>
      </div>

      {/* ──── 5 KPI STATS ROW ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Submissions</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{submissions.length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Submitted / Pending</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>{submissions.filter(s => s.status?.toLowerCase() === 'submitted').length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Under Review</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>{submissions.filter(s => s.status?.toLowerCase() === 'under review').length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCheck2 size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Approved</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>{submissions.filter(s => s.status?.toLowerCase() === 'approved').length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Correction Required</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#EA580C', marginTop: '2px' }}>{submissions.filter(s => s.status?.toLowerCase().includes('correction')).length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(234, 88, 12, 0.1)', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={18} />
          </div>
        </div>
      </div>

      {/* ──── SEARCH BAR ──── */}
      <div className="csr-filter-bar">
        <div className="csr-search-box">
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            className="csr-search-input"
            placeholder="Search submissions, modules, scopes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ──── SUBMISSIONS TABLE ──── */}
      <div className="csr-table-container">
        <table className="csr-table">
          <thead>
            <tr>
              <th>Submission ID</th>
              <th>Module</th>
              <th>Project / Scope</th>
              <th>Period</th>
              <th>Submitted By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 700, color: '#2563EB' }}>{s.id}</td>
                <td style={{ fontWeight: 700, color: '#0F172A' }}>{s.module}</td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{s.scope}</span>
                </td>
                <td style={{ fontSize: '12px', color: '#475569' }}>{s.period}</td>
                <td style={{ fontSize: '12.5px', color: '#1E293B' }}>{s.submitted_by}</td>
                <td style={{ fontSize: '12px', color: '#64748B' }}>{s.date}</td>
                <td>
                  <span className={getStatusChip(s.status)}>{s.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="csr-btn-outline"
                      style={{ padding: '4px 8px' }}
                      title="View Details"
                      onClick={() => setSelectedSubmission(s)}
                    >
                      <Eye size={13} />
                    </button>
                    {s.status === 'Correction Required' && (
                      <button
                        className="csr-btn-primary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        title="Fix & Resubmit"
                        onClick={() => setCorrectionTarget(s)}
                      >
                        Fix
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE SUBMISSION MODAL */}
      {isCreateOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Create CSR Submission</h3>
            <form onSubmit={handleCreateSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Module Scope</label>
                <select
                  value={newSub.module}
                  onChange={e => setNewSub({ ...newSub, module: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                >
                  <option value="CSR Projects">CSR Projects</option>
                  <option value="Beneficiary Demographics">Beneficiary Demographics</option>
                  <option value="Social Impact Assessment">Social Impact Assessment</option>
                  <option value="Stakeholder Engagement">Stakeholder Engagement</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Project / Scope Target</label>
                <input
                  type="text"
                  value={newSub.scope}
                  onChange={e => setNewSub({ ...newSub, scope: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Reporting Period</label>
                <input
                  type="text"
                  value={newSub.period}
                  onChange={e => setNewSub({ ...newSub, period: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Audit & Verification Remarks</label>
                <textarea
                  rows={3}
                  value={newSub.remarks}
                  onChange={e => setNewSub({ ...newSub, remarks: e.target.value })}
                  placeholder="Summarize evidence links, telemetry status..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" className="csr-btn-secondary" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                <button type="submit" className="csr-btn-primary">Submit Dossier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW SUBMISSION MODAL */}
      {selectedSubmission && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 520, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className={getStatusChip(selectedSubmission.status)}>{selectedSubmission.status}</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedSubmission.id}</h3>
              </div>
              <button onClick={() => setSelectedSubmission(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Module:</strong> {selectedSubmission.module}</div>
              <div><strong>Period:</strong> {selectedSubmission.period}</div>
              <div><strong>Submitted By:</strong> {selectedSubmission.submitted_by}</div>
              <div><strong>Date:</strong> {selectedSubmission.date}</div>
              <div><strong>Reviewer:</strong> {selectedSubmission.reviewer}</div>
              <div><strong>Approver:</strong> {selectedSubmission.approver}</div>
            </div>
            <div style={{ marginTop: 14, fontSize: '13px', color: '#475569' }}>
              <strong>Scope Target:</strong> {selectedSubmission.scope}
            </div>
            {selectedSubmission.remarks && (
              <div style={{ marginTop: 8, fontSize: '13px', color: '#475569' }}>
                <strong>Remarks:</strong> {selectedSubmission.remarks}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="csr-btn-secondary"
                style={{ color: '#EA580C', borderColor: '#FED7AA' }}
                onClick={() => handleStatusUpdate(selectedSubmission.id, 'Correction Required')}
              >
                Request Correction
              </button>
              <button
                type="button"
                className="csr-btn-primary"
                style={{ background: '#16A34A', borderColor: '#16A34A' }}
                onClick={() => handleStatusUpdate(selectedSubmission.id, 'Approved')}
              >
                Approve Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORRECTION WORKBENCH MODAL */}
      {correctionTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Correction Workbench</h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 16 }}>
              Resolving audit findings for <strong>{correctionTarget.id}</strong> ({correctionTarget.scope})
            </p>
            <form onSubmit={handleFixResubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Resolution & Reconciliation Notes</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the corrections made to beneficiary headcounts or social audit numbers..."
                  value={correctionNotes}
                  onChange={e => setCorrectionNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 12 }}>
                <button type="button" className="csr-btn-secondary" onClick={() => setCorrectionTarget(null)}>Cancel</button>
                <button type="submit" className="csr-btn-primary">Resubmit for Approval</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
