import React, { useState } from 'react';
import {
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  Hourglass,
  Eye,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function GovEthicsScreen({
  cases = [],
  onOpenRegisterCase,
  onNavigateTab
}) {
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sevFilter, setSevFilter] = useState('all');

  const filtered = cases.filter(c => {
    const matchesCat = catFilter === 'all' || c.category.toLowerCase().includes(catFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    const matchesSev = sevFilter === 'all' || c.severity.toLowerCase() === sevFilter.toLowerCase();
    return matchesCat && matchesStatus && matchesSev;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Ethics & Conduct</h1>
            <p>Manage ethics cases, whistleblower reports and conduct matters.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="whistleblower">Whistleblower</option>
              <option value="conflict of interest">Conflict of Interest</option>
              <option value="fraud">Fraud</option>
              <option value="misconduct">Misconduct</option>
              <option value="policy violation">Policy Violation</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="under-review">Under Review</option>
              <option value="investigation">Investigation</option>
              <option value="action-required">Action Required</option>
              <option value="resolved">Resolved</option>
            </select>
            <select 
              className="gov-select-pill"
              value={sevFilter}
              onChange={(e) => setSevFilter(e.target.value)}
            >
              <option value="all">Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenRegisterCase}
            >
              <Plus size={15} />
              Register Case
            </button>
          </div>
        </div>
      </div>

      {/* ──── 4 KPI CARDS ──── */}
      <div className="gov-kpi-grid-4">
        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Open Cases</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-purple">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">6</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Under Review</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-amber">
              <Clock size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#D97706' }}>4</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Resolved</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-green">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#16A34A' }}>12</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Average Resolution</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <Hourglass size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">18 days</span>
          </div>
        </div>
      </div>

      {/* ──── ETHICS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Category</th>
                <th>Date</th>
                <th>Severity</th>
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
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>
                    {item.category}
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`gov-priority-chip gov-priority-${item.severity.toLowerCase()}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#F1F5F9', 
                      fontSize: '12px',
                      color: '#475569' 
                    }}>
                      {item.owner}
                    </span>
                  </td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Confidential Case Details"
                      onClick={() => alert(`Confidential Case ${item.id}:\n${item.description}\nScope: ${item.scope}\nStatus: ${item.status}\nResolution: ${item.resolution}`)}
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
          <span>Showing 1 to {filtered.length} of {cases.length} cases</span>
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
