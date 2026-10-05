import React, { useState } from 'react';
import { X, FileCheck2, Check } from 'lucide-react';

export default function AddObligationModal({
  isOpen,
  onClose,
  onAddObligation
}) {
  const [formData, setFormData] = useState({
    id: `CO-${Math.floor(100 + Math.random() * 900)}`,
    requirement: '',
    category: 'Legal',
    source: 'Companies Act',
    owner: 'Compliance',
    dueDate: '31 Dec 2026',
    status: 'In Progress',
    evidence: 'Pending Review',
    applicability: 'Applicable',
    frequency: 'Quarterly',
    scope: 'Group Level'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.requirement.trim()) {
      alert('Please enter a Requirement title');
      return;
    }
    onAddObligation?.(formData);
    onClose();
  };

  return (
    <div className="gov-modal-overlay" onClick={onClose}>
      <div className="gov-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="gov-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck2 size={18} style={{ color: '#2563EB' }} />
            <h3>Add Compliance Obligation</h3>
          </div>
          <button className="gov-page-btn" onClick={onClose}><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="gov-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-form-label">Obligation Code</label>
                <input 
                  type="text" 
                  className="gov-form-input" 
                  value={formData.id}
                  disabled
                  style={{ background: '#F8FAFC' }}
                />
              </div>

              <div className="gov-form-group">
                <label className="gov-form-label">Requirement Title *</label>
                <input 
                  type="text" 
                  className="gov-form-input" 
                  placeholder="e.g. Annual Anti-Bribery Certification"
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-form-label">Regulatory Source</label>
                <input 
                  type="text" 
                  className="gov-form-input" 
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g. Prevention of Corruption Act"
                />
              </div>

              <div className="gov-form-group">
                <label className="gov-form-label">Category</label>
                <select 
                  className="gov-form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Legal">Legal</option>
                  <option value="ESG">ESG</option>
                  <option value="Governance">Governance</option>
                  <option value="Social">Social</option>
                  <option value="Environmental">Environmental</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-form-label">Owner</label>
                <select 
                  className="gov-form-select"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                >
                  <option value="Compliance">Compliance</option>
                  <option value="Legal">Legal</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="ESG">ESG</option>
                </select>
              </div>

              <div className="gov-form-group">
                <label className="gov-form-label">Due Date</label>
                <input 
                  type="text" 
                  className="gov-form-input" 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="gov-form-group">
              <label className="gov-form-label">Scope</label>
              <input 
                type="text" 
                className="gov-form-input" 
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              />
            </div>
          </div>

          <div className="gov-modal-footer">
            <button type="button" className="gov-btn gov-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="gov-btn gov-btn-primary">
              <Check size={14} />
              Save Obligation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
