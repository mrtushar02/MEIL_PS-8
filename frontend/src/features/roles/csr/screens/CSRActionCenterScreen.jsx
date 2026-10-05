import React, { useState } from 'react';
import {
  Clock,
  Search
} from 'lucide-react';
import { INITIAL_ACTION_CENTER_ITEMS } from '../csrData';

export default function CSRActionCenterScreen({ onNavigateTab }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionsList, setActionsList] = useState(INITIAL_ACTION_CENTER_ITEMS);

  const filteredActions = actionsList.filter((item) => {
    const text = (item.task || item.evidence_desc || '').toLowerCase();
    const matchesSearch =
      text.includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'Overdue') return matchesSearch && item.status === 'Overdue';
    if (activeFilter === 'Due This Week') return matchesSearch && (item.due_date.includes('21 Sep') || item.due_date.includes('22 Sep') || item.due_date.includes('23 Sep'));
    if (activeFilter === 'Open') return matchesSearch && item.status === 'Open';
    if (activeFilter === 'Completed') return matchesSearch && item.status === 'Completed';
    return matchesSearch;
  });

  const getPriorityChip = (p) => {
    switch (p?.toLowerCase()) {
      case 'critical':
        return 'csr-status-chip critical';
      case 'high':
        return 'csr-status-chip high';
      case 'medium':
        return 'csr-status-chip warning';
      default:
        return 'csr-status-chip medium';
    }
  };

  const getStatusChip = (s) => {
    switch (s?.toLowerCase()) {
      case 'overdue':
        return 'csr-status-chip critical';
      case 'in progress':
        return 'csr-status-chip pending';
      case 'completed':
        return 'csr-status-chip completed';
      default:
        return 'csr-status-chip open';
    }
  };

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="csr-pill-tag" style={{ color: '#D97706', borderColor: 'rgba(217, 119, 6, 0.25)', background: 'rgba(217, 119, 6, 0.08)' }}>
                DISPATCH & REMEDIATION
              </div>
              <h1 className="csr-hero-title">CSR Action Center</h1>
              <p className="csr-hero-subtitle">
                Centralized workbench for pending impact data, evidence gaps, overdue grievances and statutory corrections.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ──── FILTER & SEARCH BAR (WITH ALL 19, OVERDUE 3, DUE THIS WEEK 7, OPEN 7, COMPLETED 2) ──── */}
      <div className="csr-filter-bar">
        <div className="csr-filter-pills">
          {[
            { id: 'All', label: 'All (19)' },
            { id: 'Overdue', label: 'Overdue (3)' },
            { id: 'Due This Week', label: 'Due This Week (7)' },
            { id: 'Open', label: 'Open (7)' },
            { id: 'Completed', label: 'Completed (2)' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`csr-filter-pill-btn ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="csr-search-box">
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            className="csr-search-input"
            placeholder="Search actions, modules, owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ──── ACTIONS TABLE ──── */}
      <div className="csr-table-container">
        <table className="csr-table">
          <thead>
            <tr>
              <th>Task / Remediation</th>
              <th>Module</th>
              <th>Project</th>
              <th>Owner</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredActions.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.task || item.evidence_desc}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{item.id}</div>
                </td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{item.module}</span>
                </td>
                <td style={{ fontWeight: 700, color: '#2563EB' }}>{item.project}</td>
                <td style={{ fontSize: '12.5px', color: '#1E293B' }}>{item.owner}</td>
                <td style={{ fontSize: '12px', color: '#475569' }}>{item.due_date}</td>
                <td>
                  <span className={getPriorityChip(item.priority)}>{item.priority}</span>
                </td>
                <td>
                  <span className={getStatusChip(item.status)}>{item.status}</span>
                </td>
                <td>
                  <button
                    className="csr-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11.5px' }}
                    onClick={() => {
                      if (item.module.includes('Impact')) onNavigateTab?.('social-impact');
                      else if (item.module.includes('Evidence')) onNavigateTab?.('evidence');
                      else if (item.module.includes('Grievance')) onNavigateTab?.('grievances');
                      else if (item.module.includes('Stakeholders')) onNavigateTab?.('stakeholders');
                      else if (item.module.includes('Beneficiaries')) onNavigateTab?.('beneficiaries');
                      else if (item.module.includes('Submissions')) onNavigateTab?.('submissions');
                      else onNavigateTab?.('projects');
                    }}
                  >
                    {item.action_label || 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
