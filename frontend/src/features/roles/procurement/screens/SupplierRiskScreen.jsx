import React, { useState } from 'react';
import {
  Search
} from 'lucide-react';

export default function SupplierRiskScreen({
  risks = [],
  onNavigateTab
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedRiskType, setSelectedRiskType] = useState('All Risk Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const riskCounts = [
    { label: 'Critical', count: 6, color: '#DC2626', bg: 'rgba(239, 68, 68, 0.12)' },
    { label: 'High', count: 12, color: '#EA580C', bg: 'rgba(234, 88, 12, 0.12)' },
    { label: 'Medium', count: 28, color: '#D97706', bg: 'rgba(217, 119, 6, 0.12)' },
    { label: 'Low', count: 36, color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
    { label: 'Unassessed', count: 34, color: '#64748B', bg: 'rgba(100, 116, 139, 0.12)' },
    { label: 'Open Actions', count: 18, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' },
    { label: 'Overdue', count: 7, color: '#991B1B', bg: 'rgba(153, 27, 27, 0.12)' }
  ];

  const filteredRisks = risks.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.riskType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier =
      selectedSupplier === 'All Suppliers' || r.supplier.includes(selectedSupplier);
    const matchesType =
      selectedRiskType === 'All Risk Types' || r.riskType === selectedRiskType;
    const matchesStatus =
      selectedStatus === 'All Status' || r.status === selectedStatus;
    return matchesSearch && matchesSupplier && matchesType && matchesStatus;
  });

  const getSeverityChip = (severity) => {
    switch (severity) {
      case 'Critical':
        return <span className="proc-status-chip critical">Critical</span>;
      case 'High':
        return <span className="proc-status-chip high">High</span>;
      case 'Medium':
        return <span className="proc-status-chip medium">Medium</span>;
      default:
        return <span className="proc-status-chip low">Low</span>;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Open':
        return <span className="proc-status-chip critical">Open</span>;
      case 'In Progress':
        return <span className="proc-status-chip in-progress">In Progress</span>;
      case 'Under Review':
        return <span className="proc-status-chip review">Under Review</span>;
      default:
        return <span className="proc-status-chip completed">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Header ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Supplier ESG Risk
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Identify, monitor and relieve supplier sustainability risks.
            </p>
          </div>
        </div>

        {/* ──── 7 Severity / Count Badges (Matching Panel 7 Top Row) ──── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginTop: '16px' }}>
          {riskCounts.map((rc, idx) => (
            <div
              key={idx}
              className="proc-risk-kpi"
              style={{
                background: rc.bg,
                border: `1px solid ${rc.color}30`
              }}
            >
              <span className="risk-val" style={{ color: rc.color }}>{rc.count}</span>
              <span className="risk-label" style={{ color: rc.color }}>{rc.label}</span>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div className="proc-search-bar" style={{ minWidth: '240px' }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search risk ID, supplier, risk type..."
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
            <option value="InfraStone Suppliers">InfraStone Suppliers</option>
            <option value="EcoTransport Logistics">EcoTransport Logistics</option>
            <option value="BuildRight Equipment">BuildRight Equipment</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedRiskType}
            onChange={(e) => setSelectedRiskType(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Risk Types">All Risk Types</option>
            <option value="H&S Non-compliance">H&S Non-compliance</option>
            <option value="Environmental waiver">Environmental waiver</option>
            <option value="Labor Practices">Labor Practices</option>
            <option value="Data Quality">Data Quality</option>
            <option value="Certification Expiry">Certification Expiry</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Status">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      {/* ──── Risk Register Table ──── */}
      <div className="proc-glass-card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="proc-table-wrapper">
          <table className="proc-table">
            <thead>
              <tr>
                <th>Risk ID</th>
                <th>Supplier</th>
                <th>Risk Type</th>
                <th>Severity</th>
                <th>Assessment</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRisks.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 800, color: '#2563EB', fontFamily: 'monospace' }}>
                    {r.id}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.supplier}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>{r.riskType}</span>
                  </td>
                  <td>{getSeverityChip(r.severity)}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#2563EB', fontWeight: 700 }}>
                      {r.assessment}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{r.owner}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{r.dueDate}</span>
                  </td>
                  <td>{getStatusChip(r.status)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => onNavigateTab?.('corrective-actions')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #2563EB',
                        background: 'rgba(37, 99, 235, 0.08)',
                        color: '#2563EB',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Mitigate &rarr;
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
