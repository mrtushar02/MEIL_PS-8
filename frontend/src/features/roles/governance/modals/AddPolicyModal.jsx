import React, { useState } from 'react';
import {
  X,
  FileText,
  Check
} from 'lucide-react';

export default function AddPolicyModal({
  isOpen,
  onClose,
  onAddPolicy
}) {
  const [formData, setFormData] = useState({
    id: `POL-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    category: 'Governance',
    department: 'Legal & Compliance',
    owner: 'Compliance',
    effectiveDate: '01 Oct 2026',
    reviewDate: '01 Oct 2028',
    version: 'v1.0',
    scope: 'All Subsidiaries & Business Units',
    description: '',
    status: 'Active'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onAddPolicy?.({
      ...formData,
      approvalStatus: 'Approved',
      evidenceCount: 1
    });
    onClose();
  };

  return (
    <div className="gov-modal-overlay" onClick={onClose}>
      <div className="gov-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="gov-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} style={{ color: '#2563EB' }} />
            <h3>Add New Governance Policy</h3>
          </div>
          <button className="gov-page-btn" onClick={onClose}><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="gov-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-form-label">Policy ID</label>
                <input 
                  type="text" 
                  className="gov-form-input" 
                  value={formData.id}
                  disabled
                  style={{ background: '#F8FAFC' }}
                />
              </div>

              <div className="gov-form-group">
                <label className="gov-form-label">Policy Name *</label>
                <input 
                  type="text" 
                  className="gov-form-input" 
                  placeholder="e.g. Anti-Bribery & Whistleblower Charter"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-form-label">Category</label>
                <select 
                  className="gov-form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Governance">Governance</option>
                  <option value="Ethics & Integrity">Ethics & Integrity</option>
                  <option value="Social">Social</option>
                  <option value="Environmental">Environmental</option>
                </select>
              </div>

              <div className="gov-form-group">
                <label className="gov-form-label">Department / Owner</label>
                <select 
                  className="gov-form-select"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                >
                  <option value="Compliance">Compliance</option>
                  <option value="Legal">Legal</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="ESG">ESG</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-form-label">Effective Date</label>
                <input 
                  type="text" 
                  className="gov-form-input" 
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                />
              </div>

              <div className="gov-form-group">
                <label className="gov-form-label">Next Review Date</label>
                <input 
                  type="text" 
                  className="gov-form-input" 
                  value={formData.reviewDate}
                  onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                />
              </div>
            </div>

            <div className="gov-form-group">
              <label className="gov-form-label">Applicable Scope</label>
              <input 
                type="text" 
                className="gov-form-input" 
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              />
            </div>

            <div className="gov-form-group">
              <label className="gov-form-label">Policy Summary / Description</label>
              <textarea 
                rows={3}
                className="gov-form-textarea"
                placeholder="Brief description of policy requirements, compliance goals, and governance obligations..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="gov-modal-footer">
            <button type="button" className="gov-btn gov-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="gov-btn gov-btn-primary">
              <Check size={14} />
              Save Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
