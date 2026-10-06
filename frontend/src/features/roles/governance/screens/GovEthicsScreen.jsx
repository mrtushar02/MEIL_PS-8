import React, { useState } from 'react';
import {
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  Hourglass,
  Eye,
  ChevronRight,
  ChevronLeft,
  Download,
  ShieldAlert
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function GovEthicsScreen({
  cases = [],
  onOpenRegisterCase,
  onNavigateTab
}) {
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sevFilter, setSevFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [localCases, setLocalCases] = useState(cases);
  const [newCase, setNewCase] = useState({
    category: 'Whistleblower',
    severity: 'High',
    scope: 'Supply Chain Operations',
    description: 'Anonymous report regarding procurement bid evaluation protocol'
  });

  React.useEffect(() => {
    if (cases && cases.length > 0) {
      setLocalCases(cases);
    }
  }, [cases]);

  const handleExport = () => {
    const rows = localCases.map(c => ({
      ID: c.id,
      Category: c.category,
      Severity: c.severity,
      Scope: c.scope,
      Status: c.status,
      Owner: c.owner,
      DueDate: c.dueDate,
      Resolution: c.resolution
    }));
    exportToCsv('MEIL_Ethics_and_Conduct_Registry', rows);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `ETH-${Date.now().toString().slice(-4)}`,
      category: newCase.category,
      severity: newCase.severity,
      scope: newCase.scope,
      description: newCase.description,
      owner: 'Ethics Officer',
      dueDate: '15 Nov 2026',
      status: 'Investigation',
      resolution: 'Ombudsman investigation initiated under Whistleblower Charter'
    };
    setLocalCases([created, ...localCases]);
    setIsRegisterOpen(false);
  };

  const handleResolveCase = (id) => {
    setLocalCases(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved', resolution: 'Investigation concluded with corrective action.' } : c));
    if (selectedCase && selectedCase.id === id) {
      setSelectedCase({ ...selectedCase, status: 'Resolved', resolution: 'Investigation concluded with corrective action.' });
    }
  };

  const filtered = localCases.filter(c => {
    const matchesCat = catFilter === 'all' || c.category.toLowerCase().includes(catFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    const matchesSev = sevFilter === 'all' || c.severity.toLowerCase() === sevFilter.toLowerCase();
    return matchesCat && matchesStatus && matchesSev;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Ethics & Conduct</h1>
            <p>Manage ethics cases, whistleblower reports and conduct matters.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="whistleblower">Whistleblower</option>
              <option value="conflict of interest">Conflict of Interest</option>
              <option value="fraud">Fraud</option>
              <option value="misconduct">Misconduct</option>
              <option value="policy violation">Policy Violation</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="under-review">Under Review</option>
              <option value="investigation">Investigation</option>
              <option value="action-required">Action Required</option>
              <option value="resolved">Resolved</option>
            </select>
            <select 
              className="gov-select-pill"
              value={sevFilter}
              onChange={(e) => setSevFilter(e.target.value)}
            >
              <option value="all">Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenRegisterCase || (() => setIsRegisterOpen(true))}
            >
              <Plus size={15} />
              Register Case
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExport}
              title="Export Ethics Cases to CSV"
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
            <span className="gov-kpi-label">Open Cases</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-purple">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">6</span>
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
            <span className="gov-kpi-value" style={{ color: '#D97706' }}>4</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Resolved</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-green">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#16A34A' }}>12</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Average Resolution</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <Hourglass size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">18 days</span>
          </div>
        </div>
      </div>

      {/* ──── ETHICS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Category</th>
                <th>Date</th>
                <th>Severity</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Status</th>
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
                    {item.category}
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`gov-priority-chip gov-priority-${item.severity.toLowerCase()}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#F1F5F9', 
                      fontSize: '12px',
                      color: '#475569' 
                    }}>
                      {item.owner}
                    </span>
                  </td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Confidential Case Details"
                      onClick={() => setSelectedCase(item)}
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
          <span>Showing 1 to {filtered.length} of {localCases.length} cases</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled><ChevronLeft size={14} /></button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* CONFIDENTIAL CASE MODAL */}
      {selectedCase && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 520, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className={`gov-status-chip gov-status-${selectedCase.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedCase.status}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedCase.id} - {selectedCase.category}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Category:</strong> {selectedCase.category}</div>
              <div><strong>Severity:</strong> <span style={{ color: selectedCase.severity === 'Critical' ? '#DC2626' : '#D97706', fontWeight: 700 }}>{selectedCase.severity}</span></div>
              <div><strong>Investigator:</strong> {selectedCase.owner}</div>
              <div><strong>Due Date:</strong> {selectedCase.dueDate}</div>
              <div><strong>Scope:</strong> {selectedCase.scope}</div>
              <div><strong>Status:</strong> {selectedCase.status}</div>
            </div>
            <div style={{ marginTop: 14, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
              <strong>Description:</strong> {selectedCase.description}
            </div>
            {selectedCase.resolution && (
              <div style={{ marginTop: 10, fontSize: '13px', color: '#166534', background: '#F0FDF4', padding: 10, borderRadius: 8 }}>
                <strong>Resolution Protocol:</strong> {selectedCase.resolution}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => setSelectedCase(null)}
              >
                Close
              </button>
              {selectedCase.status !== 'Resolved' && (
                <button
                  type="button"
                  className="gov-btn gov-btn-primary"
                  onClick={() => handleResolveCase(selectedCase.id)}
                >
                  <CheckCircle2 size={14} style={{ marginRight: 4 }} />
                  Resolve Case
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REGISTER ETHICS CASE MODAL */}
      {isRegisterOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Register Ethics / Whistleblower Case</h3>
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Category</label>
                <select
                  value={newCase.category}
                  onChange={e => setNewCase({ ...newCase, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                >
                  <option value="Whistleblower">Whistleblower</option>
                  <option value="Conflict of Interest">Conflict of Interest</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Misconduct">Misconduct</option>
                  <option value="Policy Violation">Policy Violation</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Severity</label>
                  <select
                    value={newCase.severity}
                    onChange={e => setNewCase({ ...newCase, severity: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Scope / Division</label>
                  <input
                    type="text"
                    required
                    value={newCase.scope}
                    onChange={e => setNewCase({ ...newCase, scope: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Confidential Allegation / Details</label>
                <textarea
                  rows={4}
                  required
                  value={newCase.description}
                  onChange={e => setNewCase({ ...newCase, description: e.target.value })}
                  placeholder="Detail the report while preserving ombudsman confidentiality..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 12 }}>
                <button type="button" className="gov-btn gov-btn-outline" onClick={() => setIsRegisterOpen(false)}>Cancel</button>
                <button type="submit" className="gov-btn gov-btn-primary">File Confidential Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
