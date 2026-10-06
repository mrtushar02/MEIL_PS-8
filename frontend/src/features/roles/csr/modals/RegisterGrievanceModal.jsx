import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';

export default function RegisterGrievanceModal({ isOpen, onClose, onRegisterGrievance, projects = [] }) {
  const [formData, setFormData] = useState({
    id: `GRV-00${Math.floor(Math.random() * 90) + 10}`,
    project: projects[0]?.id || 'CSR-001',
    community: 'Kantapada, Odisha',
    category: 'Community Services',
    severity: 'Medium',
    description: '',
    owner: 'Priya Nair',
    due_date: '30 Sep 2026'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description) return;
    const newGrv = {
      ...formData,
      date: '21 Sep 2026',
      status: 'In Progress',
      resolution: 'Assigned to site CSR coordinator for verification.'
    };
    onRegisterGrievance?.(newGrv);
    onClose();
  };

  return (
    <div className="csr-modal-overlay">
      <div className="csr-modal-container">
        <div className="csr-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={18} />
            </div>
            <h2 className="csr-modal-title">Register Community Grievance</h2>
          </div>
          <button className="csr-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="csr-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="csr-form-group">
                <label className="csr-form-label">Related Project</label>
                <select
                  className="csr-form-select"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="csr-form-group">
                <label className="csr-form-label">Community / Village</label>
                <input
                  type="text"
                  className="csr-form-input"
                  value={formData.community}
                  onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="csr-form-group">
                <label className="csr-form-label">Grievance Category</label>
                <select
                  className="csr-form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Community Services</option>
                  <option>Construction Impact</option>
                  <option>Environmental Concern</option>
                  <option>Access / Connectivity</option>
                  <option>Employment / Livelihood</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="csr-form-group">
                <label className="csr-form-label">Severity Level</label>
                <select
                  className="csr-form-select"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>

            <div className="csr-form-group">
              <label className="csr-form-label">Issue Description *</label>
              <textarea
                className="csr-form-textarea"
                rows={3}
                placeholder="Details of complaint raised by Gram Panchayat or community member..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="csr-form-group">
                <label className="csr-form-label">Assigned Owner</label>
                <input
                  type="text"
                  className="csr-form-input"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                />
              </div>

              <div className="csr-form-group">
                <label className="csr-form-label">Resolution Due Date</label>
                <input
                  type="text"
                  className="csr-form-input"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="csr-modal-footer">
            <button type="button" className="csr-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="csr-btn-primary">
              <Check size={16} />
              Register Grievance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
