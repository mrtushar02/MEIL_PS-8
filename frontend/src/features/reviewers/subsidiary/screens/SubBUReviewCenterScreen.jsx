import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function SubBUReviewCenterScreen({ onInspectPackage }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const buPackages = [
    {
      id: 'bu-tunnels',
      name: 'Tunnels BU',
      projects: 14,
      readiness: 96,
      evidence: 100,
      status: 'Approved',
      badgeClass: 'sub-badge-success',
      scope1: '4,214 tCO2e',
      scope2: '2,881 tCO2e',
      headCoordinator: 'R. K. Sharma',
      updatedAt: 'Today, 14:20'
    },
    {
      id: 'bu-water',
      name: 'Water BU',
      projects: 8,
      readiness: 91,
      evidence: 94,
      status: 'Review',
      badgeClass: 'sub-badge-warning',
      scope1: '1,842 tCO2e',
      scope2: '1,210 tCO2e',
      headCoordinator: 'P. Venkat',
      updatedAt: 'Today, 11:45'
    },
    {
      id: 'bu-energy',
      name: 'Energy BU',
      projects: 6,
      readiness: 88,
      evidence: 96,
      status: 'Approved',
      badgeClass: 'sub-badge-success',
      scope1: '2,640 tCO2e',
      scope2: '1,120 tCO2e',
      headCoordinator: 'S. K. Rao',
      updatedAt: 'Yesterday'
    },
    {
      id: 'bu-infra',
      name: 'Infrastructure BU',
      projects: 7,
      readiness: 67,
      evidence: 71,
      status: 'Correction',
      badgeClass: 'sub-badge-danger',
      scope1: '1,120 tCO2e',
      scope2: '980 tCO2e',
      headCoordinator: 'M. Deshmukh',
      updatedAt: 'Yesterday'
    },
    {
      id: 'bu-metro',
      name: 'Metro BU',
      projects: 3,
      readiness: 95,
      evidence: 92,
      status: 'Approved',
      badgeClass: 'sub-badge-success',
      scope1: '890 tCO2e',
      scope2: '640 tCO2e',
      headCoordinator: 'A. Verma',
      updatedAt: '2 days ago'
    },
    {
      id: 'bu-exp',
      name: 'Expressway BU',
      projects: 2,
      readiness: 85,
      evidence: 88,
      status: 'Review',
      badgeClass: 'sub-badge-warning',
      scope1: '950 tCO2e',
      scope2: '580 tCO2e',
      headCoordinator: 'V. Joshi',
      updatedAt: '3 days ago'
    }
  ];

  const filterTabs = [
    { key: 'All', label: 'All', count: 6 },
    { key: 'Review', label: 'Pending', count: 2 },
    { key: 'Approved', label: 'Approved', count: 3 },
    { key: 'Correction', label: 'Correction', count: 1 }
  ];

  const filteredPackages = buPackages.filter(item => {
    if (activeFilter !== 'All' && item.status !== activeFilter) return false;
    return true;
  });

  return (
    <div className="sub-bu-review-center-screen">
      {/* Top Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Business Unit Review Center
          </h2>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
            Review, validate and approve consolidated Business Unit reporting packages
          </p>
        </div>

        <div className="sub-segmented-nav">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              className={`sub-segmented-btn ${activeFilter === tab.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              <span>{tab.label}</span>
              <span style={{ fontSize: '10px', background: 'rgba(124,58,237,0.1)', padding: '1px 6px', borderRadius: '10px', color: '#7C3AED' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* BU Packages Grid (Matching Screen 2 of Reference Image) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {filteredPackages.map(pkg => (
          <div
            key={pkg.id}
            className="sub-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: pkg.status === 'Correction' ? '1.5px solid #FCA5A5' : '1px solid #E2E8F0',
              transition: 'all 0.2s ease'
            }}
            onClick={() => onInspectPackage && onInspectPackage(pkg)}
          >
            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(124,58,237,0.08)',
                      color: '#7C3AED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                      {pkg.name}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {pkg.projects} Projects • {pkg.headCoordinator}
                    </span>
                  </div>
                </div>

                <span className={pkg.badgeClass} style={{ fontSize: '11px' }}>
                  {pkg.status}
                </span>
              </div>

              {/* Progress & Readiness metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  background: '#F8FAFC',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  marginBottom: '12px'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>ESG Readiness</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: pkg.readiness >= 90 ? '#16A34A' : '#D97706' }}>
                    {pkg.readiness}%
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Evidence Completeness</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#7C3AED' }}>
                    {pkg.evidence}%
                  </span>
                </div>
              </div>

              {/* Emissions Scope Rollup */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 4px' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Scope 1 Emissions</span>
                  <strong style={{ color: '#0F172A' }}>{pkg.scope1}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Scope 2 Emissions</span>
                  <strong style={{ color: '#0F172A' }}>{pkg.scope2}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Review Action */}
            <div
              style={{
                marginTop: '14px',
                paddingTop: '10px',
                borderTop: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Updated {pkg.updatedAt}</span>
              <button
                className="sub-btn sub-btn-primary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectPackage && onInspectPackage(pkg);
                }}
              >
                <span>Inspect Package</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
