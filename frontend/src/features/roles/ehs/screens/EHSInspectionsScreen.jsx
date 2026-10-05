import React, { useState } from 'react';
import {
  FileCheck2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  X
} from 'lucide-react';

export default function EHSInspectionsScreen({
  _inspections = [],
  _onCreateInspection,
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects / Sites');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedInspector, setSelectedInspector] = useState('All Inspectors');
  const [selectedRange, setSelectedRange] = useState('Date Range 2026');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Inspection records matching image Panel 4
  const inspectionList = [
    {
      id: 'INSP-2026-15',
      date: '29 Sep 2026',
      time: '10:00 AM',
      project: 'Zojila Tunnel',
      type: 'Safety Inspect.',
      inspector: 'Rajesh Kumar',
      participants: 12,
      status: 'Completed',
      checklist: [
        { name: 'PPE Usage Compliance', status: 'Pass' },
        { name: 'Scaffolding Safety & Toe-boards', status: 'Fail' },
        { name: 'Electrical Panel Grounding', status: 'Pass' },
        { name: 'Emergency Escape Lighting', status: 'Pass' }
      ]
    },
    {
      id: 'INSP-2026-14',
      date: '28 Sep 2026',
      time: '14:30 PM',
      project: 'Access Road',
      type: 'Environmental',
      inspector: 'Neha Singh',
      participants: 8,
      status: 'Completed',
      checklist: [
        { name: 'Dust Suppression Sprinklers', status: 'Pass' },
        { name: 'Fuel Storage Berm Containment', status: 'Pass' },
        { name: 'Waste Segregation Bins', status: 'Pass' }
      ]
    },
    {
      id: 'INSP-2026-13',
      date: '25 Sep 2026',
      time: '11:00 AM',
      project: 'Camp Area',
      type: 'Equipment',
      inspector: 'Arvind Patel',
      participants: 6,
      status: 'Scheduled',
      checklist: [
        { name: 'Tower Crane Wire Rope Rigging', status: 'Pass' },
        { name: 'Generator Emergency Cutoff', status: 'Pass' }
      ]
    },
    {
      id: 'INSP-2026-12',
      date: '21 Sep 2026',
      time: '09:00 AM',
      project: 'Main Tunnel',
      type: 'Emergency',
      inspector: 'Rahul Mehta',
      participants: 15,
      status: 'In Progress',
      checklist: [
        { name: 'Ventilation Fan Airflow CFM', status: 'Pass' },
        { name: 'Underground Refuge Chamber', status: 'Fail' }
      ]
    },
    {
      id: 'INSP-2026-11',
      date: '18 Sep 2026',
      time: '15:15 PM',
      project: 'Bridge Site',
      type: 'Permit',
      inspector: 'Vikram Rao',
      participants: 10,
      status: 'Completed',
      checklist: [
        { name: 'Confined Space Gas Test Log', status: 'Pass' },
        { name: 'Life Jackets on Pier Pontoon', status: 'Pass' }
      ]
    }
  ];

  const [selectedInsp, setSelectedInsp] = useState(inspectionList[0]);
  const [drawerTab, setDrawerTab] = useState('Checklist');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER & FILTERS BAR (Matching Image Panel 4) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Inspections & Audits
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Statutory site audits, HSE checklists, and compliance walk-throughs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button" 
              className="ehs-btn ehs-btn-outline"
              style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}
            >
              + Create Inspection
            </button>
            <button 
              type="button" 
              className="ehs-btn ehs-btn-blue"
              style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}
            >
              <PlusCircle size={14} />
              <span>+ Schedule Inspection</span>
            </button>
          </div>
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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Types">Inspection Type: All</option>
            <option value="Safety">Safety Inspection</option>
            <option value="Environmental">Environmental</option>
            <option value="Equipment">Equipment</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedInspector}
            onChange={(e) => setSelectedInspector(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Inspectors">Inspector: All</option>
            <option value="Rajesh Kumar">Rajesh Kumar</option>
            <option value="Neha Singh">Neha Singh</option>
            <option value="Arvind Patel">Arvind Patel</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="Date Range 2026">Date Range: Sep 2026</option>
            <option value="Aug 2026">Aug 2026</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Statuses">Status: All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* ──── 2. TOP KPI CARDS (5 Cards in a Row - Matching Image Panel 4) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Scheduled</span>
            <Calendar size={14} color="#2563EB" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">24</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Planned in cycle</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Completed</span>
            <CheckCircle2 size={14} color="#059669" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">21</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span style={{ color: '#059669', fontWeight: 700 }}>100% on schedule</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Overdue</span>
            <AlertTriangle size={14} color="#DC2626" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val" style={{ color: '#DC2626' }}>3</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Escalated to BU</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Findings</span>
            <FileCheck2 size={14} color="#D97706" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">12</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Logged to CAPA</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Completion</span>
            <span style={{ fontSize: '11px', color: '#10B981' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">87%</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Target: &gt;85%</span>
          </div>
        </div>
      </div>

      {/* ──── 3. SPLIT MAIN SECTION: TABLE (LEFT 65%) + DETAIL DRAWER (RIGHT 35%) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedInsp ? '1.8fr 1.2fr' : '1fr', gap: '16px' }}>
        {/* Left: Inspections Table */}
        <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Inspections & Audits Register
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Showing {inspectionList.length} site inspections
            </span>
          </div>

          <div className="ehs-table-container">
            <table className="ehs-data-table">
              <thead>
                <tr>
                  <th>Incident / Inspection ID</th>
                  <th>Date</th>
                  <th>Project / Site</th>
                  <th>Type</th>
                  <th>Lead / Inspector</th>
                  <th>Participants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inspectionList.map((insp) => {
                  const isSelected = selectedInsp?.id === insp.id;
                  return (
                    <tr 
                      key={insp.id}
                      onClick={() => setSelectedInsp(insp)}
                      style={{ 
                        background: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ fontWeight: 800, color: '#2563EB' }}>{insp.id}</td>
                      <td style={{ fontSize: '12px', color: '#475569' }}>{insp.date}</td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{insp.project}</td>
                      <td style={{ color: '#475569' }}>{insp.type}</td>
                      <td style={{ fontSize: '12px' }}>{insp.inspector}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{insp.participants}</td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '9999px',
                            background: insp.status === 'Completed' ? 'rgba(16, 185, 129, 0.12)' : insp.status === 'In Progress' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                            color: insp.status === 'Completed' ? '#059669' : insp.status === 'In Progress' ? '#D97706' : '#2563EB'
                          }}
                        >
                          {insp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Inspection Details Drawer Card (Matching Image Panel 4) */}
        {selectedInsp && (
          <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Inspection Details - {selectedInsp.id}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {selectedInsp.project} • {selectedInsp.type}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedInsp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
              {['Overview', 'Checklist', 'Findings', 'Actions', 'Evidence'].map((tab) => (
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

            {/* Basic Information */}
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                Basic Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
                <div><span style={{ color: '#64748B' }}>Inspection ID:</span> <strong>{selectedInsp.id}</strong></div>
                <div><span style={{ color: '#64748B' }}>Type:</span> <strong>{selectedInsp.type}</strong></div>
                <div><span style={{ color: '#64748B' }}>Project / Site:</span> <strong>{selectedInsp.project}</strong></div>
                <div><span style={{ color: '#64748B' }}>Inspector:</span> <strong>{selectedInsp.inspector}</strong></div>
                <div><span style={{ color: '#64748B' }}>Date:</span> <strong>{selectedInsp.date}</strong></div>
                <div><span style={{ color: '#64748B' }}>Status:</span> <strong>{selectedInsp.status}</strong></div>
              </div>
            </div>

            {/* Checklist Section (Pass / Fail / NA buttons - Matching Image Panel 4) */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Checklist
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedInsp.checklist.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B' }}>{item.name}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: item.status === 'Pass' ? '#10B981' : '#F1F5F9',
                          color: item.status === 'Pass' ? '#FFFFFF' : '#64748B'
                        }}
                      >
                        Pass
                      </button>
                      <button
                        type="button"
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: item.status === 'Fail' ? '#EF4444' : '#F1F5F9',
                          color: item.status === 'Fail' ? '#FFFFFF' : '#64748B'
                        }}
                      >
                        Fail
                      </button>
                      <button
                        type="button"
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: item.status === 'NA' ? '#94A3B8' : '#F1F5F9',
                          color: item.status === 'NA' ? '#FFFFFF' : '#64748B'
                        }}
                      >
                        NA
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                className="ehs-btn ehs-btn-blue"
                style={{ padding: '6px 14px', fontSize: '11.5px' }}
                onClick={() => onNavigateTab?.('corrective-actions')}
              >
                Log Findings to CAPA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
