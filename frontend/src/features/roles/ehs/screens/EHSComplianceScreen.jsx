import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Filter
} from 'lucide-react';

export default function EHSComplianceScreen({
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedModule, setSelectedModule] = useState('All Modules');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Compliance tasks matching image Panel 11
  const complianceTasks = [
    {
      id: 1,
      task: 'Close incident investigation',
      module: 'Safety',
      project: 'Zojila Tunnel',
      dueDate: '29 Sep 2026',
      priority: 'Critical',
      status: 'Open',
      overview: 'Overdue',
      targetTab: 'incidents'
    },
    {
      id: 2,
      task: 'Conduct weekly safety drill',
      module: 'Training',
      project: 'Access Road',
      dueDate: '30 Sep 2026',
      priority: 'High',
      status: 'In Progress',
      overview: 'Due Today',
      targetTab: 'training'
    },
    {
      id: 3,
      task: 'Submit waste data filing',
      module: 'Environmental',
      project: 'Camp Area',
      dueDate: '01 Oct 2026',
      priority: 'Medium',
      status: 'Open',
      overview: 'Due This Week',
      targetTab: 'submissions'
    },
    {
      id: 4,
      task: 'Inspection - scaffolding',
      module: 'Inspection',
      project: 'Main Tunnel',
      dueDate: '02 Oct 2026',
      priority: 'Low',
      status: 'Open',
      overview: 'Upcoming',
      targetTab: 'inspections'
    },
    {
      id: 5,
      task: 'Provide closure evidence',
      module: 'Corrective Action',
      project: 'Bridge Site',
      dueDate: '03 Oct 2026',
      priority: 'Critical',
      status: 'In Progress',
      overview: 'Upcoming',
      targetTab: 'corrective-actions'
    }
  ];

  const [tasks, setTasks] = useState(complianceTasks);

  const handleToggleComplete = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      status: t.status === 'Completed' ? 'Open' : 'Completed'
    } : t));
  };

  const filteredTasks = tasks.filter(t => {
    if (selectedProject !== 'All Projects' && t.project !== selectedProject) return false;
    if (selectedModule !== 'All Modules' && t.module !== selectedModule) return false;
    if (selectedPriority !== 'All Priorities' && t.priority !== selectedPriority) return false;
    if (selectedStatus !== 'All Statuses' && t.status !== selectedStatus) return false;
    return true;
  });

  const criticalCount = tasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed').length;
  const dueTodayCount = tasks.filter(t => t.overview === 'Due Today' && t.status !== 'Completed').length;
  const dueThisWeekCount = tasks.filter(t => t.overview === 'Due This Week' && t.status !== 'Completed').length;
  const overdueCount = tasks.filter(t => t.overview === 'Overdue' && t.status !== 'Completed').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER & FILTERS BAR (Matching Image Panel 11) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Compliance / Action Center
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Unified compliance obligations, DGMS permit renewals, and time-critical corrective actions.
            </p>
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
            <option value="All Projects">Project: All</option>
            <option value="Zojila Tunnel">Zojila Tunnel</option>
            <option value="Access Road">Access Road</option>
            <option value="Camp Area">Camp Area</option>
            <option value="Main Tunnel">Main Tunnel</option>
            <option value="Bridge Site">Bridge Site</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Modules">Module: All</option>
            <option value="Safety">Safety</option>
            <option value="Training">Training</option>
            <option value="Environmental">Environmental</option>
            <option value="Inspection">Inspection</option>
            <option value="Corrective Action">Corrective Action</option>
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
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* ──── 2. TOP STATUS PILL CARDS (5 Cards - Matching Image Panel 11) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        <div className="ehs-kpi-card" style={{ borderLeft: '3px solid #EF4444' }}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Critical</span>
            <AlertTriangle size={14} color="#DC2626" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val" style={{ color: '#DC2626' }}>{criticalCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Requires urgent sign-off</span>
          </div>
        </div>

        <div className="ehs-kpi-card" style={{ borderLeft: '3px solid #F97316' }}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Due Today</span>
            <Clock size={14} color="#D97706" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val" style={{ color: '#D97706' }}>{dueTodayCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Shift deadline</span>
          </div>
        </div>

        <div className="ehs-kpi-card" style={{ borderLeft: '3px solid #3B82F6' }}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Due This Week</span>
            <Calendar size={14} color="#2563EB" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val" style={{ color: '#2563EB' }}>{dueThisWeekCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Scheduled tasks</span>
          </div>
        </div>

        <div className="ehs-kpi-card" style={{ borderLeft: '3px solid #EF4444' }}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Overdue</span>
            <AlertTriangle size={14} color="#DC2626" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val" style={{ color: '#DC2626' }}>{overdueCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Escalated to BU</span>
          </div>
        </div>

        <div className="ehs-kpi-card" style={{ borderLeft: '3px solid #10B981' }}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Completed</span>
            <CheckCircle2 size={14} color="#10B981" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val" style={{ color: '#10B981' }}>{completedCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Resolved obligations</span>
          </div>
        </div>
      </div>

      {/* ──── 3. COMPLIANCE TASKS TABLE (Matching Image Panel 11) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Compliance Obligations Register
          </h3>
          <span style={{ fontSize: '11.5px', color: '#64748B' }}>
            Showing {filteredTasks.length} statutory items
          </span>
        </div>

        <div className="ehs-table-container">
          <table className="ehs-data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Module</th>
                <th>Project</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Overview</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 700, color: '#0F172A' }}>{t.task}</td>
                  <td style={{ color: '#475569' }}>{t.module}</td>
                  <td style={{ color: '#475569' }}>{t.project}</td>
                  <td style={{ fontSize: '12px', color: '#64748B' }}>{t.dueDate}</td>
                  <td>
                    <span 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        padding: '2px 8px', 
                        borderRadius: '9999px',
                        background: t.priority === 'Critical' ? 'rgba(239, 68, 68, 0.12)' : t.priority === 'High' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                        color: t.priority === 'Critical' ? '#DC2626' : t.priority === 'High' ? '#D97706' : '#2563EB'
                      }}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(t.id)}
                      style={{
                        fontSize: '11px', 
                        fontWeight: 700, 
                        padding: '2px 8px', 
                        borderRadius: '9999px',
                        border: 'none',
                        cursor: 'pointer',
                        background: t.status === 'Completed' ? 'rgba(16, 185, 129, 0.12)' : t.status === 'In Progress' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                        color: t.status === 'Completed' ? '#059669' : t.status === 'In Progress' ? '#D97706' : '#2563EB'
                      }}
                    >
                      {t.status === 'Completed' ? '✓ Completed' : t.status}
                    </button>
                  </td>
                  <td>
                    <span 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        padding: '2px 8px', 
                        borderRadius: '9999px',
                        background: t.overview === 'Overdue' ? 'rgba(239, 68, 68, 0.12)' : t.overview === 'Due Today' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                        color: t.overview === 'Overdue' ? '#DC2626' : t.overview === 'Due Today' ? '#D97706' : '#2563EB'
                      }}
                    >
                      {t.overview}
                    </span>
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="ehs-btn ehs-btn-outline"
                      style={{ padding: '3px 8px', fontSize: '11px', height: '24px' }}
                      onClick={() => onNavigateTab?.(t.targetTab)}
                    >
                      Resolve
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
