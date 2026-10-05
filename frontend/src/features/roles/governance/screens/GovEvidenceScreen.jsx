import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Eye,
  Download,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function GovEvidenceScreen({
  evidenceItems = [],
  onOpenUploadEvidence,
  onNavigateTab
}) {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = evidenceItems.filter(e => {
    const matchesStatus = statusFilter === 'all' || e.status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    const matchesType = typeFilter === 'all' || e.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesStatus && matchesType;
  });

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Evidence Management</h1>
            <p>Upload and verify evidence for governance and compliance.</p>
          </div>
          <div className="gov-header-controls">
            <select className="gov-select-pill" defaultValue="all">
              <option value="all">All Sources</option>
              <option value="pol">Policies</option>
              <option value="ctr">Controls</option>
              <option value="as">Assessments</option>
              <option value="grv">Grievances</option>
              <option value="dsc">Disclosures</option>
            </select>
            <select 
              className="gov-select-pill"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="verified">Verified</option>
              <option value="pending-review">Pending Review</option>
              <option value="in-review">In Review</option>
              <option value="under-review">Under Review</option>
            </select>
            <select 
              className="gov-select-pill"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Document Type</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
            </select>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenUploadEvidence}
            >
              <Upload size={15} />
              Upload Evidence
            </button>
          </div>
        </div>
      </div>

      {/* ──── EVIDENCE TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Evidence ID</th>
                <th>Title</th>
                <th>Linked To</th>
                <th>Type</th>
                <th>Uploaded Date</th>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={15} style={{ color: '#2563EB', flexShrink: 0 }} />
                      <span>{item.title}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      style={{ color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => {
                        if (item.linkedTo.startsWith('POL')) onNavigateTab?.('policies');
                        else if (item.linkedTo.startsWith('CTR')) onNavigateTab?.('controls');
                        else if (item.linkedTo.startsWith('GRV')) onNavigateTab?.('grievances');
                        else if (item.linkedTo.startsWith('AS')) onNavigateTab?.('assessments');
                        else onNavigateTab?.('disclosures');
                      }}
                    >
                      {item.linkedTo}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      background: '#F1F5F9', 
                      fontSize: '12px',
                      color: '#475569' 
                    }}>
                      {item.type}
                    </span>
                  </td>
                  <td>{item.uploadedDate}</td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        className="gov-page-btn"
                        title="Preview Evidence"
                        onClick={() => alert(`Previewing ${item.title} (${item.id})\nLinked To: ${item.linkedTo}\nUploaded By: ${item.uploadedBy}`)}
                      >
                        <Eye size={13} />
                      </button>
                      <button 
                        className="gov-page-btn"
                        title="Download Document"
                        onClick={() => alert(`Downloading ${item.title}...`)}
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ──── PAGINATION ROW ──── */}
        <div className="gov-pagination-row">
          <span>Showing 1 to {filtered.length} of {evidenceItems.length} documents</span>
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
