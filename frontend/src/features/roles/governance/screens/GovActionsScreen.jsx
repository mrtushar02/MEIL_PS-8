import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ChevronRight,
  ChevronLeft,
  Download
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function GovActionsScreen({
  actions = [],
  onOpenCreateAction,
  onNavigateTab
}) {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedAction, setSelectedAction] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [localActions, setLocalActions] = useState(actions);
  const [newAct, setNewAct] = useState({
    issue: 'Implement Dual-Signature Approval in Vendor Master',
    source: 'Control Test',
    priority: 'High',
    owner: 'IT & Finance',
    dueDate: '31 Dec 2026'
  });

  React.useEffect(() => {
    if (actions && actions.length > 0) {
      setLocalActions(actions);
    }
  }, [actions]);

  const handleExport = () => {
    const rows = localActions.map(a => ({
      ID: a.id,
      Issue: a.issue,
      Source: a.source,
      Priority: a.priority,
      Owner: a.owner,
      DueDate: a.dueDate,
      Status: a.status,
      Verification: a.verification
    }));
    exportToCsv('MEIL_Governance_Actions', rows);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `ACT-GOV-${Date.now().toString().slice(-4)}`,
      issue: newAct.issue,
      source: newAct.source,
      priority: newAct.priority,
      owner: newAct.owner,
      dueDate: newAct.dueDate,
      status: 'Open',
      verification: 'Pending Review'
    };
    setLocalActions([created, ...localActions]);
    setIsCreateOpen(false);
  };

  const handleCloseAction = (id) => {
    setLocalActions(prev => prev.map(a => a.id === id ? { ...a, status: 'Closed', verification: 'Verified' } : a));
    if (selectedAction && selectedAction.id === id) {
      setSelectedAction({ ...selectedAction, status: 'Closed', verification: 'Verified' });
    }
  };

  const filtered = localActions.filter(a => {
    const matchesSource = sourceFilter === 'all' || a.source.toLowerCase() === sourceFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || a.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    const matchesPriority = priorityFilter === 'all' || a.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSource && matchesStatus && matchesPriority;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Compliance Actions</h1>
            <p>Manage corrective and preventive actions across all modules.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="all">All Sources</option>
              <option value="assessment">Assessment</option>
              <option value="control test">Control Test</option>
              <option value="ethics case">Ethics Case</option>
              <option value="grievance">Grievance</option>
              <option value="obligation">Obligation</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="overdue">Overdue</option>
              <option value="closed">Closed</option>
            </select>
            <select 
              className="gov-select-pill"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenCreateAction || (() => setIsCreateOpen(true))}
            >
              <Plus size={15} />
              Create Action
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExport}
              title="Export Actions to CSV"
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
            <span className="gov-kpi-label">Open Actions</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <CheckSquare size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">18</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Overdue</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-red">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#DC2626' }}>7</span>
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
            <span className="gov-kpi-value" style={{ color: '#D97706' }}>6</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Closed</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-green">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#16A34A' }}>42</span>
          </div>
        </div>
      </div>

      {/* ──── ACTIONS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Action ID</th>
                <th>Source</th>
                <th>Issue</th>
                <th>Priority</th>
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
                  <td>
                    <span 
                      style={{ 
                        padding: '2px 8px', 
                        borderRadius: '6px', 
                        background: '#EFF6FF', 
                        fontSize: '12px',
                        color: '#2563EB',
                        cursor: 'pointer',
                        fontWeight: 600 
                      }}
                      onClick={() => {
                        if (item.source.toLowerCase().includes('assessment')) onNavigateTab?.('assessments');
                        else if (item.source.toLowerCase().includes('control')) onNavigateTab?.('controls');
                        else if (item.source.toLowerCase().includes('ethics')) onNavigateTab?.('ethics');
                        else if (item.source.toLowerCase().includes('grievance')) onNavigateTab?.('grievances');
                        else onNavigateTab?.('obligations');
                      }}
                    >
                      {item.source}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>
                    {item.issue}
                  </td>
                  <td>
                    <span className={`gov-priority-chip gov-priority-${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>{item.owner}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Action"
                      onClick={() => setSelectedAction(item)}
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
          <span>Showing 1 to {filtered.length} of {localActions.length} actions</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled><ChevronLeft size={14} /></button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* VIEW ACTION MODAL */}
      {selectedAction && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 500, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className={`gov-status-chip gov-status-${selectedAction.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedAction.status}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedAction.id}</h3>
              </div>
              <button onClick={() => setSelectedAction(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Source:</strong> {selectedAction.source}</div>
              <div><strong>Priority:</strong> {selectedAction.priority}</div>
              <div><strong>Owner:</strong> {selectedAction.owner}</div>
              <div><strong>Due Date:</strong> {selectedAction.dueDate}</div>
              <div><strong>Verification:</strong> {selectedAction.verification}</div>
              <div><strong>Status:</strong> {selectedAction.status}</div>
            </div>
            <div style={{ marginTop: 14, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
              <strong>Issue Description:</strong> {selectedAction.issue}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => setSelectedAction(null)}
              >
                Close
              </button>
              {selectedAction.status !== 'Closed' && (
                <button
                  type="button"
                  className="gov-btn gov-btn-primary"
                  onClick={() => handleCloseAction(selectedAction.id)}
                >
                  <CheckCircle2 size={14} style={{ marginRight: 4 }} />
                  Resolve & Close Action
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE ACTION MODAL */}
      {isCreateOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Create CAPA Action</h3>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Issue Summary</label>
                <input
                  type="text"
                  required
                  value={newAct.issue}
                  onChange={e => setNewAct({ ...newAct, issue: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Originating Source</label>
                  <select
                    value={newAct.source}
                    onChange={e => setNewAct({ ...newAct, source: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  >
                    <option value="Assessment">Assessment</option>
                    <option value="Control Test">Control Test</option>
                    <option value="Ethics Case">Ethics Case</option>
                    <option value="Grievance">Grievance</option>
                    <option value="Obligation">Obligation</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Priority</label>
                  <select
                    value={newAct.priority}
                    onChange={e => setNewAct({ ...newAct, priority: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Owner Team</label>
                  <input
                    type="text"
                    required
                    value={newAct.owner}
                    onChange={e => setNewAct({ ...newAct, owner: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Target Due Date</label>
                  <input
                    type="text"
                    required
                    value={newAct.dueDate}
                    onChange={e => setNewAct({ ...newAct, dueDate: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 12 }}>
                <button type="button" className="gov-btn gov-btn-outline" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                <button type="submit" className="gov-btn gov-btn-primary">Log Action</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
