import React, { useState } from 'react';
import { CheckCircle2, X, ShieldCheck, FileCheck, Layers, AlertCircle } from 'lucide-react';

export default function ApprovalModal({
  submission,
  isOpen,
  onClose,
  onConfirmApproval,
  isSubmitting = false
}) {
  const [checklist, setChecklist] = useState({
    dataReviewed: true,
    calculationsVerified: true,
    evidenceReviewed: true,
    scopeVerified: true,
    validationPassed: true,
    noBlockingExceptions: true
  });
  const [approvalNotes, setApprovalNotes] = useState('All Scope 1 & 2 fuel and energy meter slips verified. Approved for subsidiary consolidation.');

  if (!isOpen || !submission) return null;

  const allChecked = Object.values(checklist).every(Boolean);

  const handleToggle = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApprove = () => {
    if (!allChecked) {
      alert('Please confirm all pre-approval checklist items before proceeding.');
      return;
    }
    onConfirmApproval({ notes: approvalNotes.trim() });
  };

  return (
    <div className="bu-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bu-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(34, 197, 94, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A'
              }}>
                <CheckCircle2 size={18} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Approve BU Submission</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 40px' }}>
              Please confirm you have reviewed the submission and verified all information.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Pre-approval Checklist */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
            Pre-approval Checklist
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { key: 'dataReviewed', label: 'All ESG data reviewed' },
              { key: 'calculationsVerified', label: 'Calculations verified' },
              { key: 'evidenceReviewed', label: 'Evidence reviewed' },
              { key: 'scopeVerified', label: 'Organization scope verified' },
              { key: 'validationPassed', label: 'Validation passed' },
              { key: 'noBlockingExceptions', label: 'No blocking exceptions' },
            ].map((item) => (
              <label
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#1E293B',
                  cursor: 'pointer',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: checklist[item.key] ? 'rgba(34, 197, 94, 0.08)' : '#F8FAFC',
                  border: `1px solid ${checklist[item.key] ? 'rgba(34, 197, 94, 0.3)' : '#E2E8F0'}`
                }}
              >
                <input
                  type="checkbox"
                  checked={checklist[item.key]}
                  onChange={() => handleToggle(item.key)}
                  style={{ width: '15px', height: '15px', accentColor: '#16A34A', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 600 }}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submission Details Card */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #E2E8F0',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '8px' }}>
            Submission Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12.5px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>Submission ID</span>
              <strong style={{ color: '#0F172A' }}>{submission.id}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>Project</span>
              <strong style={{ color: '#0F172A' }}>{submission.projectName || submission.project_id}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>Reporting Period</span>
              <strong style={{ color: '#0F172A' }}>September 2026</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>Version</span>
              <strong style={{ color: '#0F172A' }}>v{submission.version || 1}</strong>
            </div>
          </div>
        </div>

        {/* Optional Reviewer Notes */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
            Reviewer Statutory Sign-Off Note
          </label>
          <input
            type="text"
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '10px',
              border: '1.5px solid #CBD5E1',
              fontSize: '12.5px',
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Transition Confirmation Callout */}
        <div style={{
          background: 'rgba(37, 99, 235, 0.08)',
          border: '1px solid rgba(37, 99, 235, 0.25)',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          fontSize: '12px',
          color: '#1D4ED8',
          marginBottom: '20px'
        }}>
          <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Approve this submission for Subsidiary-level review?</strong>
            <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
              This action advances workflow status to <strong>BU_APPROVED</strong> and creates an immutable cryptographic audit record.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            className="bu-btn bu-btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bu-btn bu-btn-primary"
            onClick={handleApprove}
            disabled={isSubmitting || !allChecked}
            style={{
              background: '#2563EB',
              padding: '10px 22px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}
          >
            {isSubmitting ? 'Approving...' : 'Approve & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
