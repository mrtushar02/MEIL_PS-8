import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';

export default function LogCommunityActivityModal({ isOpen, onClose, projects = [], onLogActivity }) {
  const [formData, setFormData] = useState({
    project: projects[0]?.id || 'CSR-001',
    community: 'Raghunathpur, Odisha',
    activity_type: 'Health Camp / Vaccination Drive',
    date: '20 Sep 2026',
    participants: 120,
    spend_inr: 45000,
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogActivity?.(formData);
    onClose();
  };

  return (
    <div className="csr-modal-overlay">
      <div className="csr-modal-container">
        <div className="csr-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} />
            </div>
            <h2 className="csr-modal-title">Log Community Activity</h2>
          </div>
          <button className="csr-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="csr-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="csr-form-group">
                <label className="csr-form-label">CSR Project</label>
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
                <label className="csr-form-label">Activity Type</label>
                <select
                  className="csr-form-select"
                  value={formData.activity_type}
                  onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                >
                  <option>Health Camp / Vaccination Drive</option>
                  <option>School Kit & Digital Lab Handover</option>
                  <option>Clean Water Station Commissioning</option>
                  <option>Women SHG Training Session</option>
                  <option>Gram Sabha Stakeholder Consultation</option>
                </select>
              </div>

              <div className="csr-form-group">
                <label className="csr-form-label">Date Conducted</label>
                <input
                  type="text"
                  className="csr-form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="csr-form-group">
                <label className="csr-form-label">Participants / Beneficiaries</label>
                <input
                  type="number"
                  className="csr-form-input"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                  required
                />
              </div>

              <div className="csr-form-group">
                <label className="csr-form-label">Direct Expense (INR ₹)</label>
                <input
                  type="number"
                  className="csr-form-input"
                  value={formData.spend_inr}
                  onChange={(e) => setFormData({ ...formData, spend_inr: e.target.value })}
                />
              </div>
            </div>

            <div className="csr-form-group">
              <label className="csr-form-label">Activity Notes & Attendance Summary</label>
              <textarea
                className="csr-form-textarea"
                rows={3}
                placeholder="Key outcomes, Gram Panchayat attendance, photos uploaded..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="csr-modal-footer">
            <button type="button" className="csr-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="csr-btn-primary">
              <Check size={16} />
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
