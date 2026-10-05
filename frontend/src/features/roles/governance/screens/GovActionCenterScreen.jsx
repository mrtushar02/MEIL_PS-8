import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function GovActionCenterScreen({
  actionTasks = [],
  onNavigateTab
}) {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Compliance Action Center</h1>
            <p>Centralized task and action management.</p>
          </div>
          <div className="gov-header-controls">
            <select className="gov-select-pill" defaultValue="all">
              <option value="all">Assigned to: All Teams</option>
              <option value="me">Assigned to Me</option>
            </select>
          </div>
        </div>
      </div>

      {/* ──── FILTER TABS ROW ──── */}
      <div className="gov-table-card" style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className={`gov-btn ${activeTab === 'all' ? 'gov-btn-primary' : 'gov-btn-outline'}`}
            onClick={() => setActiveTab('all')}
            style={{ height: '34px', fontSize: '12.5px' }}
          >
            All Tasks
          </button>
          <button 
            className={`gov-btn ${activeTab === 'critical' ? 'gov-btn-primary' : 'gov-btn-outline'}`}
            onClick={() => setActiveTab('critical')}
            style={{ height: '34px', fontSize: '12.5px', borderColor: '#FCA5A5' }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} />
            Critical <span style={{ padding: '1px 6px', borderRadius: '9999px', background: '#FEE2E2', color: '#DC2626', fontSize: '11px', fontWeight: 700 }}>3</span>
          </button>
          <button 
            className={`gov-btn ${activeTab === 'due-today' ? 'gov-btn-primary' : 'gov-btn-outline'}`}
            onClick={() => setActiveTab('due-today')}
            style={{ height: '34px', fontSize: '12.5px' }}
          >
            <Clock size={13} style={{ color: '#D97706' }} />
            Due Today <span style={{ padding: '1px 6px', borderRadius: '9999px', background: '#FEF3C7', color: '#D97706', fontSize: '11px', fontWeight: 700 }}>2</span>
          </button>
          <button 
            className={`gov-btn ${activeTab === 'due-week' ? 'gov-btn-primary' : 'gov-btn-outline'}`}
            onClick={() => setActiveTab('due-week')}
            style={{ height: '34px', fontSize: '12.5px' }}
          >
            <Calendar size={13} style={{ color: '#2563EB' }} />
            Due This Week <span style={{ padding: '1px 6px', borderRadius: '9999px', background: '#DBEAFE', color: '#2563EB', fontSize: '11px', fontWeight: 700 }}>5</span>
          </button>
          <button 
            className={`gov-btn ${activeTab === 'overdue' ? 'gov-btn-primary' : 'gov-btn-outline'}`}
            onClick={() => setActiveTab('overdue')}
            style={{ height: '34px', fontSize: '12.5px' }}
          >
            <AlertTriangle size={13} style={{ color: '#DC2626' }} />
            Overdue <span style={{ padding: '1px 6px', borderRadius: '9999px', background: '#FEE2E2', color: '#DC2626', fontSize: '11px', fontWeight: 700 }}>7</span>
          </button>
          <button 
            className={`gov-btn ${activeTab === 'completed' ? 'gov-btn-primary' : 'gov-btn-outline'}`}
            onClick={() => setActiveTab('completed')}
            style={{ height: '34px', fontSize: '12.5px' }}
          >
            <CheckCircle2 size={13} style={{ color: '#16A34A' }} />
            Completed <span style={{ padding: '1px 6px', borderRadius: '9999px', background: '#DCFCE7', color: '#16A34A', fontSize: '11px', fontWeight: 700 }}>42</span>
          </button>
        </div>
      </div>

      {/* ──── TASKS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Source</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {actionTasks.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckSquare size={15} style={{ color: '#2563EB', flexShrink: 0 }} />
                      <span>{item.task}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      style={{ color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => onNavigateTab?.(item.targetScreen)}
                    >
                      {item.source}
                    </span>
                  </td>
                  <td>{item.owner}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`gov-priority-chip gov-priority-${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-btn gov-btn-primary"
                      style={{ height: '28px', padding: '0 12px', fontSize: '12px' }}
                      onClick={() => {
                        onNavigateTab?.(item.targetScreen);
                      }}
                    >
                      {item.actionLabel}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
