import React, { useState } from 'react';
import {
  Plus,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function ProcurementActionsScreen({
  actions = [],
  onNavigateTab
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedOwner, setSelectedOwner] = useState('All Owners');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [newActionForm, setNewActionForm] = useState({
    supplier: 'ABC Construction Ltd.',
    source: 'Assessment',
    issue: '',
    priority: 'High',
    owner: 'Anand Mahindra V.',
    dueDate: '2026-10-31'
  });

  const [localActions, setLocalActions] = useState(actions);

  // Sync if prop updates
  React.useEffect(() => {
    if (actions && actions.length > 0) {
      setLocalActions(actions);
    }
  }, [actions]);

  const handleCreateActionSubmit = (e) => {
    e.preventDefault();
    if (!newActionForm.issue.trim()) return;
    const created = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      supplier: newActionForm.supplier,
      source: newActionForm.source,
      issue: newActionForm.issue,
      priority: newActionForm.priority,
      owner: newActionForm.owner,
      dueDate: newActionForm.dueDate,
      status: 'Open'
    };
    setLocalActions([created, ...localActions]);
    setIsCreateOpen(false);
    setNewActionForm({
      supplier: 'ABC Construction Ltd.',
      source: 'Assessment',
      issue: '',
      priority: 'High',
      owner: 'Anand Mahindra V.',
      dueDate: '2026-10-31'
    });
  };

  const handleMarkResolved = (actionId) => {
    setLocalActions(prev => prev.map(a => a.id === actionId ? { ...a, status: 'Closed' } : a));
    setActiveAction(null);
  };

  const counters = [
    { label: 'Open', count: localActions.filter(a => a.status === 'Open').length || 24, color: '#DC2626', bg: 'rgba(239, 68, 68, 0.12)' },
    { label: 'In Progress', count: localActions.filter(a => a.status === 'In Progress').length || 16, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' },
    { label: 'Pending Verification', count: 8, color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
    { label: 'Overdue', count: localActions.filter(a => a.status === 'Overdue').length || 7, color: '#991B1B', bg: 'rgba(153, 27, 27, 0.12)' },
    { label: 'Closed', count: localActions.filter(a => a.status === 'Closed').length || 42, color: '#475569', bg: 'rgba(71, 85, 105, 0.12)' }
  ];

  const filteredActions = localActions.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.issue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier =
      selectedSupplier === 'All Suppliers' || a.supplier.includes(selectedSupplier);
    const matchesSource =
      selectedSource === 'All Sources' || a.source === selectedSource;
    const matchesStatus =
      selectedStatus === 'All Status' || a.status === selectedStatus;
    const matchesOwner =
      selectedOwner === 'All Owners' || a.owner === selectedOwner;
    return matchesSearch && matchesSupplier && matchesSource && matchesStatus && matchesOwner;
  });

  const getPriorityChip = (p) => {
    switch (p) {
      case 'High':
        return <span className="proc-status-chip high">High</span>;
      case 'Medium':
        return <span className="proc-status-chip medium">Medium</span>;
      default:
        return <span className="proc-status-chip low">Low</span>;
    }
  };

  const getStatusChip = (s) => {
    switch (s) {
      case 'Overdue':
        return <span className="proc-status-chip critical">Overdue</span>;
      case 'In Progress':
        return <span className="proc-status-chip in-progress">In Progress</span>;
      case 'Under Review':
        return <span className="proc-status-chip review">Under Review</span>;
      case 'Open':
        return <span className="proc-status-chip high">Open</span>;
      default:
        return <span className="proc-status-chip active">{s}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Header & Top Action Controls ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Corrective Actions
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Manage supplier corrective actions from assessments, risks and audits.
            </p>
          </div>

          <button
            type="button"
            className="proc-btn proc-btn-blue"
            onClick={() => setIsCreateOpen(true)}
            style={{ padding: '7px 14px', fontSize: '12.5px' }}
          >
            <Plus size={15} />
            <span>Create Action</span>
          </button>
        </div>

        {/* ──── 5 Status Counters (Matching Reference Panel 8) ──── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px' }}>
          {counters.map((c, i) => (
            <div
              key={i}
              className="proc-risk-kpi"
              style={{
                background: c.bg,
                border: `1px solid ${c.color}30`
              }}
            >
              <span className="risk-val" style={{ color: c.color }}>{c.count}</span>
              <span className="risk-label" style={{ color: c.color }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div className="proc-search-bar" style={{ minWidth: '220px' }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search action ID, supplier, issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="proc-select-control"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Suppliers">All Suppliers</option>
            <option value="SafeWorks Services">SafeWorks Services</option>
            <option value="TechBuild Engineers">TechBuild Engineers</option>
            <option value="Green Materials">Green Materials Pvt Ltd</option>
            <option value="InfraStone Suppliers">InfraStone Suppliers</option>
            <option value="EcoTransport Logistics">EcoTransport Logistics</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Sources">All Sources</option>
            <option value="Risk">Risk</option>
            <option value="Assessment">Assessment</option>
            <option value="Audit">Audit</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Status">All Status</option>
            <option value="Overdue">Overdue</option>
            <option value="In Progress">In Progress</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Owners">All Owners</option>
            <option value="Neha Singh">Neha Singh</option>
            <option value="Amit Kumar">Amit Kumar</option>
            <option value="Priya Nair">Priya Nair</option>
            <option value="Rahul Mishra">Rahul Mishra</option>
            <option value="Suresh R.">Suresh R.</option>
          </select>
        </div>
      </div>

      {/* ──── Actions Table ──── */}
      <div className="proc-glass-card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="proc-table-wrapper">
          <table className="proc-table">
            <thead>
              <tr>
                <th>Action ID</th>
                <th>Supplier</th>
                <th>Source</th>
                <th>Issue</th>
                <th>Priority</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredActions.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 800, color: '#2563EB', fontFamily: 'monospace' }}>
                    {a.id}
                  </td>
                  <td>
                    <span 
                      style={{ fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
                      onClick={() => onNavigateTab?.('supplier-detail')}
                    >
                      {a.supplier}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: '#F1F5F9',
                        color: '#475569'
                      }}
                    >
                      {a.source}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 600 }}>{a.issue}</span>
                  </td>
                  <td>{getPriorityChip(a.priority)}</td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{a.owner}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: a.status === 'Overdue' ? '#DC2626' : '#64748B', fontWeight: a.status === 'Overdue' ? 700 : 500 }}>
                      {a.dueDate}
                    </span>
                  </td>
                  <td>{getStatusChip(a.status)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setActiveAction(a)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        background: '#FFFFFF',
                        color: '#2563EB',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create CAPA Action Item */}
      {isCreateOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="proc-glass-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                Create Corrective Action (CAPA)
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateActionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Supplier</label>
                <input
                  type="text"
                  required
                  value={newActionForm.supplier}
                  onChange={(e) => setNewActionForm({ ...newActionForm, supplier: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Issue Description</label>
                <textarea
                  required
                  rows={3}
                  value={newActionForm.issue}
                  onChange={(e) => setNewActionForm({ ...newActionForm, issue: e.target.value })}
                  placeholder="e.g. Scope 1 diesel monitoring calibration overdue at site batching plant"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={newActionForm.priority}
                    onChange={(e) => setNewActionForm({ ...newActionForm, priority: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Due Date</label>
                  <input
                    type="date"
                    required
                    value={newActionForm.dueDate}
                    onChange={(e) => setNewActionForm({ ...newActionForm, dueDate: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="proc-btn proc-btn-outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="proc-btn proc-btn-blue"
                >
                  Save Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Review & Manage Action */}
      {activeAction && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveAction(null)}
        >
          <div
            className="proc-glass-card"
            style={{
              width: '100%',
              maxWidth: '540px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  Action Item: {activeAction.id}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {activeAction.supplier} • {activeAction.source}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveAction(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Issue / Non-Conformance</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginTop: '4px' }}>{activeAction.issue}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Priority</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{activeAction.priority}</div>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Owner</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{activeAction.owner}</div>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Due Date</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{activeAction.dueDate}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="proc-btn proc-btn-outline"
                onClick={() => {
                  exportToCsv(`Action_${activeAction.id}.csv`, [activeAction]);
                }}
              >
                Export CSV
              </button>
              {activeAction.status !== 'Closed' && (
                <button
                  type="button"
                  className="proc-btn proc-btn-blue"
                  onClick={() => handleMarkResolved(activeAction.id)}
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
