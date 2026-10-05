import React, { useState } from 'react';
import {
  X,
  Calendar
} from 'lucide-react';

export default function StartAssessmentModal({ isOpen, onClose, onStartAssessment, suppliers = [] }) {
  const [formData, setFormData] = useState({
    supplier: suppliers[0]?.name || 'ABC Construction Ltd.',
    type: 'General ESG',
    dueDays: '30'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAssId = `SA-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    const today = new Date();
    const reviewDate = new Date(today);
    reviewDate.setFullYear(today.getFullYear() + 1);

    const newAssessment = {
      id: newAssId,
      supplier: formData.supplier,
      type: formData.type,
      date: today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      score: null,
      risk: 'Medium',
      status: 'In Progress',
      nextReview: reviewDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    onStartAssessment(newAssessment);
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
          maxWidth: '500px',
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
              Initiate Supplier ESG Assessment
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Dispatch BRSR Principle 8 value chain questionnaire
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Target Supplier *</label>
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

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Assessment Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
            >
              <option value="General ESG">General ESG (BRSR Core - 9 Principles)</option>
              <option value="Environmental">Environmental Focus (Emissions, Waste, Energy)</option>
              <option value="Social">Social Focus (Labor standards, Wages, Human Rights)</option>
              <option value="H&S">Health & Safety (ISO 45001 / DGMS Standards)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Turnaround Window</label>
            <select
              value={formData.dueDays}
              onChange={(e) => setFormData({ ...formData, dueDays: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
            >
              <option value="15">15 Calendar Days</option>
              <option value="30">30 Calendar Days (Standard)</option>
              <option value="45">45 Calendar Days</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="proc-btn proc-btn-outline" onClick={onClose} style={{ fontSize: '12.5px', padding: '7px 16px' }}>
              Cancel
            </button>
            <button type="submit" className="proc-btn proc-btn-blue" style={{ fontSize: '12.5px', padding: '7px 18px' }}>
              Dispatch Questionnaire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
