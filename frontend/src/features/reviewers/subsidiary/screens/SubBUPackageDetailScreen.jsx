import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ArrowLeft,
  FileText,
  TrendingUp,
  Droplet,
  Zap,
  Trash2,
  Layers
} from 'lucide-react';

export default function SubBUPackageDetailScreen({
  buPackage = {
    id: 'bu-tunnels',
    name: 'Tunnels Business Unit',
    projects: 14,
    submitted: 14,
    evidenceVerified: 12,
    approved: 13,
    correction: 1,
    scope1: '4,214 tCO2e',
    scope2: '2,881 tCO2e',
    scope3: '1,120 tCO2e',
    water: '184,220 KL',
    waste: '81.4%',
    ltifr: '0.08'
  },
  onBack,
  onApprove,
  onRequestCorrection
}) {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'ESG Data', 'Evidence', 'BRSR Impact', 'Validation', 'History'];

  return (
    <div className="sub-bu-package-detail-screen">
      {/* Return Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="sub-btn sub-btn-secondary"
          onClick={onBack}
          style={{ padding: '6px 14px', fontSize: '12px', height: '34px' }}
        >
          <ArrowLeft size={14} />
          <span>Back to BU Review Center</span>
        </button>

        <span className="sub-badge-purple" style={{ fontSize: '12px' }}>
          Consolidated BU Package Review
        </span>
      </div>

      {/* Package Header Card */}
      <div className="sub-card" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
              {buPackage.name} Package
            </h2>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginTop: '4px' }}>
              Reporting Period: September 2026 • Coordinator: R. K. Sharma
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="sub-btn sub-btn-secondary"
              style={{ padding: '8px 16px', fontSize: '12px', color: '#DC2626' }}
              onClick={() => onRequestCorrection && onRequestCorrection(buPackage)}
            >
              <RotateCcw size={14} />
              <span>Request Correction</span>
            </button>
            <button
              className="sub-btn sub-btn-primary"
              style={{ padding: '8px 18px', fontSize: '12px' }}
              onClick={() => onApprove && onApprove(buPackage)}
            >
              <CheckCircle2 size={14} />
              <span>Approve BU Package</span>
            </button>
          </div>
        </div>

        {/* 5 Package Status Metrics Strip (Matching Screen 3) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #E2E8F0'
          }}
        >
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Projects</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{buPackage.projects}</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Submitted</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB' }}>{buPackage.submitted}</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Evidence Verified</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#7C3AED' }}>{buPackage.evidenceVerified}</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Approved</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A' }}>{buPackage.approved}</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Correction</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#DC2626' }}>{buPackage.correction}</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="sub-segmented-nav" style={{ marginBottom: '16px' }}>
        {tabs.map(t => (
          <button
            key={t}
            className={`sub-segmented-btn ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            <span>{t}</span>
          </button>
        ))}
      </div>

      {/* Consolidated ESG Metrics Grid (Matching Screen 3) */}
      <div className="sub-card">
        <h3 className="sub-card-title" style={{ marginBottom: '16px' }}>Consolidated ESG Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Scope 1 Emissions</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>{buPackage.scope1}</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Scope 2 Emissions</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>{buPackage.scope2}</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Scope 3 Emissions</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>{buPackage.scope3}</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Water Withdrawal</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0284C7' }}>{buPackage.water}</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Waste Diversion Rate</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#16A34A' }}>{buPackage.waste}</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>LTIFR Safety Incident Rate</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>{buPackage.ltifr}</span>
          </div>
        </div>

        {/* BRSR Impact Analysis Section */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            BRSR Principle Contribution
          </h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', color: '#166534', fontWeight: 600 }}>
              P1 Ethics: 96%
            </div>
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', color: '#166534', fontWeight: 600 }}>
              P2 Sustainability: 92%
            </div>
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', color: '#166534', fontWeight: 600 }}>
              P6 Environment: 98%
            </div>
            <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', color: '#92400E', fontWeight: 600 }}>
              P8 Community: 84%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
