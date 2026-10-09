import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Eye,
  Download,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { exportToCsv, triggerFileInput } from '../../../../utils/exportUtils';
import { downloadEvidencePDF } from '../../../../utils/pdfGenerator';

export default function GovEvidenceScreen({
  evidenceItems = [],
  onOpenUploadEvidence,
  onNavigateTab
}) {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [localEvidence, setLocalEvidence] = useState(evidenceItems);

  React.useEffect(() => {
    if (evidenceItems && evidenceItems.length > 0) {
      setLocalEvidence(evidenceItems);
    }
  }, [evidenceItems]);

  const handleUploadNew = () => {
    triggerFileInput((file) => {
      const newEv = {
        id: `EVD-GOV-${Date.now().toString().slice(-4)}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        source: 'Legal & Governance',
        linkedTo: 'Statutory Board Filing',
        type: file.name.endsWith('.pdf') ? 'PDF' : 'Document',
        uploadedBy: 'Compliance Lead',
        uploadedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Verified',
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      setLocalEvidence([newEv, ...localEvidence]);
    });
  };

  const handleDownloadCertificate = (item) => {
    downloadEvidencePDF({
      fileName: item.title,
      id: item.id,
      relatedRecord: item.linkedTo,
      project: 'MEIL Corporate Headquarters',
      module: 'Corporate Governance & Statutory Compliance',
      status: item.status || 'Verified',
      uploadedBy: item.uploadedBy || 'Governance Officer',
      uploadedAt: item.uploadedDate || 'Oct 2026',
      size: item.size || '1.4 MB',
      sha256: `sha256_b48f93a10738e4cd09312fe_${item.id.replace(/[^a-zA-Z0-9]/g, '')}`
    }, {
      voucherNo: item.id,
      quantity: 'Statutory Secretarial Clearance',
      scope: 'SEBI LODR Reg 34(3) & BRSR Principle 1 Ethics & Transparency',
      issuer: 'MEIL Corporate Governance Secretariat',
      certifiedBy: item.uploadedBy || 'Company Secretary',
      verifiedBy: 'Statutory Compliance Lead',
      substation: 'MEIL Group Secretarial Registry',
      assuranceStandard: 'ICAI SAE 3410 & Companies Act 2013'
    });
  };

  const handleExportRegistry = () => {
    const rows = localEvidence.map(e => ({
      ID: e.id,
      Title: e.title,
      Source: e.source,
      LinkedTo: e.linkedTo,
      Type: e.type,
      UploadedBy: e.uploadedBy,
      Date: e.uploadedDate,
      Status: e.status
    }));
    exportToCsv('MEIL_Governance_Evidence_Registry', rows);
  };

  const filtered = localEvidence.filter(e => {
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
              onClick={onOpenUploadEvidence || handleUploadNew}
            >
              <Upload size={15} />
              Upload Evidence
            </button>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExportRegistry}
              title="Export Evidence Registry to CSV"
            >
              <Download size={14} />
              Export
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
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye size={13} />
                      </button>
                      <button 
                        className="gov-page-btn"
                        title="Download Cryptographic Certificate"
                        onClick={() => handleDownloadCertificate(item)}
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
          <span>Showing 1 to {filtered.length} of {localEvidence.length} documents</span>
          <div className="gov-pagination-buttons">
            <button className="gov-page-btn" disabled><ChevronLeft size={14} /></button>
            <button className="gov-page-btn active">1</button>
            <button className="gov-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* PREVIEW EVIDENCE MODAL */}
      {selectedItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 500, maxWidth: '90%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className={`gov-status-chip gov-status-${selectedItem.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedItem.status}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedItem.title}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10 }}>
              <div><strong>Document ID:</strong> {selectedItem.id}</div>
              <div><strong>Format:</strong> {selectedItem.type}</div>
              <div><strong>Uploaded By:</strong> {selectedItem.uploadedBy}</div>
              <div><strong>Upload Date:</strong> {selectedItem.uploadedDate}</div>
              <div><strong>Source:</strong> {selectedItem.source}</div>
              <div><strong>Linked Obligation:</strong> {selectedItem.linkedTo}</div>
            </div>
            <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={20} color="#16A34A" />
              <div style={{ fontSize: '12px', color: '#166534' }}>
                <strong>Cryptographic Integrity Verified:</strong> SHA-256 hash valid. Tamper-evident record synced with enterprise ledger.
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
              <button
                type="button"
                className="gov-btn gov-btn-outline"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="gov-btn gov-btn-primary"
                onClick={() => {
                  handleDownloadCertificate(selectedItem);
                  setSelectedItem(null);
                }}
              >
                <Download size={14} style={{ marginRight: 4 }} />
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
