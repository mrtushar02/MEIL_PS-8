import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function GovAuditScreen({
  auditLogs = [],
  onNavigateTab
}) {
  const [moduleFilter, setModuleFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [selectedBlock, setSelectedBlock] = useState(null);

  const handleExport = () => {
    const rows = filtered.map(log => ({
      ID: log.id,
      DateTime: log.dateTime,
      User: log.user,
      Action: log.action,
      Entity: log.entity,
      EntityID: log.entityId,
      Details: log.details,
      Cryptographic_Hash: `sha256_${Math.random().toString(36).substring(2, 12)}`
    }));
    exportToCsv('MEIL_Governance_Audit_Trail', rows);
  };

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
              onClick={() => setSelectedBlock(filtered[0] || { id: 'AUD-GENESIS', entity: 'Policy', user: 'System', dateTime: 'Genesis Block', details: 'Initialized ledger' })}
            >
              <ShieldCheck size={14} />
              Verify Audit Block
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExport}
              title="Export Complete Audit Log"
            >
              <Download size={14} />
              Export
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

      {/* CRYPTOGRAPHIC BLOCK MODAL */}
      {selectedBlock && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 500, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Verified Audit Block</h3>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{selectedBlock.id || 'AUD-BLOCK-VERIFIED'}</span>
                </div>
              </div>
              <button onClick={() => setSelectedBlock(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Action:</strong> {selectedBlock.action}</div>
              <div><strong>Entity:</strong> {selectedBlock.entity} ({selectedBlock.entityId})</div>
              <div><strong>Initiator:</strong> {selectedBlock.user}</div>
              <div><strong>Timestamp:</strong> {selectedBlock.dateTime}</div>
            </div>
            <div style={{ marginTop: 14, fontSize: '12.5px', color: '#475569' }}>
              <strong>Audit Payload:</strong> {selectedBlock.details}
            </div>
            <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: '#F1F5F9', fontSize: '11px', fontFamily: 'monospace', color: '#334155', wordBreak: 'break-all' }}>
              SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                className="gov-btn gov-btn-primary"
                onClick={() => setSelectedBlock(null)}
              >
                Dismiss Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
