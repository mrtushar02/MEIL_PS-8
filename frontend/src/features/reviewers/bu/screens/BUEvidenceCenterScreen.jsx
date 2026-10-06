import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Download,
  ShieldCheck,
  ExternalLink,
  Hash,
  User,
  Calendar,
  X
} from 'lucide-react';

export default function BUEvidenceCenterScreen({ evidenceList = [], onOpenSubmission }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Canonical Evidence Documents aligned with Panel 9 and seed data
  const canonicalEvidence = [
    {
      id: 'doc-001',
      document: 'Diesel_Invoice.pdf',
      project: 'Zojila Tunnel',
      pillar: 'Energy',
      linkedRecord: 'SUB-2026-091',
      uploadedBy: 'Tenzin Dorjey',
      hash: '7a3d90f2b84e1f3fa54e2098dca08129e018d9c2409b',
      status: 'Verified',
      fileSize: '1.2 MB',
      uploadDate: '26 Sep 2026, 14:45',
      vendor: 'Indian Oil Corporation (IOCL)',
      invoiceNumber: 'INV-IOCL-882910',
      quantity: '12,000 L HSD High Speed Diesel'
    },
    {
      id: 'doc-002',
      document: 'Electricity_Bill.pdf',
      project: 'Gayatri Project',
      pillar: 'Energy',
      linkedRecord: 'SUB-2026-087',
      uploadedBy: 'P. Kumar',
      hash: '9c1fe0912a4b4d2cb910f4438ad49210c483a9921b33',
      status: 'Verified',
      fileSize: '840 KB',
      uploadDate: '25 Sep 2026, 11:20',
      vendor: 'TSSPDCL Grid Supply',
      invoiceNumber: 'BILL-TS-2026-09',
      quantity: '85,000 kWh Grid Import'
    },
    {
      id: 'doc-003',
      document: 'Water_Report.xlsx',
      project: 'River Link',
      pillar: 'Water',
      linkedRecord: 'SUB-2026-058',
      uploadedBy: 'S. Mehta',
      hash: 'b41ce23049da954b77c01258a439df9012a83e0914a1',
      status: 'Pending',
      fileSize: '2.4 MB',
      uploadDate: '28 Sep 2026, 09:15',
      vendor: 'Site Flowmeter Telemetry System',
      invoiceNumber: 'WTR-LOG-2026-09',
      quantity: '55,000 KL Water Withdrawn'
    },
    {
      id: 'doc-004',
      document: 'Waste_Record.pdf',
      project: 'Tunnel B',
      pillar: 'Waste',
      linkedRecord: 'SUB-2026-084',
      uploadedBy: 'R. Singh',
      hash: '3d4ac88901be2a5cd8701923058aef114b77298510a9',
      status: 'Rejected',
      fileSize: '1.8 MB',
      uploadDate: '24 Sep 2026, 16:30',
      vendor: 'Green Earth Hazardous Disposals',
      invoiceNumber: 'HAZ-DISP-004',
      quantity: '14.2 MT Excavation Muck & Sludge'
    },
    {
      id: 'doc-005',
      document: 'Safety_Report.pdf',
      project: 'Metro Phase 1',
      pillar: 'Safety',
      linkedRecord: 'SUB-2026-082',
      uploadedBy: 'A. Verma',
      hash: '6c31be90451a8a1a98013e847cd0182937be41a8089c',
      status: 'Verified',
      fileSize: '3.1 MB',
      uploadDate: '27 Sep 2026, 17:05',
      vendor: 'Directorate General of Mine Safety (DGMS)',
      invoiceNumber: 'SAF-INSP-2026-09',
      quantity: '420,000 Safe Manhours Logged'
    },
    {
      id: 'doc-006',
      document: 'Diesel_Generator_Log.pdf',
      project: 'Expressway',
      pillar: 'Energy',
      linkedRecord: 'SUB-2026-048',
      uploadedBy: 'V. Joshi',
      hash: '5e87a20984cf10283b991820485a9bc8172039485721',
      status: 'Verified',
      fileSize: '1.5 MB',
      uploadDate: '23 Sep 2026, 10:45',
      vendor: 'Cummins India Generator Telemetry',
      invoiceNumber: 'DG-EXP-2026-09',
      quantity: '9,500 L Diesel Consumption'
    },
    {
      id: 'doc-007',
      document: 'Water_Recycling_Audit.pdf',
      project: 'Zojila Tunnel',
      pillar: 'Water',
      linkedRecord: 'SUB-2026-091',
      uploadedBy: 'Tenzin Dorjey',
      hash: '2b4c810982df412098ac1209348e098124b8901289cf',
      status: 'Verified',
      fileSize: '4.2 MB',
      uploadDate: '26 Sep 2026, 15:10',
      vendor: 'SGS India Environmental Testing',
      invoiceNumber: 'SGS-ENV-89102',
      quantity: '65,000 KL Water Recycled (93%)'
    },
    {
      id: 'doc-008',
      document: 'Missing_Disposal_Manifest.pdf',
      project: 'Tunnel B',
      pillar: 'Waste',
      linkedRecord: 'SUB-2026-084',
      uploadedBy: 'R. Singh',
      hash: '—',
      status: 'Missing',
      fileSize: '—',
      uploadDate: 'Overdue by 2 days',
      vendor: 'State Pollution Control Board',
      invoiceNumber: 'Pending Upload',
      quantity: 'CPCB Form 10 Hazardous Waste Manifest'
    }
  ];

  const filterTabs = [
    { key: 'All', label: 'All Documents', count: 14 },
    { key: 'Verified', label: 'Verified', count: 10 },
    { key: 'Pending', label: 'Pending', count: 2 },
    { key: 'Rejected', label: 'Rejected', count: 1 },
    { key: 'Missing', label: 'Missing', count: 1 }
  ];

  const filteredDocs = canonicalEvidence.filter(doc => {
    if (activeTab !== 'All' && doc.status !== activeTab) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        doc.document.toLowerCase().includes(q) ||
        doc.project.toLowerCase().includes(q) ||
        doc.linkedRecord.toLowerCase().includes(q) ||
        doc.uploadedBy.toLowerCase().includes(q) ||
        doc.pillar.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bu-evidence-center-screen">
      {/* Segmented Filter Bar */}
      <div className="bu-segmented-nav">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            className={`bu-segmented-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.label}</span>
            <span className="count-bubble">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Main Evidence Table Card */}
      <div className="bu-card" style={{ marginTop: '16px' }}>
        <div className="bu-card-header">
          <div>
            <h3 className="bu-card-title">Evidence & Verification Vault</h3>
            <p className="bu-card-subtitle">
              Cryptographically validated source evidence files supporting BRSR Core compliance
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="bu-search-bar" style={{ width: '280px', height: '36px' }}>
              <Search size={15} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search file, project, hash..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bu-table-container">
          <table className="bu-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Project</th>
                <th>Pillar</th>
                <th>Linked Record</th>
                <th>Uploaded By</th>
                <th>SHA-256 Hash</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="#2563EB" />
                      <div>
                        <span style={{ fontWeight: 600, color: '#0F172A', display: 'block' }}>
                          {doc.document}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>{doc.fileSize}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#1E293B' }}>{doc.project}</span>
                  </td>
                  <td>
                    <span className="bu-badge-neutral" style={{ fontSize: '11px' }}>
                      {doc.pillar}
                    </span>
                  </td>
                  <td>
                    <button
                      className="bu-link-btn"
                      onClick={() => onOpenSubmission && onOpenSubmission(doc.linkedRecord)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#2563EB',
                        fontFamily: 'monospace',
                        fontWeight: 600
                      }}
                    >
                      {doc.linkedRecord}
                    </button>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{doc.uploadedBy}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        color: doc.hash === '—' ? '#94A3B8' : '#475569',
                        background: doc.hash === '—' ? 'none' : '#F1F5F9',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {doc.hash !== '—' ? `${doc.hash.slice(0, 4)}...${doc.hash.slice(-4)}` : '—'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        doc.status === 'Verified'
                          ? 'bu-badge-success'
                          : doc.status === 'Pending'
                          ? 'bu-badge-warning'
                          : doc.status === 'Rejected'
                          ? 'bu-badge-danger'
                          : 'bu-badge-danger'
                      }
                      style={{ fontSize: '11px' }}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="bu-btn bu-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', height: '28px' }}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Inspection Modal */}
      {selectedDoc && (
        <div className="bu-modal-backdrop" onClick={() => setSelectedDoc(null)}>
          <div
            className="bu-modal-card"
            style={{ maxWidth: '640px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="bu-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(37,99,235,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563EB'
                  }}
                >
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="bu-modal-title">{selectedDoc.document}</h3>
                  <p className="bu-modal-subtitle">
                    Source Audit Evidence | Linked to {selectedDoc.linkedRecord}
                  </p>
                </div>
              </div>
              <button className="bu-modal-close" onClick={() => setSelectedDoc(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="bu-modal-body">
              {/* Document Certificate Card */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Cryptographic Verification</span>
                  <span
                    className={
                      selectedDoc.status === 'Verified' ? 'bu-badge-success' : 'bu-badge-warning'
                    }
                  >
                    {selectedDoc.status}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#0F172A',
                    wordBreak: 'break-all',
                    background: '#FFFFFF',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1'
                  }}
                >
                  {selectedDoc.hash}
                </div>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#16A34A' }}>
                  <ShieldCheck size={14} />
                  <span>Verified against immutable MEIL group SHA-256 ledger</span>
                </div>
              </div>

              {/* Key metadata grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Project Site</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDoc.project}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>ESG Pillar</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDoc.pillar}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Issuing Vendor / Entity</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDoc.vendor}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Invoice / Certificate No.</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDoc.invoiceNumber}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Quantity / Scope Verified</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDoc.quantity}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Uploaded By</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>
                    {selectedDoc.uploadedBy} on {selectedDoc.uploadDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="bu-modal-footer">
              <button className="bu-btn bu-btn-secondary" onClick={() => setSelectedDoc(null)}>
                Close
              </button>
              <button
                className="bu-btn bu-btn-primary"
                onClick={() => {
                  onOpenSubmission && onOpenSubmission(selectedDoc.linkedRecord);
                  setSelectedDoc(null);
                }}
              >
                <span>Inspect in Submission</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
