import React, { useState } from 'react';
import {
  X
} from 'lucide-react';

export default function AddSupplierModal({ isOpen, onClose, onAddSupplier }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Civil',
    location: '',
    msme: 'Yes',
    local: 'Yes',
    bu: 'Infra - Roads',
    contact: '',
    email: '',
    phone: '',
    type: 'Contractor'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newCode = `SUP-${String(Math.floor(Math.random() * 900) + 100)}`;
    const newSupplier = {
      id: newCode,
      code: newCode,
      name: formData.name,
      category: formData.category,
      location: formData.location || 'Hyderabad',
      msme: formData.msme,
      local: formData.local,
      esgStatus: 'Pending',
      risk: 'Low',
      status: 'Active',
      spend: '₹0.0 Cr',
      contact: formData.contact || 'Site Officer',
      email: formData.email || 'vendor@meilgroup.in',
      phone: formData.phone || '+91 90000 00000',
      bu: formData.bu,
      type: formData.type,
      onboarded: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      assessmentScore: null,
      assessmentDate: null,
      nextReview: 'Annual Review Pending'
    };

    onAddSupplier(newSupplier);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="proc-glass-card"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '24px',
          borderRadius: '20px',
          background: '#FFFFFF',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Add New Supplier
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Onboard a vendor to MEIL BRSR Value Chain Registry
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Supplier Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Industrial Solutions Ltd."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                marginTop: '4px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
              >
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
                <option value="Materials">Materials</option>
                <option value="Services">Services</option>
                <option value="Logistics">Logistics</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Location / City</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>MSME / Small Producer</label>
              <select
                value={formData.msme}
                onChange={(e) => setFormData({ ...formData, msme: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Local Sourcing (&lt;100km)</label>
              <select
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Business Unit</label>
              <select
                value={formData.bu}
                onChange={(e) => setFormData({ ...formData, bu: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
              >
                <option value="Infra - Roads">Infra - Roads</option>
                <option value="Hydro & Irrigation">Hydro & Irrigation</option>
                <option value="Clean Mobility">Clean Mobility</option>
                <option value="Power & Transmission">Power & Transmission</option>
                <option value="City Gas Distribution">City Gas Distribution</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Ramesh V."
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="proc-btn proc-btn-outline"
              onClick={onClose}
              style={{ fontSize: '12.5px', padding: '7px 16px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="proc-btn proc-btn-blue"
              style={{ fontSize: '12.5px', padding: '7px 18px' }}
            >
              Save Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
