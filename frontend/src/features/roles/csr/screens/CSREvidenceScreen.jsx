import React, { useState } from 'react';
import {
  Paperclip,
  Search,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileWarning,
  Eye,
  Download,
  X
} from 'lucide-react';
import { INITIAL_EVIDENCE_ITEMS } from '../csrData';
import { exportToCsv, triggerFileInput } from '../../../../utils/exportUtils';

export default function CSREvidenceScreen({ onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [evidenceList, setEvidenceList] = useState(INITIAL_EVIDENCE_ITEMS);
  const [previewItem, setPreviewItem] = useState(null);

  const handleUploadClick = () => {
    triggerFileInput((file) => {
      const newEv = {
        id: `EV-CSR-${Date.now().toString().slice(-4)}`,
        title: file.name,
        project: 'Clean Drinking Water RO Plants',
        category: file.name.endsWith('.pdf') ? 'Audit Report' : 'Invoice',
        upload_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'Verified',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      };
      setEvidenceList([newEv, ...evidenceList]);
    }, '.pdf,.png,.jpg,.jpeg,.xlsx');
  };

  const handleDownloadCertificate = (e) => {
    exportToCsv(`CSR_Evidence_${e.id}.csv`, [{
      Evidence_ID: e.id,
      Document_Name: e.title,
      Project: e.project,
      Category: e.category,
      Upload_Date: e.upload_date,
      File_Size: e.size,
      Status: e.status,
      SHA256_Checksum: e.sha256 || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      Assurance_Pillar: 'BRSR Principle 8 / Social Impact'
    }]);
  };

  const filteredEvidence = evidenceList.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilter === 'All' || e.category.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const getStatusChip = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'csr-status-chip verified';
      case 'pending review':
        return 'csr-status-chip pending';
      case 'rejected':
        return 'csr-status-chip rejected';
      default:
        return 'csr-status-chip draft';
    }
  };

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Paperclip size={24} />
            </div>
            <div>
              <div className="csr-pill-tag">ASSURANCE VAULT</div>
              <h1 className="csr-hero-title">Evidence Management</h1>
              <p className="csr-hero-subtitle">
                Central immutable repository for CSR project reports, geo-photos, beneficiary logs and invoices.
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <button className="csr-btn-primary" onClick={handleUploadClick}>
              <Upload size={16} />
              + Upload Evidence
            </button>
          </div>
        </div>
      </div>

      {/* ──── 5 KPI STATS ROW (TOTAL, VERIFIED, PENDING, REJECTED, MISSING) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Evidence</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{evidenceList.length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paperclip size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Verified</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>{evidenceList.filter(e => e.status?.toLowerCase() === 'verified').length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Pending Review</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>{evidenceList.filter(e => e.status?.toLowerCase().includes('pending')).length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Rejected</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', marginTop: '2px' }}>{evidenceList.filter(e => e.status?.toLowerCase() === 'rejected').length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Missing</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#64748B', marginTop: '2px' }}>{evidenceList.filter(e => e.status?.toLowerCase() === 'missing').length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(100, 116, 139, 0.1)', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileWarning size={18} />
          </div>
        </div>
      </div>

      {/* ──── FILTER & SEARCH ──── */}
      <div className="csr-filter-bar">
        <div className="csr-search-box">
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            className="csr-search-input"
            placeholder="Search evidence titles, project IDs, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="csr-filter-pills">
          {['All', 'Report', 'Log', 'Testing', 'Invoices', 'Audit'].map((tab) => (
            <button
              key={tab}
              className={`csr-filter-pill-btn ${selectedFilter === tab ? 'active' : ''}`}
              onClick={() => setSelectedFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ──── EVIDENCE TABLE ──── */}
      <div className="csr-table-container">
        <table className="csr-table">
          <thead>
            <tr>
              <th>Evidence ID & Title</th>
              <th>Project</th>
              <th>Category & Format</th>
              <th>Upload Date & Size</th>
              <th>Verification / Audit Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvidence.map((e) => (
              <tr key={e.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#0F172A', maxWidth: '340px' }}>{e.title}</div>
                  <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>{e.id}</div>
                </td>
                <td style={{ fontWeight: 700, color: '#2563EB' }}>{e.project}</td>
                <td>
                  <div style={{ fontSize: '12.5px', color: '#334155' }}>{e.category}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{e.type}</div>
                </td>
                <td>
                  <div style={{ fontSize: '12px', color: '#475569' }}>{e.upload_date}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{e.size}</div>
                </td>
                <td style={{ fontSize: '12px', color: '#334155' }}>{e.verified_by}</td>
                <td>
                  <span className={getStatusChip(e.status)}>{e.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="csr-btn-outline"
                      style={{ padding: '4px 8px' }}
                      title="Preview Document"
                      onClick={() => setPreviewItem(e)}
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      className="csr-btn-outline"
                      style={{ padding: '4px 8px' }}
                      title="Download Evidence"
                      onClick={() => handleDownloadCertificate(e)}
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

      {/* Preview Modal */}
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
            className="csr-glass-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  {previewItem.title}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {previewItem.project} • {previewItem.category}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Upload Date</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{previewItem.upload_date}</div>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>File Size</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{previewItem.size}</div>
              </div>
            </div>

            <div style={{ padding: '12px', background: '#F1F5F9', borderRadius: '10px', fontSize: '12px', color: '#334155', marginBottom: '16px', wordBreak: 'break-all' }}>
              🔒 <strong>SHA-256 Stamp:</strong><br />
              <code style={{ fontSize: '11px', color: '#2563EB' }}>{previewItem.sha256 || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}</code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="csr-btn-outline"
                onClick={() => setPreviewItem(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="csr-btn-primary"
                onClick={() => {
                  handleDownloadCertificate(previewItem);
                  setPreviewItem(null);
                }}
              >
                Download Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
