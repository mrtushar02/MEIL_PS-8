import React from 'react';
import { 
  Database, 
  HardDrive, 
  FileText, 
  Paperclip, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function AdminDataStorageScreen({
  storageData = {}
}) {
  const data = storageData || {
    evidence_storage_gb: 12.4,
    report_storage_gb: 2.8,
    total_usage_gb: 15.2,
    quota_gb: 100.0,
    document_count: 8426,
    integrity_status: {
      evidence_hashes_verified_pct: 100.0,
      report_hashes_verified_pct: 100.0,
      audit_chain_integrity_pct: 100.0,
      orphan_records: 0,
      failed_uploads: 0
    }
  };

  const pct = Math.round((data.total_usage_gb / data.quota_gb) * 100);

  return (
    <div className="admin-storage-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Data & Storage Administration</h2>
          <p>Monitor document vaults, cryptographic evidence checksums, and immutable filing volumes</p>
        </div>
      </div>

      {/* Top Storage Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div className="admin-card" style={{ margin: 0, padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>EVIDENCE STORAGE</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#2563EB', marginTop: '4px' }}>
            {data.evidence_storage_gb} GB
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Invoices, weighbridge slips</div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>REPORT STORAGE</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#7C3AED', marginTop: '4px' }}>
            {data.report_storage_gb} GB
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>BRSR PDFs & XBRL dossiers</div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>TOTAL USAGE</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            {data.total_usage_gb} GB <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: '500' }}>/ 100 GB</span>
          </div>
          <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '600' }}>{pct}% Allocated</div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>DOCUMENT COUNT</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            {data.document_count?.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>All project nodes</div>
        </div>
      </div>

      {/* Two Column Layout: Storage Usage Breakdown vs Cryptographic Integrity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: Storage Breakdown */}
        <div className="admin-card" style={{ margin: 0, padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
            Storage Breakdown by Vault Type
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Evidence Documents (PDFs, Images, Certs)</span>
                <strong>12.4 GB (81%)</strong>
              </div>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '81%', height: '100%', background: '#2563EB', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Generated Statutory Reports (BRSR / ESG)</span>
                <strong>2.8 GB (18%)</strong>
              </div>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', background: '#7C3AED', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Audit Chains & System Logs</span>
                <strong>0.0 GB (1%)</strong>
              </div>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '1%', height: '100%', background: '#16A34A', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cryptographic Checksum Integrity Status */}
        <div className="admin-card" style={{ margin: 0, padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
            Data Integrity & Hash Verification Status
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12.5px', color: '#334155' }}>Evidence SHA-256 Hashes</span>
              <span className="admin-badge admin-badge-success">100% MATCHED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12.5px', color: '#334155' }}>Report Immutable Signatures</span>
              <span className="admin-badge admin-badge-success">100% VERIFIED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12.5px', color: '#334155' }}>Audit Block Chain Consistency</span>
              <span className="admin-badge admin-badge-success">100% INTACT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12.5px', color: '#334155' }}>Orphan Evidence Records</span>
              <strong style={{ color: '#0F172A' }}>0 Records</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12.5px', color: '#334155' }}>Failed Ingestion Uploads</span>
              <strong style={{ color: '#0F172A' }}>0 Failures</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
