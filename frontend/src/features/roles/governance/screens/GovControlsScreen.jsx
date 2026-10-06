import React, { useState } from 'react';
import {
  Plus,
  Eye,
  ChevronRight,
  ChevronLeft,
  Download,
  CheckCircle2,
  Play
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function GovControlsScreen({
  controls = [],
  onOpenAddControl,
  onNavigateTab
}) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [selectedControl, setSelectedControl] = useState(null);
  const [localControls, setLocalControls] = useState(controls);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newControl, setNewControl] = useState({
    name: '',
    type: 'Preventive',
    obligation: 'Companies Act Sec 134(5)',
    owner: 'Legal',
    testMethod: 'Automated policy reconciliation'
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newControl.name) return;
    const item = {
      id: `CTL-${Date.now().toString().slice(-4)}`,
      name: newControl.name,
      type: newControl.type,
      obligation: newControl.obligation,
      owner: newControl.owner,
      lastTest: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      result: 'Effective',
      status: 'Active',
      testMethod: newControl.testMethod
    };
    setLocalControls(prev => [item, ...prev]);
    setIsAddOpen(false);
    setNewControl({ name: '', type: 'Preventive', obligation: 'Companies Act Sec 134(5)', owner: 'Legal', testMethod: 'Automated policy reconciliation' });
  };

  React.useEffect(() => {
    if (controls && controls.length > 0) {
      setLocalControls(controls);
    }
  }, [controls]);

  const handleExport = () => {
    const rows = localControls.map(c => ({
      ID: c.id,
      Name: c.name,
      Type: c.type,
      Obligation: c.obligation,
      Owner: c.owner,
      LastTest: c.lastTest,
      Result: c.result,
      Status: c.status,
      TestMethod: c.testMethod || 'Automated reconciliation'
    }));
    exportToCsv('MEIL_Compliance_Controls', rows);
  };

  const handleRunTest = (id) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setLocalControls(prev => prev.map(c => c.id === id ? { ...c, lastTest: today, result: 'Effective', status: 'Active' } : c));
    if (selectedControl && selectedControl.id === id) {
      setSelectedControl({ ...selectedControl, lastTest: today, result: 'Effective', status: 'Active' });
    }
  };

  const filtered = localControls.filter(c => {
    const matchesType = typeFilter === 'all' || c.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    const matchesOwner = ownerFilter === 'all' || c.owner.toLowerCase() === ownerFilter.toLowerCase();
    return matchesType && matchesStatus && matchesOwner;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Compliance Controls</h1>
            <p>Manage preventive, detective and corrective controls.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="preventive">Preventive</option>
              <option value="detective">Detective</option>
              <option value="it automated">IT Automated</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="needs-action">Needs Action</option>
              <option value="under-review">Under Review</option>
            </select>
            <select 
              className="gov-select-pill"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <option value="all">Owner</option>
              <option value="procurement">Procurement</option>
              <option value="finance">Finance</option>
              <option value="it">IT</option>
              <option value="esg">ESG</option>
              <option value="legal">Legal</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenAddControl || (() => setIsAddOpen(true))}
            >
              <Plus size={15} />
              Add Control
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExport}
              title="Export Controls to CSV"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ──── CONTROLS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Control ID</th>
                <th>Control Name</th>
                <th>Type</th>
                <th>Obligation</th>
                <th>Owner</th>
                <th>Last Test</th>
                <th>Result</th>
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
                    {item.name}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: item.type === 'IT Automated' ? '#EFF6FF' : '#F1F5F9', 
                      color: item.type === 'IT Automated' ? '#2563EB' : '#475569',
                      fontSize: '12px'
                    }}>
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <span 
                      style={{ color: '#2563EB', fontWeight: 500, cursor: 'pointer' }}
                      onClick={() => onNavigateTab?.('obligations')}
                    >
                      {item.obligation}
                    </span>
                  </td>
                  <td>{item.owner}</td>
                  <td>{item.lastTest}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.result.toLowerCase()}`}>
                      {item.result}
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
                      title="Inspect / Test Control"
                      onClick={() => setSelectedControl(item)}
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
          <span>Showing 1 to {filtered.length} of {localControls.length} controls</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled><ChevronLeft size={14} /></button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* TEST / INSPECT CONTROL MODAL */}
      {selectedControl && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className={`gov-status-chip gov-status-${selectedControl.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedControl.status}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedControl.id} - {selectedControl.name}</h3>
              </div>
              <button onClick={() => setSelectedControl(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Type:</strong> {selectedControl.type}</div>
              <div><strong>Obligation:</strong> {selectedControl.obligation}</div>
              <div><strong>Owner:</strong> {selectedControl.owner}</div>
              <div><strong>Last Tested:</strong> {selectedControl.lastTest}</div>
              <div><strong>Test Result:</strong> <span style={{ color: selectedControl.result === 'Effective' ? '#16A34A' : '#D97706', fontWeight: 700 }}>{selectedControl.result}</span></div>
              <div><strong>Test Method:</strong> {selectedControl.testMethod || 'Automated reconciliation'}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => setSelectedControl(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="gov-btn gov-btn-primary"
                onClick={() => handleRunTest(selectedControl.id)}
              >
                <Play size={13} style={{ marginRight: 4 }} />
                Execute Verification Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CONTROL MODAL */}
      {isAddOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 480, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Add Compliance Control</h3>
              <button onClick={() => setIsAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Control Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Automated Supplier ESG Screening"
                    value={newControl.name}
                    onChange={(e) => setNewControl({ ...newControl, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Control Type</label>
                    <select
                      value={newControl.type}
                      onChange={(e) => setNewControl({ ...newControl, type: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    >
                      <option value="Preventive">Preventive</option>
                      <option value="Detective">Detective</option>
                      <option value="Corrective">Corrective</option>
                      <option value="IT Automated">IT Automated</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Control Owner</label>
                    <select
                      value={newControl.owner}
                      onChange={(e) => setNewControl({ ...newControl, owner: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    >
                      <option value="Procurement">Procurement</option>
                      <option value="Finance">Finance</option>
                      <option value="Legal">Legal</option>
                      <option value="IT">IT</option>
                      <option value="ESG">ESG</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Associated Obligation</label>
                  <input
                    type="text"
                    value={newControl.obligation}
                    onChange={(e) => setNewControl({ ...newControl, obligation: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Testing & Verification Method</label>
                  <input
                    type="text"
                    value={newControl.testMethod}
                    onChange={(e) => setNewControl({ ...newControl, testMethod: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
                <button
                  type="button"
                  className="gov-btn gov-btn-outline"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gov-btn gov-btn-primary"
                >
                  Save & Activate Control
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
