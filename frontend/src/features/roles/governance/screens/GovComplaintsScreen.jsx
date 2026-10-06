import React, { useState } from 'react';
import {
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ChevronRight,
  ChevronLeft,
  Download
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function GovComplaintsScreen({
  complaints = [],
  onOpenRegisterComplaint,
  onNavigateTab
}) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [localComplaints, setLocalComplaints] = useState(complaints);
  const [newComp, setNewComp] = useState({
    type: 'Community',
    project: 'Polavaram Hydroelectric Project (AP)',
    severity: 'Medium',
    description: 'Local village council representation regarding water tanker scheduling'
  });

  React.useEffect(() => {
    if (complaints && complaints.length > 0) {
      setLocalComplaints(complaints);
    }
  }, [complaints]);

  const handleExport = () => {
    const rows = localComplaints.map(c => ({
      ID: c.id,
      Type: c.type,
      Project: c.project,
      Severity: c.severity,
      Status: c.status,
      Date: c.date,
      Resolution: c.resolution
    }));
    exportToCsv('MEIL_Stakeholder_Grievances', rows);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `GRV-GOV-${Date.now().toString().slice(-4)}`,
      type: newComp.type,
      project: newComp.project,
      severity: newComp.severity,
      description: newComp.description,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Open',
      resolution: 'Grievance officer assigned for field inquiry'
    };
    setLocalComplaints([created, ...localComplaints]);
    setIsRegisterOpen(false);
  };

  const handleResolveGrievance = (id) => {
    setLocalComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved', resolution: 'Issue resolved with stakeholder concurrence.' } : c));
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint({ ...selectedComplaint, status: 'Resolved', resolution: 'Issue resolved with stakeholder concurrence.' });
    }
  };

  const filtered = localComplaints.filter(c => {
    const matchesType = typeFilter === 'all' || c.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    return matchesType && matchesStatus;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Complaints & Grievances</h1>
            <p>Track governance and stakeholder complaints.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Type</option>
              <option value="community">Community</option>
              <option value="hr related">HR Related</option>
              <option value="vendor">Vendor</option>
              <option value="environmental">Environmental</option>
              <option value="safety">Safety</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="open">Open</option>
              <option value="under-review">Under Review</option>
              <option value="investigation">Investigation</option>
              <option value="resolved">Resolved</option>
            </select>
            <select className="gov-select-pill" defaultValue="all-date">
              <option value="all-date">Date range</option>
              <option value="sep">Sep 2026</option>
              <option value="q3">Last 90 Days</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenRegisterComplaint || (() => setIsRegisterOpen(true))}
            >
              <Plus size={15} />
              Register Complaint
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExport}
              title="Export Grievances to CSV"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ──── 4 KPI CARDS ──── */}
      <div className="gov-kpi-grid-4">
        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Total Complaints</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">24</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Open</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-amber">
              <Clock size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#D97706' }}>8</span>
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
            <span className="gov-kpi-value" style={{ color: '#DC2626' }}>3</span>
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
            <span className="gov-kpi-value" style={{ color: '#16A34A' }}>16</span>
          </div>
        </div>
      </div>

      {/* ──── COMPLAINTS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Type</th>
                <th>Project / Area</th>
                <th>Date</th>
                <th>Severity</th>
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
                    {item.type}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#F1F5F9', 
                      fontSize: '12px',
                      color: '#475569' 
                    }}>
                      {item.project}
                    </span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`gov-priority-chip gov-priority-${item.severity.toLowerCase()}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Grievance"
                      onClick={() => setSelectedComplaint(item)}
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
          <span>Showing 1 to {filtered.length} of {localComplaints.length} complaints</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled><ChevronLeft size={14} /></button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* VIEW GRIEVANCE MODAL */}
      {selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 500, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className={`gov-status-chip gov-status-${selectedComplaint.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedComplaint.status}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedComplaint.id} - {selectedComplaint.type}</h3>
              </div>
              <button onClick={() => setSelectedComplaint(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Project:</strong> {selectedComplaint.project}</div>
              <div><strong>Severity:</strong> <span style={{ color: selectedComplaint.severity === 'Critical' ? '#DC2626' : '#D97706', fontWeight: 700 }}>{selectedComplaint.severity}</span></div>
              <div><strong>Date:</strong> {selectedComplaint.date}</div>
              <div><strong>Status:</strong> {selectedComplaint.status}</div>
            </div>
            <div style={{ marginTop: 14, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
              <strong>Description:</strong> {selectedComplaint.description}
            </div>
            {selectedComplaint.resolution && (
              <div style={{ marginTop: 10, fontSize: '13px', color: '#166534', background: '#F0FDF4', padding: 10, borderRadius: 8 }}>
                <strong>Resolution Status:</strong> {selectedComplaint.resolution}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => setSelectedComplaint(null)}
              >
                Close
              </button>
              {selectedComplaint.status !== 'Resolved' && (
                <button
                  type="button"
                  className="gov-btn gov-btn-primary"
                  onClick={() => handleResolveGrievance(selectedComplaint.id)}
                >
                  <CheckCircle2 size={14} style={{ marginRight: 4 }} />
                  Resolve Grievance
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REGISTER GRIEVANCE MODAL */}
      {isRegisterOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Register Stakeholder Grievance</h3>
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Grievance Category</label>
                <select
                  value={newComp.type}
                  onChange={e => setNewComp({ ...newComp, type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                >
                  <option value="Community">Community</option>
                  <option value="HR Related">HR Related</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Project Site</label>
                  <input
                    type="text"
                    required
                    value={newComp.project}
                    onChange={e => setNewComp({ ...newComp, project: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Severity</label>
                  <select
                    value={newComp.severity}
                    onChange={e => setNewComp({ ...newComp, severity: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Grievance Details</label>
                <textarea
                  rows={4}
                  required
                  value={newComp.description}
                  onChange={e => setNewComp({ ...newComp, description: e.target.value })}
                  placeholder="Detail the stakeholder complaint, location, and requested resolution..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', marginTop: 4 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 12 }}>
                <button type="button" className="gov-btn gov-btn-outline" onClick={() => setIsRegisterOpen(false)}>Cancel</button>
                <button type="submit" className="gov-btn gov-btn-primary">Register Grievance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
