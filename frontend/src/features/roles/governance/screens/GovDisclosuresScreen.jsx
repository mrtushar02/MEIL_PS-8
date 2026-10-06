import React, { useState } from 'react';
import {
  Plus,
  FileText,
  Eye,
  ChevronRight,
  ChevronLeft,
  Download,
  CheckCircle2
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function GovDisclosuresScreen({
  disclosures = [],
  onOpenCreateRecord,
  onNavigateTab
}) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [scopeFilter, setScopeFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [localDisclosures, setLocalDisclosures] = useState(disclosures);
  const [newRec, setNewRec] = useState({
    type: 'Board Committee Charter Review',
    scope: 'Board',
    period: 'FY 2026-27 Q2',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  });

  React.useEffect(() => {
    if (disclosures && disclosures.length > 0) {
      setLocalDisclosures(disclosures);
    }
  }, [disclosures]);

  const handleExport = () => {
    const rows = localDisclosures.map(d => ({
      ID: d.id,
      Type: d.type,
      Scope: d.scope,
      Period: d.period,
      Date: d.date,
      Status: d.status,
      Approval: d.approval
    }));
    exportToCsv('MEIL_Corporate_Disclosures', rows);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `DSC-GOV-${Date.now().toString().slice(-4)}`,
      type: newRec.type,
      scope: newRec.scope,
      period: newRec.period,
      date: newRec.date,
      status: 'Published',
      approval: 'Approved'
    };
    setLocalDisclosures([created, ...localDisclosures]);
    setIsCreateOpen(false);
  };

  const handleApprove = (id) => {
    setLocalDisclosures(prev => prev.map(d => d.id === id ? { ...d, approval: 'Approved', status: 'Published' } : d));
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord({ ...selectedRecord, approval: 'Approved', status: 'Published' });
    }
  };

  const filtered = localDisclosures.filter(d => {
    const matchesType = typeFilter === 'all' || d.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesScope = scopeFilter === 'all' || d.scope.toLowerCase() === scopeFilter.toLowerCase();
    return matchesType && matchesScope;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Disclosures & Governance Records</h1>
            <p>Manage governance disclosures, certifications and records.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="board">Board Meeting Record</option>
              <option value="related party">Related Party Disclosure</option>
              <option value="governance">Governance</option>
              <option value="esg">ESG/BRSR Governance</option>
              <option value="ethics">Ethics Program Report</option>
            </select>
            <select 
              className="gov-select-pill"
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
            >
              <option value="all">Scope</option>
              <option value="board">Board</option>
              <option value="group">Group</option>
            </select>
            <select className="gov-select-pill" defaultValue="fy26">
              <option value="fy26">Period (FY 2026-27)</option>
              <option value="fy25">FY 2025-26</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenCreateRecord || (() => setIsCreateOpen(true))}
            >
              <Plus size={15} />
              Create Record
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExport}
              title="Export Disclosures to CSV"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ──── DISCLOSURES TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Type</th>
                <th>Scope</th>
                <th>Period</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Approval</th>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={15} style={{ color: '#2563EB', flexShrink: 0 }} />
                      <span>{item.type}</span>
                    </div>
                  </td>
                  <td>{item.scope}</td>
                  <td>{item.period}</td>
                  <td>{item.owner}</td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#F1F5F9', 
                      fontSize: '12px',
                      color: '#475569' 
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.approval.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.approval}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Disclosure"
                      onClick={() => setSelectedRecord(item)}
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
          <span>Showing 1 to {filtered.length} of {localDisclosures.length} records</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled><ChevronLeft size={14} /></button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* VIEW DISCLOSURE MODAL */}
      {selectedRecord && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 500, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className={`gov-status-chip gov-status-${selectedRecord.approval.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedRecord.approval}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedRecord.id}</h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Type:</strong> {selectedRecord.type}</div>
              <div><strong>Scope:</strong> {selectedRecord.scope}</div>
              <div><strong>Period:</strong> {selectedRecord.period}</div>
              <div><strong>Date:</strong> {selectedRecord.date}</div>
              <div><strong>Status:</strong> {selectedRecord.status}</div>
              <div><strong>Approval:</strong> {selectedRecord.approval}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
              {selectedRecord.approval !== 'Approved' && (
                <button
                  type="button"
                  className="gov-btn gov-btn-primary"
                  onClick={() => handleApprove(selectedRecord.id)}
                >
                  <CheckCircle2 size={14} style={{ marginRight: 4 }} />
                  Approve Disclosure
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE DISCLOSURE MODAL */}
      {isCreateOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Create Disclosure Record</h3>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Disclosure Type</label>
                <input
                  type="text"
                  required
                  value={newRec.type}
                  onChange={e => setNewRec({ ...newRec, type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Scope</label>
                  <select
                    value={newRec.scope}
                    onChange={e => setNewRec({ ...newRec, scope: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  >
                    <option value="Board">Board</option>
                    <option value="Group">Group</option>
                    <option value="Subsidiaries">Subsidiaries</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Reporting Period</label>
                  <input
                    type="text"
                    required
                    value={newRec.period}
                    onChange={e => setNewRec({ ...newRec, period: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 12 }}>
                <button type="button" className="gov-btn gov-btn-outline" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                <button type="submit" className="gov-btn gov-btn-primary">Register Disclosure</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
