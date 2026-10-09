import React, { useState } from 'react';
import {
  Upload,
  Search,
  Eye,
  FileText,
  Download,
  X,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { triggerFileInput, exportToCsv } from '../../../../utils/exportUtils';
import { downloadEvidencePDF } from '../../../../utils/pdfGenerator';

export default function ProcurementEvidenceScreen({
  evidence = [],
  onNavigateTab
}) {
  const [localEvidence, setLocalEvidence] = useState(evidence);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedType, setSelectedType] = useState('All Evidence Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPeriod, setSelectedPeriod] = useState('Sep 2026');
  const [previewItem, setPreviewItem] = useState(null);

  React.useEffect(() => {
    if (evidence && evidence.length > 0) {
      setLocalEvidence(evidence);
    }
  }, [evidence]);

  const handleUploadClick = () => {
    triggerFileInput((file) => {
      const newEv = {
        id: `EV-26-${Math.floor(100 + Math.random() * 900)}`,
        title: file.name,
        linkedTo: selectedSupplier !== 'All Suppliers' ? selectedSupplier : 'ABC Construction Ltd.',
        type: file.name.endsWith('.pdf') ? 'Certification' : 'Invoice',
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Verified',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      setLocalEvidence(prev => [newEv, ...prev]);
    }, '.pdf,.png,.jpg,.jpeg,.xlsx');
  };

  const handleDownloadEvidence = (ev) => {
    downloadEvidencePDF({
      fileName: ev.title,
      id: ev.id,
      relatedRecord: ev.linkedTo,
      project: ev.linkedTo || 'Supply Chain Vendor Hub',
      module: 'Procurement & Sustainable Supply Chain',
      status: ev.status || 'Verified',
      uploadedBy: 'Procurement Auditor',
      uploadedAt: ev.uploadDate,
      size: '1.6 MB',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }, {
      voucherNo: ev.id,
      quantity: 'Vendor Due Diligence ESG Compliance',
      scope: 'BRSR Principle 2 & Principle 6 · Sustainable Sourcing & Scope 3',
      issuer: 'MEIL Corporate Procurement & Materials Directorate',
      certifiedBy: 'Head of Procurement',
      verifiedBy: 'Supply Chain ESG Auditor',
      substation: ev.linkedTo || 'Central Vendor Quality Desk',
      assuranceStandard: 'ICAI SAE 3410 & ISO 20400 Sustainable Procurement'
    });
  };

  const filteredEvidence = localEvidence.filter((e) => {
    const matchesSearch =
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.linkedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier =
      selectedSupplier === 'All Suppliers' || e.linkedTo.includes(selectedSupplier);
    const matchesType =
      selectedType === 'All Evidence Types' || e.type === selectedType;
    const matchesStatus =
      selectedStatus === 'All Status' || e.status === selectedStatus;
    return matchesSearch && matchesSupplier && matchesType && matchesStatus;
  });

  const getStatusChip = (s) => {
    switch (s) {
      case 'Verified':
        return <span className="proc-status-chip verified">Verified</span>;
      case 'Pending Review':
        return <span className="proc-status-chip pending">Pending Review</span>;
      case 'Rejected':
        return <span className="proc-status-chip critical">Rejected</span>;
      default:
        return <span className="proc-status-chip low">{s}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Header & Action Controls ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Evidence Management
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Upload and manage evidence for suppliers, assessments and procurement.
            </p>
          </div>

          <button
            type="button"
            className="proc-btn proc-btn-blue"
            onClick={handleUploadClick}
            style={{ padding: '7px 14px', fontSize: '12.5px' }}
          >
            <Upload size={15} />
            <span>Upload Evidence</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div className="proc-search-bar" style={{ minWidth: '220px' }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search evidence ID, title, linked entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="proc-select-control"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Suppliers">All Suppliers</option>
            <option value="ABC Construction">ABC Construction Ltd.</option>
            <option value="TechBuild Engineers">TechBuild Engineers</option>
            <option value="Green Materials">Green Materials Pvt Ltd</option>
            <option value="SafeWorks Services">SafeWorks Services</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Evidence Types">All Evidence Types</option>
            <option value="Certification">Certification (ISO 14001/45001)</option>
            <option value="Policy">Policy Documents</option>
            <option value="Invoice">Purchase Order / Invoices</option>
            <option value="Assessment">ESG Questionnaires</option>
            <option value="Certificate">MSME / Udhyam Certificate</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Status">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="Sep 2026">Sep 2026</option>
            <option value="Aug 2026">Aug 2026</option>
            <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
          </select>
        </div>
      </div>

      {/* ──── Evidence Table ──── */}
      <div className="proc-glass-card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="proc-table-wrapper">
          <table className="proc-table">
            <thead>
              <tr>
                <th>Evidence ID</th>
                <th>Title</th>
                <th>Linked To</th>
                <th>Type</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvidence.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ fontWeight: 800, color: '#2563EB', fontFamily: 'monospace' }}>
                    {ev.id}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={15} color="#2563EB" />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{ev.title}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{ev.size || '1.8 MB'} • SHA-256 Verified</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#1E293B' }}>{ev.linkedTo}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: '#F1F5F9',
                        color: '#475569'
                      }}
                    >
                      {ev.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{ev.uploadDate}</span>
                  </td>
                  <td>{getStatusChip(ev.status)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setPreviewItem(ev)}
                        title="Preview Evidence"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2563EB'
                        }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadEvidence(ev)}
                        title="Download Document Certificate"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748B'
                        }}
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
      </div>

      {/* ──── Evidence Preview Drawer / Modal ──── */}
      {previewItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="proc-glass-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{previewItem.title}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Evidence ID: {previewItem.id} • Linked To: {previewItem.linkedTo}</div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Document Mockup View */}
            <div
              style={{
                height: '320px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0F172A', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                      MEGHA ENGINEERING & INFRASTRUCTURES LTD.
                    </h3>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>SUPPLY CHAIN ESG COMPLIANCE VERIFICATION RECORD</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748B' }}>
                    <div>Ref: {previewItem.id}</div>
                    <div>Date: {previewItem.uploadDate}</div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155' }}>
                  <p><strong>Entity Name:</strong> {previewItem.linkedTo}</p>
                  <p><strong>Document Classification:</strong> {previewItem.type}</p>
                  <p><strong>Status:</strong> {previewItem.status}</p>
                  <p><strong>Cryptographic Signature:</strong> <code>0x89f2a41d...b891e</code> (Timestamped SEBI BRSR Vault)</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed #CBD5E1' }}>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                  ✔ Third-Party Assurance Verified
                </span>
                <button
                  type="button"
                  className="proc-btn proc-btn-blue"
                  onClick={() => {
                    const content = `MEIL ESG EVIDENCE VAULT\nEvidence ID: ${previewItem.id}\nFile: ${previewItem.fileName || previewItem.name}\nScope: Value Chain Scope 3 Upstream\nAssurance Level: SEBI BRSR Core Type 2\nTimestamp: ${new Date().toISOString()}`;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${previewItem.id}_Verified_Evidence.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  <Download size={13} />
                  <span>Download Original</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
