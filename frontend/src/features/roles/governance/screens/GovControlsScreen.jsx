import React, { useState } from 'react';
import {
  Plus,
  Eye,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function GovControlsScreen({
  controls = [],
  onOpenAddControl,
  onNavigateTab
}) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');

  const filtered = controls.filter(c => {
    const matchesType = typeFilter === 'all' || c.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    const matchesOwner = ownerFilter === 'all' || c.owner.toLowerCase() === ownerFilter.toLowerCase();
    return matchesType && matchesStatus && matchesOwner;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Compliance Controls</h1>
            <p>Manage preventive, detective and corrective controls.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="preventive">Preventive</option>
              <option value="detective">Detective</option>
              <option value="it automated">IT Automated</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="needs-action">Needs Action</option>
              <option value="under-review">Under Review</option>
            </select>
            <select 
              className="gov-select-pill"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <option value="all">Owner</option>
              <option value="procurement">Procurement</option>
              <option value="finance">Finance</option>
              <option value="it">IT</option>
              <option value="esg">ESG</option>
              <option value="legal">Legal</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenAddControl}
            >
              <Plus size={15} />
              Add Control
            </button>
          </div>
        </div>
      </div>

      {/* ──── CONTROLS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Control ID</th>
                <th>Control Name</th>
                <th>Type</th>
                <th>Obligation</th>
                <th>Owner</th>
                <th>Last Test</th>
                <th>Result</th>
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
                    {item.name}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: item.type === 'IT Automated' ? '#EFF6FF' : '#F1F5F9', 
                      color: item.type === 'IT Automated' ? '#2563EB' : '#475569',
                      fontSize: '12px'
                    }}>
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <span 
                      style={{ color: '#2563EB', fontWeight: 500, cursor: 'pointer' }}
                      onClick={() => onNavigateTab?.('obligations')}
                    >
                      {item.obligation}
                    </span>
                  </td>
                  <td>{item.owner}</td>
                  <td>{item.lastTest}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.result.toLowerCase()}`}>
                      {item.result}
                    </span>
                  </td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="Test Control"
                      onClick={() => alert(`Control ${item.id} Test Log:\nMethod: ${item.testMethod}\nLast tested: ${item.lastTest}\nResult: ${item.result}`)}
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
          <span>Showing 1 to {filtered.length} of {controls.length} controls</span>
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
