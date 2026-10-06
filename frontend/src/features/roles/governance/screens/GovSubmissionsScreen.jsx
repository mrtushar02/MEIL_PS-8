import React, { useState } from 'react';
import {
  Send,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  ChevronRight,
  ChevronLeft,
  Download
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function GovSubmissionsScreen({
  submissions = [],
  onOpenCreateSubmission,
  onNavigateTab
}) {
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSub, setSelectedSub] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [localSubmissions, setLocalSubmissions] = useState(submissions);
  const [newSub, setNewSub] = useState({
    module: 'Policies',
    scope: 'Group Level',
    period: 'FY 2026-27 Q2',
    remarks: 'Statutory board approved dossier'
  });

  React.useEffect(() => {
    if (submissions && submissions.length > 0) {
      setLocalSubmissions(submissions);
    }
  }, [submissions]);

  const handleExport = () => {
    const rows = localSubmissions.map(s => ({
      ID: s.id,
      Module: s.module,
      Scope: s.scope,
      Period: s.period,
      Status: s.status,
      SubmittedBy: s.submittedBy,
      Reviewer: s.reviewer,
      LastUpdated: s.lastUpdated
    }));
    exportToCsv('MEIL_Governance_Submissions', rows);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `SUB-GOV-${Date.now().toString().slice(-4)}`,
      module: newSub.module,
      scope: newSub.scope,
      period: newSub.period,
      status: 'Submitted',
      submittedBy: 'Adv. S. K. Nair',
      reviewer: 'Head of Legal & Compliance',
      lastUpdated: 'Just now'
    };
    setLocalSubmissions([created, ...localSubmissions]);
    setIsCreateOpen(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setLocalSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub({ ...selectedSub, status: newStatus });
    }
  };

  const filtered = localSubmissions.filter(s => {
    const matchesMod = moduleFilter === 'all' || s.module.toLowerCase() === moduleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || s.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    return matchesMod && matchesStatus;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Submissions</h1>
            <p>Create and manage governance submissions.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="all">All Modules</option>
              <option value="policies">Policies</option>
              <option value="compliance">Compliance</option>
              <option value="ethics">Ethics</option>
              <option value="disclosures">Disclosures</option>
              <option value="brsr mapping">BRSR Mapping</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="approved">Approved</option>
              <option value="under-review">Under Review</option>
              <option value="correction-required">Correction Required</option>
            </select>
            <select className="gov-select-pill" defaultValue="fy26">
              <option value="fy26">Period (FY 2026-27)</option>
              <option value="fy25">FY 2025-26</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenCreateSubmission || (() => setIsCreateOpen(true))}
            >
              <Plus size={15} />
              Create Submission
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExport}
              title="Export Submissions to CSV"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ──── 4 KPI CARDS ──── */}
      <div className="gov-kpi-grid-4">
        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Total Submissions</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <Send size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">12</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Approved</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-green">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#16A34A' }}>4</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Under Review</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-amber">
              <Clock size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#D97706' }}>6</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Correction Required</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-red">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#DC2626' }}>2</span>
          </div>
        </div>
      </div>

      {/* ──── SUBMISSIONS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Submission ID</th>
                <th>Module</th>
                <th>Scope</th>
                <th>Period</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="gov-table-code">{item.id}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>
                    {item.module}
                  </td>
                  <td>{item.scope}</td>
                  <td>{item.period}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.lastUpdated}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Submission"
                      onClick={() => setSelectedSub(item)}
                    >
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ──── PAGINATION ROW ──── */}
        <div className="gov-pagination-row">
          <span>Showing 1 to {filtered.length} of {localSubmissions.length} submissions</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled><ChevronLeft size={14} /></button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* VIEW SUBMISSION MODAL */}
      {selectedSub && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 500, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className={`gov-status-chip gov-status-${selectedSub.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedSub.status}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedSub.id}</h3>
              </div>
              <button onClick={() => setSelectedSub(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Module:</strong> {selectedSub.module}</div>
              <div><strong>Scope:</strong> {selectedSub.scope}</div>
              <div><strong>Period:</strong> {selectedSub.period}</div>
              <div><strong>Last Updated:</strong> {selectedSub.lastUpdated}</div>
              <div><strong>Submitted By:</strong> {selectedSub.submittedBy}</div>
              <div><strong>Reviewer:</strong> {selectedSub.reviewer}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                style={{ color: '#EA580C', borderColor: '#FED7AA' }}
                onClick={() => handleStatusChange(selectedSub.id, 'Correction Required')}
              >
                Request Correction
              </button>
              <button
                type="button"
                className="gov-btn gov-btn-primary"
                style={{ background: '#16A34A', borderColor: '#16A34A' }}
                onClick={() => handleStatusChange(selectedSub.id, 'Approved')}
              >
                Approve Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SUBMISSION MODAL */}
      {isCreateOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Create Governance Submission</h3>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Module Scope</label>
                <select
                  value={newSub.module}
                  onChange={e => setNewSub({ ...newSub, module: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                >
                  <option value="Policies">Policies</option>
                  <option value="Compliance Obligations">Compliance Obligations</option>
                  <option value="Internal Controls">Internal Controls</option>
                  <option value="Ethics & Vigil Mechanism">Ethics & Vigil Mechanism</option>
                  <option value="Statutory Disclosures">Statutory Disclosures</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Scope Target</label>
                <input
                  type="text"
                  required
                  value={newSub.scope}
                  onChange={e => setNewSub({ ...newSub, scope: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Reporting Period</label>
                <input
                  type="text"
                  required
                  value={newSub.period}
                  onChange={e => setNewSub({ ...newSub, period: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 12 }}>
                <button type="button" className="gov-btn gov-btn-outline" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                <button type="submit" className="gov-btn gov-btn-primary">Submit Governance Pack</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
