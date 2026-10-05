import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Filter,
  Search
} from 'lucide-react';

export default function ProcurementSubmissionsScreen({
  submissions = [],
  onNavigateTab
}) {
  const [selectedType, setSelectedType] = useState('All Submission Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scope.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === 'All Submission Types' || s.type === selectedType;
    const matchesStatus =
      selectedStatus === 'All Status' || s.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="proc-status-chip approved">Approved</span>;
      case 'Under Review':
        return <span className="proc-status-chip review">Under Review</span>;
      case 'Correction Needed':
        return <span className="proc-status-chip critical">Correction Needed</span>;
      case 'Submitted':
        return <span className="proc-status-chip pending">Submitted</span>;
      default:
        return <span className="proc-status-chip low">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Header & Action Controls ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Submissions
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Manage procurement & scope submissions for review and approval.
            </p>
          </div>

          <button
            type="button"
            className="proc-btn proc-btn-blue"
            onClick={() => alert('Create New Scope 3 / Value Chain Submission for Corporate ESG Review')}
            style={{ padding: '7px 14px', fontSize: '12.5px' }}
          >
            <Plus size={15} />
            <span>Create Submission</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div className="proc-search-bar" style={{ minWidth: '220px' }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search submission ID, type, scope..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="proc-select-control"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Submission Types">All Submission Types</option>
            <option value="Supplier Master">Supplier Master</option>
            <option value="Transactions">Transactions</option>
            <option value="ESG Assessment">ESG Assessment</option>
            <option value="Value Chain">Value Chain</option>
            <option value="Scope 3 Emissions">Scope 3 Emissions</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Status">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Correction Needed">Correction Needed</option>
            <option value="Submitted">Submitted</option>
          </select>
        </div>
      </div>

      {/* ──── Submissions Table ──── */}
      <div className="proc-glass-card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="proc-table-wrapper">
          <table className="proc-table">
            <thead>
              <tr>
                <th>Submission ID</th>
                <th>Type</th>
                <th>Scope</th>
                <th>Submitted By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Reviewer</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 800, color: '#2563EB', fontFamily: 'monospace' }}>
                    {s.id}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{s.type}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{s.scope}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#1E293B', fontWeight: 600 }}>{s.submittedBy}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{s.date}</span>
                  </td>
                  <td>{getStatusChip(s.status)}</td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{s.reviewer}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {s.status === 'Correction Needed' ? (
                      <button
                        type="button"
                        onClick={() => alert(`Opening correction drawer for submission ${s.id}`)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid #DC2626',
                          background: 'rgba(239, 68, 68, 0.08)',
                          color: '#DC2626',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert(`View details of submission ${s.id}`)}
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
                        {s.status === 'Approved' ? 'View' : 'Review'}
                      </button>
                    )}
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
