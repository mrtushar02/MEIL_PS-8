import React, { useState } from 'react';
import {
  X
} from 'lucide-react';

export default function LogProcurementModal({ isOpen, onClose, onLogProcurement, suppliers = [] }) {
  const [formData, setFormData] = useState({
    supplier: suppliers[0]?.name || 'ABC Construction Ltd.',
    category: 'Civil',
    project: 'Road Project (Zojila)',
    amount: '₹5.5 Cr',
    local: 'Yes',
    msme: 'Yes',
    source: 'ERP'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTxId = `PR-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    const newTx = {
      id: newTxId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      ...formData,
      status: 'Completed'
    };
    onLogProcurement(newTx);
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
          maxWidth: '520px',
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
              Log Procurement Transaction
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Record purchase order spend against authorized BRSR supplier
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Supplier *</label>
            <select
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
              ))}
            </select>
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
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Amount (₹)</label>
              <input
                type="text"
                required
                placeholder="e.g. ₹5.5 Cr"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Project</label>
              <input
                type="text"
                placeholder="e.g. Road Project (Zojila)"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
              >
                <option value="ERP">ERP (SAP / Oracle)</option>
                <option value="Manual">Manual Entry</option>
                <option value="Import">Import Batch</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="proc-btn proc-btn-outline" onClick={onClose} style={{ fontSize: '12.5px', padding: '7px 16px' }}>
              Cancel
            </button>
            <button type="submit" className="proc-btn proc-btn-blue" style={{ fontSize: '12.5px', padding: '7px 18px' }}>
              Record Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
