import React, { useState } from 'react';
import { X, ShieldAlert, Check } from 'lucide-react';

export default function RegisterCaseModal({
  isOpen,
  onClose,
  onRegisterCase,
  type = 'ethics'
}) {
  const [formData, setFormData] = useState({
    id: type === 'ethics' ? `ETH-${Math.floor(100 + Math.random() * 900)}` : `GRV-${Math.floor(100 + Math.random() * 900)}`,
    category: type === 'ethics' ? 'Whistleblower' : 'Community',
    severity: 'Medium',
    scope: 'Group Scope',
    owner: 'Compliance',
    dueDate: '15 Oct 2026',
    status: 'Under Review',
    description: '',
    resolution: 'Triage in progress'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;
    onRegisterCase?.(formData);
    onClose();
  };

  return (
    <div className="gov-modal-overlay" onClick={onClose}>
      <div className="gov-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="gov-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} style={{ color: '#DC2626' }} />
            <h3>{type === 'ethics' ? 'Register Ethics / Speak-Up Case' : 'Register Stakeholder Grievance'}</h3>
          </div>
          <button className="gov-page-btn" onClick={onClose}><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="gov-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-form-label">Case ID</label>
                <input 
                  type="text" 
                  className="gov-form-input" 
                  value={formData.id}
                  disabled
                  style={{ background: '#F8FAFC' }}
                />
              </div>

              <div className="gov-form-group">
                <label className="gov-form-label">Category</label>
                <select 
                  className="gov-form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {type === 'ethics' ? (
                    <>
                      <option value="Whistleblower">Whistleblower</option>
                      <option value="Conflict of Interest">Conflict of Interest</option>
                      <option value="Fraud">Fraud</option>
                      <option value="Misconduct">Misconduct</option>
                      <option value="Policy Violation">Policy Violation</option>
                    </>
                  ) : (
                    <>
                      <option value="Community">Community</option>
                      <option value="HR Related">HR Related</option>
                      <option value="Vendor">Vendor</option>
                      <option value="Environmental">Environmental</option>
                      <option value="Safety">Safety</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-form-label">Severity Level</label>
                <select 
                  className="gov-form-select"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="gov-form-group">
                <label className="gov-form-label">Target Response Date</label>
                <input 
                  type="text" 
                  className="gov-form-input" 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="gov-form-group">
              <label className="gov-form-label">Location / Scope</label>
              <input 
                type="text" 
                className="gov-form-input" 
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              />
            </div>

            <div className="gov-form-group">
              <label className="gov-form-label">Confidential Summary *</label>
              <textarea 
                rows={3}
                className="gov-form-textarea"
                placeholder="Details of the incident, report, or stakeholder grievance..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="gov-modal-footer">
            <button type="button" className="gov-btn gov-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="gov-btn gov-btn-primary">
              <Check size={14} />
              Register Confidential Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
