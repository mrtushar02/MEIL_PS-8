import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function GovAuditScreen({
  auditLogs = [],
  onNavigateTab
}) {
  const [moduleFilter, setModuleFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  const filtered = auditLogs.filter(log => {
    const matchesMod = moduleFilter === 'all' || log.entity.toLowerCase() === moduleFilter.toLowerCase();
    const matchesUser = userFilter === 'all' || log.user.toLowerCase().includes(userFilter.toLowerCase());
    return matchesMod && matchesUser;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Audit & Traceability</h1>
            <p>View complete history and data lineage.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="all">All Modules</option>
              <option value="policy">Policy</option>
              <option value="control">Control</option>
              <option value="action">Action</option>
              <option value="evidence">Evidence</option>
              <option value="submission">Submission</option>
            </select>
            <select className="gov-select-pill" defaultValue="all-date">
              <option value="all-date">Date Range (Last 30 Days)</option>
              <option value="7d">Last 7 Days</option>
              <option value="90d">Quarter to Date</option>
            </select>
            <select 
              className="gov-select-pill"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="all">User</option>
              <option value="priya">Priya Nair</option>
              <option value="amit">Amit Shah</option>
              <option value="adv">Adv. S. K. Nair</option>
              <option value="rohit">Rohit Kumar</option>
              <option value="rahul">Rahul Mehta</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={() => alert('Viewing selected cryptographically verified audit block')}
            >
              <ShieldCheck size={14} />
              View Record
            </button>
          </div>
        </div>
      </div>

      {/* ──── AUDIT LOGS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '12px' }}>
                      <Clock size={13} style={{ color: '#2563EB' }} />
                      <span>{item.dateTime}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>
                    {item.user}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#EFF6FF', 
                      color: '#2563EB', 
                      fontSize: '12px',
                      fontWeight: 500 
                    }}>
                      {item.action}
                    </span>
                  </td>
                  <td>{item.entity}</td>
                  <td>
                    <span 
                      className="gov-table-code"
                      onClick={() => {
                        if (item.entityId.startsWith('POL')) onNavigateTab?.('policies');
                        else if (item.entityId.startsWith('CTR')) onNavigateTab?.('controls');
                        else if (item.entityId.startsWith('CA')) onNavigateTab?.('actions');
                        else if (item.entityId.startsWith('EV')) onNavigateTab?.('evidence');
                        else onNavigateTab?.('submissions');
                      }}
                    >
                      {item.entityId}
                    </span>
                  </td>
                  <td style={{ color: '#334155' }}>
                    {item.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ──── PAGINATION ROW ──── */}
        <div className="gov-pagination-row">
          <span>Showing 1 to {filtered.length} of {auditLogs.length} audit entries</span>
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
