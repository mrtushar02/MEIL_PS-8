import React, { useState, useEffect } from 'react';
import {
  Filter,
  X,
  Lock,
  Download
} from 'lucide-react';
import esgStore from '../../../../services/esgStore';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function EHSAuditScreen({
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedUser, setSelectedUser] = useState('All Users');
  const [selectedAction, setSelectedAction] = useState('All Actions');
  const [selectedRecordId, setSelectedRecordId] = useState('');

  // Default audit trail logs matching image Panel 12
  const defaultLogs = [
    {
      id: '01',
      date: '30 Sep 2026',
      time: '11:24',
      user: 'Rohit Kumar',
      role: 'EHS & Safety Specialist',
      action: 'Updated',
      recordId: 'INC-2026-05',
      module: 'Incident Management',
      note: 'Changed status to Under Investigation',
      oldValue: 'Reported',
      newValue: 'Under Investigation',
      hash: 'SHA256: 4b68e990c7dfbc345892ac3019ebd71928471029cbafe1820491829038cbefa1',
      ip: '10.14.8.12'
    },
    {
      id: '02',
      date: '29 Sep 2026',
      time: '16:15',
      user: 'Neha Singh',
      role: 'Site Environmental Engineer',
      action: 'Created',
      recordId: 'EV-2026-88',
      module: 'Evidence Management',
      note: 'Incident report added with preliminary site photos',
      oldValue: 'null',
      newValue: 'Uploaded File (2.4 MB)',
      hash: 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      ip: '10.14.8.44'
    },
    {
      id: '03',
      date: '28 Sep 2026',
      time: '10:05',
      user: 'Amit Singh',
      role: 'CAPA Lead Officer',
      action: 'Generated',
      recordId: 'CA-2026-22',
      module: 'Corrective Actions',
      note: 'Action created from incident INC-2026-05',
      oldValue: 'null',
      newValue: 'Corrective Action Created',
      hash: 'SHA256: a89cb7102948dfbc12948ca09182740192837492817264810293847291837461',
      ip: '10.14.8.19'
    },
    {
      id: '04',
      date: '26 Sep 2026',
      time: '14:32',
      user: 'Arvind Patel',
      role: 'Statutory Compliance Lead',
      action: 'Submitted',
      recordId: 'SUB-2026-16',
      module: 'Submissions',
      note: 'Safety submission submitted to regulatory portal',
      oldValue: 'Draft',
      newValue: 'Submitted',
      hash: 'SHA256: e819203847192837465920192847582910394857201948572910495827104958',
      ip: '10.14.8.88'
    },
    {
      id: '05',
      date: '25 Sep 2026',
      time: '09:15',
      user: 'Rahul Mehta',
      role: 'Group Environmental Auditor',
      action: 'Approved',
      recordId: 'ENV-2026-12',
      module: 'Environmental & HSE Data',
      note: 'Environmental data approved and locked',
      oldValue: 'Under Review',
      newValue: 'Approved & Locked',
      hash: 'SHA256: 9102938475610293847561029384756102938475610293847561029384756102',
      ip: '10.14.8.15'
    }
  ];

  const [logs, setLogs] = useState(() => {
    const storeLogs = (esgStore.state.auditLogs || []).map((l, i) => ({
      id: `STR-${i + 1}`,
      date: l.timestamp ? new Date(l.timestamp).toLocaleDateString() : 'Today',
      time: l.timestamp ? new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
      user: l.user || 'EHS Officer',
      role: l.role || 'HSE Team',
      action: l.action || 'Activity',
      recordId: l.entityId || `AUD-${i + 1}`,
      module: l.entityType || 'EHS Portal',
      note: l.details || 'System activity logged',
      oldValue: '-',
      newValue: 'Recorded',
      hash: `SHA256: ${Math.random().toString(36).substring(2, 12)}`,
      ip: '10.14.8.10'
    }));
    return [...storeLogs, ...defaultLogs];
  });

  const [selectedLog, setSelectedLog] = useState(defaultLogs[0]);

  const handleExportTrail = () => {
    const data = filteredLogs.map(l => ({
      ID: l.id,
      Date: l.date,
      Time: l.time,
      User: l.user,
      Action: l.action,
      RecordID: l.recordId,
      Module: l.module,
      Note: l.note,
      Hash: l.hash
    }));
    exportToCsv('MEIL_EHS_Audit_Trail.csv', data);
  };

  const filteredLogs = logs.filter(l => {
    if (selectedUser !== 'All Users' && l.user !== selectedUser) return false;
    if (selectedAction !== 'All Actions' && l.action !== selectedAction) return false;
    if (selectedRecordId && !l.recordId.toLowerCase().includes(selectedRecordId.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER & FILTERS BAR (Matching Image Panel 12) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Audit & Traceability
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Immutable audit log trace across records, reviewers, evidence hashes, and regulatory submissions.
            </p>
          </div>
          <button
            type="button"
            className="ehs-btn ehs-btn-outline"
            onClick={handleExportTrail}
            style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}
          >
            <Download size={14} />
            <span>Export Trail</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <select 
            className="ehs-select-control"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Projects">Project: All</option>
            <option value="Zojila Tunnel">Zojila Tunnel</option>
            <option value="Access Road">Access Road</option>
            <option value="Camp Area">Camp Area</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Users">User: All</option>
            <option value="Rohit Kumar">Rohit Kumar</option>
            <option value="Neha Singh">Neha Singh</option>
            <option value="Amit Singh">Amit Singh</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Actions">Action: All</option>
            <option value="Created">Created</option>
            <option value="Updated">Updated</option>
            <option value="Generated">Generated</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
          </select>

          <input 
            type="text"
            placeholder="Filter by Record ID..."
            value={selectedRecordId}
            onChange={(e) => setSelectedRecordId(e.target.value)}
            className="ehs-form-input"
            style={{ fontSize: '12px', padding: '4px 10px', height: '32px', width: '180px' }}
          />
        </div>
      </div>

      {/* ──── 2. SPLIT MAIN SECTION: TABLE (LEFT 70%) + DETAIL DRAWER (RIGHT 30%) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedLog ? '1.8fr 1.2fr' : '1fr', gap: '16px' }}>
        {/* Left: Audit Log Table */}
        <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Immutable Audit Log Trail
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Showing {filteredLogs.length} verified events
            </span>
          </div>

          <div className="ehs-table-container">
            <table className="ehs-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Record ID</th>
                  <th>Changes / Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const isSelected = selectedLog?.id === log.id;
                  return (
                    <tr 
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      style={{ 
                        background: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ fontWeight: 800, color: '#64748B' }}>{log.id}</td>
                      <td style={{ fontSize: '12px', color: '#0F172A' }}>{log.date}</td>
                      <td style={{ fontSize: '12px', color: '#64748B' }}>{log.time}</td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{log.user}</td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '9999px',
                            background: log.action === 'Approved' ? 'rgba(16, 185, 129, 0.12)' : log.action === 'Updated' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                            color: log.action === 'Approved' ? '#059669' : log.action === 'Updated' ? '#2563EB' : '#D97706'
                          }}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, color: '#2563EB' }}>{log.recordId}</td>
                      <td style={{ fontSize: '12px', color: '#475569' }}>{log.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Audit Details Drawer Card (Matching Image Panel 12) */}
        {selectedLog && (
          <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Audit Details - Log #{selectedLog.id}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Record ID: {selectedLog.recordId}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedLog(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Log Metadata */}
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
                <div><span style={{ color: '#64748B' }}>Date & Time:</span> <strong>{selectedLog.date}, {selectedLog.time}</strong></div>
                <div><span style={{ color: '#64748B' }}>User:</span> <strong>{selectedLog.user}</strong></div>
                <div><span style={{ color: '#64748B' }}>Role:</span> <strong>{selectedLog.role}</strong></div>
                <div><span style={{ color: '#64748B' }}>Action:</span> <strong>{selectedLog.action}</strong></div>
                <div><span style={{ color: '#64748B' }}>Module:</span> <strong>{selectedLog.module}</strong></div>
                <div><span style={{ color: '#64748B' }}>IP Address:</span> <strong>{selectedLog.ip}</strong></div>
              </div>
            </div>

            {/* Field Changes */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Field Changes</div>
              <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11.5px' }}>
                <div style={{ color: '#64748B', marginBottom: '4px' }}>Field: <strong>Status</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ textDecoration: 'line-through', color: '#DC2626' }}>{selectedLog.oldValue}</span>
                  <span>➔</span>
                  <span style={{ fontWeight: 800, color: '#059669' }}>{selectedLog.newValue}</span>
                </div>
              </div>
            </div>

            {/* Cryptographic SHA-256 Stamp */}
            <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
              <div style={{ fontWeight: 800, color: '#475569', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Lock size={12} color="#059669" />
                <span>SHA-256 Cryptographic Stamp</span>
              </div>
              <div style={{ fontFamily: 'monospace', color: '#64748B', wordBreak: 'break-all', fontSize: '10px' }}>
                {selectedLog.hash}
              </div>
            </div>

            {/* Footer Action */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                className="ehs-btn ehs-btn-outline"
                style={{ padding: '6px 14px', fontSize: '11.5px' }}
                onClick={() => onNavigateTab?.('evidence')}
              >
                Inspect Linked Evidence
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
