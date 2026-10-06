import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Paperclip,
  ShieldCheck,
  TrendingUp,
  FileText,
  User,
  Calendar,
  Layers,
  ExternalLink
} from 'lucide-react';

export default function BUProjectDetailScreen({
  project = {
    name: 'Zojila Tunnel',
    code: 'SITE-ZOJILA-01',
    bu: 'Tunnels Business Unit',
    subsidiary: 'Megha Core Infrastructure Division',
    location: 'Sonamarg - Dras, Jammu & Kashmir',
    period: 'September 2026',
    dataQuality: 98,
    evidenceCount: 14,
    validationRate: 100,
    risk: 'Low',
    submissionsCount: 8,
    leadEngineer: 'Tenzin Dorjey'
  },
  onBack,
  onOpenSubmission
}) {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'ESG Data', 'Evidence', 'Validation', 'Submission History', 'Audit'];

  return (
    <div className="bu-project-detail-screen">
      {/* Top Breadcrumb & Return Action */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="bu-btn bu-btn-secondary"
          onClick={onBack}
          style={{ padding: '6px 14px', fontSize: '12px', height: '34px' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Projects Directory</span>
        </button>

        <span className="bu-badge-success" style={{ fontSize: '12px' }}>
          Active Project Site
        </span>
      </div>

      {/* Project Header Card */}
      <div className="bu-card" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(37,99,235,0.08)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Building2 size={22} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                  {project.name}
                </h2>
                <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={12} /> {project.location} • <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{project.code}</span>
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', textAlign: 'right' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Business Unit</span>
              <strong style={{ fontSize: '13px', color: '#0F172A' }}>{project.bu}</strong>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Lead Engineer</span>
              <strong style={{ fontSize: '13px', color: '#0F172A' }}>{project.leadEngineer}</strong>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Reporting Period</span>
              <strong style={{ fontSize: '13px', color: '#0F172A' }}>{project.period}</strong>
            </div>
          </div>
        </div>

        {/* 5 KPI Metric Chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #E2E8F0'
          }}
        >
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Total Submissions</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{project.submissionsCount}</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Data Quality</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A' }}>{project.dataQuality}%</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Evidence Items</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB' }}>{project.evidenceCount} / 14</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Validation Pass</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#059669' }}>{project.validationRate}%</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Risk Level</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A' }}>{project.risk}</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="bu-segmented-nav" style={{ marginBottom: '16px' }}>
        {tabs.map(t => (
          <button
            key={t}
            className={`bu-segmented-btn ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            <span>{t}</span>
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="bu-card">
        {activeTab === 'Overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
              Project Site Operational Overview
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              The Zojila Tunnel Project is a strategic 14.15 km horseshoe-shaped twin-tube road tunnel located at
              an elevation of 3,528 meters along NH-1 in Jammu & Kashmir. Monthly ESG monitoring focuses on
              diesel generator emissions from high-altitude excavation, grid power consumption from state hydro feed,
              and strict hazardous muck stabilization.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                className="bu-btn bu-btn-primary"
                onClick={() => onOpenSubmission && onOpenSubmission('SUB-2026-091')}
              >
                <span>Inspect Active Submission (SUB-2026-091)</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        )}

        {activeTab !== 'Overview' && (
          <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
            Detailed {activeTab} records for {project.name} loaded from verified backend registry.
          </div>
        )}
      </div>
    </div>
  );
}
