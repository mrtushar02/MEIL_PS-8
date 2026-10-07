import React, { useState } from 'react';
import {
  PlusCircle
} from 'lucide-react';

export default function EHSSafetyScreen({
  incidents = [],
  onOpenReportIncidentModal,
  onOpenIncidentDetail,
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects / Sites');
  const [selectedPeriod, setSelectedPeriod] = useState('September 2026');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severities');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Observations data matching image Panel 2
  const initialObservations = [
    {
      id: 'SO-101',
      location: 'Main Tunnel',
      description: 'Scaffolding toe-board loose at ch. 4+200',
      reportedBy: 'Rajesh Kumar',
      status: 'Open',
      project: 'Zojila Tunnel Project'
    },
    {
      id: 'SO-102',
      location: 'Access Road',
      description: 'Electrical cable uninsulated near excavation trench',
      reportedBy: 'Arvind Patel',
      status: 'In Progress',
      project: 'Hyderabad Metro Phase 2'
    },
    {
      id: 'SO-103',
      location: 'Camp Area',
      description: 'Fire extinguisher quarterly inspection card expired',
      reportedBy: 'Rahul Mehta',
      status: 'Verified',
      project: 'Olectra EV Mega Plant'
    }
  ];

  const totalIncidentsCount = incidents && incidents.length > 0 ? incidents.length : 12;
  const nearMissesCount = incidents && incidents.length > 0 
    ? incidents.filter(i => (i.type || '').toLowerCase().includes('miss') || (i.type || '').toLowerCase().includes('near')).length || 28
    : 28;
  const ltiCount = incidents && incidents.length > 0
    ? incidents.filter(i => i.lti || (i.type || '').toLowerCase().includes('lti')).length || 1
    : 1;

  const filteredObservations = initialObservations.filter(obs => {
    if (selectedProject !== 'All Projects / Sites' && obs.project && !obs.project.includes(selectedProject)) return false;
    if (selectedStatus !== 'All Statuses' && obs.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER & FILTERS BAR (Matching Image Panel 2) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Safety & HSE
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Zero-harm governance, proactive hazard identification, and statutory incident triage.
            </p>
          </div>

          <button 
            type="button" 
            className="ehs-btn ehs-btn-blue"
            onClick={onOpenReportIncidentModal}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
          >
            <PlusCircle size={15} />
            <span>+ Report Incident</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <select 
            className="ehs-select-control"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Projects / Sites">All Projects / Sites</option>
            <option value="Zojila Tunnel Project">Zojila Tunnel Project</option>
            <option value="Hyderabad Metro Phase 2">Hyderabad Metro Phase 2</option>
            <option value="Olectra EV Mega Plant">Olectra EV Mega Plant</option>
            <option value="Polavaram Dam Project">Polavaram Dam Project</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Categories">All Categories</option>
            <option value="Fall from Height">Fall from Height</option>
            <option value="Equipment Related">Equipment Related</option>
            <option value="Electrical">Electrical</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Severities">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* ──── 2. TOP KPI CARDS (6 In a Row - Matching Image Panel 2) ──── */}
      <div className="ehs-kpi-grid">
        <div className="ehs-kpi-card interactive" onClick={() => onNavigateTab?.('incidents')}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Total Incidents</span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{totalIncidentsCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Current period total</span>
          </div>
        </div>

        <div className="ehs-kpi-card interactive" onClick={() => onNavigateTab?.('incidents')}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Near Misses</span>
            <span style={{ fontSize: '11px', color: '#10B981' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{nearMissesCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>High proactive reporting</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">LTI</span>
            <span style={{ fontSize: '11px', color: '#F59E0B' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{ltiCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Lost Time Injury &gt;48h</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Fatalities</span>
            <span style={{ fontSize: '11px', color: '#10B981' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">0</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span style={{ color: '#059669', fontWeight: 700 }}>Zero Fatalities</span>
          </div>
        </div>

        <div className="ehs-kpi-card interactive" onClick={() => onNavigateTab?.('corrective-actions')}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Open Actions</span>
            <span style={{ fontSize: '11px', color: '#2563EB' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">16</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Assigned across sites</span>
          </div>
        </div>

        <div className="ehs-kpi-card interactive" onClick={() => onNavigateTab?.('inspections')}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Inspection Coverage</span>
            <span style={{ fontSize: '11px', color: '#10B981' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">87%</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>28 of 32 audited</span>
          </div>
        </div>
      </div>

      {/* ──── 3. CHARTS ROW: INCIDENT BY SEVERITY (LEFT) + INCIDENT CATEGORIES (RIGHT) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        {/* Left: Incident by Severity Bar Chart */}
        <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Incident by Severity
            </h3>
            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#475569' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#EF4444' }} /> Critical
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#F97316' }} /> High
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#3B82F6' }} /> Medium
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10B981' }} /> Low
              </span>
            </div>
          </div>

          <div style={{ width: '100%', height: '190px' }}>
            <svg viewBox="0 0 450 190" style={{ width: '100%', height: '100%' }}>
              <line x1="30" y1="20" x2="430" y2="20" stroke="#F1F5F9" />
              <line x1="30" y1="60" x2="430" y2="60" stroke="#F1F5F9" />
              <line x1="30" y1="100" x2="430" y2="100" stroke="#F1F5F9" />
              <line x1="30" y1="140" x2="430" y2="140" stroke="#F1F5F9" />
              <line x1="30" y1="160" x2="430" y2="160" stroke="#CBD5E1" />

              {/* May */}
              <g transform="translate(60, 0)">
                <rect x="0" y="150" width="10" height="10" fill="#EF4444" rx="2" />
                <rect x="12" y="120" width="10" height="40" fill="#F97316" rx="2" />
                <rect x="24" y="90" width="10" height="70" fill="#3B82F6" rx="2" />
                <rect x="36" y="60" width="10" height="100" fill="#10B981" rx="2" />
                <text x="23" y="176" fontSize="10.5" fill="#64748B" textAnchor="middle">May</text>
              </g>

              {/* Jun */}
              <g transform="translate(135, 0)">
                <rect x="0" y="160" width="10" height="0" fill="#EF4444" rx="2" />
                <rect x="12" y="130" width="10" height="30" fill="#F97316" rx="2" />
                <rect x="24" y="80" width="10" height="80" fill="#3B82F6" rx="2" />
                <rect x="36" y="70" width="10" height="90" fill="#10B981" rx="2" />
                <text x="23" y="176" fontSize="10.5" fill="#64748B" textAnchor="middle">Jun</text>
              </g>

              {/* Jul */}
              <g transform="translate(210, 0)">
                <rect x="0" y="155" width="10" height="5" fill="#EF4444" rx="2" />
                <rect x="12" y="115" width="10" height="45" fill="#F97316" rx="2" />
                <rect x="24" y="100" width="10" height="60" fill="#3B82F6" rx="2" />
                <rect x="36" y="85" width="10" height="75" fill="#10B981" rx="2" />
                <text x="23" y="176" fontSize="10.5" fill="#64748B" textAnchor="middle">Jul</text>
              </g>

              {/* Aug */}
              <g transform="translate(285, 0)">
                <rect x="0" y="160" width="10" height="0" fill="#EF4444" rx="2" />
                <rect x="12" y="140" width="10" height="20" fill="#F97316" rx="2" />
                <rect x="24" y="85" width="10" height="75" fill="#3B82F6" rx="2" />
                <rect x="36" y="55" width="10" height="105" fill="#10B981" rx="2" />
                <text x="23" y="176" fontSize="10.5" fill="#64748B" textAnchor="middle">Aug</text>
              </g>

              {/* Sep */}
              <g transform="translate(360, 0)">
                <rect x="0" y="160" width="10" height="0" fill="#EF4444" rx="2" />
                <rect x="12" y="135" width="10" height="25" fill="#F97316" rx="2" />
                <rect x="24" y="75" width="10" height="85" fill="#3B82F6" rx="2" />
                <rect x="36" y="45" width="10" height="115" fill="#10B981" rx="2" />
                <text x="23" y="176" fontSize="10.5" fill="#64748B" textAnchor="middle">Sep</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right: Incident Categories Donut Chart */}
        <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
            Incident Categories
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* SVG Donut */}
            <div style={{ width: '130px', height: '130px', flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {/* Fall from Height 24% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="5.5" strokeDasharray="24 100" strokeDashoffset="0" />
                {/* Equipment Related 20% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F97316" strokeWidth="5.5" strokeDasharray="20 100" strokeDashoffset="-24" />
                {/* Vehicle/Traffic 18% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="5.5" strokeDasharray="18 100" strokeDashoffset="-44" />
                {/* Electrical 16% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="5.5" strokeDasharray="16 100" strokeDashoffset="-62" />
                {/* Fire & Explosion 12% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="5.5" strokeDasharray="12 100" strokeDashoffset="-78" />
                {/* Others 10% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#94A3B8" strokeWidth="5.5" strokeDasharray="10 100" strokeDashoffset="-90" />
              </svg>
            </div>

            {/* Category percentages list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444' }} /> Fall from Height
                </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>24%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F97316' }} /> Equipment Related
                </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>20%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3B82F6' }} /> Vehicle / Traffic
                </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>18%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} /> Electrical
                </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>16%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B' }} /> Fire & Explosion
                </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>12%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#94A3B8' }} /> Others
                </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──── 4. BOTTOM TABLE: RECENT SAFETY OBSERVATIONS (Matching Image Panel 2) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Recent Safety Observations
            </h3>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Frontline hazard identification reports across active construction sites.
            </p>
          </div>

          <button 
            type="button" 
            className="ehs-btn ehs-btn-outline"
            style={{ padding: '4px 10px', fontSize: '11.5px' }}
            onClick={() => onNavigateTab?.('incidents')}
          >
            View All Incidents
          </button>
        </div>

        <div className="ehs-table-container">
          <table className="ehs-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Description</th>
                <th>Reported By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredObservations.map((obs) => (
                <tr key={obs.id}>
                  <td style={{ fontWeight: 800, color: '#2563EB' }}>{obs.id}</td>
                  <td style={{ fontWeight: 700, color: '#0F172A' }}>{obs.location}</td>
                  <td style={{ color: '#475569' }}>{obs.description}</td>
                  <td style={{ color: '#64748B' }}>{obs.reportedBy}</td>
                  <td>
                    <span 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        padding: '2px 8px', 
                        borderRadius: '9999px',
                        background: obs.status === 'Verified' ? 'rgba(16, 185, 129, 0.12)' : obs.status === 'In Progress' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                        color: obs.status === 'Verified' ? '#059669' : obs.status === 'In Progress' ? '#D97706' : '#2563EB'
                      }}
                    >
                      {obs.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="ehs-btn ehs-btn-outline"
                      style={{ padding: '3px 8px', fontSize: '11px', height: '24px' }}
                      onClick={() => onNavigateTab?.('incidents')}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
