import React, { useState } from 'react';
import {
  Send,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function GovSubmissionsScreen({
  submissions = [],
  onOpenCreateSubmission,
  onNavigateTab
}) {
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = submissions.filter(s => {
    const matchesMod = moduleFilter === 'all' || s.module.toLowerCase() === moduleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || s.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    return matchesMod && matchesStatus;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Submissions</h1>
            <p>Create and manage governance submissions.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="all">All Modules</option>
              <option value="policies">Policies</option>
              <option value="compliance">Compliance</option>
              <option value="ethics">Ethics</option>
              <option value="disclosures">Disclosures</option>
              <option value="brsr mapping">BRSR Mapping</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="approved">Approved</option>
              <option value="under-review">Under Review</option>
              <option value="correction-required">Correction Required</option>
            </select>
            <select className="gov-select-pill" defaultValue="fy26">
              <option value="fy26">Period (FY 2026-27)</option>
              <option value="fy25">FY 2025-26</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenCreateSubmission}
            >
              <Plus size={15} />
              Create Submission
            </button>
          </div>
        </div>
      </div>

      {/* ──── 4 KPI CARDS ──── */}
      <div className="gov-kpi-grid-4">
        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Total Submissions</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <Send size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">12</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Approved</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-green">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#16A34A' }}>4</span>
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
            <span className="gov-kpi-value" style={{ color: '#D97706' }}>6</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Correction Required</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-red">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#DC2626' }}>2</span>
          </div>
        </div>
      </div>

      {/* ──── SUBMISSIONS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Submission ID</th>
                <th>Module</th>
                <th>Scope</th>
                <th>Period</th>
                <th>Status</th>
                <th>Last Updated</th>
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
                    {item.module}
                  </td>
                  <td>{item.scope}</td>
                  <td>{item.period}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.lastUpdated}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Submission"
                      onClick={() => alert(`Submission ${item.id}:\nModule: ${item.module}\nStatus: ${item.status}\nSubmitted By: ${item.submittedBy}\nReviewer: ${item.reviewer}`)}
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
          <span>Showing 1 to {filtered.length} of {submissions.length} submissions</span>
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
