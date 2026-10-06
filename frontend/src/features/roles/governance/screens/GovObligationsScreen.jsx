import React, { useState } from 'react';
import {
  Plus,
  Upload,
  Download,
  ChevronRight,
  ChevronLeft,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { exportToCsv, triggerFileInput } from '../../../../utils/exportUtils';

export default function GovObligationsScreen({
  obligations = [],
  onOpenAddObligation,
  onNavigateTab
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedObligation, setSelectedObligation] = useState(null);
  const [localObligations, setLocalObligations] = useState(obligations);

  React.useEffect(() => {
    if (obligations && obligations.length > 0) {
      setLocalObligations(obligations);
    }
  }, [obligations]);

  const handleImport = () => {
    triggerFileInput((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        if (lines.length > 1) {
          const newItems = lines.slice(1).map((line, idx) => {
            const parts = line.split(',');
            return {
              id: `CO-IMP-${Date.now()}-${idx}`,
              requirement: parts[0]?.trim() || 'Imported Compliance Obligation',
              source: parts[1]?.trim() || 'Statutory Authority',
              owner: parts[2]?.trim() || 'Compliance Dept',
              ownerName: parts[2]?.trim() || 'Compliance Lead',
              dueDate: parts[3]?.trim() || '31 Dec 2026',
              status: 'In Progress',
              evidence: 'In Review',
              category: 'Legal'
            };
          });
          setLocalObligations(prev => [...newItems, ...prev]);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleExport = () => {
    const rows = localObligations.map(o => ({
      ID: o.id,
      Requirement: o.requirement,
      Source: o.source,
      Owner: o.ownerName || o.owner,
      DueDate: o.dueDate,
      Status: o.status,
      Evidence: o.evidence,
      Category: o.category
    }));
    exportToCsv('MEIL_Compliance_Obligations', rows);
  };

  const handleMarkCompliant = (id) => {
    setLocalObligations(prev => prev.map(o => o.id === id ? { ...o, status: 'Compliant', evidence: 'Verified' } : o));
    if (selectedObligation && selectedObligation.id === id) {
      setSelectedObligation({ ...selectedObligation, status: 'Compliant', evidence: 'Verified' });
    }
  };

  const filtered = localObligations.filter(item => {
    const matchesSearch = item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Compliance Obligations</h1>
            <p>Track applicable regulatory, legal and internal obligations.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="legal">Legal</option>
              <option value="esg">ESG</option>
              <option value="governance">Governance</option>
              <option value="social">Social</option>
              <option value="environmental">Environmental</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="in-progress">In Progress</option>
              <option value="pending-review">Pending Review</option>
              <option value="due-soon">Due Soon</option>
              <option value="overdue">Overdue</option>
            </select>
            <select className="gov-select-pill" defaultValue="all-date">
              <option value="all-date">Due Date</option>
              <option value="sep">Sep 2026</option>
              <option value="oct">Oct 2026</option>
              <option value="nov">Nov 2026</option>
              <option value="dec">Dec 2026</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenAddObligation}
            >
              <Plus size={15} />
              Add Obligation
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleImport}
              title="Import Obligations from CSV"
            >
              <Upload size={14} />
              Import
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExport}
              title="Export Obligations to CSV"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ──── OBLIGATIONS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Obligation ID</th>
                <th>Requirement</th>
                <th>Source</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Evidence</th>
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
                    {item.requirement}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#F1F5F9', 
                      fontSize: '12px',
                      color: '#475569' 
                    }}>
                      {item.source}
                    </span>
                  </td>
                  <td>{item.owner}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '12px', 
                      color: item.evidence === 'Verified' ? '#16A34A' : '#D97706',
                      fontWeight: 500 
                    }}>
                      {item.evidence}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="gov-page-btn"
                      title="View Details"
                      onClick={() => setSelectedObligation(item)}
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
          <span>Showing 1 to {filtered.length} of {localObligations.length} obligations</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled><ChevronLeft size={14} /></button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedObligation && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 500, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className={`gov-status-chip gov-status-${selectedObligation.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedObligation.status}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedObligation.id}</h3>
              </div>
              <button onClick={() => setSelectedObligation(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Requirement:</strong> {selectedObligation.requirement}</div>
              <div><strong>Source:</strong> {selectedObligation.source}</div>
              <div><strong>Owner:</strong> {selectedObligation.ownerName || selectedObligation.owner}</div>
              <div><strong>Due Date:</strong> {selectedObligation.dueDate}</div>
              <div><strong>Category:</strong> {selectedObligation.category}</div>
              <div><strong>Evidence Status:</strong> {selectedObligation.evidence}</div>
            </div>
            {selectedObligation.description && (
              <div style={{ marginTop: 14, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                <strong>Statutory Scope:</strong> {selectedObligation.description}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => setSelectedObligation(null)}
              >
                Close
              </button>
              {selectedObligation.status !== 'Compliant' && (
                <button
                  type="button"
                  className="gov-btn gov-btn-primary"
                  onClick={() => handleMarkCompliant(selectedObligation.id)}
                >
                  <CheckCircle2 size={14} style={{ marginRight: 4 }} />
                  Mark Compliant
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
