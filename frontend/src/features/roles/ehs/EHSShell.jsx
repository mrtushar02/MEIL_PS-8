import React from 'react';
import {
  ShieldCheck,
  PlusCircle,
  FileDown,
  Activity,
  Droplet,
  ShieldAlert,
  GraduationCap,
  Paperclip,
  Send,
  TrendingUp,
  FileCheck2,
  CheckSquare
} from 'lucide-react';

export default function EHSShell({
  activeTab = 'overview',
  onNavigateTab,
  reportingPeriod = 'September 2026',
  onOpenReportIncidentModal,
  selectedSubsidiary = 'all',
  onSelectSubsidiary
}) {
  const subNavItems = [
    { id: 'overview', label: 'Executive Overview', icon: Activity },
    { id: 'safety', label: 'Safety & HSE', icon: ShieldAlert },
    { id: 'inspections', label: 'Inspections & Audits', icon: FileCheck2 },
    { id: 'corrective-actions', label: 'Corrective Actions (CAPA)', icon: CheckSquare },
    { id: 'training', label: 'Training & Inductions', icon: GraduationCap },
    { id: 'environmental', label: 'Environmental & ZLD', icon: Droplet },
    { id: 'evidence', label: 'Evidence Vault (12)', icon: Paperclip },
    { id: 'submissions', label: 'Statutory Filings (3)', icon: Send },
    { id: 'analytics', label: 'EHS Analytics', icon: TrendingUp },
    { id: 'compliance', label: 'Compliance Center', icon: ShieldCheck }
  ];

  return (
    <div className="ehs-hero-banner">
      {/* 1. Header Row */}
      <div className="ehs-banner-top">
        <div className="ehs-title-group">
          <div className="ehs-title-icon-badge">
            <ShieldCheck size={28} />
          </div>
          <div>
            <div className="ehs-pill-tag">
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
              SEBI BRSR Principle 6 & ISO 14001 / 45001 • 258+ Project Sites
            </div>
            <h1 className="ehs-hero-title">
              Environment, Health & Safety (EHS) Control Room
            </h1>
            <p className="ehs-hero-subtitle">
              Continuous CEA Grid Baseline v19 emissions telemetry, water stewardship (ZLD), CPCB stack limits, and zero-fatality governance.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="ehs-banner-actions">
          <select 
            className="ehs-select-control"
            value={selectedSubsidiary}
            onChange={(e) => onSelectSubsidiary?.(e.target.value)}
          >
            <option value="all">All Subsidiaries (6 Entities)</option>
            <option value="MEIL-INFRA">MEIL Core Infrastructure & EPC</option>
            <option value="OLECTRA">Olectra Greentech Limited</option>
            <option value="MEGHA-GAS">Megha Gas (CGD Network)</option>
            <option value="DRILLMEC">Drillmec S.p.A / India</option>
            <option value="ICOMM">ICOMM Tele Limited</option>
            <option value="EVEY-TRANS">Evey Trans Private Limited</option>
          </select>

          <button 
            type="button" 
            className="ehs-btn ehs-btn-outline"
            onClick={() => onNavigateTab?.('submissions')}
          >
            <FileDown size={15} />
            <span>BRSR P6 Annexure</span>
          </button>

          <button 
            type="button" 
            className="ehs-btn ehs-btn-primary"
            onClick={onOpenReportIncidentModal}
          >
            <PlusCircle size={15} />
            <span>+ Log Safety Incident / Near-Miss</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="ehs-subnav-track">
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`ehs-subnav-tab ${isActive ? 'active' : ''}`}
              onClick={() => onNavigateTab?.(item.id)}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
