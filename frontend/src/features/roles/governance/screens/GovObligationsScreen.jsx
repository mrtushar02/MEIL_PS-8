import React, { useState } from 'react';
import {
  Plus,
  Upload,
  ChevronRight,
  ChevronLeft,
  Eye
} from 'lucide-react';

export default function GovObligationsScreen({
  obligations = [],
  onOpenAddObligation,
  onNavigateTab
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = obligations.filter(item => {
    const matchesSearch = item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Compliance Obligations</h1>
            <p>Track applicable regulatory, legal and internal obligations.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="legal">Legal</option>
              <option value="esg">ESG</option>
              <option value="governance">Governance</option>
              <option value="social">Social</option>
              <option value="environmental">Environmental</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="in-progress">In Progress</option>
              <option value="pending-review">Pending Review</option>
              <option value="due-soon">Due Soon</option>
              <option value="overdue">Overdue</option>
            </select>
            <select className="gov-select-pill" defaultValue="all-date">
              <option value="all-date">Due Date</option>
              <option value="sep">Sep 2026</option>
              <option value="oct">Oct 2026</option>
              <option value="nov">Nov 2026</option>
              <option value="dec">Dec 2026</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenAddObligation}
            >
              <Plus size={15} />
              Add Obligation
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={() => alert('Import CSV/Excel obligations template...')}
            >
              <Upload size={14} />
              Import
            </button>
          </div>
        </div>
      </div>

      {/* ──── OBLIGATIONS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Obligation ID</th>
                <th>Requirement</th>
                <th>Source</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Evidence</th>
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
                    {item.requirement}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#F1F5F9', 
                      fontSize: '12px',
                      color: '#475569' 
                    }}>
                      {item.source}
                    </span>
                  </td>
                  <td>{item.owner}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '12px', 
                      color: item.evidence === 'Verified' ? '#16A34A' : '#D97706',
                      fontWeight: 500 
                    }}>
                      {item.evidence}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Details"
                      onClick={() => alert(`Obligation ${item.id}: ${item.requirement}\nSource: ${item.source}\nOwner: ${item.ownerName || item.owner}\nDue: ${item.dueDate}`)}
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
          <span>Showing 1 to {filtered.length} of {obligations.length} obligations</span>
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
