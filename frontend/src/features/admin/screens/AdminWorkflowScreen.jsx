import React, { useState } from 'react';
import { 
  GitPullRequest, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Plus
} from 'lucide-react';

export default function AdminWorkflowScreen({
  workflowData = null
}) {
  const states = workflowData?.states || [
    { name: 'DRAFT', label: 'Draft', color: '#64748B' },
    { name: 'SUBMITTED', label: 'Submitted', color: '#0284C7' },
    { name: 'BU_APPROVED', label: 'BU Review', color: '#0D9488' },
    { name: 'SUBSIDIARY_APPROVED', label: 'Subsidiary Approval', color: '#7C3AED' },
    { name: 'GROUP_APPROVED', label: 'Group Approval', color: '#2563EB' },
    { name: 'GROUP_AUDITED', label: 'Audit', color: '#D97706' },
    { name: 'LOCKED', label: 'Locked', color: '#16A34A' }
  ];

  const transitions = workflowData?.transitions || [
    { from_state: 'DRAFT', to_state: 'SUBMITTED', required_role: 'PROJECT_OFFICER', required_permission: 'esg:submit', sla: 'Immediate', is_active: true },
    { from_state: 'SUBMITTED', to_state: 'BU_APPROVED', required_role: 'BU_COORDINATOR', required_permission: 'esg:bu_review', sla: '2 Days', is_active: true },
    { from_state: 'BU_APPROVED', to_state: 'SUBSIDIARY_APPROVED', required_role: 'SUBSIDIARY_HEAD', required_permission: 'esg:subsidiary_review', sla: '3 Days', is_active: true },
    { from_state: 'SUBSIDIARY_APPROVED', to_state: 'GROUP_APPROVED', required_role: 'GROUP_CSO', required_permission: 'esg:group_lock', sla: '3 Days', is_active: true },
    { from_state: 'GROUP_APPROVED', to_state: 'GROUP_AUDITED', required_role: 'ASSURANCE_AUDITOR', required_permission: 'assurance:audit_execute', sla: '5 Days', is_active: true },
    { from_state: 'GROUP_AUDITED', to_state: 'LOCKED', required_role: 'SUPER_ADMIN', required_permission: 'esg:group_lock', sla: '1 Day', is_active: true },
    { from_state: 'SUBMITTED', to_state: 'CORRECTION_REQUIRED', required_role: 'BU_COORDINATOR', required_permission: 'esg:bu_review', sla: '1 Day', is_active: true }
  ];

  return (
    <div className="admin-workflow-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Submission Workflow Configuration</h2>
          <p>Configure multi-tier state machine transitions, statutory approval gates, and SLA deadlines</p>
        </div>
      </div>

      {/* Visual State Machine Flow Diagram */}
      <div className="admin-card" style={{ margin: '0 0 20px 0', padding: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '16px' }}>
          Linear Approval State Machine Flow
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'rgba(248, 250, 252, 0.85)',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          overflowX: 'auto',
          gap: '12px'
        }}>
          {states.map((st, i) => (
            <React.Fragment key={st.name}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '90px'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: `2px solid ${st.color || '#2563EB'}`,
                  color: st.color || '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '800',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#334155', marginTop: '6px', textAlign: 'center' }}>
                  {st.label}
                </span>
                <span style={{ fontSize: '9px', color: '#94A3B8' }}><code>{st.name}</code></span>
              </div>

              {i < states.length - 1 && (
                <div style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center' }}>
                  <ArrowRight size={18} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Transitions Table */}
      <div className="admin-table-card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Workflow Transitions & Authority Matrix
          </h3>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            {transitions.length} Active Rules
          </span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>From State</th>
              <th>To State</th>
              <th>Required Role</th>
              <th>Required Permission</th>
              <th>Compliance SLA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transitions.map((t, idx) => (
              <tr key={idx}>
                <td>
                  <span className="admin-badge admin-badge-blue">{t.from_state}</span>
                </td>
                <td>
                  <span className={`admin-badge ${t.to_state.includes('CORRECTION') ? 'admin-badge-warning' : 'admin-badge-purple'}`}>
                    {t.to_state}
                  </span>
                </td>
                <td>
                  <strong style={{ color: '#0F172A' }}>{t.required_role}</strong>
                </td>
                <td>
                  <code>{t.required_permission}</code>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <Clock size={12} color="#64748B" /> {t.sla}
                  </div>
                </td>
                <td>
                  <span className="admin-badge admin-badge-success">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
