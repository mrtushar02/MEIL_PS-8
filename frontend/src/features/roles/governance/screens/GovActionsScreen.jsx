import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function GovActionsScreen({
  actions = [],
  onOpenCreateAction,
  onNavigateTab
}) {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = actions.filter(a => {
    const matchesSource = sourceFilter === 'all' || a.source.toLowerCase() === sourceFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || a.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    const matchesPriority = priorityFilter === 'all' || a.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSource && matchesStatus && matchesPriority;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Compliance Actions</h1>
            <p>Manage corrective and preventive actions across all modules.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="all">All Sources</option>
              <option value="assessment">Assessment</option>
              <option value="control test">Control Test</option>
              <option value="ethics case">Ethics Case</option>
              <option value="grievance">Grievance</option>
              <option value="obligation">Obligation</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="overdue">Overdue</option>
              <option value="closed">Closed</option>
            </select>
            <select 
              className="gov-select-pill"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenCreateAction}
            >
              <Plus size={15} />
              Create Action
            </button>
          </div>
        </div>
      </div>

      {/* ──── 4 KPI CARDS ──── */}
      <div className="gov-kpi-grid-4">
        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Open Actions</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <CheckSquare size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">18</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Overdue</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-red">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#DC2626' }}>7</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">In Progress</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-amber">
              <Clock size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#D97706' }}>6</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Closed</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-green">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#16A34A' }}>42</span>
          </div>
        </div>
      </div>

      {/* ──── ACTIONS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Action ID</th>
                <th>Source</th>
                <th>Issue</th>
                <th>Priority</th>
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
                  <td>
                    <span 
                      style={{ 
                        padding: '2px 8px', 
                        borderRadius: '6px', 
                        background: '#EFF6FF', 
                        fontSize: '12px',
                        color: '#2563EB',
                        cursor: 'pointer',
                        fontWeight: 600 
                      }}
                      onClick={() => {
                        if (item.source.toLowerCase().includes('assessment')) onNavigateTab?.('assessments');
                        else if (item.source.toLowerCase().includes('control')) onNavigateTab?.('controls');
                        else if (item.source.toLowerCase().includes('ethics')) onNavigateTab?.('ethics');
                        else if (item.source.toLowerCase().includes('grievance')) onNavigateTab?.('grievances');
                        else onNavigateTab?.('obligations');
                      }}
                    >
                      {item.source}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>
                    {item.issue}
                  </td>
                  <td>
                    <span className={`gov-priority-chip gov-priority-${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>{item.owner}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Action"
                      onClick={() => alert(`Action ${item.id}:\nIssue: ${item.issue}\nSource: ${item.source}\nVerification: ${item.verification}`)}
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
          <span>Showing 1 to {filtered.length} of {actions.length} actions</span>
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
