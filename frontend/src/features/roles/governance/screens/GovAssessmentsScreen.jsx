import React, { useState } from 'react';
import {
  FileCheck,
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

export default function GovAssessmentsScreen({
  assessments = [],
  onOpenStartAssessment,
  onNavigateTab
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [localAssessments, setLocalAssessments] = useState(assessments);
  const [newAssess, setNewAssess] = useState({
    title: 'ISO 37001 Anti-Bribery Surveillance',
    scope: 'All Project Sites & Joint Ventures',
    assessor: 'KPMG India Risk Advisory',
    coverage: '100% Operational Sites',
    findings: 0
  });

  React.useEffect(() => {
    if (assessments && assessments.length > 0) {
      setLocalAssessments(assessments);
    }
  }, [assessments]);

  const handleExport = () => {
    const rows = localAssessments.map(a => ({
      ID: a.id,
      Title: a.title,
      Scope: a.scope,
      Assessor: a.assessor,
      Date: a.date,
      Status: a.status,
      Findings: a.findings,
      Coverage: a.coverage,
      NextReview: a.nextReview
    }));
    exportToCsv('MEIL_Governance_Assessments', rows);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `ASM-${Date.now().toString().slice(-4)}`,
      title: newAssess.title,
      scope: newAssess.scope,
      assessor: newAssess.assessor,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'In Progress',
      findings: Number(newAssess.findings) || 0,
      coverage: newAssess.coverage,
      nextReview: '31 Mar 2027'
    };
    setLocalAssessments([created, ...localAssessments]);
    setIsCreateOpen(false);
  };

  const filtered = localAssessments.filter(a => {
    return statusFilter === 'all' || a.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Compliance Assessments</h1>
            <p>Perform periodic compliance assessments and record findings.</p>
          </div>
          <div className="gov-header-controls">
            <select className="gov-select-pill" defaultValue="all">
              <option value="all">All Assessments</option>
              <option value="internal">Internal Audits</option>
              <option value="external">External Audits</option>
            </select>
            <select className="gov-select-pill" defaultValue="fy26">
              <option value="fy26">FY 2026-27</option>
              <option value="fy25">FY 2025-26</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="under-review">Under Review</option>
              <option value="planned">Planned</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenStartAssessment || (() => setIsCreateOpen(true))}
            >
              <Plus size={15} />
              Start Assessment
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExport}
              title="Export Assessments to CSV"
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
            <span className="gov-kpi-label">Total Assessments</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <FileCheck size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">16</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Completed</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-green">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#16A34A' }}>10</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">In Progress</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-amber">
              <Clock size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#D97706' }}>4</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Findings</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-red">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#DC2626' }}>8</span>
          </div>
        </div>
      </div>

      {/* ──── ASSESSMENTS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Assessment ID</th>
                <th>Scope</th>
                <th>Category</th>
                <th>Assessor</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Findings</th>
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
                    {item.scope}
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#F1F5F9', 
                      fontSize: '12px',
                      color: '#475569' 
                    }}>
                      {item.assessor}
                    </span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ 
                      fontWeight: 700, 
                      color: item.findings > 0 ? '#DC2626' : '#16A34A',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: item.findings > 0 ? 'rgba(220, 38, 38, 0.08)' : 'rgba(22, 163, 74, 0.08)'
                    }}>
                      {item.findings}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Assessment"
                      onClick={() => setSelectedAssessment(item)}
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
          <span>Showing 1 to {filtered.length} of {localAssessments.length} assessments</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled><ChevronLeft size={14} /></button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedAssessment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 500, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className={`gov-status-chip gov-status-${selectedAssessment.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedAssessment.status}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedAssessment.id} - {selectedAssessment.title}</h3>
              </div>
              <button onClick={() => setSelectedAssessment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Assessor:</strong> {selectedAssessment.assessor}</div>
              <div><strong>Date:</strong> {selectedAssessment.date}</div>
              <div><strong>Coverage:</strong> {selectedAssessment.coverage}</div>
              <div><strong>Next Review:</strong> {selectedAssessment.nextReview}</div>
              <div><strong>Findings:</strong> <span style={{ color: selectedAssessment.findings > 0 ? '#DC2626' : '#16A34A', fontWeight: 700 }}>{selectedAssessment.findings} non-conformances</span></div>
              <div><strong>Scope:</strong> {selectedAssessment.scope}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => setSelectedAssessment(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="gov-btn gov-btn-primary"
                onClick={() => {
                  alert ? null : null;
                  setSelectedAssessment(null);
                }}
              >
                Download Audit Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ASSESSMENT MODAL */}
      {isCreateOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Start Compliance Assessment</h3>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Assessment Title</label>
                <input
                  type="text"
                  required
                  value={newAssess.title}
                  onChange={e => setNewAssess({ ...newAssess, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Scope / Facilities</label>
                <input
                  type="text"
                  required
                  value={newAssess.scope}
                  onChange={e => setNewAssess({ ...newAssess, scope: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Lead Assessor</label>
                <input
                  type="text"
                  required
                  value={newAssess.assessor}
                  onChange={e => setNewAssess({ ...newAssess, assessor: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 12 }}>
                <button type="button" className="gov-btn gov-btn-outline" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                <button type="submit" className="gov-btn gov-btn-primary">Initiate Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
