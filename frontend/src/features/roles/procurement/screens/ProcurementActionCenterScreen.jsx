import React, { useState } from 'react';
import {
  Calendar,
  X,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function ProcurementActionCenterScreen({
  actionItems = [],
  onNavigateTab
}) {
  const [activeFilterTab, setActiveFilterTab] = useState('all');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const filterTabs = [
    { id: 'all', label: 'All (54)' },
    { id: 'overdue', label: 'Overdue (7)' },
    { id: 'due-this-week', label: 'Due This Week (12)' },
    { id: 'assessments', label: 'Assessments (14)' },
    { id: 'risks', label: 'Risks (9)' },
    { id: 'evidence', label: 'Evidence (6)' },
    { id: 'submissions', label: 'Submissions (6)' }
  ];

  const filteredItems = actionItems.filter((item) => {
    if (activeFilterTab === 'all') return true;
    if (activeFilterTab === 'overdue') return item.status === 'Overdue';
    if (activeFilterTab === 'due-this-week') return item.dueDate.includes('Sep');
    if (activeFilterTab === 'assessments') return item.type === 'Assessment';
    if (activeFilterTab === 'risks') return item.type === 'Risk';
    if (activeFilterTab === 'evidence') return item.type === 'Evidence';
    if (activeFilterTab === 'submissions') return item.type === 'Submission';
    return true;
  });

  const getPriorityChip = (p) => {
    switch (p) {
      case 'High':
        return <span className="proc-status-chip high">High</span>;
      case 'Medium':
        return <span className="proc-status-chip medium">Medium</span>;
      default:
        return <span className="proc-status-chip low">Low</span>;
    }
  };

  const getStatusChip = (s) => {
    switch (s) {
      case 'Overdue':
        return <span className="proc-status-chip critical">Overdue</span>;
      case 'In Progress':
        return <span className="proc-status-chip in-progress">In Progress</span>;
      case 'Open':
        return <span className="proc-status-chip high">Open</span>;
      default:
        return <span className="proc-status-chip low">{s}</span>;
    }
  };

  const handleActionClick = (item) => {
    if (item.type === 'Assessment') onNavigateTab?.('assessments');
    else if (item.type === 'Evidence') onNavigateTab?.('evidence');
    else if (item.type === 'Risk') onNavigateTab?.('risk');
    else if (item.type === 'Submission') onNavigateTab?.('submissions');
    else onNavigateTab?.('actions');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Header & Action Controls ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Procurement Action Center
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Action items, deadlines and compliance requirements.
            </p>
          </div>

          <button
            type="button"
            className="proc-btn proc-btn-outline"
            onClick={() => setIsCalendarOpen(true)}
            style={{ padding: '7px 14px', fontSize: '12.5px' }}
          >
            <Calendar size={14} color="#2563EB" />
            <span>View Calendar</span>
          </button>
        </div>

        {/* ──── Subtabs Row (Matching Reference Panel 12) ──── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', overflowX: 'auto' }}>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`proc-subnav-tab ${activeFilterTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveFilterTab(tab.id)}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: activeFilterTab === tab.id ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                color: activeFilterTab === tab.id ? '#2563EB' : '#64748B',
                fontWeight: activeFilterTab === tab.id ? 700 : 600
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ──── Action Items Table ──── */}
      <div className="proc-glass-card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="proc-table-wrapper">
          <table className="proc-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Action</th>
                <th>Type</th>
                <th>Associated Entity</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.num}>
                  <td style={{ color: '#94A3B8', fontWeight: 700 }}>{item.num}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{item.action}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: '#F1F5F9',
                        color: '#475569'
                      }}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 600 }}>{item.entity}</span>
                  </td>
                  <td>{getPriorityChip(item.priority)}</td>
                  <td>
                    <span style={{ fontSize: '12px', color: item.status === 'Overdue' ? '#DC2626' : '#64748B', fontWeight: item.status === 'Overdue' ? 700 : 500 }}>
                      {item.dueDate}
                    </span>
                  </td>
                  <td>{getStatusChip(item.status)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleActionClick(item)}
                      style={{
                        padding: '5px 14px',
                        borderRadius: '6px',
                        border: 'none',
                        background: item.status === 'Overdue' ? '#DC2626' : '#2563EB',
                        color: '#FFFFFF',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                      }}
                    >
                      {item.actionBtn}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsCalendarOpen(false)}
        >
          <div
            className="proc-glass-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} color="#2563EB" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  BRSR Statutory Compliance Calendar
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { date: '15 Oct 2026', title: 'Q2 Value Chain Spend Data Freeze', status: 'Upcoming', desc: 'Consolidation of Top 75% vendor spend invoices across all projects.' },
                { date: '28 Oct 2026', title: 'Supplier GHG Scope 3 Baseline Cutoff', status: 'Mandatory', desc: 'Collection of Scope 3 Category 1 purchased goods emissions data.' },
                { date: '10 Nov 2026', title: 'Independent BRSR Assurance Audit', status: 'Scheduled', desc: 'Statutory verification by external ESG assurance agency.' },
                { date: '30 Nov 2026', title: 'Annual SEBI Group Filing Review', status: 'Board Gate', desc: 'Final review and signoff by MEIL Board Sustainability Committee.' }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB' }}>{item.date} • {item.title}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                  <span className="proc-status-chip pending">{item.status}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                className="proc-btn proc-btn-outline"
                onClick={() => setIsCalendarOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="proc-btn proc-btn-blue"
                onClick={() => {
                  exportToCsv('MEIL_BRSR_Compliance_Calendar.csv', [
                    { Deadline: '15 Oct 2026', Task: 'Q2 Value Chain Spend Freeze', Standard: 'SEBI BRSR Core' },
                    { Deadline: '28 Oct 2026', Task: 'Supplier Scope 3 Baseline', Standard: 'GHG Protocol' },
                    { Deadline: '10 Nov 2026', Task: 'Assurance Audit', Standard: 'SEBI Circular 2023' },
                    { Deadline: '30 Nov 2026', Task: 'Board Approval', Standard: 'NGRBC / SEBI' }
                  ]);
                  setIsCalendarOpen(false);
                }}
              >
                Export Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
