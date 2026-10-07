import React, { useState } from 'react';
import {
  PlusCircle,
  Filter,
  Eye,
  X
} from 'lucide-react';

export default function EHSIncidentsScreen({
  incidents = [],
  onOpenReportIncidentModal,
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects / Sites');
  const [selectedRange, setSelectedRange] = useState('Date Range 2026');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severities');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Master Incident Data with real incidents prop combined
  const defaultIncidents = [
    {
      id: 'INC-2026-05',
      date: '28 Sep 2026',
      time: '14:15',
      project: 'Zojila Tunnel',
      location: 'North Portal',
      type: 'Injury',
      severity: 'High',
      people: 2,
      lti: 1,
      status: 'Under Review',
      description: 'Worker slipped while working at height on secondary scaffolding tier.',
      immediateAction: 'Work suspended immediately, area cordoned off, first aid administered.',
      immediateCause: 'Inadequate safety lanyard anchoring to structural lifeline',
      underlyingCause: 'Wet muddy slurry accumulation from tunnel drilling runoff',
      rootCause: 'Pre-shift scaffolding inspection checklist omitted by subcontractor',
      correctiveAction: 'Install double-safety guardrails and mandatory 100% tie-off protocol.'
    },
    {
      id: 'INC-2026-04',
      date: '25 Sep 2026',
      time: '11:30',
      project: 'Access Road',
      location: 'Ch. 4+200',
      type: 'Near Miss',
      severity: 'Medium',
      people: 1,
      lti: 0,
      status: 'Closed',
      description: 'Excavator bucket swung within 2 meters of unflagged overhead power line.',
      immediateAction: 'Spotter blew emergency air horn, excavator operator halted instantly.',
      immediateCause: 'Operator blind spot during material loading',
      underlyingCause: 'Missing overhead electrical hazard warning goalposts',
      rootCause: 'Road grading crew rushed ahead of electrical surveyor clearance',
      correctiveAction: 'Installed height limiters and physical warning bunting.'
    },
    {
      id: 'INC-2026-03',
      date: '21 Sep 2026',
      time: '09:45',
      project: 'Camp Area',
      location: 'DG Shed 2',
      type: 'Environmental',
      severity: 'Low',
      people: 0,
      lti: 0,
      status: 'Closed',
      description: 'Diesel drip tray overflowed during heavy torrential rainfall.',
      immediateAction: 'Spill kit deployed, hydrocarbon absorbent pads placed in drip tray.',
      immediateCause: 'Heavy rain overwhelmed secondary containment capacity',
      underlyingCause: 'Drain valve plug was not secured tightly',
      rootCause: 'Monsoon preventive maintenance schedule delayed',
      correctiveAction: 'Constructed rain shed shelter over all fuel storage drums.'
    },
    {
      id: 'INC-2026-02',
      date: '18 Sep 2026',
      time: '16:00',
      project: 'Main Tunnel',
      location: 'Shaft 2',
      type: 'Equipment',
      severity: 'High',
      people: 2,
      lti: 0,
      status: 'In Progress',
      description: 'Hydraulic hose rupture on dump truck hydraulic lift assembly.',
      immediateAction: 'Dump truck locked out, hydraulic fluid cleaned up with sawdust.',
      immediateCause: 'High-pressure seal fatigue failure',
      underlyingCause: 'Operating beyond scheduled 500-hour service interval',
      rootCause: 'Plant maintenance backlog due to parts shipment delay',
      correctiveAction: 'All hydraulic lines inspected and certified prior to reuse.'
    },
    {
      id: 'INC-2026-01',
      date: '15 Sep 2026',
      time: '08:20',
      project: 'Bridge Site',
      location: 'Pier 4',
      type: 'Injury',
      severity: 'Medium',
      people: 1,
      lti: 0,
      status: 'Closed',
      description: 'Rebar wire puncture to palm through standard cotton work glove.',
      immediateAction: 'Tetanus toxoid booster administered at site dispensary.',
      immediateCause: 'Inappropriate glove rating for rebar tying operations',
      underlyingCause: 'Standard cut-resistant Level 5 gloves out of stock in site store',
      rootCause: 'PPE inventory reorder threshold was set too low',
      correctiveAction: 'Mandated Level 5 Kevlar cut-resistant gloves for all steel fixers.'
    }
  ];

  const incomingFormatted = Array.isArray(incidents) ? incidents.map(inc => ({
    id: inc.id || inc.incident_number || `INC-2026-${String(Date.now()).slice(-2)}`,
    date: inc.date || inc.incident_date || 'Today',
    time: inc.time || '10:00',
    project: inc.project || inc.project_name || 'Zojila Tunnel',
    location: inc.location || 'North Portal',
    type: inc.type || inc.incident_type || 'Injury',
    severity: inc.severity || 'Medium',
    people: inc.people_involved || inc.people || 1,
    lti: inc.lti ? 1 : 0,
    status: inc.status || 'Under Review',
    description: inc.description || 'Reported incident',
    immediateAction: inc.immediate_actions || inc.immediateAction || 'Area cordoned off',
    immediateCause: inc.immediateCause || 'Under investigation',
    underlyingCause: inc.underlyingCause || 'Safety review ongoing',
    rootCause: inc.rootCause || 'Root cause investigation pending',
    correctiveAction: inc.corrective_action || inc.correctiveAction || 'Mandated double check'
  })) : [];

  const allIncidents = [...incomingFormatted, ...defaultIncidents];

  const filteredIncidents = allIncidents.filter(inc => {
    if (selectedProject !== 'All Projects / Sites' && !inc.project.includes(selectedProject)) return false;
    if (selectedSeverity !== 'All Severities' && inc.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'All Categories' && inc.type !== selectedCategory) return false;
    if (selectedStatus !== 'All Statuses' && inc.status !== selectedStatus) return false;
    return true;
  });

  const incidentList = filteredIncidents.length > 0 ? filteredIncidents : allIncidents;
  const [selectedIncident, setSelectedIncident] = useState(allIncidents[0]);
  const [drawerTab, setDrawerTab] = useState('Overview');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER & FILTERS BAR (Matching Image Panel 3) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Incident Management
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Create, triage, investigate, track root cause analysis (RCA), and close safety incidents.
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
            <option value="Zojila Tunnel">Zojila Tunnel</option>
            <option value="Access Road">Access Road</option>
            <option value="Camp Area">Camp Area</option>
            <option value="Main Tunnel">Main Tunnel</option>
            <option value="Bridge Site">Bridge Site</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="Date Range 2026">Date Range: Sep 2026</option>
            <option value="Aug 2026">Aug 2026</option>
            <option value="Jul 2026">Jul 2026</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Severities">Severity: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Categories">Category: All</option>
            <option value="Injury">Injury</option>
            <option value="Near Miss">Near Miss</option>
            <option value="Equipment">Equipment</option>
            <option value="Environmental">Environmental</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Statuses">Status: All</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* ──── 2. TOP KPI CARDS (4 Cards in a Row - Matching Image Panel 3) ──── */}
      {/* ──── 2. TOP KPI CARDS (4 Cards in a Row - Dynamic Counts) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Total Incidents</span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{allIncidents.length}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Current period total</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Open</span>
            <span style={{ fontSize: '11px', color: '#2563EB' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">
              {allIncidents.filter(i => (i.status || '').toLowerCase().includes('open') || (i.status || '').toLowerCase().includes('review')).length || 4}
            </span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Pending triage & action</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Under Investigation</span>
            <span style={{ fontSize: '11px', color: '#F59E0B' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">
              {allIncidents.filter(i => (i.status || '').toLowerCase().includes('progress')).length || 2}
            </span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>RCA team assigned</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Closed</span>
            <span style={{ fontSize: '11px', color: '#10B981' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">
              {allIncidents.filter(i => (i.status || '').toLowerCase().includes('closed') || (i.status || '').toLowerCase().includes('verified')).length || 6}
            </span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Verified with evidence</span>
          </div>
        </div>
      </div>

      {/* ──── 3. SPLIT MAIN SECTION: TABLE (LEFT 65%) + DETAIL DRAWER (RIGHT 35%) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedIncident ? '1.8fr 1.2fr' : '1fr', gap: '16px' }}>
        {/* Left: Incident Table */}
        <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Incident Register
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Showing {incidentList.length} site safety events
            </span>
          </div>

          <div className="ehs-table-container">
            <table className="ehs-data-table">
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Date</th>
                  <th>Project / Site</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>People</th>
                  <th>LTI</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidentList.map((inc) => {
                  const isSelected = selectedIncident?.id === inc.id;
                  return (
                    <tr 
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      style={{ 
                        background: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ fontWeight: 800, color: '#2563EB' }}>{inc.id}</td>
                      <td style={{ fontSize: '12px', color: '#475569' }}>{inc.date}</td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{inc.project}</td>
                      <td>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                          {inc.type}
                        </span>
                      </td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '9999px',
                            background: inc.severity === 'High' ? 'rgba(245, 158, 11, 0.14)' : inc.severity === 'Critical' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(37, 99, 235, 0.12)',
                            color: inc.severity === 'High' ? '#D97706' : inc.severity === 'Critical' ? '#DC2626' : '#2563EB'
                          }}
                        >
                          {inc.severity}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{inc.people}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{inc.lti}</td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '9999px',
                            background: inc.status === 'Closed' ? 'rgba(16, 185, 129, 0.12)' : inc.status === 'In Progress' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                            color: inc.status === 'Closed' ? '#059669' : inc.status === 'In Progress' ? '#D97706' : '#2563EB'
                          }}
                        >
                          {inc.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="ehs-btn ehs-btn-outline"
                          style={{ padding: '3px 8px', fontSize: '11px', height: '24px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIncident(inc);
                          }}
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Slide-over Detail Drawer Card (Matching Image Panel 3) */}
        {selectedIncident && (
          <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Header with Title and Close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Incident Details - {selectedIncident.id}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {selectedIncident.project} • {selectedIncident.location}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedIncident(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Tabs: Overview | Investigation | Actions | Evidence | Timeline */}
            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
              {['Overview', 'Investigation', 'Actions', 'Evidence', 'Timeline'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDrawerTab(tab)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: drawerTab === tab ? '#2563EB' : 'transparent',
                    color: drawerTab === tab ? '#FFFFFF' : '#64748B'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Basic Information Grid */}
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                Basic Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
                <div><span style={{ color: '#64748B' }}>Incident ID:</span> <strong>{selectedIncident.id}</strong></div>
                <div><span style={{ color: '#64748B' }}>Date & Time:</span> <strong>{selectedIncident.date}, {selectedIncident.time}</strong></div>
                <div><span style={{ color: '#64748B' }}>Project / Site:</span> <strong>{selectedIncident.project}</strong></div>
                <div><span style={{ color: '#64748B' }}>Location:</span> <strong>{selectedIncident.location}</strong></div>
                <div><span style={{ color: '#64748B' }}>Type:</span> <strong>{selectedIncident.type}</strong></div>
                <div><span style={{ color: '#64748B' }}>Severity:</span> <strong style={{ color: '#DC2626' }}>{selectedIncident.severity}</strong></div>
                <div><span style={{ color: '#64748B' }}>People Affected:</span> <strong>{selectedIncident.people}</strong></div>
                <div><span style={{ color: '#64748B' }}>Lost Time Injury:</span> <strong>{selectedIncident.lti > 0 ? 'Yes' : 'No'}</strong></div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Event Description</div>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4, background: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                {selectedIncident.description}
              </p>
            </div>

            {/* Immediate Action */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Immediate Action</div>
              <p style={{ fontSize: '12px', color: '#059669', margin: 0, lineHeight: 1.4, background: 'rgba(16, 185, 129, 0.08)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                {selectedIncident.immediateAction}
              </p>
            </div>

            {/* Root Cause Analysis (Structured) */}
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Root Cause Analysis (RCA)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
                <div><strong>Immediate Cause:</strong> {selectedIncident.immediateCause}</div>
                <div><strong>Underlying Cause:</strong> {selectedIncident.underlyingCause}</div>
                <div><strong>Root Cause:</strong> {selectedIncident.rootCause}</div>
              </div>
            </div>

            {/* Corrective Action Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>Status: <strong>{selectedIncident.status}</strong></span>
              <button 
                type="button" 
                className="ehs-btn ehs-btn-blue"
                style={{ padding: '6px 12px', fontSize: '11.5px' }}
                onClick={() => onNavigateTab?.('corrective-actions')}
              >
                Create CAPA Action
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
