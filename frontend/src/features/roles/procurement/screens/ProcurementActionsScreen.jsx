import React, { useState } from 'react';
import {
  Plus,
  Search
} from 'lucide-react';

export default function ProcurementActionsScreen({
  actions = [],
  onNavigateTab
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedOwner, setSelectedOwner] = useState('All Owners');

  const counters = [
    { label: 'Open', count: 24, color: '#DC2626', bg: 'rgba(239, 68, 68, 0.12)' },
    { label: 'In Progress', count: 16, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' },
    { label: 'Pending Verification', count: 8, color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
    { label: 'Overdue', count: 7, color: '#991B1B', bg: 'rgba(153, 27, 27, 0.12)' },
    { label: 'Closed', count: 42, color: '#475569', bg: 'rgba(71, 85, 105, 0.12)' }
  ];

  const filteredActions = actions.filter((a) => {
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
            onClick={() => alert('Create New Supplier CAPA Action Item')}
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
                      onClick={() => alert(`Review action ${a.id}`)}
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
    </div>
  );
}
