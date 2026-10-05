import React, { useState } from 'react';
import {
  Plus,
  FileText,
  Eye,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function GovDisclosuresScreen({
  disclosures = [],
  onOpenCreateRecord,
  onNavigateTab
}) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [scopeFilter, setScopeFilter] = useState('all');

  const filtered = disclosures.filter(d => {
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
              onClick={onOpenCreateRecord}
            >
              <Plus size={15} />
              Create Record
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
                      onClick={() => alert(`Disclosure ${item.id}:\n${item.type}\nScope: ${item.scope}\nApproval: ${item.approval}`)}
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
          <span>Showing 1 to {filtered.length} of {disclosures.length} records</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled><ChevronLeft size={14} /></button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
