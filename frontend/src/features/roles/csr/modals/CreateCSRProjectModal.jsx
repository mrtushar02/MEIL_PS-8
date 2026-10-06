import React, { useState } from 'react';
import { X, FolderKanban, Check } from 'lucide-react';

export default function CreateCSRProjectModal({ isOpen, onClose, onAddProject }) {
  const [formData, setFormData] = useState({
    id: `CSR-00${Math.floor(Math.random() * 90) + 10}`,
    name: '',
    category: 'Education',
    location: 'Odisha',
    business_unit: 'Hydel & Tunnel Infrastructure',
    start_date: '01 Oct 2026',
    end_date: '31 Mar 2028',
    budget_cr: '1.5',
    spend_cr: '0.0',
    beneficiaries: '1500',
    status: 'Active',
    partner: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    const newProject = {
      ...formData,
      budget_cr: parseFloat(formData.budget_cr) || 1.0,
      spend_cr: parseFloat(formData.spend_cr) || 0.0,
      beneficiaries: parseInt(formData.beneficiaries) || 1000,
      communities_count: 5
    };
    onAddProject?.(newProject);
    onClose();
  };

  return (
    <div className="csr-modal-overlay">
      <div className="csr-modal-container">
        <div className="csr-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderKanban size={18} />
            </div>
            <h2 className="csr-modal-title">Create CSR Project</h2>
          </div>
          <button className="csr-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="csr-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div className="csr-form-group">
                <label className="csr-form-label">Project Code</label>
                <input
                  type="text"
                  className="csr-form-input"
                  value={formData.id}
                  disabled
                />
              </div>
              <div className="csr-form-group">
                <label className="csr-form-label">Project Name *</label>
                <input
                  type="text"
                  className="csr-form-input"
                  placeholder="e.g. Rural Solar Electrification Phase 2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="csr-form-group">
                <label className="csr-form-label">Program Category</label>
                <select
                  className="csr-form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Education</option>
                  <option>Health</option>
                  <option>Livelihood</option>
                  <option>Community Infra</option>
                  <option>Environment</option>
                </select>
              </div>

              <div className="csr-form-group">
                <label className="csr-form-label">Location / State</label>
                <select
                  className="csr-form-select"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  <option>Odisha</option>
                  <option>Telangana</option>
                  <option>Karnataka</option>
                  <option>Bihar</option>
                  <option>Assam</option>
                  <option>Maharashtra</option>
                  <option>UP</option>
                  <option>Rajasthan</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="csr-form-group">
                <label className="csr-form-label">Approved Budget (₹ Cr)</label>
                <input
                  type="number"
                  step="0.1"
                  className="csr-form-input"
                  value={formData.budget_cr}
                  onChange={(e) => setFormData({ ...formData, budget_cr: e.target.value })}
                />
              </div>

              <div className="csr-form-group">
                <label className="csr-form-label">Target Beneficiaries</label>
                <input
                  type="number"
                  className="csr-form-input"
                  value={formData.beneficiaries}
                  onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                />
              </div>
            </div>

            <div className="csr-form-group">
              <label className="csr-form-label">Implementing Partner / NGO</label>
              <input
                type="text"
                className="csr-form-input"
                placeholder="e.g. Aga Khan Rural Support / Local Gram Trust"
                value={formData.partner}
                onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
              />
            </div>

            <div className="csr-form-group">
              <label className="csr-form-label">Project Objective & Description</label>
              <textarea
                className="csr-form-textarea"
                rows={3}
                placeholder="Detailed scope, measurable social impact indicators and community baseline..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="csr-modal-footer">
            <button type="button" className="csr-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="csr-btn-primary">
              <Check size={16} />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
