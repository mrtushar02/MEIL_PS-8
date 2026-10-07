import React, { useState } from 'react';
import {
  X,
  IndianRupee,
  PlusCircle,
  Download,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  Calendar,
  Save,
  Layers
} from 'lucide-react';

export default function SiteCapexModal({
  isOpen,
  onClose,
  onAddCapex,
  reportingPeriod = 'FY 2026-27',
  project = { id: 'site-102', name: 'Zojila Tunnel Project (PKG-2)' }
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Solar & Decarbonization',
    budgetInrLakhs: 45.0,
    spentInrLakhs: 38.5,
    vendor: 'BHEL / Tata Power Solar',
    co2AbatementTonnes: 120,
    period: reportingPeriod,
    remarks: 'Installation of high-efficiency rooftop solar arrays at site camp.'
  });
  const [successNotice, setSuccessNotice] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (onAddCapex) {
      onAddCapex({
        ...formData,
        id: `cpx-${Date.now()}`
      });
    }

    setSuccessNotice(`Successfully recorded ESG Capex investment of ₹${formData.spentInrLakhs} Lakhs for ${formData.title}`);
    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 1800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '580px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%)',
        backdropFilter: 'blur(30px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(186, 230, 253, 0.5)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          background: 'linear-gradient(90deg, rgba(240, 249, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <IndianRupee size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Record Site ESG Capex Expenditure
              </h3>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                {project.name || 'Zojila Tunnel PKG-2'} • Green Investment Portfolio
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Success Notice */}
        {successNotice && (
          <div style={{
            margin: '16px 24px 0',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(240, 253, 244, 0.95)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: '#166534',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} color="#16A34A" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Investment Title / Green Asset
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ultrafiltration Membrane for STP Recycled Water"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Capex Pillar
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
              >
                <option value="Solar & Decarbonization">Solar & Decarbonization</option>
                <option value="Water & ZLD Recycling">Water & ZLD Recycling</option>
                <option value="Zero-Harm Safety HSE">Zero-Harm Safety HSE</option>
                <option value="Waste Circularity / Ash">Waste Circularity / Ash</option>
                <option value="Energy Efficiency Retrofit">Energy Efficiency Retrofit</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Reporting Financial Period
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Budget Allocated (₹ Lakhs)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.budgetInrLakhs}
                onChange={(e) => setFormData({ ...formData, budgetInrLakhs: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Actual Spend Executed (₹ Lakhs)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.spentInrLakhs}
                onChange={(e) => setFormData({ ...formData, spentInrLakhs: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#16A34A' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Equipment Supplier / Contractor
              </label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Estimated Annual CO₂ Abatement (t)
              </label>
              <input
                type="number"
                value={formData.co2AbatementTonnes}
                onChange={(e) => setFormData({ ...formData, co2AbatementTonnes: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 18px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 22px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <Save size={14} />
              <span>Record Capex Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
