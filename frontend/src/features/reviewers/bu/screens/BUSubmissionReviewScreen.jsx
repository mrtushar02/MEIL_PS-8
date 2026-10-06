import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  User, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Flame, 
  Droplet, 
  Trash2, 
  ShieldCheck, 
  FileText, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft,
  Sparkles,
  Download,
  Lock,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function BUSubmissionReviewScreen({
  submission,
  onBackToQueue,
  onRequestCorrection,
  onApproveSubmission
}) {
  const [activeTab, setActiveTab] = useState('ESG_DATA'); // ESG_DATA, EVIDENCE, VALIDATION, CALCULATIONS, HISTORY
  const [reviewNotes, setReviewNotes] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    energy: true,
    fuel: true,
    water: false,
    waste: false,
    safety: false,
    other: false
  });

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!submission) return null;

  return (
    <div className="bu-review-workspace">
      {/* ── Top Context Banner (Screen 3 Top) ── */}
      <div className="bu-review-top-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            className="bu-btn bu-btn-secondary"
            onClick={onBackToQueue}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <ArrowLeft size={14} /> Back to Queue
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {submission.id} — {submission.projectName || 'Zojila Tunnel'}
              </h2>
              <span className="bu-badge bu-badge-pending">
                {submission.status}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
              <span><strong>Project:</strong> {submission.projectName || 'Zojila Tunnel'}</span>
              <span><strong>Period:</strong> September 2026</span>
              <span><strong>Version:</strong> v{submission.version || 3}</span>
              <span><strong>Submitted By:</strong> {submission.submitted_by || 'Tenzin Dorjey'} (28 Sep 2026, 16:42)</span>
            </div>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="bu-segmented-controls">
          {['ESG_DATA', 'EVIDENCE', 'VALIDATION', 'CALCULATIONS', 'HISTORY'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`bu-segmented-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* ── Two-Column Review Layout (Screen 3 Middle) ── */}
      <div className="bu-review-cols">
        {/* LEFT COLUMN: Vertically Stacked ESG Review Sections */}
        <div className="bu-review-left-col">
          {/* 1. Energy Section */}
          <div className="bu-collapsible-section">
            <div className="bu-collapsible-header" onClick={() => toggleSection('energy')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>Energy Disclosures</strong>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>Grid Electricity & On-site Solar Generation</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="bu-badge bu-badge-approved">Verified</span>
                {expandedSections.energy ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
              </div>
            </div>

            {expandedSections.energy && (
              <div className="bu-collapsible-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Electricity Grid</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>85,000 kWh</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Renewable Solar</span>
                    <strong style={{ color: '#16A34A', fontSize: '13.5px' }}>17,200 kWh</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Grid Factor (v19)</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>0.716 kg/kWh</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Scope 2 Emissions</span>
                    <strong style={{ color: '#2563EB', fontSize: '13.5px' }}>60.12 tCO₂e</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Fuel / GHG Section */}
          <div className="bu-collapsible-section">
            <div className="bu-collapsible-header" onClick={() => toggleSection('fuel')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>Fuel / GHG (Scope 1)</strong>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>Heavy Tunnel Excavators & DG Generators</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="bu-badge bu-badge-approved">Verified</span>
                {expandedSections.fuel ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
              </div>
            </div>

            {expandedSections.fuel && (
              <div className="bu-collapsible-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>High-Speed Diesel</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>12,000 L</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Emission Factor</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>2.68 kg CO₂e/L</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Factor Source</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>CEA Baseline v19</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Scope 1 Emissions</span>
                    <strong style={{ color: '#D97706', fontSize: '13.5px' }}>32.16 tCO₂e</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Water Management */}
          <div className="bu-collapsible-section">
            <div className="bu-collapsible-header" onClick={() => toggleSection('water')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplet size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>Water Withdrawal & Recycling</strong>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>Mountain stream inflow & recycling basin</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="bu-badge bu-badge-approved">Verified</span>
                {expandedSections.water ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
              </div>
            </div>

            {expandedSections.water && (
              <div className="bu-collapsible-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Total Withdrawal</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>65,000 KL</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Water Recycled</span>
                    <strong style={{ color: '#16A34A', fontSize: '13.5px' }}>12,400 KL</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Recycling Rate</span>
                    <strong style={{ color: '#2563EB', fontSize: '13.5px' }}>19.1%</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Zero-Discharge</span>
                    <strong style={{ color: '#16A34A', fontSize: '13.5px' }}>Compliant</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Waste & Circular Economy */}
          <div className="bu-collapsible-section">
            <div className="bu-collapsible-header" onClick={() => toggleSection('waste')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>Waste & Muck Management</strong>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>Excavated tunnel rock, muck & recycling</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="bu-badge bu-badge-approved">Verified</span>
                {expandedSections.waste ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
              </div>
            </div>

            {expandedSections.waste && (
              <div className="bu-collapsible-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Total Waste Muck</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>84.5 Tonnes</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Diverted / Reused</span>
                    <strong style={{ color: '#16A34A', fontSize: '13.5px' }}>52.0 Tonnes</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Diversion Rate</span>
                    <strong style={{ color: '#16A34A', fontSize: '13.5px' }}>61.5%</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Hazardous Waste</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>0.0 Tonnes</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Health, Safety & Zero Harm */}
          <div className="bu-collapsible-section">
            <div className="bu-collapsible-header" onClick={() => toggleSection('safety')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>Occupational Health & Safety</strong>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>Zero harm audit, safe man-hours & LTIFR</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="bu-badge bu-badge-approved">Verified</span>
                {expandedSections.safety ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
              </div>
            </div>

            {expandedSections.safety && (
              <div className="bu-collapsible-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Safe Man-Hours</span>
                    <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>450,000 hrs</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Lost Time Injuries</span>
                    <strong style={{ color: '#16A34A', fontSize: '13.5px' }}>0 LTI</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Fatalities</span>
                    <strong style={{ color: '#16A34A', fontSize: '13.5px' }}>0</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>LTIFR Score</span>
                    <strong style={{ color: '#16A34A', fontSize: '13.5px' }}>0.00</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Evidence Vault & Document Preview (Screen 3 Right) */}
        <div className="bu-review-right-col">
          <div className="bu-evidence-vault-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Evidence Vault</h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>Primary document supporting Fuel Record batch</span>
              </div>
              <span className="bu-badge bu-badge-approved">
                SHA-256 Verified
              </span>
            </div>

            {/* Document Preview Box (Matching Diesel_Invoice.pdf in Reference Design) */}
            <div className="bu-doc-preview-box">
              <div style={{
                background: '#FFFFFF',
                width: '85%',
                height: '80%',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '12px', color: '#0F172A' }}>MEIL INVOICE VERIFICATION</strong>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>Indian Oil Tanker Delivery Challan #881</div>
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#16A34A',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    ORIGINAL SEAL
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#334155', lineHeight: 1.5 }}>
                  <div><strong>Quantity:</strong> 12,000 Litres (HSD)</div>
                  <div><strong>Site Delivery:</strong> Zojila Tunnel Portal-1 (Minamarg)</div>
                  <div><strong>Challan Hash:</strong> sha256:7a3d8b12f45c...</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Verified by Site Officer</span>
                  <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700 }}>✓ Stamp Matched</span>
                </div>
              </div>
            </div>

            {/* Evidence Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '11.5px', background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '10px' }}>Document Type</span>
                <strong style={{ color: '#0F172A' }}>Invoice / Meter Slip</strong>
              </div>
              <div>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '10px' }}>Uploaded By</span>
                <strong style={{ color: '#0F172A' }}>Tenzin Dorjey</strong>
              </div>
              <div>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '10px' }}>Timestamp</span>
                <strong style={{ color: '#0F172A' }}>28 Sep 2026, 16:42</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={13} color="#2563EB" /> SHA-256 Checksum: <code style={{ color: '#0F172A', background: '#F1F5F9', padding: '2px 4px', borderRadius: '4px' }}>7a3d...1f0f</code>
              </span>
              <button
                type="button"
                className="bu-btn bu-btn-secondary"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => alert('Opening original statutory PDF in secure viewer...')}
              >
                <Eye size={12} /> View Full Screen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── AUTOMATED QUALITY GATE STRIP (Screen 3 Lower) ── */}
      <div className="bu-quality-gate-strip">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>Automated Quality Gate Checks</strong>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>Pre-approval rules verified against backend ValidationEngine</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', background: 'rgba(34, 197, 94, 0.1)', padding: '3px 8px', borderRadius: '6px' }}>
            ALL 8 GATES PASSED (100%)
          </span>
        </div>

        <div className="bu-gate-checks-grid">
          {[
            'Required fields complete',
            'Unit validation passed',
            'Emission factor available',
            'Calculation completed',
            'Evidence attached',
            'Evidence integrity verified',
            'Organization scope valid',
            'Reporting period valid'
          ].map((check, idx) => (
            <div key={idx} className="bu-gate-check-pill passed">
              <CheckCircle2 size={13} style={{ flexShrink: 0 }} />
              <span>{check}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FIXED BOTTOM REVIEW ACTION BAR (Screen 3 Bottom) ── */}
      <div className="bu-review-action-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#94A3B8', fontSize: '11px', display: 'block' }}>Submission Version</span>
            <strong style={{ color: '#0F172A' }}>v{submission.version || 3}</strong>
          </div>
          <div style={{ height: '24px', width: '1px', background: '#E2E8F0' }} />
          <div>
            <span style={{ color: '#94A3B8', fontSize: '11px', display: 'block' }}>Audit State</span>
            <span style={{ color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} /> Traceable
            </span>
          </div>
        </div>

        {/* Center: Review Notes Input */}
        <div style={{ flex: 1, maxWidth: '420px', margin: '0 20px' }}>
          <input
            type="text"
            placeholder="Review notes (optional) for audit log..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '12px',
              outline: 'none',
              background: '#FFFFFF',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="bu-btn bu-btn-danger"
            onClick={onRequestCorrection}
            style={{ background: 'transparent', color: '#DC2626', border: '1.5px solid rgba(239, 68, 68, 0.4)' }}
          >
            <AlertTriangle size={14} /> Request Correction
          </button>

          <button
            type="button"
            className="bu-btn bu-btn-primary"
            onClick={onApproveSubmission}
            style={{ padding: '9px 24px', fontSize: '13px' }}
          >
            <CheckCircle2 size={15} /> Approve BU Submission
          </button>
        </div>
      </div>
    </div>
  );
}
