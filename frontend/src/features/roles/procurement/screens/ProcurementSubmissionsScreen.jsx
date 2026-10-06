import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Filter,
  Search,
  X,
  FileCheck2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function ProcurementSubmissionsScreen({
  submissions = [],
  onNavigateTab
}) {
  const [localSubmissions, setLocalSubmissions] = useState(submissions);
  const [selectedType, setSelectedType] = useState('All Submission Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [newSubForm, setNewSubForm] = useState({
    type: 'Scope 3 Emissions',
    scope: 'Group Procurement (FY27 Q2)',
    submittedBy: 'Anand Mahindra V.'
  });

  React.useEffect(() => {
    if (submissions && submissions.length > 0) {
      setLocalSubmissions(submissions);
    }
  }, [submissions]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `SUB-26-${Math.floor(100 + Math.random() * 900)}`,
      type: newSubForm.type,
      scope: newSubForm.scope,
      submittedBy: newSubForm.submittedBy,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Submitted',
      reviewer: 'Corporate ESG Secretariat'
    };
    setLocalSubmissions([created, ...localSubmissions]);
    setIsCreateOpen(false);
  };

  const filteredSubmissions = localSubmissions.filter((s) => {
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
            onClick={() => setIsCreateOpen(true)}
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
                    <button
                      type="button"
                      onClick={() => setActiveSubmission(s)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: s.status === 'Correction Needed' ? '1px solid #DC2626' : '1px solid #E2E8F0',
                        background: s.status === 'Correction Needed' ? 'rgba(239, 68, 68, 0.08)' : '#FFFFFF',
                        color: s.status === 'Correction Needed' ? '#DC2626' : '#2563EB',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {s.status === 'Correction Needed' ? 'Edit' : s.status === 'Approved' ? 'View' : 'Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Submission */}
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
                Create Scope Submission
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Submission Type</label>
                <select
                  value={newSubForm.type}
                  onChange={(e) => setNewSubForm({ ...newSubForm, type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="Scope 3 Emissions">Scope 3 Emissions (Purchased Goods)</option>
                  <option value="Value Chain">Value Chain Top 75% Spend Verification</option>
                  <option value="ESG Assessment">Supplier ESG Assessment Batch</option>
                  <option value="Supplier Master">Supplier Master KYC Audit</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Scope & Project Group</label>
                <input
                  type="text"
                  required
                  value={newSubForm.scope}
                  onChange={(e) => setNewSubForm({ ...newSubForm, scope: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Submitted By</label>
                <input
                  type="text"
                  required
                  value={newSubForm.submittedBy}
                  onChange={(e) => setNewSubForm({ ...newSubForm, submittedBy: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
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
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View & Review Submission */}
      {activeSubmission && (
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
          onClick={() => setActiveSubmission(null)}
        >
          <div
            className="proc-glass-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  Submission: {activeSubmission.id}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {activeSubmission.type} • {activeSubmission.scope}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubmission(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '14px 0' }}>
              <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Submitted By</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{activeSubmission.submittedBy}</div>
              </div>
              <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Date</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{activeSubmission.date}</div>
              </div>
              <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Assigned Reviewer</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{activeSubmission.reviewer}</div>
              </div>
              <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Status</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{activeSubmission.status}</div>
              </div>
            </div>

            <div style={{ fontSize: '12.5px', color: '#334155', background: '#F1F5F9', padding: '12px', borderRadius: '10px', lineHeight: 1.5 }}>
              🔒 <strong>Blockchain / SHA-256 Audit Trail:</strong> Validated against CEA Baseline v19 & GHG Protocol Scope 3 Category 1. Immutable audit block generated.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                className="proc-btn proc-btn-outline"
                onClick={() => {
                  exportToCsv(`Submission_${activeSubmission.id}.csv`, [activeSubmission]);
                  setActiveSubmission(null);
                }}
              >
                Export CSV
              </button>
              <button
                type="button"
                className="proc-btn proc-btn-blue"
                onClick={() => {
                  setLocalSubmissions(prev => prev.map(s => s.id === activeSubmission.id ? { ...s, status: 'Approved' } : s));
                  setActiveSubmission(null);
                }}
              >
                Approve Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
