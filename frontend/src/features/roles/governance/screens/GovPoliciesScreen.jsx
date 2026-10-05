import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  Download,
  Eye
} from 'lucide-react';

export default function GovPoliciesScreen({
  policies = [],
  onSelectPolicy,
  onOpenAddPolicy,
  onNavigateTab
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = policies.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Policies & Documents</h1>
            <p>Manage governance policies, ownership, approvals and review cycles.</p>
          </div>
          <div className="gov-header-controls">
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
              <input 
                type="text" 
                className="gov-search-input" 
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="gov-select-pill"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="governance">Governance</option>
              <option value="ethics">Ethics & Integrity</option>
              <option value="social">Social</option>
              <option value="environmental">Environmental</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="active">Active</option>
              <option value="under-review">Under Review</option>
              <option value="due-for-review">Due for Review</option>
              <option value="draft">Draft</option>
            </select>
            <select className="gov-select-pill" defaultValue="all-owner">
              <option value="all-owner">Owner</option>
              <option value="legal">Legal</option>
              <option value="compliance">Compliance</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="esg">ESG</option>
            </select>
            <select className="gov-select-pill" defaultValue="all-review">
              <option value="all-review">Review Date</option>
              <option value="2026">2026</option>
              <option value="q4">Next 90 Days</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenAddPolicy}
            >
              <Plus size={15} />
              Add Policy
            </button>
          </div>
        </div>
      </div>

      {/* ──── POLICIES TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Policy ID</th>
                <th>Policy Name</th>
                <th>Category</th>
                <th>Owner</th>
                <th>Effective Date</th>
                <th>Review Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span 
                      className="gov-table-code"
                      onClick={() => {
                        onSelectPolicy?.(item);
                        onNavigateTab?.('policy-detail');
                      }}
                    >
                      {item.id}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={15} style={{ color: '#2563EB', flexShrink: 0 }} />
                      <span 
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          onSelectPolicy?.(item);
                          onNavigateTab?.('policy-detail');
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#F1F5F9', 
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#475569' 
                    }}>
                      {item.owner}
                    </span>
                  </td>
                  <td>{item.effectiveDate}</td>
                  <td>{item.reviewDate}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        className="gov-page-btn" 
                        title="View Policy Detail"
                        onClick={() => {
                          onSelectPolicy?.(item);
                          onNavigateTab?.('policy-detail');
                        }}
                      >
                        <Eye size={13} />
                      </button>
                      <button 
                        className="gov-page-btn" 
                        title="Download Document"
                        onClick={() => alert(`Downloading policy document for ${item.name} (${item.id})`)}
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ──── PAGINATION ROW ──── */}
        <div className="gov-pagination-row">
          <span>Showing 1 to {filtered.length} of 28 policies</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn">2</button>
            <button className="gov-page-btn">3</button>
            <button className="gov-page-btn">4</button>
            <span style={{ padding: '0 4px', color: '#94A3B8' }}>...</span>
            <button className="gov-page-btn">10</button>
            <button className="gov-page-btn">
              <ChevronRight size={14} />
            </button>
            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#64748B' }}>10 / page</span>
          </div>
        </div>
      </div>
    </div>
  );
}
