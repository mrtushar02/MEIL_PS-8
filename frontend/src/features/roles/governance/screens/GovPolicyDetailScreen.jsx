import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Download,
  FileSignature,
  ExternalLink
} from 'lucide-react';

export default function GovPolicyDetailScreen({
  policy = {
    id: 'POL-002',
    name: 'Anti-Corruption Policy',
    category: 'Ethics & Integrity',
    department: 'Compliance',
    owner: 'Compliance',
    ownerName: 'Adv. S. K. Nair',
    effectiveDate: '15 Feb 2024',
    reviewDate: '15 Feb 2026',
    version: 'v2.1',
    status: 'Active',
    approvalStatus: 'Approved',
    scope: 'All Subsidiaries & Business Units',
    description: 'Zero-tolerance policy on bribery, corrupt practices, facilitation payments, and kickbacks in accordance with Prevention of Corruption Act.',
    applicability: '100% Workforce & Third Parties',
    relatedObligations: ['CO-003', 'CO-001'],
    relatedControls: ['CTR-001', 'CTR-006']
  },
  onBack,
  onNavigateTab
}) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="gov-module-root">
      {/* ──── TOP HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <button 
                onClick={onBack} 
                className="gov-page-btn"
                style={{ width: 'auto', padding: '0 8px', gap: '4px', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={13} />
                <span>Policies</span>
              </button>
              <span style={{ color: '#94A3B8' }}>/</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563EB' }}>{policy.id}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1>{policy.name}</h1>
              <span className="gov-status-chip gov-status-active">
                {policy.status}
              </span>
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '6px', 
                background: '#EFF6FF', 
                color: '#2563EB', 
                fontSize: '11.5px', 
                fontWeight: 700 
              }}>
                {policy.version}
              </span>
            </div>
            <p>{policy.description}</p>
          </div>

          <div className="gov-header-controls">
            <button 
              className="gov-btn gov-btn-outline"
              onClick={() => alert(`Exporting official PDF for ${policy.id}`)}
            >
              <Download size={14} />
              Export PDF
            </button>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={() => alert(`Starting review workflow for ${policy.id}`)}
            >
              <FileSignature size={14} />
              Start Review
            </button>
          </div>
        </div>
      </div>

      {/* ──── DETAIL SUB TABS ──── */}
      <div className="gov-table-card" style={{ padding: '16px 20px' }}>
        <div className="gov-detail-tabs-bar">
          {['overview', 'document', 'obligations', 'controls', 'evidence', 'approvals', 'history'].map((t) => (
            <button
              key={t}
              className={`gov-detail-tab-btn ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ──── TAB CONTENT ──── */}
        {activeTab === 'overview' && (
          <div className="gov-detail-card-grid">
            {/* Left 2 Cols: Key Specs */}
            <div>
              <div className="gov-info-box">
                <div className="gov-info-title">Policy Scope & Applicability</div>
                <div className="gov-info-desc">
                  <strong>Scope:</strong> {policy.scope} <br />
                  <strong>Applicability:</strong> {policy.applicability} <br />
                  <strong>Department:</strong> {policy.department}
                </div>
              </div>

              <div className="gov-info-box">
                <div className="gov-info-title">Policy Lifecycle & Review Schedule</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Effective Date</span>
                    <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>{policy.effectiveDate}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Next Review Date</span>
                    <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>{policy.reviewDate}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Approval Cycle</span>
                    <div style={{ fontWeight: 600, color: '#16A34A', marginTop: '2px' }}>Bi-Annual (Board)</div>
                  </div>
                </div>
              </div>

              <div className="gov-info-box">
                <div className="gov-info-title">Document Summary</div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  marginTop: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={22} style={{ color: '#DC2626' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>
                        {policy.id}-Anti-Corruption-v2.1.pdf
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        PDF Document • 2.4 MB • Uploaded 15 Feb 2024
                      </div>
                    </div>
                  </div>
                  <button 
                    className="gov-btn gov-btn-secondary" 
                    style={{ height: '30px', padding: '0 12px', fontSize: '12px' }}
                    onClick={() => alert('Downloading official stamped policy document...')}
                  >
                    <Download size={13} />
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Approvals & Linked Items */}
            <div>
              <div className="gov-info-box" style={{ background: '#FFFFFF' }}>
                <div className="gov-info-title">Governance Signoff & Signatures</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} style={{ color: '#16A34A', marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12.5px' }}>Board Audit Committee</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Approved on 15 Feb 2024 • Signoff ID: BAC-2024-08</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} style={{ color: '#16A34A', marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12.5px' }}>Adv. S. K. Nair</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Governance & Compliance Lead • Signoff</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gov-info-box" style={{ background: '#FFFFFF' }}>
                <div className="gov-info-title">Linked Compliance Obligations</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: '#F8FAFC',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => onNavigateTab?.('obligations')}
                  >
                    <span style={{ fontWeight: 600, color: '#2563EB' }}>CO-003</span>
                    <span style={{ color: '#475569' }}>Anti-Bribery Compliance</span>
                    <ExternalLink size={12} style={{ color: '#94A3B8' }} />
                  </div>
                </div>
              </div>

              <div className="gov-info-box" style={{ background: '#FFFFFF' }}>
                <div className="gov-info-title">Associated Controls</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: '#F8FAFC',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => onNavigateTab?.('controls')}
                  >
                    <span style={{ fontWeight: 600, color: '#2563EB' }}>CTR-001</span>
                    <span style={{ color: '#475569' }}>Vendor Due Diligence</span>
                    <span className="gov-status-chip gov-status-pass" style={{ fontSize: '10.5px', padding: '1px 6px' }}>Pass</span>
                  </div>
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: '#F8FAFC',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => onNavigateTab?.('controls')}
                  >
                    <span style={{ fontWeight: 600, color: '#2563EB' }}>CTR-006</span>
                    <span style={{ color: '#475569' }}>Whistleblower Monitoring</span>
                    <span className="gov-status-chip gov-status-pass" style={{ fontSize: '10.5px', padding: '1px 6px' }}>Pass</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748B' }}>
            <FileText size={36} style={{ color: '#2563EB', opacity: 0.6, margin: '0 auto 12px' }} />
            <h4 style={{ margin: '0 0 6px', color: '#0F172A', fontSize: '15px' }}>
              {activeTab.toUpperCase()} Records for {policy.id}
            </h4>
            <p style={{ margin: 0, fontSize: '13px' }}>
              All records for {activeTab} are synchronized and verified with MEIL Group Enterprise Repository.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
