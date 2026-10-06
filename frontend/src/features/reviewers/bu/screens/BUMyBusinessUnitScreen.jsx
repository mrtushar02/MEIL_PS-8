import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Users,
  ExternalLink,
  Layers,
  Activity
} from 'lucide-react';

export default function BUMyBusinessUnitScreen({ onSelectProject }) {
  const [selectedSiteId, setSelectedSiteId] = useState('site-102');

  const buHierarchy = {
    group: 'MEIL Group HQ',
    subsidiary: 'Megha Infrastructure Division',
    buName: 'Tunnels Business Unit',
    head: 'R. K. Sharma (BU Sustainability Coordinator)',
    reportingPeriod: 'September 2026',
    activeProjects: 6,
    totalSubmissions: 37,
    approvedSubmissions: 24,
    readinessScore: 92.4
  };

  const projectSites = [
    {
      id: 'site-102',
      code: 'SITE-ZOJILA-01',
      name: 'Zojila Tunnel',
      location: 'Sonamarg - Dras, Jammu & Kashmir',
      altitude: '3,528 m',
      leadEngineer: 'Tenzin Dorjey',
      status: 'Pending Review',
      badgeClass: 'bu-badge-warning',
      readiness: 96,
      submissionsCount: 8,
      lat: 34.28,
      lng: 75.48,
      emissionsScope1: 420,
      energyUsage: '2.4M kWh',
      waterRecycled: '93%',
      activeSLA: '16h remaining'
    },
    {
      id: 'site-gayatri-link',
      code: 'PRJ-GAYATRI-02',
      name: 'Gayatri Project',
      location: 'Peddapalli, Telangana',
      altitude: '154 m',
      leadEngineer: 'P. Kumar',
      status: 'At Risk',
      badgeClass: 'bu-badge-warning',
      readiness: 88,
      submissionsCount: 7,
      lat: 18.62,
      lng: 79.38,
      emissionsScope1: 390,
      energyUsage: '1.8M kWh',
      waterRecycled: '88%',
      activeSLA: '6h remaining'
    },
    {
      id: 'site-test-tunnel-b',
      code: 'PRJ-TUNNEL-B',
      name: 'Tunnel B (Atal Ext)',
      location: 'Rohtang Pass, Himachal Pradesh',
      altitude: '3,100 m',
      leadEngineer: 'R. Singh',
      status: 'Correction Required',
      badgeClass: 'bu-badge-danger',
      readiness: 72,
      submissionsCount: 6,
      lat: 32.37,
      lng: 77.16,
      emissionsScope1: 350,
      energyUsage: '1.2M kWh',
      waterRecycled: '76%',
      activeSLA: 'Overdue (-2h)'
    },
    {
      id: 'site-river-link',
      code: 'PRJ-RIVER-01',
      name: 'River Link Tunnel',
      location: 'Godavari Basin, Andhra Pradesh',
      altitude: '48 m',
      leadEngineer: 'S. Mehta',
      status: 'Approved',
      badgeClass: 'bu-badge-success',
      readiness: 93,
      submissionsCount: 6,
      lat: 16.98,
      lng: 81.78,
      emissionsScope1: 310,
      energyUsage: '1.5M kWh',
      waterRecycled: '84%',
      activeSLA: 'Completed'
    },
    {
      id: 'site-metro-p1',
      code: 'PRJ-METRO-01',
      name: 'Metro Phase 1 Underground',
      location: 'Bangalore, Karnataka',
      altitude: '920 m',
      leadEngineer: 'A. Verma',
      status: 'Approved',
      badgeClass: 'bu-badge-success',
      readiness: 95,
      submissionsCount: 5,
      lat: 12.97,
      lng: 77.59,
      emissionsScope1: 260,
      energyUsage: '1.4M kWh',
      waterRecycled: '87%',
      activeSLA: 'Completed'
    },
    {
      id: 'site-expressway',
      code: 'PRJ-EXP-01',
      name: 'Expressway Twin Tube',
      location: 'Western Ghats, Maharashtra',
      altitude: '650 m',
      leadEngineer: 'V. Joshi',
      status: 'Approved',
      badgeClass: 'bu-badge-success',
      readiness: 97,
      submissionsCount: 5,
      lat: 18.75,
      lng: 73.40,
      emissionsScope1: 285,
      energyUsage: '1.6M kWh',
      waterRecycled: '91%',
      activeSLA: 'Completed'
    }
  ];

  const selectedSite = projectSites.find(s => s.id === selectedSiteId) || projectSites[0];

  return (
    <div className="bu-my-bu-screen">
      {/* 4-Tier Hierarchy Breadcrumb Bar */}
      <div className="bu-card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }}>
            <span style={{ fontWeight: 600, color: '#334155' }}>{buHierarchy.group}</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: '#334155' }}>{buHierarchy.subsidiary}</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 700, color: '#2563EB', background: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '6px' }}>
              {buHierarchy.buName}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Reporting Period</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{buHierarchy.reportingPeriod}</span>
            </div>
            <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>BU ESG Readiness</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>{buHierarchy.readinessScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Metric Chips */}
      <div className="bu-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Active Project Sites</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>
              <Building2 size={16} />
            </div>
          </div>
          <div className="kpi-value">{buHierarchy.activeProjects}</div>
          <div className="kpi-delta positive">100% active in cycle</div>
        </div>

        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Submissions Logged</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981' }}>
              <Layers size={16} />
            </div>
          </div>
          <div className="kpi-value">{buHierarchy.totalSubmissions}</div>
          <div className="kpi-delta positive">All sites reported</div>
        </div>

        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Approved to Subsidiary</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(5,150,105,0.08)', color: '#059669' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="kpi-value">{buHierarchy.approvedSubmissions}</div>
          <div className="kpi-delta positive">65% approved</div>
        </div>

        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Average Data Quality</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366F1' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="kpi-value">{buHierarchy.readinessScore}%</div>
          <div className="kpi-delta positive">+4.2% vs last month</div>
        </div>
      </div>

      {/* Split Layout: Geographic Overview on Left, Project Cards Grid on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px' }}>
        {/* Left: Geographic Interactive Center */}
        <div className="bu-card">
          <div className="bu-card-header">
            <div>
              <h3 className="bu-card-title">Geographic Footprint & Sites</h3>
              <p className="bu-card-subtitle">
                Strategic infrastructure sites across Himalayan, Deccan, and Coastal zones
              </p>
            </div>
            <span className="bu-badge-neutral" style={{ fontSize: '11px' }}>
              Pan-India Operations
            </span>
          </div>

          <div
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)',
              border: '1px solid rgba(226,232,240,0.8)',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#2563EB" />
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
                  {selectedSite.name}
                </span>
              </div>
              <span className={selectedSite.badgeClass} style={{ fontSize: '11px' }}>
                {selectedSite.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12px' }}>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Location</span>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>{selectedSite.location}</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Site Engineer</span>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>{selectedSite.leadEngineer}</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Scope 1 Emissions</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedSite.emissionsScope1} tCO2e</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Energy Consumption</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedSite.energyUsage}</span>
              </div>
            </div>

            <div
              style={{
                marginTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #E2E8F0'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>ESG Readiness Score</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: selectedSite.readiness >= 90 ? '#16A34A' : '#D97706' }}>
                  {selectedSite.readiness}%
                </span>
              </div>
              <button
                className="bu-btn bu-btn-primary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={() => onSelectProject && onSelectProject(selectedSite.name)}
              >
                <span>Filter Submissions</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>

          {/* Quick Site Switcher List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Site to Inspect
            </span>
            {projectSites.map(site => (
              <div
                key={site.id}
                onClick={() => setSelectedSiteId(site.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: selectedSiteId === site.id ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                  background: selectedSiteId === site.id ? 'rgba(37,99,235,0.04)' : '#FFFFFF',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={14} color={selectedSiteId === site.id ? '#2563EB' : '#94A3B8'} />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block' }}>
                      {site.name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>{site.code}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={site.badgeClass} style={{ fontSize: '10px' }}>
                    {site.status}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: site.readiness >= 90 ? '#16A34A' : '#D97706' }}>
                    {site.readiness}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Site Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {projectSites.map(site => (
            <div key={site.id} className="bu-card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                      {site.name}
                    </h4>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748B', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                      {site.code}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <MapPin size={12} /> {site.location}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={site.badgeClass} style={{ fontSize: '11px' }}>
                    {site.status}
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: site.readiness >= 90 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: site.readiness >= 90 ? '#16A34A' : '#D97706'
                    }}
                  >
                    {site.readiness}%
                  </div>
                </div>
              </div>

              {/* Metrics strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  fontSize: '11px'
                }}
              >
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Scope 1</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{site.emissionsScope1} tCO2e</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Energy</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{site.energyUsage}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Water Recycled</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{site.waterRecycled}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>SLA Status</span>
                  <span style={{ fontWeight: 700, color: site.activeSLA.includes('Overdue') ? '#DC2626' : '#16A34A' }}>
                    {site.activeSLA}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Site In-Charge: <strong>{site.leadEngineer}</strong>
                </span>
                <button
                  className="bu-btn bu-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '11px', height: '28px' }}
                  onClick={() => onSelectProject && onSelectProject(site.name)}
                >
                  <span>View Project Submissions</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
