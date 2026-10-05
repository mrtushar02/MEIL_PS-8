import React, { useState } from 'react';
import {
  CheckCircle2,
  Paperclip,
  ArrowRight
} from 'lucide-react';

export default function IncidentDetailDrawer({
  incident,
  onClose,
  onUpdateStatus,
  onNavigateTab
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!incident) return null;

  const workflowStages = [
    'Reported',
    'Triage',
    'Investigation',
    'Root Cause Analysis',
    'Corrective Action',
    'Verification',
    'Closed'
  ];

  const currentStageIndex = workflowStages.indexOf(incident.status) !== -1 
    ? workflowStages.indexOf(incident.status) 
    : 0;

  const handleAdvanceWorkflow = () => {
    if (currentStageIndex < workflowStages.length - 1) {
      const nextStage = workflowStages[currentStageIndex + 1];
      onUpdateStatus?.(incident.id, nextStage);
    }
  };

  return (
    <div className="ehs-drawer-backdrop" onClick={onClose}>
      <div className="ehs-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="ehs-drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`ehs-status-chip ${
                incident.severity === 'Critical' ? 'ehs-status-critical' :
                incident.severity === 'High' ? 'ehs-status-warning' : 'ehs-status-active'
              }`}>
                {incident.severity} Severity
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB' }}>
                {incident.incident_number}
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
              {incident.type} — {incident.project_name}
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* Workflow Progression Stepper */}
        <div style={{ background: '#F8FAFC', padding: '14px 24px', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
            Statutory Workflow Progression
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
            {workflowStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <React.Fragment key={stage}>
                  <div style={{ 
                    padding: '3px 8px', 
                    borderRadius: '6px', 
                    fontSize: '11px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    background: isCurrent ? '#2563EB' : isPast ? '#059669' : '#E2E8F0',
                    color: isCurrent || isPast ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isPast && <CheckCircle2 size={11} />}
                    <span>{stage}</span>
                  </div>
                  {idx < workflowStages.length - 1 && (
                    <div style={{ width: '8px', height: '2px', background: isPast ? '#059669' : '#CBD5E1', flexShrink: 0 }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Drawer Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 24px', background: '#FFFFFF' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'rca', label: 'Investigation & RCA' },
            { id: 'actions', label: 'CAPA Actions' },
            { id: 'evidence', label: 'Evidence & Hash' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              style={{
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #2563EB' : '2px solid transparent',
                color: activeTab === tab.id ? '#2563EB' : '#64748B',
                fontWeight: activeTab === tab.id ? 700 : 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body Content */}
        <div className="ehs-drawer-body">
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Event Statement
                </div>
                <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  {incident.description}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Location</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                    {incident.location || 'Site Active Section'}
                  </div>
                </div>

                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Date & Time</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                    {incident.incident_date} at {incident.incident_time || '10:30 AM'}
                  </div>
                </div>

                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>People Affected</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                    {incident.people_affected || 0} Workers
                  </div>
                </div>

                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Responsible Lead</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                    {incident.responsible_owner}
                  </div>
                </div>
              </div>

              {incident.immediate_action && (
                <div style={{ padding: '14px', background: 'rgba(5, 150, 105, 0.05)', borderRadius: '10px', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#047857', marginBottom: '4px' }}>
                    Immediate Containment Measure
                  </div>
                  <div style={{ fontSize: '13px', color: '#065F46' }}>
                    {incident.immediate_action}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rca' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                  Structured Root Cause Analysis (5-Why Framework)
                </div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div><strong>Direct Hazard:</strong> {incident.description}</div>
                  <div><strong>Underlying Cause:</strong> Equipment vibration and climatic freeze-thaw expansion cycles.</div>
                  <div><strong>Root Cause:</strong> {incident.root_cause || 'Omission of secondary positive-lock retaining bolt in high-vibration environment.'}</div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                  Mandatory Remedial Measure
                </div>
                <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px', margin: 0 }}>
                  {incident.corrective_action || 'Upgrade fasteners across all identical assets to certified double-threaded grade 8.8 bolts.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  Action Item #{incident.incident_number}-A1
                </div>
                <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px' }}>
                  {incident.corrective_action || 'Site inspection and torque calibration verification.'}
                </div>
                <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#64748B' }}>
                  Assigned to: <strong>{incident.responsible_owner}</strong> • Due: <strong>{incident.target_date || 'Within 7 Days'}</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Paperclip size={14} color="#2563EB" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    {incident.evidence_ref || 'EVD-GEO-2026-04'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Shaft_Stabilization_Inspection_Survey.pdf (3.2 MB)
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                  ✓ Cryptographically Signed & Verified
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="ehs-drawer-footer">
          <button 
            type="button" 
            className="ehs-btn ehs-btn-outline"
            onClick={onClose}
          >
            Close
          </button>

          {currentStageIndex < workflowStages.length - 1 && (
            <button 
              type="button" 
              className="ehs-btn ehs-btn-primary"
              onClick={handleAdvanceWorkflow}
            >
              <span>Advance to {workflowStages[currentStageIndex + 1]}</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
