import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function GovAssessmentsScreen({
  assessments = [],
  onOpenStartAssessment,
  onNavigateTab
}) {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = assessments.filter(a => {
    return statusFilter === 'all' || a.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Compliance Assessments</h1>
            <p>Perform periodic compliance assessments and record findings.</p>
          </div>
          <div className="gov-header-controls">
            <select className="gov-select-pill" defaultValue="all">
              <option value="all">All Assessments</option>
              <option value="internal">Internal Audits</option>
              <option value="external">External Audits</option>
            </select>
            <select className="gov-select-pill" defaultValue="fy26">
              <option value="fy26">FY 2026-27</option>
              <option value="fy25">FY 2025-26</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="under-review">Under Review</option>
              <option value="planned">Planned</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenStartAssessment}
            >
              <Plus size={15} />
              Start Assessment
            </button>
          </div>
        </div>
      </div>

      {/* ──── 4 KPI CARDS ──── */}
      <div className="gov-kpi-grid-4">
        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Total Assessments</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <FileCheck size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">16</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Completed</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-green">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#16A34A' }}>10</span>
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
            <span className="gov-kpi-value" style={{ color: '#D97706' }}>4</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Findings</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-red">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#DC2626' }}>8</span>
          </div>
        </div>
      </div>

      {/* ──── ASSESSMENTS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Assessment ID</th>
                <th>Scope</th>
                <th>Category</th>
                <th>Assessor</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Findings</th>
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
                    {item.scope}
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#F1F5F9', 
                      fontSize: '12px',
                      color: '#475569' 
                    }}>
                      {item.assessor}
                    </span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ 
                      fontWeight: 700, 
                      color: item.findings > 0 ? '#DC2626' : '#16A34A',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: item.findings > 0 ? 'rgba(220, 38, 38, 0.08)' : 'rgba(22, 163, 74, 0.08)'
                    }}>
                      {item.findings}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Assessment"
                      onClick={() => alert(`Assessment ${item.id} Details:\nCoverage: ${item.coverage}\nFindings: ${item.findings}\nNext review: ${item.nextReview}`)}
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
          <span>Showing 1 to {filtered.length} of {assessments.length} assessments</span>
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
