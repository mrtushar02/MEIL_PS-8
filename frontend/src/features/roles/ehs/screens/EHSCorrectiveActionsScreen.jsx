import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PlusCircle,
  Filter,
  X
} from 'lucide-react';

export default function EHSCorrectiveActionsScreen({
  actions = [],
  onCreateAction,
  onUpdateActionStatus,
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects / Sites');
  const [selectedPeriod, setSelectedPeriod] = useState('Sep 2026');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');

  const defaultActions = [
    {
      id: 'CA-2026-22',
      source: 'Incident (INC-2026-05)',
      project: 'Zojila Tunnel',
      type: 'Injury',
      priority: 'Critical',
      owner: 'Amit Singh',
      dueDate: '30 Sep 2026',
      status: 'Overdue',
      description: 'Scaffolding toe-board displacement and missing safety harness tie-off cable.',
      measures: [
        { text: 'Mandatory Double-Locking Harness Tie-off', done: true },
        { text: 'Install Steel Toe-boards across Tier 2 & 3', done: false },
        { text: 'Certified Scaffolder Daily Inspection Sign-off', done: false }
      ]
    },
    {
      id: 'CA-2026-21',
      source: 'Inspection (INSP-2026-15)',
      project: 'Access Road',
      type: 'Fall',
      priority: 'High',
      owner: 'Arvind Patel',
      dueDate: '01 Oct 2026',
      status: 'In Progress',
      description: 'Excavation slope angle too steep with potential rockfall risk onto access road.',
      measures: [
        { text: 'Regrade slope angle to 1:1.5 ratio', done: true },
        { text: 'Install rockfall netting barrier', done: false }
      ]
    },
    {
      id: 'CA-2026-20',
      source: 'Observation (SO-102)',
      project: 'Camp Area',
      type: 'Electrical',
      priority: 'Medium',
      owner: 'Rahul Mehta',
      dueDate: '03 Oct 2026',
      status: 'Open',
      description: 'Underground temporary power distribution cables lacking mechanical protection.',
      measures: [
        { text: 'Route cables through heavy-duty HDPE conduits', done: false },
        { text: 'Install RCD 30mA residual current breakers', done: false }
      ]
    },
    {
      id: 'CA-2026-19',
      source: 'Hazard Report',
      project: 'Main Tunnel',
      type: 'Hazard',
      priority: 'Low',
      owner: 'Neha Singh',
      dueDate: '05 Oct 2026',
      status: 'Verified',
      description: 'Emergency escape tunnel signage faded due to exhaust fumes.',
      measures: [
        { text: 'Replace with photoluminescent LED signs', done: true }
      ]
    },
    {
      id: 'CA-2026-18',
      source: 'Inspection (INSP-2026-11)',
      project: 'Bridge Site',
      type: 'Equipment',
      priority: 'Critical',
      owner: 'Vikram Rao',
      dueDate: '07 Oct 2026',
      status: 'Closed',
      description: 'Mobile crane outrigger pad showing structural fissure under load.',
      measures: [
        { text: 'Replace cast iron pad with heavy-duty hardwood timbers', done: true },
        { text: 'Load test third-party certification', done: true }
      ]
    }
  ];

  const incomingFormatted = Array.isArray(actions) && actions.length > 0 ? actions.map(a => ({
    id: a.id || `CA-2026-${String(Date.now()).slice(-2)}`,
    source: a.source || 'Audit Inspection',
    project: a.project || a.project_name || 'Zojila Tunnel',
    type: a.type || 'Safety',
    priority: a.priority || 'High',
    owner: a.owner || a.assigned_to || 'Site Lead',
    dueDate: a.dueDate || a.target_date || '10 Oct 2026',
    status: a.status || 'Open',
    description: a.description || 'Remediation task logged from audit inspection.',
    measures: a.measures || [{ text: 'Implement engineering barrier', done: false }]
  })) : [];

  const [localActions, setLocalActions] = useState([...incomingFormatted, ...defaultActions]);
  const [selectedAction, setSelectedAction] = useState(localActions[0]);
  const [drawerTab, setDrawerTab] = useState('Overview');
  const [isCreateActionOpen, setIsCreateActionOpen] = useState(false);
  const [newActionForm, setNewActionForm] = useState({
    description: '',
    project: 'Zojila Tunnel',
    priority: 'High',
    type: 'Fall Protection',
    owner: 'Site Safety Officer',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  });

  const filteredActions = localActions.filter(act => {
    if (selectedProject !== 'All Projects / Sites' && !act.project.includes(selectedProject)) return false;
    if (selectedStatus !== 'All Statuses' && act.status !== selectedStatus) return false;
    if (selectedPriority !== 'All Priorities' && act.priority !== selectedPriority) return false;
    return true;
  });

  const handleSignOff = (actId) => {
    setLocalActions(prev => prev.map(a => a.id === actId ? { ...a, status: 'Verified' } : a));
    if (selectedAction?.id === actId) {
      setSelectedAction(prev => prev ? { ...prev, status: 'Verified' } : null);
    }
    if (onUpdateActionStatus) onUpdateActionStatus(actId, 'Verified');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER & FILTERS BAR (Matching Image Panel 5) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Corrective Actions
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Closed-loop remediation tracking across incidents, site audits, and environmental inspections.
            </p>
          </div>

          <button 
            type="button" 
            className="ehs-btn ehs-btn-blue"
            onClick={() => setIsCreateActionOpen(true)}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
          >
            <PlusCircle size={15} />
            <span>+ Create Action</span>
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
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="Sep 2026">Sep 2026</option>
            <option value="Aug 2026">Aug 2026</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Statuses">Status: All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Overdue">Overdue</option>
            <option value="Closed">Closed</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Categories">Category: All</option>
            <option value="Injury">Injury</option>
            <option value="Fall">Fall</option>
            <option value="Electrical">Electrical</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Priorities">Priority: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* ──── 2. TOP KPI CARDS (5 Cards in a Row - Matching Image Panel 5) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Total Actions</span>
            <CheckSquare size={14} color="#2563EB" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">16</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>All open & closed</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Open</span>
            <Clock size={14} color="#2563EB" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">9</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Awaiting resolution</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Overdue</span>
            <AlertTriangle size={14} color="#DC2626" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val" style={{ color: '#DC2626' }}>5</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span style={{ color: '#DC2626', fontWeight: 700 }}>Immediate follow-up</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">In Progress</span>
            <Clock size={14} color="#D97706" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">6</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Work underway</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Closed</span>
            <CheckCircle2 size={14} color="#059669" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">7</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Evidence verified</span>
          </div>
        </div>
      </div>

      {/* ──── 3. SPLIT MAIN SECTION: TABLE (LEFT 65%) + DETAIL DRAWER (RIGHT 35%) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedAction ? '1.8fr 1.2fr' : '1fr', gap: '16px' }}>
        {/* Left: Actions Table */}
        <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Corrective Actions Register
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Showing {actionList.length} CAPA items
            </span>
          </div>

          <div className="ehs-table-container">
            <table className="ehs-data-table">
              <thead>
                <tr>
                  <th>Action ID</th>
                  <th>Source</th>
                  <th>Project / Site</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Owner</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {actionList.map((act) => {
                  const isSelected = selectedAction?.id === act.id;
                  return (
                    <tr 
                      key={act.id}
                      onClick={() => setSelectedAction(act)}
                      style={{ 
                        background: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ fontWeight: 800, color: '#2563EB' }}>{act.id}</td>
                      <td style={{ fontSize: '11.5px', color: '#475569' }}>{act.source}</td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{act.project}</td>
                      <td style={{ color: '#475569' }}>{act.type}</td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '9999px',
                            background: act.priority === 'Critical' ? 'rgba(239, 68, 68, 0.12)' : act.priority === 'High' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                            color: act.priority === 'Critical' ? '#DC2626' : act.priority === 'High' ? '#D97706' : '#2563EB'
                          }}
                        >
                          {act.priority}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px' }}>{act.owner}</td>
                      <td style={{ fontSize: '12px', color: act.status === 'Overdue' ? '#DC2626' : '#475569', fontWeight: act.status === 'Overdue' ? 700 : 500 }}>
                        {act.dueDate}
                      </td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '9999px',
                            background: act.status === 'Closed' || act.status === 'Verified' ? 'rgba(16, 185, 129, 0.12)' : act.status === 'Overdue' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                            color: act.status === 'Closed' || act.status === 'Verified' ? '#059669' : act.status === 'Overdue' ? '#DC2626' : '#D97706'
                          }}
                        >
                          {act.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="ehs-btn ehs-btn-outline"
                          style={{ padding: '3px 8px', fontSize: '11px', height: '24px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAction(act);
                          }}
                        >
                          {act.status === 'Closed' || act.status === 'Verified' ? 'Closed' : 'Sign Off'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Action Details Drawer Card (Matching Image Panel 5) */}
        {selectedAction && (
          <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Action Details - {selectedAction.id}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {selectedAction.project} • {selectedAction.source}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedAction(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
              {['Overview', 'Progress', 'Evidence', 'Timeline'].map((tab) => (
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
                <div><span style={{ color: '#64748B' }}>Source:</span> <strong>{selectedAction.source}</strong></div>
                <div><span style={{ color: '#64748B' }}>Priority:</span> <strong style={{ color: '#DC2626' }}>{selectedAction.priority}</strong></div>
                <div><span style={{ color: '#64748B' }}>Owner:</span> <strong>{selectedAction.owner}</strong></div>
                <div><span style={{ color: '#64748B' }}>Due Date:</span> <strong>{selectedAction.dueDate}</strong></div>
                <div><span style={{ color: '#64748B' }}>Status:</span> <strong>{selectedAction.status}</strong></div>
                <div><span style={{ color: '#64748B' }}>Type:</span> <strong>{selectedAction.type}</strong></div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Finding Statement</div>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4, background: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                {selectedAction.description}
              </p>
            </div>

            {/* Corrective Measures Checkbox list */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Corrective Measures
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedAction.measures.map((m, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#1E293B', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={m.done} style={{ width: '14px', height: '14px', accentColor: '#2563EB' }} />
                    <span style={{ textDecoration: m.done ? 'line-through' : 'none', color: m.done ? '#94A3B8' : '#1E293B' }}>
                      {m.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verification Footer Action */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                className="ehs-btn ehs-btn-primary"
                style={{ padding: '6px 14px', fontSize: '11.5px' }}
                onClick={() => onNavigateTab?.('evidence')}
              >
                Upload Closure Evidence
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
