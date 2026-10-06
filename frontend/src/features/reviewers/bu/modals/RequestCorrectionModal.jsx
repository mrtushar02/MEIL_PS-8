import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export default function RequestCorrectionModal({
  submission,
  isOpen,
  onClose,
  onSubmitCorrection,
  isSubmitting = false
}) {
  const [category, setCategory] = useState('Data Discrepancy');
  const [reason, setReason] = useState('');
  const [requiredEvidence, setRequiredEvidence] = useState('');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [deadline, setDeadline] = useState('2026-10-10');

  if (!isOpen || !submission) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a specific reason for the correction.');
      return;
    }
    onSubmitCorrection({
      category,
      reason: reason.trim(),
      requiredEvidence: requiredEvidence.trim(),
      reviewerNotes: reviewerNotes.trim(),
      deadline
    });
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
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DC2626'
              }}>
                <AlertTriangle size={18} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Request Correction</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 40px' }}>
              Return this submission to the project team with a clear correction reason.
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

        {/* Submission Context Strip */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '8px 14px',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div><strong>ID:</strong> {submission.id}</div>
          <div><strong>Project:</strong> {submission.projectName || submission.project_id}</div>
          <div><strong>Version:</strong> v{submission.version || 1}</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Correction Category */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Correction Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13px',
                color: '#0F172A',
                outline: 'none',
                background: '#FFFFFF'
              }}
            >
              <option value="Data Discrepancy">Data Discrepancy (Values out of range)</option>
              <option value="Missing Evidence">Missing Evidence (Invoices / calibration certificates missing)</option>
              <option value="Calculation Mismatch">Calculation Mismatch (Unit conversion / factor error)</option>
              <option value="Scope Misalignment">Scope Misalignment (Boundary definition issue)</option>
              <option value="Weighbridge / Stamp">Weighbridge / Official stamp unverified</option>
              <option value="Other">Other Operational Exception</option>
            </select>
          </div>

          {/* Reason for Correction */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                Reason for Correction <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{reason.length}/500</span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={500}
              placeholder="Enter detailed reason for returning this submission (e.g. Weighbridge slip missing official MEIL site stamp; diesel consumption variance requires reconciliation)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '12.5px',
                fontFamily: 'inherit',
                color: '#0F172A',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Required Evidence */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Required Evidence Document
            </label>
            <input
              type="text"
              placeholder="Specify required evidence (e.g. Indian Oil Tanker Delivery Challan #881)"
              value={requiredEvidence}
              onChange={(e) => setRequiredEvidence(e.target.value)}
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

          {/* Reviewer Notes & Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                Reviewer Notes (Internal)
              </label>
              <input
                type="text"
                placeholder="Additional internal audit notes..."
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
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
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                Correction Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '12px',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Immutable Audit Trail Warning */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '11.5px',
            color: '#B45309'
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>This action will be recorded in the immutable audit trail with actor signature and SHA-256 block reference.</span>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="bu-btn bu-btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bu-btn bu-btn-danger"
              disabled={isSubmitting || !reason.trim()}
            >
              {isSubmitting ? 'Recording...' : 'Request Correction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
